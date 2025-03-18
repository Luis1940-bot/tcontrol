<?php
// ini_set('display_errors', '1');
// ini_set('display_startup_errors', '1');
// error_reporting(E_ALL);
require_once dirname(dirname(dirname(__DIR__))) . '/ErrorLogger.php';
ErrorLogger::initialize(dirname(dirname(dirname(__DIR__))) . '/logs/error.log');
/** 
 * @var array{timezone?: string} $_SESSION 
 */
if (isset($_SESSION['timezone']) && is_string($_SESSION['timezone'])) {
  date_default_timezone_set($_SESSION['timezone']);
} else {
  date_default_timezone_set('America/Argentina/Buenos_Aires');
}

/**
 * @return array{success: bool, actualizado?: array<int|string, mixed>, message?: string}
 */
function clonarReporte(string $datos): array
{
  require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
  /** @var string $baseDir */
  $baseDir = BASE_DIR;
  include_once $baseDir . "/Routes/datos_base.php";
  // echo  BASE_DIR;
  include_once $baseDir .  "/Pages/ListControles/Routes/traerLTYcontrol.php";
  $dato_decodificado = urldecode($datos);
  $objeto_json = json_decode($dato_decodificado, true);
  /** @var string $charset */
  /** @var string $dbname */
  /** @var string $host */
  /** @var int $port */
  /** @var string $password */
  /** @var string $user */
  /** @var PDO $pdo */
  // $host = "34.174.211.66";
  // $user = "uumwldufguaxi";
  // $password = "5lvvumrslp0v";
  // $dbname = "db5i8ff3wrjzw3";
  // $port = 3306;
  $charset = "utf8mb4";

  if ($objeto_json === null) {
    return array('success' => false, 'message' => 'Error al decodificar la cadena JSON');
  }
  if (is_array($objeto_json)) { // ✅ Verificamos si es un array antes de acceder a sus claves
    $idOrigen = $objeto_json['origen'] ?? '';
    $idDestino = $objeto_json['destino'] ?? '';
  } else {
    $idOrigen = '';
    $idDestino = '';
  }


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

    if ($result instanceof mysqli_result && $result->num_rows > 0) { // ✅ Validamos que $result es un mysqli_result válido
      $row = $result->fetch_assoc();

      if (
        is_array($row) && isset($row['control'])
      ) { // ✅ Verificamos si 'control' existe en $row
        $control = $row['control'];

        if (is_string($control) && !empty($control)) { // ✅ Aseguramos que $control es un string antes de usar substr()
          $control = substr($control, 0, -1);
        }
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

      if ($resultFull instanceof mysqli_result) { // ✅ Verificamos que $resultFull es un resultado válido
        while ($rowFull = $resultFull->fetch_assoc()) {
          $campos[] = $rowFull;
        }
      } else {
        // ✅ Verificamos que $conn está definido antes de usarlo
        if (isset($conn) && $conn instanceof mysqli) {
          error_log("Error en la consulta SQL: " . $conn->error);
        } else {
          error_log("Error en la consulta SQL: No se pudo obtener el mensaje de error.");
        }
      }


      // OBTENER NOMBRES DE LOS CAMPOS
      $sqlShowColumns = "SHOW COLUMNS FROM LTYcontrol";
      $resultColumns = $mysqli->query($sqlShowColumns);

      if ($resultColumns instanceof mysqli_result) { // ✅ Verificamos que es un mysqli_result antes de usar fetch_assoc()
        $fieldNames = [];
        while ($rowColumn = $resultColumns->fetch_assoc()) {
          $fieldNames[] = $rowColumn['Field'];
        }
      } else {
        throw new Exception('Error al obtener los nombres de los campos: ' . $mysqli->error);
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


      foreach ($campos as &$campo) {
        // ✅ Asegurar que $numeroControl está definido y es un número
        $numeroControl = isset($numeroControl) && is_int($numeroControl) ? $numeroControl : 0;
        $numeroControl++;

        // ✅ Asegurar que $control está definido y es un string
        $control = isset($control) && is_string($control) ? $control : '';

        // ✅ Ahora la concatenación es segura
        $campo['control'] = $control . $numeroControl;

        // ✅ Asegurar que $idDestino está definido antes de asignarlo
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

      $response = array('success' => true, 'control' => $control ?? '', 'campos' => $campos, 'fieldNames' => $fields);

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
    $mysqli->close();
  }

  echo json_encode($response);
  return $response;
}

header("Content-Type: application/json; charset=utf-8");
$datos = file_get_contents("php://input");
// $datos = '{"q":"%7B%22origen%22%3A67%2C%22destino%22%3A68%7D","ruta":"/clonarReporte","rax":"&new=Thu Oct 31 2024 20:51:28 GMT-0300 (hora estándar de Argentina)","sqlI":null}';

if (empty($datos)) {
  $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
  echo json_encode($response);
  exit;
}

$data = json_decode($datos, true);
if (is_array($data) && isset($data['q']) && is_string($data['q'])) { // ✅ Aseguramos que $data es un array y que 'q' existe como string
  $datos = $data['q'];
  clonarReporte($datos);
} else {
  echo json_encode(array('success' => false, 'message' => 'Error al decodificar la cadena JSON o datos incorrectos.'));
}
