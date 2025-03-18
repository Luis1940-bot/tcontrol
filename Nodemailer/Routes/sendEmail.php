<?php
declare(strict_types=1);
  header("Content-Type: text/html;charset=utf-8");
  header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
  header("Expires: Sat, 1 Jul 2000 05:00:00 GMT"); // Fecha en el pasado
  header ("MIME-Version: 1.0\r\n");
  date_default_timezone_set('America/Argentina/Buenos_Aires');

  require_once dirname(dirname(__DIR__)) . '/config.php';
  /** @var string $baseDir */
  $baseDir = BASE_DIR;

  define('EMAIL', $baseDir .'/Nodemailer/emailTenki');

  ini_set('display_errors', '1');
  ini_set('display_startup_errors', '1');
  error_reporting(E_ALL);
  set_time_limit(0);

require $baseDir . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

// require __DIR__ . '/../PHPMailer-6.8.0/PHPMailer-6.8.0/src/Exception.php';
// require __DIR__ . '/../PHPMailer-6.8.0/PHPMailer-6.8.0/src/PHPMailer.php';
// require __DIR__ . '/../PHPMailer-6.8.0/PHPMailer-6.8.0/src/SMTP.php';


// include('datos.php');

/**
 * Decodifica una cadena JSON en un array de objetos stdClass.
 *
 * @param int $typo Tipo que puede afectar el comportamiento de la función.
 * @param string $jsonString
 * @return array<int, stdClass>|array<int, array<string, mixed>> Retorna un array de objetos stdClass o un array de arrays asociativos, dependiendo del valor de $typo.
 * @throws Exception Si ocurre un error al decodificar el JSON.
 */
function validateJson(int $typo, string $jsonString): array {
    $array = json_decode($jsonString, true);

    // Verifica si hubo un error al decodificar el JSON
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Error al decodificar JSON: " . json_last_error_msg());
    }
    
    // Retornamos el array decodificado según el tipo
    if ($typo === 0) {
      /** @phpstan-ignore-next-line */
        return  $array;  // Devuelve array de objetos stdClass
    }

    if ($typo === 1) {
      /** @phpstan-ignore-next-line */
        return (array) $array;  // Devuelve array de arrays asociativos
    }

    throw new Exception("Tipo no válido para la decodificación.");

}







try {

  // Verificar que los datos POST estén definidos y sean cadenas
  // $datos = isset($datox) && is_string($datox) ? validateJson(0, $datox) : [];
  // $encabezados = isset($encabezadox) && is_string($encabezadox) ? validateJson(1,$encabezadox) : [];
  
  $datos = isset($_POST['datos']) && is_string($_POST['datos']) ? validateJson(0, $_POST['datos']) : [];
  $encabezados = isset($_POST['encabezados']) && is_string($_POST['encabezados']) ? validateJson(1, $_POST['encabezados']) : [];

  // Verificar errores JSON después de la decodificación
  if ($datos === [] || $encabezados === []) {
      die('Error al decodificar JSON');
  }
    
    $documento = isset($encabezados['documento']) && is_string($encabezados['documento']) ? $encabezados['documento'] : ''; // @phpstan-ignore-line
    $address = isset($encabezados['address']) && is_string($encabezados['address']) ? $encabezados['address'] : ''; // @phpstan-ignore-line
    $fecha = isset($encabezados['fecha']) && is_string($encabezados['fecha']) ? $encabezados['fecha'] : ''; // @phpstan-ignore-line
    $hora = isset($encabezados['hora']) && is_string($encabezados['hora']) ? $encabezados['hora'] : ''; // @phpstan-ignore-line
    $notificador = isset($encabezados['notificador']) && is_string($encabezados['notificador']) ? $encabezados['notificador'] : ''; // @phpstan-ignore-line
    $planta = isset($encabezados['planta']) && is_string($encabezados['planta']) ? $encabezados['planta'] : ''; // @phpstan-ignore-line
    $plant = isset($encabezados['idPlanta']) ? (string) $encabezados['idPlanta'] : ''; // @phpstan-ignore-line
    $titulo = isset($encabezados['titulo']) && is_string($encabezados['titulo']) ? $encabezados['titulo'] : ''; // @phpstan-ignore-line
    $url = isset($encabezados['url']) && is_string($encabezados['url']) ? $encabezados['url'] : ''; // @phpstan-ignore-line
    $fechaDeAlerta = isset($encabezados['fechaDeAlerta']) && is_string($encabezados['fechaDeAlerta']) ? $encabezados['fechaDeAlerta'] : ''; // @phpstan-ignore-line
    $horaDeAlerta = isset($encabezados['horaDeAlerta']) && is_string($encabezados['horaDeAlerta']) ? $encabezados['horaDeAlerta'] : ''; // @phpstan-ignore-line
    $notifica = isset($encabezados['notifica']) && is_string($encabezados['notifica']) ? $encabezados['notifica'] : ''; // @phpstan-ignore-line
    $sistema = isset($encabezados['sistema']) && is_string($encabezados['sistema']) ? $encabezados['sistema'] : ''; // @phpstan-ignore-line
    $irA = isset($encabezados['irA']) && is_string($encabezados['irA']) ? $encabezados['irA'] : ''; // @phpstan-ignore-line
    $concepto = isset($encabezados['concepto']) && is_string($encabezados['concepto']) ? $encabezados['concepto'] : ''; // @phpstan-ignore-line
    $relevamiento = isset($encabezados['relevamiento']) && is_string($encabezados['relevamiento']) ? $encabezados['relevamiento'] : ''; // @phpstan-ignore-line
    $detalle = isset($encabezados['detalle']) && is_string($encabezados['detalle']) ? $encabezados['detalle'] : ''; // @phpstan-ignore-line
    $observacion = isset($encabezados['observacion']) && is_string($encabezados['observacion']) ? $encabezados['observacion'] : ''; // @phpstan-ignore-line
    $subject = isset($encabezados['subject']) && is_string($encabezados['subject']) ? $encabezados['subject'] : ''; // @phpstan-ignore-line
    $idLTYreporte = isset($encabezados['idLTYreporte']) && is_string($encabezados['idLTYreporte']) ? $encabezados['idLTYreporte'] : ''; // @phpstan-ignore-line
    $reporte = isset($encabezados['reporte']) && is_string($encabezados['reporte']) ? $encabezados['reporte'] : ''; // @phpstan-ignore-line
    
    $cliente = $plant . '-' . $planta;
    $idPlanta = $plant;

ob_start();
include($baseDir . '/Nodemailer/emailTenki/email.html');
$html = ob_get_clean();
$html = is_string($html) ? $html : '';
   
$html = str_replace('{planta}', $cliente, $html);
$html = str_replace('{notificacion}', $titulo, $html);
$html = str_replace('{nombreDeControl}', $reporte, $html);
$html = str_replace('{fechaDeAlerta}', $fechaDeAlerta, $html);
$html = str_replace('{fecha}', $fecha, $html);
$html = str_replace('{horaDeAlerta}', $horaDeAlerta, $html);
$html = str_replace('{hora}', $hora, $html);
$html = str_replace('{notifica}', $notifica, $html);
$html = str_replace('{notificador}', $notificador, $html);
$html = str_replace('{entreEnElSistema}', $sistema, $html);
$html = str_replace('{nuxPedido}', $documento, $html);
$html = str_replace('{irA}', $irA, $html);
$html = str_replace('{href}', $url, $html);
$html = str_replace('{concepto}', $concepto, $html);
$html = str_replace('{relevamiento}', $relevamiento, $html);
$html = str_replace('{detalle}', $detalle, $html);
$html = str_replace('{observacion}', $observacion , $html);
$html = str_replace('{contenido_dinamico}',  generarContenidoDinamico($datos, $plant), $html);
   
  //  echo 'html>>>> '.$html;
  // Cargar el archivo de configuración
  include_once $baseDir . "/Routes/datos_base.php";

    // $host = "34.174.211.66"; //"68.178.195.199"; 
    // $user = "uumwldufguaxi"; //"developers";
    // $password = "5lvvumrslp0v"; //"6vLB#Q0bOVo4";
    // $dbname = "db5i8ff3wrjzw3"; //"tc" . $plant . $number;
    // $port = 3306;
    // $charset = "utf-8";
  // Verificar que las variables estén definidas y sean cadenas
  $host = isset($host) && is_string($host) ? $host : '';
  $dbname = isset($dbname) && is_string($dbname) ? $dbname : '';
  $port = isset($port) && is_numeric($port) ? $port : '';
  $user = isset($user) && is_string($user) ? $user : '';
  $password = isset($password) && is_string($password) ? $password : '';

  // Crear la instancia de PDO solo si todas las variables están correctamente definidas
  if ($host !== '' && $dbname !== '' && $port !== '' && $user !== '' && $password !== '') {
      try {
          $pdo = new PDO("mysql:host={$host};dbname={$dbname};port={$port};charset=utf8", $user, $password, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
          $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
          
          // Preparar y ejecutar la declaración SQL
          // $stmt = $pdo->prepare("INSERT INTO email_queue (email_address, subject, body, nx, idLTYreporte, idPlant) VALUES (:email_address, :subject, :body, :nx, :idLTYreporte, :idPlant)");
          $stmt = $pdo->prepare("INSERT INTO email_queue (email_address, subject, body, nx, idLTYreporte, idPlant, status) 
          VALUES (:email_address, :subject, :body, :nx, :idLTYreporte, :idPlant, 'pending')");

          $stmt->execute([
              ':email_address' => $address,
              ':subject' => $subject,
              ':body' => $html,
              ':nx' => $documento,
              'idLTYreporte' => $idLTYreporte,
              'idPlant' => $idPlanta,
          ]);
      } catch (PDOException $e) {
          die('Error en la conexión a la base de datos: ' . $e->getMessage());
      }
  } else {
      die('Error: Las variables de conexión a la base de datos no están definidas correctamente.');
  }

    if (ob_get_length()) {
        ob_end_clean(); // Solo limpiar si hay un buffer activo
    }
    // ob_clean();
    // $response = array('success' => true, 'message' => 'El email se envio con exito!', 'reporte' => $reporte, 'documento' => $documento);
    // echo json_encode($response);

    // Detectar el sistema operativo
    $os = strtoupper(substr(PHP_OS, 0, 3));
    $script_path = $baseDir . '/Nodemailer/Routes/queue_processor.php';
    if ($os === 'WIN') {
        // Comando para Windows
        $command = 'start /B php ' . escapeshellarg($script_path) . ' 2>&1';
    } else {
        // Comando para Linux
        $command = 'nohup php ' . escapeshellarg($script_path) . '  > /dev/null 2>&1 & echo $!';
    }
  //. ' > /dev/null 2>& 2>&1'
  //   $pid = exec($command);
  //   if ($pid) {
  //       logMessage("Script de cola lanzado con PID: $pid");
  //   } else {
  //       logMessage("Error al lanzar el script de cola.");
  //   }
  // return;

  // Capturar salida y errores
    $output = [];
    $return_var = null;
    // logMessage("Ejecutando comando: " . escapeshellarg($command));
    exec($command, $output, $return_var);

    if ($return_var === 0) {
        logMessage("Script de cola lanzado con PID.");
        // logMessage("Script de cola lanzado con PID: " . implode(", ", $output));
        $response = array('success' => true, 'message' => 'Correo encolado para envío', 'reporte' => $reporte, 'documento' => $documento);
    } else {
        logMessage("Error al lanzar el script de cola. Verifica los permisos y configuración.");
        // logMessage("Error al lanzar el script de cola: " . implode(", ", $output));
        $response = array('success' => false, 'message' => 'Error al lanzar el script de cola.');
    }
    echo json_encode($response);
    // return;
    exit;
} catch (Exception $e) {
  echo json_encode(['success' => false, 'message' => 'Error en el envío del correo: ' . $e->getMessage()]);
  // echo "Error en el envío del correo: " . $e->getMessage();
}


/** * Registra un mensaje en el archivo de log. * * @param string $message El mensaje a registrar. * @return void */
function logMessage(string $message) : void {
      /** @var string $baseDir */
    $baseDir = BASE_DIR;
    $logFile = $baseDir . '/logs/sendEmail.log';
    $maxSize = 5 * 1024 * 1024; // 5MB

    // Rotar el log si supera el tamaño máximo
    if (file_exists($logFile) && filesize($logFile) > $maxSize) {
        rename($logFile, $logFile . '.' . date('Y-m-d_H-i-s') . '.bak');
    }

    $timestamp = date('Y-m-d H:i:s');
    // file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
    // file_put_contents($logFile, date('[Y-m-d H:i:s] ') . $message .  PHP_EOL, FILE_APPEND | LOCK_EX);
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND | LOCK_EX);
}

// $whoami_script = BASE_DIR . '/Nodemailer/Routes/whoami.php';
// $whoami_output = shell_exec('php ' . escapeshellarg($whoami_script));

// logMessage("Usuario que ejecuta el script: " . $whoami_output);

?>


<?php
function utf8_to_iso8859_1(string $string): string {
    $s = (string) $string;
    $len = \strlen($s);

    for ($i = 0, $j = 0; $i < $len; ++$i, ++$j) {
        switch ($s[$i] & "\xF0") {
            case "\xC0":
            case "\xD0":
                $c = (\ord($s[$i] & "\x1F") << 6) | \ord($s[++$i] & "\x3F");
                $s[$j] = $c < 256 ? \chr($c) : '?';
                break;

            case "\xF0":
                ++$i;
                // no break

            case "\xE0":
                $s[$j] = '?';
                $i += 2;
                break;

            default:
                $s[$j] = $s[$i];
        }
    }

    return substr($s, 0, $j);
}

function getStyleAttributes(string $display, string $colSpan, bool $bold, string $paddingLeft, string $fontSize = "12px"): string {
    return sprintf(
        'border: 1px solid #cecece; padding-left: %s; font-style:normal; font-size:%s; %s %s %s',
        $paddingLeft,
        $fontSize,
        $bold ? 'font-weight:bold;' : '',
        $display === 'none' ? 'display:none;' : '',
        $colSpan ? 'colspan="' . $colSpan . '"' : ''
    );
}

/**
 * Renderiza una celda de la tabla.
 */
function renderTableCell(string $content, string $display, string $colSpan, bool $bold, string $paddingLeft, string $fontSize = "12px"): string {
    return sprintf(
        '<td style="%s" %s>%s</td>',
        getStyleAttributes($display, $colSpan, $bold, $paddingLeft, $fontSize),
        $colSpan ? 'colspan=".$colSpan."' : '',
        htmlspecialchars($content, ENT_QUOTES, 'UTF-8')
    );
}

/**
 * Renderiza una celda de imagen en la tabla.
 */
function renderImageCell(string $imagePath, int $width, int $height, int $colSpan = 3): string {
    return sprintf(
        '<td style="border: 1px solid #cecece; padding-left: 10px;" colspan="%s">
            <img src="%s" alt="img" width="%s" height="%s">
        </td>',
        $colSpan, htmlspecialchars($imagePath, ENT_QUOTES, 'UTF-8'), $width, $height
    );
}

/**
 * Genera contenido dinámico basado en los datos proporcionados.
 *
 * @param mixed $datos Los datos para generar el contenido (puede ser array o stdClass).
 * @param string $plant La planta asociada.
 * @return string El contenido dinámico generado.
 */
function generarContenidoDinamico($datos, string $plant) : string {
    // Convertir stdClass a array si es necesario
    if ($datos instanceof stdClass) {
        $json = json_encode($datos);
        if ($json !== false) { // Verificar que json_encode no haya fallado
            $datos = json_decode($json, true);
        } else {
            return ''; // Retornar vacío si json_encode falla
        }
    }

    // Validar que $datos sea un array antes de continuar
    if (!is_array($datos)) {
        return ''; // Retornar cadena vacía si los datos no son válidos
    }

    // Verificar que $datos contenga arrays internos (es decir, un array de arrays)
    $primerElemento = reset($datos);
    if (!is_array($primerElemento)) {
        $datos = [$datos]; // Convertir en un array de arrays
    }

    // Segunda verificación para asegurarse de que sigue siendo un array de arrays
    $primerElemento = reset($datos);
    if (!is_array($primerElemento)) {
        return ''; // Si sigue sin ser válido, retornar vacío
    }
    $contenido = ''; 

    foreach ($datos as $elemento) {
        if (!is_array($elemento)) continue; // Seguridad ante datos inesperados

        $contenido .= '<tr style="background:#fff; width:100%; height:20px;">';

        // Definir estilos generales
        $bold = ($elemento['colSpanName'] ?? '1') !== '1';
        $paddingLeft = $bold ? '50px' : '10px';

        // Columna "name"
      $contenido .= renderTableCell(
          is_scalar($elemento['name']) ? strval($elemento['name']) : '',
          is_scalar($elemento['displayName']) ? strval($elemento['displayName']) : '',
          is_scalar($elemento['colSpanName']) ? strval($elemento['colSpanName']) : '',
          $bold,
          $paddingLeft
      );


        // Manejo de "valor"
  // Aseguramos que el valor de 'valor' sea una cadena antes de pasarlo a trim()
  // Verificamos que 'valor' sea una cadena válida antes de usarlo
  $valor = isset($elemento['valor']) && is_string($elemento['valor']) ? trim($elemento['valor']) : '';

  // Verificamos que 'displayDetalle' sea una cadena válida antes de intentar hacer json_decode
  $displayDetalle = isset($elemento['displayDetalle']) && is_string($elemento['displayDetalle']) ? $elemento['displayDetalle'] : '{}';
  $array = json_decode($displayDetalle, true);

  // Verificamos que $array sea un array válido antes de intentar acceder a sus claves
  if (is_array($array)) {
      // Ahora que sabemos que $array es un array, accedemos a sus valores
      $img = isset($array['img']) && is_string($array['img']) ? $array['img'] : '';
      $width = isset($array['width']) && is_numeric($array['width']) ? (int) $array['width'] : 50;
      $height = isset($array['height']) && is_numeric($array['height']) ? (int) $array['height'] : 50;
  } else {
      // Si json_decode falla y no es un array válido, asignamos valores predeterminados
      $img = '';
      $width = 50;
      $height = 50;
  }
  /** @var string $basePlanos */
      $basePlanos = BASE_PLANOS;
  // Aseguramos que la ruta sea válida si $img es una cadena
  $filePath = !empty($img) ? $basePlanos . $plant . '/' . $img : '';

  // Si el valor es 'photo', renderizamos la celda de imagen
  if ($valor === 'photo') {
      $contenido .= renderImageCell($filePath, $width, $height);
  } else {
      // Para renderTableCell, aseguramos que los valores sean cadenas válidas y que no sean vacíos
      $displayValor = isset($elemento['displayValor']) && is_string($elemento['displayValor']) ? $elemento['displayValor'] : '';
      $colSpanValor = isset($elemento['colSpanValor']) && is_string($elemento['colSpanValor']) ? $elemento['colSpanValor'] : '';

      $contenido .= renderTableCell(
          $valor, // $valor ya es una cadena válida
          $displayValor,
          $colSpanValor,
          $bold,
          $paddingLeft
      );
  }
          // Manejo de "img"
          $fileName = null;
          preg_match('/fileName: \[([^\]]+)\]/', is_string($elemento['image']) ? $elemento['image'] : '', $matches);

          if (isset($matches[1])) {
              $fileNameArray = array_map('trim', explode(',', $matches[1]));
          }
          /** @var string $baseImagenes */
          $baseImagenes = BASE_IMAGENES;
          if ($valor === 'img' && !empty($fileNameArray)) {
              $imagenes = '';
              foreach ($fileNameArray as $fileName) {
                  $filePath = $baseImagenes . $plant . '/' . trim($fileName, ' "[]');
                  $imagenes .= sprintf('<img src="%s" alt="img" width="50px" height="50px"> ', $filePath);
              }
              $contenido .= renderTableCell($imagenes, '', '3', $bold, $paddingLeft);
          }

          // Columnas "detalle" y "observacion"
          foreach (['detalle', 'observacion'] as $campo) {
              $display = isset($elemento["display" . ucfirst($campo)]) && is_string($elemento["display" . ucfirst($campo)]) 
                  ? $elemento["display" . ucfirst($campo)] 
                  : ''; // Verificar que sea cadena
              $colSpan = isset($elemento["colSpan" . ucfirst($campo)]) && is_string($elemento["colSpan" . ucfirst($campo)]) 
                  ? $elemento["colSpan" . ucfirst($campo)] 
                  : ''; // Verificar que sea cadena
              
              $contenido .= renderTableCell(
                  isset($elemento[$campo]) && is_string($elemento[$campo]) ? $elemento[$campo] : '', // Verificar que sea cadena
                  $display,
                  $colSpan,
                  $bold,
                  $paddingLeft,
                  "10px"
              );
          }
          $contenido .= '</tr>';
      }
      return $contenido;
}
?>