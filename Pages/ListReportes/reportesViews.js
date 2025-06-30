// eslint-disable-next-line import/extensions
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
  title: ['reportes'],
  width: ['1'],
};

async function cargaDeRegistros(objTranslate, plant) {
  try {
    const reportes = await traerRegistros(
      'traerReportes',
      '/traerReportes',
      plant,
    );
    arrayGlobal.arrayReportes = [...reportes];
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

async function mensajeDeCarga(objTranslate, plant) {
  const miAlerta = new Alerta();
  const aviso =
    'Aguarde unos instantes, se están listando los reportes activos. Gracias!';

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

  await cargaDeRegistros(objTranslate, plant);
}

function cargaTabla(objTranslate, plant) {
  try {
    mensajeDeCarga(objTranslate, plant);
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
