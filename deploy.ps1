# Script de despliegue para tControl (Windows PowerShell)
# Uso: .\deploy.ps1 -Environment [development|testing|production]

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("development", "testing", "production")]
    [string]$Environment = "development"
)

# Configuración
$BackupDir = ".\backups\$(Get-Date -Format 'yyyyMMdd_HHmmss')"
$LogFile = ".\logs\deploy_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"

# Función de logging
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] [$Level] $Message"
    
    switch ($Level) {
        "ERROR" { Write-Host $logMessage -ForegroundColor Red }
        "WARNING" { Write-Host $logMessage -ForegroundColor Yellow }
        "SUCCESS" { Write-Host $logMessage -ForegroundColor Green }
        default { Write-Host $logMessage -ForegroundColor White }
    }
    
    # Escribir al archivo de log
    $logMessage | Out-File -FilePath $LogFile -Append -Encoding UTF8
}

# Función para crear backup
function New-Backup {
    Write-Log "Creando backup en $BackupDir"
    
    try {
        New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
        
        # Backup de archivos críticos
        if (Test-Path ".\config.php") {
            Copy-Item ".\config.php" -Destination "$BackupDir\" -ErrorAction SilentlyContinue
        }
        
        if (Test-Path ".\models\") {
            Copy-Item ".\models\" -Destination "$BackupDir\models\" -Recurse -ErrorAction SilentlyContinue
        }
        
        if (Test-Path ".\logs\") {
            Copy-Item ".\logs\" -Destination "$BackupDir\logs\" -Recurse -ErrorAction SilentlyContinue
        }
        
        Write-Log "Backup completado: $BackupDir" "SUCCESS"
    }
    catch {
        Write-Log "Error creando backup: $_" "ERROR"
        throw
    }
}

# Función para instalar dependencias
function Install-Dependencies {
    Write-Log "Verificando dependencias de Composer"
    
    if (Get-Command composer -ErrorAction SilentlyContinue) {
        try {
            & composer install --no-dev --optimize-autoloader
            Write-Log "Dependencias instaladas correctamente" "SUCCESS"
        }
        catch {
            Write-Log "Error instalando dependencias: $_" "ERROR"
            throw
        }
    }
    else {
        Write-Log "Composer no encontrado, saltando instalación de dependencias" "WARNING"
    }
}

# Función para verificar configuración
function Test-Configuration {
    Write-Log "Verificando configuración para $Environment"
    
    # Verificar que exista archivo de configuración de entorno
    if (-not (Test-Path ".\config_env.php")) {
        Write-Log "Archivo config_env.php no encontrado" "ERROR"
        throw "Configuración faltante"
    }
    
    # Crear directorios necesarios
    @("logs", "models", "backups") | ForEach-Object {
        if (-not (Test-Path $_)) {
            New-Item -ItemType Directory -Path $_ -Force | Out-Null
            Write-Log "Directorio $_ creado"
        }
    }
    
    Write-Log "Configuración verificada" "SUCCESS"
}

# Función para ejecutar pruebas básicas
function Invoke-BasicTests {
    Write-Log "Ejecutando pruebas básicas"
    
    # Verificar sintaxis PHP en archivos críticos
    $phpFiles = @("index.php", "config_env.php")
    
    foreach ($file in $phpFiles) {
        if (Test-Path $file) {
            try {
                $result = & php -l $file 2>&1
                if ($LASTEXITCODE -ne 0) {
                    Write-Log "Error de sintaxis en $file" "ERROR"
                    throw "Error de sintaxis"
                }
            }
            catch {
                Write-Log "Error verificando sintaxis de $file: $_" "ERROR"
                throw
            }
        }
    }
    
    Write-Log "Pruebas básicas completadas" "SUCCESS"
}

# Función para limpiar archivos temporales
function Clear-TempFiles {
    Write-Log "Limpiando archivos temporales"
    
    try {
        # Limpiar logs antiguos (mantener últimos 10 días)
        Get-ChildItem -Path ".\logs\" -Filter "*.log" | Where-Object {
            $_.LastWriteTime -lt (Get-Date).AddDays(-10)
        } | Remove-Item -Force -ErrorAction SilentlyContinue
        
        # Limpiar archivos temporales
        Get-ChildItem -Path "." -Filter "*.tmp" -Recurse | Remove-Item -Force -ErrorAction SilentlyContinue
        Get-ChildItem -Path "." -Filter "*.temp" -Recurse | Remove-Item -Force -ErrorAction SilentlyContinue
        
        Write-Log "Archivos temporales limpiados" "SUCCESS"
    }
    catch {
        Write-Log "Error limpiando archivos temporales: $_" "WARNING"
    }
}

# Función para mostrar siguiente pasos
function Show-NextSteps {
    Write-Log "=== PRÓXIMOS PASOS ===" "SUCCESS"
    
    switch ($Environment) {
        "development" {
            Write-Log "• Probar localmente en http://localhost/tcontrol/" "INFO"
            Write-Log "• Verificar funcionalidades críticas" "INFO"
        }
        "testing" {
            Write-Log "• Verificar en https://test.tenkiweb.com/tcontrol/" "INFO"
            Write-Log "• Notificar a usuarios beta sobre nueva versión" "INFO"
            Write-Log "• Recopilar feedback de usuarios" "INFO"
        }
        "production" {
            Write-Log "• Verificar en https://tenkiweb.com/tcontrol/" "INFO"
            Write-Log "• Monitorear métricas y logs por 24 horas" "INFO"
            Write-Log "• Comunicar despliegue exitoso" "INFO"
        }
    }
}

# Función principal
function Main {
    try {
        Write-Log "=== INICIO DE DESPLIEGUE TCONTROL ===" "SUCCESS"
        Write-Log "Entorno: $Environment"
        Write-Log "Usuario: $env:USERNAME"
        Write-Log "Directorio: $(Get-Location)"
        
        New-Backup
        Install-Dependencies
        Test-Configuration
        Invoke-BasicTests
        Clear-TempFiles
        
        Write-Log "=== DESPLIEGUE COMPLETADO EXITOSAMENTE ===" "SUCCESS"
        Write-Log "Revisa el log completo en: $LogFile"
        
        Show-NextSteps
    }
    catch {
        Write-Log "Error durante el despliegue: $_" "ERROR"
        Write-Log "Revisa el backup en: $BackupDir" "INFO"
        exit 1
    }
}

# Verificar si estamos en el directorio correcto
if (-not (Test-Path "index.php")) {
    Write-Log "Error: No se encontró index.php. Ejecuta este script desde el directorio raíz de tControl" "ERROR"
    exit 1
}

# Ejecutar función principal
Main
