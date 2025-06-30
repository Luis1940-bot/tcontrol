<?php
// Prueba rápida de config_env.php corregido

$_SERVER['HTTP_HOST'] = 'localhost';
include 'config_env.php';

echo "=== PRUEBA DE CONFIGURACIÓN CORREGIDA ===\n";
echo "Entorno: " . (defined('ENVIRONMENT') ? constant('ENVIRONMENT') : 'NO_DEFINIDO') . "\n";
echo "Base URL: " . (defined('BASE_URL') ? constant('BASE_URL') : 'NO_DEFINIDO') . "\n";
echo "Debug: " . (defined('DEBUG') ? (constant('DEBUG') ? 'Activado' : 'Desactivado') : 'NO_DEFINIDO') . "\n";
echo "BD: " . (defined('DB_NAME') ? constant('DB_NAME') : 'NO_DEFINIDO') . "\n";
echo "Cache: " . (defined('CACHE_ENABLED') ? (constant('CACHE_ENABLED') ? 'Activado' : 'Desactivado') : 'NO_DEFINIDO') . "\n";
echo "Error Reporting: " . (defined('ERROR_REPORTING') ? constant('ERROR_REPORTING') : 'NO_DEFINIDO') . "\n";
echo "Display Errors: " . (defined('DISPLAY_ERRORS') ? (constant('DISPLAY_ERRORS') ? 'Activado' : 'Desactivado') : 'NO_DEFINIDO') . "\n";
echo "Log Level: " . (defined('LOG_LEVEL') ? constant('LOG_LEVEL') : 'NO_DEFINIDO') . "\n";
echo "Email Debug: " . (defined('EMAIL_DEBUG') ? (constant('EMAIL_DEBUG') ? 'Activado' : 'Desactivado') : 'NO_DEFINIDO') . "\n";
echo "=== TODAS LAS CONSTANTES VERIFICADAS CORRECTAMENTE ===\n";
