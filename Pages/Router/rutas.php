<?php
mb_internal_encoding('UTF-8');
require_once dirname(dirname(__DIR__)) . '/config.php';
require_once dirname(dirname(__DIR__)) . '/ErrorLogger.php';
// Inicializar el logger con la ruta deseada
ErrorLogger::initialize(dirname(dirname(__DIR__)) . '/logs/error.log');
if (isset($_SESSION['timezone'])) {
    date_default_timezone_set($_SESSION['timezone']);
} else {
    date_default_timezone_set('America/Argentina/Buenos_Aires');
}
// Configura las opciones de sesión segura
// Inicia la sesión de PHP
session_start();
 if (!isset($_SESSION['login_sso']['email'] )) {
      unset($_SESSION['login_sso']['email'] ); 
      require_once dirname(dirname(__DIR__)) . '/config.php';
      header("Location: " . BASE_URL);

  }

$url_base  = BASE_URL;

// Genera una cadena aleatoria basada en el tiempo y un número aleatorio
$randomString = microtime() . rand();

// Elimina los caracteres no deseados de la cadena aleatoria
$randomString = str_replace('.', '', $randomString);
$randomString = str_replace(' ', '', $randomString);

// Obtiene el valor actual del tiempo en milisegundos
$time = time();
$ruta = '';
$url = '';
// Verificar si se ha proporcionado un valor para 'ruta'
if(isset($_GET['ruta'])) {
    // Obtener el valor de 'ruta'
    $ruta = $_GET['ruta'];
    switch ($ruta) {
      case 'login':
        $url = $url_base . '/Pages/Login/';
        header("Location: $url");
        break;

      case 'home':
        $url = $url_base . '/Pages/Home/';
        header("Location: $url");
        break;

      case '404':
        $url = $url_base . '/404.php?t='.$time;
        header("Location: $url");
        break;

      case 'control':
        $url = $url_base . '/Pages/Control/index.php?t='.$time;
        header("Location: $url");
        break;

      case 'rove':
        $rove = $_GET['rove'];
        $url = $url_base . '/Pages/Rove/index.php?rove='.$rove.'t='.$time;
        header("Location: $url");
        break;

      case 'menu':
        // $rove = $_GET['menu'];
        $url = $url_base . '/Pages/Menu/index.php?t='.$time;
        header("Location: $url");
        break;

      case 'controlView':
        $url = $url_base . '/Pages/ControlsView/index.php?t='.$time;
        header("Location: $url");
        break;

      case 'consultasViews':
        $url = $url_base . '/Pages/ConsultasViews/viewsGral.php?t='.$time;
        header("Location: $url");
        break;

      case 'admin':
        $url = $url_base . '/Pages/Admin/index.php?t='.$time;
        header("Location: $url");
        break;

      case 'reporte':
        $url = $url_base . '/Pages/ListReportes/reporte.php?t='.$time;
        header("Location: $url");
        break;

      case 'reporteOnOff':
        $url = $url_base . '/Pages/ListReportes/Routes/reporteOnOff.php?t='.$time;
        header("Location: $url");
        break;

      case 'variables':
        $url = $url_base . '/Pages/ListVariables/variables.php?t='.$time;
        header("Location: $url");
        break;

      case 'RegisterUser':
        $url = $url_base . '/Pages/RegisterUser/';
        header("Location: $url");
        break;

      case 'RegisterPlant':
        $url = $url_base . '/Pages/RegisterPlant/';
        header("Location: $url");
        break;

      case 'RecoveryPass':
        $url = $url_base . '/Pages/RecoveryPass/';
        header("Location: $url");
        break;

      case 'areas':
        $url = $url_base . '/Pages/ListAreas/areas.php?t='.$time;
        header("Location: $url");
        break;
      
      default:
        # code...
        break;
    }
    exit();
} else {
    // Si no se proporciona 'ruta', manejar el caso aquí
    echo "No se proporcionó un valor para 'ruta'.";
    error_log("No se proporcionó un valor para 'ruta: " . $ruta . $url);
}


?>