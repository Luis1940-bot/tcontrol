<?php
mb_internal_encoding('UTF-8');
require_once dirname(dirname(dirname(__DIR__))) . '/ErrorLogger.php';
ErrorLogger::initialize(dirname(dirname(dirname(__DIR__))) . '/logs/error.log');
if (isset($_SESSION['timezone'])) {
    date_default_timezone_set($_SESSION['timezone']);
} else {
    date_default_timezone_set('America/Argentina/Buenos_Aires');
}

function actualizar($target, $plantx) {

      require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
      include_once BASE_DIR . "/Routes/datos_base.php";

    try {
    // $host = "68.178.195.199"; 
    // $user = "developers";
    // $password = "6vLB#Q0bOVo4";
    // $dbname = "tc1000";
      // Verificar si las variables de conexión están definidas
      if (!isset($host, $user, $password, $dbname)) {
          die("Variables de conexión no definidas.");
      }

      $id = $target['item'];
      $column = $target['column'];
      $valor = $target['valor'];
      $param = $target['param'];
      $operation = $target['operation'];
      $idLTYcliente = $plantx;
      $arrayCampo = ['reporte', 'id', 'control', 'nombre', 'tipodato', 'detalle', 'activo', 'requerido', 'visible', 'enable1', 'orden', 'separador', 'ok', 'valor_defecto', 'selector', 'tiene_hijo', 'rutina_hijo', 'valor_sql', 'tpdeobserva', 'selector2', 'valor_defecto22', 'sql_valor_defecto22', 'rutinasql', 'idLTYreporte, idLTYcliente'];

      // Verificar si el índice existe en el array
      if (!isset($arrayCampo[$column])) {
          die("Índice de columna no válido.");
      }

      $campo = $arrayCampo[$column];

      $conn = mysqli_connect($host,$user,$password,$dbname);
      if (!$conn) {
          die("Conexión fallida: " . mysqli_connect_error());
      }
      mysqli_query ($conn,"SET NAMES 'utf8'");
      

      // if ($conn->connect_error) {
      //     die("Conexión fallida: " . $conn->connect_error);
      // }

      $sql = "UPDATE LTYcontrol SET " . $campo . " = ? WHERE idLTYcontrol = ? ";
    
      $stmt = $conn->prepare($sql);
      if ($stmt === false) {
          die("Error al preparar la consulta: " . $conn->error);
      }

      if ($operation === 'turnOnOff') {
         $stmt->bind_param( $param . "i", $valor , $id);
        if ($stmt->execute() === true) {
        
            $actualizadoJson = traerControlActualizado($conn, $idLTYcliente);

            if ($actualizadoJson) {
                $actualizadoArray = json_decode($actualizadoJson, true);

                // Verificar si el JSON decodificado es válido y contiene datos
                if ($actualizadoArray && isset($actualizadoArray['success']) && $actualizadoArray['success'] === true) {
                    $response = array('success' => true, 'actualizado' => $actualizadoArray['data']);
                } else {
                    $response = array('success' => false, 'actualizado' => false, 'message' => 'Error al actualizar los datos.');
                }
            } else {
                $response = array('success' => false, 'actualizado' => false, 'message' => 'No se pudo obtener la respuesta actualizada.');
            }
            // $response = array('success' => true, 'actualizado' => $actualizado);
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
          // $actualizado = traerControlActualizado($conn, $idLTYcliente);
          // $response = array('success' => true, 'actualizado' => $actualizado);
                      $actualizadoJson = traerControlActualizado($conn, $idLTYcliente);

            if ($actualizadoJson) {
                $actualizadoArray = json_decode($actualizadoJson, true);

                // Verificar si el JSON decodificado es válido y contiene datos
                if ($actualizadoArray && isset($actualizadoArray['success']) && $actualizadoArray['success'] === true) {
                    $response = array('success' => true, 'actualizado' => $actualizadoArray['data']);
                } else {
                    $response = array('success' => false, 'actualizado' => false, 'message' => 'Error al actualizar los datos.');
                }
            } else {
                $response = array('success' => false, 'actualizado' => false, 'message' => 'No se pudo obtener la respuesta actualizada.');
            }
          
        }
      }


      $stmt->close();
      $conn->close();
      
        // header('Content-Type: application/json');
        echo  json_encode($response);
      // Cerrar la declaración y la conexión
      
      
    } catch (\Throwable $e) {
       error_log("Error en on off en campo: " . $e);
      print "Error!: ".$e->getMessage()."<br>";
      die();
    }
}


header("Content-Type: application/json; charset=utf-8");
include('traerLTYcontrol.php');
// require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
$datos = file_get_contents("php://input");
// $datos = '{"q":{"item":"31","column":4,"valor":"s","param":"s","id":"4","operation":"turnOnOff"},"ruta":"/turnOnOff","rax":"&new=Fri Jul 05 2024 07:56:45 GMT-0300 (hora estándar de Argentina)","sql_i":13}';

if (empty($datos)) {
  $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
  echo json_encode($response);
  exit;
}
$data = json_decode($datos, true);

error_log('Pages/ListControles/Routes/turnOnOff-JSON response: ' . json_encode($data));

if ($data !== null) {
  $target = $data['q'];
  $plantx = $data['sql_i'];
  actualizar($target, $plantx);
} else {
  echo "Error al decodificar la cadena JSON";
}
?>