<?php
header('Content-Type: text/html;charset=utf-8');
session_start();

if (!isset($_SESSION['factum_validation'])) {

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
  <link rel='shortcut icon' type = 'image / x-icon'>
  <link rel='stylesheet' type='text/css' href='../../Pages/ConsultasViews/vistas.css?v=<?php echo(time()); ?>' media='screen'>
  <link rel='stylesheet' type='text/css' href='../../assets/css/spinner.css?v=<?php echo(time()); ?>' media='screen'>
  <title></title>
</head>
<body>
  <div class="spinner"></div>
  <header>
    
    <?php
      include_once(INCLUDES . '/header.php');
      include_once(INCLUDES . '/encabezado.php');

 
    ?>
  </header>
  <main>
    <div class='div-views-buttons'>
    </div>
    <table id='tableConsultaViews'>
        <!-- <thead></thead>
        <tbody></tbody> -->
    </table>
  </main>
  <footer>
    <?php
      include_once(INCLUDES . '/footer.php');
    ?>
  </footer>
<script type='module' src='../../Pages/ConsultasViews/consultasView.js?v=<?php echo(time()); ?>'></script>
</body>
</html>