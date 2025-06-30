<?php
// ini_set('display_errors', '1');
// ini_set('display_startup_errors', '1');
// error_reporting(E_ALL);
header("Content-Type: text/html;charset=utf-8");


require_once dirname(dirname(__DIR__)) . '/ErrorLogger.php';
// Inicializar el logger con la ruta deseada
ErrorLogger::initialize((dirname(dirname(__DIR__))) . '/logs/error.log');
/** 
 * @var array{timezone?: string} $_SESSION 
 */
if (isset($_SESSION['timezone']) && is_string($_SESSION['timezone'])) {
  date_default_timezone_set($_SESSION['timezone']);
} else {
  date_default_timezone_set('America/Argentina/Buenos_Aires');
}
// include('datos.php');
// // $datos = $_POST['imgBase64'];
$datos = $_POST['imgBase64'] ?? '';
if (!is_string($datos)) {
  error_log("Error: imgBase64 no es una cadena.");
  die(json_encode(['success' => false, 'message' => 'Formato inválido de imgBase64.']));
}
// $datos = $datox;

if (!empty($datos)) {
  require_once dirname(dirname(__DIR__)) . '/config.php';
  /** @var string $baseDir */
  $baseDir = BASE_DIR;
  // $dato_decodificado = ($datos);//urldecode

  $imgJson = json_decode($datos, true);

  // Verificar errores de decodificación JSON
  if (!is_array($imgJson)) {
    $errorMessage = json_last_error_msg();
    error_log("Error al decodificar JSON: $errorMessage");
    die(json_encode(['success' => false, 'message' => "Error al decodificar JSON: $errorMessage"]));
  }

  // Asignar valores con fallback a arrays vacíos si no existen
  $srcArray       = isset($imgJson['src']) && is_array($imgJson['src']) ? $imgJson['src'] : [];
  $fileNameArray  = isset($imgJson['fileName']) && is_array($imgJson['fileName']) ? $imgJson['fileName'] : [];
  $extensionArray = isset($imgJson['extension']) && is_array($imgJson['extension']) ? $imgJson['extension'] : [];
  $plant          = isset($imgJson['plant']) && is_array($imgJson['plant']) ? $imgJson['plant'] : [];
  $carpeta        = isset($imgJson['carpeta']) && is_array($imgJson['carpeta']) ? $imgJson['carpeta'] : [];



  // $imgJson = json_decode($datos, true);
  // if ($imgJson === null && json_last_error() !== JSON_ERROR_NONE) {
  //   error_log('Error al decodificar JSON: ' . json_last_error_msg());
  //   die('Error al decodificar JSON: ' . json_last_error_msg());
  // }
  // if (!is_array($imgJson)) {
  //   error_log("Error: JSON decodificado no es un array válido.");
  //   die(json_encode(['success' => false, 'message' => 'Formato inválido de JSON.']));
  // }

  // // Ahora podemos acceder a las claves sin problemas
  // $srcArray = $imgJson['src'] ?? [];
  // $fileNameArray = $imgJson['fileName'] ?? [];
  // $extensionArray = $imgJson['extension'] ?? [];
  // $plant = $imgJson['plant'] ?? [];
  // $carpeta = $imgJson['carpeta'] ?? [];

  // $srcArray = $imgJson['src'];
  // $fileNameArray = $imgJson['fileName'];
  // $extensionArray = $imgJson['extension'];
  // $plant = $imgJson['plant'];
  // $carpeta = $imgJson['carpeta'];


  $numImages = count($srcArray);

  if ($numImages === 0) {
    $response = array('success' => false, 'message' => 'No se proporcionaron imágenes para procesar.');
  } else {
    $responses = array();
    $elemento = 0;
    for ($i = 0; $i < $numImages; $i++) {
      // $src = $srcArray[$i];
      $src = isset($srcArray[$i]) && is_string($srcArray[$i]) ? $srcArray[$i] : '';
      $fileName = $fileNameArray[$i];
      $extension = $extensionArray[$i];
      $elemento = $elemento + 1;
      if (empty($src) || empty($fileName) || empty($extension)) {
        $responses[] = array('success' => false, 'message' => "Elemento $elemento: La información enviada no es válida.");
        continue;
      }

      $cleanSrc = preg_replace('#^data:image/\w+;base64,#i', '', $src);
      $cleanSrc = is_string($cleanSrc) ? $cleanSrc : '';
      // Decodificar la imagen base64
      // $imgData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $src));
      $imgData = base64_decode($cleanSrc, true);

      if ($imgData === false) {
        error_log("Error al decodificar la imagen base64 en el elemento $elemento.");
        $responses[] = ['success' => false, 'message' => "Elemento $elemento: Error al procesar la imagen."];
        continue;
      }

      // Verificar el tamaño de la imagen (en bytes)
      $tamanioImagen = strlen($imgData);

      if ($tamanioImagen > 100 * 1024) {  // 100 KB en bytes
        // Redimensionar la imagen solo si es mayor a 100 KB
        $image = imagecreatefromstring($imgData);
        if ($image === false) {
          error_log("Error al crear la imagen desde la cadena base64 en el elemento $elemento.");
          $responses[] = ['success' => false, 'message' => "Elemento $elemento: Imagen inválida."];
          continue;
        }
        // Nuevo tamaño deseado
        $newWidth = 400; // Ancho en píxeles
        $newHeight = 400; // Altura en píxeles

        // Redimensionar la imagen utilizando la relación de aspecto original
        $aspectRatio = imagesx($image) / imagesy($image);
        if ($aspectRatio > 1) {
          $newHeight = $newWidth / $aspectRatio;
        } else {
          $newWidth = $newHeight * $aspectRatio;
        }
        $newWidth = max(1, (int) round($newWidth));
        $newHeight = max(1, (int) round($newHeight));
        $resizedImage = imagecreatetruecolor($newWidth, $newHeight);
        imagecopyresampled($resizedImage, $image, 0, 0, 0, 0, $newWidth, $newHeight, imagesx($image), imagesy($image));

        // Convertir la imagen redimensionada a datos base64
        ob_start();
        imagejpeg($resizedImage, null, 100); // Calidad del JPEG: 100
        $resizedImageData = ob_get_clean() ?: '';

        // Verificar el tamaño de la imagen redimensionada
        $resizedImageSize = strlen($resizedImageData);

        // Generar un nombre único para la imagen
        // $imageName = 'imagen_' . uniqid() . '.' . $extension;
        $imageName = $fileName;

        // Construir la ruta de la imagen


        // $directorioImagenes = dirname(dirname(__DIR__)) . '/assets/imagenes/' . $plant[$i] . '/';
        // $directorioImagenes = IMAGE  . $carpeta[$i]  . $plant[$i] . '/';
        $carpetaPath = isset($carpeta[$i]) && is_string($carpeta[$i]) ? $carpeta[$i] : '';
        $plantPath = isset($plant[$i]) && is_string($plant[$i]) ? $plant[$i] : '';

        $directorioImagenes = IMAGE . $carpetaPath . $plantPath . '/';

        if (!file_exists($directorioImagenes)) {
          $creado = mkdir($directorioImagenes, 0777, true);
          if (!$creado) {
            $lastError = error_get_last();
            error_log("Error al crear directorio: " . print_r($lastError, true));
          }
        }

        // Verificar permisos del directorio
        if (file_exists($directorioImagenes) && !is_writable($directorioImagenes)) {
          error_log("Directorio no escribible: " . $directorioImagenes);
        }
        $rutaImagen = $directorioImagenes . (is_string($imageName) ? $imageName : '');

        // $rutaImagen = $directorioImagenes . $imageName;
        // echo IMAGE;
        // echo '--------------------------\n';
        // echo '93-  '.$directorioImagenes;
        //  echo '94-  '.$rutaImagen;
        // Guardar la imagen redimensionada en el servidor
        $bytesEscritos = file_put_contents($rutaImagen, $resizedImageData);
        if ($bytesEscritos === false) {
          error_log("ERROR: No se pudo escribir la imagen redimensionada en: " . $rutaImagen);
          $responses[] = ['success' => false, 'message' => "Elemento $elemento: Error al guardar la imagen."];
          continue;
        }

        // Verificar que el archivo realmente existe
        if (!file_exists($rutaImagen)) {
          error_log("PROBLEMA: archivo NO existe después de guardarlo en " . $rutaImagen);
        }

        $responses[] = array(
          'success' => true,
          'message' => "Elemento $elemento: Imagen subida y redimensionada correctamente",
        );

        imagedestroy($image);
        imagedestroy($resizedImage);
      } else {
        // Si la imagen es válida en términos de tamaño, proceder a guardarla como antes
        // Generar un nombre único para la imagen
        $imageName = $fileName;
        // $imageName = 'imagen_' . uniqid() . '.' . $extension;

        // Construir la ruta de la imagen


        // $directorioImagenes = dirname(dirname(__DIR__)) . '/assets/imagenes/' . $plant[$i] . '/';
        // $directorioImagenes = IMAGE . $carpeta[$i] . $plant[$i] . '/';
        $carpetaElemento = isset($carpeta[$i]) && is_string($carpeta[$i]) ? $carpeta[$i] : '';
        $plantElemento = isset($plant[$i]) && is_string($plant[$i]) ? $plant[$i] : '';

        $directorioImagenes = IMAGE . $carpetaElemento . $plantElemento . '/';

        if (!file_exists($directorioImagenes)) {
          $creado = mkdir($directorioImagenes, 0777, true);
          if (!$creado) {
            $lastError = error_get_last();
            error_log("Error al crear directorio (original): " . print_r($lastError, true));
          }
        }

        // Verificar permisos del directorio
        if (file_exists($directorioImagenes) && !is_writable($directorioImagenes)) {
          error_log("Directorio no escribible (original): " . $directorioImagenes);
        }
        $rutaImagen = $directorioImagenes . (is_string($imageName) ? $imageName : '');

        // $rutaImagen = $directorioImagenes . $imageName;
        // echo '121-  '.$rutaImagen;
        // Guardar la imagen original en el servidor
        $bytesEscritos = file_put_contents($rutaImagen, $imgData);
        if ($bytesEscritos === false) {
          error_log("ERROR: No se pudo escribir la imagen original en: " . $rutaImagen);
          $responses[] = ['success' => false, 'message' => "Elemento $i: Error al guardar la imagen."];
          continue;
        }

        // Verificar que el archivo realmente existe
        if (!file_exists($rutaImagen)) {
          error_log("PROBLEMA: archivo NO existe después de guardarlo en " . $rutaImagen);
        }

        $responses[] = array(
          'success' => true,
          'message' => "Elemento $i: Imagen subida correctamente",
        );
      }
    }

    $response = array('success' => true, 'data' => $responses);
    echo json_encode($response);
    exit;
  }
} else {
  error_log("Error al subir imágenes");
  $response = array('success' => false, 'message' => 'No se recibió la información esperada.');
  echo json_encode($response);
  exit;
}
