// eslint-disable-next-line import/extensions
import traerRegistros from './Modules/Controladores/traerRegistros.js';
// eslint-disable-next-line import/extensions
import tablaVacia from './Modules/armadoDeTabla.js';
// eslint-disable-next-line import/extensions
import arrayGlobal from '../../controllers/variables.js';
// eslint-disable-next-line no-unused-vars, import/extensions
import readJSON from '../../controllers/read-JSON.js';
// eslint-disable-next-line import/extensions
import menuModal from '../../controllers/menu.js';
// eslint-disable-next-line import/extensions
import personModal from '../../controllers/person.js';
// eslint-disable-next-line import/extensions, import/no-named-as-default
import translate, {
  // eslint-disable-next-line no-unused-vars
  arrayTranslateOperativo,
  // eslint-disable-next-line no-unused-vars
  arrayEspanolOperativo,
// eslint-disable-next-line import/extensions
} from '../../controllers/translate.js';
// eslint-disable-next-line import/extensions
import { Alerta } from '../../includes/atoms/alerta.js';

let data = {};
let translateOperativo = [];
let espanolOperativo = [];
const objTranslate = {
  operativoES: [],
  operativoTR: [],
};

let controlN = '';
// let controlT = '';
let nr = 0;
const spinner = document.querySelector('.spinner');
const encabezados = {
  title: [
    'id', 'concepto', 'relevamiento', 'detalle', 'observación', 'idControl',
  ],
  width: [
    '.05', '.15', '.25', '.25', '.25', '0',
  ],
};

function leeVersion(json) {
  readJSON(json)
    .then((datas) => {
      document.querySelector('.version').innerText = datas.version;
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error al cargar el archivo:', error);
    });
}

function configuracionLoad() {
  const url = new URL(window.location.href);
  controlN = url.searchParams.get('control_N');
  // controlT = url.searchParams.get('control_T');
  nr = url.searchParams.get('nr');
  nr === '0' ? nr = '' : nr;
  document.getElementById('doc').innerText = `Doc: ${nr}`;
  // document.getElementById('wichC').innerText = controlT;
  document.getElementById('wichC').style.display = 'inline';
}

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

function actualizarProgreso(porcentaje) {
  return new Promise((resolve) => {
    const idSpanCarga = document.getElementById('idSpanCarga');
    const startTime = new Date().getTime();
    const duration = 1000; // Duración total en milisegundos (1 segundo)
    const startPercentage = parseFloat(idSpanCarga.innerText) || 0; // Obtener el porcentaje inicial

    function update() {
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - startTime;

      // Calcular el porcentaje interpolado y convertir a cadena para eliminar decimales
      const interpolatedPercentage = Math.min(100, startPercentage + (elapsedTime / duration) * 10);
      const parteEntera = Math.floor(interpolatedPercentage);

      // Actualizar el elemento con el porcentaje interpolado
      idSpanCarga.innerText = `${parteEntera}%`;

      if (elapsedTime < duration) {
        // Si no ha pasado el tiempo total, seguir actualizando
        requestAnimationFrame(update);
      } else {
        // Si ha pasado el tiempo total, establecer el porcentaje final y resolver la promesa
        idSpanCarga.innerText = porcentaje;
        resolve();
      }
    }

    // Iniciar la actualización
    update();
  });
}

async function cargaDeRegistros() {
  await actualizarProgreso('10%');
  const countSelect = await traerRegistros(`countSelect,${controlN}`);
  localStorage.setItem('cantidadProcesos', Number(countSelect[0][0]) + 4);

  await actualizarProgreso('20%');
  const empresaData = await traerRegistros('empresa');
  arrayGlobal.arrayEmpresa = [...empresaData];

  await actualizarProgreso('30%');
  const selectoresData = await traerRegistros(`Selectores,${controlN}`);
  arrayGlobal.arraySelect = [...selectoresData];

  await actualizarProgreso('40%');
  const nuevoControlData = await traerRegistros(`NuevoControl,${controlN}`);
  arrayGlobal.arrayControl = [...nuevoControlData];

  // Finaliza la carga y realiza cualquier otra acción necesaria
  tablaVacia(nuevoControlData, encabezados);

  // Ajustar el porcentaje a 100% al finalizar
  await actualizarProgreso('99%');
}

async function mensajeDeCarga() {
  const miAlerta = new Alerta();
  const mensaje = trO(arrayGlobal.avisoCargandoControl.span.text);
  miAlerta.createControl(arrayGlobal.avisoCargandoControl, mensaje, objTranslate);
  const modal = document.getElementById('modalAlertCarga');
  modal.style.display = 'block';
  localStorage.setItem('loadSystem', 1);

  // Agrega un retraso antes de iniciar la carga de registros
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((resolve) => setTimeout(() => resolve(), 200));

  await cargaDeRegistros();
}

async function arraysLoadTranslate() {
  const persona = JSON.parse(localStorage.getItem('user'));
  if (persona) {
    data = await translate(persona.lng);
    translateOperativo = data.arrayTranslateOperativo;
    espanolOperativo = data.arrayEspanolOperativo;
    mensajeDeCarga();
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  spinner.style.visibility = 'visible';
  // eslint-disable-next-line no-console
  console.time('timeControl');
  arrayGlobal.habilitadoGuardar = false;
  localStorage.setItem('firma', JSON.stringify('x'));
  localStorage.setItem('config_menu', JSON.stringify('x'));
  localStorage.setItem('envia_por_email', false);
  localStorage.setItem('doc', null);
  const supervisor = {
    id: 0,
    mail: '',
    mi_cfg: '',
    nombre: '',
    tipo: 0,
  };
  localStorage.setItem('firmado', JSON.stringify(supervisor));
  try {
    const persona = JSON.parse(localStorage.getItem('user'));
    if (persona) {
      document.querySelector('.custom-button').innerText = persona.lng.toUpperCase();
      leeVersion('version');
      const datas = await translate(persona.lng);
      translateOperativo = datas.arrayTranslateOperativo;
      espanolOperativo = datas.arrayEspanolOperativo;
      objTranslate.operativoES = [...espanolOperativo];
      objTranslate.operativoTR = [...translateOperativo];

      setTimeout(() => {
        configuracionLoad();
        // cargaDeRegistros();
        arraysLoadTranslate();
        spinner.style.visibility = 'hidden';
        // eslint-disable-next-line no-console
        console.timeEnd('timeControl');
      }, 300);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);
    spinner.style.visibility = 'hidden';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const hamburguesa = document.getElementById('hamburguesa');
  hamburguesa.addEventListener('click', () => {
    menuModal(objTranslate);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const person = document.getElementById('person');
  person.addEventListener('click', () => {
    const persona = JSON.parse(localStorage.getItem('user'));
    const user = {
      person: persona.person,
      salir: 'Cerrar sesión',
    };
    personModal(user, objTranslate);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const tableControl = document.getElementById('tableControl');
  tableControl.addEventListener('change', () => {
    arrayGlobal.habilitadoGuardar = true;
  });
});

const goLanding = document.querySelector('.custom-button');
goLanding.addEventListener('click', () => {
  const url = '../Landing';
  window.location.href = url;
});

if (navigator.connection) {
  const connectionType = navigator.connection.type;

  switch (connectionType) {
    case 'wifi':
      console.log('El usuario está conectado a través de Wi-Fi.');
      break;
    case 'cellular':
      console.log('El usuario está conectado a través de una red celular.');
      break;
    case 'ethernet':
      console.log('El usuario está conectado a través de una conexión Ethernet.');
      break;
    case 'none':
      console.log('El usuario no tiene conexión a Internet.');
      break;
    default:
      console.log('Tipo de conexión no reconocido:', connectionType);
  }

  // Puedes acceder a más detalles de la conexión, como la velocidad
  const connectionSpeed = navigator.connection.downlink;
  console.log('Velocidad de conexión:', connectionSpeed);
} else {
  console.log('El navegador no admite la API de Network Information.');
}
