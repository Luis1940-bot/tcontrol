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
// include('datos.php'); //! MUTEAAAARRRR
// mb_internal_encoding('UTF-8');
// include('datos.php');


function convertToValidJson(string $dataString): string
{
  try {
    // error_log("=== convertToValidJson UPDATE DEBUG ===");
    // error_log("Input dataString: " . substr($dataString, 0, 200) . "...");

    // Como ahora JavaScript envía JSON válido, decodificar directamente
    $dataArray = json_decode($dataString, true);

    if (json_last_error() === JSON_ERROR_NONE) {
      // Es JSON válido, devolverlo formateado
      // error_log("UX: JSON válido directo para UPDATE");
      $result = json_encode($dataArray, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
      return $result ?: '';
    }

    // error_log("JSON no válido en UPDATE, error: " . json_last_error_msg());
    // error_log("String problemático: " . $dataString);

    return '';
  } catch (\Throwable $e) {
    error_log("Exception en convertToValidJson UPDATE: " . $e->getMessage());
    return '';
  }
}


function update_registro(string $datos, string $nuxpedido): string
{
  try {
    // Debug: Logging de datos recibidos
    // error_log("=== DEBUG UPDATE_REGISTRO ===");
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
     *     objJSON: array<string>,
     *     imagenes: array<string>|null
     * } $objeto_json
     */

    // Decodificar JSON y verificar si es un objeto válido
    $objeto_json = json_decode($dato_decodificado);

    if (json_last_error() !== JSON_ERROR_NONE) {
      error_log("Error al decodificar JSON principal en UPDATE: " . json_last_error_msg());
      throw new InvalidArgumentException('Error al decodificar JSON principal: ' . json_last_error_msg());
    }

    // Acceder a los datos del JSON con seguridad
    $jsonString = $objeto_json->objJSON[0];
    // error_log("objJSON[0] extraído para UPDATE: " . substr($jsonString, 0, 500) . "...");

    // Ya no necesitamos hacer rtrim porque ahora viene JSON válido
    // Convertir jsonString a un JSON válido
    $nuevoObjetoJSON = convertToValidJson($jsonString);
    // error_log("JSON final generado para UPDATE: " . substr($nuevoObjetoJSON, 0, 500) . "...");

    if (empty($nuevoObjetoJSON)) {
      throw new InvalidArgumentException('Error: convertToValidJson devolvió string vacío en UPDATE');
    }



    // $fecha = $objeto_json->fecha[0];
    // $hora = $objeto_json->hora[0];
    // $idusuario = $objeto_json->idusuario[0];
    // $supervisor = $objeto_json->supervisor[0];
    // $observacion = $objeto_json->observacion[0] || "";
    // $imagenes = $objeto_json->imagenes[0] || "";
    $cantidad_insert = 0;

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
    if (property_exists($objeto_json, 'imagenes') && is_array($objeto_json->imagenes)) {
      $imagenes = $objeto_json->imagenes[0] ?? null;
    } else {
      throw new InvalidArgumentException('La propiedad "imagenes" no existe o no es un arreglo.');
    }
    error_log("JSON UPDATE DOC: " . $nuxpedido . "  usuario: " . $idusuario);
    // echo $fecha . '\n';
    // echo $idusuario . '\n';
    // echo $supervisor . '\n';
    // echo $observacion . '\n';
    // echo $imagenes . '\n';

    // var_dump($nuevoObjetoJSON);

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
    $conn = mysqli_connect($host, $user, $password, $dbname, $port);
    if (!$conn) { // Verifica si la conexión falló
      $errorMessage = json_encode(['success' => false, 'message' => "Conexión fallida: " . mysqli_connect_error()]);
      if ($errorMessage === false) {
        $errorMessage = '{"success":false,"message":"Error desconocido al codificar JSON"}';
      }
      return $errorMessage;
    }

    mysqli_set_charset($conn, $charset);
    $sql = "UPDATE LTYregistrocontrol SET fecha = ?, idusuario = ?, supervisor = ?, observacion = ?, imagenes = ?, newJSON = ?, hora = ? WHERE nuxpedido = ?";

    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
      $errorMessage = json_encode([
        'success' => false,
        'message' => "Error al preparar la consulta: " . $conn->error
      ]);

      // Si json_encode devuelve false, asignamos un JSON válido manualmente.
      if ($errorMessage === false) {
        $errorMessage = '{"success":false,"message":"Error desconocido al codificar JSON"}';
      }

      return $errorMessage;
    }

    $stmt->bind_param("siisssss", $fecha, $idusuario, $supervisor, $observacion, $imagenes, $nuevoObjetoJSON, $hora, $nuxpedido);

    if ($stmt->execute() === true) {
      $cantidad_insert = 1;
      $response = array('success' => true, 'message' => 'La operacion fue exitosa!', 'registros' => $cantidad_insert, 'documento' => $nuxpedido);
    } else {
      $response = array('success' => false, 'message' => 'No se actualizo el control.');
      error_log('ix-JSON response: ' . 'No se actualizo el control' . $nuxpedido);
    }
    $stmt->close();
    $conn->close();

    header('Content-Type: application/json');
    // echo  json_encode($response);
    $result = json_encode($response);

    if ($result === false) {
      $result = '{"success":false,"message":"Error desconocido al codificar JSON"}';
    }
    echo $result;
    return '';
  } catch (\Throwable $e) {
    error_log("Error al actualizar registro: " . $nuxpedido);
    // print "Error!: " . $e->getMessage() . "<br>";
    // die();
    $errorMessage = json_encode(['success' => false, 'message' => 'Error inesperado: ' . $e->getMessage()]);

    if ($errorMessage === false) {
      $errorMessage = '{"success":false,"message":"Error desconocido al codificar JSON"}';
    }

    return $errorMessage;
  }
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

// error_log('ux-JSON response: ' . json_encode($data));

if (is_array($data)) {
  $datos = is_string($data['q']) ? $data['q'] : '';
  $nux = is_string($data['nux']) ? $data['nux'] : '';
  error_log("NUX>>>>>: " . $nux);
  update_registro($datos, $nux);
} else {
  echo "Error al decodificar la cadena JSON";
  error_log('ux-JSON response: ' . "Error al decodificar la cadena JSON");
}
