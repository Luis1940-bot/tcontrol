# 🧹 PLAN DE LIMPIEZA - SISTEMA DE TICKETS

## 📁 ARCHIVOS PRINCIPALES (MANTENER)

```
✅ index.php              - Panel principal
✅ lista.php              - Lista de tickets
✅ detalle.php            - Detalle del ticket
✅ estadisticas.php       - Estadísticas del sistema
✅ reportes.php           - Reportes y exportación
✅ README.md              - Documentación
```

## 🗑️ ARCHIVOS PARA ELIMINAR (SEGUROS)

### Backups y versiones anteriores:

```
❌ detalle_fixed.php
❌ detalle_old.php
❌ detalle_quirks_backup.php
❌ detalle_simple.php
❌ index.php.backup
❌ index_backup.php
❌ index_backup_bootstrap.php
❌ index_backup_original.php
❌ index_clean.php
❌ index_corregido.php
❌ index_final.php
❌ index_minimal.php
❌ index_nuevo.php
❌ index_problematico.php
❌ index_simplificado.php
❌ lista_backup.php
❌ lista_backup_original.php
❌ lista_backup_problematico.php
❌ lista_nueva.php
❌ lista_simple.php
❌ estadisticas_nuevo.php
❌ estadisticas_problemático.php
❌ reportes_problematico.php
```

### Archivos de testing y debug:

```
❌ debug_estadisticas.php
❌ debug_index_flow.php
❌ debug_quirks.php
❌ diagnose_lista_bd.php
❌ diagnostico_bd.php
❌ diagnostico_completo.php
❌ diagnostico_datos.php
❌ diagnostico_index.php
❌ diagnostico_quirks.php
❌ diagnostico_recursos.php
❌ diagnostico_urls.php
❌ test_basico.php
❌ test_carga_lista.php
❌ test_conexion_lista.php
❌ test_consulta_corregida.php
❌ test_corrected_index.php
❌ test_detalle_quirks.php
❌ test_final_system.php
❌ test_lista.php
❌ test_simple_stats.php
❌ test_stats_index.php
❌ test_stats_visual.html
```

### Archivos de verificación y documentación temporal:

```
❌ verificacion_completa.html
❌ verificacion_final.php
❌ verificacion_final_estadisticas.php
❌ verificacion_final_lista.php
❌ verificar_estructura.php
❌ verificar_quirks.html
❌ resumen_final.html
❌ sistema_unificado.php
❌ SOLUCION_COMPLETADA.md
❌ SOLUCION_DEFINITIVA.md
❌ SOLUCION_FINAL_APLICADA.md
```

### Archivos obsoletos:

```
❌ configuracion.php      - No se usa
❌ favicon.ico           - Icono inline implementado
```

## 📂 DIRECTORIO API

```
⚠️ api/ - Revisar contenido antes de eliminar
```

## 🚀 ESTRUCTURA FINAL LIMPIA

```
Pages/Admin/Tickets/
├── index.php           ← Panel principal
├── lista.php           ← Lista de tickets
├── detalle.php         ← Detalle del ticket
├── estadisticas.php    ← Estadísticas
├── reportes.php        ← Reportes
└── README.md           ← Documentación
```

## 📤 ARCHIVOS PARA PRODUCCIÓN

Solo estos 5 archivos principales:

1. `index.php`
2. `lista.php`
3. `detalle.php`
4. `estadisticas.php`
5. `reportes.php`

## ⚠️ RECOMENDACIONES

### Antes de eliminar:

1. **Hacer backup completo** del directorio actual
2. **Probar sistema completo** una vez más
3. **Verificar que no hay referencias** a archivos que vamos a eliminar

### Para producción:

1. **Subir solo los 5 archivos principales**
2. **Configurar datos_base.php** con credenciales de producción
3. **Verificar permisos** de directorios y archivos
4. **Probar funcionalidad completa** en entorno de producción

---

**Fecha:** 3 de julio de 2025
**Objetivo:** Sistema limpio y listo para producción
