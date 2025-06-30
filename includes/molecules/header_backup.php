<?php
// ini_set('display_errors', '1');
// ini_set('display_startup_errors', '1');
// error_reporting(E_ALL);
require_once dirname(dirname(__DIR__)) . '/config.php';
/** @var string $baseUrl */
$baseUrl = BASE_URL;
?>
<?php
include_once('../../includes/molecules/modales/modalPerson.php');
include_once('../../includes/molecules/modales/modalMenu.php');
?>
<div class='div-header'>
  <div class='headerMenu'>
    <div class='div-menu'><img id='hamburguesa' src='<?php echo $baseUrl ?>/assets/img/hamburguesa.png' alt='Menu'></div>
  </div>
  <div class='headerVersion headerVersion-row'>
    <span id="signal-dot" class="signal-dot"></span>
    <span class="version">V1.0</span>
  </div>
  <div class='headerFactum'>
    <div class='logoFactum'>
      <a id='linkInstitucional' target='_blank' href='https://linkedin.com/in/luisergimenez/'>
        <img id='logo_factum' src='<?php echo $baseUrl ?>/assets/Logos/tenki.png' alt='Tenki Web' width='100' height='40'>
      </a>
    </div>
  </div>
  <div class='headerLenguaje'><button class='custom-button' id='planta'></button></div>
  <div class='headerPerson'><img id='person' src='<?php echo $baseUrl ?>/assets/img/person.png' alt='Person'></div>
</div>
<!-- <div class='header-McCain'>
  <div class='div-McCain'>
    <img id='logo_mccain' src='<?php echo $baseUrl ?>/assets/img/tcontrol.png' alt='Company' />
  </div>
</div> -->
