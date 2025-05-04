<?php
header('Content-Type: application/json; charset=utf-8');

// Log manual
file_put_contents('/tmp/guardar_remoto.log', "==> Entró " . date('c') . "\n", FILE_APPEND);

// Solo aceptar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['success' => false, 'message' => 'Método no permitido']);
  exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$archivo = $input['archivo'] ?? null;
$contenido = $input['contenido'] ?? null;

if (!$archivo || !is_array($contenido)) {
  http_response_code(400);
  echo json_encode(['success' => false, 'message' => 'Parámetros inválidos']);
  file_put_contents('/tmp/guardar_remoto.log', "❌ Parámetros inválidos\n", FILE_APPEND);
  exit;
}

// Ruta completa del archivo
$destino = __DIR__ . '/../' . ltrim($archivo, '/');
file_put_contents($destino, json_encode($contenido, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

// error_log("Recibido archivo: $archivo");
// error_log("Contenido: " . json_encode($contenido));

if (!is_writable(dirname($destino))) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'Directorio no escribible']);
  file_put_contents('/tmp/guardar_remoto.log', "❌ Directorio no escribible\n", FILE_APPEND);
  exit;
}

// Guardar archivo
file_put_contents($destino, json_encode($contenido, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
file_put_contents('/tmp/guardar_remoto.log', "✅ Guardado exitoso\n", FILE_APPEND);

echo json_encode(['success' => true]);
