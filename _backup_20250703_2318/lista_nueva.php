<?php
// ==========================================
// LISTA.PHP - DATOS REALES CON TEMA HACKER
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

// Configuración de errores
error_reporting(0);
ini_set('display_errors', '0');

// Variables iniciales
$filtro_estado = $_GET['estado'] ?? '';
$filtro_prioridad = $_GET['prioridad'] ?? '';
$filtro_empresa = $_GET['empresa'] ?? '';
$buscar = $_GET['buscar'] ?? '';
$pagina = max(1, (int)($_GET['pagina'] ?? 1));
$por_pagina = 20;
$offset = ($pagina - 1) * $por_pagina;

$tickets = [];
$total_tickets = 0;
$filtros_aplicados = [];
$empresas = [];
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

      // Construir consulta con filtros
      $where_conditions = ["1=1"];
      $params = [];

      if (!empty($filtro_estado)) {
        $where_conditions[] = "estado = ?";
        $params[] = $filtro_estado;
        $filtros_aplicados[] = "Estado: " . ucfirst($filtro_estado);
      }

      if (!empty($filtro_prioridad)) {
        $where_conditions[] = "prioridad = ?";
        $params[] = $filtro_prioridad;
        $filtros_aplicados[] = "Prioridad: " . ucfirst($filtro_prioridad);
      }

      if (!empty($filtro_empresa)) {
        $where_conditions[] = "empresa LIKE ?";
        $params[] = "%{$filtro_empresa}%";
        $filtros_aplicados[] = "Empresa: {$filtro_empresa}";
      }

      if (!empty($buscar)) {
        $where_conditions[] = "(asunto LIKE ? OR descripcion LIKE ? OR ticket_id LIKE ?)";
        $params[] = "%{$buscar}%";
        $params[] = "%{$buscar}%";
        $params[] = "%{$buscar}%";
        $filtros_aplicados[] = "Búsqueda: {$buscar}";
      }

      $where_clause = implode(" AND ", $where_conditions);

      // Contar total de resultados
      $stmt_count = $pdo->prepare("SELECT COUNT(*) as total FROM soporte_tickets WHERE {$where_clause}");
      $stmt_count->execute($params);
      $total_tickets = $stmt_count->fetch()['total'];

      // Obtener tickets con paginación
      $stmt_tickets = $pdo->prepare("
              SELECT 
                  ticket_id,
                  asunto,
                  estado,
                  prioridad,
                  empresa,
                  nombre_contacto,
                  contacto_email,
                  fecha_creacion,
                  fecha_actualizacion,
                  TIMESTAMPDIFF(HOUR, fecha_creacion, NOW()) as horas_transcurridas
              FROM soporte_tickets 
              WHERE {$where_clause}
              ORDER BY fecha_creacion DESC 
              LIMIT {$por_pagina} OFFSET {$offset}
          ");
      $stmt_tickets->execute($params);
      $tickets = $stmt_tickets->fetchAll(PDO::FETCH_ASSOC);

      // Obtener listas para filtros
      $stmt_empresas = $pdo->query("SELECT DISTINCT empresa FROM soporte_tickets WHERE empresa IS NOT NULL AND empresa != '' ORDER BY empresa");
      $empresas = $stmt_empresas->fetchAll(PDO::FETCH_COLUMN);

      $datos_reales_obtenidos = true;
    }
  }
} catch (Exception $e) {
  // Si falla la BD, usar datos de ejemplo
  $tickets = [
    [
      'ticket_id' => 'TK-001',
      'asunto' => 'Problema con el sistema de login',
      'estado' => 'nuevo',
      'prioridad' => 'alta',
      'empresa' => 'TekiWeb Solutions',
      'nombre_contacto' => 'Juan Pérez',
      'contacto_email' => 'juan.perez@tekiweb.com',
      'fecha_creacion' => date('Y-m-d H:i:s', strtotime('-2 hours')),
      'horas_transcurridas' => 2
    ],
    [
      'ticket_id' => 'TK-002',
      'asunto' => 'Error en la base de datos',
      'estado' => 'abierto',
      'prioridad' => 'critica',
      'empresa' => 'Sistemas Corp',
      'nombre_contacto' => 'María García',
      'contacto_email' => 'maria.garcia@sistemas.com',
      'fecha_creacion' => date('Y-m-d H:i:s', strtotime('-4 hours')),
      'horas_transcurridas' => 4
    ]
  ];
  $total_tickets = count($tickets);
  $empresas = ['TekiWeb Solutions', 'Sistemas Corp', 'Digital SA'];
}

// Calcular paginación
$total_paginas = ceil($total_tickets / $por_pagina);

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
  <title>📋 LISTA DE TICKETS - <?php echo date('H:i:s'); ?></title>
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

    .filter-section {
      background: rgba(0, 255, 0, 0.05);
      border: 1px solid #00ff00;
      border-radius: 10px;
      padding: 20px;
      margin: 20px 0;
    }

    .filter-title {
      font-size: 1.2em;
      margin-bottom: 15px;
      color: #00ff00;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .filter-form {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      align-items: end;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-label {
      color: #00ff00;
      font-size: 0.9em;
      margin-bottom: 5px;
      text-transform: uppercase;
    }

    .form-control {
      background: #001a00;
      border: 1px solid #00ff00;
      color: #00ff00;
      padding: 8px 12px;
      border-radius: 5px;
      font-family: 'Courier New', monospace;
    }

    .form-control:focus {
      outline: none;
      box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
    }

    .btn {
      background: #001a00;
      color: #00ff00;
      border: 2px solid #00ff00;
      padding: 8px 16px;
      border-radius: 5px;
      font-family: 'Courier New', monospace;
      font-weight: bold;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-block;
    }

    .btn:hover {
      background: #00ff00;
      color: #000000;
      text-decoration: none;
    }

    .btn-secondary {
      background: #333;
      border-color: #666;
      color: #ccc;
    }

    .btn-secondary:hover {
      background: #666;
      color: #fff;
    }

    .tickets-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      background: rgba(0, 255, 0, 0.02);
      border: 1px solid #00ff00;
      border-radius: 10px;
      overflow: hidden;
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

    .pagination {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin: 30px 0;
    }

    .pagination a {
      background: #001a00;
      color: #00ff00;
      border: 1px solid #00ff00;
      padding: 8px 12px;
      text-decoration: none;
      border-radius: 5px;
      font-family: 'Courier New', monospace;
      transition: all 0.3s ease;
    }

    .pagination a:hover,
    .pagination a.active {
      background: #00ff00;
      color: #000000;
    }

    .stats-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 20px 0;
      padding: 15px;
      background: rgba(0, 255, 0, 0.05);
      border: 1px solid #00ff00;
      border-radius: 8px;
    }

    @media (max-width: 768px) {
      .container {
        padding: 10px;
      }

      .filter-form {
        grid-template-columns: 1fr;
      }

      .nav-menu {
        flex-direction: column;
        align-items: center;
      }

      .stats-row {
        flex-direction: column;
        gap: 10px;
      }
    }
  </style>
</head>

<body>
  <div class="status-indicator">
    🟢 SISTEMA ACTIVO | <?php echo date('H:i:s'); ?> |
    <?php echo $datos_reales_obtenidos ? '🔗 BD REAL' : '⚠️ BD DEMO'; ?> |
    Total: <?php echo $total_tickets; ?>
  </div>

  <div class="container">
    <div class="header">
      <h1>📋 LISTA DE TICKETS</h1>
      <p>GESTIÓN COMPLETA DE TICKETS</p>
    </div>

    <nav class="nav-menu">
      <a href="index.php" class="nav-button">📊 Dashboard</a>
      <a href="lista.php" class="nav-button active">📋 Lista Tickets</a>
      <a href="estadisticas.php" class="nav-button">📈 Estadísticas</a>
      <a href="reportes.php" class="nav-button">📊 Reportes</a>
      <a href="configuracion.php" class="nav-button">⚙️ Configuración</a>
    </nav>

    <!-- Filtros de Búsqueda -->
    <div class="filter-section">
      <div class="filter-title">🔍 Filtros de Búsqueda</div>
      <form method="GET" class="filter-form">
        <div class="form-group">
          <label class="form-label">Estado</label>
          <select name="estado" class="form-control">
            <option value="">Todos los estados</option>
            <option value="nuevo" <?= $filtro_estado === 'nuevo' ? 'selected' : '' ?>>Nuevo</option>
            <option value="abierto" <?= $filtro_estado === 'abierto' ? 'selected' : '' ?>>Abierto</option>
            <option value="en_proceso" <?= $filtro_estado === 'en_proceso' ? 'selected' : '' ?>>En Proceso</option>
            <option value="resuelto" <?= $filtro_estado === 'resuelto' ? 'selected' : '' ?>>Resuelto</option>
            <option value="cerrado" <?= $filtro_estado === 'cerrado' ? 'selected' : '' ?>>Cerrado</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Prioridad</label>
          <select name="prioridad" class="form-control">
            <option value="">Todas las prioridades</option>
            <option value="critica" <?= $filtro_prioridad === 'critica' ? 'selected' : '' ?>>Crítica</option>
            <option value="alta" <?= $filtro_prioridad === 'alta' ? 'selected' : '' ?>>Alta</option>
            <option value="media" <?= $filtro_prioridad === 'media' ? 'selected' : '' ?>>Media</option>
            <option value="baja" <?= $filtro_prioridad === 'baja' ? 'selected' : '' ?>>Baja</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Empresa</label>
          <select name="empresa" class="form-control">
            <option value="">Todas las empresas</option>
            <?php foreach ($empresas as $empresa): ?>
              <option value="<?= htmlspecialchars($empresa) ?>" <?= $filtro_empresa === $empresa ? 'selected' : '' ?>>
                <?= htmlspecialchars($empresa) ?>
              </option>
            <?php endforeach; ?>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Búsqueda</label>
          <input type="text" name="buscar" class="form-control" placeholder="Buscar en tickets..." value="<?= htmlspecialchars($buscar) ?>">
        </div>
        <div class="form-group">
          <button type="submit" class="btn">🔍 Filtrar</button>
        </div>
        <div class="form-group">
          <a href="lista.php" class="btn btn-secondary">❌ Limpiar</a>
        </div>
      </form>
    </div>

    <!-- Información de filtros aplicados -->
    <?php if (!empty($filtros_aplicados)): ?>
      <div class="stats-row">
        <span>🔍 Filtros aplicados: <?= implode(', ', $filtros_aplicados) ?></span>
        <a href="lista.php" class="btn btn-secondary">Limpiar filtros</a>
      </div>
    <?php endif; ?>

    <!-- Estadísticas -->
    <div class="stats-row">
      <span>📊 Total de tickets: <strong><?= $total_tickets ?></strong></span>
      <span>📄 Página <?= $pagina ?> de <?= max(1, $total_paginas) ?></span>
      <a href="lista.php" class="btn">🔄 Actualizar</a>
    </div>

    <!-- Tabla de tickets -->
    <?php if (empty($tickets)): ?>
      <div style="text-align: center; padding: 40px; border: 1px solid #00ff00; border-radius: 10px; background: rgba(0, 255, 0, 0.05);">
        📥 No hay tickets para mostrar con los filtros aplicados
      </div>
    <?php else: ?>
      <table class="tickets-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Asunto</th>
            <th>Estado</th>
            <th>Prioridad</th>
            <th>Empresa</th>
            <th>Contacto</th>
            <th>Creado</th>
            <th>Tiempo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($tickets as $ticket): ?>
            <tr>
              <td class="ticket-id"><?= htmlspecialchars($ticket['ticket_id']) ?></td>
              <td><?= htmlspecialchars(substr($ticket['asunto'], 0, 50)) ?><?= strlen($ticket['asunto']) > 50 ? '...' : '' ?></td>
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
              <td><?= htmlspecialchars($ticket['empresa'] ?? '') ?></td>
              <td>
                <div>
                  <strong><?= htmlspecialchars($ticket['nombre_contacto'] ?? '') ?></strong><br>
                  <small style="opacity: 0.7;"><?= htmlspecialchars($ticket['contacto_email'] ?? '') ?></small>
                </div>
              </td>
              <td style="font-size: 0.8em;"><?= time_ago($ticket['fecha_creacion']) ?></td>
              <td style="font-size: 0.8em;"><?= $ticket['horas_transcurridas'] ?? 0 ?>h</td>
              <td>
                <a href="detalle.php?ticket=<?= urlencode($ticket['ticket_id']) ?>" class="btn-ver">👁️ VER</a>
              </td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    <?php endif; ?>

    <!-- Paginación -->
    <?php if ($total_paginas > 1): ?>
      <div class="pagination">
        <?php if ($pagina > 1): ?>
          <a href="?pagina=<?= $pagina - 1 ?>&estado=<?= urlencode($filtro_estado) ?>&prioridad=<?= urlencode($filtro_prioridad) ?>&empresa=<?= urlencode($filtro_empresa) ?>&buscar=<?= urlencode($buscar) ?>">‹ Anterior</a>
        <?php endif; ?>

        <?php for ($i = max(1, $pagina - 2); $i <= min($total_paginas, $pagina + 2); $i++): ?>
          <a href="?pagina=<?= $i ?>&estado=<?= urlencode($filtro_estado) ?>&prioridad=<?= urlencode($filtro_prioridad) ?>&empresa=<?= urlencode($filtro_empresa) ?>&buscar=<?= urlencode($buscar) ?>"
            class="<?= $i === $pagina ? 'active' : '' ?>">
            <?= $i ?>
          </a>
        <?php endfor; ?>

        <?php if ($pagina < $total_paginas): ?>
          <a href="?pagina=<?= $pagina + 1 ?>&estado=<?= urlencode($filtro_estado) ?>&prioridad=<?= urlencode($filtro_prioridad) ?>&empresa=<?= urlencode($filtro_empresa) ?>&buscar=<?= urlencode($buscar) ?>">Siguiente ›</a>
        <?php endif; ?>
      </div>
    <?php endif; ?>
  </div>
</body>

</html>