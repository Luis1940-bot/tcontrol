<?php
require_once dirname(dirname(dirname(__DIR__))) . '/ErrorLogger.php';
ErrorLogger::initialize(dirname(dirname(dirname(__DIR__))) . '/logs/error.log');
if (isset($_SESSION['timezone'])) {
    date_default_timezone_set($_SESSION['timezone']);
} else {
    date_default_timezone_set('America/Argentina/Buenos_Aires');
}

function clonarReporte($datos) {
    $dato_decodificado = urldecode($datos);
    $objeto_json = json_decode($dato_decodificado, true);
    // $host = "34.174.211.66";
    // $user = "uumwldufguaxi";
    // $password = "5lvvumrslp0v";
    // $dbname = "db5i8ff3wrjzw3";
    // $port = 3306;
    // $charset = "utf-8";

    if ($objeto_json === null) {
        return array('success' => false, 'message' => 'Error al decodificar la cadena JSON');
    }

    require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
    include_once BASE_DIR . "/Routes/datos_base.php";
    // echo  BASE_DIR;
    include_once BASE_DIR .  "/Pages/ListControles/Routes/traerLTYcontrol.php";

    $idOrigen = $objeto_json['origen'];
    $idDestino = $objeto_json['destino'];
    $response = '';


    $mysqli = new mysqli($host, $user, $password, $dbname, $port);

    if ($mysqli->connect_error) {
        return array('success' => false, 'message' => 'Error de conexión a la base de datos: ' . $mysqli->connect_error);
    }

    // $mysqli->set_charset($charset);
    mysqli_set_charset($mysqli, "utf8");

    try {
        // PRIMER SELECT
        $sqlSelect = "SELECT con.control FROM LTYcontrol con WHERE con.idLTYreporte=? ORDER BY con.idLTYcontrol ASC LIMIT 1";
        $stmtSelect = $mysqli->prepare($sqlSelect);
     
        if ($stmtSelect === false) {
            throw new Exception('Error al preparar la consulta: ' . $mysqli->error);
        }

        $stmtSelect->bind_param("i", $idDestino);


        if (!$stmtSelect->execute()) {
            throw new Exception('Error al ejecutar la consulta: ' . $stmtSelect->error);
        }

        $result = $stmtSelect->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $control = $row['control'];

            if (!empty($control)) {
                $control = substr($control, 0, -1);
            }

            // SEGUNDO SELECT
            $sqlSelectFull = "SELECT 
                con.idLTYcontrol,
                con.control,
                con.nombre,
                con.tipodato,
                con.selector,
                con.detalle,
                con.tpdeobserva,
                con.selector2,
                con.idLTYreporte,
                con.orden,
                con.activo,
                con.visible,
                con.ok,
                con.separador,
                con.rutinasql,
                con.valor_defecto,
                con.valor_defecto22,
                con.sql_valor_defecto22,
                con.valor_sql,
                con.requerido,
                con.tiene_hijo,
                con.rutina_hijo,
                con.enable1,
                con.idLTYcliente,
                con.tipoDatoDetalle
            FROM LTYcontrol con
            WHERE con.idLTYreporte=? ORDER BY con.orden ASC";

            $stmtSelectFull = $mysqli->prepare($sqlSelectFull);

            if ($stmtSelectFull === false) {
                throw new Exception('Error al preparar la consulta completa: ' . $mysqli->error);
            }

            $stmtSelectFull->bind_param("i", $idOrigen);

            if (!$stmtSelectFull->execute()) {
                throw new Exception('Error al ejecutar la consulta completa: ' . $stmtSelectFull->error);
            }

            $resultFull = $stmtSelectFull->get_result();

            $campos = [];
            while ($rowFull = $resultFull->fetch_assoc()) {
                $campos[] = $rowFull;
            }
    
            // OBTENER NOMBRES DE LOS CAMPOS
            $sqlShowColumns = "SHOW COLUMNS FROM LTYcontrol";
            $resultColumns = $mysqli->query($sqlShowColumns);

            if (!$resultColumns) {
                throw new Exception('Error al obtener los nombres de los campos: ' . $mysqli->error);
            }

            $fieldNames = [];
            while ($rowColumn = $resultColumns->fetch_assoc()) {
                $fieldNames[] = $rowColumn['Field'];
            }
  
            $fieldsSinPrimerElemento = array_slice($fieldNames, 1);
            $fields = implode(', ', $fieldsSinPrimerElemento);

            // ELIMINAR EXISTENTES EN DESTINO
            $sqlDelete = "DELETE FROM LTYcontrol WHERE idLTYreporte = ?";
            $stmtDelete = $mysqli->prepare($sqlDelete);
            if ($stmtDelete === false) {
                throw new Exception('Error al preparar la consulta de DELETE: ' . $mysqli->error);
            }
            $stmtDelete->bind_param("i", $idDestino);
            if (!$stmtDelete->execute()) {
                throw new Exception('Error al ejecutar la consulta de DELETE: ' . $stmtDelete->error);
            }
            $stmtDelete->close();
            $interrogantes = "?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?";
            $parametros = "sssissiiisssssssssiisiis";
           
            // $cadena = $campos['control'];
            // $longitud = strlen($cadena) - 1;
            // $numeroControl = substr($cadena, $longitud - strlen($cadena));

            foreach ($campos as &$campo) {
                // if (isset($campo['control']) && !is_null($campo['control'])) {
                //     $cadena = $campo['control'];
                    
                // } else {
                //     // Asignar un valor por defecto si es nulo o no está definido
                //     $cadena = '';
                // }
                // if (!empty($cadena)) {
                //     $longitud = strlen($cadena) - 1;
                //     $numeroControl = substr($cadena, $longitud - strlen($cadena));
                // } else {
                //     $numeroControl = 0; // Asignar un valor por defecto en caso de cadena vacía
                // }
                $numeroControl ++;
                $campo['control'] = $control . $numeroControl;
                $campo['idLTYreporte'] = $idDestino;
                $sqlInsert = "INSERT INTO LTYcontrol ($fields) VALUES ($interrogantes)";
                $linea = array_shift($campo);
                $stmtInsert = $mysqli->prepare($sqlInsert);
                if ($stmtInsert === false) {
                    throw new Exception('Error al preparar la consulta de INSERT: ' . $mysqli->error);
                }
                $datosAdd = [
                    $campo['control'],
                    $campo['nombre'],
                    $campo['tipodato'],
                    $campo['selector'],
                    $campo['detalle'],
                    $campo['tpdeobserva'],
                    $campo['selector2'],
                    $campo['idLTYreporte'],
                    $campo['orden'],
                    $campo['activo'],
                    $campo['visible'],
                    $campo['ok'] ?? null,
                    $campo['separador'] ?? null,
                    $campo['rutinasql'] ?? null,
                    $campo['valor_defecto'] ?? null,
                    $campo['valor_defecto22'] ?? null,
                    $campo['sql_valor_defecto22'] ?? null,
                    $campo['valor_sql'] ?? null,
                    $campo['requerido'],
                    $campo['tiene_hijo'],
                    $campo['rutina_hijo'] ?? null,
                    $campo['enable1'],
                    $campo['idLTYcliente'],
                    $campo['tipoDatoDetalle'] ?? 'x'
                ];
               
                $stmtInsert->bind_param($parametros, ...$datosAdd);
    
                if (!$stmtInsert->execute()) {
                    throw new Exception('Error al ejecutar la consulta de INSERT: ' . $stmtInsert->error);
                }
              
            }
            
            $response = array('success' => true, 'control' => $control, 'campos' => $campos, 'fieldNames' => $fields);

            $stmtSelectFull->close();
        } else {
            $response = array('success' => false, 'message' => 'No se encontró el control para el idLTYreporte especificado.');
        }

        $stmtSelect->close();
    } catch (Exception $e) {
       error_log("Error al clonar reporte. Error: " . $e);
        $mysqli->rollback();
        $response = array('success' => false, 'message' => 'Error en la base de datos: ' . $e->getMessage());
    } finally {
        if (isset($mysqli)) {
            $mysqli->close();
        }
    }

    echo json_encode($response);
}

header("Content-Type: application/json; charset=utf-8");
$datos = file_get_contents("php://input");
// $datos = '{"q":"%7B%22origen%22%3A67%2C%22destino%22%3A68%7D","ruta":"/clonarReporte","rax":"&new=Thu Oct 31 2024 20:51:28 GMT-0300 (hora estándar de Argentina)","sql_i":null}';

if (empty($datos)) {
    $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
    echo json_encode($response);
    exit;
}

$data = json_decode($datos, true);
// error_log('Pages/ListControles/Routes/clonarReporte-JSON response: ' . json_encode($data));

if ($data !== null) {
    $datos = $data['q'];
    clonarReporte($datos);
} else {
    echo json_encode(array('success' => false, 'message' => 'Error al decodificar la cadena JSON'));
}

?>
