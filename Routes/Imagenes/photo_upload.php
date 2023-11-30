<?php
header("Content-Type: text/html;charset=utf-8");
header('Content-Type: application/json');

$datos = $_POST['imgBase64'];

if (isset($datos)) {
    $dato_decodificado = urldecode($datos);
    $imgJson = json_decode($dato_decodificado, true);

    $srcArray = $imgJson['src'];
    $fileNameArray = $imgJson['fileName'];
    $extensionArray = $imgJson['extension'];

    $numImages = count($srcArray);

    if ($numImages === 0) {
        $response = array('success' => false, 'message' => 'No se proporcionaron imágenes para procesar.');
    } else {
        $responses = array();

        for ($i = 0; $i < $numImages; $i++) {
            $src = $srcArray[$i];
            $fileName = $fileNameArray[$i];
            $extension = $extensionArray[$i];

            if (empty($src) || empty($fileName) || empty($extension)) {
                $responses[] = array('success' => false, 'message' => "Elemento $i: La información enviada no es válida.");
                continue;
            }

            // Decodificar la imagen base64
            $imgData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $src));

            // Verificar el tamaño de la imagen (en bytes)
            $tamanioImagen = strlen($imgData);

            if ($tamanioImagen > 100 * 1024) {  // 100 KB en bytes
                // Redimensionar la imagen solo si es mayor a 100 KB
                $image = imagecreatefromstring($imgData);

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

                $resizedImage = imagecreatetruecolor($newWidth, $newHeight);
                imagecopyresampled($resizedImage, $image, 0, 0, 0, 0, $newWidth, $newHeight, imagesx($image), imagesy($image));

                // Convertir la imagen redimensionada a datos base64
                ob_start();
                imagejpeg($resizedImage, null, 100); // Calidad del JPEG: 100
                $resizedImageData = ob_get_clean();

                // Verificar el tamaño de la imagen redimensionada
                $resizedImageSize = strlen($resizedImageData);

                // Generar un nombre único para la imagen
                // $imageName = 'imagen_' . uniqid() . '.' . $extension;
                $imageName = $fileName;

                // Construir la ruta de la imagen
                $directorioImagenes = dirname(dirname(dirname($_SERVER['DOCUMENT_ROOT'] . $_SERVER['SCRIPT_NAME']))) . "/assets/Imagenes/";

                if (!file_exists($directorioImagenes)) {
                    mkdir($directorioImagenes, 0777, true);
                }

                $rutaImagen = $directorioImagenes . $imageName;

                // Guardar la imagen redimensionada en el servidor
                file_put_contents($rutaImagen, $resizedImageData);

                $responses[] = array(
                    'success' => true,
                    'message' => "Elemento $i: Imagen subida y redimensionada correctamente",
                    // 'rutaImagen' => $rutaImagen
                );

                imagedestroy($image);
                imagedestroy($resizedImage);
            } else {
                // Si la imagen es válida en términos de tamaño, proceder a guardarla como antes
                // Generar un nombre único para la imagen
                $imageName = 'imagen_' . uniqid() . '.' . $extension;

                // Construir la ruta de la imagen
                $directorioImagenes = dirname(dirname(dirname($_SERVER['DOCUMENT_ROOT'] . $_SERVER['SCRIPT_NAME']))) . "/assets/Imagenes/";

                if (!file_exists($directorioImagenes)) {
                    mkdir($directorioImagenes, 0777, true);
                }

                $rutaImagen = $directorioImagenes . $imageName;

                // Guardar la imagen original en el servidor
                file_put_contents($rutaImagen, $imgData);

                $responses[] = array(
                    'success' => true,
                    'message' => "Elemento $i: Imagen subida correctamente",
                    'rutaImagen' => $rutaImagen
                );
            }
        }

        $response = array('success' => true, 'data' => $responses);
    }
} else {
    $response = array('success' => false, 'message' => 'No se recibió la información esperada.');
}

echo json_encode($response);
exit;
?>
