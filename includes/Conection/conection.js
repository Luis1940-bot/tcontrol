import baseUrl from '../../config.js';

const SERVER = baseUrl;

function inicioPerformance() {
  const inicio = performance.now();
  sessionStorage.setItem('performance', inicio);
}
function finPerformance() {
  const fin = performance.now();
  const inicio = sessionStorage.getItem('performance');
  const velocidadMbps = fin - inicio;
  const signalDot = document.getElementById('signal-dot');
  if (!signalDot) return;
  if (velocidadMbps > 5) {
    signalDot.style.background = '#e53935'; // rojo
    signalDot.title = 'Conexión lenta';
  } else {
    signalDot.style.background = '#43a047'; // verde
    signalDot.title = 'Conexión óptima';
  }
}

// Llama a la función al cargar la página para mostrar el estado inicial
export { inicioPerformance, finPerformance };
