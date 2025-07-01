# Script para actualizar headers CSP en archivos PHP
# Automatiza la migración de headers hardcodeados a funciones helper

$archivos = @(
    "Pages\ConsultasViews\viewsGral.php",
    "Pages\QR\index.php",
    "Pages\RegisterPlant\index.php",
    "Pages\Sadmin\index.php",
    "Pages\RecoveryPass\index.php",
    "Pages\RegisterUser\index.php",
    "Pages\ListAreas\index.php",
    "Pages\ListAreas\areas.php",
    "Pages\Menu\index.php",
    "Pages\ListVariables\index.php",
    "Pages\ListVariables\variables.php",
    "Pages\ListReportes\index.php",
    "Pages\ListReportes\reporte.php",
    "Pages\ListControles\index.php",
    "Pages\ListComunicacion\index.php",
    "Pages\Landing\index.php",
    "Pages\ControlsView\index.php",
    "Pages\ControlesDiarios\index.php",
    "Pages\Control\index.php",
    "Pages\Admin\index.php"
)

Write-Host "🔧 Iniciando actualización de headers CSP..." -ForegroundColor Yellow

foreach ($archivo in $archivos) {
    $rutaCompleta = Join-Path $PWD $archivo
    
    if (Test-Path $rutaCompleta) {
        Write-Host "📝 Procesando: $archivo" -ForegroundColor Cyan
        
        $contenido = Get-Content $rutaCompleta -Raw -Encoding UTF8
        
        # Patrón para encontrar el bloque de headers hardcodeados
        $patron = '(?s)header\(''Content-Type: text/html;charset=utf-8''\);\s*\$nonce = base64_encode\(random_bytes\(16\)\);\s*header\("Content-Security-Policy:.*?\);\s*header\("Strict-Transport-Security:.*?\);\s*header\("X-Content-Type-Options:.*?\);\s*header\("X-Frame-Options:.*?\);\s*header\("X-XSS-Protection:.*?\);\s*header\("Access-Control-Allow-Origin:.*?\);\s*header\("Access-Control-Allow-Methods:.*?\);\s*header\("Access-Control-Allow-Headers:.*?\);\s*header\("Access-Control-Allow-Credentials:.*?\);'
        
        $reemplazo = '// Headers de seguridad configurados dinámicamente
$nonce = setSecurityHeaders();
startSecureSession();'
        
        # Aplicar reemplazo
        $contenidoNuevo = $contenido -replace $patron, $reemplazo
        
        # Asegurar que config.php se carga al inicio
        if ($contenidoNuevo -notmatch 'require_once.*config\.php') {
            $contenidoNuevo = $contenidoNuevo -replace '(<\?php)', "`$1`nrequire_once dirname(dirname(__DIR__)) . '/config.php';"
        }
        
        # Guardar archivo actualizado
        if ($contenido -ne $contenidoNuevo) {
            Set-Content -Path $rutaCompleta -Value $contenidoNuevo -Encoding UTF8
            Write-Host "✅ Actualizado: $archivo" -ForegroundColor Green
        } else {
            Write-Host "⏩ Sin cambios: $archivo" -ForegroundColor Gray
        }
    } else {
        Write-Host "❌ No encontrado: $archivo" -ForegroundColor Red
    }
}

Write-Host "`n🎉 Actualización completada!" -ForegroundColor Green
Write-Host "📋 Reinicia el servidor PHP para aplicar los cambios." -ForegroundColor Yellow
