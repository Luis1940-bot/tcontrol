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



function guardarArea(string $datos): void
{

  $dato_decodificado = urldecode($datos);
  $objeto_json = json_decode($dato_decodificado, true);

  if (json_last_error() !== JSON_ERROR_NONE) {
    $response = [
      'success' => false,
      'message' => 'Error al decodificar JSON: ' . json_last_error_msg()
    ];
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
  }

  require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
  /** @var string $baseDir */
  $baseDir = BASE_DIR;
  // include('datos.php');
  include_once $baseDir . "/Routes/datos_base.php";
  /** @var string $charset */
  /** @var string $dbname */
  /** @var string $host */
  /** @var int $port */
  /** @var string $password */
  /** @var string $user */
  /** @var PDO $pdo */
  $host = "34.174.211.66";
  $user = "uumwldufguaxi";
  $password = "5lvvumrslp0v";
  $dbname = "db5i8ff3wrjzw3";
  $port = 3306;
  $charset = "utf8mb4";
  try {
    // /** @var array{area?: string, idLTYcliente?: int, activo?: string, visible?: string} $objeto_json */
    /** 
     * @var array{q?: array{area?: string, idLTYcliente?: int, activo?: string, visible?: string}} $objeto_json 
     */
    $q = is_array($objeto_json['q'] ?? null) ? $objeto_json['q'] : [];

    $area = $q['area'] ?? '';
    $idLTYcliente = $q['idLTYcliente'] ?? 0;
    $activo = $q['activo'] ?? '';
    $visible = $q['visible'] ?? '';


    // $q = $objeto_json['q'] ?? [];
    // $area = $q['area'] ?? '';
    // $idLTYcliente = $q['idLTYcliente'] ?? '';
    // $activo = $q['activo'] ?? '';
    // $visible = $q['visible'] ?? '';

    $campos = "areax, idLTYcliente, activo, visible";
    $interrogantes = "?, ?, ?, ?";

    $pdo = new PDO("mysql:host={$host};dbname={$dbname};charset=utf8", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("SET NAMES utf8");

    // Preparar la consulta SQL.
    $sql = "INSERT INTO LTYarea ($campos) VALUES ($interrogantes)";
    $stmt = $pdo->prepare($sql);

    // Vinculación de parámetros.
    $stmt->bindParam(1, $area);
    $stmt->bindParam(2, $idLTYcliente);
    $stmt->bindParam(3, $activo);
    $stmt->bindParam(4, $visible);

    // Ejecución de la transacción.
    $pdo->beginTransaction();
    $stmt->execute();
    $lastInsertedId = $pdo->lastInsertId();
    $cantidad_insert = $stmt->rowCount();
    $pdo->commit();
    $response = ($cantidad_insert > 0)
      ? ['success' => true, 'message' => 'La operacion fue exitosa!', 'registros' => $cantidad_insert, 'last_insert_id' => $lastInsertedId]
      : ['success' => false, 'message' => 'Algo salio mal, no hay registros insertados'];
  } catch (PDOException $e) {
    error_log("Error al guardar nueva area. Error: " . $e);
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
// $datos = '{"q":{"idLTYarea":"","area":"desa","idLTYcliente":15,"activo":"s","visible":"s"},"ruta":"/guardarAreaNuevo","rax":"&new=Fri Jan 31 2025 12:16:19 GMT-0300 (hora estándar de Argentina)"}';

if (empty($datos)) {
  $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
  echo json_encode($response);
  exit;
}

guardarArea($datos);
