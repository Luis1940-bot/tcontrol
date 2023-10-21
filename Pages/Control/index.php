<?php
header('Content-Type: text/html;charset=utf-8');
session_start();
if (!isset($_SESSION['factum_validation']['email'] )) {
    unset($_SESSION['factum_validation']['email'] ); 
}


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
  <link rel='stylesheet' type='text/css' href='/Pages/Control/css/control.css' media='screen'>
  <link rel='stylesheet' type='text/css' href='/Pages/Control/css/modal.css' media='screen'>
  <link rel='stylesheet' type='text/css' href='../../assets/css/spinner.css' media='screen'>
  <title>Factum</title>
</head>
<body>
  <div class='spinner'></div>
  <header>
    <?php
      include('./../../includes/molecules/header.php');
      include('./../../includes/molecules/wichControl.php');
    ?>
     <div class='div-span'>
        <span  id='doc'></span>
        <hr>
    </div>
  </header>
  <main>
    <table>
        <thead></thead>
        <tbody></tbody>
    </table>
    <input type="file" id="imageInput" accept=".jpg, .jpeg, .png, .bmp" multiple style="display: none;">
  </main>
  <footer>
    <?php
      include('./../../includes/molecules/footer.php');
    ?>
  </footer>
  <div id='myModal' class='modal'>
        <div class='modal-content'>
            <span class='close' id='closeModalButton'>&times;</span>
            <?php
              include('./../../includes/molecules/wichConsult.php');
            ?>
            <div class='div-span'>
              <input type='text' id='searchInput' placeholder='Buscar...' />
              <hr>
            </div>
            <table>
                <thead></thead>
                <tbody></tbody>
            </table>
          <footer>
          </footer>
        </div>
    </div>
<script type='module' src='../../Pages/Control/control.js'></script>
</body>
</html>