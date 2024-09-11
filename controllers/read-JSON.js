import baseUrl from '../config.js'
const SERVER = baseUrl

async function readJSON(json, retries = 4, delay = 500) {
  const ruta = `${SERVER}/models/${json}.json?v=${new Date().getTime()}`
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(ruta)
      if (!response.ok) {
        throw new Error(`Error al cargar ${json}.json: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.warn(`Intento ${i + 1} fallido:`, error)
      if (i === retries - 1) throw error // Lanza el error después de varios intentos
    }
  }
}

export default readJSON
