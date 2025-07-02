<?php

/**
 * Clase para soporte técnico
 * Sistema profesional de tickets con SLA y notificaciones
 */
class SoporteTicket
{
  private $conexion;

  public function __construct()
  {
    require_once dirname(dirname(__DIR__)) . '/Routes/datos_base.php';

    // Configurar conexión usando las variables globales
    $this->conexion = new mysqli($host, $user, $password, $dbname, $port);

    if ($this->conexion->connect_error) {
      throw new Exception("Error de conexión: " . $this->conexion->connect_error);
    }

    $this->conexion->set_charset("utf8mb4");
  }

  /**
   * Obtener tickets de un usuario
   */
  public function obtenerTicketsUsuario($user_id, $limite = 10)
  {
    $sql = "SELECT ticket_id, empresa, asunto, tipo_solicitud, prioridad, estado, 
                       fecha_creacion, fecha_actualizacion
                FROM soporte_tickets 
                WHERE usuario_id = ? 
                ORDER BY fecha_creacion DESC 
                LIMIT ?";

    $stmt = $this->conexion->prepare($sql);
    $stmt->bind_param("ii", $user_id, $limite);
    $stmt->execute();

    $resultado = $stmt->get_result();
    return $resultado->fetch_all(MYSQLI_ASSOC);
  }

  /**
   * Obtener tickets de un usuario por email
   */
  public function obtenerTicketsPorEmail($email, $limite = 10)
  {
    $sql = "SELECT ticket_id, empresa, asunto, tipo_solicitud, prioridad, estado, 
                       fecha_creacion, fecha_actualizacion
                FROM soporte_tickets 
                WHERE email_contacto = ? 
                ORDER BY fecha_creacion DESC 
                LIMIT ?";

    $stmt = $this->conexion->prepare($sql);
    $stmt->bind_param("si", $email, $limite);
    $stmt->execute();

    $resultado = $stmt->get_result();
    return $resultado->fetch_all(MYSQLI_ASSOC);
  }

  /**
   * Crear un nuevo ticket de soporte
   */
  public function crearTicket($datos, $archivos = null, $usuario_id = null)
  {
    try {
      // Generar ID único del ticket
      $ticket_id = $this->generarTicketId();

      // Validar datos requeridos
      $validacion = $this->validarDatos($datos);
      if (!$validacion['valido']) {
        return ['success' => false, 'message' => $validacion['mensaje']];
      }

      // Procesar archivo adjunto si existe
      $archivo_info = null;
      if (isset($archivos['archivo_adjunto']) && $archivos['archivo_adjunto']['error'] === 0) {
        $archivo_info = $this->procesarArchivo($archivos['archivo_adjunto'], $ticket_id);
        if ($archivo_info === false) {
          return ['success' => false, 'message' => 'Error al procesar el archivo adjunto'];
        }
      }

      // Obtener información del navegador y IP
      $info_navegador = $this->obtenerInfoNavegador();
      $ip_cliente = $this->obtenerIP();

      // Determinar si es un usuario logueado
      $es_cliente_logueado = !empty($usuario_id);

      // Insertar ticket en la base de datos
      $sql = "INSERT INTO soporte_tickets (
                ticket_id, usuario_id, empresa, nombre_contacto, email_contacto, telefono,
                tipo_solicitud, prioridad, asunto, descripcion, pasos_reproducir,
                modulo_pagina, info_navegador, ip_cliente, archivos_adjuntos,
                tipo_cliente, planta_cliente, como_conocio, es_cliente_logueado
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

      $stmt = $this->conexion->prepare($sql);
      if (!$stmt) {
        throw new Exception("Error preparando consulta: " . $this->conexion->error);
      }

      $archivos_json = $archivo_info ? json_encode([$archivo_info]) : null;

      $stmt->bind_param(
        "sissssssssssssssssi",
        $ticket_id,
        $usuario_id,
        $datos['empresa'],
        $datos['nombre_contacto'],
        $datos['email_contacto'],
        $datos['telefono'],
        $datos['tipo_solicitud'],
        $datos['prioridad'],
        $datos['asunto'],
        $datos['descripcion'],
        $datos['pasos_reproducir'],
        $datos['modulo_pagina'] ?? $_SERVER['HTTP_REFERER'] ?? '',
        $info_navegador,
        $ip_cliente,
        $archivos_json,
        $datos['tipo_cliente'] ?? null,
        $datos['planta_cliente'] ?? null,
        $datos['como_conocio'] ?? null,
        $es_cliente_logueado
      );

      if (!$stmt->execute()) {
        throw new Exception("Error ejecutando consulta: " . $stmt->error);
      }

      // Crear entrada inicial en métricas
      $this->crearMetricasIniciales($ticket_id);

      // Enviar notificaciones por email
      $this->enviarNotificaciones($ticket_id, $datos);

      return [
        'success' => true,
        'ticket_id' => $ticket_id,
        'message' => 'Ticket creado exitosamente'
      ];
    } catch (Exception $e) {
      error_log("Error creando ticket: " . $e->getMessage());
      return ['success' => false, 'message' => 'Error interno del sistema'];
    }
  }

  /**
   * Generar ID único para el ticket
   */
  private function generarTicketId()
  {
    $fecha = date('Y');
    $numero = str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
    return "TK{$fecha}-{$numero}";
  }

  /**
   * Validar datos del formulario
   */
  private function validarDatos($datos)
  {
    $requeridos = ['empresa', 'nombre_contacto', 'email_contacto', 'tipo_solicitud', 'prioridad', 'asunto', 'descripcion'];

    // Validar campos adicionales para usuarios no logueados
    if (isset($datos['tipo_cliente']) && !empty($datos['tipo_cliente'])) {
      // Es un usuario no logueado, validar campos adicionales
      if (empty($datos['tipo_cliente'])) {
        return ['valido' => false, 'mensaje' => 'El tipo de solicitante es requerido'];
      }

      // Si es cliente existente, la planta es requerida
      if ($datos['tipo_cliente'] === 'cliente_existente' && empty($datos['planta_cliente'])) {
        return ['valido' => false, 'mensaje' => 'La planta/ubicación es requerida para clientes existentes'];
      }
    }

    foreach ($requeridos as $campo) {
      if (empty($datos[$campo])) {
        return ['valido' => false, 'mensaje' => "El campo {$campo} es requerido"];
      }
    }

    if (!filter_var($datos['email_contacto'], FILTER_VALIDATE_EMAIL)) {
      return ['valido' => false, 'mensaje' => 'Email inválido'];
    }

    $tipos_validos = ['incidente_tecnico', 'solicitud_cambio', 'consulta_funcionalidad', 'reporte_error', 'solicitud_capacitacion', 'otros'];
    if (!in_array($datos['tipo_solicitud'], $tipos_validos)) {
      return ['valido' => false, 'mensaje' => 'Tipo de solicitud inválido'];
    }

    $prioridades_validas = ['critica', 'alta', 'media', 'baja'];
    if (!in_array($datos['prioridad'], $prioridades_validas)) {
      return ['valido' => false, 'mensaje' => 'Prioridad inválida'];
    }

    return ['valido' => true];
  }

  /**
   * Procesar archivo adjunto
   */
  private function procesarArchivo($archivo, $ticket_id)
  {
    // Validar tamaño (5MB máximo)
    if ($archivo['size'] > 5 * 1024 * 1024) {
      return false;
    }

    // Validar tipo de archivo
    $tipos_permitidos = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/zip'
    ];

    if (!in_array($archivo['type'], $tipos_permitidos)) {
      return false;
    }

    // Crear directorio si no existe
    $upload_dir = dirname(__DIR__) . '/uploads/soporte/' . date('Y/m');
    if (!is_dir($upload_dir)) {
      mkdir($upload_dir, 0755, true);
    }

    // Generar nombre único
    $extension = pathinfo($archivo['name'], PATHINFO_EXTENSION);
    $nombre_archivo = $ticket_id . '_' . uniqid() . '.' . $extension;
    $ruta_completa = $upload_dir . '/' . $nombre_archivo;

    // Mover archivo
    if (move_uploaded_file($archivo['tmp_name'], $ruta_completa)) {
      return [
        'nombre_original' => $archivo['name'],
        'nombre_archivo' => $nombre_archivo,
        'ruta_archivo' => $ruta_completa,
        'tipo_mime' => $archivo['type'],
        'tamaño_bytes' => $archivo['size']
      ];
    }

    return false;
  }

  /**
   * Obtener información del navegador
   */
  private function obtenerInfoNavegador()
  {
    return json_encode([
      'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
      'accept_language' => $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? '',
      'referrer' => $_SERVER['HTTP_REFERER'] ?? ''
    ]);
  }

  /**
   * Obtener IP del cliente
   */
  private function obtenerIP()
  {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
      return $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
      return $_SERVER['HTTP_X_FORWARDED_FOR'];
    }
    return $_SERVER['REMOTE_ADDR'] ?? '';
  }

  /**
   * Crear métricas iniciales para el ticket
   */
  private function crearMetricasIniciales($ticket_id)
  {
    $sql = "INSERT INTO soporte_metricas (ticket_id) VALUES (?)";
    $stmt = $this->conexion->prepare($sql);
    if ($stmt) {
      $stmt->bind_param("s", $ticket_id);
      $stmt->execute();
    }
  }

  /**
   * Enviar notificaciones por email
   */
  private function enviarNotificaciones($ticket_id, $datos)
  {
    try {
      // Email al cliente (confirmación)
      $this->enviarEmailCliente($ticket_id, $datos);

      // Email al soporte (notificación)
      $this->enviarEmailSoporte($ticket_id, $datos);
    } catch (Exception $e) {
      error_log("Error enviando notificaciones: " . $e->getMessage());
    }
  }

  /**
   * Enviar email de confirmación al cliente
   */
  private function enviarEmailCliente($ticket_id, $datos)
  {
    $asunto = "Confirmación de Ticket #{$ticket_id} - TenkiWeb Soporte";
    $mensaje = $this->generarEmailCliente($ticket_id, $datos);

    // Enviar confirmación al cliente
    $enviado = $this->enviarEmailReal($datos['email_contacto'], $asunto, $mensaje, true);

    if ($enviado) {
      error_log("✅ Email confirmación enviado al cliente: {$datos['email_contacto']} - Ticket: {$ticket_id}");
    } else {
      error_log("❌ Error enviando confirmación al cliente: {$datos['email_contacto']} - Ticket: {$ticket_id}");
    }
  }

  /**
   * Enviar email de notificación al equipo de soporte
   */
  private function enviarEmailSoporte($ticket_id, $datos)
  {
    $asunto = "Nuevo Ticket #{$ticket_id} - Prioridad: {$datos['prioridad']}";
    $mensaje = $this->generarEmailSoporte($ticket_id, $datos);

    // Enviar desde soporte@test.tenkiweb.com con BCC a ambos emails
    $enviado = $this->enviarEmailReal('soporte@test.tenkiweb.com', $asunto, $mensaje, true);

    if ($enviado) {
      error_log("✅ Email soporte enviado exitosamente - Ticket: {$ticket_id} - BCC: luisglogista@gmail.com, vivichimenti@gmail.com");
    } else {
      error_log("❌ Error enviando email de soporte - Ticket: {$ticket_id}");
    }
  }

  /**
   * Generar contenido del email para el cliente
   */
  private function generarEmailCliente($ticket_id, $datos)
  {
    $es_cliente_logueado = !empty($datos['usuario_id']) || empty($datos['tipo_cliente']);

    $tipo_cliente_texto = '';
    if (!$es_cliente_logueado && !empty($datos['tipo_cliente'])) {
      $tipos = [
        'cliente_existente' => 'Cliente Existente',
        'cliente_potencial' => 'Cliente Potencial',
        'consulta_general' => 'Consulta General'
      ];
      $tipo_cliente_texto = $tipos[$datos['tipo_cliente']] ?? $datos['tipo_cliente'];
    }

    $contenido_adicional = '';
    if (!$es_cliente_logueado) {
      $contenido_adicional = "
        <p><strong>Tipo de solicitante:</strong> {$tipo_cliente_texto}</p>";

      if (!empty($datos['planta_cliente'])) {
        $contenido_adicional .= "<p><strong>Planta/Ubicación:</strong> {$datos['planta_cliente']}</p>";
      }

      if (!empty($datos['como_conocio'])) {
        $como_conocio_texto = [
          'referencia' => 'Referencia',
          'web' => 'Página web',
          'redes_sociales' => 'Redes sociales',
          'evento' => 'Evento/Feria',
          'otro' => 'Otro'
        ];
        $contenido_adicional .= "<p><strong>Cómo conoció TenkiWeb:</strong> " . ($como_conocio_texto[$datos['como_conocio']] ?? $datos['como_conocio']) . "</p>";
      }
    }

    $mensaje_adicional = $es_cliente_logueado
      ? "<p>Como cliente autenticado, puedes ver el seguimiento de tus tickets en tu panel de control.</p>"
      : "<p>Para un mejor seguimiento de futuros tickets, te recomendamos crear una cuenta en nuestro sistema.</p>";

    return "
            <h2>Confirmación de Ticket de Soporte - TenkiWeb</h2>
            <p>Estimado/a {$datos['nombre_contacto']},</p>
            <p>Hemos recibido tu solicitud de soporte con los siguientes detalles:</p>
            <ul>
                <li><strong>Ticket ID:</strong> {$ticket_id}</li>
                <li><strong>Empresa:</strong> {$datos['empresa']}</li>
                <li><strong>Asunto:</strong> {$datos['asunto']}</li>
                <li><strong>Prioridad:</strong> {$datos['prioridad']}</li>
                <li><strong>Tipo:</strong> {$datos['tipo_solicitud']}</li>
            </ul>
            {$contenido_adicional}
            {$mensaje_adicional}
            <p>Te contactaremos pronto según nuestro SLA de soporte.</p>
            <p>Saludos,<br>Equipo TenkiWeb</p>
        ";
  }

  /**
   * Generar contenido del email para soporte
   */
  private function generarEmailSoporte($ticket_id, $datos)
  {
    $es_cliente_logueado = !empty($datos['usuario_id']) || empty($datos['tipo_cliente']);

    $info_cliente = '';
    if (!$es_cliente_logueado && !empty($datos['tipo_cliente'])) {
      $tipos = [
        'cliente_existente' => '👤 Cliente Existente',
        'cliente_potencial' => '🆕 Cliente Potencial',
        'consulta_general' => '❓ Consulta General'
      ];
      $tipo_texto = $tipos[$datos['tipo_cliente']] ?? $datos['tipo_cliente'];

      $info_cliente = "<p><strong>🏷️ Tipo de Solicitante:</strong> {$tipo_texto}</p>";

      if (!empty($datos['planta_cliente'])) {
        $info_cliente .= "<p><strong>🏭 Planta/Ubicación:</strong> {$datos['planta_cliente']}</p>";
      }

      if (!empty($datos['como_conocio'])) {
        $como_conocio_texto = [
          'referencia' => 'Referencia',
          'web' => 'Página web',
          'redes_sociales' => 'Redes sociales',
          'evento' => 'Evento/Feria',
          'otro' => 'Otro'
        ];
        $info_cliente .= "<p><strong>📢 Cómo conoció TenkiWeb:</strong> " . ($como_conocio_texto[$datos['como_conocio']] ?? $datos['como_conocio']) . "</p>";
      }
    } else {
      $info_cliente = "<p><strong>✅ Cliente Autenticado:</strong> Usuario logueado en el sistema</p>";
    }

    $prioridad_emoji = [
      'critica' => '🔴',
      'alta' => '🟠',
      'media' => '🟡',
      'baja' => '🟢'
    ];
    $emoji = $prioridad_emoji[$datos['prioridad']] ?? '⚪';

    return "
            <h2>🎧 Nuevo Ticket de Soporte - TenkiWeb</h2>
            <div style='background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0;'>
                <p><strong>🎫 Ticket ID:</strong> {$ticket_id}</p>
                <p><strong>🏢 Cliente/Empresa:</strong> {$datos['empresa']}</p>
                <p><strong>👤 Contacto:</strong> {$datos['nombre_contacto']}</p>
                <p><strong>📧 Email:</strong> {$datos['email_contacto']}</p>
                " . (!empty($datos['telefono']) ? "<p><strong>📞 Teléfono:</strong> {$datos['telefono']}</p>" : "") . "
                <p><strong>{$emoji} Prioridad:</strong> {$datos['prioridad']}</p>
                <p><strong>🏷️ Tipo:</strong> {$datos['tipo_solicitud']}</p>
            </div>
            
            {$info_cliente}
            
            <div style='background: #fff; padding: 15px; border: 1px solid #ddd; border-radius: 5px; margin: 10px 0;'>
                <p><strong>📝 Asunto:</strong> {$datos['asunto']}</p>
                <p><strong>📄 Descripción:</strong><br>{$datos['descripcion']}</p>
                " . (!empty($datos['pasos_reproducir']) ? "<p><strong>🔄 Pasos para Reproducir:</strong><br>{$datos['pasos_reproducir']}</p>" : "") . "
            </div>
            
            <p><small>📅 Ticket creado: " . date('Y-m-d H:i:s') . "</small></p>
        ";
  }

  /**
   * Obtener detalles de un ticket
   */
  public function obtenerTicket($ticket_id, $user_id = null)
  {
    $sql = "SELECT * FROM soporte_tickets WHERE ticket_id = ?";
    $params = [$ticket_id];
    $types = "s";

    if ($user_id) {
      $sql .= " AND usuario_id = ?";
      $params[] = $user_id;
      $types .= "i";
    }

    $stmt = $this->conexion->prepare($sql);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();

    $resultado = $stmt->get_result();
    return $resultado->fetch_assoc();
  }

  /**
   * Enviar email real usando PHPMailer
   */
  private function enviarEmailReal($destinatario, $asunto, $mensaje, $es_html = true)
  {
    try {
      require_once dirname(__DIR__) . '/Nodemailer/PHPMailer-6.8.0/PHPMailer-6.8.0/src/PHPMailer.php';
      require_once dirname(__DIR__) . '/Nodemailer/PHPMailer-6.8.0/PHPMailer-6.8.0/src/SMTP.php';
      require_once dirname(__DIR__) . '/Nodemailer/PHPMailer-6.8.0/PHPMailer-6.8.0/src/Exception.php';

      $mail = new PHPMailer\PHPMailer\PHPMailer(true);

      // Configuración del servidor SMTP de tenkiweb.com
      $mail->isSMTP();
      $mail->Host = 'mail.tenkiweb.com';
      $mail->SMTPAuth = true;
      $mail->Username = 'soporte@test.tenkiweb.com';
      $mail->Password = '$y1bh+u1wc*1';
      $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS; // SSL para puerto 465
      $mail->Port = 465;

      // Configuración del email
      $mail->setFrom('soporte@test.tenkiweb.com', 'TenkiWeb Soporte');
      $mail->addAddress($destinatario);

      // Agregar copia oculta a ambos emails de soporte
      $mail->addBCC('luisglogista@gmail.com');
      $mail->addBCC('vivichimenti@gmail.com');

      $mail->isHTML($es_html);
      $mail->Subject = $asunto;
      $mail->Body = $mensaje;
      $mail->CharSet = 'UTF-8';

      $mail->send();
      return true;
    } catch (Exception $e) {
      error_log("Error enviando email: " . $e->getMessage());
      return false;
    }
  }
}
