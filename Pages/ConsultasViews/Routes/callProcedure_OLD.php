<?php
mb_internal_encoding('UTF-8');
// if (!isset($_SESSION['login_sso']['email'] )) {
//     unset($_SESSION['login_sso']['email'] ); 
// }

/**
 * @param array<int, list<float|int|string|null>> $arr_customers
 * @return array<int, list<float|int|string|null>>
 */
function sumaSimple(array $arr_customers): array
{
  return [];
}

/**
 * @param array<int, list<float|int|string|null>> $arr_customers
 * @return array<int, list<float|int|string|null>>
 */
function sumaDWT(array $arr_customers): array
{
  return [];
}

/**
 * @param array<int, list<float|int|string|null>> $arr_customers
 * @return array<int, list<float|int|string|null>>
 */
function sumaDWTFritas(array $arr_customers): array
{
  return [];
}


function consultar(string $call, ?string $desde = null, ?string $hasta = null, string $operation): void
{
  require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
  /** @var string $baseUrl */
  $baseUrl = BASE_URL;

  // Usar ruta relativa basada en la estructura del proyecto
  $routesPath = dirname(dirname(dirname(__DIR__))) . '/Routes/datos_base.php';

  // Verificar que el archivo existe antes de incluirlo
  if (!file_exists($routesPath)) {
    error_log("Archivo datos_base.php no encontrado en: $routesPath");
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error de configuración del servidor']);
    exit;
  }

  include_once $routesPath;

  //  include_once $_SERVER['DOCUMENT_ROOT']."/Routes/datos_base.php";

  // $pdo = new PDO("mysql:host={$host};dbname={$dbname};port={$port};chartset={$charset}",$user,$password);


  try {
    // Llamada al procedimiento almacenado con parámetros
    $sql = "CALL " . $call . "('" . $desde . "', '" . $hasta . "')";
    if ($desde === null || $hasta === null) {
      $sql = "CALL " . $call . "()";
    }
    // Validar que las variables de conexión estén definidas y sean cadenas
    if (!isset($host, $user, $password, $dbname) || !is_string($host) || !is_string($user) || !is_string($password) || !is_string($dbname)) {
      http_response_code(500);
      echo json_encode(['success' => false, 'message' => 'Parámetros de conexión no válidos.']);
      exit;
    }

    // Establecer conexión
    $con = mysqli_connect($host, $user, $password, $dbname);

    if (!$con) {
      http_response_code(500);
      echo json_encode(['success' => false, 'message' => 'Error al conectar a la base de datos: ' . mysqli_connect_error()]);
      exit;
    }

    // Configurar el conjunto de caracteres
    mysqli_query($con, "SET NAMES 'utf8'");

    // Ejecutar consulta
    $result = mysqli_query($con, $sql);

    if (!$result || $result === true) {
      http_response_code(500);
      echo json_encode(['success' => false, 'message' => 'Error en la consulta SQL: ' . mysqli_error($con)]);
      mysqli_close($con);
      exit;
    }

    // Procesar resultados
    $arr_customers = [];
    $column_names = [];

    // Obtener nombres de las columnas
    while ($column = mysqli_fetch_field($result)) {
      $column_names[] = $column->name;
    }

    $arr_customers[] = $column_names;

    // Obtener filas de la consulta
    while ($row = mysqli_fetch_assoc($result)) {
      $arr_customers[] = array_values($row);
    }

    // Devolver resultados como JSON
    // echo json_encode(['success' => true, 'data' => $arr_customers], JSON_UNESCAPED_UNICODE);

    // Inicializar $arrayResultdo para evitar problemas de variables indefinidas
    $arrayResultdo = [];

    // Verificar si $operation es válido y hay suficientes datos en $arr_customers
    if (!empty($operation) && count($arr_customers) > 1) {
      // Incluir dinámicamente los archivos necesarios
      switch ($operation) {
        case 'sum':
          include_once('sumaSimple.php');
          // if (function_exists('sumaSimple')) {
          //     $arrayResultdo = sumaSimple($arr_customers);
          // }
          break;

        case 'DWT':
          include_once('sumaDWT.php');
          // if (function_exists('sumaDWT')) {
          //     $arrayResultdo = sumaSimple($arr_customers);
          // }
          break;

        case 'DWTFritas':
          include_once('sumaDWTFritas.php');
          // if (function_exists('sumaDWTFritas')) {
          //     $arrayResultdo = sumaSimple($arr_customers);
          // }
          break;

        default:
          // Si la operación no es reconocida, usar $arr_customers como resultado
          $arrayResultdo = $arr_customers;
          break;
      }
      $arrayResultdo = sumaSimple($arr_customers);
    } else {
      // Si no hay operación válida o datos insuficientes
      $arrayResultdo = $arr_customers;
    }

    // Convertir a JSON y devolver los resultados
    $json = json_encode($arrayResultdo, JSON_UNESCAPED_UNICODE);
    echo $json;

    // Cerrar la conexión a la base de datos
    mysqli_close($con);

    // $pdo=null;
  } catch (\PDOException $e) {
    print "Error!: " . $e->getMessage() . "<br>";
    die();
  }
}

header("Content-Type: application/json; charset=utf-8");
$datos = file_get_contents("php://input");
// $datos = '{"q":"proc_DWTFritasL1","desde":"2024-01-01","hasta":"2024-01-03","operation":"DWTFritas"}';
// $datos = '{"q":"proc_15_cuali_proveedores","desde":"2024-01-01","hasta":"2024-12-10","operation":null,"ruta":"/callProcedure","rax":"&new=Tue Oct 01 2024 19:52:19 GMT-0300 (hora estándar de Argentina)"}';
$datos = '{"q":"proc_102_copias","desde":"2025-06-01","hasta":"2025-06-30","operation":null,"ruta":"/callProcedure","rax":"&new=Mon Jun 30 2025 10:33:23 GMT-0300 (hora estándar de Argentina)"}';
if (empty($datos)) {
  $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
  echo json_encode($response);
  exit;
}
// Decodificar JSON asegurando que es un array
$data = json_decode($datos, true);

// Validar si la decodificación fue exitosa
if (!is_array($data)) {
  echo json_encode(['success' => false, 'message' => "Error al decodificar la cadena JSON: " . json_last_error_msg()]);
  exit;
}

// Extraer valores asegurando que sean cadenas o valores válidos
$q = isset($data['q']) && is_string($data['q']) ? $data['q'] : '';
$desde = isset($data['desde']) && is_string($data['desde']) ? $data['desde'] : null;
$hasta = isset($data['hasta']) && is_string($data['hasta']) ? $data['hasta'] : null;
$operation = isset($data['operation']) && is_string($data['operation']) ? $data['operation'] : '';

// Llamar a la función con valores validados
consultar($q, $desde, $hasta, $operation);
