// config.js

// Detecta si estamos en localhost
const isLocalhost =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'

// Define la ruta base según el entorno
let baseUrl

if (isLocalhost) {
  baseUrl = 'http://localhost:3000'
} else {
  // En producción
  baseUrl = 'https://tenkiweb.com/tcontrol'
}

// Exporta la variable baseUrl para que otros archivos puedan importarla
export default baseUrl
