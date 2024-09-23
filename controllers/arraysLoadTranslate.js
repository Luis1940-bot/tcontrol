import { desencriptar } from './cript.js'
import translate from './translate.js'

function obtenerIdiomaPreferido() {
  // Obtener el idioma desde navigator.languages si está disponible
  let idioma =
    navigator.languages && navigator.languages.length
      ? navigator.languages[0]
      : navigator.language || navigator.userLanguage

  // Normalizar para obtener el idioma completo (ej. es-ES) y solo el código de idioma (ej. es)
  let codigoIdioma = idioma.split('-')[0] // Solo el código de idioma, ej. es
  // let regionIdioma = idioma.split('-')[1] || '' // La región si está disponible, ej. ES
  return codigoIdioma
  // return {
  //   idiomaCompleto: idioma, // Ej. es-ES, en-US, es
  //   codigoIdioma: codigoIdioma, // Ej. es, en
  //   regionIdioma: regionIdioma, // Ej. ES, US, vacío si no hay región
  // }
}

async function arraysLoadTranslate() {
  let idiomaPreferido = obtenerIdiomaPreferido()

  const user = sessionStorage.getItem('user')

  if (user) {
    const persona = desencriptar(sessionStorage.getItem('user'))
    idiomaPreferido = persona.lng
  }
  const data = await translate(idiomaPreferido)
  let translateOperativo = data.arrayTranslateOperativo
  let espanolOperativo = data.arrayEspanolOperativo
  let translateArchivo = data.arrayTranslateArchivo
  let espanolArchivo = data.arrayEspanolArchivo
  const objTranslate = {
    operativoES: [],
    operativoTR: [],
    archivosES: [],
    archivosTR: [],
  }
  objTranslate.operativoES = [...espanolOperativo]
  objTranslate.operativoTR = [...translateOperativo]
  return objTranslate
}

export { arraysLoadTranslate }
