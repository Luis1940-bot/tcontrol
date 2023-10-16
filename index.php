<?php
header('Content-Type: text/html;charset=utf-8');
session_start();
$_SESSION['factum_validation']['email'] = 'luisglogista@gmail.com';
$_SESSION['factum_validation']['plant'] = '1';
if (isset($_SESSION['factum_validation']['email'] )) {
   
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
  <link rel='stylesheet' type='text/css' href='./assets/css/spinner.css' media='screen'>
  <title>Factum</title>
</head>
<body>
  <div class="spinner"></div>
  <div class='headerFactum'>
      <div class='logoFactum'>
        <a href='https://www.factumconsultora.com'>
          <img id='logo_factum' src='./../../assets/img/ftm.png' alt='Factum Consultora'>
        </a>
        </div>
    </div>
<script type='module' src='./controllers/index.js'></script>
</body>
</html>