<?php
mb_internal_encoding('UTF-8');
function fijarLenguaje($id, $mi_cfg) {
  try {
    include_once '../../../Routes/datos_base.php';
    $conn = mysqli_connect($host,$user,$password,$dbname);
    if ($conn->connect_error) {
        // die("Conexión fallida: " . $conn->connect_error);
    }
    $sql = "UPDATE usuarios SET mi_cfg = ? WHERE idusuario = ?";
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        die("Error al preparar la consulta: " . $conn->error);
    }
    $stmt->bind_param("si", $mi_cfg, $id);
    if ($stmt->execute() === true) {
        $response = array('success' => true, 'message' => 'Se actualizó el lenguaje.');
        echo json_encode($response);
    } else {
        $response = array('success' => false, 'message' => 'No se actualizó el lenguaje.');
            echo json_encode($response);
    }

    // Cerrar la declaración y la conexión
    $stmt->close();
    $conn->close();

  } catch (\Throwable $e) {
     print "Error!: ".$e->getMessage()."<br>";
  }
}

header("Content-Type: application/json; charset=utf-8");
$datos = file_get_contents("php://input");
// $datos = '{"leng":"es","id":"6","ruta":"/mi_cfg","rax":"&new=Fri Apr 05 2024 19:00:01 GMT-0300 (hora estándar de Argentina)"}';

if (empty($datos)) {
    $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
    echo json_encode($response);
    exit;
}
$data = json_decode($datos, true);
error_log('JSON response: ' . json_encode($data));
// Verifica si la decodificación fue exitosa
if ($data !== null) {
  // Accede a los valores
  $id = $data['id'];
  $mi_cfg = 'd-'.$data['leng'];
 
  fijarLenguaje($id, $mi_cfg);
} else {
  echo "Error al decodificar la cadena JSON";
}
?>