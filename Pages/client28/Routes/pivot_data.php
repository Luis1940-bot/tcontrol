<?php
function traer(string $vista, string $d, string $h): void
{

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

    $vistaLimpia = preg_replace('/[^a-zA-Z0-9_]/', '', $vista);
    if (empty($vistaLimpia)) {
      echo  json_encode([
        'success' => false,
        'message' => 'Nombre de vista inválido.'
      ]);
    }
    $hoy = new DateTime(); // hastaI
    $desde = (clone $hoy)->modify('-60 days'); // desdeI

    $hastaI = $hoy->format('Y-m-d');
    $desdeI = $desde->format('Y-m-d');
    $con = mysqli_connect($host, $user, $password, $dbname);
    if (!$con) { // Verifica si la conexión falló
      $errorMessage = json_encode(['success' => false, 'message' => "Conexión fallida: " . mysqli_connect_error()]);
      if ($errorMessage === false) {
        $errorMessage = '{"success":false,"message":"Error desconocido al codificar JSON"}';
      }
      echo $errorMessage;
    }

    mysqli_query($con, "SET NAMES 'utf8'");
    mysqli_select_db($con, $dbname);
    /** @var string $sql */
    $sql = "
    SELECT TAG, fecha, ROUND(valor, 4) AS valor
    FROM " . $vistaLimpia . "
    WHERE fecha BETWEEN ? AND ?
    ORDER BY TAG, fecha;
  ";

    $stmt = mysqli_prepare($con, $sql);
    if (!$stmt) {
      echo json_encode([
        'success' => false,
        'message' => 'Error preparando consulta: ' . mysqli_error($con)
      ]);
    }

    mysqli_stmt_bind_param($stmt, 'ss', $desdeI, $hastaI);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if (!$result) {
      echo json_encode([
        'success' => false,
        'message' => 'Error al ejecutar: ' . mysqli_error($con)
      ]);
    }

    $rows = [];
    while ($row = mysqli_fetch_assoc($result)) {
      $rows[] = $row;
    }

    mysqli_stmt_close($stmt);
    mysqli_close($con);



    // Ahora devolvemos como JSON
    echo json_encode([
      'success' => true,
      'data' => $rows
    ]);
  } catch (\PDOException $e) {
    /** @var string $sql */
    error_log("Error al traer registros. "  . $sql . " Error: " . $e);
    print "Error!: " . $e->getMessage() . "<br>";
    echo json_encode([
      'success' => false,
      'data' => []
    ]);
    die();
  }
}



header("Content-Type: application/json; charset=utf-8");
$datos = file_get_contents("php://input");
// $datos = '{"vista":"vista_json_valores_28_175","desdeI":"2025-03-01","hastaI":"2025-04-22","rax":"&new=Thu Apr 10 2025 11:47:03 GMT-0300 (hora estándar de Argentina)"}';

if (empty($datos)) {
  $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
  echo json_encode($response);
  exit;
}
$data = json_decode($datos, true);

if (is_array($data)) {
  $d = ($data['desdeI']) ? $data['desdeI'] : 0;
  $h = ($data['hastaI']) ? $data['hastaI'] : 0;
  $vista = $data['vista'];

  // Verifica que los valores sean válidos antes de llamar a la función
  if ($vista !== '') {
    traer($vista, $d, $h);
  } else {
    echo "Datos inválidos para insertar registro.";
    error_log('Datos inválidos: q=' . json_encode($datos) . ', sqlI=' . json_encode($planta));
  }
} else {
  echo "Error al decodificar la cadena JSON";
  error_log('ix-JSON response: ' . "Error al decodificar la cadena JSON");
}
