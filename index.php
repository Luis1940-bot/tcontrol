<?php
header('Content-Type: text/html;charset=utf-8');
session_start();
$_SESSION['controls_mc_1000']['email'] = 'luisglogista@gmail.com';
if (isset($_SESSION['controls_mc_1000']['email'] )) {
   
}else{
  header('Location: /404.php');
  exit;
}

?>
<!DOCTYPE html>
<!-- <html lang='en'> -->
<head>
  <meta charset='UTF-8'>
  <meta name='description' content='Factum Consultora'>
  <meta name='author' content='Luis1940-bot'>
  <meta http-equiv='X-UA-Compatible' content='IE=edge'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <meta http-equiv='refresh' content='1;url=./Pages/Home'>
  <link rel='shortcut icon' type = 'image / x-icon' href='./assets/img/favicon.ico'>
  <link rel='stylesheet' type='text/css' href='./assets/css/index.css' media='screen'>
  <title>Factum</title>
</head>
<body>
</body>
</html>