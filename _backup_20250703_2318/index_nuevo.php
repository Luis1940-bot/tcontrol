<?php
// ==========================================
// INDEX.PHP - PANEL ADMINISTRATIVO CORREGIDO
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
$datos_reales_obtenidos = false;

// BASE_URL
$protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? 'https' : 'http';
$server_host = $_SERVER['HTTP_HOST'] ?? 'localhost';
$baseUrl = "$protocol://$server_host/test-tenkiweb/tcontrol";

// Obtener datos reales de la base de datos
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
  // Si falla la BD, usar datos de ejemplo
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

  if ($diff->d > 0) return $diff->d . ' día' . ($diff->d > 1 ? 's' : '');
  if ($diff->h > 0) return $diff->h . ' hora' . ($diff->h > 1 ? 's' : '');
  if ($diff->i > 0) return $diff->i . ' minuto' . ($diff->i > 1 ? 's' : '');
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
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-top: 40px;
    }

    .content-section {
      background: rgba(0, 255, 0, 0.05);
      border: 1px solid #00ff00;
      border-radius: 10px;
      padding: 20px;
    }

    .section-title {
      color: #00ff00;
      font-size: 1.2em;
      margin-bottom: 20px;
      text-shadow: 0 0 5px #00ff00;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .btn-ver {
      background: rgba(0, 255, 0, 0.2);
      color: #00ff00;
      padding: 5px 15px;
      border: 1px solid #00ff00;
      border-radius: 15px;
      text-decoration: none;
      font-size: 0.8em;
      transition: all 0.3s ease;
    }

    .btn-ver:hover {
      background: #00ff00;
      color: #000000;
    }

    .ticket-item {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid #333333;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 15px;
      transition: all 0.3s ease;
    }

    .ticket-item:hover {
      border-color: #00ff00;
      background: rgba(0, 255, 0, 0.05);
    }

    .ticket-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .ticket-id {
      color: #00ff00;
      font-weight: bold;
    }

    .ticket-title {
      font-size: 1.1em;
      margin-bottom: 8px;
      color: #ffffff;
    }

    .ticket-meta {
      font-size: 0.9em;
      opacity: 0.8;
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      opacity: 0.6;
    }

    .empty-state .icon {
      font-size: 3em;
      margin-bottom: 15px;
    }

    .badge {
      padding: 3px 8px;
      border-radius: 12px;
      font-size: 0.8em;
      font-weight: bold;
      text-transform: uppercase;
    }

    .badge.abierto {
      background: #ff6b35;
      color: #ffffff;
    }

    .badge.proceso {
      background: #f7931e;
      color: #ffffff;
    }

    .badge.resuelto {
      background: #00ff00;
      color: #000000;
    }

    .badge.cerrado {
      background: #666666;
      color: #ffffff;
    }

    .badge.critica {
      background: #ff0000;
      color: #ffffff;
    }

    .badge.alta {
      background: #ff6b35;
      color: #ffffff;
    }

    .badge.media {
      background: #f7931e;
      color: #ffffff;
    }

    .badge.baja {
      background: #4CAF50;
      color: #ffffff;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .container {
        padding: 10px;
      }

      .header h1 {
        font-size: 2em;
      }

      .stats-container {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 15px;
      }

      .stat-card {
        padding: 15px;
      }

      .stat-number {
        font-size: 2em;
      }

      .two-column {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .nav-menu {
        flex-direction: column;
        align-items: center;
      }

      .ticket-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 5px;
      }

      .ticket-meta {
        flex-direction: column;
        gap: 5px;
      }
    }
  </style>
</head>

<body>
  <div class="container">

    <div class="header">
      <div class="status-indicator">
        <?php echo $datos_reales_obtenidos ? '🔗 BD REAL' : '⚠️ BD DEMO'; ?> |
        Total: <?php echo $stats['total_tickets']; ?>
      </div>
      <h1>🛡️ PANEL ADMINISTRATIVO</h1>
      <p>Sistema de Gestión de Tickets de Soporte</p>
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
          <div class="empty-state">
            <div class="icon">📭</div>
            <p>No hay tickets recientes</p>
          </div>
        <?php else: ?>
          <?php foreach ($tickets_recientes as $ticket): ?>
            <div class="ticket-item">
              <div class="ticket-header">
                <span class="ticket-id"><?= htmlspecialchars($ticket['ticket_id']) ?></span>
                <span class="badge <?= get_estado_badge($ticket['estado']) ?>">
                  <?= ucfirst($ticket['estado']) ?>
                </span>
              </div>
              <div class="ticket-title"><?= htmlspecialchars($ticket['asunto']) ?></div>
              <div class="ticket-meta">
                <span>👤 <?= htmlspecialchars($ticket['nombre_contacto']) ?></span>
                <span>🏢 <?= htmlspecialchars($ticket['empresa']) ?></span>
                <span>⏰ <?= time_ago($ticket['fecha_creacion']) ?></span>
              </div>
            </div>
          <?php endforeach; ?>
        <?php endif; ?>
      </div>

      <div class="content-section">
        <h2 class="section-title">🚨 TICKETS URGENTES</h2>

        <?php if (empty($tickets_urgentes)): ?>
          <div class="empty-state">
            <div class="icon">🎉</div>
            <p>No hay tickets urgentes</p>
          </div>
        <?php else: ?>
          <?php foreach ($tickets_urgentes as $ticket): ?>
            <div class="ticket-item">
              <div class="ticket-header">
                <span class="ticket-id"><?= htmlspecialchars($ticket['ticket_id']) ?></span>
                <span class="badge <?= get_prioridad_badge($ticket['prioridad']) ?>">
                  <?= ucfirst($ticket['prioridad']) ?>
                </span>
              </div>
              <div class="ticket-title"><?= htmlspecialchars($ticket['asunto']) ?></div>
              <div class="ticket-meta">
                <span>⏰ <?= $ticket['horas_transcurridas'] ?>h transcurridas</span>
              </div>
            </div>
          <?php endforeach; ?>
        <?php endif; ?>
      </div>
    </div>

  </div>
</body>

</html>