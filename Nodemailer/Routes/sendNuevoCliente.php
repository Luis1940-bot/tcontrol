<?php
  header("Content-Type: text/html;charset=utf-8");
  header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
  header("Expires: Sat, 1 Jul 2000 05:00:00 GMT"); // Fecha en el pasado
  // header ("MIME-Version: 1.0\r\n");
  require_once dirname(dirname(__DIR__)) . '/config.php';
  /** @var string $baseDir */
  $baseDir = BASE_DIR;

  define('EMAIL', $baseDir .'/Nodemailer/nuevoCliente');

  ini_set('display_errors', '1');
  ini_set('display_startup_errors', '1');
  error_reporting(E_ALL);
require $baseDir . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

// include('datos.php');


// require __DIR__ . '/../PHPMailer-6.8.0/PHPMailer-6.8.0/src/Exception.php';
// require __DIR__ . '/../PHPMailer-6.8.0/PHPMailer-6.8.0/src/PHPMailer.php';
// require __DIR__ . '/../PHPMailer-6.8.0/PHPMailer-6.8.0/src/SMTP.php';

try {
  /** @var array{objeto: array{cliente: string, contacto: string, address: string}} $datos */


  $input = file_get_contents('php://input');

  if ($input === false || $input === '') {
      die('Error: No se pudo leer php://input o está vacío.');
  }

  $datos = json_decode($input, true);
  // $datos = '{"ruta":"/sendNuevoCliente","rax":"&new=Fri Jun 21 2024 11:10:25 GMT-0300 (hora estándar de Argentina)","objeto":{"cliente":"Alpek-Coatzacoalcos","contacto":"vvvvvvvv","address":"luisglogista@gmail.com"}}';
  // $datos = json_decode($datos, true);
  if ($datos === null || json_last_error() !== JSON_ERROR_NONE) {
      $response = array('success' => false, 'message' => 'Error al decodificar la cadena JSON principal');
      echo json_encode($response);
      exit;
  }

  /** @var array{objeto: array{cliente: string, contacto: string, address: string}} $datos */
  $objeto = $datos['objeto'];
  $cliente = $objeto['cliente'];
  $contacto = $objeto['contacto'];
  $address = $objeto['address'];
  $subject = 'Nuevo cliente';

  // Aquí puedes continuar con el procesamiento de los datos.
  $response = array(
      'success' => true,
      'message' => 'Datos procesados correctamente.',
      'data' => array(
          'cliente' => $cliente,
          'contacto' => $contacto,
          'address' => $address
      )
  );
  // echo json_encode($response);



    ob_start();
    include(BASE_DIR . '/Nodemailer/nuevoCliente/nuevoCliente.html');
    $html = ob_get_clean();
    if ($html === false || $html === '') {
        die('Error: No se pudo cargar la plantilla HTML.');
    }
      
   $html  = str_replace('{cliente}', $cliente, $html);
   $html  = str_replace('{contacto}', $contacto, $html);
   $html  = str_replace('{email}', $address, $html);

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
    $response = array('success' => true, 'message' => 'El email se envio con exito!');
    echo json_encode($response);
} catch (Exception $e) {
  echo "Error en el envÃ­o del correo: " . $e->getMessage();
}
?>