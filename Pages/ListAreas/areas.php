<?php
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
  <link rel='stylesheet' type='text/css' href='<?php echo BASE_URL ?>/Pages/ListAreas/Areas/areas.css?v=<?php echo(time()); ?>' media='screen'>
  <link rel='stylesheet' type='text/css' href='<?php echo BASE_URL ?>/assets/css/spinner.css?v=<?php echo(time()); ?>' media='screen'>
  <title></title>
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
    <div class='div1'>
      <form id='formArea'>
        <div class="form-group">
            <!-- selector -->
            <input type="text" id="numeroDeArea" name="numeroDeArea" disabled> 
            <label for="numeroDeArea">Número de área</label>
        </div>
        <div class="form-group">
            <!-- detalle -->
            <input type="text" id="nombreDeArea" name="nombreDeArea" > 
            <label for="nombreDeArea">Nombre de área</label>
        </div>
        <div class="form-group">
          <select id="situacion" class="select-register" disabled="true"><option value=""></option><option value="s">Activo</option><option value="n">No activo</option></select>
          <label for="situacion" class="label-register">Situación</label>
        </div>
        <div class="form-group">
          <select id="visible" class="select-register" disabled="true"><option value=""></option><option value="s">Visible</option><option value="n">No visible</option></select>
          <label for="visible" class="label-register">Visible</label>
        </div>
      </form>
    </div>

  </main>
  <footer>
    <?php
      include_once('../../includes/molecules/footer.php');
    ?>
  </footer>
  <script type='module' src='<?php echo BASE_URL ?>/config.js?v=<?php echo(time()); ?>'></script>
  <script type='module' src='<?php echo BASE_URL ?>/Pages/ListAreas/Areas/areas.js?v=<?php echo(time()); ?>'></script>
</body>
</html>