<?php
header('Content-Type: text/html;charset=utf-8');
require_once dirname(dirname(__DIR__)) . '/config.php';
?>
<!DOCTYPE html>
<!-- <html lang='en'> -->
<head>
  <meta charset='UTF-8'>
  <meta name='description' content='TenkiWeb'>
  <meta name='author' content='Luis1940-bot'>
  <meta http-equiv='X-UA-Compatible' content='IE=edge'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <link rel='shortcut icon' type = 'image / x-icon' href='<?php echo BASE_URL ?>/assets/img/favicon.ico'>
  <link rel='stylesheet' type='text/css' href='<?php echo BASE_URL ?>/assets/css/wichConsult.css' media='screen'>
  <title>Tenki</title>
</head>
<body>
  <div class='div-wichConsult'>
    <div class='div-wichCn'>
      <img src='<?php echo BASE_URL ?>/assets/img/icons8-layers-50.png' alt='' width='10px' height='10px'>
      <span id='wichCn'></span>
    </div>
  </div>
</body>
</html>