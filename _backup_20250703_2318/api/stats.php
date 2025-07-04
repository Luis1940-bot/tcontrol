<?php
header('Content-Type: application/json');
require_once dirname(dirname(dirname(dirname(__DIR__)))) . '/config.php';
require_once dirname(dirname(dirname(dirname(__DIR__)))) . '/ErrorLogger.php';

ErrorLogger::initialize(dirname(dirname(dirname(dirname(__DIR__)))) . '/logs/error.log');

// Configurar headers de seguridad
$nonce = setSecurityHeaders();
startSecureSession();

try {
  // Obtener estadísticas generales
  $stmt_stats = $pdo->prepare("
        SELECT 
            COUNT(*) as total_tickets,
            COUNT(CASE WHEN estado = 'nuevo' THEN 1 END) as nuevos,
            COUNT(CASE WHEN estado = 'abierto' THEN 1 END) as abiertos,
            COUNT(CASE WHEN estado = 'en_proceso' THEN 1 END) as en_proceso,
            COUNT(CASE WHEN estado = 'resuelto' THEN 1 END) as resueltos,
            COUNT(CASE WHEN estado = 'cerrado' THEN 1 END) as cerrados,
            COUNT(CASE WHEN prioridad = 'critica' THEN 1 END) as criticos,
            COUNT(CASE WHEN prioridad = 'alta' THEN 1 END) as alta_prioridad,
            COUNT(CASE WHEN prioridad = 'media' THEN 1 END) as media_prioridad,
            COUNT(CASE WHEN prioridad = 'baja' THEN 1 END) as baja_prioridad,
            COUNT(CASE WHEN fecha_creacion >= DATE_SUB(NOW(), INTERVAL 24 HOUR) THEN 1 END) as ultimas_24h,
            COUNT(CASE WHEN fecha_creacion >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as ultima_semana,
            COUNT(CASE WHEN fecha_creacion >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as ultimo_mes
        FROM soporte_tickets
    ");
  $stmt_stats->execute();
  $stats = $stmt_stats->fetch(PDO::FETCH_ASSOC);

  // Estadísticas por tipo de solicitud
  $stmt_tipos = $pdo->prepare("
        SELECT 
            tipo_solicitud,
            COUNT(*) as total,
            COUNT(CASE WHEN estado IN ('nuevo', 'abierto', 'en_proceso') THEN 1 END) as pendientes
        FROM soporte_tickets 
        GROUP BY tipo_solicitud 
        ORDER BY total DESC
    ");
  $stmt_tipos->execute();
  $tipos_solicitud = $stmt_tipos->fetchAll(PDO::FETCH_ASSOC);

  // Tiempo promedio de resolución
  $stmt_tiempos = $pdo->prepare("
        SELECT 
            AVG(TIMESTAMPDIFF(HOUR, fecha_creacion, fecha_resolucion)) as tiempo_promedio_resolucion,
            MIN(TIMESTAMPDIFF(HOUR, fecha_creacion, fecha_resolucion)) as tiempo_min_resolucion,
            MAX(TIMESTAMPDIFF(HOUR, fecha_creacion, fecha_resolucion)) as tiempo_max_resolucion,
            COUNT(*) as tickets_resueltos
        FROM soporte_tickets 
        WHERE fecha_resolucion IS NOT NULL
    ");
  $stmt_tiempos->execute();
  $tiempos = $stmt_tiempos->fetch(PDO::FETCH_ASSOC);

  // Tickets por día (últimos 7 días)
  $stmt_diarios = $pdo->prepare("
        SELECT 
            DATE(fecha_creacion) as fecha,
            COUNT(*) as total,
            COUNT(CASE WHEN prioridad IN ('critica', 'alta') THEN 1 END) as urgentes
        FROM soporte_tickets 
        WHERE fecha_creacion >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY DATE(fecha_creacion)
        ORDER BY fecha DESC
    ");
  $stmt_diarios->execute();
  $tickets_diarios = $stmt_diarios->fetchAll(PDO::FETCH_ASSOC);

  // SLA y métricas de rendimiento
  $stmt_sla = $pdo->prepare("
        SELECT 
            t.prioridad,
            COUNT(*) as total_tickets,
            AVG(CASE 
                WHEN t.fecha_resolucion IS NOT NULL 
                THEN TIMESTAMPDIFF(HOUR, t.fecha_creacion, t.fecha_resolucion)
                ELSE TIMESTAMPDIFF(HOUR, t.fecha_creacion, NOW())
            END) as tiempo_promedio,
            COUNT(CASE WHEN t.fecha_resolucion IS NOT NULL THEN 1 END) as resueltos,
            COUNT(CASE 
                WHEN t.fecha_resolucion IS NOT NULL 
                AND TIMESTAMPDIFF(HOUR, t.fecha_creacion, t.fecha_resolucion) <= sla.tiempo_resolucion_horas
                THEN 1 
            END) as cumple_sla
        FROM soporte_tickets t
        LEFT JOIN soporte_sla_config sla ON t.prioridad = sla.prioridad
        GROUP BY t.prioridad
        ORDER BY 
            CASE t.prioridad
                WHEN 'critica' THEN 1
                WHEN 'alta' THEN 2  
                WHEN 'media' THEN 3
                WHEN 'baja' THEN 4
            END
    ");
  $stmt_sla->execute();
  $sla_stats = $stmt_sla->fetchAll(PDO::FETCH_ASSOC);

  // Actividad reciente (últimas respuestas)
  $stmt_actividad = $pdo->prepare("
        SELECT 
            r.ticket_id,
            r.tipo_respuesta,
            r.autor_nombre,
            r.fecha_respuesta,
            t.asunto,
            t.empresa
        FROM soporte_respuestas r
        JOIN soporte_tickets t ON r.ticket_id = t.ticket_id
        WHERE r.fecha_respuesta >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
        ORDER BY r.fecha_respuesta DESC
        LIMIT 10
    ");
  $stmt_actividad->execute();
  $actividad_reciente = $stmt_actividad->fetchAll(PDO::FETCH_ASSOC);

  // Tickets sin respuesta hace más de X horas
  $stmt_sin_respuesta = $pdo->prepare("
        SELECT 
            t.ticket_id,
            t.asunto,
            t.empresa,
            t.prioridad,
            t.fecha_creacion,
            TIMESTAMPDIFF(HOUR, t.fecha_creacion, NOW()) as horas_sin_respuesta
        FROM soporte_tickets t
        LEFT JOIN soporte_respuestas r ON t.ticket_id = r.ticket_id AND r.tipo_respuesta = 'soporte'
        WHERE t.estado IN ('nuevo', 'abierto')
        AND r.id IS NULL
        AND TIMESTAMPDIFF(HOUR, t.fecha_creacion, NOW()) > 
            CASE t.prioridad
                WHEN 'critica' THEN 1
                WHEN 'alta' THEN 4
                WHEN 'media' THEN 8
                ELSE 24
            END
        ORDER BY horas_sin_respuesta DESC
        LIMIT 5
    ");
  $stmt_sin_respuesta->execute();
  $tickets_sin_respuesta = $stmt_sin_respuesta->fetchAll(PDO::FETCH_ASSOC);

  // Preparar respuesta
  $response = [
    'success' => true,
    'timestamp' => date('Y-m-d H:i:s'),
    'data' => [
      'estadisticas_generales' => $stats,
      'tipos_solicitud' => $tipos_solicitud,
      'tiempos_resolucion' => $tiempos,
      'tickets_diarios' => $tickets_diarios,
      'sla_performance' => $sla_stats,
      'actividad_reciente' => $actividad_reciente,
      'tickets_sin_respuesta' => $tickets_sin_respuesta,
      'alertas' => []
    ]
  ];

  // Generar alertas automáticas
  $alertas = [];

  // Alerta por tickets críticos sin respuesta
  $criticos_sin_respuesta = array_filter($tickets_sin_respuesta, function ($ticket) {
    return $ticket['prioridad'] === 'critica';
  });
  if (!empty($criticos_sin_respuesta)) {
    $alertas[] = [
      'tipo' => 'critico',
      'mensaje' => count($criticos_sin_respuesta) . ' ticket(s) crítico(s) sin respuesta',
      'icono' => 'exclamation-triangle',
      'color' => 'danger'
    ];
  }

  // Alerta por volumen alto en las últimas 24h
  if ($stats['ultimas_24h'] > 20) {
    $alertas[] = [
      'tipo' => 'volumen',
      'mensaje' => 'Alto volumen de tickets: ' . $stats['ultimas_24h'] . ' en 24h',
      'icono' => 'chart-line',
      'color' => 'warning'
    ];
  }

  // Alerta por tickets pendientes acumulados
  $pendientes_total = $stats['nuevos'] + $stats['abiertos'] + $stats['en_proceso'];
  if ($pendientes_total > 50) {
    $alertas[] = [
      'tipo' => 'acumulacion',
      'mensaje' => 'Acumulación de tickets pendientes: ' . $pendientes_total,
      'icono' => 'layer-group',
      'color' => 'info'
    ];
  }

  $response['data']['alertas'] = $alertas;

  echo json_encode($response);
} catch (Exception $e) {
  ErrorLogger::log("❌ Error obteniendo estadísticas: " . $e->getMessage());

  http_response_code(500);
  echo json_encode([
    'success' => false,
    'message' => 'Error al obtener estadísticas',
    'error' => $e->getMessage()
  ]);
}
