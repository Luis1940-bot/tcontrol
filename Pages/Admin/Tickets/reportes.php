<?php
// ==========================================
// REPORTES.PHP - TEMA HACKER CONSISTENTE
// ==========================================

// Función para limpiar buffers de salida de manera segura
function limpiar_buffers()
{
  while (ob_get_level()) {
    ob_end_clean();
  }
}

// Limpiar cualquier salida previa
limpiar_buffers();

// Configuración de errores
error_reporting(0);
ini_set('display_errors', '0');

// Headers HTTP
header('Content-Type: text/html; charset=UTF-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

// BASE_URL
$protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? 'https' : 'http';
$server_host = $_SERVER['HTTP_HOST'] ?? 'localhost';
$baseUrl = "$protocol://$server_host/test-tenkiweb/tcontrol";

// Parámetros para reportes
$tipo_reporte = $_GET['tipo'] ?? 'resumen';
$fecha_desde = $_GET['fecha_desde'] ?? date('Y-m-01');
$fecha_hasta = $_GET['fecha_hasta'] ?? date('Y-m-d');
$formato = $_GET['formato'] ?? 'web';

// Variables iniciales
$datos_reporte = [];
$datos_reales_obtenidos = false;

// Obtener datos para reportes
try {
  $config_path = dirname(dirname(dirname(__DIR__))) . '/Routes/datos_base.php';

  if (file_exists($config_path)) {
    include $config_path;

    if (isset($host, $user, $password, $dbname, $port)) {
      $dsn = "mysql:host={$host};dbname={$dbname};port={$port};charset=utf8mb4";
      $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
      ];

      $pdo = new PDO($dsn, $user, $password, $options);

      // Verificar si hay datos
      $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM soporte_tickets");
      $stmt->execute();
      $total_tickets = $stmt->fetch()['total'];

      if ($total_tickets > 0) {
        $datos_reales_obtenidos = true;

        // Diferentes tipos de reportes
        switch ($tipo_reporte) {
          case 'resumen':
            // Reporte de resumen general
            $stmt = $pdo->prepare("
                            SELECT 
                                DATE(fecha_creacion) as fecha,
                                COUNT(*) as total_tickets,
                                COUNT(CASE WHEN estado = 'resuelto' OR estado = 'cerrado' THEN 1 END) as resueltos,
                                COUNT(CASE WHEN prioridad = 'critica' THEN 1 END) as criticos,
                                COUNT(CASE WHEN prioridad = 'alta' THEN 1 END) as alta_prioridad
                            FROM soporte_tickets 
                            WHERE DATE(fecha_creacion) BETWEEN ? AND ?
                            GROUP BY DATE(fecha_creacion)
                            ORDER BY fecha DESC
                        ");
            $stmt->execute([$fecha_desde, $fecha_hasta]);
            $datos_reporte = $stmt->fetchAll(PDO::FETCH_ASSOC);
            break;

          case 'empresas':
            // Reporte por empresas
            $stmt = $pdo->prepare("
                            SELECT 
                                empresa,
                                COUNT(*) as total_tickets,
                                COUNT(CASE WHEN estado = 'resuelto' OR estado = 'cerrado' THEN 1 END) as resueltos,
                                COUNT(CASE WHEN prioridad IN ('critica', 'alta') THEN 1 END) as urgentes,
                                AVG(CASE 
                                    WHEN fecha_resolucion IS NOT NULL 
                                    THEN TIMESTAMPDIFF(HOUR, fecha_creacion, fecha_resolucion)
                                    ELSE NULL
                                END) as tiempo_promedio
                            FROM soporte_tickets 
                            WHERE DATE(fecha_creacion) BETWEEN ? AND ?
                              AND empresa IS NOT NULL AND empresa != ''
                            GROUP BY empresa
                            ORDER BY total_tickets DESC
                        ");
            $stmt->execute([$fecha_desde, $fecha_hasta]);
            $datos_reporte = $stmt->fetchAll(PDO::FETCH_ASSOC);
            break;

          case 'performance':
            // Reporte de rendimiento
            $stmt = $pdo->prepare("
                            SELECT 
                                YEAR(fecha_creacion) as año,
                                MONTH(fecha_creacion) as mes,
                                COUNT(*) as total_tickets,
                                COUNT(CASE WHEN estado = 'resuelto' OR estado = 'cerrado' THEN 1 END) as resueltos,
                                ROUND(COUNT(CASE WHEN estado = 'resuelto' OR estado = 'cerrado' THEN 1 END) * 100.0 / COUNT(*), 1) as tasa_resolucion,
                                AVG(CASE 
                                    WHEN fecha_resolucion IS NOT NULL 
                                    THEN TIMESTAMPDIFF(HOUR, fecha_creacion, fecha_resolucion)
                                    ELSE NULL
                                END) as tiempo_promedio
                            FROM soporte_tickets 
                            WHERE DATE(fecha_creacion) BETWEEN ? AND ?
                            GROUP BY YEAR(fecha_creacion), MONTH(fecha_creacion)
                            ORDER BY año DESC, mes DESC
                        ");
            $stmt->execute([$fecha_desde, $fecha_hasta]);
            $datos_reporte = $stmt->fetchAll(PDO::FETCH_ASSOC);
            break;

          case 'detallado':
            // Reporte detallado
            $stmt = $pdo->prepare("
                            SELECT 
                                ticket_id,
                                asunto,
                                estado,
                                prioridad,
                                empresa,
                                nombre_contacto,
                                email_contacto,
                                fecha_creacion,
                                fecha_resolucion,
                                CASE 
                                    WHEN fecha_resolucion IS NOT NULL 
                                    THEN TIMESTAMPDIFF(HOUR, fecha_creacion, fecha_resolucion)
                                    ELSE TIMESTAMPDIFF(HOUR, fecha_creacion, NOW())
                                END as horas_transcurridas
                            FROM soporte_tickets 
                            WHERE DATE(fecha_creacion) BETWEEN ? AND ?
                            ORDER BY fecha_creacion DESC
                            LIMIT 100
                        ");
            $stmt->execute([$fecha_desde, $fecha_hasta]);
            $datos_reporte = $stmt->fetchAll(PDO::FETCH_ASSOC);
            break;
        }
      }
    }
  }
} catch (Exception $e) {
  // Si falla la BD, usar datos de ejemplo
  $datos_reporte = [
    [
      'fecha' => '2025-07-03',
      'total_tickets' => 5,
      'resueltos' => 3,
      'criticos' => 1,
      'alta_prioridad' => 2
    ],
    [
      'fecha' => '2025-07-02',
      'total_tickets' => 8,
      'resueltos' => 6,
      'criticos' => 0,
      'alta_prioridad' => 3
    ]
  ];
}

// Funciones auxiliares
function formatear_fecha($fecha)
{
  return date('d/m/Y', strtotime($fecha));
}

function formatear_mes($año, $mes)
{
  $meses = [
    1 => 'Enero',
    2 => 'Febrero',
    3 => 'Marzo',
    4 => 'Abril',
    5 => 'Mayo',
    6 => 'Junio',
    7 => 'Julio',
    8 => 'Agosto',
    9 => 'Septiembre',
    10 => 'Octubre',
    11 => 'Noviembre',
    12 => 'Diciembre'
  ];
  return $meses[$mes] . ' ' . $año;
}

function calcular_porcentaje($parte, $total)
{
  return $total > 0 ? round(($parte / $total) * 100, 1) : 0;
}

// Si se solicita exportar, generar CSV
if ($formato === 'csv' && !empty($datos_reporte)) {
  header('Content-Type: text/csv; charset=UTF-8');
  header('Content-Disposition: attachment; filename="reporte_tickets_' . $tipo_reporte . '_' . date('Y-m-d') . '.csv"');

  $output = fopen('php://output', 'w');

  // BOM para Excel
  fprintf($output, chr(0xEF) . chr(0xBB) . chr(0xBF));

  // Headers del CSV según el tipo de reporte
  switch ($tipo_reporte) {
    case 'resumen':
      fputcsv($output, ['Fecha', 'Total Tickets', 'Resueltos', 'Críticos', 'Alta Prioridad']);
      foreach ($datos_reporte as $fila) {
        fputcsv($output, [
          formatear_fecha($fila['fecha']),
          $fila['total_tickets'],
          $fila['resueltos'],
          $fila['criticos'],
          $fila['alta_prioridad']
        ]);
      }
      break;
    case 'empresas':
      fputcsv($output, ['Empresa', 'Total Tickets', 'Resueltos', 'Urgentes', 'Tiempo Promedio (h)']);
      foreach ($datos_reporte as $fila) {
        fputcsv($output, [
          $fila['empresa'],
          $fila['total_tickets'],
          $fila['resueltos'],
          $fila['urgentes'],
          round($fila['tiempo_promedio'] ?? 0, 1)
        ]);
      }
      break;
      // Más casos según necesidad...
  }

  fclose($output);
  exit;
}

?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>📊 Reportes de Tickets - Panel Admin</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎯</text></svg>">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Courier New', monospace;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
      color: #00ff41;
      min-height: 100vh;
      overflow-x: hidden;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
      padding: 20px;
      background: rgba(0, 255, 65, 0.1);
      border: 1px solid #00ff41;
      border-radius: 10px;
      box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
    }

    .header h1 {
      font-size: 2.5em;
      text-shadow: 0 0 10px #00ff41;
      margin-bottom: 10px;
    }

    .nav-buttons {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin: 20px 0;
      flex-wrap: wrap;
    }

    .nav-btn {
      padding: 12px 20px;
      background: linear-gradient(45deg, #004d1a, #006622);
      color: #00ff41;
      text-decoration: none;
      border: 1px solid #00ff41;
      border-radius: 5px;
      transition: all 0.3s ease;
      font-weight: bold;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .nav-btn:hover {
      background: linear-gradient(45deg, #006622, #008844);
      box-shadow: 0 0 15px rgba(0, 255, 65, 0.5);
      transform: translateY(-2px);
    }

    .filters-section {
      background: rgba(0, 50, 20, 0.8);
      border: 1px solid #00ff41;
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 30px;
    }

    .filters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      align-items: end;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .filter-group label {
      color: #00ff41;
      font-weight: bold;
      font-size: 0.9em;
    }

    .filter-group select,
    .filter-group input {
      padding: 10px;
      background: #0a0a0a;
      border: 1px solid #00ff41;
      border-radius: 5px;
      color: #00ff41;
      font-family: 'Courier New', monospace;
    }

    .filter-btn {
      padding: 10px 20px;
      background: linear-gradient(45deg, #004d1a, #006622);
      color: #00ff41;
      border: 1px solid #00ff41;
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.3s ease;
    }

    .filter-btn:hover {
      background: linear-gradient(45deg, #006622, #008844);
      box-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
    }

    .report-section {
      background: rgba(0, 50, 20, 0.6);
      border: 1px solid #00ff41;
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 30px;
    }

    .report-section h2 {
      color: #00ff41;
      margin-bottom: 20px;
      text-shadow: 0 0 5px #00ff41;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .report-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }

    .report-table th,
    .report-table td {
      padding: 12px;
      text-align: left;
      border: 1px solid #00ff41;
    }

    .report-table th {
      background: rgba(0, 255, 65, 0.2);
      color: #00ff41;
      font-weight: bold;
      text-shadow: 0 0 5px #00ff41;
    }

    .report-table tr:nth-child(even) {
      background: rgba(0, 255, 65, 0.05);
    }

    .report-table tr:hover {
      background: rgba(0, 255, 65, 0.1);
    }

    .export-buttons {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }

    .export-btn {
      padding: 10px 15px;
      background: linear-gradient(45deg, #1a4d00, #226600);
      color: #00ff41;
      text-decoration: none;
      border: 1px solid #00ff41;
      border-radius: 5px;
      font-weight: bold;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .export-btn:hover {
      background: linear-gradient(45deg, #226600, #33aa00);
      box-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
    }

    .stats-card {
      background: rgba(0, 50, 20, 0.6);
      border: 1px solid #00ff41;
      border-radius: 10px;
      padding: 15px;
      text-align: center;
    }

    .stats-value {
      font-size: 2em;
      font-weight: bold;
      color: #00ff41;
      text-shadow: 0 0 10px #00ff41;
    }

    .stats-label {
      margin-top: 5px;
      color: #cccccc;
      font-size: 0.9em;
    }

    .no-data {
      text-align: center;
      padding: 40px;
      color: #666;
      font-style: italic;
    }

    .data-source {
      margin-top: 20px;
      padding: 10px;
      background: rgba(0, 255, 65, 0.1);
      border-left: 4px solid #00ff41;
      font-size: 0.9em;
    }

    @media (max-width: 768px) {
      .container {
        padding: 10px;
      }

      .header h1 {
        font-size: 1.8em;
      }

      .nav-buttons {
        flex-direction: column;
        align-items: center;
      }

      .filters-grid {
        grid-template-columns: 1fr;
      }

      .report-table {
        font-size: 0.9em;
      }

      .export-buttons {
        flex-direction: column;
      }
    }
  </style>
</head>

<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>📊 Sistema de Reportes de Tickets</h1>
      <p>Panel administrativo para análisis y exportación de datos</p>
    </div>

    <!-- Navegación -->
    <div class="nav-buttons">
      <a href="index.php" class="nav-btn">🏠 Dashboard</a>
      <a href="lista.php" class="nav-btn">📋 Lista de Tickets</a>
      <a href="estadisticas.php" class="nav-btn">📈 Estadísticas</a>
      <a href="reportes.php" class="nav-btn" style="background: linear-gradient(45deg, #008844, #00aa55);">📊 Reportes</a>
    </div>

    <!-- Filtros -->
    <div class="filters-section">
      <h2>🔍 Filtros de Reporte</h2>
      <form method="GET" class="filters-grid">
        <div class="filter-group">
          <label for="tipo">Tipo de Reporte:</label>
          <select name="tipo" id="tipo">
            <option value="resumen" <?= $tipo_reporte === 'resumen' ? 'selected' : '' ?>>Resumen Diario</option>
            <option value="empresas" <?= $tipo_reporte === 'empresas' ? 'selected' : '' ?>>Por Empresas</option>
            <option value="performance" <?= $tipo_reporte === 'performance' ? 'selected' : '' ?>>Rendimiento Mensual</option>
            <option value="detallado" <?= $tipo_reporte === 'detallado' ? 'selected' : '' ?>>Detallado</option>
          </select>
        </div>
        <div class="filter-group">
          <label for="fecha_desde">Fecha Desde:</label>
          <input type="date" name="fecha_desde" id="fecha_desde" value="<?= htmlspecialchars($fecha_desde) ?>">
        </div>
        <div class="filter-group">
          <label for="fecha_hasta">Fecha Hasta:</label>
          <input type="date" name="fecha_hasta" id="fecha_hasta" value="<?= htmlspecialchars($fecha_hasta) ?>">
        </div>
        <div class="filter-group">
          <button type="submit" class="filter-btn">🔄 Actualizar Reporte</button>
        </div>
      </form>
    </div>

    <!-- Contenido del Reporte -->
    <div class="report-section">
      <h2>📋 Reporte: <?= ucfirst(str_replace('_', ' ', $tipo_reporte)) ?></h2>

      <?php if (!empty($datos_reporte)): ?>
        <!-- Botones de Exportación -->
        <div class="export-buttons">
          <a href="?<?= http_build_query(array_merge($_GET, ['formato' => 'csv'])) ?>" class="export-btn">
            📄 Exportar CSV
          </a>
          <a href="?<?= http_build_query($_GET) ?>" class="export-btn">
            🔄 Ver en Web
          </a>
        </div>

        <!-- Tabla del Reporte -->
        <table class="report-table">
          <thead>
            <tr>
              <?php if ($tipo_reporte === 'resumen'): ?>
                <th>Fecha</th>
                <th>Total Tickets</th>
                <th>Resueltos</th>
                <th>Críticos</th>
                <th>Alta Prioridad</th>
                <th>% Resolución</th>
              <?php elseif ($tipo_reporte === 'empresas'): ?>
                <th>Empresa</th>
                <th>Total Tickets</th>
                <th>Resueltos</th>
                <th>Urgentes</th>
                <th>Tiempo Promedio (h)</th>
                <th>% Resolución</th>
              <?php elseif ($tipo_reporte === 'performance'): ?>
                <th>Período</th>
                <th>Total Tickets</th>
                <th>Resueltos</th>
                <th>% Resolución</th>
                <th>Tiempo Promedio (h)</th>
              <?php elseif ($tipo_reporte === 'detallado'): ?>
                <th>ID</th>
                <th>Asunto</th>
                <th>Estado</th>
                <th>Prioridad</th>
                <th>Empresa</th>
                <th>Contacto</th>
                <th>Creación</th>
                <th>Horas</th>
              <?php endif; ?>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($datos_reporte as $fila): ?>
              <tr>
                <?php if ($tipo_reporte === 'resumen'): ?>
                  <td><?= formatear_fecha($fila['fecha']) ?></td>
                  <td><?= number_format($fila['total_tickets']) ?></td>
                  <td><?= number_format($fila['resueltos']) ?></td>
                  <td><?= number_format($fila['criticos']) ?></td>
                  <td><?= number_format($fila['alta_prioridad']) ?></td>
                  <td><?= calcular_porcentaje($fila['resueltos'], $fila['total_tickets']) ?>%</td>
                <?php elseif ($tipo_reporte === 'empresas'): ?>
                  <td><?= htmlspecialchars($fila['empresa']) ?></td>
                  <td><?= number_format($fila['total_tickets']) ?></td>
                  <td><?= number_format($fila['resueltos']) ?></td>
                  <td><?= number_format($fila['urgentes']) ?></td>
                  <td><?= round($fila['tiempo_promedio'] ?? 0, 1) ?></td>
                  <td><?= calcular_porcentaje($fila['resueltos'], $fila['total_tickets']) ?>%</td>
                <?php elseif ($tipo_reporte === 'performance'): ?>
                  <td><?= formatear_mes($fila['año'], $fila['mes']) ?></td>
                  <td><?= number_format($fila['total_tickets']) ?></td>
                  <td><?= number_format($fila['resueltos']) ?></td>
                  <td><?= $fila['tasa_resolucion'] ?>%</td>
                  <td><?= round($fila['tiempo_promedio'] ?? 0, 1) ?></td>
                <?php elseif ($tipo_reporte === 'detallado'): ?>
                  <td>#<?= $fila['ticket_id'] ?></td>
                  <td><?= htmlspecialchars(substr($fila['asunto'], 0, 30)) ?>...</td>
                  <td><?= htmlspecialchars($fila['estado']) ?></td>
                  <td><?= htmlspecialchars($fila['prioridad']) ?></td>
                  <td><?= htmlspecialchars($fila['empresa']) ?></td>
                  <td><?= htmlspecialchars($fila['nombre_contacto']) ?></td>
                  <td><?= formatear_fecha($fila['fecha_creacion']) ?></td>
                  <td><?= round($fila['horas_transcurridas'] ?? 0, 1) ?></td>
                <?php endif; ?>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>

        <!-- Información de Datos -->
        <div class="data-source">
          <?php if ($datos_reales_obtenidos): ?>
            ✅ <strong>Datos Reales:</strong> Mostrando <?= count($datos_reporte) ?> registros de la base de datos.
            Período: <?= formatear_fecha($fecha_desde) ?> - <?= formatear_fecha($fecha_hasta) ?>
          <?php else: ?>
            ⚠️ <strong>Datos de Ejemplo:</strong> No se pudieron obtener datos reales de la base de datos.
          <?php endif; ?>
        </div>

      <?php else: ?>
        <div class="no-data">
          <h3>📭 No hay datos disponibles</h3>
          <p>No se encontraron tickets para el período y filtros seleccionados.</p>
          <p>Intenta ajustar los filtros o verificar la conexión a la base de datos.</p>
        </div>
      <?php endif; ?>
    </div>

    <!-- Footer -->
    <div class="nav-buttons">
      <a href="index.php" class="nav-btn">🏠 Volver al Dashboard</a>
      <a href="lista.php" class="nav-btn">📋 Ver Lista de Tickets</a>
      <a href="estadisticas.php" class="nav-btn">📈 Ver Estadísticas</a>
    </div>
  </div>

  <script>
    // Auto-submit del formulario cuando cambian los filtros
    document.getElementById('tipo').addEventListener('change', function() {
      this.form.submit();
    });

    // Validación de fechas
    document.getElementById('fecha_desde').addEventListener('change', function() {
      const fechaDesde = new Date(this.value);
      const fechaHasta = new Date(document.getElementById('fecha_hasta').value);

      if (fechaDesde > fechaHasta) {
        document.getElementById('fecha_hasta').value = this.value;
      }
    });

    // Efectos visuales
    document.querySelectorAll('.report-table tr').forEach(row => {
      row.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 0 10px rgba(0, 255, 65, 0.5)';
      });

      row.addEventListener('mouseleave', function() {
        this.style.boxShadow = 'none';
      });
    });

    console.log('📊 Sistema de Reportes de Tickets cargado correctamente');
  </script>
</body>

</html>