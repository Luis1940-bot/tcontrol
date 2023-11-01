const OperativoURL = '/includes/Traducciones/Operativo/';
const FileURL = '/includes/Traducciones/Archivos/';

async function leerArchivo(url) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const text = await response.text();
      return text.trim().split('\n');
    }
    return null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error:', error);
    throw error;
  }
}

export default {
  async translate(leng) {
    try {
      const [operatiEspanol, operativoOther, archivoEspanol, archivoOther] = await Promise.all([
        leerArchivo(`${OperativoURL}es.txt`),
        leerArchivo(`${OperativoURL}${leng}.txt`),
        leerArchivo(`${FileURL}es.txt`),
        leerArchivo(`${FileURL}${leng}.txt`),
      ]);

      return {
        arrayEspanolOperativo: [...operatiEspanol],
        arrayTranslateOperativo: [...operativoOther],
        arrayEspanolArchivo: [...archivoEspanol],
        arrayTranslateArchivo: [...archivoOther],
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error al cargar palabras:', error);
      throw error;
    }
  },
};
