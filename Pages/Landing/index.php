<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
session_start([
    // 'cookie_samesite' => 'None',
    'cookie_secure' => true  // Asegura que la cookie solo se envía sobre HTTPS
]);
header('Content-Type: text/html;charset=utf-8');
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
  <meta name='description'>
  <meta name='author' content='Luis1940-bot'>
  <meta http-equiv='X-UA-Compatible' content='IE=edge'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <link rel='shortcut icon' type = 'image / x-icon' href='<?php echo BASE_URL ?>/assets/img/favicon.ico'>
  <link rel='stylesheet' type='text/css' href='<?php echo BASE_URL ?>/Pages/Landing/landing.css' media='screen'>
  <link rel='stylesheet' type='text/css' href='<?php echo BASE_URL ?>/assets/css/spinner.css' media='screen'>
  <title></title>
</head>
<body>
  <div class='spinner'></div>
  <header>
    
    <?php
    include_once('../../includes/molecules/header.php');
    include_once('../../includes/molecules/encabezado.php');
    ?>
  </header>
  <main>
    <div class='div-landing-buttons'>

    </div>
    <!-- <div class='div-my-button'><button class='my-button' disabled><img id='seguir'  src='../../assets/img/icons8-arrow-30.png' alt='' height='20px' width='20px'></button></div> -->
  </main>
  <!-- <div><button class='my-button' disabled><img id='seguir'  src='../../assets/img/icons8-arrow-30.png' alt='' height='20px' width='20px'></button></div> -->
  <footer>
    <?php
      include_once('../../includes/molecules/footer.php');
    ?>
  </footer>
  <script type='module' src='<?php echo BASE_URL ?>/config.js?v=<?php echo(time()); ?>'></script>
  <script type='module' src='<?php echo BASE_URL ?>/Pages/Landing/landing.js?v=<?php echo(time()); ?>'></script>
</body>
</html>