<?php
  header("Content-Type: text/html;charset=utf-8");
  header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
  header("Expires: Sat, 1 Jul 2000 05:00:00 GMT"); // Fecha en el pasado
  header ("MIME-Version: 1.0\r\n");
  date_default_timezone_set('America/Argentina/Buenos_Aires');

  require_once dirname(dirname(__DIR__)) . '/config.php';

  define('EMAIL', BASE_URL .'/Nodemailer/emailTenki');

  ini_set('display_errors', 1);
  ini_set('display_startup_errors', 1);
  error_reporting(E_ALL);
  set_time_limit(0);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

// include('datos.php');


require __DIR__ . '/../PHPMailer-6.8.0/PHPMailer-6.8.0/src/Exception.php';
require __DIR__ . '/../PHPMailer-6.8.0/PHPMailer-6.8.0/src/PHPMailer.php';
require __DIR__ . '/../PHPMailer-6.8.0/PHPMailer-6.8.0/src/SMTP.php';


  // $datos =json_decode($datox, true);
  // $encabezados =json_decode($encabezadox, true);



try {
   $datos = json_decode($_POST['datos'], true);
   $encabezados = json_decode($_POST['encabezados'], true);
 


   if ($datos === null && json_last_error() !== JSON_ERROR_NONE) {
    die('Error al decodificar JSON');
  }
    $documento = $encabezados['documento'];
    $address = $encabezados['address'];
    $fecha = $encabezados['fecha'];
    $hora = $encabezados['hora'];
    $notificador = $encabezados['notificador'];
    $planta = $encabezados['planta'];
    $plant = $encabezados['idPlanta'];
    $titulo = $encabezados['titulo'];
    $url = $encabezados['url'];
    $fechaDeAlerta = $encabezados['fechaDeAlerta'];
    $horaDeAlerta = $encabezados['horaDeAlerta'];
    $notifica = $encabezados['notifica'];
    $sistema = $encabezados['sistema'];
    $irA = $encabezados['irA'];
    $concepto = $encabezados['concepto'];
    $relevamiento = $encabezados['relevamiento'];
    $detalle = $encabezados['detalle'];
    $observacion = $encabezados['observacion'];
    $subject = $encabezados['subject'];
    $idLTYreporte = $encabezados['idLTYreporte'];
    $reporte = $encabezados['reporte'];
    $cliente = $plant . '-' . $planta;
    $idPlanta = $plant;

ob_start();
include(BASE_DIR . '/Nodemailer/emailTenki/email.html');
$html = ob_get_clean();

   
   $html  = str_replace('{planta}', $cliente, $html);
   $html  = str_replace('{notificacion}', $titulo, $html);
   $html  = str_replace('{nombreDeControl}', $reporte, $html);
   $html  = str_replace('{fechaDeAlerta}', $fechaDeAlerta, $html);
   $html  = str_replace('{fecha}', $fecha, $html);
   $html  = str_replace('{horaDeAlerta}', $horaDeAlerta, $html);
   $html  = str_replace('{hora}', $hora, $html);
   $html  = str_replace('{notifica}', $notifica, $html);
   $html  = str_replace('{notificador}', $notificador, $html);
   $html  = str_replace('{entreEnElSistema}', $sistema, $html);
   $html  = str_replace('{nuxPedido}', $documento, $html);
   $html  = str_replace('{irA}', $irA, $html);
   $html  = str_replace('{href}', $url, $html);
   $html  = str_replace('{concepto}', $concepto, $html);
   $html  = str_replace('{relevamiento}', $relevamiento, $html);
   $html  = str_replace('{detalle}', $detalle, $html);
   $html  = str_replace('{observacion}', $observacion , $html);
   $html  = str_replace('{contenido_dinamico}', generarContenidoDinamico($datos, $plant), $html);
   
  //  echo 'html>>>> '.$html;
    include_once BASE_DIR . "/Routes/datos_base.php";
    $pdo = new PDO("mysql:host={$host};dbname={$dbname};port={$port};chartset=utf8",$user,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $stmt = $pdo->prepare("INSERT INTO email_queue (email_address, subject, body, nx, idLTYreporte, idPlant) VALUES (:email_address, :subject, :body, :nx, :idLTYreporte, :idPlant)");
    $stmt->execute([
        ':email_address' => $address,
        ':subject' => $subject,
        ':body' => $html,
        ':nx' => $documento,
        'idLTYreporte' => $idLTYreporte,
        'idPlant' => $idPlanta,
    ]);
    if (ob_get_length()) {
        ob_end_clean(); // Solo limpiar si hay un buffer activo
    }
    // ob_clean();
    // $response = array('success' => true, 'message' => 'El email se envio con exito!', 'reporte' => $reporte, 'documento' => $documento);
    // echo json_encode($response);

    // Detectar el sistema operativo
    $os = strtoupper(substr(PHP_OS, 0, 3));
    $script_path = BASE_DIR . '/Nodemailer/Routes/queue_processor.php';
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
    exec($command, $output, $return_var);

    if ($return_var === 0) {
        logMessage("Script de cola lanzado con PID: " . implode(", ", $output));
        $response = array('success' => true, 'message' => 'Correo encolado para envío', 'reporte' => $reporte, 'documento' => $documento);
    } else {
        logMessage("Error al lanzar el script de cola: " . implode(", ", $output));
        $response = array('success' => false, 'message' => 'Error al lanzar el script de cola.');
    }
    echo json_encode($response);
    // return;
    exit;
} catch (Exception $e) {
  echo json_encode(['success' => false, 'message' => 'Error en el envío del correo: ' . $e->getMessage()]);
  // echo "Error en el envío del correo: " . $e->getMessage();
}



function logMessage($message) {

    $logFile = BASE_DIR . '/logs/sendEmail.log';
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

function generarContenidoDinamico($datos, $plant) {
    $contenido = ''; 
    foreach ($datos as $elemento) {
        $contenido .= '<tr style="background:#fff; width:100%; height:20px;">';
        $display = $elemento['displayName'];
        $colSpan = 'colspan="'.$elemento['colSpanName'].'"';
        if ($elemento['colSpanName'] !== '1') {
          $bold = 'font-weight:bold';
          $paddingLeft = '50px';
        } else {
          $bold = '';
          $paddingLeft = '10px';
        }
        $valor = $elemento['valor'];
        $valor = trim($valor);
        if ($display === 'none') {
          $contenido .= '<td style="border: 1px solid #cecece; padding-left: '.$paddingLeft.'; font-style:normal; font-size:12px; display:none;">' . $elemento['name'] . '</td>';
        } else if ($display !== 'none' ) {
          $contenido .= '<td style="border: 1px solid #cecece; padding-left: '.$paddingLeft.'; font-style:normal; font-size:12px; '.$bold.'" '.$colSpan.'>' . $elemento['name'] . '</td>';
        }
        
        $display = $elemento['displayValor'];
        $colSpan = 'colspan="'.$elemento['colSpanValor'].'"';
        if ($elemento['colSpanName'] !== '1') {
          $bold = 'font-weight:bold';
          $paddingLeft = '50px';
        } else {
          $bold = '';
          $paddingLeft = '10px';
        }

        $valor = $elemento['valor'];
        $valor = trim($valor);
        if ($valor === 'photo' ) {
          $display = 'none';
          $colSpan = 'colspan="3"';
          $directorioImagenes = BASE_PLANOS . $plant . '/';
          $array = json_decode($elemento['displayDetalle'], true);
          $img = $array['img'];
          $width = $array['width'];
          $height = $array['height'];
          $filePath = $directorioImagenes . $img;
          $imagenes = '<img src="' . $filePath . '" alt="img" width="'.$width.'" height="'.$height.'">';
          $contenido .= '<td style="border: 1px solid #cecece; padding-left: '.$paddingLeft.';" '.$colSpan.'>' . $imagenes . '</td>';
        }

        $valor = $elemento['valor'];
        $valor = utf8_to_iso8859_1($valor);
        $fileName = null;
        $string = $elemento['image'];
        $pattern = '/fileName: \[([^\]]+)\]/';
        preg_match($pattern, $string, $matches);
        // echo 'matches>'.$matches.'<br>';
        if (isset($matches[1])) {
            // Obtener los elementos de fileName como un array
            $fileNameArray = explode(',', $matches[1]);
            // Limpiar y formatear cada elemento
            foreach ($fileNameArray as &$fileName) {
                $fileName = trim($fileName, ' "[]');
            }
        } 
       
        $valor = trim($valor);
        $valor = strtolower(trim($valor));
        $valor = utf8_to_iso8859_1($valor);
        $imagenes = '';
        if ($valor === 'img' && $fileName) {
            foreach ($fileNameArray as &$fileName) {
                $fileName = trim($fileName, ' "[]');
                $directorioImagenes = BASE_IMAGENES . $plant . '/';
                $filePath = $directorioImagenes . $fileName;
                $valor = '<img src="' . $filePath . '" alt="img" width="50px" height="50px">';
               $imagenes = $imagenes .' '. $valor;
            }
            // $colSpan = 'colspan="3"';
            $contenido .= '<td style="border: 1px solid #cecece; padding-left: '.$paddingLeft.'; font-style:normal; font-size:12px; '.$bold.'" colspan="3">' . $imagenes . '</td>';
            $valor = 'img';
            
        }
        if ($valor !== 'img' ) {
                if ($display === 'none' ) {
                  $contenido .= '<td style="border: 1px solid #cecece; padding-left: '.$paddingLeft.'; font-style:normal; font-size:12px; display:none;">' . $valor . '</td>';
                } else if ($display !== 'none' && $valor !== 'photo'){
                  $contenido .= '<td style="border: 1px solid #cecece; padding-left: '.$paddingLeft.'; font-style:normal; font-size:12px; '.$bold.'" '.$colSpan.'>' . $valor . '</td>';
                }
        }
        
        $display = $elemento['displayDetalle'];
        $colSpan = 'colspan="'.$elemento['colSpanDetalle'].'"';
        if ($valor === 'img') {
          $display = 'none';
          $colSpan = 'colspan="1"';
        }
        if ($elemento['colSpanName'] !== '1') {
          $bold = 'font-weight:bold';
          $paddingLeft = '50px';
        } else {
          $bold = '';
          $paddingLeft = '10px';
        }
        if ($display === 'none') {
          $contenido .= '<td style="border: 1px solid #cecece; padding-left: '.$paddingLeft.'; font-style:normal; font-size:10px; display:none;">' . $elemento['detalle'] . '</td>';
        } else if ($display !== 'none' && $valor !== 'photo'){
          $contenido .= '<td style="border: 1px solid #cecece; padding-left: '.$paddingLeft.'; font-style:normal; font-size:10px; '.$bold.'" '.$colSpan.'>' . $elemento['detalle'] . '</td>';
        }

        $display = $elemento['displayObservacion'];
        $colSpan = 'colspan="'.$elemento['colSpanObservacion'].'"';
        if ($valor === 'img') {
          $display = 'none';
          $colSpan = 'colspan="1"';
        }
  
        if ($elemento['colSpanName'] !== '1') {
          $bold = 'font-weight:bold';
          $paddingLeft = '50px';
        } else {
          $bold = '';
          $paddingLeft = '10px';
        }
        if ($display === 'none') {
          $contenido .= '<td style="border: 1px solid #cecece; padding-left: '.$paddingLeft.'; font-style:normal; font-size:12px; display:none;">' . $elemento['observacion'] . '</td>';
        } else if ($display !== 'none' && $valor !== 'photo'){
          $contenido .= '<td style="border: 1px solid #cecece; padding-left: '.$paddingLeft.'; font-style:normal; font-size:12px; '.$bold.'" '.$colSpan.'>' . $elemento['observacion'] . '</td>';
        }
        $contenido .= '</tr>';
  
    }

    return $contenido;
}
?>


