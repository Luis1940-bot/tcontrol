<?php
// ini_set('display_errors', '1');
// ini_set('display_startup_errors', '1');
// error_reporting(E_ALL);
mb_internal_encoding('UTF-8');
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
function updateArea(string $q): void
{
  require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
  /** @var string $baseDir */
  $baseDir = BASE_DIR;
  // include('datos.php');
  include_once $baseDir . "/Routes/datos_base.php";
  /** @var string $charset */
  /** @var string $dbname */
  /** @var string $host */
  /** @var int $port */
  /** @var string $password */
  /** @var string $user */
  /** @var PDO $pdo */
  $host = "34.174.211.66";
  $user = "uumwldufguaxi";
  $password = "5lvvumrslp0v";
  $dbname = "db5i8ff3wrjzw3";
  $port = 3306;
  $charset = "utf8mb4";

  try {
    include_once $baseDir . "/Routes/datos_base.php";
    /** @var array{area?: string, id?: int} $objeto_json */
    // $id = $q['id'];
    // $area = $q['value'];
    $data = json_decode($q, true);

    if (!is_array($data)) {
      echo "Error: JSON inválido.";
      return;
    }

    $id = $data['id'] ?? 0;
    $area = $data['value'] ?? '';

    $conn = mysqli_connect($host, $user, $password, $dbname);
    if (!$conn) { // Verifica si la conexión falló
      $errorMessage = json_encode(['success' => false, 'message' => "Conexión fallida: " . mysqli_connect_error()]);
      if ($errorMessage === false) {
        $errorMessage = '{"success":false,"message":"Error desconocido al codificar JSON"}';
      }
    }

    $conn = mysqli_connect($host, $user, $password, $dbname, $port);

    // ✅ Verificar si la conexión falló
    if (!$conn) {
      $response = ['success' => false, 'message' => 'Error de conexión: ' . mysqli_connect_error()];
      header('Content-Type: application/json');
      echo json_encode($response);
      exit;
    }

    // ✅ Ahora `$conn` siempre será válido, se puede usar sin errores
    mysqli_set_charset($conn, $charset);

    $sql = "UPDATE LTYarea SET areax = ? WHERE idLTYarea = ?";
    $stmt = $conn->prepare($sql);

    // ✅ Verificar si la preparación falló
    if ($stmt === false) {
      $response = ['success' => false, 'message' => 'Error al preparar la consulta: ' . $conn->error];
      header('Content-Type: application/json');
      echo json_encode($response);
      $conn->close();
      exit;
    }

    $stmt->bind_param("si", $area, $id);

    $response = ($stmt->execute())
      ? ['success' => true, 'message' => 'Se actualizó el área.']
      : ['success' => false, 'message' => 'No se actualizó el área.'];

    // ✅ Cerrar conexiones después de usarlas
    $stmt->close();
    $conn->close();

    header('Content-Type: application/json');
    echo json_encode($response);
  } catch (\Throwable $e) {
    error_log("Error al guardar cambio en area. Error: " . $e);
    print "Error!: " . $e->getMessage() . "<br>";
    die();
  }
}

header("Content-Type: application/json; charset=utf-8");
$datos = file_get_contents("php://input");
// $datos = '{"q":{"id":36,"value":"desaxxxxxx","filtrado":[]},"ruta":"/guardarCambioArea","rax":"&new=Thu Jul 04 2024 07:59:34 GMT-0300 (hora estándar de Argentina)"}';

if (trim($datos) === '') {
  $response = ['success' => false, 'message' => 'Faltan datos necesarios.'];
  header('Content-Type: application/json');
  echo json_encode($response);
  exit;
}

$data = json_decode($datos, true);

/** 
 * @var array{
 *     id?: int, 
 *     value?: string, 
 *     filtrado?: array<mixed>
 * } $q 
 */

$q = $data['q'];

// ✅ json_encode() puede devolver `false`, aseguramos que siempre sea un `string`
$jsonQ = json_encode($q);
if ($jsonQ === false) {
  $jsonQ = '{}'; // Asignamos un JSON vacío si la conversión falla
}

updateArea($jsonQ);
