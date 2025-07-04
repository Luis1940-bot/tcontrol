<?php
// ==========================================
// SOLUCIÓN ANTI-QUIRKS: LIMPIEZA TOTAL
// ==========================================
// Limpiar ABSOLUTAMENTE todo antes del DOCTYPE
while (ob_get_level()) {
  ob_end_clean();
}

// Asegurar que no hay salida previa
ob_start();

// Configuración de headers seguros
header_remove();
header('Content-Type: text/html; charset=UTF-8');
header('Cache-Control: no-cache, no-store, must-revalidate');

require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
require_once dirname(dirname(dirname(__DIR__))) . '/ErrorLogger.php';
ErrorLogger::initialize(dirname(dirname(dirname(__DIR__))) . '/logs/error.log');

// Configurar headers de seguridad y sesión
$nonce = setSecurityHeaders();
startSecureSession();

// Verificar si es superadmin
// if (!isset($_SESSION['is_superadmin']) || !$_SESSION['is_superadmin']) {
//     header('Location: ' . BASE_URL . '/login');
//     exit;
// }

$baseUrl = BASE_URL;

// Procesar exportación si se solicita
if (isset($_GET['export']) && isset($_GET['type'])) {
  handleExport($_GET['type'], $_GET);
  exit;
}

// Obtener estadísticas para los reportes
try {
  // Estadísticas generales del sistema
  $stmt_general = $pdo->prepare("
        SELECT 
            COUNT(*) as total_tickets,
            COUNT(CASE WHEN estado = 'nuevo' THEN 1 END) as nuevos,
            COUNT(CASE WHEN estado = 'abierto' THEN 1 END) as abiertos,
            COUNT(CASE WHEN estado = 'en_proceso' THEN 1 END) as en_proceso,
            COUNT(CASE WHEN estado = 'resuelto' THEN 1 END) as resueltos,
            COUNT(CASE WHEN estado = 'cerrado' THEN 1 END) as cerrados,
            AVG(TIMESTAMPDIFF(HOUR, fecha_creacion, fecha_actualizacion)) as tiempo_promedio_resolucion,
            COUNT(CASE WHEN prioridad = 'critica' THEN 1 END) as criticos,
            COUNT(CASE WHEN fecha_creacion >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as ultimo_mes,
            COUNT(CASE WHEN fecha_creacion >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as ultima_semana
        FROM soporte_tickets
    ");
  $stmt_general->execute();
  $stats_general = $stmt_general->fetch(PDO::FETCH_ASSOC);

  // Tickets por empresa/cliente
  $stmt_empresas = $pdo->prepare("
        SELECT 
            empresa,
            COUNT(*) as total_tickets,
            COUNT(CASE WHEN estado IN ('nuevo', 'abierto', 'en_proceso') THEN 1 END) as activos,
            COUNT(CASE WHEN estado IN ('resuelto', 'cerrado') THEN 1 END) as resueltos,
            AVG(TIMESTAMPDIFF(HOUR, fecha_creacion, fecha_actualizacion)) as tiempo_promedio
        FROM soporte_tickets 
        WHERE empresa IS NOT NULL AND empresa != ''
        GROUP BY empresa 
        ORDER BY total_tickets DESC 
        LIMIT 10
    ");
  $stmt_empresas->execute();
  $stats_empresas = $stmt_empresas->fetchAll(PDO::FETCH_ASSOC);

  // Rendimiento mensual
  $stmt_mensual = $pdo->prepare("
        SELECT 
            DATE_FORMAT(fecha_creacion, '%Y-%m') as mes,
            COUNT(*) as tickets_creados,
            COUNT(CASE WHEN estado IN ('resuelto', 'cerrado') THEN 1 END) as tickets_resueltos,
            AVG(TIMESTAMPDIFF(HOUR, fecha_creacion, fecha_actualizacion)) as tiempo_promedio
        FROM soporte_tickets 
        WHERE fecha_creacion >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
        GROUP BY DATE_FORMAT(fecha_creacion, '%Y-%m')
        ORDER BY mes DESC
    ");
  $stmt_mensual->execute();
  $stats_mensual = $stmt_mensual->fetchAll(PDO::FETCH_ASSOC);

  // Tipos de solicitud más comunes
  $stmt_tipos = $pdo->prepare("
        SELECT 
            tipo_solicitud,
            COUNT(*) as total,
            COUNT(CASE WHEN estado IN ('resuelto', 'cerrado') THEN 1 END) as resueltos,
            ROUND((COUNT(CASE WHEN estado IN ('resuelto', 'cerrado') THEN 1 END) / COUNT(*)) * 100, 2) as porcentaje_resolucion
        FROM soporte_tickets 
        WHERE tipo_solicitud IS NOT NULL AND tipo_solicitud != ''
        GROUP BY tipo_solicitud 
        ORDER BY total DESC
    ");
  $stmt_tipos->execute();
  $stats_tipos = $stmt_tipos->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $e) {
  ErrorLogger::log("❌ Error al obtener estadísticas de reportes: " . $e->getMessage());
  $stats_general = [];
  $stats_empresas = [];
  $stats_mensual = [];
  $stats_tipos = [];
}

function handleExport($type, $params)
{
  global $pdo;

  $filename = 'reporte_' . $type . '_' . date('Y-m-d_H-i-s');

  try {
    switch ($type) {
      case 'tickets_general':
        exportTicketsGeneral($pdo, $filename, $params);
        break;
      case 'tickets_detallado':
        exportTicketsDetallado($pdo, $filename, $params);
        break;
      case 'empresas':
        exportEmpresas($pdo, $filename);
        break;
      case 'rendimiento':
        exportRendimiento($pdo, $filename, $params);
        break;
      default:
        throw new Exception("Tipo de exportación no válido");
    }
  } catch (Exception $e) {
    ErrorLogger::log("❌ Error en exportación: " . $e->getMessage());
    header('HTTP/1.1 500 Internal Server Error');
    echo "Error al generar el reporte: " . $e->getMessage();
  }
}

function exportTicketsGeneral($pdo, $filename, $params)
{
  $whereClause = "WHERE 1=1";
  $bindParams = [];

  if (!empty($params['fecha_inicio'])) {
    $whereClause .= " AND fecha_creacion >= :fecha_inicio";
    $bindParams['fecha_inicio'] = $params['fecha_inicio'];
  }

  if (!empty($params['fecha_fin'])) {
    $whereClause .= " AND fecha_creacion <= :fecha_fin";
    $bindParams['fecha_fin'] = $params['fecha_fin'] . ' 23:59:59';
  }

  if (!empty($params['estado'])) {
    $whereClause .= " AND estado = :estado";
    $bindParams['estado'] = $params['estado'];
  }

  $stmt = $pdo->prepare("
        SELECT 
            ticket_id,
            empresa,
            nombre_contacto,
            email_contacto,
            asunto,
            estado,
            prioridad,
            tipo_solicitud,
            fecha_creacion,
            fecha_actualizacion,
            TIMESTAMPDIFF(HOUR, fecha_creacion, fecha_actualizacion) as horas_resolucion
        FROM soporte_tickets 
        $whereClause
        ORDER BY fecha_creacion DESC
    ");

  $stmt->execute($bindParams);
  $tickets = $stmt->fetchAll(PDO::FETCH_ASSOC);

  outputCSV($tickets, $filename . '.csv');
}

function exportTicketsDetallado($pdo, $filename, $params)
{
  // Similar a exportTicketsGeneral pero con más detalles
  $whereClause = "WHERE 1=1";
  $bindParams = [];

  if (!empty($params['fecha_inicio'])) {
    $whereClause .= " AND fecha_creacion >= :fecha_inicio";
    $bindParams['fecha_inicio'] = $params['fecha_inicio'];
  }

  if (!empty($params['fecha_fin'])) {
    $whereClause .= " AND fecha_creacion <= :fecha_fin";
    $bindParams['fecha_fin'] = $params['fecha_fin'] . ' 23:59:59';
  }

  $stmt = $pdo->prepare("
        SELECT 
            ticket_id,
            empresa,
            nombre_contacto,
            email_contacto,
            telefono_contacto,
            asunto,
            descripcion,
            estado,
            prioridad,
            tipo_solicitud,
            fecha_creacion,
            fecha_actualizacion,
            ip_cliente,
            user_agent,
            es_publico,
            TIMESTAMPDIFF(HOUR, fecha_creacion, fecha_actualizacion) as horas_resolucion
        FROM soporte_tickets 
        $whereClause
        ORDER BY fecha_creacion DESC
    ");

  $stmt->execute($bindParams);
  $tickets = $stmt->fetchAll(PDO::FETCH_ASSOC);

  outputCSV($tickets, $filename . '.csv');
}

function exportEmpresas($pdo, $filename)
{
  $stmt = $pdo->prepare("
        SELECT 
            empresa,
            COUNT(*) as total_tickets,
            COUNT(CASE WHEN estado = 'nuevo' THEN 1 END) as nuevos,
            COUNT(CASE WHEN estado = 'abierto' THEN 1 END) as abiertos,
            COUNT(CASE WHEN estado = 'en_proceso' THEN 1 END) as en_proceso,
            COUNT(CASE WHEN estado = 'resuelto' THEN 1 END) as resueltos,
            COUNT(CASE WHEN estado = 'cerrado' THEN 1 END) as cerrados,
            COUNT(CASE WHEN prioridad = 'critica' THEN 1 END) as criticos,
            AVG(TIMESTAMPDIFF(HOUR, fecha_creacion, fecha_actualizacion)) as tiempo_promedio_horas,
            MIN(fecha_creacion) as primer_ticket,
            MAX(fecha_creacion) as ultimo_ticket
        FROM soporte_tickets 
        WHERE empresa IS NOT NULL AND empresa != ''
        GROUP BY empresa 
        ORDER BY total_tickets DESC
    ");

  $stmt->execute();
  $empresas = $stmt->fetchAll(PDO::FETCH_ASSOC);

  outputCSV($empresas, $filename . '.csv');
}

function exportRendimiento($pdo, $filename, $params)
{
  $months = isset($params['meses']) ? (int)$params['meses'] : 12;

  $stmt = $pdo->prepare("
        SELECT 
            DATE_FORMAT(fecha_creacion, '%Y-%m') as mes,
            COUNT(*) as tickets_creados,
            COUNT(CASE WHEN estado = 'resuelto' THEN 1 END) as resueltos,
            COUNT(CASE WHEN estado = 'cerrado' THEN 1 END) as cerrados,
            COUNT(CASE WHEN prioridad = 'critica' THEN 1 END) as criticos,
            AVG(TIMESTAMPDIFF(HOUR, fecha_creacion, fecha_actualizacion)) as tiempo_promedio_horas,
            MIN(TIMESTAMPDIFF(HOUR, fecha_creacion, fecha_actualizacion)) as tiempo_minimo_horas,
            MAX(TIMESTAMPDIFF(HOUR, fecha_creacion, fecha_actualizacion)) as tiempo_maximo_horas
        FROM soporte_tickets 
        WHERE fecha_creacion >= DATE_SUB(NOW(), INTERVAL :months MONTH)
        GROUP BY DATE_FORMAT(fecha_creacion, '%Y-%m')
        ORDER BY mes DESC
    ");

  $stmt->execute(['months' => $months]);
  $rendimiento = $stmt->fetchAll(PDO::FETCH_ASSOC);

  outputCSV($rendimiento, $filename . '.csv');
}

function outputCSV($data, $filename)
{
  header('Content-Type: text/csv; charset=UTF-8');
  header('Content-Disposition: attachment; filename="' . $filename . '"');
  header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
  header('Pragma: public');

  // UTF-8 BOM para Excel
  echo "\xEF\xBB\xBF";

  $output = fopen('php://output', 'w');

  if (!empty($data)) {
    // Headers
    fputcsv($output, array_keys($data[0]));

    // Data
    foreach ($data as $row) {
      fputcsv($output, $row);
    }
  }

  fclose($output);
}

// ==========================================
// LIMPIAR TODO Y ENVIAR DOCTYPE LIMPIO
// ==========================================
ob_end_clean();
?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reportes y Exportación - Panel de Admin</title>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📊</text></svg>">
  <link rel="stylesheet" href="reportes.css">
</head>

<body>
  <div class="admin-reports">
    <div class="reports-header">
      <h1>📊 Reportes y Exportación</h1>
      <p>Genera y exporta reportes detallados del sistema de tickets</p>
    </div>

    <nav class="breadcrumb">
      <a href="index.php">Dashboard</a> > <span>Reportes</span>
    </nav>

    <!-- Resumen Ejecutivo -->
    <div class="executive-summary">
      <h2>📋 Resumen Ejecutivo</h2>
      <div class="summary-grid">
        <div class="summary-card total">
          <div class="summary-value"><?= number_format($stats_general['total_tickets'] ?? 0) ?></div>
          <div class="summary-label">Total de Tickets</div>
        </div>
        <div class="summary-card resolution-time">
          <div class="summary-value"><?= number_format($stats_general['tiempo_promedio_resolucion'] ?? 0, 1) ?>h</div>
          <div class="summary-label">Tiempo Promedio</div>
        </div>
        <div class="summary-card monthly">
          <div class="summary-value"><?= number_format($stats_general['ultimo_mes'] ?? 0) ?></div>
          <div class="summary-label">Último Mes</div>
        </div>
        <div class="summary-card critical">
          <div class="summary-value"><?= number_format($stats_general['criticos'] ?? 0) ?></div>
          <div class="summary-label">Tickets Críticos</div>
        </div>
      </div>
    </div>

    <!-- Reportes Disponibles -->
    <div class="reports-section">
      <h2>📑 Reportes Disponibles</h2>

      <div class="reports-grid">

        <!-- Reporte General de Tickets -->
        <div class="report-card">
          <div class="report-icon">🎫</div>
          <h3>Reporte General de Tickets</h3>
          <p>Listado completo de tickets con información básica</p>

          <form class="report-form" action="" method="get">
            <input type="hidden" name="export" value="1">
            <input type="hidden" name="type" value="tickets_general">

            <div class="form-row">
              <div class="form-group">
                <label>Desde:</label>
                <input type="date" name="fecha_inicio">
              </div>
              <div class="form-group">
                <label>Hasta:</label>
                <input type="date" name="fecha_fin">
              </div>
            </div>

            <div class="form-group">
              <label>Estado:</label>
              <select name="estado">
                <option value="">Todos</option>
                <option value="nuevo">Nuevo</option>
                <option value="abierto">Abierto</option>
                <option value="en_proceso">En Proceso</option>
                <option value="resuelto">Resuelto</option>
                <option value="cerrado">Cerrado</option>
              </select>
            </div>

            <button type="submit" class="btn btn-primary">📥 Exportar CSV</button>
          </form>
        </div>

        <!-- Reporte Detallado -->
        <div class="report-card">
          <div class="report-icon">📋</div>
          <h3>Reporte Detallado</h3>
          <p>Información completa de tickets incluyendo descripciones</p>

          <form class="report-form" action="" method="get">
            <input type="hidden" name="export" value="1">
            <input type="hidden" name="type" value="tickets_detallado">

            <div class="form-row">
              <div class="form-group">
                <label>Desde:</label>
                <input type="date" name="fecha_inicio">
              </div>
              <div class="form-group">
                <label>Hasta:</label>
                <input type="date" name="fecha_fin">
              </div>
            </div>

            <button type="submit" class="btn btn-primary">📥 Exportar CSV</button>
          </form>
        </div>

        <!-- Reporte por Empresas -->
        <div class="report-card">
          <div class="report-icon">🏢</div>
          <h3>Reporte por Empresas</h3>
          <p>Estadísticas agrupadas por empresa/cliente</p>

          <form class="report-form" action="" method="get">
            <input type="hidden" name="export" value="1">
            <input type="hidden" name="type" value="empresas">

            <button type="submit" class="btn btn-primary">📥 Exportar CSV</button>
          </form>
        </div>

        <!-- Reporte de Rendimiento -->
        <div class="report-card">
          <div class="report-icon">📈</div>
          <h3>Reporte de Rendimiento</h3>
          <p>Métricas de rendimiento y tiempos de resolución</p>

          <form class="report-form" action="" method="get">
            <input type="hidden" name="export" value="1">
            <input type="hidden" name="type" value="rendimiento">

            <div class="form-group">
              <label>Período (meses):</label>
              <select name="meses">
                <option value="3">Últimos 3 meses</option>
                <option value="6">Últimos 6 meses</option>
                <option value="12" selected>Último año</option>
                <option value="24">Últimos 2 años</option>
              </select>
            </div>

            <button type="submit" class="btn btn-primary">📥 Exportar CSV</button>
          </form>
        </div>

      </div>
    </div>

    <!-- Top Empresas -->
    <?php if (!empty($stats_empresas)): ?>
      <div class="top-companies">
        <h2>🏆 Top Empresas por Tickets</h2>
        <div class="companies-table-container">
          <table class="companies-table">
            <thead>
              <tr>
                <th>Empresa</th>
                <th>Total</th>
                <th>Activos</th>
                <th>Resueltos</th>
                <th>Tiempo Promedio</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($stats_empresas as $empresa): ?>
                <tr>
                  <td class="company-name"><?= htmlspecialchars($empresa['empresa']) ?></td>
                  <td><?= number_format($empresa['total_tickets']) ?></td>
                  <td><?= number_format($empresa['activos']) ?></td>
                  <td><?= number_format($empresa['resueltos']) ?></td>
                  <td><?= number_format($empresa['tiempo_promedio'] ?? 0, 1) ?>h</td>
                </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      </div>
    <?php endif; ?>

    <!-- Tipos de Solicitud -->
    <?php if (!empty($stats_tipos)): ?>
      <div class="request-types">
        <h2>📝 Tipos de Solicitud Más Comunes</h2>
        <div class="types-grid">
          <?php foreach (array_slice($stats_tipos, 0, 6) as $tipo): ?>
            <div class="type-card">
              <div class="type-total"><?= number_format($tipo['total']) ?></div>
              <div class="type-name"><?= htmlspecialchars($tipo['tipo_solicitud']) ?></div>
              <div class="type-resolution"><?= $tipo['porcentaje_resolucion'] ?>% resueltos</div>
            </div>
          <?php endforeach; ?>
        </div>
      </div>
    <?php endif; ?>

    <!-- Acciones Rápidas -->
    <div class="quick-actions">
      <h2>⚡ Acciones Rápidas</h2>
      <div class="actions-grid">
        <a href="index.php" class="action-btn dashboard">
          <span class="action-icon">🏠</span>
          <span class="action-text">Volver al Dashboard</span>
        </a>
        <a href="lista.php" class="action-btn tickets">
          <span class="action-icon">📋</span>
          <span class="action-text">Ver Todos los Tickets</span>
        </a>
        <a href="estadisticas.php" class="action-btn stats">
          <span class="action-icon">📊</span>
          <span class="action-text">Estadísticas Avanzadas</span>
        </a>
        <a href="configuracion.php" class="action-btn config">
          <span class="action-icon">⚙️</span>
          <span class="action-text">Configuración</span>
        </a>
      </div>
    </div>

  </div>

  <script src="reportes.js"></script>
</body>

</html>