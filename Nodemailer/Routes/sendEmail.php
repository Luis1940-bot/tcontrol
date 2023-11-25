<?php
  header("Content-Type: text/html;charset=utf-8");
  header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
  header("Expires: Sat, 1 Jul 2000 05:00:00 GMT"); // Fecha en el pasado
  header ("MIME-Version: 1.0\r\n");
  define('ROOT_PATHP', $_SERVER['DOCUMENT_ROOT']);
  define('EMAIL', ROOT_PATHP.'/Nodemailer/emailFactum');


use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

$basePath =  realpath(__DIR__ . '/../../Nodemailer');

require $basePath   .  '/PHPMailer-6.8.0/PHPMailer-6.8.0/src/Exception.php' ;
require $basePath   .  '/PHPMailer-6.8.0/PHPMailer-6.8.0/src/PHPMailer.php';
require $basePath   .  '/PHPMailer-6.8.0/PHPMailer-6.8.0/src/SMTP.php';

include('datos.php');

try {
   $datos =json_decode($_POST['datos'], true);
   $encabezados =json_decode($_POST['encabezados'], true);
  // echo $datox;
  // $datos =json_decode($datox, true);
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

   $html  = file_get_contents(EMAIL . '/email.html');
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
   $html  = str_replace('{contenido_dinamico}', generarContenidoDinamico($datos), $html);

    $mail = new PHPMailer(true);
  // Configura el servidor SMTP
    $mail->isSMTP();
    $mail->CharSet = 'UTF-8';
    $mail->Encoding = "quoted-printable";
    $mail->SMTPAuth = true;
    $mail->Host ="smtp.factumconsultora.com"; 
    $mail->Username = "alerta.factum@factumconsultora.com"; ;
    $mail->Password = "Factum2017admin";
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
    $mail->SetFrom("alerta.factum@factumconsultora.com");
    // $mail->addAddress('destinatario@example.com', 'Destinatario');
    $mail->addBCC('alerta.factum@factumconsultora.com');
    // Configura el asunto y el cuerpo del correo electrónico
    $mail->Subject = "Sistema de Alertas"; 
    $mail->Body    = $html;
    

    // if (strlen($mails_destino)>0) {
    //   $dirs = explode("/", $mails_destino);
    //   $cantidad_emails=count($dirs);
    //   for ($i=0; $i < $cantidad_emails; $i++) { 
    //     $mail->AddAddress($dirs[$i]);
    //   };
    //     $email_supervisor!=''?$mail->AddAddress($email_supervisor):null;
    // }else{
    //   $mail->addAddress($email_usuario, $name_usuario);
    // }
    
    $mail->addAddress('luisglogista@gmail.com', 'Luis');

    // Envía el correo electrónico
    $mail->send();
} catch (Exception $e) {
  echo "Error en el envío del correo: " . $e->errorMessage();
}



?>

<?php
function generarContenidoDinamico($datos) {
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
        if ($display === 'none') {
          $contenido .= '<td style="border: 1px solid #cecece; padding-left: '.$paddingLeft.'; font-style:normal; font-size:12px; display:none;">' . $elemento['name'] . '</td>';
        } else {
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
        $imagenBase64 = $elemento['src'];
        if ($valor === 'img' && $imagenBase64) {
          $imagenBinaria = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $imagenBase64));
          $identificador = time();
          $nombreImagen = 'imagen_generada_' . $identificador . '.png';
          file_put_contents($nombreImagen, $imagenBinaria);
          // $valor = '<img id="imagenGenerada" src=' . $nombreImagen . '" alt="Imagen Generada">';
          $valor = '<canvas id="miCanvas" width="400" height="300"></canvas>';
        }
        if ($display === 'none') {
          $contenido .= '<td style="border: 1px solid #cecece; padding-left: '.$paddingLeft.'; font-style:normal; font-size:12px; display:none;">' . $valor . '</td>';
        } else {
          $contenido .= '<td style="border: 1px solid #cecece; padding-left: '.$paddingLeft.'; font-style:normal; font-size:12px; '.$bold.'" '.$colSpan.'>' . $valor . '</td>';
        }
        
        $display = $elemento['displayDetalle'];
        $colSpan = 'colspan="'.$elemento['colSpanDetalle'].'"';
        if ($elemento['colSpanName'] !== '1') {
          $bold = 'font-weight:bold';
          $paddingLeft = '50px';
        } else {
          $bold = '';
          $paddingLeft = '10px';
        }
        if ($display === 'none') {
          $contenido .= '<td style="border: 1px solid #cecece; padding-left: '.$paddingLeft.'; font-style:normal; font-size:10px; display:none;">' . $elemento['detalle'] . '</td>';
        } else {
          $contenido .= '<td style="border: 1px solid #cecece; padding-left: '.$paddingLeft.'; font-style:normal; font-size:10px; '.$bold.'" '.$colSpan.'>' . $elemento['detalle'] . '</td>';
        }

        $display = $elemento['displayObservacion'];
        $colSpan = 'colspan="'.$elemento['colSpanObservacion'].'"';
        if ($elemento['colSpanName'] !== '1') {
          $bold = 'font-weight:bold';
          $paddingLeft = '50px';
        } else {
          $bold = '';
          $paddingLeft = '10px';
        }
        if ($display === 'none') {
          $contenido .= '<td style="border: 1px solid #cecece; padding-left: '.$paddingLeft.'; font-style:normal; font-size:12px; display:none;">' . $elemento['observacion'] . '</td>';
        } else {
          $contenido .= '<td style="border: 1px solid #cecece; padding-left: '.$paddingLeft.'; font-style:normal; font-size:12px; '.$bold.'" '.$colSpan.'>' . $elemento['observacion'] . '</td>';
        }


        $contenido .= '</tr>';
  
    }

    return $contenido;
}
?>


