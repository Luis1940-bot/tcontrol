<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎫 Detalle del Ticket - Admin Panel</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎫</text></svg>">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Courier New', monospace;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
            color: #e0e0e0;
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .header {
            background: linear-gradient(45deg, #1a1a1a, #2a2a2a);
            border: 2px solid #00ff00;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 30px;
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
        }

        .header h1 {
            color: #00ff00;
            text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
            margin-bottom: 10px;
        }

        .nav-buttons {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-top: 15px;
        }

        .btn {
            background: linear-gradient(45deg, #003300, #006600);
            color: #00ff00;
            border: 1px solid #00ff00;
            padding: 8px 15px;
            text-decoration: none;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .btn:hover {
            background: linear-gradient(45deg, #006600, #009900);
            box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
            transform: translateY(-2px);
        }

        .btn-danger {
            background: linear-gradient(45deg, #330000, #660000);
            color: #ff6666;
            border-color: #ff6666;
        }

        .btn-danger:hover {
            background: linear-gradient(45deg, #660000, #990000);
            box-shadow: 0 0 15px rgba(255, 102, 102, 0.5);
        }

        .ticket-info {
            background: #1a1a1a;
            border: 1px solid #00ff00;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
        }

        .ticket-header {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }

        .info-item {
            background: #0d0d0d;
            padding: 10px;
            border-radius: 5px;
            border-left: 3px solid #00ff00;
        }

        .info-label {
            color: #888;
            font-size: 12px;
            margin-bottom: 5px;
        }

        .info-value {
            color: #00ff00;
            font-weight: bold;
        }

        .status-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .actions-section {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .action-card {
            background: #1a1a1a;
            border: 1px solid #00ff00;
            border-radius: 8px;
            padding: 20px;
        }

        .action-card h3 {
            color: #00ff00;
            margin-bottom: 15px;
            border-bottom: 1px solid #333;
            padding-bottom: 10px;
        }

        .form-group {
            margin-bottom: 15px;
        }

        .form-group label {
            display: block;
            color: #00ff00;
            margin-bottom: 5px;
            font-size: 14px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            background: #0d0d0d;
            border: 1px solid #333;
            color: #e0e0e0;
            padding: 8px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
        }

        .form-group textarea {
            min-height: 100px;
            resize: vertical;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            border-color: #00ff00;
            outline: none;
            box-shadow: 0 0 5px rgba(0, 255, 0, 0.3);
        }

        .checkbox-group {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .checkbox-group input[type="checkbox"] {
            width: auto;
        }

        .responses-section {
            background: #1a1a1a;
            border: 1px solid #00ff00;
            border-radius: 8px;
            padding: 20px;
        }

        .response-item {
            background: #0d0d0d;
            border-left: 3px solid #00ff00;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 0 5px 5px 0;
        }

        .response-header {
            display: flex;
            justify-content: between;
            align-items: center;
            margin-bottom: 10px;
            color: #888;
            font-size: 12px;
        }

        .response-author {
            color: #00ff00;
            font-weight: bold;
        }

        .response-private {
            background: #440000;
            border-left-color: #ff6666;
        }

        .alert {
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            border: 1px solid;
        }

        .alert-success {
            background: #003300;
            color: #00ff00;
            border-color: #00ff00;
        }

        .alert-error {
            background: #330000;
            color: #ff6666;
            border-color: #ff6666;
        }

        @media (max-width: 768px) {
            .ticket-header {
                grid-template-columns: 1fr;
            }
            
            .actions-section {
                grid-template-columns: 1fr;
            }
            
            .nav-buttons {
                justify-content: center;
            }
        }
    </style>
</head>
<body>
    <?php
    // ==========================================
    // DETALLE.PHP - PROCESAMIENTO PHP
    // ==========================================
    
    // Configuración de errores
    error_reporting(0);
    ini_set('display_errors', '0');
    
    // BASE_URL
    $protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? 'https' : 'http';
    $server_host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $baseUrl = "$protocol://$server_host/test-tenkiweb/tcontrol";
    
    // Obtener ID del ticket
    $ticket_id = $_GET['ticket'] ?? '';
    
    if (empty($ticket_id)) {
        echo "<script>window.location.href = 'lista.php';</script>";
        exit;
    }
    
    // Variables para mensajes
    $mensaje_exito = '';
    $mensaje_error = '';
    $ticket = null;
    $respuestas = [];
    $datos_reales_obtenidos = false;
    
    // Procesar acciones POST
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
        try {
            $config_path = dirname(dirname(dirname(__DIR__))) . '/Routes/datos_base.php';
            
            if (file_exists($config_path)) {
                include $config_path;
                
                if (isset($host, $user, $password, $dbname, $port)) {
                    $dsn = "mysql:host={$host};dbname={$dbname};port={$port};charset=utf8mb4";
                    $options = [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                        PDO::ATTR_EMULATE_PREPARES => false,
                        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
                    ];
                    
                    $pdo = new PDO($dsn, $user, $password, $options);
                    
                    switch ($_POST['action']) {
                        case 'responder':
                            $autor_nombre = trim($_POST['autor_nombre'] ?? 'Administrador');
                            $autor_email = trim($_POST['autor_email'] ?? 'admin@tenkiweb.com');
                            $mensaje = trim($_POST['mensaje'] ?? '');
                            $es_privada = isset($_POST['es_privada']) ? 1 : 0;
                            
                            if (empty($mensaje)) {
                                throw new Exception('El mensaje no puede estar vacío');
                            }
                            
                            // Verificar si existe la tabla soporte_respuestas
                            $stmt_check = $pdo->prepare("SHOW TABLES LIKE 'soporte_respuestas'");
                            $stmt_check->execute();
                            if (!$stmt_check->fetch()) {
                                // Crear tabla si no existe
                                $pdo->exec("
                                    CREATE TABLE soporte_respuestas (
                                        respuesta_id INT AUTO_INCREMENT PRIMARY KEY,
                                        ticket_id INT NOT NULL,
                                        tipo_respuesta ENUM('cliente', 'soporte') DEFAULT 'soporte',
                                        autor_nombre VARCHAR(255) NOT NULL,
                                        autor_email VARCHAR(255) NOT NULL,
                                        mensaje TEXT NOT NULL,
                                        es_privada TINYINT(1) DEFAULT 0,
                                        fecha_respuesta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                        INDEX (ticket_id)
                                    )
                                ");
                            }
                            
                            // Insertar respuesta
                            $stmt = $pdo->prepare("
                                INSERT INTO soporte_respuestas 
                                (ticket_id, tipo_respuesta, autor_nombre, autor_email, mensaje, es_privada) 
                                VALUES (?, 'soporte', ?, ?, ?, ?)
                            ");
                            $stmt->execute([$ticket_id, $autor_nombre, $autor_email, $mensaje, $es_privada]);
                            
                            // Actualizar estado del ticket si es nuevo
                            $stmt_update = $pdo->prepare("
                                UPDATE soporte_tickets 
                                SET estado = CASE 
                                    WHEN estado = 'nuevo' THEN 'abierto'
                                    ELSE estado 
                                END,
                                fecha_actualizacion = NOW()
                                WHERE ticket_id = ?
                            ");
                            $stmt_update->execute([$ticket_id]);
                            
                            $mensaje_exito = '✅ Respuesta enviada correctamente';
                            break;
                            
                        case 'cambiar_estado':
                            $nuevo_estado = $_POST['nuevo_estado'] ?? '';
                            $comentarios = trim($_POST['comentarios'] ?? '');
                            
                            if (empty($nuevo_estado)) {
                                throw new Exception('Debe seleccionar un estado');
                            }
                            
                            $stmt = $pdo->prepare("
                                UPDATE soporte_tickets 
                                SET estado = ?, 
                                    fecha_resolucion = CASE 
                                        WHEN ? IN ('resuelto', 'cerrado') AND fecha_resolucion IS NULL THEN NOW()
                                        WHEN ? NOT IN ('resuelto', 'cerrado') THEN NULL
                                        ELSE fecha_resolucion 
                                    END,
                                    fecha_actualizacion = NOW()
                                WHERE ticket_id = ?
                            ");
                            $stmt->execute([$nuevo_estado, $nuevo_estado, $nuevo_estado, $ticket_id]);
                            
                            // Agregar comentario interno si se proporcionó
                            if (!empty($comentarios)) {
                                try {
                                    $comentario_con_fecha = date('Y-m-d H:i:s') . " - Cambio de estado a '$nuevo_estado': $comentarios";
                                    $stmt_comment = $pdo->prepare("
                                        INSERT INTO soporte_respuestas 
                                        (ticket_id, tipo_respuesta, autor_nombre, autor_email, mensaje, es_privada) 
                                        VALUES (?, 'soporte', 'Sistema', 'admin@tenkiweb.com', ?, 1)
                                    ");
                                    $stmt_comment->execute([$ticket_id, $comentario_con_fecha]);
                                } catch (Exception $e) {
                                    // Si no existe la tabla respuestas, continuar sin agregar comentario
                                }
                            }
                            
                            $mensaje_exito = '✅ Estado actualizado correctamente';
                            break;
                            
                        case 'cambiar_prioridad':
                            $nueva_prioridad = $_POST['nueva_prioridad'] ?? '';
                            
                            if (empty($nueva_prioridad)) {
                                throw new Exception('Debe seleccionar una prioridad');
                            }
                            
                            $stmt = $pdo->prepare("
                                UPDATE soporte_tickets 
                                SET prioridad = ?, fecha_actualizacion = NOW() 
                                WHERE ticket_id = ?
                            ");
                            $stmt->execute([$nueva_prioridad, $ticket_id]);
                            
                            $mensaje_exito = '✅ Prioridad actualizada correctamente';
                            break;
                    }
                }
            }
        } catch (Exception $e) {
            $mensaje_error = '❌ Error: ' . $e->getMessage();
        }
    }
    
    // Obtener información del ticket
    try {
        $config_path = dirname(dirname(dirname(__DIR__))) . '/Routes/datos_base.php';
        
        if (file_exists($config_path)) {
            include $config_path;
            
            if (isset($host, $user, $password, $dbname, $port)) {
                $dsn = "mysql:host={$host};dbname={$dbname};port={$port};charset=utf8mb4";
                $options = [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
                ];
                
                $pdo = new PDO($dsn, $user, $password, $options);
                
                // Obtener información del ticket
                $stmt = $pdo->prepare("
                    SELECT *, 
                           TIMESTAMPDIFF(HOUR, fecha_creacion, NOW()) as horas_transcurridas,
                           CASE 
                               WHEN fecha_resolucion IS NOT NULL 
                               THEN TIMESTAMPDIFF(HOUR, fecha_creacion, fecha_resolucion)
                               ELSE NULL
                           END as tiempo_resolucion_horas
                    FROM soporte_tickets 
                    WHERE ticket_id = ?
                ");
                $stmt->execute([$ticket_id]);
                $ticket = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if ($ticket) {
                    $datos_reales_obtenidos = true;
                    
                    // Obtener respuestas si existe la tabla
                    try {
                        $stmt_respuestas = $pdo->prepare("
                            SELECT * FROM soporte_respuestas 
                            WHERE ticket_id = ? 
                            ORDER BY fecha_respuesta ASC
                        ");
                        $stmt_respuestas->execute([$ticket_id]);
                        $respuestas = $stmt_respuestas->fetchAll(PDO::FETCH_ASSOC);
                    } catch (Exception $e) {
                        // Tabla no existe, usar array vacío
                        $respuestas = [];
                    }
                }
            }
        }
        
        if (!$ticket) {
            // Crear ticket de ejemplo para testing
            $ticket = [
                'ticket_id' => $ticket_id,
                'asunto' => 'Ticket de ejemplo #' . $ticket_id,
                'descripcion' => 'Este es un ticket de ejemplo para testing del sistema.',
                'estado' => 'abierto',
                'prioridad' => 'media',
                'empresa' => 'TenkiWeb',
                'nombre_contacto' => 'Usuario Demo',
                'email_contacto' => 'demo@tenkiweb.com',
                'telefono_contacto' => '+1234567890',
                'tipo_solicitud' => 'consulta',
                'fecha_creacion' => date('Y-m-d H:i:s', strtotime('-2 hours')),
                'fecha_actualizacion' => date('Y-m-d H:i:s', strtotime('-1 hour')),
                'fecha_resolucion' => null,
                'horas_transcurridas' => 2,
                'tiempo_resolucion_horas' => null
            ];
        }
    } catch (Exception $e) {
        $mensaje_error = '❌ Error obteniendo ticket: ' . $e->getMessage();
    }
    
    // Funciones helper
    function formatear_fecha($fecha) {
        if (!$fecha) return 'N/A';
        return date('d/m/Y H:i', strtotime($fecha));
    }
    
    function tiempo_transcurrido($fecha) {
        if (!$fecha) return 'N/A';
        
        $ahora = new DateTime();
        $fecha_ticket = new DateTime($fecha);
        $diff = $ahora->diff($fecha_ticket);
        
        if ($diff->days > 0) {
            return $diff->days . ' día' . ($diff->days > 1 ? 's' : '');
        } elseif ($diff->h > 0) {
            return $diff->h . ' hora' . ($diff->h > 1 ? 's' : '');
        } else {
            return $diff->i . ' minutos';
        }
    }
    
    function get_estado_color($estado) {
        $colores = [
            'nuevo' => '#0099ff',
            'abierto' => '#ff9900',
            'en_proceso' => '#3399ff',
            'resuelto' => '#00ff00',
            'cerrado' => '#666666'
        ];
        return $colores[$estado] ?? '#00ff00';
    }
    
    function get_prioridad_color($prioridad) {
        $colores = [
            'critica' => '#ff0000',
            'alta' => '#ff6600',
            'media' => '#ffcc00',
            'baja' => '#00ff00'
        ];
        return $colores[$prioridad] ?? '#00ff00';
    }
    ?>

    <div class="container">
        <!-- Header con navegación -->
        <div class="header">
            <h1>🎫 Ticket #<?= htmlspecialchars($ticket['ticket_id']) ?></h1>
            <p>Panel de Administración - Gestión de Tickets</p>
            
            <div class="nav-buttons">
                <a href="index.php" class="btn">🏠 Panel Principal</a>
                <a href="lista.php" class="btn">📋 Lista Tickets</a>
                <a href="estadisticas.php" class="btn">📊 Estadísticas</a>
                <a href="reportes.php" class="btn">📈 Reportes</a>
            </div>
        </div>

        <!-- Mensajes de estado -->
        <?php if ($mensaje_exito): ?>
            <div class="alert alert-success"><?= htmlspecialchars($mensaje_exito) ?></div>
        <?php endif; ?>
        
        <?php if ($mensaje_error): ?>
            <div class="alert alert-error"><?= htmlspecialchars($mensaje_error) ?></div>
        <?php endif; ?>

        <!-- Información del ticket -->
        <div class="ticket-info">
            <div class="ticket-header">
                <div class="info-item">
                    <div class="info-label">ID del Ticket</div>
                    <div class="info-value">#<?= htmlspecialchars($ticket['ticket_id']) ?></div>
                </div>
                
                <div class="info-item">
                    <div class="info-label">Estado</div>
                    <div class="info-value">
                        <span class="status-badge" style="background-color: <?= get_estado_color($ticket['estado']) ?>; color: #000;">
                            <?= strtoupper(htmlspecialchars($ticket['estado'])) ?>
                        </span>
                    </div>
                </div>
                
                <div class="info-item">
                    <div class="info-label">Prioridad</div>
                    <div class="info-value">
                        <span class="status-badge" style="background-color: <?= get_prioridad_color($ticket['prioridad']) ?>; color: #000;">
                            <?= strtoupper(htmlspecialchars($ticket['prioridad'])) ?>
                        </span>
                    </div>
                </div>
                
                <div class="info-item">
                    <div class="info-label">Empresa</div>
                    <div class="info-value"><?= htmlspecialchars($ticket['empresa']) ?></div>
                </div>
                
                <div class="info-item">
                    <div class="info-label">Contacto</div>
                    <div class="info-value"><?= htmlspecialchars($ticket['nombre_contacto']) ?></div>
                </div>
                
                <div class="info-item">
                    <div class="info-label">Email</div>
                    <div class="info-value"><?= htmlspecialchars($ticket['email_contacto']) ?></div>
                </div>
                
                <div class="info-item">
                    <div class="info-label">Teléfono</div>
                    <div class="info-value"><?= htmlspecialchars($ticket['telefono_contacto']) ?></div>
                </div>
                
                <div class="info-item">
                    <div class="info-label">Tipo de Solicitud</div>
                    <div class="info-value"><?= htmlspecialchars($ticket['tipo_solicitud']) ?></div>
                </div>
                
                <div class="info-item">
                    <div class="info-label">Fecha Creación</div>
                    <div class="info-value"><?= formatear_fecha($ticket['fecha_creacion']) ?></div>
                </div>
                
                <div class="info-item">
                    <div class="info-label">Última Actualización</div>
                    <div class="info-value"><?= formatear_fecha($ticket['fecha_actualizacion']) ?></div>
                </div>
                
                <div class="info-item">
                    <div class="info-label">Tiempo Transcurrido</div>
                    <div class="info-value"><?= tiempo_transcurrido($ticket['fecha_creacion']) ?></div>
                </div>
                
                <div class="info-item">
                    <div class="info-label">Fecha Resolución</div>
                    <div class="info-value"><?= formatear_fecha($ticket['fecha_resolucion']) ?></div>
                </div>
            </div>
            
            <div style="margin-top: 20px;">
                <div class="info-label">Asunto</div>
                <div class="info-value" style="margin-bottom: 10px;"><?= htmlspecialchars($ticket['asunto']) ?></div>
                
                <div class="info-label">Descripción</div>
                <div style="background: #0d0d0d; padding: 15px; border-radius: 5px; border-left: 3px solid #00ff00;">
                    <?= nl2br(htmlspecialchars($ticket['descripcion'])) ?>
                </div>
            </div>
        </div>

        <!-- Sección de acciones -->
        <div class="actions-section">
            <!-- Responder ticket -->
            <div class="action-card">
                <h3>💬 Responder Ticket</h3>
                <form method="POST">
                    <input type="hidden" name="action" value="responder">
                    
                    <div class="form-group">
                        <label for="autor_nombre">Nombre del Autor:</label>
                        <input type="text" id="autor_nombre" name="autor_nombre" value="Administrador" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="autor_email">Email del Autor:</label>
                        <input type="email" id="autor_email" name="autor_email" value="admin@tenkiweb.com" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="mensaje">Mensaje de Respuesta:</label>
                        <textarea id="mensaje" name="mensaje" placeholder="Escriba su respuesta aquí..." required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <div class="checkbox-group">
                            <input type="checkbox" id="es_privada" name="es_privada">
                            <label for="es_privada">Respuesta privada (solo para administradores)</label>
                        </div>
                    </div>
                    
                    <button type="submit" class="btn">📤 Enviar Respuesta</button>
                </form>
            </div>

            <!-- Cambiar estado -->
            <div class="action-card">
                <h3>🔄 Cambiar Estado</h3>
                <form method="POST">
                    <input type="hidden" name="action" value="cambiar_estado">
                    
                    <div class="form-group">
                        <label for="nuevo_estado">Nuevo Estado:</label>
                        <select id="nuevo_estado" name="nuevo_estado" required>
                            <option value="">Seleccionar estado...</option>
                            <option value="nuevo" <?= $ticket['estado'] === 'nuevo' ? 'selected' : '' ?>>Nuevo</option>
                            <option value="abierto" <?= $ticket['estado'] === 'abierto' ? 'selected' : '' ?>>Abierto</option>
                            <option value="en_proceso" <?= $ticket['estado'] === 'en_proceso' ? 'selected' : '' ?>>En Proceso</option>
                            <option value="resuelto" <?= $ticket['estado'] === 'resuelto' ? 'selected' : '' ?>>Resuelto</option>
                            <option value="cerrado" <?= $ticket['estado'] === 'cerrado' ? 'selected' : '' ?>>Cerrado</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="comentarios">Comentarios (opcional):</label>
                        <textarea id="comentarios" name="comentarios" placeholder="Agregar comentario sobre el cambio de estado..."></textarea>
                    </div>
                    
                    <button type="submit" class="btn">🔄 Cambiar Estado</button>
                </form>
            </div>

            <!-- Cambiar prioridad -->
            <div class="action-card">
                <h3>⚡ Cambiar Prioridad</h3>
                <form method="POST">
                    <input type="hidden" name="action" value="cambiar_prioridad">
                    
                    <div class="form-group">
                        <label for="nueva_prioridad">Nueva Prioridad:</label>
                        <select id="nueva_prioridad" name="nueva_prioridad" required>
                            <option value="">Seleccionar prioridad...</option>
                            <option value="baja" <?= $ticket['prioridad'] === 'baja' ? 'selected' : '' ?>>Baja</option>
                            <option value="media" <?= $ticket['prioridad'] === 'media' ? 'selected' : '' ?>>Media</option>
                            <option value="alta" <?= $ticket['prioridad'] === 'alta' ? 'selected' : '' ?>>Alta</option>
                            <option value="critica" <?= $ticket['prioridad'] === 'critica' ? 'selected' : '' ?>>Crítica</option>
                        </select>
                    </div>
                    
                    <button type="submit" class="btn">⚡ Cambiar Prioridad</button>
                </form>
            </div>
        </div>

        <!-- Historial de respuestas -->
        <div class="responses-section">
            <h3 style="color: #00ff00; margin-bottom: 20px;">📝 Historial de Respuestas</h3>
            
            <?php if (empty($respuestas)): ?>
                <div style="text-align: center; color: #888; padding: 40px;">
                    <p>📭 No hay respuestas para este ticket aún.</p>
                    <p>Las respuestas que envíe aparecerán aquí.</p>
                </div>
            <?php else: ?>
                <?php foreach ($respuestas as $respuesta): ?>
                    <div class="response-item <?= $respuesta['es_privada'] ? 'response-private' : '' ?>">
                        <div class="response-header">
                            <span class="response-author">
                                <?= htmlspecialchars($respuesta['autor_nombre']) ?> (<?= htmlspecialchars($respuesta['autor_email']) ?>)
                            </span>
                            <span>
                                <?= formatear_fecha($respuesta['fecha_respuesta']) ?>
                                <?php if ($respuesta['es_privada']): ?>
                                    <span style="color: #ff6666; margin-left: 10px;">🔒 PRIVADA</span>
                                <?php endif; ?>
                            </span>
                        </div>
                        <div style="color: #e0e0e0;">
                            <?= nl2br(htmlspecialchars($respuesta['mensaje'])) ?>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>
