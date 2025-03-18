<?php
// include('datos.php');

/**
 * Verifica el supervisor y devuelve los datos.
 *
 * @param string $q Consulta específica.
 * @param mixed $sqlI Puede ser null, un número o una cadena.
 * @return void
 * @throws InvalidArgumentException Si $sqlI no es válido.
 */
function traer(string $q,  $sqlI): void
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

  // Ya no es necesario validar $porciones[0], ya que siempre existe.

  $sql = '';
  switch ($porciones[0]) {

    case 'empresa':
      $sql = "SELECT c.cliente FROM LTYcliente c WHERE c.idLTYcliente =" . $sqlI . ";";
      break;

    case 'NuevoControl':
      $sql = "SELECT   'ID',LTYcontrol.idLTYcontrol AS id, LTYcontrol.control AS CONTROL_1, LTYcontrol.nombre AS NOMBRE,'RELEVAMIENTO', LTYcontrol.tipodato AS TIPO, 
                          LTYcontrol.detalle AS DETALLE, 'OBSERVACION', LTYcontrol.visible AS VISIBLE, LTYcontrol.tpdeobserva AS TPDOBSV,'valorOBS','idselector1', LTYcontrol.selector AS SELECTOR, 'valorSEL','idselector2',
                          LTYcontrol.selector2 AS SELECTOR2,'valorSEL2', LTYcontrol.separador AS SEPARADOR, LTYreporte.botonesaccion, IFNULL(LTYcontrol.rutinasql,'') AS RUTINA, IFNULL(LTYcontrol.valor_defecto,'') AS VALOR_DEFECTO
                          ,LTYcontrol.requerido AS REQUERIDO,LTYreporte.envio_mail AS X_MAIL,LTYcontrol.valor_sql AS VALOR_SQL
                          , LTYcontrol.tiene_hijo AS HIJO, LTYcontrol.rutina_hijo AS SQL_HIJO, LTYcontrol.valor_defecto22 AS VALOR_DEFECTO22, LTYcontrol.sql_valor_defecto22 AS SQL_VALOR_DEFECTO22, LTYreporte.direcciones_mail AS DIR_MAIL
                          ,LTYcontrol.enable1 AS ENABLE, RAND(),NOW(),'idLTY' ,LTYcontrol.tipoDatoDetalle AS TIPO_DATO_DETALLE
                          FROM LTYcontrol  
                          RIGHT JOIN LTYreporte ON LTYcontrol.idLTYreporte=LTYreporte.idLTYreporte
                          WHERE LTYcontrol.idLTYreporte=" . $porciones[1] . "  AND LTYcontrol.activo='s'
                          ORDER BY orden ASC, idLTYcontrol ASC;";
      break;

    case 'Selectores':
      // SE USA PARA LA CARGA DE LOS SELECTORES
      $sql = "SELECT  LTYselect.idLTYselect AS ID, LTYselect.concepto AS CONCEPT, LTYselect.selector AS SELEC, LTYselect.detalle AS DETALLE, RAND(),NOW()
                          FROM LTYselectReporte 
                          INNER JOIN LTYselect ON LTYselectReporte.selector=LTYselect.selector
                          WHERE LTYselect.activo='s' AND LTYselectReporte.idLTYreporte=" . $porciones[1] . " ORDER BY LTYselect.orden ASC;";
      break;

    case 'ctrlCargado':
      $control_cargado = $porciones[1];
      $sql = "SELECT  LTYregistrocontrol.fecha AS FECHA, LTYregistrocontrol.hora AS HORA, LTYregistrocontrol.nuxpedido AS PEDIDO, 
                              LTYregistrocontrol.supervisor AS DISUPERVISOR, IF(LTYregistrocontrol.supervisor=0,'',u.nombre) AS NOMBRE_SUPERVISOR,
                              LTYregistrocontrol.observacion AS OBSERVACION,
                              LTYregistrocontrol.idusuario
                              ,w.nombre AS NOMBRE_USUARIO
                            ,LTYreporte.envio_mail AS X_MAIL,LTYregistrocontrol.imagenes AS IMG, LTYreporte.direcciones_mail AS DIR_MAIL
                            , RAND(),NOW(), LTYregistrocontrol.idLTYregistrocontrol AS ID, LTYregistrocontrol.newJSON AS newJSON
                              FROM LTYregistrocontrol
                              LEFT JOIN usuario u ON LTYregistrocontrol.supervisor=u.idusuario 
                              LEFT JOIN usuario w ON LTYregistrocontrol.idusuario=w.idusuario
                              INNER JOIN LTYreporte ON LTYreporte.idLTYreporte=LTYregistrocontrol.idLTYreporte
                              WHERE LTYregistrocontrol.nuxpedido=" . $control_cargado . ";";
      // echo $sql.'<br><br>';".$control_cargado."
      break;

    case 'img21':
      $sql = "SELECT  LTYimage.idLTYimage, LTYimage.idLTYreporte, LTYimage.imagen, LTYimage.altura,
                          LTYimage.ancho, LTYimage.tipo, LTYimage.orden, LTYimage.detalle, RAND(),NOW()
                          FROM LTYimage
                          WHERE LTYimage.activo='s'
                          ORDER BY LTYimage.orden ASC;";
      break;

    case 'countSelect':
      $sql = "SELECT COUNT(*)
                                    FROM LTYcontrol c
                                    WHERE c.idLTYreporte = " . $porciones[1] . "
                                      AND (
                                        (c.tipodato NOT IN (TRIM('cn'), TRIM('btnqwery')))
                                        AND (c.tpdeobserva NOT IN (TRIM('cn'), TRIM('btnqwery')))
                                        AND (c.activo = 's')
                                        AND (c.visible = 's')
                                      )
                                      AND (
                                        c.rutinasql LIKE 'SELECT%'
                                        OR c.valor_defecto LIKE 'SELECT%'
                                        OR c.valor_defecto22 LIKE 'SELECT%'
                                        OR c.sql_valor_defecto22 LIKE 'SELECT%'
                                        OR c.valor_sql LIKE 'SELECT%'
                                      );";
      break;

    case 'traer_LTYsql':

      $sql = $sqlI; //$_GET['sql'];
      $sql = str_replace("+", "%2B", $sql);
      // $sql = urldecode($sql);
      $sql = rawurldecode($sql);
      // $sql = filter_var($sql, FILTER_SANITIZE_URL);
      // echo $sql.'<br>';
      break;

    default:
      throw new InvalidArgumentException('El tipo de consulta no es válido.');
  }


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

  // include_once $_SERVER['DOCUMENT_ROOT']."/Routes/datos_base.php";
  // $pdo = new PDO("mysql:host={$host};dbname={$dbname};port={$port};chartset={$charset}",$user,$password);
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
  try {

    mysqli_query($con, "SET NAMES 'utf8'");
    mysqli_select_db($con, $dbname);
    if (empty($sql)) {
      throw new RuntimeException('La consulta SQL está vacía o no es válida.');
    }

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
    $pdo = null;
  } catch (\PDOException $e) {
    error_log("Error al traer registros. Consulta: " . $sql);
    print "Error!: " . $e->getMessage() . "<br>";
    die();
  }
}

header("Content-Type: application/json; charset=utf-8");

require_once dirname(dirname(dirname(__DIR__))) . '/config.php';

$datos = file_get_contents("php://input");
// $datos = '{"q":"countSelect,14","ruta":"/traerRegistros","rax":"&new=Mon Jan 27 2025 18:37:14 GMT-0300 (hora estándar de Argentina)","sqlI":null}';

if (trim($datos) === '') {
  $response = ['success' => false, 'message' => 'Faltan datos necesarios.'];
  echo json_encode($response);
  exit;
}

$data = json_decode($datos, true);

$q = $data['q'];
$sqlI = $data['sqlI'];

traer($q, $sqlI);
