<?php
// ini_set('display_errors', '1');
// ini_set('display_startup_errors', '1');
// error_reporting(E_ALL);
require_once dirname(dirname(__DIR__)) . '/config.php';
/** @var string $baseUrl */
$baseUrl = BASE_URL;
?>
<!DOCTYPE html>
<!-- <html lang='en'> -->

<head>
  <meta charset='UTF-8'>
  <meta name='description' content='TenkiWeb'>
  <meta name='author' content='Luis1940-bot'>
  <meta http-equiv='X-UA-Compatible' content='IE=edge'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <link rel='shortcut icon' type='image / x-icon' href='<?php echo $baseUrl ?>/assets/img/favicon.ico'>
  <link rel='stylesheet' type='text/css' href='<?php echo $baseUrl ?>/assets/css/encabezado.css' media='screen'>
  <title>Tenki</title>
</head>

<body>
  <div class='div-encabezado'>
    <div class="div-volver">
      <img id="volver" src="<?php echo $baseUrl ?>/assets/img/volver.png" alt="" height="20px" width="20px">
    </div>
    <div class='div-ubicacion'>
      <span id='spanUbicacion'>.</span>
    </div>
    <div class='div-person' style='display: none;'>
      <span id='spanPerson'></span>
    </div>
  </div>
</body>

</html>