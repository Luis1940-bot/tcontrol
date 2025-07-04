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

$baseUrl = BASE_URL;
$ticket_id = $_GET['ticket'] ?? '';

if (empty($ticket_id)) {
  header('Location: lista.php');
  exit;
}

// Procesar respuesta si se envía
$mensaje_exito = '';
$mensaje_error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
  try {
    switch ($_POST['action']) {
      case 'responder':
        $autor_nombre = $_POST['autor_nombre'] ?? 'Administrador';
        $autor_email = $_POST['autor_email'] ?? 'admin@tenkiweb.com';
        $mensaje = trim($_POST['mensaje'] ?? '');
        $es_privada = isset($_POST['es_privada']) ? 1 : 0;

        if (empty($mensaje)) {
          throw new Exception('El mensaje no puede estar vacío');
        }

        // Insertar respuesta
        $stmt = $pdo->prepare("
                    INSERT INTO soporte_respuestas 
                    (ticket_id, tipo_respuesta, autor_nombre, autor_email, mensaje, es_privada) 
                    VALUES (?, 'soporte', ?, ?, ?, ?)
                ");
        $stmt->execute([$ticket_id, $autor_nombre, $autor_email, $mensaje, $es_privada]);

        // Actualizar estado del ticket si no está abierto
        $stmt_update = $pdo->prepare("
                    UPDATE soporte_tickets 
                    SET estado = CASE 
                        WHEN estado = 'nuevo' THEN 'abierto'
                        ELSE estado 
                    END
                    WHERE ticket_id = ?
                ");
        $stmt_update->execute([$ticket_id]);

        $mensaje_exito = 'Respuesta enviada correctamente';
        break;

      case 'cambiar_estado':
        $nuevo_estado = $_POST['nuevo_estado'] ?? '';
        $comentarios = trim($_POST['comentarios'] ?? '');

        if (empty($nuevo_estado)) {
          throw new Exception('Debe seleccionar un estado');
        }

        $stmt = $pdo->prepare("
                    UPDATE soporte_tickets 
                    SET estado = ?, 
                        comentarios_internos = CASE 
                            WHEN ? != '' THEN CONCAT(COALESCE(comentarios_internos, ''), '\n--- ', NOW(), ' ---\n', ?)
                            ELSE comentarios_internos 
                        END,
                        fecha_resolucion = CASE 
                            WHEN ? IN ('resuelto', 'cerrado') THEN NOW()
                            ELSE fecha_resolucion 
                        END
                    WHERE ticket_id = ?
                ");
        $stmt->execute([$nuevo_estado, $comentarios, $comentarios, $nuevo_estado, $ticket_id]);

        $mensaje_exito = 'Estado actualizado correctamente';
        break;

      case 'cambiar_prioridad':
        $nueva_prioridad = $_POST['nueva_prioridad'] ?? '';

        if (empty($nueva_prioridad)) {
          throw new Exception('Debe seleccionar una prioridad');
        }

        $stmt = $pdo->prepare("UPDATE soporte_tickets SET prioridad = ? WHERE ticket_id = ?");
        $stmt->execute([$nueva_prioridad, $ticket_id]);

        $mensaje_exito = 'Prioridad actualizada correctamente';
        break;
    }
  } catch (Exception $e) {
    ErrorLogger::log("❌ Error procesando acción: " . $e->getMessage());
    $mensaje_error = $e->getMessage();
  }
}

// Obtener información del ticket
try {
  $stmt = $pdo->prepare("
        SELECT t.*, 
               TIMESTAMPDIFF(HOUR, t.fecha_creacion, NOW()) as horas_transcurridas,
               TIMESTAMPDIFF(HOUR, t.fecha_creacion, COALESCE(t.fecha_resolucion, NOW())) as tiempo_resolucion_horas
        FROM soporte_tickets t 
        WHERE t.ticket_id = ?
    ");
  $stmt->execute([$ticket_id]);
  $ticket = $stmt->fetch(PDO::FETCH_ASSOC);

  if (!$ticket) {
    throw new Exception('Ticket no encontrado');
  }

  // Obtener respuestas
  $stmt_respuestas = $pdo->prepare("
        SELECT * FROM soporte_respuestas 
        WHERE ticket_id = ? 
        ORDER BY fecha_respuesta ASC
    ");
  $stmt_respuestas->execute([$ticket_id]);
  $respuestas = $stmt_respuestas->fetchAll(PDO::FETCH_ASSOC);

  // Obtener archivos adjuntos
  $stmt_archivos = $pdo->prepare("
        SELECT * FROM soporte_archivos 
        WHERE ticket_id = ? 
        ORDER BY fecha_subida ASC
    ");
  $stmt_archivos->execute([$ticket_id]);
  $archivos = $stmt_archivos->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $e) {
  ErrorLogger::log("❌ Error obteniendo ticket: " . $e->getMessage());
  header('Location: lista.php');
  exit;
}

// Funciones helper
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

function get_estado_badge($estado)
{
  $badges = [
    'nuevo' => 'badge-primary',
    'abierto' => 'badge-warning',
    'en_proceso' => 'badge-info',
    'resuelto' => 'badge-success',
    'cerrado' => 'badge-dark'
  ];
  return $badges[$estado] ?? 'badge-secondary';
}

function tiempo_transcurrido($fecha)
{
  $ahora = new DateTime();
  $fecha_ticket = new DateTime($fecha);
  $diff = $ahora->diff($fecha_ticket);

  if ($diff->days > 0) {
    return $diff->days . ' día' . ($diff->days > 1 ? 's' : '');
  } elseif ($diff->h > 0) {
    return $diff->h . ' hora' . ($diff->h > 1 ? 's' : '');
  } else {
    return $diff->i . ' min';
  }
}

function formatear_mensaje($mensaje)
{
  // Convertir enlaces
  $mensaje = preg_replace('/(https?:\/\/[^\s]+)/', '<a href="$1" target="_blank" class="text-primary">$1</a>', $mensaje);

  // Convertir saltos de línea
  $mensaje = nl2br(htmlspecialchars($mensaje, ENT_QUOTES, 'UTF-8', false));

  return $mensaje;
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
  <title>Ticket <?= htmlspecialchars($ticket['ticket_id']) ?> - Administración</title>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎫</text></svg>">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
  <link href="detalle.css" rel="stylesheet">
</head>

<body>
  <div class="container-fluid">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center py-3 border-bottom">
          <div class="d-flex align-items-center">
            <a href="lista.php" class="btn btn-outline-secondary me-3">
              <i class="fas fa-arrow-left"></i>
            </a>
            <div>
              <h1 class="h3 mb-0">
                Ticket <?= htmlspecialchars($ticket['ticket_id']) ?>
              </h1>
              <p class="text-muted mb-0">
                Creado hace <?= tiempo_transcurrido($ticket['fecha_creacion']) ?>
              </p>
            </div>
          </div>
          <div class="d-flex gap-2">
            <span class="badge <?= get_estado_badge($ticket['estado']) ?> fs-6">
              <?= ucfirst(str_replace('_', ' ', $ticket['estado'])) ?>
            </span>
            <span class="badge <?= get_prioridad_badge($ticket['prioridad']) ?> fs-6">
              <?= ucfirst($ticket['prioridad']) ?>
            </span>
          </div>
        </div>
      </div>
    </div>

    <?php if ($mensaje_exito): ?>
      <div class="alert alert-success alert-dismissible fade show" role="alert">
        <i class="fas fa-check-circle me-2"></i><?= htmlspecialchars($mensaje_exito) ?>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    <?php endif; ?>

    <?php if ($mensaje_error): ?>
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <i class="fas fa-exclamation-triangle me-2"></i><?= htmlspecialchars($mensaje_error) ?>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    <?php endif; ?>

    <div class="row">
      <!-- Información del ticket -->
      <div class="col-lg-8">
        <!-- Detalles principales -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="fas fa-ticket-alt me-2"></i>
              Información del Ticket
            </h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <h6 class="fw-bold mb-3"><?= htmlspecialchars($ticket['asunto']) ?></h6>
                <div class="mb-3">
                  <strong>Empresa/Cliente:</strong><br>
                  <?= htmlspecialchars($ticket['empresa']) ?>
                </div>
                <div class="mb-3">
                  <strong>Contacto:</strong><br>
                  <?= htmlspecialchars($ticket['nombre_contacto']) ?><br>
                  <a href="mailto:<?= htmlspecialchars($ticket['email_contacto']) ?>">
                    <?= htmlspecialchars($ticket['email_contacto']) ?>
                  </a>
                  <?php if (!empty($ticket['telefono'])): ?>
                    <br><?= htmlspecialchars($ticket['telefono']) ?>
                  <?php endif; ?>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <strong>Tipo de solicitud:</strong><br>
                  <span class="badge bg-secondary"><?= ucfirst(str_replace('_', ' ', $ticket['tipo_solicitud'])) ?></span>
                </div>
                <div class="mb-3">
                  <strong>Tipo de cliente:</strong><br>
                  <?= ucfirst(str_replace('_', ' ', $ticket['tipo_cliente'] ?? 'No especificado')) ?>
                </div>
                <?php if (!empty($ticket['planta_cliente'])): ?>
                  <div class="mb-3">
                    <strong>Planta/Ubicación:</strong><br>
                    <?= htmlspecialchars($ticket['planta_cliente']) ?>
                  </div>
                <?php endif; ?>
              </div>
            </div>

            <div class="mb-3">
              <strong>Descripción:</strong>
              <div class="bg-light p-3 rounded mt-2">
                <?= formatear_mensaje($ticket['descripcion']) ?>
              </div>
            </div>

            <?php if (!empty($ticket['pasos_reproducir'])): ?>
              <div class="mb-3">
                <strong>Pasos para reproducir:</strong>
                <div class="bg-light p-3 rounded mt-2">
                  <?= formatear_mensaje($ticket['pasos_reproducir']) ?>
                </div>
              </div>
            <?php endif; ?>

            <?php if (!empty($ticket['modulo_pagina'])): ?>
              <div class="mb-3">
                <strong>Módulo/Página afectada:</strong><br>
                <code><?= htmlspecialchars($ticket['modulo_pagina']) ?></code>
              </div>
            <?php endif; ?>
          </div>
        </div>

        <!-- Conversación -->
        <div class="card mb-4">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="fas fa-comments me-2"></i>
              Conversación
            </h5>
            <span class="badge bg-info"><?= count($respuestas) ?> respuestas</span>
          </div>
          <div class="card-body p-0">
            <div class="timeline">
              <!-- Mensaje inicial -->
              <div class="timeline-item timeline-cliente">
                <div class="timeline-marker bg-primary">
                  <i class="fas fa-user"></i>
                </div>
                <div class="timeline-content">
                  <div class="timeline-header">
                    <strong><?= htmlspecialchars($ticket['nombre_contacto']) ?></strong>
                    <small class="text-muted">
                      <?= date('d/m/Y H:i', strtotime($ticket['fecha_creacion'])) ?>
                    </small>
                    <span class="badge bg-primary ms-2">Ticket creado</span>
                  </div>
                  <div class="timeline-body">
                    <?= formatear_mensaje($ticket['descripcion']) ?>
                  </div>
                </div>
              </div>

              <!-- Respuestas -->
              <?php foreach ($respuestas as $respuesta): ?>
                <div class="timeline-item timeline-<?= $respuesta['tipo_respuesta'] ?>">
                  <div class="timeline-marker bg-<?= $respuesta['tipo_respuesta'] == 'soporte' ? 'success' : 'info' ?>">
                    <i class="fas fa-<?= $respuesta['tipo_respuesta'] == 'soporte' ? 'headset' : 'user' ?>"></i>
                  </div>
                  <div class="timeline-content">
                    <div class="timeline-header">
                      <strong><?= htmlspecialchars($respuesta['autor_nombre']) ?></strong>
                      <small class="text-muted">
                        <?= date('d/m/Y H:i', strtotime($respuesta['fecha_respuesta'])) ?>
                      </small>
                      <span class="badge bg-<?= $respuesta['tipo_respuesta'] == 'soporte' ? 'success' : 'info' ?> ms-2">
                        <?= $respuesta['tipo_respuesta'] == 'soporte' ? 'Soporte' : 'Cliente' ?>
                      </span>
                      <?php if ($respuesta['es_privada']): ?>
                        <span class="badge bg-warning ms-1">Privada</span>
                      <?php endif; ?>
                    </div>
                    <div class="timeline-body">
                      <?= formatear_mensaje($respuesta['mensaje']) ?>
                    </div>
                  </div>
                </div>
              <?php endforeach; ?>
            </div>
          </div>
        </div>

        <!-- Formulario de respuesta -->
        <div class="card mb-4" id="responder">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="fas fa-reply me-2"></i>
              Responder al Cliente
            </h5>
          </div>
          <div class="card-body">
            <form method="POST">
              <input type="hidden" name="action" value="responder">

              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label">Nombre del agente</label>
                  <input type="text" class="form-control" name="autor_nombre"
                    value="<?= htmlspecialchars($_SESSION['user_name'] ?? 'Administrador') ?>" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Email del agente</label>
                  <input type="email" class="form-control" name="autor_email"
                    value="<?= htmlspecialchars($_SESSION['user_email'] ?? 'admin@tenkiweb.com') ?>" required>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Mensaje</label>
                <textarea class="form-control" name="mensaje" rows="6" required
                  placeholder="Escriba su respuesta al cliente..."></textarea>
              </div>

              <div class="mb-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" name="es_privada" id="esPrivada">
                  <label class="form-check-label" for="esPrivada">
                    <i class="fas fa-lock me-1"></i>
                    Respuesta privada (solo visible para el equipo de soporte)
                  </label>
                </div>
              </div>

              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-primary">
                  <i class="fas fa-paper-plane me-1"></i>
                  Enviar Respuesta
                </button>
                <button type="button" class="btn btn-outline-secondary" onclick="limpiarFormulario()">
                  <i class="fas fa-eraser me-1"></i>
                  Limpiar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Panel lateral -->
      <div class="col-lg-4">
        <!-- Acciones rápidas -->
        <div class="card mb-4">
          <div class="card-header">
            <h6 class="mb-0">
              <i class="fas fa-bolt me-2"></i>
              Acciones Rápidas
            </h6>
          </div>
          <div class="card-body">
            <!-- Cambiar estado -->
            <form method="POST" class="mb-3">
              <input type="hidden" name="action" value="cambiar_estado">
              <div class="mb-2">
                <label class="form-label text-sm">Cambiar Estado</label>
                <select class="form-select form-select-sm" name="nuevo_estado">
                  <option value="">Seleccionar estado...</option>
                  <option value="nuevo" <?= $ticket['estado'] == 'nuevo' ? 'selected' : '' ?>>Nuevo</option>
                  <option value="abierto" <?= $ticket['estado'] == 'abierto' ? 'selected' : '' ?>>Abierto</option>
                  <option value="en_proceso" <?= $ticket['estado'] == 'en_proceso' ? 'selected' : '' ?>>En Proceso</option>
                  <option value="resuelto" <?= $ticket['estado'] == 'resuelto' ? 'selected' : '' ?>>Resuelto</option>
                  <option value="cerrado" <?= $ticket['estado'] == 'cerrado' ? 'selected' : '' ?>>Cerrado</option>
                </select>
              </div>
              <div class="mb-2">
                <textarea class="form-control form-control-sm" name="comentarios"
                  placeholder="Comentarios internos (opcional)" rows="2"></textarea>
              </div>
              <button type="submit" class="btn btn-outline-primary btn-sm w-100">
                <i class="fas fa-save me-1"></i> Actualizar Estado
              </button>
            </form>

            <!-- Cambiar prioridad -->
            <form method="POST" class="mb-3">
              <input type="hidden" name="action" value="cambiar_prioridad">
              <div class="mb-2">
                <label class="form-label text-sm">Cambiar Prioridad</label>
                <select class="form-select form-select-sm" name="nueva_prioridad">
                  <option value="">Seleccionar prioridad...</option>
                  <option value="baja" <?= $ticket['prioridad'] == 'baja' ? 'selected' : '' ?>>Baja</option>
                  <option value="media" <?= $ticket['prioridad'] == 'media' ? 'selected' : '' ?>>Media</option>
                  <option value="alta" <?= $ticket['prioridad'] == 'alta' ? 'selected' : '' ?>>Alta</option>
                  <option value="critica" <?= $ticket['prioridad'] == 'critica' ? 'selected' : '' ?>>Crítica</option>
                </select>
              </div>
              <button type="submit" class="btn btn-outline-warning btn-sm w-100">
                <i class="fas fa-flag me-1"></i> Actualizar Prioridad
              </button>
            </form>

            <hr>

            <!-- Otras acciones -->
            <div class="d-grid gap-2">
              <button type="button" class="btn btn-outline-info btn-sm" onclick="verHistorial()">
                <i class="fas fa-history me-1"></i> Ver Historial Completo
              </button>
              <button type="button" class="btn btn-outline-secondary btn-sm" onclick="imprimirTicket()">
                <i class="fas fa-print me-1"></i> Imprimir Ticket
              </button>
            </div>
          </div>
        </div>

        <!-- Información adicional -->
        <div class="card mb-4">
          <div class="card-header">
            <h6 class="mb-0">
              <i class="fas fa-info-circle me-2"></i>
              Información Adicional
            </h6>
          </div>
          <div class="card-body">
            <div class="info-item">
              <strong>Tiempo transcurrido:</strong><br>
              <span class="text-info"><?= $ticket['horas_transcurridas'] ?> horas</span>
            </div>

            <?php if ($ticket['fecha_resolucion']): ?>
              <div class="info-item">
                <strong>Tiempo de resolución:</strong><br>
                <span class="text-success"><?= $ticket['tiempo_resolucion_horas'] ?> horas</span>
              </div>
              <div class="info-item">
                <strong>Fecha de resolución:</strong><br>
                <?= date('d/m/Y H:i', strtotime($ticket['fecha_resolucion'])) ?>
              </div>
            <?php endif; ?>

            <div class="info-item">
              <strong>Última actualización:</strong><br>
              <?= date('d/m/Y H:i', strtotime($ticket['fecha_actualizacion'])) ?>
            </div>

            <?php if (!empty($ticket['como_conocio'])): ?>
              <div class="info-item">
                <strong>Cómo nos conoció:</strong><br>
                <?= ucfirst(str_replace('_', ' ', $ticket['como_conocio'])) ?>
              </div>
            <?php endif; ?>

            <div class="info-item">
              <strong>Total de respuestas:</strong><br>
              <span class="badge bg-info"><?= count($respuestas) ?></span>
            </div>
          </div>
        </div>

        <!-- Archivos adjuntos -->
        <?php if (!empty($archivos)): ?>
          <div class="card mb-4">
            <div class="card-header">
              <h6 class="mb-0">
                <i class="fas fa-paperclip me-2"></i>
                Archivos Adjuntos
              </h6>
            </div>
            <div class="card-body">
              <?php foreach ($archivos as $archivo): ?>
                <div class="d-flex align-items-center mb-2">
                  <i class="fas fa-file me-2 text-muted"></i>
                  <div class="flex-grow-1">
                    <a href="<?= htmlspecialchars($archivo['ruta_archivo']) ?>" target="_blank" class="text-decoration-none">
                      <?= htmlspecialchars($archivo['nombre_original']) ?>
                    </a>
                    <br><small class="text-muted">
                      <?= number_format($archivo['tamaño_bytes'] / 1024, 1) ?> KB -
                      <?= date('d/m/Y', strtotime($archivo['fecha_subida'])) ?>
                    </small>
                  </div>
                </div>
              <?php endforeach; ?>
            </div>
          </div>
        <?php endif; ?>

        <!-- Comentarios internos -->
        <?php if (!empty($ticket['comentarios_internos'])): ?>
          <div class="card mb-4">
            <div class="card-header">
              <h6 class="mb-0">
                <i class="fas fa-sticky-note me-2"></i>
                Comentarios Internos
              </h6>
            </div>
            <div class="card-body">
              <div class="bg-light p-3 rounded">
                <?= formatear_mensaje($ticket['comentarios_internos']) ?>
              </div>
            </div>
          </div>
        <?php endif; ?>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="detalle.js"></script>
</body>

</html>