# =============================================================================
# SCRIPT DE CALIDAD DE CÓDIGO PARA PROYECTO TENKIWEB (PowerShell)
# =============================================================================
# Este script automatiza las tareas de calidad de código usando ESLint, 
# Prettier y PHPStan para JavaScript/PHP.

# Configuración de colores
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    
    switch ($Color) {
        "Red" { Write-Host $Message -ForegroundColor Red }
        "Green" { Write-Host $Message -ForegroundColor Green }
        "Yellow" { Write-Host $Message -ForegroundColor Yellow }
        "Blue" { Write-Host $Message -ForegroundColor Blue }
        "Cyan" { Write-Host $Message -ForegroundColor Cyan }
        default { Write-Host $Message }
    }
}

function Print-Step {
    param([string]$message)
    Write-ColorOutput "[PASO] $message" "Blue"
}

function Print-Success {
    param([string]$message)
    Write-ColorOutput "[✓] $message" "Green"
}

function Print-Warning {
    param([string]$message)
    Write-ColorOutput "[⚠] $message" "Yellow"
}

function Print-Error {
    param([string]$message)
    Write-ColorOutput "[✗] $message" "Red"
}

function Show-Header {
    Write-Host ""
    Write-ColorOutput "🔧 HERRAMIENTAS DE CALIDAD DE CÓDIGO - TENKIWEB TCONTROL" "Cyan"
    Write-ColorOutput "=======================================================" "Cyan"
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
        $result = & npm run format 2>&1
        if ($LASTEXITCODE -eq 0) {
            Print-Success "Prettier completado exitosamente"
            return $true
        } else {
            Print-Error "Error ejecutando Prettier: $result"
            return $false
        }
    }
    catch {
        Print-Error "Error ejecutando Prettier: $($_.Exception.Message)"
        return $false
    }
}

function Run-ESLint {
    Print-Step "Ejecutando ESLint para verificar estilo..."
    
    try {
        $result = & npm run lint 2>&1
        if ($LASTEXITCODE -eq 0) {
            Print-Success "ESLint completado sin errores"
            return $true
        } else {
            Print-Warning "ESLint encontró problemas. Ejecuta la opción 3 para corregir automáticamente"
            Write-Host $result
            return $false
        }
    }
    catch {
        Print-Warning "ESLint encontró problemas: $($_.Exception.Message)"
        return $false
    }
}

function Run-ESLintFix {
    Print-Step "Ejecutando ESLint con corrección automática..."
    
    try {
        $result = & npm run lint:fix 2>&1
        if ($LASTEXITCODE -eq 0) {
            Print-Success "ESLint --fix completado exitosamente"
        } else {
            Print-Warning "ESLint --fix completado con algunos errores restantes"
            Write-Host $result
        }
        return $true
    }
    catch {
        Print-Warning "ESLint --fix completado con errores: $($_.Exception.Message)"
        return $false
    }
}

function Run-PHPStan {
    Print-Step "Ejecutando PHPStan para análisis estático de PHP..."
    
    try {
        $result = & composer run phpstan 2>&1
        if ($LASTEXITCODE -eq 0) {
            Print-Success "PHPStan completado sin errores"
            return $true
        } else {
            Print-Warning "PHPStan encontró problemas de calidad de código"
            Write-Host $result
            return $false
        }
    }
    catch {
        Print-Warning "PHPStan encontró problemas: $($_.Exception.Message)"
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
    Run-PHPStan | Out-Null
    
    Print-Success "Proceso completo finalizado"
}

function Show-Stats {
    Print-Step "Recopilando estadísticas del proyecto..."
    
    Write-Host ""
    Write-ColorOutput "📊 ESTADÍSTICAS DEL PROYECTO" "Cyan"
    Write-ColorOutput "=============================" "Cyan"
    
    # Contar archivos
    $jsFiles = (Get-ChildItem -Path . -Include "*.js" -Recurse | Where-Object { $_.FullName -notmatch "node_modules|vendor" }).Count
    $phpFiles = (Get-ChildItem -Path . -Include "*.php" -Recurse | Where-Object { $_.FullName -notmatch "vendor" }).Count
    
    Write-Host "📄 Archivos JavaScript: $jsFiles"
    Write-Host "📄 Archivos PHP: $phpFiles"
    
    # Verificar estado de ESLint
    Write-Host ""
    Write-ColorOutput "🔍 ESTADO DE ESLINT" "Cyan"
    Write-ColorOutput "===================" "Cyan"
    
    try {
        $null = & npm run lint 2>&1
        if ($LASTEXITCODE -eq 0) {
            Print-Success "Sin errores de ESLint"
        } else {
            Print-Warning "Hay errores de ESLint pendientes"
        }
    }
    catch {
        Print-Warning "Hay errores de ESLint pendientes"
    }
    
    # Verificar estado de PHPStan
    Write-Host ""
    Write-ColorOutput "🧪 ESTADO DE PHPSTAN" "Cyan"
    Write-ColorOutput "====================" "Cyan"
    
    try {
        $null = & composer run phpstan 2>&1
        if ($LASTEXITCODE -eq 0) {
            Print-Success "Sin errores de PHPStan"
        } else {
            Print-Warning "Hay errores de PHPStan pendientes"
        }
    }
    catch {
        Print-Warning "Hay errores de PHPStan pendientes"
    }
}

function Update-Dependencies {
    Print-Step "Actualizando dependencias..."
    
    Print-Step "Actualizando dependencias npm..."
    & npm update
    
    Print-Step "Actualizando dependencias composer..."
    & composer update
    
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
