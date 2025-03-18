<?php
// ini_set('display_errors', '1');
// ini_set('display_startup_errors', '1');
// error_reporting(E_ALL);
require_once dirname(dirname(dirname(__DIR__))) . '/ErrorLogger.php';
ErrorLogger::initialize(dirname(dirname(dirname(__DIR__))) . '/logs/error.log');
require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
/** @var string $baseDir */
$baseDir = BASE_DIR;
/** 
 * @var array{timezone?: string} $_SESSION 
 */
if (isset($_SESSION['timezone']) && is_string($_SESSION['timezone'])) {
  date_default_timezone_set($_SESSION['timezone']);
} else {
  date_default_timezone_set('America/Argentina/Buenos_Aires');
}

function eliminaNuxPedido(string $nux, int $sqlI): void
{
  $numFilasDeleteadas = 0;
  include_once BASE_DIR . "/Routes/datos_base.php";
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
  // include_once $_SERVER['DOCUMENT_ROOT']."/Routes/datos_base.php";
  $pdo = new PDO("mysql:host={$host};dbname={$dbname};port={$port};charset={$charset}", $user, $password, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
  $sql = "DELETE FROM LTYregistrocontrol WHERE nuxpedido = ?";
  try {
    $pdo->beginTransaction();
    $sentencia = $pdo->prepare($sql);
    $sentencia->execute([$nux]);
    $numFilasDeleteadas = $sentencia->rowCount();
    $pdo->commit();
  } catch (PDOException $e) {
    error_log("Error al eliminar: " . $nux);
    $pdo->rollBack();
    $response = array('success' => false, 'message' => 'Algo salió mal no hay registros eliminados');
    echo json_encode($response);
    die("Error en la ejecución de la consulta: " . $e->getMessage());
  } finally {
    $response = array('success' => true, 'message' => 'La operación fue exitosa con la eliminación del registro', 'registros' => $numFilasDeleteadas, 'documento' => $nux);
    echo json_encode($response);
  }
}

header("Content-Type: application/json; charset=utf-8");

$datos = file_get_contents("php://input");
// $datos = '{"q":250227184854080,"ruta":"/ex2024","rax":"&new=Thu Feb 27 2025 15:52:09 GMT-0600 (hora estándar central)","sqlI":null}';
// echo $datos;

if (empty($datos)) {
  $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
  echo json_encode($response);
  exit;
}
$data = json_decode($datos, true, 512, JSON_BIGINT_AS_STRING);

// error_log('Pages/ControlViews/Routes/eliminaRegistr-JSON response: ' . json_encode($data));

if (is_array($data)) {
  $nux = is_string($data['q']) ? $data['q'] : '';
  $sqlI = is_int($data['sqlI']) ? $data['sqlI'] : 0;

  // Verifica que los valores sean válidos antes de llamar a la función
  if ($nux !== '') {
    eliminaNuxPedido($nux, $sqlI);
  } else {
    echo "Datos inválidos para insertar registro.";
    error_log('Datos inválidos: q=' . json_encode($datos) . ', sqlI=' . json_encode($sqlI));
  }
} else {
  echo "Error al decodificar la cadena JSON";
  error_log('ix-JSON response: ' . "Error al decodificar la cadena JSON");
}
