<?php

header('Content-Type: text/html;charset=utf-8');
require_once './config.php';

?>
<!DOCTYPE html>
<!-- <html lang='en'> -->
<head>
  <meta charset='UTF-8'>
  <meta http-equiv='X-UA-Compatible' content='IE=edge'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <meta name='description' content=''>
  <meta name='author' content='Luis1940-bot'>

  <link rel='shortcut icon' type = 'image / x-icon' href='<?php echo BASE_URL ?>/assets/img/favicon.ico'>
  <link rel='stylesheet' type='text/css' href='<?php echo BASE_URL ?>/assets/css/style.css?v=<?php echo(time()); ?>' media='screen'>
  <link rel='stylesheet' type='text/css' href='<?php echo BASE_URL ?>/assets/css/spinner.css?v=<?php echo(time()); ?>' media='screen'>
  <title></title>
</head>
<body>
  <div class="spinner"></div>
  <div class='headerFactum'>
      <div class='logoFactum'>
        <a id='linkInstitucional'>
          <img id='logo_png'>
        </a>
        </div>
    </div>
<script type='module' src='<?php echo BASE_URL ?>/controllers/index.js?v=<?php echo(time()); ?>'></script>
</body>
</html>
