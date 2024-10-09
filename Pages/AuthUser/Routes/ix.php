<?php
require_once dirname(dirname(dirname(__DIR__))) . '/ErrorLogger.php';
ErrorLogger::initialize(dirname(dirname(dirname(__DIR__))) . '/logs/error.log');
if (isset($_SESSION['timezone'])) {
    date_default_timezone_set($_SESSION['timezone']);
} else {
    date_default_timezone_set('America/Argentina/Buenos_Aires');
}
error_reporting(E_ALL); // Muestra todos los errores y warnings
ini_set('display_errors', 1); // Asegúrate de que los errores sean mostrados (no usar en producción)

require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
// include('datos.php');


function insertarCorreo($datos) {
    $dato_decodificado =urldecode($datos);
    $objeto_json = json_decode($dato_decodificado, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        $response = [
            'success' => false,
            'message' => 'Error al decodificar JSON: ' . json_last_error_msg()
        ];
        header('Content-Type: application/json');
        echo json_encode($response);
        exit;
    }


    include_once BASE_DIR . "/Routes/datos_base.php";
      // $host = "68.178.195.199"; 
      // $user = "developers";
      // $password = "6vLB#Q0bOVo4";
      // $dbname = "tc1000";
      // $port = 3306;
      // $charset = "utf-8";
    try {
        $email = $objeto_json['email'];
        $plant = $objeto_json['plant'];
        

        $campos = "plant, mail";
        $interrogantes = "?, ?";

        $pdo = new PDO("mysql:host={$host};dbname={$dbname};charset=utf8", $user, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->exec("SET NAMES utf8");

        // Preparar la consulta SQL.
        $sql = "INSERT INTO auth ($campos) VALUES ($interrogantes)";
        $stmt = $pdo->prepare($sql);

        // Vinculación de parámetros.
        $stmt->bindParam(1, $plant);
        $stmt->bindParam(2, $email);
        
        // Ejecución de la transacción.
        $pdo->beginTransaction();
        $stmt->execute();
        $lastInsertedId = $pdo->lastInsertId();
        $cantidad_insert = $stmt->rowCount();
        $pdo->commit();

        // Respuesta dependiendo del resultado de la inserción.
        if ($cantidad_insert > 0) {
            $response = [
                'success' => true,
                'message' => 'La operación fue exitosa!',
                'registros' => $cantidad_insert,
                'last_insert_id' => $lastInsertedId
            ];
        } else {
            $response = [
                'success' => false,
                'message' => 'Algo salió mal, no hay registros insertados'
            ];
        }
    } catch (PDOException $e) {
         error_log("Error al guardar nueva area. Error: " . $e);
        // En caso de error, revertir la transacción y mostrar el mensaje de error.
        $pdo->rollBack();
        $response = [
            'success' => false,
            'message' => 'Error de base de datos: ' . $e->getMessage()
        ];
    } finally {
        // Cerrar la conexión a la base de datos.
        $pdo = null;
    }
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

header("Content-Type: application/json; charset=utf-8");
$datos = file_get_contents("php://input");
// $datos = '{"q":{"idLTYarea":"","area":"desarrollo","idLTYcliente":7,"activo":"s","visible":"s"},"ruta":"/guardarAreaNuevo","rax":"&new=Tue Jul 02 2024 16:09:17 GMT-0300 (hora estándar de Argentina)"}';

if (empty($datos)) {
  $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
  echo json_encode($response);
  exit;
}
$data = json_decode($datos, true);

// error_log('JSON response: ' . json_encode($data));

if ($data !== null) {
  $datos = json_encode($data['q']);
  insertarCorreo($datos);
} else {
  echo "Error al decodificar la cadena JSON";
  
}
?>

