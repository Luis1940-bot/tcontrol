<?php
require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
/** @var string $baseDir */
$baseDir = BASE_DIR;
include('generatorNuxPedido.php');
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
// include('datos.php'); //! MUTEAAAAAARRRRR

function convertToValidJson(string $dataString): string
{
  try {
    // error_log("=== insert DEBUG ===");
    // error_log("Input dataString: " . substr($dataString, 0, 200) . "...");

    // Como ahora JavaScript envía JSON válido, decodificar directamente
    $dataArray = json_decode($dataString, true);

    if (json_last_error() === JSON_ERROR_NONE) {
      // Es JSON válido, devolverlo formateado
      // error_log("IX: JSON válido directo");
      $result = json_encode($dataArray, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
      return $result ?: '';
    }

    // error_log("JSON no válido, error: " . json_last_error_msg());
    // error_log("String problemático: " . $dataString);

    return '';
  } catch (\Throwable $e) {
    error_log("Exception en convertToValidJson: " . $e->getMessage());
    return '';
  }
}


function insertar_registro(string $datos, int $idLTYcliente): string
{
  // Debug: Logging de datos recibidos
  // error_log("=== DEBUG INSERTAR_REGISTRO ===");
  // error_log("Datos originales: " . substr($datos, 0, 500) . "...");

  $dato_decodificado = urldecode($datos);
  // error_log("Después de urldecode: " . substr($dato_decodificado, 0, 500) . "...");

  $dato_decodificado = str_replace("'", '"', $dato_decodificado);
  // error_log("Después de replace quotes: " . substr($dato_decodificado, 0, 500) . "...");

  /** 
   * @var object{
   *     fecha?: array<string>|null,
   *     hora?: array<string>|null,
   *     idusuario?: array<string>|null,
   *     idLTYreporte?: array<string>|null,
   *     supervisor?: array<string>|null,
   *     observacion?: array<string>|null,
   *     objJSON: array<string>
   * } $objeto_json
   */

  // Decodificar JSON y verificar si es un objeto válido
  $objeto_json = json_decode($dato_decodificado);

  if (json_last_error() !== JSON_ERROR_NONE) {
    error_log("Error al decodificar JSON principal: " . json_last_error_msg());
    throw new InvalidArgumentException('Error al decodificar JSON principal: ' . json_last_error_msg());
  }

  // Acceder a los datos del JSON con seguridad
  $jsonString = $objeto_json->objJSON[0];
  // error_log("objJSON[0] extraído: " . substr($jsonString, 0, 500) . "...");

  // Ya no necesitamos hacer rtrim porque ahora viene JSON válido
  // Convertir jsonString a un JSON válido
  $nuevoObjetoJSON = convertToValidJson($jsonString);
  // error_log("JSON final generado: " . substr($nuevoObjetoJSON, 0, 500) . "...");

  if (empty($nuevoObjetoJSON)) {
    throw new InvalidArgumentException('Error: convertToValidJson devolvió string vacío');
  }


  // Acceder a otras propiedades del JSON
  if (property_exists($objeto_json, 'fecha') && is_array($objeto_json->fecha)) {
    $fecha = $objeto_json->fecha[0] ?? null;
  } else {
    throw new InvalidArgumentException('La propiedad "fecha" no existe o no es un arreglo.');
  }
  if (property_exists($objeto_json, 'hora') && is_array($objeto_json->hora)) {
    $hora = $objeto_json->hora[0] ?? null;
  } else {
    throw new InvalidArgumentException('La propiedad "hora" no existe o no es un arreglo.');
  }
  if (property_exists($objeto_json, 'idusuario') && is_array($objeto_json->idusuario)) {
    $idusuario = $objeto_json->idusuario[0] ?? null;
  } else {
    throw new InvalidArgumentException('La propiedad "idusuario" no existe o no es un arreglo.');
  }
  if (
    property_exists($objeto_json, 'idLTYreporte') && is_array($objeto_json->idLTYreporte)
  ) {
    $idLTYreporte = $objeto_json->idLTYreporte[0] ?? null;
  } else {
    throw new InvalidArgumentException('La propiedad "idLTYreporte" no existe o no es un arreglo.');
  }
  if (property_exists($objeto_json, 'supervisor') && is_array($objeto_json->supervisor)) {
    $supervisor = $objeto_json->supervisor[0] ?? null;
  } else {
    throw new InvalidArgumentException('La propiedad "supervisor" no existe o no es un arreglo.');
  }
  if (property_exists($objeto_json, 'observacion') && is_array($objeto_json->observacion)) {
    $observacion = $objeto_json->observacion[0] ?? null;
  } else {
    throw new InvalidArgumentException('La propiedad "observacion" no existe o no es un arreglo.');
  }


  // Generar el nuxpedido
  $nuxpedido = generaNuxPedido();
  error_log("JSON SQL25: " . $idLTYcliente . "  DOC: " . $nuxpedido . "  usuario: " . $idusuario);

  $campos = 'fecha, nuxpedido, idusuario, idLTYreporte, supervisor, observacion, newJSON, idLTYcliente,hora';
  $interrogantes = '?,?,?,?,?,?,?,?,?';
  /** @var int $cantidad_insert */
  $cantidad_insert = 0;

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

  $pdo = new PDO("mysql:host={$host};dbname={$dbname};port={$port};charset={$charset}", $user, $password, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"));

  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  $pdo->beginTransaction();
  $sql = "INSERT INTO LTYregistrocontrol (" . $campos . ") VALUES (" . $interrogantes . ");";

  $insert = [$fecha, $nuxpedido, $idusuario, $idLTYreporte, $supervisor, $observacion, $nuevoObjetoJSON, $idLTYcliente, $hora];
  $sentencia = $pdo->prepare($sql);
  $sentencia->execute($insert);
  $cantidad_insert = $sentencia->rowCount();

  $pdo->commit();
  if ($cantidad_insert > 0) {
    // echo "El registro se insertó correctamente";
    $response = array('success' => true, 'message' => 'La operación fue exitosa!', 'registros' => $cantidad_insert, 'documento' => $nuxpedido);
    // echo json_encode($response);
  } else {
    // echo "No se insertó ningún registro";
    $response = array('success' => false, 'message' => 'Algo salió mal no hay registros insertados');
    error_log('ix-JSON response: ' . 'Algo salió mal no hay registros insertados' . $nuxpedido);
    // echo json_encode($response);
  }
  $pdo = null;
  echo json_encode($response);
  exit;
}

header("Content-Type: application/json; charset=utf-8");
$datos = file_get_contents("php://input");
// $datos = $datox; //! MUTEAAAAAARRRRR
if (empty($datos)) {
  $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
  echo json_encode($response);
  exit;
}

$data = json_decode($datos, true);

// error_log('ix-JSON response: ' . json_encode($data));
if (is_array($data)) {
  $datos = is_string($data['q']) ? $data['q'] : '';
  // $sql25 = is_int($data['sql25']) ? $data['sql25'] : 0;
  // $sql25 = isset($data['sql25']) && is_numeric($data['sql25']) ? (int)$data['sql25'] : 0;
  $sql25 = 0;
  $sql25 = (int)$data['sql25'];
  // if (isset($data['sql25'])) {
  //   if (is_int($data['sql25'])) {
  //     $sql25 = $data['sql25'];
  //   } elseif (is_string($data['sql25']) && ctype_digit($data['sql25'])) {
  //     $sql25 = (int)$data['sql25'];
  //   }
  // }

  error_log("[sql25]=====: " . $sql25);
  error_log("SQL25>>>>>: " . $sql25 . "  type: " . gettype($sql25));

  // Verifica que los valores sean válidos antes de llamar a la función
  if ($datos !== '') {
    insertar_registro($datos, $sql25);
  } else {
    echo "Datos inválidos para insertar registro.";
    error_log('Datos inválidos: q=' . json_encode($datos) . ', sql25=' . json_encode($sql25));
  }
} else {
  echo "Error al decodificar la cadena JSON";
  error_log('ix-JSON response: ' . "Error al decodificar la cadena JSON");
}
