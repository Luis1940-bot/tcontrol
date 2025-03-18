<?php
// ini_set('display_errors', '1');
// ini_set('display_startup_errors', '1');
// error_reporting(E_ALL);

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
// include('datos.php'); //! MUTEAAAARRRR

function convertToValidJson(string $dataString): string
{

  try {
    /** @var string $dataString */
    // Añadir comillas dobles alrededor de las claves

    // $dataString = preg_replace('/(\w+):/', '"$1":', $dataString);
    $dataString = preg_replace('/(\w+):(?=[\s\{"])/', '"$1":', $dataString);

    // Corregir el formato del campo "valor"
    $dataString = preg_replace_callback(
      '/"valor":\s*\[(.*?)\]/',
      function ($matches) {
        /** @var string $content */
        $content = $matches[1];


        // Buscar los patrones del formato de tiempo ""HH":MM"
        $pattern = '/""(\d{2})":(\d{2})"/';
        $match = [];
        preg_match_all($pattern, $content, $match);

        // Corregir el formato de las horas encontradas
        if (!empty($match[0])) {
          foreach ($match[0] as $key => $originalTime) {
            $correctedTime = '"' . $match[1][$key] . ':' . $match[2][$key] . '"';
            $content = str_replace($originalTime, $correctedTime, $content);
          }
        }

        // Reemplazar comillas dobles por comillas simples dentro de los objetos JSON válidos
        $content = preg_replace_callback(
          '/\{(.*?)\}/',
          function ($submatches) {
            return '{' . str_replace('"', "'", $submatches[1]) . '}';
          },
          $content
        );

        return '"valor": [' . $content . ']';
      },
      $dataString
    );

    // Corregir formato del campo "imagenes"
    $dataString = preg_replace_callback('/"imagenes":\s*\[(.*?)\]/', function ($matches) {
      $content = $matches[1];
      $content = preg_replace("/''/", '""', $content); // Convertir comillas simples vacías a comillas dobles vacías
      assert(is_string($content));
      $content = preg_replace('/\'/', '"', $content); // Convertir comillas simples a comillas dobles
      /** @var string|null $content */
      $content = preg_replace_callback('/\{(.*?)\}/', function ($submatches) {
        $submatches[1] = str_replace('"', "'", $submatches[1]); // Convertir comillas dobles a comillas simples dentro del objeto
        $submatches[1] = preg_replace('/fileName/', "'fileName'", $submatches[1]); // Reemplazar "fileName" con 'fileName'
        $submatches[1] = preg_replace('/extension/', "'extension'", $submatches[1] ?? ''); // Reemplazar "extension" con 'extension'
        $submatches[1] = preg_replace_callback('/\[(.*?)\]/', function ($arrayMatches) {
          return '[' . str_replace('"', "'", $arrayMatches[1]) . ']'; // Convertir comillas dobles a comillas simples dentro de los arrays
        }, $submatches[1] ?? '');
        return '{' . $submatches[1] . '}';
      }, $content ?? '');
      return '"imagenes": [' . $content . ']';
    }, $dataString ?? '');

    // Corregir formato del campo "email"
    $dataString = preg_replace_callback('/"email":\s*\{(.*?)\}/', function ($matches) {
      // Corregir el formato de la hora dentro de "email"
      $content = $matches[1];
      $pattern = '/""(\d{2})":(\d{2})"/';
      $match = [];
      preg_match_all($pattern, $matches[1], $match);
      $content = preg_replace($pattern, '"' . $match[1][0] . ':' . $match[2][0] . '"', $content);
      $content = str_replace('"', "'", $content ?? '');

      $content = preg_replace('/"url":"(https:\/\/.*?)"/', "'url':'$1'", $content);

      // $content = preg_replace("/'https:\/\/(.*?)'/", '"https://$1"', $content); // Corregir formato de URL
      return '"email": "{' . $content . '}"';
    }, $dataString ?? '');

    // Verificar "fileName" y "extension" dentro de "imagenes"
    $dataString = preg_replace_callback('/"imagenes":\s*\[(.*?({.*?}).*?)\]/', function ($matches) {
      $content = $matches[1];
      $content = preg_replace_callback('/\{(.*?)\}/', function ($submatches) {
        $submatches[1] = preg_replace('/"fileName"/', "'fileName'", $submatches[1]); // Reemplazar "fileName" con 'fileName'
        $submatches[1] = preg_replace('/"extension"/', "'extension'", $submatches[1] ?? ''); // Reemplazar "extension" con 'extension'
        $submatches[1] = preg_replace('/"plant"/', "'plant'", $submatches[1] ?? ''); // Reemplazar "plant" con 'plant'
        $submatches[1] = preg_replace('/"carpeta"/', "'carpeta'", $submatches[1] ?? ''); // Reemplazar "carpeta" con 'carpeta'
        $submatches[1] = preg_replace_callback('/\[(.*?)\]/', function ($arrayMatches) {
          return '[' . str_replace('"', "'", $arrayMatches[1]) . ']'; // Convertir comillas dobles a comillas simples dentro de los arrays
        }, $submatches[1] ?? '');
        return '{' . $submatches[1] . '}';
      }, $content);
      return '"imagenes": [' . $content . ']';
    }, $dataString ?? '');

    // Corregir formato del campo "hora"
    $dataString = preg_replace_callback('/"hora":\s*\[(.*?)\]/', function ($matches) {
      $content = $matches[1];
      $pattern = '/""(\d{2})":(\d{2})"/';
      $match = [];
      preg_match_all($pattern, $content, $match);
      // Corregir el formato de la hora dentro de "hora"
      $content = preg_replace($pattern, '"' . $match[1][0] . ':' . $match[2][0] . '"', $content); // Corregir el formato de la hora ""HH:MM  
      // Reemplazar comillas dobles por comillas simples dentro de los objetos
      $content = preg_replace_callback('/\{(.*?)\}/', function ($submatches) {
        return '{' . str_replace('"', "'", $submatches[1]) . '}';
      }, $content ?? '');
      return '"hora": [' . $content . ']';
    }, $dataString ?? '');

    $dataString = preg_replace_callback('/"detalle":\s*\[(.*?)\]/s', function ($matches) {
      $content = $matches[1];

      // Mantener las comillas al inicio y final de cada elemento, pero eliminar comillas dobles internas
      $content = preg_replace('/"([^"]*?)"\s*([A-Z])\s*"([^"]*?)"/', '"$1 $2 $3"', $content);

      return '"detalle": [' . $content . ']';
    }, $dataString ?? '');



    $jsonString = trim($dataString ?? '');
    $jsonString = preg_replace('/[\x00-\x1F\x7F]/', '', $jsonString);

    // 📌 Verificación antes de json_decode()
    // echo "JSON antes de decodificar:\n" . '{' . $jsonString . '}' . "\n";

    // Convertir el string a un array asociativo
    $dataArray = json_decode('{' . $jsonString . '}', true);


    // Verificar si la conversión fue exitosa
    if (json_last_error() === JSON_ERROR_NONE) {
      // Convertir el array asociativo a JSON
      $jsonData = json_encode($dataArray, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
      return $jsonData ?: '';
    } else {
      echo "Error al convertir el string a JSON: " . json_last_error_msg();
      return '';
    }
  } catch (\Throwable $e) {
    error_log("Error al insertar un registro nuevo en LTYregistrocontrol. Error: " . $e);
    print "Error!: " . $e->getMessage() . "<br>";
    return '';
  }
}


function insertar_registro(string $datos, int $idLTYcliente): string
{

  $dato_decodificado = urldecode($datos);


  $dato_decodificado = str_replace("'", '"', $dato_decodificado);


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

  // Acceder a los datos del JSON con seguridad
  $jsonString = $objeto_json->objJSON[0];

  // Procesar jsonString
  $jsonString = rtrim($jsonString, '}');
  $jsonString = rtrim($jsonString, '}');

  // Convertir jsonString a un JSON válido
  $nuevoObjetoJSON = convertToValidJson($jsonString);


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
  $sql25 = is_int($data['sql25']) ? $data['sql25'] : 0;

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
