<?php
// INDEX SIMPLIFICADO PARA DIAGNÓSTICO

// Limpiar cualquier salida previa
while (ob_get_level()) {
  ob_end_clean();
}

// Headers básicos
header('Content-Type: text/html; charset=UTF-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

// Configuración de errores
error_reporting(0);
ini_set('display_errors', '0');

// Estadísticas de prueba
$stats = [
  'total_tickets' => 15,
  'nuevos' => 0,
  'abiertos' => 8,
  'en_proceso' => 2,
  'resueltos' => 1,
  'cerrados' => 1,
  'hoy' => 0,
  'semana' => 15,
  'mes' => 15
];

?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🛡️ PANEL ADMINISTRATIVO - SIMPLIFICADO</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      background: #0a0a0a;
      color: #e0e0e0;
      font-family: 'Courier New', monospace;
      min-height: 100vh;
      padding: 20px;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
      padding: 20px;
      border: 2px solid #00ff00;
      border-radius: 10px;
      background: rgba(0, 255, 0, 0.05);
    }

    .header h1 {
      color: #00ff00;
      text-shadow: 0 0 10px #00ff00;
      font-size: 2.5em;
      margin-bottom: 10px;
    }

    .stats-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 20px;
      margin: 30px 0;
    }

    .stat-card {
      background: rgba(0, 255, 0, 0.1);
      border: 2px solid #00ff00;
      border-radius: 10px;
      padding: 20px;
      text-align: center;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      background: rgba(0, 255, 0, 0.2);
      box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
      transform: translateY(-2px);
    }

    .stat-icon {
      font-size: 2.5em;
      margin-bottom: 10px;
    }

    .stat-number {
      font-size: 2.5em;
      font-weight: bold;
      color: #00ff00;
      text-shadow: 0 0 10px #00ff00;
      margin: 10px 0;
    }

    .stat-label {
      font-size: 0.9em;
      text-transform: uppercase;
      letter-spacing: 1px;
      opacity: 0.9;
    }

    .debug-info {
      background: rgba(255, 0, 0, 0.1);
      border: 2px solid #ff0000;
      padding: 15px;
      margin: 20px 0;
      border-radius: 5px;
      color: #ff9999;
    }
  </style>
</head>

<body>
  <div class="container">

    <div class="header">
      <h1>🛡️ PANEL ADMINISTRATIVO</h1>
      <p>Versión Simplificada - Test de Estadísticas</p>
    </div>

    <div class="debug-info">
      <strong>DEBUG INFO:</strong><br>
      - PHP Version: <?= PHP_VERSION ?><br>
      - Servidor: <?= $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown' ?><br>
      - Hora actual: <?= date('Y-m-d H:i:s') ?><br>
      - Headers enviados: <?= headers_sent() ? 'SÍ' : 'NO' ?>
    </div>

    <div class="stats-container">
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-number"><?= $stats['total_tickets'] ?></div>
        <div class="stat-label">Total Tickets</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🆕</div>
        <div class="stat-number"><?= $stats['nuevos'] ?></div>
        <div class="stat-label">Nuevos</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🔄</div>
        <div class="stat-number"><?= $stats['abiertos'] + $stats['en_proceso'] ?></div>
        <div class="stat-label">En Proceso</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-number"><?= $stats['resueltos'] ?></div>
        <div class="stat-label">Resueltos</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🔒</div>
        <div class="stat-number"><?= $stats['cerrados'] ?></div>
        <div class="stat-label">Cerrados</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-number"><?= $stats['hoy'] ?></div>
        <div class="stat-label">Hoy</div>
      </div>
    </div>

    <div class="debug-info">
      <strong>VALORES DE ESTADÍSTICAS:</strong><br>
      <?php foreach ($stats as $key => $value): ?>
        - <?= $key ?>: <?= $value ?><br>
      <?php endforeach; ?>
    </div>

  </div>
</body>

</html>