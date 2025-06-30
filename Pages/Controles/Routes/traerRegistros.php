<?php
// ini_set('display_errors', '1');
// ini_set('display_startup_errors', '1');
// error_reporting(E_ALL);
$sql = '';

function traer(string $q, int $sqlI, int $nivel): string
{
  $porciones = explode(",", $q);


  switch ($porciones[0]) {

    case 'traerReportes':
      $sql = "SELECT   LTYreporte.nombre, LTYreporte.idLTYreporte, LTYreporte.detalle 
                  ,IFNULL((SELECT MAX(LTYregistrocontrol.fecha) FROM LTYregistrocontrol WHERE  LTYregistrocontrol.idLTYreporte=LTYreporte.idLTYreporte),'.')  AS ULTIMA_FECHA
                  ,LTYreporte.rotulo1 AS CIA, LTYreporte.elaboro, LTYreporte.reviso, LTYreporte.aprobo, LTYreporte.regdc, LTYreporte.vigencia, LTYreporte.cambio
                  ,LTYreporte.modificacion, LTYreporte.version,LTYreporte.rotulo3,LTYreporte.nivel,LTYreporte.envio_mail
                  ,IFNULL((SELECT MIN(LTYregistrocontrol.fecha) FROM LTYregistrocontrol WHERE  LTYregistrocontrol.idLTYreporte=LTYreporte.idLTYreporte),'.')  AS PRIMERA_FECHA
                  , RAND(),NOW()
                  , tipousuario.tipo AS nivel
                  FROM LTYreporte
                  LEFT JOIN tipousuario ON tipousuario.idtipousuario=LTYreporte.nivel  
                  WHERE LTYreporte.idLTYcliente = " . $sqlI . " AND LTYreporte.activo='s' AND LTYreporte.nivel <= " . $nivel . " ORDER BY LTYreporte.nombre ASC;";
      break;

    case 'verificarControl':
      $nuxpedido = $porciones[1];
      $sql = "SELECT  DISTINCT(c.idLTYreporte) AS reporte, LTYreporte.nombre 
                FROM LTYregistrocontrol c 
                INNER JOIN LTYreporte ON LTYreporte.idLTYreporte=c.idLTYreporte
                WHERE c.nuxpedido='" . $nuxpedido . "';";
      break;

    default:
      # code...
      break;
  }


  require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
  /** @var string $baseDir */
  $baseDir = BASE_DIR;

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
  // include_once $_SERVER['DOCUMENT_ROOT']."/Routes/datos_base.php";
  // $pdo = new PDO("mysql:host={$host};dbname={$dbname};port={$port};chartset={$charset}",$user,$password);

  try {
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
    $arr_customers = [];
    // $result = mysqli_query($con, $sql);
    // $cantidadcampos = mysqli_num_fields($result);
    $result = mysqli_query($con, $sql);

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
    error_log("Error al traer registros. Consulta: " . (string) $sql);
    print "Error!: " . $e->getMessage() . "<br>";
    die();
  }
}




header("Content-Type: application/json; charset=utf-8");
$datos = file_get_contents("php://input");
// $datos = '{"q":"traerReportes","ruta":"/traerControles","rax":"&new=Sun Apr 07 2024 20:13:49 GMT-0300 (hora estándar de Argentina)","sqlI":null}';
// $datos = '{"q":"verificarControl,250222043950775","ruta":"/traerControles","rax":"&new=Mon Feb 24 2025 08:58:31 GMT-0600 (hora estándar central)","sqlI":null, "niv": null}';

if (empty($datos)) {
  $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
  echo json_encode($response);
  exit;
}
$data = json_decode($datos, true);

if (is_array($data)) {
  $q = is_string($data['q']) ? $data['q'] : '';
  $sqlI = is_int($data['sqlI']) ? $data['sqlI'] : 0;
  $nivel = is_int($data['niv']) ? $data['niv'] : 0;
  // Verifica que los valores sean válidos antes de llamar a la función
  if ($q !== '') {
    traer($q, (int)$sqlI, $nivel);
  } else {
    echo "Datos inválidos para insertar registro.";
    error_log('Datos inválidos: q=' . json_encode($datos) . ', sqlI=' . json_encode($sqlI));
  }
} else {
  echo "Error al decodificar la cadena JSON";
  error_log('ix-JSON response: ' . "Error al decodificar la cadena JSON");
}
