<?php
// Archivo: config.php

// Define la ruta base según el entorno
if (isLocalhost()) {
    $base = 'http://localhost:8080';
    $baseDir = __DIR__; 
    define('BASE_URL', $base); //* sirve para localizar componentes como otros php renderizables o css
    define('BASE_DIR', str_replace('\\', '/', $baseDir)); //* sirve para conectar con php que no son renderizables
    define('BASE_BY', 'by Factum Consultora');
    define('BASE_DEVELOPER', 'Factum - Desarrollo');
    define('BASE_CONTENT', 'Factum Consultora');
    define('BASE_LOGO', 'ftm');
    define('BASE_RUTA', 'https://www.factumconsultora.com');
    define('BASE_PLANOS', $base . '/iControl-Vanilla/icontrol/assets/img/planos/');
    define('BASE_IMAGENES', $base . '/iControl-Vanilla/icontrol/assets/Imagenes/');
    define('HOST', 'smtp.factumconsultora.com');
    define('USERNAME', 'alerta.factum@factumconsultora.com');
    define('PASS', 'Factum2017admin');
    define('SET_FROM', 'alerta.factum@factumconsultora.com');
    define('ADD_BCC', 'luisfactum@gmail.com');
    define('IMAGE', $baseDir . '/assets/imagenes/');
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
      define('IMAGE', $base . '/assets/imagenes/');
      define('PLANOS', $base . '/assets/img/planos/');
    }
    if ($_SERVER['HTTP_HOST'] === 'factumconsultora.com') {
      $base = 'https://factumconsultora.com/scg-mccain';
      define('BASE_BY', 'by Factum Consultora');
      define('BASE_DEVELOPER', 'Factum');
      define('BASE_CONTENT', 'Factum Consultora');
      define('BASE_LOGO', 'ftm');
      define('BASE_RUTA', 'https://www.factumconsultora.com');
      define('HOST', 'smtp.factumconsultora.com');
      define('USERNAME', 'alerta.factum@factumconsultora.com');
      define('PASS', 'Factum2017admin');
      define('SET_FROM', 'alerta.factum@factumconsultora.com');
      define('ADD_BCC', 'luisfactum@gmail.com');
      define('IMAGE', $_SERVER['DOCUMENT_ROOT'] . '/scg-mccain/assets/Imagenes/');
      define('PLANOS', $_SERVER['DOCUMENT_ROOT'] . '/scg-mccain/assets/img/planos/');
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

