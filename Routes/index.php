<?php
// ini_set('display_errors', '1');
// ini_set('display_startup_errors', '1');
// error_reporting(E_ALL);
mb_internal_encoding('UTF-8');
require_once dirname(__DIR__) . '/config.php';

// Iniciar sesión segura si no está iniciada
// tiene que ir dentro de la configuración inicial
if (session_status() == PHP_SESSION_NONE) {
  $domain = isset($_SERVER['HTTP_HOST']) && is_string($_SERVER['HTTP_HOST'])
    ? $_SERVER['HTTP_HOST']
    : null;

  session_set_cookie_params([
    'lifetime' => 14400, // 4 horas
    'path' => '/',
    'domain' => $domain,
    'secure' => true,
    'httponly' => true,
    'samesite' => 'Strict'
  ]);
  session_start();
}


$httpHost = isset($_SERVER['HTTP_HOST']) && is_string($_SERVER['HTTP_HOST'])
  ? $_SERVER['HTTP_HOST']
  : 'localhost'; // Valor por defecto

$requestUri = isset($_SERVER['REQUEST_URI']) && is_string($_SERVER['REQUEST_URI'])
  ? $_SERVER['REQUEST_URI']
  : '/'; // Valor por defecto

$host = parse_url($httpHost, PHP_URL_HOST);
if ($host !== 'localhost' && $host !== '127.0.0.1' && (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on')) {
  header("Location: https://{$httpHost}{$requestUri}", true, 301);
  exit;
}



// Configurar CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=utf-8");

// Manejo de solicitudes OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

// Obtener datos de la solicitud
$datos = file_get_contents("php://input");
// $datos = '{"planta":15,"email":"luisconsultor@outlook.com","ruta":"/auth","rax":"&new=Sat Jan 18 2025 10:50:18 GMT-0300 (hora estándar de Argentina)"}';
// Validar que $datos sea una cadena y no false
if ($datos === false) {
  $datos = '{}'; // Asignar JSON vacío en caso de error
}

$data = json_decode($datos, true);

// Validar que $data sea un array
if (!is_array($data)) {
  echo json_encode(['success' => false, 'message' => 'Error al decodificar la cadena JSON']);
  exit;
}

$ruta = $data['ruta'] ?? null;


if (!$ruta) {
  http_response_code(400);
  echo json_encode(['error' => 'Ruta no especificada']);
  exit;
}

// Mapeo de rutas a archivos PHP dinámicamente
$rutas = [
  '/login' => '/Pages/Login/Routes/login.php',
  '/mi_cfg' => '/includes/Traducciones/Lenguajes/fijarLenguaje.php',
  '/traerRegistros' => '/Pages/Control/Routes/traerRegistros.php',
  '/traerControles' => '/Pages/Controles/Routes/traerRegistros.php',
  '/callProcedure' => '/Pages/ConsultasViews/Routes/callProcedure.php',
  '/callRove' => '/Pages/Rove/Routes/traer_rove.php',
  '/alertaRove' => '/Pages/ControlsView/Routes/traerRegistros.php',
  '/traerFirma' => '/Pages/Control/Routes/supervisores.php',
  '/traerSupervisor' => '/Pages/Control/Routes/traerSupervisor.php',
  '/ex2024' => '/Pages/ControlsView/Routes/eliminaRegistro.php',
  '/traerCargados' => '/Pages/ControlsView/Routes/traerRegistros.php',
  '/ix2024' => '/Pages/Control/Routes/ix.php',
  '/ux2024' => '/Pages/Control/Routes/ux.php',
  '/traerReportes' => '/Pages/ListReportes/Routes/traerRegistros.php',
  '/reporteOnOff' => '/Pages/ListReportes/Routes/reporteOnOff.php',
  '/guardarReporteNuevo' => '/Pages/ListReportes/Routes/guardarReporteNuevo.php',
  '/guardarReporteCambios' => '/Pages/ListReportes/Routes/guardarReporteCambios.php',
  '/traerVariables' => '/Pages/ListVariables/Routes/traerRegistros.php',
  '/variableOnOff' => '/Pages/ListVariables/Routes/variableOnOff.php',
  '/variableUpDown' => '/Pages/ListVariables/Routes/variableUpDown.php',
  '/addVariable' => '/Pages/ListVariables/Routes/aceptarVariable.php',
  '/addSelector' => '/Pages/ListVariables/Routes/addSelector.php',
  '/updateSelector' => '/Pages/ListVariables/Routes/updateSelector.php',
  '/updateVariable' => '/Pages/ListVariables/Routes/updateVariable.php',
  '/traerSelectReporte' => '/Pages/ListVariables/Routes/traerRegistros.php',
  '/traerReporteParaVincular' => '/Pages/ListVariables/Routes/traerRegistros.php',
  '/addVinculo' => '/Pages/ListVariables/Routes/aceptarVinculos.php',
  '/selectReporteOnOff' => '/Pages/ListVariables/Routes/selectReporteOnOff.php',
  '/traerLTYcontrol' => '/Pages/ListControles/Routes/traerRegistros.php',
  '/turnOnOff' => '/Pages/ListControles/Routes/turnOnOff.php',
  '/addNewCampo' => '/Pages/ListControles/Routes/addNewCampo.php',
  '/clonarReporte' => '/Pages/ListControles/Routes/clonarReporte.php',
  '/traerAreasParaRegistroUser' => '/Pages/RegisterUser/Routes/traerRegistros.php',
  '/traerTipoDeUsuarioParaRegistroUser' => '/Pages/RegisterUser/Routes/traerRegistros.php',
  '/traerTipoDeUsuarioParaRegistroPlanta' => '/Pages/RegisterPlant/Routes/traerRegistros.php',
  '/addCompania' => '/Pages/RegisterPlant/Routes/nuevaCompania.php',
  '/escribirJSON' => '/Pages/RegisterPlant/Routes/escribeJSON.php',
  '/sendNuevoCliente' => '/Nodemailer/Routes/sendNuevoCliente.php',
  '/addUsuario' => '/Pages/RegisterUser/Routes/nuevoUsuario.php',
  '/sendNuevoUsuario' => '/Nodemailer/Routes/sendNuevoUsuario.php',
  '/confirmaEmail' => '/Pages/RecoveryPass/Routes/confirmaEmail.php',
  '/creaJSONapp' => '/Pages/RegisterPlant/Routes/creaJSONapp.php',
  '/traerLTYareas' => '/Pages/ListAreas/Routes/traerRegistros.php',
  '/guardarAreaNuevo' => '/Pages/ListAreas/Routes/guardarAreaNuevo.php',
  '/areaOnOff' => '/Pages/ListAreas/Routes/areaOnOff.php',
  '/guardarCambioArea' => '/Pages/ListAreas/Routes/guardarCambioArea.php',
  '/auth' => '/Pages/Login/Routes/auth.php',
  '/nuevoAuth' => '/Pages/AuthUser/Routes/ix.php',
  '/traerCargadosDiario' => '/Pages/ControlesDiarios/Routes/traerRegistros.php',
  '/pivot_data' => '/Pages/client28/Routes/pivot_data.php',
  '/pivot_lecturas_15' => '/Pages/client15/Routes/pivot_data.php',
];

if (isset($rutas[$ruta])) {
  include_once dirname(__DIR__) . $rutas[$ruta];
} else {
  http_response_code(404);
  echo json_encode(['error' => 'Ruta no encontrada']);
}
