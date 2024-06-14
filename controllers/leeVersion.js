import readJSON from './read-JSON.js'

export default async function leeVersion(json) {
  try {
    const data = await readJSON(json)
    return data.version // Devuelve el valor de data.version
  } catch (error) {
    console.error('Error al cargar el archivo:', error)
    return null // O cualquier valor por defecto en caso de error
  }
}
