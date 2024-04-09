<?php
header('Content-Type: text/html;charset=utf-8');
session_start();
 if (!isset($_SESSION['login_sso']['email'] )) {
      unset($_SESSION['login_sso']['email'] ); 
      header("Location: /");
    exit;
  }

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
  <link rel='stylesheet' type='text/css' href='../../Pages/ControlsView/css/controles.css?v=<?php echo(time()); ?>' media='screen'>
  <link rel='stylesheet' type='text/css' href='../../Pages/ControlsView/css/estiloImpresion.css?v=<?php echo(time()); ?>' media='screen'>
  <link rel='stylesheet' type='text/css' href='../../assets/css/spinner.css?v=<?php echo(time()); ?>' media='screen'>
  <title></title>
</head>
<body>
  <div class="spinner"></div>
  <header> 
    <?php
      include_once('../../includes/molecules/header.php');
      include_once('../../includes/molecules/encabezado.php');
      include_once('../../includes/molecules/whereUs.php');
      include_once('../../includes/molecules/doc.php');
    ?>
  </header>
  <main>
    <table id='tableControlViews'>
        <thead></thead>
        <tbody></tbody>
    </table>
  </main>
  <footer>
    <?php
      include_once('../../includes/molecules/footer.php');
    ?>
  </footer>
<script type='module' src='../../Pages/ControlsView/controles.js?v=<?php echo(time()); ?>'></script>
<script type='module' src='../../Pages/ControlsView/controlViews.js?v=<?php echo(time()); ?>'></script>
</body>
</html>