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
 * Agrega una nueva variable en la base de datos y devuelve el estado de la operación.
 *
 * @param array<string, mixed> $objeto Datos de la variable a agregar.
 * @return array{success: bool, message: string, id?: int, array?: array<int, array<int, mixed>>}
 */
function addVariable(array $objeto): array
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


    // ✅ Validar y asignar valores seguros
    $selector = isset($objeto['selector']) && is_numeric($objeto['selector']) ? (int) $objeto['selector'] : 0;
    $detalle = isset($objeto['nombre']) && is_string($objeto['nombre']) ? $objeto['nombre'] : '';
    $orden = isset($objeto['orden']) && is_numeric($objeto['orden']) ? (int) $objeto['orden'] : 0;
    $activo = 's';
    $nivel = 3;
    $concepto = isset($objeto['concepto']) && is_string($objeto['concepto']) ? $objeto['concepto'] : '';
    $idLTYcliente = isset($objeto['idLTYcliente']) && is_numeric($objeto['idLTYcliente']) ? (int) $objeto['idLTYcliente'] : 0;

    // ✅ Verificar si las variables de conexión a la BD tienen valores válidos
    if (empty($host) || empty($user) || empty($password) || empty($dbname)) {
      throw new RuntimeException("No se han definido correctamente las credenciales de la base de datos.");
    }

    $conn = mysqli_connect($host, $user, $password, $dbname);
    if (!$conn) {
      throw new RuntimeException('Error al conectar con la base de datos: ' . mysqli_connect_error());
    };
    mysqli_set_charset($conn, $charset);
    $sql = "INSERT INTO LTYselect (selector, detalle, orden, activo, nivel, concepto, idLTYcliente) VALUES (?, ?, ?, ?, ?, ?, ?);";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
      throw new RuntimeException("Error al preparar la consulta: " . $conn->error);
    }

    $stmt->bind_param("isisisi", $selector, $detalle, $orden, $activo, $nivel, $concepto, $idLTYcliente);

    if ($stmt->execute() === true) {
      $last_id = $conn->insert_id;
      $sqlSelect = "SELECT  LTYselect.idLTYselect, LTYselect.detalle, LTYselect.concepto, LTYselect.activo
                                      ,LTYselect.selector, LTYselect.orden, LTYselect.nivel, RAND(),NOW() 
                                      FROM LTYselect 
                                      WHERE LTYselect.idLTYcliente = ? AND LTYselect.selector = ?
                                      ORDER BY LTYselect.detalle ASC;";
      $stmtSelect = $conn->prepare($sqlSelect);
      if (!$stmtSelect) {
        throw new RuntimeException("Error al preparar la consulta SELECT: " . $conn->error);
      }
      $stmtSelect->bind_param("ii", $idLTYcliente, $selector);
      $stmtSelect->execute();
      $result = $stmtSelect->get_result();
      $updatedRecords = [];


      // ✅ Verificar si $result es un objeto válido antes de usar fetch_assoc()
      $updatedRecords = [];
      if ($result instanceof mysqli_result) {
        while ($row = $result->fetch_assoc()) {
          // $updatedRecords[] = array_values($row);
          $updatedRecords[] = array_map(fn($value) => is_numeric($value) ? (int) $value : $value, array_values($row));
        }
      } else {
        error_log("Error en la consulta: " . $stmtSelect->error);
      }
      $last_id = (int) $conn->insert_id;
      // while ($row = $result->fetch_assoc()) {
      //   $updatedRecords[] = array_values($row);
      // }
      $response = array('success' => true, 'message' => 'Se agregó la nueva variable.', 'id' => $last_id, 'array' => $updatedRecords);
    } else {
      $response = array('success' => false, 'message' => 'No se agregó la nueva variable.');
    }

    $stmt->close();
    $conn->close();

    header('Content-Type: application/json');
    echo  json_encode($response);
    return $response;
    // Cerrar la declaración y la conexión


  } catch (\Throwable $e) {
    error_log("Error al insertar nueva variable: " . $e);
    print "Error!: " . $e->getMessage() . "<br>";
    return ['success' => false, 'message' => "Error en la ejecución de la consulta: " . $e->getMessage()];
  }
}

header("Content-Type: application/json; charset=utf-8");
$datos = file_get_contents("php://input");
// $datos = '{"ruta":"/addVariable","rax":"&new=Wed Jul 10 2024 20:30:35 GMT-0300 (hora estándar de Argentina)","objeto":{"selector":1,"nombre":"PRIORIDAD","orden":3,"concepto":"Baja","idLTYcliente":15}}';
if ($datos === false) {
  $datos = '';
}

$data = json_decode($datos, true);
if (!is_array($data)) {
  echo json_encode(['success' => false, 'message' => 'Formato de datos incorrecto.']);
  exit;
}
$objeto = isset($data['objeto']) && is_array($data['objeto'])
  ? array_filter($data['objeto'], fn($key) => is_string($key), ARRAY_FILTER_USE_KEY)
  : [];
addVariable($objeto);
