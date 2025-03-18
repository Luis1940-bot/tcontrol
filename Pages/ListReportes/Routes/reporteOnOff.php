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
 * Agrega un nuevo campo en la base de datos y devuelve el estado de la operación.
 *
 * @param string $activo
 * @param int $id
 * @return array{success: bool, actualizado?: array<string, mixed>, message?: string}
 */
function onOff(int $id, string $activo): array
{
  try {
    require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
    /** @var string $baseDir */
    $baseDir = BASE_DIR;
    include_once $baseDir . "/Routes/datos_base.php";

    $activo = ($activo === 's') ? 'n' : 's';

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
    $conn = mysqli_connect($host, $user, $password, $dbname);
    if (!$conn) {
      throw new RuntimeException('Error al conectar con la base de datos: ' . mysqli_connect_error());
    }
    $sql = "UPDATE LTYreporte SET activo = ? WHERE idLTYreporte = ?";

    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
      die("Error al preparar la consulta: " . $conn->error);
    }
    $stmt->bind_param("si", $activo, $id);

    if ($stmt->execute() === true) {
      $response = array('success' => true, 'message' => 'Se actualizo la situación del reporte.');
    } else {
      $response = array('success' => false, 'message' => 'No se actualizo la situación del reporte.');
    }
    $stmt->close();
    $conn->close();

    header('Content-Type: application/json');
    echo  json_encode($response);
    // Cerrar la declaración y la conexión


  } catch (\Throwable $e) {
    error_log("Error en on off reporte. Error: " . $e);
    print "Error!: " . $e->getMessage() . "<br>";
    return ['success' => false, 'message' => "Error en la ejecución de la consulta: " . $e->getMessage()];
  }
  return $response;
}

header("Content-Type: application/json; charset=utf-8");
$datos = file_get_contents("php://input");
// $datos = '{"q":"4","ruta":"/reporteOnOff","rax":"&new=Fri Apr 26 2024 09:39:17 GMT-0300 (hora estándar de Argentina)","activo":"s"}';

if (empty($datos)) {
  $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
  echo json_encode($response);
  exit;
}
$data = json_decode($datos, true);
// ✅ Verificar si `json_decode` falló
if (!is_array($data)) {
  echo json_encode(['success' => false, 'message' => 'Error al decodificar la cadena JSON.']);
  exit;
}
$q = isset($data['q']) && is_int($data['q']) ? $data['q'] : 0;
$activo = isset($data['activo']) && is_string($data['activo']) ? $data['activo'] : '';
onOff($q, $activo);
