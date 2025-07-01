#!/usr/bin/env pwsh

# Script para migrar todos los archivos PHP restantes en Pages/ que tengan headers hardcodeados
# Este script busca y reemplaza los patrones de headers hardcodeados por las funciones helper

Write-Host "Iniciando migración de headers hardcodeados en Pages/" -ForegroundColor Green

# Obtener todos los archivos PHP en Pages/ que contengan headers hardcodeados
$pagesDir = "c:\DATOS\04.DESARROLLOS\test-tenkiweb\tcontrol\Pages"
$phpFiles = Get-ChildItem -Path $pagesDir -Recurse -Filter "*.php" | Where-Object {
    $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue
    if ($content) {
        # Buscar patrones de headers hardcodeados
        return $content -match 'header\("Content-Security-Policy' -or 
               $content -match 'header\("X-Content-Type-Options' -or
               $content -match 'header\("Strict-Transport-Security' -or
               $content -match 'header\("Access-Control-Allow-Origin'
    }
    return $false
}

Write-Host "Archivos encontrados con headers hardcodeados: $($phpFiles.Count)" -ForegroundColor Yellow

foreach ($file in $phpFiles) {
    Write-Host "Procesando: $($file.FullName)" -ForegroundColor Cyan
    
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Patrón para detectar el bloque de headers hardcodeados
    $headerPattern = @'
(?s)header\('Content-Type: text/html;charset=utf-8'\);\s*
\$nonce\s*=\s*base64_encode\(random_bytes\(16\)\);\s*
header\("Content-Security-Policy:.*?\);\s*
(?:header\("Strict-Transport-Security:.*?\);\s*)?
header\("X-Content-Type-Options:.*?\);\s*
header\("X-Frame-Options:.*?\);\s*
header\("X-XSS-Protection:.*?\);\s*
header\("Access-Control-Allow-Origin:.*?\);\s*
header\("Access-Control-Allow-Methods:.*?\);\s*
header\("Access-Control-Allow-Headers:.*?\);\s*
header\("Access-Control-Allow-Credentials:.*?\);\s*
'@
    
    # Reemplazar con las funciones helper
    $replacement = @'
// Configurar headers de seguridad usando función helper
$nonce = setSecurityHeaders();

'@
    
    # Aplicar el reemplazo usando regex
    $content = $content -replace $headerPattern, $replacement
    
    # También buscar y reemplazar patrones de session_start individuales
    $sessionPattern = @'
(?s)if\s*\(\s*session_status\(\)\s*==\s*PHP_SESSION_NONE\s*\)\s*\{\s*
\s*session_start\(\);\s*
\};\s*
'@
    
    $sessionReplacement = @'
// Iniciar sesión segura usando función helper
startSecureSession();

'@
    
    $content = $content -replace $sessionPattern, $sessionReplacement
    
    # Verificar si hubo cambios
    if ($content -ne $originalContent) {
        # Hacer backup del archivo original
        $backupPath = $file.FullName + ".backup"
        if (-not (Test-Path $backupPath)) {
            Copy-Item $file.FullName $backupPath
        }
        
        # Guardar el archivo modificado
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
        Write-Host "  ✅ Migrado exitosamente" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  No se detectaron patrones para migrar" -ForegroundColor Yellow
    }
}

Write-Host "`nMigración completada. Se procesaron $($phpFiles.Count) archivos." -ForegroundColor Green
Write-Host "Los archivos originales fueron respaldados con extensión .backup" -ForegroundColor Gray
