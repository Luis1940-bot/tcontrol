# Script para iniciar el servidor de desarrollo de PHP correctamente
# Ejecutar desde el directorio del proyecto

Write-Host "Iniciando servidor de desarrollo PHP..." -ForegroundColor Green
Write-Host "URL: http://localhost:8000/test-tenkiweb/tcontrol" -ForegroundColor Yellow
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow

# Verificar si PHP está instalado
try {
    php --version | Out-Null
    Write-Host "PHP encontrado" -ForegroundColor Green
} catch {
    Write-Host "Error: PHP no está instalado o no está en el PATH" -ForegroundColor Red
    exit 1
}

# Cambiar al directorio del proyecto
Set-Location "c:\DATOS\04.DESARROLLOS\test-tenkiweb\tcontrol"

# Iniciar el servidor con el router personalizado
php -S localhost:8000 -t . router.php
