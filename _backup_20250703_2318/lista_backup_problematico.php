<?php
// === CONFIGURACIÓN SEGURA PARA DATOS REALES ===
error_reporting(0);
ini_set('display_errors', '0');

// Limpiar cualquier buffer existente
while (ob_get_level()) {
    ob_end_clean();
}

try {
    // Incluir configuraciones de forma segura
    ob_start();
    require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
    require_once dirname(dirname(dirname(__DIR__))) . '/Routes/datos_base.php';
    ob_end_clean();
    
    // Crear conexión PDO
    $pdo = new PDO(
        "mysql:host={$host};dbname={$dbname};charset=utf8mb4",
        $user,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );

    $baseUrl = BASE_URL;

    // Parámetros de filtro
    $filtros = [
  'estado' => $_GET['estado'] ?? '',
  'prioridad' => $_GET['prioridad'] ?? '',
  'tipo_solicitud' => $_GET['tipo_solicitud'] ?? '',
  'fecha_desde' => $_GET['fecha_desde'] ?? '',
  'fecha_hasta' => $_GET['fecha_hasta'] ?? '',
  'buscar' => trim($_GET['buscar'] ?? ''),
  'page' => max(1, intval($_GET['page'] ?? 1)),
  'per_page' => max(10, min(100, intval($_GET['per_page'] ?? 25)))
];

// Construir consulta SQL con filtros
$where_conditions = [];
$params = [];

if (!empty($filtros['estado'])) {
  $estados = explode(',', $filtros['estado']);
  $placeholders = str_repeat('?,', count($estados) - 1) . '?';
  $where_conditions[] = "estado IN ($placeholders)";
  $params = array_merge($params, $estados);
}

if (!empty($filtros['prioridad'])) {
  $prioridades = explode(',', $filtros['prioridad']);
  $placeholders = str_repeat('?,', count($prioridades) - 1) . '?';
  $where_conditions[] = "prioridad IN ($placeholders)";
  $params = array_merge($params, $prioridades);
}

if (!empty($filtros['tipo_solicitud'])) {
  $where_conditions[] = "tipo_solicitud = ?";
  $params[] = $filtros['tipo_solicitud'];
}

if (!empty($filtros['fecha_desde'])) {
  $where_conditions[] = "DATE(fecha_creacion) >= ?";
  $params[] = $filtros['fecha_desde'];
}

if (!empty($filtros['fecha_hasta'])) {
  $where_conditions[] = "DATE(fecha_creacion) <= ?";
  $params[] = $filtros['fecha_hasta'];
}

if (!empty($filtros['buscar'])) {
  $where_conditions[] = "(
        ticket_id LIKE ? OR 
        empresa LIKE ? OR 
        nombre_contacto LIKE ? OR 
        email_contacto LIKE ? OR 
        asunto LIKE ? OR 
        descripcion LIKE ?
    )";
  $buscar_param = '%' . $filtros['buscar'] . '%';
  $params = array_merge($params, array_fill(0, 6, $buscar_param));
}

$where_clause = !empty($where_conditions) ? 'WHERE ' . implode(' AND ', $where_conditions) : '';

try {
  // Contar total de registros
  $count_sql = "SELECT COUNT(*) FROM soporte_tickets $where_clause";
  $stmt_count = $pdo->prepare($count_sql);
  $stmt_count->execute($params);
  $total_records = $stmt_count->fetchColumn();

  // Calcular paginación
  $total_pages = ceil($total_records / $filtros['per_page']);
  $offset = ($filtros['page'] - 1) * $filtros['per_page'];

  // Obtener tickets con paginación
  $sql = "
        SELECT 
            t.*,
            TIMESTAMPDIFF(HOUR, t.fecha_creacion, NOW()) as horas_transcurridas,
            (SELECT COUNT(*) FROM soporte_respuestas r WHERE r.ticket_id = t.ticket_id) as total_respuestas,
            (SELECT MAX(fecha_respuesta) FROM soporte_respuestas r WHERE r.ticket_id = t.ticket_id) as ultima_actividad
        FROM soporte_tickets t 
        $where_clause
        ORDER BY 
            CASE 
                WHEN estado = 'nuevo' THEN 1
                WHEN estado = 'abierto' THEN 2  
                WHEN estado = 'en_proceso' THEN 3
                WHEN estado = 'resuelto' THEN 4
                WHEN estado = 'cerrado' THEN 5
            END,
            CASE 
                WHEN prioridad = 'critica' THEN 1
                WHEN prioridad = 'alta' THEN 2
                WHEN prioridad = 'media' THEN 3
                WHEN prioridad = 'baja' THEN 4
            END,
            fecha_creacion DESC
        LIMIT ? OFFSET ?
    ";

  $stmt = $pdo->prepare($sql);
  $stmt->execute(array_merge($params, [$filtros['per_page'], $offset]));
  $tickets = $stmt->fetchAll(PDO::FETCH_ASSOC);

} catch (Exception $e) {
  // Error en configuración inicial
  error_log("Error en configuración inicial: " . $e->getMessage());
  $tickets = [];
  $total_records = 0;
  $total_pages = 0;
  $pdo = null;
}

// Si hay error de BD, continuar con datos vacíos
try {
  // Este try-catch original maneja errores específicos de consultas
} catch (Exception $e) {
  ErrorLogger::log("❌ Error al obtener tickets: " . $e->getMessage());
  $tickets = [];
  $total_records = 0;
  $total_pages = 0;
}

// Funciones helper
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
?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lista de Tickets - Administración</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
  <link href="lista.css" rel="stylesheet">
</head>

<body>
  <div class="container-fluid">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center py-3 border-bottom">
          <div class="d-flex align-items-center">
            <a href="index.php" class="btn btn-outline-secondary me-3">
              <i class="fas fa-arrow-left"></i>
            </a>
            <h1 class="h3 mb-0">
              <i class="fas fa-list me-2"></i>
              Lista de Tickets
            </h1>
            <span class="badge bg-primary ms-3"><?= number_format($total_records) ?> tickets</span>
          </div>
          <div class="d-flex gap-2">
            <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#filtrosModal">
              <i class="fas fa-filter me-1"></i> Filtros
            </button>
            <button type="button" class="btn btn-outline-success" onclick="exportarTickets()">
              <i class="fas fa-download me-1"></i> Exportar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros activos -->
    <?php if (array_filter($filtros, function ($v) {
      return !empty($v) && !in_array($v, [1, 25]);
    })): ?>
      <div class="row mb-3">
        <div class="col-12">
          <div class="alert alert-info d-flex align-items-center">
            <i class="fas fa-filter me-2"></i>
            <span class="me-auto">Filtros aplicados:</span>
            <div class="filtros-activos">
              <?php if (!empty($filtros['estado'])): ?>
                <span class="badge bg-primary me-1">Estado: <?= htmlspecialchars($filtros['estado']) ?></span>
              <?php endif; ?>
              <?php if (!empty($filtros['prioridad'])): ?>
                <span class="badge bg-warning me-1">Prioridad: <?= htmlspecialchars($filtros['prioridad']) ?></span>
              <?php endif; ?>
              <?php if (!empty($filtros['buscar'])): ?>
                <span class="badge bg-info me-1">Búsqueda: "<?= htmlspecialchars($filtros['buscar']) ?>"</span>
              <?php endif; ?>
              <a href="lista.php" class="btn btn-sm btn-outline-secondary ms-2">
                <i class="fas fa-times me-1"></i> Limpiar
              </a>
            </div>
          </div>
        </div>
      </div>
    <?php endif; ?>

    <!-- Acciones masivas -->
    <div class="row mb-3">
      <div class="col-12">
        <div class="card">
          <div class="card-body py-2">
            <div class="d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center">
                <div class="form-check me-3">
                  <input class="form-check-input" type="checkbox" id="selectAll">
                  <label class="form-check-label" for="selectAll">Seleccionar todos</label>
                </div>
                <span id="selectionCount" class="text-muted">0 seleccionados</span>
              </div>
              <div class="acciones-masivas" style="display: none;">
                <div class="btn-group">
                  <button type="button" class="btn btn-sm btn-outline-primary" onclick="cambiarEstadoMasivo('abierto')">
                    <i class="fas fa-folder-open me-1"></i> Abrir
                  </button>
                  <button type="button" class="btn btn-sm btn-outline-info" onclick="cambiarEstadoMasivo('en_proceso')">
                    <i class="fas fa-cogs me-1"></i> En Proceso
                  </button>
                  <button type="button" class="btn btn-sm btn-outline-success" onclick="cambiarEstadoMasivo('resuelto')">
                    <i class="fas fa-check me-1"></i> Resolver
                  </button>
                  <button type="button" class="btn btn-sm btn-outline-secondary" onclick="cambiarEstadoMasivo('cerrado')">
                    <i class="fas fa-times me-1"></i> Cerrar
                  </button>
                </div>
              </div>
              <div class="d-flex align-items-center">
                <label class="form-label me-2 mb-0">Por página:</label>
                <select class="form-select form-select-sm" style="width: auto;" onchange="cambiarPerPage(this.value)">
                  <option value="10" <?= $filtros['per_page'] == 10 ? 'selected' : '' ?>>10</option>
                  <option value="25" <?= $filtros['per_page'] == 25 ? 'selected' : '' ?>>25</option>
                  <option value="50" <?= $filtros['per_page'] == 50 ? 'selected' : '' ?>>50</option>
                  <option value="100" <?= $filtros['per_page'] == 100 ? 'selected' : '' ?>>100</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de tickets -->
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body p-0">
            <?php if (empty($tickets)): ?>
              <div class="text-center py-5">
                <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No se encontraron tickets</h5>
                <p class="text-muted">Ajusta los filtros o revisa los criterios de búsqueda</p>
              </div>
            <?php else: ?>
              <div class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th width="40"><input type="checkbox" id="selectAllTable"></th>
                      <th>Ticket</th>
                      <th>Cliente / Empresa</th>
                      <th>Asunto</th>
                      <th>Tipo</th>
                      <th>Estado</th>
                      <th>Prioridad</th>
                      <th>Creado</th>
                      <th>Actividad</th>
                      <th width="120">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <?php foreach ($tickets as $ticket): ?>
                      <tr class="ticket-row" data-ticket-id="<?= htmlspecialchars($ticket['ticket_id']) ?>">
                        <td>
                          <input type="checkbox" class="ticket-checkbox" value="<?= htmlspecialchars($ticket['ticket_id']) ?>">
                        </td>
                        <td>
                          <div class="d-flex align-items-center">
                            <span class="fw-bold"><?= htmlspecialchars($ticket['ticket_id']) ?></span>
                            <?php if ($ticket['total_respuestas'] > 0): ?>
                              <span class="badge bg-info ms-2" title="<?= $ticket['total_respuestas'] ?> respuestas">
                                <i class="fas fa-comments"></i> <?= $ticket['total_respuestas'] ?>
                              </span>
                            <?php endif; ?>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div class="fw-semibold"><?= htmlspecialchars($ticket['empresa']) ?></div>
                            <small class="text-muted"><?= htmlspecialchars($ticket['nombre_contacto']) ?></small>
                            <br><small class="text-muted"><?= htmlspecialchars($ticket['email_contacto']) ?></small>
                          </div>
                        </td>
                        <td>
                          <div class="asunto-cell">
                            <span class="fw-semibold"><?= htmlspecialchars(substr($ticket['asunto'], 0, 50)) ?><?= strlen($ticket['asunto']) > 50 ? '...' : '' ?></span>
                            <?php if (!empty($ticket['descripcion'])): ?>
                              <br><small class="text-muted"><?= htmlspecialchars(substr($ticket['descripcion'], 0, 80)) ?><?= strlen($ticket['descripcion']) > 80 ? '...' : '' ?></small>
                            <?php endif; ?>
                          </div>
                        </td>
                        <td>
                          <span class="badge bg-secondary">
                            <?= ucfirst(str_replace('_', ' ', $ticket['tipo_solicitud'])) ?>
                          </span>
                        </td>
                        <td>
                          <span class="badge <?= get_estado_badge($ticket['estado']) ?>">
                            <?= ucfirst(str_replace('_', ' ', $ticket['estado'])) ?>
                          </span>
                        </td>
                        <td>
                          <span class="badge <?= get_prioridad_badge($ticket['prioridad']) ?>">
                            <?= ucfirst($ticket['prioridad']) ?>
                          </span>
                        </td>
                        <td>
                          <div>
                            <small class="d-block"><?= date('d/m/Y', strtotime($ticket['fecha_creacion'])) ?></small>
                            <small class="text-muted"><?= date('H:i', strtotime($ticket['fecha_creacion'])) ?></small>
                            <br><small class="text-info"><?= tiempo_transcurrido($ticket['fecha_creacion']) ?></small>
                          </div>
                        </td>
                        <td>
                          <?php if ($ticket['ultima_actividad']): ?>
                            <small class="d-block"><?= date('d/m/Y H:i', strtotime($ticket['ultima_actividad'])) ?></small>
                            <small class="text-muted"><?= tiempo_transcurrido($ticket['ultima_actividad']) ?></small>
                          <?php else: ?>
                            <small class="text-muted">Sin actividad</small>
                          <?php endif; ?>
                        </td>
                        <td>
                          <div class="btn-group btn-group-sm">
                            <a href="detalle.php?ticket=<?= urlencode($ticket['ticket_id']) ?>"
                              class="btn btn-outline-primary" title="Ver detalle">
                              <i class="fas fa-eye"></i>
                            </a>
                            <button type="button" class="btn btn-outline-success"
                              onclick="responderTicket('<?= htmlspecialchars($ticket['ticket_id']) ?>')"
                              title="Responder">
                              <i class="fas fa-reply"></i>
                            </button>
                            <div class="btn-group">
                              <button type="button" class="btn btn-outline-secondary dropdown-toggle"
                                data-bs-toggle="dropdown" title="Más opciones">
                                <i class="fas fa-ellipsis-v"></i>
                              </button>
                              <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="#" onclick="cambiarEstado('<?= htmlspecialchars($ticket['ticket_id']) ?>', 'abierto')">
                                    <i class="fas fa-folder-open me-2"></i>Abrir
                                  </a></li>
                                <li><a class="dropdown-item" href="#" onclick="cambiarEstado('<?= htmlspecialchars($ticket['ticket_id']) ?>', 'en_proceso')">
                                    <i class="fas fa-cogs me-2"></i>En Proceso
                                  </a></li>
                                <li><a class="dropdown-item" href="#" onclick="cambiarEstado('<?= htmlspecialchars($ticket['ticket_id']) ?>', 'resuelto')">
                                    <i class="fas fa-check me-2"></i>Resolver
                                  </a></li>
                                <li><a class="dropdown-item" href="#" onclick="cambiarEstado('<?= htmlspecialchars($ticket['ticket_id']) ?>', 'cerrado')">
                                    <i class="fas fa-times me-2"></i>Cerrar
                                  </a></li>
                                <li>
                                  <hr class="dropdown-divider">
                                </li>
                                <li><a class="dropdown-item" href="#" onclick="cambiarPrioridad('<?= htmlspecialchars($ticket['ticket_id']) ?>')">
                                    <i class="fas fa-flag me-2"></i>Cambiar Prioridad
                                  </a></li>
                              </ul>
                            </div>
                          </div>
                        </td>
                      </tr>
                    <?php endforeach; ?>
                  </tbody>
                </table>
              </div>
            <?php endif; ?>
          </div>
        </div>
      </div>
    </div>

    <!-- Paginación -->
    <?php if ($total_pages > 1): ?>
      <div class="row mt-4">
        <div class="col-12">
          <nav aria-label="Paginación de tickets">
            <ul class="pagination justify-content-center">
              <?php if ($filtros['page'] > 1): ?>
                <li class="page-item">
                  <a class="page-link" href="?<?= http_build_query(array_merge($filtros, ['page' => $filtros['page'] - 1])) ?>">
                    <i class="fas fa-chevron-left"></i> Anterior
                  </a>
                </li>
              <?php endif; ?>

              <?php
              $start = max(1, $filtros['page'] - 2);
              $end = min($total_pages, $filtros['page'] + 2);

              if ($start > 1): ?>
                <li class="page-item">
                  <a class="page-link" href="?<?= http_build_query(array_merge($filtros, ['page' => 1])) ?>">1</a>
                </li>
                <?php if ($start > 2): ?>
                  <li class="page-item disabled"><span class="page-link">...</span></li>
                <?php endif; ?>
              <?php endif; ?>

              <?php for ($i = $start; $i <= $end; $i++): ?>
                <li class="page-item <?= $i == $filtros['page'] ? 'active' : '' ?>">
                  <a class="page-link" href="?<?= http_build_query(array_merge($filtros, ['page' => $i])) ?>"><?= $i ?></a>
                </li>
              <?php endfor; ?>

              <?php if ($end < $total_pages): ?>
                <?php if ($end < $total_pages - 1): ?>
                  <li class="page-item disabled"><span class="page-link">...</span></li>
                <?php endif; ?>
                <li class="page-item">
                  <a class="page-link" href="?<?= http_build_query(array_merge($filtros, ['page' => $total_pages])) ?>"><?= $total_pages ?></a>
                </li>
              <?php endif; ?>

              <?php if ($filtros['page'] < $total_pages): ?>
                <li class="page-item">
                  <a class="page-link" href="?<?= http_build_query(array_merge($filtros, ['page' => $filtros['page'] + 1])) ?>">
                    Siguiente <i class="fas fa-chevron-right"></i>
                  </a>
                </li>
              <?php endif; ?>
            </ul>
          </nav>
          <div class="text-center text-muted">
            Mostrando <?= number_format(($filtros['page'] - 1) * $filtros['per_page'] + 1) ?>
            - <?= number_format(min($filtros['page'] * $filtros['per_page'], $total_records)) ?>
            de <?= number_format($total_records) ?> tickets
          </div>
        </div>
      </div>
    <?php endif; ?>
  </div>

  <!-- Modal de Filtros -->
  <div class="modal fade" id="filtrosModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Filtros Avanzados</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <form method="GET" action="lista.php">
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Estado</label>
                  <select name="estado" class="form-select">
                    <option value="">Todos los estados</option>
                    <option value="nuevo" <?= $filtros['estado'] == 'nuevo' ? 'selected' : '' ?>>Nuevo</option>
                    <option value="abierto" <?= $filtros['estado'] == 'abierto' ? 'selected' : '' ?>>Abierto</option>
                    <option value="en_proceso" <?= $filtros['estado'] == 'en_proceso' ? 'selected' : '' ?>>En Proceso</option>
                    <option value="resuelto" <?= $filtros['estado'] == 'resuelto' ? 'selected' : '' ?>>Resuelto</option>
                    <option value="cerrado" <?= $filtros['estado'] == 'cerrado' ? 'selected' : '' ?>>Cerrado</option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Prioridad</label>
                  <select name="prioridad" class="form-select">
                    <option value="">Todas las prioridades</option>
                    <option value="critica" <?= $filtros['prioridad'] == 'critica' ? 'selected' : '' ?>>Crítica</option>
                    <option value="alta" <?= $filtros['prioridad'] == 'alta' ? 'selected' : '' ?>>Alta</option>
                    <option value="media" <?= $filtros['prioridad'] == 'media' ? 'selected' : '' ?>>Media</option>
                    <option value="baja" <?= $filtros['prioridad'] == 'baja' ? 'selected' : '' ?>>Baja</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Fecha desde</label>
                  <input type="date" name="fecha_desde" class="form-control" value="<?= htmlspecialchars($filtros['fecha_desde']) ?>">
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Fecha hasta</label>
                  <input type="date" name="fecha_hasta" class="form-control" value="<?= htmlspecialchars($filtros['fecha_hasta']) ?>">
                </div>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Tipo de solicitud</label>
              <select name="tipo_solicitud" class="form-select">
                <option value="">Todos los tipos</option>
                <option value="incidente_tecnico" <?= $filtros['tipo_solicitud'] == 'incidente_tecnico' ? 'selected' : '' ?>>Incidente Técnico</option>
                <option value="reporte_error" <?= $filtros['tipo_solicitud'] == 'reporte_error' ? 'selected' : '' ?>>Reporte de Error</option>
                <option value="solicitud_cambio" <?= $filtros['tipo_solicitud'] == 'solicitud_cambio' ? 'selected' : '' ?>>Solicitud de Cambio</option>
                <option value="consulta_funcionalidad" <?= $filtros['tipo_solicitud'] == 'consulta_funcionalidad' ? 'selected' : '' ?>>Consulta de Funcionalidad</option>
                <option value="solicitud_capacitacion" <?= $filtros['tipo_solicitud'] == 'solicitud_capacitacion' ? 'selected' : '' ?>>Solicitud de Capacitación</option>
                <option value="otros" <?= $filtros['tipo_solicitud'] == 'otros' ? 'selected' : '' ?>>Otros</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Buscar</label>
              <input type="text" name="buscar" class="form-control" placeholder="Buscar en ID, empresa, contacto, asunto o descripción..." value="<?= htmlspecialchars($filtros['buscar']) ?>">
            </div>
          </div>
          <div class="modal-footer">
            <a href="lista.php" class="btn btn-secondary">Limpiar filtros</a>
            <button type="submit" class="btn btn-primary">Aplicar filtros</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="lista.js"></script>
</body>

</html>