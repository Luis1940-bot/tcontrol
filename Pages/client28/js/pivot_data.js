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

import baseUrl from '../../../config.js';
import { configPHP } from '../../../controllers/configPHP.js';
import { arraysLoadTranslate } from '../../../controllers/arraysLoadTranslate.js';
import { trO } from '../../../controllers/trOA.js';
import LogOut from '../../../controllers/logout.js';
import traerPivot from './traer.js';

const SERVER = baseUrl;
const spinner = document.querySelector('.spinner');
let objTranslate = [];

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
      // console.log(data);
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error al cargar el archivo:', error);
    });
}

function dondeEstaEn(objTrad) {
  let lugar = `${trO('Evolución Bitácora', objTrad) || 'Evolución Bitácora'}`;
  lugar = `<img src='${SERVER}/assets/img/icons8-brick-wall-50.png' height='10px' width='10px'> ${lugar}`;
  document.getElementById('whereUs').innerHTML = lugar;
  document.getElementById('whereUs').style.display = 'inline';
  document.getElementById('volver').style.display = 'block';
}

function pivotData(row) {
  // console.log(row);
  const table = {};
  const fechas = new Set();

  row.forEach(({ TAG, fecha, valor }) => {
    let TAG2 = TAG;
    TAG2 = TAG2.trim();
    if (!table[TAG2]) table[TAG2] = {};
    table[TAG2][fecha] = valor;
    fechas.add(fecha);
  });

  const fechaList = [...fechas].sort();
  const tableElement = document.getElementById('tableBitacora28');
  tableElement.innerHTML = ''; // limpiar

  // Header
  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  headRow.innerHTML = `<th>TAG</th>${fechaList.map((f) => `<th>${f}</th>`).join('')}`;
  thead.appendChild(headRow);
  tableElement.appendChild(thead);

  // Body
  const tbody = document.createElement('tbody');
  Object.keys(table).forEach((tag) => {
    const row2 = document.createElement('tr');
    row2.innerHTML = `<td>${tag}</td>${fechaList
      .map((f) => `<td>${table[tag][f] || ''}</td>`)
      .join('')}`;
    tbody.appendChild(row2);
  });

  tableElement.appendChild(tbody);
  tableElement.style.display = 'block';
}

async function cargar(objeto) {
  const response = await traerPivot(objeto);
  if (response && response.success && Array.isArray(response.data)) {
    pivotData(response.data);
  } else {
    console.warn('No se pudo cargar la data del servidor. Detalles:', response);
    // Podés también mostrar un mensaje en pantalla, porque llorar por consola no ayuda al usuario
    const table = document.getElementById('tableBitacora28');
    table.innerHTML =
      '<tr><td colspan="999">No hay datos disponibles 😢</td></tr>';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const user = desencriptar(sessionStorage.getItem('user'));
  const { plant } = user;
  inicioPerformance();
  configPHP(user, SERVER);
  document.querySelector('.header-McCain').style.display = 'none';
  document.querySelector('.div-encabezado').style.marginTop = '5px';
  spinner.style.visibility = 'visible';
  const hamburguesa = document.querySelector('#hamburguesa');
  hamburguesa.style.display = 'none';

  const persona = desencriptar(sessionStorage.getItem('user'));
  const quienEs = document.getElementById('spanPerson');
  quienEs.innerText = persona.person;
  if (persona) {
    document.querySelector('.custom-button').innerText =
      persona.lng.toUpperCase();

    leeVersion('version');

    // Reemplazar setTimeout con requestAnimationFrame
    requestAnimationFrame(async () => {
      objTranslate = await arraysLoadTranslate();
      dondeEstaEn(objTranslate);
      leeApp(`App/${plant}/app`);
      const params = new URLSearchParams(window.location.search);
      const ctrl = params.get('ctrl');
      const nme = params.get('nme');

      if (nme) {
        const span = document.getElementById('whereUs');
        const img = span.querySelector('img');
        span.innerHTML = ''; // Limpia todo
        span.appendChild(img); // Vuelve a poner al ícono
        span.append(` ${decodeURIComponent(nme)}`); // Agrega el texto
      }

      cargar({
        vista: `vista_json_valores_28_${ctrl}`,
        desdeI: '2025-03-01',
        hastaI: '2025-04-22',
      });
      // tablaVacia(objTranslate);
    });
  }

  spinner.style.visibility = 'hidden';
  finPerformance();
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

function goBack() {
  const url = `${SERVER}/Pages/Home/index.php?simulateAsignarEventos=true`;
  window.location.href = url;
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
