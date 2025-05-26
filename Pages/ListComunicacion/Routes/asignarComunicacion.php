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
 * Agrega un nuevo campo en la base de datos y devuelve el estado de la operación.
 *
 * @param array $envioEmail
 * @param int $id
 * @return array{success: bool, actualizado?: array<string, mixed>, message?: string}
 */
function asignar(int $id, array $envioEmail): array
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
    $sql = "INSERT INTO LTYComunicacion (idLTYreporte, idusuario, rol, activo, fecha_asignacion)
        VALUES (?, ?, ?, 's', NOW())
        ON DUPLICATE KEY UPDATE rol = VALUES(rol), activo = 's', fecha_asignacion = NOW(), fecha_baja = NULL";
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
      die("Error al preparar la consulta: " . $conn->error);
    }

    foreach ($envioEmail as $asignacion) {
      $idUsuario = isset($asignacion['id']) ? filter_var($asignacion['id'], FILTER_VALIDATE_INT) : null;
      $rol = isset($asignacion['rol']) ? $asignacion['rol'] : null;
      $idReporte = isset($asignacion['idReporte']) ? filter_var($asignacion['idReporte'], FILTER_VALIDATE_INT) : null;
      if ($idUsuario === null || $rol === null || $idReporte === null) {
        continue;
      }
      $stmt->bind_param("iis", $idReporte, $idUsuario, $rol);
      $stmt->execute();
    }


    $stmt->close();
    $conn->close();
    $response = array('success' => true, 'message' => 'Asignaciones RACI guardadas correctamente.');
    header('Content-Type: application/json');
    echo  json_encode($response);
    // Cerrar la declaración y la conexión


  } catch (\Throwable $e) {
    error_log("Error en on off reporte. Error: " . $e);
    print "Error!: " . $e->getMessage() . "<br>";
    return ['success' => false, 'message' => "Error en la ejecución de la consulta: " . $e->getMessage()];
  }
  return $response;
}

header("Content-Type: application/json; charset=utf-8");
$datos = file_get_contents("php://input");
// $datos = '{"q":15,"ruta":"/registrarReglaComunicacion","rax":"&new=Fri May 23 2025 18:30:00 GMT-0300 (hora estándar de Argentina)","envioEmail":[{"id":"236","nombre":"viviana chimenti","correo":"vivichimenti@gmail.com","rol":"Informado","idReporte":"14"},{"id":"237","nombre":"thiago gimenez","correo":"thgimenez06@gmail.com","rol":"Responsable","idReporte":"14"}]}';

if (empty($datos)) {
  $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
  echo json_encode($response);
  exit;
}
$data = json_decode($datos, true);
// ✅ Verificar si `json_decode` falló
if (!is_array($data)) {
  echo json_encode(['success' => false, 'message' => 'Error al decodificar la cadena JSON.']);
  exit;
}
$q = isset($data['q']) && is_int($data['q']) ? $data['q'] : 0;
$envioEmail = isset($data['envioEmail']) && is_array($data['envioEmail']) ? $data['envioEmail'] : [];
asignar($q, $envioEmail);
