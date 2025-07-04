<?php
header('Content-Type: application/json');
require_once dirname(dirname(dirname(dirname(__DIR__)))) . '/config.php';
require_once dirname(dirname(dirname(dirname(__DIR__)))) . '/ErrorLogger.php';

ErrorLogger::initialize(dirname(dirname(dirname(dirname(__DIR__)))) . '/logs/error.log');

// Configurar headers de seguridad
$nonce = setSecurityHeaders();
startSecureSession();

// Solo permitir POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['success' => false, 'message' => 'Método no permitido']);
  exit;
}

// Verificar si es superadmin (añadir validación según tu sistema)
// if (!isset($_SESSION['is_superadmin']) || !$_SESSION['is_superadmin']) {
//     http_response_code(403);
//     echo json_encode(['success' => false, 'message' => 'No autorizado']);
//     exit;
// }

try {
  // Obtener datos JSON
  $input = json_decode(file_get_contents('php://input'), true);

  if (!$input) {
    throw new Exception('Datos JSON inválidos');
  }

  $ticket_id = trim($input['ticket_id'] ?? '');
  $nuevo_estado = trim($input['nuevo_estado'] ?? '');
  $comentarios = trim($input['comentarios'] ?? '');

  // Validar datos
  if (empty($ticket_id)) {
    throw new Exception('ID de ticket requerido');
  }

  if (empty($nuevo_estado)) {
    throw new Exception('Nuevo estado requerido');
  }

  $estados_validos = ['nuevo', 'abierto', 'en_proceso', 'resuelto', 'cerrado'];
  if (!in_array($nuevo_estado, $estados_validos)) {
    throw new Exception('Estado no válido');
  }

  // Verificar que el ticket existe
  $stmt_check = $pdo->prepare("SELECT id, estado FROM soporte_tickets WHERE ticket_id = ?");
  $stmt_check->execute([$ticket_id]);
  $ticket = $stmt_check->fetch(PDO::FETCH_ASSOC);

  if (!$ticket) {
    throw new Exception('Ticket no encontrado');
  }

  // Iniciar transacción
  $pdo->beginTransaction();

  try {
    // Actualizar estado del ticket
    $stmt_update = $pdo->prepare("
            UPDATE soporte_tickets 
            SET estado = ?, 
                comentarios_internos = CASE 
                    WHEN ? != '' THEN CONCAT(COALESCE(comentarios_internos, ''), '\n--- ', NOW(), ' ---\n', ?)
                    ELSE comentarios_internos 
                END,
                fecha_resolucion = CASE 
                    WHEN ? IN ('resuelto', 'cerrado') AND fecha_resolucion IS NULL THEN NOW()
                    WHEN ? NOT IN ('resuelto', 'cerrado') THEN NULL
                    ELSE fecha_resolucion 
                END,
                fecha_actualizacion = NOW()
            WHERE ticket_id = ?
        ");

    $stmt_update->execute([
      $nuevo_estado,
      $comentarios,
      $comentarios,
      $nuevo_estado,
      $nuevo_estado,
      $ticket_id
    ]);

    // Registrar respuesta del sistema si hay comentarios
    if (!empty($comentarios)) {
      $autor_nombre = $_SESSION['user_name'] ?? 'Sistema';
      $autor_email = $_SESSION['user_email'] ?? 'sistema@tenkiweb.com';

      $stmt_respuesta = $pdo->prepare("
                INSERT INTO soporte_respuestas 
                (ticket_id, tipo_respuesta, autor_nombre, autor_email, mensaje, es_privada) 
                VALUES (?, 'sistema', ?, ?, ?, 1)
            ");

      $mensaje_sistema = "Estado cambiado a: " . ucfirst(str_replace('_', ' ', $nuevo_estado)) . "\n\n" . $comentarios;
      $stmt_respuesta->execute([$ticket_id, $autor_nombre, $autor_email, $mensaje_sistema]);
    }

    // Calcular métricas si el ticket se resuelve
    if (in_array($nuevo_estado, ['resuelto', 'cerrado']) && $ticket['estado'] !== $nuevo_estado) {
      $stmt_metricas = $pdo->prepare("
                INSERT INTO soporte_metricas (ticket_id, fecha_calculo) 
                VALUES (?, NOW())
                ON DUPLICATE KEY UPDATE fecha_calculo = NOW()
            ");
      $stmt_metricas->execute([$ticket_id]);
    }

    // Confirmar transacción
    $pdo->commit();

    // Log de éxito
    ErrorLogger::log("✅ Estado cambiado - Ticket: $ticket_id, Estado: $nuevo_estado");

    // Respuesta exitosa
    echo json_encode([
      'success' => true,
      'message' => 'Estado actualizado correctamente',
      'data' => [
        'ticket_id' => $ticket_id,
        'nuevo_estado' => $nuevo_estado,
        'estado_anterior' => $ticket['estado']
      ]
    ]);
  } catch (Exception $e) {
    $pdo->rollBack();
    throw $e;
  }
} catch (Exception $e) {
  ErrorLogger::log("❌ Error cambiando estado: " . $e->getMessage());

  http_response_code(400);
  echo json_encode([
    'success' => false,
    'message' => $e->getMessage()
  ]);
}
