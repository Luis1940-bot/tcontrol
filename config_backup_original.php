<?php
// Habilitar la codificación interna UTF-8
mb_internal_encoding('UTF-8');

// Definir BASE_DIR
$baseDir = str_replace('\\', '/', __DIR__);
define('BASE_DIR', $baseDir);

/**
 * Función para verificar si estamos en localhost.
 *
 * @return bool Retorna true si estamos en localhost, false de lo contrario.
 */
function isLocalhost(): bool
{
  if (php_sapi_name() === 'cli' || php_sapi_name() === 'cli-server') {
    return true; // Si se ejecuta desde CLI, asumimos que es localhost
  }

  $localHosts = ['localhost', '127.0.0.1', '::1'];
  $host = $_SERVER['HTTP_HOST'] ?? '';
  $remoteAddr = $_SERVER['REMOTE_ADDR'] ?? '';

  return in_array($host, $localHosts, true) || in_array($remoteAddr, $localHosts, true);
}

// Obtener el host actual, considerando CLI
$currentHost = '';
if (php_sapi_name() === 'cli' || php_sapi_name() === 'cli-server') {
  // Para CLI, determinar el entorno por la ruta del proyecto
  $currentPath = __DIR__;
  if (strpos($currentPath, 'test-tenkiweb') !== false) {
    $currentHost = 'test.tenkiweb.com';
  } else {
    $currentHost = 'tenkiweb.com';
  }
} else {
  $currentHost = isset($_SERVER['HTTP_HOST']) && is_string($_SERVER['HTTP_HOST'])
    ? $_SERVER['HTTP_HOST']
    : '';
}

// Definir BASE_URL dinámicamente según el entorno
try {
  if (isLocalhost()) {
    $base = 'http://localhost:8000';
  } elseif (strpos($currentHost, 'test.tenkiweb.com') !== false) {
    $base = 'https://test.tenkiweb.com/tcontrol';
  } else {
    $base = 'https://tenkiweb.com';
  }
} catch (Exception $e) {
  // Fallback en caso de error
  $base = 'https://tenkiweb.com';
  error_log('Error determinando BASE_URL: ' . $e->getMessage());
}

define('BASE_URL', $base);

// Definir constantes generales
define('BASE_BY', 'by Luis Gimenez');
define('BASE_DEVELOPER', 'Tenkiweb');
define('BASE_CONTENT', 'Tenki Web');
define('BASE_LOGO', 'tcontrol');
define('BASE_RUTA', 'https://linkedin.com/in/luisergimenez/');

// Definir rutas de imágenes y planos
define('BASE_PLANOS', BASE_URL . '/assets/img/planos/');
define('BASE_IMAGENES', BASE_URL . '/assets/Imagenes/');
define('IMAGE', BASE_DIR . '/assets/');
define('PLANOS', BASE_DIR . '/assets/img/planos/');

// Configuración de correo según el entorno
if (strpos($currentHost, 'test.tenkiweb.com') !== false) {
  // Configuración para test.tenkiweb.com
  define('HOST', 'mail.tenkiweb.com');
  define('USERNAME', 'alerta.tenki@test.tenkiweb.com');
  define('PASS', '*j143@b3^c1v');
  define('SET_FROM', 'alerta.tenki@test.tenkiweb.com');
  define('ADD_BCC', 'luisglogista@gmail.com');
} else {
  // Configuración para tenkiweb.com (producción)
  define('HOST', 'mail.tenkiweb.com');
  define('USERNAME', 'alerta.tenki@tenkiweb.com');
  define('PASS', ']SDGGL}#p.Ba');
  define('SET_FROM', 'alerta.tenki@tenkiweb.com');
  define('ADD_BCC', 'luisglogista@gmail.com');
}

/**
 * Configura headers de seguridad adaptados al entorno (desarrollo/producción)
 *
 * @param string $nonce Nonce para CSP
 */
function setSecurityHeaders($nonce = '')
{
  $isSecure = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on';

  header('Content-Type: text/html;charset=utf-8');

  if (empty($nonce)) {
    $nonce = base64_encode(random_bytes(16));
  }

  // CSP adaptado al entorno
  if ($isSecure) {
    // Producción: CSP más estricta
    $csp = "default-src 'self'; img-src 'self' data: https: tenkiweb.com; script-src 'self' 'nonce-$nonce' cdn.tenkiweb.com; style-src 'self' 'nonce-$nonce' 'unsafe-inline' cdn.tenkiweb.com; connect-src 'self' test.tenkiweb.com tenkiweb.com; object-src 'none'; base-uri 'self'; form-action 'self'";
  } else {
    // Desarrollo: CSP más permisiva
    $csp = "default-src 'self'; img-src 'self' data: https: tenkiweb.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' cdn.tenkiweb.com; style-src 'self' 'unsafe-inline' cdn.tenkiweb.com; connect-src 'self' test.tenkiweb.com tenkiweb.com localhost:8000; object-src 'none'; base-uri 'self'; form-action 'self'";
  }

  // Solo agregar upgrade-insecure-requests en producción
  if ($isSecure) {
    $csp .= '; upgrade-insecure-requests';
  }

  header("Content-Security-Policy: $csp;");

  // Headers de seguridad solo en producción
  if ($isSecure) {
    header("Strict-Transport-Security: max-age=31536000; includeSubDomains; preload");
  }

  header("X-Content-Type-Options: nosniff");
  header("X-Frame-Options: DENY");
  header("X-XSS-Protection: 1; mode=block");

  // CORS adaptado
  if ($isSecure) {
    header("Access-Control-Allow-Origin: https://test.tenkiweb.com");
  } else {
    header("Access-Control-Allow-Origin: http://localhost:8000");
  }

  header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
  header("Access-Control-Allow-Headers: Content-Type, Authorization");
  header("Access-Control-Allow-Credentials: true");

  return $nonce;
}

/**
 * Inicia sesión con configuración adaptada al entorno
 */
function startSecureSession()
{
  $isSecure = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on';

  session_start([
    'cookie_secure' => $isSecure,
    'cookie_httponly' => true,
    'cookie_samesite' => 'Strict'
  ]);
}
