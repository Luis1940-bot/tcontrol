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
      $content = preg_replace_callback(
        '/\{(.*?)\}/',
        function ($submatches) {
          $submatches[1] = preg_replace('/"fileName"/', "'fileName'", $submatches[1]); // Reemplazar "fileName" con 'fileName'
          $submatches[1] = preg_replace('/"extension"/', "'extension'", $submatches[1] ?? ''); // Reemplazar "extension" con 'extension'
          $submatches[1] = preg_replace('/"plant"/', "'plant'", $submatches[1] ?? ''); // Reemplazar "plant" con 'plant'
          $submatches[1] = preg_replace('/"carpeta"/', "'carpeta'", $submatches[1] ?? ''); // Reemplazar "carpeta" con 'carpeta'
          $submatches[1] = preg_replace_callback('/\[(.*?)\]/', function ($arrayMatches) {
            return '[' . str_replace('"', "'", $arrayMatches[1]) . ']'; // Convertir comillas dobles a comillas simples dentro de los arrays
          }, $submatches[1] ?? '');
          return '{' . $submatches[1] . '}';
        },
        $content
      );
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


function update_registro(string $datos, string $nuxpedido): string
{
  try {
    $dato_decodificado = urldecode($datos);
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
    $objeto_json = json_decode($dato_decodificado);
    $jsonString = $objeto_json->objJSON[0] ?? '';


    $jsonString = rtrim((string)$jsonString, '}');
    $jsonString = rtrim((string)$jsonString, '}');

    $nuevoObjetoJSON = convertToValidJson($jsonString);



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
