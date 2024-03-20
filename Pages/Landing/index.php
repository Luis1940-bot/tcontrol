<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: text/html;charset=utf-8');
session_start();
if (!isset($_SESSION['factum_validation']['email'] )) {
    unset($_SESSION['factum_validation']['email'] ); 
    
    // header('Location: ../../../../404.php');
    // exit;
}
?>

<!DOCTYPE html>
<!-- <html lang='en'> -->
<head>
  <meta charset='UTF-8'>
  <meta name='description'>
  <meta name='author' content='Luis1940-bot'>
  <meta http-equiv='X-UA-Compatible' content='IE=edge'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <link rel='shortcut icon' type = 'image / x-icon' href='./../../assets/img/favicon.ico'>
  <link rel='stylesheet' type='text/css' href='../../Pages/Landing/landing.css' media='screen'>
  <link rel='stylesheet' type='text/css' href='../../assets/css/spinner.css' media='screen'>
  <title></title>
</head>
<body>
  <div class='spinner'></div>
  <header>
    
    <?php
    include_once('../../includes/molecules/header.php');
    include_once('../../includes/molecules/encabezado.php');
    ?>
  </header>
  <main>
    <div class='div-landing-buttons'>

    </div>
    <div class='div-my-button'><button class='my-button' disabled><img id='seguir'  src='../../assets/img/icons8-arrow-30.png' alt='' height='20px' width='20px'></button></div>
  </main>
  <!-- <div><button class='my-button' disabled><img id='seguir'  src='../../assets/img/icons8-arrow-30.png' alt='' height='20px' width='20px'></button></div> -->
  <footer>
    <?php
      include_once('../../includes/molecules/footer.php');
    ?>
  </footer>
<script type='module' src='../../Pages/Landing/landing.js?v=<?php echo(time()); ?>'></script>
</body>
</html>