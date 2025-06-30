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
function generarCodigoAlfabetico(string $reporte, int $orden): string
{

  $reporte = mb_convert_encoding($reporte, 'UTF-8', mb_detect_encoding($reporte, 'UTF-8, ISO-8859-1, ISO-8859-15', true));
  $reporte = preg_replace('/[^\p{L}\p{N}\s-]/u', '', $reporte);
  $palabras = preg_split('/[\s-]+/u', $reporte);
  $codigoBase = '';

  foreach ($palabras as $palabra) {
    $codigoBase .= strtolower(mb_substr($palabra, 0, 2, 'UTF-8'));
  }

  $codigoBase = substr($codigoBase, 0, 6);
  $i = str_pad((int) $orden + 1, 4, "0", STR_PAD_LEFT);
  $hash = substr(md5($reporte . $orden), 0, 5);
  $codigo = strtolower(substr($codigoBase . $i . $hash, 0, 15));
  return $codigo;
}
/**
 * Agrega un nuevo campo en la base de datos y devuelve el estado de la operación.
 *
 * @param string $datos JSON codificado con los datos del campo.
 * @param int $plant Identificador de la planta.
 * @return array{success: bool, actualizado?: array<string, mixed>, message?: string}
 */
function addCampo(string $datos, int $plant): array
{

  $dato_decodificado = urldecode($datos);
  $objeto_json = json_decode($dato_decodificado, true);
  if (!is_array($objeto_json)) {
    return ['success' => false, 'message' => 'Error al decodificar la cadena JSON'];
  }

  /** 
   * @var array{
   *     reporte?: string, 
   *     orden?: int, 
   *     campo?: string, 
   *     idLTYreporte?: int, 
   *     idObservacion?: int, 
   *     tipoDatoDetalle?: string
   * } $objeto_json 
   */

  $reporte = $objeto_json['reporte'] ?? '';
  $orden = $objeto_json['orden'] ?? 0;
  $i = (int) $orden + 1;
  $nombreCampo = $objeto_json['campo'] ?? '';
  $idLTYreporte = $objeto_json['idLTYreporte'] ?? 0;
  $idObservacion = $objeto_json['idObservacion'] ?? 0;
  $idLTYcliente = $plant;
  $tipoDatoDetalle = $objeto_json['tipoDatoDetalle'] ?? '';
  $codigo = generarCodigoAlfabetico((string) $reporte, (int) $orden);

  $campos = "control, nombre, tipodato, detalle, tpdeobserva, idLTYreporte, orden, visible, requerido, idLTYcliente, tipoDatoDetalle";
  $interrogantes = "?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?";
  $tipoDeDato = 'x';
  $detalle = '------';

  require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
  /** @var string $baseDir */
  $baseDir = BASE_DIR;
  include_once $baseDir . "/Routes/datos_base.php";
  // echo  BASE_DIR;
  include_once $baseDir .  "/Pages/ListControles/Routes/traerLTYcontrol.php";

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


  $mysqli = new mysqli($host, $user, $password, $dbname, $port);

  if ($mysqli->connect_error) {
    return array('success' => false, 'message' => 'Error de conexión a la base de datos: ' . $mysqli->connect_error);
  }
  mysqli_set_charset($mysqli, $charset);
  // $mysqli->set_charset($charset);

  $mysqli->begin_transaction();

  try {
    // Ejecución del UPDATE
    // ✅ Definir el UPDATE
    $sqlUpdate = "UPDATE LTYcontrol SET orden = ? WHERE idLTYcontrol = ?";
    $stmtUpdate = $mysqli->prepare($sqlUpdate);

    if ($stmtUpdate === false) {
      throw new Exception('Error al preparar la consulta de UPDATE: ' . $mysqli->error);
    }

    $stmtUpdate->bind_param("ii", $i, $idObservacion);

    if (!$stmtUpdate->execute()) {
      throw new Exception('Error al ejecutar la consulta de UPDATE: ' . $stmtUpdate->error);
    }
    $codigo = mb_convert_encoding(
      $codigo,
      'UTF-8',
      'auto'
    );
    $codigo = preg_replace('/[^\p{L}\p{N}\s-]/u', '', $codigo);

    // ✅ Definir el INSERT
    $datosAdd = [$codigo, $nombreCampo, $tipoDeDato, $detalle, 'x', $idLTYreporte, $orden, 's', 0, $idLTYcliente, 'x'];
    $sqlInsert = "INSERT INTO LTYcontrol ($campos) VALUES ($interrogantes)";
    $stmtInsert = $mysqli->prepare($sqlInsert);

    if ($stmtInsert === false) {
      throw new Exception('Error al preparar la consulta de INSERT: ' . $mysqli->error);
    }


    $stmtInsert->bind_param("sssssiisiss", ...$datosAdd);

    if (!$stmtInsert->execute()) {
      throw new Exception('Error al ejecutar la consulta de INSERT: ' . $stmtInsert->error);
    }

    // Llamada a la función traerControlActualizado
    $actualizado = traerControlActualizado($mysqli, $idLTYcliente);
    $actualizadoArray = json_decode($actualizado, true);

    $response = array('success' => true, 'actualizado' => $actualizadoArray);

    $mysqli->commit();
  } catch (Exception $e) {
    error_log("Error al agregar nuevo campo. Error: " . $e);
    $mysqli->rollback();
    $response = array('success' => false, 'message' => 'Error en la base de datos: ' . $e->getMessage());
  }



  echo json_encode($response);
  exit;
}

header("Content-Type: application/json; charset=utf-8");
$datos = file_get_contents("php://input");
// $datos = '{"q":"%7B%22reporte%22%3A%22APM-MP-PR-181-PR%20TOMA%20DE%20DATOS%20DE%20RECORRIDOS%20DE%20CAMPO%20S%C3%93LIDO%20(TURNO%201)%22%2C%22idLTYreporte%22%3A224%2C%22campo%22%3A%22SOLID%20SEY32_AREA%20LIM.MV%22%2C%22orden%22%3A5%2C%22idObservacion%22%3A8985%7D","ruta":"/addNewCampo","rax":"&new=Sat Mar 01 2025 16:32:29 GMT-0600 (hora estándar central)","sqlI":28}';

// ✅ Verificar si `$datos` está vacío
if (empty($datos)) {
  echo json_encode(['success' => false, 'message' => 'Faltan datos necesarios.']);
  exit;
}

// ✅ Intentar decodificar el JSON
$data = json_decode($datos, true);

// ✅ Verificar si `json_decode` falló
if (!is_array($data)) {
  echo json_encode(['success' => false, 'message' => 'Error al decodificar la cadena JSON.']);
  exit;
}

// ✅ Asegurar que `$data` tiene las claves necesarias antes de acceder a ellas
$datos = isset($data['q']) && is_string($data['q']) ? $data['q'] : '';
$sqlI = isset($data['sqlI']) && is_numeric($data['sqlI']) ? (int) $data['sqlI'] : 0;

// ✅ Llamar a la función `addCampo` solo si los valores son válidos
addCampo($datos, $sqlI);
