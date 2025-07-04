<?php
// Script de diagnóstico para verificar datos reales
header('Content-Type: text/plain; charset=UTF-8');

echo "=== DIAGNÓSTICO DE DATOS REALES ===\n\n";

try {
  // Incluir configuración
  require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
  require_once dirname(dirname(dirname(__DIR__))) . '/Routes/datos_base.php';

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

  echo "✅ Conexión exitosa a la base de datos\n";
  echo "📍 Host: $host\n";
  echo "📍 Base de datos: $dbname\n\n";

  // Verificar estructura de la tabla
  echo "=== ESTRUCTURA DE LA TABLA ===\n";
  $stmt = $pdo->query("DESCRIBE soporte_tickets");
  $columns = $stmt->fetchAll();
  foreach ($columns as $column) {
    echo "- {$column['Field']} ({$column['Type']})\n";
  }
  echo "\n";

  // Contar registros totales
  $stmt = $pdo->query("SELECT COUNT(*) as total FROM soporte_tickets");
  $total = $stmt->fetch()['total'];
  echo "📊 Total de registros en soporte_tickets: $total\n\n";

  // Estadísticas detalladas
  echo "=== ESTADÍSTICAS POR ESTADO ===\n";
  $stmt = $pdo->query("
        SELECT 
            estado,
            COUNT(*) as cantidad
        FROM soporte_tickets 
        GROUP BY estado
        ORDER BY cantidad DESC
    ");
  $estados = $stmt->fetchAll();
  foreach ($estados as $estado) {
    echo "- {$estado['estado']}: {$estado['cantidad']} tickets\n";
  }
  echo "\n";

  // Estadísticas por prioridad
  echo "=== ESTADÍSTICAS POR PRIORIDAD ===\n";
  $stmt = $pdo->query("
        SELECT 
            prioridad,
            COUNT(*) as cantidad
        FROM soporte_tickets 
        GROUP BY prioridad
        ORDER BY cantidad DESC
    ");
  $prioridades = $stmt->fetchAll();
  foreach ($prioridades as $prioridad) {
    echo "- {$prioridad['prioridad']}: {$prioridad['cantidad']} tickets\n";
  }
  echo "\n";

  // Últimos 5 tickets
  echo "=== ÚLTIMOS 5 TICKETS ===\n";
  $stmt = $pdo->query("
        SELECT id, asunto, estado, prioridad, fecha_creacion, nombre_contacto
        FROM soporte_tickets 
        ORDER BY fecha_creacion DESC 
        LIMIT 5
    ");
  $tickets = $stmt->fetchAll();
  foreach ($tickets as $ticket) {
    echo "#{$ticket['id']} - {$ticket['asunto']}\n";
    echo "  Estado: {$ticket['estado']} | Prioridad: {$ticket['prioridad']}\n";
    echo "  Contacto: {$ticket['nombre_contacto']}\n";
    echo "  Fecha: {$ticket['fecha_creacion']}\n\n";
  }

  echo "=== DIAGNÓSTICO COMPLETADO ===\n";
} catch (Exception $e) {
  echo "❌ Error: " . $e->getMessage() . "\n";
  echo "Detalles del error:\n";
  echo $e->getTraceAsString() . "\n";
}
