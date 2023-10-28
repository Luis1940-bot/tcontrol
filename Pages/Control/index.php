<?php
ob_start();
header('Content-Type: text/html;charset=utf-8');
session_start();
if (!isset($_SESSION['factum_validation']['email'] )) {
    unset($_SESSION['factum_validation']['email'] ); 
}
define('ROOT_PATH', $_SERVER['DOCUMENT_ROOT']);
define('MODALS', ROOT_PATH.'/includes/molecules/modales');
define('INCLUDES', ROOT_PATH.'/includes/molecules');
define('PAGES', ROOT_PATH.'/Pages/Control');
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
  <link rel='stylesheet' type='text/css' href='/Pages/Control/css/control.css' media='screen'>
  <link rel='stylesheet' type='text/css' href='../../assets/css/spinner.css' media='screen'>
  <link rel='stylesheet' type='text/css' href='../../assets/css/alerta.css' media='screen'>
  <title>Factum</title>
</head>
<body>
  <div class='spinner'></div>
  <header>
    <?php
      include(INCLUDES . '/header.php');
      include(INCLUDES . '/wichControl.php');
    ?>
    </div>
     <div class='div-span'>
        <span  id='doc'></span>
        <hr>
    </div>
  </header>
  <main>
    <table>
        <thead></thead>
        <tbody></tbody>
    </table>
    <input type='file' id='imageInput' accept='.jpg, .jpeg, .png, .bmp' multiple style='display: none;'>
  </main>
  <footer>
    <?php
      include(INCLUDES . '/footer.php');
    ?>
  </footer>
    <?php
      include_once(MODALS . '/modal.php');
    ?>
<script type='module' src='./control.js'></script>
</body>
</html>