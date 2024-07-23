<?php
require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
mb_internal_encoding('UTF-8');
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


function update_registro($datos, $nuxpedido) {
try {
    $dato_decodificado =urldecode($datos);
    $objeto_json = json_decode($dato_decodificado);
    $nuevoObjetoJSON = convertToValidJson($objeto_json->objJSON[0]); //convertToValidJson($array[0]);
    if (json_last_error() !== JSON_ERROR_NONE) {
        die('Error al codificar JSON: ' . json_last_error_msg());
    }
  
 
    $fecha = $objeto_json->fecha[0];
    $idusuario = $objeto_json->idusuario[0];
    $supervisor = $objeto_json->supervisor[0];
    $observacion = $objeto_json->observacion[0] || "";
    $imagenes = $objeto_json->imagenes[0] || "";
    $cantidad_insert = 0;

    echo $fecha.'\n';
    echo $idusuario.'\n';
    echo $supervisor.'\n';
    echo $observacion.'\n';
    echo $imagenes.'\n';

    // var_dump($nuevoObjetoJSON);
   
    include_once BASE_DIR . "/Routes/datos_base.php";
    $conn = mysqli_connect($host,$user,$password,$dbname);
    if ($conn->connect_error) {
        die("Conexión fallida: " . $conn->connect_error);
    }
    mysqli_set_charset($conn, "utf8");
    $sql = "UPDATE LTYregistrocontrol SET fecha = ?, idusuario = ?, supervisor = ?, observacion = ?, imagenes = ?, objJSON = ? WHERE nuxpedido = ?"; 

    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        die("Error al preparar la consulta: " . $conn->error);
    }
    $stmt->bind_param("siissss", $fecha , $idusuario , $supervisor , $observacion , $imagenes , $nuevoObjetoJSON, $nuxpedido);

    if ($stmt->execute() === true) {
        $cantidad_insert = 1;
        $response = array('success' => true, 'message' => 'La operacion fue exitosa!', 'registros' => $cantidad_insert, 'documento' => $nuxpedido);
    } else {
        $response = array('success' => false, 'message' => 'No se actualizo el control.');
    }
    $stmt->close();
    $conn->close();

    header('Content-Type: application/json');
    echo  json_encode($response);
} catch (\Throwable $e) {
  print "Error!: ".$e->getMessage()."<br>";
  die();
}
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
  $nux = $data['nux'];

  update_registro($datos, $nux);
} else {
  echo "Error al decodificar la cadena JSON";
}
?>