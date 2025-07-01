# =============================================================================
# SCRIPT DE CALIDAD DE CÓDIGO PARA PROYECTO TENKIWEB (PowerShell)
# =============================================================================
# Este script automatiza las tareas de calidad de código usando ESLint, 
# Prettier y PHPStan para JavaScript/PHP.

# Configuración de colores
$OriginalForegroundColor = $Host.UI.RawUI.ForegroundColor

function Write-ColorOutput($ForegroundColor) {
    param(
        [Parameter(Mandatory=$True, Position=1, ValueFromPipeline=$True)]
        [Object] $Object,
        [Parameter(Mandatory=$False, Position=2)]
        [ConsoleColor] $ForegroundColor = $Host.UI.RawUI.ForegroundColor
    )
    
    $Host.UI.RawUI.ForegroundColor = $ForegroundColor
    Write-Output $Object
    $Host.UI.RawUI.ForegroundColor = $OriginalForegroundColor
}

function Print-Step($message) {
    Write-ColorOutput "[PASO] $message" -ForegroundColor Blue
}

function Print-Success($message) {
    Write-ColorOutput "[✓] $message" -ForegroundColor Green
}

function Print-Warning($message) {
    Write-ColorOutput "[⚠] $message" -ForegroundColor Yellow
}

function Print-Error($message) {
    Write-ColorOutput "[✗] $message" -ForegroundColor Red
}

function Show-Header {
    Write-Host ""
    Write-ColorOutput "🔧 HERRAMIENTAS DE CALIDAD DE CÓDIGO - TENKIWEB TCONTROL" -ForegroundColor Cyan
    Write-ColorOutput "=======================================================" -ForegroundColor Cyan
    Write-Host ""
}

function Show-Menu {
    Write-Host ""
    Write-Host "Selecciona una opción:"
    Write-Host "1. 🎨 Formatear código (Prettier)"
    Write-Host "2. 🔍 Verificar estilo JS (ESLint)"
    Write-Host "3. 🔧 Corregir errores JS automáticamente (ESLint --fix)"
    Write-Host "4. 🧪 Analizar código PHP (PHPStan)"
    Write-Host "5. 🚀 Ejecutar todo (Prettier + ESLint fix + PHPStan)"
    Write-Host "6. 📊 Mostrar estadísticas"
    Write-Host "7. 🔄 Actualizar dependencias"
    Write-Host "8. ❌ Salir"
    Write-Host ""
}

function Test-ProjectDirectory {
    if (-not (Test-Path "package.json") -or -not (Test-Path "composer.json")) {
        Print-Error "Este script debe ejecutarse desde el directorio raíz del proyecto"
        exit 1
    }
}

function Run-Prettier {
    Print-Step "Ejecutando Prettier para formatear código..."
    
    try {
        npm run format
        Print-Success "Prettier completado exitosamente"
        return $true
    }
    catch {
        Print-Error "Error ejecutando Prettier"
        return $false
    }
}

function Run-ESLint {
    Print-Step "Ejecutando ESLint para verificar estilo..."
    
    try {
        npm run lint
        Print-Success "ESLint completado sin errores"
        return $true
    }
    catch {
        Print-Warning "ESLint encontró problemas. Ejecuta la opción 3 para corregir automáticamente"
        return $false
    }
}

function Run-ESLintFix {
    Print-Step "Ejecutando ESLint con corrección automática..."
    
    try {
        npm run lint:fix
        Print-Success "ESLint --fix completado exitosamente"
        return $true
    }
    catch {
        Print-Warning "ESLint --fix completado con algunos errores restantes"
        return $false
    }
}

function Run-PHPStan {
    Print-Step "Ejecutando PHPStan para análisis estático de PHP..."
    
    try {
        composer run phpstan
        Print-Success "PHPStan completado sin errores"
        return $true
    }
    catch {
        Print-Warning "PHPStan encontró problemas de calidad de código"
        return $false
    }
}

function Run-All {
    Print-Step "Ejecutando todas las herramientas de calidad..."
    
    Print-Step "1/3 - Formateando código con Prettier..."
    Run-Prettier | Out-Null
    
    Print-Step "2/3 - Corrigiendo errores JS con ESLint..."
    Run-ESLintFix | Out-Null
    
    Print-Step "3/3 - Analizando código PHP con PHPStan..."
    Run-PHPStan | Out-Null  # No fallar si PHPStan encuentra errores
    
    Print-Success "Proceso completo finalizado"
}

function Show-Stats {
    Print-Step "Recopilando estadísticas del proyecto..."
    
    Write-Host ""
    Write-ColorOutput "📊 ESTADÍSTICAS DEL PROYECTO" -ForegroundColor Cyan
    Write-ColorOutput "=============================" -ForegroundColor Cyan
    
    # Contar archivos
    $jsFiles = (Get-ChildItem -Path . -Include "*.js" -Recurse | Where-Object { $_.FullName -notmatch "node_modules|vendor" }).Count
    $phpFiles = (Get-ChildItem -Path . -Include "*.php" -Recurse | Where-Object { $_.FullName -notmatch "vendor" }).Count
    
    Write-Host "📄 Archivos JavaScript: $jsFiles"
    Write-Host "📄 Archivos PHP: $phpFiles"
    
    # Verificar estado de ESLint
    Write-Host ""
    Write-ColorOutput "🔍 ESTADO DE ESLINT" -ForegroundColor Cyan
    Write-ColorOutput "===================" -ForegroundColor Cyan
    
    try {
        npm run lint *> $null
        Print-Success "Sin errores de ESLint"
    }
    catch {
        Print-Warning "Hay errores de ESLint pendientes"
    }
    
    # Verificar estado de PHPStan
    Write-Host ""
    Write-ColorOutput "🧪 ESTADO DE PHPSTAN" -ForegroundColor Cyan
    Write-ColorOutput "====================" -ForegroundColor Cyan
    
    try {
        composer run phpstan *> $null
        Print-Success "Sin errores de PHPStan"
    }
    catch {
        Print-Warning "Hay errores de PHPStan pendientes"
    }
}

function Update-Dependencies {
    Print-Step "Actualizando dependencias..."
    
    Print-Step "Actualizando dependencias npm..."
    npm update
    
    Print-Step "Actualizando dependencias composer..."
    composer update
    
    Print-Success "Dependencias actualizadas"
}

# Verificar directorio del proyecto
Test-ProjectDirectory

# Mostrar header
Show-Header

# Bucle principal
do {
    Show-Menu
    $choice = Read-Host "Tu opción"
    
    switch ($choice) {
        "1" {
            Run-Prettier
        }
        "2" {
            Run-ESLint
        }
        "3" {
            Run-ESLintFix
        }
        "4" {
            Run-PHPStan
        }
        "5" {
            Run-All
        }
        "6" {
            Show-Stats
        }
        "7" {
            Update-Dependencies
        }
        "8" {
            Print-Success "¡Hasta la vista! 👋"
            exit 0
        }
        default {
            Print-Error "Opción inválida. Por favor selecciona una opción del 1-8."
        }
    }
    
    Write-Host ""
    Read-Host "Presiona Enter para continuar..."
} while ($true)
