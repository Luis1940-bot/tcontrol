<?php
// Verificar estructura de la tabla soporte_tickets

include dirname(dirname(dirname(__DIR__))) . '/Routes/datos_base.php';

try {
  $pdo = new PDO("mysql:host={$host};dbname={$dbname};port={$port}", $user, $password);

  echo "=== ESTRUCTURA DE LA TABLA soporte_tickets ===\n\n";

  $stmt = $pdo->prepare('DESCRIBE soporte_tickets');
  $stmt->execute();
  $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);

  foreach ($columns as $col) {
    echo $col['Field'] . ' - ' . $col['Type'] . "\n";
  }

  echo "\n=== DATOS DE EJEMPLO ===\n\n";

  $stmt = $pdo->prepare('SELECT * FROM soporte_tickets LIMIT 3');
  $stmt->execute();
  $sample_data = $stmt->fetchAll(PDO::FETCH_ASSOC);

  foreach ($sample_data as $row) {
    echo "ID: " . $row['ticket_id'] . " - Asunto: " . substr($row['asunto'], 0, 50) . "\n";
  }
} catch (Exception $e) {
  echo "Error: " . $e->getMessage();
}
