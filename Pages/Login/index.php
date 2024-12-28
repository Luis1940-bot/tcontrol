<?php
// session_start();
session_start([
    'cookie_secure' => true, // Asegura que la cookie solo se envía sobre HTTPS 
    'cookie_httponly' => true, // Evita el acceso de JavaScript a la cookie 
    'cookie_samesite' => 'Strict' // Previene ataques CSRF
]);
header('Content-Type: text/html;charset=utf-8');
header("Content-Security-Policy: default-src 'self'; img-src 'self' https:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;");
header("Strict-Transport-Security: max-age=31536000; includeSubDomains; preload"); 
header("X-Content-Type-Options: nosniff"); 
header("X-Frame-Options: DENY"); 
header("X-XSS-Protection: 1; mode=block");

// if (isset($_SESSION['login_sso'])) {
//     define('SSO', $_SESSION['login_sso']['sso'] ?? null);
//     define('EMAIL', $_SESSION['login_sso']['email'] ?? null);
// } else {
//     define('SSO', null);
//     define('EMAIL', null);
// }

// if (!isset($_SESSION['login_sso']['email']) && (SSO === null || SSO === 's_sso')) {
//     $url = "https://tenkiweb.com/tcontrol/Pages/Login/index.php";
//     // header("Location: ". $url ."");
// }

require_once dirname(dirname(__DIR__)) . '/ErrorLogger.php';
ErrorLogger::initialize(dirname(dirname(__DIR__)) . '/logs/error.log');
require_once dirname(dirname(__DIR__)) . '/config.php';

?>
<!DOCTYPE html>
<html lang='es'>
<head>
  <meta charset='UTF-8'>
  <meta name='description'>
  <meta name='author' content='Luis1940-bot'>
  <meta http-equiv='X-UA-Compatible' content='IE=edge'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <link rel='shortcut icon' type = 'image / x-icon' href='<?php echo BASE_URL ?>/assets/img/favicon.ico'>
  <link rel='stylesheet' type='text/css' href='<?php echo BASE_URL ?>/Pages/Login/login.css?v=<?php echo(time()); ?>' media='screen'>
  <link rel='stylesheet' type='text/css' href='<?php echo BASE_URL ?>/assets/css/spinner.css?v=<?php echo(time()); ?>' media='screen'>
  <title>Tenki</title>
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
<script type='module' src='<?php echo BASE_URL ?>/config.js?v=<?php echo(time()); ?>'></script>
<script type='module' src='<?php echo BASE_URL ?>/Pages/Login/login.js?v=<?php echo(time()); ?>'></script>
<script type='module' src='<?php echo BASE_URL ?>/Pages/Login/Controllers/enviarFormulario.js?v=<?php echo(time()); ?>'></script>
</body>
</html>