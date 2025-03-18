<?php
// ini_set('display_errors', '1');
// ini_set('display_startup_errors', '1');
// error_reporting(E_ALL);
$sql = '';
function traer(string $q, int $sqlI): string
{

  // $variable=$_GET['q'];
  $porciones = explode(",", $q);
  $operacion = $porciones[0];

  switch ($operacion) {
    case 'traerControles':
      $reporte = $porciones[1];
      $sql = "SELECT  LTYregistrocontrol.fecha,LTYregistrocontrol.nuxpedido,date_format(LTYregistrocontrol.hora,'%H:%i') as hora,LTYregistrocontrol.observacion,
                      usuario.nombre, RAND(),NOW()  
                      FROM LTYregistrocontrol 
                      INNER JOIN usuario ON LTYregistrocontrol.idusuario=usuario.idusuario
                      WHERE LTYregistrocontrol.idLTYreporte=" . $reporte . " 
                      GROUP BY LTYregistrocontrol.nuxpedido
                      ORDER BY LTYregistrocontrol.fecha DESC, LTYregistrocontrol.hora DESC LIMIT 1000;";
      break;

    case 'traerControlesFechas':
      $reporte = $porciones[1];
      $fechaInicial = $porciones[2];
      $fechaActual = $porciones[3];
      $sql = "SELECT  LTYregistrocontrol.fecha,LTYregistrocontrol.nuxpedido,date_format(LTYregistrocontrol.hora,'%H:%i') as hora,LTYregistrocontrol.observacion,
                      usuario.nombre, RAND(),NOW()  
                      FROM LTYregistrocontrol 
                      INNER JOIN usuario ON LTYregistrocontrol.idusuario=usuario.idusuario
                      WHERE LTYregistrocontrol.idLTYreporte=" . $reporte . " AND 
                      LTYregistrocontrol.fecha>='" . $fechaInicial . "' AND LTYregistrocontrol.fecha<='" . $fechaActual . "' 
                      GROUP BY LTYregistrocontrol.nuxpedido
                      ORDER BY LTYregistrocontrol.fecha DESC, LTYregistrocontrol.hora DESC;";
      break;

    case 'NuevoControl':
      $reporte = $porciones[1];
      $sql = "SELECT  'ID',LTYcontrol.idLTYcontrol AS id, LTYcontrol.control AS CONTROL_1, LTYcontrol.nombre AS NOMBRE,'RELEVAMIENTO', LTYcontrol.tipodato AS TIPO, 
                    LTYcontrol.detalle AS DETALLE, 'OBSERVACION', LTYcontrol.visible AS VISIBLE, LTYcontrol.tpdeobserva AS TPDOBSV
                    ,LTYcontrol.requerido AS REQUERIDO
                    ,LTYcontrol.enable1 AS ENABLE, RAND(),NOW()
                    FROM LTYcontrol  
                    RIGHT JOIN LTYreporte ON LTYcontrol.idLTYreporte=LTYreporte.idLTYreporte
                    WHERE LTYcontrol.idLTYreporte=" . $reporte . "  AND LTYcontrol.activo='s'
                    ORDER BY orden ASC, idLTYcontrol ASC;";
      break;

    case 'ctrlCargado':
      $reporte = $porciones[1];
      $sql = "SELECT 
                  JSON_UNQUOTE(JSON_EXTRACT(LTYregistrocontrol.newJSON, '$.fecha[0]')) AS FECHA,
                  JSON_UNQUOTE(JSON_EXTRACT(LTYregistrocontrol.newJSON, '$.nuxpedido[0]')) AS PEDIDO,
                  JSON_UNQUOTE(JSON_EXTRACT(LTYregistrocontrol.newJSON, CONCAT('$.name[', idx.n, ']'))) AS DESVIO,
                  JSON_UNQUOTE(JSON_EXTRACT(LTYregistrocontrol.newJSON, CONCAT('$.valor[', idx.n, ']'))) AS VALOR,
                  JSON_UNQUOTE(JSON_EXTRACT(LTYregistrocontrol.newJSON, CONCAT('$.tipodedato[', idx.n, ']'))) AS TIPODEDATO,
                  JSON_UNQUOTE(JSON_EXTRACT(LTYregistrocontrol.newJSON, CONCAT('$.idLTYcontrol[', idx.n, ']'))) AS IDCONTROL,
                  LTYregistrocontrol.supervisor AS DISUPERVISOR,
                  IF(LTYregistrocontrol.supervisor = 0, '', u.nombre) AS NOMBRE_SUPERVISOR,
                  JSON_UNQUOTE(JSON_EXTRACT(LTYregistrocontrol.newJSON, CONCAT('$.tpdeobserva[', idx.n, ']'))) AS TIPO_OBSERVA,
                  JSON_UNQUOTE(JSON_EXTRACT(LTYregistrocontrol.newJSON, CONCAT('$.observacion[', idx.n, ']'))) AS OBSERVACION,
                  LTYregistrocontrol.idusuario,
                  w.nombre AS NOMBRE_USUARIO,
                  LTYcontrol.requerido AS REQUERIDO,
                  LTYcontrol.tiene_hijo AS HIJO,
                  JSON_UNQUOTE(JSON_EXTRACT(LTYregistrocontrol.newJSON, CONCAT('$.imagenes[', idx.n, ']'))) AS IMG,
                  LTYreporte.direcciones_mail AS DIR_MAIL,
                  RAND() AS RANDOM_VALUE,
                  NOW() AS FECHA_CONSULTA,
                  LTYregistrocontrol.idLTYregistrocontrol AS ID,
                  LTYcontrol.nombre AS NOMBRE
              FROM LTYregistrocontrol
              JOIN (
                  SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL 
                  SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL 
                  SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL 
                  SELECT 15 UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19 UNION ALL 
                  SELECT 20 UNION ALL SELECT 21 UNION ALL SELECT 22 UNION ALL SELECT 23 UNION ALL SELECT 24 UNION ALL 
                  SELECT 25 UNION ALL SELECT 26 UNION ALL SELECT 27 UNION ALL SELECT 28 UNION ALL SELECT 29 
              ) AS idx  -- Genera una tabla con números del 0 al 29 para recorrer los arrays
              ON JSON_UNQUOTE(JSON_EXTRACT(LTYregistrocontrol.newJSON, CONCAT('$.idLTYcontrol[', idx.n, ']'))) IS NOT NULL
              LEFT JOIN usuario u ON LTYregistrocontrol.supervisor = u.idusuario
              LEFT JOIN usuario w ON LTYregistrocontrol.idusuario = w.idusuario
              INNER JOIN LTYcontrol 
                  ON LTYcontrol.idLTYcontrol = JSON_UNQUOTE(JSON_EXTRACT(LTYregistrocontrol.newJSON, CONCAT('$.idLTYcontrol[', idx.n, ']')))
              INNER JOIN LTYreporte ON LTYreporte.idLTYreporte = LTYregistrocontrol.idLTYreporte
              WHERE LTYregistrocontrol.nuxpedido = " . $reporte . "
              ORDER BY LTYcontrol.orden ASC, LTYregistrocontrol.idLTYregistrocontrol ASC;";
      break;

    case 'controlNT':
      $reporte = $porciones[1];
      $sql = "SELECT DISTINCT r.idLTYreporte, r.nombre
                              FROM LTYregistrocontrol c
                              INNER JOIN LTYreporte r ON r.idLTYreporte = c.idLTYreporte
                              WHERE c.nuxpedido = " . $reporte . ";";
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
  // include_once '../../../Routes/datos_base.php';
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
    $result = mysqli_query($con, $sql);

    // ✅ Verificar si la consulta falló
    if ($result === false) {
      die("Error en la consulta: " . mysqli_error($con));
    }


    $arr_customers = [];

    if ($result instanceof mysqli_result) {
      while ($row = mysqli_fetch_assoc($result)) {
        $arr_customers[] = array_values($row);
      }
    }
    // $json = json_encode($arr_customers);
    // echo $json;

    mysqli_close($con);
    $jsonResponse = json_encode($arr_customers);
    echo $jsonResponse !== false ? $jsonResponse : '{"success":false,"message":"Error al codificar JSON"}';

    // ✅ Retornamos una cadena vacía para evitar errores en PHPStan
    return '';
  } catch (\PDOException $e) {
    /** @var string $sql */
    error_log("Error al traer registros. "  . $sql . " Error: " . $e);
    print "Error!: " . $e->getMessage() . "<br>";
    die();
  }
}



header("Content-Type: application/json; charset=utf-8");
$datos = file_get_contents("php://input");
// $datos = '{"q":"ctrlCargado,250128202858454","ruta":"/traerCargados","rax":"&new=Thu Jan 30 2025 07:13:33 GMT-0300 (hora estándar de Argentina)","sqlI":null}';
// $datos = '{"q":"traerControles,14","ruta":"/traerCargados","rax":"&new=Thu Jan 30 2025 11:25:33 GMT-0300 (hora estándar de Argentina)","sqlI":15}';

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
