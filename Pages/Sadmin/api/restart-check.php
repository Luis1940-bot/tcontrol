<?php
// ruta: /Pages/Sadmin/api/restart-check.php

error_reporting(0);
ini_set('display_errors', 0);
session_start();

$allowedOrigin = 'https://tenkiweb.com';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  header("Access-Control-Allow-Origin: $allowedOrigin");
  header("Access-Control-Allow-Credentials: true");
  header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type");
  http_response_code(204);
  exit();
}

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: $allowedOrigin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// $flagFile = __DIR__ . '/.reload-flag';
$flagFile = '/home/customer/www/sadmin.tenkiweb.com/public_html/sadmin/public/api/recargaForzada/.reload-flag';

$shouldReload = file_exists($flagFile);

echo json_encode(['restart' => $shouldReload]);

if ($shouldReload) {
  unlink($flagFile);
}
