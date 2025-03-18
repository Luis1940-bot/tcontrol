// // eslint-disable-next-line import/extensions
import traerRegistros from './Modules/Controladores/traerRegistros.js';
// eslint-disable-next-line import/extensions
import tablaVacia from './Modules/armadoDeTabla.js';
// eslint-disable-next-line import/extensions
import arrayGlobal from '../../controllers/variables.js';
// eslint-disable-next-line import/extensions
// import { Alerta } from '../../includes/atoms/alerta.js';
import Alerta from '../../includes/atoms/alerta.js';
// eslint-disable-next-line import/extensions
import filtrarTabla from './Modules/Controladores/filtrarTabla.js';
import { trO } from '../../controllers/trOA.js';

const encabezados = {
  title: ['Controles'],
  width: ['1'],
};

async function cargaDeRegistros(objTranslate, plant, nivel) {
  try {
    const reportes = await traerRegistros(
      'traerReportes',
      parseInt(plant, 10),
      nivel,
    );
    // Finaliza la carga y realiza cualquier otra acción necesaria
    tablaVacia(reportes, encabezados, objTranslate);
  } catch (error) {
    console.warn(error);
    console.log('error por espera de la carga de un modal');

    // Reemplazo de setTimeout con requestAnimationFrame
    function recargarPagina() {
      window.location.reload();
    }

    requestAnimationFrame(recargarPagina);
  }
}

async function mensajeDeCarga(objTranslate, plant, nivel) {
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

  await cargaDeRegistros(objTranslate, plant, nivel);
}

function cargaTabla(objTranslate, plant, nivel) {
  try {
    mensajeDeCarga(objTranslate, plant, nivel);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);
  }
}

document.getElementById('search').addEventListener('input', (e) => {
  const searchTerm = e.target.value.trim().toLowerCase();
  filtrarTabla('tableControlViews', searchTerm);
});

export default cargaTabla;
