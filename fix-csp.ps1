# Script mejorado para actualizar headers CSP
# Actualiza todos los archivos PHP en Pages/ que tengan headers hardcodeados

Write-Host "🔧 Actualizando headers CSP en archivos de Pages..." -ForegroundColor Yellow

# Obtener todos los archivos PHP en Pages que contienen headers CSP hardcodeados
$archivosConCSP = Get-ChildItem -Path "Pages" -Recurse -Filter "*.php" | Where-Object {
    $contenido = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue
    return $contenido -match 'header\("Content-Security-Policy: default-src'
}

Write-Host "📋 Encontrados $($archivosConCSP.Count) archivos para actualizar" -ForegroundColor Cyan

$exitosos = 0
$errores = 0

foreach ($archivo in $archivosConCSP) {
    Write-Host "📝 Procesando: $($archivo.Name) en $($archivo.DirectoryName)" -ForegroundColor Gray
    
    try {
        $contenido = Get-Content $archivo.FullName -Raw -Encoding UTF8
        $contenidoOriginal = $contenido
        
        # Reemplazar el bloque de headers hardcodeados
        # Patrón flexible que captura variaciones
        $contenido = $contenido -replace '(?s)if \(session_status\(\) == PHP_SESSION_NONE\) \{\s*session_start\(\);\s*\};\s*header\(''Content-Type: text/html;charset=utf-8''\);\s*\$nonce = base64_encode\(random_bytes\(16\)\);\s*header\("Content-Security-Policy:[^"]*"\);\s*(?:header\("Strict-Transport-Security:[^"]*"\);\s*)?header\("X-Content-Type-Options:[^"]*"\);\s*header\("X-Frame-Options:[^"]*"\);\s*header\("X-XSS-Protection:[^"]*"\);\s*header\("Access-Control-Allow-Origin:[^"]*"\);\s*header\("Access-Control-Allow-Methods:[^"]*"\);\s*header\("Access-Control-Allow-Headers:[^"]*"\);\s*header\("Access-Control-Allow-Credentials:[^"]*"\);', '$nonce = setSecurityHeaders(); startSecureSession();'
        
        # Asegurar que config.php esté incluido
        if ($contenido -notmatch 'require_once.*config\.php') {
            $contenido = $contenido -replace '(<\?php)', "`$1`nrequire_once dirname(dirname(__DIR__)) . '/config.php';"
        }
        
        # Guardar si hay cambios
        if ($contenidoOriginal -ne $contenido) {
            Set-Content -Path $archivo.FullName -Value $contenido -Encoding UTF8
            Write-Host "    ✅ Actualizado" -ForegroundColor Green
            $exitosos++
        } else {
            Write-Host "    ⚠️  Sin cambios" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "    ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        $errores++
    }
}

Write-Host "`n📊 Resumen: ✅ $exitosos actualizados, ❌ $errores errores" -ForegroundColor Yellow

if ($exitosos -gt 0) {
    Write-Host "🔄 Reiniciando servidor..." -ForegroundColor Cyan
    Stop-Process -Name "php" -Force -ErrorAction SilentlyContinue
    Start-Sleep 2
    Start-Process -FilePath "php" -ArgumentList "-S", "localhost:8000", "router.php" -WindowStyle Hidden
    Write-Host "✅ Servidor reiniciado en http://localhost:8000" -ForegroundColor Green
}
