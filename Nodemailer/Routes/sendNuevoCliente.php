<?php
header("Content-Type: text/html;charset=utf-8");
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Expires: Sat, 1 Jul 2000 05:00:00 GMT"); // Fecha en el pasado
// header ("MIME-Version: 1.0\r\n");
require_once dirname(dirname(__DIR__)) . '/config.php';

define('EMAIL', BASE_URL . '/Nodemailer/nuevoCliente');

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
  //  $datos = '{"ruta":"/sendNuevoCliente","rax":"&new=Fri Jun 21 2024 11:10:25 GMT-0300 (hora estándar de Argentina)","objeto":{"cliente":"Alpek-Coatzacoalcos","contacto":"Miguel Gonzalez","address":"luisfactum@gmail.com"}}';

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
  $contacto = $objeto['contacto'];
  $address = $objeto['address'];
  $subject = 'Nuevo cliente';

  ob_start();
  include(BASE_DIR . '/Nodemailer/nuevoCliente/nuevoCliente.html');
  $html = ob_get_clean();


  $html  = str_replace('{cliente}', $cliente, $html);
  $html  = str_replace('{contacto}', $contacto, $html);
  $html  = str_replace('{email}', $address, $html);

  $mail = new PHPMailer(true);
  // Configura el servidor SMTP
  $mail->isSMTP();
  $mail->CharSet = 'UTF-8';
  $mail->Encoding = "quoted-printable";
  $mail->SMTPAuth = true;
  $mail->Host = "mail.tenkiweb.com";
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
  $mail->isHTML(true);
  // Configura los destinatarios
  $mail->SetFrom("alerta.tenki@tenkiweb.com");
  // $mail->addAddress('destinatario@tenkiweb.com', 'Destinatario');
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
  $response = array('success' => true, 'message' => 'El email se envio con exito!');
  echo json_encode($response);
} catch (Exception $e) {
  echo "Error en el envÃ­o del correo: " . $e->getMessage();
}
