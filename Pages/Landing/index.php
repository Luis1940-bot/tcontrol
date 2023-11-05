<?php
header('Content-Type: text/html;charset=utf-8');
session_start();
if (!isset($_SESSION['factum_validation']['email'] )) {
    unset($_SESSION['factum_validation']['email'] ); 
    // header('Location: ../../../../404.php');
    // exit;
}
define('ROOT_PATH', $_SERVER['DOCUMENT_ROOT']);
define('INCLUDES', ROOT_PATH.'/includes/molecules');
?>
<!DOCTYPE html>
<!-- <html lang='en'> -->
<head>
  <meta charset='UTF-8'>
  <meta name='description' content='Factum Consultora'>
  <meta name='author' content='Luis1940-bot'>
  <meta http-equiv='X-UA-Compatible' content='IE=edge'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <link rel='shortcut icon' type = 'image / x-icon' href='./../../assets/img/favicon.ico'>
  <link rel='stylesheet' type='text/css' href='/Pages/Landing/landing.css' media='screen'>
  <link rel='stylesheet' type='text/css' href='../../assets/css/spinner.css' media='screen'>
  <title>Factum</title>
</head>
<body>
  <div class='spinner'></div>
  <header>
    
    <?php
      include_once(INCLUDES .'/header.php');
      include_once(INCLUDES .'/encabezado.php');
    ?>
  </header>
  <main>
    <div class='div-landing-buttons'>

    </div>
  </main>
  <button class='my-button' disabled><img id='seguir'  src='../../assets/img/icons8-arrow-30.png' alt='' height='20px' width='20px'></button>
  <footer>
    <?php
      include_once(INCLUDES . '/footer.php');
    ?>
  </footer>
<script type='module' src='../../Pages/Landing/landing.js'></script>
</body>
</html>