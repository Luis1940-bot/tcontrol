<?php
// ini_set('display_errors', '1');
// ini_set('display_startup_errors', '1');
// error_reporting(E_ALL);
require_once dirname(dirname(__DIR__)) . '/config.php';
/** @var string $baseUrl */
$baseUrl = BASE_URL;
?>
<!DOCTYPE html>
<html lang='es'>

<head>
  <meta charset='UTF-8'>
  <meta name='description' content='TenkiWeb'>
  <meta name='author' content='Luis1940-bot'>
  <meta http-equiv='X-UA-Compatible' content='IE=edge'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <link rel='shortcut icon' type='image / x-icon' href='<?php echo $baseUrl ?>/assets/img/favicon.ico'>
  <link rel='stylesheet' type='text/css' href='<?php echo $baseUrl ?>/assets/css/header.css' media='screen'>
  <link rel='stylesheet' type='text/css' href='<?php echo $baseUrl ?>/assets/css/conection.css' media='screen'>
  <link rel='stylesheet' type='text/css' href='<?php echo $baseUrl ?>/assets/css/alerta.css' media='screen'>
  <title>Tenki</title>
</head>

<body>
  <?php
  include_once('../../includes/molecules/modales/modalPerson.php');
  include_once('../../includes/molecules/modales/modalMenu.php');
  ?>
  <div class='div-header'>
    <div class='headerMenu'>
      <div class='div-menu'><img id='hamburguesa' src='<?php echo $baseUrl ?>/assets/img/hamburguesa.png' alt='Menu'></div>
    </div>
    <div class='headerVersion'>
      <span class="version">V1.0</span><img id='idSignal' src='' alt=''>
    </div>
    <div class='headerFactum'>
      <div class='logoFactum'>
        <a id='linkInstitucional' target='_blank'>
          <img id='logo_factum'>
        </a>
      </div>
    </div>
    <div class='headerLenguaje'><button class='custom-button' id='planta'></button></div>
    <div class='headerPerson'><img id='person' src='<?php echo $baseUrl ?>/assets/img/person.png' alt='Person'></div>
  </div>
  <div class='header-McCain'>
    <div class='div-McCain'>
      <img id='logo_mccain' src='<?php echo $baseUrl ?>/assets/img/logo.png' alt='Company'>
    </div>
  </div>
</body>

</html>