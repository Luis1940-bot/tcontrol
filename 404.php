<?php
header('Content-Type: text/html;charset=utf-8');
require_once './config.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel='shortcut icon' type = 'image / x-icon' href='<?php echo BASE_URL ?>/assets/img/favicon.ico'>
    <title>Error 404 - Página no encontrada</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            text-align: center;
        }

        .container {
            margin: 5% auto;
            max-width: 600px;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        }

        h1 {
            font-size: 72px;
            color: #333;
        }

        p {
            font-size: 18px;
            color: #666;
        }

        a {
            text-decoration: none;
            color: #007BFF;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Error 404</h1>
        <p>Lo sentimos, la página que buscas no se encuentra.</p>
        <p>Puedes volver a la <a href="/">página de inicio</a>.</p>
    </div>
</body>
</html>
