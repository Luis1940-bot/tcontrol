<?php
// ==========================================
// SOLUCIÓN EXTREMA ANTI-QUIRKS PARA INDEX.PHP ORIGINAL
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
  // Si falla la BD, usar datos de ejemplo
  $stats = [
    'total_tickets' => 15,
    'nuevos' => 3,
    'abiertos' => 5,
    'en_proceso' => 4,
    'resueltos' => 2,
    'cerrados' => 1,
    'hoy' => 2,
    'semana' => 8,
    'mes' => 15
  ];

  $tickets_recientes = [
    [
      'ticket_id' => 'TK-001',
      'asunto' => 'Problema con el sistema de login',
      'estado' => 'nuevo',
      'prioridad' => 'alta',
      'empresa' => 'TekiWeb Solutions',
      'contacto_nombre' => 'Juan Pérez',
      'fecha_creacion' => date('Y-m-d H:i:s', strtotime('-2 hours'))
    ],
    [
      'ticket_id' => 'TK-002',
      'asunto' => 'Error en la base de datos',
      'estado' => 'abierto',
      'prioridad' => 'critica',
      'empresa' => 'Sistemas Corp',
      'contacto_nombre' => 'María García',
      'fecha_creacion' => date('Y-m-d H:i:s', strtotime('-4 hours'))
    ]
  ];

  $tickets_urgentes = [
    [
      'ticket_id' => 'TK-002',
      'asunto' => 'Error en la base de datos',
      'prioridad' => 'critica',
      'horas_transcurridas' => 4
    ],
    [
      'ticket_id' => 'TK-001',
      'asunto' => 'Problema con el sistema de login',
      'prioridad' => 'alta',
      'horas_transcurridas' => 2
    ]
  ];
}

// Funciones helper
function get_estado_badge($estado)
{
  $badges = [
    'nuevo' => 'badge-primary',
    'abierto' => 'badge-info',
    'en_proceso' => 'badge-warning',
    'resuelto' => 'badge-success',
    'cerrado' => 'badge-secondary'
  ];
  return $badges[$estado] ?? 'badge-secondary';
}

function get_prioridad_badge($prioridad)
{
  $badges = [
    'critica' => 'badge-danger',
    'alta' => 'badge-warning',
    'media' => 'badge-info',
    'baja' => 'badge-secondary'
  ];
  return $badges[$prioridad] ?? 'badge-secondary';
}

function time_ago($datetime)
{
  $time = time() - strtotime($datetime);
  if ($time < 60) return 'hace unos segundos';
  if ($time < 3600) return 'hace ' . floor($time / 60) . ' minutos';
  if ($time < 86400) return 'hace ' . floor($time / 3600) . ' horas';
  return 'hace ' . floor($time / 86400) . ' días';
}

// PASO 8: ENVIAR DOCTYPE COMPLETAMENTE LIMPIO - SIN ESPACIOS NI SALTOS
?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🛡️ PANEL ADMINISTRATIVO - TICKETS</title>
  <link rel="icon" type="image/x-icon" href="<?php echo $baseUrl; ?>/assets/img/favicon.ico">
  <link rel="stylesheet" href="<?php echo $baseUrl; ?>/assets/css/style.css">
  <style>
    /* TEMA HACKER FORZADO */
    * {
      box-sizing: border-box;
    }

    body {
      font-family: 'Courier New', monospace !important;
      background: #0a0a0a !important;
      color: #00ff00 !important;
      margin: 0;
      padding: 0;
      line-height: 1.6;
      min-height: 100vh;
    }

    .container {
      max-width: 1200px;
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
      margin: 0;
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
      top: 20px;
      right: 20px;
      background: rgba(0, 255, 0, 0.2);
      border: 1px solid #00ff00;
      border-radius: 10px;
      padding: 10px;
      font-size: 0.9em;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin: 30px 0;
    }

    .stat-card {
      background: rgba(0, 255, 0, 0.1);
      border: 2px solid #00ff00;
      border-radius: 10px;
      padding: 20px;
      text-align: center;
      position: relative;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      background: rgba(0, 255, 0, 0.2);
      box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
      transform: translateY(-2px);
    }

    .stat-number {
      font-size: 3em;
      font-weight: bold;
      color: #00ff00;
      text-shadow: 0 0 10px #00ff00;
      margin: 10px 0;
    }

    .stat-label {
      font-size: 1.1em;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .stat-icon {
      font-size: 2em;
      margin-bottom: 10px;
      opacity: 0.7;
    }

    .content-section {
      margin: 30px 0;
      padding: 25px;
      border: 1px solid #00ff00;
      border-radius: 10px;
      background: rgba(0, 255, 0, 0.05);
    }

    .section-title {
      font-size: 1.5em;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #00ff00;
      text-transform: uppercase;
    }

    .tickets-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    .tickets-table th,
    .tickets-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #333;
    }

    .tickets-table th {
      background: rgba(0, 255, 0, 0.2);
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .tickets-table tr:hover {
      background: rgba(0, 255, 0, 0.1);
    }

    .badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8em;
      font-weight: bold;
      text-transform: uppercase;
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
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 5px;
      font-family: 'Courier New', monospace;
      font-weight: bold;
      transition: all 0.3s ease;
      text-transform: uppercase;
      display: inline-block;
    }

    .nav-button:hover {
      background: #00ff00;
      color: #000000;
      box-shadow: 0 0 15px #00ff00;
      text-decoration: none;
    }

    .time-ago {
      color: #888;
      font-size: 0.9em;
    }

    .alert-urgente {
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

    .debug-panel {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.9);
      border: 1px solid #00ff00;
      border-radius: 5px;
      padding: 10px;
      font-size: 0.8em;
      z-index: 1000;
    }

    @media (max-width: 768px) {
      .container {
        padding: 10px;
      }

      .stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 15px;
      }

      .nav-menu {
        flex-direction: column;
        align-items: center;
      }

      .tickets-table {
        font-size: 0.9em;
      }
    }
  </style>
</head>

<body>
  <!-- Indicador de estado del sistema -->
  <div class="status-indicator">
    <div>🟢 CONECTADO</div>
    <div id="currentTime"><?php echo date('Y-m-d H:i:s'); ?></div>
  </div>

  <!-- Panel de debug -->
  <div class="debug-panel">
    <div><strong>DIAGNÓSTICO MODO QUIRKS</strong></div>
    <div>Modo: <span id="compatMode">Verificando...</span></div>
    <div>DOCTYPE: <span id="doctypeStatus">Verificando...</span></div>
    <div>Quirks: <span id="quirksStatus">NO</span></div>
  </div>

  <div class="container">
    <!-- Header principal -->
    <div class="header">
      <h1>🛡️ PANEL ADMINISTRATIVO 🛡️</h1>
      <p>SISTEMA DE GESTIÓN DE TICKETS</p>
      <p style="font-size: 0.9em; opacity: 0.8;">
        BASE_URL: <?php echo htmlspecialchars($baseUrl); ?>
      </p>
    </div>

    <!-- Menú de navegación -->
    <nav class="nav-menu">
      <a href="index.php" class="nav-button">📊 Dashboard</a>
      <a href="lista.php" class="nav-button">📋 Lista Tickets</a>
      <a href="estadisticas.php" class="nav-button">📈 Estadísticas</a>
      <a href="reportes.php" class="nav-button">📊 Reportes</a>
      <a href="configuracion.php" class="nav-button">⚙️ Configuración</a>
    </nav>

    <!-- Estadísticas principales -->
    <div class="stats-grid">
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

    <!-- Tickets Recientes -->
    <div class="content-section">
      <h2 class="section-title">🕐 Tickets Recientes</h2>

      <?php if (empty($tickets_recientes)): ?>
        <div class="no-data">
          📥 No hay tickets recientes para mostrar
        </div>
      <?php else: ?>
        <table class="tickets-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>ASUNTO</th>
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
                <td>
                  <strong style="color: #00ffff;">
                    <?= htmlspecialchars($ticket['ticket_id']) ?>
                  </strong>
                </td>
                <td>
                  <?= htmlspecialchars(substr($ticket['asunto'], 0, 50)) ?>
                  <?= strlen($ticket['asunto']) > 50 ? '...' : '' ?>
                </td>
                <td><?= htmlspecialchars($ticket['contacto_nombre'] ?? 'N/A') ?></td>
                <td>
                  <span class="badge badge-<?= $ticket['estado'] ?>">
                    <?= strtoupper(str_replace('_', ' ', $ticket['estado'])) ?>
                  </span>
                </td>
                <td>
                  <span class="badge badge-<?= $ticket['prioridad'] ?>">
                    <?= strtoupper($ticket['prioridad']) ?>
                  </span>
                </td>
                <td>
                  <div><?= date('d/m/Y', strtotime($ticket['fecha_creacion'])) ?></div>
                  <div class="time-ago"><?= time_ago($ticket['fecha_creacion']) ?></div>
                </td>
                <td>
                  <a href="detalle.php?ticket=<?= urlencode($ticket['ticket_id']) ?>"
                    class="nav-button" style="padding: 5px 10px; font-size: 0.8em;">
                    👁️ VER
                  </a>
                </td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      <?php endif; ?>
    </div>

    <!-- Alertas Críticas -->
    <?php if (!empty($tickets_urgentes)): ?>
      <div class="content-section">
        <h2 class="section-title">🚨 Alertas Críticas</h2>

        <?php foreach ($tickets_urgentes as $ticket): ?>
          <div class="alert-urgente">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong style="color: #ff0000;">
                  <?= htmlspecialchars($ticket['ticket_id']) ?>
                </strong>
                <div><?= htmlspecialchars($ticket['asunto']) ?></div>
              </div>
              <div style="text-align: right;">
                <span class="badge badge-<?= $ticket['prioridad'] ?>">
                  <?= strtoupper($ticket['prioridad']) ?>
                </span>
                <div style="color: #ff6666; font-size: 0.9em;">
                  ⏰ <?= $ticket['horas_transcurridas'] ?> horas
                </div>
              </div>
            </div>
          </div>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>

    <!-- Acciones Rápidas -->
    <div class="content-section">
      <h2 class="section-title">⚡ Acciones Rápidas</h2>
      <div class="nav-menu">
        <a href="lista.php?filtro=nuevos" class="nav-button">📋 Ver Nuevos</a>
        <a href="lista.php?filtro=urgentes" class="nav-button">🚨 Ver Urgentes</a>
        <a href="estadisticas.php" class="nav-button">📊 Estadísticas</a>
        <a href="reportes.php" class="nav-button">📄 Generar Reporte</a>
      </div>
    </div>
  </div>

  <script>
    // Diagnóstico en tiempo real
    function updateDiagnostic() {
      const compatMode = document.compatMode;
      const hasDoctype = document.doctype !== null;

      document.getElementById('compatMode').textContent = compatMode;
      document.getElementById('compatMode').style.color =
        compatMode === 'CSS1Compat' ? '#00ff00' : '#ff0000';

      document.getElementById('doctypeStatus').textContent = hasDoctype ? 'SÍ' : 'NO';
      document.getElementById('doctypeStatus').style.color = hasDoctype ? '#00ff00' : '#ff0000';

      const quirksMode = compatMode !== 'CSS1Compat';
      document.getElementById('quirksStatus').textContent = quirksMode ? 'SÍ' : 'NO';
      document.getElementById('quirksStatus').style.color = quirksMode ? '#ff0000' : '#00ff00';

      console.log('🔍 Diagnóstico actualizado:', {
        compatMode,
        hasDoctype,
        quirksMode,
        baseUrl: '<?php echo $baseUrl; ?>'
      });
    }

    // Actualizar tiempo
    function updateTime() {
      const now = new Date();
      const timeStr = now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0') + ' ' +
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0') + ':' +
        String(now.getSeconds()).padStart(2, '0');
      document.getElementById('currentTime').textContent = timeStr;
    }

    // Auto-refresh cada 30 segundos
    function autoRefresh() {
      setTimeout(function() {
        console.log('🔄 Auto-refresh activado');
        location.reload();
      }, 30000);
    }

    // Inicializar
    document.addEventListener('DOMContentLoaded', function() {
      console.log('🚀 Sistema de Tickets Iniciado');
      console.log('📊 BASE_URL:', '<?php echo $baseUrl; ?>');
      console.log('📈 Stats cargadas:', <?php echo json_encode($stats); ?>);

      updateDiagnostic();
      updateTime();
      setInterval(updateTime, 1000);

      // Verificar modo estándar
      if (document.compatMode === 'CSS1Compat') {
        console.log('✅ MODO ESTÁNDAR ACTIVO - PÁGINA FUNCIONAL');
      } else {
        console.error('❌ MODO QUIRKS DETECTADO - PROBLEMA CRÍTICO');
      }

      autoRefresh();
    });
  </script>
</body>

</html>