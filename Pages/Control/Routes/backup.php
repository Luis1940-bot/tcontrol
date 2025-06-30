<?php
require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
/** @var string $baseDir */
$baseDir = BASE_DIR;
/** 
 * @var array{timezone?: string} $_SESSION 
 */
if (isset($_SESSION['timezone']) && is_string($_SESSION['timezone'])) {
  date_default_timezone_set($_SESSION['timezone']);
} else {
  date_default_timezone_set('America/Argentina/Buenos_Aires');
}

// Obtener el objeto desde la solicitud POST
// $data = json_decode(file_get_contents('php://input'), true);
$dataRaw = file_get_contents('php://input');

if ($dataRaw === false) {
  // Manejo del caso en que no se puede leer el cuerpo de la solicitud
  http_response_code(400);
  echo json_encode(['success' => false, 'message' => 'No se pudo leer la entrada']);
  exit;
}

$data = json_decode($dataRaw, true);

if ($data === null) {
  // Manejo del caso en que JSON es inválido
  http_response_code(400);
  echo json_encode(['success' => false, 'message' => 'JSON no válido']);
  exit;
}


if (json_last_error() !== JSON_ERROR_NONE) {
  // Manejar errores de decodificación JSON
  error_log('Error al decodificar JSON: ' . json_last_error_msg());
  http_response_code(400); // Bad Request
  echo json_encode(['message' => 'Error al decodificar JSON']);
  exit;
}


// Obtener plant y notes del objeto POST
if (is_array($data)) {
  $plant = isset($data['plant']) ? $data['plant'] : '';
  $notes = isset($data['notes']) ? $data['notes'] : '';
} else {
  $plant = '';
  $notes = '';
  error_log('Error: $data no es un array válido.');
}


// Verificar que se haya proporcionado un nombre de planta
if (empty($plant)) {
  http_response_code(400); // Bad Request
  echo json_encode(array('message' => 'No se proporcionó un nombre de planta'));
  exit;
}

$maxFileSize = 1048576; // 1 MB
// Construir la ruta del archivo
// $file_path = $baseDir . '/Pages/Control/TXT/' . (string)$plant . '/';
$plant = is_string($plant) ? $plant : '';
$file_path = $baseDir . '/Pages/Control/TXT/' . $plant . '/';

if (!file_exists($file_path)) {
  mkdir($file_path, 0777, true);
}
$file = $file_path . 'backup.txt';

// Verificar el tamaño del archivo
if (file_exists($file) && filesize($file) > $maxFileSize) {
  // Opcional: puedes renombrar el archivo actual y crear uno nuevo
  $archivedFile = $file_path . 'backup_' . date('Ymd_His') . '.txt';
  if (!rename($file, $archivedFile)) {
    $lastError = error_get_last();
    $errorMessage = $lastError !== null ? $lastError['message'] : 'No se pudo obtener información del error.';
    error_log('Error al renombrar el archivo: ' . $errorMessage);

    http_response_code(500); // Internal Server Error
    echo json_encode(array('message' => 'Error al renombrar el archivo'));
    exit;
  }
}


// Escribir las notas en el archivo
if (!is_string($notes)) {
  $notes = ''; // Asegurar que $notes sea una cadena vacía si no es un string válido
}

if (file_put_contents($file, $notes . PHP_EOL, FILE_APPEND | LOCK_EX) === false) {
  // Obtener el último error, si lo hay
  $lastError = error_get_last();
  $errorMessage = $lastError !== null ? $lastError['message'] : 'No se pudo obtener información del error.';

  error_log('Error al escribir en el archivo: ' . $errorMessage);
  http_response_code(500); // Internal Server Error
  echo json_encode(array('message' => 'Error al escribir en el archivo'));
  exit;
}


// Respuesta al cliente
header('Content-Type: application/json');
echo json_encode(array('message' => 'Archivo actualizado correctamente'));
