-- Datos de prueba para el sistema de tickets
-- Ejecutar este script para tener datos de ejemplo

INSERT INTO soporte_tickets (
    ticket_id, 
    tipo_cliente, 
    empresa, 
    nombre_contacto, 
    email_contacto, 
    telefono,
    tipo_solicitud, 
    prioridad, 
    asunto, 
    descripcion, 
    estado, 
    fecha_creacion
) VALUES 
-- Ticket crítico
('TKT-2025001', 'cliente_existente', 'TechCorp SA', 'Ana García', 'ana.garcia@techcorp.com', '+34-600-123-456', 'incidente_tecnico', 'critica', 'Error crítico en sistema de producción', 'El sistema principal está caído desde las 08:00. Los usuarios no pueden acceder y hay pérdida de datos. Necesitamos asistencia urgente.', 'en_proceso', '2025-07-03 08:30:00'),

-- Ticket alta prioridad
('TKT-2025002', 'cliente_existente', 'InnovaSoft', 'Carlos Ruiz', 'carlos.ruiz@innovasoft.es', '+34-600-789-012', 'reporte_error', 'alta', 'Problemas con autenticación de usuarios', 'Los usuarios reportan problemas intermitentes para hacer login. El error aparece aproximadamente cada 15 minutos.', 'abierto', '2025-07-03 10:15:00'),

-- Ticket nuevo
('TKT-2025003', 'cliente_potencial', 'StartupXYZ', 'María López', 'maria.lopez@startupxyz.com', '+34-600-345-678', 'consulta_funcionalidad', 'media', 'Consulta sobre funcionalidades del módulo de reportes', 'Nos gustaría conocer más detalles sobre las capacidades de generación de reportes personalizados y si es posible integrar con nuestro ERP actual.', 'nuevo', '2025-07-03 11:45:00'),

-- Ticket resuelto
('TKT-2025004', 'cliente_existente', 'DataSystems', 'Roberto Fernández', 'roberto.fernandez@datasystems.com', '+34-600-567-890', 'solicitud_cambio', 'baja', 'Solicitud de cambio en interfaz de usuario', 'Nos gustaría modificar el color del botón de envío en el formulario principal. Tenemos las especificaciones exactas del color corporativo.', 'resuelto', '2025-07-02 14:20:00'),

-- Ticket cerrado
('TKT-2025005', 'cliente_existente', 'GlobalTech', 'Laura Martín', 'laura.martin@globaltech.es', '+34-600-234-567', 'solicitud_capacitacion', 'media', 'Capacitación para nuevos usuarios', 'Necesitamos programar una sesión de capacitación para 10 nuevos usuarios que se incorporarán la próxima semana.', 'cerrado', '2025-07-01 16:00:00'),

-- Ticket reciente alta prioridad
('TKT-2025006', 'cliente_existente', 'SecureNet', 'David González', 'david.gonzalez@securenet.com', '+34-600-456-789', 'incidente_tecnico', 'alta', 'Fallo en backup automático', 'El sistema de backup automático no se ha ejecutado en las últimas 48 horas. Necesitamos verificar la integridad de los datos.', 'nuevo', '2025-07-03 09:00:00'),

-- Ticket en proceso
('TKT-2025007', 'cliente_existente', 'WebSolutions', 'Sandra Torres', 'sandra.torres@websolutions.es', '+34-600-678-901', 'reporte_error', 'media', 'Error en generación de informes PDF', 'Al intentar generar informes en formato PDF, aparece un error 500. Los informes en otros formatos funcionan correctamente.', 'en_proceso', '2025-07-03 12:30:00'),

-- Ticket de hoy
('TKT-2025008', 'consulta_general', 'NewBusiness', 'Miguel Ángel Ruiz', 'miguel.ruiz@newbusiness.com', '+34-600-890-123', 'consulta_funcionalidad', 'baja', 'Información sobre planes y precios', 'Estamos evaluando diferentes opciones de software y nos gustaría recibir información detallada sobre sus planes y precios.', 'nuevo', NOW());
