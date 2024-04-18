<?php
require_once dirname(dirname(dirname(__DIR__))) . '/config.php';

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

// Construir la ruta del archivo
$file_path = BASE_DIR . '/Pages/Control/TXT/' . $plant . '/backup.txt';

// Convertir las notas de nuevo a un formato legible si es necesario
// (Puedes omitir esta parte si no necesitas realizar ninguna acción específica con las notas)
$notes_decoded = json_decode($notes);

if ($notes_decoded === null && json_last_error() !== JSON_ERROR_NONE) {
    // Manejar errores de decodificación JSON
    error_log('Error al decodificar JSON de notas: ' . json_last_error_msg());
    http_response_code(400); // Bad Request
    echo json_encode(array('message' => 'Error al decodificar JSON de notas'));
    exit;
}

file_put_contents($file_path, '');

// Escribir las notas en el archivo
if (file_put_contents($file_path, $notes . PHP_EOL, FILE_APPEND | LOCK_EX ) === false) {
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
