<?php
if (session_status() == PHP_SESSION_NONE) { session_start(); };
header('Content-Type: text/html;charset=utf-8');
$nonce = base64_encode(random_bytes(16));
header("Content-Security-Policy: default-src 'self'; img-src 'self' data: https: example.com; script-src 'self' 'nonce-$nonce' cdn.example.com; style-src 'self' 'nonce-$nonce' cdn.example.com; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;");

header("Strict-Transport-Security: max-age=31536000; includeSubDomains; preload"); 
header("X-Content-Type-Options: nosniff"); 
header("X-Frame-Options: DENY"); 
header("X-XSS-Protection: 1; mode=block");

header("Access-Control-Allow-Origin: https://tenkiweb.com"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE"); 
header("Access-Control-Allow-Headers: Content-Type, Authorization"); 
header("Access-Control-Allow-Credentials: true"); 

require_once dirname(dirname(__DIR__)) . '/ErrorLogger.php';
ErrorLogger::initialize(dirname(dirname(__DIR__)) . '/logs/error.log');
require_once dirname(dirname(__DIR__)) . '/config.php';

$url = BASE_URL . "/index.php"; //*"https://tenkiweb.com/tcontrol/index.php";
define('SSO', $_SESSION['login_sso']['sso']);
 if (isset($_SESSION['login_sso']['email'] )) {
      define('EMAIL', $_SESSION['login_sso']['email']);
      
  } else {
    if ( SSO === null || SSO === 's_sso' ) {
      $url = BASE_URL . "/Pages/Login/index.php"; //*"https://tenkiweb.com/tcontrol/index.php";
    }
    //! ESTO ES NECESARIOCUANDO SE TRABAJA CON SSO
    header("Location: ". $url ."");
  }

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
  <link rel='stylesheet' type='text/css' href='<?php echo BASE_URL ?>/Pages/ListVariables/Variables/variable.css?v=<?php echo(time()); ?>' media='screen'>
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
      <form id='formVariable'>
        <div class="form-group">
            <!-- selector -->
            <input type="text" id="numeroDelSelector" name="numeroDelSelector" disabled> 
            <label for="numeroDelSelector">Número del selector</label>
        </div>
        <div class="form-group">
            <!-- detalle -->
            <input type="text" id="nombreDelSelect" name="nombreDelSelect" > 
            <label for="nombreDelSelect">Nombre del selector</label>
        </div>
        <div class="form-group">
            <!-- nivel -->
            <select  id="tipodeusuario" name="tipodeusuario"></select>
            <label for="tipodeusuario">Tipo de usuario</label>
        </div>
        <div class="form-group" id="addButton">
            <!-- add -->
            <div class="input-button">
              <button class="add-button" id="buttonAgregar"></button>
            </div>
            <label for="addVariable">Agregue variable</label>
        </div>
        <div class="form-group" id="addButtonVincular">
            <!-- add -->
            <div class="input-button">
              <button class="add-button" id="buttonVincular">Control</button>
            </div>
            <label for="buttonVincular">Vincule control</label>
        </div>
        <div class="form-group">
            <label id="leyenda">Acepte o cancele para agregar otras variables.</label>
        </div>
      </form>
    </div>
    <div class='div2'>
    </div>
    <div class="div3">
        <div class="form-group">
            <label id="sinControles">No hay controles vinculados.</label>
        </div>
    </div>
  </main>
  <footer>
    <?php
      include_once('../../includes/molecules/footer.php');
    ?>
  </footer>
  <script type='module' src='<?php echo BASE_URL ?>/config.js?v=<?php echo(time()); ?>'></script>
  <script type='module' src='<?php echo BASE_URL ?>/Pages/ListVariables/Variables/variables.js?v=<?php echo(time()); ?>'></script>
</body>
</html>