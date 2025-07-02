<?php

/**
 * Script para aplicar las actualizaciones de la base de datos del sistema de soporte
 * Agregar campos para usuarios no logueados
 */

// Configuración de error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>🔧 Actualización de Base de Datos - Sistema de Soporte</h1>\n";
echo "<hr>\n";

try {
  // Cargar configuración de base de datos
  require_once 'Routes/datos_base.php';

  $conexion = new mysqli($host, $user, $password, $dbname, $port);

  if ($conexion->connect_error) {
    throw new Exception("Error de conexión: " . $conexion->connect_error);
  }

  $conexion->set_charset("utf8mb4");

  echo "<h2>📋 Aplicando Actualizaciones...</h2>\n";

  // Verificar si las columnas ya existen
  $check_sql = "SHOW COLUMNS FROM soporte_tickets LIKE 'tipo_cliente'";
  $result = $conexion->query($check_sql);

  if ($result->num_rows == 0) {
    echo "<p>⚙️ Agregando nuevas columnas a la tabla soporte_tickets...</p>\n";

    // Aplicar las actualizaciones
    $updates = [
      "ALTER TABLE soporte_tickets ADD COLUMN tipo_cliente ENUM('cliente_existente', 'cliente_potencial', 'consulta_general') NULL AFTER usuario_id",
      "ALTER TABLE soporte_tickets ADD COLUMN planta_cliente VARCHAR(50) NULL AFTER tipo_cliente",
      "ALTER TABLE soporte_tickets ADD COLUMN como_conocio ENUM('referencia', 'web', 'redes_sociales', 'evento', 'otro') NULL AFTER planta_cliente",
      "ALTER TABLE soporte_tickets ADD COLUMN es_cliente_logueado BOOLEAN DEFAULT FALSE AFTER como_conocio"
    ];

    foreach ($updates as $sql) {
      echo "<p>🔨 Ejecutando: " . substr($sql, 0, 60) . "...</p>\n";
      if (!$conexion->query($sql)) {
        echo "<p>❌ Error: " . $conexion->error . "</p>\n";
      } else {
        echo "<p>✅ Ejecutado exitosamente</p>\n";
      }
    }

    // Actualizar registros existentes
    echo "<p>📝 Actualizando registros existentes...</p>\n";
    $update_existing = "UPDATE soporte_tickets SET es_cliente_logueado = TRUE WHERE usuario_id IS NOT NULL";
    if ($conexion->query($update_existing)) {
      echo "<p>✅ Registros existentes marcados como clientes logueados</p>\n";
    } else {
      echo "<p>❌ Error actualizando registros: " . $conexion->error . "</p>\n";
    }
  } else {
    echo "<p>ℹ️ Las columnas ya existen en la tabla. No se requiere actualización.</p>\n";
  }

  // Verificar la estructura final
  echo "<h2>📊 Estructura Final de la Tabla</h2>\n";
  $describe_sql = "DESCRIBE soporte_tickets";
  $result = $conexion->query($describe_sql);

  echo "<table border='1' style='border-collapse: collapse; width: 100%; margin: 10px 0;'>\n";
  echo "<tr style='background: #f0f0f0;'><th>Campo</th><th>Tipo</th><th>Nulo</th><th>Clave</th><th>Predeterminado</th></tr>\n";

  while ($row = $result->fetch_assoc()) {
    echo "<tr>";
    echo "<td>{$row['Field']}</td>";
    echo "<td>{$row['Type']}</td>";
    echo "<td>{$row['Null']}</td>";
    echo "<td>{$row['Key']}</td>";
    echo "<td>{$row['Default']}</td>";
    echo "</tr>\n";
  }
  echo "</table>\n";

  echo "<div style='background: #d4edda; padding: 15px; border: 1px solid #c3e6cb; border-radius: 5px; margin: 20px 0;'>\n";
  echo "<h3>✅ Actualización Completada</h3>\n";
  echo "<p>La base de datos ha sido actualizada exitosamente para soportar:</p>\n";
  echo "<ul>\n";
  echo "<li>✅ Usuarios no logueados (acceso público)</li>\n";
  echo "<li>✅ Clasificación de tipos de cliente</li>\n";
  echo "<li>✅ Información de plantas/ubicaciones</li>\n";
  echo "<li>✅ Seguimiento de canales de adquisición</li>\n";
  echo "<li>✅ Diferenciación entre clientes logueados y públicos</li>\n";
  echo "</ul>\n";
  echo "</div>\n";

  $conexion->close();
} catch (Exception $e) {
  echo "<div style='background: #f8d7da; padding: 15px; border: 1px solid #f5c6cb; border-radius: 5px; margin: 20px 0;'>\n";
  echo "<h3>❌ Error en la Actualización</h3>\n";
  echo "<p><strong>Error:</strong> " . $e->getMessage() . "</p>\n";
  echo "</div>\n";
}

echo "<hr>\n";
echo "<h2>🔗 Siguientes Pasos</h2>\n";
echo "<p><a href='Pages/Soporte/' style='background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>🎧 Probar Formulario de Soporte</a></p>\n";
echo "<p><a href='diagnostico_soporte.php' style='background: #6c757d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>🔍 Ejecutar Diagnóstico</a></p>\n";

echo "<br><small>Actualización ejecutada el " . date('Y-m-d H:i:s') . "</small>\n";
