<?php
// ==========================================
// DETALLE SIMPLE ANTI-QUIRKS
// ==========================================

// Limpiar TODO
while (ob_get_level()) {
  ob_end_clean();
}

// Header mínimo
header('Content-Type: text/html; charset=UTF-8');

// Obtener ticket ID
$ticket_id = $_GET['ticket'] ?? 'TK-001';

// Datos de ejemplo del ticket
$ticket = [
  'ticket_id' => $ticket_id,
  'asunto' => 'Problema con el sistema de login',
  'descripcion' => 'Los usuarios no pueden acceder al sistema desde esta mañana. El error aparece después de introducir las credenciales correctas.',
  'estado' => 'abierto',
  'prioridad' => 'alta',
  'empresa' => 'TekiWeb Solutions',
  'contacto_nombre' => 'Juan Pérez',
  'contacto_email' => 'juan.perez@tekiweb.com',
  'fecha_creacion' => '2025-07-03 10:30:00',
  'fecha_actualizacion' => '2025-07-03 11:15:00'
];

$respuestas = [
  [
    'fecha_respuesta' => '2025-07-03 11:15:00',
    'autor_nombre' => 'Soporte TenkiWeb',
    'tipo_respuesta' => 'soporte',
    'mensaje' => 'Hemos recibido su reporte. Estamos investigando el problema del sistema de login.'
  ],
  [
    'fecha_respuesta' => '2025-07-03 11:45:00',
    'autor_nombre' => 'Juan Pérez',
    'tipo_respuesta' => 'cliente',
    'mensaje' => 'Gracias por la respuesta. ¿Tienen una estimación de cuándo estará solucionado?'
  ]
];

?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Detalle Ticket <?= htmlspecialchars($ticket_id) ?></title>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎫</text></svg>">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="detalle.css" rel="stylesheet">
</head>

<body>
  <script>
    console.log("🔍 Detalle - Modo:", document.compatMode);
    if (document.compatMode === 'CSS1Compat') {
      console.log("✅ DETALLE EN MODO ESTÁNDAR");
    } else {
      console.error("❌ DETALLE EN MODO QUIRKS");
    }
  </script>

  <div class="container-fluid p-4">
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #00ff41; padding-bottom: 15px; margin-bottom: 20px;">
      <h1 style="color: #00ff41; margin: 0;">🎫 Ticket <?= htmlspecialchars($ticket['ticket_id']) ?></h1>
      <div>
        <a href="lista_simple.php" style="padding: 10px 20px; background: #2a2a2a; color: #00ff41; text-decoration: none; border-radius: 5px; border: 1px solid #00ff41; margin-right: 10px;">
          📝 Lista
        </a>
        <a href="test_simple.php" style="padding: 10px 20px; background: #2a2a2a; color: #00ff41; text-decoration: none; border-radius: 5px; border: 1px solid #00ff41;">
          🏠 Panel
        </a>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-8">
        <!-- Información del ticket -->
        <div style="background: #1a1a1a; border-radius: 8px; border: 1px solid #333; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: #00ff41; margin-bottom: 15px;">📋 Información del Ticket</h3>

          <div class="row">
            <div class="col-md-6">
              <p style="color: #ccc; margin-bottom: 8px;"><strong>Asunto:</strong></p>
              <p style="color: #00ff41; margin-bottom: 15px;"><?= htmlspecialchars($ticket['asunto']) ?></p>

              <p style="color: #ccc; margin-bottom: 8px;"><strong>Estado:</strong></p>
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
              <span style="background: <?= $color ?>; color: #000; padding: 6px 12px; border-radius: 5px; font-weight: bold; margin-bottom: 15px; display: inline-block;">
                <?= ucfirst(str_replace('_', ' ', $ticket['estado'])) ?>
              </span>
            </div>
            <div class="col-md-6">
              <p style="color: #ccc; margin-bottom: 8px;"><strong>Prioridad:</strong></p>
              <?php
              $prioridad_colors = [
                'critica' => '#ff4444',
                'alta' => '#ffaa00',
                'media' => '#00aaff',
                'baja' => '#888'
              ];
              $color = $prioridad_colors[$ticket['prioridad']] ?? '#ccc';
              ?>
              <span style="background: <?= $color ?>; color: #000; padding: 6px 12px; border-radius: 5px; font-weight: bold; margin-bottom: 15px; display: inline-block;">
                <?= ucfirst($ticket['prioridad']) ?>
              </span>

              <p style="color: #ccc; margin-bottom: 8px;"><strong>Empresa:</strong></p>
              <p style="color: #00ff41; margin-bottom: 15px;"><?= htmlspecialchars($ticket['empresa']) ?></p>
            </div>
          </div>

          <p style="color: #ccc; margin-bottom: 8px;"><strong>Descripción:</strong></p>
          <div style="background: #0a0a0a; padding: 15px; border-radius: 5px; border: 1px solid #333; color: #ccc;">
            <?= nl2br(htmlspecialchars($ticket['descripcion'])) ?>
          </div>
        </div>

        <!-- Respuestas -->
        <div style="background: #1a1a1a; border-radius: 8px; border: 1px solid #333; padding: 20px;">
          <h3 style="color: #00ff41; margin-bottom: 20px;">💬 Conversación</h3>

          <?php foreach ($respuestas as $respuesta): ?>
            <div style="margin-bottom: 20px; padding: 15px; background: <?= $respuesta['tipo_respuesta'] === 'soporte' ? '#1a3a1a' : '#3a1a1a' ?>; border-radius: 8px; border-left: 4px solid <?= $respuesta['tipo_respuesta'] === 'soporte' ? '#00ff41' : '#00aaff' ?>;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <strong style="color: <?= $respuesta['tipo_respuesta'] === 'soporte' ? '#00ff41' : '#00aaff' ?>;">
                  <?= $respuesta['tipo_respuesta'] === 'soporte' ? '🛠️' : '👤' ?> <?= htmlspecialchars($respuesta['autor_nombre']) ?>
                </strong>
                <small style="color: #888;">
                  <?= date('d/m/Y H:i', strtotime($respuesta['fecha_respuesta'])) ?>
                </small>
              </div>
              <div style="color: #ccc;">
                <?= nl2br(htmlspecialchars($respuesta['mensaje'])) ?>
              </div>
            </div>
          <?php endforeach; ?>
        </div>
      </div>

      <div class="col-lg-4">
        <!-- Información de contacto -->
        <div style="background: #1a1a1a; border-radius: 8px; border: 1px solid #333; padding: 20px; margin-bottom: 20px;">
          <h4 style="color: #00ff41; margin-bottom: 15px;">👤 Contacto</h4>
          <p style="color: #ccc; margin-bottom: 8px;"><strong>Nombre:</strong></p>
          <p style="color: #00ff41; margin-bottom: 15px;"><?= htmlspecialchars($ticket['contacto_nombre']) ?></p>

          <p style="color: #ccc; margin-bottom: 8px;"><strong>Email:</strong></p>
          <p style="color: #00ff41; margin-bottom: 15px;"><?= htmlspecialchars($ticket['contacto_email']) ?></p>
        </div>

        <!-- Fechas -->
        <div style="background: #1a1a1a; border-radius: 8px; border: 1px solid #333; padding: 20px;">
          <h4 style="color: #00ff41; margin-bottom: 15px;">📅 Fechas</h4>
          <p style="color: #ccc; margin-bottom: 8px;"><strong>Creado:</strong></p>
          <p style="color: #00ff41; margin-bottom: 15px;">
            <?= date('d/m/Y H:i', strtotime($ticket['fecha_creacion'])) ?>
          </p>

          <p style="color: #ccc; margin-bottom: 8px;"><strong>Actualizado:</strong></p>
          <p style="color: #00ff41; margin-bottom: 15px;">
            <?= date('d/m/Y H:i', strtotime($ticket['fecha_actualizacion'])) ?>
          </p>
        </div>
      </div>
    </div>

    <div style="background: #1a3a1a; padding: 15px; border-radius: 8px; border: 2px solid #00ff41; text-align: center; margin-top: 20px;">
      <h4 style="color: #00ff41; margin: 0;">✅ Detalle funcionando correctamente</h4>
      <p style="color: #ccc; margin: 5px 0 0 0;">Ticket: <?= htmlspecialchars($ticket_id) ?> - Modo: <span id="mode-display"></span></p>
    </div>
  </div>

  <script>
    document.getElementById('mode-display').textContent = document.compatMode;
  </script>
</body>

</html>