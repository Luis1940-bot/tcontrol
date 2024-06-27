<?php
mb_internal_encoding('UTF-8');
require_once  dirname(__DIR__) . '/config.php';

// Define las opciones de sesión segura
$sessionOptions = [
    'use_only_cookies' => 1, // Solo usar cookies para almacenar el identificador de sesión
    'cookie_lifetime' => 14400, // Tiempo de vida de la cookie de sesión en segundos (1 hora)
    'cookie_secure' => 1, // Solo enviar la cookie a través de conexiones seguras (HTTPS)
    'cookie_httponly' => 1, // La cookie solo es accesible a través de HTTP y no puede ser manipulada por JavaScript
    'cookie_samesite' => 'Strict' // Evita ataques de CSRF (Cross-Site Request Forgery)
];


// Configura las opciones de sesión segura
session_set_cookie_params(
    $sessionOptions['cookie_lifetime'], // Tiempo de vida de la cookie de sesión en segundos (1 hora)
    '/', // Ruta de la cookie (puedes cambiarla según tus necesidades)
    $_SERVER['HTTP_HOST'], // Dominio de la cookie (usando el dominio actual)
    true, // Solo enviar la cookie a través de conexiones seguras (HTTPS)
    true // La cookie solo es accesible a través de HTTP y no puede ser manipulada por JavaScript
);
// Inicia la sesión de PHP
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}



// Verifica si la solicitud se está realizando en localhost
$host = parse_url($_SERVER['HTTP_HOST'], PHP_URL_HOST);
if ($host === 'localhost' || $host === '127.0.0.1') {
    // Estás en localhost, no es necesario verificar HTTPS
    
} else {
    // No estás en localhost, verifica si se está utilizando HTTPS
    if (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') {
        // Si la solicitud no se realizó mediante HTTPS, redirige a la misma URL pero con HTTPS
        $redirectURL = "https://{$_SERVER['HTTP_HOST']}{$_SERVER['REQUEST_URI']}";
        header("Location: $redirectURL", true, 301); // Redirección permanente
        exit;
    }
}

// Verifica el método de la solicitud
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Verifica si se está recibiendo datos POST correctamente

    // Agrega los encabezados CORS para permitir solicitudes desde cualquier origen
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    header("Content-Type: application/json; charset=utf-8");
    $datos = file_get_contents("php://input");
    
  // $datos = '{"leng":"es","id":"6","ruta":"/mi_cfg","rax":"&new=Fri Apr 05 2024 19:02:11 GMT-0300 (hora estándar de Argentina)"}';
    // $datos = '{"planta":"1","email":"luisglogista@gmail.com","password":"4488","ruta":"/login","rax":"&new=Sun Apr 14 2024 11:35:48 GMT-0300 (hora estándar de Argentina)"}';
    $data = json_decode($datos, true);
   
    if ($data === null && json_last_error() === JSON_ERROR_NONE) {
      // Error al decodificar JSON
      http_response_code(400); // Bad Request
      echo 'Error: Datos JSON incorrectos';
      exit;
    }

    $ruta = $data['ruta'];
  
  
    // Si la solicitud es una solicitud OPTIONS, finaliza la ejecución para evitar errores CORS
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        exit;
    }

    // $ruta = $_SERVER['REQUEST_URI'];

    switch ($ruta) {
        case '/login':
            include_once dirname(__DIR__) .'/Pages/Login/Routes/login.php';
            break;
        case '/mi_cfg':
            include_once dirname(__DIR__) . '/includes/Traducciones/Lenguajes/fijarLenguaje.php';
            break;
        case '/traerRegistros':
            include_once dirname(__DIR__) . '/Pages/Control/Routes/traerRegistros.php';
            break;
        case '/traerControles':
            include_once dirname(__DIR__) . '/Pages/Controles/Routes/traerRegistros.php';
            break;
        case '/callProcedure':
            include_once dirname(__DIR__) . '/Pages/ConsultasViews/Routes/callProcedure.php';
            break;
        case '/callRove':
            include_once dirname(__DIR__) . '/Pages/Rove/Routes/traer_rove.php';
            break;
        case '/alertaRove':
            include_once dirname(__DIR__) . '/Pages/ControlsView/Routes/traerRegistros.php';
            break;
        case '/traerFirma':
            include_once dirname(__DIR__) . '/Pages/Control/Routes/supervisores.php';
            break;
        case '/traerSupervisor':
            include_once dirname(__DIR__) . '/Pages/Control/Routes/traerSupervisor.php';
            break;
         case '/ex2024':
            include_once dirname(__DIR__) . '/Pages/ControlsView/Routes/eliminaRegistro.php';
            break;
          case '/traerCargados':
            include_once dirname(__DIR__) . '/Pages/ControlsView/Routes/traerRegistros.php';
            break;
          case '/ix2024':
            include_once dirname(__DIR__) . '/Pages/Control/Routes/ix.php';
            break;
          case '/ux2024':
            include_once dirname(__DIR__) . '/Pages/Control/Routes/ux.php';
            break;
          case '/traerReportes':
            include_once dirname(__DIR__) . '/Pages/ListReportes/Routes/traerRegistros.php';
            break;
          case '/reporteOnOff':
            include_once dirname(__DIR__) . '/Pages/ListReportes/Routes/reporteOnOff.php';
            break;
          case '/guardarReporteNuevo':
            include_once dirname(__DIR__) . '/Pages/ListReportes/Routes/guardarReporteNuevo.php';
            break;
          case '/guardarReporteCambios':
            include_once dirname(__DIR__) . '/Pages/ListReportes/Routes/guardarReporteCambios.php';
            break;
          case '/traerVariables':
            include_once dirname(__DIR__) . '/Pages/ListVariables/Routes/traerRegistros.php';
            break;
          case '/variableOnOff':
            include_once dirname(__DIR__) . '/Pages/ListVariables/Routes/variableOnOff.php';
            break;
          case '/variableUpDown':
            include_once dirname(__DIR__) . '/Pages/ListVariables/Routes/variableUpDown.php';
            break;
          case '/addVariable':
            include_once dirname(__DIR__) . '/Pages/ListVariables/Routes/aceptarVariable.php';
            break;
          case '/addSelector':
            include_once dirname(__DIR__) . '/Pages/ListVariables/Routes/addSelector.php';
            break;
          case '/updateSelector':
            include_once dirname(__DIR__) . '/Pages/ListVariables/Routes/updateSelector.php';
            break;
          case '/updateVariable':
            include_once dirname(__DIR__) . '/Pages/ListVariables/Routes/updateVariable.php';
            break;
          case '/traerSelectReporte':
            include_once dirname(__DIR__) . '/Pages/ListVariables/Routes/traerRegistros.php';
            break;
          case '/traerReporteParaVincular':
            include_once dirname(__DIR__) . '/Pages/ListVariables/Routes/traerRegistros.php';
            break;
          case '/addVinculo':
            include_once dirname(__DIR__) . '/Pages/ListVariables/Routes/aceptarVinculos.php';
          break;
        case '/selectReporteOnOff':
            include_once dirname(__DIR__) . '/Pages/ListVariables/Routes/selectReporteOnOff.php';
          break;
        case '/traerLTYcontrol':
            include_once dirname(__DIR__) . '/Pages/ListControles/Routes/traerRegistros.php';
          break;
        case '/turnOnOff':
            include_once dirname(__DIR__) . '/Pages/ListControles/Routes/turnOnOff.php';
          break;
        case '/addNewCampo':
            include_once dirname(__DIR__) . '/Pages/ListControles/Routes/addNewCampo.php';
          break;
        case '/clonarReporte':
            include_once dirname(__DIR__) . '/Pages/ListControles/Routes/clonarReporte.php';
          break;
        case '/traerAreasParaRegistroUser':
            include_once dirname(__DIR__) . '/Pages/RegisterUser/Routes/traerRegistros.php';
          break;
        case '/traerTipoDeUsuarioParaRegistroUser':
            include_once dirname(__DIR__) . '/Pages/RegisterUser/Routes/traerRegistros.php';
          break;
        case '/traerTipoDeUsuarioParaRegistroPlanta':
            include_once dirname(__DIR__) . '/Pages/RegisterPlant/Routes/traerRegistros.php';
          break;
        case '/addCompania':
            include_once dirname(__DIR__) . '/Pages/RegisterPlant/Routes/nuevaCompania.php';
          break;
        case '/escribirJSON':
            include_once dirname(__DIR__) . '/Pages/RegisterPlant/Routes/escribeJSON.php';
          break;
        case '/sendNuevoCliente':
            include_once dirname(__DIR__) . '/Nodemailer/Routes/sendNuevoCliente.php';
          break;
        case '/addUsuario':
            include_once dirname(__DIR__) . '/Pages/RegisterUser/Routes/nuevoUsuario.php';
          break;
        case '/sendNuevoUsuario':
            include_once dirname(__DIR__) . '/Nodemailer/Routes/sendNuevoUsuario.php';
          break;
        case '/confirmaEmail':
            include_once dirname(__DIR__) . '/Pages/RecoveryPass/Routes/confirmaEmail.php';
          break;
        // Agrega más casos según las rutas de tu aplicación
        default:
            // Ruta no encontrada
            http_response_code(404); // No encontrado
            echo 'Página no encontrada';
            break;
    }
} else {
    // Ruta no permitida
    http_response_code(405); // Método no permitido
    echo 'Método no permitido';
}

?>