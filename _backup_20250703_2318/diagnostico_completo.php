<?php
// Diagnóstico completo del problema de modo Quirks
header('Content-Type: text/plain; charset=UTF-8');

echo "=== DIAGNÓSTICO DE MODO QUIRKS ===\n\n";

echo "1. Verificando headers enviados:\n";
if (!headers_sent($file, $line)) {
  echo "   ✓ Headers aún no enviados\n";
} else {
  echo "   ❌ Headers ya enviados desde: $file línea $line\n";
}

echo "\n2. Verificando buffers de salida:\n";
echo "   Nivel de buffer: " . ob_get_level() . "\n";
if (ob_get_level() > 0) {
  $content = ob_get_contents();
  echo "   Contenido del buffer: '" . var_export($content, true) . "'\n";
}

echo "\n3. Verificando configuración PHP:\n";
echo "   output_buffering: " . ini_get('output_buffering') . "\n";
echo "   implicit_flush: " . ini_get('implicit_flush') . "\n";
echo "   display_errors: " . ini_get('display_errors') . "\n";

echo "\n4. Intentando incluir archivos uno por uno:\n";

try {
  echo "   Incluyendo config.php...\n";
  ob_start();
  require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
  $buffer_after_config = ob_get_contents();
  ob_end_clean();
  echo "   Buffer después de config.php: '" . var_export($buffer_after_config, true) . "'\n";
} catch (Exception $e) {
  echo "   ❌ Error en config.php: " . $e->getMessage() . "\n";
}

try {
  echo "   Incluyendo ErrorLogger.php...\n";
  ob_start();
  require_once dirname(dirname(dirname(__DIR__))) . '/ErrorLogger.php';
  $buffer_after_logger = ob_get_contents();
  ob_end_clean();
  echo "   Buffer después de ErrorLogger.php: '" . var_export($buffer_after_logger, true) . "'\n";
} catch (Exception $e) {
  echo "   ❌ Error en ErrorLogger.php: " . $e->getMessage() . "\n";
}

try {
  echo "   Inicializando ErrorLogger...\n";
  ob_start();
  ErrorLogger::initialize(dirname(dirname(dirname(__DIR__))) . '/logs/error.log');
  $buffer_after_init = ob_get_contents();
  ob_end_clean();
  echo "   Buffer después de inicializar: '" . var_export($buffer_after_init, true) . "'\n";
} catch (Exception $e) {
  echo "   ❌ Error al inicializar ErrorLogger: " . $e->getMessage() . "\n";
}

echo "\n5. Verificando funciones de seguridad:\n";

if (function_exists('setSecurityHeaders')) {
  try {
    echo "   Ejecutando setSecurityHeaders...\n";
    ob_start();
    $nonce = setSecurityHeaders();
    $buffer_after_security = ob_get_contents();
    ob_end_clean();
    echo "   Buffer después de setSecurityHeaders: '" . var_export($buffer_after_security, true) . "'\n";
    echo "   Nonce generado: " . var_export($nonce, true) . "\n";
  } catch (Exception $e) {
    echo "   ❌ Error en setSecurityHeaders: " . $e->getMessage() . "\n";
  }
} else {
  echo "   ❌ Función setSecurityHeaders no existe\n";
}

if (function_exists('startSecureSession')) {
  try {
    echo "   Ejecutando startSecureSession...\n";
    ob_start();
    startSecureSession();
    $buffer_after_session = ob_get_contents();
    ob_end_clean();
    echo "   Buffer después de startSecureSession: '" . var_export($buffer_after_session, true) . "'\n";
  } catch (Exception $e) {
    echo "   ❌ Error en startSecureSession: " . $e->getMessage() . "\n";
  }
} else {
  echo "   ❌ Función startSecureSession no existe\n";
}

echo "\n=== FIN DEL DIAGNÓSTICO ===\n";
