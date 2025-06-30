<?php
// Versión ultra simplificada de index.php para identificar el problema
ini_set('display_errors', '1');
error_reporting(E_ALL);

session_start();

// Configuración mínima
require_once dirname(dirname(__DIR__)) . '/config.php';

// Simular sesión válida para evitar redirecciones
if (!isset($_SESSION['login_sso']['email'])) {
  $_SESSION['login_sso']['email'] = 'test@example.com';
  $_SESSION['login_sso']['sso'] = 'test_sso';
}

define('EMAIL', $_SESSION['login_sso']['email']);
define('SSO', $_SESSION['login_sso']['sso']);

$nonce = base64_encode(random_bytes(16));
?>
<!DOCTYPE html>
<html>

<head>
  <meta charset='UTF-8'>
  <title>Tenki - Versión Simplificada</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
      background: #f0f0f0;
    }

    .test {
      background: white;
      padding: 20px;
      margin: 10px 0;
      border-radius: 5px;
    }

    .success {
      border-left: 4px solid #4caf50;
    }

    .info {
      border-left: 4px solid #2196F3;
    }
  </style>
</head>

<body>
  <div class="test success">
    <h1>✅ Página Simplificada Cargada</h1>
    <p>Si ves este contenido, el problema no está en la lógica básica de PHP.</p>
  </div>

  <div class="test info">
    <h2>🧪 Probando Includes Uno por Uno</h2>

    <h3>1. Header</h3>
    <?php
    try {
      echo "<p>Incluyendo header.php...</p>";
      include('../../includes/molecules/header.php');
      echo "<p>✅ Header incluido exitosamente</p>";
    } catch (Exception $e) {
      echo "<p>❌ Error en header: " . $e->getMessage() . "</p>";
    }
    ?>

    <h3>2. Encabezado</h3>
    <?php
    try {
      echo "<p>Incluyendo encabezado.php...</p>";
      include('../../includes/molecules/encabezado.php');
      echo "<p>✅ Encabezado incluido exitosamente</p>";
    } catch (Exception $e) {
      echo "<p>❌ Error en encabezado: " . $e->getMessage() . "</p>";
    }
    ?>

    <h3>3. WichControl</h3>
    <?php
    try {
      echo "<p>Incluyendo wichControl.php...</p>";
      include('../../includes/molecules/wichControl.php');
      echo "<p>✅ WichControl incluido exitosamente</p>";
    } catch (Exception $e) {
      echo "<p>❌ Error en wichControl: " . $e->getMessage() . "</p>";
    }
    ?>
  </div>

  <div class="test info">
    <h2>📋 Información del Sistema</h2>
    <p><strong>BASE_URL:</strong> <?= htmlspecialchars(BASE_URL) ?></p>
    <p><strong>EMAIL:</strong> <?= htmlspecialchars(EMAIL) ?></p>
    <p><strong>SSO:</strong> <?= htmlspecialchars(SSO) ?></p>
    <p><strong>Nonce:</strong> <?= htmlspecialchars($nonce) ?></p>
  </div>

  <div class="test info">
    <h2>🔗 Enlaces de Comparación</h2>
    <ul>
      <li><a href="index.php">index.php original (problemático)</a></li>
      <li><a href="test_minimal.php">test_minimal.php (funciona)</a></li>
      <li><a href="debug_index_exact.php">debug_index_exact.php (con logs)</a></li>
    </ul>
  </div>
</body>

</html>