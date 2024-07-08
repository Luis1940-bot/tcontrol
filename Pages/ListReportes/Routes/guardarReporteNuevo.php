<?php
error_reporting(E_ALL); // Muestra todos los errores y warnings
ini_set('display_errors', 1); // Asegúrate de que los errores sean mostrados (no usar en producción)

require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
// include('datos.php');
include_once "addCamposBasicos.php";

function guardarReporte($datos, $plant) {
    $dato_decodificado =urldecode($datos);
    $objeto_json = json_decode($dato_decodificado);

      $i=0;
      $campos='';
      $placeholders='';
          foreach ($objeto_json as $clave => $valor) {
          $campos?$campos=$campos.','.$clave:$campos=$clave;
          $placeholders?$placeholders=$placeholders.','.':'.$clave:$placeholders=':'.$clave;
          $i++;
      }
      $idLTYcliente = $plant;
     
    include_once BASE_DIR . "/Routes/datos_base.php";
    try {
        $pdo = new PDO("mysql:host={$host};dbname={$dbname};charset=utf8", $user, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->exec("SET NAMES utf8");

        // Preparar la consulta SQL.
        $sql = "INSERT INTO LTYreporte ($campos) VALUES ($placeholders)";
        $stmt = $pdo->prepare($sql);

        // Vinculación de parámetros.
        foreach ($objeto_json as $clave => $valor) {
            $stmt->bindValue(":$clave", $valor);
        }

        // Ejecución de la transacción.
        $pdo->beginTransaction();
        $stmt->execute();
        $lastInsertedId = $pdo->lastInsertId(); 
        $cantidad_insert = $stmt->rowCount();
        $pdo->commit();

        // Respuesta dependiendo del resultado de la inserción.
        if ($cantidad_insert > 0) {
            addCampos($objeto_json->nombre, $pdo, $lastInsertedId, $idLTYcliente);
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

if (empty($datos)) {
  $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
  echo json_encode($response);
  exit;
}
$data = json_decode($datos, true);

error_log('JSON response: ' . json_encode($data));

if ($data !== null) {
  $datos = $data['q'];
  $plant = $data['planta'];
  guardarReporte($datos, $plant);
} else {
  echo "Error al decodificar la cadena JSON";
}
?>

