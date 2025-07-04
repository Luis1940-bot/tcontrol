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

try {
  // Obtener datos JSON
  $input = json_decode(file_get_contents('php://input'), true);

  if (!$input) {
    throw new Exception('Datos JSON inválidos');
  }

  $ticket_ids = $input['ticket_ids'] ?? [];
  $nuevo_estado = trim($input['nuevo_estado'] ?? '');
  $comentarios = trim($input['comentarios'] ?? '');

  // Validar datos
  if (empty($ticket_ids) || !is_array($ticket_ids)) {
    throw new Exception('Lista de tickets requerida');
  }

  if (count($ticket_ids) > 100) {
    throw new Exception('Máximo 100 tickets por operación');
  }

  if (empty($nuevo_estado)) {
    throw new Exception('Nuevo estado requerido');
  }

  $estados_validos = ['nuevo', 'abierto', 'en_proceso', 'resuelto', 'cerrado'];
  if (!in_array($nuevo_estado, $estados_validos)) {
    throw new Exception('Estado no válido');
  }

  // Limpiar y validar IDs de tickets
  $ticket_ids = array_filter(array_map('trim', $ticket_ids));
  if (empty($ticket_ids)) {
    throw new Exception('No hay tickets válidos para procesar');
  }

  // Verificar que los tickets existen
  $placeholders = str_repeat('?,', count($ticket_ids) - 1) . '?';
  $stmt_check = $pdo->prepare("
        SELECT ticket_id, estado 
        FROM soporte_tickets 
        WHERE ticket_id IN ($placeholders)
    ");
  $stmt_check->execute($ticket_ids);
  $tickets_existentes = $stmt_check->fetchAll(PDO::FETCH_ASSOC);

  if (empty($tickets_existentes)) {
    throw new Exception('No se encontraron tickets válidos');
  }

  $tickets_encontrados = array_column($tickets_existentes, 'ticket_id');
  $tickets_no_encontrados = array_diff($ticket_ids, $tickets_encontrados);

  // Iniciar transacción
  $pdo->beginTransaction();

  try {
    $updated_count = 0;
    $autor_nombre = $_SESSION['user_name'] ?? 'Sistema';
    $autor_email = $_SESSION['user_email'] ?? 'sistema@tenkiweb.com';

    foreach ($tickets_existentes as $ticket) {
      $ticket_id = $ticket['ticket_id'];
      $estado_anterior = $ticket['estado'];

      // Solo actualizar si el estado es diferente
      if ($estado_anterior === $nuevo_estado) {
        continue;
      }

      // Actualizar estado del ticket
      $stmt_update = $pdo->prepare("
                UPDATE soporte_tickets 
                SET estado = ?, 
                    comentarios_internos = CASE 
                        WHEN ? != '' THEN CONCAT(COALESCE(comentarios_internos, ''), '\n--- ', NOW(), ' (Actualización masiva) ---\n', ?)
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

      if ($stmt_update->rowCount() > 0) {
        $updated_count++;

        // Registrar respuesta del sistema
        $stmt_respuesta = $pdo->prepare("
                    INSERT INTO soporte_respuestas 
                    (ticket_id, tipo_respuesta, autor_nombre, autor_email, mensaje, es_privada) 
                    VALUES (?, 'sistema', ?, ?, ?, 1)
                ");

        $mensaje_sistema = "Estado cambiado masivamente de '$estado_anterior' a '$nuevo_estado'";
        if (!empty($comentarios)) {
          $mensaje_sistema .= "\n\nComentarios: " . $comentarios;
        }

        $stmt_respuesta->execute([$ticket_id, $autor_nombre, $autor_email, $mensaje_sistema]);

        // Calcular métricas si el ticket se resuelve
        if (in_array($nuevo_estado, ['resuelto', 'cerrado']) && $estado_anterior !== $nuevo_estado) {
          $stmt_metricas = $pdo->prepare("
                        INSERT INTO soporte_metricas (ticket_id, fecha_calculo) 
                        VALUES (?, NOW())
                        ON DUPLICATE KEY UPDATE fecha_calculo = NOW()
                    ");
          $stmt_metricas->execute([$ticket_id]);
        }
      }
    }

    // Confirmar transacción
    $pdo->commit();

    // Log de éxito
    ErrorLogger::log("✅ Estado cambiado masivamente - $updated_count tickets actualizados a: $nuevo_estado");

    // Respuesta exitosa
    $response = [
      'success' => true,
      'message' => "$updated_count ticket(s) actualizado(s) correctamente",
      'data' => [
        'updated_count' => $updated_count,
        'total_requested' => count($ticket_ids),
        'nuevo_estado' => $nuevo_estado,
        'tickets_procesados' => $tickets_encontrados
      ]
    ];

    if (!empty($tickets_no_encontrados)) {
      $response['warnings'] = [
        'tickets_no_encontrados' => $tickets_no_encontrados,
        'message' => 'Algunos tickets no fueron encontrados'
      ];
    }

    echo json_encode($response);
  } catch (Exception $e) {
    $pdo->rollBack();
    throw $e;
  }
} catch (Exception $e) {
  ErrorLogger::log("❌ Error en cambio masivo de estado: " . $e->getMessage());

  http_response_code(400);
  echo json_encode([
    'success' => false,
    'message' => $e->getMessage()
  ]);
}
