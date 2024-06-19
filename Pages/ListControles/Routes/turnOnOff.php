<?php
mb_internal_encoding('UTF-8');
function actualizar($target) {
    // $host = "68.178.195.199"; 
    // $user = "developers";
    // $password = "6vLB#Q0bOVo4";
    // $dbname = "tc1000";

    try {
      require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
      include_once BASE_DIR . "/Routes/datos_base.php";

      $id = $target['item'];
      $column = $target['column'];
      $valor = $target['valor'];
      $param = $target['param'];
      $operation = $target['operation'];
      $arrayCampo = ['reporte', 'id', 'control', 'nombre', 'tipodato', 'detalle', 'activo', 'requerido', 'visible', 'enable1', 'orden', 'separador', 'ok', 'valor_defecto', 'selector', 'tiene_hijo', 'rutina_hijo', 'valor_sql', 'tpdeobserva', 'selector2', 'valor_defecto22', 'sql_valor_defecto22', 'rutinasql', 'idLTYreporte'];

      $campo = $arrayCampo[$column];

      $conn = mysqli_connect($host,$user,$password,$dbname);
      if ($conn->connect_error) {
          die("Conexión fallida: " . $conn->connect_error);
      }

      $sql = "UPDATE LTYcontrol SET " . $campo . " = ? WHERE idLTYcontrol = ? ";
     
      $stmt = $conn->prepare($sql);
      if ($stmt === false) {
          die("Error al preparar la consulta: " . $conn->error);
      }

      if ($operation === 'turnOnOff') {
         $stmt->bind_param( $param . "i", $valor , $id);
        if ($stmt->execute() === true) {
            $actualizado = traerControlActualizado($conn);
            $response = array('success' => true, 'actualizado' => $actualizado);
        } else {
            $response = array('success' => false, 'message' => 'No se actualizo la situación del concepto de la variable.');
        }
      }
      if ($operation === 'upDown') {
        $resultado = false;
        foreach ($valor as  $value) {
          $id = $value['id'];
          $orden = $value['orden']; 
          $stmt->bind_param( $param . "i", $orden , $id);
          if ($stmt->execute() === true) {
              $resultado = true;
          } else {
              $response = array('success' => false, 'message' => 'No se actualizo la situación del concepto de la variable.');
              break;
          }
        }
        if ($resultado) {
          $actualizado = traerControlActualizado($conn);
          $response = array('success' => true, 'actualizado' => $actualizado);
        }
      }


      $stmt->close();
      $conn->close();
      
        // header('Content-Type: application/json');
        echo  json_encode($response);
      // Cerrar la declaración y la conexión
      
      
    } catch (\Throwable $e) {
      print "Error!: ".$e->getMessage()."<br>";
      die();
    }
}


header("Content-Type: application/json; charset=utf-8");
include('traerLTYcontrol.php');
require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
$datos = file_get_contents("php://input");
// $datos = '{"q":{"item":"209","column":"10","valor":[{"id":"4","orden":3},{"id":"209","orden":6},{"id":"210","orden":5},{"id":"229","orden":7},{"id":"243","orden":8},{"id":"230","orden":9},{"id":"246","orden":10},{"id":"231","orden":11},{"id":"240","orden":12},{"id":"241","orden":13},{"id":"242","orden":14},{"id":"245","orden":15},{"id":"272","orden":16},{"id":"371","orden":17},{"id":"924","orden":18},{"id":"926","orden":20},{"id":"927","orden":21},{"id":"928","orden":22},{"id":"5167","orden":23},{"id":"5168","orden":24},{"id":"5250","orden":25}],"param":"i","id":"4","operation":"upDown"},"ruta":"/turnOnOff","rax":"&new=Wed May 29 2024 18:55:42 GMT-0300 (hora estándar de Argentina)"}';

if (empty($datos)) {
  $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
  echo json_encode($response);
  exit;
}
$data = json_decode($datos, true);

error_log('JSON response: ' . json_encode($data));

if ($data !== null) {
  $target = $data['q'];
  
  actualizar($target);
} else {
  echo "Error al decodificar la cadena JSON";
}
?>