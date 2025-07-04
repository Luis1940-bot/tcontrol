<?php
// ==========================================
// DIAGNÓSTICO DE CONFIGURACIÓN DE URLs
// ==========================================
while (ob_get_level()) {
  ob_end_clean();
}

header_remove();
header('Content-Type: text/html; charset=UTF-8');

// Incluir config.php para ver los valores
require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Diagnóstico de URLs</title>
  <style>
    body {
      font-family: 'Courier New', monospace;
      margin: 20px;
      background: #0a0a0a;
      color: #00ff00;
      line-height: 1.6;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .section {
      margin: 20px 0;
      padding: 15px;
      border: 1px solid #00ff00;
      border-radius: 5px;
      background: rgba(0, 255, 0, 0.1);
    }

    .success {
      color: #00ff00;
    }

    .error {
      color: #ff0000;
    }

    .warning {
      color: #ffff00;
    }

    .info {
      color: #00ffff;
    }

    pre {
      background: #1a1a1a;
      padding: 10px;
      border-radius: 3px;
      overflow-x: auto;
    }

    .test-url {
      margin: 10px 0;
      padding: 10px;
      border: 1px solid #333;
      border-radius: 3px;
    }
  </style>
</head>

<body>
  <div class="container">
    <h1>🔍 Diagnóstico de Configuración de URLs</h1>

    <div class="section">
      <h2>1. Variables del Servidor</h2>
      <pre><?php
            echo "HTTP_HOST: " . ($_SERVER['HTTP_HOST'] ?? 'No definido') . "\n";
            echo "SERVER_NAME: " . ($_SERVER['SERVER_NAME'] ?? 'No definido') . "\n";
            echo "REQUEST_URI: " . ($_SERVER['REQUEST_URI'] ?? 'No definido') . "\n";
            echo "SCRIPT_NAME: " . ($_SERVER['SCRIPT_NAME'] ?? 'No definido') . "\n";
            echo "DOCUMENT_ROOT: " . ($_SERVER['DOCUMENT_ROOT'] ?? 'No definido') . "\n";
            echo "HTTPS: " . ($_SERVER['HTTPS'] ?? 'No definido') . "\n";
            echo "SERVER_PORT: " . ($_SERVER['SERVER_PORT'] ?? 'No definido') . "\n";
            ?></pre>
    </div>

    <div class="section">
      <h2>2. Constantes de Configuración</h2>
      <pre><?php
            echo "BASE_URL: " . (defined('BASE_URL') ? BASE_URL : 'No definido') . "\n";
            echo "BASE_DIR: " . (defined('BASE_DIR') ? BASE_DIR : 'No definido') . "\n";
            echo "BASE_PLANOS: " . (defined('BASE_PLANOS') ? BASE_PLANOS : 'No definido') . "\n";
            echo "BASE_IMAGENES: " . (defined('BASE_IMAGENES') ? BASE_IMAGENES : 'No definido') . "\n";
            ?></pre>
    </div>

    <div class="section">
      <h2>3. Detección de Entorno</h2>
      <pre><?php
            echo "isLocalhost(): " . (isLocalhost() ? 'true' : 'false') . "\n";
            echo "Host actual: " . ($_SERVER['HTTP_HOST'] ?? 'CLI') . "\n";
            echo "Ruta del archivo: " . __FILE__ . "\n";
            ?></pre>
    </div>

    <div class="section">
      <h2>4. URLs Correctas Sugeridas</h2>
      <pre><?php
            $currentUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http') . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost');
            $scriptPath = dirname($_SERVER['SCRIPT_NAME'] ?? '');
            $scriptPath = str_replace('/Pages/Admin/Tickets', '', $scriptPath);

            echo "URL base actual: $currentUrl\n";
            echo "Ruta del script: $scriptPath\n";
            echo "URL base sugerida: $currentUrl$scriptPath\n";
            echo "URL CSS sugerida: $currentUrl$scriptPath/assets/css/style.css\n";
            echo "URL imágenes sugerida: $currentUrl$scriptPath/assets/img/\n";
            ?></pre>
    </div>

    <div class="section">
      <h2>5. Test de URLs de Recursos</h2>
      <div id="urlTests">
        <?php
        $testUrls = [
          'BASE_URL + CSS' => BASE_URL . '/assets/css/style.css',
          'Relativa CSS' => '../../../assets/css/style.css',
          'BASE_URL + Logo' => BASE_URL . '/assets/img/logo.png',
          'Relativa Logo' => '../../../assets/img/logo.png'
        ];

        foreach ($testUrls as $name => $url) {
          echo "<div class='test-url'>";
          echo "<strong>$name:</strong> <code>$url</code><br>";
          echo "<span id='test_" . md5($name) . "'>Probando...</span>";
          echo "</div>";
        }
        ?>
      </div>
    </div>

    <div class="section">
      <h2>6. Configuración Recomendada</h2>
      <pre><?php
            $currentHost = $_SERVER['HTTP_HOST'] ?? 'localhost';
            $protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? 'https' : 'http';

            if (strpos($currentHost, 'localhost') !== false || strpos($currentHost, '127.0.0.1') !== false) {
              $suggestedBase = "$protocol://$currentHost/test-tenkiweb/tcontrol";
            } else {
              $suggestedBase = "Mantener configuración actual";
            }

            echo "Para localhost, BASE_URL debería ser:\n";
            echo "$suggestedBase\n\n";
            echo "Esto permitiría que los recursos se carguen desde:\n";
            echo "$suggestedBase/assets/css/style.css\n";
            echo "$suggestedBase/assets/img/logo.png\n";
            ?></pre>
    </div>
  </div>

  <script>
    // Test básico de recursos
    document.addEventListener('DOMContentLoaded', function() {
      console.log('Diagnóstico de URLs cargado');
      console.log('BASE_URL desde PHP:', '<?php echo BASE_URL; ?>');
      console.log('URL actual:', window.location.href);
    });
  </script>
</body>

</html>