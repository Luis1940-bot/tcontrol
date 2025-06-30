<?php
// ini_set('display_errors', '1');
// ini_set('display_startup_errors', '1');
// error_reporting(E_ALL);

/**
 * @return array<int, array<int|string, mixed>>
 */
function traeComunicacion(int $idLTYReporte): array
{

  $sql = "SELECT c.idLTYComunicacion, c.idLTYreporte, c.idusuario, c.rol, c.activo, c.fecha_asignacion, u.nombre, u.mail
  FROM LTYComunicacion c
  JOIN usuario u ON c.idusuario = u.idusuario
  WHERE c.idLTYreporte = " . $idLTYReporte . " AND c.activo = 's';";


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
  $arr_customers = [];
  try {

    $con = mysqli_connect($host, $user, $password, $dbname);
    if (!$con) {
      return [];
    }

    mysqli_query($con, "SET NAMES 'utf8'");
    mysqli_select_db($con, $dbname);

    $result = mysqli_query($con, $sql);

    if (!($result instanceof mysqli_result)) {
      error_log("Error: La consulta SQL falló. " . mysqli_error($con));
      return [];
    }

    $cantidadcampos = mysqli_num_fields($result);

    $contador = 0;
    while ($row = mysqli_fetch_array($result)) {
      for ($x = 0; $x < $cantidadcampos; $x++) {
        $sincorchetes = $row[$x];
        $arr_customers[$contador][$x] = $row[$x];
      }
      $contador++;
    }

    $json = json_encode($arr_customers);
    echo $json;
    mysqli_close($con);
    // $pdo=null;

  } catch (\PDOException $e) {
    error_log("Error al traer registros. Error: " . $e);
    print "Error!: " . $e->getMessage() . "<br>";
    return [];
  }
  return $arr_customers;
}




header("Content-Type: application/json; charset=utf-8");
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

$datos = file_get_contents("php://input");
// $datos = '{"q":"traerReglasComunicacion","ruta":"/traerReglasComunicacion","rax":"&new=Mon May 26 2025 15:34:35 GMT-0300 (hora estándar de Argentina)","sqlI":"14"}';
if ($datos === false || trim($datos) === '') {
  $response = ['success' => false, 'message' => 'Faltan datos necesarios.'];
  echo json_encode($response);
  exit;
}

// Decodificar JSON y asegurarse de que es un array
$data = json_decode($datos, true);

if (!is_array($data)) {
  echo json_encode(['success' => false, 'message' => 'Error al decodificar la cadena JSON']);
  error_log('Error en JSON: ' . json_last_error_msg());
  exit;
}

// Validar existencia y tipo de los valores
$idLTYReporte = isset($data['sqlI']) && is_numeric($data['sqlI']) ? (int) $data['sqlI'] : 0;


if ($idLTYReporte === '') {
  echo json_encode(['success' => false, 'message' => 'El parámetro "q" es requerido.']);
  exit;
}

// ✅ Llamar a la función con valores seguros
traeComunicacion($idLTYReporte);
