# Script de limpieza simple
Write-Host "Iniciando limpieza del sistema de tickets..." -ForegroundColor Green

$ticketsDir = "Pages\Admin\Tickets"
$backupDir = "_backup_" + (Get-Date -Format "yyyyMMdd_HHmm")

# Crear backup
if (!(Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    Write-Host "Directorio backup creado: $backupDir" -ForegroundColor Yellow
}

# Archivos a eliminar
$archivos = @(
    "detalle_fixed.php", "detalle_old.php", "detalle_quirks_backup.php", "detalle_simple.php",
    "index.php.backup", "index_backup.php", "index_backup_bootstrap.php", "index_backup_original.php",
    "index_clean.php", "index_corregido.php", "index_final.php", "index_minimal.php",
    "index_nuevo.php", "index_problematico.php", "index_simplificado.php",
    "lista_backup.php", "lista_backup_original.php", "lista_backup_problematico.php",
    "lista_nueva.php", "lista_simple.php", "estadisticas_nuevo.php", "estadisticas_problematico.php",
    "reportes_problematico.php", "debug_estadisticas.php", "debug_index_flow.php", "debug_quirks.php",
    "diagnose_lista_bd.php", "diagnostico_bd.php", "diagnostico_completo.php", "diagnostico_datos.php",
    "diagnostico_index.php", "diagnostico_quirks.php", "diagnostico_recursos.php", "diagnostico_urls.php",
    "test_basico.php", "test_carga_lista.php", "test_conexion_lista.php", "test_consulta_corregida.php",
    "test_corrected_index.php", "test_detalle_quirks.php", "test_final_system.php", "test_lista.php",
    "test_simple_stats.php", "test_stats_index.php", "test_stats_visual.html",
    "verificacion_completa.html", "verificacion_final.php", "verificacion_final_estadisticas.php",
    "verificacion_final_lista.php", "verificar_estructura.php", "verificar_quirks.html",
    "resumen_final.html", "sistema_unificado.php", "SOLUCION_COMPLETADA.md",
    "SOLUCION_DEFINITIVA.md", "SOLUCION_FINAL_APLICADA.md", "configuracion.php", "favicon.ico"
)

$eliminados = 0
foreach ($archivo in $archivos) {
    $ruta = Join-Path $ticketsDir $archivo
    if (Test-Path $ruta) {
        # Backup
        Copy-Item $ruta (Join-Path $backupDir $archivo) -Force
        # Eliminar
        Remove-Item $ruta -Force
        Write-Host "Eliminado: $archivo" -ForegroundColor Red
        $eliminados++
    }
}

Write-Host "Limpieza completada!" -ForegroundColor Green
Write-Host "Archivos eliminados: $eliminados" -ForegroundColor Yellow
Write-Host "Backup en: $backupDir" -ForegroundColor Yellow

# Mostrar archivos restantes
Write-Host "Archivos restantes:" -ForegroundColor Cyan
Get-ChildItem $ticketsDir -File | Select-Object Name
