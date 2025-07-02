-- Sistema de Tickets de Soporte TenkiWeb
-- Estructura de base de datos para tickets profesionales

-- Tabla principal de tickets
CREATE TABLE IF NOT EXISTS `soporte_tickets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ticket_id` varchar(20) NOT NULL UNIQUE,
  `user_id` int(11) DEFAULT NULL,
  `tipo_cliente` enum('cliente_existente','cliente_potencial','consulta_general') DEFAULT NULL,
  `planta_cliente` varchar(50) DEFAULT NULL,
  `como_conocio` enum('referencia','web','redes_sociales','evento','otro') DEFAULT NULL,
  `empresa` varchar(100) NOT NULL,
  `nombre_contacto` varchar(100) NOT NULL,
  `email_contacto` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `tipo_solicitud` enum('incidente_tecnico','reporte_error','solicitud_cambio','consulta_funcionalidad','solicitud_capacitacion','otros') NOT NULL,
  `prioridad` enum('critica','alta','media','baja') NOT NULL DEFAULT 'media',
  `asunto` varchar(200) NOT NULL,
  `descripcion` text NOT NULL,
  `pasos_reproducir` text DEFAULT NULL,
  `archivo_adjunto` varchar(255) DEFAULT NULL,
  `modulo_pagina` varchar(100) DEFAULT NULL,
  `estado` enum('nuevo','abierto','en_proceso','resuelto','cerrado') NOT NULL DEFAULT 'nuevo',
  `fecha_creacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `fecha_resolucion` timestamp NULL DEFAULT NULL,
  `tiempo_respuesta_horas` int(11) DEFAULT NULL,
  `satisfaccion_cliente` enum('muy_satisfecho','satisfecho','neutral','insatisfecho','muy_insatisfecho') DEFAULT NULL,
  `comentarios_internos` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ticket_id` (`ticket_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_estado` (`estado`),
  KEY `idx_prioridad` (`prioridad`),
  KEY `idx_fecha_creacion` (`fecha_creacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para respuestas y seguimiento
CREATE TABLE `soporte_respuestas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ticket_id` varchar(20) NOT NULL,
  `tipo_respuesta` enum('cliente','soporte','sistema') NOT NULL,
  `autor_nombre` varchar(100) NOT NULL,
  `autor_email` varchar(100) NOT NULL,
  `mensaje` text NOT NULL,
  `archivos_adjuntos` text DEFAULT NULL,
  `es_privada` boolean DEFAULT FALSE,
  `fecha_respuesta` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ticket_id` (`ticket_id`),
  KEY `idx_fecha_respuesta` (`fecha_respuesta`),
  FOREIGN KEY (`ticket_id`) REFERENCES `soporte_tickets`(`ticket_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para archivos adjuntos
CREATE TABLE `soporte_archivos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ticket_id` varchar(20) NOT NULL,
  `respuesta_id` int(11) DEFAULT NULL,
  `nombre_original` varchar(255) NOT NULL,
  `nombre_archivo` varchar(255) NOT NULL,
  `ruta_archivo` varchar(500) NOT NULL,
  `tipo_mime` varchar(100) NOT NULL,
  `tamaño_bytes` int(11) NOT NULL,
  `fecha_subida` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ticket_id` (`ticket_id`),
  KEY `idx_respuesta_id` (`respuesta_id`),
  FOREIGN KEY (`ticket_id`) REFERENCES `soporte_tickets`(`ticket_id`) ON DELETE CASCADE,
  FOREIGN KEY (`respuesta_id`) REFERENCES `soporte_respuestas`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para configuración SLA
CREATE TABLE `soporte_sla_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `prioridad` enum('critica','alta','media','baja') NOT NULL,
  `tiempo_respuesta_horas` int(11) NOT NULL,
  `tiempo_resolucion_horas` int(11) NOT NULL,
  `activo` boolean DEFAULT TRUE,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_prioridad` (`prioridad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar configuración SLA por defecto
INSERT INTO `soporte_sla_config` (`prioridad`, `tiempo_respuesta_horas`, `tiempo_resolucion_horas`) VALUES
('critica', 1, 4),
('alta', 4, 24),
('media', 8, 72),
('baja', 24, 168);

-- Tabla para estadísticas y métricas
CREATE TABLE `soporte_metricas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ticket_id` varchar(20) NOT NULL,
  `fecha_primer_respuesta` timestamp NULL DEFAULT NULL,
  `tiempo_primer_respuesta_minutos` int(11) DEFAULT NULL,
  `numero_intercambios` int(11) DEFAULT 0,
  `satisfaccion_puntuacion` int(1) DEFAULT NULL,
  `cumple_sla_respuesta` boolean DEFAULT NULL,
  `cumple_sla_resolucion` boolean DEFAULT NULL,
  `fecha_calculo` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_ticket_id` (`ticket_id`),
  FOREIGN KEY (`ticket_id`) REFERENCES `soporte_tickets`(`ticket_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
