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


// include('datos.php');


/**
 * Guarda los cambios en un reporte en la base de datos.
 *
 * @param string $datos JSON con los datos a actualizar
 * @param int $plant
 * @return array{success: bool, message: string} Respuesta con el estado de la operación
 */
function guardarReporte(string $datos, int $plant): array

{

  require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
  /** @var string $baseDir */
  $baseDir = BASE_DIR;
  include_once "addCamposBasicos.php";

  $dato_decodificado = urldecode($datos);
  $objeto_json = json_decode($dato_decodificado, true);

  if (!is_array($objeto_json)) {
    throw new InvalidArgumentException("El JSON recibido no es válido.");
  }

  $i = 0;
  $campos = '';
  $placeholders = '';
  foreach ($objeto_json as $clave => $valor) {
    $claveString = (string) $clave; // ✅ Convertir a string para evitar errores

    $campos = $campos ? $campos . ',' . $claveString : $claveString;
    $placeholders = $placeholders ? $placeholders . ',' . ':' . $claveString : ':' . $claveString;
    $i++;
  }

  $idLTYcliente = $plant;

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
    $pdo = new PDO("mysql:host={$host};dbname={$dbname};charset={$charset}", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("SET NAMES utf8");

    // Preparar la consulta SQL.
    $sql = "INSERT INTO LTYreporte ($campos) VALUES ($placeholders)";
    $stmt = $pdo->prepare($sql);

    // Vinculación de parámetros.
    foreach ($objeto_json as $clave => $valor) {
      $stmt->bindValue(":$clave", $valor);
    }

    // Ejecución de la transacción.
    $pdo->beginTransaction();
    $stmt->execute();
    $lastInsertedId = $pdo->lastInsertId();
    $cantidad_insert = $stmt->rowCount();
    $pdo->commit();

    // ✅ Asegurar que 'nombre' es un string
    $nombre = isset($objeto_json['nombre']) && is_string($objeto_json['nombre'])
      ? $objeto_json['nombre']
      : '';

    // ✅ Eliminar isset() porque $lastInsertedId siempre existe
    $lastInsertedId = is_numeric($lastInsertedId) ? (int) $lastInsertedId : 0;



    // Respuesta dependiendo del resultado de la inserción.
    if ($cantidad_insert > 0) {
      // addCampos($objeto_json->nombre, $pdo, $lastInsertedId, $idLTYcliente);
      // ✅ Asegurar que 'nombre' es un string antes de pasarlo a addCampos
      $nombre = isset($objeto_json['nombre']) && is_string($objeto_json['nombre'])
        ? $objeto_json['nombre']
        : '';

      // ✅ Llamada segura a addCampos
      addCampos($nombre, $pdo, $lastInsertedId, $idLTYcliente);
      $response = [
        'success' => true,
        'message' => 'La operación fue exitosa!',
        'registros' => $cantidad_insert,
        'last_insert_id' => $lastInsertedId
      ];
    } else {
      $response = [
        'success' => false,
        'message' => 'Algo salió mal, no hay registros insertados'
      ];
    }
  } catch (PDOException $e) {
    error_log("Error al insertar reporte nuevo. Error: " . $e);
    // En caso de error, revertir la transacción y mostrar el mensaje de error.
    $pdo->rollBack();
    $response = [
      'success' => false,
      'message' => 'Error de base de datos: ' . $e->getMessage()
    ];
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
// $datos = '{"q":"%7B%22nombre%22%3A%22LUIS%22%2C%22detalle%22%3A%22luis%22%2C%22idLTYcliente%22%3A15%2C%22idLTYarea%22%3A16%2C%22titulo%22%3A%22luis%22%2C%22rotulo1%22%3A%22LUIS%22%2C%22rotulo2%22%3A%22%22%2C%22rotulo3%22%3A%22PRODUCCI%C3%93N%22%2C%22rotulo4%22%3A%22%22%2C%22piedeinforme%22%3A%22luis%22%2C%22firma1%22%3A%22LUIS%22%2C%22firma2%22%3A%22%22%2C%22firma3%22%3A%22%22%2C%22foto%22%3A%22n%22%2C%22activo%22%3A%22s%22%2C%22elaboro%22%3A%22luis%22%2C%22reviso%22%3A%22uis%22%2C%22aprobo%22%3A%22lusi%22%2C%22regdc%22%3A%22uis%22%2C%22vigencia%22%3A%2211%2F04%2F2025%22%2C%22cambio%22%3A%22%22%2C%22modificacion%22%3A%2211%2F04%2F2025%22%2C%22version%22%3A%2201%22%2C%22frecuencia%22%3A0%2C%22testimado%22%3A5%2C%22asignado%22%3A0%2C%22nivel%22%3A%221%22%2C%22envio_mail%22%3A0%2C%22direcciones_mail%22%3A%22%22%7D","ruta":"/guardarReporteNuevo","rax":"&new=Fri Apr 11 2025 14:59:54 GMT-0300 (hora estándar de Argentina)","planta":15}';

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
$plant = isset($data['planta']) && is_int($data['planta']) ? $data['planta'] : 0;
guardarReporte($datos, $plant);
