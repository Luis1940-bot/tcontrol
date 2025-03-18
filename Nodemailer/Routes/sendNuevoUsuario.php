<?php
  ob_start();
  header("Content-Type: text/html;charset=utf-8");
  header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
  header("Expires: Sat, 1 Jul 2000 05:00:00 GMT"); // Fecha en el pasado
  // header ("MIME-Version: 1.0\r\n");
  require_once dirname(dirname(__DIR__)) . '/config.php';

  define('EMAIL', BASE_URL .'/Nodemailer/nuevoUsuario');

  ini_set('display_errors', 1);
  ini_set('display_startup_errors', 1);
  error_reporting(E_ALL);


use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

// include('datos.php');


require __DIR__ . '/../PHPMailer-6.8.0/PHPMailer-6.8.0/src/Exception.php';
require __DIR__ . '/../PHPMailer-6.8.0/PHPMailer-6.8.0/src/PHPMailer.php';
require __DIR__ . '/../PHPMailer-6.8.0/PHPMailer-6.8.0/src/SMTP.php';

try {
  $datos = json_decode(file_get_contents('php://input'), true);
  // $datos = '{"ruta":"/sendNuevoUsuario","rax":"&new=Fri Sep 06 2024 20:35:22 GMT-0300 (hora estándar de Argentina)","objeto":{"cliente":"Alpek-PTAC Cosoleacaque","usuario":"grgrg","idusuario":15,"email":"luisglogista@gmail.com","v":"1a1fa5b9eb168096de1ed13e169b7792","subject":"Nuevo usuario","mensaje":"Se dio de alta un nuevo usuario:"}}';
  // $datos = json_decode($datos, true);

    if (empty($datos)) {
        $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
        echo json_encode($response);
        exit;
    }

    if ($datos === null) {
        $response = array('success' => false, 'message' => 'Error al decodificar la cadena JSON principal');
        echo json_encode($response);
        exit;
    }


    $objeto = $datos['objeto'];

    $cliente = $objeto['cliente'];
    $usuario = $objeto['usuario'];
    $idusuario = $objeto['idusuario'];
    $address = $objeto['email'];
    $subject = $objeto['subject'];
    $cod_verificador = $objeto['v'];
    $mensaje = $objeto['mensaje'];

    ob_start();
    include(BASE_DIR . '/Nodemailer/nuevoUsuario/nuevoUsuario.html');
    $html = ob_get_clean();

  
   $html  = str_replace('{cliente}', $cliente, $html);
   $html  = str_replace('{usuario}', $usuario, $html);
   $html  = str_replace('{email}', $address, $html);
   $html  = str_replace('{cod_verificador}', $cod_verificador, $html);
   $html  = str_replace('{idusuario}', $idusuario, $html);
   $html  = str_replace('{mensaje}', $mensaje, $html);
  // $html  = str_replace('{verificador}', BASE_DIR . '/404.php' , $html);

    $mail = new PHPMailer(true);
  // Configura el servidor SMTP
    $mail->isSMTP();
    $mail->CharSet = 'UTF-8';
    $mail->Encoding = "quoted-printable";
    $mail->SMTPAuth = true;
    $mail->Host ="mail.tenkiweb.com";
    $mail->Username = "alerta.tenki@tenkiweb.com";
    $mail->Password = "]SDGGL}#p.Ba";
    $mail->Port = 587;
    $mail->SMTPOptions = array(
    'ssl' => array(
        'verify_peer' => false,
        'verify_peer_name' => false,
        'allow_self_signed' => true
            )
    );
    $mail->Timeout = 60; // Tiempo de espera de conexión en segundos
    $mail->SMTPKeepAlive = true; // Mantiene la conexión SMTP activa
    
    $mail->isHTML(true);
    // Configura los destinatarios
    $mail->SetFrom("alerta.tenki@tenkiweb.com");
    // $mail->addAddress('destinatario@example.com', 'Destinatario');
    $mail->addBCC('luisglogista@gmail.com');
    // Configura el asunto y el cuerpo del correo electrÃ³nico
    $mail->Subject = $subject; 
    $mail->Body    = $html;
    

    if (strlen($address) > 0) {
        $dirs = explode(",", $address);
        foreach ($dirs as $dir) {
            $mail->addAddress($dir);
        }
    } else {
        $mail->addAddress($address);
    }
    
    $mail->send();
    ob_end_clean();
    $response = array('success' => true, 'message' => 'El email se envio con exito!');
    echo json_encode($response);
} catch (Exception $e) {
  $response = array('success' => false, 'message' => 'Error en el envío del correo: ' . $e->getMessage());
    echo json_encode($response);
}
?>