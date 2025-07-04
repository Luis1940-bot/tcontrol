<?php
echo "DIAGNÓSTICO DE CONEXIÓN BD EN LISTA.PHP\n";
echo "=====================================\n\n";

// Incluir configuración de BD
$config_path = dirname(dirname(dirname(__DIR__))) . '/Routes/datos_base.php';
echo "1. Ruta del archivo de configuración: $config_path\n";
echo "2. ¿Archivo existe? " . (file_exists($config_path) ? "SÍ" : "NO") . "\n";

if (file_exists($config_path)) {
  include $config_path;

  echo "3. Variables después del include:\n";
  echo "   - host: " . (isset($host) ? $host : "NO DEFINIDO") . "\n";
  echo "   - user: " . (isset($user) ? $user : "NO DEFINIDO") . "\n";
  echo "   - password: " . (isset($password) ? "***" : "NO DEFINIDO") . "\n";
  echo "   - dbname: " . (isset($dbname) ? $dbname : "NO DEFINIDO") . "\n";
  echo "   - port: " . (isset($port) ? $port : "NO DEFINIDO") . "\n\n";

  if (isset($host, $user, $password, $dbname, $port)) {
    try {
      $dsn = "mysql:host={$host};dbname={$dbname};port={$port};charset=utf8mb4";
      echo "4. DSN: $dsn\n";

      $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
      ];

      $pdo = new PDO($dsn, $user, $password, $options);
      echo "5. ✅ Conexión PDO establecida exitosamente\n";

      // Verificar tabla
      $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM soporte_tickets");
      $stmt->execute();
      $total = $stmt->fetch()['total'];
      echo "6. ✅ Total tickets en BD: $total\n";

      if ($total > 0) {
        // Obtener algunos tickets de muestra
        $stmt_sample = $pdo->prepare("SELECT ticket_id, asunto, estado, prioridad, empresa, nombre_contacto FROM soporte_tickets LIMIT 3");
        $stmt_sample->execute();
        $sample_tickets = $stmt_sample->fetchAll(PDO::FETCH_ASSOC);

        echo "7. ✅ Muestra de tickets:\n";
        foreach ($sample_tickets as $ticket) {
          echo "   - {$ticket['ticket_id']}: {$ticket['asunto']} (Estado: {$ticket['estado']})\n";
        }

        echo "\n🎯 RESULTADO: La conexión funciona y hay datos disponibles\n";
        echo "🔧 ACCIÓN: Verificar por qué lista.php no está mostrando datos reales\n";
      } else {
        echo "7. ⚠️ La tabla existe pero está vacía\n";
      }
    } catch (Exception $e) {
      echo "5. ❌ Error en conexión PDO: " . $e->getMessage() . "\n";
    }
  } else {
    echo "4. ❌ Variables de configuración incompletas\n";
  }
} else {
  echo "3. ❌ No se pudo incluir el archivo de configuración\n";
}
