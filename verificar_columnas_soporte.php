<?php

/**
 * Script para verificar si las columnas de soporte público ya existen
 */

require_once 'Routes/datos_base.php';

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

  echo "<h2>🔍 Verificando estructura de la tabla soporte_tickets</h2>\n";

  // Obtener información de columnas
  $stmt = $pdo->query("DESCRIBE soporte_tickets");
  $columnas = $stmt->fetchAll();

  echo "<table border='1' style='border-collapse: collapse; width: 100%;'>\n";
  echo "<tr><th>Campo</th><th>Tipo</th><th>Null</th><th>Key</th><th>Default</th><th>Extra</th></tr>\n";

  $campos_nuevos = ['tipo_cliente', 'planta_cliente', 'como_conocio', 'es_cliente_logueado'];
  $campos_encontrados = [];

  foreach ($columnas as $columna) {
    $campo = $columna['Field'];
    $es_nuevo = in_array($campo, $campos_nuevos);
    $color = $es_nuevo ? 'background: #d4edda;' : '';

    if ($es_nuevo) {
      $campos_encontrados[] = $campo;
    }

    echo "<tr style='{$color}'>";
    echo "<td>" . htmlspecialchars($campo) . "</td>";
    echo "<td>" . htmlspecialchars($columna['Type']) . "</td>";
    echo "<td>" . htmlspecialchars($columna['Null']) . "</td>";
    echo "<td>" . htmlspecialchars($columna['Key']) . "</td>";
    echo "<td>" . htmlspecialchars($columna['Default']) . "</td>";
    echo "<td>" . htmlspecialchars($columna['Extra']) . "</td>";
    echo "</tr>\n";
  }
  echo "</table>\n";

  echo "<h3>📋 Resultado de la verificación:</h3>\n";

  $campos_faltantes = array_diff($campos_nuevos, $campos_encontrados);

  if (empty($campos_faltantes)) {
    echo "<div style='background: #d4edda; padding: 15px; border: 1px solid #c3e6cb; border-radius: 5px;'>\n";
    echo "<h4>✅ ¡Perfecto! Todos los campos necesarios ya existen</h4>\n";
    echo "<p>Los siguientes campos para soporte público están presentes:</p>\n";
    echo "<ul>\n";
    foreach ($campos_encontrados as $campo) {
      echo "<li>✅ <strong>{$campo}</strong></li>\n";
    }
    echo "</ul>\n";
    echo "<p><strong>🎉 La base de datos ya está actualizada. No necesitas ejecutar el script SQL.</strong></p>\n";
    echo "</div>\n";
  } else {
    echo "<div style='background: #f8d7da; padding: 15px; border: 1px solid #f5c6cb; border-radius: 5px;'>\n";
    echo "<h4>⚠️ Faltan campos en la base de datos</h4>\n";
    echo "<p>Los siguientes campos necesarios NO están presentes:</p>\n";
    echo "<ul>\n";
    foreach ($campos_faltantes as $campo) {
      echo "<li>❌ <strong>{$campo}</strong></li>\n";
    }
    echo "</ul>\n";
    echo "<p><strong>🔧 Necesitas ejecutar el script SQL:</strong></p>\n";
    echo "<code>database/update_soporte_tickets_campos_publicos.sql</code>\n";
    echo "</div>\n";
  }

  // Verificar si hay datos de prueba
  echo "<h3>📊 Datos existentes en la tabla:</h3>\n";
  $stmt = $pdo->query("SELECT COUNT(*) as total FROM soporte_tickets");
  $total = $stmt->fetch()['total'];

  echo "<p>Total de tickets en la base de datos: <strong>{$total}</strong></p>\n";

  if ($total > 0 && empty($campos_faltantes)) {
    // Mostrar algunos ejemplos
    $stmt = $pdo->query("SELECT ticket_id, asunto, tipo_cliente, es_cliente_logueado, fecha_creacion FROM soporte_tickets ORDER BY fecha_creacion DESC LIMIT 5");
    $ejemplos = $stmt->fetchAll();

    if (!empty($ejemplos)) {
      echo "<h4>🎫 Últimos 5 tickets (ejemplo):</h4>\n";
      echo "<table border='1' style='border-collapse: collapse; width: 100%;'>\n";
      echo "<tr><th>ID</th><th>Asunto</th><th>Tipo Cliente</th><th>Logueado</th><th>Fecha</th></tr>\n";

      foreach ($ejemplos as $ticket) {
        echo "<tr>";
        echo "<td>" . htmlspecialchars($ticket['ticket_id']) . "</td>";
        echo "<td>" . htmlspecialchars($ticket['asunto']) . "</td>";
        echo "<td>" . htmlspecialchars($ticket['tipo_cliente'] ?? 'NULL') . "</td>";
        echo "<td>" . ($ticket['es_cliente_logueado'] ? '✅ Sí' : '❌ No') . "</td>";
        echo "<td>" . htmlspecialchars($ticket['fecha_creacion']) . "</td>";
        echo "</tr>\n";
      }
      echo "</table>\n";
    }
  }
} catch (PDOException $e) {
  echo "<div style='background: #f8d7da; padding: 15px; border: 1px solid #f5c6cb; border-radius: 5px;'>\n";
  echo "<h4>❌ Error de conexión a la base de datos</h4>\n";
  echo "<p>Error: " . htmlspecialchars($e->getMessage()) . "</p>\n";
  echo "<p>Verifica que la base de datos esté corriendo y las credenciales sean correctas.</p>\n";
  echo "</div>\n";
}
