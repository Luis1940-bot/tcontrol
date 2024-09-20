<?php
header('Content-Type: text/html;charset=utf-8');
session_start([
    // 'cookie_samesite' => 'None',
    'cookie_secure' => true  // Asegura que la cookie solo se envía sobre HTTPS
]);

// Tiempo de inactividad en segundos (12 horas)
$inactive = 43200;

// Verifica si la sesión ha estado inactiva por más de 12 horas
if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity']) > $inactive) {
    session_unset();     // Elimina los datos de sesión
    session_destroy();   // Destruye la sesión
    header("Location:  https://tenkiweb.com/tcontrol/index.php"); // Redirige al login o logout
    exit();
}

// Actualiza la última actividad
$_SESSION['last_activity'] = time();

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
ErrorLogger::initialize(dirname(dirname(__DIR__)) . '/logs/error.log');
if (isset($_SESSION['timezone'])) {
    date_default_timezone_set($_SESSION['timezone']);
} else {
    date_default_timezone_set('America/Argentina/Buenos_Aires');
}
// echo "Zona horaria actual: " . date_default_timezone_get() . "<br>";
// echo "Fecha y hora actual: " . date('Y-m-d H:i:s') . "<br>";
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
  <link rel='stylesheet' type='text/css' href='<?php echo BASE_URL ?>/Pages/Rove/rove.css?v=<?php echo(time()); ?>' media='screen'>
  <link rel='stylesheet' type='text/css' href='<?php echo BASE_URL ?>/assets/css/spinner.css?v=<?php echo(time()); ?>' media='screen'>
  <link rel='stylesheet' type='text/css' href='<?php echo BASE_URL ?>/assets/css/modal.css?v=<?php echo(time()); ?>' media='screen'>
  <link rel='stylesheet' type='text/css' href='<?php echo BASE_URL ?>/assets/css/alerta.css?v=<?php echo(time()); ?>' media='screen'>

  <title></title>
</head>
<body>
  <div class="spinner"></div>
  <header>
    
    <?php
      include('../../includes/molecules/header.php');
      include('../../includes/molecules/encabezado.php');
      include('../../includes/molecules/whereUs.php');
 
    ?>
  </header>
  <main>
    <table id='tableRove'>
    </table>
  </main>
  <footer>
    <?php
       include('../../includes/molecules/footer.php');
    ?>
  </footer>
<script type='module' src='<?php echo BASE_URL ?>/Pages/Rove/rove.js?v=<?php echo(time()); ?>'></script>

</body>
</html>