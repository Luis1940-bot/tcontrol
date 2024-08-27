<?php
require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
require_once dirname(dirname(dirname(__DIR__))) . '/ErrorLogger.php';
ErrorLogger::initialize(dirname(dirname(dirname(__DIR__))) . '/logs/error.log');
if (isset($_SESSION['timezone'])) {
    date_default_timezone_set($_SESSION['timezone']);
} else {
    date_default_timezone_set('America/Argentina/Buenos_Aires');
}
mb_internal_encoding('UTF-8');
// include('datos.php');

function convertToValidJson($dataString) {

  try {
    // Añadir comillas dobles alrededor de las claves
  $dataString = preg_replace('/(\w+):/', '"$1":', $dataString);

  // Corregir formato del campo "valor"
  $dataString = preg_replace_callback('/"valor":\s*\[(.*?)\]/', function($matches) {
      $content = $matches[1];
      $pattern = '/""(\d{2})":(\d{2})"/';
      $match = [];
      preg_match_all($pattern, $content, $match);
      // Corregir el formato de la hora dentro de "valor"
      $content = preg_replace($pattern, '"' . $match[1][0] . ':' . $match[2][0] . '"', $content); // Corregir el formato de la hora ""HH:MM  
      // Reemplazar comillas dobles por comillas simples dentro de los objetos
      $content = preg_replace_callback('/\{(.*?)\}/', function($submatches) {
          return '{' . str_replace('"', "'", $submatches[1]) . '}';
      }, $content);
      return '"valor": [' . $content . ']';
  }, $dataString);

  // Corregir formato del campo "imagenes"
  $dataString = preg_replace_callback('/"imagenes":\s*\[(.*?)\]/', function($matches) {
      $content = $matches[1];
      $content = preg_replace("/''/", '""', $content); // Convertir comillas simples vacías a comillas dobles vacías
      $content = preg_replace('/\'/', '"', $content); // Convertir comillas simples a comillas dobles
      $content = preg_replace_callback('/\{(.*?)\}/', function($submatches) {
          $submatches[1] = str_replace('"', "'", $submatches[1]); // Convertir comillas dobles a comillas simples dentro del objeto
          $submatches[1] = preg_replace('/fileName/', "'fileName'", $submatches[1]); // Reemplazar "fileName" con 'fileName'
          $submatches[1] = preg_replace('/extension/', "'extension'", $submatches[1]); // Reemplazar "extension" con 'extension'
          $submatches[1] = preg_replace_callback('/\[(.*?)\]/', function($arrayMatches) {
              return '[' . str_replace('"', "'", $arrayMatches[1]) . ']'; // Convertir comillas dobles a comillas simples dentro de los arrays
          }, $submatches[1]);
          return '{' . $submatches[1] . '}';
      }, $content);
      return '"imagenes": [' . $content . ']';
  }, $dataString);

  // Corregir formato del campo "email"
  $dataString = preg_replace_callback('/"email":\s*\{(.*?)\}/', function($matches) {
    // Corregir el formato de la hora dentro de "email"
      $content = $matches[1];
      $pattern = '/""(\d{2})":(\d{2})"/';
      $match = [];
      preg_match_all($pattern, $matches[1], $match);
      $content = preg_replace($pattern, '"' . $match[1][0] . ':' . $match[2][0] . '"', $content); 
      $content = str_replace('"', "'", $content);

      $content = preg_replace("/'https:\/\/(.*?)'/", '"https://$1"', $content); // Corregir formato de URL
      return '"email": "{' . $content . '}"';
  }, $dataString);

  // Verificar "fileName" y "extension" dentro de "imagenes"
  $dataString = preg_replace_callback('/"imagenes":\s*\[(.*?({.*?}).*?)\]/', function($matches) {
      $content = $matches[1];
      $content = preg_replace_callback('/\{(.*?)\}/', function($submatches) {
          $submatches[1] = preg_replace('/"fileName"/', "'fileName'", $submatches[1]); // Reemplazar "fileName" con 'fileName'
          $submatches[1] = preg_replace('/"extension"/', "'extension'", $submatches[1]); // Reemplazar "extension" con 'extension'
          $submatches[1] = preg_replace('/"plant"/', "'plant'", $submatches[1]); // Reemplazar "plant" con 'plant'
          $submatches[1] = preg_replace('/"carpeta"/', "'carpeta'", $submatches[1]); // Reemplazar "carpeta" con 'carpeta'
          $submatches[1] = preg_replace_callback('/\[(.*?)\]/', function($arrayMatches) {
              return '[' . str_replace('"', "'", $arrayMatches[1]) . ']'; // Convertir comillas dobles a comillas simples dentro de los arrays
          }, $submatches[1]);
          return '{' . $submatches[1] . '}';
      }, $content);
      return '"imagenes": [' . $content . ']';
  }, $dataString);

  // Corregir formato del campo "hora"
  $dataString = preg_replace_callback('/"hora":\s*\[(.*?)\]/', function($matches) {
      $content = $matches[1];
      $pattern = '/""(\d{2})":(\d{2})"/';
      $match = [];
      preg_match_all($pattern, $content, $match);
      // Corregir el formato de la hora dentro de "hora"
      $content = preg_replace($pattern, '"' . $match[1][0] . ':' . $match[2][0] . '"', $content); // Corregir el formato de la hora ""HH:MM  
      // Reemplazar comillas dobles por comillas simples dentro de los objetos
      $content = preg_replace_callback('/\{(.*?)\}/', function($submatches) {
          return '{' . str_replace('"', "'", $submatches[1]) . '}';
      }, $content);
      return '"hora": [' . $content . ']';
  }, $dataString);


      // Convertir el string a un array asociativo
      $dataArray = json_decode('{' . $dataString . '}', true);


      // Verificar si la conversión fue exitosa
      if (json_last_error() === JSON_ERROR_NONE) {
          // Convertir el array asociativo a JSON
          $jsonData = json_encode($dataArray, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
          return $jsonData;
      } else {
          echo "Error al convertir el string a JSON: " . json_last_error_msg();
      }
  } catch (\Throwable $e) {
     error_log("Error decoding JSON: " . $e);
    print "Error!: ".$e->getMessage()."<br>";

  }

}


function update_registro($datos, $nuxpedido) {
try {
    $dato_decodificado =urldecode($datos);
    $objeto_json = json_decode($dato_decodificado);
    $jsonString = $objeto_json->objJSON[0];
    // $jsonString = substr($jsonString, 1);
    $jsonString = rtrim($jsonString, '}');
    $jsonString = rtrim($jsonString, '}');

    $nuevoObjetoJSON = convertToValidJson($jsonString); 
    if (json_last_error() !== JSON_ERROR_NONE) {
        die('Error al codificar JSON: ' . json_last_error_msg());
    }
  
 
    $fecha = $objeto_json->fecha[0];
    $hora = $objeto_json->hora[0];
    $idusuario = $objeto_json->idusuario[0];
    $supervisor = $objeto_json->supervisor[0];
    $observacion = $objeto_json->observacion[0] || "";
    $imagenes = $objeto_json->imagenes[0] || "";
    $cantidad_insert = 0;

    // echo $fecha.'\n';
    // echo $idusuario.'\n';
    // echo $supervisor.'\n';
    // echo $observacion.'\n';
    // echo $imagenes.'\n';

    // var_dump($nuevoObjetoJSON);
   
    include_once BASE_DIR . "/Routes/datos_base.php";
    $conn = mysqli_connect($host,$user,$password,$dbname);
    if ($conn->connect_error) {
        die("Conexión fallida: " . $conn->connect_error);
    }
    mysqli_set_charset($conn, "utf8");
    $sql = "UPDATE LTYregistrocontrol SET fecha = ?, idusuario = ?, supervisor = ?, observacion = ?, imagenes = ?, newJSON = ?, hora = ? WHERE nuxpedido = ?"; 

    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        die("Error al preparar la consulta: " . $conn->error);
    }
    $stmt->bind_param("siisssss", $fecha , $idusuario , $supervisor , $observacion , $imagenes , $nuevoObjetoJSON, $hora, $nuxpedido);

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
    echo  json_encode($response);
} catch (\Throwable $e) {
   error_log("Error al actualizar registro: " . $nuxpedido);
  print "Error!: ".$e->getMessage()."<br>";
  die();
}
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

// error_log('ux-JSON response: ' . json_encode($data));

if ($data !== null) {
  $datos = $data['q'];
  $nux = $data['nux'];

  update_registro($datos, $nux);
} else {
  echo "Error al decodificar la cadena JSON";
  error_log('ux-JSON response: ' . "Error al decodificar la cadena JSON");
}
?>