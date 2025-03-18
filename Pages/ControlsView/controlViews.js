// eslint-disable-next-line import/extensions
import traerRegistros from './Modules/Controladores/traerRegistros.js';
// eslint-disable-next-line import/extensions
import tablaVacia from './Modules/armadoDeTabla.js';
// eslint-disable-next-line import/extensions
import arrayGlobal from '../../controllers/variables.js';
// eslint-disable-next-line import/extensions
// import { Alerta } from '../../includes/atoms/alerta.js';
import Alerta from '../../includes/atoms/alerta.js';

import baseUrl from '../../config.js';
import { trO } from '../../controllers/trOA.js';

const SERVER = baseUrl;

const encabezados = {
  title: ['controles'],
  width: ['1'],
};

async function cargaDeRegistros(objTranslate, control, plant) {
  try {
    const { control_N, control_T, desde, hasta } = control;
    const whereUs = document.getElementById('whereUs');
    const textoAdicional = document.createTextNode(
      `> ${control_N} - ${control_T}`,
    );
    whereUs.appendChild(textoAdicional);
    let reportes;
    desde === undefined || hasta === undefined
      ? (reportes = await traerRegistros(`traerControles,${control_N}`, plant))
      : null;
    desde !== undefined || hasta !== undefined
      ? (reportes = await traerRegistros(
          `traerControlesFechas,${control_N},${desde},${hasta}`,
          null,
        ))
      : null;

    if (reportes.length > 0) {
      // Finaliza la carga y realiza cualquier otra acción necesaria
      tablaVacia(reportes, encabezados, objTranslate);
    } else {
      const miAlerta = new Alerta();
      const aviso = 'No se encontraron registros para este control.';
      const mensaje = trO(aviso, objTranslate) || aviso;
      arrayGlobal.avisoAmarillo.div.top = '500px';
      arrayGlobal.avisoAmarillo.close.id = 'idCloseAvisoAmarillo';
      miAlerta.createVerde(arrayGlobal.avisoAmarillo, mensaje, objTranslate);
      const modal = document.getElementById('modalAlertVerde');
      modal.style.display = 'block';
    }
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

async function mensajeDeCarga(objTranslate, control, plant) {
  const miAlerta = new Alerta();
  const aviso = arrayGlobal.avisoListandoControles.span.text;
  const mensaje = trO(aviso, objTranslate) || aviso;
  miAlerta.createControl(
    arrayGlobal.avisoListandoControles,
    mensaje,
    objTranslate,
  );
  const modal = document.getElementById('modalAlertCarga');
  modal.style.display = 'block';

  // Agrega un retraso antes de iniciar la carga de registros
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((resolve) => setTimeout(() => resolve(), 200));

  await cargaDeRegistros(objTranslate, control, plant);
}

function cargaTabla(objTranslate, control, plant) {
  try {
    mensajeDeCarga(objTranslate, control, plant);
    document.getElementById('volver').style.display = 'block';
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);
  }
}

function goBack(e) {
  const url = `${SERVER}/Pages/Controles/index.php?simulateAsignarEventos=true`;
  window.location.href = url;
}

const volver = document.getElementById('volver');
volver.addEventListener('click', () => {
  goBack(null);
});

export default cargaTabla;
