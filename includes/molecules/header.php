<?php
header('Content-Type: text/html;charset=utf-8');
define('ROOT_PATHP', $_SERVER['DOCUMENT_ROOT']);
define('MODALSP', ROOT_PATHP.'/includes/molecules/modales');
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
  <link rel='stylesheet' type='text/css' href='./../../assets/css/header.css' media='screen'>
  <link rel='stylesheet' type='text/css' href='../../assets/css/alerta.css' media='screen'>
  <title>Factum</title>
</head>
<body>
  <?php
    include_once(MODALSP . '/modalPerson.php');
    include_once(MODALSP . '/modalMenu.php');
  ?>
  <div class='div-header'>
    <div class='headerMenu'>
      <div class='div-menu'><img id='hamburguesa'  src='./../../assets/img/hamburguesa.png' alt='Menu'></div>
    </div>
    <div class='headerVersion'>
      <span class="version">V1.0</span>
    </div>
    <div class='headerFactum'>
      <div class='logoFactum'>
        <a href='https://www.factumconsultora.com'>
          <img id='logo_factum' src='./../../assets/img/ftm.png' alt='Factum Consultora'>
        </a>
        </div>
    </div>
    <div class='headerLenguaje'><button class='custom-button'>Español</button></div>
    <div class='headerPerson'><img id='person' src='./../../assets/img/person.png' alt='Person'></div>
  </div>
  <div class='header-McCain'>
    <div class='div-McCain'>
      <img id='logo_mccain' src='./../../assets/img/logo.png' alt='McCain'>
    </div>
  </div>
</body>
</html>