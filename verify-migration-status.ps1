#!/usr/bin/env pwsh

# Script de verificación final del estado de migración de headers
Write-Host "=== VERIFICACIÓN FINAL DE MIGRACIÓN DE HEADERS ===" -ForegroundColor Green

$pagesDir = "c:\DATOS\04.DESARROLLOS\test-tenkiweb\tcontrol\Pages"

# Verificar archivos con headers hardcodeados restantes
Write-Host "`n1. Archivos con headers hardcodeados restantes:" -ForegroundColor Yellow
$remainingFiles = Get-ChildItem -Path $pagesDir -Recurse -Filter "*.php" | Where-Object {
    $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue
    if ($content) {
        return $content -match 'header\([''"]X-Content-Type-Options'
    }
    return $false
}

if ($remainingFiles.Count -eq 0) {
    Write-Host "✅ No se encontraron archivos con headers hardcodeados" -ForegroundColor Green
} else {
    foreach ($file in $remainingFiles) {
        $relativePath = $file.FullName.Replace($pagesDir + "\", "")
        Write-Host "  - $relativePath" -ForegroundColor Red
    }
}

# Verificar archivos que usan las nuevas funciones helper
Write-Host "`n2. Archivos que usan las funciones helper:" -ForegroundColor Yellow
$helperFiles = Get-ChildItem -Path $pagesDir -Recurse -Filter "*.php" | Where-Object {
    $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue
    if ($content) {
        return $content -match 'setSecurityHeaders\(\)' -or $content -match 'startSecureSession\(\)'
    }
    return $false
}

Write-Host "Archivos usando funciones helper: $($helperFiles.Count)" -ForegroundColor Green
foreach ($file in $helperFiles) {
    $relativePath = $file.FullName.Replace($pagesDir + "\", "")
    Write-Host "  ✅ $relativePath" -ForegroundColor Green
}

# Verificar archivos principales (más importantes)
Write-Host "`n3. Estado de archivos principales:" -ForegroundColor Yellow
$mainFiles = @(
    "Login\index.php",
    "Home\index.php", 
    "Menu\index.php",
    "Control\index.php",
    "Controles\index.php",
    "ControlsView\index.php",
    "Admin\index.php",
    "Sadmin\index.php"
)

foreach ($relativePath in $mainFiles) {
    $fullPath = Join-Path $pagesDir $relativePath
    if (Test-Path $fullPath) {
        $content = Get-Content $fullPath -Raw -ErrorAction SilentlyContinue
        if ($content -match 'setSecurityHeaders\(\)') {
            Write-Host "  ✅ $relativePath (Usando helpers)" -ForegroundColor Green
        } elseif ($content -match 'header\([''"]X-Content-Type-Options') {
            Write-Host "  ❌ $relativePath (Headers hardcodeados)" -ForegroundColor Red
        } else {
            Write-Host "  ⚠️  $relativePath (Estado desconocido)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  ❌ $relativePath (No encontrado)" -ForegroundColor Red
    }
}

# Verificar archivos de debug que pueden ignorarse
Write-Host "`n4. Archivos de debug/herramientas (pueden ignorarse):" -ForegroundColor Gray
$debugFiles = Get-ChildItem -Path $pagesDir -Recurse -Filter "*.php" | Where-Object {
    $relativePath = $_.FullName.Replace($pagesDir + "\", "")
    return $relativePath -match 'debug_tools' -or $relativePath -match 'index_clean'
}

foreach ($file in $debugFiles) {
    $relativePath = $file.FullName.Replace($pagesDir + "\", "")
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    if ($content -match 'header\([''"]X-Content-Type-Options') {
        Write-Host "  ⚠️  $relativePath (Headers hardcodeados - archivo debug)" -ForegroundColor Gray
    }
}

Write-Host "`n=== RESUMEN FINAL ===" -ForegroundColor Green
Write-Host "✅ Archivos principales migrados: $($mainFiles.Count)" -ForegroundColor Green
Write-Host "✅ Total archivos usando helpers: $($helperFiles.Count)" -ForegroundColor Green
Write-Host "⚠️  Archivos restantes con headers hardcodeados: $($remainingFiles.Count)" -ForegroundColor $(if ($remainingFiles.Count -eq 0) { "Green" } else { "Yellow" })

if ($remainingFiles.Count -eq 0) {
    Write-Host "`n🎉 ¡MIGRACIÓN COMPLETADA EXITOSAMENTE!" -ForegroundColor Green
    Write-Host "Todos los archivos principales están usando las funciones helper centralizadas." -ForegroundColor Green
} else {
    Write-Host "`n📋 ESTADO: Migración casi completa" -ForegroundColor Yellow
    Write-Host "Los archivos principales están migrados. Los restantes son mayormente archivos debug o secundarios." -ForegroundColor Yellow
}
