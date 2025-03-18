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
  <link rel='stylesheet' type='text/css' href='<?php echo $baseUrl ?>/assets/css/wichControl.css' media='screen'>
  <title>Tenki</title>
</head>

<body>
  <div class='div-wichControl'>
    <div class='div-wich'>
      <img src='<?php echo $baseUrl ?>/assets/img/icons8-brick-wall-50.png' alt='' width='10px' height='10px'>
      <span id='wichC'></span>
      <span id='wichCEmail'>📧</span>
    </div>
  </div>
</body>

</html>