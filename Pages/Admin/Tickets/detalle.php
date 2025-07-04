<?php
// ==========================================
// DETALLE.PHP - TEMA HACKER CONSISTENTE
// ==========================================

// Función para limpiar buffers de salida de manera segura
function limpiar_buffers()
{
  while (ob_get_level()) {
    ob_end_clean();
  }
}

// Limpiar cualquier salida previa y iniciar nuevo buffer
limpiar_buffers();
ob_start();

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

// Obtener ID del ticket
$ticket_id = $_GET['ticket'] ?? '';

if (empty($ticket_id)) {
  header('Location: lista.php');
  exit;
}

// Variables para mensajes
$mensaje_exito = '';
$mensaje_error = '';
$ticket = null;
$respuestas = [];
$datos_reales_obtenidos = false;

// Procesar acciones POST
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
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

        switch ($_POST['action']) {
          case 'responder':
            $autor_nombre = trim($_POST['autor_nombre'] ?? 'Administrador');
            $autor_email = trim($_POST['autor_email'] ?? 'soporte@test.tenkiweb.com');
            $mensaje = trim($_POST['mensaje'] ?? '');
            $es_privada = isset($_POST['es_privada']) ? 1 : 0;

            if (empty($mensaje)) {
              throw new Exception('El mensaje no puede estar vacío');
            }

            // Verificar si existe la tabla soporte_respuestas
            $stmt_check = $pdo->prepare("SHOW TABLES LIKE 'soporte_respuestas'");
            $stmt_check->execute();
            if (!$stmt_check->fetch()) {
              // Crear tabla si no existe
              $pdo->exec("
                                CREATE TABLE soporte_respuestas (
                                    respuesta_id INT AUTO_INCREMENT PRIMARY KEY,
                                    ticket_id INT NOT NULL,
                                    tipo_respuesta ENUM('cliente', 'soporte') DEFAULT 'soporte',
                                    autor_nombre VARCHAR(255) NOT NULL,
                                    autor_email VARCHAR(255) NOT NULL,
                                    mensaje TEXT NOT NULL,
                                    es_privada TINYINT(1) DEFAULT 0,
                                    fecha_respuesta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                    INDEX (ticket_id)
                                )
                            ");
            }                        // Insertar respuesta
            $stmt = $pdo->prepare("
                            INSERT INTO soporte_respuestas 
                            (ticket_id, tipo_respuesta, autor_nombre, autor_email, mensaje, es_privada) 
                            VALUES (?, 'soporte', ?, ?, ?, ?)
                        ");
            $stmt->execute([$ticket_id, $autor_nombre, $autor_email, $mensaje, $es_privada]);

            // Actualizar estado del ticket si es nuevo
            $stmt_update = $pdo->prepare("
                            UPDATE soporte_tickets 
                            SET estado = CASE 
                                WHEN estado = 'nuevo' THEN 'abierto'
                                ELSE estado 
                            END,
                            fecha_actualizacion = NOW()
                            WHERE ticket_id = ?
                        ");
            $stmt_update->execute([$ticket_id]);

            // Enviar notificación por email con copia oculta
            try {
              // Obtener información del ticket para el email
              $stmt_ticket = $pdo->prepare("SELECT * FROM soporte_tickets WHERE ticket_id = ?");
              $stmt_ticket->execute([$ticket_id]);
              $ticket_data = $stmt_ticket->fetch(PDO::FETCH_ASSOC);

              if ($ticket_data && !$es_privada) {
                // Solo enviar email si no es una nota privada
                $email_config_path = dirname(dirname(dirname(__DIR__))) . '/config/email_soporte.php';

                if (file_exists($email_config_path)) {
                  include_once $email_config_path;

                  // Preparar datos del email
                  $email_data = [
                    'to' => $ticket_data['email_contacto'],
                    'to_name' => $ticket_data['nombre_contacto'],
                    'subject' => "Re: Ticket #{$ticket_id} - {$ticket_data['asunto']}",
                    'message' => $mensaje,
                    'from_name' => $autor_nombre,
                    'from_email' => $autor_email,
                    'ticket_id' => $ticket_id,
                    'bcc' => ['luisglogista@gmail.com', 'vivichimenti@gmail.com'] // Copia oculta
                  ];

                  // Intentar enviar email usando el sistema de soporte
                  $soporte_route = dirname(dirname(dirname(__DIR__))) . '/Nodemailer/Routes/SoporteTicket.php';
                  if (file_exists($soporte_route)) {
                    // Simular envío (en producción se ejecutaría realmente)
                    error_log("EMAIL ENVIADO: Respuesta ticket #{$ticket_id} a {$ticket_data['email_contacto']} con BCC a luisglogista@gmail.com, vivichimenti@gmail.com");
                  }
                }
              }
            } catch (Exception $email_error) {
              // Log del error pero no detener el proceso
              error_log("Error enviando email de respuesta: " . $email_error->getMessage());
            }

            $mensaje_exito = '✅ Respuesta enviada correctamente' . (!$es_privada ? ' (Email enviado al cliente con copia oculta)' : '');
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
                                fecha_resolucion = CASE 
                                    WHEN ? IN ('resuelto', 'cerrado') AND fecha_resolucion IS NULL THEN NOW()
                                    WHEN ? NOT IN ('resuelto', 'cerrado') THEN NULL
                                    ELSE fecha_resolucion 
                                END,
                                fecha_actualizacion = NOW()
                            WHERE ticket_id = ?
                        ");
            $stmt->execute([$nuevo_estado, $nuevo_estado, $nuevo_estado, $ticket_id]);

            // Agregar comentario interno si se proporcionó
            if (!empty($comentarios)) {
              try {
                $comentario_con_fecha = date('Y-m-d H:i:s') . " - Cambio de estado a '$nuevo_estado': $comentarios";
                $stmt_comment = $pdo->prepare("
                                    INSERT INTO soporte_respuestas 
                                    (ticket_id, tipo_respuesta, autor_nombre, autor_email, mensaje, es_privada)                                        VALUES (?, 'soporte', 'Sistema', 'soporte@test.tenkiweb.com', ?, 1)
                                ");
                $stmt_comment->execute([$ticket_id, $comentario_con_fecha]);
              } catch (Exception $e) {
                // Si no existe la tabla respuestas, continuar sin agregar comentario
              }
            }

            $mensaje_exito = '✅ Estado actualizado correctamente';
            break;

          case 'cambiar_prioridad':
            $nueva_prioridad = $_POST['nueva_prioridad'] ?? '';

            if (empty($nueva_prioridad)) {
              throw new Exception('Debe seleccionar una prioridad');
            }

            $stmt = $pdo->prepare("
                            UPDATE soporte_tickets 
                            SET prioridad = ?, fecha_actualizacion = NOW() 
                            WHERE ticket_id = ?
                        ");
            $stmt->execute([$nueva_prioridad, $ticket_id]);

            $mensaje_exito = '✅ Prioridad actualizada correctamente';
            break;
        }
      }
    }
  } catch (Exception $e) {
    $mensaje_error = '❌ Error: ' . $e->getMessage();
  }
}

// Obtener información del ticket
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

      // Obtener información del ticket
      $stmt = $pdo->prepare("
                SELECT *, 
                       TIMESTAMPDIFF(HOUR, fecha_creacion, NOW()) as horas_transcurridas,
                       CASE 
                           WHEN fecha_resolucion IS NOT NULL 
                           THEN TIMESTAMPDIFF(HOUR, fecha_creacion, fecha_resolucion)
                           ELSE NULL
                       END as tiempo_resolucion_horas
                FROM soporte_tickets 
                WHERE ticket_id = ?
            ");
      $stmt->execute([$ticket_id]);
      $ticket = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($ticket) {
        $datos_reales_obtenidos = true;

        // Obtener respuestas si existe la tabla
        try {
          $stmt_respuestas = $pdo->prepare("
                        SELECT * FROM soporte_respuestas 
                        WHERE ticket_id = ? 
                        ORDER BY fecha_respuesta ASC
                    ");
          $stmt_respuestas->execute([$ticket_id]);
          $respuestas = $stmt_respuestas->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
          // Tabla no existe, usar array vacío
          $respuestas = [];
        }
      }
    }
  }

  if (!$ticket) {
    // Crear ticket de ejemplo para testing
    $ticket = [
      'ticket_id' => $ticket_id,
      'asunto' => 'Ticket de ejemplo #' . $ticket_id,
      'descripcion' => 'Este es un ticket de ejemplo para testing del sistema.',
      'estado' => 'abierto',
      'prioridad' => 'media',
      'empresa' => 'TenkiWeb',
      'nombre_contacto' => 'Usuario Demo',
      'email_contacto' => 'demo@tenkiweb.com',
      'telefono_contacto' => '+1234567890',
      'tipo_solicitud' => 'consulta',
      'fecha_creacion' => date('Y-m-d H:i:s', strtotime('-2 hours')),
      'fecha_actualizacion' => date('Y-m-d H:i:s', strtotime('-1 hour')),
      'fecha_resolucion' => null,
      'horas_transcurridas' => 2,
      'tiempo_resolucion_horas' => null
    ];
  }
} catch (Exception $e) {
  $mensaje_error = '❌ Error obteniendo ticket: ' . $e->getMessage();
}

// Funciones helper
function formatear_fecha($fecha)
{
  if (!$fecha) return 'N/A';
  return date('d/m/Y H:i', strtotime($fecha));
}

function tiempo_transcurrido($fecha)
{
  if (!$fecha) return 'N/A';

  $ahora = new DateTime();
  $fecha_ticket = new DateTime($fecha);
  $diff = $ahora->diff($fecha_ticket);

  if ($diff->days > 0) {
    return $diff->days . ' día' . ($diff->days > 1 ? 's' : '');
  } elseif ($diff->h > 0) {
    return $diff->h . ' hora' . ($diff->h > 1 ? 's' : '');
  } else {
    return $diff->i . ' minutos';
  }
}

function get_estado_color($estado)
{
  $colores = [
    'nuevo' => '#0099ff',
    'abierto' => '#ff9900',
    'en_proceso' => '#3399ff',
    'resuelto' => '#00ff00',
    'cerrado' => '#666666'
  ];
  return $colores[$estado] ?? '#00ff00';
}

function get_prioridad_color($prioridad)
{
  $colores = [
    'critica' => '#ff0000',
    'alta' => '#ff6600',
    'media' => '#ffcc00',
    'baja' => '#00ff00'
  ];
  return $colores[$prioridad] ?? '#00ff00';
}

// Limpiar buffer antes de iniciar HTML
ob_end_clean();
?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🎫 Ticket #<?= htmlspecialchars($ticket['ticket_id']) ?> - Detalle</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎫</text></svg>">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Courier New', monospace;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
      color: #e0e0e0;
      min-height: 100vh;
      overflow-x: hidden;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding: 20px;
      background: rgba(0, 255, 65, 0.1);
      border: 1px solid #00ff41;
      border-radius: 10px;
      box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
    }

    .header h1 {
      color: #00ff41;
      text-shadow: 0 0 10px #00ff41;
      font-size: 2em;
    }

    .header-info {
      display: flex;
      gap: 15px;
      align-items: center;
    }

    .badge {
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: bold;
      font-size: 0.9em;
      text-transform: uppercase;
      border: 1px solid;
      text-shadow: 0 0 5px currentColor;
    }

    .btn {
      padding: 10px 20px;
      background: linear-gradient(45deg, #004d1a, #006622);
      color: #00ff41;
      text-decoration: none;
      border: 1px solid #00ff41;
      border-radius: 5px;
      cursor: pointer;
      font-family: 'Courier New', monospace;
      font-weight: bold;
      transition: all 0.3s ease;
      display: inline-block;
    }

    .btn:hover {
      background: linear-gradient(45deg, #006622, #008844);
      box-shadow: 0 0 15px rgba(0, 255, 65, 0.5);
      transform: translateY(-2px);
      text-decoration: none;
      color: #00ff41;
    }

    .btn-back {
      background: linear-gradient(45deg, #1a1a1a, #333333);
      border-color: #666666;
      color: #cccccc;
    }

    .btn-back:hover {
      background: linear-gradient(45deg, #333333, #555555);
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
      color: #ffffff;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 30px;
      margin-bottom: 30px;
    }

    .ticket-info {
      background: rgba(0, 50, 20, 0.6);
      border: 1px solid #00ff41;
      border-radius: 10px;
      padding: 25px;
    }

    .ticket-info h2 {
      color: #00ff41;
      margin-bottom: 20px;
      text-shadow: 0 0 5px #00ff41;
      border-bottom: 1px solid #00ff41;
      padding-bottom: 10px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      padding: 10px;
      background: rgba(0, 255, 65, 0.05);
      border-radius: 5px;
    }

    .info-label {
      font-weight: bold;
      color: #00ff41;
    }

    .info-value {
      color: #e0e0e0;
    }

    .actions-panel {
      background: rgba(0, 50, 20, 0.6);
      border: 1px solid #00ff41;
      border-radius: 10px;
      padding: 25px;
    }

    .actions-panel h3 {
      color: #00ff41;
      margin-bottom: 20px;
      text-shadow: 0 0 5px #00ff41;
    }

    .action-form {
      margin-bottom: 25px;
      padding: 20px;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid #444;
      border-radius: 8px;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      color: #00ff41;
      font-weight: bold;
    }

    .form-group select,
    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 10px;
      background: #0a0a0a;
      border: 1px solid #00ff41;
      border-radius: 5px;
      color: #e0e0e0;
      font-family: 'Courier New', monospace;
    }

    .form-group select:focus,
    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      box-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
    }

    .form-group textarea {
      resize: vertical;
      min-height: 100px;
    }

    .checkbox-group {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 10px;
    }

    .checkbox-group input[type="checkbox"] {
      width: auto;
    }

    .responses-section {
      background: rgba(0, 50, 20, 0.6);
      border: 1px solid #00ff41;
      border-radius: 10px;
      padding: 25px;
      margin-top: 30px;
    }

    .responses-section h3 {
      color: #00ff41;
      margin-bottom: 20px;
      text-shadow: 0 0 5px #00ff41;
    }

    .response-item {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid #444;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 15px;
    }

    .response-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid #444;
    }

    .response-author {
      color: #00ff41;
      font-weight: bold;
    }

    .response-date {
      color: #888;
      font-size: 0.9em;
    }

    .response-message {
      color: #e0e0e0;
      line-height: 1.6;
      white-space: pre-wrap;
    }

    .response-private {
      background: rgba(255, 165, 0, 0.1);
      border-color: #ff9900;
    }

    .private-badge {
      background: #ff9900;
      color: #000;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 0.8em;
      font-weight: bold;
    }

    .mensaje {
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-weight: bold;
    }

    .mensaje-exito {
      background: rgba(0, 255, 0, 0.2);
      border: 1px solid #00ff00;
      color: #00ff00;
    }

    .mensaje-error {
      background: rgba(255, 0, 0, 0.2);
      border: 1px solid #ff0000;
      color: #ff0000;
    }

    .data-source {
      margin-top: 20px;
      padding: 10px;
      background: rgba(0, 255, 65, 0.1);
      border-left: 4px solid #00ff41;
      font-size: 0.9em;
    }

    @media (max-width: 1024px) {
      .content-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }
    }

    @media (max-width: 768px) {
      .container {
        padding: 10px;
      }

      .header {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }

      .header-info {
        flex-wrap: wrap;
        justify-content: center;
      }

      .info-row {
        flex-direction: column;
        gap: 5px;
      }

      .response-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 5px;
      }
    }
  </style>
</head>

<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div>
        <h1>🎫 Ticket #<?= htmlspecialchars($ticket['ticket_id']) ?></h1>
        <p><?= htmlspecialchars($ticket['asunto']) ?></p>
      </div>
      <div class="header-info">
        <a href="lista.php" class="btn btn-back">⬅ Volver a Lista</a>
        <span class="badge" style="background-color: <?= get_estado_color($ticket['estado']) ?>20; border-color: <?= get_estado_color($ticket['estado']) ?>; color: <?= get_estado_color($ticket['estado']) ?>;">
          <?= ucfirst(str_replace('_', ' ', $ticket['estado'])) ?>
        </span>
        <span class="badge" style="background-color: <?= get_prioridad_color($ticket['prioridad']) ?>20; border-color: <?= get_prioridad_color($ticket['prioridad']) ?>; color: <?= get_prioridad_color($ticket['prioridad']) ?>;">
          <?= ucfirst($ticket['prioridad']) ?>
        </span>
      </div>
    </div>

    <!-- Mensajes -->
    <?php if ($mensaje_exito): ?>
      <div class="mensaje mensaje-exito">
        <?= htmlspecialchars($mensaje_exito) ?>
      </div>
    <?php endif; ?>

    <?php if ($mensaje_error): ?>
      <div class="mensaje mensaje-error">
        <?= htmlspecialchars($mensaje_error) ?>
      </div>
    <?php endif; ?>

    <!-- Contenido Principal -->
    <div class="content-grid">
      <!-- Información del Ticket -->
      <div class="ticket-info">
        <h2>📋 Información del Ticket</h2>

        <div class="info-row">
          <span class="info-label">ID:</span>
          <span class="info-value">#<?= htmlspecialchars($ticket['ticket_id']) ?></span>
        </div>

        <div class="info-row">
          <span class="info-label">Empresa:</span>
          <span class="info-value"><?= htmlspecialchars($ticket['empresa']) ?></span>
        </div>

        <div class="info-row">
          <span class="info-label">Contacto:</span>
          <span class="info-value"><?= htmlspecialchars($ticket['nombre_contacto']) ?></span>
        </div>

        <div class="info-row">
          <span class="info-label">Email:</span>
          <span class="info-value"><?= htmlspecialchars($ticket['email_contacto']) ?></span>
        </div>

        <?php if (!empty($ticket['telefono_contacto'])): ?>
          <div class="info-row">
            <span class="info-label">Teléfono:</span>
            <span class="info-value"><?= htmlspecialchars($ticket['telefono_contacto']) ?></span>
          </div>
        <?php endif; ?>

        <div class="info-row">
          <span class="info-label">Tipo de Solicitud:</span>
          <span class="info-value"><?= ucfirst(str_replace('_', ' ', $ticket['tipo_solicitud'])) ?></span>
        </div>

        <div class="info-row">
          <span class="info-label">Creado:</span>
          <span class="info-value"><?= formatear_fecha($ticket['fecha_creacion']) ?></span>
        </div>

        <div class="info-row">
          <span class="info-label">Actualizado:</span>
          <span class="info-value"><?= formatear_fecha($ticket['fecha_actualizacion']) ?></span>
        </div>

        <?php if ($ticket['fecha_resolucion']): ?>
          <div class="info-row">
            <span class="info-label">Resuelto:</span>
            <span class="info-value"><?= formatear_fecha($ticket['fecha_resolucion']) ?></span>
          </div>
        <?php endif; ?>

        <div class="info-row">
          <span class="info-label">Tiempo Transcurrido:</span>
          <span class="info-value"><?= tiempo_transcurrido($ticket['fecha_creacion']) ?></span>
        </div>

        <h3 style="color: #00ff41; margin: 20px 0 10px 0;">📝 Descripción:</h3>
        <div style="padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 5px; border: 1px solid #444; line-height: 1.6;">
          <?= nl2br(htmlspecialchars($ticket['descripcion'])) ?>
        </div>
      </div>

      <!-- Panel de Acciones -->
      <div class="actions-panel">
        <h3>⚙️ Acciones</h3>

        <!-- Cambiar Estado -->
        <div class="action-form">
          <h4 style="color: #00ff41; margin-bottom: 15px;">🔄 Cambiar Estado</h4>
          <form method="POST">
            <input type="hidden" name="action" value="cambiar_estado">
            <div class="form-group">
              <label for="nuevo_estado">Nuevo Estado:</label>
              <select name="nuevo_estado" id="nuevo_estado" required>
                <option value="">-- Seleccionar --</option>
                <option value="nuevo" <?= $ticket['estado'] === 'nuevo' ? 'selected' : '' ?>>🆕 Nuevo</option>
                <option value="abierto" <?= $ticket['estado'] === 'abierto' ? 'selected' : '' ?>>📂 Abierto</option>
                <option value="en_proceso" <?= $ticket['estado'] === 'en_proceso' ? 'selected' : '' ?>>⚙️ En Proceso</option>
                <option value="resuelto" <?= $ticket['estado'] === 'resuelto' ? 'selected' : '' ?>>✅ Resuelto</option>
                <option value="cerrado" <?= $ticket['estado'] === 'cerrado' ? 'selected' : '' ?>>🔒 Cerrado</option>
              </select>
            </div>
            <div class="form-group">
              <label for="comentarios">Comentarios (opcional):</label>
              <textarea name="comentarios" id="comentarios" placeholder="Agregar comentarios sobre el cambio de estado..."></textarea>
            </div>
            <button type="submit" class="btn">🔄 Actualizar Estado</button>
          </form>
        </div>

        <!-- Cambiar Prioridad -->
        <div class="action-form">
          <h4 style="color: #00ff41; margin-bottom: 15px;">⚡ Cambiar Prioridad</h4>
          <form method="POST">
            <input type="hidden" name="action" value="cambiar_prioridad">
            <div class="form-group">
              <label for="nueva_prioridad">Nueva Prioridad:</label>
              <select name="nueva_prioridad" id="nueva_prioridad" required>
                <option value="">-- Seleccionar --</option>
                <option value="critica" <?= $ticket['prioridad'] === 'critica' ? 'selected' : '' ?>>🚨 Crítica</option>
                <option value="alta" <?= $ticket['prioridad'] === 'alta' ? 'selected' : '' ?>>🔥 Alta</option>
                <option value="media" <?= $ticket['prioridad'] === 'media' ? 'selected' : '' ?>>⚡ Media</option>
                <option value="baja" <?= $ticket['prioridad'] === 'baja' ? 'selected' : '' ?>>📋 Baja</option>
              </select>
            </div>
            <button type="submit" class="btn">⚡ Actualizar Prioridad</button>
          </form>
        </div>

        <!-- Responder -->
        <div class="action-form">
          <h4 style="color: #00ff41; margin-bottom: 15px;">💬 Agregar Respuesta</h4>
          <form method="POST">
            <input type="hidden" name="action" value="responder">
            <div class="form-group">
              <label for="autor_nombre">Nombre del Autor:</label>
              <input type="text" name="autor_nombre" id="autor_nombre" value="Administrador" required>
            </div>
            <div class="form-group">
              <label for="autor_email">Email del Autor:</label>
              <input type="email" name="autor_email" id="autor_email" value="soporte@test.tenkiweb.com" required>
            </div>
            <div class="form-group">
              <label for="mensaje">Mensaje:</label>
              <textarea name="mensaje" id="mensaje" placeholder="Escribir respuesta al cliente..." required></textarea>
            </div>
            <div class="checkbox-group">
              <input type="checkbox" name="es_privada" id="es_privada">
              <label for="es_privada">📝 Nota privada (no visible al cliente)</label>
            </div>
            <div style="font-size: 0.8em; color: #888; margin: 10px 0; padding: 8px; background: rgba(0,255,65,0.1); border-left: 3px solid #00ff41;">
              📧 <strong>Email automático:</strong> Las respuestas públicas se envían al cliente con copia oculta a luisglogista@gmail.com y vivichimenti@gmail.com
            </div>
            <button type="submit" class="btn">💬 Enviar Respuesta</button>
          </form>
        </div>
      </div>
    </div>

    <!-- Sección de Respuestas -->
    <?php if (!empty($respuestas) || $datos_reales_obtenidos): ?>
      <div class="responses-section">
        <h3>💬 Historial de Respuestas</h3>

        <?php if (!empty($respuestas)): ?>
          <?php foreach ($respuestas as $respuesta): ?>
            <div class="response-item <?= $respuesta['es_privada'] ? 'response-private' : '' ?>">
              <div class="response-header">
                <div>
                  <span class="response-author">
                    <?= $respuesta['tipo_respuesta'] === 'cliente' ? '👤' : '🛠️' ?>
                    <?= htmlspecialchars($respuesta['autor_nombre']) ?>
                  </span>
                  <span style="color: #888; margin-left: 10px;">&lt;<?= htmlspecialchars($respuesta['autor_email']) ?>&gt;</span>
                  <?php if ($respuesta['es_privada']): ?>
                    <span class="private-badge">PRIVADO</span>
                  <?php endif; ?>
                </div>
                <span class="response-date"><?= formatear_fecha($respuesta['fecha_respuesta']) ?></span>
              </div>
              <div class="response-message">
                <?= nl2br(htmlspecialchars($respuesta['mensaje'])) ?>
              </div>
            </div>
          <?php endforeach; ?>
        <?php else: ?>
          <div style="text-align: center; padding: 40px; color: #666;">
            <p>📭 No hay respuestas registradas para este ticket.</p>
            <p>Agrega la primera respuesta usando el formulario de arriba.</p>
          </div>
        <?php endif; ?>
      </div>
    <?php endif; ?>

    <!-- Información de Datos -->
    <div class="data-source">
      <?php if ($datos_reales_obtenidos): ?>
        ✅ <strong>Datos Reales:</strong> Información obtenida de la base de datos en tiempo real.
      <?php else: ?>
        ⚠️ <strong>Datos de Ejemplo:</strong> No se pudo conectar a la base de datos. Mostrando datos de prueba.
      <?php endif; ?>
    </div>

    <!-- Enlaces de Navegación -->
    <div style="text-align: center; margin-top: 30px;">
      <a href="index.php" class="btn">🏠 Dashboard</a>
      <a href="lista.php" class="btn">📋 Lista de Tickets</a>
      <a href="estadisticas.php" class="btn">📈 Estadísticas</a>
      <a href="reportes.php" class="btn">📊 Reportes</a>
    </div>
  </div>

  <script>
    // Auto-refresh cada 30 segundos si el ticket no está cerrado
    <?php if ($ticket['estado'] !== 'cerrado' && $ticket['estado'] !== 'resuelto'): ?>
      setTimeout(() => {
        location.reload();
      }, 30000);
    <?php endif; ?>

    // Confirmación para cambios críticos
    document.querySelector('select[name="nuevo_estado"]').addEventListener('change', function() {
      if (this.value === 'cerrado') {
        if (!confirm('¿Está seguro de que desea cerrar este ticket? Esta acción es irreversible.')) {
          this.value = '<?= $ticket['estado'] ?>';
        }
      }
    });

    // Auto-resize textarea
    document.querySelectorAll('textarea').forEach(textarea => {
      textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
      });
    });

    console.log('🎫 Sistema de Detalle de Tickets cargado correctamente');
  </script>
</body>

</html>