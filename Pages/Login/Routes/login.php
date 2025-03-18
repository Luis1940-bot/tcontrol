<?php
// ini_set('display_errors', '1');
// ini_set('display_startup_errors', '1');
// error_reporting(E_ALL);
mb_internal_encoding('UTF-8');
require_once dirname(dirname(dirname(__DIR__))) . '/ErrorLogger.php';
// Inicializar el logger con la ruta deseada
ErrorLogger::initialize(dirname(dirname(dirname(__DIR__))) . '/logs/error.log');

/**
 * Realiza la consulta de usuario en la base de datos.
 *
 * @param int $planta ID de la planta asociada al usuario.
 * @param string $email Correo electrónico del usuario.
 * @param string $pass Contraseña en texto plano (será hasheada antes de la consulta).
 * @return array{success: bool, res?: array<string, mixed>, message?: string}
 */
function consultar(int $planta, string $email, string $pass): array
{
  try {
    require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
    /** @var string $baseDir */
    $baseDir = BASE_DIR;
    include_once $baseDir . "/Routes/datos_base_primera.php";
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
    // $dbnameLogin = 'tc1000';

    $cnn = new PDO("mysql:host={$host};dbname={$dbname};port={$port};charset={$charset}", $user, $password);
    $hash = hash('ripemd160', $pass);
    $sql = "SELECT nombre, idusuario, mail, idtipousuario, firma, qcodusuario, area, mi_cfg, activo, verificador FROM usuario
                WHERE mail=? and pass=? and idLTYcliente=?;";
    $query = $cnn->prepare($sql);
    $query->bindParam(1, $email, PDO::PARAM_STR);
    $query->bindParam(2, $hash, PDO::PARAM_STR);
    $query->bindParam(3, $planta, PDO::PARAM_INT);

    $query->execute();
    $data = $query->fetch(PDO::FETCH_ASSOC);
    $query->closeCursor();
    $cnn = null;


    if (is_array($data)) {
      $response = [
        'email' => $data['mail'] ?? '',
        'plant' => $planta,
        'lng' => isset($data['mi_cfg']) && is_string($data['mi_cfg']) ? substr($data['mi_cfg'], -2) : '',
        'person' => $data['nombre'] ?? '',
        'id' => $data['idusuario'] ?? 0,
        'tipo' => $data['idtipousuario'] ?? 0,
        'developer' => BASE_DEVELOPER,
        'content' => BASE_CONTENT,
        'logo' => BASE_LOGO,
        'by' => BASE_BY,
        'rutaDeveloper' => BASE_RUTA,
        'qcodusuario' => $data['qcodusuario'] ?? '',
        'username' => $data['nombre'] ?? '',
        'area' => $data['area'] ?? '',
        'activo' => $data['activo'] ?? 0,
        'verificador' => $data['verificador'] ?? '',
        'sso' => null,
      ];
      $_SESSION['login_sso'] = $response;
      if (!isset($_SESSION['factum_validation']) || !is_array($_SESSION['factum_validation'])) {
        $_SESSION['factum_validation'] = []; // ✅ Se inicializa como array
      }
      $_SESSION['factum_validation']['plant'] = $planta;


      $response = array('success' => true, 'res' => $response);
      header('Content-Type: application/json');
      echo json_encode($response);
      return ['success' => true, 'res' => $response];
    } else {

      $emailStr = is_string($email) ? $email : json_encode($email);
      $plantaStr = is_int($planta) ? (string) $planta : json_encode($planta);

      error_log("Login failed for email: $emailStr, planta: $plantaStr");

      $response = ['success' => false, 'message' => 'Hay un dato que no es correcto.'];
      echo json_encode($response);

      // ✅ Retornar un array en lugar de $data (que podría ser false)
      return ['success' => false, 'message' => 'Hay un dato que no es correcto.'];
    }
  } catch (Throwable $e) {
    error_log('Exception: ' . $e->getMessage() . ' in ' . $e->getFile() . ' on line ' . $e->getLine());
    echo "Error!: " . $e->getMessage() . "<br>";
    die();
  }
}

header("Content-Type: application/json; charset=utf-8");
$datos = file_get_contents("php://input");
// $datos = '{"planta":15,"email":"luisglogista@gmail.com","password":"5678","ruta":"/login","timezone":"America/Argentina/Buenos_Aires","rax":"&new=Wed Jan 15 2025 07:44:13 GMT-0300 (hora estándar de Argentina)"}';
// ✅ Manejo de datos vacíos
if (empty($datos)) {
  echo json_encode(['success' => false, 'message' => 'Faltan datos necesarios.']);
  exit;
}

// ✅ Decodificar JSON de manera segura
$data = json_decode($datos, true);

// ✅ Verificar si la decodificación fue exitosa y que $data es un array
if (!is_array($data)) {
  error_log("Error decoding JSON: " . json_encode($datos));
  echo json_encode(['success' => false, 'message' => 'Error al decodificar la cadena JSON']);
  exit;
}

// ✅ Manejo seguro del timezone
$timezone = isset($data['timezone']) && is_string($data['timezone']) ? $data['timezone'] : 'America/Argentina/Buenos_Aires';
$GLOBALS['timezone'] = $timezone;
date_default_timezone_set($timezone);

// ✅ Validar y asignar valores de manera segura
$planta = isset($data['planta']) && is_int($data['planta']) ? $data['planta'] : 0;
$email = isset($data['email']) && is_string($data['email']) ? $data['email'] : '';
$pass = isset($data['password']) && is_string($data['password']) ? $data['password'] : '';

consultar($planta, $email, $pass);
