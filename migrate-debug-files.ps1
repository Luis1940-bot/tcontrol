# Script para migrar archivos de debug restantes
Write-Host "=== MIGRACION DE ARCHIVOS DE DEBUG ===" -ForegroundColor Cyan

$debugFiles = @(
    "Pages\Control\debug_tools\debug_index_exact.php",
    "Pages\Control\debug_tools\debug_index_output.php",
    "Pages\Control\debug_tools\eliminar_index.php"
)

foreach ($file in $debugFiles) {
    $fullPath = Join-Path $PWD $file
    
    if (Test-Path $fullPath) {
        Write-Host "Procesando: $file" -ForegroundColor Yellow
        
        # Leer contenido actual
        $content = Get-Content $fullPath -Raw
        
        # Patrón para encontrar los headers hardcodeados en archivos de debug
        $pattern = '(?s)(session_start\(\);\s*}\s*.*?)(\$nonce\s*=\s*base64_encode.*?)(\s*header\("Access-Control-Allow-Credentials: true"\);)'
        
        # Verificar si tiene los headers hardcodeados
        if ($content -match $pattern) {
            Write-Host "  - Migrando headers..." -ForegroundColor Green
            
            # Crear backup
            Copy-Item $fullPath "$fullPath.backup"
            
            # Reemplazar el bloque completo de headers
            $replacement = "`startSecureSession();`n`$nonce = setSecurityHeaders();"
            $newContent = $content -replace $pattern, $replacement
            
            # También agregar require de config.php si no existe
            if ($newContent -notmatch "require_once.*config\.php") {
                $newContent = $newContent -replace "(<\?php.*?)", "`$1`nrequire_once dirname(dirname(dirname(__FILE__))) . '/config.php';"
            }
            
            # Guardar archivo modificado
            Set-Content -Path $fullPath -Value $newContent -Encoding UTF8
            Write-Host "  - ✅ Migrado exitosamente" -ForegroundColor Green
        } else {
            Write-Host "  - ⚠️ No se encontraron headers para migrar" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  - ❌ Archivo no encontrado: $file" -ForegroundColor Red
    }
}

Write-Host "`n=== VERIFICACION POST-MIGRACION ===" -ForegroundColor Cyan
# Ejecutar verificación final
& ".\verify-migration-status.ps1"
