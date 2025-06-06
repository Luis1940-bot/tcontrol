<?php
// ini_set('display_errors', '1');
// ini_set('display_startup_errors', '1');
// error_reporting(E_ALL);
if (session_status() == PHP_SESSION_NONE) {
  session_start();
};
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

require_once dirname(dirname(__DIR__)) . '/ErrorLogger.php';
ErrorLogger::initialize(dirname(dirname(__DIR__)) . '/logs/error.log');
require_once dirname(dirname(__DIR__)) . '/config.php';
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
  header("Location: https://tenkiweb.com/tcontrol/index.php");
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
$url = $baseUrl . "/index.php"; //*"https://tenkiweb.com/tcontrol/index.php";
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
    $url = $baseUrl . "/Pages/Login/index.php"; //*"https://tenkiweb.com/tcontrol/index.php";
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
  <link rel='stylesheet' type='text/css' href='<?php echo BASE_URL ?>/Pages/ListComunicacion/listComunicacion.css?v=<?php echo (time()); ?>' media='screen'>
  <link rel='stylesheet' type='text/css' href='<?php echo BASE_URL ?>/assets/css/spinner.css?v=<?php echo (time()); ?>' media='screen'>
  <link rel="stylesheet" href="/assets/css/common-components.css">
  <title>Reglas de Comunicación</title>
  <script src="<?= BASE_URL ?>/assets/js/disableConsole.js"></script>
</head>

<body>
  <div class="spinner"></div>
  <header>

    <?php
    include_once('../../includes/molecules/header.php');
    include_once('../../includes/molecules/encabezado.php');
    include_once('../../includes/molecules/whereUs.php');
    include_once('../../includes/molecules/search.php');

    ?>
  </header>
  <main>
    <div class="div1">
      <select id="areas" name="areas">
        <option disabled selected>Seleccione área</option>
      </select>
      <div class="form-group">
        <select id="reportes" name="reportes">
          <option disabled selected>Seleccione el formato</option>
        </select>
      </div>

      <div id="infoDocumento">
        <span id="resultadoBusqueda" class="mensaje-busqueda"></span>
      </div>
      <div class="form-group">
        <div class="input-button">
          <button class="add-button" id="btnMostrar">Mostrar Información</button>
          <div id="resumenReporte" class="resumen-reporte">

          </div>
        </div>

      </div>
      <div id="comunicacionWrapper" class="oculto">
        <label>
          <input type="checkbox" id="checkComunica">
          Comunicación habilitada
        </label>
        <div id="agrupaPastillas" class="oculto">
          <div id="divPastillaGeneral" class="form-group">

            <select id="usuarios" name="usuarios">
              <option disabled selected>Seleccione el usuario</option>
            </select>

            <div class="input-button">
              <button class="add-button" id="btnAdd">Agregar</button>
              <div id="divPastillas" class="resumen-reporte"></div>
            </div>

          </div>
        </div>
      </div>

    </div>
    <?php
    include_once('../../includes/molecules/pastillas.php');
    ?>
  </main>
  <footer>
    <?php
    include_once('../../includes/molecules/footer.php');
    ?>
  </footer>
  <div id="modalRaci" class="modal oculto">
    <div class="modal-content">
      <span id="btnCerrarModal" class="close">✖</span>
      <h3>Asignar rol RACI</h3>
      <div id="nombreUsuarioRaci"></div>
      <label for="rolSelect">Seleccionar rol:</label>
      <select id="rolSelect">
        <option value="Sel">Seleccione una responsabilidad</option>
        <option value="Responsable">Responsable</option>
        <option value="Aprobador">Aprobador</option>
        <option value="Consultado">Consultado</option>
        <option value="Informado">Informado</option>
      </select>

      <h4>Concepto de comunicación</h4>
      <div id="previewRaciContainer" class="resumen-reporte">
        <!-- Vista previa fuera del modal -->
        <div id="vistaFinalRaci" class="resumen-reporte">
          <h3>¿Qué significa RACI?</h3>

          <ul class="lista-raci">
            <li><strong>R</strong> = <strong>Responsable</strong>: Quien ejecuta la tarea.</li>
            <li><strong>A</strong> = <strong>Aprobador</strong>: Quien aprueba el trabajo realizado.</li>
            <li><strong>C</strong> = <strong>Consultado</strong>: Quien debe ser consultado para dar información o consejo.</li>
            <li><strong>I</strong> = <strong>Informado</strong>: Quien debe ser informado del avance o resultado.</li>
          </ul>
        </div>

      </div>

      <div class="fform-group margen-form-group">
        <button id="btnConfirmarRaci" class="add-button">Aceptar</button>
      </div>
    </div>
  </div>



  <script type='module' src='<?php echo BASE_URL ?>/config.js?v=<?php echo (time()); ?>'></script>
  <script type='module' src='<?php echo BASE_URL ?>/Pages/ListComunicacion/listComunicacion.js?v=<?php echo (time()); ?>'></script>

</body>

</html>