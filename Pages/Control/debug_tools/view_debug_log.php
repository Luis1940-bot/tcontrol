<?php
// Lector de logs de diagnóstico
header('Content-Type: text/plain');

echo "=== LOG DE DIAGNÓSTICO ===\n\n";

if (file_exists('/tmp/debug_control.log')) {
  echo file_get_contents('/tmp/debug_control.log');
} else {
  echo "El archivo de log no existe aún.\n";
  echo "Esto podría significar que:\n";
  echo "1. El script no se ejecutó\n";
  echo "2. No tiene permisos para escribir en /tmp/\n";
  echo "3. Se detuvo antes de escribir el primer log\n";
}

echo "\n\n=== LOG DE ERRORES PHP ===\n\n";

$error_log = dirname(dirname(__DIR__)) . '/logs/error.log';
if (file_exists($error_log)) {
  $lines = file($error_log);
  // Mostrar solo las últimas 20 líneas
  $recent_lines = array_slice($lines, -20);
  echo implode('', $recent_lines);
} else {
  echo "No hay log de errores o no existe.\n";
}
