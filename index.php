<?php

header('Content-Type: text/html;charset=utf-8');
$nonce = base64_encode(random_bytes(16));
header("Content-Security-Policy: default-src 'self'; img-src 'self' data: https: tenkiweb.com; script-src 'self' 'nonce-$nonce' cdn.tenkiweb.com; style-src 'self' 'nonce-$nonce' cdn.tenkiweb.com; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;");

header("Strict-Transport-Security: max-age=31536000; includeSubDomains; preload");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");
header("X-XSS-Protection: 1; mode=block");

header("Access-Control-Allow-Origin: https://tenkiweb.com");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

$url = "https://tenkiweb.com/tcontrol/index.php";


if (isset($_SESSION['login_sso']) && is_array($_SESSION['login_sso'])) {
  /** @var array{email: string, sso: string} $login_sso */
  $login_sso = $_SESSION['login_sso'];

  define('SSO', $login_sso['sso']);
  define('EMAIL', $login_sso['email']);
} else {
  define('SSO', null);
  define('EMAIL', null);
  $login_sso = null;
}

if (!is_array($login_sso) || (SSO === null || SSO === 's_sso')) {
  $url = "https://tenkiweb.com/tcontrol/Pages/Login/index.php";
  // header("Location: ". $url ."");
}


require_once './config.php';
require_once __DIR__ . '/ErrorLogger.php';
ErrorLogger::initialize(__DIR__ . '/logs/error.log');

/** @var string $baseUrl */
$baseUrl = BASE_URL;
/** @var string $emailUrl */
$emailUrl = EMAIL;


?>
<!DOCTYPE html>
<html lang='es'>

<head>
  <meta charset='UTF-8'>
  <meta http-equiv='X-UA-Compatible' content='IE=edge'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <meta name='description' content=''>
  <meta name='author' content='Luis1940-bot'>

  <link rel='shortcut icon' type='image / x-icon' href='<?php echo $baseUrl ?>/assets/img/favicon.ico'>
  <link rel='stylesheet' type='text/css' href='<?php echo $baseUrl ?>/assets/css/style.css?v=<?php echo (time()); ?>' media='screen'>
  <link rel='stylesheet' type='text/css' href='<?php echo $baseUrl ?>/assets/css/spinner.css?v=<?php echo (time()); ?>' media='screen'>
  <title></title>
  <script src="<?= BASE_URL ?>/assets/js/disableConsole.js"></script>




  <script nonce="<?= $nonce ?>">
    // Código JavaScript seguro 
  </script>
  <style nonce="<?= $nonce ?>">
    /* Código CSS seguro */
  </style>
</head>

<body>
  <input type="hidden" id="email" value="<?php echo $emailUrl; ?>">
  <div class="spinner"></div>
  <div class='headerFactum'>
    <div class='logoFactum'>
      <a id='linkInstitucional'>
        <img id='logo_png'>
      </a>
    </div>
  </div>
  <script type='module' src='<?php echo $baseUrl ?>/controllers/index.js?v=<?php echo (time()); ?>'></script>

</body>

</html>