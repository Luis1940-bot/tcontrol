<?php
header('Content-Type: text/html;charset=utf-8');
session_start();
header('Cache-Control: no-cache, must-revalidate');
if (isset($_SESSION['factum_validation']['email'] )) {
  $_SESSION['factum_validation']['email'] = 'luisglogista@gmail.com';
  $_SESSION['factum_validation']['plant'] = '1';
  $_SESSION['factum_validation']['lng'] = 'es';
  $_SESSION['factum_validation']['person'] = 'Luis Gimenez';
  $_SESSION['factum_validation']['id'] = '6';
// }else{
  // header('Location: /404.php');
  // exit;
}

?>
<!DOCTYPE html>
<!-- <html lang='en'> -->
<head>
  <meta charset='UTF-8'>
  <meta http-equiv='X-UA-Compatible' content='IE=edge'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <meta name='description' content='Factum Consultora'>
  <meta name='author' content='Luis1940-bot'>
  <!-- <meta http-equiv='refresh' content='1;url=./Pages/Landing'> -->
  <link rel='shortcut icon' type='image/x-icon' href='./assets/img/favicon.ico'>
  <link rel='stylesheet' type='text/css' href='./assets/css/index.css?v=<?php echo(time()); ?>' media='screen'>
  <link rel='stylesheet' type='text/css' href='./assets/css/spinner.css?v=<?php echo(time()); ?>' media='screen'>
  <title>Factum</title>
</head>
<body>
  <div class="spinner"></div>
  <div class='headerFactum'>
      <div class='logoFactum'>
        <a href='https://www.factumconsultora.com'>
          <img id='logo_factum' src='./assets/img/ftm.png' alt='Factum Consultora'>
        </a>
        </div>
    </div>
<script type='module' src='./controllers/index.js?v=<?php echo(time()); ?>'></script>
</body>
</html>