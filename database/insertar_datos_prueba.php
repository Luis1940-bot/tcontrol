<?php
// Script para insertar datos de prueba en la base de datos
require_once dirname(__DIR__) . '/config.php';
require_once dirname(__DIR__) . '/Routes/datos_base.php';

echo "=== INSERTANDO DATOS DE PRUEBA ===\n";

try {
  // Crear conexión PDO
  $pdo = new PDO(
    "mysql:host={$host};dbname={$dbname};charset=utf8mb4",
    $user,
    $password,
    [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]
  );

  echo "✅ Conexión a base de datos establecida\n";
  echo "📍 Host: $host\n";
  echo "📍 Base de datos: $dbname\n";

  // Leer el archivo SQL
  $sql_file = __DIR__ . '/datos_prueba_tickets.sql';
  $sql_content = file_get_contents($sql_file);

  if (!$sql_content) {
    throw new Exception("No se pudo leer el archivo SQL");
  }

  // Extraer solo el INSERT (eliminar comentarios)
  $lines = explode("\n", $sql_content);
  $sql_insert = "";
  $in_insert = false;

  foreach ($lines as $line) {
    $line = trim($line);
    if (empty($line) || strpos($line, '--') === 0) {
      continue;
    }

    if (strpos($line, 'INSERT INTO') === 0) {
      $in_insert = true;
    }

    if ($in_insert) {
      $sql_insert .= $line . "\n";
    }
  }

  echo "📝 Ejecutando INSERT...\n";

  // Ejecutar el INSERT
  $result = $pdo->exec($sql_insert);

  echo "✅ Se insertaron $result filas de datos de prueba\n";

  // Verificar los datos insertados
  $stmt = $pdo->query("SELECT COUNT(*) as total FROM soporte_tickets");
  $total = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

  echo "📊 Total de tickets en la base de datos: $total\n";

  echo "\n=== DATOS INSERTADOS CORRECTAMENTE ===\n";
} catch (Exception $e) {
  echo "❌ Error: " . $e->getMessage() . "\n";

  // Mostrar información de debug
  echo "\n=== INFORMACIÓN DE DEBUG ===\n";
  echo "Archivo config.php existe: " . (file_exists(dirname(__DIR__) . '/config.php') ? 'SÍ' : 'NO') . "\n";
  echo "Variable PDO definida: " . (isset($pdo) ? 'SÍ' : 'NO') . "\n";
  if (isset($pdo)) {
    echo "Tipo de PDO: " . get_class($pdo) . "\n";
  }

  // Verificar si la tabla existe
  try {
    if (isset($pdo)) {
      $stmt = $pdo->query("SHOW TABLES LIKE 'soporte_tickets'");
      $table_exists = $stmt->fetch() !== false;
      echo "Tabla soporte_tickets existe: " . ($table_exists ? 'SÍ' : 'NO') . "\n";
    }
  } catch (Exception $e2) {
    echo "Error verificando tabla: " . $e2->getMessage() . "\n";
  }
}
