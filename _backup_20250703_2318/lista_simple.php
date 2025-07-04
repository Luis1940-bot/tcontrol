<?php
// ==========================================
// LISTA SIMPLE ANTI-QUIRKS
// ==========================================

// Limpiar TODO
while (ob_get_level()) {
  ob_end_clean();
}

// Header mínimo
header('Content-Type: text/html; charset=UTF-8');

// Datos de ejemplo
$tickets = [
  [
    'ticket_id' => 'TK-001',
    'asunto' => 'Problema con el sistema de login',
    'estado' => 'nuevo',
    'prioridad' => 'alta',
    'empresa' => 'TekiWeb Solutions',
    'contacto_nombre' => 'Juan Pérez',
    'fecha_creacion' => '2025-07-03 10:30:00'
  ],
  [
    'ticket_id' => 'TK-002',
    'asunto' => 'Error en la base de datos',
    'estado' => 'abierto',
    'prioridad' => 'critica',
    'empresa' => 'Sistemas Corp',
    'contacto_nombre' => 'María García',
    'fecha_creacion' => '2025-07-03 08:15:00'
  ],
  [
    'ticket_id' => 'TK-003',
    'asunto' => 'Consulta sobre funcionalidades',
    'estado' => 'en_proceso',
    'prioridad' => 'media',
    'empresa' => 'Digital SA',
    'contacto_nombre' => 'Carlos López',
    'fecha_creacion' => '2025-07-02 16:45:00'
  ]
];

?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lista de Tickets</title>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📝</text></svg>">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="lista.css" rel="stylesheet">
</head>

<body>
  <script>
    console.log("🔍 Lista - Modo:", document.compatMode);
    if (document.compatMode === 'CSS1Compat') {
      console.log("✅ LISTA EN MODO ESTÁNDAR");
    } else {
      console.error("❌ LISTA EN MODO QUIRKS");
    }
  </script>

  <div class="container-fluid p-4">
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #00ff41; padding-bottom: 15px; margin-bottom: 20px;">
      <h1 style="color: #00ff41; margin: 0;">📝 Lista de Tickets</h1>
      <a href="test_simple.php" style="padding: 10px 20px; background: #2a2a2a; color: #00ff41; text-decoration: none; border-radius: 5px; border: 1px solid #00ff41;">
        🔙 Volver al Panel
      </a>
    </div>

    <div style="background: #1a1a1a; border-radius: 8px; border: 1px solid #333; overflow: hidden;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #2a2a2a; color: #00ff41;">
            <th style="padding: 15px; border-bottom: 1px solid #333; text-align: left;">ID</th>
            <th style="padding: 15px; border-bottom: 1px solid #333; text-align: left;">Asunto</th>
            <th style="padding: 15px; border-bottom: 1px solid #333; text-align: left;">Estado</th>
            <th style="padding: 15px; border-bottom: 1px solid #333; text-align: left;">Prioridad</th>
            <th style="padding: 15px; border-bottom: 1px solid #333; text-align: left;">Empresa</th>
            <th style="padding: 15px; border-bottom: 1px solid #333; text-align: left;">Contacto</th>
            <th style="padding: 15px; border-bottom: 1px solid #333; text-align: left;">Fecha</th>
            <th style="padding: 15px; border-bottom: 1px solid #333; text-align: left;">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($tickets as $ticket): ?>
            <tr style="color: #ccc; border-bottom: 1px solid #333;">
              <td style="padding: 12px; color: #00ff41; font-weight: bold;"><?= htmlspecialchars($ticket['ticket_id']) ?></td>
              <td style="padding: 12px;"><?= htmlspecialchars($ticket['asunto']) ?></td>
              <td style="padding: 12px;">
                <?php
                $estado_colors = [
                  'nuevo' => '#00aaff',
                  'abierto' => '#ffaa00',
                  'en_proceso' => '#ff6600',
                  'resuelto' => '#00ff41',
                  'cerrado' => '#888'
                ];
                $color = $estado_colors[$ticket['estado']] ?? '#ccc';
                ?>
                <span style="background: <?= $color ?>; color: #000; padding: 4px 8px; border-radius: 3px; font-size: 0.8em; font-weight: bold;">
                  <?= ucfirst(str_replace('_', ' ', $ticket['estado'])) ?>
                </span>
              </td>
              <td style="padding: 12px;">
                <?php
                $prioridad_colors = [
                  'critica' => '#ff4444',
                  'alta' => '#ffaa00',
                  'media' => '#00aaff',
                  'baja' => '#888'
                ];
                $color = $prioridad_colors[$ticket['prioridad']] ?? '#ccc';
                ?>
                <span style="background: <?= $color ?>; color: #000; padding: 4px 8px; border-radius: 3px; font-size: 0.8em; font-weight: bold;">
                  <?= ucfirst($ticket['prioridad']) ?>
                </span>
              </td>
              <td style="padding: 12px;"><?= htmlspecialchars($ticket['empresa']) ?></td>
              <td style="padding: 12px;"><?= htmlspecialchars($ticket['contacto_nombre']) ?></td>
              <td style="padding: 12px; font-size: 0.9em;">
                <?= date('d/m/Y H:i', strtotime($ticket['fecha_creacion'])) ?>
              </td>
              <td style="padding: 12px;">
                <a href="detalle_simple.php?ticket=<?= urlencode($ticket['ticket_id']) ?>"
                  style="padding: 6px 12px; background: #2a2a2a; color: #00ff41; text-decoration: none; border-radius: 3px; border: 1px solid #00ff41; font-size: 0.8em;">
                  👁️ Ver
                </a>
              </td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>

    <div style="background: #1a3a1a; padding: 15px; border-radius: 8px; border: 2px solid #00ff41; text-align: center; margin-top: 20px;">
      <h4 style="color: #00ff41; margin: 0;">✅ Lista funcionando correctamente</h4>
      <p style="color: #ccc; margin: 5px 0 0 0;">Mostrando <?= count($tickets) ?> tickets - Modo: <span id="mode-display"></span></p>
    </div>
  </div>

  <script>
    document.getElementById('mode-display').textContent = document.compatMode;
  </script>
</body>

</html>