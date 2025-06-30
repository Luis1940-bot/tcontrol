<?php
/**
 * Configuración de entornos para tControl
 * Este archivo gestiona las configuraciones para desarrollo, testing y producción
 */

// Detectar el entorno actual basado en la URL o variable de entorno
function detectEnvironment() {
    $host = $_SERVER['HTTP_HOST'] ?? '';
    
    if (strpos($host, 'localhost') !== false || strpos($host, '127.0.0.1') !== false) {
        return 'development';
    } elseif (strpos($host, 'test.tenkiweb.com') !== false) {
        return 'testing';
    } elseif (strpos($host, 'tenkiweb.com') !== false) {
        return 'production';
    }
    
    return 'development'; // Por defecto
}

// Configuraciones por entorno
$environments = [
    'development' => [
        'BASE_URL' => 'http://localhost/tcontrol/',
        'DB_HOST' => 'localhost',
        'DB_NAME' => 'tcontrol_dev',
        'DB_USER' => 'root',
        'DB_PASS' => '',
        'DEBUG' => true,
        'ERROR_REPORTING' => E_ALL,
        'DISPLAY_ERRORS' => true,
        'LOG_LEVEL' => 'DEBUG',
        'CACHE_ENABLED' => false,
        'EMAIL_DEBUG' => true,
    ],
    'testing' => [
        'BASE_URL' => 'https://test.tenkiweb.com/tcontrol/',
        'DB_HOST' => 'localhost', // Ajustar según tu configuración
        'DB_NAME' => 'tcontrol_test',
        'DB_USER' => 'tcontrol_user',
        'DB_PASS' => 'secure_password',
        'DEBUG' => true,
        'ERROR_REPORTING' => E_ALL & ~E_NOTICE,
        'DISPLAY_ERRORS' => false,
        'LOG_LEVEL' => 'INFO',
        'CACHE_ENABLED' => true,
        'EMAIL_DEBUG' => false,
    ],
    'production' => [
        'BASE_URL' => 'https://tenkiweb.com/tcontrol/',
        'DB_HOST' => 'localhost', // Ajustar según tu configuración
        'DB_NAME' => 'tcontrol_prod',
        'DB_USER' => 'tcontrol_user',
        'DB_PASS' => 'ultra_secure_password',
        'DEBUG' => false,
        'ERROR_REPORTING' => E_ERROR | E_WARNING | E_PARSE,
        'DISPLAY_ERRORS' => false,
        'LOG_LEVEL' => 'ERROR',
        'CACHE_ENABLED' => true,
        'EMAIL_DEBUG' => false,
    ],
];

// Obtener el entorno actual
$currentEnvironment = detectEnvironment();
$config = $environments[$currentEnvironment];

// Definir constantes
foreach ($config as $key => $value) {
    if (!defined($key)) {
        define($key, $value);
    }
}

// Configurar PHP basado en el entorno
error_reporting(ERROR_REPORTING);
ini_set('display_errors', DISPLAY_ERRORS ? '1' : '0');

// Definir constante del entorno
if (!defined('ENVIRONMENT')) {
    define('ENVIRONMENT', $currentEnvironment);
}

// Configuraciones adicionales específicas del entorno
if (ENVIRONMENT === 'development') {
    // Configuraciones específicas para desarrollo
    ini_set('log_errors', 1);
    ini_set('error_log', __DIR__ . '/logs/php_errors.log');
} elseif (ENVIRONMENT === 'testing') {
    // Configuraciones específicas para testing
    ini_set('log_errors', 1);
    ini_set('error_log', __DIR__ . '/logs/testing_errors.log');
} elseif (ENVIRONMENT === 'production') {
    // Configuraciones específicas para producción
    ini_set('log_errors', 1);
    ini_set('error_log', __DIR__ . '/logs/production_errors.log');
}

// Headers de seguridad adicionales para producción y testing
if (ENVIRONMENT !== 'development') {
    header("Strict-Transport-Security: max-age=31536000; includeSubDomains; preload");
    header("X-Content-Type-Options: nosniff");
    header("X-Frame-Options: DENY");
    header("X-XSS-Protection: 1; mode=block");
}
