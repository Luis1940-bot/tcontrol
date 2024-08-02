<?php
require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
if (isset($_SESSION['timezone'])) {
    date_default_timezone_set($_SESSION['timezone']);
} else {
    date_default_timezone_set('America/Argentina/Buenos_Aires');
}

// Obtener el objeto desde la solicitud POST
$data = json_decode(file_get_contents('php://input'), true);

if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
    // Manejar errores de decodificación JSON
    error_log('Error al decodificar JSON: ' . json_last_error_msg());
    http_response_code(400); // Bad Request
    echo json_encode(array('message' => 'Error al decodificar JSON'));
    exit;
}

// Obtener plant y notes del objeto POST
$plant = isset($data['plant']) ? $data['plant'] : '';
$notes = isset($data['notes']) ? $data['notes'] : '';

// Verificar que se haya proporcionado un nombre de planta
if (empty($plant)) {
    http_response_code(400); // Bad Request
    echo json_encode(array('message' => 'No se proporcionó un nombre de planta'));
    exit;
}

$maxFileSize = 1048576; // 1 MB
// Construir la ruta del archivo
$file_path = BASE_DIR . '/Pages/Control/TXT/' . $plant . '/';
if (!file_exists($file_path)) {
    mkdir($file_path, 0777, true);
}
$file = $file_path . 'backup.txt';

// Verificar el tamaño del archivo
if (file_exists($file) && filesize($file) > $maxFileSize) {
    // Opcional: puedes renombrar el archivo actual y crear uno nuevo
    $archivedFile = $file_path . 'backup_' . date('Ymd_His') . '.txt';
    if (!rename($file, $archivedFile)) {
        error_log('Error al renombrar el archivo: ' . error_get_last()['message']);
        http_response_code(500); // Internal Server Error
        echo json_encode(array('message' => 'Error al renombrar el archivo'));
        exit;
    }
}

// Escribir las notas en el archivo
if (file_put_contents($file, $notes . PHP_EOL, FILE_APPEND | LOCK_EX) === false) {
    // Manejar errores de escritura en el archivo
    error_log('Error al escribir en el archivo: ' . error_get_last()['message']);
    http_response_code(500); // Internal Server Error
    echo json_encode(array('message' => 'Error al escribir en el archivo'));
    exit;
}

// Respuesta al cliente
header('Content-Type: application/json');
echo json_encode(array('message' => 'Archivo actualizado correctamente'));
?>
