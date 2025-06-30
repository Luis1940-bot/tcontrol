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
 * Agrega una nueva variable en la base de datos y devuelve el estado de la operación.
 *
 * @param int $cliente
 * @param array<string, mixed> $objeto Datos de la variable a agregar.
 * @return array{success: bool, message: string, id?: int, array?: array<int, array<int, mixed>>}
 */

function verificarEmail(array $objeto, int $cliente): array
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

    $conn = new mysqli($host, $user, $password, $dbname, $port);
    if ($conn->connect_error) {
      throw new RuntimeException('Error al conectar con la base de datos: ' . $conn->connect_error);
    }

    if (!$conn->set_charset("utf8mb4")) {
      printf("Error al cargar el conjunto de caracteres utf8mb4: %s\n", $conn->error);
      exit();
    }
    $mail = $objeto['email1'];
    $pass = isset($objeto['pass1']) && is_string($objeto['pass1']) ? $objeto['pass1'] : '';
    $hash = hash('ripemd160', $pass);



    $sql = "SELECT idusuario, nombre FROM usuario WHERE mail = ? AND idLTYcliente = ? AND verificador = ?";
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
      die("Error al preparar la consulta: " . $conn->error);
    }
    $verificador = 1;


    $stmt->bind_param("sii", $mail, $cliente, $verificador);
    $stmt->execute();
    $result = $stmt->get_result();

    // if ($result->num_rows > 0) {
    if ($result instanceof mysqli_result && $result->num_rows > 0) {
      $user = $result->fetch_assoc();
      if (is_array($user)) {
        $idusuario = $user['idusuario'] ?? 0;
        $nombre = $user['nombre'] ?? '';
      } else {
        $idusuario = 0;
        $nombre = '';
      }


      $cod_verificador = bin2hex(random_bytes(16));
      // Preparar la consulta UPDATE
      $updateSql = "UPDATE usuario SET cod_verificador = ?, verificador = ?, pass = ? WHERE idusuario = ?";
      $updateStmt = $conn->prepare($updateSql);
      if ($updateStmt === false) {
        die("Error al preparar la consulta de actualización: " . $conn->error);
      }
      $newVerificador = 0; // Nuevo valor para verificador

      $updateStmt->bind_param("sisi", $cod_verificador, $newVerificador, $hash, $idusuario);
      $updateStmt->execute();

      if ($updateStmt->affected_rows > 0) {
        $response = [
          'success' => true,
          'message' => 'Usuario actualizado correctamente.',
          'v' => $cod_verificador,
          'id' => is_numeric($idusuario) ? (int) $idusuario : 0,
          'nombre' => is_string($nombre) ? $nombre : '',
          'email' => is_string($mail) ? $mail : '',
        ];
      } else {
        $response = ['success' => false, 'message' => 'No se pudo actualizar el usuario.'];
      }

      $updateStmt->close();
      $stmt->close();
      $conn->close();

      header('Content-Type: application/json');
      echo json_encode($response);
      return $response;
    } else {
      $response = ['success' => false, 'message' => 'No se encontró el usuario.'];
      $stmt->close();
      $conn->close();
      header('Content-Type: application/json');
      echo  json_encode($response);
      return $response;
    }
  } catch (\Throwable $e) {
    error_log("Error al confirmar el email.");
    print "Error!: " . $e->getMessage() . "<br>";
    die();
  }
}

header("Content-Type: application/json; charset=utf-8");

$datos = file_get_contents("php://input");
// $datos = '{"q":{"email1":"luisfactum@gmail.com","email2":"luisfactum@gmail.com","pass1":"4488","pass2":"4488"},"ruta":"/confirmaEmail","sqlI":1,"rax":"&new=Thu Jun 27 2024 08:05:24 GMT-0300 (hora estándar de Argentina)"}';
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

// ✅ Validar y asignar valores de manera segura
// ✅ Garantizar que $objeto tenga solo claves de tipo string
$objeto = isset($data['q']) && is_array($data['q'])
  ? array_filter($data['q'], fn($key) => is_string($key), ARRAY_FILTER_USE_KEY)
  : [];

$plant = isset($data['sqlI']) && is_numeric($data['sqlI']) ? (int) $data['sqlI'] : 0;

// ✅ Ahora los parámetros tienen los tipos correctos
verificarEmail($objeto, $plant);
