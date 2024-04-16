<?php
header('Content-Type: text/html;charset=utf-8');
session_start();
 if (!isset($_SESSION['login_sso']['email'] )) {
      unset($_SESSION['login_sso']['email'] ); 
      header("Location: /");
    exit;
  }

require_once dirname(dirname(__DIR__)) . '/config.php';
?>
<!DOCTYPE html>
<!-- <html lang='en'> -->
<head>
  <meta charset='UTF-8'>
  <meta name='description'>
  <meta name='author' content='Luis1940-bot'>
  <meta http-equiv='X-UA-Compatible' content='IE=edge'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <link rel='shortcut icon' type = 'image / x-icon' href='<?php echo BASE_URL ?>/assets/img/favicon.ico'>
  <link rel='stylesheet' type='text/css' href='<?php echo BASE_URL ?>/Pages/ConsultasViews/vistas.css?v=<?php echo(time()); ?>' media='screen'>
  <link rel='stylesheet' type='text/css' href='<?php echo BASE_URL ?>/assets/css/spinner.css?v=<?php echo(time()); ?>' media='screen'>

  <title></title>
</head>
<body>
  <div class="spinner"></div>
  <header>
    
    <?php
      include_once('../../includes/molecules/header.php');
      include_once('../../includes/molecules/encabezado.php');
      include_once('../../includes/molecules/whereUs.php');

 
    ?>
  </header>
  <main>
    <div class='div-views-buttons'>
    </div>
    <table id='tableConsultaViews'>
    </table>
  </main>
  <footer>
    <?php
       include_once('../../includes/molecules/footer.php');
    ?>
  </footer>
<script type='module' src='<?php echo BASE_URL ?>/Pages/ConsultasViews/consultasView.js?v=<?php echo(time()); ?>'></script>
<script src='<?php echo BASE_URL ?>/includes/atoms/cdnjs/xlsx.full.min.js'></script>
<script src='<?php echo BASE_URL ?>/includes/atoms/html2canvas/html2canvas.min.js'></script>
<script src='<?php echo BASE_URL ?>/includes/atoms/jspdf/jspdf.min.js'></script>

</body>
</html>