<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");

require_once dirname(dirname(__DIR__)) . '/ErrorLogger.php';
ErrorLogger::initialize(dirname(dirname(__DIR__)) . '/logs/error.log');

if (isset($_SESSION['timezone']) && is_string($_SESSION['timezone'])) {
  date_default_timezone_set($_SESSION['timezone']);
} else {
  date_default_timezone_set('America/Argentina/Buenos_Aires');
}

require_once dirname(dirname(__DIR__)) . '/config.php'; // Define IMAGE, BASE_DIR, etc.

$responses = [];

$images = $_FILES['images'] ?? null;
$fileNames = $_POST['fileName'] ?? [];
$extensions = $_POST['extension'] ?? [];
$carpetas = $_POST['carpeta'] ?? [];
$plants = $_POST['plant'] ?? [];

if (!isset($images) || !isset($images['tmp_name']) || !is_array($images['tmp_name'])) {
  error_log("No se recibieron archivos válidos.");
  echo json_encode(['success' => false, 'message' => 'No se recibieron imágenes.']);
  exit;
}

$total = count($images['tmp_name']);

for ($i = 0; $i < $total; $i++) {
  $tmpFile = $images['tmp_name'][$i];
  $originalName = $images['name'][$i];
  $error = $images['error'][$i];

  $fileName = $fileNames[$i] ?? $originalName;
  $extension = $extensions[$i] ?? pathinfo($fileName, PATHINFO_EXTENSION);
  $carpeta = $carpetas[$i] ?? '';
  $plant = $plants[$i] ?? '';

  $elemento = $i + 1;

  if ($error !== UPLOAD_ERR_OK || !file_exists($tmpFile)) {
    $responses[] = ['success' => false, 'message' => "Elemento $elemento: Error al subir archivo."];
    continue;
  }

  $imageData = file_get_contents($tmpFile);
  if ($imageData === false) {
    error_log("❌ No se pudo leer el archivo temporal.");
    continue;
  }
  $imageSize = strlen($imageData);

  $rutaFinal = rtrim(IMAGE . $carpeta . $plant, '/') . '/';
  if (!file_exists($rutaFinal)) {
    mkdir($rutaFinal, 0777, true);
  }
  $rutaImagen = $rutaFinal . $fileName;

  // Procesar imagen
  if ($imageSize > 100 * 1024) {
    $image = @imagecreatefromstring($imageData);
    if (!$image) {
      error_log("Elemento $elemento: imagen inválida.");
      $responses[] = ['success' => false, 'message' => "Elemento $elemento: imagen inválida."];
      error_log("Tipo MIME: " . mime_content_type($tmpFile));
      error_log("Tamaño: " . strlen($imageData) . " bytes");
      continue;
    }

    $newWidth = 400;
    $aspectRatio = imagesx($image) / imagesy($image);
    $newHeight = $aspectRatio > 1 ? $newWidth / $aspectRatio : 400;
    $newWidth = $aspectRatio > 1 ? 400 : $newHeight * $aspectRatio;

    $newWidth = max(1, (int) round($newWidth));
    $newHeight = max(1, (int) round($newHeight));

    $resizedImage = imagecreatetruecolor($newWidth, $newHeight);
    imagecopyresampled($resizedImage, $image, 0, 0, 0, 0, $newWidth, $newHeight, imagesx($image), imagesy($image));

    ob_start();
    imagejpeg($resizedImage, null, 100);
    $resizedData = ob_get_clean();
    // error_log('rutaImagen:  ' . $rutaImagen . 'resizedData:  ' . $resizedData);
    file_put_contents($rutaImagen, $resizedData);

    imagedestroy($image);
    imagedestroy($resizedImage);

    $responses[] = ['success' => true, 'message' => "Elemento $elemento: imagen redimensionada y guardada."];
  } else {
    move_uploaded_file($tmpFile, $rutaImagen);
    $responses[] = ['success' => true, 'message' => "Elemento $elemento: imagen guardada sin redimensionar."];
  }
}

echo json_encode(['success' => true, 'data' => $responses]);
exit;
