<?php
// Crear respaldo del config.php original
$originalConfig = file_get_contents(__DIR__ . '/config.php');
file_put_contents(__DIR__ . '/config_backup_original.php', $originalConfig);

// Crear nueva configuración corregida para localhost
$newConfig = '<?php
// Habilitar la codificación interna UTF-8
mb_internal_encoding(\'UTF-8\');

// Definir BASE_DIR
$baseDir = str_replace(\'\\\\\', \'/\', __DIR__);
define(\'BASE_DIR\', $baseDir);

/**
 * Función para verificar si estamos en localhost.
 *
 * @return bool Retorna true si estamos en localhost, false de lo contrario.
 */
function isLocalhost(): bool
{
  if (php_sapi_name() === \'cli\' || php_sapi_name() === \'cli-server\') {
    return true; // Si se ejecuta desde CLI, asumimos que es localhost
  }

  $localHosts = [\'localhost\', \'127.0.0.1\', \'::1\'];
  $host = $_SERVER[\'HTTP_HOST\'] ?? \'\';
  $remoteAddr = $_SERVER[\'REMOTE_ADDR\'] ?? \'\';

  return in_array($host, $localHosts, true) || in_array($remoteAddr, $localHosts, true);
}

// Obtener el host actual, considerando CLI
$currentHost = \'\';
if (php_sapi_name() === \'cli\' || php_sapi_name() === \'cli-server\') {
  // Para CLI, determinar el entorno por la ruta del proyecto
  $currentPath = __DIR__;
  if (strpos($currentPath, \'test-tenkiweb\') !== false) {
    $currentHost = \'test.tenkiweb.com\';
  } else {
    $currentHost = \'tenkiweb.com\';
  }
} else {
  $currentHost = isset($_SERVER[\'HTTP_HOST\']) && is_string($_SERVER[\'HTTP_HOST\'])
    ? $_SERVER[\'HTTP_HOST\']
    : \'\';
}

// CONFIGURACIÓN CORREGIDA PARA BASE_URL
try {
  if (isLocalhost()) {
    // CORRECCIÓN: Usar la ruta correcta para localhost
    $protocol = (isset($_SERVER[\'HTTPS\']) && $_SERVER[\'HTTPS\'] === \'on\') ? \'https\' : \'http\';
    $host = $_SERVER[\'HTTP_HOST\'] ?? \'localhost\';
    $base = "$protocol://$host/test-tenkiweb/tcontrol";
  } elseif (strpos($currentHost, \'test.tenkiweb.com\') !== false) {
    $base = \'https://test.tenkiweb.com/tcontrol\';
  } else {
    $base = \'https://tenkiweb.com\';
  }
} catch (Exception $e) {
  // Fallback en caso de error
  $base = \'https://tenkiweb.com\';
  error_log(\'Error determinando BASE_URL: \' . $e->getMessage());
}

define(\'BASE_URL\', $base);

// Definir constantes generales
define(\'BASE_BY\', \'by Luis Gimenez\');
define(\'BASE_DEVELOPER\', \'Tenkiweb\');
define(\'BASE_CONTENT\', \'Tenki Web\');
define(\'BASE_LOGO\', \'tcontrol\');
define(\'BASE_RUTA\', \'https://linkedin.com/in/luisergimenez/\');

// Definir rutas de imágenes y planos
define(\'BASE_PLANOS\', BASE_URL . \'/assets/img/planos/\');
define(\'BASE_IMAGENES\', BASE_URL . \'/assets/Imagenes/\');
define(\'IMAGE\', BASE_DIR . \'/assets/\');
define(\'PLANOS\', BASE_DIR . \'/assets/img/planos/\');

// Configuración de correo según el entorno
if (strpos($currentHost, \'test.tenkiweb.com\') !== false) {
  // Configuración para test.tenkiweb.com
  define(\'HOST\', \'mail.tenkiweb.com\');
  define(\'USERNAME\', \'alerta.tenki@test.tenkiweb.com\');
  define(\'PASS\', \'*j143@b3^c1v\');
  define(\'SET_FROM\', \'alerta.tenki@test.tenkiweb.com\');
  define(\'ADD_BCC\', \'luisglogista@gmail.com\');
} else {
  // Configuración para tenkiweb.com (producción)
  define(\'HOST\', \'mail.tenkiweb.com\');
  define(\'USERNAME\', \'alerta.tenki@tenkiweb.com\');
  define(\'PASS\', \']SDGGL}#p.Ba\');
  define(\'SET_FROM\', \'alerta.tenki@tenkiweb.com\');
  define(\'ADD_BCC\', \'luisglogista@gmail.com\');
}

/**
 * Configura headers de seguridad adaptados al entorno (desarrollo/producción)
 *
 * @param string $nonce Nonce para CSP
 */
function setSecurityHeaders($nonce = \'\')
{
  $isSecure = isset($_SERVER[\'HTTPS\']) && $_SERVER[\'HTTPS\'] === \'on\';

  header(\'Content-Type: text/html;charset=utf-8\');
  header(\'X-Content-Type-Options: nosniff\');
  header(\'X-Frame-Options: DENY\');
  header(\'X-XSS-Protection: 1; mode=block\');
  header(\'Referrer-Policy: strict-origin-when-cross-origin\');

  if ($isSecure) {
    header(\'Strict-Transport-Security: max-age=31536000; includeSubDomains\');
  }

  if (empty($nonce)) {
    $nonce = base64_encode(random_bytes(16));
  }

  // CSP adaptado al entorno
  if (isLocalhost()) {
    // Más permisivo para desarrollo local
    $csp = "default-src \'self\' \'unsafe-inline\' \'unsafe-eval\' data: blob: *; " .
           "script-src \'self\' \'unsafe-inline\' \'unsafe-eval\' \'nonce-$nonce\' *; " .
           "style-src \'self\' \'unsafe-inline\' *; " .
           "img-src \'self\' data: blob: *; " .
           "font-src \'self\' data: *;";
  } else {
    // Más estricto para producción
    $csp = "default-src \'self\'; " .
           "script-src \'self\' \'nonce-$nonce\' \'unsafe-eval\'; " .
           "style-src \'self\' \'unsafe-inline\'; " .
           "img-src \'self\' data: blob:; " .
           "font-src \'self\' data:; " .
           "connect-src \'self\';";
  }

  header("Content-Security-Policy: $csp");

  return $nonce;
}

/**
 * Inicia una sesión segura con configuración robusta
 */
function startSecureSession()
{
  if (session_status() === PHP_SESSION_NONE) {
    $isSecure = isset($_SERVER[\'HTTPS\']) && $_SERVER[\'HTTPS\'] === \'on\';

    // Configuración de sesión segura
    ini_set(\'session.cookie_httponly\', 1);
    ini_set(\'session.cookie_secure\', $isSecure ? 1 : 0);
    ini_set(\'session.cookie_samesite\', \'Strict\');
    ini_set(\'session.use_strict_mode\', 1);
    ini_set(\'session.cookie_lifetime\', 3600); // 1 hora

    session_start();

    // Regenerar ID de sesión periódicamente
    if (!isset($_SESSION[\'last_regeneration\'])) {
      $_SESSION[\'last_regeneration\'] = time();
    } elseif (time() - $_SESSION[\'last_regeneration\'] > 300) { // 5 minutos
      session_regenerate_id(true);
      $_SESSION[\'last_regeneration\'] = time();
    }
  }
}
';

// Escribir la nueva configuración
file_put_contents(__DIR__ . '/config.php', $newConfig);

echo "✅ Config.php actualizado con BASE_URL corregida para localhost\n";
echo "📁 Respaldo creado en config_backup_original.php\n";
echo "🔧 Nueva BASE_URL: " . (isset($_SERVER['HTTP_HOST']) ?
  "http://{$_SERVER['HTTP_HOST']}/test-tenkiweb/tcontrol" :
  "http://localhost/test-tenkiweb/tcontrol") . "\n";
