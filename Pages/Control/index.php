 <?php
ob_start();
header('Content-Type: text/html;charset=utf-8');
session_start([
    // 'cookie_samesite' => 'None',
    'cookie_secure' => true  // Asegura que la cookie solo se envía sobre HTTPS
]);
$url = "https://tenkiweb.com/tcontrol/index.php";
define('SSO', $_SESSION['login_sso']['sso']);
 if (isset($_SESSION['login_sso']['email'] )) {
      define('EMAIL', $_SESSION['login_sso']['email']);
      
  } else {
    if ( SSO === null || SSO === 's_sso' ) {
      $url = "https://tenkiweb.com/tcontrol/index.php";
    }

    header("Location: ". $url ."");
  }

require_once dirname(dirname(__DIR__)) . '/config.php';
?>
<!DOCTYPE html>
<!-- <html lang='en'> -->
<head>
  <meta charset='UTF-8'>
  <meta name='description' content='TenkiWeb'>
  <meta name='author' content='Luis1940-bot'>
  <meta http-equiv='X-UA-Compatible' content='IE=edge'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <link rel='shortcut icon' type = 'image / x-icon' href='<?php echo BASE_URL ?>/assets/img/favicon.ico'>
  <link rel='stylesheet' type='text/css' href='<?php echo BASE_URL ?>/Pages/Control/css/control.css?v=<?php echo(time()); ?>' media='screen'>
  <link rel='stylesheet' type='text/css' href='<?php echo BASE_URL ?>/assets/css/spinner.css?v=<?php echo(time()); ?>' media='screen'>
  <link rel='stylesheet' type='text/css' href='<?php echo BASE_URL ?>/assets/css/alerta.css?v=<?php echo(time()); ?>' media='screen'>
  <link rel='stylesheet' type='text/css' href='<?php echo BASE_URL ?>/assets/css/modal.css?v=<?php echo(time()); ?>' media='screen'>
  <title>Tenki</title>
</head>
<body>
  <div class='spinner'></div>
  <header>
    <?php
      include('../../includes/molecules/header.php');
      include('../../includes/molecules/encabezado.php');
      include('../../includes/molecules/wichControl.php');
    ?>
    </div>
     <div class='div-span'>
        <span  id='doc'></span><span  id='numberDoc'></span>
        <hr>
    </div>
  </header>
  <main>
    <table id='tableControl'>
        <thead></thead>
        <tbody></tbody>
    </table>
    <input type='file' id='imageInput' accept='.jpg, .jpeg, .png, .bmp' multiple style='display: none;'>
  </main>
  <footer>
    <?php
      include('../../includes/molecules/footer.php');
    ?>
  </footer>
    <?php
      include_once('../../includes/molecules/modales/modal.php');
      include_once('../../includes/molecules/modales/modalInforme.php');
    ?>
<script type='module' src='./control.js?v=<?php echo(time()); ?>'></script>
</body>
</html>