<?php
mb_internal_encoding('UTF-8');
function actualizar($target) {
    // $host = "190.228.29.59"; 
    // $user = "fmc_oper2023";
    // $password = "0uC6jos0bnC8";
    // $dbname = "mc1000";

    try {
      include_once BASE_DIR . "/Routes/datos_base.php";

      $id = $target['item'];
      $column = $target['column'];
      $valor = $target['valor'];
      $param = $target['param'];
      $arrayCampo = ['reporte', 'id', 'control', 'nombre', 'tipodedato', 'detalle', 'activo', 'requerido', 'visible', 'enable1', 'orden', 'separador', 'oka', 'valorDefecto', 'selector', 'tiene_hijo', 'rutinaHijo', 'valorSql', 'tipopdeobserva', 'selector2', 'valorDefecto22', 'sqlValorDefecto', 'rutinaSql', 'idLTYreporte'];

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
      $stmt->bind_param( $param . "i", $valor , $id);
    
      if ($stmt->execute() === true) {
          $actualizado = traerControlActualizado($conn);
          $response = array('success' => true, 'actualizado' => $actualizado);
      } else {
          $response = array('success' => false, 'message' => 'No se actualizo la situación del concepto de la variable.');
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
// $datos = '{"q":{"item":"1","column":"6","valor":"n","param":"s"},"ruta":"/turnOnOff","rax":"&new=Mon May 27 2024 19:43:42 GMT-0300 (hora estándar de Argentina)"}';

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