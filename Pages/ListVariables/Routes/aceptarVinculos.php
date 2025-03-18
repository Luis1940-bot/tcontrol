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
function addVinculo(array $objeto): array
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
    ob_start();

    $selector = $objeto['selector'];
    $idLTYreporte = $objeto['idLTYreporte'];
    $activo = $objeto['activo'];
    $idusuario = $objeto['idusuario'];
    $idLTYcliente = $objeto['idLTYcliente'];

    if (empty($host) || empty($user) || empty($password) || empty($dbname)) {
      throw new RuntimeException("No se han definido correctamente las credenciales de la base de datos.");
    }

    $conn = mysqli_connect($host, $user, $password, $dbname);
    if (!$conn) {
      throw new RuntimeException('Error al conectar con la base de datos: ' . mysqli_connect_error());
    };
    $sql = "INSERT INTO LTYselectReporte (selector, idLTYreporte, activo, idusuario, idLTYcliente) VALUES (?, ?, ?, ?, ?);";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
      throw new RuntimeException("Error al preparar la consulta: " . $conn->error);
    }
    $stmt->bind_param("iisii", $selector, $idLTYreporte, $activo, $idusuario, $idLTYcliente);

    if ($stmt->execute() === true) {
      $last_id = $conn->insert_id;
      $conn->commit();
      $last_id = (int) $conn->insert_id;
      $response = array('success' => true, 'message' => 'Se hizo el vinculo.', 'id' => $last_id);
    } else {
      $conn->rollback();
      $response = array('success' => false, 'message' => 'No se hizo el vinculo.');
    }
    $stmt->close();
    $conn->close();
    ob_end_clean();
    header('Content-Type: application/json');
    echo  json_encode($response);
    return $response;
    // Cerrar la declaración y la conexión


  } catch (\Throwable $e) {
    error_log("Error al aceptar vinculos: " . $e);
    print "Error!: " . $e->getMessage() . "<br>";
    die();
  }
}

header("Content-Type: application/json; charset=utf-8");
$datos = file_get_contents("php://input");
// $datos = '{"ruta":"/addVariable","rax":"&new=Mon May 06 2024 08:42:24 GMT-0300 (hora estándar de Argentina)","objeto":{"selector":"32","nombre":"COMPORTAMIENTO","orden":4,"concepto":"riesgo"}}';
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
addVinculo($objeto);
