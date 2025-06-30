<?php
require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
/** @var string $baseDir */
$baseDir = BASE_DIR;

$logFile = $baseDir . "/logs/error.log"; // Ajusta la ruta según tu estructura

// Número de líneas a leer (opcional)
$maxLines = 50;

function readLogFile($file, $lines = 50)
{
  if (!file_exists($file)) {
    return ["El archivo de log no existe."];
  }

  $logEntries = [];
  $handle = fopen($file, "r");

  if ($handle) {
    while (($line = fgets($handle)) !== false) {
      $logEntries[] = trim($line);
    }
    fclose($handle);
  }

  // Devolver solo las últimas líneas
  return array_slice($logEntries, -$lines);
}

$logData = readLogFile($logFile, $maxLines);
?>

<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Visor de Logs</title>
  <style>
    body {
      font-family: Arial, sans-serif;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }

    th,
    td {
      padding: 8px;
      border: 1px solid black;
      text-align: left;
    }

    th {
      background-color: #f2f2f2;
    }

    .error {
      color: red;
      font-weight: bold;
    }
  </style>
</head>

<body>

  <h2>Últimos errores registrados (<?php echo $maxLines; ?> líneas)</h2>

  <?php if (empty($logData) || count($logData) === 1 && $logData[0] === "El archivo de log no existe."): ?>
    <p>No hay errores registrados o el archivo de log no existe.</p>
  <?php else: ?>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Mensaje de Error</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($logData as $index => $logEntry): ?>
          <tr>
            <td><?php echo $index + 1; ?></td>
            <td class="<?php echo strpos($logEntry, 'Error') !== false ? 'error' : ''; ?>">
              <?php echo htmlspecialchars($logEntry); ?>
            </td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  <?php endif; ?>

</body>

</html>