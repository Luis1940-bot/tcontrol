<?php
// Prueba rápida de config_env.php corregido

$_SERVER['HTTP_HOST'] = 'localhost';
include 'config_env.php';

echo "=== PRUEBA DE CONFIGURACIÓN CORREGIDA ===\n";
echo "Entorno: " . ENVIRONMENT . "\n";
echo "Base URL: " . BASE_URL . "\n";
echo "Debug: " . (DEBUG ? 'Activado' : 'Desactivado') . "\n";
echo "BD: " . DB_NAME . "\n";
echo "Cache: " . (CACHE_ENABLED ? 'Activado' : 'Desactivado') . "\n";
echo "Error Reporting: " . ERROR_REPORTING . "\n";
echo "Display Errors: " . (DISPLAY_ERRORS ? 'Activado' : 'Desactivado') . "\n";
echo "=== TODAS LAS CONSTANTES DEFINIDAS CORRECTAMENTE ===\n";
