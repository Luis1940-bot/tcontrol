<?php

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

// Configurar headers de seguridad y sesiÃ³n usando funciones helper
require_once dirname(dirname(__DIR__)) . '/config.php';
startSecureSession();
$nonce = setSecurityHeaders();

require_once dirname(dirname(__DIR__)) . '/ErrorLogger.php';
ErrorLogger::initialize(dirname(dirname(__DIR__)) . '/logs/error.log');
require_once dirname(dirname(__DIR__)) . '/config.php';
/** @var string $baseUrl */
$baseUrl = BASE_URL;
/** 
 * @var array{timezone?: string} $_SESSION 
 */
if (isset($_SESSION['timezone']) && is_string($_SESSION['timezone'])) {
  date_default_timezone_set($_SESSION['timezone']);
} else {
  date_default_timezone_set('America/Argentina/Buenos_Aires');
}
// echo "Zona horaria actual: " . date_default_timezone_get() . "<br>";
// echo "Fecha y hora actual: " . date('Y-m-d H:i:s') . "<br>";

?>

<!DOCTYPE html>
<!-- <html lang='br'> -->

<head>
  <meta charset='UTF-8'>
  <meta name='description'>
  <meta name='author' content='Luis1940-bot'>
  <meta http-equiv='X-UA-Compatible' content='IE=edge'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <link rel='shortcut icon' type='image / x-icon' href='<?php echo BASE_URL ?>/assets/img/favicon.ico'>
  <link rel='stylesheet' type='text/css' href='<?php echo BASE_URL ?>/Pages/AuthUser/auth.css?v=<?php echo (time()); ?>' media='screen'>
  <link rel='stylesheet' type='text/css' href='<?php echo BASE_URL ?>/assets/css/spinner.css?v=<?php echo (time()); ?>' media='screen'>
  <title>Tenki</title>
  <script src="<?= BASE_URL ?>/assets/js/disableConsole.js"></script>
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
    <div class="div-auth">
    </div>
  </main>
  <footer>
    <?php
    include_once('../../includes/molecules/footer.php');
    ?>
  </footer>
  <script type='module' src='<?php echo BASE_URL ?>/config.js?v=<?php echo (time()); ?>'></script>
  <script type='module' src='<?php echo BASE_URL ?>/Pages/AuthUser/auth.js?v=<?php echo (time()); ?>'></script>

</body>

</html>