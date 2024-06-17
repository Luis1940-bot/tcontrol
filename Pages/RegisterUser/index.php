<?php
session_start();
define('SSO', $_SESSION['login_sso']['sso']);
if (!SSO) {
  $_SESSION['login_sso']['sso'] = 'null';
}

header('Content-Type: text/html;charset=utf-8');
require_once dirname(dirname(__DIR__)) . '/config.php';
?>
<!DOCTYPE html>
<!-- <html lang='br'> -->
<head>
  <meta charset='UTF-8'>
  <meta name='description'>
  <meta name='author' content='Luis1940-bot'>
  <meta http-equiv='X-UA-Compatible' content='IE=edge'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <link rel='shortcut icon' type = 'image / x-icon' href='<?php echo BASE_URL ?>/assets/img/favicon.ico'>
  <link rel='stylesheet' type='text/css' href='<?php echo BASE_URL ?>/Pages/RegisterUser/register.css?v=<?php echo(time()); ?>' media='screen'>
  <link rel='stylesheet' type='text/css' href='<?php echo BASE_URL ?>/assets/css/spinner.css?v=<?php echo(time()); ?>' media='screen'>
  <title></title>
</head>
<body>
  <div class="spinner"></div>
  <header>
    
    <?php
      include_once('../../includes/molecules/header.php');
      include_once('../../includes/molecules/whereUs.php');
    ?>
  </header>
  <main>
  <div class="div-register">
  <label for="nombre" class="label-login">Nombre y apellido</label>
  <input id="nombre" type="text" class="input-login" style="transition: background-color 0.3s;">

  <label for="pass" class="label-login">Contraseña</label>
  <input id="pass" type="password" class="input-login" style="transition: background-color 0.3s;">

  <label for="repetir-pass" class="label-login">Repetir Contraseña</label>
  <input id="repetir-pass" type="password" class="input-login" style="transition: background-color 0.3s;">

  <label for="area" class="label-login">Área</label>
  <select id="area" class="select-login" style="transition: background-color 0.3s;"></select>

  <label for="puesto" class="label-login">Puesto</label>
  <input id="puesto" type="text" class="input-login" style="transition: background-color 0.3s;">

  <label for="cod_usuario" class="label-login">Código de Usuario</label>
  <span id="cod_usuario" class="span-login">xxxx</span>

  <label for="tipo_usuario" class="label-login">Tipo de Usuario</label>
  <select id="tipo_usuario" class="select-login" style="transition: background-color 0.3s;"></select>

  <label for="idioma" class="label-login">Situación</label>
  <select id="idioma" class="select-login" style="transition: background-color 0.3s;" disabled>
    <option value="espanol">Activo</option>
    <option value="ingles">No activo</option>
  </select>

  <label for="idioma" class="label-login">Verificador</label>
  <select id="idioma" class="select-login" style="transition: background-color 0.3s;" disabled>
    <option value="espanol">No verificado</option>
    <option value="ingles">Verificado</option>
  </select>

  <label for="email" class="label-login">Correo Electrónico</label>
  <input id="email" type="email" class="input-login" style="transition: background-color 0.3s;">

  <label for="firma" class="label-login">Firma</label>
  <input id="firma" type="text" class="input-login" style="transition: background-color 0.3s;" disabled>

  <label for="idioma" class="label-login">Idioma</label>
  <select id="idioma" class="select-login" style="transition: background-color 0.3s;">
    <option value="espanol">Español</option>
    <option value="ingles">Inglés</option>
    <option value="portugues">Portugués</option>
  </select>

  <button class="button-login">Registrar</button>
</div>

  </main>
  <footer>
    <?php
      include_once('../../includes/molecules/footer.php');
    ?>
  </footer>
<script type='module' src='<?php echo BASE_URL ?>/Pages/RegisterUser/register.js?v=<?php echo(time()); ?>'></script>
</body>
</html>