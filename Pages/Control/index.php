 <?php
ob_start();
header('Content-Type: text/html;charset=utf-8');
session_start();
if (!isset($_SESSION['factum_validation']['email'] )) {

}
if (!isset($_SESSION['factum_validation'])) {
    // $_SESSION['factum_validation'] = array(); // Inicializar el array si no existe
    // $_SESSION['factum_validation']['email'] = 'luisglogista@gmail.com';
    // $_SESSION['factum_validation']['plant'] = '1';
    // $_SESSION['factum_validation']['lng'] = 'es';
    // $_SESSION['factum_validation']['person'] = 'Luis Gimenez';
    // $_SESSION['factum_validation']['id'] = '6';
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
  <link rel='stylesheet' type='text/css' href='../../Pages/Control/css/control.css' media='screen'>
  <link rel='stylesheet' type='text/css' href='../../assets/css/spinner.css' media='screen'>
  <link rel='stylesheet' type='text/css' href='../../assets/css/alerta.css' media='screen'>
  <title>Factum</title>
</head>
<body>
  <div class='spinner'></div>
  <header>
    <?php
      include('../../includes/molecules/header.php');
      include('../../includes/molecules/wichControl.php');
    ?>
    </div>
     <div class='div-span'>
        <span  id='doc'></span><span  id='numberDoc'></span>
        <hr>
    </div>
  </header>
  <main>
    <table id='tableControl'>
        <thead></thead>
        <tbody></tbody>
    </table>
    <input type='file' id='imageInput' accept='.jpg, .jpeg, .png, .bmp' multiple style='display: none;'>
  </main>
  <footer>
    <?php
      include('../../includes/molecules/footer.php');
    ?>
  </footer>
    <?php
      include_once('../../includes/molecules/modales/modal.php');
      include_once('../../includes/molecules/modales/modalInforme.php');
    ?>
<script type='module' src='./control.js?v=<?php echo(time()); ?>'></script>
</body>
</html>