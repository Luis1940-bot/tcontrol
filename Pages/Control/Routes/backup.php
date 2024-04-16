<?php
require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
$file_path = BASE_DIR . '/Pages/Control/TXT/bckup.txt';
// echo $file_path . '<br>';
// include('datos.php');


// Obtener el objeto desde la solicitud POST
$data = json_decode(file_get_contents('php://input'), true);

if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
    // Manejar errores de decodificación JSON
    error_log('Error al decodificar JSON: ' . json_last_error_msg());
    http_response_code(400); // Bad Request
    exit;
}

// Convertir el objeto a formato de cadena
$data_string = json_encode($data, JSON_PRETTY_PRINT);;

if ($data_string === false) {
    // Manejar errores de codificación JSON
    error_log('Error al codificar JSON: ' . json_last_error_msg());
    http_response_code(500); // Internal Server Error
    exit;
}

// Borrar todo el contenido del archivo antes de escribir
file_put_contents($file_path, '');

if (file_put_contents($file_path, $data_string . PHP_EOL, FILE_APPEND | LOCK_EX ) === false) {
    // Manejar errores de escritura en el archivo
    error_log('Error al escribir en el archivo: ' . error_get_last()['message']);
    http_response_code(500); // Internal Server Error
    exit;
}

// Respuesta al cliente
header('Content-Type: application/json');
echo json_encode(array('message' => 'Archivo actualizado correctamente'));

?>