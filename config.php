<?php
// Archivo: config.php
$base = 'http://localhost:8080';
// Define la ruta base según el entorno
if (isLocalhost()) {
    $base = 'http://localhost:8080';
    $baseDir = __DIR__; 
    define('BASE_URL', $base); //* sirve para localizar componentes como otros php renderizables o css
    define('BASE_DIR', str_replace('\\', '/', $baseDir)); //* sirve para conectar con php que no son renderizables
    define('BASE_BY', 'by Luis Gimenez');
    define('BASE_DEVELOPER', 'Tenkiweb');
    define('BASE_CONTENT', 'Tenki Web');
    define('BASE_LOGO', 'tcontrol');
    define('BASE_RUTA', 'https://linkedin.com/in/luisergimenez/');
    define('BASE_PLANOS', $base . '/tcontrol/assets/img/planos/');
    define('BASE_IMAGENES', $base . '/tcontrol/assets/Imagenes/');
    define('HOST', 'mail.tenkiweb.com');
    define('USERNAME', 'alerta.tenki@tenkiweb.com');
    define('PASS', ']SDGGL}#p.Ba');
    define('SET_FROM', 'alerta.tenki@tenkiweb.com');
    define('ADD_BCC', 'luisglogista@gmail.com');
    define('IMAGE', $baseDir . '/assets/');
    define('PLANOS', $base . '/assets/img/planos/');
} else {
    // En producción
    if ($_SERVER['HTTP_HOST'] === 'tenkiweb.com') {
      $base = 'https://tenkiweb.com/siscon-g';
      define('BASE_BY', 'by Luis Gimenez');
      define('BASE_DEVELOPER', 'Tenkiweb');
      define('BASE_CONTENT', 'Tenki Web');
      define('BASE_LOGO', 'icontrol');
      define('BASE_RUTA', 'https://linkedin.com/in/luisergimenez/');
      define('HOST', 'mail.tenkiweb.com');
      define('USERNAME', 'alerta.tenki@tenkiweb.com');
      define('PASS', ']SDGGL}#p.Ba');
      define('SET_FROM', 'alerta.tenki@tenkiweb.com');
      define('ADD_BCC', 'luisglogista@gmail.com');
      define('IMAGE', $base . '/assets/');
      define('PLANOS', $base . '/assets/img/planos/');
    }
    
    $baseDir = __DIR__; 
    define('BASE_URL', $base);
    define('BASE_DIR', str_replace('\\', '/', $baseDir));
    define('BASE_PLANOS', $base . '/assets/img/planos/');
    define('BASE_IMAGENES', $base . '/assets/Imagenes/');

}



// define('BASE_DIR', $baseDir);

/**
 * Función para verificar si estamos en localhost.
 *
 * @return bool Retorna true si estamos en localhost, false de lo contrario.
 */
function isLocalhost() {
    return ($_SERVER['REMOTE_ADDR'] === '127.0.0.1' || $_SERVER['REMOTE_ADDR'] === '::1');
}

?>

