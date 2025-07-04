<?php

/**
 * DIAGNÓSTICO RÁPIDO DE CONEXIÓN A BASE DE DATOS
 */

// Limpiar buffers
while (ob_get_level()) {
  ob_end_clean();
}

header('Content-Type: text/html; charset=UTF-8');
error_reporting(E_ALL);
ini_set('display_errors', '1');

echo '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Diagnóstico BD - Sistema Tickets</title>
    <style>
        body { 
            font-family: "Courier New", monospace; 
            background: #000; 
            color: #00ff00; 
            padding: 20px; 
        }
        .result { 
            border: 2px solid #00ff00; 
            padding: 15px; 
            margin: 10px 0; 
            border-radius: 5px;
        }
        .success { border-color: #00ff00; color: #00ff00; }
        .error { border-color: #ff0000; color: #ff0000; }
        .warning { border-color: #ffff00; color: #ffff00; }
        pre { color: #ffffff; background: #001100; padding: 10px; border-radius: 3px; }
    </style>
</head>
<body>
    <h1>🔍 DIAGNÓSTICO DE BASE DE DATOS</h1>';

// 1. Verificar archivo datos_base.php
echo '<div class="result">';
echo '<h3>1. Verificando configuración de base de datos...</h3>';

$datos_base_path = dirname(__DIR__) . '/Routes/datos_base.php';
if (file_exists($datos_base_path)) {
  echo '<p class="success">✅ Archivo datos_base.php encontrado</p>';
  include_once $datos_base_path;

  echo '<pre>';
  echo "Host: $host\n";
  echo "Usuario: $user\n";
  echo "Password: " . str_repeat('*', strlen($password)) . "\n";
  echo "Base de datos: $dbname\n";
  echo "Puerto: $port\n";
  echo '</pre>';
} else {
  echo '<p class="error">❌ Archivo datos_base.php NO encontrado en: ' . $datos_base_path . '</p>';
}
echo '</div>';

// 2. Verificar archivo de conexión
echo '<div class="result">';
echo '<h3>2. Verificando archivo de conexión PDO...</h3>';

$connection_path = dirname(__DIR__) . '/includes/database_connection.php';
if (file_exists($connection_path)) {
  echo '<p class="success">✅ Archivo database_connection.php encontrado</p>';

  try {
    include_once $connection_path;

    if (isset($pdo) && $pdo instanceof PDO) {
      echo '<p class="success">✅ Conexión PDO establecida correctamente</p>';

      // 3. Verificar tabla soporte_tickets
      echo '</div><div class="result">';
      echo '<h3>3. Verificando tabla soporte_tickets...</h3>';

      try {
        $stmt = $pdo->query("SHOW TABLES LIKE 'soporte_tickets'");
        if ($stmt->rowCount() > 0) {
          echo '<p class="success">✅ Tabla soporte_tickets existe</p>';

          // Obtener estadísticas
          $stmt = $pdo->query("SELECT COUNT(*) as total FROM soporte_tickets");
          $result = $stmt->fetch();
          echo '<p class="success">📊 Total de tickets: ' . $result['total'] . '</p>';

          if ($result['total'] > 0) {
            $stmt = $pdo->query("SELECT ticket_id, asunto, estado, fecha_creacion FROM soporte_tickets ORDER BY fecha_creacion DESC LIMIT 3");
            $tickets = $stmt->fetchAll();

            echo '<p class="success">📋 Últimos tickets:</p>';
            echo '<pre>';
            foreach ($tickets as $ticket) {
              echo "ID: {$ticket['ticket_id']} - {$ticket['asunto']} - Estado: {$ticket['estado']} - Fecha: {$ticket['fecha_creacion']}\n";
            }
            echo '</pre>';
          }
        } else {
          echo '<p class="warning">⚠️ Tabla soporte_tickets NO existe</p>';
        }
      } catch (Exception $e) {
        echo '<p class="error">❌ Error al consultar tabla: ' . $e->getMessage() . '</p>';
      }
    } else {
      echo '<p class="error">❌ Variable $pdo no está definida o no es una instancia PDO válida</p>';
      echo '<pre>Tipo de $pdo: ' . gettype($pdo) . '</pre>';
    }
  } catch (Exception $e) {
    echo '<p class="error">❌ Error al incluir archivo de conexión: ' . $e->getMessage() . '</p>';
  }
} else {
  echo '<p class="error">❌ Archivo database_connection.php NO encontrado en: ' . $connection_path . '</p>';
}
echo '</div>';

// 4. Probar conexión directa
echo '<div class="result">';
echo '<h3>4. Prueba de conexión directa...</h3>';

if (isset($host, $user, $password, $dbname, $port)) {
  try {
    $test_dsn = "mysql:host={$host};dbname={$dbname};port={$port};charset=utf8mb4";
    $test_pdo = new PDO($test_dsn, $user, $password, [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);

    echo '<p class="success">✅ Conexión directa exitosa</p>';
    echo '<p class="success">📊 Servidor MySQL: ' . $test_pdo->getAttribute(PDO::ATTR_SERVER_VERSION) . '</p>';
  } catch (PDOException $e) {
    echo '<p class="error">❌ Error en conexión directa: ' . $e->getMessage() . '</p>';
  }
} else {
  echo '<p class="error">❌ Variables de conexión no están definidas</p>';
}
echo '</div>';

echo '<div class="result">';
echo '<h3>5. Comandos para solucionar problemas:</h3>';
echo '<pre>';
echo "# Si la tabla no existe, ejecutar:\n";
echo "# mysql -h $host -P $port -u $user -p$password $dbname < database/soporte_tickets.sql\n\n";
echo "# O crear la tabla básica:\n";
echo "CREATE TABLE IF NOT EXISTS soporte_tickets (\n";
echo "  id INT AUTO_INCREMENT PRIMARY KEY,\n";
echo "  ticket_id VARCHAR(20) UNIQUE,\n";
echo "  asunto VARCHAR(255),\n";
echo "  estado ENUM('nuevo','abierto','en_proceso','resuelto','cerrado') DEFAULT 'nuevo',\n";
echo "  prioridad ENUM('baja','media','alta','critica') DEFAULT 'media',\n";
echo "  empresa VARCHAR(255),\n";
echo "  contacto_nombre VARCHAR(255),\n";
echo "  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n";
echo ");";
echo '</pre>';
echo '</div>';

echo '</body></html>';
