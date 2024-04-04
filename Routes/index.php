<?php
mb_internal_encoding('UTF-8');

// Define las opciones de sesión segura
$sessionOptions = [
    'use_only_cookies' => 1, // Solo usar cookies para almacenar el identificador de sesión
    'cookie_lifetime' => 3600, // Tiempo de vida de la cookie de sesión en segundos (1 hora)
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
session_start();


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
    
  // $datos = '{"planta":"1","email":"luisglogista@gmail.com","pass":"4488","ruta":"/login"}';

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
            include_once('../Pages/Login/Routes/login.php');
            break;
        case '/perfil':
            include_once('perfil.php');
            break;
        // Agrega más casos según las rutas de tu aplicación
        default:
            // Ruta no encontrada
            http_response_code(404); // No encontrado
            echo 'Página no encontrada';
    }
} else {
    // Ruta no permitida
    http_response_code(405); // Método no permitido
    echo 'Método no permitido';
}

?>