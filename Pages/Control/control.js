// eslint-disable-next-line import/extensions
import traerRegistros from './Modules/traerRegistros.js';
// eslint-disable-next-line import/extensions
import tablaVacia from './Modules/armadoDeTabla.js';
// eslint-disable-next-line import/extensions
import arrayGlobal from './Modules/variables.js';
// eslint-disable-next-line import/extensions
import translate from '../../controllers/translate.js';
// eslint-disable-next-line no-unused-vars, import/extensions
import readJSON from '../../controllers/read-JSON.js';

let arrayTranslateOperativo = [];
let arrayEspanolOperativo = [];
// eslint-disable-next-line no-unused-vars
let arrayTranslateArchivo = [];
// eslint-disable-next-line no-unused-vars
let arrayEspanolArchivo = [];

let controlN = '';
let controlT = '';
let nr = 0;
const spinner = document.querySelector('.spinner');
const encabezados = {
  title: [
    'id', 'concepto', 'relevamiento', 'detalle', 'observación',
  ],
  width: [
    '.05', '.15', '.25', '.25', '.25',
  ],
};

function leeVersion(json) {
  readJSON(json)
    .then((data) => {
      document.querySelector('.version').innerText = data.version;
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error al cargar el archivo:', error);
    });
}

function configuracionLoad() {
  const url = new URL(window.location.href);
  controlN = url.searchParams.get('control_N');
  controlT = url.searchParams.get('control_T');
  nr = url.searchParams.get('nr');
  nr === '0' ? nr = '-' : nr;
  document.getElementById('doc').innerText = `Doc: ${nr}`;
  document.getElementById('wichC').innerText = controlT;
  document.getElementById('wichC').style.display = 'inline';
}

function tr(palabra) {
  const index = arrayEspanolOperativo.indexOf(palabra.trim());
  if (index !== -1) {
    return arrayTranslateOperativo[index];
  }
  return null;
}

async function cargaDeRegistros() {
  const empresaData = await traerRegistros('empresa');
  arrayGlobal.arrayEmpresa = [...empresaData];

  const selectoresData = await traerRegistros(`Selectores,${controlN}`);
  arrayGlobal.arraySelect = [...selectoresData];

  const nuevoControlData = await traerRegistros(`NuevoControl,${controlN}`);
  tablaVacia(nuevoControlData, encabezados);
}

async function loadLenguages(leng) {
  try {
    const {
      arrayTranslateOperativo: translateOperativo,
      arrayEspanolOperativo: espanolOperativo,
      arrayTranslateArchivo: translateArchivo,
      arrayEspanolArchivo: espanolArchivo,
    } = await translate.translate(leng);
    arrayTranslateOperativo = translateOperativo;
    arrayEspanolOperativo = espanolOperativo;
    arrayTranslateArchivo = translateArchivo;
    arrayEspanolArchivo = espanolArchivo;
    leeVersion('version');
    setTimeout(() => {
      configuracionLoad();
      cargaDeRegistros();
      spinner.style.visibility = 'hidden';
    }, 2000);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Ocurrió un error al cargar los datos:', error);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  spinner.style.visibility = 'visible';
  try {
    const datosUser = localStorage.getItem('datosUser');
    if (datosUser) {
      const datos = JSON.parse(datosUser);
      document.querySelector('.custom-button').innerText = datos.lng.toUpperCase();
      loadLenguages(datos.lng);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);
    spinner.style.visibility = 'hidden';
  }
});

const goLanding = document.querySelector('.custom-button');
goLanding.addEventListener('click', () => {
  const url = '../Landing';
  window.location.href = url;
});
