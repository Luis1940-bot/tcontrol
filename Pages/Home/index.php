<?php
// ini_set('display_errors', '1');
// ini_set('display_startup_errors', '1');
// error_reporting(E_ALL);

require_once dirname(dirname(__DIR__)) . '/config.php';
require_once dirname(dirname(__DIR__)) . '/ErrorLogger.php';
ErrorLogger::initialize(dirname(dirname(__DIR__)) . '/logs/error.log');

// Configurar headers de seguridad y sesión
$nonce = setSecurityHeaders();
startSecureSession();

/** @var string $baseUrl */
$baseUrl = BASE_URL;
//**************************************************** */
// Tiempo de inactividad en segundos (12 horas)
$inactive = 43200;
if (!isset($_SESSION['last_activity']) || $_SESSION['last_activity'] === 0 || !is_int($_SESSION['last_activity'])) {
  $_SESSION['last_activity'] = time();
}
$lastActivity = $_SESSION['last_activity'];
if ((time() - $lastActivity) > $inactive) {
  session_unset();
  session_destroy();
  header("Location: https://test.tenkiweb.com/tcontrol/index.php");
  exit();
}
// Actualiza la última actividad
$_SESSION['last_activity'] = time();
//**************************************************** */

/** 
 * @var array{
 *     login_sso?: array{
 *         sso?: string|null,
 *         email?: string|null
 *     }
 * } $_SESSION 
 */
$url = $baseUrl . "/index.php"; //*"https://test.tenkiweb.com/tcontrol/index.php";
if (isset($_SESSION['login_sso']) && is_array($_SESSION['login_sso'])) {
  if (isset($_SESSION['login_sso']['sso'])) {
    define('SSO', $_SESSION['login_sso']['sso']);
  } else {
    define('SSO', null);
  }

  if (isset($_SESSION['login_sso']['email'])) {
    define('EMAIL', $_SESSION['login_sso']['email']);
  } else {
    define('EMAIL', null);
  }
} else {
  define('SSO', null);
  define('EMAIL', null);
}

if (EMAIL !== null) {
  // Aquí se mantiene la lógica si hay un email definido
} else {
  if (SSO === null || SSO === 's_sso') {
    $url = $baseUrl . "/Pages/Login/index.php"; //*"https://test.tenkiweb.com/tcontrol/index.php";
  }

  header("Location: " . $url);
  exit();
}

/** 
 * @var array{timezone?: string} $_SESSION 
 */
if (isset($_SESSION['timezone']) && is_string($_SESSION['timezone'])) {
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
  <link rel='shortcut icon' type='image / x-icon' href='<?php echo BASE_URL ?>/assets/img/favicon.ico'>
  <link rel='stylesheet' type='text/css' href='<?php echo BASE_URL ?>/Pages/Home/home.css?v=<?php echo (time()); ?>' media='screen'>
  <link rel='stylesheet' type='text/css' href='<?php echo BASE_URL ?>/assets/css/spinner.css?v=<?php echo (time()); ?>' media='screen'>
  <link rel='stylesheet' type='text/css' href='<?php echo BASE_URL ?>/assets/css/common-components.css?v=<?php echo (time()); ?>' media='screen'>
  <title></title>
  <script src="<?= BASE_URL ?>/assets/js/disableConsole.js"></script>
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
    <div class='div-home-buttons'>

    </div>
    <main>
      <div class='div-home-buttons'>

      </div>

      <!-- Sección de soporte sutil -->
      <div class="home-soporte">
        <div class="soporte-links">
          <a href="<?= BASE_URL ?>/Pages/Soporte/" class="link-soporte">
            🎧 Soporte Técnico
          </a>
          <span class="separador">|</span>
          <a href="<?= BASE_URL ?>/Pages/Soporte/historial.php" class="link-soporte">
            📋 Seguimiento de Tickets
          </a>
        </div>
      </div>

    </main>
  </main>
  <footer>
    <?php
    include_once('../../includes/molecules/footer.php');
    ?>
  </footer>
  <script type='module' src='<?php echo BASE_URL ?>/config.js?v=<?php echo (time()); ?>'></script>
  <script type='module' src='<?php echo BASE_URL ?>/Pages/Home/home.js?v=<?php echo (time()); ?>'></script>
</body>

</html>