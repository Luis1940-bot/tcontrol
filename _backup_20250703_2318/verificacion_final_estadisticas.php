<?php
// Test final de verificación de estadísticas

header('Content-Type: text/plain; charset=UTF-8');

echo "=== VERIFICACIÓN FINAL DE ESTADÍSTICAS ===\n\n";

// Test de acceso a la página
$url = 'http://localhost/test-tenkiweb/tcontrol/Pages/Admin/Tickets/index.php';
echo "Verificando acceso a: $url\n\n";

// Usar cURL para obtener la página y analizar el contenido
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
$content = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Código HTTP: $http_code\n";

if ($http_code === 200 && $content) {
  echo "✅ Página cargada exitosamente\n\n";

  // Buscar elementos específicos
  if (strpos($content, 'stats-container') !== false) {
    echo "✅ Contenedor de estadísticas encontrado\n";
  } else {
    echo "❌ Contenedor de estadísticas NO encontrado\n";
  }

  if (strpos($content, 'stat-card') !== false) {
    echo "✅ Tarjetas de estadísticas encontradas\n";
  } else {
    echo "❌ Tarjetas de estadísticas NO encontradas\n";
  }

  if (strpos($content, 'Total Tickets') !== false) {
    echo "✅ Texto 'Total Tickets' encontrado\n";
  } else {
    echo "❌ Texto 'Total Tickets' NO encontrado\n";
  }

  // Buscar DOCTYPE
  if (strpos($content, '<!DOCTYPE html>') !== false) {
    echo "✅ DOCTYPE HTML5 presente\n";
  } else {
    echo "❌ DOCTYPE HTML5 faltante\n";
  }

  // Verificar que no haya referencias a archivos inexistentes
  if (strpos($content, 'estadisticas.php') !== false) {
    echo "❌ Todavía hay referencias a estadisticas.php\n";
  } else {
    echo "✅ No hay referencias a estadisticas.php\n";
  }

  // Buscar CSP header
  if (strpos($content, 'Content-Security-Policy') !== false) {
    echo "✅ CSP header presente\n";
  } else {
    echo "ℹ️ CSP header no visible en contenido\n";
  }
} else {
  echo "❌ Error al cargar la página\n";
  echo "Contenido recibido: " . substr($content, 0, 200) . "...\n";
}

echo "\n=== FIN VERIFICACIÓN ===\n";
