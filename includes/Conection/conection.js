import baseUrl from '../../config.js'
const SERVER = baseUrl

function inicioPerformance() {
  const inicio = performance.now()
  sessionStorage.setItem('performance', inicio)
}
function finPerformance() {
  const fin = performance.now()
  const inicio = sessionStorage.getItem('performance')
  const velocidadMbps = fin - inicio
  const signal = document.getElementById('idSignal')
  // signal.style.height = '12px';
  // signal.style.width = '12px';
  const ruta = `${SERVER}/assets/img/`
  if (velocidadMbps > 5) {
    signal.src = `${ruta}caracol.png`
    signal.alt = 'No connetc'
    // console.log('mala conexion');
  } else if (velocidadMbps > 2 && velocidadMbps <= 5) {
    signal.src = `${ruta}liebre.png`
    signal.alt = 'Lost connetc'
    // console.log('conexión intermedia');
  } else {
    signal.src = `${ruta}liebre.png`
    signal.alt = 'Good connetc'
    // console.log('buena conexión');
  }
}

// Llama a la función al cargar la página para mostrar el estado inicial
export { inicioPerformance, finPerformance }
