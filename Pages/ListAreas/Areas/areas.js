// eslint-disable-next-line no-unused-vars, import/extensions
import readJSON from '../../../controllers/read-JSON.js';
// eslint-disable-next-line import/extensions
import personModal from '../../../controllers/person.js';
// eslint-disable-next-line import/extensions
import {
  inicioPerformance,
  finPerformance,
} from '../../../includes/Conection/conection.js';
// eslint-disable-next-line import/extensions, import/no-useless-path-segments
import { desencriptar } from '../../../controllers/cript.js';
// import fechasGenerator from '../../../controllers/fechas.js'
import baseUrl from '../../../config.js';
// eslint-disable-next-line import/extensions
import arrayGlobal from '../../../controllers/variables.js';
// import { Alerta } from '../../../includes/atoms/alerta.js';
import Alerta from '../../../includes/atoms/alerta.js';
import { configPHP } from '../../../controllers/configPHP.js';
import { arraysLoadTranslate } from '../../../controllers/arraysLoadTranslate.js';
import { trO, trA } from '../../../controllers/trOA.js';

const SERVER = baseUrl;
let objTranslate = [];
const spinner = document.querySelector('.spinner');
const objButtons = {};

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

function traduccionDeLabels(objTrad) {
  const form = document.querySelector('#formArea');
  const labels = form.querySelectorAll('label');
  labels.forEach((label) => {
    const texto = trO(label.textContent, objTrad) || label.textContent;
    label.innerText = texto;
  });
}

function limpiarInputs() {
  const form = document.querySelector('#formArea');
  const inputs = form.querySelectorAll('input');
  inputs.forEach((input) => {
    input.value = '';
  });

  document.getElementById('nombreDeArea').focus();
}

function fijarTextoSelect(selectElement, texto) {
  if (!selectElement) {
    console.log('El elemento select no fue encontrado.');
    return;
  }
  for (let i = 0; i < selectElement.options.length; i++) {
    const option = selectElement.options[i];
    if (option.text === texto) {
      selectElement.selectedIndex = i; // Establece el índice seleccionado directamente
      break;
    }
  }
}

function fijarValorSelect(selectElement, valor) {
  if (!selectElement) {
    console.log('El elemento select no fue encontrado.');
    return;
  }
  for (let i = 0; i < selectElement.options.length; i++) {
    const option = selectElement.options[i];
    if (option.value === valor) {
      selectElement.selectedIndex = i; // Establece el índice seleccionado directamente
      break;
    }
  }
}

function cargaInputs(array, objTrad) {
  // console.log(array)
  try {
    const idControl = document.getElementById('numeroDeArea');
    idControl.value = array[0];

    const nombreDeArea = document.getElementById('nombreDeArea');
    nombreDeArea.value = trA(array[1], objTrad) || array[1];

    const situacion = document.getElementById('situacion');
    const visible = document.getElementById('visible');
    setTimeout(() => {
      fijarTextoSelect(situacion, trO(array[2]) || array[2]);
      fijarTextoSelect(visible, trO(array[3]) || array[3]);
    }, 500);
  } catch (error) {
    console.log(error);
  }
}

function cargarSelects(array, selector, primerOption, objTrad) {
  const select = document.querySelector(`#${selector}`);
  select.innerHTML = '';
  const option = document.createElement('option');
  option.text = '';
  option.value = '';
  primerOption ? select.appendChild(option) : null;
  array.forEach((element) => {
    const option = document.createElement('option');
    option.text = trO(element[1], objTrad) || element[1];
    option.value = element[0];
    select.appendChild(option);
  });
}

async function traerInfoSelects(objTrad) {
  const situacion = [
    [1, 'ON'],
    [2, 'OFF'],
  ];
  cargarSelects(situacion, 'situacion', false, objTrad);

  const visible = [
    [1, 'ON'],
    [2, 'OFF'],
  ];
  cargarSelects(visible, 'visible', false, objTrad);
}

function leeApp(json) {
  readJSON(json)
    .then((data) => {
      Object.assign(objButtons, data);

      const { planta } = objButtons;
      document.getElementById('spanUbicacion').textContent = planta;
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error al cargar el archivo:', error);
    });
}

function dondeEstaEn(lugar, control_T, objTrad) {
  // const { control_T } = desencriptar(sessionStorage.getItem('contenido'))

  // let lugar = trO('EDITAR: ') || 'EDITAR: '
  lugar = `${lugar} ${trO(control_T, objTrad) || control_T}`;
  lugar = `<img src='${SERVER}/assets/img/icons8-brick-wall-50.png' height='10px' width='10px'> ${lugar}`;
  document.getElementById('whereUs').innerHTML = lugar;
  document.getElementById('whereUs').style.display = 'inline';
}

document.addEventListener('DOMContentLoaded', async () => {
  const area = desencriptar(sessionStorage.getItem('area'));
  const user = desencriptar(sessionStorage.getItem('user'));
  const { plant } = user;
  inicioPerformance();
  configPHP(user, SERVER);
  spinner.style.visibility = 'visible';
  const hamburguesa = document.querySelector('#hamburguesa');
  hamburguesa.style.display = 'block';
  const divVolver = document.querySelector('.div-volver');
  divVolver.style.display = 'block';
  document.getElementById('volver').style.display = 'block';
  document.querySelector('.header-McCain').style.display = 'none';
  document.querySelector('.div-encabezado').style.marginTop = '5px';
  const persona = desencriptar(sessionStorage.getItem('user'));
  if (persona) {
    document.querySelector('.custom-button').innerText =
      persona.lng.toUpperCase();
    leeVersion('version');
    setTimeout(async () => {
      // dondeEstaEn()
      objTranslate = await arraysLoadTranslate();
      leeApp(`App/${plant}/app`);
      traduccionDeLabels(objTranslate);
      limpiarInputs();
      if (typeof area.idArea === 'number') {
        document.getElementById('whereUs').style.display = 'none';
        dondeEstaEn(
          '',
          trO('Área nueva', objTranslate) || 'Área nueva',
          objTranslate,
        );
      }
      if (typeof area.idArea === 'string') {
        const lugar = trO('EDITAR: ', objTranslate) || 'EDITAR: ';
        dondeEstaEn(lugar, area.control_T, objTranslate);
        cargaInputs(area.filtrado[0], objTranslate);
      }
      traerInfoSelects(objTranslate);

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
    }, 200);
  }
  spinner.style.visibility = 'hidden';
  finPerformance();
});

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const simulateAsignarEventos = urlParams.get('simulateAsignarEventos');
  if (simulateAsignarEventos === 'true') {
    const persona = desencriptar(sessionStorage.getItem('user'));
    if (persona) {
      document.querySelector('.custom-button').innerText =
        persona.lng.toUpperCase();
      setTimeout(() => {
        // segundaCargaListado()
      }, 200);
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const hamburguesa = document.getElementById('hamburguesa');
  hamburguesa.addEventListener('click', () => {
    const area = desencriptar(sessionStorage.getItem('area'));
    // let guardarareaComo = false
    if (typeof area.idArea === 'string') {
      arrayGlobal.guardarareaComo = true;
    }
    const miAlertaM = new Alerta();
    miAlertaM.createModalMenuCRUDArea(
      arrayGlobal.objMenu,
      objTranslate,
      arrayGlobal.guardarareaComo,
    );
    const modal = document.getElementById('modalAlertM');
    // const closeButton = document.querySelector('.modal-close')
    // closeButton.addEventListener('click', closeModal)
    modal.style.display = 'block';
  });
});

document.addEventListener('DOMContentLoaded', () => {
  // Seleccionar todos los inputs de texto y textareas
  const inputs = document.querySelectorAll('input[type=text], textarea');

  // Función para bloquear caracteres
  function bloquearCaracteres(event) {
    const blockedChars = ['.', ',', '/', ':', "'", '"']; // Caracteres que quieres bloquear
    if (blockedChars.includes(event.key)) {
      event.preventDefault(); // Prevenir la acción por defecto (evita que se ingrese el carácter)
    }
  }

  // Añadir el evento keydown a cada input y textarea
  inputs.forEach((input) => {
    input.addEventListener('keydown', bloquearCaracteres);
  });
});

const goLanding = document.querySelector('.custom-button');
goLanding.addEventListener('click', () => {
  const url = `${SERVER}/Pages/Landing`;
  window.location.href = url;
});

const volver = document.getElementById('volver');
volver.addEventListener('click', () => {
  const url = `${SERVER}/Pages/ListAreas`;
  window.location.href = url;
});
