<?php
header('Content-Type: text/html;charset=utf-8');
require_once dirname(dirname(__DIR__)) . '/config.php';
?>
<!DOCTYPE html>
<!-- <html lang='en'> -->
<head>
  <meta charset='UTF-8'>
  <meta name='description' content='Factum Consultora'>
  <meta name='author' content='Luis1940-bot'>
  <meta http-equiv='X-UA-Compatible' content='IE=edge'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <link rel='shortcut icon' type = 'image / x-icon' href='<?php echo BASE_URL ?>/assets/img/favicon.ico'>
  <link rel='stylesheet' type='text/css' href='<?php echo BASE_URL ?>/assets/css/encabezado.css' media='screen'>
  <title>Factum</title>
</head>
<body>
  <div class='div-encabezado'>
    <div class="div-volver">
      <img id="volver"  src="<?php echo BASE_URL ?>/assets/img/volver.png" alt="" height="20px" width="20px">
    </div>
    <div class='div-ubicacion'>
      <span id='spanUbicacion'>.</span>
    </div>
<<<<<<< HEAD
    <div class='div-person' style='display: none;'>
      <span id='spanPerson'>Luis Gimenez</span>
=======
    <div class='div-person'>
      <span id='spanPerson'>.</span>
>>>>>>> f39b46ace79b733abe283a8918b8ad43163daf80
    </div>
  </div>
</body>
</html>