<?php

/**
 * Script simple para probar la creación de un ticket y verificar el historial
 */
require_once '../config.php';
require_once '../ErrorLogger.php';

// Inicializar logging
ErrorLogger::initialize('../logs/error.log');

// Simular sesión de usuario
session_start();
$_SESSION['user_id'] = 1; // Usuario de prueba
$_SESSION['nombre'] = 'Usuario de Prueba';

echo "<h1>🧪 Prueba Rápida del Sistema de Soporte</h1>";

try {
  require_once '../Nodemailer/Routes/SoporteTicket.php';
  $soporteTicket = new SoporteTicket();

  echo "<p>✅ Clase SoporteTicket cargada correctamente</p>";

  // Datos del ticket de prueba
  $datos_prueba = [
    'empresa' => 'Empresa Test',
    'nombre_contacto' => 'Usuario Prueba',
    'email_contacto' => 'test@example.com',
    'telefono' => '555-1234',
    'tipo_solicitud' => 'reporte_error',
    'prioridad' => 'media',
    'asunto' => 'Prueba del sistema de tickets',
    'descripcion' => 'Este es un ticket de prueba para verificar el funcionamiento del historial.',
    'pasos_reproducir' => '1. Crear ticket\n2. Verificar en historial'
  ];

  // Crear ticket
  $resultado = $soporteTicket->crearTicket($datos_prueba, null, $_SESSION['user_id']);

  if ($resultado['success']) {
    echo "<p>✅ Ticket creado exitosamente: <strong>{$resultado['ticket_id']}</strong></p>";

    // Obtener tickets del usuario
    $tickets = $soporteTicket->obtenerTicketsUsuario($_SESSION['user_id'], 5);
    echo "<p>📊 Tickets encontrados: " . count($tickets) . "</p>";

    if (!empty($tickets)) {
      echo "<h3>Tickets del usuario:</h3>";
      echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
      echo "<tr style='background: #f0f0f0;'>";
      echo "<th>Ticket ID</th><th>Empresa</th><th>Asunto</th><th>Estado</th><th>Prioridad</th><th>Fecha</th>";
      echo "</tr>";

      foreach ($tickets as $ticket) {
        echo "<tr>";
        echo "<td>{$ticket['ticket_id']}</td>";
        echo "<td>{$ticket['empresa']}</td>";
        echo "<td>{$ticket['asunto']}</td>";
        echo "<td>{$ticket['estado']}</td>";
        echo "<td>{$ticket['prioridad']}</td>";
        echo "<td>{$ticket['fecha_creacion']}</td>";
        echo "</tr>";
      }
      echo "</table>";
    }
  } else {
    echo "<p>❌ Error creando ticket: {$resultado['message']}</p>";
  }

  echo "<hr>";
  echo "<p><a href='./Pages/Soporte/historial.php' target='_blank'>🔗 Ver Historial Completo</a></p>";
  echo "<p><a href='./Pages/Soporte/index.php' target='_blank'>🔗 Crear Nuevo Ticket</a></p>";
} catch (Exception $e) {
  echo "<p>❌ Error: " . $e->getMessage() . "</p>";
  echo "<p>Detalles del error en el log de errores.</p>";
}

echo "<p><small>Prueba ejecutada: " . date('Y-m-d H:i:s') . "</small></p>";
