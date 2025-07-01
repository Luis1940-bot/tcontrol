<?php

/**
 * Router para servidor de desarrollo PHP
 * Maneja correctamente los tipos MIME para archivos estáticos
 */

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// Definir tipos MIME
$mimeTypes = [
  'css' => 'text/css',
  'js' => 'application/javascript',
  'json' => 'application/json',
  'png' => 'image/png',
  'jpg' => 'image/jpeg',
  'jpeg' => 'image/jpeg',
  'gif' => 'image/gif',
  'svg' => 'image/svg+xml',
  'ico' => 'image/x-icon',
  'woff' => 'font/woff',
  'woff2' => 'font/woff2',
  'ttf' => 'font/ttf',
  'eot' => 'application/vnd.ms-fontobject',
  'html' => 'text/html',
  'htm' => 'text/html',
  'txt' => 'text/plain'
];

// Solo manejar archivos estáticos (con extensión)
$extension = strtolower(pathinfo($uri, PATHINFO_EXTENSION));

// Si tiene extensión y es un archivo que existe, servirlo con tipo MIME correcto
if (!empty($extension) && file_exists(__DIR__ . $uri)) {
  if (isset($mimeTypes[$extension])) {
    header('Content-Type: ' . $mimeTypes[$extension]);

    // Deshabilitar caché para archivos JS y CSS durante desarrollo
    if (in_array($extension, ['css', 'js'])) {
      header('Cache-Control: no-cache, no-store, must-revalidate');
      header('Pragma: no-cache');
      header('Expires: 0');
    } else {
      // Configurar caché solo para otros archivos estáticos
      header('Cache-Control: public, max-age=3600');
      header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 3600) . ' GMT');
    }

    readfile(__DIR__ . $uri);
    return true;
  }
}

// Para rutas sin extensión (páginas PHP), dejar que la aplicación maneje el enrutamiento
return false;
