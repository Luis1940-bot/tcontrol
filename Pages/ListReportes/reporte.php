<?php
header('Content-Type: text/html;charset=utf-8');
session_start();
 if (!isset($_SESSION['login_sso']['email'] )) {
      unset($_SESSION['login_sso']['email'] ); 
      require_once dirname(dirname(__DIR__)) . '/config.php';
      header("Location: " . BASE_URL);
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
  <link rel='stylesheet' type='text/css' href='<?php echo BASE_URL ?>/Pages/ListReportes/Reporte/reporte.css?v=<?php echo(time()); ?>' media='screen'>
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
    <div class='div1'>
      <form id='formReporte'>
        <div class="form-group">
            <!-- nombre -->
            <input type="text" id="firstName" name="firstName"> 
            <label for="firstName">Nombre del Reporte.</label>
        </div>
        <div class="form-group">
            <!-- detalle -->
            <textarea id="detalle" name="detalle" ></textarea>
            <label for="detalle">Detalle.</label>
        </div>
        <div class="form-group">
            <!-- rotulo1 -->
            <select id="establecimiento" name="establecimiento"></select>
            <label for="establecimiento">Establecimiento o planta.</label>
        </div>
        <div class="form-group">
            <!-- rotulo3 -->
            <select  id="areaControladora" name="areaControladora"></select>
            <label for="areaControladora">Área controladora.</label>
        </div>
        <div class="form-group">
            <!-- rotulo2 -->
            <input type="text" id="sectorControlado" name="sectorControlado">
            <label for="sectorControlado">Sector controlado.</label>
        </div>
        <div class="form-group">
            <!-- regdc -->
            <input type="text" id="regdc" name="regdc">
            <label for="regdc">Registro en el Sistema de Gestión de la Calidad.</label>
        </div>
        <div class="form-group">
            <!-- pie -->
            <input type="text" id="pieDeInforme" name="pieDeInforme">
            <label for="pieDeInforme">Pie de informe.</label>
        </div>
        <br>
        <div class="form-group">
            <!-- elaboro -->
            <input type="text" id="elaboro" name="elaboro">
            <label for="elaboro">Elaboró.</label>
        </div>   
        <div class="form-group">
            <!-- reviso -->
            <input type="text" id="reviso" name="reviso">
            <label for="reviso">Revisó.</label>
        </div>
        <div class="form-group">
            <!-- aprobo -->
            <input type="text" id="aprobo" name="aprobo">
            <label for="aprobo">Aprobó.</label>
        </div>
        <div class="form-group">
            <!-- vigencia -->
            <input type="date" id="vigencia" name="vigencia">
            <label for="vigencia">Vigencia.</label>
        </div>
        <div class="form-group">
            <!-- modificacion -->
            <input type="date" id="modificacion" name="modificacion">
            <label for="modificacion">Fecha de modificación.</label>
        </div>
        <div class="form-group">
            <!-- version -->
            <input type="text" id="version" name="version">
            <label for="version">Versión.</label>
        </div>
        <div class="form-group">
            <!-- activo -->
            <select id="situacion" name="situacion"></select>
            <label for="situacion">Situación.</label>
        </div>
        <div class="form-group">
            <!-- envio_mail -->
            <select id="email" name="email"></select>
            <label for="email">Seleccione envío por email si corresponde.</label>
        </div>
        <div class="form-group">
            <!-- direcciones_mail -->
            <textarea id="direccionesEmails" name="direccionesEmails" placeholder="email1@mail.com/email2@mail.com"></textarea>
            <label for="direccionesEmails">Escriba las direcciones de emails separadas por /.</label>
        </div>
        <br>
        <div class="form-group">
            <!-- frecuencia -->
            <select id="frecuencia" name="frecuencia"></select>
            <label for="frecuencia">Indique la frecuencia de completado.</label>
        </div>
        <div class="form-group">
            <!-- tiempo estimado-->
            <input type="text" id="testimado" name="testimado">
            <label for="testimado">Tiempo estimado.</label>
        </div>
        <div class="form-group">
            <!-- nivel -->
            <select id="tipodeusuario" name="tipodeusuario"></select>
            <label for="tipodeusuario">Tipo de usuario o nivel en la organización.</label>
        </div>
      </form>
    </div>
    <div class='div2'>div 2</div>
  </main>
  <footer>
    <?php
      include_once('../../includes/molecules/footer.php');
    ?>
  </footer>
<script type='module' src='<?php echo BASE_URL ?>/Pages/ListReportes/Reporte/reporte.js?v=<?php echo(time()); ?>'></script>
</body>
</html>