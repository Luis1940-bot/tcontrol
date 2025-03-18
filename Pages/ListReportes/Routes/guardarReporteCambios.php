<?php
// ini_set('display_errors', '1');
// ini_set('display_startup_errors', '1');
// error_reporting(E_ALL);

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
// include('datos.php');

/**
 * Guarda los cambios en un reporte en la base de datos.
 *
 * @param string $datos JSON con los datos a actualizar
 * @return array{success: bool, message: string} Respuesta con el estado de la operación
 */
function guardarCambiosReporte(string $datos): array
{
  require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
  /** @var string $baseDir */
  $baseDir = BASE_DIR;
  $dato_decodificado = urldecode($datos);
  $objeto_json = json_decode($dato_decodificado, true);
  if (!is_array($objeto_json)) {
    throw new InvalidArgumentException("El JSON recibido no es válido.");
  }

  include_once $baseDir . "/Routes/datos_base.php";
  try {
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
    $pdo = new PDO("mysql:host={$host};dbname={$dbname};charset=utf8", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("SET NAMES utf8");

    $sql = "UPDATE LTYreporte SET ";
    $params = [];
    foreach ($objeto_json as $key => $value) {
      if ($key !== 'id') {
        // ✅ Asegurar que $key es string antes de usarlo en la cadena
        $keyString = (string) $key;
        $sql .= "$keyString = :$keyString, ";
        $params[$keyString] = $value;
      }
    }

    $sql = rtrim($sql, ', '); // Remueve la última coma
    $sql .= " WHERE idLTYreporte = :id"; // Utiliza el id para encontrar el registro correcto
    $params['id'] = $objeto_json['id'] ?? null;


    // Preparar y ejecutar la consulta SQL
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    $response = [
      'success' => true,
      'message' => 'El registro fue actualizado correctamente',
    ];
  } catch (PDOException $e) {
    error_log("Error al guardar cambios en reporte. Error: " . $e);
    // En caso de error, revertir la transacción y mostrar el mensaje de error.
    $response = [
      'success' => false,
      'message' => 'Error de base de datos: ' . $e->getMessage()
    ];
    return $response;
  } finally {
    // Cerrar la conexión a la base de datos.
    $pdo = null;
  }
  header('Content-Type: application/json');
  echo json_encode($response);
  exit;
}

header("Content-Type: application/json; charset=utf-8");
$datos = file_get_contents("php://input");
// $datos = $datox;
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
$datos = isset($data['q']) && is_string($data['q']) ? $data['q'] : '';
guardarCambiosReporte($datos);
