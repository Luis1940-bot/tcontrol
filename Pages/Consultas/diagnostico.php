<?php
// Diagnóstico simple - sin includes
require_once dirname(dirname(__DIR__)) . '/config.php';
startSecureSession();
$nonce = setSecurityHeaders();

// Verificar sesión básica
if (!isset($_SESSION['login_sso']) || !is_array($_SESSION['login_sso'])) {
  header("Location: " . BASE_URL . "/Pages/Login/index.php");
  exit;
}

$sso = $_SESSION['login_sso']['sso'] ?? null;
$email = $_SESSION['login_sso']['email'] ?? null;

if ($sso === null || $sso === 's_sso' || $email === null) {
  header("Location: " . BASE_URL . "/Pages/Login/index.php");
  exit;
}

define('SSO', $sso);
define('EMAIL', $email);
?>
<!DOCTYPE html>
<html>

<head>
  <meta charset='UTF-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <title>Consultas - Diagnóstico</title>
  <link rel='shortcut icon' type='image/x-icon' href='<?= BASE_URL ?>/assets/img/favicon.ico'>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
    }

    .success {
      color: green;
    }

    .error {
      color: red;
    }
  </style>
</head>

<body>
  <h1>Diagnóstico de Consultas</h1>
  <p class="success">✅ DOCTYPE correcto</p>
  <p class="success">✅ Modo estándar activo</p>
  <p>BASE_URL: <?= BASE_URL ?></p>
  <p>SSO: <?= SSO ?></p>
  <p>EMAIL: <?= EMAIL ?></p>

  <script>
    console.log('Modo de documento:', document.compatMode);
    console.log('DOCTYPE:', document.doctype ? 'Presente' : 'Ausente');
    document.documentElement.lang = 'es';
  </script>
</body>

</html>