<?php
// Archivo temporal para verificar configuración PHP
echo "<h3>Información de PHP</h3>";
echo "<strong>Versión PHP:</strong> " . phpversion() . "<br>";
echo "<strong>Error Reporting:</strong> " . error_reporting() . "<br>";
echo "<strong>Display Errors:</strong> " . (ini_get('display_errors') ? 'On' : 'Off') . "<br>";
echo "<strong>Log Errors:</strong> " . (ini_get('log_errors') ? 'On' : 'Off') . "<br>";
echo "<strong>Error Log:</strong> " . ini_get('error_log') . "<br>";

echo "<h3>Configuraciones relevantes:</h3>";
$configs = [
  'error_reporting',
  'display_errors',
  'display_startup_errors',
  'log_errors',
  'error_log'
];

foreach ($configs as $config) {
  echo "<strong>$config:</strong> " . ini_get($config) . "<br>";
}
