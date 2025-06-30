<?php
// ini_set('display_errors', '1');
// ini_set('display_startup_errors', '1');
// error_reporting(E_ALL);
$sql = '';

function traer(string $q, int $sqlI): string
{
  $porciones = explode(",", $q);


  switch ($porciones[0]) {

    case 'traerLTYareas':
      $sql = "SELECT 
                              ar.idLTYarea AS id, 
                              ar.areax AS area ,
                              ar.activo AS situacion,
                              ar.visible AS visible
                            FROM LTYarea ar 
                            WHERE ar.idLTYcliente = " . $sqlI . "
                            ORDER BY ar.idLTYarea ASC;";
      break;

    case 'traerTipoDeUsuario':
      $sql = "SELECT c.idtipousuario AS 'ID', c.tipo AS 'TIPO', c.detalle AS 'DETALLE' FROM tipousuario c ORDER BY c.idtipousuario ASC;";
      break;

    default:
      # code...
      break;
  }


  require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
  include_once BASE_DIR . "/Routes/datos_base.php";
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
  try {

    $con = mysqli_connect($host, $user, $password, $dbname);
    if (!$con) { // Verifica si la conexión falló
      $errorMessage = json_encode(['success' => false, 'message' => "Conexión fallida: " . mysqli_connect_error()]);
      if ($errorMessage === false) {
        $errorMessage = '{"success":false,"message":"Error desconocido al codificar JSON"}';
      }
      return $errorMessage;
    }

    mysqli_query($con, "SET NAMES 'utf8'");
    mysqli_select_db($con, $dbname);
    /** @var string $sql */
    $result = mysqli_query($con, $sql);
    $arr_customers = [];
    // ✅ Verificar si la consulta falló
    if ($result === false) {
      die("Error en la consulta: " . mysqli_error($con));
    }

    // ✅ Verificar si $result es un `mysqli_result` antes de usar `mysqli_num_fields()`
    if ($result instanceof mysqli_result) {
      $cantidadcampos = mysqli_num_fields($result);
    } else {
      $cantidadcampos = 0;  // ✅ Para consultas `INSERT/UPDATE/DELETE`, asignamos 0
    }

    $contador = 0;
    if ($result instanceof mysqli_result) {
      while ($row = mysqli_fetch_array($result)) {

        //******************************************** */
        for ($x = 0; $x <= $cantidadcampos - 1; $x++) {
          $sincorchetes = $row[$x];
          $arr_customers[$contador][$x] = $row[$x];
        }
        $contador++;
      }
    }
    $json = json_encode($arr_customers);
    echo $json;
    mysqli_close($con);
    // $pdo=null;
    return '';
  } catch (\PDOException $e) {
    /** @var string $sql */
    error_log("Error al traer registros: " . $sql);
    print "Error!: " . $e->getMessage() . "<br>";
    die();
  }
}




header("Content-Type: application/json; charset=utf-8");
$datos = file_get_contents("php://input");
// $datos = '{"q":"traerReportes","ruta":"/traerControles","rax":"&new=Sun Apr 07 2024 20:13:49 GMT-0300 (hora estándar de Argentina)","sqlI":null}';
// $datos = '{"q":"traerSelects","ruta":"/traerLTYcontrol","rax":"&new=Fri May 24 2024 10:08:27 GMT-0300 (hora estándar de Argentina)","sqlI":null}';

if (empty($datos)) {
  $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
  echo json_encode($response);
  exit;
}
$data = json_decode($datos, true);

if (is_array($data)) {
  $q = is_string($data['q']) ? $data['q'] : '';
  $sqlI = is_int($data['sqlI']) ? $data['sqlI'] : 0;

  // Verifica que los valores sean válidos antes de llamar a la función
  if ($q !== '') {
    traer($q, (int)$sqlI);
  } else {
    echo "Datos inválidos para insertar registro.";
    error_log('Datos inválidos: q=' . json_encode($datos) . ', sqlI=' . json_encode($sqlI));
  }
} else {
  echo "Error al decodificar la cadena JSON";
  error_log('ix-JSON response: ' . "Error al decodificar la cadena JSON");
}
