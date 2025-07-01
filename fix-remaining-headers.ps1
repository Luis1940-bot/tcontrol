#!/usr/bin/env pwsh

# Script para migrar headers hardcodeados específicos encontrados en Pages/
Write-Host "=== Migración de Headers Hardcodeados en Pages/ ===" -ForegroundColor Green

$pagesDir = "c:\DATOS\04.DESARROLLOS\test-tenkiweb\tcontrol\Pages"

# Lista específica de archivos que necesitan migración
$targetFiles = @(
    "QR\index.php",
    "RegisterUser\index.php", 
    "RegisterPlant\index.php",
    "RecoveryPass\index.php",
    "ListVariables\index.php",
    "ListReportes\index.php", 
    "ListAreas\index.php",
    "ListAreas\areas.php",
    "ListControles\index.php",
    "ListComunicacion\index.php",
    "Landing\index.php",
    "ControlesDiarios\index.php",
    "Control\index_clean.php",
    "ConsultasViews\viewsGral.php",
    "Consultas\index.php",
    "client28\Bitacoras\index.php",
    "client15\lecturasDeCampo\index.php", 
    "AuthUser\index.php"
)

foreach ($relativePath in $targetFiles) {
    $fullPath = Join-Path $pagesDir $relativePath
    
    if (-not (Test-Path $fullPath)) {
        Write-Host "⚠️  Archivo no encontrado: $relativePath" -ForegroundColor Yellow
        continue
    }
    
    Write-Host "Procesando: $relativePath" -ForegroundColor Cyan
    
    try {
        $content = Get-Content $fullPath -Raw -Encoding UTF8
        $originalContent = $content
        
        # Crear backup
        $backupPath = $fullPath + ".backup"
        if (-not (Test-Path $backupPath)) {
            Copy-Item $fullPath $backupPath
        }
        
        # Buscar y reemplazar el patrón específico encontrado
        $oldPattern = @'
if (session_status() == PHP_SESSION_NONE) {
  session_start();
};
header('Content-Type: text/html;charset=utf-8');
$nonce = base64_encode(random_bytes(16));
header("Content-Security-Policy: default-src 'self'; img-src 'self' data: https: tenkiweb.com; script-src 'self' 'nonce-$nonce' cdn.tenkiweb.com; style-src 'self' 'nonce-$nonce' cdn.tenkiweb.com; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;");

header("Strict-Transport-Security: max-age=31536000; includeSubDomains; preload");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");
header("X-XSS-Protection: 1; mode=block");

header("Access-Control-Allow-Origin: https://test.tenkiweb.com");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
'@

        $newPattern = @'
// Configurar headers de seguridad y sesión usando funciones helper
require_once dirname(dirname(__DIR__)) . '/config.php';
startSecureSession();
$nonce = setSecurityHeaders();
'@

        # Aplicar reemplazo
        $content = $content.Replace($oldPattern, $newPattern)
        
        # También buscar variaciones más cortas (sin algunos headers)
        $shortPattern1 = @'
if (session_status() == PHP_SESSION_NONE) {
  session_start();
};
header('Content-Type: text/html;charset=utf-8');
$nonce = base64_encode(random_bytes(16));
header("Content-Security-Policy: default-src 'self'; img-src 'self' data: https: tenkiweb.com; script-src 'self' 'nonce-$nonce' cdn.tenkiweb.com; style-src 'self' 'nonce-$nonce' cdn.tenkiweb.com; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;");


header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");
header("X-XSS-Protection: 1; mode=block");

header("Access-Control-Allow-Origin: https://test.tenkiweb.com");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
'@

        $content = $content.Replace($shortPattern1, $newPattern)
        
        # Patrón para archivos con menos headers (como AuthUser)
        $shortPattern2 = @'
header('Content-Type: text/html;charset=utf-8');
$nonce = base64_encode(random_bytes(16));
header("Content-Security-Policy: default-src 'self'; img-src 'self' data: https: tenkiweb.com; script-src 'self' 'nonce-$nonce' cdn.tenkiweb.com; style-src 'self' 'nonce-$nonce' cdn.tenkiweb.com; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;");

header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");
header("X-XSS-Protection: 1; mode=block");

header("Access-Control-Allow-Origin: https://test.tenkiweb.com");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
'@

        $newPatternShort = @'
// Configurar headers de seguridad usando función helper
require_once dirname(dirname(__DIR__)) . '/config.php';
$nonce = setSecurityHeaders();
'@

        $content = $content.Replace($shortPattern2, $newPatternShort)
        
        # Verificar si ya existe el require para config.php
        if ($content -match "require_once.*config\.php") {
            # Si ya existe, no agregar otro require
            $content = $content.Replace("require_once dirname(dirname(__DIR__)) . '/config.php';`r`n", "")
        }
        
        # Guardar solo si hubo cambios
        if ($content -ne $originalContent) {
            Set-Content -Path $fullPath -Value $content -Encoding UTF8
            Write-Host "  ✅ Migrado exitosamente" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  No se encontraron patrones conocidos para migrar" -ForegroundColor Yellow
        }
        
    } catch {
        Write-Host "  ❌ Error procesando archivo: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== Verificando resultado ===" -ForegroundColor Green

# Verificar que no queden headers hardcodeados
$remainingFiles = Get-ChildItem -Path $pagesDir -Recurse -Filter "*.php" | Where-Object {
    $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue
    if ($content) {
        return $content -match 'header\("X-Content-Type-Options'
    }
    return $false
}

if ($remainingFiles.Count -eq 0) {
    Write-Host "✅ ¡Migración completada! No quedan archivos con headers hardcodeados." -ForegroundColor Green
} else {
    Write-Host "⚠️  Aún quedan $($remainingFiles.Count) archivos con headers hardcodeados:" -ForegroundColor Yellow
    foreach ($file in $remainingFiles) {
        Write-Host "  - $($file.FullName.Replace($pagesDir, 'Pages'))" -ForegroundColor Gray
    }
}
