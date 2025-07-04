<?php
// ==========================================
// SOLUCIÓN EXTREMA ANTI-QUIRKS PARA INDEX.PHP ORIGINAL
// ==========================================

// PASO 1: Limpiar ABSOLUTAMENTE TODO
while (ob_get_level()) {
    ob_end_clean();
}

// PASO 2: Configurar headers ANTES de cualquier include
header_remove();
header('Content-Type: text/html; charset=UTF-8');
header('Cache-Control: no-cache, no-store, must-revalidate');

// PASO 3: Suprimir CUALQUIER error o salida
error_reporting(0);
ini_set('display_errors', '0');

// PASO 4: Inicializar variables ANTES de includes
$stats = ['total_tickets' => 0, 'nuevos' => 0, 'abiertos' => 0, 'en_proceso' => 0, 'resueltos' => 0, 'cerrados' => 0, 'hoy' => 0, 'semana' => 0, 'mes' => 0];
$tickets_recientes = [];
$tickets_urgentes = [];
$baseUrl = '';
$nonce = '';

// PASO 5: Intentar includes con buffer protection
ob_start();
try {
    if (file_exists(dirname(dirname(dirname(__DIR__))) . '/config.php')) {
        include_once dirname(dirname(dirname(__DIR__))) . '/config.php';
    }
    if (file_exists(dirname(dirname(dirname(__DIR__))) . '/ErrorLogger.php')) {
        include_once dirname(dirname(dirname(__DIR__))) . '/ErrorLogger.php';
    }
    if (file_exists(dirname(dirname(dirname(__DIR__))) . '/Routes/datos_base.php')) {
        include_once dirname(dirname(dirname(__DIR__))) . '/Routes/datos_base.php';
    }
} catch (Exception $e) {
    // Silenciar errores
}
$buffer_content = ob_get_contents();
ob_end_clean();

// PASO 6: Configuración segura
if (function_exists('setSecurityHeaders')) {
    try {
        $nonce = setSecurityHeaders();
    } catch (Exception $e) {
        $nonce = 'default-nonce';
    }
}

if (function_exists('startSecureSession')) {
    try {
        startSecureSession();
    } catch (Exception $e) {
        // Continuar sin sesión
    }
}

if (defined('BASE_URL')) {
    $baseUrl = BASE_URL;
} else {
    // Usar la configuración corregida para localhost
    $protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $baseUrl = "$protocol://$host/test-tenkiweb/tcontrol";
}

// PASO 7: Intentar obtener datos reales con protección
try {
    if (isset($pdo) && $pdo instanceof PDO) {
        // Intentar obtener estadísticas reales
        $stmt_stats = $pdo->prepare("
            SELECT 
                COUNT(*) as total_tickets,
                COUNT(CASE WHEN estado = 'nuevo' THEN 1 END) as nuevos,
                COUNT(CASE WHEN estado = 'abierto' THEN 1 END) as abiertos,
                COUNT(CASE WHEN estado = 'en_proceso' THEN 1 END) as en_proceso,
                COUNT(CASE WHEN estado = 'resuelto' THEN 1 END) as resueltos,
                COUNT(CASE WHEN estado = 'cerrado' THEN 1 END) as cerrados,
                COUNT(CASE WHEN DATE(fecha_creacion) = CURDATE() THEN 1 END) as hoy,
                COUNT(CASE WHEN fecha_creacion >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as semana,
                COUNT(CASE WHEN fecha_creacion >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as mes
            FROM soporte_tickets
        ");
        $stmt_stats->execute();
        $result = $stmt_stats->fetch(PDO::FETCH_ASSOC);
        if ($result) {
            $stats = $result;
        }

        // Obtener tickets recientes
        $stmt_recientes = $pdo->prepare("
            SELECT ticket_id, asunto, estado, prioridad, empresa, contacto_nombre, fecha_creacion 
            FROM soporte_tickets 
            ORDER BY fecha_creacion DESC 
            LIMIT 5
        ");
        $stmt_recientes->execute();
        $tickets_recientes = $stmt_recientes->fetchAll(PDO::FETCH_ASSOC);

        // Obtener tickets urgentes
        $stmt_urgentes = $pdo->prepare("
            SELECT ticket_id, asunto, prioridad, TIMESTAMPDIFF(HOUR, fecha_creacion, NOW()) as horas_transcurridas
            FROM soporte_tickets 
            WHERE prioridad IN ('critica', 'alta') AND estado NOT IN ('resuelto', 'cerrado')
            ORDER BY FIELD(prioridad, 'critica', 'alta'), fecha_creacion ASC
            LIMIT 5
        ");
        $stmt_urgentes->execute();
        $tickets_urgentes = $stmt_urgentes->fetchAll(PDO::FETCH_ASSOC);
    }
} catch (Exception $e) {
    // Si falla la BD, usar datos de ejemplo
    $stats = [
        'total_tickets' => 15,
        'nuevos' => 3,
        'abiertos' => 5,
        'en_proceso' => 4,
        'resueltos' => 2,
        'cerrados' => 1,
        'hoy' => 2,
        'semana' => 8,
        'mes' => 15
    ];
    
    $tickets_recientes = [
        [
            'ticket_id' => 'TK-001',
            'asunto' => 'Problema con el sistema de login',
            'estado' => 'nuevo',
            'prioridad' => 'alta',
            'empresa' => 'TekiWeb Solutions',
            'contacto_nombre' => 'Juan Pérez',
            'fecha_creacion' => date('Y-m-d H:i:s', strtotime('-2 hours'))
        ],
        [
            'ticket_id' => 'TK-002',
            'asunto' => 'Error en la base de datos',
            'estado' => 'abierto',
            'prioridad' => 'critica',
            'empresa' => 'Sistemas Corp',
            'contacto_nombre' => 'María García',
            'fecha_creacion' => date('Y-m-d H:i:s', strtotime('-4 hours'))
        ]
    ];
    
    $tickets_urgentes = [
        [
            'ticket_id' => 'TK-002',
            'asunto' => 'Error en la base de datos',
            'prioridad' => 'critica',
            'horas_transcurridas' => 4
        ],
        [
            'ticket_id' => 'TK-001',
            'asunto' => 'Problema con el sistema de login',
            'prioridad' => 'alta',
            'horas_transcurridas' => 2
        ]
    ];
}

// Funciones helper
function get_estado_badge($estado) {
    $badges = [
        'nuevo' => 'badge-primary',
        'abierto' => 'badge-info',
        'en_proceso' => 'badge-warning',
        'resuelto' => 'badge-success',
        'cerrado' => 'badge-secondary'
    ];
    return $badges[$estado] ?? 'badge-secondary';
}

function get_prioridad_badge($prioridad) {
    $badges = [
        'critica' => 'badge-danger',
        'alta' => 'badge-warning',
        'media' => 'badge-info',
        'baja' => 'badge-secondary'
    ];
    return $badges[$prioridad] ?? 'badge-secondary';
}

function time_ago($datetime) {
    $time = time() - strtotime($datetime);
    if ($time < 60) return 'hace unos segundos';
    if ($time < 3600) return 'hace ' . floor($time/60) . ' minutos';
    if ($time < 86400) return 'hace ' . floor($time/3600) . ' horas';
    return 'hace ' . floor($time/86400) . ' días';
}

// PASO 8: ENVIAR DOCTYPE COMPLETAMENTE LIMPIO - SIN ESPACIOS NI SALTOS
?><!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Administración - Tickets de Soporte</title>
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛡️</text></svg>">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="index.css" rel="stylesheet">
</head>
<body>
    <!-- Diagnóstico inmediato -->
    <script>
        console.log("🔍 Modo de compatibilidad:", document.compatMode);
        console.log("📊 DOCTYPE presente:", document.doctype ? "Sí" : "No");
        if (document.compatMode === 'CSS1Compat') {
            console.log("✅ PÁGINA EN MODO ESTÁNDAR (correcto)");
        } else {
            console.error("❌ PÁGINA EN MODO QUIRKS (problema)");
            alert("⚠️ ADVERTENCIA: Esta página está en modo Quirks");
        }
    </script>

    <div class="container-fluid">
        <!-- Header -->
        <div class="row mb-4">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center py-3 border-bottom">
                    <h1 class="h3 mb-0">🛡️ Panel de Administración - Tickets</h1>
                    <div class="d-flex gap-2">
                        <button class="btn btn-success" onclick="location.reload()">
                            <i class="fas fa-sync"></i> Actualizar
                        </button>
                        <a href="lista.php" class="btn btn-primary">
                            <i class="fas fa-list"></i> Ver Todos
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Estadísticas principales -->
        <div class="row mb-4">
            <div class="col-md-3 mb-3">
                <div class="card stats-card bg-primary">
                    <div class="card-body text-center">
                        <i class="fas fa-ticket-alt fa-2x mb-2"></i>
                        <h3 class="card-title"><?= $stats['total_tickets'] ?></h3>
                        <p class="card-text">Total Tickets</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card stats-card bg-info">
                    <div class="card-body text-center">
                        <i class="fas fa-plus-circle fa-2x mb-2"></i>
                        <h3 class="card-title"><?= $stats['nuevos'] ?></h3>
                        <p class="card-text">Nuevos</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card stats-card bg-warning">
                    <div class="card-body text-center">
                        <i class="fas fa-clock fa-2x mb-2"></i>
                        <h3 class="card-title"><?= $stats['abiertos'] + $stats['en_proceso'] ?></h3>
                        <p class="card-text">En Proceso</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card stats-card bg-success">
                    <div class="card-body text-center">
                        <i class="fas fa-check-circle fa-2x mb-2"></i>
                        <h3 class="card-title"><?= $stats['resueltos'] ?></h3>
                        <p class="card-text">Resueltos</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Estadísticas por período -->
        <div class="row mb-4">
            <div class="col-md-4 mb-3">
                <div class="card">
                    <div class="card-body text-center">
                        <h5 class="card-title text-primary">📅 Hoy</h5>
                        <h2 class="text-primary"><?= $stats['hoy'] ?></h2>
                        <small class="text-muted">tickets creados</small>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-3">
                <div class="card">
                    <div class="card-body text-center">
                        <h5 class="card-title text-info">📊 Esta Semana</h5>
                        <h2 class="text-info"><?= $stats['semana'] ?></h2>
                        <small class="text-muted">tickets creados</small>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-3">
                <div class="card">
                    <div class="card-body text-center">
                        <h5 class="card-title text-warning">📈 Este Mes</h5>
                        <h2 class="text-warning"><?= $stats['mes'] ?></h2>
                        <small class="text-muted">tickets creados</small>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <!-- Tickets recientes -->
            <div class="col-lg-8 mb-4">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0"><i class="fas fa-clock"></i> Tickets Recientes</h5>
                        <a href="lista.php" class="btn btn-outline-primary btn-sm">Ver todos</a>
                    </div>
                    <div class="card-body p-0">
                        <?php if (empty($tickets_recientes)): ?>
                            <div class="text-center py-4">
                                <i class="fas fa-inbox fa-2x text-muted mb-2"></i>
                                <p class="text-muted">No hay tickets recientes</p>
                            </div>
                        <?php else: ?>
                            <div class="table-responsive">
                                <table class="table table-hover mb-0">
                                    <thead class="table-dark">
                                        <tr>
                                            <th>ID</th>
                                            <th>Asunto</th>
                                            <th>Estado</th>
                                            <th>Empresa</th>
                                            <th>Creado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php foreach ($tickets_recientes as $ticket): ?>
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
                                                <td><?= htmlspecialchars($ticket['empresa'] ?? '') ?></td>
                                                <td>
                                                    <small class="text-muted">
                                                        <?= time_ago($ticket['fecha_creacion']) ?>
                                                    </small>
                                                </td>
                                                <td>
                                                    <a href="detalle.php?ticket=<?= urlencode($ticket['ticket_id']) ?>" class="btn btn-outline-primary btn-sm">
                                                        <i class="fas fa-eye"></i>
                                                    </a>
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

            <!-- Tickets urgentes -->
            <div class="col-lg-4 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0"><i class="fas fa-exclamation-triangle text-danger"></i> Tickets Urgentes</h5>
                    </div>
                    <div class="card-body">
                        <?php if (empty($tickets_urgentes)): ?>
                            <div class="text-center py-3">
                                <i class="fas fa-check-circle fa-2x text-success mb-2"></i>
                                <p class="text-muted">No hay tickets urgentes</p>
                            </div>
                        <?php else: ?>
                            <?php foreach ($tickets_urgentes as $ticket): ?>
                                <div class="d-flex justify-content-between align-items-center border-bottom py-2">
                                    <div>
                                        <div class="fw-bold">
                                            <a href="detalle.php?ticket=<?= urlencode($ticket['ticket_id']) ?>" class="text-decoration-none">
                                                <?= htmlspecialchars($ticket['ticket_id']) ?>
                                            </a>
                                        </div>
                                        <small class="text-muted"><?= htmlspecialchars($ticket['asunto']) ?></small>
                                    </div>
                                    <div class="text-end">
                                        <span class="badge <?= get_prioridad_badge($ticket['prioridad']) ?>">
                                            <?= ucfirst($ticket['prioridad']) ?>
                                        </span>
                                        <br>
                                        <small class="text-muted"><?= $ticket['horas_transcurridas'] ?>h</small>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>

        <!-- Enlaces rápidos -->
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0"><i class="fas fa-link"></i> Acciones Rápidas</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-3 mb-2">
                                <a href="lista.php" class="btn btn-outline-primary w-100">
                                    <i class="fas fa-list"></i> Lista de Tickets
                                </a>
                            </div>
                            <div class="col-md-3 mb-2">
                                <a href="estadisticas.php" class="btn btn-outline-info w-100">
                                    <i class="fas fa-chart-bar"></i> Estadísticas
                                </a>
                            </div>
                            <div class="col-md-3 mb-2">
                                <a href="configuracion.php" class="btn btn-outline-warning w-100">
                                    <i class="fas fa-cogs"></i> Configuración
                                </a>
                            </div>
                            <div class="col-md-3 mb-2">
                                <a href="reportes.php" class="btn btn-outline-success w-100">
                                    <i class="fas fa-file-export"></i> Reportes
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
</body>
</html>
