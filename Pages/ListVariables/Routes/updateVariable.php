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

/**
 * Agrega un nuevo selector en la base de datos y devuelve el estado de la operación.
 *
 * @param array<string, mixed> $q Datos del selector a agregar.
 * @return array{success: bool, message: string, updated?: array<int, array{id: int, success: bool, message: string}>}
 */

function updateVariable(array $q): array
{

  try {
    require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
    /** @var string $baseDir */
    $baseDir = BASE_DIR;
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


    $arrayId = isset($q['id']) && is_array($q['id']) ? $q['id'] : [];
    $arrayValue = isset($q['value']) && is_array($q['value']) ? $q['value'] : [];

    if (empty($arrayId) || empty($arrayValue)) {
      throw new RuntimeException("No se recibieron datos para actualizar.");
    }

    // Asegurarse de que ambos arrays tienen la misma longitud
    if (count($arrayId) !== count($arrayValue)) {
      die("Los arrays no tienen la misma longitud");
    }

    $conn = mysqli_connect($host, $user, $password, $dbname);
    if (!$conn) {
      throw new RuntimeException('Error al conectar con la base de datos: ' . mysqli_connect_error());
    }
    mysqli_set_charset($conn, $charset);
    $sql = "UPDATE LTYselect SET concepto = ? WHERE idLTYselect = ?";

    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
      throw new RuntimeException("Error al preparar la consulta: " . $conn->error);
    }


    $response = [];

    for ($i = 0; $i < count($arrayId); $i++) {
      if (!isset($arrayValue[$i])) {
        continue; // Evita acceder a índices no definidos
      }
      $id = isset($arrayId[$i]) && is_numeric($arrayId[$i]) ? (int) $arrayId[$i] : 0; // ✅ Validación antes de convertir

      $value = $arrayValue[$i];

      // Vincular parámetros para cada par de ID y valor
      $stmt->bind_param("si", $value, $id);


      if ($stmt->execute() === true) {
        $response[] = ['id' => $id, 'success' => true, 'message' => 'Actualizado correctamente.'];
      } else {
        $response[] = ['id' => $id, 'success' => false, 'message' => 'Error al actualizar.'];
      }
    }

    $stmt->close();
    $conn->close();

    $finalResponse = [
      'success' => count($response) > 0 && count(array_filter($response, fn($r) => $r['success'] === true)) === count($response),
      'message' => count($response) > 0 ? 'Proceso completado.' : 'No se realizaron actualizaciones.',
      'updated' => $response
    ];

    header('Content-Type: application/json');
    echo json_encode($response);
    return $finalResponse;
  } catch (\Throwable $e) {
    error_log("Error al actualizar variable. Error: " . $e);
    print "Error!: " . $e->getMessage() . "<br>";
    return ['success' => false, 'message' => "Error en la ejecución de la consulta: " . $e->getMessage()];
  }
}

header("Content-Type: application/json; charset=utf-8");
$datos = file_get_contents("php://input");
// $datos = '{"ruta":"/updateVariable","rax":"&new=Mon Mar 03 2025 18:04:59 GMT-0600 (hora estándar central)","objeto":{"id":["136"],"value":["Alto"],"idLTYcliente":28}}';

if ($datos === false) {
  $datos = '';
}
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
$q = isset($data['objeto']) && is_array($data['objeto'])
  ? array_filter($data['objeto'], fn($key) => is_string($key), ARRAY_FILTER_USE_KEY)
  : [];
updateVariable($q);
