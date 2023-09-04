<?php
header('Content-Type: text/html;charset=utf-8');
session_start();
if (!isset($_SESSION['controls_mc_1000']['email'] )) {
    unset($_SESSION['controls_mc_1000']['email'] ); 
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
  <link rel='stylesheet' type='text/css' href='/Pages/Home/home.css' media='screen'>
  <title>Factum</title>
</head>
<body>
  <header>
    <?php
      include('./../../includes/molecules/header.php');
      include('./../../includes/molecules/encabezado.php');
    ?>
  </header>
  <main>

  </main>
  <footer>
    <?php
      include('./../../includes/molecules/footer.php');
    ?>
  </footer>
</body>
</html>