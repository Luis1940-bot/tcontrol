<?php

/**
 * Diagnóstico del Sistema de Soporte
 * Verifica el estado del sistema y posibles problemas
 */

// Configuración básica
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>🔍 Diagnóstico del Sistema de Soporte</h1>\n";
echo "<hr>\n";

// 1. Verificar configuración básica
echo "<h2>📋 1. Verificación de Configuración</h2>\n";
try {
  require_once 'config.php';
  echo "✅ config.php cargado correctamente<br>\n";
  echo "📍 BASE_URL: " . (defined('BASE_URL') ? BASE_URL : 'NO DEFINIDO') . "<br>\n";
} catch (Exception $e) {
  echo "❌ Error cargando config.php: " . $e->getMessage() . "<br>\n";
}

// 2. Verificar sesión
echo "<h2>👤 2. Verificación de Sesión</h2>\n";
startSecureSession();
echo "🔐 Estado de sesión:<br>\n";
echo "- session_status(): " . session_status() . " (2=PHP_SESSION_ACTIVE)<br>\n";
echo "- user_id: " . ($_SESSION['user_id'] ?? 'NO DEFINIDO') . "<br>\n";
echo "- user_name: " . ($_SESSION['user_name'] ?? 'NO DEFINIDO') . "<br>\n";
echo "- user_email: " . ($_SESSION['user_email'] ?? 'NO DEFINIDO') . "<br>\n";

if (!isset($_SESSION['user_id'])) {
  echo "⚠️ <strong>PROBLEMA DETECTADO:</strong> Usuario no está logueado<br>\n";
  echo "📝 <strong>Solución:</strong> Debes loguearte primero en /Pages/Login/<br>\n";
}

// 3. Verificar archivos del sistema de soporte
echo "<h2>📁 3. Verificación de Archivos</h2>\n";
$archivos_necesarios = [
  'Pages/Soporte/index.php' => 'Formulario de soporte',
  'Pages/Soporte/historial.php' => 'Historial de tickets',
  'models/SoporteTicket.php' => 'Clase de soporte',
  'config/email_soporte.php' => 'Configuración de emails'
];

foreach ($archivos_necesarios as $archivo => $descripcion) {
  if (file_exists($archivo)) {
    echo "✅ {$descripcion}: {$archivo}<br>\n";
  } else {
    echo "❌ {$descripcion}: {$archivo} - <strong>NO ENCONTRADO</strong><br>\n";
  }
}

// 4. Verificar base de datos
echo "<h2>🗄️ 4. Verificación de Base de Datos</h2>\n";
try {
  require_once 'models/SoporteTicket.php';
  echo "✅ Clase SoporteTicket cargada<br>\n";

  $ticket = new SoporteTicket();
  echo "✅ Instancia de SoporteTicket creada<br>\n";

  // Probar conexión básica
  $reflection = new ReflectionClass($ticket);
  $property = $reflection->getProperty('conexion');
  $property->setAccessible(true);
  $conexion = $property->getValue($ticket);

  if ($conexion && $conexion->ping()) {
    echo "✅ Conexión a base de datos activa<br>\n";
  } else {
    echo "❌ Problema con la conexión a base de datos<br>\n";
  }
} catch (Exception $e) {
  echo "❌ Error con la base de datos: " . $e->getMessage() . "<br>\n";
}

// 5. Verificar configuración de emails
echo "<h2>📧 5. Verificación de Configuración de Emails</h2>\n";
try {
  require_once 'config/email_soporte.php';
  echo "✅ Configuración de emails cargada<br>\n";
  echo "📧 Emails BCC: " . implode(', ', EMAILS_SOPORTE_BCC) . "<br>\n";
  echo "📮 SMTP Host: " . SMTP_CONFIG['host'] . ":" . SMTP_CONFIG['port'] . "<br>\n";
  echo "👤 Usuario SMTP: " . SMTP_CONFIG['username'] . "<br>\n";
} catch (Exception $e) {
  echo "❌ Error con configuración de emails: " . $e->getMessage() . "<br>\n";
}

// 6. Enlaces de prueba
echo "<h2>🔗 6. Enlaces de Prueba</h2>\n";
echo "<a href='Pages/Login/'>🔐 Ir a Login</a><br>\n";
echo "<a href='Pages/Soporte/'>🎧 Ir a Soporte</a><br>\n";
echo "<a href='Pages/Soporte/historial.php'>📋 Ir a Historial</a><br>\n";
echo "<a href='test_email_soporte.php'>🧪 Probar Emails</a><br>\n";

// 7. Información del servidor
echo "<h2>🖥️ 7. Información del Servidor</h2>\n";
echo "🐘 PHP Version: " . PHP_VERSION . "<br>\n";
echo "🌐 SERVER_NAME: " . ($_SERVER['SERVER_NAME'] ?? 'NO DEFINIDO') . "<br>\n";
echo "📂 DOCUMENT_ROOT: " . ($_SERVER['DOCUMENT_ROOT'] ?? 'NO DEFINIDO') . "<br>\n";
echo "🎯 REQUEST_URI: " . ($_SERVER['REQUEST_URI'] ?? 'NO DEFINIDO') . "<br>\n";

echo "<hr>\n";
echo "<h2>📝 Resumen del Diagnóstico</h2>\n";

if (!isset($_SESSION['user_id'])) {
  echo "<div style='background: #f8d7da; padding: 15px; border: 1px solid #f5c6cb; border-radius: 5px;'>\n";
  echo "<h3>⚠️ Problema Principal Identificado</h3>\n";
  echo "<p><strong>El usuario no está logueado.</strong></p>\n";
  echo "<p>Para acceder al sistema de soporte, primero debes:</p>\n";
  echo "<ol>\n";
  echo "<li>Ir a <a href='Pages/Login/'>la página de login</a></li>\n";
  echo "<li>Iniciar sesión con tus credenciales</li>\n";
  echo "<li>Luego acceder al <a href='Pages/Soporte/'>formulario de soporte</a></li>\n";
  echo "</ol>\n";
  echo "</div>\n";
} else {
  echo "<div style='background: #d4edda; padding: 15px; border: 1px solid #c3e6cb; border-radius: 5px;'>\n";
  echo "<h3>✅ Sistema Operativo</h3>\n";
  echo "<p>El usuario está logueado y el sistema debería funcionar correctamente.</p>\n";
  echo "<p><a href='Pages/Soporte/' style='background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>🎧 Acceder al Soporte</a></p>\n";
  echo "</div>\n";
}

echo "<br><small>Diagnóstico generado el " . date('Y-m-d H:i:s') . "</small>\n";
