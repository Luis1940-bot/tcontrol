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
            <input type="text" id="idControl" name="idControl" disabled> 
            <label for="idControl">ID</label>
        </div>
        <div class="form-group">
            <!-- nombre -->
            <input type="text" id="firstName" name="firstName"> 
            <label for="firstName">Nombre del Reporte</label>
        </div>
        <div class="form-group">
            <!-- nombre -->
            <input type="text" id="titulo" name="titulo"> 
            <label for="titulo">Título en el informe</label>
        </div>
        <div class="form-group">
            <!-- detalle -->
            <textarea id="detalle" name="detalle" ></textarea>
            <label for="detalle">Detalle</label>
        </div>
        <div class="form-group">
            <!-- rotulo1 -->
            <input type="text" id="establecimiento" name="establecimiento">
            <label for="establecimiento">Establecimiento o planta</label>
        </div>
        <div class="form-group">
            <!-- rotulo3 -->
            <select  id="areaControladora" name="areaControladora"></select>
            <label for="areaControladora">Área controladora</label>
        </div>
        <div class="form-group">
            <!-- rotulo2 -->
            <input type="text" id="sectorControlado" name="sectorControlado">
            <label for="sectorControlado">Sector controlado</label>
        </div>
        <div class="form-group">
            <!-- regdc -->
            <input type="text" id="regdc" name="regdc">
            <label for="regdc">Registro en el Sistema de Gestión de la Calidad</label>
        </div>
        <div class="form-group">
            <!-- pie -->
            <textarea id="pieDeInforme" name="pieDeInforme"></textarea>
            <label for="pieDeInforme">Pie de informe</label>
        </div>
        <br>
        <div class="form-group">
            <!-- elaboro -->
            <input type="text" id="elaboro" name="elaboro">
            <label for="elaboro">Elaboró</label>
        </div>   
        <div class="form-group">
            <!-- reviso -->
            <input type="text" id="reviso" name="reviso">
            <label for="reviso">Revisó</label>
        </div>
        <div class="form-group">
            <!-- aprobo -->
            <input type="text" id="aprobo" name="aprobo">
            <label for="aprobo">Aprobó</label>
        </div>
        <div class="form-group">
            <!-- vigencia -->
            <input type="date" id="vigencia" name="vigencia">
            <label for="vigencia">Vigencia</label>
        </div>
        <div class="form-group" style="display: none;">
            <!-- modificacion -->
            <input type="date" id="modificacion" name="modificacion">
            <label for="modificacion">Fecha de modificación</label>
        </div>
        <div class="form-group">
            <!-- version -->
            <input type="text" id="version" name="version">
            <label for="version">Versión</label>
        </div>
        <div class="form-group">
            <!-- activo -->
            <select id="situacion" name="situacion"></select>
            <label for="situacion">Situación</label>
        </div>
        <div class="form-group">
            <!-- envio_mail -->
            <select id="email" name="email"></select>
            <label for="email">Seleccione envío por email si corresponde</label>
        </div>
        <div class="form-group">
            <!-- direcciones_mail -->
            <div class="input-button">
              <input id="direccionesEmails" name="direccionesEmails" class="input-field"><button class="add-button" id="buttonAgregar">+</button>
            </div>
            <label for="direccionesEmails">Agregue email</label>
            
        </div>
        <div class="email-group">
            
        </div>
        <br>
        <div class="form-group">
            <!-- frecuencia -->
            <select id="frecuencia" name="frecuencia"></select>
            <label for="frecuencia">Indique la frecuencia de completado</label>
        </div>
        <div class="form-group">
            <!-- tiempo estimado-->
            <input type="number" id="testimado" name="testimado">
            <label for="testimado">Tiempo estimado</label>
        </div>
        <div class="form-group">
            <!-- nivel -->
            <select id="tipodeusuario" name="tipodeusuario"></select>
            <label for="tipodeusuario">Tipo de usuario o nivel en la organización</label>
        </div>
      </form>
    </div>
    <div class='div2'>
      <table class="table-reporte">
        <thead class="thead-reporte" >
            <tr>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
            </tr>
        </thead>
        <tbody class="tbody-reporte-encabezado">
          <tr>
            <td colspan="2" rowspan="4" id="logoReporte"><img id="imgLogoReporte" src='<?php echo BASE_URL ?>/assets/img/logo.png' alt="Logo"></td>
            <td colspan="8" id="empresaReporte">Empresa</td>
            <td colspan="2" id="regdcReporte">REGDC</td>
          </tr>
          <tr>
            <td colspan="8" rowspan="3" id="controlReporte">Control</td>
            <td colspan="2" rowspan="3" id="vigenciaReporte">Vigencia</td>
          </tr>
          <tr></tr>
          <tr></tr>
          <tr></tr>
          <tr>
            <td colspan="4" id="elaboroReporte">Elaboró</td>
            <td colspan="4" id="revisoReporte">Revisó</td>
            <td colspan="4" id="aproboReporte">Aprobó</td>
          </tr>
          <tr>
            <td colspan="6" id="fechaReporte">Fecha</td>
            <td colspan="6" id="areaReporte">Área</td>
          </tr>
          <tr>
            <td colspan="12" id="docReporte">Doc</td>
          </tr>
        </tbody>
        <table class="table-reporte-cuerpo">
          <tbody class="tbody-reporte-cuerpo">
          </tbody>
        </table>
        <table class="table-reporte-pie">
          <tbody class="tbody-reporte-pie">
          <tr id="firmas">
            <td colspan="6">---</td>
            <td colspan="6">---</td>
          </tr>
          <tr>
            <td colspan="6" id="firma1">Firma control</td>
            <td colspan="6" id="firma2">Firma supervisa</td>
          </tr>
          <tr>
            <td colspan="12" id="controlCambios">Control de cambios</td>
          </tr>
          <tr id="filaVersion">
            <td colspan="4" id="reporteFecha">Fecha</td>
            <td colspan="4" id="modificacionReporte">Modificación</td>
            <td colspan="4" id="versionReporte">Versión</td>
          </tr>
        </tbody>
        </table>
      </table>
    </div>
  </main>
  <footer>
    <?php
      include_once('../../includes/molecules/footer.php');
    ?>
  </footer>
<script type='module' src='<?php echo BASE_URL ?>/Pages/ListReportes/Reporte/reporte.js?v=<?php echo(time()); ?>'></script>
</body>
</html>