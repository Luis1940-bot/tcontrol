<?php
// Diagnóstico final - verificar que el problema esté resuelto
session_start();
ini_set('display_errors', '1');
error_reporting(E_ALL);

require_once dirname(dirname(__DIR__)) . '/config.php';

echo "<h1>🎯 Diagnóstico Final - Estado de la Sesión</h1>";

echo "<h2>📋 Información de Sesión:</h2>";
echo "<div style='background: #f0f0f0; padding: 10px; margin: 10px 0;'>";
echo "<strong>Session ID:</strong> " . session_id() . "<br>";
echo "<strong>Tiempo actual:</strong> " . date('Y-m-d H:i:s', time()) . " (" . time() . ")<br>";

if (isset($_SESSION['last_activity'])) {
  $diff = time() - $_SESSION['last_activity'];
  echo "<strong>Last Activity:</strong> " . date('Y-m-d H:i:s', $_SESSION['last_activity']) . " (" . $_SESSION['last_activity'] . ")<br>";
  echo "<strong>Diferencia:</strong> " . $diff . " segundos (" . round($diff / 60, 1) . " minutos)<br>";

  if ($diff > 43200) {
    echo "<span style='color: red;'>❌ Sesión EXPIRADA (más de 12 horas)</span><br>";
  } else {
    echo "<span style='color: green;'>✅ Sesión VÁLIDA</span><br>";
  }
} else {
  echo "<span style='color: orange;'>⚠️ No hay last_activity - se establecerá automáticamente</span><br>";
}

echo "</div>";

echo "<h2>🔐 Estado de Autenticación:</h2>";
echo "<div style='background: #f0f0f0; padding: 10px; margin: 10px 0;'>";

if (isset($_SESSION['login_sso']['email'])) {
  echo "<span style='color: green;'>✅ Usuario logueado: " . htmlspecialchars($_SESSION['login_sso']['email']) . "</span><br>";
} else {
  echo "<span style='color: red;'>❌ Usuario NO logueado</span><br>";
}

if (isset($_SESSION['login_sso']['sso'])) {
  echo "<span style='color: green;'>✅ SSO válido: " . htmlspecialchars($_SESSION['login_sso']['sso']) . "</span><br>";
} else {
  echo "<span style='color: red;'>❌ SSO no válido</span><br>";
}

echo "</div>";

echo "<h2>🧪 Predicción de Comportamiento:</h2>";
echo "<div style='background: #e7f3ff; padding: 10px; margin: 10px 0; border-left: 4px solid #2196F3;'>";

$will_redirect = false;
$reason = "";

if (!isset($_SESSION['login_sso']['email'])) {
  $will_redirect = true;
  $reason = "No hay email en la sesión";
} else if (isset($_SESSION['last_activity'])) {
  $diff = time() - $_SESSION['last_activity'];
  if ($diff > 43200) {
    $will_redirect = true;
    $reason = "Sesión expirada (más de 12 horas de inactividad)";
  }
}

if ($will_redirect) {
  echo "<span style='color: red;'>❌ index.php VA A REDIRIGIR</span><br>";
  echo "<strong>Razón:</strong> $reason<br>";
} else {
  echo "<span style='color: green;'>✅ index.php DEBERÍA FUNCIONAR CORRECTAMENTE</span><br>";
}

echo "</div>";

echo "<h2>🔗 Enlaces de Prueba:</h2>";
echo "<ul>";
echo "<li><a href='index.php' target='_blank'>🎯 Probar index.php AHORA</a></li>";
echo "<li><a href='test_minimal.php'>test_minimal.php (referencia que funciona)</a></li>";
echo "<li><a href='" . BASE_URL . "/Pages/Login/index.php'>Página de Login (si necesitas reloguearte)</a></li>";
echo "</ul>";

echo "<h2>🔧 Acciones de Reparación:</h2>";
echo "<div style='background: #e8f5e8; padding: 10px; margin: 10px 0; border-left: 4px solid #4caf50;'>";
echo "<p><a href='?fix_session=1'>🔄 Reparar sesión (establecer last_activity)</a></p>";

if (isset($_GET['fix_session'])) {
  $_SESSION['last_activity'] = time();
  echo "<p style='color: green;'>✅ Sesión reparada - last_activity establecido</p>";
  echo "<p><a href='index.php'>🎯 Probar index.php después de la reparación</a></p>";
}

echo "</div>";
?>

<!DOCTYPE html>
<html>

<head>
  <title>Diagnóstico Final</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
    }
  </style>
</head>

<body>
  <p><em>Diagnóstico completado - <?= date('Y-m-d H:i:s') ?></em></p>
</body>

</html>