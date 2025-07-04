// eslint-disable-next-line no-unused-vars
import baseUrl from '../config.js';

const arrayTranslateOperativo = [];
// eslint-disable-next-line no-unused-vars
const arrayEspanolOperativo = [];
// eslint-disable-next-line no-unused-vars
const arrayTranslateArchivo = [];
// eslint-disable-next-line no-unused-vars
const arrayEspanolArchivo = [];
const SERVER = baseUrl;
const OperativoURL = `${SERVER}/includes/Traducciones/Operativo/`;
const FileURL = `${SERVER}/includes/Traducciones/Archivos/`;

async function leerArchivo(url) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const text = await response.text();
      // Verificar que el texto no esté vacío
      if (!text || text.trim().length === 0) {
        console.warn(`Archivo vacío o sin contenido: ${url}`);
        return [];
      }
      // Limpia las líneas eliminando caracteres \r y recortando espacios innecesarios
      const lines = text
        .trim()
        .split('\n')
        .map((line) => line.replace(/\r/g, '').trim())
        .filter((line) => line.length > 0); // Filtrar líneas vacías

      return lines;
    }
    console.warn(
      `No se pudo cargar el archivo: ${url}, status: ${response.status}`,
    );
    return [];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error al cargar archivo ${url}:`, error);
    return [];
  }
}

// export default {
// async translate(leng) {
const translate = async (leng) => {
  try {
    const [operatiEspanol, operativoOther, archivoEspanol, archivoOther] =
      await Promise.all([
        leerArchivo(`${OperativoURL}es.txt`),
        leerArchivo(`${OperativoURL}${leng}.txt`),
        leerArchivo(`${FileURL}es.txt`),
        leerArchivo(`${FileURL}${leng}.txt`),
      ]);

    // Ahora leerArchivo siempre devuelve arrays, no null
    return {
      arrayEspanolOperativo: [...operatiEspanol],
      arrayTranslateOperativo: [...operativoOther],
      arrayEspanolArchivo: [...archivoEspanol],
      arrayTranslateArchivo: [...archivoOther],
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error al cargar palabras:', error);

    // Devolver estructura vacía en caso de error para evitar que falle el sistema
    return {
      arrayEspanolOperativo: [],
      arrayTranslateOperativo: [],
      arrayEspanolArchivo: [],
      arrayTranslateArchivo: [],
    };
  }
};
// };

export {
  arrayTranslateOperativo,
  arrayEspanolOperativo,
  arrayTranslateArchivo,
  arrayEspanolArchivo,
  translate,
};
export default translate;
