<?php
// Archivo: config.php
$baseDir = __DIR__; 
define('BASE_DIR', str_replace('\\', '/', $baseDir));

// Definir constantes base
define('BASE_BY', 'by Luis Gimenez');
define('BASE_DEVELOPER', 'Tenkiweb');
define('BASE_CONTENT', 'Tenki Web');
define('BASE_LOGO', 'tcontrol');
define('BASE_RUTA', 'https://linkedin.com/in/luisergimenez/');
define('HOST', 'mail.tenkiweb.com');
define('USERNAME', 'alerta.tenki@tenkiweb.com');
define('PASS', ']SDGGL}#p.Ba');
define('SET_FROM', 'alerta.tenki@tenkiweb.com');
define('ADD_BCC', 'luisglogista@gmail.com');

// Verificar si se está ejecutando en CLI o en un servidor web
if (php_sapi_name() == 'cli') {
    // Configuración para CLI
    define('BASE_URL', 'http://localhost:3000');
    define('BASE_PLANOS', BASE_URL . '/tcontrol/assets/img/planos/');
    define('BASE_IMAGENES', BASE_URL . '/tcontrol/assets/Imagenes/');
    define('IMAGE', BASE_DIR . '/assets/');
    define('PLANOS', BASE_URL . '/assets/img/planos/');
} else {
    // Configuración para entorno web
    $base = 'http://localhost:3000';
    if ($_SERVER['HTTP_HOST'] === 'tenkiweb.com') {
        $base = 'https://tenkiweb.com/tcontrol';
    }
    define('BASE_URL', $base);
    define('BASE_PLANOS', $base . '/assets/img/planos/');
    define('BASE_IMAGENES', $base . '/assets/Imagenes/');
    define('IMAGE', BASE_DIR . '/assets/');
    define('PLANOS', BASE_DIR . '/assets/img/planos/');
}

/**
 * Función para verificar si estamos en localhost.
 *
 * @return bool Retorna true si estamos en localhost, false de lo contrario.
 */
function isLocalhost() {
    if (php_sapi_name() == 'cli') {
        return true;
    }
    return ($_SERVER['REMOTE_ADDR'] === '127.0.0.1' || $_SERVER['REMOTE_ADDR'] === '::1');
}
?>
