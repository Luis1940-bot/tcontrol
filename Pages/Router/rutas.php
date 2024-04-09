<?php
mb_internal_encoding('UTF-8');
// Configura las opciones de sesión segura
// Inicia la sesión de PHP
session_start();
 if (!isset($_SESSION['login_sso']['email'] )) {
      unset($_SESSION['login_sso']['email'] ); 
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

// Genera una cadena aleatoria basada en el tiempo y un número aleatorio
$randomString = microtime() . rand();

// Elimina los caracteres no deseados de la cadena aleatoria
$randomString = str_replace('.', '', $randomString);
$randomString = str_replace(' ', '', $randomString);

// Obtiene el valor actual del tiempo en milisegundos
$time = time();

// Verificar si se ha proporcionado un valor para 'ruta'
if(isset($_GET['ruta'])) {
    // Obtener el valor de 'ruta'
    $ruta = $_GET['ruta'];
    switch ($ruta) {
      case 'login':
        $url = '//'.$_SERVER['HTTP_HOST'] . '/Pages/Login/';
        header("Location: $url");
        break;

      case 'home':
        $url = '//'.$_SERVER['HTTP_HOST'] . '/Pages/Home/';
        header("Location: $url");
        break;

      case '404':
        $url = '//'.$_SERVER['HTTP_HOST'] . '/404.php';
        header("Location: $url");
        break;

      case 'control':
        $url = '//'.$_SERVER['HTTP_HOST'] . '/Pages/Control/index.php?t='.$time;
        header("Location: $url");
        break;

      case 'rove':
        $rove = $_GET['rove'];
        $url = '//'.$_SERVER['HTTP_HOST'] . '/Pages/Rove/index.php?rove='.$rove.'t='.$time;
        header("Location: $url");
        break;

      case 'menu':
        $rove = $_GET['menu'];
        $url = '//'.$_SERVER['HTTP_HOST'] . '/Pages/Menu/index.php?t='.$time;
        header("Location: $url");
        break;

      case 'controlView':
        $url = '//'.$_SERVER['HTTP_HOST'] . '/Pages/ControlsView/index.php?t='.$time;
        header("Location: $url");
        break;

      case 'consultasViews':
        $url = '//'.$_SERVER['HTTP_HOST'] . '/Pages/ConsultasViews/viewsGral.php?t='.$time;
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
}


?>