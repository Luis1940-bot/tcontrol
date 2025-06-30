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
 * @param array<int, array<int, mixed>> $array
 * @return array{success: bool, message: string, array?: array<int, array<int, mixed>>}
 */
function upDown(int $id, array $array): array
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

    $conn = mysqli_connect($host, $user, $password, $dbname);
    if (!$conn) {
      throw new RuntimeException('Error al conectar con la base de datos: ' . mysqli_connect_error());
    }
    $sql = "UPDATE LTYselect SET orden = ? WHERE idLTYselect = ?";

    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
      die("Error al preparar la consulta: " . $conn->error);
    }

    $all_success = true;

    foreach ($array as $row) {
      $id = $row[0];
      $orden = $row[5];

      $stmt->bind_param("si", $orden, $id);

      if ($stmt->execute() !== true) {
        $all_success = false; // Si algo falla, marcamos que no todas fueron exitosas
      }
    }

    if ($all_success) {
      $response = ['success' => true, 'message' => 'Todas las actualizaciones fueron exitosas.', 'array' => $array];
    } else {
      $response = ['success' => false, 'message' => 'Al menos una actualización falló.', 'array' => $array];
    }

    header('Content-Type: application/json');
    echo json_encode($response);

    $stmt->close();
    $conn->close();
    return $response;
  } catch (\Throwable $e) {
    error_log("Error de up down de variable. Error: " . $e);
    print "Error!: " . $e->getMessage() . "<br>";
    return ['success' => false, 'message' => "Error en la ejecución de la consulta: " . $e->getMessage()];
  }
}

header("Content-Type: application/json; charset=utf-8");
$datos = file_get_contents("php://input");


if (empty($datos)) {
  $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
  echo json_encode($response);
  exit;
}
$data = json_decode($datos, true);
if (!is_array($data)) {
  echo json_encode(['success' => false, 'message' => 'Error al decodificar la cadena JSON.']);
  exit;
}
$q = isset($data['q']) && is_int($data['q']) ? $data['q'] : 0;
/** @var array<int, array<int, mixed>> $array */
$array = isset($data['array']) && is_array($data['array'])
  ? array_map(
    fn($item) => is_array($item) ? array_map(fn($v) => $v, array_values($item)) : [],
    $data['array']
  )
  : [];

upDown($q, $array);
