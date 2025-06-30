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
import { trO, trA } from '../../controllers/trOA.js';
import { arraysLoadTranslate } from '../../controllers/arraysLoadTranslate.js';
import Alerta from '../../includes/atoms/alerta.js';
import arrayGlobal from '../../controllers/variables.js';
import LogOut from '../../controllers/logout.js';
import { mostrarMensajeError } from '../../controllers/utils.js';

const SERVER = baseUrl;
let objTranslate = [];

const spinner = document.querySelector('.spinner');
const objButtons = {};
const navegador = {
  estadoAnteriorButton: '',
  estadoAnteriorWhereUs: [],
};

const espacio = ' > ';

function leeVersion(json) {
  readJSON(json)
    .then((data) => {
      document.querySelector('.version').innerText = data.version;
    })
    .catch(() => {
      // eslint-disable-next-line no-console
      // console.error('Error al cargar el archivo:', error);
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

function localizador(e) {
  const lugar = trO(e.target.innerText, objTranslate) || e.target.innerText;
  document.getElementById('whereUs').innerText += `${espacio}${lugar}`;
  let { textContent } = document.getElementById('whereUs');
  textContent = textContent.replace('<br>', '');
  document.getElementById('whereUs').innerText = textContent;
  document.getElementById('volver').style.display = 'block';
  document.getElementById('whereUs').style.display = 'inline';
  navegador.estadoAnteriorButton = e.target.name;
  navegador.estadoAnteriorWhereUs.push(e.target.name);
}

function dondeEstaEn() {
  let lugar = trO('Consultas', objTranslate) || 'Consultas';
  lugar = `<img src='${SERVER}/assets/img/icons8-brick-wall-50.png' height='10px' width='10px'> ${lugar}`;
  document.getElementById('whereUs').innerHTML = lugar;
  document.getElementById('whereUs').style.display = 'inline';
  document.getElementById('volver').style.display = 'block';
}

function llamarProcedure(name, confecha, ini, outi, procedure, operation) {
  try {
    if (procedure) {
      const timestamp = new Date().getTime();
      // const ruta = `../../Pages/ConsultasViews/viewsGral.php?v=${Math.round(
      //   Math.random() * 10
      // )}`
      const ruta = `${SERVER}/Pages/Router/rutas.php?ruta=consultasViews&v=${timestamp}`;
      let contenido = {
        name,
        confecha,
        ini,
        outi,
        procedure,
        operation,
      };
      contenido = encriptar(contenido);
      sessionStorage.setItem('procedure', contenido);
      // window.open(ruta, '_blank')
      window.location.href = ruta;
    }
  } catch (error) {
    // console.log(error);
  }
}

const funcionDeClick = (e) => {
  const claveBuscada = e.target.name;
  const tipoValue = e.target.getAttribute('tipo');
  const persona = desencriptar(sessionStorage.getItem('user'));
  const quienEs = document.getElementById('spanPerson');
  quienEs.innerText = persona.person;
  const tipodeusuario = parseInt(persona.tipo, 10);
  if (tipoValue === '1') {
    localizador(e);
    // eslint-disable-next-line no-use-before-define
    completaButtons(claveBuscada, tipodeusuario);
  } else if (tipoValue === '0') {
    const procedure = e.target.getAttribute('procedure');
    const name = e.target.getAttribute('name');
    const ini = e.target.getAttribute('ini');
    const outi = e.target.getAttribute('outi');
    const confecha = e.target.getAttribute('confecha');
    const operation = e.target.getAttribute('operation');
    llamarProcedure(name, confecha, ini, outi, procedure, operation);
  }
};

/* eslint-enable no-use-before-define */
function completaButtons(obj, tipodeusuario) {
  if (!obj) {
    return;
  }
  const divButtons = document.querySelector('.div-consultas-buttons');
  divButtons.innerHTML = '';
  // document.getElementById('spanUbicacion').innerText = objButtons.planta
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < objButtons[obj].name.length; i++) {
    let aprobado = true;
    if (tipodeusuario < objButtons[obj].nivel[i]) {
      aprobado = false;
    }
    const element = objButtons[obj].name[i];
    const active = objButtons[obj].active[i];
    let procedure;
    let ini;
    let outi;
    let confecha = null;
    let operation = null;
    const boton = objButtons[obj].button[i];
    if (boton === 0) {
      procedure = objButtons[obj].procedure[i];
      ini = JSON.stringify(objButtons[obj].in[i]);
      outi = JSON.stringify(objButtons[obj].out[i]);
      confecha = objButtons[obj].confecha[i];
      operation = objButtons[obj].operation[i];
    }
    const name = objButtons[obj].name[i];
    const params = {
      text: trA(element, objTranslate) || element,
      name,
      class: 'btn-modern button-selector-consultas',
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
      tipo: objButtons[obj].button[i],
      procedure,
      confecha,
      ini,
      outi,
      operation,
      onClick: funcionDeClick,
    };
    if (active === 1 && aprobado) {
      const newButton = createButton(params);
      divButtons.appendChild(newButton);
    }
  }
}

function leeApp(json, complit, tipodeusuario) {
  readJSON(json)
    .then((data) => {
      Object.assign(objButtons, data);
      navegador.estadoAnteriorButton = 'Consultas';
      navegador.estadoAnteriorWhereUs.push('Consultas');
      document.getElementById('spanUbicacion').innerText = objButtons.planta;
      complit ? completaButtons('Consultas', tipodeusuario) : null;
    })
    .catch(() => {
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

document.addEventListener('DOMContentLoaded', async () => {
  const user = desencriptar(sessionStorage.getItem('user'));
  const { plant } = user;

  inicioPerformance();
  configPHP(user, SERVER);
  spinner.style.visibility = 'visible';

  const hamburguesa = document.querySelector('#hamburguesa');
  hamburguesa.style.display = 'none';
  // document.querySelector('.header-McCain').style.display = 'none';
  document.querySelector('.div-encabezado').style.marginTop = '5px';

  const persona = desencriptar(sessionStorage.getItem('user'));

  // ✅ Declarar la función antes del `if`
  async function iniciarAplicacion(tipodeusuario) {
    objTranslate = await arraysLoadTranslate();
    dondeEstaEn();
    await leeApp(`App/${plant}/app`, false, tipodeusuario);
    await leeApp(`consultas/${plant}/app`, true, tipodeusuario);

    spinner.style.visibility = 'hidden';
    finPerformance();
  }

  if (persona) {
    document.querySelector('.custom-button').innerText =
      persona.lng.toUpperCase();
    await leeVersion('version');
    const tipodeusuario = parseInt(persona.tipo, 10);

    // ✅ Ahora la función ya está definida antes de usarla
    requestAnimationFrame(() => iniciarAplicacion(tipodeusuario));
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
  setTimeout(() => {
    mostrarMensajeError(
      'Tu sesión está por expirar. Haz clic en Aceptar para continuar.',
    );
    LogOut();
  }, 43200000 - 300000);
});

function goMenu() {
  const url = `${SERVER}/Pages/Menu`;
  window.location.href = url;
}

function goBack() {
  try {
    let quitarCadena = ` > ${
      navegador.estadoAnteriorWhereUs[
        navegador.estadoAnteriorWhereUs.length - 1
      ]
    }`;

    navegador.estadoAnteriorWhereUs.pop();
    navegador.estadoAnteriorButton =
      navegador.estadoAnteriorWhereUs[
        navegador.estadoAnteriorWhereUs.length - 1
      ];
    const clave =
      navegador.estadoAnteriorWhereUs[
        navegador.estadoAnteriorWhereUs.length - 1
      ];

    // console.log(navegador.estadoAnteriorButton)
    // console.log(navegador.estadoAnteriorWhereUs)
    // console.log(navegador.estadoAnteriorWhereUs.length)
    completaButtons(clave);
    const cadena = `${document.getElementById('whereUs').innerText}`;
    quitarCadena = quitarCadena.replace('>', '');
    quitarCadena = trO(quitarCadena, objTranslate) || quitarCadena;
    let nuevaCadena = cadena.replace(quitarCadena, '');
    const ultimoIndice = nuevaCadena.lastIndexOf('>');
    if (ultimoIndice === -1) {
      goMenu();
    }
    nuevaCadena =
      nuevaCadena.slice(0, ultimoIndice) + nuevaCadena.slice(ultimoIndice + 1);
    if (clave === 'Consultas') {
      dondeEstaEn();
      return;
    }
    document.getElementById('whereUs').innerText = `${nuevaCadena}`;
    let { textContent } = document.getElementById('whereUs');
    textContent = textContent.replace('<br>', '');
    document.getElementById('whereUs').innerText = textContent;
  } catch (error) {
    // console.log(error);
  }
}

const volver = document.getElementById('volver');
volver.addEventListener('click', () => {
  goBack(null);
});

const goLanding = document.querySelector('.custom-button');
goLanding.addEventListener('click', () => {
  const url = `${SERVER}/Pages/Landing`;
  window.location.href = url;
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    goMenu();
  }
});
