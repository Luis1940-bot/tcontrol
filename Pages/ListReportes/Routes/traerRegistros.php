<?php
// ini_set('display_errors', '1');
// ini_set('display_startup_errors', '1');
// error_reporting(E_ALL);

/**
 * @return array<int, array<int|string, mixed>>
 */
function traer(string $q, int $sqlI): array
{
  $porciones = explode(",", $q);
  $sql = '';

  switch ($porciones[0]) {

    case 'traerReportes':
      $sql = "SELECT   LTYreporte.nombre, LTYreporte.idLTYreporte, LTYreporte.detalle 
                  ,IFNULL((SELECT MAX(LTYregistrocontrol.fecha) FROM LTYregistrocontrol WHERE  LTYregistrocontrol.idLTYreporte=LTYreporte.idLTYreporte),'.')  AS ULTIMA_FECHA
                  ,LTYreporte.rotulo1 AS CIA, LTYreporte.elaboro, LTYreporte.reviso, LTYreporte.aprobo, LTYreporte.regdc, LTYreporte.vigencia, LTYreporte.cambio
                  ,LTYreporte.modificacion, LTYreporte.version, LTYreporte.rotulo3, LTYreporte.nivel, LTYreporte.envio_mail
                  ,IFNULL((SELECT MIN(LTYregistrocontrol.fecha) FROM LTYregistrocontrol WHERE  LTYregistrocontrol.idLTYreporte=LTYreporte.idLTYreporte),'.')  AS PRIMERA_FECHA
                  , RAND(),NOW()
                  , tipousuario.tipo AS nivel, LTYreporte.activo AS situacion, LTYreporte.rotulo2, LTYreporte.piedeinforme, LTYreporte.frecuencia, LTYreporte.direcciones_mail, LTYreporte.titulo, LTYreporte.firma1, LTYreporte.firma2
                  , LTYreporte.idLTYarea
                  FROM LTYreporte
                  LEFT JOIN tipousuario ON tipousuario.idtipousuario=LTYreporte.nivel  
                  WHERE LTYreporte.idLTYcliente = " . $sqlI . "
                  ORDER BY LTYreporte.nombre ASC;";
      break;

    case 'traerTipoDeUsuario':
      $sql = "SELECT c.idtipousuario AS 'ID', c.tipo AS 'TIPO', c.detalle AS 'DETALLE' FROM tipousuario c ORDER BY c.idtipousuario ASC;";
      break;

    case 'traerAreas':
      $sql = "SELECT c.idLTYarea AS 'ID', c.areax AS 'AREA' FROM LTYarea c WHERE c.activo='s' AND c.idLTYcliente = " . $sqlI . " ORDER BY c.areax ASC;";
      break;

    default:
      return [];
  }


  require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
  /** @var string $baseDir */
  $baseDir = BASE_DIR;
  include_once $baseDir . "/Routes/datos_base.php";
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


  try {
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
    if (!$con) {
      return [];
    };

    mysqli_query($con, "SET NAMES 'utf8'");
    mysqli_select_db($con, $dbname);

    $result = mysqli_query($con, $sql);
    $arr_customers = [];
    if ($result instanceof mysqli_result) { // ✅ Verificamos que $result es válido antes de usarlo
      $cantidadcampos = mysqli_num_fields($result);
      $contador = 0;

      while ($row = mysqli_fetch_array($result, MYSQLI_NUM)) { // ✅ Usamos MYSQLI_NUM para obtener solo índices numéricos
        for ($x = 0; $x < $cantidadcampos; $x++) {
          $arr_customers[$contador][$x] = $row[$x];
        }
        $contador++;
      }
    } else {
      if (isset($conn) && $conn instanceof mysqli) { // ✅ Verificamos que $conn está definido y es un objeto mysqli
        error_log("Error en la consulta SQL: " . mysqli_error($conn));
      } else {
        error_log("Error en la consulta SQL: No se pudo obtener el mensaje de error.");
      }

      $arr_customers = []; // ✅ Devolvemos un array vacío en caso de error

    }

    $json = json_encode($arr_customers);
    echo $json;
    mysqli_close($con);
    return $arr_customers;
    // $pdo=null;

  } catch (\PDOException $e) {
    error_log("Error al traer registros: " . $sql . " En planta: " . $sqlI);
    print "Error!: " . $e->getMessage() . "<br>";
    die();
  }
}




header("Content-Type: application/json; charset=utf-8");
$datos = file_get_contents("php://input");
// $datos = '{"q":"traerReportes","ruta":"/traerControles","rax":"&new=Sun Apr 07 2024 20:13:49 GMT-0300 (hora estándar de Argentina)","sqlI":15}';
// $datos = '{"q":"traerReportes","ruta":"/traerReportes","rax":"&new=Tue May 27 2025 16:52:54 GMT-0300 (hora estándar de Argentina)","sqlI":15}';

if ($datos === false) {
  $datos = '';
}


// ✅ Validamos que la cadena JSON no esté vacía
if (trim($datos) === '') {
  echo json_encode(['success' => false, 'message' => 'Faltan datos necesarios.']);
  exit;
}

$data = json_decode($datos, true);
if (!is_array($data)) {
  echo json_encode(['success' => false, 'message' => 'Formato de datos incorrecto.']);
  exit;
}

// ✅ Asignamos valores con seguridad
$q = isset($data['q']) && is_string($data['q']) ? $data['q'] : '';
$sqlI = isset($data['sqlI']) && is_numeric($data['sqlI']) ? (int) $data['sqlI'] : 0;


// $q = $data['q'];
// $sqlI = $data['sqlI'];

traer($q, $sqlI);
