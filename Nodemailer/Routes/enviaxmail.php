<?php
  header("Content-Type: text/html;charset=utf-8");
  header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
  header("Expires: Sat, 1 Jul 2000 05:00:00 GMT"); // Fecha en el pasado
  header ("MIME-Version: 1.0\r\n");



use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

$basePath =  realpath(__DIR__ . '/../..');
require $basePath   .  '/PHPMailer-6.8.0/PHPMailer-6.8.0/src/Exception.php' ;
require $basePath   .  '/PHPMailer-6.8.0/PHPMailer-6.8.0/src/PHPMailer.php';
require $basePath   .  '/PHPMailer-6.8.0/PHPMailer-6.8.0/src/SMTP.php';

// echo 'realpath' . realpath(__DIR__ . '/../..');
try {
$cabeceras =json_decode($_POST['objeto1']);
$datos =json_decode($_POST['objeto2']);


$notificacion='NOTIFICACIÓN SISTEMA DE ALERTAS';
$numero='Ingrese al sistema y localice el control por el número';
$carpeta_principal = $cabeceras->carpeta_principal;
$date=$cabeceras->fecha;
$hora=$cabeceras->hora;
$controlweb=$cabeceras->nombre_control;
$nuxpedido=$cabeceras->nuxpedido;
$empresa=$cabeceras->enterprise;
$notificador=$cabeceras->name_usuario;
$mails_destino =$cabeceras->mails;
$email_usuario= $cabeceras->email_usuario;
$email_supervisor= $cabeceras->email_supervisor;
$name_usuario= $cabeceras->name_usuario;

 $rutaImagen = dirname(dirname(dirname($_SERVER['DOCUMENT_ROOT'] . $_SERVER['SCRIPT_NAME'])))."/imagenes/";
  $folder = explode("/",$_SERVER['SCRIPT_NAME'])[1];
  $http_host = $_SERVER['HTTP_HOST'];
  // echo 'host>>>>>>>>>>>> '.$http_host.'<br>';
  if($http_host == 'localhost' || $http_host == '127.0.0.1') {
      echo "Estás trabajando en localhost."."<br>";
     $carpeta_imagenes="https://factumconsultora.com/bcl20210108/imagenes/";
     $url = 'https://factumconsultora.com/'.$carpeta_principal;
   }
   else {
      $carpeta_imagenes='https://'.$_SERVER['HTTP_HOST'].'/'.$folder.'/imagenes/';
      $url = 'https://'.$_SERVER['HTTP_HOST'].'/'.$carpeta_principal;
      // echo '<>>>>>>>>>>>>>>>>>https://'.$_SERVER['HTTP_HOST'].'/';
   }



//*  armado del cuerpo del email

$message = '<html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta name="description" content="">
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous">
            </head>
            <body style="background-color:#e3f2fd;margin-left:20px;margin-right:20px;">
            <main class="main" style="background-color:#e3f2fd">
            <div>
            ';


$message .='
    <div style="margin-left:20px;margin-rigth:20px;">
    <p style="font-size:20px;color:gray"><b>Factum Consultora</b></p>
    <p style="font-size:20px;color:gray"><b>'.$empresa.'</b></p>
    <p style="font-size:20px;color:blue"><b>'.$notificacion.'</b></p>
    <p style="font-size:16px;color:blue"><b>Control '.$controlweb.'</p>
    <p style="font-size:16px;color:blue"><b>Fecha de alerta '.$date.'</b></p>
    <p style="font-size:16px;color:blue"><b>Hora de alerta '.$hora.'</b></p>
    <p style="font-size:16px;color:blue"><b>Notifica: '.$notificador.'</p>
    <p style="font-size:14px;color:blue"><b><a href="'.$url.'">Ir a '.$url.'</a></b></p>
    <p style="font-size:20px;color:red"><b>'.$numero.' '.$nuxpedido.'</p>
    </div>
    <hr>
    <hr>
';

//*--------------------------------
//* armado de la tabla
$message .='<div style="margin-left:20px;margin-rigth:20px;overflow-x: scroll;" class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <table border=3 cellpadding=3 cellspacing=3 style="width: 100%;margin-rigth:20px">
            <thead class="card-head shadow" style="background-color:#e3f2fd;">
            <tr style="height:20px;">
            <th>ID</th>
            <th>CONCEPTO</th>
            <th>RELEVAMIENTO</th>
            <th>DETALLE</th>
            <th>OBSERVACIONES</th>
            </thead><tbody class="bg-info">';


$cantidad_registros=count($datos->concepto);
for ($i = 0; $i < $cantidad_registros; $i++) {
    $posision = $i + 1;
    $concepto = $datos->concepto[$i];
    $valor = $datos->valor_2[$i];
    $i===$cantidad_registros-1?$valor=$datos->valor[$i]:null;
    // echo $i.' - '.$valor.' - '.$cantidad_registros.' - '.$concepto.'<br>';
    $tipodedato_2= $datos->tipodedato_2[$i];
    $valor_3 = $datos->valor_3[$i];

    if ($tipodedato_2=='b' || $tipodedato_2=='c' || $tipodedato_2=='r') {
      $valor===1?$valor='ok':$valor='-';
    }
    if ($tipodedato_2=='l' || $tipodedato_2=='title' || $tipodedato_2=='subt') {
      $colspan=4;
      $display='display:none';
      $style='font-weight: bold;margin-left:2rem;';
    }else{
      $colspan=0;
      $display='';
      $style='';
    }
    $cantidad_img='';
    $img_0=$datos->img[$i];
    $img_render='';
    if ($img_0!='' ) {
      $separador='#@#';
      $cantidad_img=substr_count($img_0,$separador);
      $img_1=substr($img_0,0,-3);
      $img_array=explode($separador,$img_1);
      for ($p=0; $p < $cantidad_img; $p++) { 
        $img_render.='<img src="'.$carpeta_imagenes.$img_array[$p].'" alt="'.$img_array[$p].'" width=45 height=45 style="margin-left:.2rem">'; 
      }
      $valor=$img_render;
      

    }
    
    
    $detalle = $datos->detalle[$i];
    $message .= '<tr class="bg-light">
                    <td style="width: 5%">' . $posision . '</td>
                    <td style="width: 15%;" colspan="'.$colspan.'"><span style="'.$style.'">' . $concepto . '</span></td>
                    <td style="width: 30%;'.$display.'" >' . $valor . '</td>
                    <td style="width: 30%;'.$display.'" >' . $detalle . '</td>
                    <td style="width: 30%;'.$display.'" >'.$valor_3.'</td>
                </tr>';
}

//*--------------------------------



// echo $message;

// try {
  // Crea una instancia de PHPMailer
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
    $mail->Body    = $message;
    

    if (strlen($mails_destino)>0) {
      $dirs = explode("/", $mails_destino);
      $cantidad_emails=count($dirs);
      for ($i=0; $i < $cantidad_emails; $i++) { 
        $mail->AddAddress($dirs[$i]);
      };
        $email_supervisor!=''?$mail->AddAddress($email_supervisor):null;
    }else{
      $mail->addAddress($email_usuario, $name_usuario);
    }
    
    

    // Envía el correo electrónico
    $mail->send();

    echo 'El correo electrónico se ha enviado correctamente.';
} catch (Exception $e) {
    echo "Error en el envío del correo: " . $e->errorMessage();
}

?>