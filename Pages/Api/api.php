<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

$clave_secreta = "qV8qI3oT3'lZ7$";
$fecha_actual = 'valor.data.bueno';

function generarToken(string $data, string $clave_secreta): string {
    return hash_hmac('sha256', $data, $clave_secreta);
}

function verificarToken(string $token, string $data, string $clave_secreta): bool {
    $token_generado = hash_hmac('sha256', $data, $clave_secreta);
    return hash_equals($token, $token_generado);
}

function procesar(string $call, string $desde = null, string $hasta = null, string $planta): void {
    try {
        $host = "34.174.211.66"; 
        $user = "uumwldufguaxi";
        $password = "5lvvumrslp0v";
        $dbname = "db5i8ff3wrjzw3";
        $port = 3306;

        // Crear una conexión única
       $con = mysqli_connect($host, $user, $password, $dbname);

        if (!$con) {
            http_response_code(500);
            die(json_encode(['success' => false, 'message' => 'Database connection failed.']));
        }

        // Configurar la conexión
        mysqli_query($con, "SET NAMES 'utf8'");

        // Sanitizar los valores para la consulta
        $call_escaped = mysqli_real_escape_string($con, $call);
        $desde_escaped = $desde !== null ? mysqli_real_escape_string($con, $desde) : null;
        $hasta_escaped = $hasta !== null ? mysqli_real_escape_string($con, $hasta) : null;

        // Construir la consulta SQL de forma segura
        $sql = ($desde === null || $hasta === null) 
            ? "CALL $call_escaped()" 
            : "CALL $call_escaped('$desde_escaped', '$hasta_escaped')";

        // Ejecutar la consulta
        $result = mysqli_query($con, $sql);

        if (!$result) {
            http_response_code(500);
            die(json_encode(['success' => false, 'message' => 'Query execution failed: ' . mysqli_error($con)]));
        }

        if ($result instanceof mysqli_result) {
            $arr_customers = [];
            while ($row = mysqli_fetch_assoc($result)) {
                $arr_customers[] = $row;
            }

            // Devolver los resultados como JSON
            echo json_encode($arr_customers, JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(500);
            die(json_encode(['success' => false, 'message' => 'Unexpected result from the database.']));
        }

        // Cerrar la conexión
        mysqli_close($con);


    } catch (\Throwable $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Processing error: ' . $e->getMessage()]);
        die();
    }
}


function preparaDatos(string $path): void {
    try {
        // Dividir el $path
        $path_parts = explode('/', $path);
        $largo = count($path_parts);

        if ($largo < 4) {
            throw new InvalidArgumentException("La ruta proporcionada no es válida.");
        }

        // Inicializar variables
        $call = '';
        $planta = '';
        $desde = null;
        $hasta = null;

        if ($path_parts[$largo - 1] === '*') {
            $call = $path_parts[$largo - 3];
            $planta = $path_parts[$largo - 2];
        } else {
            $call = $path_parts[$largo - 4];
            $desde = $path_parts[$largo - 3];
            $hasta = $path_parts[$largo - 2];
            $planta = $path_parts[$largo - 1];

            // Validar y ajustar las fechas
            $fecha_actual = date("Y/m/d");
            $timestamp_actual = strtotime($fecha_actual);
            if ($timestamp_actual === false) {
                throw new RuntimeException("Error al analizar la fecha actual.");
            }

            $fecha_formateada = date("Y-m-d", $timestamp_actual);

            if (strtotime($desde) > $timestamp_actual) {
                $desde = $fecha_formateada;
            }

            if (strtotime($desde) > strtotime($hasta)) {
                $temp = $desde;
                $desde = $hasta;
                $hasta = $temp;
            }
        }

        // Llamar a la función procesar con los datos preparados
        procesar($call, $desde, $hasta, $planta);
    } catch (\Throwable $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Preparation error: ' . $e->getMessage()]);
        die();
    }
}



// Verificar que el parámetro 'token' está presente en la solicitud
if (!isset($_GET['token'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Token de acceso no proporcionado.']);
    exit;
}

// Obtener valores de $_GET y validar que sean cadenas
$token = $_GET['token'] ?? null;
$data = $_GET['data'] ?? null;

if (!is_string($token) || !is_string($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Token o datos invalidos.']);
    exit;
}

// Verificar el token
if (!verificarToken($token, $data, $clave_secreta)) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Token de acceso inválido.']);
    exit;
}

// Configurar el tipo de contenido como JSON
header("Content-Type: application/json; charset=utf-8");

// Validar y obtener el host y la URI
$request_uri = $_SERVER['REQUEST_URI'] ?? null;
$http_host = $_SERVER['HTTP_HOST'] ?? null;

if (!is_string($request_uri) || !is_string($http_host)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Host o URI no válidos.']);
    exit;
}

// Construir y sanitizar la URL completa
$url = filter_var("https://$http_host$request_uri", FILTER_SANITIZE_URL);

if ($url === false) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'URL no válida.']);
    exit;
}

// Analizar la URL para obtener el `path`
$url_parts = parse_url($url);

if ($url_parts === false || !isset($url_parts['path'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Faltan datos necesarios en la URL.']);
    exit;
}

$path = $url_parts['path'];

// Verificar que el `path` no esté vacío
if (empty($path)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Ruta no válida.']);
    exit;
}

// Procesar el `path`
try {
    preparaDatos($path);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al procesar los datos: ' . $e->getMessage()]);
    exit;
}
?>