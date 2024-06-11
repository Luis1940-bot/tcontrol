<?php

function generarCodigoAlfabetico($reporte) {
    $palabras = explode(' ', $reporte);
    $codigo = '';


    foreach ($palabras as $palabra) {
        $codigo .= strtolower(substr($palabra, 0, 3));
    }

    return $codigo;
}

function addCampo($datos) {
    $dato_decodificado = urldecode($datos);
    $objeto_json = json_decode($dato_decodificado, true);
    // $host = "190.228.29.59"; 
    // $user = "fmc_oper2023";
    // $password = "0uC6jos0bnC8";
    // $dbname = "mc1000";
    // $port = '3306';
    // $charset='utf-8';
    if ($objeto_json === null) {
        return array('success' => false, 'message' => 'Error al decodificar la cadena JSON');
    }

    $reporte = $objeto_json['reporte'];
    $orden = $objeto_json['orden'];
    $nombreCampo = $objeto_json['campo'];
    $idLTYreporte = $objeto_json['idLTYreporte'];
    $idObservacion = $objeto_json['idObservacion'];
    
    $codigoBase = generarCodigoAlfabetico($reporte);
    $i = $orden + 1;
    $codigo = $codigoBase . $i;
    $campos = "control, nombre, tipodato, detalle, tpdeobserva, idLTYreporte, orden, visible, requerido";
    $interrogantes = "?, ?, ?, ?, ?, ?, ?, ?, ?";
    $tipoDeDato = 'x';
    $detalle = '------';

    require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
    include_once BASE_DIR . "/Routes/datos_base.php";
    // echo  BASE_DIR;
    include_once BASE_DIR .  "/Pages/ListControles/Routes/traerLTYcontrol.php";
    

    $mysqli = new mysqli($host, $user, $password, $dbname, $port);

    if ($mysqli->connect_error) {
        return array('success' => false, 'message' => 'Error de conexión a la base de datos: ' . $mysqli->connect_error);
    }

    $mysqli->set_charset($charset);

    $mysqli->begin_transaction();

    try {
        // Ejecución del UPDATE
        $sqlUpdate = "UPDATE LTYcontrol SET orden = ? WHERE idLTYcontrol = ?";
        $stmtUpdate = $mysqli->prepare($sqlUpdate);

        if ($stmtUpdate === false) {
            throw new Exception('Error al preparar la consulta de UPDATE: ' . $mysqli->error);
        }

        $stmtUpdate->bind_param("ii", $i, $idObservacion);

        if (!$stmtUpdate->execute()) {
            throw new Exception('Error al ejecutar la consulta de UPDATE: ' . $stmtUpdate->error);
        }

        // Ejecución del INSERT
        $datosAdd = [$codigo, $nombreCampo, $tipoDeDato, $detalle, 'x', $idLTYreporte, $orden, 's', 0];
        $sqlInsert = "INSERT INTO LTYcontrol ($campos) VALUES ($interrogantes)";
        $stmtInsert = $mysqli->prepare($sqlInsert);

        if ($stmtInsert === false) {
            throw new Exception('Error al preparar la consulta de INSERT: ' . $mysqli->error);
        }

        $stmtInsert->bind_param("sssssiisi", ...$datosAdd);

        if (!$stmtInsert->execute()) {
            throw new Exception('Error al ejecutar la consulta de INSERT: ' . $stmtInsert->error);
        }

        // Llamada a la función traerControlActualizado
        $actualizado = traerControlActualizado($mysqli);

        $response = array('success' => true, 'actualizado' => $actualizado);

        $mysqli->commit();
    } catch (Exception $e) {
        $mysqli->rollback();
        $response = array('success' => false, 'message' => 'Error en la base de datos: ' . $e->getMessage());
    }

    $stmtInsert->close();
    $stmtUpdate->close();
    $mysqli->close();

    echo json_encode($response);
    exit;
}

header("Content-Type: application/json; charset=utf-8");
$datos = file_get_contents("php://input");
// $datos = '{"q":"%7B%22reporte%22%3A%22REPORTE%20CON%20CONTROL%20AUTOMATICO%22%2C%22idLTYreporte%22%3A328%2C%22campo%22%3A%22PRUEBA%22%2C%22orden%22%3A3%2C%22idObservacion%22%3A5253%7D","ruta":"/addNewCampo","rax":"&new=Fri Jun 07 2024 16:10:56 GMT-0300 (hora estándar de Argentina)"}';

if (empty($datos)) {
    $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
    echo json_encode($response);
    exit;
}

$data = json_decode($datos, true);
error_log('JSON response: ' . json_encode($data));

if ($data !== null) {
  $datos = $data['q'];
  addCampo($datos);
} else {
  echo "Error al decodificar la cadena JSON";
}

?>
