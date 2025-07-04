<?php
// Verificación final del funcionamiento de lista.php

echo "=== VERIFICACIÓN FINAL ===\n\n";

// Simular las variables que usa lista.php
$filtro_estado = '';
$filtro_prioridad = '';
$filtro_empresa = '';
$buscar = '';
$pagina = 1;
$por_pagina = 20;
$offset = 0;

$tickets = [];
$total_tickets = 0;
$datos_reales_obtenidos = false;

// Incluir configuración
include dirname(dirname(dirname(__DIR__))) . '/Routes/datos_base.php';

try {
  if (isset($host, $user, $password, $dbname, $port)) {
    $dsn = "mysql:host={$host};dbname={$dbname};port={$port};charset=utf8mb4";
    $options = [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
      PDO::ATTR_EMULATE_PREPARES => false,
      PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
    ];

    $pdo = new PDO($dsn, $user, $password, $options);

    // Consulta exacta como en lista.php
    $where_conditions = ["1=1"];
    $params = [];
    $where_clause = implode(" AND ", $where_conditions);

    // Contar total
    $stmt_count = $pdo->prepare("SELECT COUNT(*) as total FROM soporte_tickets WHERE {$where_clause}");
    $stmt_count->execute($params);
    $total_tickets = $stmt_count->fetch()['total'];

    // Obtener tickets
    $stmt_tickets = $pdo->prepare("
        SELECT 
            ticket_id,
            asunto,
            estado,
            prioridad,
            empresa,
            nombre_contacto,
            email_contacto,
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

    $datos_reales_obtenidos = true;

    echo "✅ CONEXIÓN A BD: EXITOSA\n";
    echo "✅ CONSULTA SQL: EJECUTADA SIN ERRORES\n";
    echo "✅ TOTAL TICKETS EN BD: " . $total_tickets . "\n";
    echo "✅ TICKETS OBTENIDOS EN PÁGINA: " . count($tickets) . "\n";
    echo "✅ DATOS REALES: " . ($datos_reales_obtenidos ? 'SÍ' : 'NO') . "\n\n";

    if (count($tickets) > 0) {
      echo "--- PRIMER TICKET DE EJEMPLO ---\n";
      $primer_ticket = $tickets[0];
      echo "ID: " . $primer_ticket['ticket_id'] . "\n";
      echo "Asunto: " . $primer_ticket['asunto'] . "\n";
      echo "Estado: " . $primer_ticket['estado'] . "\n";
      echo "Contacto: " . $primer_ticket['nombre_contacto'] . "\n";
      echo "Email: " . $primer_ticket['email_contacto'] . "\n";
      echo "Empresa: " . $primer_ticket['empresa'] . "\n";
    }
  } else {
    echo "❌ CONFIGURACIÓN DE BD: FALTA ALGÚN PARÁMETRO\n";
  }
} catch (Exception $e) {
  echo "❌ ERROR: " . $e->getMessage() . "\n";
}

echo "\n=== FIN VERIFICACIÓN ===\n";
