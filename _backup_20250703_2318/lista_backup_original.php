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

$baseUrl = BASE_URL;

// Obtener parámetros de filtros
$filtro_estado = $_GET['estado'] ?? '';
$filtro_prioridad = $_GET['prioridad'] ?? '';
$filtro_empresa = $_GET['empresa'] ?? '';
$buscar = $_GET['buscar'] ?? '';
$pagina = max(1, (int)($_GET['pagina'] ?? 1));
$por_pagina = 20;
$offset = ($pagina - 1) * $por_pagina;

// Variables para datos
$tickets = [];
$total_tickets = 0;
$filtros_aplicados = [];

try {
  // Construir consulta con filtros
  $where_conditions = ["1=1"];
  $params = [];

  if (!empty($filtro_estado)) {
    $where_conditions[] = "estado = ?";
    $params[] = $filtro_estado;
    $filtros_aplicados[] = "Estado: " . ucfirst($filtro_estado);
  }

  if (!empty($filtro_prioridad)) {
    $where_conditions[] = "prioridad = ?";
    $params[] = $filtro_prioridad;
    $filtros_aplicados[] = "Prioridad: " . ucfirst($filtro_prioridad);
  }

  if (!empty($filtro_empresa)) {
    $where_conditions[] = "empresa LIKE ?";
    $params[] = "%{$filtro_empresa}%";
    $filtros_aplicados[] = "Empresa: {$filtro_empresa}";
  }

  if (!empty($buscar)) {
    $where_conditions[] = "(asunto LIKE ? OR descripcion LIKE ? OR ticket_id LIKE ?)";
    $params[] = "%{$buscar}%";
    $params[] = "%{$buscar}%";
    $params[] = "%{$buscar}%";
    $filtros_aplicados[] = "Búsqueda: {$buscar}";
  }

  $where_clause = implode(" AND ", $where_conditions);

  // Contar total de resultados
  $stmt_count = $pdo->prepare("SELECT COUNT(*) as total FROM soporte_tickets WHERE {$where_clause}");
  $stmt_count->execute($params);
  $total_tickets = $stmt_count->fetch()['total'];

  // Obtener tickets con paginación
  $stmt_tickets = $pdo->prepare("
        SELECT 
            ticket_id,
            asunto,
            estado,
            prioridad,
            empresa,
            contacto_nombre,
            contacto_email,
            fecha_creacion,
            fecha_actualizacion,
            TIMESTAMPDIFF(HOUR, fecha_creacion, NOW()) as horas_transcurridas
        FROM soporte_tickets 
        WHERE {$where_clause}
        ORDER BY fecha_creacion DESC 
        LIMIT {$por_pagina} OFFSET {$offset}
    ");
  $stmt_tickets->execute($params);
  $tickets = $stmt_tickets->fetchAll(PDO::FETCH_ASSOC);

  // Obtener listas para filtros
  $stmt_empresas = $pdo->query("SELECT DISTINCT empresa FROM soporte_tickets WHERE empresa IS NOT NULL AND empresa != '' ORDER BY empresa");
  $empresas = $stmt_empresas->fetchAll(PDO::FETCH_COLUMN);
} catch (Exception $e) {
  ErrorLogger::log("❌ Error obteniendo lista de tickets: " . $e->getMessage());
  $tickets = [];
  $total_tickets = 0;
  $empresas = [];
}

// Calcular paginación
$total_paginas = ceil($total_tickets / $por_pagina);

// Función helper para badges
function get_estado_badge($estado)
{
  $badges = [
    'nuevo' => 'badge-primary',
    'abierto' => 'badge-info',
    'en_proceso' => 'badge-warning',
    'resuelto' => 'badge-success',
    'cerrado' => 'badge-secondary'
  ];
  return $badges[$estado] ?? 'badge-secondary';
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
  <title>Lista de Tickets - Administración</title>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📝</text></svg>">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
  <link href="lista.css" rel="stylesheet">
</head>

<body>
  <!-- Diagnóstico del modo de compatibilidad -->
  <script>
    console.log("🔍 Modo de compatibilidad:", document.compatMode);
    if (document.compatMode === 'CSS1Compat') {
      console.log("✅ Página en MODO ESTÁNDAR (correcto)");
    } else {
      console.error("❌ Página en MODO QUIRKS (problema)");
    }
  </script>

  <div class="container-fluid">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center py-3 border-bottom">
          <div class="d-flex align-items-center">
            <a href="index.php" class="btn btn-outline-secondary me-3">
              <i class="fas fa-arrow-left"></i> Panel Principal
            </a>
            <h1 class="h3 mb-0">📝 Lista de Tickets</h1>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-success" onclick="location.reload()">
              <i class="fas fa-sync"></i> Actualizar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0"><i class="fas fa-filter"></i> Filtros de Búsqueda</h5>
          </div>
          <div class="card-body">
            <form method="GET" class="row g-3">
              <div class="col-md-3">
                <label class="form-label">Estado</label>
                <select name="estado" class="form-select">
                  <option value="">Todos los estados</option>
                  <option value="nuevo" <?= $filtro_estado === 'nuevo' ? 'selected' : '' ?>>Nuevo</option>
                  <option value="abierto" <?= $filtro_estado === 'abierto' ? 'selected' : '' ?>>Abierto</option>
                  <option value="en_proceso" <?= $filtro_estado === 'en_proceso' ? 'selected' : '' ?>>En Proceso</option>
                  <option value="resuelto" <?= $filtro_estado === 'resuelto' ? 'selected' : '' ?>>Resuelto</option>
                  <option value="cerrado" <?= $filtro_estado === 'cerrado' ? 'selected' : '' ?>>Cerrado</option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label">Prioridad</label>
                <select name="prioridad" class="form-select">
                  <option value="">Todas las prioridades</option>
                  <option value="critica" <?= $filtro_prioridad === 'critica' ? 'selected' : '' ?>>Crítica</option>
                  <option value="alta" <?= $filtro_prioridad === 'alta' ? 'selected' : '' ?>>Alta</option>
                  <option value="media" <?= $filtro_prioridad === 'media' ? 'selected' : '' ?>>Media</option>
                  <option value="baja" <?= $filtro_prioridad === 'baja' ? 'selected' : '' ?>>Baja</option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label">Empresa</label>
                <select name="empresa" class="form-select">
                  <option value="">Todas las empresas</option>
                  <?php foreach ($empresas as $empresa): ?>
                    <option value="<?= htmlspecialchars($empresa) ?>" <?= $filtro_empresa === $empresa ? 'selected' : '' ?>>
                      <?= htmlspecialchars($empresa) ?>
                    </option>
                  <?php endforeach; ?>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label">Búsqueda</label>
                <input type="text" name="buscar" class="form-control" placeholder="Buscar en tickets..." value="<?= htmlspecialchars($buscar) ?>">
              </div>
              <div class="col-12">
                <button type="submit" class="btn btn-primary">
                  <i class="fas fa-search"></i> Filtrar
                </button>
                <a href="lista.php" class="btn btn-secondary">
                  <i class="fas fa-times"></i> Limpiar Filtros
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Información de filtros aplicados -->
    <?php if (!empty($filtros_aplicados)): ?>
      <div class="row mb-3">
        <div class="col-12">
          <div class="alert alert-info">
            <strong>Filtros aplicados:</strong> <?= implode(', ', $filtros_aplicados) ?>
            <span class="badge bg-primary ms-2"><?= $total_tickets ?> resultado(s)</span>
          </div>
        </div>
      </div>
    <?php endif; ?>

    <!-- Tabla de tickets -->
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="fas fa-list"></i> Tickets
              <span class="badge bg-secondary"><?= $total_tickets ?></span>
            </h5>
            <div class="d-flex gap-2">
              <a href="estadisticas.php" class="btn btn-outline-info btn-sm">
                <i class="fas fa-chart-bar"></i> Estadísticas
              </a>
              <a href="reportes.php" class="btn btn-outline-warning btn-sm">
                <i class="fas fa-file-export"></i> Reportes
              </a>
            </div>
          </div>
          <div class="card-body p-0">
            <?php if (empty($tickets)): ?>
              <div class="text-center py-5">
                <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No se encontraron tickets</h5>
                <p class="text-muted">
                  <?= empty($filtros_aplicados) ? 'No hay tickets en el sistema.' : 'No hay tickets que coincidan con los filtros aplicados.' ?>
                </p>
              </div>
            <?php else: ?>
              <div class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Asunto</th>
                      <th>Estado</th>
                      <th>Prioridad</th>
                      <th>Empresa</th>
                      <th>Contacto</th>
                      <th>Creado</th>
                      <th>Tiempo</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <?php foreach ($tickets as $ticket): ?>
                      <tr>
                        <td>
                          <span class="fw-bold text-primary"><?= htmlspecialchars($ticket['ticket_id']) ?></span>
                        </td>
                        <td>
                          <a href="detalle.php?ticket=<?= urlencode($ticket['ticket_id']) ?>" class="text-decoration-none">
                            <?= htmlspecialchars($ticket['asunto']) ?>
                          </a>
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
                        <td><?= htmlspecialchars($ticket['empresa'] ?? '') ?></td>
                        <td>
                          <div>
                            <small class="fw-bold"><?= htmlspecialchars($ticket['contacto_nombre'] ?? '') ?></small><br>
                            <small class="text-muted"><?= htmlspecialchars($ticket['contacto_email'] ?? '') ?></small>
                          </div>
                        </td>
                        <td>
                          <small>
                            <?= date('d/m/Y H:i', strtotime($ticket['fecha_creacion'])) ?>
                          </small>
                        </td>
                        <td>
                          <small class="text-muted">
                            <?php
                            $horas = $ticket['horas_transcurridas'];
                            if ($horas < 24) {
                              echo $horas . 'h';
                            } else {
                              echo floor($horas / 24) . 'd ' . ($horas % 24) . 'h';
                            }
                            ?>
                          </small>
                        </td>
                        <td>
                          <div class="btn-group btn-group-sm">
                            <a href="detalle.php?ticket=<?= urlencode($ticket['ticket_id']) ?>" class="btn btn-outline-primary btn-sm" title="Ver detalle">
                              <i class="fas fa-eye"></i>
                            </a>
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
    <?php if ($total_paginas > 1): ?>
      <div class="row mt-4">
        <div class="col-12">
          <nav aria-label="Paginación de tickets">
            <ul class="pagination justify-content-center">
              <?php if ($pagina > 1): ?>
                <li class="page-item">
                  <a class="page-link" href="?<?= http_build_query(array_merge($_GET, ['pagina' => $pagina - 1])) ?>">
                    <i class="fas fa-chevron-left"></i> Anterior
                  </a>
                </li>
              <?php endif; ?>

              <?php
              $inicio = max(1, $pagina - 2);
              $fin = min($total_paginas, $pagina + 2);

              for ($i = $inicio; $i <= $fin; $i++):
              ?>
                <li class="page-item <?= $i === $pagina ? 'active' : '' ?>">
                  <a class="page-link" href="?<?= http_build_query(array_merge($_GET, ['pagina' => $i])) ?>">
                    <?= $i ?>
                  </a>
                </li>
              <?php endfor; ?>

              <?php if ($pagina < $total_paginas): ?>
                <li class="page-item">
                  <a class="page-link" href="?<?= http_build_query(array_merge($_GET, ['pagina' => $pagina + 1])) ?>">
                    Siguiente <i class="fas fa-chevron-right"></i>
                  </a>
                </li>
              <?php endif; ?>
            </ul>
          </nav>
          <div class="text-center text-muted">
            Página <?= $pagina ?> de <?= $total_paginas ?> (<?= $total_tickets ?> tickets total)
          </div>
        </div>
      </div>
    <?php endif; ?>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="lista.js"></script>
</body>

</html>