#!/usr/bin/env pwsh

# Script final para migrar archivos específicos que aún tienen headers hardcodeados
Write-Host "=== Migración Final de Headers Hardcodeados ===" -ForegroundColor Green

$pagesDir = "c:\DATOS\04.DESARROLLOS\test-tenkiweb\tcontrol\Pages"

# Función para procesar archivos individuales
function Update-File {
    param($RelativePath)
    
    $fullPath = Join-Path $pagesDir $RelativePath
    if (-not (Test-Path $fullPath)) {
        Write-Host "❌ Archivo no encontrado: $RelativePath" -ForegroundColor Red
        return
    }
    
    Write-Host "Procesando: $RelativePath" -ForegroundColor Cyan
    
    try {
        $content = Get-Content $fullPath -Raw -Encoding UTF8
        $originalContent = $content
        
        # Crear backup
        $backupPath = $fullPath + ".backup"
        if (-not (Test-Path $backupPath)) {
            Copy-Item $fullPath $backupPath
        }
        
        # Buscar y eliminar headers específicos
        $headersToRemove = @(
            'if \(session_status\(\) == PHP_SESSION_NONE\) \{\s*session_start\(\);\s*\};',
            'header\([''"]Content-Type: text/html;charset=utf-8[''"] ?\);',
            '\$nonce = base64_encode\(random_bytes\(16\)\);',
            'header\([''"]Content-Security-Policy:[^"]*[''"] ?\);',
            'header\([''"]Strict-Transport-Security:[^"]*[''"] ?\);',
            'header\([''"]X-Content-Type-Options:[^"]*[''"] ?\);',
            'header\([''"]X-Frame-Options:[^"]*[''"] ?\);',
            'header\([''"]X-XSS-Protection:[^"]*[''"] ?\);',
            'header\([''"]Access-Control-Allow-Origin:[^"]*[''"] ?\);',
            'header\([''"]Access-Control-Allow-Methods:[^"]*[''"] ?\);',
            'header\([''"]Access-Control-Allow-Headers:[^"]*[''"] ?\);',
            'header\([''"]Access-Control-Allow-Credentials:[^"]*[''"] ?\);'
        )
        
        # Eliminar cada tipo de header
        foreach ($headerPattern in $headersToRemove) {
            $content = $content -replace $headerPattern, ''
        }
        
        # Limpiar líneas vacías múltiples
        $content = $content -replace '(\r?\n\s*){3,}', "`r`n`r`n"
        
        # Agregar las funciones helper al inicio después de los comentarios iniciales
        $requirePattern = 'require_once dirname\(dirname\(__DIR__\)\) \. [''"]\/ErrorLogger\.php[''"];'
        if ($content -match $requirePattern) {
            $replacement = @'
// Configurar headers de seguridad y sesión usando funciones helper
require_once dirname(dirname(__DIR__)) . '/config.php';
startSecureSession();
$nonce = setSecurityHeaders();

require_once dirname(dirname(__DIR__)) . '/ErrorLogger.php';
'@
            $content = $content -replace $requirePattern, $replacement
        } else {
            # Si no hay ErrorLogger, agregar al inicio después de los comentarios
            $phpOpenTag = '<\?php'
            $replacement = @'
<?php
// Configurar headers de seguridad y sesión usando funciones helper
require_once dirname(dirname(__DIR__)) . '/config.php';
startSecureSession();
$nonce = setSecurityHeaders();
'@
            $content = $content -replace $phpOpenTag, $replacement
        }
        
        # Verificar si hubo cambios
        if ($content -ne $originalContent) {
            Set-Content -Path $fullPath -Value $content -Encoding UTF8 -NoNewline
            Write-Host "  ✅ Migrado exitosamente" -ForegroundColor Green
            return $true
        } else {
            Write-Host "  ⚠️  Sin cambios detectados" -ForegroundColor Yellow
            return $false
        }
        
    } catch {
        Write-Host "  ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Lista de archivos a procesar
$filesToProcess = @(
    "AuthUser\index.php",
    "RecoveryPass\index.php", 
    "RegisterPlant\index.php",
    "RegisterUser\index.php",
    "ListAreas\index.php",
    "ListAreas\areas.php",
    "ListComunicacion\index.php"
)

$successCount = 0
foreach ($file in $filesToProcess) {
    if (Update-File -RelativePath $file) {
        $successCount++
    }
}

Write-Host "`n=== Resumen ===" -ForegroundColor Green
Write-Host "Archivos procesados exitosamente: $successCount de $($filesToProcess.Count)" -ForegroundColor Green

# Verificación final
Write-Host "`n=== Verificación Final ===" -ForegroundColor Green
$remainingFiles = Get-ChildItem -Path $pagesDir -Recurse -Filter "*.php" | Where-Object {
    $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue
    if ($content) {
        return $content -match 'header\([''"]X-Content-Type-Options'
    }
    return $false
}

Write-Host "Archivos restantes con headers hardcodeados: $($remainingFiles.Count)" -ForegroundColor $(if ($remainingFiles.Count -eq 0) { "Green" } else { "Yellow" })
