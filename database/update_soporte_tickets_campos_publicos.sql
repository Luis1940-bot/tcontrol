-- Actualización de la tabla soporte_tickets para incluir campos adicionales
-- para usuarios no logueados y clasificación de clientes

ALTER TABLE soporte_tickets 
ADD COLUMN tipo_cliente ENUM('cliente_existente', 'cliente_potencial', 'consulta_general') NULL AFTER usuario_id,
ADD COLUMN planta_cliente VARCHAR(50) NULL AFTER tipo_cliente,
ADD COLUMN como_conocio ENUM('referencia', 'web', 'redes_sociales', 'evento', 'otro') NULL AFTER planta_cliente,
ADD COLUMN es_cliente_logueado BOOLEAN DEFAULT FALSE AFTER como_conocio;

-- Actualizar registros existentes (asumiendo que son de clientes logueados)
UPDATE soporte_tickets 
SET es_cliente_logueado = TRUE 
WHERE usuario_id IS NOT NULL;

-- Comentario sobre los nuevos campos:
-- tipo_cliente: Clasifica si es cliente existente, potencial, o consulta general
-- planta_cliente: Ubicación/planta del cliente (requerido para clientes existentes)
-- como_conocio: Canal por el cual conoció TenkiWeb (útil para marketing)
-- es_cliente_logueado: Bandera para distinguir tickets de usuarios autenticados vs públicos
