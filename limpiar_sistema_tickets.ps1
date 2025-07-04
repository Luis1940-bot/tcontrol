# ==========================================
# SCRIPT DE LIMPIEZA - SISTEMA DE TICKETS
# ==========================================
# Fecha: 3 de julio de 2025
# Proposito: Limpiar archivos innecesarios y organizar para produccion

Write-Host "INICIANDO LIMPIEZA DEL SISTEMA DE TICKETS" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

# Directorio base
$ticketsDir = "Pages\Admin\Tickets"
$backupDir = "_backup_limpieza_" + (Get-Date -Format "yyyyMMdd_HHmmss")

Write-Host "Directorio: $ticketsDir" -ForegroundColor Yellow
Write-Host "Backup en: $backupDir" -ForegroundColor Yellow

# Crear directorio de backup
if (!(Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    Write-Host "✅ Directorio de backup creado" -ForegroundColor Green
}

# Archivos PRINCIPALES a mantener
$archivosPrincipales = @(
    "index.php",
    "lista.php", 
    "detalle.php",
    "estadisticas.php",
    "reportes.php",
    "README.md"
)

Write-Host "🎯 ARCHIVOS PRINCIPALES A MANTENER:" -ForegroundColor Cyan
$archivosPrincipales | ForEach-Object { Write-Host "   ✅ $_" -ForegroundColor Green }

# Archivos para ELIMINAR (hacer backup primero)
$archivosParaEliminar = @(
    # Backups y versiones anteriores
    "detalle_fixed.php",
    "detalle_old.php", 
    "detalle_quirks_backup.php",
    "detalle_simple.php",
    "index.php.backup",
    "index_backup.php",
    "index_backup_bootstrap.php",
    "index_backup_original.php",
    "index_clean.php",
    "index_corregido.php",
    "index_final.php",
    "index_minimal.php",
    "index_nuevo.php",
    "index_problematico.php",
    "index_simplificado.php",
    "lista_backup.php",
    "lista_backup_original.php",
    "lista_backup_problematico.php",
    "lista_nueva.php",
    "lista_simple.php",
    "estadisticas_nuevo.php",
    "estadisticas_problemático.php",
    "reportes_problematico.php",
    
    # Archivos de testing y debug
    "debug_estadisticas.php",
    "debug_index_flow.php",
    "debug_quirks.php",
    "diagnose_lista_bd.php",
    "diagnostico_bd.php",
    "diagnostico_completo.php",
    "diagnostico_datos.php",
    "diagnostico_index.php",
    "diagnostico_quirks.php",
    "diagnostico_recursos.php",
    "diagnostico_urls.php",
    "test_basico.php",
    "test_carga_lista.php",
    "test_conexion_lista.php",
    "test_consulta_corregida.php",
    "test_corrected_index.php",
    "test_detalle_quirks.php",
    "test_final_system.php",
    "test_lista.php",
    "test_simple_stats.php",
    "test_stats_index.php",
    "test_stats_visual.html",
    
    # Archivos de verificación
    "verificacion_completa.html",
    "verificacion_final.php",
    "verificacion_final_estadisticas.php",
    "verificacion_final_lista.php",
    "verificar_estructura.php",
    "verificar_quirks.html",
    "resumen_final.html",
    "sistema_unificado.php",
    "SOLUCION_COMPLETADA.md",
    "SOLUCION_DEFINITIVA.md",
    "SOLUCION_FINAL_APLICADA.md",
    
    # Archivos obsoletos
    "configuracion.php",
    "favicon.ico"
)

Write-Host ""
Write-Host "🗑️ ARCHIVOS PARA ELIMINAR:" -ForegroundColor Red
$contadorEliminados = 0

foreach ($archivo in $archivosParaEliminar) {
    $rutaCompleta = Join-Path $ticketsDir $archivo
    
    if (Test-Path $rutaCompleta) {
        # Hacer backup del archivo antes de eliminar
        $rutaBackup = Join-Path $backupDir $archivo
        
        try {
            Copy-Item $rutaCompleta $rutaBackup -Force
            Remove-Item $rutaCompleta -Force
            Write-Host "   ❌ $archivo (backup ✅)" -ForegroundColor Yellow
            $contadorEliminados++
        }
        catch {
            Write-Host "   ⚠️ Error eliminando $archivo : $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "📊 RESUMEN DE LIMPIEZA:" -ForegroundColor Cyan
Write-Host "   🗑️ Archivos eliminados: $contadorEliminados" -ForegroundColor Yellow
Write-Host "   💾 Backup creado en: $backupDir" -ForegroundColor Green

# Verificar archivos restantes
Write-Host ""
Write-Host "📁 ARCHIVOS RESTANTES EN $ticketsDir :" -ForegroundColor Cyan

$archivosRestantes = Get-ChildItem $ticketsDir -File | Select-Object -ExpandProperty Name
foreach ($archivo in $archivosRestantes) {
    if ($archivo -in $archivosPrincipales) {
        Write-Host "   ✅ $archivo" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️ $archivo (revisar manualmente)" -ForegroundColor Yellow
    }
}

# Verificar directorio api
$apiDir = Join-Path $ticketsDir "api"
if (Test-Path $apiDir) {
    Write-Host ""
    Write-Host "📂 DIRECTORIO API ENCONTRADO:" -ForegroundColor Yellow
    Write-Host "   ⚠️ Revisar contenido de '$apiDir' manualmente" -ForegroundColor Yellow
    Write-Host "   ❓ ¿Conservar o eliminar? (revisar después)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎯 ESTRUCTURA FINAL PARA PRODUCCIÓN:" -ForegroundColor Green
Write-Host "Pages/Admin/Tickets/" -ForegroundColor White
Write-Host "├── index.php           ← Panel principal" -ForegroundColor Green
Write-Host "├── lista.php           ← Lista de tickets" -ForegroundColor Green  
Write-Host "├── detalle.php         ← Detalle del ticket" -ForegroundColor Green
Write-Host "├── estadisticas.php    ← Estadísticas" -ForegroundColor Green
Write-Host "├── reportes.php        ← Reportes" -ForegroundColor Green
Write-Host "└── README.md           ← Documentación" -ForegroundColor Green

Write-Host ""
Write-Host "✅ LIMPIEZA COMPLETADA!" -ForegroundColor Green
Write-Host "💡 Próximos pasos:" -ForegroundColor Cyan
Write-Host "   1. Probar sistema completo una vez más" -ForegroundColor White
Write-Host "   2. Verificar que no hay errores" -ForegroundColor White
Write-Host "   3. Preparar para deployment a producción" -ForegroundColor White
Write-Host "   4. Si todo funciona, eliminar directorio backup" -ForegroundColor White

Write-Host ""
Write-Host "🚀 Sistema listo para producción!" -ForegroundColor Green
