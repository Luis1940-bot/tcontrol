#!/usr/bin/env bash

# =============================================================================
# SCRIPT DE CALIDAD DE CÓDIGO PARA PROYECTO TENKIWEB
# =============================================================================
# Este script automatiza las tareas de calidad de código usando ESLint, 
# Prettier y PHPStan para JavaScript/PHP.

set -e

echo "🔧 HERRAMIENTAS DE CALIDAD DE CÓDIGO - TENKIWEB TCONTROL"
echo "======================================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funciones utilitarias
print_step() {
    echo -e "${BLUE}[PASO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Verificar si estamos en el directorio correcto
if [ ! -f "package.json" ] || [ ! -f "composer.json" ]; then
    print_error "Este script debe ejecutarse desde el directorio raíz del proyecto"
    exit 1
fi

# Mostrar menú de opciones
show_menu() {
    echo ""
    echo "Selecciona una opción:"
    echo "1. 🎨 Formatear código (Prettier)"
    echo "2. 🔍 Verificar estilo JS (ESLint)"
    echo "3. 🔧 Corregir errores JS automáticamente (ESLint --fix)"
    echo "4. 🧪 Analizar código PHP (PHPStan)"
    echo "5. 🚀 Ejecutar todo (Prettier + ESLint fix + PHPStan)"
    echo "6. 📊 Mostrar estadísticas"
    echo "7. 🔄 Actualizar dependencias"
    echo "8. ❌ Salir"
    echo ""
}

# Formatear código con Prettier
run_prettier() {
    print_step "Ejecutando Prettier para formatear código..."
    
    if npm run format; then
        print_success "Prettier completado exitosamente"
    else
        print_error "Error ejecutando Prettier"
        return 1
    fi
}

# Verificar estilo con ESLint
run_eslint() {
    print_step "Ejecutando ESLint para verificar estilo..."
    
    if npm run lint; then
        print_success "ESLint completado sin errores"
    else
        print_warning "ESLint encontró problemas. Ejecuta la opción 3 para corregir automáticamente"
        return 1
    fi
}

# Corregir errores con ESLint
run_eslint_fix() {
    print_step "Ejecutando ESLint con corrección automática..."
    
    if npm run lint:fix; then
        print_success "ESLint --fix completado exitosamente"
    else
        print_warning "ESLint --fix completado con algunos errores restantes"
    fi
}

# Analizar código PHP con PHPStan
run_phpstan() {
    print_step "Ejecutando PHPStan para análisis estático de PHP..."
    
    if composer run phpstan; then
        print_success "PHPStan completado sin errores"
    else
        print_warning "PHPStan encontró problemas de calidad de código"
        return 1
    fi
}

# Ejecutar todas las herramientas
run_all() {
    print_step "Ejecutando todas las herramientas de calidad..."
    
    print_step "1/3 - Formateando código con Prettier..."
    run_prettier
    
    print_step "2/3 - Corrigiendo errores JS con ESLint..."
    run_eslint_fix
    
    print_step "3/3 - Analizando código PHP con PHPStan..."
    run_phpstan || true  # No fallar si PHPStan encuentra errores
    
    print_success "Proceso completo finalizado"
}

# Mostrar estadísticas
show_stats() {
    print_step "Recopilando estadísticas del proyecto..."
    
    echo ""
    echo "📊 ESTADÍSTICAS DEL PROYECTO"
    echo "============================="
    
    # Contar archivos
    js_files=$(find . -name "*.js" -not -path "./node_modules/*" -not -path "./vendor/*" | wc -l)
    php_files=$(find . -name "*.php" -not -path "./vendor/*" | wc -l)
    
    echo "📄 Archivos JavaScript: $js_files"
    echo "📄 Archivos PHP: $php_files"
    
    # Verificar estado de ESLint
    echo ""
    echo "🔍 ESTADO DE ESLINT"
    echo "==================="
    if npm run lint > /dev/null 2>&1; then
        print_success "Sin errores de ESLint"
    else
        print_warning "Hay errores de ESLint pendientes"
    fi
    
    # Verificar estado de PHPStan
    echo ""
    echo "🧪 ESTADO DE PHPSTAN"
    echo "===================="
    if composer run phpstan > /dev/null 2>&1; then
        print_success "Sin errores de PHPStan"
    else
        print_warning "Hay errores de PHPStan pendientes"
    fi
}

# Actualizar dependencias
update_deps() {
    print_step "Actualizando dependencias..."
    
    print_step "Actualizando dependencias npm..."
    npm update
    
    print_step "Actualizando dependencias composer..."
    composer update
    
    print_success "Dependencias actualizadas"
}

# Bucle principal
while true; do
    show_menu
    read -p "Tu opción: " choice
    
    case $choice in
        1)
            run_prettier
            ;;
        2)
            run_eslint
            ;;
        3)
            run_eslint_fix
            ;;
        4)
            run_phpstan
            ;;
        5)
            run_all
            ;;
        6)
            show_stats
            ;;
        7)
            update_deps
            ;;
        8)
            print_success "¡Hasta la vista! 👋"
            exit 0
            ;;
        *)
            print_error "Opción inválida. Por favor selecciona una opción del 1-8."
            ;;
    esac
    
    echo ""
    read -p "Presiona Enter para continuar..."
done
