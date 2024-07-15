<?php
  header("Content-Type: text/html;charset=utf-8");
  header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
  header("Expires: Sat, 1 Jul 2000 05:00:00 GMT"); // Fecha en el pasado
  header ("MIME-Version: 1.0\r\n");
  require_once dirname(dirname(__DIR__)) . '/config.php';

  define('EMAIL', BASE_URL .'/Nodemailer/emailTenki');

  ini_set('display_errors', 1);
  ini_set('display_startup_errors', 1);
  error_reporting(E_ALL);


use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

include('datos.php');


require __DIR__ . '/../PHPMailer-6.8.0/PHPMailer-6.8.0/src/Exception.php';
require __DIR__ . '/../PHPMailer-6.8.0/PHPMailer-6.8.0/src/PHPMailer.php';
require __DIR__ . '/../PHPMailer-6.8.0/PHPMailer-6.8.0/src/SMTP.php';


  $datos =json_decode($datox, true);
  $encabezados =json_decode($encabezadox, true);
  $plant = json_decode($plantx, true);


try {
  //  $datos =json_decode($_POST['datos'], true);
  //  $encabezados =json_decode($_POST['encabezados'], true);
  //  $plant =$_POST['plant'];
  

   if ($datos === null && json_last_error() !== JSON_ERROR_NONE) {
    die('Error al decodificar JSON');
  }
    $documento = $encabezados['documento'];
    $address = $encabezados['address'];
    $fecha = $encabezados['fecha'];
    $hora = $encabezados['hora'];
    $notificador = $encabezados['notificador'];
    $planta = $encabezados['planta'];
    $reporte = $encabezados['reporte'];
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
    
ob_start();

include(BASE_DIR . '/Nodemailer/emailTenki/email.html');


$html = ob_get_clean();

   
   $html  = str_replace('{planta}', $planta, $html);
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
    $mail = new PHPMailer(true);
  // Configura el servidor SMTP
    $mail->isSMTP();
    $mail->CharSet = 'UTF-8';
    $mail->Encoding = "quoted-printable";
    $mail->SMTPAuth = true;
    $mail->Host = HOST;
    $mail->Username = USERNAME;
    $mail->Password = PASS;
    // $mail->SMTPSecure = 'tls';
    $mail->Port = 25;
    $mail->SMTPOptions = array(
    'ssl' => array(
        'verify_peer' => false,
        'verify_peer_name' => false,
        'allow_self_signed' => true
            )
    );
    $mail->isHTML(true);
    // Configura los destinatarios
    $mail->SetFrom(SET_FROM);
    // $mail->addAddress('destinatario@example.com', 'Destinatario');
    $mail->addBCC(ADD_BCC);
    // Configura el asunto y el cuerpo del correo electrónico
    $mail->Subject = $subject; 
    $mail->Body    = $html;
 

    if (strlen($address)>0) {
      $dirs = explode("/", $address);
    
      $cantidad_emails=count($dirs);
      for ($i=0; $i < $cantidad_emails; $i++) { 
        $mail->AddAddress($dirs[$i]);
      };
    }else{
      $mail->addAddress($address, $notificador);
    }
    
    // $mail->addAddress('luisglogista@gmail.com', 'Luis');

    // Envía el correo electrónico
    $mail->send();
    ob_clean();
    $response = array('success' => true, 'message' => 'El email se envió con éxito!', 'reporte' => $reporte, 'documento' => $documento);
    echo json_encode($response);
} catch (Exception $e) {
  echo "Error en el envío del correo: " . $e->getMessage();
}



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


