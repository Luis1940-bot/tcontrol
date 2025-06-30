#!/bin/bash

# Script de despliegue para tControl
# Uso: ./deploy.sh [development|testing|production]

set -e  # Salir en caso of error

ENVIRONMENT=${1:-development}
BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
LOG_FILE="./logs/deploy_$(date +%Y%m%d_%H%M%S).log"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función de logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

# Validar entorno
validate_environment() {
    case $ENVIRONMENT in
        development|testing|production)
            log "Desplegando en entorno: $ENVIRONMENT"
            ;;
        *)
            error "Entorno inválido: $ENVIRONMENT. Usar: development|testing|production"
            ;;
    esac
}

# Crear backup
create_backup() {
    log "Creando backup en $BACKUP_DIR"
    mkdir -p "$BACKUP_DIR"
    
    # Backup de archivos críticos
    cp -r ./config.php "$BACKUP_DIR/" 2>/dev/null || warning "config.php no encontrado"
    cp -r ./models/ "$BACKUP_DIR/models/" 2>/dev/null || warning "Directorio models no encontrado"
    cp -r ./logs/ "$BACKUP_DIR/logs/" 2>/dev/null || warning "Directorio logs no encontrado"
    
    # Backup de base de datos (ajustar credenciales)
    if [ "$ENVIRONMENT" != "development" ]; then
        mysqldump -u root -p tcontrol_${ENVIRONMENT} > "$BACKUP_DIR/database_backup.sql" 2>/dev/null || warning "No se pudo hacer backup de BD"
    fi
    
    log "Backup completado: $BACKUP_DIR"
}

# Instalar dependencias
install_dependencies() {
    log "Instalando dependencias de Composer"
    if command -v composer &> /dev/null; then
        composer install --no-dev --optimize-autoloader
    else
        warning "Composer no encontrado, saltando instalación de dependencias"
    fi
}

# Verificar configuración
verify_configuration() {
    log "Verificando configuración para $ENVIRONMENT"
    
    # Verificar que exista archivo de configuración de entorno
    if [ ! -f "./config_env.php" ]; then
        error "Archivo config_env.php no encontrado"
    fi
    
    # Verificar permisos de directorios
    chmod 755 ./logs/ 2>/dev/null || warning "No se pudieron establecer permisos en logs/"
    chmod 755 ./models/ 2>/dev/null || warning "No se pudieron establecer permisos en models/"
    
    log "Configuración verificada"
}

# Ejecutar pruebas básicas
run_tests() {
    log "Ejecutando pruebas básicas"
    
    # Verificar sintaxis PHP en archivos críticos
    for file in index.php config_env.php; do
        if [ -f "$file" ]; then
            php -l "$file" > /dev/null || error "Error de sintaxis en $file"
        fi
    done
    
    # Verificar conectividad de base de datos (crear script separado)
    php -r "
        include 'config_env.php';
        try {
            \$pdo = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME, DB_USER, DB_PASS);
            echo 'Conexión BD exitosa\n';
        } catch (Exception \$e) {
            echo 'Error conexión BD: ' . \$e->getMessage() . '\n';
            exit(1);
        }
    " || warning "No se pudo verificar conexión de BD"
    
    log "Pruebas básicas completadas"
}

# Limpiar cache
clear_cache() {
    log "Limpiando cache"
    
    # Limpiar logs antiguos (mantener últimos 10 días)
    find ./logs/ -name "*.log" -type f -mtime +10 -delete 2>/dev/null || true
    
    # Limpiar archivos temporales
    find . -name "*.tmp" -type f -delete 2>/dev/null || true
    find . -name "*.temp" -type f -delete 2>/dev/null || true
    
    log "Cache limpiado"
}

# Función principal
main() {
    log "=== INICIO DE DESPLIEGUE TCONTROL ==="
    log "Entorno: $ENVIRONMENT"
    log "Usuario: $(whoami)"
    log "Directorio: $(pwd)"
    
    validate_environment
    create_backup
    install_dependencies
    verify_configuration
    run_tests
    clear_cache
    
    log "=== DESPLIEGUE COMPLETADO EXITOSAMENTE ==="
    log "Revisa el log completo en: $LOG_FILE"
    
    # Mostrar siguiente pasos según entorno
    case $ENVIRONMENT in
        development)
            log "Siguiente paso: Probar localmente en http://localhost/tcontrol/"
            ;;
        testing)
            log "Siguiente paso: Verificar en https://test.tenkiweb.com/tcontrol/"
            log "Notificar a usuarios beta sobre nueva versión"
            ;;
        production)
            log "Siguiente paso: Verificar en https://tenkiweb.com/tcontrol/"
            log "Monitorear métricas y logs por las próximas 24 horas"
            ;;
    esac
}

# Manejo de señales para cleanup
cleanup() {
    warning "Script interrumpido. Limpiando..."
    exit 1
}
trap cleanup SIGINT SIGTERM

# Ejecutar función principal
main
