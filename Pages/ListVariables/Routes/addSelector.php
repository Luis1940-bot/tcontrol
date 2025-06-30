<?php
// ini_set('display_errors', '1');
// ini_set('display_startup_errors', '1');
// error_reporting(E_ALL);
mb_internal_encoding('UTF-8');
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
 * Agrega un nuevo selector en la base de datos y devuelve el estado de la operación.
 *
 * @param array<string, mixed> $q Datos del selector a agregar.
 * @return array{success: bool, message: string, id?: int}
 */
function addSelector(array $q): array
{

  try {
    require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
    /** @var string $baseDir */
    $baseDir = BASE_DIR;
    include_once $baseDir . "/Routes/datos_base.php";
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
    include_once $baseDir . "/Routes/datos_base.php";

    $detalle = isset($q['detalle']) && is_string($q['detalle']) ? $q['detalle'] : '';
    $nivel = isset($q['nivel']) && is_numeric($q['nivel']) ? (int) $q['nivel'] : 0;
    $concepto = isset($q['concepto']) && is_string($q['concepto']) ? $q['concepto'] : '';
    $idLTYcliente = isset($q['idLTYcliente']) && is_numeric($q['idLTYcliente']) ? (int) $q['idLTYcliente'] : 0;
    $orden = 1;
    $activo = 's';


    $conn = mysqli_connect($host, $user, $password, $dbname);
    if (!$conn) {
      throw new RuntimeException('Error al conectar con la base de datos: ' . mysqli_connect_error());
    }
    mysqli_set_charset($conn, "utf8");
    // Iniciar transacción
    // $conn->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
    $conn->autocommit(false);
    $conn->query("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE");

    // Consulta para obtener el máximo valor de 'selector'
    $sqlMax = "SELECT MAX(selector) AS max_selector FROM LTYselect";
    $result = $conn->query($sqlMax);
    if ($result === false) {
      $conn->rollback(); // Revertir transacción en caso de error
      throw new RuntimeException('Error en la consulta SQL: ' . $conn->error);
    }

    if ($result instanceof mysqli_result) {
      $row = $result->fetch_assoc();
      $maxSelector = isset($row['max_selector']) && is_numeric($row['max_selector']) ? (int) $row['max_selector'] : 0;
    } else {
      $conn->rollback(); // Revertir transacción en caso de error
      throw new RuntimeException('Error en la consulta SQL: ' . $conn->error);
    }
    $selector = $maxSelector + 1;  // Incrementar el máximo valor encontrado

    // Preparar la sentencia de inserción con el nuevo valor de 'selector'
    $sql = "INSERT INTO LTYselect (selector, detalle, orden, activo, nivel, concepto, idLTYcliente) VALUES (?, ?, ?, ?, ?, ?, ?);";
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
      $conn->rollback(); // Revertir transacción en caso de error
      throw new RuntimeException("Error al preparar la consulta: " . $conn->error);
    }

    $stmt->bind_param("isisisi", $selector, $detalle, $orden, $activo, $nivel, $concepto, $idLTYcliente);

    if ($stmt->execute() === true) {

      $last_id = (int) $conn->insert_id;
      $response = ['success' => true, 'message' => 'Se agregó un nuevo selector.', 'id' => $last_id];
      $conn->commit();
    } else {
      $conn->rollback(); // Revertir transacción en caso de error
      $response = ['success' => false, 'message' => 'No se agregó el nuevo selector.'];
    }
    $stmt->close();
    $conn->close();

    header('Content-Type: application/json');
    echo json_encode($response);
    return $response;
  } catch (\Throwable $e) {
    error_log("Error al agregar selector: " . $e);
    return ['success' => false, 'message' => "Error en la ejecución: " . $e->getMessage()];
  }
}

header("Content-Type: application/json; charset=utf-8");
$datos = file_get_contents("php://input");
// $datos = '{"ruta":"/addSelector","rax":"&new=Thu Jul 04 2024 09:26:43 GMT-0300 (hora estándar de Argentina)","q":{"concepto":"Modificar","detalle":"UUUUUU","nivel":"1","idLTYcliente":7}}';
if ($datos === false) {
  $datos = '';
}
if (empty($datos)) {
  $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
  echo json_encode($response);
  exit;
}
$data = json_decode($datos, true);
if (!is_array($data)) {
  echo json_encode(['success' => false, 'message' => 'Formato de datos incorrecto.']);
  exit;
}
$q = isset($data['q']) && is_array($data['q'])
  ? array_filter($data['q'], fn($key) => is_string($key), ARRAY_FILTER_USE_KEY)
  : [];
addSelector($q);
