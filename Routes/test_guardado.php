<?php
header('Content-Type: application/json; charset=utf-8');

// Ruta de test temporal
$archivoTest = dirname(__DIR__) . '/models/test_guardado.json';
$contenidoTest = ['mensaje' => 'Esto es una prueba', 'timestamp' => date('c')];

// Intentar guardar el archivo
$exito = file_put_contents($archivoTest, json_encode($contenidoTest, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

if ($exito === false) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'No se pudo guardar el archivo']);
} else {
  echo json_encode(['success' => true, 'archivo' => $archivoTest]);
}
