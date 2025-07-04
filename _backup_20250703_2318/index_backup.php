<?php
// ==========================================
// INDEX.PHP - DATOS REALES DE BASE DE DATOS
// ==========================================

// Limpiar cualquier salida previa
while (ob_get_level()) {
  ob_end_clean();
}

// Headers básicos
header('Content-Type: text/html; charset=UTF-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');
header("Content-Security-Policy: default-src 'self'; style-src 'unsafe-inline'; script-src 'self'; img-src 'self' data:; font-src 'self'");

// Configuración de errores
error_reporting(0);
ini_set('display_errors', '0');

// Variables iniciales
$stats = [
  'total_tickets' => 0,
  'nuevos' => 0,
  'abiertos' => 0,
  'en_proceso' => 0,
  'resueltos' => 0,
  'cerrados' => 0,
  'hoy' => 0,
  'semana' => 0,
  'mes' => 0
];
$tickets_recientes = [];
$tickets_urgentes = [];
$conexion_exitosa = false;
$datos_reales_obtenidos = false;

// BASE_URL
$protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? 'https' : 'http';
$server_host = $_SERVER['HTTP_HOST'] ?? 'localhost';
$baseUrl = "$protocol://$server_host/test-tenkiweb/tcontrol";

// Obtener datos reales de la base de datos
try {
  // Incluir configuración de BD
  $config_path = dirname(dirname(dirname(__DIR__))) . '/Routes/datos_base.php';

  if (file_exists($config_path)) {
    include $config_path;

    // Crear conexión PDO
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
        $conexion_exitosa = true;
        $datos_reales_obtenidos = true;
        // Obtener estadísticas reales
        $stmt_stats = $pdo->prepare("
                    SELECT 
                        COUNT(*) as total_tickets,
                        0 as nuevos,
                        COUNT(CASE WHEN estado = 'abierto' THEN 1 END) as abiertos,
                        COUNT(CASE WHEN estado = 'en_proceso' THEN 1 END) as en_proceso,
                        COUNT(CASE WHEN estado = 'resuelto' THEN 1 END) as resueltos,
                        COUNT(CASE WHEN estado = 'cerrado' THEN 1 END) as cerrados,
                        COUNT(CASE WHEN DATE(fecha_creacion) = CURDATE() THEN 1 END) as hoy,
                        COUNT(CASE WHEN fecha_creacion >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as semana,
                        COUNT(CASE WHEN fecha_creacion >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as mes
                    FROM soporte_tickets
                ");
        $stmt_stats->execute();
        $stats = $stmt_stats->fetch(PDO::FETCH_ASSOC);

        // Obtener tickets recientes
        $stmt_recientes = $pdo->prepare("
                    SELECT ticket_id, asunto, estado, prioridad, empresa, nombre_contacto, fecha_creacion 
                    FROM soporte_tickets 
                    ORDER BY fecha_creacion DESC 
                    LIMIT 5
                ");
        $stmt_recientes->execute();
        $tickets_recientes = $stmt_recientes->fetchAll(PDO::FETCH_ASSOC);

        // Obtener tickets urgentes
        $stmt_urgentes = $pdo->prepare("
                    SELECT ticket_id, asunto, prioridad, TIMESTAMPDIFF(HOUR, fecha_creacion, NOW()) as horas_transcurridas
                    FROM soporte_tickets 
                    WHERE prioridad IN ('critica', 'alta') AND estado NOT IN ('resuelto', 'cerrado')
                    ORDER BY FIELD(prioridad, 'critica', 'alta'), fecha_creacion ASC
                    LIMIT 5
                ");
        $stmt_urgentes->execute();
        $tickets_urgentes = $stmt_urgentes->fetchAll(PDO::FETCH_ASSOC);
      }
    }
  }
} catch (Exception $e) {
  $conexion_exitosa = false;
  $datos_reales_obtenidos = false;
}

// Datos de ejemplo si no hay conexión
if (!$datos_reales_obtenidos) {
  $stats = [
    'total_tickets' => 42,
    'nuevos' => 8,
    'abiertos' => 12,
    'en_proceso' => 7,
    'resueltos' => 13,
    'cerrados' => 2,
    'hoy' => 3,
    'semana' => 15,
    'mes' => 42
  ];

  $tickets_recientes = [
    [
      'ticket_id' => '#115',
      'asunto' => 'No puedo entrar a la aplicación',
      'estado' => 'abierto',
      'prioridad' => 'media',
      'empresa' => 'TekiWeb Solutions',
      'nombre_contacto' => 'Eduardo',
      'fecha_creacion' => date('Y-m-d H:i:s', strtotime('-2 hours'))
    ],
    [
      'ticket_id' => '#114',
      'asunto' => 'Información sobre proceso de migración',
      'estado' => 'en_proceso',
      'prioridad' => 'baja',
      'empresa' => 'Sistemas Corp',
      'nombre_contacto' => 'Miguel Ángel Ruiz',
      'fecha_creacion' => date('Y-m-d H:i:s', strtotime('-1 hour'))
    ]
  ];

  $tickets_urgentes = [
    [
      'ticket_id' => '#112',
      'asunto' => 'Sistema completo sin funcionar',
      'prioridad' => 'critica',
      'horas_transcurridas' => 4
    ]
  ];
}

// Funciones auxiliares
function get_estado_badge($estado)
{
  switch ($estado) {
    case 'nuevo':
      return 'nuevo';
    case 'abierto':
      return 'abierto';
    case 'en_proceso':
      return 'proceso';
    case 'resuelto':
      return 'resuelto';
    case 'cerrado':
      return 'cerrado';
    default:
      return 'nuevo';
  }
}

function get_prioridad_badge($prioridad)
{
  switch ($prioridad) {
    case 'critica':
      return 'critica';
    case 'alta':
      return 'alta';
    case 'media':
      return 'media';
    case 'baja':
      return 'baja';
    default:
      return 'media';
  }
}

function time_ago($datetime)
{
  $now = new DateTime();
  $ago = new DateTime($datetime);
  $diff = $now->diff($ago);

  if ($diff->d > 0) return 'hace ' . $diff->d . ' día' . ($diff->d > 1 ? 's' : '');
  if ($diff->h > 0) return 'hace ' . $diff->h . ' hora' . ($diff->h > 1 ? 's' : '');
  if ($diff->i > 0) return 'hace ' . $diff->i . ' minuto' . ($diff->i > 1 ? 's' : '');
  return 'hace unos segundos';
}
?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🛡️ PANEL ADMINISTRATIVO - <?php echo date('H:i:s'); ?></title>
  <link rel="icon" href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAxMDAgMTAwJz48dGV4dCB5PScuOWVtJyBmb250LXNpemU9JzkwJz7wn5GH77iPPC90ZXh0Pjwvc3ZnPg==">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Courier New', monospace;
      background: #0a0a0a;
      color: #00ff00;
      line-height: 1.6;
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
      padding: 25px;
      border: 3px solid #00ff00;
      border-radius: 15px;
      background: rgba(0, 255, 0, 0.1);
      box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
    }

    .header h1 {
      font-size: 2.5em;
      margin: 0 0 10px 0;
      text-shadow: 0 0 10px #00ff00;
      animation: glow 2s ease-in-out infinite alternate;
    }

    @keyframes glow {
      from {
        text-shadow: 0 0 10px #00ff00;
      }

      to {
        text-shadow: 0 0 20px #00ff00, 0 0 30px #00ff00;
      }
    }

    .status-indicator {
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 20, 0, 0.9);
      color: #00ff00;
      padding: 8px 15px;
      border-radius: 20px;
      font-size: 0.8em;
      border: 1px solid #00ff00;
      z-index: 1000;
      box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
    }

    .nav-menu {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin: 25px 0;
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
    }

    .nav-button:hover,
    .nav-button.active {
      background: #00ff00;
      color: #000000;
      box-shadow: 0 0 15px #00ff00;
      text-decoration: none;
    }

    .nav-button.disabled {
      background: #0a0a0a;
      color: #555555;
      border-color: #333333;
      cursor: not-allowed;
      opacity: 0.5;
    }

    .nav-button.disabled:hover {
      background: #0a0a0a;
      color: #555555;
      box-shadow: none;
    }

    .stats-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 20px;
      margin: 30px 0;
    }

    .stat-card {
      background: rgba(0, 255, 0, 0.1);
      border: 2px solid #00ff00;
      border-radius: 10px;
      padding: 20px;
      text-align: center;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      background: rgba(0, 255, 0, 0.2);
      box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
      transform: translateY(-2px);
    }

    .stat-icon {
      font-size: 2.5em;
      margin-bottom: 10px;
    }

    .stat-number {
      font-size: 2.5em;
      font-weight: bold;
      color: #00ff00;
      text-shadow: 0 0 10px #00ff00;
      margin: 10px 0;
    }

    .stat-label {
      font-size: 0.9em;
      text-transform: uppercase;
      letter-spacing: 1px;
      opacity: 0.9;
    }

    .two-column {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 30px;
      margin-top: 30px;
    }

    .content-section {
      padding: 25px;
      border: 1px solid #00ff00;
      border-radius: 10px;
      background: rgba(0, 255, 0, 0.05);
    }

    .section-title {
      font-size: 1.3em;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #00ff00;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .tickets-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }

    .tickets-table th,
    .tickets-table td {
      padding: 12px 8px;
      text-align: left;
      border-bottom: 1px solid rgba(0, 255, 0, 0.3);
      font-size: 0.9em;
    }

    .tickets-table th {
      background: rgba(0, 255, 0, 0.1);
      font-weight: bold;
      text-transform: uppercase;
      font-size: 0.8em;
    }

    .tickets-table tr:hover {
      background: rgba(0, 255, 0, 0.1);
    }

    .ticket-id {
      font-weight: bold;
      color: #00ff00;
      text-shadow: 0 0 5px #00ff00;
    }

    .badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.7em;
      font-weight: bold;
      text-transform: uppercase;
      margin: 0 2px;
    }

    .badge-nuevo {
      background: #0066ff;
      color: white;
    }

    .badge-abierto {
      background: #ffaa00;
      color: black;
    }

    .badge-proceso {
      background: #ff6600;
      color: white;
    }

    .badge-resuelto {
      background: #00cc00;
      color: black;
    }

    .badge-cerrado {
      background: #666;
      color: white;
    }

    .badge-critica {
      background: #ff0000;
      color: white;
      animation: blink 1s infinite;
    }

    .badge-alta {
      background: #ff6600;
      color: white;
    }

    .badge-media {
      background: #ffaa00;
      color: black;
    }

    .badge-baja {
      background: #666;
      color: white;
    }

    @keyframes blink {

      0%,
      50% {
        opacity: 1;
      }

      51%,
      100% {
        opacity: 0.5;
      }
    }

    .alert-card {
      background: rgba(255, 0, 0, 0.1);
      border: 2px solid #ff0000;
      border-radius: 10px;
      padding: 15px;
      margin: 10px 0;
      position: relative;
    }

    .alert-card.alta {
      background: rgba(255, 102, 0, 0.1);
      border-color: #ff6600;
    }

    .alert-id {
      font-weight: bold;
      color: #ff0000;
      font-size: 1.1em;
    }

    .alert-priority {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.7em;
      font-weight: bold;
      text-transform: uppercase;
    }

    .alert-priority.critica {
      background: #ff0000;
      color: white;
    }

    .alert-priority.alta {
      background: #ff6600;
      color: white;
    }

    .alert-time {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.7);
      color: #00ff00;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 0.7em;
    }

    .btn-ver {
      background: transparent;
      color: #00ff00;
      border: 1px solid #00ff00;
      padding: 5px 10px;
      text-decoration: none;
      border-radius: 3px;
      font-size: 0.7em;
      font-family: 'Courier New', monospace;
      text-transform: uppercase;
      transition: all 0.3s ease;
    }

    .btn-ver:hover {
      background: #00ff00;
      color: #000000;
      text-decoration: none;
    }

    @media (max-width: 768px) {
      .container {
        padding: 10px;
      }

      .two-column {
        grid-template-columns: 1fr;
      }

      .nav-menu {
        flex-direction: column;
        align-items: center;
      }

      .stats-container {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      }
    }
  </style>
</head>

<body>
  <div class="status-indicator">
    🟢 SISTEMA ACTIVO | <?php echo date('H:i:s'); ?> |
    <?php echo $datos_reales_obtenidos ? '🔗 BD REAL' : '⚠️ BD DEMO'; ?> |
    Total: <?php echo $stats['total_tickets']; ?>
  </div>

  <div class="container">
    <div class="header">
      <h1>🛡️ PANEL ADMINISTRATIVO 🛡️</h1>
      <p>SISTEMA DE GESTIÓN DE TICKETS</p>
    </div>

    <nav class="nav-menu">
      <a href="index.php" class="nav-button active">📊 Dashboard</a>
      <a href="lista.php" class="nav-button">📋 Lista Tickets</a>
      <span class="nav-button disabled" title="Próximamente">📈 Estadísticas</span>
      <span class="nav-button disabled" title="Próximamente">📊 Reportes</span>
      <span class="nav-button disabled" title="Próximamente">⚙️ Configuración</span>
    </nav>

    <div class="stats-container">
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-number"><?= $stats['total_tickets'] ?></div>
        <div class="stat-label">Total Tickets</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🆕</div>
        <div class="stat-number"><?= $stats['nuevos'] ?></div>
        <div class="stat-label">Nuevos</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🔄</div>
        <div class="stat-number"><?= $stats['abiertos'] + $stats['en_proceso'] ?></div>
        <div class="stat-label">En Proceso</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-number"><?= $stats['resueltos'] ?></div>
        <div class="stat-label">Resueltos</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🔒</div>
        <div class="stat-number"><?= $stats['cerrados'] ?></div>
        <div class="stat-label">Cerrados</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-number"><?= $stats['hoy'] ?></div>
        <div class="stat-label">Hoy</div>
      </div>
    </div>

    <div class="two-column">
      <div class="content-section">
        <h2 class="section-title">🕐 TICKETS RECIENTES <a href="lista.php" class="btn-ver">Ver Todos</a></h2>

        <?php if (empty($tickets_recientes)): ?>
          <div style="text-align: center; padding: 20px; opacity: 0.7;">
            📥 No hay tickets recientes para mostrar
          </div>
        <?php else: ?>
          <table class="tickets-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>TÍTULO</th>
                <th>USUARIO</th>
                <th>ESTADO</th>
                <th>PRIORIDAD</th>
                <th>CREADO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($tickets_recientes as $ticket): ?>
                <tr>
                  <td class="ticket-id"><?= htmlspecialchars($ticket['ticket_id']) ?></td>
                  <td><?= htmlspecialchars(substr($ticket['asunto'], 0, 40)) ?><?= strlen($ticket['asunto']) > 40 ? '...' : '' ?></td>
                  <td><?= htmlspecialchars($ticket['nombre_contacto'] ?? 'N/A') ?></td>
                  <td>
                    <span class="badge badge-<?= get_estado_badge($ticket['estado']) ?>">
                      <?= strtoupper(str_replace('_', ' ', $ticket['estado'])) ?>
                    </span>
                  </td>
                  <td>
                    <span class="badge badge-<?= get_prioridad_badge($ticket['prioridad']) ?>">
                      <?= strtoupper($ticket['prioridad']) ?>
                    </span>
                  </td>
                  <td style="font-size: 0.8em;"><?= time_ago($ticket['fecha_creacion']) ?></td>
                  <td>
                    <a href="detalle.php?ticket=<?= urlencode($ticket['ticket_id']) ?>" class="btn-ver">👁️ VER</a>
                  </td>
                </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        <?php endif; ?>
      </div>

      <div class="content-section">
        <h2 class="section-title">🚨 ALERTAS CRÍTICAS</h2>

        <?php if (empty($tickets_urgentes)): ?>
          <div style="text-align: center; padding: 20px; opacity: 0.7;">
            ✅ No hay alertas críticas
          </div>
        <?php else: ?>
          <?php foreach ($tickets_urgentes as $ticket): ?>
            <div class="alert-card <?= $ticket['prioridad'] === 'critica' ? 'critica' : 'alta' ?>">
              <div class="alert-time">
                ⏰ <?= $ticket['horas_transcurridas'] ?> horas
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span class="alert-id"><?= htmlspecialchars($ticket['ticket_id']) ?></span>
                <span class="alert-priority <?= $ticket['prioridad'] ?>">
                  <?= strtoupper($ticket['prioridad']) ?>
                </span>
              </div>
              <div style="margin-top: 8px;">
                <?= htmlspecialchars($ticket['asunto']) ?>
              </div>
            </div>
          <?php endforeach; ?>
        <?php endif; ?>
      </div>
    </div>
  </div>
</body>

</html>