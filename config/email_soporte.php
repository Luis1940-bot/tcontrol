<?php

/**
 * Configuración de emails para el sistema de soporte
 * Configuración TenkiWeb actualizada
 */

// Emails del equipo de soporte (BCC)
define('EMAILS_SOPORTE_BCC', [
  'luisglogista@gmail.com',
  'vivichimenti@gmail.com'
]);

// Configuración SMTP TenkiWeb
define('SMTP_CONFIG', [
  'host' => 'mail.tenkiweb.com',
  'port' => 465,
  'username' => 'soporte@test.tenkiweb.com',
  'password' => '$y1bh+u1wc*1',
  'encryption' => 'ssl', // SSL para puerto 465
  'from_email' => 'soporte@test.tenkiweb.com',
  'from_name' => 'TenkiWeb Soporte'
]);

// Configuración IMAP (para lectura de emails si es necesario en el futuro)
define('IMAP_CONFIG', [
  'host' => 'mail.tenkiweb.com',
  'port' => 993,
  'username' => 'soporte@test.tenkiweb.com',
  'password' => '$y1bh+u1wc*1',
  'encryption' => 'ssl'
]);

// Plantillas de email
define('EMAIL_TEMPLATES', [
  'nuevo_ticket_asunto' => 'Nuevo Ticket #{ticket_id} - Prioridad: {prioridad}',
  'confirmacion_cliente_asunto' => 'Confirmación de Ticket #{ticket_id} - TenkiWeb Soporte'
]);

// Configuración de prioridades para emails
define('PRIORIDAD_EMAILS', [
  'critica' => [
    'prefijo' => '🚨 CRÍTICO',
    'envio_inmediato' => true
  ],
  'alta' => [
    'prefijo' => '🔥 ALTA',
    'envio_inmediato' => true
  ],
  'media' => [
    'prefijo' => '⚡ MEDIA',
    'envio_inmediato' => false
  ],
  'baja' => [
    'prefijo' => '📋 BAJA',
    'envio_inmediato' => false
  ]
]);
