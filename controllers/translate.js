// eslint-disable-next-line no-unused-vars
const arrayTranslateOperativo = []
// eslint-disable-next-line no-unused-vars
const arrayEspanolOperativo = []
// eslint-disable-next-line no-unused-vars
const arrayTranslateArchivo = []
// eslint-disable-next-line no-unused-vars
const arrayEspanolArchivo = []

import baseUrl from '../config.js'
const SERVER = baseUrl
const OperativoURL = `${SERVER}/includes/Traducciones/Operativo/`
const FileURL = `${SERVER}/includes/Traducciones/Archivos/`

async function leerArchivo(url) {
  try {
    const response = await fetch(url)
    if (response.ok) {
      const text = await response.text()
      return text.trim().split('\n')
    }
    return null
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error:', error)
    throw error
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
      ])

    return {
      arrayEspanolOperativo: [...operatiEspanol],
      arrayTranslateOperativo: [...operativoOther],
      arrayEspanolArchivo: [...archivoEspanol],
      arrayTranslateArchivo: [...archivoOther],
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error al cargar palabras:', error)
    throw error
  }
}
// };

export {
  arrayTranslateOperativo,
  arrayEspanolOperativo,
  arrayTranslateArchivo,
  arrayEspanolArchivo,
  translate,
}
export default translate
