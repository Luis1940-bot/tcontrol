<?php
error_reporting(E_ALL); // Muestra todos los errores y warnings
ini_set('display_errors', 1); // Asegúrate de que los errores sean mostrados (no usar en producción)

require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
// include('datos.php');


function guardarCambiosReporte($datos) {
    $dato_decodificado =urldecode($datos);
    $objeto_json = json_decode($dato_decodificado);

    include_once BASE_DIR . "/Routes/datos_base.php";
    try {
        $pdo = new PDO("mysql:host={$host};dbname={$dbname};charset=utf8", $user, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->exec("SET NAMES utf8");

        $sql = "UPDATE LTYreporte SET ";
        $params = [];
        foreach ($objeto_json as $key => $value) {
            if ($key !== 'id') { // Asegúrate de no incluir el ID como parte de los campos a actualizar
                $sql .= "$key = :$key, ";
                $params[$key] = $value;
            }
        }
        $sql = rtrim($sql, ', '); // Remueve la última coma
        $sql .= " WHERE idLTYreporte = :id"; // Utiliza el id para encontrar el registro correcto
        $params['id'] = $objeto_json->id; // Asegúrate de que el id está incluido en los parámetros

        // Preparar y ejecutar la consulta SQL
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        $response = [
            'success' => true,
            'message' => 'El registro fue actualizado correctamente',
        ];
        
    } catch (PDOException $e) {
        // En caso de error, revertir la transacción y mostrar el mensaje de error.
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
// $datos = $datox;
if (empty($datos)) {
  $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
  echo json_encode($response);
  exit;
}
$data = json_decode($datos, true);

error_log('JSON response: ' . json_encode($data));

if ($data !== null) {
  $datos = $data['q'];
  guardarCambiosReporte($datos);
} else {
  echo "Error al decodificar la cadena JSON";
}
?>

