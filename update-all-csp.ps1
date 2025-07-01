# Script para actualizar TODOS los headers CSP en archivos PHP de Pages/
# Automatiza la migración masiva de headers hardcodeados a funciones helper

Write-Host "🔧 Iniciando actualización masiva de headers CSP en Pages/..." -ForegroundColor Yellow

# Lista completa de archivos que necesitan actualización
$archivos = @(
    "Pages\ListVariables\variables.php",
    "Pages\Sadmin\index.php", 
    "Pages\RegisterUser\index.php",
    "Pages\RegisterPlant\index.php",
    "Pages\ListVariables\index.php",
    "Pages\QR\index.php",
    "Pages\RecoveryPass\index.php",
    "Pages\ListComunicacion\index.php",
    "Pages\ListReportes\reporte.php",
    "Pages\ListControles\index.php",
    "Pages\ListReportes\index.php",
    "Pages\Consultas\index.php",
    "Pages\ListAreas\areas.php",
    "Pages\Landing\index.php",
    "Pages\ListAreas\index.php",
    "Pages\ControlesDiarios\index.php",
    "Pages\ConsultasViews\viewsGral.php",
    "Pages\Control\index_clean.php",
    "Pages\AuthUser\index.php",
    "Pages\client15\lecturasDeCampo\index.php",
    "Pages\client28\Bitacoras\index.php"
)

$procesados = 0
$exitosos = 0
$errores = 0

foreach ($archivo in $archivos) {
    $rutaCompleta = Join-Path $PWD $archivo
    $procesados++
    
    Write-Host "📝 [$procesados/$($archivos.Count)] Procesando: $archivo" -ForegroundColor Cyan
    
    if (Test-Path $rutaCompleta) {
        try {
            $contenido = Get-Content $rutaCompleta -Raw -Encoding UTF8
            $contenidoOriginal = $contenido
            
            # Patrón mejorado para capturar todo el bloque de headers
            $patron = '(?s)header\(''Content-Type: text/html;charset=utf-8''\);\s*\$nonce = base64_encode\(random_bytes\(16\)\);\s*header\("Content-Security-Policy:[^"]*"\);\s*(?:header\("Strict-Transport-Security:[^"]*"\);\s*)?header\("X-Content-Type-Options:[^"]*"\);\s*header\("X-Frame-Options:[^"]*"\);\s*header\("X-XSS-Protection:[^"]*"\);\s*header\("Access-Control-Allow-Origin:[^"]*"\);\s*header\("Access-Control-Allow-Methods:[^"]*"\);\s*header\("Access-Control-Allow-Headers:[^"]*"\);\s*header\("Access-Control-Allow-Credentials:[^"]*"\);'
            
            # Nuevo código a insertar
            $reemplazo = '// Headers de seguridad configurados dinámicamente
$nonce = setSecurityHeaders();
startSecureSession();'
            
            # Aplicar reemplazo
            $contenidoNuevo = $contenido -replace $patron, $reemplazo
            
            # Asegurar que config.php se carga antes que todo
            if ($contenidoNuevo -match '<\?php') {
                # Buscar si ya existe require_once config.php
                if ($contenidoNuevo -notmatch 'require_once.*config\.php') {
                    # Insertar después de <?php
                    $contenidoNuevo = $contenidoNuevo -replace '(<\?php)', "`$1`n`nrequire_once dirname(dirname(__DIR__)) . '/config.php';"
                }
            }
            
            # Verificar si se realizaron cambios
            if ($contenidoOriginal -ne $contenidoNuevo) {
                Set-Content -Path $rutaCompleta -Value $contenidoNuevo -Encoding UTF8
                Write-Host "    ✅ Actualizado exitosamente" -ForegroundColor Green
                $exitosos++
            } else {
                Write-Host "    ⚠️  Sin cambios detectados - revisar manualmente" -ForegroundColor Yellow
            }
        }
        catch {
            Write-Host "    ❌ Error al procesar: $($_.Exception.Message)" -ForegroundColor Red
            $errores++
        }
    } else {
        Write-Host "    ❌ Archivo no encontrado" -ForegroundColor Red
        $errores++
    }
}

Write-Host "`n📊 RESUMEN:" -ForegroundColor Yellow
Write-Host "   📁 Archivos procesados: $procesados" -ForegroundColor White
Write-Host "   ✅ Actualizados exitosamente: $exitosos" -ForegroundColor Green
Write-Host "   ❌ Errores: $errores" -ForegroundColor Red

if ($exitosos -gt 0) {
    Write-Host "`n🔄 Reiniciando servidor PHP..." -ForegroundColor Yellow
    taskkill /F /IM php.exe 2>$null
    Start-Sleep -Seconds 2
    Start-Process powershell -ArgumentList "-Command", "php -S localhost:8000 router.php" -WindowStyle Hidden
    Write-Host "✅ Servidor reiniciado en http://localhost:8000" -ForegroundColor Green
}

Write-Host "`n🎉 Actualización masiva completada!" -ForegroundColor Green
