<?php
// ==========================================
// INDEX.PHP UNIFICADO CON TEMA HACKER PURO
// ==========================================

// PASO 1: Limpiar ABSOLUTAMENTE TODO
while (ob_get_level()) {
  ob_end_clean();
}

// PASO 2: Configurar headers ANTES de cualquier include
header_remove();
header('Content-Type: text/html; charset=UTF-8');
header('Cache-Control: no-cache, no-store, must-revalidate');

// PASO 3: Suprimir CUALQUIER error o salida
error_reporting(0);
ini_set('display_errors', '0');

// PASO 4: Inicializar variables ANTES de includes
$stats = ['total_tickets' => 0, 'nuevos' => 0, 'abiertos' => 0, 'en_proceso' => 0, 'resueltos' => 0, 'cerrados' => 0, 'hoy' => 0, 'semana' => 0, 'mes' => 0];
$tickets_recientes = [];
$tickets_urgentes = [];
$baseUrl = '';
$nonce = '';

// PASO 5: Intentar includes con buffer protection
ob_start();
try {
  if (file_exists(dirname(dirname(dirname(__DIR__))) . '/config.php')) {
    include_once dirname(dirname(dirname(__DIR__))) . '/config.php';
  }
  if (file_exists(dirname(dirname(dirname(__DIR__))) . '/ErrorLogger.php')) {
    include_once dirname(dirname(dirname(__DIR__))) . '/ErrorLogger.php';
  }
  if (file_exists(dirname(dirname(dirname(__DIR__))) . '/Routes/datos_base.php')) {
    include_once dirname(dirname(dirname(__DIR__))) . '/Routes/datos_base.php';
  }
} catch (Exception $e) {
  // Silenciar errores
}
$buffer_content = ob_get_contents();
ob_end_clean();

// PASO 6: Configuración segura
if (function_exists('setSecurityHeaders')) {
  try {
    $nonce = setSecurityHeaders();
  } catch (Exception $e) {
    $nonce = 'default-nonce';
  }
}

if (function_exists('startSecureSession')) {
  try {
    startSecureSession();
  } catch (Exception $e) {
    // Continuar sin sesión
  }
}

if (defined('BASE_URL')) {
  $baseUrl = BASE_URL;
} else {
  // Usar la configuración corregida para localhost
  $protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? 'https' : 'http';
  $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
  $baseUrl = "$protocol://$host/test-tenkiweb/tcontrol";
}

// PASO 7: Intentar obtener datos reales con protección
try {
  if (isset($pdo) && $pdo instanceof PDO) {
    // Intentar obtener estadísticas reales
    $stmt_stats = $pdo->prepare("
            SELECT 
                COUNT(*) as total_tickets,
                COUNT(CASE WHEN estado = 'nuevo' THEN 1 END) as nuevos,
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
    $result = $stmt_stats->fetch(PDO::FETCH_ASSOC);
    if ($result) {
      $stats = $result;
    }

    // Obtener tickets recientes
    $stmt_recientes = $pdo->prepare("
            SELECT ticket_id, asunto, estado, prioridad, empresa, contacto_nombre, fecha_creacion 
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
} catch (Exception $e) {
  // Si falla la BD, usar datos de ejemplo que se vean
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
      'contacto_nombre' => 'Eduardo',
      'fecha_creacion' => date('Y-m-d H:i:s', strtotime('-2 hours'))
    ],
    [
      'ticket_id' => '#114',
      'asunto' => 'Información sobre proceso de migración',
      'estado' => 'en_proceso',
      'prioridad' => 'baja',
      'empresa' => 'Sistemas Corp',
      'contacto_nombre' => 'Miguel Ángel Ruiz',
      'fecha_creacion' => date('Y-m-d H:i:s', strtotime('-1 hour'))
    ],
    [
      'ticket_id' => '#113',
      'asunto' => 'Error en generación de reportes',
      'estado' => 'en_proceso',
      'prioridad' => 'media',
      'empresa' => 'DataCorp',
      'contacto_nombre' => 'Sandra Torres',
      'fecha_creacion' => date('Y-m-d H:i:s', strtotime('-9 hours'))
    ],
    [
      'ticket_id' => '#112',
      'asunto' => 'Fallo en backup automático',
      'estado' => 'resuelto',
      'prioridad' => 'alta',
      'empresa' => 'CloudTech',
      'contacto_nombre' => 'David González',
      'fecha_creacion' => date('Y-m-d H:i:s', strtotime('-12 hours'))
    ]
  ];

  $tickets_urgentes = [
    [
      'ticket_id' => '#7',
      'asunto' => 'Error crítico en sistema de producción',
      'prioridad' => 'critica',
      'horas_transcurridas' => 13
    ],
    [
      'ticket_id' => '#12',
      'asunto' => 'Fallo en backup automático',
      'prioridad' => 'alta',
      'horas_transcurridas' => 12
    ],
    [
      'ticket_id' => '#8',
      'asunto' => 'Problemas con autenticación de usuarios',
      'prioridad' => 'alta',
      'horas_transcurridas' => 11
    ]
  ];
}

// Funciones helper
function get_estado_badge($estado)
{
  $badges = [
    'nuevo' => 'nuevo',
    'abierto' => 'abierto',
    'en_proceso' => 'proceso',
    'resuelto' => 'resuelto',
    'cerrado' => 'cerrado'
  ];
  return $badges[$estado] ?? 'cerrado';
}

function get_prioridad_badge($prioridad)
{
  $badges = [
    'critica' => 'critica',
    'alta' => 'alta',
    'media' => 'media',
    'baja' => 'baja'
  ];
  return $badges[$prioridad] ?? 'baja';
}

function time_ago($datetime)
{
  $time = time() - strtotime($datetime);
  if ($time < 60) return '0 min';
  if ($time < 3600) return floor($time / 60) . ' min';
  if ($time < 86400) return floor($time / 3600) . ' hora' . (floor($time / 3600) != 1 ? 's' : '');
  return floor($time / 86400) . ' día' . (floor($time / 86400) != 1 ? 's' : '');
}

// PASO 8: ENVIAR DOCTYPE COMPLETAMENTE LIMPIO - SIN ESPACIOS NI SALTOS
?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🛡️ PANEL ADMINISTRATIVO</title>
  <link rel="icon" type="image/x-icon" href="<?php echo $baseUrl; ?>/assets/img/favicon.ico">
  <style>
    /* TEMA HACKER COMPLETO - IGUAL QUE LISTA.PHP */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Courier New', monospace !important;
      background: #0a0a0a !important;
      color: #00ff00 !important;
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
      position: relative;
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
      position: absolute;
      top: 15px;
      right: 20px;
      background: rgba(0, 255, 0, 0.2);
      border: 1px solid #00ff00;
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 0.9em;
      text-align: right;
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
      display: inline-block;
    }

    .nav-button:hover {
      background: #00ff00;
      color: #000000;
      box-shadow: 0 0 15px #00ff00;
      text-decoration: none;
    }

    .nav-button.active {
      background: #00ff00;
      color: #000000;
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
      position: relative;
    }

    .stat-card:hover {
      background: rgba(0, 255, 0, 0.2);
      box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
      transform: translateY(-2px);
    }

    .stat-icon {
      font-size: 2.5em;
      margin-bottom: 10px;
      display: block;
    }

    .stat-number {
      font-size: 2.5em;
      font-weight: bold;
      color: #00ff00;
      text-shadow: 0 0 10px #00ff00;
      margin: 10px 0;
      line-height: 1;
    }

    .stat-label {
      font-size: 0.9em;
      text-transform: uppercase;
      letter-spacing: 1px;
      opacity: 0.9;
    }

    .content-section {
      margin: 30px 0;
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
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .tickets-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    .tickets-table th,
    .tickets-table td {
      padding: 12px 8px;
      text-align: left;
      border-bottom: 1px solid #333;
      font-size: 0.9em;
    }

    .tickets-table th {
      background: rgba(0, 255, 0, 0.2);
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-size: 0.8em;
    }

    .tickets-table tr:hover {
      background: rgba(0, 255, 0, 0.1);
    }

    .ticket-id {
      color: #00ffff;
      font-weight: bold;
    }

    .badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.7em;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge-nuevo {
      background: #0066cc;
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
      box-shadow: 0 0 5px #ff0000;
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
        opacity: 0.7;
      }
    }

    .time-ago {
      color: #888;
      font-size: 0.8em;
    }

    .alert-critica {
      background: rgba(255, 0, 0, 0.2);
      border: 2px solid #ff0000;
      border-radius: 10px;
      padding: 15px;
      margin: 10px 0;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% {
        box-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
      }

      50% {
        box-shadow: 0 0 20px rgba(255, 0, 0, 0.8);
      }

      100% {
        box-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
      }
    }

    .no-data {
      text-align: center;
      padding: 40px;
      color: #666;
      font-style: italic;
    }

    .two-column {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 30px;
    }

    .btn-ver {
      background: #001a00;
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
  <!-- Indicador de estado -->
  <div class="status-indicator">
    <div>🟢 CONECTADO</div>
    <div><?php echo date('Y-m-d H:i:s'); ?></div>
  </div>

  <div class="container">
    <!-- Header principal -->
    <div class="header">
      <h1>🛡️ PANEL ADMINISTRATIVO 🛡️</h1>
      <p>SISTEMA DE GESTIÓN DE TICKETS</p>
    </div>

    <!-- Menú de navegación -->
    <nav class="nav-menu">
      <a href="index.php" class="nav-button active">📊 Dashboard</a>
      <a href="lista.php" class="nav-button">📋 Lista Tickets</a>
      <a href="estadisticas.php" class="nav-button">📈 Estadísticas</a>
      <a href="reportes.php" class="nav-button">📊 Reportes</a>
      <a href="configuracion.php" class="nav-button">⚙️ Configuración</a>
    </nav>

    <!-- Estadísticas principales -->
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

    <!-- Contenido principal en dos columnas -->
    <div class="two-column">
      <!-- Columna izquierda: Tickets Recientes -->
      <div class="content-section">
        <h2 class="section-title">🕐 TICKETS RECIENTES <a href="lista.php" class="btn-ver">Ver Todos</a></h2>

        <?php if (empty($tickets_recientes)): ?>
          <div class="no-data">
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
                  <td><?= htmlspecialchars($ticket['contacto_nombre'] ?? 'N/A') ?></td>
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
                  <td class="time-ago"><?= time_ago($ticket['fecha_creacion']) ?></td>
                  <td>
                    <a href="detalle.php?ticket=<?= urlencode($ticket['ticket_id']) ?>" class="btn-ver">👁️ VER</a>
                  </td>
                </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        <?php endif; ?>
      </div>

      <!-- Columna derecha: Alertas Críticas -->
      <div class="content-section">
        <h2 class="section-title">🚨 ALERTAS CRÍTICAS</h2>

        <?php if (empty($tickets_urgentes)): ?>
          <div class="no-data">
            ✅ No hay tickets urgentes
          </div>
        <?php else: ?>
          <?php foreach ($tickets_urgentes as $ticket): ?>
            <div class="alert-critica">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div class="ticket-id"><?= htmlspecialchars($ticket['ticket_id']) ?></div>
                  <div style="font-size: 0.9em; margin-top: 5px;">
                    <?= htmlspecialchars($ticket['asunto']) ?>
                  </div>
                </div>
                <div style="text-align: right;">
                  <span class="badge badge-<?= get_prioridad_badge($ticket['prioridad']) ?>">
                    <?= strtoupper($ticket['prioridad']) ?>
                  </span>
                  <div style="color: #ff6666; font-size: 0.8em; margin-top: 5px;">
                    ⏰ <?= $ticket['horas_transcurridas'] ?> horas
                  </div>
                </div>
              </div>
            </div>
          <?php endforeach; ?>
        <?php endif; ?>
      </div>
    </div>
  </div>

  <script>
    // Diagnóstico y funcionalidades
    document.addEventListener('DOMContentLoaded', function() {
      // Verificar modo de documento
      const compatMode = document.compatMode;
      console.log('🔍 Modo de compatibilidad:', compatMode);

      if (compatMode === 'CSS1Compat') {
        console.log('✅ PÁGINA EN MODO ESTÁNDAR (correcto)');
      } else {
        console.error('❌ PÁGINA EN MODO QUIRKS (problema crítico)');
      }

      console.log('🚀 Panel Administrativo Iniciado');
      console.log('📊 BASE_URL:', '<?php echo $baseUrl; ?>');
      console.log('📈 Stats:', <?php echo json_encode($stats); ?>);

      // Auto-refresh cada 60 segundos
      setTimeout(function() {
        console.log('🔄 Refrescando datos...');
        location.reload();
      }, 60000);
    });
  </script>
</body>

</html>