<?php
require_once dirname(dirname(__DIR__)) . '/config.php';
startSecureSession();
$nonce = setSecurityHeaders();

require_once dirname(dirname(__DIR__)) . '/ErrorLogger.php';
ErrorLogger::initialize(dirname(dirname(__DIR__)) . '/logs/error.log');

// Verificar si el usuario está logueado
if (!isset($_SESSION['user_id'])) {
  header("Location: " . BASE_URL . "/Pages/Login/index.php");
  exit();
}

$baseUrl = BASE_URL;
$user_id = $_SESSION['user_id'];

// Obtener tickets del usuario
$tickets = [];
try {
  require_once dirname(dirname(__DIR__)) . '/models/SoporteTicket.php';
  $soporteTicket = new SoporteTicket();
  $tickets = $soporteTicket->obtenerTicketsUsuario($user_id, 20);
} catch (Exception $e) {
  error_log("Error obteniendo tickets: " . $e->getMessage());
}

// Función para formatear el estado
function formatearEstado($estado)
{
  $estados = [
    'abierto' => ['🔵', 'Abierto', 'status-abierto'],
    'en_proceso' => ['🟡', 'En Proceso', 'status-proceso'],
    'resuelto' => ['🟢', 'Resuelto', 'status-resuelto'],
    'cerrado' => ['⚫', 'Cerrado', 'status-cerrado']
  ];

  $info = $estados[$estado] ?? ['❓', 'Desconocido', 'status-unknown'];
  return "<span class='{$info[2]}'>{$info[0]} {$info[1]}</span>";
}

// Función para formatear la prioridad
function formatearPrioridad($prioridad)
{
  $prioridades = [
    'critica' => ['🔴', 'Crítica'],
    'alta' => ['🟠', 'Alta'],
    'media' => ['🟡', 'Media'],
    'baja' => ['🟢', 'Baja']
  ];

  $info = $prioridades[$prioridad] ?? ['❓', 'Desconocida'];
  return "{$info[0]} {$info[1]}";
}

// Función para formatear el tipo
function formatearTipo($tipo)
{
  $tipos = [
    'incidente_tecnico' => '🚨 Incidente Técnico',
    'reporte_error' => '🐛 Reporte de Error',
    'solicitud_cambio' => '🔧 Solicitud de Cambio',
    'consulta_funcionalidad' => '❓ Consulta Funcionalidad',
    'solicitud_capacitacion' => '📚 Solicitud Capacitación',
    'otros' => '📝 Otros'
  ];

  return $tipos[$tipo] ?? '❓ Desconocido';
}
?>

<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Historial de Tickets - TenkiWeb Soporte</title>
  <link rel="stylesheet" href="<?= $baseUrl ?>/assets/css/style.css">
  <link rel="stylesheet" href="<?= $baseUrl ?>/assets/css/common-components.css">
  <link rel="stylesheet" href="<?= $baseUrl ?>/Pages/Soporte/soporte.css?v=<?php echo time(); ?>">
</head>

<body>
  <?php require_once dirname(dirname(__DIR__)) . "/includes/molecules/header.php"; ?>

  <div class="historial-container">
    <div class="historial-header">
      <h1>📋 Mis Tickets de Soporte</h1>
      <a href="index.php" class="btn-nuevo-ticket">➕ Nuevo Ticket</a>
    </div>

    <?php
    // Mostrar mensaje de éxito si viene del formulario
    if (isset($_GET['success'])) {
      echo "<div class='mensaje-exito'>";
      echo "<strong>✅ " . htmlspecialchars($_GET['success']) . "</strong>";
      echo "</div>";
    }
    ?>

    <?php if (empty($tickets)): ?>
      <div class="no-tickets">
        <div style="font-size: 4em;">🎫</div>
        <h3>No tienes tickets de soporte</h3>
        <p>Cuando crees tu primer ticket de soporte, aparecerá aquí.</p>
        <a href="index.php" class="btn-nuevo-ticket">Crear Primer Ticket</a>
      </div>
    <?php else: ?>
      <div class="filtros-historial">
        <div class="filtros-row">
          <div class="filtro-group">
            <label>Estado:</label>
            <select id="filtroEstado" onchange="filtrarTickets()">
              <option value="">Todos los estados</option>
              <option value="abierto">Abiertos</option>
              <option value="en_proceso">En Proceso</option>
              <option value="resuelto">Resueltos</option>
              <option value="cerrado">Cerrados</option>
            </select>
          </div>

          <div class="filtro-group">
            <label>Prioridad:</label>
            <select id="filtroPrioridad" onchange="filtrarTickets()">
              <option value="">Todas las prioridades</option>
              <option value="critica">Crítica</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>

          <button class="btn-filtrar" onclick="limpiarFiltros()">Limpiar Filtros</button>
        </div>
      </div>

      <div class="table-responsive">
        <table class="tickets-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Asunto</th>
              <th class="hide-mobile">Tipo</th>
              <th>Prioridad</th>
              <th>Estado</th>
              <th class="hide-mobile">Creado</th>
              <th class="hide-mobile">Actualizado</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($tickets as $ticket): ?>
              <tr data-estado="<?= $ticket['estado'] ?>" data-prioridad="<?= $ticket['prioridad'] ?>">
                <td>
                  <span class="ticket-id"><?= htmlspecialchars($ticket['ticket_id']) ?></span>
                </td>
                <td>
                  <div class="ticket-asunto" title="<?= htmlspecialchars($ticket['asunto']) ?>">
                    <?= htmlspecialchars($ticket['asunto']) ?>
                  </div>
                  <small class="text-muted"><?= htmlspecialchars($ticket['empresa']) ?></small>
                </td>
                <td class="hide-mobile"><?= formatearTipo($ticket['tipo_solicitud']) ?></td>
                <td><?= formatearPrioridad($ticket['prioridad']) ?></td>
                <td><?= formatearEstado($ticket['estado']) ?></td>
                <td class="hide-mobile">
                  <div><?= date('d/m/Y', strtotime($ticket['fecha_creacion'])) ?></div>
                  <small class="fecha-relativa"><?= date('H:i', strtotime($ticket['fecha_creacion'])) ?></small>
                </td>
                <td class="hide-mobile">
                  <div><?= date('d/m/Y', strtotime($ticket['fecha_actualizacion'])) ?></div>
                  <small class="fecha-relativa"><?= date('H:i', strtotime($ticket['fecha_actualizacion'])) ?></small>
                </td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>

      <div class="text-center mt-3">
        <p class="text-muted">Total de tickets: <?= count($tickets) ?></p>
        <small class="text-muted">Los tickets se ordenan por fecha de creación (más recientes primero)</small>
      </div>
    <?php endif; ?>
  </div>

  <?php require_once dirname(dirname(__DIR__)) . "/includes/molecules/footer.php"; ?>

  <script nonce="<?= $nonce ?>">
    function filtrarTickets() {
      const filtroEstado = document.getElementById('filtroEstado').value;
      const filtroPrioridad = document.getElementById('filtroPrioridad').value;
      const filas = document.querySelectorAll('.tickets-table tbody tr');

      filas.forEach(fila => {
        const estado = fila.getAttribute('data-estado');
        const prioridad = fila.getAttribute('data-prioridad');

        const mostrarEstado = !filtroEstado || estado === filtroEstado;
        const mostrarPrioridad = !filtroPrioridad || prioridad === filtroPrioridad;

        if (mostrarEstado && mostrarPrioridad) {
          fila.style.display = '';
        } else {
          fila.style.display = 'none';
        }
      });

      // Contar tickets visibles
      const ticketsVisibles = document.querySelectorAll('.tickets-table tbody tr:not([style*="display: none"])').length;
      console.log(`Mostrando ${ticketsVisibles} tickets`);
    }

    function limpiarFiltros() {
      document.getElementById('filtroEstado').value = '';
      document.getElementById('filtroPrioridad').value = '';
      filtrarTickets();
    }

    // Hacer clickeable las filas (futuro: ver detalles del ticket)
    document.querySelectorAll('.tickets-table tbody tr').forEach(fila => {
      fila.style.cursor = 'pointer';
      fila.addEventListener('click', function() {
        const ticketId = this.querySelector('.ticket-id').textContent;
        // Futuro: abrir modal o página de detalles
        console.log('Clicked ticket:', ticketId);
      });
    });
  </script>
</body>

</html>