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

    case 'traerLTYcontrol':
      $sql = "SELECT 
                            UPPER(rep.nombre) AS reporte,
                            IFNULL(con.idLTYcontrol, '') AS id,
                            IFNULL(con.control, '') AS control,
                            IFNULL(con.nombre, '') AS nombre,
                            IFNULL(con.tipodato, '') AS tipodedato,
                            IFNULL(con.detalle, '') AS detalle,
                            IFNULL(con.activo, '') AS activo,
                             IFNULL(con.requerido, '') AS requerido,
                            IFNULL(con.visible, '') AS campo_visible,
                            IFNULL(con.enable1, '') AS enabled,
                            IFNULL(con.orden, '') AS orden,
                            IFNULL(con.separador, '') AS separador,
                            IFNULL(con.ok, '') AS oka,
                            IFNULL(con.valor_defecto, '') AS valorDefecto,
                            IFNULL(con.selector, '') AS selector,
                            IFNULL(con.tiene_hijo, '') AS tieneHijo,
                            IFNULL(con.rutina_hijo, '') AS rutinaHijo,
                            IFNULL(con.valor_sql, '') AS valorSql,
                            IFNULL(con.tpdeobserva, '') AS tipopdeobserva,
                            IFNULL(con.selector2, '') AS selector2,
                            IFNULL(con.valor_defecto22, '') AS valorDefecto22,
                            IFNULL(con.sql_valor_defecto22, '') AS sqlValorDefecto,
                            IFNULL(con.rutinasql, '') AS rutinaSql,
                            IFNULL(rep.idLTYreporte, '') AS idLTYreporte,
                            IFNULL(con.tipoDatoDetalle, '') AS tipoDatoDetalle
                          FROM LTYreporte rep
                            LEFT JOIN LTYcontrol con ON con.idLTYreporte = rep.idLTYreporte
                          WHERE rep.activo = 's' and rep.idLTYcliente = " . $sqlI . "
                            ORDER BY rep.nombre ASC, con.orden ASC;";
      break;

    case 'traerTipoDeUsuario':
      $sql = "SELECT c.idtipousuario AS 'ID', c.tipo AS 'TIPO', c.detalle AS 'DETALLE' FROM tipousuario c ORDER BY c.idtipousuario ASC;";
      break;

    case 'traerSelects':
      $sql = "SELECT 
                            sel.selector AS selector,
                            sel.detalle AS con
                          FROM LTYselect sel 
                          WHERE sel.idLTYcliente = " . $sqlI . "
                          GROUP BY sel.detalle
                          ORDER BY sel.detalle ASC;";
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

    if (!$con) {
      return [];
    }

    mysqli_query($con, "SET NAMES 'utf8'");
    mysqli_select_db($con, $dbname);

    $result = mysqli_query($con, $sql);
    $arr_customers = [];
    // $cantidadcampos = mysqli_num_fields($result);
    $contador = 0;

    if ($result instanceof mysqli_result) {
      $arr_customers = [];

      while ($row = mysqli_fetch_array($result, MYSQLI_NUM)) { // ✅ Usamos MYSQLI_NUM para obtener solo índices numéricos
        $arr_customers[] = $row;
      }
    } else {
      $arr_customers = [];
    }

    mysqli_close($con);
    $json = json_encode($arr_customers);
    echo $json;
    return $arr_customers;
  } catch (\PDOException $e) {
    error_log("Error al traer registros. Error: " . $sql . " Cliente: " . $sqlI);
    print "Error!: " . $e->getMessage() . "<br>";
    die();
  }
}




header("Content-Type: application/json; charset=utf-8");
$datos = file_get_contents("php://input");
// $datos = '{"q":"traerLTYcontrol","ruta":"/traerLTYcontrol","rax":"&new=Mon Feb 03 2025 11:07:08 GMT-0300 (hora estándar de Argentina)","sqlI":15}';
// $datos = '{"q":"traerSelects","ruta":"/traerLTYcontrol","rax":"&new=Fri May 24 2024 10:08:27 GMT-0300 (hora estándar de Argentina)","sqlI":null}';
if ($datos === false) {
  $datos = '';
}

if (trim($datos) === '') { // ✅ Verifica que $datos esté realmente vacío
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
