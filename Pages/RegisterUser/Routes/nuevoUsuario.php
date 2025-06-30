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
 * Agrega un nuevo usuario en la base de datos y devuelve el estado de la operación.
 *
 * @param array{nombre: string, pass: string, area: string, puesto: string, idtipousuario: int, email: string, firma: string, valueIdioma: string} $objeto Datos del usuario.
 * @param int $idPlanta Identificador de la planta.
 * @return array{success: bool, message?: string, id?: int, v?: string}
 */
function addUsuario(array $objeto, int $idPlanta): array
{
  $nombre = '';
  try {
    require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
    /** @var string $baseDir */
    $baseDir = BASE_DIR;
    include_once $baseDir . "/Routes/datos_base.php";
    $nombre = $objeto['nombre'];
    $pass = $objeto['pass'];
    $area = $objeto['area'];
    $puesto = $objeto['puesto'];
    $idtipousuario = (int) $objeto['idtipousuario'];
    $mail = $objeto['email'];
    $firma = $objeto['firma'];
    $valueIdioma = $objeto['valueIdioma']; // Ya existe y es un string
    $mi_cfg = 'd-' . $valueIdioma;
    $activo = 's';
    $idLTYcliente = $idPlanta;
    $cod_verificador = bin2hex(random_bytes(16)); // Generar código de verificación


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
    if (!$conn->set_charset("utf8mb4")) {
      throw new RuntimeException("Error al cargar el conjunto de caracteres utf8mb4: " . $conn->error);
    }

    // Verificar si ya existe un usuario con el mismo email y cliente
    $sql_check = "SELECT * FROM usuario WHERE mail = ? AND idLTYcliente = ?";
    $stmt_check = $conn->prepare($sql_check);
    if (!$stmt_check) {
      throw new RuntimeException("Error al preparar la consulta: " . $conn->error);
    }
    $stmt_check->bind_param("si", $mail, $idLTYcliente);
    $stmt_check->execute();
    $result_check = $stmt_check->get_result();

    // if ($result_check->num_rows > 0) {
    //   $response = array('success' => false, 'message' => 'El usuario ya existe.');
    //   $stmt_check->close();
    //   $conn->close();
    //   header('Content-Type: application/json');
    //   echo json_encode($response);
    //   return $response;
    // }
    if ($result_check && $result_check->num_rows > 0) {
      $stmt_check->close();
      $conn->close();
      return ['success' => false, 'message' => 'El usuario ya existe.'];
    }
    $stmt_check->close();
    if (trim($pass) === '') {
      return ['success' => false, 'message' => 'La contraseña no es válida.'];
    }

    $hash = hash('ripemd160', $pass);
    $sql = "INSERT INTO usuario (nombre, pass, area, puesto, idtipousuario, activo, mail, firma, mi_cfg, idLTYcliente, cod_verificador) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
      throw new RuntimeException("Error al preparar la consulta: " . $conn->error);
    }

    $stmt->bind_param("ssssissssis", $nombre, $hash, $area, $puesto, $idtipousuario, $activo, $mail, $firma, $mi_cfg, $idLTYcliente, $cod_verificador);

    if ($stmt->execute() === true) {
      $last_id = (int) $conn->insert_id;
      $response = ['success' => true, 'message' => 'Se agregó un nuevo usuario.', 'id' => $last_id, 'v' => $cod_verificador];
    } else {
      $response = ['success' => false, 'message' => 'No se agregó el usuario.'];
    }
    $stmt->close();
    $conn->close();

    header('Content-Type: application/json');
    echo  json_encode($response);
    return $response;
    // Cerrar la declaración y la conexión


  } catch (\Throwable $e) {
    error_log("Error al crear el nuevo usuario: " . $e->getMessage());
    return ['success' => false, 'message' => "Error: " . $e->getMessage()];
  }
}

header("Content-Type: application/json; charset=utf-8");
$datos = file_get_contents("php://input");

//  $datos = '{"q":{"nombre":"trt","pass":"1","valueArea":0,"area":"Área","puesto":"d","idtipousuario":1,"textTipoDeUsuario":"Colaborador","valueSituacion":"s","textSituacion":"Activo","email":"d@.com.ar","firma":"","valueIdioma":"es","textIdioma":"Español"},"ruta":"/addUsuario","sqlI":2,"rax":"&new=Fri Jun 28 2024 08:50:30 GMT-0300 (hora estándar de Argentina)"}';

if (empty($datos)) {
  echo json_encode(['success' => false, 'message' => 'Faltan datos necesarios.']);
  exit;
}
$data = json_decode($datos, true);

if (!is_array($data)) {
  error_log("Error decoding JSON: " . json_encode($datos));
  echo json_encode(['success' => false, 'message' => 'Error al decodificar la cadena JSON']);
  exit;
}
// 🔍 VALIDACIÓN: Asegurar que 'q' es un array y contiene las claves esperadas
$objeto = isset($data['q']) && is_array($data['q']) ? $data['q'] : [];

// 🔍 VALIDACIÓN: Convertir `$idPlanta` a entero si es numérico, o asignar `0`
$idPlanta = isset($data['sqlI']) && is_numeric($data['sqlI']) ? (int) $data['sqlI'] : 0;

// 🔹 FILTRAR SOLO LAS CLAVES ESPERADAS
$camposEsperados = ['nombre', 'pass', 'area', 'puesto', 'idtipousuario', 'email', 'firma', 'valueIdioma'];
$objeto = array_intersect_key($objeto, array_flip($camposEsperados));
$objeto = [
  'nombre'       => isset($objeto['nombre']) && is_string($objeto['nombre']) ? $objeto['nombre'] : '',
  'pass'         => isset($objeto['pass']) && is_string($objeto['pass']) ? $objeto['pass'] : '',
  'area'         => isset($objeto['area']) && is_string($objeto['area']) ? $objeto['area'] : '',
  'puesto'       => isset($objeto['puesto']) && is_string($objeto['puesto']) ? $objeto['puesto'] : '',
  'idtipousuario' => isset($objeto['idtipousuario']) && is_int($objeto['idtipousuario']) ? $objeto['idtipousuario'] : 0,
  'email'        => isset($objeto['email']) && is_string($objeto['email']) ? $objeto['email'] : '',
  'firma'        => isset($objeto['firma']) && is_string($objeto['firma']) ? $objeto['firma'] : '',
  'valueIdioma'  => isset($objeto['valueIdioma']) && is_string($objeto['valueIdioma']) ? $objeto['valueIdioma'] : ''
];
addUsuario($objeto, (int) $idPlanta);
