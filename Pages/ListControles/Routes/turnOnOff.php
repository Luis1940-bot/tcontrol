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
 * @return array{success: bool, actualizado?: array<int|string, mixed>, message?: string}
 */

function actualizar(string $target, int $plantx): array
{
  require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
  /** @var string $baseDir */
  $baseDir = BASE_DIR;
  include_once $baseDir . "/Routes/datos_base.php";
  include_once $baseDir .  "/Pages/ListControles/Routes/traerLTYcontrol.php";
  $response = ['success' => false, 'message' => 'Error desconocido.']; // Valor por defecto

  try {
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

    // 🔹 Decodificar `$target` como JSON
    $targetArray = json_decode($target, true);
    if (!is_array($targetArray)) {
      return ['success' => false, 'message' => 'Error: `$target` debe ser un JSON válido.'];
    }

    // 🔹 Asegurar que los valores existen y son del tipo correcto
    $id = $targetArray['item'] ?? null;
    $column = $targetArray['column'] ?? null;
    $valor = $targetArray['valor'] ?? null;
    $param = $targetArray['param'] ?? null;
    $operation = $targetArray['operation'] ?? null;
    $idLTYcliente = $plantx;

    $arrayCampo = [
      'reporte',
      'id',
      'control',
      'nombre',
      'tipodato',
      'detalle',
      'activo',
      'requerido',
      'visible',
      'enable1',
      'orden',
      'separador',
      'ok',
      'valor_defecto',
      'selector',
      'tiene_hijo',
      'rutina_hijo',
      'valor_sql',
      'tpdeobserva',
      'selector2',
      'valor_defecto22',
      'sql_valor_defecto22',
      'rutinasql',
      'idLTYreporte',
      'tipoDatoDetalle',
      'idLTYcliente'
    ];

    if (!isset($arrayCampo[$column])) {
      return ['success' => false, 'message' => 'Índice de columna inválido.'];
    }

    $campo = $arrayCampo[$column];

    // 🔹 Conexión a la base de datos
    $conn = mysqli_connect($host, $user, $password, $dbname);
    if (!$conn) {
      return ['success' => false, 'message' => 'Error en la conexión a la base de datos.'];
    }
    mysqli_query($conn, "SET NAMES 'utf8'");

    $sql = "UPDATE LTYcontrol SET " . $campo . " = ? WHERE idLTYcontrol = ?";
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
      return ['success' => false, 'message' => 'Error al preparar la consulta.'];
    }

    // 🔹 Manejo de operación "turnOnOff"
    if ($operation === 'turnOnOff') {
      $param = is_string($param) ? $param : '';
      $stmt->bind_param($param . "i", $valor, $id);
      if ($stmt->execute()) {

        $actualizado = traerControlActualizado($conn, $idLTYcliente);
        /** @var array{success: bool, data: string} $actualizadoArray */
        $actualizadoArray = json_decode($actualizado, true);
        $actualizadoArray = $actualizadoArray['data'];
        $response = array('success' => true, 'actualizado' => $actualizadoArray);
      } else {
        $response = ['success' => false, 'message' => 'No se actualizó la variable.'];
      }
    }

    // 🔹 Manejo de operación "upDown"
    elseif ($operation === 'upDown') {
      $resultado = false;
      if (!is_array($valor)) {
        return ['success' => false, 'message' => 'Error: `$valor` debe ser un array válido.'];
      }

      /** @var array<int, array{id: int, orden: int}> $valor */
      foreach ($valor as $value) {
        $param = is_string($param) ? $param : '';
        $stmt->bind_param($param . "i", $value['orden'], $value['id']);
        if ($stmt->execute()) {
          $resultado = true;
        } else {
          return ['success' => false, 'message' => 'No se pudo actualizar la variable.'];
        }
      }

      if ($resultado) {
        $actualizado = traerControlActualizado($conn, $idLTYcliente);
        $actualizadoArray = json_decode($actualizado, true);

        $actualizado = traerControlActualizado($conn, $idLTYcliente);
        /** @var array{success: bool, data: string} $actualizadoArray */
        $actualizadoArray = json_decode($actualizado, true);
        $actualizadoArray = $actualizadoArray['data'];
        $response = array('success' => true, 'actualizado' => $actualizadoArray);
      }
    }

    $stmt->close();
    $conn->close();

    // 🔹 Retornar JSON válido al cliente
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit;
  } catch (\Throwable $e) {
    error_log("Error en actualizar(): " . $e->getMessage());
    return ['success' => false, 'message' => 'Error al actualizar los datos.'];
  }
}



header("Content-Type: application/json; charset=utf-8");

// require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
$datos = file_get_contents("php://input");
// $datos = '{"q":{"item":"7813","column":14,"valor":10,"param":"i","id":"212","operation":"turnOnOff"},"ruta":"/turnOnOff","rax":"&new=Mon Feb 24 2025 15:44:08 GMT-0600 (hora estándar central)","sqlI":15}'; //campo
// $datos = '{"q":{"item":"7808","column":4,"valor":"t","param":"s","id":"14","operation":"turnOnOff"},"ruta":"/turnOnOff","rax":"&new=Sun Feb 02 2025 20:20:40 GMT-0300 (hora estándar de Argentina)","sqlI":15}';//tipodedato
// $datos = '{"q":{"item":"7806","column":4,"valor":"pastillatx","param":"s","id":"14","operation":"turnOnOff"},"ruta":"/turnOnOff","rax":"&new=Thu May 15 2025 13:41:29 GMT-0300 (hora estándar de Argentina)","sqlI":15}';

if (empty($datos)) {
  $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
  echo json_encode($response);
  exit;
}
$data = json_decode($datos, true);

if (is_array($data) && isset($data['q'], $data['sqlI'])) {
  $target = json_encode($data['q']);

  if ($target === false) {
    echo json_encode(['success' => false, 'message' => 'Error al convertir `$target` a JSON.']);
    exit;
  }

  $plantx = filter_var($data['sqlI'], FILTER_VALIDATE_INT);

  if ($plantx !== false) {
    actualizar($target, $plantx);
  } else {
    echo json_encode(['success' => false, 'message' => "'sqlI' no es un número válido."]);
  }
} else {
  echo json_encode(['success' => false, 'message' => 'Error al decodificar la cadena JSON o datos faltantes.']);
}
