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

// Obtener el host actual
$currentHost = isset($_SERVER['HTTP_HOST']) && is_string($_SERVER['HTTP_HOST'])
  ? $_SERVER['HTTP_HOST']
  : '';

// Definir BASE_URL dinámicamente según el entorno
if (isLocalhost()) {
  $base = 'http://localhost:3000';
} elseif (strpos($currentHost, 'test.tenkiweb.com') !== false) {
  $base = 'https://test.tenkiweb.com';
} else {
  $base = 'https://tenkiweb.com';
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

// Configuración de correo
define('HOST', 'mail.tenkiweb.com');
define('USERNAME', 'alerta.tenki@tenkiweb.com');
define('PASS', ']SDGGL}#p.Ba');
define('SET_FROM', 'alerta.tenki@tenkiweb.com');
define('ADD_BCC', 'luisglogista@gmail.com');
