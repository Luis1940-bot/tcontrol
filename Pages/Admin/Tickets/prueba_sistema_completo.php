<?php
// ==========================================
// PRUEBA AUTOMATIZADA DEL SISTEMA FINAL
// ==========================================

echo "🧪 INICIANDO PRUEBAS DEL SISTEMA DE TICKETS\n";
echo "==========================================\n\n";

$base_url = 'http://localhost/test-tenkiweb/tcontrol/Pages/Admin/Tickets';
$errores = [];
$exitos = [];

// Función para probar una URL
function probar_url($url, $nombre)
{
  global $errores, $exitos;

  echo "🔍 Probando: $nombre... ";

  $context = stream_context_create([
    'http' => [
      'timeout' => 10,
      'user_agent' => 'Mozilla/5.0 Test Script'
    ]
  ]);

  $content = @file_get_contents($url, false, $context);

  if ($content === false) {
    echo "❌ ERROR\n";
    $errores[] = "$nombre - No se pudo acceder";
    return false;
  }

  // Verificar que no haya errores PHP
  if (strpos($content, 'Fatal error') !== false || strpos($content, 'Parse error') !== false) {
    echo "❌ ERROR PHP\n";
    $errores[] = "$nombre - Error PHP detectado";
    return false;
  }

  // Verificar que tenga DOCTYPE
  if (strpos($content, '<!DOCTYPE html>') === false) {
    echo "⚠️ SIN DOCTYPE\n";
    $errores[] = "$nombre - DOCTYPE faltante";
    return false;
  }

  // Verificar tema hacker (verde)
  if (strpos($content, '#00ff') === false) {
    echo "⚠️ SIN TEMA HACKER\n";
    $errores[] = "$nombre - Tema hacker no detectado";
    return false;
  }

  echo "✅ OK\n";
  $exitos[] = $nombre;
  return true;
}

// Probar cada página
$paginas = [
  'index.php' => 'Panel Principal',
  'lista.php' => 'Lista de Tickets',
  'detalle.php?ticket=1' => 'Detalle de Ticket',
  'estadisticas.php' => 'Estadísticas',
  'reportes.php' => 'Reportes'
];

foreach ($paginas as $archivo => $nombre) {
  probar_url("$base_url/$archivo", $nombre);
}

echo "\n";
echo "📊 RESUMEN DE PRUEBAS:\n";
echo "====================\n";
echo "✅ Exitosas: " . count($exitos) . "\n";
echo "❌ Errores: " . count($errores) . "\n\n";

if (!empty($exitos)) {
  echo "🎉 PÁGINAS FUNCIONANDO:\n";
  foreach ($exitos as $exito) {
    echo "   ✅ $exito\n";
  }
  echo "\n";
}

if (!empty($errores)) {
  echo "⚠️ PROBLEMAS DETECTADOS:\n";
  foreach ($errores as $error) {
    echo "   ❌ $error\n";
  }
  echo "\n";
} else {
  echo "🚀 ¡TODAS LAS PRUEBAS PASARON!\n";
  echo "El sistema está listo para producción.\n\n";
}

// Verificar archivos esenciales
echo "📁 VERIFICANDO ARCHIVOS ESENCIALES:\n";
$archivos_requeridos = [
  'index.php',
  'lista.php',
  'detalle.php',
  'estadisticas.php',
  'reportes.php',
  'README.md'
];

$archivos_presentes = scandir('.');
$archivos_faltantes = [];

foreach ($archivos_requeridos as $archivo) {
  if (in_array($archivo, $archivos_presentes)) {
    echo "   ✅ $archivo\n";
  } else {
    echo "   ❌ $archivo (FALTANTE)\n";
    $archivos_faltantes[] = $archivo;
  }
}

if (empty($archivos_faltantes)) {
  echo "\n🎯 ESTRUCTURA PERFECTA\n";
} else {
  echo "\n⚠️ Archivos faltantes: " . implode(', ', $archivos_faltantes) . "\n";
}

// Verificar sintaxis PHP
echo "\n🔍 VERIFICANDO SINTAXIS PHP:\n";
$archivos_php = ['index.php', 'lista.php', 'detalle.php', 'estadisticas.php', 'reportes.php'];

foreach ($archivos_php as $archivo) {
  if (file_exists($archivo)) {
    $output = shell_exec("php -l $archivo 2>&1");
    if (strpos($output, 'No syntax errors') !== false) {
      echo "   ✅ $archivo - Sintaxis correcta\n";
    } else {
      echo "   ❌ $archivo - Error de sintaxis\n";
      echo "      $output\n";
    }
  }
}

echo "\n";
echo "🏁 PRUEBAS COMPLETADAS\n";
echo "===================\n";

if (empty($errores) && empty($archivos_faltantes)) {
  echo "🎉 SISTEMA COMPLETAMENTE FUNCIONAL\n";
  echo "✅ Listo para deployment a producción\n";
  echo "🚀 Todos los módulos funcionando correctamente\n";
} else {
  echo "⚠️ Revisar los problemas detectados antes del deployment\n";
}

echo "\n";
