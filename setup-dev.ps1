# Configuración del Entorno de Desarrollo - tControl
# Ejecutar este archivo para configurar el entorno de desarrollo

param(
    [switch]$InstallGit,
    [switch]$InstallComposer,
    [switch]$InstallPHP,
    [switch]$All
)

Write-Host "🚀 Configurando entorno de desarrollo para tControl..." -ForegroundColor Green

function Test-Command {
    param([string]$Command)
    $null = Get-Command $Command -ErrorAction SilentlyContinue
    return $?
}

function Install-GitWindows {
    if (Test-Command "git") {
        Write-Host "✅ Git ya está instalado" -ForegroundColor Green
        return
    }
    
    Write-Host "📥 Instalando Git..." -ForegroundColor Yellow
    # Descargar e instalar Git (requiere chocolatey o manual)
    if (Test-Command "choco") {
        choco install git -y
    } else {
        Write-Host "❌ Por favor instala Git manualmente desde: https://git-scm.com/download/win" -ForegroundColor Red
    }
}

function Install-ComposerWindows {
    if (Test-Command "composer") {
        Write-Host "✅ Composer ya está instalado" -ForegroundColor Green
        return
    }
    
    Write-Host "📥 Instalando Composer..." -ForegroundColor Yellow
    # Descargar e instalar Composer
    if (Test-Command "choco") {
        choco install composer -y
    } else {
        Write-Host "❌ Por favor instala Composer manualmente desde: https://getcomposer.org/download/" -ForegroundColor Red
    }
}

function Install-PHPWindows {
    if (Test-Command "php") {
        Write-Host "✅ PHP ya está instalado" -ForegroundColor Green
        php -v
        return
    }
    
    Write-Host "📥 Instalando PHP..." -ForegroundColor Yellow
    if (Test-Command "choco") {
        choco install php -y
    } else {
        Write-Host "❌ Por favor instala PHP manualmente desde: https://windows.php.net/download/" -ForegroundColor Red
    }
}

function Setup-ProjectStructure {
    Write-Host "📁 Configurando estructura del proyecto..." -ForegroundColor Yellow
    
    # Crear directorios necesarios
    $directories = @("logs", "backups", "temp")
    foreach ($dir in $directories) {
        if (-not (Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
            Write-Host "✅ Directorio $dir creado" -ForegroundColor Green
        }
    }
    
    # Configurar permisos básicos
    if (Test-Path "logs") {
        # En Windows no necesitamos cambiar permisos como en Linux
        Write-Host "✅ Permisos configurados para logs" -ForegroundColor Green
    }
}

function Install-Dependencies {
    Write-Host "📦 Instalando dependencias PHP..." -ForegroundColor Yellow
    
    if (Test-Command "composer") {
        composer install
        Write-Host "✅ Dependencias instaladas" -ForegroundColor Green
    } else {
        Write-Host "❌ Composer no disponible, saltando dependencias" -ForegroundColor Red
    }
}

function Setup-GitHooks {
    Write-Host "🪝 Configurando Git hooks..." -ForegroundColor Yellow
    
    $preCommitHook = @"
#!/bin/sh
# Pre-commit hook para tControl

echo "🔍 Ejecutando verificaciones pre-commit..."

# Verificar sintaxis PHP
for file in `$(git diff --cached --name-only --diff-filter=ACM | grep '\.php$')`; do
    if [ -f "$file" ]; then
        php -l "$file"
        if [ $? -ne 0 ]; then
            echo "❌ Error de sintaxis en $file"
            exit 1
        fi
    fi
done

# Verificar que no se incluyan archivos sensibles
for file in config.php ssh.txt; do
    if git diff --cached --name-only | grep -q "$file"; then
        echo "❌ Archivo sensible detectado: $file"
        echo "Usar git reset HEAD $file para removerlo"
        exit 1
    fi
done

echo "✅ Verificaciones pre-commit completadas"
"@

    $hookPath = ".git/hooks/pre-commit"
    if (Test-Path ".git") {
        $preCommitHook | Out-File -FilePath $hookPath -Encoding UTF8
        Write-Host "✅ Git hooks configurados" -ForegroundColor Green
    } else {
        Write-Host "❌ No se encontró repositorio Git" -ForegroundColor Red
    }
}

function Show-DevelopmentInfo {
    Write-Host ""
    Write-Host "🎉 Configuración completada!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Información del entorno:" -ForegroundColor Cyan
    Write-Host "  • Proyecto: tControl" -ForegroundColor White
    Write-Host "  • Entorno: Development" -ForegroundColor White
    Write-Host "  • URL Local: http://localhost/tcontrol/" -ForegroundColor White
    Write-Host ""
    Write-Host "🔧 Próximos pasos:" -ForegroundColor Cyan
    Write-Host "  1. Configurar base de datos local" -ForegroundColor White
    Write-Host "  2. Copiar config.php.example a config.php" -ForegroundColor White
    Write-Host "  3. Configurar credenciales de BD en config.php" -ForegroundColor White
    Write-Host "  4. Ejecutar: .\deploy.ps1 -Environment development" -ForegroundColor White
    Write-Host ""
    Write-Host "📚 Documentación:" -ForegroundColor Cyan
    Write-Host "  • Estrategia de despliegue: DEPLOYMENT_STRATEGY.md" -ForegroundColor White
    Write-Host "  • README: README.md" -ForegroundColor White
    Write-Host ""
}

# Función principal
function Main {
    if ($All) {
        $InstallGit = $true
        $InstallComposer = $true
        $InstallPHP = $true
    }
    
    if ($InstallGit -or $All) {
        Install-GitWindows
    }
    
    if ($InstallPHP -or $All) {
        Install-PHPWindows
    }
    
    if ($InstallComposer -or $All) {
        Install-ComposerWindows
    }
    
    Setup-ProjectStructure
    Install-Dependencies
    Setup-GitHooks
    Show-DevelopmentInfo
}

# Ejecutar
Main
