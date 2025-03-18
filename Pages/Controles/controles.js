// eslint-disable-next-line no-unused-vars, import/extensions
import readJSON from '../../controllers/read-JSON.js';
// eslint-disable-next-line import/extensions
import personModal from '../../controllers/person.js';
// eslint-disable-next-line import/extensions
import {
  inicioPerformance,
  finPerformance,
} from '../../includes/Conection/conection.js';
// eslint-disable-next-line import/extensions, import/no-useless-path-segments
import { desencriptar, encriptar } from '../../controllers/cript.js';
// eslint-disable-next-line import/extensions
import cargaTabla from './controlViews.js';
// eslint-disable-next-line import/extensions
import traerRegistros from './Modules/Controladores/traerRegistros.js';
// eslint-disable-next-line import/extensions
// import { Alerta } from '../../includes/atoms/alerta.js';
import Alerta from '../../includes/atoms/alerta.js';
// eslint-disable-next-line import/extensions
import arrayGlobal from '../../controllers/variables.js';

import baseUrl from '../../config.js';
import { configPHP } from '../../controllers/configPHP.js';
import { arraysLoadTranslate } from '../../controllers/arraysLoadTranslate.js';
import { trO } from '../../controllers/trOA.js';
import LogOut from '../../controllers/logout.js';

const SERVER = baseUrl;
let objTranslate = [];

const spinner = document.querySelector('.spinner');
const objButtons = {};
const navegador = {
  estadoAnteriorButton: '',
  estadoAnteriorWhereUs: [],
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

function leeApp(json) {
  readJSON(json)
    .then((data) => {
      Object.assign(objButtons, data);
      const search = document.getElementById('search');
      search.placeholder = trO('Buscar...', objTranslate) || 'Buscar...';
      search.style.display = 'inline';
      const doc = document.getElementById('doc');
      doc.placeholder = trO('Doc', objTranslate) || 'Doc';
      const divUbicacionDoc = document.querySelector('.div-ubicacionDoc');
      divUbicacionDoc.style.display = 'block';
      const { planta } = objButtons;
      document.getElementById('spanUbicacion').textContent = planta;
      const divButtons = document.querySelector('.div-controles-buttons');
      divButtons.style.display = 'none';

      const user = desencriptar(sessionStorage.getItem('user'));
      const { plant } = user;
      const nivel = parseInt(user.tipo, 10);
      cargaTabla(objTranslate, plant, nivel);
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error al cargar el archivo:', error);
    });
}

function dondeEstaEn() {
  let lugar = trO('Menú', objTranslate) || 'Menú';
  lugar = `${trO('Controles', objTranslate) || 'Controles'}`;
  lugar = `<img src='${SERVER}/assets/img/icons8-brick-wall-50.png' height='10px' width='10px'> ${lugar}`;
  document.getElementById('whereUs').innerHTML = lugar;
  document.getElementById('whereUs').style.display = 'inline';
  const divVolver = document.querySelector('.div-volver');
  divVolver.style.display = 'block';
  document.getElementById('volver').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', async () => {
  // Ajustes iniciales de la interfaz
  document.querySelector('.header-McCain').style.display = 'none';
  document.querySelector('.div-encabezado').style.marginTop = '5px';

  // Desencriptar información del usuario
  const user = desencriptar(sessionStorage.getItem('user'));
  const { plant } = user;

  // Inicio de procesos de performance y configuración
  inicioPerformance();
  configPHP(user, SERVER);
  spinner.style.visibility = 'visible';

  // Ocultar elementos innecesarios
  const hamburguesa = document.querySelector('#hamburguesa');
  hamburguesa.style.display = 'none';

  // Desencriptar y configurar el idioma de la interfaz
  const persona = desencriptar(sessionStorage.getItem('user'));
  const quienEs = document.getElementById('spanPerson');
  quienEs.innerText = persona.person;
  if (persona) {
    document.querySelector('.custom-button').innerText =
      persona.lng.toUpperCase();

    // Cargar la versión y las traducciones, luego ejecutar las aplicaciones
    await leeVersion('version');

    async function iniciarAplicacion() {
      objTranslate = await arraysLoadTranslate();
      dondeEstaEn();
      await leeApp(`App/${plant}/app`);

      spinner.style.visibility = 'hidden';
      finPerformance();
    }

    requestAnimationFrame(iniciarAplicacion);
  } else {
    spinner.style.visibility = 'hidden';
    finPerformance();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const person = document.getElementById('person');
  person.addEventListener('click', () => {
    person.style.border = '3px solid #212121';
    person.style.background = '#212121';
    person.style.borderRadius = '10px 10px 0px 0px';
    const persona = desencriptar(sessionStorage.getItem('user'));
    const user = {
      person: persona.person,
      home: 'Inicio',
      salir: trO('Cerrar sesión', objTranslate),
    };
    personModal(user, objTranslate);
  });
});

const buscaDoc = document.getElementById('imgDoc');
buscaDoc.addEventListener('click', async () => {
  const documento = document.getElementById('doc').value;

  if (!Number.isNaN(documento)) {
    const array = await traerRegistros(
      `verificarControl,${documento.trim()}`,
      null,
      null,
    );
    if (array.length > 0) {
      let contenido = {
        control_N: array[0][0],
        control_T: array[0][1],
        nr: documento.trim(),
      };
      contenido = encriptar(contenido);
      sessionStorage.setItem('contenido', contenido);
      // const url = '../Control/index.php'
      const timestamp = new Date().getTime();
      const url = `${SERVER}/Pages/Router/rutas.php?ruta=control&v=${timestamp}`;
      // console.log(url);
      window.location.href = url;
      // // window.open(url, '_blank')
    } else {
      const miAlerta = new Alerta();
      const aviso = 'No se encontraron registros con el documento';
      const mensaje = trO(aviso, objTranslate) || aviso;
      arrayGlobal.avisoRojo.div.top = '500px';
      arrayGlobal.avisoRojo.close.id = 'idCloseAvisoAmarillo';
      miAlerta.createVerde(
        arrayGlobal.avisoRojo,
        `${mensaje} ${documento}.`,
        objTranslate,
      );
      const modal = document.getElementById('modalAlertVerde');
      modal.style.display = 'block';
    }
  } else {
    const miAlerta = new Alerta();
    const aviso = 'Error. El código del documento debe ser un número.';
    const mensaje = trO(aviso, objTranslate) || aviso;
    arrayGlobal.avisoRojo.div.top = '500px';
    arrayGlobal.avisoRojo.close.id = 'idCloseAvisoAmarillo';
    miAlerta.createVerde(arrayGlobal.avisoRojo, mensaje, objTranslate);
    const modal = document.getElementById('modalAlertVerde');
    modal.style.display = 'block';
    // console.log('El valor no es un número.')
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const simulateAsignarEventos = urlParams.get('simulateAsignarEventos');
  if (simulateAsignarEventos === 'true') {
    const persona = desencriptar(sessionStorage.getItem('user'));
    if (persona) {
      document.querySelector('.custom-button').innerText =
        persona.lng.toUpperCase();

      // setTimeout(() => {
      //   // segundaCargaListado()
      // }, 200)
    }
  }
  setTimeout(() => {
    alert('Tu sesión está por expirar. Haz clic en Aceptar para continuar.');
    LogOut();
  }, 43200000 - 300000);
});

const goLanding = document.querySelector('.custom-button');
goLanding.addEventListener('click', () => {
  const url = `${SERVER}/Pages/Landing`;
  window.location.href = url;
});

const volver = document.getElementById('volver');
volver.addEventListener('click', () => {
  const url = `${SERVER}/Pages/Menu`;
  window.location.href = url;
});
