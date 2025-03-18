<?php
header("Content-Type: text/html;charset=utf-8");
// session_start();
//   if (!isset($_SESSION['factum_validation']['email'] )) {
//       unset($_SESSION['factum_validation']['email'] ); 
//   }
require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
require_once dirname(dirname(dirname(__DIR__))) . '/ErrorLogger.php';
ErrorLogger::initialize(dirname(dirname(dirname(__DIR__))) . '/logs/error.log');
if (isset($_SESSION['timezone']) && is_string($_SESSION['timezone'])) {
  date_default_timezone_set($_SESSION['timezone']);
} else {
  date_default_timezone_set('America/Argentina/Buenos_Aires');
}

/**
 * Verifica la información de un supervisor en la base de datos.
 *
 * @param string $q El identificador del supervisor.
 * @param string $sqlI El identificador de cliente.
 * @return array<string, mixed> Un array asociativo con los datos del supervisor o un mensaje de error.
 */

function verifica(string $q, string $sqlI): array
{
  // global $q;
  $idSupervisor = $q; //urldecode($q);

  include_once BASE_DIR . "/Routes/datos_base.php";
  // include_once $_SERVER['DOCUMENT_ROOT']."/Routes/datos_base.php";

  // $pdo = new PDO("mysql:host={$host};dbname={$dbname};port={$port};chartset={$charset}",$user,$password);
  /** @var string $host */
  /** @var string $dbname */
  /** @var string $user */
  /** @var string $password */
  /** @var string $charset */
  /** @var int|string $port */

  // Definir valores predeterminados si es necesario
  $charset = $charset ?? 'utf8mb4';
  $port = $port !== '' ? $port : 3306;


  // Asegurar que $port sea una cadena
  $port = (string) $port;

  $pdo = new PDO("mysql:host={$host};dbname={$dbname};port={$port};charset={$charset}", $user, $password);

  try {

    $sql = "SELECT u.idusuario, u.nombre, u.mail, u.idtipousuario, u.mi_cfg  FROM usuario u WHERE u.idusuario=? AND u.idLTYcliente=?";
    $query = $pdo->prepare($sql);
    $query->bindParam(1, $idSupervisor, PDO::PARAM_STR);
    $query->bindParam(2, $sqlI, PDO::PARAM_INT);
    $query->execute();
    $data = $query->fetchAll(PDO::FETCH_ASSOC);
    // echo count($data).'<br>';
    if (is_array($data) && count($data) > 0 && is_array($data[0])) {
      $response = array(
        'id' => $data[0]['idusuario'] ?? null,
        'nombre' => $data[0]['nombre'] ?? null,
        'mail' => $data[0]['mail'] ?? null,
        'tipo' => $data[0]['idtipousuario'] ?? null,
        'mi_cfg' => $data[0]['mi_cfg'] ?? null,
      );

      echo json_encode($response);
      return $response;
    } else {

      $errorResponse = array('error' => 'Uno o más datos son incorrectos, vuelve a intentarlo.');
      echo json_encode($errorResponse);
      return $errorResponse;
    }
  } catch (\PDOException $e) {
    // @phpstan-ignore-next-line
    error_log("Error al traer supervisor. " . $q . "Planta: " . $sqlI);
    $errorResponse = array('error' => 'Error!: ' . $e->getMessage());
    echo json_encode($errorResponse);
    return $errorResponse;
  }
}

header("Content-Type: application/json; charset=utf-8");
$datos = file_get_contents("php://input");

if (empty($datos)) {
  $response = ['success' => false, 'message' => 'Faltan datos necesarios.'];
  echo json_encode($response);
  exit;
}

$data = json_decode($datos, true);

if (is_array($data) && isset($data['q'], $data['sqlI']) && is_string($data['q']) && is_string($data['sqlI'])) {
  $q = $data['q'];
  $sqlI = $data['sqlI'];
  verifica($q, $sqlI);
} else {
  $response = ['success' => false, 'message' => 'Error al decodificar la cadena JSON o faltan datos necesarios.'];
  echo json_encode($response);
  exit;
}
