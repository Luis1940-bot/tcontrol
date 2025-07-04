<?php
// ==========================================
// SOLUCIÓN ANTI-QUIRKS: LIMPIEZA TOTAL
// ==========================================
// Limpiar ABSOLUTAMENTE todo antes del DOCTYPE
while (ob_get_level()) {
  ob_end_clean();
}

// Asegurar que no hay salida previa
ob_start();

// Configuración de headers seguros
header_remove();
header('Content-Type: text/html; charset=UTF-8');
header('Cache-Control: no-cache, no-store, must-revalidate');

require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
require_once dirname(dirname(dirname(__DIR__))) . '/ErrorLogger.php';
ErrorLogger::initialize(dirname(dirname(dirname(__DIR__))) . '/logs/error.log');

// Configurar headers de seguridad y sesión
$nonce = setSecurityHeaders();
startSecureSession();

// Verificar si es superadmin
// if (!isset($_SESSION['is_superadmin']) || !$_SESSION['is_superadmin']) {
//     header('Location: ' . BASE_URL . '/login');
//     exit;
// }

$baseUrl = BASE_URL;

// Procesar formulario de configuración
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  try {
    $configuraciones = [
      'auto_assign_tickets' => $_POST['auto_assign_tickets'] ?? '0',
      'escalation_hours' => (int)($_POST['escalation_hours'] ?? 24),
      'max_attachments' => (int)($_POST['max_attachments'] ?? 5),
      'attachment_max_size' => (int)($_POST['attachment_max_size'] ?? 10),
      'email_notifications' => $_POST['email_notifications'] ?? '1',
      'sla_critical' => (int)($_POST['sla_critical'] ?? 2),
      'sla_high' => (int)($_POST['sla_high'] ?? 8),
      'sla_medium' => (int)($_POST['sla_medium'] ?? 24),
      'sla_low' => (int)($_POST['sla_low'] ?? 72),
      'allow_public_tickets' => $_POST['allow_public_tickets'] ?? '1',
      'require_registration' => $_POST['require_registration'] ?? '0',
      'auto_close_resolved_hours' => (int)($_POST['auto_close_resolved_hours'] ?? 72)
    ];

    // Guardar configuración en base de datos o archivo
    // Por simplicidad, usaremos un archivo JSON
    $configFile = dirname(__DIR__) . '/config/sistema_config.json';
    file_put_contents($configFile, json_encode($configuraciones, JSON_PRETTY_PRINT));

    $mensaje_exito = "Configuración guardada exitosamente.";
  } catch (Exception $e) {
    ErrorLogger::log("❌ Error al guardar configuración: " . $e->getMessage());
    $mensaje_error = "Error al guardar la configuración: " . $e->getMessage();
  }
}

// Cargar configuración actual
$configFile = dirname(__DIR__) . '/config/sistema_config.json';
$config_actual = [];
if (file_exists($configFile)) {
  $config_actual = json_decode(file_get_contents($configFile), true) ?? [];
}

// Valores por defecto
$config_defecto = [
  'auto_assign_tickets' => '0',
  'escalation_hours' => 24,
  'max_attachments' => 5,
  'attachment_max_size' => 10,
  'email_notifications' => '1',
  'sla_critical' => 2,
  'sla_high' => 8,
  'sla_medium' => 24,
  'sla_low' => 72,
  'allow_public_tickets' => '1',
  'require_registration' => '0',
  'auto_close_resolved_hours' => 72
];

$config = array_merge($config_defecto, $config_actual);

// ==========================================
// LIMPIAR TODO Y ENVIAR DOCTYPE LIMPIO
// ==========================================
ob_end_clean();
?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Configuración del Sistema - Panel de Admin</title>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚙️</text></svg>">
  <link rel="stylesheet" href="configuracion.css">
</head>

<body>
  <div class="admin-config">
    <div class="config-header">
      <h1>⚙️ Configuración del Sistema</h1>
      <p>Configura los parámetros globales del sistema de tickets</p>
    </div>

    <nav class="breadcrumb">
      <a href="index.php">Dashboard</a> > <span>Configuración</span>
    </nav>

    <?php if (isset($mensaje_exito)): ?>
      <div class="alert alert-success">
        ✅ <?= htmlspecialchars($mensaje_exito) ?>
      </div>
    <?php endif; ?>

    <?php if (isset($mensaje_error)): ?>
      <div class="alert alert-error">
        ❌ <?= htmlspecialchars($mensaje_error) ?>
      </div>
    <?php endif; ?>

    <form method="POST" class="config-form">
      <div class="config-sections">

        <!-- Sección: Gestión de Tickets -->
        <div class="config-section">
          <h2>🎫 Gestión de Tickets</h2>

          <div class="form-group">
            <label for="auto_assign_tickets">
              <input type="checkbox" id="auto_assign_tickets" name="auto_assign_tickets" value="1"
                <?= $config['auto_assign_tickets'] === '1' ? 'checked' : '' ?>>
              Asignación automática de tickets
            </label>
            <small>Los tickets se asignarán automáticamente al administrador disponible</small>
          </div>

          <div class="form-group">
            <label for="escalation_hours">Horas para escalación automática:</label>
            <input type="number" id="escalation_hours" name="escalation_hours"
              value="<?= $config['escalation_hours'] ?>" min="1" max="168">
            <small>Tickets sin respuesta se escalan después de estas horas</small>
          </div>

          <div class="form-group">
            <label for="auto_close_resolved_hours">Auto-cerrar tickets resueltos (horas):</label>
            <input type="number" id="auto_close_resolved_hours" name="auto_close_resolved_hours"
              value="<?= $config['auto_close_resolved_hours'] ?>" min="1" max="720">
            <small>Tickets resueltos se cerrarán automáticamente después de estas horas</small>
          </div>
        </div>

        <!-- Sección: SLA y Prioridades -->
        <div class="config-section">
          <h2>⏱️ SLA y Tiempos de Respuesta</h2>

          <div class="sla-grid">
            <div class="form-group">
              <label for="sla_critical">Prioridad Crítica (horas):</label>
              <input type="number" id="sla_critical" name="sla_critical"
                value="<?= $config['sla_critical'] ?>" min="1" max="24">
            </div>

            <div class="form-group">
              <label for="sla_high">Prioridad Alta (horas):</label>
              <input type="number" id="sla_high" name="sla_high"
                value="<?= $config['sla_high'] ?>" min="1" max="48">
            </div>

            <div class="form-group">
              <label for="sla_medium">Prioridad Media (horas):</label>
              <input type="number" id="sla_medium" name="sla_medium"
                value="<?= $config['sla_medium'] ?>" min="1" max="72">
            </div>

            <div class="form-group">
              <label for="sla_low">Prioridad Baja (horas):</label>
              <input type="number" id="sla_low" name="sla_low"
                value="<?= $config['sla_low'] ?>" min="1" max="168">
            </div>
          </div>
        </div>

        <!-- Sección: Archivos Adjuntos -->
        <div class="config-section">
          <h2>📎 Archivos Adjuntos</h2>

          <div class="form-group">
            <label for="max_attachments">Máximo archivos por ticket:</label>
            <input type="number" id="max_attachments" name="max_attachments"
              value="<?= $config['max_attachments'] ?>" min="1" max="20">
          </div>

          <div class="form-group">
            <label for="attachment_max_size">Tamaño máximo por archivo (MB):</label>
            <input type="number" id="attachment_max_size" name="attachment_max_size"
              value="<?= $config['attachment_max_size'] ?>" min="1" max="100">
          </div>
        </div>

        <!-- Sección: Notificaciones -->
        <div class="config-section">
          <h2>📧 Notificaciones</h2>

          <div class="form-group">
            <label for="email_notifications">
              <input type="checkbox" id="email_notifications" name="email_notifications" value="1"
                <?= $config['email_notifications'] === '1' ? 'checked' : '' ?>>
              Activar notificaciones por email
            </label>
            <small>Enviar emails automáticos para nuevos tickets y respuestas</small>
          </div>
        </div>

        <!-- Sección: Acceso Público -->
        <div class="config-section">
          <h2>🌐 Acceso Público</h2>

          <div class="form-group">
            <label for="allow_public_tickets">
              <input type="checkbox" id="allow_public_tickets" name="allow_public_tickets" value="1"
                <?= $config['allow_public_tickets'] === '1' ? 'checked' : '' ?>>
              Permitir tickets públicos
            </label>
            <small>Los clientes pueden crear tickets sin estar registrados</small>
          </div>

          <div class="form-group">
            <label for="require_registration">
              <input type="checkbox" id="require_registration" name="require_registration" value="1"
                <?= $config['require_registration'] === '1' ? 'checked' : '' ?>>
              Requerir registro para tickets
            </label>
            <small>Obligar a los usuarios a registrarse antes de crear tickets</small>
          </div>
        </div>

      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary">💾 Guardar Configuración</button>
        <button type="reset" class="btn btn-secondary">🔄 Restablecer</button>
        <a href="index.php" class="btn btn-outline">← Volver al Dashboard</a>
      </div>
    </form>
  </div>

  <script src="configuracion.js"></script>
</body>

</html>