// Crea y retorna un elemento span con la clase 'spinner-inline' y aplica propiedades del objeto de configuración
export default function createSpinner(config = {}) {
  const spinner = document.createElement('span');
  spinner.className = config.className || 'spinner-inline';
  spinner.setAttribute('aria-label', config.ariaLabel || 'Cargando...');
  spinner.style.display = config.display || 'inline-block';
  spinner.style.color = config.color || '#fff';
  spinner.style.width = config.size || '32px';
  spinner.style.height = config.size || '32px';
  spinner.style.position = config.position || 'static';
  spinner.style.marginRight = config.marginRight || '12px';
  if (config.style) {
    // Permite aplicar estilos inline adicionales
    Object.assign(spinner.style, config.style);
  }
  return spinner;
}
