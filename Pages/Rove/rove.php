<?php
header('Content-Type: text/html;charset=utf-8');
session_start();
if (!isset($_SESSION['factum_validation']['email'] )) {
    unset($_SESSION['factum_validation']['email'] ); 
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
  <link rel='shortcut icon' type = 'image / x-icon' href='./../../assets/img/favicon.ico'>
  <link rel='stylesheet' type='text/css' href='/Pages/Rove/rove.css' media='screen'>
  <link rel='stylesheet' type='text/css' href='../../assets/css/spinner.css' media='screen'>
  <title>Factum</title>
</head>
<body>
  <div class="spinner"></div>
  <header>
    
    <?php
      include('./../../includes/molecules/header.php');
      include('./../../includes/molecules/encabezado.php');
       include('./../../includes/molecules/whereUs.php');
    ?>
  </header>
  <main>
    <h1>rove</h1>
    <!-- <div class="div-buttons">

    </div> -->
  </main>
  <footer>
    <?php
      include('./../../includes/molecules/footer.php');
    ?>
  </footer>
<script type='module' src='../../Pages/Rove/rove.js'></script>
</body>
</html>