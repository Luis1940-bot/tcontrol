// eslint-disable-next-line import/extensions
import traerRegistros from './Modules/Controladores/traerRegistros.js';
// eslint-disable-next-line import/extensions
import tablaVacia from './Modules/armadoDeTabla.js';
// eslint-disable-next-line import/extensions
import arrayGlobal from '../../controllers/variables.js';
// eslint-disable-next-line import/extensions
import { Alerta } from '../../includes/atoms/alerta.js';

const encabezados = {
  title: [
    'controles',
  ],
  width: [
    '1',
  ],
};

let translateOperativo = [];
let espanolOperativo = [];
// let translateArchivos = [];
// let espanolArchivos = [];

function trO(palabra) {
  const palabraNormalizada = palabra.replace(/\s/g, '').toLowerCase();
  const index = espanolOperativo.findIndex(
    (item) => item.replace(/\s/g, '').toLowerCase() === palabraNormalizada,
  );
  if (index !== -1) {
    return translateOperativo[index];
  }
  return palabra;
}

async function cargaDeRegistros(objTranslate) {
  try {
    const reportes = await traerRegistros('traerReportes');

    // Finaliza la carga y realiza cualquier otra acción necesaria
    tablaVacia(reportes, encabezados, objTranslate);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);
    // eslint-disable-next-line no-console
    console.log('error por espera de la carga de un modal');
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }
}

async function mensajeDeCarga(objTranslate) {
  const miAlerta = new Alerta();
  const aviso = arrayGlobal.avisoListandoControles.span.text;
  const mensaje = trO(aviso) || aviso;
  miAlerta.createControl(arrayGlobal.avisoListandoControles, mensaje, objTranslate);
  const modal = document.getElementById('modalAlertCarga');
  modal.style.display = 'block';

  // Agrega un retraso antes de iniciar la carga de registros
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((resolve) => setTimeout(() => resolve(), 200));

  await cargaDeRegistros(objTranslate);
}

function cargaTabla(objTranslate) {
  try {
    translateOperativo = objTranslate.operativoTR;
    espanolOperativo = objTranslate.operativoES;
    // translateArchivos = objTranslate.archivosTR;
    // espanolArchivos = objTranslate.archivosES;
    mensajeDeCarga(objTranslate);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);
  }
}

export default cargaTabla;
