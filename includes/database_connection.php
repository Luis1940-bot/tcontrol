<?php

/**
 * CONEXIÓN PDO GLOBAL PARA EL SISTEMA DE TICKETS
 * Este archivo establece una conexión PDO que puede ser utilizada en toda la aplicación
 */

// Evitar conexiones múltiples
if (isset($pdo) && $pdo instanceof PDO) {
  return $pdo;
}

try {
  // Incluir configuración de base de datos
  if (file_exists(dirname(__DIR__) . '/Routes/datos_base.php')) {
    include_once dirname(__DIR__) . '/Routes/datos_base.php';
  } else {
    throw new Exception('Archivo de configuración de base de datos no encontrado');
  }

  // Validar que las variables están definidas
  if (!isset($host, $user, $password, $dbname, $port)) {
    throw new Exception('Variables de conexión no están definidas en datos_base.php');
  }

  // Configurar opciones PDO
  $options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
  ];

  // Crear conexión PDO
  $dsn = "mysql:host={$host};dbname={$dbname};port={$port};charset=utf8mb4";
  $pdo = new PDO($dsn, $user, $password, $options);

  // Configurar timezone
  $pdo->exec("SET time_zone = '+00:00'");
} catch (PDOException $e) {
  // Log del error si ErrorLogger está disponible
  if (class_exists('ErrorLogger')) {
    ErrorLogger::logError('Database Connection Error: ' . $e->getMessage());
  } else {
    error_log('Database Connection Error: ' . $e->getMessage());
  }

  // Para development, mostrar error
  if (defined('BASE_URL') && strpos(BASE_URL, 'localhost') !== false) {
    throw new Exception('Error de conexión a la base de datos: ' . $e->getMessage());
  }

  // Para producción, usar datos de ejemplo
  $pdo = null;
} catch (Exception $e) {
  // Log del error
  if (class_exists('ErrorLogger')) {
    ErrorLogger::logError('Database Setup Error: ' . $e->getMessage());
  } else {
    error_log('Database Setup Error: ' . $e->getMessage());
  }

  // Para development, mostrar error
  if (defined('BASE_URL') && strpos(BASE_URL, 'localhost') !== false) {
    throw new Exception('Error de configuración de base de datos: ' . $e->getMessage());
  }

  $pdo = null;
}

// Hacer la conexión disponible globalmente
$GLOBALS['pdo'] = $pdo;

return $pdo;
