# Script para limpiar archivos backup generados durante la migración
Write-Host "=== LIMPIEZA DE ARCHIVOS BACKUP ===" -ForegroundColor Cyan

# Buscar todos los archivos .backup en la carpeta Pages/
$backupFiles = Get-ChildItem -Path "Pages\" -Filter "*.backup" -Recurse

if ($backupFiles.Count -eq 0) {
    Write-Host "No se encontraron archivos backup para limpiar." -ForegroundColor Green
    exit 0
}

Write-Host "Se encontraron $($backupFiles.Count) archivos backup:" -ForegroundColor Yellow
foreach ($file in $backupFiles) {
    Write-Host "  - $($file.FullName)" -ForegroundColor White
}

$confirm = Read-Host "`n¿Desea eliminar todos los archivos backup? (y/N)"

if ($confirm -eq "y" -or $confirm -eq "Y") {
    Write-Host "`nEliminando archivos backup..." -ForegroundColor Yellow
    
    foreach ($file in $backupFiles) {
        try {
            Remove-Item $file.FullName -Force
            Write-Host "  ✅ Eliminado: $($file.Name)" -ForegroundColor Green
        }
        catch {
            Write-Host "  ❌ Error eliminando: $($file.Name) - $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    Write-Host "`n✅ Limpieza completada." -ForegroundColor Green
} else {
    Write-Host "`nLimpieza cancelada. Los archivos backup se mantienen." -ForegroundColor Yellow
}
