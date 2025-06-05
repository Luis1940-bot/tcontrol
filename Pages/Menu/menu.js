// eslint-disable-next-line no-unused-vars, import/extensions
import readJSON from '../../controllers/read-JSON.js';
// eslint-disable-next-line import/extensions
import createButton from '../../includes/atoms/createButton.js';
// eslint-disable-next-line import/extensions
import personModal from '../../controllers/person.js';
// eslint-disable-next-line import/extensions
import {
  inicioPerformance,
  finPerformance,
} from '../../includes/Conection/conection.js';
// eslint-disable-next-line import/extensions, import/no-useless-path-segments
import { desencriptar } from '../../controllers/cript.js';

import baseUrl from '../../config.js';
import { configPHP } from '../../controllers/configPHP.js';
import { arraysLoadTranslate } from '../../controllers/arraysLoadTranslate.js';
import { trO } from '../../controllers/trOA.js';
import Alerta from '../../includes/atoms/alerta.js';
import arrayGlobal from '../../controllers/variables.js';
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
      // console.error('Error al cargar el archivo:', error)
      const miAlerta = new Alerta();
      const obj = arrayGlobal.avisoRojo;
      const texto =
        trO('Error al cargar el archivo.', objTranslate) ||
        'Error al cargar el archivo.';
      miAlerta.createVerde(obj, texto, objTranslate);
      const modal = document.getElementById('modalAlertVerde');
      modal.style.display = 'block';
    });
}

/* eslint-disable no-use-before-define */
function asignarEventos() {
  const buttons = document.querySelectorAll('.button-selector-menu');
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      const ruta = objButtons[navegador.estadoAnteriorButton].name[index];
      window.location.href = `${SERVER}/Pages/${ruta}/index.php`;
    });
  });
}

/* eslint-enable no-use-before-define */

function completaButtons(obj) {
  const divButtons = document.querySelector('.div-menu-buttons');
  divButtons.innerHTML = '';
  document.getElementById('spanUbicacion').innerText = objButtons.planta;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < objButtons[obj].name.length; i++) {
    const element = objButtons[obj].name[i];
    // const ruta = objButtons[obj].ruta[i];

    const params = {
      text: trO(element, objTranslate) || element,
      name: objButtons[obj].name[i],
      class: 'btn-modern button-selector-menu',
      innerHTML: null,
      height: null, // 35
      width: null, // 75%
      borderRadius: '5px',
      border: null,
      textAlign: 'center',
      marginLeft: null,
      marginRight: null,
      marginTop: null,
      marginBotton: null,
      paddingLeft: null,
      paddingRight: null,
      paddingTop: null,
      paddingBotton: null,
      background: null,
      confecha: null,
      operation: null,
      ini: null,
      outi: null,
      tipo: null,
      procedure: null,
    };
    const newButton = createButton(params);
    divButtons.appendChild(newButton);
  }
  asignarEventos();
}

function leeApp(json) {
  readJSON(json)
    .then((data) => {
      Object.assign(objButtons, data);
      navegador.estadoAnteriorButton = 'Menu';
      navegador.estadoAnteriorWhereUs.push('Menu');
      completaButtons('Menu');
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error al cargar el archivo:', error);
    });
}

function dondeEstaEn() {
  // const ustedEstaEn = `${trO('Usted está en')} ` || 'Usted está en ';
  // document.getElementById('whereUs').innerText = ustedEstaEn;
  let lugar = trO('Menú', objTranslate) || 'Menú';
  lugar = `<img src='${SERVER}/assets/img/icons8-brick-wall-50.png' height='10px' width='10px'> ${lugar}`;
  document.getElementById('whereUs').innerHTML = lugar;
  document.getElementById('whereUs').style.display = 'inline';
  document.getElementById('volver').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', async () => {
  const user = desencriptar(sessionStorage.getItem('user'));
  const { plant } = user;

  inicioPerformance();
  configPHP(user, SERVER);
  // document.querySelector('.header-McCain').style.display = 'none';
  // spinner.style.visibility = 'visible';

  const hamburguesa = document.querySelector('#hamburguesa');
  hamburguesa.style.display = 'none';

  const persona = desencriptar(sessionStorage.getItem('user'));
  if (persona) {
    document.querySelector('.custom-button').innerText =
      persona.lng.toUpperCase();
    await leeVersion('version');

    async function iniciarAplicacion() {
      objTranslate = await arraysLoadTranslate();
      dondeEstaEn();
      leeApp(`App/${plant}/app`);
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
    const quienEs = document.getElementById('spanPerson');
    quienEs.innerText = persona.person;
    const user = {
      person: persona.person,
      home: 'Inicio',
      salir: trO('Cerrar sesión', objTranslate),
    };
    personModal(user, objTranslate);
  });
  setTimeout(() => {
    alert('Tu sesión está por expirar. Haz clic en Aceptar para continuar.');
    LogOut();
  }, 43200000 - 300000);
  console.clear();
});

const goLanding = document.querySelector('.custom-button');
goLanding.addEventListener('click', () => {
  const url = `${SERVER}/Pages/Landing`;
  window.location.href = url;
});

function goBack() {
  const url = `${SERVER}/Pages/Home`;
  window.location.href = url;
}

const volver = document.getElementById('volver');
volver.addEventListener('click', () => {
  goBack();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    goBack();
  }
});
