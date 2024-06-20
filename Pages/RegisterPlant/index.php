<?php
session_start();
define('SSO', $_SESSION['login_sso']['sso']);
if (!SSO) {
  $_SESSION['login_sso']['sso'] = 'null';
}

header('Content-Type: text/html;charset=utf-8');
require_once dirname(dirname(__DIR__)) . '/config.php';
?>
<!DOCTYPE html>
<!-- <html lang='br'> -->
<head>
  <meta charset='UTF-8'>
  <meta name='description'>
  <meta name='author' content='Luis1940-bot'>
  <meta http-equiv='X-UA-Compatible' content='IE=edge'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <link rel='shortcut icon' type = 'image / x-icon' href='<?php echo BASE_URL ?>/assets/img/favicon.ico'>
  <link rel='stylesheet' type='text/css' href='<?php echo BASE_URL ?>/Pages/RegisterPlant/plant.css?v=<?php echo(time()); ?>' media='screen'>
  <link rel='stylesheet' type='text/css' href='<?php echo BASE_URL ?>/assets/css/spinner.css?v=<?php echo(time()); ?>' media='screen'>
  <title></title>
</head>
<body>
  <div class="spinner"></div>
  <header>
    
    <?php
      include_once('../../includes/molecules/header.php');
      include_once('../../includes/molecules/whereUs.php');
      include_once('../../includes/molecules/encabezado.php');
    ?>
  </header>
  <main>
  <div class="div-plant">
</div>

  </main>
  <footer>
    <?php
      include_once('../../includes/molecules/footer.php');
    ?>
  </footer>
<script type='module' src='<?php echo BASE_URL ?>/Pages/RegisterPlant/plant.js?v=<?php echo(time()); ?>'></script>
</body>
</html>