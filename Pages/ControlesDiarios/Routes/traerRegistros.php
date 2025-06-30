<?php
function traer(int $planta): string
{


  $sql = "SELECT  
  reg.fecha AS 'Fecha',
  DATE_FORMAT(reg.hora, '%H:%i') AS 'Hora',
  reg.idLTYreporte AS 'Num Formato',
  l.nombre AS 'Formato',
  reg.nuxpedido AS 'DOC',
  u.nombre AS 'Usuario',
  a.areax as 'Área'
FROM LTYregistrocontrol reg
INNER JOIN usuario u ON u.idusuario = reg.idusuario
INNER JOIN LTYreporte l ON l.idLTYreporte = reg.idLTYreporte
INNER JOIN LTYarea a ON a.idLTYarea = l.idLTYarea
WHERE reg.idLTYcliente = " . $planta . "
  AND CONCAT(reg.fecha, ' ', reg.hora) >= CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 07:00:00')
  AND CONCAT(reg.fecha, ' ', reg.hora) <= CONCAT(CURDATE(), ' 23:59:59')
GROUP BY reg.nuxpedido
ORDER BY reg.fecha DESC, reg.hora DESC
LIMIT 1000;";

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

    $columnHeaders = [];
    $dataRows = [];

    if ($result instanceof mysqli_result) {
      // Obtener encabezados de columna
      $fields = mysqli_fetch_fields($result);
      foreach ($fields as $field) {
        $columnHeaders[] = $field->name;
      }

      // Obtener filas con solo valores (sin claves)
      while ($row = mysqli_fetch_assoc($result)) {
        $dataRows[] = array_values($row);
      }
    }

    $response = [
      'columns' => $columnHeaders,
      'data' => $dataRows
    ];

    $jsonResponse = json_encode($response);
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
// $datos = '{"planta":15,"ruta":"/traerCargadosDiario","rax":"&new=Thu Apr 10 2025 11:47:03 GMT-0300 (hora estándar de Argentina)"}';

if (empty($datos)) {
  $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
  echo json_encode($response);
  exit;
}
$data = json_decode($datos, true);

if (is_array($data)) {
  $planta = is_int($data['planta']) ? $data['planta'] : 0;

  // Verifica que los valores sean válidos antes de llamar a la función
  if ($planta !== '') {
    traer((int)$planta);
  } else {
    echo "Datos inválidos para insertar registro.";
    error_log('Datos inválidos: q=' . json_encode($datos) . ', sqlI=' . json_encode($planta));
  }
} else {
  echo "Error al decodificar la cadena JSON";
  error_log('ix-JSON response: ' . "Error al decodificar la cadena JSON");
}
