# Panel de Administración de Tickets de Soporte

## Descripción

Este panel de administración permite a los superadministradores gestionar completamente el sistema de tickets de soporte. Incluye funcionalidades para:

- Ver y gestionar todos los tickets
- Responder a los clientes
- Cambiar estados y prioridades
- Ver estadísticas detalladas
- Realizar acciones masivas
- Exportar reportes

## Estructura de Archivos

```
Pages/Admin/Tickets/
├── index.php              # Dashboard principal
├── index.css              # Estilos del dashboard
├── index.js               # JavaScript del dashboard
├── lista.php              # Lista de tickets con filtros
├── lista.css              # Estilos de la lista
├── lista.js               # JavaScript de la lista
├── detalle.php            # Detalle y respuesta de tickets
├── detalle.css            # Estilos del detalle
├── detalle.js             # JavaScript del detalle
├── estadisticas.php       # Estadísticas avanzadas
├── estadisticas.css       # Estilos de estadísticas
├── estadisticas.js        # JavaScript de estadísticas
└── api/
    ├── cambiar_estado.php         # API para cambiar estado
    ├── cambiar_estado_masivo.php  # API para cambios masivos
    └── stats.php                  # API para estadísticas
```

## Funcionalidades Principales

### 1. Dashboard (index.php)

- **Estadísticas generales**: Total de tickets, pendientes, críticos, últimas 24h
- **Desglose por estado**: Nuevos, abiertos, en proceso, resueltos, cerrados
- **Tickets urgentes**: Lista de tickets críticos y de alta prioridad
- **Tickets recientes**: Últimos tickets creados
- **Acciones rápidas**: Enlaces a vistas filtradas y configuración

### 2. Lista de Tickets (lista.php)

- **Filtros avanzados**: Por estado, prioridad, tipo, fechas, búsqueda de texto
- **Paginación**: Configurable (10, 25, 50, 100 por página)
- **Selección múltiple**: Para acciones masivas
- **Acciones individuales**: Ver, responder, cambiar estado/prioridad
- **Exportación**: CSV de tickets filtrados

### 3. Detalle de Ticket (detalle.php)

- **Información completa**: Todos los datos del ticket
- **Timeline de conversación**: Historial de respuestas cronológico
- **Formulario de respuesta**: Con plantillas rápidas y auto-guardado
- **Cambio de estado/prioridad**: Formularios integrados
- **Archivos adjuntos**: Visualización y descarga
- **Comentarios internos**: Para el equipo de soporte

### 4. Estadísticas (estadisticas.php)

- **Gráficos interactivos**: Tickets por día, distribución por tipo
- **Performance SLA**: Cumplimiento por prioridad
- **Top empresas**: Clientes con más tickets
- **Análisis por tipo**: Resolución y tiempos promedio
- **Filtros de período**: Día, semana, mes, trimestre personalizado

## APIs Disponibles

### Cambiar Estado (`api/cambiar_estado.php`)

```javascript
// POST /api/cambiar_estado.php
{
    "ticket_id": "TK-20250101-001",
    "nuevo_estado": "en_proceso",
    "comentarios": "Iniciando revisión técnica"
}
```

### Cambio Masivo (`api/cambiar_estado_masivo.php`)

```javascript
// POST /api/cambiar_estado_masivo.php
{
    "ticket_ids": ["TK-20250101-001", "TK-20250101-002"],
    "nuevo_estado": "abierto",
    "comentarios": "Actualizando lote de tickets"
}
```

### Estadísticas (`api/stats.php`)

```javascript
// GET /api/stats.php
// Respuesta incluye estadísticas generales, SLA, alertas, etc.
```

## Base de Datos

### Tablas Principales

- `soporte_tickets`: Tickets principales
- `soporte_respuestas`: Conversaciones y respuestas
- `soporte_archivos`: Archivos adjuntos
- `soporte_sla_config`: Configuración de SLA
- `soporte_metricas`: Métricas calculadas

### Estados Válidos

- `nuevo`: Ticket recién creado
- `abierto`: En cola para atención
- `en_proceso`: Siendo trabajado
- `resuelto`: Solucionado, pendiente confirmación
- `cerrado`: Cerrado definitivamente

### Prioridades

- `critica`: Resolución en 1-4 horas
- `alta`: Resolución en 4-24 horas
- `media`: Resolución en 8-72 horas
- `baja`: Resolución en 24-168 horas

## Características Técnicas

### Seguridad

- Headers de seguridad configurados
- Sesiones seguras
- Validación de entrada en todas las APIs
- Sanitización de HTML en las salidas

### Responsive Design

- Funciona en desktop, tablet y móvil
- Bootstrap 5 para componentes UI
- Font Awesome para iconos

### JavaScript Features

- Clases ES6 para organización de código
- Fetch API para llamadas AJAX
- Chart.js para gráficos interactivos
- Auto-guardado de borradores
- Keyboard shortcuts

### Funciones de Productividad

- **Plantillas rápidas**: Respuestas predefinidas
- **Auto-guardado**: Borradores de respuestas
- **Selección múltiple**: Acciones masivas
- **Filtros avanzados**: Búsqueda eficiente
- **Exportación**: CSV y PDF
- **Notificaciones**: Toasts para feedback

## Configuración

### Variables de Entorno

Asegúrese de que estas variables estén configuradas en `config.php`:

- `BASE_URL`: URL base del sistema
- `DB_*`: Configuración de base de datos
- Configuración de email para notificaciones

### Permisos

Actualmente el sistema no valida permisos específicos, pero se puede añadir:

```php
// Descomenta en cada archivo para añadir validación
if (!isset($_SESSION['is_superadmin']) || !$_SESSION['is_superadmin']) {
    header('Location: ' . BASE_URL . '/login');
    exit;
}
```

## Instalación

1. **Copiar archivos**: Subir toda la carpeta `Admin/Tickets/` al servidor
2. **Base de datos**: Ejecutar `database/soporte_tickets.sql`
3. **Permisos**: Configurar permisos de escritura en `/uploads/` si se usan archivos
4. **Configuración**: Ajustar variables en `config.php`

## Uso

### Acceso Directo

El panel está diseñado para usarse fuera del menú principal:

- Acceso directo: `/Pages/Admin/Tickets/index.php`
- Integrable en cualquier plataforma de administración

### Flujo de Trabajo Típico

1. **Dashboard**: Ver resumen general y tickets urgentes
2. **Lista**: Filtrar y seleccionar tickets a trabajar
3. **Detalle**: Revisar información completa y responder
4. **Estadísticas**: Analizar performance y tendencias

### Atajos de Teclado

- `Ctrl+R`: Refrescar vista actual
- `Ctrl+F`: Abrir filtros (en lista)
- `Ctrl+Enter`: Enviar respuesta (en detalle)
- `Escape`: Limpiar formulario/selección

## Personalización

### Colores y Temas

Modifica las variables CSS en cada archivo `.css`:

```css
:root {
  --primary-color: #0d6efd;
  --success-color: #198754;
  --danger-color: #dc3545;
  /* etc... */
}
```

### Plantillas de Respuesta

Edita la función `insertarPlantilla()` en `detalle.js` para añadir nuevas plantillas.

### Métricas Adicionales

Añade nuevas consultas en `api/stats.php` para métricas personalizadas.

## Soporte y Mantenimiento

### Logs

Los errores se registran en `/logs/error.log` usando `ErrorLogger`.

### Monitoreo

- Revisa regularmente las estadísticas de performance
- Monitorea tickets sin respuesta
- Analiza tendencias de volumen

### Backup

- Respalda regularmente la base de datos
- Mantén copias de los archivos adjuntos en `/uploads/`

## Próximas Mejoras

### Funcionalidades Pendientes

- [ ] Sistema de notificaciones en tiempo real
- [ ] Chat en vivo integrado
- [ ] Automatización de respuestas
- [ ] Integración con herramientas externas
- [ ] App móvil nativa
- [ ] Dashboard público para clientes

### Optimizaciones

- [ ] Cache de estadísticas
- [ ] Lazy loading en listas grandes
- [ ] Compresión de archivos adjuntos
- [ ] Índices adicionales en BD

---

**Nota**: Este panel fue diseñado para ser independiente y portable. Puede integrarse fácilmente en cualquier sistema existente de administración.
