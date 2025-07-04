import { desencriptar } from './cript.js';
import { translate } from './translate.js';

function obtenerIdiomaPreferido() {
  // Obtener el idioma desde navigator.languages si está disponible
  const idioma =
    navigator.languages && navigator.languages.length
      ? navigator.languages[0]
      : navigator.language || navigator.userLanguage;

  // Normalizar para obtener el idioma completo (ej. es-ES) y solo el código de idioma (ej. es)
  const codigoIdioma = idioma.split('-')[0]; // Solo el código de idioma, ej. es
  // let regionIdioma = idioma.split('-')[1] || '' // La región si está disponible, ej. ES
  return codigoIdioma;
  // return {
  //   idiomaCompleto: idioma, // Ej. es-ES, en-US, es
  //   codigoIdioma: codigoIdioma, // Ej. es, en
  //   regionIdioma: regionIdioma, // Ej. ES, US, vacío si no hay región
  // }
}

async function arraysLoadTranslate() {
  let idiomaPreferido = obtenerIdiomaPreferido();

  const user = sessionStorage.getItem('user');

  if (user) {
    const persona = desencriptar(sessionStorage.getItem('user'));
    idiomaPreferido = persona.lng;
  }

  try {
    const data = await translate(idiomaPreferido);
    const translateOperativo = data.arrayTranslateOperativo || [];
    const espanolOperativo = data.arrayEspanolOperativo || [];
    // eslint-disable-next-line no-unused-vars
    const translateArchivo = data.arrayTranslateArchivo || [];
    // eslint-disable-next-line no-unused-vars
    const espanolArchivo = data.arrayEspanolArchivo || [];

    const objTranslate = {
      operativoES: [],
      operativoTR: [],
      archivosES: [],
      archivosTR: [],
    };

    objTranslate.operativoES = [...espanolOperativo];
    objTranslate.operativoTR = [...translateOperativo];
    objTranslate.archivosES = [...(espanolArchivo || [])];
    objTranslate.archivosTR = [...(translateArchivo || [])];

    return objTranslate;
  } catch (error) {
    console.error('Error en arraysLoadTranslate:', error);

    // Devolver objeto con arrays vacíos como fallback
    return {
      operativoES: [],
      operativoTR: [],
      archivosES: [],
      archivosTR: [],
    };
  }
}

export { arraysLoadTranslate };
