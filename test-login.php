<?php
session_start();

// Simular sesión de login para pruebas
$_SESSION['login_sso'] = [
  'email' => 'test@tenkiweb.com',
  'sso' => 'test_sso_token'
];

echo "Sesión simulada creada. Redirigiendo al index...\n";
header("Location: /");
exit();
