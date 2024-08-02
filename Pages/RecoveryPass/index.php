<?php
session_start();
// define('SSO', $_SESSION['login_sso']['sso']);
// if (!SSO) {
//   $_SESSION['login_sso']['sso'] = 'null';
// }

header('Content-Type: text/html;charset=utf-8');
require_once dirname(dirname(__DIR__)) . '/ErrorLogger.php';
ErrorLogger::initialize(dirname(dirname(__DIR__)) . '/logs/error.log');
require_once dirname(dirname(__DIR__)) . '/config.php';
if (isset($_SESSION['timezone'])) {
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
  <link rel='shortcut icon' type = 'image / x-icon' href='../../assets/img/favicon.ico'>
  <link rel='stylesheet' type='text/css' href='../../Pages/RecoveryPass/recovery.css?v=<?php echo(time()); ?>' media='screen'>
  <link rel='stylesheet' type='text/css' href='../../assets/css/spinner.css?v=<?php echo(time()); ?>' media='screen'>
  <title>Tenki</title>
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
  <div class="div-recovery">
</div>

  </main>
  <footer>
    <?php
      include_once('../../includes/molecules/footer.php');
    ?>
  </footer>
<script type='module' src='../../config.js?v=<?php echo(time()); ?>'></script>
<script type='module' src='../../Pages/RecoveryPass/recovery.js?v=<?php echo(time()); ?>'></script>
<script type='module' src='../../Pages/RecoveryPass/Controllers/traerRegistros.js?v=<?php echo(time()); ?>'></script>
</body>
</html>