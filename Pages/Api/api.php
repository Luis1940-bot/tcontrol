<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$clave_secreta = "qV8qI3oT3'lZ7$";
$fecha_actual = 'valor.data.bueno';

function generarToken($data, $clave_secreta) {
    return hash_hmac('sha256', $data, $clave_secreta);
}

function verificarToken($token, $data, $clave_secreta) {
    $token_generado = hash_hmac('sha256', $data, $clave_secreta);
    return hash_equals($token, $token_generado);
}

function procesar($call, $desde, $hasta, $planta) {
    try {
        $host = "34.174.211.66"; 
        $user = "uumwldufguaxi";
        $password = "5lvvumrslp0v";
        $dbname = "db5i8ff3wrjzw3";
        $port = 3306;

        $sql = "CALL ".$call."('".$desde."', '".$hasta."')";
        if ($desde === null || $hasta === null) {
            $sql = "CALL ".$call."()";
        }
        $con = mysqli_connect($host, $user, $password, $dbname);
        if (!$con) {
            http_response_code(500);
            die(json_encode(['success' => false, 'message' => 'Database connection failed.']));
        }

        mysqli_query($con, "SET NAMES 'utf8'");
        mysqli_select_db($con, $dbname);

        $result = mysqli_query($con, $sql);
        $arr_customers = array();

        while ($row = mysqli_fetch_assoc($result)) {
            $arr_customers[] = $row;
        }

        $json = json_encode($arr_customers, JSON_UNESCAPED_UNICODE);
        echo $json;
        mysqli_close($con);
    } catch (\Throwable $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Processing error: ' . $e->getMessage()]);
        die();
    }
}

// function procesar($call, $desde, $hasta, $planta) {
//     try {
//         $host = "34.174.211.66"; 
//         $user = "uumwldufguaxi";
//         $password = "5lvvumrslp0v";
//         $dbname = "db5i8ff3wrjzw3";
//         $port = 3306;

//         $sql = "CALL ".$call."('".$desde."', '".$hasta."')";
//         if ($desde === null || $hasta === null) {
//             $sql = "CALL ".$call."()";
//         }
//         $con = mysqli_connect($host, $user, $password, $dbname);
//         if (!$con) {
//             http_response_code(500);
//             die(json_encode(['success' => false, 'message' => 'Database connection failed.']));
//         }

//         mysqli_query($con, "SET NAMES 'utf8'");
//         mysqli_select_db($con, $dbname);

//         $result = mysqli_query($con, $sql);
//         $arr_customers = array();
//         $column_names = array();
//         while ($column = mysqli_fetch_field($result)) {
//             $column_names[] = $column->name;
//         }
//         $arr_customers[] = $column_names;

//         while ($row = mysqli_fetch_assoc($result)) {
//             $arr_customers[] = array_values($row);
//         }

//         $json = json_encode($arr_customers, JSON_UNESCAPED_UNICODE);
//         echo $json;
//         mysqli_close($con);
//     } catch (\Throwable $e) {
//         http_response_code(500);
//         echo json_encode(['success' => false, 'message' => 'Processing error: ' . $e->getMessage()]);
//         die();
//     }
// }

function preparaDatos($path) {
    try {
        $path_parts = explode('/', $path);
        $largo = sizeof($path_parts);
        if ($path_parts[$largo -1] === '*') {
            $call = $path_parts[$largo -3];
            $planta = $path_parts[$largo -2];
            $desde = null;
            $hasta = null;
        }
        if ($path_parts[$largo -1] !== '*') {
            $call = $path_parts[$largo -4];
            $desde = $path_parts[$largo -3];
            $hasta = $path_parts[$largo -2];
            $planta = $path_parts[$largo -1];

            $fecha_actual = date("Y/m/d");
            $fecha_formateada = date("Y-m-d", strtotime($fecha_actual));
            if ($desde > $fecha_formateada) {
                $desde = $fecha_formateada;
            }
            if ($desde > $hasta) {
                $temp = $desde;
                $desde = $hasta;
            }
        }

        procesar($call, $desde, $hasta, $planta);
    } catch (\Throwable $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Preparation error: ' . $e->getMessage()]);
        die();
    }
}

if (!isset($_GET['token'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Token de acceso no proporcionado.']);
    exit;
}

$token = $_GET['token'];
$data = $_GET['data'];
if (!verificarToken($token, $data, $clave_secreta)) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Token de acceso inválido.']);
    exit;
}

header("Content-Type: application/json; charset=utf-8");
// header("Content-Security-Policy: default-src 'self'; img-src 'self' https:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;");
// header("Strict-Transport-Security: max-age=31536000; includeSubDomains; preload");
// header("X-Content-Type-Options: nosniff");
// header("X-Frame-Options: DENY");
// header("X-XSS-Protection: 1; mode=block");
// header('Access-Control-Allow-Origin: *');
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type, Authorization");


$http_host = $_SERVER['HTTP_HOST'];
$url = htmlentities($_SERVER["HTTP_HOST"] . $_SERVER["REQUEST_URI"], ENT_QUOTES, 'UTF-8');
$url_parts = parse_url($url);
$path = $url_parts['path'];

if (empty($path)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Faltan datos necesarios.']);
    exit;
}

if ($path !== null) {
    preparaDatos($path);
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Error al decodificar la cadena JSON']);
}
?>
