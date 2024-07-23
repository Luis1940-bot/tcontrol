import { desencriptar } from './cript.js'
import translate from './translate.js'

async function arraysLoadTranslate() {
  let idiomaPreferido = navigator.languages[1]
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
