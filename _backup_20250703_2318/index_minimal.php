<?php
// Versión ultra-minimalista sin funciones externas problemáticas
error_reporting(0);
ini_set('display_errors', '0');

// No incluir archivos problemáticos por ahora, usar datos de prueba
$stats = [
  'total_tickets' => 25,
  'nuevos' => 5,
  'abiertos' => 8,
  'en_proceso' => 7,
  'resueltos' => 3,
  'cerrados' => 2,
  'hoy' => 2,
  'semana' => 12,
  'mes' => 25
];

$tickets_recientes = [
  [
    'id' => 1,
    'titulo' => 'Error en sistema de login',
    'nombre_usuario' => 'Juan Pérez',
    'estado' => 'nuevo',
    'prioridad' => 'alta',
    'fecha_creacion' => '2025-07-03 10:30:00'
  ],
  [
    'id' => 2,
    'titulo' => 'Problema con base de datos',
    'nombre_usuario' => 'María García',
    'estado' => 'en_proceso',
    'prioridad' => 'critica',
    'fecha_creacion' => '2025-07-03 09:15:00'
  ]
];

$tickets_urgentes = [
  [
    'id' => 2,
    'titulo' => 'Problema con base de datos',
    'nombre_usuario' => 'María García',
    'estado' => 'en_proceso',
    'prioridad' => 'critica',
    'fecha_creacion' => '2025-07-03 09:15:00'
  ]
];

function tiempo_transcurrido($fecha)
{
  $ahora = new DateTime();
  $fecha_ticket = new DateTime($fecha);
  $diff = $ahora->diff($fecha_ticket);

  if ($diff->days > 0) {
    return $diff->days . ' día' . ($diff->days > 1 ? 's' : '');
  } elseif ($diff->h > 0) {
    return $diff->h . ' hora' . ($diff->h > 1 ? 's' : '');
  } else {
    return $diff->i . ' min';
  }
}

function get_prioridad_badge($prioridad)
{
  $badges = [
    'critica' => 'badge-danger',
    'alta' => 'badge-warning',
    'media' => 'badge-info',
    'baja' => 'badge-secondary'
  ];
  return $badges[$prioridad] ?? 'badge-secondary';
}

function get_estado_badge($estado)
{
  $badges = [
    'nuevo' => 'badge-primary',
    'abierto' => 'badge-warning',
    'en_proceso' => 'badge-info',
    'resuelto' => 'badge-success',
    'cerrado' => 'badge-dark'
  ];
  return $badges[$estado] ?? 'badge-secondary';
}

// Limpiar completamente cualquier salida
while (ob_get_level()) {
  ob_end_clean();
}

// Headers simples
header('Content-Type: text/html; charset=UTF-8');
?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Panel de Administración - Tickets de Soporte</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
  <link href="index.css" rel="stylesheet">
</head>

<body>
  <div class="container-fluid">
    <div class="header">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h1><i class="fas fa-shield-alt me-3"></i>PANEL ADMINISTRATIVO</h1>
          <p class="mb-0"><i class="fas fa-terminal me-2"></i>SISTEMA DE GESTIÓN DE TICKETS</p>
        </div>
        <div class="text-end">
          <span class="status-indicator">CONECTADO</span>
          <div><i class="fas fa-clock me-2"></i><?php echo date('Y-m-d H:i:s'); ?></div>
        </div>
      </div>
    </div>

    <!-- Estadísticas Principales -->
    <div class="row mb-4">
      <div class="col-xl-2 col-md-4 col-sm-6 mb-3">
        <div class="card stats-card">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="stats-icon bg-primary">
                <i class="fas fa-tickets"></i>
              </div>
              <div>
                <div class="stats-number"><?php echo $stats['total_tickets']; ?></div>
                <div class="stats-label">Total Tickets</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-2 col-md-4 col-sm-6 mb-3">
        <div class="card stats-card">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="stats-icon bg-warning">
                <i class="fas fa-exclamation-circle"></i>
              </div>
              <div>
                <div class="stats-number"><?php echo $stats['nuevos']; ?></div>
                <div class="stats-label">Nuevos</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-2 col-md-4 col-sm-6 mb-3">
        <div class="card stats-card">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="stats-icon bg-info">
                <i class="fas fa-cog"></i>
              </div>
              <div>
                <div class="stats-number"><?php echo $stats['en_proceso']; ?></div>
                <div class="stats-label">En Proceso</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-2 col-md-4 col-sm-6 mb-3">
        <div class="card stats-card">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="stats-icon bg-success">
                <i class="fas fa-check"></i>
              </div>
              <div>
                <div class="stats-number"><?php echo $stats['resueltos']; ?></div>
                <div class="stats-label">Resueltos</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-2 col-md-4 col-sm-6 mb-3">
        <div class="card stats-card">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="stats-icon bg-secondary">
                <i class="fas fa-archive"></i>
              </div>
              <div>
                <div class="stats-number"><?php echo $stats['cerrados']; ?></div>
                <div class="stats-label">Cerrados</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-2 col-md-4 col-sm-6 mb-3">
        <div class="card stats-card">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="stats-icon bg-danger">
                <i class="fas fa-calendar-day"></i>
              </div>
              <div>
                <div class="stats-number"><?php echo $stats['hoy']; ?></div>
                <div class="stats-label">Hoy</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido Principal -->
    <div class="row">
      <!-- Tickets Recientes -->
      <div class="col-lg-8 mb-4">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5><i class="fas fa-clock me-2"></i>TICKETS RECIENTES</h5>
            <a href="lista.php" class="btn btn-outline-primary btn-sm">
              <i class="fas fa-list me-1"></i>Ver Todos
            </a>
          </div>
          <div class="card-body p-0">
            <?php if (!empty($tickets_recientes)): ?>
              <div class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Título</th>
                      <th>Usuario</th>
                      <th>Estado</th>
                      <th>Prioridad</th>
                      <th>Creado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <?php foreach ($tickets_recientes as $ticket): ?>
                      <tr>
                        <td><span class="ticket-id">#<?php echo $ticket['id']; ?></span></td>
                        <td class="text-truncate" style="max-width: 200px;"><?php echo htmlspecialchars($ticket['titulo']); ?></td>
                        <td><?php echo htmlspecialchars($ticket['nombre_usuario']); ?></td>
                        <td><span class="badge <?php echo get_estado_badge($ticket['estado']); ?>"><?php echo ucfirst($ticket['estado']); ?></span></td>
                        <td><span class="badge <?php echo get_prioridad_badge($ticket['prioridad']); ?>"><?php echo ucfirst($ticket['prioridad']); ?></span></td>
                        <td><small><?php echo tiempo_transcurrido($ticket['fecha_creacion']); ?></small></td>
                        <td>
                          <a href="detalle.php?id=<?php echo $ticket['id']; ?>" class="btn btn-sm btn-outline-primary">
                            <i class="fas fa-eye"></i>
                          </a>
                        </td>
                      </tr>
                    <?php endforeach; ?>
                  </tbody>
                </table>
              </div>
            <?php else: ?>
              <div class="text-center py-4">
                <i class="fas fa-inbox fa-3x mb-3 text-muted"></i>
                <p class="text-muted">No hay tickets recientes</p>
              </div>
            <?php endif; ?>
          </div>
        </div>
      </div>

      <!-- Panel Lateral -->
      <div class="col-lg-4">
        <!-- Tickets Urgentes -->
        <div class="card mb-4">
          <div class="card-header">
            <h5><i class="fas fa-exclamation-triangle me-2"></i>ALERTAS CRÍTICAS</h5>
          </div>
          <div class="card-body">
            <?php if (!empty($tickets_urgentes)): ?>
              <?php foreach ($tickets_urgentes as $ticket): ?>
                <div class="alert alert-<?php echo ($ticket['prioridad'] === 'critica' ? 'danger' : 'warning'); ?> mb-2">
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <strong>#<?php echo $ticket['id']; ?></strong>
                      <div class="small"><?php echo htmlspecialchars(substr($ticket['titulo'], 0, 50)); ?>...</div>
                      <small class="text-muted"><?php echo tiempo_transcurrido($ticket['fecha_creacion']); ?></small>
                    </div>
                    <a href="detalle.php?id=<?php echo $ticket['id']; ?>" class="btn btn-sm btn-outline-dark">
                      <i class="fas fa-arrow-right"></i>
                    </a>
                  </div>
                </div>
              <?php endforeach; ?>
            <?php else: ?>
              <div class="text-center py-3">
                <i class="fas fa-check-circle fa-2x text-success mb-2"></i>
                <p class="text-muted mb-0">No hay tickets urgentes</p>
              </div>
            <?php endif; ?>
          </div>
        </div>

        <!-- Acciones Rápidas -->
        <div class="card">
          <div class="card-header">
            <h5><i class="fas fa-bolt me-2"></i>ACCIONES RÁPIDAS</h5>
          </div>
          <div class="card-body">
            <div class="row g-2">
              <div class="col-md-6">
                <a href="lista.php" class="btn btn-outline-primary w-100 mb-2">
                  <i class="fas fa-list me-2"></i>
                  Todos los Tickets
                </a>
              </div>
              <div class="col-md-6">
                <a href="lista.php?estado=nuevo" class="btn btn-outline-warning w-100 mb-2">
                  <i class="fas fa-star me-2"></i>
                  Nuevos
                </a>
              </div>
              <div class="col-md-6">
                <a href="estadisticas.php" class="btn btn-outline-info w-100 mb-2">
                  <i class="fas fa-chart-bar me-2"></i>
                  Estadísticas
                </a>
              </div>
              <div class="col-md-6">
                <a href="reportes.php" class="btn btn-outline-success w-100 mb-2">
                  <i class="fas fa-file-alt me-2"></i>
                  Reportes
                </a>
              </div>
              <div class="col-md-6">
                <a href="configuracion.php" class="btn btn-outline-secondary w-100 mb-2">
                  <i class="fas fa-cog me-2"></i>
                  Configuración
                </a>
              </div>
              <div class="col-md-6">
                <a href="lista.php?prioridad=critica,alta" class="btn btn-outline-danger w-100 mb-2">
                  <i class="fas fa-exclamation-triangle me-2"></i>
                  Alta Prioridad
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="index.js"></script>

  <!-- Diagnóstico del modo de compatibilidad -->
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      console.log('=== DIAGNÓSTICO MODO QUIRKS ===');
      console.log('Modo de compatibilidad:', document.compatMode);
      console.log('DOCTYPE presente:', document.doctype ? 'SÍ' : 'NO');
      console.log('Quirks Mode:', document.compatMode === 'BackCompat' ? 'SÍ (PROBLEMA)' : 'NO (CORRECTO)');

      if (document.compatMode === 'BackCompat') {
        console.error('🚨 PÁGINA EN MODO QUIRKS - Hay salida antes del DOCTYPE');
      } else {
        console.log('✅ Página en modo estándar - DOCTYPE correcto');
      }
    });
  </script>
</body>

</html>