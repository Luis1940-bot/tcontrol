<?php
// ini_set('display_errors', '1');
// ini_set('display_startup_errors', '1');
// error_reporting(E_ALL);
require_once dirname(dirname(__DIR__)) . '/config.php';
/** @var string $baseUrl */
$baseUrl = BASE_URL;
?>
<div class='div-encabezado'>
  <div class="div-volver">
    <img id="volver" src="<?php echo $baseUrl ?>/assets/img/volver.png" alt="" height="20px" width="20px">
  </div>
  <div class='div-ubicacion'>
    <span id='spanUbicacion'>.</span>
  </div>
  <div class='div-person' style='display: none;'>
    <span id='spanPerson'></span>
  </div>
</div>