<?php
// Habilitar reporte de errores en desarrollo
// ini_set('display_errors', '1');
// ini_set('display_startup_errors', '1');
// error_reporting(E_ALL);

mb_internal_encoding('UTF-8');

$baseDir = __DIR__;
define('BASE_DIR', str_replace('\\', '/', $baseDir));

define('BASE_BY', 'by Luis Gimenez');
define('BASE_DEVELOPER', 'Tenkiweb');
define('BASE_CONTENT', 'Tenki Web');
define('BASE_LOGO', 'tcontrol');
define('BASE_RUTA', 'https://linkedin.com/in/luisergimenez/');

// Configuración de email
define('HOST', 'mail.tenkiweb.com');
define('USERNAME', 'alerta.tenki@tenkiweb.com');
define('PASS', ']SDGGL}#p.Ba');
define('SET_FROM', 'alerta.tenki@tenkiweb.com');
define('ADD_BCC', 'luisglogista@gmail.com');

// Detectar si el script se ejecuta en línea de comandos (CLI)
$isCli = (php_sapi_name() === 'cli');

/**
 * Detecta el entorno en el que se está ejecutando el código.
 * - Devuelve 'localhost' si se está ejecutando localmente.
 * - Devuelve 'tenkiweb.com' si está en producción.
 * - Devuelve 'test.tenkiweb.com' si está en el entorno de pruebas.
 *
 * @return string
 */
function getDomain(): string
{
  global $isCli;

  if ($isCli) {
    return 'localhost';
  }

  // Asegurar que $_SERVER['HTTP_HOST'] existe y es string
  $host = isset($_SERVER['HTTP_HOST']) && is_string($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '';

  if (strpos($host, 'test.tenkiweb.com') !== false) {
    return 'test.tenkiweb.com';
  }

  if (strpos($host, 'tenkiweb.com') !== false) {
    return 'tenkiweb.com';
  }

  return 'localhost';
}


// Definir BASE_URL según el entorno detectado
$domain = getDomain();
switch ($domain) {
  case 'tenkiweb.com':
    define('BASE_URL', 'https://tenkiweb.com/tcontrol');
    $secure = true;
    break;
  case 'test.tenkiweb.com':
    define('BASE_URL', 'https://test.tenkiweb.com/tcontrol');
    $secure = true;
    break;
  default:
    define('BASE_URL', 'http://localhost:3000/tcontrol');
    $secure = false;
    break;
}

// Configurar sesión solo si no está en CLI
if (!$isCli && session_status() == PHP_SESSION_NONE) {
  session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => $domain === 'localhost' ? null : $domain,
    'secure' => $secure,
    'httponly' => true,
    'samesite' => 'Strict'
  ]);
  session_start();
}

// Rutas de archivos y assets
define('BASE_PLANOS', BASE_URL . '/assets/img/planos/');
define('BASE_IMAGENES', BASE_URL . '/assets/Imagenes/');
define('IMAGE', BASE_DIR . '/assets/');
define('PLANOS', BASE_DIR . '/assets/img/planos/');
