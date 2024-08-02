<?php
header("Content-Type: application/json; charset=utf-8");
require_once dirname(dirname(dirname(__DIR__))) . '/ErrorLogger.php';
ErrorLogger::initialize(dirname(dirname(dirname(__DIR__))) . '/logs/error.log');
if (isset($_SESSION['timezone'])) {
    date_default_timezone_set($_SESSION['timezone']);
} else {
    date_default_timezone_set('America/Argentina/Buenos_Aires');
}


$datos=$_POST['datos'];

include('generatorNuxPedido.php');
// include('datos.php');
// $datos = $datox;

insertar_registro($datos);

function insertar_registro($datos) {
  $dato_decodificado =urldecode($datos);
  $objeto_json = json_decode($dato_decodificado);
  $i=0;
  $campos='';
  $interrogantes='';
  $cantidad_insert=0;
  foreach ($objeto_json as $clave => $valor) {
      $campos?$campos=$campos.','.$clave:$campos=$clave;
      $interrogantes?$interrogantes=$interrogantes.','.':'.$clave:$interrogantes=':'.$clave;
      $i++;
  }

  include_once '../../../Routes/datos_base.php';
  $pdo = new PDO("mysql:host={$host};dbname={$dbname};port={$port};chartset={$charset}",$user,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
  $sql="INSERT INTO LTYregistrocontrol (".$campos.") VALUES (".$interrogantes.");";
  $c=0;
  $d=0;
  $campos=explode(",",$campos);
  $interrogantes=explode(",",$interrogantes);
  $cantidad_registros=count($valor);

  $pdo->beginTransaction();
  $sentencia = $pdo->prepare($sql);
  $nuxpedido=generaNuxPedido();
  for ($i=0; $i <$cantidad_registros ; $i++){
      foreach ($objeto_json as $clave => $valor){
        $tipodedato="PDO::PARAM_STR";
        if ($campos[$c]==='tipodedato') {
          $parametro= $objeto_json->tipodedato[$i];
          if ($parametro==='n') {
            $tipodedato="PDO::PARAM_INT ";
          }
        }
        $sentencia->bindParam($interrogantes[$c], $campos[$c]);
        $c++;
        
      }
      $c=0;
      
      foreach ($objeto_json as $clave => $valor){
        $valor_ingresar=$valor[$i];
        $clave==='nuxpedido'?$valor_ingresar=$nuxpedido:null;
        $campos[$d]=$valor_ingresar;
        $d++;
      }
      $d=0;
      $sentencia->execute();
      $cantidad_insert += $sentencia->rowCount();
      // echo "------------EXECUTE------<br>";
  }
  $pdo->commit(); 
  if ($cantidad_insert > 0) {
    // echo "El registro se insertó correctamente";
    $response = array('success' => true, 'message' => 'La operación fue exitosa!', 'registros' => $cantidad_insert, 'documento' => $nuxpedido);
    // echo json_encode($response);
  } else {
     error_log("Error al insertar registro.");
    // echo "No se insertó ningún registro";
    $response = array('success' => false, 'message' => 'Algo salió mal no hay registros insertados');
    // echo json_encode($response);
  }
  $pdo=null; 
  echo json_encode($response);
  exit;
}
?>