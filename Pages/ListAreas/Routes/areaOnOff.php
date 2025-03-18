<?php
// ini_set('display_errors', '1');
// ini_set('display_startup_errors', '1');
// error_reporting(E_ALL);
mb_internal_encoding('UTF-8');
require_once dirname(dirname(dirname(__DIR__))) . '/ErrorLogger.php';
ErrorLogger::initialize(dirname(dirname(dirname(__DIR__))) . '/logs/error.log');
require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
/** @var string $baseDir */
$baseDir = BASE_DIR;
/** 
 * @var array{timezone?: string} $_SESSION 
 */
if (isset($_SESSION['timezone']) && is_string($_SESSION['timezone'])) {
  date_default_timezone_set($_SESSION['timezone']);
} else {
  date_default_timezone_set('America/Argentina/Buenos_Aires');
}


function onOff(int $id, string $status, string $tipo): string
{


  try {
    include_once BASE_DIR . "/Routes/datos_base.php";
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
    if ($status === 's') {
      $status = 'n';
    } else if ($status === 'n') {
      $status = 's';
    }

    $conn = mysqli_connect($host, $user, $password, $dbname);

    if (!$conn) { // Verifica si la conexión falló
      $errorMessage = json_encode(['success' => false, 'message' => "Conexión fallida: " . mysqli_connect_error()]);
      if ($errorMessage === false) {
        $errorMessage = '{"success":false,"message":"Error desconocido al codificar JSON"}';
      }
      return $errorMessage;
    }
    if ($tipo === 'activo') {
      $sql = "UPDATE LTYarea SET activo = ? WHERE idLTYarea = ?";
    } elseif ($tipo === 'visible') {
      $sql = "UPDATE LTYarea SET visible = ? WHERE idLTYarea = ?";
    } else {
      $errorMessage = json_encode(['success' => false, 'message' => "Tipo inválido"]);

      // ✅ Evitar que PHPStan detecte `false`
      return $errorMessage !== false ? $errorMessage : '{"success":false,"message":"Error desconocido al codificar JSON"}';
    }

    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
      $errorMessage = json_encode(['success' => false, 'message' => "Tipo inválido"]);

      // ✅ Evitar que PHPStan detecte `false`
      return $errorMessage !== false ? $errorMessage : '{"success":false,"message":"Error desconocido al codificar JSON"}';
    }
    // if ($stmt === false) {
    //   die("Error al preparar la consulta: " . $conn->error);
    // }
    $stmt->bind_param("si", $status, $id);

    $success = $stmt->execute();

    $response = $success
      ? ['success' => true, 'message' => 'Se actualizó la situación del área.']
      : ['success' => false, 'message' => 'No se actualizó la situación del área.'];

    $stmt->close();
    $conn->close();

    header('Content-Type: application/json');
    $jsonResponse = json_encode($response);
    $jsonResponse = $jsonResponse !== false ? $jsonResponse : '{"success":false,"message":"Error al codificar JSON"}';

    echo $jsonResponse;
    return $jsonResponse;
  } catch (\Throwable $e) {
    error_log("Error en on off de area: " . $e);
    print "Error!: " . $e->getMessage() . "<br>";
    die();
  }
}

header("Content-Type: application/json; charset=utf-8");

$datos = file_get_contents("php://input");
// $datos = '{"q":4,"ruta":"/areaOnOff","rax":"&new=Wed Jul 03 2024 15:32:45 GMT-0300 (hora estándar de Argentina)","status":"s","tipo":"activo"}';

if (empty($datos)) {
  $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
  echo json_encode($response);
  exit;
}
$data = json_decode($datos, true);
if (is_array($data)) {
  $q = is_int($data['q']) ? $data['q'] : 0;
  $status = is_string($data['status']) ? $data['status'] : '';
  $tipo = is_string($data['tipo']) ? $data['tipo'] : '';
  // Verifica que los valores sean válidos antes de llamar a la función
  if (!empty($q)) {
    onOff($q, $status, $tipo);
  } else {
    echo "Datos inválidos para insertar registro.";
    error_log('Datos inválidos: q=' . json_encode($datos) . ', status=' . json_encode($status));
  }
} else {
  echo "Error al decodificar la cadena JSON";
  error_log('ix-JSON response: ' . "Error al decodificar la cadena JSON");
}
