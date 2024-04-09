<?php
session_start();

 if (!isset($_SESSION['login_sso']['email'] )) {
      unset($_SESSION['login_sso']['email'] ); 
  }
header('Content-Type: text/html;charset=utf-8');

define('ROOT_PATH', $_SERVER['DOCUMENT_ROOT']);
define('INCLUDES', ROOT_PATH.'/includes/molecules');
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
  <link rel='stylesheet' type='text/css' href='../../Pages/Login/login.css?v=<?php echo(time()); ?>' media='screen'>
  <link rel='stylesheet' type='text/css' href='../../assets/css/spinner.css?v=<?php echo(time()); ?>' media='screen'>
  <title></title>
</head>
<body>
  <div class="spinner"></div>
  <header>
    
    <?php
      include_once('../../includes/molecules/header.php');

      
    ?>
  </header>
  <main>
    <div class='div-login-buttons'>

    </div>
  </main>
  <footer>
    <?php
      include_once('../../includes/molecules/footer.php');
    ?>
  </footer>
<script type='module' src='../../Pages/Login/login.js?v=<?php echo(time()); ?>'></script>
<!-- <script type='module' src='../../Pages/Login/Controllers/crypto-js.min.js?v=<?php echo(time()); ?>'></script> -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js" integrity="sha512-nOQuvD9nKirvxDdvQ9OMqe2dgapbPB7vYAMrzJihw5m+aNcf0dX53m6YxM4LgA9u8e9eg9QX+/+mPu8kCNpV2A==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
</body>
</html>