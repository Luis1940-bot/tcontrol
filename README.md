PLATAFORMA TENKI

D.A.T.O.S.

Dinámico: Adaptable a diferentes dispositivos y necesidades operacionales.

Accesible: Facil acceso y manejo desde cualquier dispositivo con conexión a internet.

Transparente: Facilita la visualización clara y directa de los datos en tiempo real.

Operacional: Orientado a optimizar las operaciones y procesos diarios.

Seguro: Protege la integridad y privacidad de los datos recolectados.

Este nemónico resume las características esenciales de un sistema de controles web y es fácil de recordar, lo que puede ayudar a los usuarios a mantener en mente las principales ventajas y funciones del sistema cuando lo usen o lo mencionen.

# tControl - Sistema de Gestión Documental

Este sistema permite gestionar reportes técnicos generados por diferentes áreas, asignarlos a usuarios y clasificarlos por tipo, cliente y otros metadatos. La arquitectura incluye integración con roles, notificaciones por correo (futuro), y lógica RACI para asignación de responsabilidades.

Tecnologías usadas:

- PHP Vanilla
- MySQL
- JavaScript Vanilla
- DBeaver (para administración de BD)
- CSS

## Diagrama Entidad-Relación (ER)

![Diagrama de base de datos](resources/bd.png)

---

## Tabla: normalized_json_table

Contiene datos estructurados en formato JSON normalizado.

| Campo           | Tipo | Descripción             |
| --------------- | ---- | ----------------------- |
| id              | INT  | Identificador único     |
| normalized_json | JSON | Objeto JSON normalizado |

---

## Tabla: auth

Autenticación de usuarios por planta.

| Campo | Tipo    | Descripción                |
| ----- | ------- | -------------------------- |
| id    | INT     | ID único                   |
| plant | VARCHAR | Planta asignada al usuario |
| mail  | VARCHAR | Correo electrónico         |

---

## Tabla: tipousuario

Tipos de usuario configurables.

| Campo         | Tipo    | Descripción                            |
| ------------- | ------- | -------------------------------------- |
| idtipousuario | INT     | ID del tipo de usuario                 |
| tipo          | VARCHAR | Nombre del tipo (admin, técnico, etc.) |
| detalle       | TEXT    | Descripción detallada del tipo         |

---

## Tabla: LTYsectores

Sectores operativos definidos para el sistema.

| Campo         | Tipo    | Descripción             |
| ------------- | ------- | ----------------------- |
| idLTYsectores | INT     | ID del sector           |
| sector        | VARCHAR | Nombre del sector       |
| idLTYarea     | INT     | Área a la que pertenece |
| idLTYcliente  | INT     | Cliente asociado        |

---

## Tabla: vista_validaciones_71 a 74

Vistas generadas para validar TAGs o lecturas con diferentes reglas.

| Campo         | Tipo    | Descripción                            |
| ------------- | ------- | -------------------------------------- |
| valor_fecha   | DATE    | Fecha del valor validado               |
| validador_100 | FLOAT   | Valor de regla validador_100           |
| validador_101 | FLOAT   | Valor de regla validador_101           |
| ede           | VARCHAR | Clasificación del resultado (opcional) |
| total_1s      | FLOAT   | Suma total validada                    |

> Nota: Las 4 vistas tienen estructura idéntica, sólo cambian en segmentación de datos.

---

## Tabla: LTYrecursoReporte

Asociación de recursos a reportes individuales.

| Campo               | Tipo     | Descripción                        |
| ------------------- | -------- | ---------------------------------- |
| idLTYrecursoReporte | INT      | ID del recurso asociado al reporte |
| idLTYreporte        | INT      | Reporte principal                  |
| idLTYusuario        | INT      | Usuario asignado                   |
| date                | DATETIME | Fecha de asignación                |
| activo              | BOOLEAN  | Estado activo del recurso          |
| hassignadas         | TEXT     | Hashes de archivos asignados       |
| codelativo          | VARCHAR  | Código relacionado                 |
| idLTYcliente        | INT      | Cliente asociado                   |

---

## Tabla: LTYselect

Opciones de selección asociadas a reportes o procesos.

| Campo        | Tipo    | Descripción                   |
| ------------ | ------- | ----------------------------- |
| idLTYselect  | INT     | ID del selector               |
| concepto     | VARCHAR | Concepto general del selector |
| selector     | VARCHAR | Valor de selección            |
| activo       | BOOLEAN | Estado activo                 |
| detalle      | TEXT    | Descripción detallada         |
| orden        | INT     | Orden de visualización        |
| nivel        | INT     | Nivel jerárquico (si aplica)  |
| idLTYcliente | INT     | Cliente relacionado           |

---

## Tabla: LTY_componente

Componentes técnicos del sistema.

| Campo            | Tipo    | Descripción           |
| ---------------- | ------- | --------------------- |
| idLTY_componente | INT     | ID del componente     |
| site             | VARCHAR | Sitio asociado        |
| componente       | VARCHAR | Nombre del componente |
| cod_numerico     | VARCHAR | Código del componente |
| codigo           | VARCHAR | Código alternativo    |
| idLTYarea        | INT     | Área relacionada      |
| idLTYreporte     | INT     | Reporte asociado      |
| activo           | BOOLEAN | Estado activo         |
| idLTYcliente     | INT     | Cliente asociado      |

---

## Tabla: LTY_ubicacionTecnica

Ubicaciones técnicas físicas o lógicas del sistema.

| Campo                  | Tipo    | Descripción                   |
| ---------------------- | ------- | ----------------------------- |
| idLTY_ubicacionTecnica | INT     | ID único                      |
| ubicacion_tecnica      | TEXT    | Descripción de la ubicación   |
| cod_numerico           | VARCHAR | Código numérico identificador |
| codigo                 | VARCHAR | Código alternativo            |
| idLTYarea              | INT     | Área vinculada                |
| idLTYreporte           | INT     | Reporte vinculado             |
| activo                 | BOOLEAN | Estado de la ubicación        |
| idLTYcliente           | INT     | Cliente asociado              |

---

## Tabla: TAGS_15

Tabla de referencia para parámetros técnicos y categorizaciones.

| Campo            | Tipo    | Descripción                      |
| ---------------- | ------- | -------------------------------- |
| id               | INT     | ID del tag                       |
| AREA             | VARCHAR | Área relacionada                 |
| SECCION          | VARCHAR | Sección o subárea                |
| CRITICIDAD       | VARCHAR | Nivel de criticidad              |
| EQUIPO           | VARCHAR | Tipo de equipo                   |
| TAG              | VARCHAR | Etiqueta técnica                 |
| TIPO_DE_LIBRANZA | VARCHAR | Tipo de liberación               |
| PROGRAMA         | VARCHAR | Programa asociado                |
| DISCIPLINA       | VARCHAR | Disciplina técnica               |
| TIPO             | VARCHAR | Tipo de dato o categoría         |
| ELEMENTO         | VARCHAR | Elemento específico              |
| activo           | BOOLEAN | Estado del tag (activo/inactivo) |

---

## Tabla: LTYpedidos

Registro de pedidos o requisiciones realizadas en el sistema.

| Campo           | Tipo     | Descripción                            |
| --------------- | -------- | -------------------------------------- |
| idLTYpedidos    | INT      | ID del pedido                          |
| fecha           | DATE     | Fecha del pedido                       |
| codprod         | VARCHAR  | Código del producto                    |
| idusuario       | INT (FK) | Usuario que solicitó                   |
| fechaautomatica | DATE     | Fecha generada automáticamente         |
| codcliente      | VARCHAR  | Código del cliente externo (si aplica) |
| cliente         | VARCHAR  | Nombre del cliente                     |
| producto        | VARCHAR  | Producto solicitado                    |
| embalaje        | VARCHAR  | Tipo de embalaje                       |
| cant_embalaje   | INT      | Cantidad por embalaje                  |
| unidades        | INT      | Total de unidades                      |
| neto            | DECIMAL  | Valor neto o peso neto                 |
| idLTYcliente    | INT (FK) | Cliente asociado                       |

---

## Tabla: usuario

Usuarios activos del sistema.

| Campo           | Tipo     | Descripción                  |
| --------------- | -------- | ---------------------------- |
| idusuario       | INT      | ID del usuario               |
| nombre          | VARCHAR  | Nombre completo              |
| usuario         | VARCHAR  | Nombre de usuario            |
| pass            | VARCHAR  | Contraseña cifrada           |
| area            | VARCHAR  | Área de trabajo              |
| puesto          | VARCHAR  | Puesto del usuario           |
| qcodusuario     | VARCHAR  | Código interno               |
| modificacion    | DATETIME | Fecha de última modificación |
| verificador     | BOOLEAN  | Verificador de datos         |
| idtipousuario   | INT (FK) | Tipo de usuario              |
| activo          | BOOLEAN  | Estado (activo/inactivo)     |
| mail            | VARCHAR  | Correo electrónico           |
| firma           | TEXT     | Firma digital (si aplica)    |
| mi_cfg          | TEXT     | Configuración personalizada  |
| cod_verificador | VARCHAR  | Código de verificación       |
| idLTYcliente    | INT (FK) | Cliente al que pertenece     |

---

## Tabla: temp_promedios_Final

Contiene los promedios finales combinados de indicadores por origen e intervalo.

| Campo                               | Tipo    | Descripción                        |
| ----------------------------------- | ------- | ---------------------------------- |
| origen                              | VARCHAR | Fuente de los datos                |
| intervalo                           | VARCHAR | Intervalo temporal analizado       |
| ede                                 | VARCHAR | Clasificación adicional (opcional) |
| promedio_porcentaje_final_combinado | FLOAT   | Valor promedio calculado           |

---

## Tabla: vista_json_lecturas_15_76

Vista con lecturas en formato JSON para análisis.

| Campo                | Tipo     | Descripción          |
| -------------------- | -------- | -------------------- |
| idLTYregistrocontrol | INT      | ID del registro      |
| TAG                  | VARCHAR  | Etiqueta o parámetro |
| fecha                | DATETIME | Fecha de lectura     |
| valor                | FLOAT    | Valor leído          |

---

## Tablas: vista_json_valores_28_175 / 176 / 177

Vistas de valores asociados a distintos TAGs para análisis.

| Campo                | Tipo     | Descripción          |
| -------------------- | -------- | -------------------- |
| idLTYregistrocontrol | INT      | ID del registro      |
| TAG                  | VARCHAR  | Etiqueta o parámetro |
| fecha                | DATETIME | Fecha de valor       |
| valor                | FLOAT    | Valor registrado     |

---

## Tabla: vista_validaciones_75

Vista que resume validaciones por fecha.

| Campo         | Tipo    | Descripción                 |
| ------------- | ------- | --------------------------- |
| valor_fecha   | DATE    | Fecha del valor validado    |
| validador_100 | FLOAT   | Resultado del validador 100 |
| validador_101 | FLOAT   | Resultado del validador 101 |
| ede           | VARCHAR | Clasificación o grupo       |
| total_1s      | FLOAT   | Total de valores 1s         |

---

## Tabla: LTYcliente

Registro de clientes del sistema.

| Campo        | Tipo    | Descripción                      |
| ------------ | ------- | -------------------------------- |
| idLTYcliente | INT     | ID del cliente                   |
| cliente      | VARCHAR | Nombre del cliente               |
| detalle      | TEXT    | Detalles adicionales del cliente |
| email        | VARCHAR | Correo de contacto               |
| contacto     | VARCHAR | Persona de contacto              |
| activo       | BOOLEAN | Estado (activo/inactivo)         |
| date         | DATE    | Fecha de alta                    |

---

## Tabla: LTYselectReporte

Asociaciones de selectores con reportes específicos.

| Campo              | Tipo     | Descripción           |
| ------------------ | -------- | --------------------- |
| idLTYselectReporte | INT      | ID de la relación     |
| selector           | VARCHAR  | Selector utilizado    |
| idLTYreporte       | INT (FK) | Reporte relacionado   |
| fecha              | DATE     | Fecha de uso          |
| idusuario          | INT      | Usuario que lo aplicó |
| idLTYcliente       | INT      | Cliente asociado      |

---

## Tabla: LTYsugerencias

Sugerencias del usuario para mejorar el sistema o procesos.

| Campo            | Tipo     | Descripción                |
| ---------------- | -------- | -------------------------- |
| idLTYsugerencias | INT      | ID de la sugerencia        |
| fecha_automatica | DATETIME | Fecha y hora registrada    |
| idusuario        | INT (FK) | Usuario que la generó      |
| nombre           | VARCHAR  | Título o asunto            |
| sugerencia       | TEXT     | Contenido de la sugerencia |
| idLTYcliente     | INT (FK) | Cliente asociado           |

---

## Tabla: log_accesos

Registro de accesos al sistema por usuario.

| Campo     | Tipo     | Descripción                      |
| --------- | -------- | -------------------------------- |
| id        | INT      | ID del log                       |
| idusuario | INT (FK) | Usuario que accedió              |
| email     | VARCHAR  | Correo electrónico usado         |
| planta    | VARCHAR  | Planta o ubicación física        |
| ip        | VARCHAR  | Dirección IP del acceso          |
| navegador | VARCHAR  | Agente de usuario (browser info) |
| creado_en | DATETIME | Fecha y hora del acceso          |

---

## Tabla: LTYerrors

Errores registrados durante el uso del sistema.

| Campo        | Tipo     | Descripción              |
| ------------ | -------- | ------------------------ |
| idLTYerrors  | INT      | ID del error             |
| date         | DATETIME | Fecha del error          |
| descripcion  | TEXT     | Descripción del error    |
| cod_error    | VARCHAR  | Código interno del error |
| gravedad     | VARCHAR  | Nivel de gravedad        |
| TypeError    | VARCHAR  | Tipo de error            |
| usuario      | VARCHAR  | Usuario que lo generó    |
| comentario   | TEXT     | Comentario adicional     |
| idLTYcliente | INT      | Cliente asociado         |

---

## Tabla: LTY_equipo

Equipos técnicos relacionados con reportes.

| Campo               | Tipo     | Descripción                 |
| ------------------- | -------- | --------------------------- |
| idLTY_equipo        | INT      | ID del equipo               |
| site                | VARCHAR  | Sitio o planta              |
| equipo              | VARCHAR  | Nombre del equipo           |
| cod_numerico        | VARCHAR  | Código numérico             |
| referencia_codigo   | VARCHAR  | Código interno              |
| referencia_utecnica | VARCHAR  | Código de ubicación técnica |
| idLTYarea           | INT      | Área asociada               |
| idLTYreporte        | INT (FK) | Reporte relacionado         |
| activo              | BOOLEAN  | Estado del equipo           |
| idLTYcliente        | INT (FK) | Cliente asociado            |

---

## Tabla: LTYdashboard

Dashboards personalizados del sistema.

| Campo          | Tipo     | Descripción                 |
| -------------- | -------- | --------------------------- |
| idLTYdashboard | INT      | ID del dashboard            |
| fecha          | DATE     | Fecha de creación           |
| dashboard      | VARCHAR  | Nombre o título             |
| detalle        | TEXT     | Descripción                 |
| fondo          | TEXT     | Color o estilo visual       |
| activo         | BOOLEAN  | Estado activo/inactivo      |
| idusuario      | INT      | Usuario creador             |
| insindicador   | BOOLEAN  | Usa indicadores             |
| nivel          | INT      | Nivel de acceso o prioridad |
| orden          | INT      | Orden de visualización      |
| idLTYcliente   | INT (FK) | Cliente asociado            |

---

## Tabla: LTYimage

Imágenes asociadas a reportes.

| Campo        | Tipo     | Descripción             |
| ------------ | -------- | ----------------------- |
| idLTYimage   | INT      | ID de la imagen         |
| idLTYreporte | INT (FK) | Reporte asociado        |
| imagen       | VARCHAR  | Ruta o URL de la imagen |
| altura       | INT      | Altura en píxeles       |
| ancho        | INT      | Ancho en píxeles        |
| tipo         | VARCHAR  | Tipo de imagen          |
| orden        | INT      | Orden en el reporte     |
| activo       | BOOLEAN  | Estado activo           |
| idLTYcliente | INT (FK) | Cliente asociado        |

---

## Tabla: LTYinformes

Informes generados a partir de los dashboards.

| Campo            | Tipo     | Descripción              |
| ---------------- | -------- | ------------------------ |
| idLTYinformes    | INT      | ID del informe           |
| fecha            | DATE     | Fecha de generación      |
| idLTYdashboard   | INT (FK) | Dashboard asociado       |
| idLTYindicadores | INT (FK) | Indicadores usados       |
| detalle          | TEXT     | Descripción o título     |
| activo           | BOOLEAN  | Estado                   |
| tipografico      | VARCHAR  | Tipo de gráfico          |
| visionacumulada  | BOOLEAN  | Indicador de acumulación |
| orden            | INT      | Orden visual             |
| idLTYcliente     | INT (FK) | Cliente asociado         |

## Tabla: LTYarea

Áreas funcionales del sistema, vinculadas a sectores o clientes.

| Campo        | Tipo     | Descripción              |
| ------------ | -------- | ------------------------ |
| idLTYarea    | INT      | ID del área              |
| areax        | VARCHAR  | Nombre del área          |
| activo       | BOOLEAN  | Estado del área          |
| visible      | BOOLEAN  | Indicador de visibilidad |
| idLTYcliente | INT (FK) | Cliente asociado         |

---

## Tabla: Tag_Equipos_PTAC_15

Listado de equipos con clasificación técnica.

| Campo                | Tipo    | Descripción              |
| -------------------- | ------- | ------------------------ |
| centro_planificacion | VARCHAR | Centro o módulo asociado |
| equipo               | VARCHAR | Nombre o tipo de equipo  |
| clasificacion        | VARCHAR | Clasificación del equipo |
| denominacion         | VARCHAR | Denominación técnica     |
| emplazamiento        | VARCHAR | Ubicación o sitio        |

---

## Tabla: log_fallos_login

Registro de intentos fallidos de acceso al sistema.

| Campo     | Tipo     | Descripción                |
| --------- | -------- | -------------------------- |
| id        | INT      | ID del log                 |
| email     | VARCHAR  | Correo usado en el intento |
| planta    | VARCHAR  | Planta o unidad de acceso  |
| ip        | VARCHAR  | Dirección IP del intento   |
| navegador | VARCHAR  | Navegador utilizado        |
| motivo    | TEXT     | Motivo del fallo           |
| fecha     | DATETIME | Fecha y hora del intento   |

---

## Tabla: LTYayuda

Solicitudes de ayuda o soporte por parte del usuario.

| Campo            | Tipo     | Descripción                    |
| ---------------- | -------- | ------------------------------ |
| idLTYayuda       | INT      | ID de la solicitud             |
| fecha_automatica | DATETIME | Fecha generada automáticamente |
| idusuario        | INT (FK) | Usuario solicitante            |
| empresa          | VARCHAR  | Empresa relacionada            |
| nombre           | VARCHAR  | Nombre del contacto            |
| mail             | VARCHAR  | Correo electrónico             |
| ayuda            | TEXT     | Descripción del problema       |
| idLTYcliente     | INT (FK) | Cliente asociado               |

---

## Tabla: email_queue

Cola de correos electrónicos salientes del sistema.

| Campo         | Tipo     | Descripción                          |
| ------------- | -------- | ------------------------------------ |
| id            | INT      | ID del email en cola                 |
| email_address | VARCHAR  | Dirección de correo de destino       |
| subject       | VARCHAR  | Asunto del correo                    |
| body          | TEXT     | Cuerpo del mensaje                   |
| status        | VARCHAR  | Estado (pendiente, enviado, fallido) |
| nx            | INT      | Intentos de envío                    |
| idLTYreporte  | INT (FK) | Reporte relacionado                  |
| idPlant       | INT      | Planta asociada                      |
| created_at    | DATETIME | Fecha de creación                    |
| updated_at    | DATETIME | Fecha de último intento/modificación |

---

## Tabla: LTYregistrocontrol

Registros de control en campo o sistema.

| Campo                | Tipo     | Descripción                      |
| -------------------- | -------- | -------------------------------- |
| idLTYregistrocontrol | INT      | ID del registro                  |
| fecha                | DATE     | Fecha del registro               |
| nuxpedido            | VARCHAR  | Número de pedido relacionado     |
| idusuario            | INT (FK) | Usuario que lo registró          |
| idLTYreporte         | INT (FK) | Reporte asociado                 |
| horaautomatica       | TIME     | Hora generada automáticamente    |
| supervisor           | VARCHAR  | Nombre del supervisor            |
| observacion          | TEXT     | Observaciones adicionales        |
| imagenes             | TEXT     | Ruta o identificador de imágenes |
| idLTYcliente         | INT (FK) | Cliente relacionado              |
| hora                 | TIME     | Hora manual (si aplica)          |
| newJSON              | JSON     | Datos adicionales en JSON        |

## Tabla: LTYindicadores

Indicadores utilizados en los reportes para análisis y visualización.

| Campo            | Tipo     | Descripción                      |
| ---------------- | -------- | -------------------------------- |
| idLTYindicadores | INT      | ID del indicador                 |
| totalizador      | BOOLEAN  | Si agrupa o acumula datos        |
| activo           | BOOLEAN  | Estado del indicador             |
| multicurva       | BOOLEAN  | Si permite múltiples curvas      |
| detalle          | TEXT     | Descripción del indicador        |
| toleranciamayor  | FLOAT    | Tolerancia superior              |
| toleranciamenor  | FLOAT    | Tolerancia inferior              |
| seleccionado     | BOOLEAN  | Si está seleccionado por defecto |
| meta             | FLOAT    | Meta o valor objetivo            |
| dashboard        | BOOLEAN  | Si se muestra en dashboard       |
| ejeY             | BOOLEAN  | Eje Y activado                   |
| ejeX             | BOOLEAN  | Eje X activado                   |
| serie            | VARCHAR  | Nombre de la serie               |
| decimales        | INT      | Cantidad de decimales mostrados  |
| fecha            | DATE     | Fecha de creación                |
| tabla            | VARCHAR  | Tabla fuente                     |
| campo            | VARCHAR  | Campo fuente                     |
| indicador        | VARCHAR  | Nombre técnico                   |
| LTYsql           | TEXT     | SQL personalizado                |
| tablaquery       | TEXT     | Consulta asociada                |
| espemenor        | FLOAT    | Especificación menor             |
| espemayor        | FLOAT    | Especificación mayor             |
| nivel            | INT      | Nivel o prioridad                |
| idLTYcliente     | INT (FK) | Cliente asociado                 |

---

## Tabla: LTYcontrol

Controles definidos dentro de reportes o procesos.

| Campo               | Tipo     | Descripción                         |
| ------------------- | -------- | ----------------------------------- |
| idLTYcontrol        | INT      | ID del control                      |
| control             | VARCHAR  | Código o nombre interno             |
| nombre              | VARCHAR  | Nombre descriptivo                  |
| tipodato            | VARCHAR  | Tipo de dato                        |
| selector            | VARCHAR  | Selector o valor referenciado       |
| detalle             | TEXT     | Descripción detallada               |
| tpdeobserva         | VARCHAR  | Tipo de observación (visualización) |
| selector2           | VARCHAR  | Segundo selector (si aplica)        |
| idLTYreporte        | INT (FK) | Reporte al que pertenece            |
| orden               | INT      | Orden de aparición                  |
| activo              | BOOLEAN  | Estado activo                       |
| visible             | BOOLEAN  | Visibilidad                         |
| ok                  | BOOLEAN  | Aprobado o verificado               |
| separador           | VARCHAR  | Texto de separación                 |
| rutinasql           | TEXT     | SQL personalizado                   |
| valor_defecto       | VARCHAR  | Valor por defecto                   |
| valor_defecto22     | VARCHAR  | Segundo valor por defecto           |
| sql_valor_defecto22 | TEXT     | SQL para segundo valor              |
| valor_sql           | TEXT     | Valor calculado por SQL             |
| requerido           | BOOLEAN  | Campo obligatorio                   |
| tiene_hijo          | BOOLEAN  | Si este control tiene dependientes  |
| rutina_hijo         | TEXT     | SQL del hijo                        |
| enable1             | BOOLEAN  | Activador adicional                 |
| idLTYcliente        | INT (FK) | Cliente asociado                    |
| tipoDatoDetalle     | VARCHAR  | Detalle adicional del tipo de dato  |

---

## Tabla: LTYreporte

Reportes principales generados en el sistema.

| Campo            | Tipo     | Descripción                            |
| ---------------- | -------- | -------------------------------------- |
| idLTYreporte     | INT      | ID del reporte                         |
| nombre           | VARCHAR  | Título del reporte                     |
| detalle          | TEXT     | Descripción del contenido              |
| idLTYcliente     | INT (FK) | Cliente asociado                       |
| idLTYarea        | INT (FK) | Área relacionada                       |
| titulo           | VARCHAR  | Título corto                           |
| rotulo1          | VARCHAR  | Encabezado o sección                   |
| rotulo2          | VARCHAR  | Encabezado o sección adicional         |
| rotulo3          | VARCHAR  | Subtítulo                              |
| rotulo4          | VARCHAR  | Subtítulo adicional                    |
| pieinforme       | TEXT     | Texto al pie del reporte               |
| firma1           | VARCHAR  | Firma 1                                |
| firma2           | VARCHAR  | Firma 2                                |
| firma3           | VARCHAR  | Firma 3                                |
| foto             | VARCHAR  | Ruta de imagen (si tiene)              |
| activo           | BOOLEAN  | Estado activo                          |
| elaboro          | VARCHAR  | Persona que elaboró el reporte         |
| reviso           | VARCHAR  | Revisor                                |
| aprobado         | VARCHAR  | Aprobador                              |
| regdc            | TEXT     | Registro de control                    |
| vigencia         | DATE     | Fecha de vigencia                      |
| cambio           | TEXT     | Descripción de cambios                 |
| modificacion     | DATETIME | Última modificación                    |
| version          | VARCHAR  | Versión del reporte                    |
| soloconsulta     | BOOLEAN  | Modo solo lectura                      |
| frecuencia       | VARCHAR  | Frecuencia (diaria, mensual, etc.)     |
| testimado        | VARCHAR  | Tiempo estimado                        |
| asignado         | VARCHAR  | Asignado a                             |
| nivel            | INT      | Nivel de prioridad                     |
| botonesaccion    | TEXT     | Configuración de botones               |
| envio_mail       | BOOLEAN  | Si se envía por correo automáticamente |
| direcciones_mail | TEXT     | Correos a los que se envía             |

## Tabla: LTYreporte_raci

Relación entre reportes y usuarios con asignación de roles según la matriz RACI.

Esta tabla permite definir responsabilidades específicas de los usuarios en relación a un reporte. Se utiliza para determinar quién debe realizar acciones (R), quién toma decisiones (A), quién debe ser consultado (C) y quién debe ser informado (I).

| Campo             | Tipo                                | Descripción                                                           |
| ----------------- | ----------------------------------- | --------------------------------------------------------------------- |
| idLTYreporte_raci | INT                                 | Identificador único del registro                                      |
| idLTYreporte      | INT (FK → LTYreporte)               | Reporte al cual se asigna el rol                                      |
| idusuario         | INT (FK → usuario)                  | Usuario que tiene el rol asignado                                     |
| rol               | ENUM('R','A','C','I')               | Tipo de rol asignado:                                                 |
|                   |                                     | - **R**: Responsible – ejecuta la tarea                               |
|                   |                                     | - **A**: Accountable – toma la decisión final                         |
|                   |                                     | - **C**: Consulted – debe ser consultado                              |
|                   |                                     | - **I**: Informed – debe ser informado                                |
| activo            | ENUM('S','N') DEFAULT 'S'           | Indica si la asignación está activa ('S') o ha sido desactivada ('N') |
| fecha_asignacion  | TIMESTAMP DEFAULT CURRENT_TIMESTAMP | Fecha en la que se asignó el rol                                      |
| fecha_baja        | TIMESTAMP NULL DEFAULT NULL         | Fecha en la que se desactivó el rol (si aplica)                       |

### Reglas de integridad:

- Un reporte puede tener múltiples usuarios asociados con distintos roles.
- Un usuario puede tener un solo rol activo por reporte.
- Las relaciones inactivas se conservan para auditoría histórica.

---

🔎 Esta tabla permite implementar lógica condicional para el envío de notificaciones o visualización de contenido, dependiendo del tipo de rol asignado. Por ejemplo:

- **I** → Email con solo el encabezado.
- **R/C/A** → Email completo con acciones requeridas.

## Arquitectura de carpetas

El sistema está organizado en módulos funcionales dentro de la carpeta `/Pages/`, mientras que la lógica de negocio y acceso a datos se encuentra separada en `/controllers/` y `/models/`.

Las rutas de acceso principales se definen en `index.php`, que actúa como punto de entrada único.

Dependencias y configuración adicional se encuentran en:

- `.env`, `config.php`: configuración de entorno y base de datos.
- `package.json`, `composer.json`: dependencias JS y PHP.

📁 / (raíz del proyecto)
├── assets/ → Recursos estáticos (imágenes, estilos, etc.)
├── controllers/ → Controladores de lógica de negocio
├── includes/ → Archivos PHP incluidos globalmente
├── libraries/ → Bibliotecas externas o internas auxiliares
├── logs/ → Archivos de log (registro de errores, acciones)
├── models/ → Modelos de datos (acceso a BD)
├── Nodemailer/ → Módulo de envío de correos (Node.js)
├── Pages/ → Vistas y componentes funcionales del frontend
├── resources/ → Recursos compartidos, helpers
├── Routes/ → Definición de rutas (posiblemente para API o Vue/React si aplica)
├── vendor/ → Dependencias de Composer (autogenerado)
├── z*hosting/ → Archivos específicos para despliegue/hosting (¿temporal?)
│
├── .env → Configuración de entorno
├── .eslintrc.* → Reglas ESLint (JS linting)
├── .gitignore → Archivos ignorados por Git
├── .htaccess → Configuración de Apache
├── index.php → Punto de entrada principal (Front Controller)
├── config.php → Configuración global del sistema
├── configOLD.php → Copia vieja, dejala ir ya...
├── dirs*OLD.php → Archivos que deberían estar en `/trash/`
├── ErrorLogger.php → Manejo personalizado de errores
├── phpinfo.php → Archivo de diagnóstico PHP
├── session_config.php → Configuración de sesión
├── README.md → Documentación del sistema
├── cambios.txt → Cambios históricos (tipo changelog en TXT)
├── Bitácora.docx → Documento con bugs o seguimiento externo
├── package*.json → Configuración de Node.js
├── composer.\* → Dependencias PHP
├── test.php → Archivos de prueba rápida (¡sospechoso!)

📁 Pages/
├── Admin/ → Páginas de administración
├── Api/ → Páginas/archivos vinculados a endpoints API
├── AuthUser/ → Módulo de autenticación de usuarios
├── client15/, client28/ → Interfaces o configuraciones para clientes específicos
├── Consultas/ → Formularios de búsqueda o query
├── ConsultasViews/ → Vistas para mostrar resultados de consulta
├── Control/, Controles/ → Módulos de carga/edición de controles
├── ControlesDiarios/ → Formatos de control diario
├── ControlsView/ → Visualización de controles (reporte o detalle)
├── Home/ → Página principal o dashboard
├── Landing/ → Página de bienvenida/inicio
├── ListAreas/ → Listado de áreas
├── ListControles/ → Listado de controles disponibles
├── ListReportes/ → Listado de reportes disponibles
├── ListVariables/ → Variables asociadas a los reportes/control
├── Login/ → Página de login
├── Menu/ → Página con menú principal o lateral
├── QR/ → Módulo QR (generación o escaneo)
├── RecoveryPass/ → Recuperación de contraseña
├── RegisterPlant/ → Registro de plantas
├── RegisterUser/ → Registro de usuarios nuevos
├── Router/ → Control de navegación por rutas
├── Rove_OLD/ → Versión anterior de algo, nadie lo toca pero nadie lo borra
├── Sadmin/ → Posible super admin / configuración avanzada

## 🛍️ Flujo de Usuario y Experiencia de Uso (UX)

La aplicación está diseñada con un enfoque de **navegación progresiva e intuitiva**, permitiendo que distintos tipos de usuarios accedan a sus funciones sin requerir entrenamiento técnico ni conocimiento profundo de la estructura interna del sistema. A continuación, se describe el flujo de uso principal y la lógica detrás de la interfaz.

---

### 👥 Tipos de Usuario

El sistema contempla **cuatro roles clave**, cada uno con accesos y funciones específicas:

| Rol             | Funciones principales                                                                                                                                                  |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Super Admin** | - Autoriza nuevos usuarios<br>- Da de alta nuevos clientes                                                                                                             |
| **Admin**       | - Configura reportes, áreas, variables<br>- Asigna controles a reportes<br>- Crea y mantiene la matriz RACI<br>- Establece qué reportes se envían por correo y a quién |
| **Colaborador** | - Navega por jerarquía organizacional hasta los controles asignados<br>- Completa información operativa según protocolos                                               |
| **Supervisor**  | - Accede a todos los controles<br>- Puede realizar consultas operativas y administrativas desde el SCG                                                                 |

---

### 🔐 Inicio de Sesión y Registro

1. El usuario previamente autorizado por un **Super Admin** recibe acceso a la app.
2. Se registra y valida su cuenta.
3. Accede a la pantalla de login (ver imagen 1).
4. Una vez validado, el sistema lo dirige al menú principal.

> 📸 **Pantalla 1** → Login
> 📸 **Pantalla 2** → Menú principal de navegación por función

---

### 🛍️ Navegación por Jerarquía Organizacional

El sistema permite al usuario avanzar progresivamente por:

- Gerencia
  ↓
- Sector
  ↓
- Reporte / Control

Esta estructura está pensada para usuarios operativos como los **colaboradores**, que no requieren saber nombres de reportes o formatos: solo deben conocer su lugar dentro de la organización y avanzar por los botones hasta llegar a su tarea.

> 📸 **Pantalla 3-5** → Navegación jerárquica hasta llegar al control operativo deseado
> 📸 **Pantalla 6** → Formulario de control operativo (campos a completar)

---

### 📋 Uso de Controles (Operaciones Diarias)

- Cada **control** corresponde a un reporte/formulario a completar.
- Los campos del control se presentan de forma clara y editable.
- Una vez completados, los datos se almacenan para ser utilizados por supervisores y administradores.

---

### 📂 Consultas y Reportes

Usuarios con nivel **Supervisor o superior** acceden al **SCG**, donde pueden:

- Consultar registros históricos.
- Ver formularios completados.
- Navegar hasta controles específicos.
- Exportar o analizar la información.

> 📸 **Pantalla 7-11** → Acceso a funciones de consulta SCG, selección de cliente, vista de reportes detallados

---

### 🧠 Funciones Administrativas Adicionales

- **Admins** pueden configurar:

  - Nuevos controles.
  - Variables asociadas.
  - RACI por reporte (quién recibe qué).
  - Áreas y jerarquías.

- **Exportación de datos** y otros módulos administrativos se encuentran disponibles desde menús especiales, según el rol.

---

### 📬 Matriz RACI y Notificaciones

- Al configurar un reporte, los **Admins** asignan usuarios con roles RACI (Responsible, Accountable, Consulted, Informed).
- Cuando se genera un nuevo reporte, el sistema determina:

  - Quién debe recibir un correo electrónico.
  - Qué tipo de contenido recibir (resumen o contenido completo).

- Esto permite una automatización clara de responsabilidades.

---

## 👩‍💻 Experiencia de Usuario

El sistema fue diseñado bajo principios de **simplicidad visual**, **jerarquía funcional clara** y **mínima fricción operativa**.

- ✅ No se requiere conocimiento técnico para completar tareas.
- ✅ Los usuarios colaborativos solo navegan con botones y etiquetas amigables.
- ✅ Los administradores y supervisores tienen acceso a herramientas más potentes, pero igual de directas.
- ✅ El sistema se adapta a múltiples clientes y estructuras internas distintas.
