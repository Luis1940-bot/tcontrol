<?php

/**
 * Verifica el supervisor y devuelve los datos.
 *
 * @param string $q Consulta específica.
 * @param mixed $sqlI Puede ser null, un número o una cadena.
 * @return void
 * @throws InvalidArgumentException Si $sqlI no es válido.
 */
function traer(string $q, $sqlI): void
{
  if (is_null($sqlI)) {
    $sqlI = '';
  } elseif (!is_string($sqlI) && !is_int($sqlI)) {
    throw new InvalidArgumentException('El parámetro $sqlI debe ser una cadena, un entero o null.');
  }
  $sqlI = urldecode((string) $sqlI);
  if (empty($q)) {
    throw new InvalidArgumentException('El parámetro $q no puede estar vacío.');
  }
  $porciones = explode(",", $q);
  $sql = '';
  switch ($porciones[0]) {

    case 'traerVariables':
      $sql = "SELECT  LTYselect.idLTYselect, LTYselect.detalle, LTYselect.concepto, LTYselect.activo
                            ,LTYselect.selector, LTYselect.orden, LTYselect.nivel, RAND(),NOW() 
                            FROM LTYselect 
                            WHERE LTYselect.idLTYcliente = " . $sqlI . "
                            ORDER BY LTYselect.detalle ASC;";
      break;

    case 'traerSelectReporte':
      $sql = "SELECT 
                           
                          sRep.idLTYselectReporte,
                          sRep.selector,
                          sRep.idLTYreporte,
                          rep.nombre AS reporteNombre,
                          sRep.idusuario,
                          tu.tipo AS tipoUsuario,
                          sRep.activo
                        FROM 
                          LTYselectReporte sRep
                          INNER JOIN LTYreporte rep ON rep.idLTYreporte = sRep.idLTYreporte
                          INNER JOIN tipousuario tu ON tu.idtipousuario = sRep.idusuario
                        WHERE 
                          rep.idLTYcliente = " . $sqlI . " AND
                          rep.activo = 's';";
      break;

    case 'traerReporteParaVincular':
      $sql = "SELECT 
                             
                            rep.idLTYreporte AS id,
                            rep.nombre AS reporte,
                            rep.nivel AS tUsuario,
                            tUsu.tipo AS tipo
                          FROM 
                            LTYreporte rep
                            INNER JOIN tipousuario tUsu ON tUsu.idtipousuario = rep.nivel
                          WHERE 
                            rep.idLTYcliente = " . $sqlI . " AND
                            rep.activo = 's'
                          ORDER BY id ASC;";
      break;

    default:
      throw new InvalidArgumentException('El tipo de consulta no es válido.');
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
  // include_once $_SERVER['DOCUMENT_ROOT']."/Routes/datos_base.php";
  // $pdo = new PDO("mysql:host={$host};dbname={$dbname};port={$port};chartset={$charset}",$user,$password);

  try {
    $host = $host ?? null;
    $user = $user ?? null;
    $password = $password ?? null;
    $dbname = $dbname ?? null;

    if (!is_string($host) || !is_string($user) || !is_string($password) || !is_string($dbname)) {
      throw new RuntimeException('Los datos de conexión a la base de datos no están configurados correctamente.');
    }

    $con = mysqli_connect($host, $user, $password, $dbname);
    if (!$con) {
      throw new RuntimeException('Error al conectar con la base de datos: ' . mysqli_connect_error());
    }

    mysqli_query($con, "SET NAMES 'utf8'");
    mysqli_select_db($con, $dbname);

    $result = mysqli_query($con, $sql);
    if (!$result || !($result instanceof mysqli_result)) {
      throw new RuntimeException('Error en la consulta SQL: ' . mysqli_error($con));
    }
    $arr_customers = [];
    $cantidadcampos = mysqli_num_fields($result);
    $contador = 0;
    while ($row = mysqli_fetch_array($result)) {

      //******************************************** */
      for ($x = 0; $x <= $cantidadcampos - 1; $x++) {
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
    error_log("Error al traer registros: " . $sql . " De la planta: " . $sqlI);
    print "Error!: " . $e->getMessage() . "<br>";
    die();
  }
}




header("Content-Type: application/json; charset=utf-8");
$datos = file_get_contents("php://input");
// $datos = '{"q":"traerReportes","ruta":"/traerControles","rax":"&new=Sun Apr 07 2024 20:13:49 GMT-0300 (hora estándar de Argentina)","sqlI":null}';

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

// ✅ Asignamos valores con seguridad
$q = isset($data['q']) && is_string($data['q']) ? $data['q'] : '';
$sqlI = isset($data['sqlI']) && is_numeric($data['sqlI']) ? (int) $data['sqlI'] : 0;

traer($q, $sqlI);
