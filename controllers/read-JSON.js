import baseUrl from '../config.js';

const SERVER = baseUrl;

async function readJSON(json, retries = 4, delay = 500) {
  const ruta = `${SERVER}/models/${json}.json?v=${new Date().getTime()}`;
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(ruta);
      if (!response.ok) {
        throw new Error(`Error al cargar ${json}.json: ${response.statusText} (${response.status})`);
      }
      
      // Verificar que el contenido sea JSON válido
      const text = await response.text();
      if (!text.trim()) {
        throw new Error(`El archivo ${json}.json está vacío`);
      }
      
      // Verificar si el servidor devolvió HTML en lugar de JSON
      if (text.trim().startsWith('<') || text.trim().startsWith('<!DOCTYPE')) {
        throw new Error(`El servidor devolvió HTML en lugar de JSON para ${json}.json. Posible error 404 o redirección.`);
      }
      
      // Verificar si parece ser un mensaje de error simple
      if (text.trim().startsWith('V') && text.length < 10 && !text.includes('{')) {
        throw new Error(`El servidor devolvió texto plano "${text.trim()}" en lugar de JSON para ${json}.json`);
      }
      
      // Intentar parsear el JSON
      try {
        return JSON.parse(text);
      } catch (parseError) {
        throw new Error(`Error de formato JSON en ${json}.json: ${parseError.message}. Contenido recibido: ${text.substring(0, 200)}...`);
      }
    } catch (error) {
      if (i === retries - 1) throw error; // Lanza el error después de varios intentos
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

export default readJSON;
