<?php
// CSP Violation Reporter
// Este archivo recibe reportes de violaciones CSP para monitoreo

// Solo procesar en producción y con método POST
if (isLocalhost() || $_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(404);
  exit;
}

try {
  // Leer el reporte JSON
  $input = file_get_contents('php://input');
  $report = json_decode($input, true);

  if ($report && isset($report['csp-report'])) {
    $violation = $report['csp-report'];

    // Log de la violación (opcional)
    $logEntry = [
      'timestamp' => date('Y-m-d H:i:s'),
      'document-uri' => $violation['document-uri'] ?? '',
      'violated-directive' => $violation['violated-directive'] ?? '',
      'blocked-uri' => $violation['blocked-uri'] ?? '',
      'source-file' => $violation['source-file'] ?? '',
      'line-number' => $violation['line-number'] ?? '',
    ];

    // Guardar en log (descomenta si quieres logging)
    // error_log('CSP Violation: ' . json_encode($logEntry));
  }

  // Respuesta exitosa
  http_response_code(204); // No Content

} catch (Exception $e) {
  http_response_code(400);
}
