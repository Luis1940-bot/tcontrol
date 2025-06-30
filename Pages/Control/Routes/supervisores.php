<?php
// ini_set('display_errors', '1');
// ini_set('display_startup_errors', '1');
// error_reporting(E_ALL);
require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
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

function verifica(string $q, int $sqlI): string
{
  /** @var string $q */
  global $q;
  // $pass=urldecode($q);
  // $hash=hash('ripemd160',$pass);
  $decoded_q = base64_decode($q);
  $decoded_q = str_replace('"', '', $decoded_q);
  $decoded_q = trim($decoded_q);

  if (!$decoded_q) {

    $errorResponse = json_encode(['error' => 'Error en la desencriptación de los datos.']);

    // Si json_encode() falla, asignamos un JSON válido para evitar errores
    return $errorResponse !== false ? $errorResponse : '{"error":"Error desconocido al codificar JSON"}';
  }

  $hash = hash('ripemd160', $decoded_q);
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
  // include_once $_SERVER['DOCUMENT_ROOT']."/Routes/datos_base.php";
  $pdo = new PDO("mysql:host={$host};dbname={$dbname};port={$port};charset={$charset}", $user, $password);
  try {

    $sql = "SELECT u.idusuario, u.nombre, u.mail, u.idtipousuario, u.mi_cfg  FROM usuario u WHERE u.pass=? AND u.idLTYcliente=?";

    $query = $pdo->prepare($sql);

    $query->bindParam(1, $hash, PDO::PARAM_STR);
    $query->bindParam(2, $sqlI, PDO::PARAM_INT);
    $query->execute();
    $data = $query->fetchAll();

    if (!is_array($data) || count($data) === 0 || !isset($data[0]) || !is_array($data[0])) {
      $errorResponse = json_encode(['error' => 'Uno o más datos son incorrectos, vuelve a intentarlo.']);
      return $errorResponse !== false ? $errorResponse : '{"error":"Error desconocido al codificar JSON"}';
    }
    // if (count($data) !== 0) {
    $response = array(
      'id' => $data[0]['idusuario'] ?? null,
      'nombre' =>  $data[0]['nombre'] ?? null,
      'mail' => $data[0]['mail'] ?? null,
      'tipo' =>  $data[0]['idtipousuario'] ?? null,
      'mi_cfg' => $data[0]['mi_cfg'] ?? null,
    );

    $jsonResponse = json_encode($response);
    echo $jsonResponse;
    return $jsonResponse !== false ? $jsonResponse : '{"error":"Error desconocido al codificar JSON"}';
  } catch (\PDOException $e) {
    error_log("Error al verificar el supervisor. Error: " . $e->getMessage());

    $errorResponse = json_encode(['error' => 'Error!: ' . $e->getMessage()]);

    // ✅ Asegurar que json_encode() siempre devuelve un `string`
    return $errorResponse !== false ? $errorResponse : '{"error":"Error desconocido al codificar JSON"}';
  }
}

header("Content-Type: application/json; charset=utf-8");
$datos = file_get_contents("php://input");
// $datos = '{"q":"IkRha2FtZXJpY2FzMjAyNSI=","ruta":"/traerFirma","rax":"&new=Mon Mar 03 2025 09:25:46 GMT-0600 (hora estándar central)","sqlI":15}';
// $datos = '{"q":"IjQ0ODgi","ruta":"/traerFirma","rax":"&new=Fri Sep 27 2024 12:24:09 GMT-0300 (hora estándar de Argentina)","sqlI":15}';

if (empty($datos)) {
  $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
  echo json_encode($response);
  exit;
}
$data = json_decode($datos, true);

// error_log('supervisores-JSON response: ' . json_encode($data));
if (is_array($data)) {
  $q = is_string($data['q']) ? $data['q'] : '';
  $sqlI = is_int($data['sqlI']) ? $data['sqlI'] : 0;

  verifica($q, $sqlI);
} else {
  echo "Error al decodificar la cadena JSON";
  error_log('ix-JSON response: ' . "Error al decodificar la cadena JSON");
}
