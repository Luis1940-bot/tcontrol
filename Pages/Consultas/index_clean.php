<?php
require_once dirname(dirname(__DIR__)) . '/config.php';
startSecureSession();
$nonce = setSecurityHeaders();

require_once dirname(dirname(__DIR__)) . '/ErrorLogger.php';
ErrorLogger::initialize(dirname(dirname(__DIR__)) . '/logs/error.log');

// Tiempo de inactividad en segundos (12 horas)
$inactive = 43200;
$lastActivity = $_SESSION['last_activity'] ?? 0;
// Verifica si la sesión ha estado inactiva por más de 12 horas
if (is_int($lastActivity) && (time() - $lastActivity) > $inactive) {
  session_unset();
  session_destroy();
  header("Location: " . BASE_URL . "/index.php");
  exit();
}

// Actualiza la última actividad
$_SESSION['last_activity'] = time();

// Validar si 'login_sso' está definido y es un array
if (isset($_SESSION['login_sso']) && is_array($_SESSION['login_sso'])) {
  $sso = $_SESSION['login_sso']['sso'] ?? null;
  $email = $_SESSION['login_sso']['email'] ?? null;

  define('SSO', $sso);
  if ($email !== null) {
    define('EMAIL', $email);
  } else {
    header("Location: " . BASE_URL . "/Pages/Login/index.php");
    exit;
  }
} else {
  header("Location: " . BASE_URL . "/Pages/Login/index.php");
  exit;
}

// Validar y establecer la zona horaria
if (isset($_SESSION['timezone']) && is_string($_SESSION['timezone'])) {
  date_default_timezone_set($_SESSION['timezone']);
} else {
  date_default_timezone_set('America/Argentina/Buenos_Aires');
}
?>
<!DOCTYPE html>
<html>

<head>
  <meta charset='UTF-8'>
  <meta name='description' content=''>
  <meta name='author' content='Luis1940-bot'>
  <meta http-equiv='X-UA-Compatible' content='IE=edge'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <link rel='shortcut icon' type='image/x-icon' href='<?php echo BASE_URL ?>/assets/img/favicon.ico'>
  <link rel='stylesheet' type='text/css' href='<?php echo BASE_URL ?>/Pages/Consultas/consults.css?v=<?php echo (time()); ?>' media='screen'>
  <link rel='stylesheet' type='text/css' href='<?php echo BASE_URL ?>/assets/css/spinner.css?v=<?php echo (time()); ?>' media='screen'>
  <link rel='stylesheet' type='text/css' href='<?php echo BASE_URL ?>/assets/css/common-components.css' media='screen'>
  <title>Consultas - Tenki Web</title>
  <script nonce="<?= $nonce ?>" src="<?= BASE_URL ?>/assets/js/disableConsole.js"></script>
  <script nonce="<?= $nonce ?>">
    // Establecer idioma dinámicamente
    document.documentElement.lang = 'es';
  </script>
</head>

<body>
  <div class="spinner"></div>
  <header>

    <?php
    include_once('../../includes/molecules/header.php');
    include_once('../../includes/molecules/encabezado.php');
    include_once('../../includes/molecules/whereUs.php');

    ?>
  </header>
  <main>
    <div class='div-consultas-buttons'>

    </div>
  </main>
  <footer>
    <?php
    include_once('../../includes/molecules/footer.php');
    ?>
  </footer>
  <script nonce="<?= $nonce ?>" type='module' src='<?php echo BASE_URL ?>/config.js?v=<?php echo (time()); ?>'></script>
  <script nonce="<?= $nonce ?>" type='module' src='<?php echo BASE_URL ?>/Pages/Consultas/consults.js?v=<?php echo (time()); ?>'></script>
</body>

</html>