<?php
session_start();

// Ruta del flag
$flagPath = dirname(__DIR__) . '/api/.reload-flag';

$mensaje = '';
$estado = file_exists($flagPath) ? 'ACTIVO' : 'INACTIVO';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  if (isset($_POST['forzar'])) {
    file_put_contents($flagPath, 'reload');
    $mensaje = '✅ Recarga forzada activada.';
    $estado = 'ACTIVO';
  }

  if (isset($_POST['desactivar'])) {
    if (file_exists($flagPath)) {
      unlink($flagPath);
      $mensaje = '⚪️ Recarga forzada desactivada.';
      $estado = 'INACTIVO';
    } else {
      $mensaje = '🚫 No había recarga activa.';
    }
  }
}
?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <title>Control de Recarga Remota</title>
  <style>
    body {
      font-family: sans-serif;
      padding: 2rem;
      background-color: #f4f4f4;
    }

    h1 {
      color: #333;
    }

    .estado {
      font-size: 1.2rem;
      margin-bottom: 1rem;
    }

    .boton {
      padding: 10px 20px;
      font-size: 16px;
      margin-right: 10px;
      border: none;
      cursor: pointer;
      border-radius: 5px;
      color: white;
    }

    .forzar {
      background-color: #e53935;
    }

    .desactivar {
      background-color: #555;
    }

    .mensaje {
      margin-top: 1rem;
      font-weight: bold;
      color: green;
    }
  </style>
</head>

<body>

  <h1>🛠 Panel de Recarga Remota</h1>
  <div class="estado">🔄 Estado actual: <strong><?= $estado ?></strong></div>

  <form method="post">
    <button class="boton forzar" type="submit" name="forzar">🔴 Forzar Recarga</button>
    <button class="boton desactivar" type="submit" name="desactivar">⚪️ Desactivar Recarga</button>
  </form>

  <?php if ($mensaje): ?>
    <div class="mensaje"><?= htmlspecialchars($mensaje) ?></div>
  <?php endif; ?>

</body>

</html>