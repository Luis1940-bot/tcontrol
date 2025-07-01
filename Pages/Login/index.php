<?php
require_once dirname(dirname(__DIR__)) . '/config.php';
require_once dirname(dirname(__DIR__)) . '/ErrorLogger.php';
ErrorLogger::initialize(dirname(dirname(__DIR__)) . '/logs/error.log');

// Configurar headers de seguridad y sesión
$nonce = setSecurityHeaders();
startSecureSession();


?>
<!DOCTYPE html>
<html lang='es'>

<head>
  <meta charset='UTF-8'>
  <meta name='description'>
  <meta name='author' content='Luis1940-bot'>
  <meta http-equiv='X-UA-Compatible' content='IE=edge'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <link rel='shortcut icon' type='image / x-icon' href='<?php echo BASE_URL ?>/assets/img/favicon.ico'>
  <link rel='stylesheet' type='text/css' href='<?php echo BASE_URL ?>/Pages/Login/login.css?v=<?php echo (time()); ?>' media='screen'>
  <link rel='stylesheet' type='text/css' href='<?php echo BASE_URL ?>/assets/css/spinner.css?v=<?php echo (time()); ?>' media='screen'>
  <link rel='stylesheet' type='text/css' href='<?php echo BASE_URL ?>/assets/css/common-components.css' media='screen'>
  <title>Tenki</title>
  <script src="<?= BASE_URL ?>/assets/js/disableConsole.js"></script>
</head>

<body>
  <div class="spinner"></div>
  <header>

    <?php
    include_once('../../includes/molecules/header.php');
    ?>
  </header>
  <main>
    <div class="div-login-buttons"></div>
  </main>
  <footer>
    <?php
    include_once('../../includes/molecules/footer.php');
    ?>
  </footer>
  <script type='module' src='<?php echo BASE_URL ?>/config.js?v=<?php echo (time()); ?>'></script>
  <script type='module' src='<?php echo BASE_URL ?>/Pages/Login/login.js?v=<?php echo (time()); ?>'></script>
  <script type='module' src='<?php echo BASE_URL ?>/Pages/Login/Controllers/enviarFormulario.js?v=<?php echo (time()); ?>'></script>
</body>

</html>