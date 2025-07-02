<?php
require_once dirname(dirname(__DIR__)) . '/config.php';
require_once dirname(dirname(__DIR__)) . '/ErrorLogger.php';
ErrorLogger::initialize(dirname(dirname(__DIR__)) . '/logs/error.log');

// Configurar headers de seguridad y sesión
$nonce = setSecurityHeaders();
startSecureSession();
// Verificar si el usuario está logueado (pero no redirigir)
$usuario_logueado = isset($_SESSION['user_id']);
$user_id = $_SESSION['user_id'] ?? null;
$user_name = $_SESSION['user_name'] ?? '';
$user_email = $_SESSION['user_email'] ?? '';

$baseUrl = BASE_URL;

// Procesar formulario si se envía
$mensaje_exito = '';
$mensaje_error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Debug: Log que se está procesando el POST
  ErrorLogger::log("🔄 Procesando formulario de soporte POST");
  ErrorLogger::log("📝 Datos POST recibidos: " . print_r($_POST, true));

  try {
    // Validar campos requeridos
    $campos_requeridos = [
      'tipo_cliente' => 'Tipo de solicitante',
      'empresa' => 'Empresa/Cliente',
      'nombre_contacto' => 'Nombre completo',
      'email_contacto' => 'Email',
      'tipo_solicitud' => 'Tipo de solicitud',
      'prioridad' => 'Prioridad',
      'asunto' => 'Asunto',
      'descripcion' => 'Descripción'
    ];

    $errores = [];
    foreach ($campos_requeridos as $campo => $nombre) {
      if (empty($_POST[$campo])) {
        $errores[] = "El campo '$nombre' es requerido";
      }
    }

    // Validar email
    if (!empty($_POST['email_contacto']) && !filter_var($_POST['email_contacto'], FILTER_VALIDATE_EMAIL)) {
      $errores[] = "El formato del email no es válido";
    }

    // Procesar archivo adjunto si existe
    $archivo_adjunto = null;
    if (isset($_FILES['archivo_adjunto']) && $_FILES['archivo_adjunto']['error'] === UPLOAD_ERR_OK) {
      $archivo = $_FILES['archivo_adjunto'];

      // Validar tamaño (5MB máximo)
      if ($archivo['size'] > 5 * 1024 * 1024) {
        $errores[] = "El archivo es demasiado grande. Máximo 5MB permitido";
      }

      // Validar tipo de archivo
      $extensiones_permitidas = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'txt', 'zip'];
      $extension = strtolower(pathinfo($archivo['name'], PATHINFO_EXTENSION));
      if (!in_array($extension, $extensiones_permitidas)) {
        $errores[] = "Tipo de archivo no permitido. Use: " . implode(', ', $extensiones_permitidas);
      }

      if (empty($errores)) {
        // Crear directorio de uploads si no existe
        $upload_dir = dirname(__DIR__, 2) . '/uploads/soporte/';
        if (!is_dir($upload_dir)) {
          mkdir($upload_dir, 0755, true);
        }

        // Generar nombre único para el archivo
        $nombre_archivo = date('Y-m-d_H-i-s') . '_' . uniqid() . '.' . $extension;
        $ruta_archivo = $upload_dir . $nombre_archivo;

        if (move_uploaded_file($archivo['tmp_name'], $ruta_archivo)) {
          $archivo_adjunto = $nombre_archivo;
        } else {
          $errores[] = "Error al subir el archivo";
        }
      }
    }

    if (empty($errores)) {
      // Conectar a la base de datos
      require_once dirname(__DIR__, 2) . '/Routes/datos_base.php';

      try {
        $pdo = new PDO(
          "mysql:host={$host};dbname={$dbname};charset=utf8mb4",
          $user,
          $password,
          [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
          ]
        );

        // Preparar datos para inserción
        $ticket_id = 'TK-' . date('Ymd') . '-' . sprintf('%04d', rand(1, 9999));

        ErrorLogger::log("🎫 Creando ticket: $ticket_id");                // Obtener información del navegador y IP
        $info_navegador = $_SERVER['HTTP_USER_AGENT'] ?? '';
        $ip_cliente = $_SERVER['REMOTE_ADDR'] ?? $_SERVER['HTTP_CLIENT_IP'] ?? $_SERVER['HTTP_X_FORWARDED_FOR'] ?? 'unknown';

        // Preparar archivos adjuntos como JSON si existe
        $archivos_adjuntos = null;
        if ($archivo_adjunto) {
          $archivos_adjuntos = json_encode([
            'nombre_original' => $_FILES['archivo_adjunto']['name'] ?? '',
            'nombre_archivo' => $archivo_adjunto,
            'tipo_mime' => $_FILES['archivo_adjunto']['type'] ?? '',
            'tamaño' => $_FILES['archivo_adjunto']['size'] ?? 0
          ]);
        }

        $sql = "INSERT INTO soporte_tickets (
                    ticket_id, usuario_id, tipo_cliente, planta_cliente, como_conocio, es_cliente_logueado,
                    empresa, nombre_contacto, email_contacto, telefono,
                    tipo_solicitud, prioridad, asunto, descripcion, pasos_reproducir,
                    modulo_pagina, info_navegador, ip_cliente, archivos_adjuntos, estado
                ) VALUES (
                    :ticket_id, :usuario_id, :tipo_cliente, :planta_cliente, :como_conocio, :es_cliente_logueado,
                    :empresa, :nombre_contacto, :email_contacto, :telefono,
                    :tipo_solicitud, :prioridad, :asunto, :descripcion, :pasos_reproducir,
                    :modulo_pagina, :info_navegador, :ip_cliente, :archivos_adjuntos, 'abierto'
                )";

        $stmt = $pdo->prepare($sql);
        $resultado = $stmt->execute([
          ':ticket_id' => $ticket_id,
          ':usuario_id' => $user_id,
          ':tipo_cliente' => $_POST['tipo_cliente'],
          ':planta_cliente' => $_POST['planta_cliente'] ?? null,
          ':como_conocio' => $_POST['como_conocio'] ?? null,
          ':es_cliente_logueado' => $usuario_logueado ? 1 : 0,
          ':empresa' => $_POST['empresa'],
          ':nombre_contacto' => $_POST['nombre_contacto'],
          ':email_contacto' => $_POST['email_contacto'],
          ':telefono' => $_POST['telefono'] ?? null,
          ':tipo_solicitud' => $_POST['tipo_solicitud'],
          ':prioridad' => $_POST['prioridad'],
          ':asunto' => $_POST['asunto'],
          ':descripcion' => $_POST['descripcion'],
          ':pasos_reproducir' => $_POST['pasos_reproducir'] ?? null,
          ':modulo_pagina' => $_POST['modulo_pagina'] ?? $_SERVER['HTTP_REFERER'] ?? null,
          ':info_navegador' => $info_navegador,
          ':ip_cliente' => $ip_cliente,
          ':archivos_adjuntos' => $archivos_adjuntos
        ]);
        if ($resultado) {
          ErrorLogger::log("✅ Ticket creado exitosamente: $ticket_id");

          // Enviar emails de confirmación
          try {
            ErrorLogger::log("📧 Iniciando envío de emails para ticket: $ticket_id");

            // Usar PHPMailer directamente desde la nueva ubicación
            require_once dirname(__DIR__, 2) . '/Nodemailer/PHPMailer-6.8.0/PHPMailer-6.8.0/src/PHPMailer.php';
            require_once dirname(__DIR__, 2) . '/Nodemailer/PHPMailer-6.8.0/PHPMailer-6.8.0/src/SMTP.php';
            require_once dirname(__DIR__, 2) . '/Nodemailer/PHPMailer-6.8.0/PHPMailer-6.8.0/src/Exception.php';

            // Configurar PHPMailer
            $mail = new PHPMailer\PHPMailer\PHPMailer(true);
            $mail->isSMTP();
            $mail->Host = 'mail.tenkiweb.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'soporte@test.tenkiweb.com';
            $mail->Password = '$y1bh+u1wc*1';
            $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
            $mail->Port = 465;
            $mail->CharSet = 'UTF-8';

            // 1. Email de confirmación al cliente
            $mail->setFrom('soporte@test.tenkiweb.com', 'TenkiWeb Soporte');
            $mail->addAddress($_POST['email_contacto']);
            $mail->isHTML(true);
            $mail->Subject = "Confirmación de Ticket #{$ticket_id} - TenkiWeb Soporte";

            $mensaje_cliente = "
                            <h2>Confirmación de Ticket de Soporte - TenkiWeb</h2>
                            <p>Estimado/a {$_POST['nombre_contacto']},</p>
                            <p>Hemos recibido tu solicitud de soporte con los siguientes detalles:</p>
                            <ul>
                                <li><strong>Ticket ID:</strong> {$ticket_id}</li>
                                <li><strong>Empresa:</strong> {$_POST['empresa']}</li>
                                <li><strong>Asunto:</strong> {$_POST['asunto']}</li>
                                <li><strong>Prioridad:</strong> {$_POST['prioridad']}</li>
                                <li><strong>Tipo:</strong> {$_POST['tipo_solicitud']}</li>
                            </ul>
                            <p>Te contactaremos pronto según nuestro SLA de soporte.</p>
                            <p>Saludos,<br>Equipo TenkiWeb</p>
                        ";

            $mail->Body = $mensaje_cliente;
            $mail->send();
            ErrorLogger::log("✅ Email confirmación enviado al cliente: {$_POST['email_contacto']}");

            // 2. Email de notificación al equipo de soporte
            $mail->clearAddresses();
            $mail->addAddress('luisglogista@gmail.com');
            $mail->addBCC('vivichimenti@gmail.com');

            $prioridad_emoji = [
              'critica' => '🔴',
              'alta' => '🟠',
              'media' => '🟡',
              'baja' => '🟢'
            ];
            $emoji = $prioridad_emoji[$_POST['prioridad']] ?? '⚪';

            $mail->Subject = "Nuevo Ticket #{$ticket_id} - Prioridad: {$_POST['prioridad']}";
            $mensaje_soporte = "
                            <h2>🎧 Nuevo Ticket de Soporte - TenkiWeb</h2>
                            <div style='background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0;'>
                                <p><strong>🎫 Ticket ID:</strong> {$ticket_id}</p>
                                <p><strong>🏢 Cliente/Empresa:</strong> {$_POST['empresa']}</p>
                                <p><strong>👤 Contacto:</strong> {$_POST['nombre_contacto']}</p>
                                <p><strong>📧 Email:</strong> {$_POST['email_contacto']}</p>
                                <p><strong>{$emoji} Prioridad:</strong> {$_POST['prioridad']}</p>
                                <p><strong>🏷️ Tipo:</strong> {$_POST['tipo_solicitud']}</p>
                            </div>
                            <div style='background: #fff; padding: 15px; border: 1px solid #ddd; border-radius: 5px; margin: 10px 0;'>
                                <p><strong>📝 Asunto:</strong> {$_POST['asunto']}</p>
                                <p><strong>📄 Descripción:</strong><br>" . nl2br(htmlspecialchars($_POST['descripcion'])) . "</p>
                            </div>
                            <p><small>📅 Ticket creado: " . date('Y-m-d H:i:s') . "</small></p>
                        ";

            $mail->Body = $mensaje_soporte;
            $mail->send();
            ErrorLogger::log("✅ Email soporte enviado exitosamente - Ticket: {$ticket_id}");
          } catch (Exception $email_error) {
            ErrorLogger::log("❌ Error al enviar emails: " . $email_error->getMessage());
            // No fallar el proceso si hay error en email, solo loggear
          }

          $mensaje_exito = "Ticket creado exitosamente. Número: $ticket_id";

          // Limpiar variables POST para evitar reenvío
          $_POST = [];
        } else {
          $mensaje_error = "Error al crear el ticket. Inténtelo nuevamente.";
          ErrorLogger::log("❌ Error: No se pudo insertar en BD");
        }
      } catch (Exception $db_error) {
        ErrorLogger::log("❌ Error de BD: " . $db_error->getMessage());
        $mensaje_error = "Error de conexión con la base de datos.";
      }
    } else {
      $mensaje_error = implode('<br>', $errores);
      ErrorLogger::log("❌ Errores de validación: " . implode('; ', $errores));
    }
  } catch (Exception $e) {
    ErrorLogger::log("Error en formulario de soporte: " . $e->getMessage());
    $mensaje_error = "Error interno del servidor. Inténtelo más tarde.";
  }
}

?>
<!DOCTYPE html>
<html lang='es'>

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Soporte Técnico - TenkiWeb</title>
  <link rel='shortcut icon' type='image / x-icon' href='<?= $baseUrl ?>/assets/img/favicon.ico'>
  <link rel="stylesheet" href="<?= $baseUrl ?>/assets/css/common-components.css">
  <link rel="stylesheet" href="<?= $baseUrl ?>/Pages/Login/login.css">
  <link rel="stylesheet" href="<?= $baseUrl ?>/Pages/Soporte/soporte.css?v=<?php echo time(); ?>">
  <script src="<?= BASE_URL ?>/assets/js/disableConsole.js"></script>
</head>

<body>
  <div class="spinner"></div>
  <header>
    <?php
    include_once('../../includes/molecules/header.php');
    include_once('../../includes/molecules/encabezado.php');
    ?>
  </header>

  <!-- Header del soporte - FUERA del main, como debe ser -->
  <div class="soporte-header-externo">
    <h1>🎧 Soporte Técnico</h1>
    <p>Estamos aquí para ayudarte. Envía tu consulta y te responderemos según nuestro SLA.</p>
  </div>

  <main>
    <div class="div-login-buttons">
      <?php if ($usuario_logueado): ?>
        <div class="usuario-info">
          <h4>👤 Usuario Autenticado</h4>
          <p><strong>Bienvenido:</strong> <?= htmlspecialchars($user_name) ?> (<?= htmlspecialchars($user_email) ?>)</p>
          <p><small>Tus datos se han completado automáticamente, pero puedes modificarlos si es necesario.</small></p>
        </div>
      <?php else: ?>
        <div class="usuario-info publico">
          <h4>🌐 Formulario de Soporte</h4>
          <p><strong>Complete todos los campos</strong> para que podamos brindarle el mejor soporte posible.</p>
          <p><small>Si es cliente existente, complete los datos de su compañía para un mejor seguimiento.</small></p>
          <div class="info-seguimiento">
            <p><strong>💡 Tip:</strong> <a href="<?= BASE_URL ?>/Pages/Login/">Inicie sesión</a> o <a href="<?= BASE_URL ?>/Pages/RegisterUser/">cree una cuenta</a> para hacer seguimiento a sus tickets de soporte.</p>
          </div>
        </div>
      <?php endif; ?>

      <?php if ($mensaje_exito): ?>
        <div class="mensaje-exito">
          <strong>✅ Éxito:</strong> <?= htmlspecialchars($mensaje_exito) ?>
          <br><small>Recibirás una confirmación por email y te contactaremos pronto.</small>
        </div>
      <?php endif; ?>

      <?php if ($mensaje_error): ?>
        <div class="mensaje-error">
          <strong>❌ Error:</strong> <?= htmlspecialchars($mensaje_error) ?>
        </div>
      <?php endif; ?>

      <form method="POST" enctype="multipart/form-data" id="formulario-soporte">
        <!-- Información del Solicitante - SIEMPRE VISIBLE -->
        <div class="campos-publicos">
          <h4>📋 Información del Solicitante</h4>
          <div class="form-group">
            <label for="tipo_cliente" class="label-login">Tipo de Solicitante *</label>
            <select id="tipo_cliente" name="tipo_cliente" class="select-login" required>
              <option value="">Selecciona...</option>
              <option value="cliente_existente" <?= ($_POST['tipo_cliente'] ?? '') === 'cliente_existente' ? 'selected' : '' ?>>
                👤 Cliente Existente
              </option>
              <option value="cliente_potencial" <?= ($_POST['tipo_cliente'] ?? '') === 'cliente_potencial' ? 'selected' : '' ?>>
                🆕 Cliente Potencial
              </option>
              <option value="consulta_general" <?= ($_POST['tipo_cliente'] ?? '') === 'consulta_general' ? 'selected' : '' ?>>
                ❓ Consulta General
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="planta_cliente" class="label-login">Planta/Ubicación</label>
            <select id="planta_cliente" name="planta_cliente" class="select-login">
              <option value="">Selecciona la planta...</option>
              <option value="102" <?= ($_POST['planta_cliente'] ?? '') === '102' ? 'selected' : '' ?>>Planta 102</option>
              <option value="otra" <?= ($_POST['planta_cliente'] ?? '') === 'otra' ? 'selected' : '' ?>>Otra ubicación</option>
              <option value="no_aplica" <?= ($_POST['planta_cliente'] ?? '') === 'no_aplica' ? 'selected' : '' ?>>No aplica</option>
            </select>
          </div>

          <div class="form-group">
            <label for="como_conocio" class="label-login">¿Cómo conoció TenkiWeb? (opcional)</label>
            <select id="como_conocio" name="como_conocio" class="select-login">
              <option value="">Selecciona...</option>
              <option value="referencia" <?= ($_POST['como_conocio'] ?? '') === 'referencia' ? 'selected' : '' ?>>Referencia</option>
              <option value="web" <?= ($_POST['como_conocio'] ?? '') === 'web' ? 'selected' : '' ?>>Página web</option>
              <option value="redes_sociales" <?= ($_POST['como_conocio'] ?? '') === 'redes_sociales' ? 'selected' : '' ?>>Redes sociales</option>
              <option value="evento" <?= ($_POST['como_conocio'] ?? '') === 'evento' ? 'selected' : '' ?>>Evento/Feria</option>
              <option value="otro" <?= ($_POST['como_conocio'] ?? '') === 'otro' ? 'selected' : '' ?>>Otro</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="empresa" class="label-login">Empresa/Cliente *</label>
          <input type="text" id="empresa" name="empresa" class="input-login" required
            value="<?= htmlspecialchars($_POST['empresa'] ?? '') ?>">
        </div>
        <div class="form-group">
          <label for="nombre_contacto" class="label-login">Nombre Completo *</label>
          <input type="text" id="nombre_contacto" name="nombre_contacto" class="input-login" required
            value="<?= htmlspecialchars($_POST['nombre_contacto'] ?? $user_name) ?>">
        </div>

        <div class="form-group">
          <label for="email_contacto" class="label-login">Email *</label>
          <input type="email" id="email_contacto" name="email_contacto" class="input-login" required
            value="<?= htmlspecialchars($_POST['email_contacto'] ?? $user_email) ?>">
        </div>
        <div class="form-group">
          <label for="telefono" class="label-login">Teléfono (opcional)</label>
          <input type="tel" id="telefono" name="telefono" class="input-login"
            value="<?= htmlspecialchars($_POST['telefono'] ?? '') ?>">
        </div>

        <div class="form-group">
          <label for="tipo_solicitud" class="label-login">Tipo de Solicitud *</label>
          <select id="tipo_solicitud" name="tipo_solicitud" class="select-login" required>
            <option value="">Selecciona el tipo...</option>
            <option value="incidente_tecnico" <?= ($_POST['tipo_solicitud'] ?? '') === 'incidente_tecnico' ? 'selected' : '' ?>>
              🚨 Incidente Técnico
            </option>
            <option value="reporte_error" <?= ($_POST['tipo_solicitud'] ?? '') === 'reporte_error' ? 'selected' : '' ?>>
              🐛 Reporte de Error
            </option>
            <option value="solicitud_cambio" <?= ($_POST['tipo_solicitud'] ?? '') === 'solicitud_cambio' ? 'selected' : '' ?>>
              🔧 Solicitud de Cambio
            </option>
            <option value="consulta_funcionalidad" <?= ($_POST['tipo_solicitud'] ?? '') === 'consulta_funcionalidad' ? 'selected' : '' ?>>
              ❓ Consulta sobre Funcionalidad
            </option>
            <option value="solicitud_capacitacion" <?= ($_POST['tipo_solicitud'] ?? '') === 'solicitud_capacitacion' ? 'selected' : '' ?>>
              📚 Solicitud de Capacitación
            </option>
            <option value="otros" <?= ($_POST['tipo_solicitud'] ?? '') === 'otros' ? 'selected' : '' ?>>
              📝 Otros
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="prioridad" class="label-login">Prioridad *</label>
          <select id="prioridad" name="prioridad" class="select-login" required>
            <option value="baja" <?= ($_POST['prioridad'] ?? 'media') === 'baja' ? 'selected' : '' ?>>
              🟢 Baja - Consulta general
            </option>
            <option value="media" <?= ($_POST['prioridad'] ?? 'media') === 'media' ? 'selected' : '' ?>>
              🟡 Media - Mejora requerida
            </option>
            <option value="alta" <?= ($_POST['prioridad'] ?? 'media') === 'alta' ? 'selected' : '' ?>>
              🟠 Alta - Funcionalidad limitada
            </option>
            <option value="critica" <?= ($_POST['prioridad'] ?? 'media') === 'critica' ? 'selected' : '' ?>>
              🔴 Crítica - Sistema no funciona
            </option>
          </select>
        </div>

        <div class="prioridad-info">
          <h4>📋 Tiempos de Respuesta (SLA)</h4>
          <div class="prioridad-item"><strong>🔴 Crítica:</strong> 1 hora respuesta, 4 horas resolución</div>
          <div class="prioridad-item"><strong>🟠 Alta:</strong> 4 horas respuesta, 24 horas resolución</div>
          <div class="prioridad-item"><strong>🟡 Media:</strong> 8 horas respuesta, 72 horas resolución</div>
          <div class="prioridad-item"><strong>🟢 Baja:</strong> 24 horas respuesta, 168 horas resolución</div>
        </div>

        <div class="form-group">
          <label for="asunto" class="label-login">Asunto *</label>
          <input type="text" id="asunto" name="asunto" class="input-login" required
            placeholder="Resumen breve del problema o solicitud"
            value="<?= htmlspecialchars($_POST['asunto'] ?? '') ?>">
        </div>

        <div class="form-group">
          <label for="descripcion" class="label-login">Descripción Detallada *</label>
          <textarea id="descripcion" name="descripcion" class="input-login" required
            placeholder="Describe el problema, error o solicitud con el mayor detalle posible..."><?= htmlspecialchars($_POST['descripcion'] ?? '') ?></textarea>
        </div>

        <div class="form-group">
          <label for="pasos_reproducir" class="label-login">Pasos para Reproducir (si es un error)</label>
          <textarea id="pasos_reproducir" name="pasos_reproducir" class="input-login"
            placeholder="1. Ingresé a la página...&#10;2. Hice clic en...&#10;3. Apareció el error..."><?= htmlspecialchars($_POST['pasos_reproducir'] ?? '') ?></textarea>
        </div>

        <div class="form-group">
          <label for="archivo_adjunto" class="label-login">Archivo Adjunto (opcional)</label>
          <input type="file" id="archivo_adjunto" name="archivo_adjunto" class="input-login"
            accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt,.zip">
          <div class="archivo-info">
            Formatos permitidos: JPG, PNG, PDF, DOC, TXT, ZIP. Máximo 5MB.
          </div>
        </div>

        <div class="form-buttons">
          <button type="submit" class="btn-enviar button-login">
            🚀 Enviar Ticket de Soporte
          </button>

          <?php if ($usuario_logueado): ?>
            <!-- Usuario logueado: puede ver sus tickets -->
            <a href="historial.php" class="btn-historial button-login">
              📋 Ver Mis Tickets
            </a>
          <?php else: ?>
            <!-- Usuario público: enlace para crear cuenta o login -->
            <a href="<?= BASE_URL ?>/Pages/Login/" class="btn-historial button-login" title="Inicia sesión para ver el historial de tus tickets">
              🔐 Iniciar Sesión
            </a>
          <?php endif; ?>
        </div>
      </form>
    </div> <!-- Cierre de div-login-buttons -->
  </main>

  <footer>
    <?php require_once dirname(dirname(__DIR__)) . "/includes/molecules/footer.php"; ?>

  </footer>

  <!-- Configuración para JavaScript -->
  <script nonce="<?= $nonce ?>">
    // Configuración global para el soporte
    window.SoporteConfig = {
      usuarioLogueado: <?= $usuario_logueado ? 'true' : 'false' ?>
    };
  </script>

  <!-- JavaScript principal del soporte -->
  <script nonce="<?= $nonce ?>" type="module" src="<?php echo BASE_URL ?>/Pages/Soporte/soporte.js"></script>

</body>

</html>