<?php
// Script para crear las tablas de soporte si no existen
require_once dirname(__DIR__, 2) . '/Routes/datos_base.php';

try {
  $pdo = new PDO(
    "mysql:host={$host};dbname={$dbname};charset=utf8mb4",
    $user,
    $password,
    [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]
  );

  echo "✅ Conexión a la base de datos exitosa<br>";
  echo "📊 Base de datos: {$dbname}<br><br>";

  // Leer el archivo SQL de estructura
  $sqlFile = dirname(__DIR__, 2) . '/database/soporte_tickets.sql';
  if (!file_exists($sqlFile)) {
    throw new Exception("No se encontró el archivo SQL de estructura: $sqlFile");
  }

  $sql = file_get_contents($sqlFile);

  // Dividir en declaraciones individuales
  $statements = explode(';', $sql);

  $executed = 0;
  $errors = 0;

  foreach ($statements as $statement) {
    $statement = trim($statement);
    if (empty($statement)) continue;

    try {
      $pdo->exec($statement);
      $executed++;
      echo "✅ Ejecutado: " . substr($statement, 0, 50) . "...<br>";
    } catch (Exception $e) {
      $errors++;
      echo "❌ Error en: " . substr($statement, 0, 50) . "... -> " . $e->getMessage() . "<br>";
    }
  }

  echo "<br>📊 Resumen:<br>";
  echo "- Declaraciones ejecutadas exitosamente: $executed<br>";
  echo "- Errores encontrados: $errors<br>";

  if ($errors === 0) {
    echo "<br>🎉 ¡Todas las tablas de soporte se crearon exitosamente!<br>";
  }
} catch (Exception $e) {
  echo "❌ Error crítico: " . $e->getMessage() . "<br>";
}
