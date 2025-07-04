-- ==========================================
-- SQL PARA SOPORTE_RESPUESTAS
-- Tabla para respuestas de tickets
-- ==========================================

-- Crear tabla soporte_respuestas si no existe
CREATE TABLE IF NOT EXISTS soporte_respuestas (
    respuesta_id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    tipo_respuesta ENUM('cliente', 'soporte') DEFAULT 'soporte',
    autor_nombre VARCHAR(255) NOT NULL,
    autor_email VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    es_privada TINYINT(1) DEFAULT 0,
    fecha_respuesta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_ticket_id (ticket_id),
    INDEX idx_fecha_respuesta (fecha_respuesta),
    FOREIGN KEY (ticket_id) REFERENCES soporte_tickets(ticket_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insertar algunas respuestas de ejemplo (opcional)
INSERT IGNORE INTO soporte_respuestas (ticket_id, tipo_respuesta, autor_nombre, autor_email, mensaje, es_privada) VALUES
(1, 'soporte', 'Administrador', 'admin@tenkiweb.com', 'Hemos recibido su consulta y estamos revisando el problema. Le responderemos en las próximas 24 horas.', 0),
(1, 'cliente', 'Juan Pérez', 'juan.perez@empresa.com', 'Gracias por la respuesta. El problema persiste y es urgente ya que afecta la productividad del equipo.', 0),
(1, 'soporte', 'Soporte Técnico', 'soporte@tenkiweb.com', 'Nota interna: Escalando a nivel 2 por criticidad.', 1),
(2, 'soporte', 'Administrador', 'admin@tenkiweb.com', 'Ticket cerrado. Problema resuelto mediante actualización del sistema.', 0),
(3, 'soporte', 'Soporte Técnico', 'soporte@tenkiweb.com', 'Investigando el problema reportado. Hemos identificado la causa raíz.', 0);

-- Actualizar algunos campos de fecha en soporte_tickets si existen
UPDATE soporte_tickets 
SET fecha_actualizacion = NOW() 
WHERE fecha_actualizacion IS NULL;

-- Verificar la estructura
DESCRIBE soporte_respuestas;

-- Mostrar estadísticas
SELECT 'Tabla soporte_respuestas creada correctamente' as Mensaje;
SELECT COUNT(*) as TotalRespuestas FROM soporte_respuestas;
SELECT COUNT(*) as TotalTickets FROM soporte_tickets;
