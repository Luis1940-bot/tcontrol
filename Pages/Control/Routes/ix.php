<?php
require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
include('generatorNuxPedido.php');
// include('datos.php');

function convertToValidJson($data) {
    $string = str_replace("\n", ", ", $data);
    // Corregir comillas internas
    $string = str_replace('", "', '","', $string);
    $string = str_replace("\n", '', $string);

    // Agregar llaves al principio y al final
    $string = '{' . $string . '}';
    return $string;
}


function insertar_registro($datos, $idLTYcliente) {
  $dato_decodificado =urldecode($datos);
  $objeto_json = json_decode($dato_decodificado);
  $nuevoObjetoJSON = convertToValidJson($objeto_json->objJSON[0]); //convertToValidJson($array[0]);
  if (json_last_error() !== JSON_ERROR_NONE) {
      die('Error al codificar JSON: ' . json_last_error_msg());
  }
  // var_dump($objeto_json->objJSON[0]);
  // var_dump($nuevoObjetoJSON);

  $fecha = $objeto_json->fecha[0];
  $idusuario = $objeto_json->idusuario[0];
  $idLTYreporte = $objeto_json->idLTYreporte[0];
  $supervisor = $objeto_json->supervisor[0];
  $observacion = $objeto_json->observacion[0];
  $imagenes = $objeto_json->imagenes[0];
  $nuxpedido=generaNuxPedido();
  $campos = 'fecha, nuxpedido, idusuario, idLTYreporte, supervisor, observacion, imagenes, objJSON, idLTYcliente';
  $interrogantes = '?,?,?,?,?,?,?,?,?';
  $cantidad_insert=1;

  include_once BASE_DIR . "/Routes/datos_base.php";
  $pdo = new PDO("mysql:host={$host};dbname={$dbname};port={$port};chartset={$charset}",$user,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  $pdo->beginTransaction();
  $sql="INSERT INTO LTYregistrocontrol (".$campos.") VALUES (".$interrogantes.");";
  $insert = [$fecha, $nuxpedido, $idusuario, $idLTYreporte, $supervisor, $observacion, $imagenes, $nuevoObjetoJSON, $idLTYcliente];
  $sentencia = $pdo->prepare($sql);
  $sentencia->execute($insert);

  $pdo->commit();
  if ($cantidad_insert > 0) {
    // echo "El registro se insertó correctamente";
    $response = array('success' => true, 'message' => 'La operación fue exitosa!', 'registros' => $cantidad_insert, 'documento' => $nuxpedido);
    // echo json_encode($response);
  } else {
    // echo "No se insertó ningún registro";
    $response = array('success' => false, 'message' => 'Algo salió mal no hay registros insertados');
    // echo json_encode($response);
  }
  $pdo=null; 
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
  $sql_i = $data['sql_i'];
  insertar_registro($datos, $sql_i);
} else {
  echo "Error al decodificar la cadena JSON";
}
?>