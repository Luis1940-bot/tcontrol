<?php
// ==========================================
// ESTADISTICAS.PHP - TEMA HACKER CONSISTENTE
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

// Parámetros de fecha para filtros
$fecha_desde = $_GET['fecha_desde'] ?? date('Y-m-01'); // Primer día del mes actual
$fecha_hasta = $_GET['fecha_hasta'] ?? date('Y-m-d'); // Hoy

// Variables iniciales
$stats_periodo = [
  'total_tickets' => 0,
  'resueltos' => 0,
  'criticos' => 0,
  'alta_prioridad' => 0,
  'tiempo_promedio_resolucion' => 0
];
$stats_por_estado = [];
$stats_por_prioridad = [];
$stats_por_empresa = [];
$stats_por_mes = [];
$datos_reales_obtenidos = false;

// Obtener datos reales de la base de datos
try {
  // Incluir configuración de BD
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

        // Estadísticas por período
        $stmt_periodo = $pdo->prepare("
                    SELECT 
                        COUNT(*) as total_tickets,
                        COUNT(CASE WHEN estado = 'resuelto' OR estado = 'cerrado' THEN 1 END) as resueltos,
                        COUNT(CASE WHEN prioridad = 'critica' THEN 1 END) as criticos,
                        COUNT(CASE WHEN prioridad = 'alta' THEN 1 END) as alta_prioridad,
                        AVG(CASE 
                            WHEN fecha_resolucion IS NOT NULL 
                            THEN TIMESTAMPDIFF(HOUR, fecha_creacion, fecha_resolucion)
                            ELSE NULL
                        END) as tiempo_promedio_resolucion
                    FROM soporte_tickets 
                    WHERE DATE(fecha_creacion) BETWEEN ? AND ?
                ");
        $stmt_periodo->execute([$fecha_desde, $fecha_hasta]);
        $stats_periodo = $stmt_periodo->fetch(PDO::FETCH_ASSOC);

        // Estadísticas por estado
        $stmt_estado = $pdo->prepare("
                    SELECT estado, COUNT(*) as cantidad 
                    FROM soporte_tickets 
                    WHERE DATE(fecha_creacion) BETWEEN ? AND ?
                    GROUP BY estado
                    ORDER BY cantidad DESC
                ");
        $stmt_estado->execute([$fecha_desde, $fecha_hasta]);
        $stats_por_estado = $stmt_estado->fetchAll(PDO::FETCH_ASSOC);

        // Estadísticas por prioridad
        $stmt_prioridad = $pdo->prepare("
                    SELECT prioridad, COUNT(*) as cantidad 
                    FROM soporte_tickets 
                    WHERE DATE(fecha_creacion) BETWEEN ? AND ?
                    GROUP BY prioridad
                    ORDER BY FIELD(prioridad, 'critica', 'alta', 'media', 'baja'), cantidad DESC
                ");
        $stmt_prioridad->execute([$fecha_desde, $fecha_hasta]);
        $stats_por_prioridad = $stmt_prioridad->fetchAll(PDO::FETCH_ASSOC);

        // Estadísticas por empresa (top 10)
        $stmt_empresa = $pdo->prepare("
                    SELECT empresa, COUNT(*) as cantidad 
                    FROM soporte_tickets 
                    WHERE DATE(fecha_creacion) BETWEEN ? AND ? 
                      AND empresa IS NOT NULL AND empresa != ''
                    GROUP BY empresa
                    ORDER BY cantidad DESC
                    LIMIT 10
                ");
        $stmt_empresa->execute([$fecha_desde, $fecha_hasta]);
        $stats_por_empresa = $stmt_empresa->fetchAll(PDO::FETCH_ASSOC);

        // Estadísticas por mes (últimos 6 meses)
        $stmt_mes = $pdo->prepare("
                    SELECT 
                        DATE_FORMAT(fecha_creacion, '%Y-%m') as mes,
                        COUNT(*) as cantidad 
                    FROM soporte_tickets 
                    WHERE fecha_creacion >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
                    GROUP BY DATE_FORMAT(fecha_creacion, '%Y-%m')
                    ORDER BY mes DESC
                ");
        $stmt_mes->execute();
        $stats_por_mes = $stmt_mes->fetchAll(PDO::FETCH_ASSOC);
      }
    }
  }
} catch (Exception $e) {
  // Si falla la BD, usar datos de ejemplo
  $stats_periodo = [
    'total_tickets' => 25,
    'resueltos' => 18,
    'criticos' => 3,
    'alta_prioridad' => 7,
    'tiempo_promedio_resolucion' => 24.5
  ];

  $stats_por_estado = [
    ['estado' => 'resuelto', 'cantidad' => 10],
    ['estado' => 'abierto', 'cantidad' => 8],
    ['estado' => 'en_proceso', 'cantidad' => 5],
    ['estado' => 'cerrado', 'cantidad' => 2]
  ];

  $stats_por_prioridad = [
    ['prioridad' => 'critica', 'cantidad' => 3],
    ['prioridad' => 'alta', 'cantidad' => 7],
    ['prioridad' => 'media', 'cantidad' => 12],
    ['prioridad' => 'baja', 'cantidad' => 3]
  ];

  $stats_por_empresa = [
    ['empresa' => 'TekiWeb Solutions', 'cantidad' => 8],
    ['empresa' => 'Sistemas Corp', 'cantidad' => 6],
    ['empresa' => 'Digital SA', 'cantidad' => 4]
  ];

  $stats_por_mes = [
    ['mes' => '2025-07', 'cantidad' => 15],
    ['mes' => '2025-06', 'cantidad' => 22],
    ['mes' => '2025-05', 'cantidad' => 18]
  ];
}

// Funciones auxiliares
function formatear_mes($mes)
{
  $meses = [
    '01' => 'Enero',
    '02' => 'Febrero',
    '03' => 'Marzo',
    '04' => 'Abril',
    '05' => 'Mayo',
    '06' => 'Junio',
    '07' => 'Julio',
    '08' => 'Agosto',
    '09' => 'Septiembre',
    '10' => 'Octubre',
    '11' => 'Noviembre',
    '12' => 'Diciembre'
  ];
  $partes = explode('-', $mes);
  return $meses[$partes[1]] . ' ' . $partes[0];
}

function calcular_porcentaje($parte, $total)
{
  return $total > 0 ? round(($parte / $total) * 100, 1) : 0;
}
?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>📈 ESTADÍSTICAS AVANZADAS - <?php echo date('H:i:s'); ?></title>
  <link rel="icon" href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAxMDAgMTAwJz48dGV4dCB5PScuOWVtJyBmb250LXNpemU9JzkwJz7wn5OI77iPPC90ZXh0Pjwvc3ZnPg==">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      background: linear-gradient(135deg, #0a0a0a 0%, #001100 100%);
      color: #e0e0e0;
      font-family: 'Courier New', monospace;
      min-height: 100vh;
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
      border: 2px solid #00ff00;
      border-radius: 10px;
      background: rgba(0, 255, 0, 0.05);
      position: relative;
    }

    .header h1 {
      color: #00ff00;
      text-shadow: 0 0 20px #00ff00;
      font-size: 2.5em;
      margin-bottom: 10px;
      animation: glow 2s ease-in-out infinite alternate;
    }

    @keyframes glow {
      from {
        text-shadow: 0 0 20px #00ff00, 0 0 30px #00ff00;
      }

      to {
        text-shadow: 0 0 30px #00ff00, 0 0 40px #00ff00;
      }
    }

    .status-indicator {
      position: absolute;
      top: 15px;
      right: 15px;
      padding: 5px 10px;
      border-radius: 15px;
      font-size: 0.8em;
      background: rgba(0, 255, 0, 0.2);
      border: 1px solid #00ff00;
    }

    .nav-menu {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin: 20px 0;
      flex-wrap: wrap;
    }

    .nav-button {
      background: #001a00;
      color: #00ff00;
      border: 2px solid #00ff00;
      padding: 12px 20px;
      text-decoration: none;
      border-radius: 5px;
      font-family: 'Courier New', monospace;
      font-weight: bold;
      transition: all 0.3s ease;
      text-transform: uppercase;
      font-size: 0.9em;
      display: inline-block;
    }

    .nav-button:hover,
    .nav-button.active {
      background: #00ff00;
      color: #000000;
      box-shadow: 0 0 15px #00ff00;
      text-decoration: none;
    }

    .filters-section {
      background: rgba(0, 255, 0, 0.05);
      border: 1px solid #00ff00;
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 30px;
    }

    .filters-form {
      display: flex;
      gap: 15px;
      align-items: center;
      flex-wrap: wrap;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .filter-group label {
      color: #00ff00;
      font-size: 0.9em;
      font-weight: bold;
    }

    .filter-group input {
      background: #0a0a0a;
      border: 1px solid #00ff00;
      color: #e0e0e0;
      padding: 8px 12px;
      border-radius: 5px;
      font-family: 'Courier New', monospace;
    }

    .filter-group input:focus {
      outline: none;
      box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
    }

    .btn-filtrar {
      background: #00ff00;
      color: #000000;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      font-family: 'Courier New', monospace;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-top: 20px;
    }

    .btn-filtrar:hover {
      background: #00cc00;
      box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin: 30px 0;
    }

    .stat-card {
      background: rgba(0, 255, 0, 0.1);
      border: 2px solid #00ff00;
      border-radius: 10px;
      padding: 20px;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      background: rgba(0, 255, 0, 0.2);
      box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
      transform: translateY(-2px);
    }

    .stat-card h3 {
      color: #00ff00;
      font-size: 1.2em;
      margin-bottom: 15px;
      text-shadow: 0 0 5px #00ff00;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .stat-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid rgba(0, 255, 0, 0.2);
    }

    .stat-item:last-child {
      border-bottom: none;
    }

    .stat-label {
      color: #e0e0e0;
    }

    .stat-value {
      color: #00ff00;
      font-weight: bold;
    }

    .stat-bar {
      background: rgba(0, 255, 0, 0.1);
      height: 20px;
      border-radius: 10px;
      overflow: hidden;
      margin-top: 5px;
    }

    .stat-bar-fill {
      background: linear-gradient(90deg, #00ff00, #00cc00);
      height: 100%;
      transition: width 0.5s ease;
    }

    .big-number {
      font-size: 2.5em;
      color: #00ff00;
      text-shadow: 0 0 10px #00ff00;
      text-align: center;
    }

    .periodo-info {
      text-align: center;
      color: #00ff00;
      font-size: 1.1em;
      margin-bottom: 20px;
      padding: 10px;
      border: 1px solid #00ff00;
      border-radius: 5px;
      background: rgba(0, 255, 0, 0.05);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .container {
        padding: 10px;
      }

      .header h1 {
        font-size: 2em;
      }

      .stats-grid {
        grid-template-columns: 1fr;
        gap: 15px;
      }

      .filters-form {
        flex-direction: column;
        align-items: stretch;
      }

      .nav-menu {
        flex-direction: column;
        align-items: center;
      }
    }
  </style>
</head>

<body>
  <div class="container">

    <div class="header">
      <div class="status-indicator">
        <?php echo $datos_reales_obtenidos ? '🔗 BD REAL' : '⚠️ BD DEMO'; ?> |
        Período: <?php echo date('d/m/Y', strtotime($fecha_desde)) . ' - ' . date('d/m/Y', strtotime($fecha_hasta)); ?>
      </div>
      <h1>📈 ESTADÍSTICAS AVANZADAS</h1>
      <p>Análisis Detallado del Sistema de Tickets</p>
    </div>
    <nav class="nav-menu">
      <a href="index.php" class="nav-button">📊 Dashboard</a>
      <a href="lista.php" class="nav-button">📋 Lista Tickets</a>
      <a href="estadisticas.php" class="nav-button active">📈 Estadísticas</a>
      <a href="reportes.php" class="nav-button">📊 Reportes</a>
    </nav>

    <div class="filters-section">
      <form class="filters-form" method="GET">
        <div class="filter-group">
          <label for="fecha_desde">📅 Fecha Desde:</label>
          <input type="date" id="fecha_desde" name="fecha_desde" value="<?= htmlspecialchars($fecha_desde) ?>">
        </div>
        <div class="filter-group">
          <label for="fecha_hasta">📅 Fecha Hasta:</label>
          <input type="date" id="fecha_hasta" name="fecha_hasta" value="<?= htmlspecialchars($fecha_hasta) ?>">
        </div>
        <button type="submit" class="btn-filtrar">🔍 APLICAR FILTROS</button>
      </form>
    </div>

    <div class="periodo-info">
      📊 Mostrando estadísticas del período: <?= date('d/m/Y', strtotime($fecha_desde)) ?> al <?= date('d/m/Y', strtotime($fecha_hasta)) ?>
    </div>

    <div class="stats-grid">

      <!-- Resumen General -->
      <div class="stat-card">
        <h3>📊 RESUMEN GENERAL</h3>
        <div class="stat-item">
          <span class="stat-label">Total Tickets:</span>
          <span class="stat-value big-number" style="font-size: 1.5em;"><?= $stats_periodo['total_tickets'] ?></span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Resueltos:</span>
          <span class="stat-value"><?= $stats_periodo['resueltos'] ?> (<?= calcular_porcentaje($stats_periodo['resueltos'], $stats_periodo['total_tickets']) ?>%)</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Críticos:</span>
          <span class="stat-value"><?= $stats_periodo['criticos'] ?></span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Alta Prioridad:</span>
          <span class="stat-value"><?= $stats_periodo['alta_prioridad'] ?></span>
        </div>
        <?php if ($stats_periodo['tiempo_promedio_resolucion']): ?>
          <div class="stat-item">
            <span class="stat-label">Tiempo Promedio:</span>
            <span class="stat-value"><?= round($stats_periodo['tiempo_promedio_resolucion'], 1) ?>h</span>
          </div>
        <?php endif; ?>
      </div>

      <!-- Por Estado -->
      <div class="stat-card">
        <h3>📈 POR ESTADO</h3>
        <?php if (empty($stats_por_estado)): ?>
          <div class="stat-item">
            <span class="stat-label">Sin datos en el período</span>
          </div>
        <?php else: ?>
          <?php foreach ($stats_por_estado as $estado): ?>
            <div class="stat-item">
              <span class="stat-label"><?= ucfirst($estado['estado'] ?: 'Sin estado') ?>:</span>
              <span class="stat-value"><?= $estado['cantidad'] ?></span>
            </div>
            <div class="stat-bar">
              <div class="stat-bar-fill" style="width: <?= calcular_porcentaje($estado['cantidad'], $stats_periodo['total_tickets']) ?>%"></div>
            </div>
          <?php endforeach; ?>
        <?php endif; ?>
      </div>

      <!-- Por Prioridad -->
      <div class="stat-card">
        <h3>🚨 POR PRIORIDAD</h3>
        <?php if (empty($stats_por_prioridad)): ?>
          <div class="stat-item">
            <span class="stat-label">Sin datos en el período</span>
          </div>
        <?php else: ?>
          <?php foreach ($stats_por_prioridad as $prioridad): ?>
            <div class="stat-item">
              <span class="stat-label"><?= ucfirst($prioridad['prioridad']) ?>:</span>
              <span class="stat-value"><?= $prioridad['cantidad'] ?></span>
            </div>
            <div class="stat-bar">
              <div class="stat-bar-fill" style="width: <?= calcular_porcentaje($prioridad['cantidad'], $stats_periodo['total_tickets']) ?>%"></div>
            </div>
          <?php endforeach; ?>
        <?php endif; ?>
      </div>

      <!-- Por Empresa -->
      <div class="stat-card">
        <h3>🏢 TOP EMPRESAS</h3>
        <?php if (empty($stats_por_empresa)): ?>
          <div class="stat-item">
            <span class="stat-label">Sin datos en el período</span>
          </div>
        <?php else: ?>
          <?php foreach ($stats_por_empresa as $empresa): ?>
            <div class="stat-item">
              <span class="stat-label"><?= htmlspecialchars($empresa['empresa']) ?>:</span>
              <span class="stat-value"><?= $empresa['cantidad'] ?></span>
            </div>
            <div class="stat-bar">
              <div class="stat-bar-fill" style="width: <?= calcular_porcentaje($empresa['cantidad'], $stats_periodo['total_tickets']) ?>%"></div>
            </div>
          <?php endforeach; ?>
        <?php endif; ?>
      </div>

      <!-- Por Mes -->
      <div class="stat-card">
        <h3>📅 EVOLUCIÓN MENSUAL</h3>
        <?php if (empty($stats_por_mes)): ?>
          <div class="stat-item">
            <span class="stat-label">Sin datos históricos</span>
          </div>
        <?php else: ?>
          <?php
          $max_mes = max(array_column($stats_por_mes, 'cantidad'));
          foreach ($stats_por_mes as $mes):
          ?>
            <div class="stat-item">
              <span class="stat-label"><?= formatear_mes($mes['mes']) ?>:</span>
              <span class="stat-value"><?= $mes['cantidad'] ?></span>
            </div>
            <div class="stat-bar">
              <div class="stat-bar-fill" style="width: <?= calcular_porcentaje($mes['cantidad'], $max_mes) ?>%"></div>
            </div>
          <?php endforeach; ?>
        <?php endif; ?>
      </div>

      <!-- Eficiencia -->
      <div class="stat-card">
        <h3>⚡ EFICIENCIA</h3>
        <?php
        $tasa_resolucion = calcular_porcentaje($stats_periodo['resueltos'], $stats_periodo['total_tickets']);
        $nivel_eficiencia = $tasa_resolucion >= 80 ? 'EXCELENTE' : ($tasa_resolucion >= 60 ? 'BUENA' : 'MEJORABLE');
        ?>
        <div class="stat-item">
          <span class="stat-label">Tasa de Resolución:</span>
          <span class="stat-value"><?= $tasa_resolucion ?>%</span>
        </div>
        <div class="stat-bar">
          <div class="stat-bar-fill" style="width: <?= $tasa_resolucion ?>%"></div>
        </div>
        <div class="stat-item">
          <span class="stat-label">Nivel:</span>
          <span class="stat-value"><?= $nivel_eficiencia ?></span>
        </div>
        <?php if ($stats_periodo['tiempo_promedio_resolucion']): ?>
          <div class="stat-item">
            <span class="stat-label">Tiempo Promedio:</span>
            <span class="stat-value"><?= round($stats_periodo['tiempo_promedio_resolucion'], 1) ?>h</span>
          </div>
        <?php endif; ?>
      </div>

    </div>

  </div>
</body>

</html>