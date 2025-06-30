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
import { desencriptar, encriptar } from '../../controllers/cript.js';

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

/* eslint-disable no-use-before-define */
function asignarEventos() {
  const buttons = document.querySelectorAll('.button-selector-sadmin');
  sessionStorage.setItem('volver', encriptar('Sadmin'));
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      let ruta = objButtons.Sad.name[index];
      if (ruta === 'phpinfo' || ruta === 'hash') {
        // window.location.href = `${SERVER}/${ruta}.php`;
        ruta = `${SERVER}/${ruta}.php`;
        window.open(ruta, '_blank');
      } else if (
        ruta === 'pegarExcel' ||
        ruta === 'verRepetidosControl' ||
        ruta === 'Corregir Registros' ||
        ruta === 'Ver Log' ||
        ruta === 'Forzar Reload'
      ) {
        ruta = objButtons.Sad.ruta[index];
        // window.location.href = `${SERVER}/Pages/${ruta}`;
        ruta = `${SERVER}/${ruta}.php`;
        window.open(ruta, '_blank');
      } else {
        window.location.href = `${SERVER}/Pages/${ruta}/index.php`;
      }
    });
  });
}

/* eslint-enable no-use-before-define */

function completaButtons(obj) {
  const divButtons = document.querySelector('.div-sadmin-buttons');
  divButtons.innerHTML = '';
  document.getElementById('spanUbicacion').innerText = objButtons.planta;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < objButtons[obj].name.length; i++) {
    const element = objButtons[obj].name[i];
    // const ruta = objButtons[obj].ruta[i];
    const params = {
      text: trO(element, objTranslate) || element,
      name: objButtons[obj].name[i],
      class: 'button-selector-sadmin',
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
      navegador.estadoAnteriorButton = 'Sadmin';
      navegador.estadoAnteriorWhereUs.push('Sadmin');
      completaButtons('Sad');
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error al cargar el archivo:', error);
    });
}

function dondeEstaEn() {
  // const ustedEstaEn = `${trO('Usted está en')} ` || 'Usted está en ';
  // document.getElementById('whereUs').innerText = ustedEstaEn;
  let lugar = trO('Super Admin', objTranslate) || 'Super Admin';
  lugar = `<img src='${SERVER}/assets/img/icons8-brick-wall-50.png' height='10px' width='10px'> ${lugar}`;
  document.getElementById('whereUs').innerHTML = lugar;
  document.getElementById('whereUs').style.display = 'inline';
  document.getElementById('volver').style.display = 'block';
}

// document.addEventListener('DOMContentLoaded', async () => {
//   const user = desencriptar(sessionStorage.getItem('user'))
//   const { plant } = user
//   inicioPerformance()
//   configPHP(user, SERVER)
//   spinner.style.visibility = 'visible'
//   const hamburguesa = document.querySelector('#hamburguesa')
//   hamburguesa.style.display = 'none'
//   document.querySelector('.header-McCain').style.display = 'none'
//   const persona = desencriptar(sessionStorage.getItem('user'))
//   if (persona) {
//     document.querySelector('.custom-button').innerText =
//       persona.lng.toUpperCase()
//     leeVersion('version')
//     setTimeout(async () => {
//       objTranslate = await arraysLoadTranslate()
//       dondeEstaEn()
//       leeApp(`App/${plant}/app`)
//     }, 200)
//   }
//   spinner.style.visibility = 'hidden'
//   finPerformance()
// })

document.addEventListener('DOMContentLoaded', async () => {
  inicioPerformance();
  spinner.style.visibility = 'visible';

  const user = desencriptar(sessionStorage.getItem('user'));
  const { plant } = user;

  configPHP(user, SERVER);

  const hamburguesa = document.querySelector('#hamburguesa');
  hamburguesa.style.display = 'none';

  // const headerMcCain = document.querySelector('.header-McCain');
  // headerMcCain.style.display = 'none';

  const persona = desencriptar(sessionStorage.getItem('user'));
  const quienEs = document.getElementById('spanPerson');
  quienEs.innerText = persona.person;
  if (persona) {
    document.querySelector('.custom-button').innerText =
      persona.lng.toUpperCase();
  }

  async function inicializar() {
    const version = await leeVersion('version');
    document.querySelector('.version').innerText = version;

    objTranslate = await arraysLoadTranslate();
    dondeEstaEn();
    leeApp(`App/${plant}/app`);

    spinner.style.visibility = 'hidden';
    finPerformance();
  }

  function verificarElementos() {
    const customButton = document.querySelector('.custom-button');
    const versionElement = document.querySelector('.version');
    const hamburguesa = document.querySelector('#hamburguesa');
    const headerMcCain = document.querySelector('.header-McCain');

    if (customButton && versionElement && hamburguesa && headerMcCain) {
      inicializar();
    } else {
      requestAnimationFrame(verificarElementos); // Continúa intentando hasta que los elementos estén presentes
    }
  }

  requestAnimationFrame(verificarElementos); // Inicia la verificación de los elementos
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
