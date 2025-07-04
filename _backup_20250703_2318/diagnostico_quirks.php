<?php
// ==========================================
// DIAGNÓSTICO QUIRKS - ENCUENTRA EL PROBLEMA
// ==========================================

// Limpiar TODO
while (ob_get_level()) {
  ob_end_clean();
}

header('Content-Type: text/html; charset=UTF-8');

// Función para probar archivos incluidos
function test_include($file)
{
  ob_start();
  $error = false;
  try {
    include_once $file;
    $output = ob_get_contents();
    if (!empty($output)) {
      $error = "SALIDA DETECTADA: " . strlen($output) . " bytes";
    }
  } catch (Exception $e) {
    $error = "ERROR: " . $e->getMessage();
  }
  ob_end_clean();
  return $error;
}

// Archivos a probar
$archivos_problema = [
  'config.php' => dirname(dirname(dirname(__DIR__))) . '/config.php',
  'ErrorLogger.php' => dirname(dirname(dirname(__DIR__))) . '/ErrorLogger.php',
  'datos_base.php' => dirname(dirname(dirname(__DIR__))) . '/Routes/datos_base.php'
];

?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🔍 Diagnóstico Anti-Quirks</title>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔍</text></svg>">
  <style>
    body {
      background: #0a0a0a;
      color: #00ff41;
      font-family: 'Courier New', monospace;
      padding: 20px;
    }

    .success {
      background: #1a3a1a;
      border: 1px solid #00ff41;
      padding: 10px;
      margin: 10px 0;
      border-radius: 5px;
    }

    .error {
      background: #3a1a1a;
      border: 1px solid #ff4444;
      padding: 10px;
      margin: 10px 0;
      border-radius: 5px;
      color: #ff4444;
    }

    .warning {
      background: #3a3a1a;
      border: 1px solid #ffaa00;
      padding: 10px;
      margin: 10px 0;
      border-radius: 5px;
      color: #ffaa00;
    }

    .info {
      background: #1a2a3a;
      border: 1px solid #00aaff;
      padding: 10px;
      margin: 10px 0;
      border-radius: 5px;
      color: #00aaff;
    }

    h1,
    h2 {
      color: #00ff41;
      border-bottom: 2px solid #00ff41;
      padding-bottom: 10px;
    }
  </style>
</head>

<body>
  <h1>🔍 Diagnóstico Anti-Quirks</h1>

  <div class="info">
    <strong>🧪 Estado de esta página:</strong><br>
    document.compatMode: <span id="compat-mode">Verificando...</span>
  </div>

  <h2>📁 Análisis de Archivos Incluidos</h2>

  <?php foreach ($archivos_problema as $nombre => $ruta): ?>
    <div style="background: #1a1a1a; border: 1px solid #333; padding: 15px; margin: 10px 0; border-radius: 8px;">
      <h3 style="color: #00ff41; margin: 0 0 10px 0;">📄 <?= $nombre ?></h3>
      <p style="color: #ccc; margin: 5px 0;"><strong>Ruta:</strong> <?= $ruta ?></p>

      <?php if (file_exists($ruta)): ?>
        <div class="success">✅ Archivo existe</div>

        <?php
        $resultado = test_include($ruta);
        if ($resultado === false):
        ?>
          <div class="success">✅ No genera salida problemática</div>
        <?php else: ?>
          <div class="error">❌ PROBLEMA DETECTADO: <?= $resultado ?></div>

          <!-- Mostrar primeras líneas del archivo -->
          <details style="margin-top: 10px;">
            <summary style="color: #ffaa00; cursor: pointer;">Ver primeras líneas del archivo</summary>
            <pre style="background: #000; padding: 10px; border-radius: 5px; font-size: 0.8em; overflow-x: auto; margin-top: 10px;"><?php
                                                                                                                                    $lines = file($ruta);
                                                                                                                                    echo htmlspecialchars(implode('', array_slice($lines, 0, 10)));
                                                                                                                                    ?></pre>
          </details>
        <?php endif; ?>

      <?php else: ?>
        <div class="error">❌ Archivo no encontrado</div>
      <?php endif; ?>
    </div>
  <?php endforeach; ?>

  <h2>🧪 Pruebas de Headers</h2>

  <div style="background: #1a1a1a; border: 1px solid #333; padding: 15px; border-radius: 8px;">
    <h3 style="color: #00ff41; margin: 0 0 10px 0;">📡 Headers Enviados</h3>
    <?php
    $headers = headers_list();
    if (empty($headers)):
    ?>
      <div class="warning">⚠️ No se detectaron headers enviados</div>
    <?php else: ?>
      <div class="info">📋 Headers detectados:</div>
      <ul style="color: #ccc;">
        <?php foreach ($headers as $header): ?>
          <li><code style="background: #000; padding: 2px 5px; border-radius: 3px;"><?= htmlspecialchars($header) ?></code></li>
        <?php endforeach; ?>
      </ul>
    <?php endif; ?>
  </div>

  <h2>💡 Recomendaciones</h2>

  <div style="background: #1a3a1a; border: 2px solid #00ff41; padding: 20px; border-radius: 8px;">
    <h3 style="color: #00ff41; margin: 0 0 15px 0;">🎯 Soluciones Propuestas</h3>

    <div style="margin-bottom: 15px;">
      <strong style="color: #00ff41;">1. Usar versiones simplificadas:</strong>
      <ul style="color: #ccc; margin-top: 5px;">
        <li><a href="test_simple.php" style="color: #00aaff;">test_simple.php</a> - Panel sin includes problemáticos</li>
        <li><a href="lista_simple.php" style="color: #00aaff;">lista_simple.php</a> - Lista simplificada</li>
        <li><a href="detalle_simple.php?ticket=TK-001" style="color: #00aaff;">detalle_simple.php</a> - Detalle simplificado</li>
      </ul>
    </div>

    <div style="margin-bottom: 15px;">
      <strong style="color: #00ff41;">2. Verificar archivos problemáticos:</strong>
      <p style="color: #ccc; margin-top: 5px;">
        Los archivos que generen salida antes del DOCTYPE deben ser corregidos.
        Buscar echo, print, espacios o saltos de línea antes de &lt;?php
      </p>
    </div>

    <div>
      <strong style="color: #00ff41;">3. Implementar la solución robusta:</strong>
      <p style="color: #ccc; margin-top: 5px;">
        Usar ob_start(), ob_end_clean() y headers apropiados antes de cualquier include.
      </p>
    </div>
  </div>

  <script>
    // Mostrar modo de compatibilidad
    document.addEventListener('DOMContentLoaded', function() {
      const mode = document.compatMode;
      const element = document.getElementById('compat-mode');

      if (mode === 'CSS1Compat') {
        element.textContent = '✅ CSS1Compat (MODO ESTÁNDAR)';
        element.style.color = '#00ff41';
      } else {
        element.textContent = '❌ BackCompat (MODO QUIRKS)';
        element.style.color = '#ff4444';
      }
    });
  </script>
</body>

</html>