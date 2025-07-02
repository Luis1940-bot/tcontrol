<?php

/**
 * Script para crear un ticket de prueba con el email del usuario actual
 */
require_once '../config.php';
require_once '../ErrorLogger.php';

startSecureSession();
ErrorLogger::initialize('../logs/error.log');

$user_email = $_SESSION['login_sso']['email'] ?? null;

if (!$user_email) {
  echo "Error: No hay usuario logueado";
  exit;
}

echo "<h1>🧪 Crear Ticket de Prueba</h1>";
echo "<p><strong>Email del usuario:</strong> {$user_email}</p>";

try {
  require_once '../Nodemailer/Routes/SoporteTicket.php';
  $soporteTicket = new SoporteTicket();

  // Datos del ticket de prueba
  $datos_prueba = [
    'empresa' => 'Empresa Test - ' . date('Y-m-d H:i:s'),
    'nombre_contacto' => 'Usuario Prueba',
    'email_contacto' => $user_email, // Usar el email del usuario logueado
    'telefono' => '555-1234',
    'tipo_solicitud' => 'reporte_error',
    'prioridad' => 'media',
    'asunto' => 'Ticket de prueba para historial - ' . date('H:i:s'),
    'descripcion' => 'Este es un ticket de prueba creado para verificar el historial por email.',
    'pasos_reproducir' => '1. Crear ticket\n2. Verificar en historial por email'
  ];

  echo "<h2>Creando ticket con datos:</h2>";
  echo "<ul>";
  foreach ($datos_prueba as $campo => $valor) {
    echo "<li><strong>{$campo}:</strong> {$valor}</li>";
  }
  echo "</ul>";

  // Crear ticket
  $resultado = $soporteTicket->crearTicket($datos_prueba, null, 1);

  if ($resultado['success']) {
    echo "<div style='background: #d4edda; color: #155724; padding: 1rem; border-radius: 4px; margin: 1rem 0;'>";
    echo "<h3>✅ Ticket creado exitosamente!</h3>";
    echo "<p><strong>Ticket ID:</strong> {$resultado['ticket_id']}</p>";
    echo "</div>";

    // Verificar que se puede encontrar por email
    echo "<h2>Verificando búsqueda por email:</h2>";
    $tickets_encontrados = $soporteTicket->obtenerTicketsPorEmail($user_email, 5);
    echo "<p>Tickets encontrados para {$user_email}: " . count($tickets_encontrados) . "</p>";

    if (!empty($tickets_encontrados)) {
      echo "<table border='1' style='border-collapse: collapse; width: 100%; margin: 1rem 0;'>";
      echo "<tr style='background: #f8f9fa;'>";
      echo "<th>Ticket ID</th><th>Empresa</th><th>Asunto</th><th>Estado</th><th>Fecha</th>";
      echo "</tr>";

      foreach ($tickets_encontrados as $ticket) {
        echo "<tr>";
        echo "<td>{$ticket['ticket_id']}</td>";
        echo "<td>{$ticket['empresa']}</td>";
        echo "<td>{$ticket['asunto']}</td>";
        echo "<td>{$ticket['estado']}</td>";
        echo "<td>{$ticket['fecha_creacion']}</td>";
        echo "</tr>";
      }
      echo "</table>";
    }
  } else {
    echo "<div style='background: #f8d7da; color: #721c24; padding: 1rem; border-radius: 4px; margin: 1rem 0;'>";
    echo "<h3>❌ Error creando ticket</h3>";
    echo "<p>{$resultado['message']}</p>";
    echo "</div>";
  }
} catch (Exception $e) {
  echo "<div style='background: #f8d7da; color: #721c24; padding: 1rem; border-radius: 4px; margin: 1rem 0;'>";
  echo "<h3>❌ Error:</h3>";
  echo "<p>" . $e->getMessage() . "</p>";
  echo "</div>";
}

echo "<hr>";
echo "<p><a href='./Pages/Soporte/historial_simple.php'>🔗 Ver Historial Simple</a></p>";
echo "<p><a href='./Pages/Soporte/'>🔗 Formulario de Soporte</a></p>";
echo "<p><a href='./Pages/Home/'>🔗 Volver al Home</a></p>";
