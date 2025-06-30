# Script de despliegue para tControl (Windows PowerShell)
# Uso: .\deploy.ps1 -Environment [development|testing|production]

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("development", "testing", "production")]
    [string]$Environment = "development"
)

# Configuracion
$BackupDir = ".\backups\$(Get-Date -Format 'yyyyMMdd_HHmmss')"
$LogFile = ".\logs\deploy_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"

# Funcion de logging
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
    if (-not (Test-Path "logs")) {
        New-Item -ItemType Directory -Path "logs" -Force | Out-Null
    }
    $logMessage | Out-File -FilePath $LogFile -Append -Encoding UTF8
}

# Funcion para crear backup
function New-Backup {
    Write-Log "Creando backup en $BackupDir"
    
    try {
        New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
        
        # Backup de archivos criticos
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
        Write-Log "Error creando backup: $($_.Exception.Message)" "ERROR"
        throw
    }
}

# Funcion para verificar configuracion
function Test-Configuration {
    Write-Log "Verificando configuracion para $Environment"
    
    # Verificar que exista archivo de configuracion de entorno
    if (-not (Test-Path ".\config_env.php")) {
        Write-Log "Archivo config_env.php no encontrado" "ERROR"
        throw "Configuracion faltante"
    }
    
    # Crear directorios necesarios
    @("logs", "models", "backups") | ForEach-Object {
        if (-not (Test-Path $_)) {
            New-Item -ItemType Directory -Path $_ -Force | Out-Null
            Write-Log "Directorio $_ creado"
        }
    }
    
    Write-Log "Configuracion verificada" "SUCCESS"
}

# Funcion para ejecutar pruebas basicas
function Invoke-BasicTests {
    Write-Log "Ejecutando pruebas basicas"
    
    # Verificar sintaxis PHP en archivos criticos
    $phpFiles = @("index.php", "config_env.php")
    
    foreach ($file in $phpFiles) {
        if (Test-Path $file) {
            try {
                $result = & php -l $file 2>&1
                if ($LASTEXITCODE -ne 0) {
                    Write-Log "Error de sintaxis en $file" "ERROR"
                    throw "Error de sintaxis"
                }
                Write-Log "Sintaxis OK: $file" "SUCCESS"
            }
            catch {
                Write-Log "Error verificando sintaxis de $file" "ERROR"
                throw
            }
        }
    }
    
    Write-Log "Pruebas basicas completadas" "SUCCESS"
}

# Funcion para limpiar archivos temporales
function Clear-TempFiles {
    Write-Log "Limpiando archivos temporales"
    
    try {
        # Limpiar logs antiguos (mantener ultimos 10 dias)
        Get-ChildItem -Path ".\logs\" -Filter "*.log" -ErrorAction SilentlyContinue | Where-Object {
            $_.LastWriteTime -lt (Get-Date).AddDays(-10)
        } | Remove-Item -Force -ErrorAction SilentlyContinue
        
        # Limpiar archivos temporales
        Get-ChildItem -Path "." -Filter "*.tmp" -Recurse -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue
        Get-ChildItem -Path "." -Filter "*.temp" -Recurse -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue
        
        Write-Log "Archivos temporales limpiados" "SUCCESS"
    }
    catch {
        Write-Log "Error limpiando archivos temporales: $($_.Exception.Message)" "WARNING"
    }
}

# Funcion para mostrar siguiente pasos
function Show-NextSteps {
    Write-Log "=== PROXIMOS PASOS ===" "SUCCESS"
    
    switch ($Environment) {
        "development" {
            Write-Log "• Probar localmente en http://localhost/tcontrol/" "INFO"
            Write-Log "• Verificar funcionalidades criticas" "INFO"
        }
        "testing" {
            Write-Log "• Verificar en https://test.tenkiweb.com/tcontrol/" "INFO"
            Write-Log "• Notificar a usuarios beta sobre nueva version" "INFO"
            Write-Log "• Recopilar feedback de usuarios" "INFO"
        }
        "production" {
            Write-Log "• Verificar en https://tenkiweb.com/tcontrol/" "INFO"
            Write-Log "• Monitorear metricas y logs por 24 horas" "INFO"
            Write-Log "• Comunicar despliegue exitoso" "INFO"
        }
    }
}

# Funcion principal
function Main {
    try {
        Write-Log "=== INICIO DE DESPLIEGUE TCONTROL ===" "SUCCESS"
        Write-Log "Entorno: $Environment"
        Write-Log "Usuario: $env:USERNAME"
        Write-Log "Directorio: $(Get-Location)"
        
        New-Backup
        Test-Configuration
        Invoke-BasicTests
        Clear-TempFiles
        
        Write-Log "=== DESPLIEGUE COMPLETADO EXITOSAMENTE ===" "SUCCESS"
        Write-Log "Revisa el log completo en: $LogFile"
        
        Show-NextSteps
    }
    catch {
        Write-Log "Error durante el despliegue: $($_.Exception.Message)" "ERROR"
        Write-Log "Revisa el backup en: $BackupDir" "INFO"
        exit 1
    }
}

# Verificar si estamos en el directorio correcto
if (-not (Test-Path "index.php")) {
    Write-Host "Error: No se encontro index.php. Ejecuta este script desde el directorio raiz de tControl" -ForegroundColor Red
    exit 1
}

# Ejecutar funcion principal
Main
