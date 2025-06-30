// eslint-disable-next-line no-unused-vars, import/extensions
import readJSON from '../../controllers/read-JSON.js';
// eslint-disable-next-line import/extensions
import {
  inicioPerformance,
  finPerformance,
} from '../../includes/Conection/conection.js';

import baseUrl from '../../config.js';
import leeVersion from '../../controllers/leeVersion.js';
import { trO } from '../../controllers/trOA.js';
import { arraysLoadTranslate } from '../../controllers/arraysLoadTranslate.js';
import { configPHP } from '../../controllers/configPHP.js';
// import { dondeEstaEn } from '../../controllers/dondeEstaEn.js';
// import traerRegistros from './Controllers/traerRegistros.js';
import createA from '../../includes/atoms/createA.js';
import createButton from '../../includes/atoms/createButton.js';
import createDiv from '../../includes/atoms/createDiv.js';
import createLabel from '../../includes/atoms/createLabel.js';
import createInput from '../../includes/atoms/createInput.js';
import createSelect from '../../includes/atoms/createSelect.js';
import { desencriptar } from '../../controllers/cript.js';
import createSpan from '../../includes/atoms/createSpan.js';
// import enviaMailNuevoCliente from '../../Nodemailer/sendNuevoCliente.js';
import arrayGlobal from '../../controllers/variables.js';
// import { Alerta } from '../../includes/atoms/alerta.js';
import Alerta from '../../includes/atoms/alerta.js';
import traerAuth from '../Login/Controllers/traerAuth.js';
import nuevoCorreoAuth from './Controllers/nuevoCorreo.js';

const spinner = document.querySelector('.spinner');
const appJSON = {};
let objTranslate = [];

const SERVER = baseUrl;

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function checaRequeridos() {
  const email = document.getElementById('idInput0');
  if (!validarEmail(email.value)) {
    email.classList.remove('input-auth');
    email.classList.add('input-auth-requerido');
    return false;
  }

  const objeto = {
    email: email.value,
  };
  return { add: true, objeto };
}

async function autorizarCorreo() {
  const envia = checaRequeridos();

  if (envia.add) {
    const plant = desencriptar(sessionStorage.getItem('plant'));

    try {
      const response = await traerAuth(
        parseInt(plant.value, 10),
        envia.objeto.email.trim(),
        '/auth',
      );

      if (response.success) {
        const miAlerta = new Alerta();
        const obj = arrayGlobal.avisoRojo;
        obj.close.display = 'block';
        const texto =
          trO('Este correo ya fue autorizado.', objTranslate) ||
          'Este correo ya fue autorizado.';
        miAlerta.createVerde(obj, texto, objTranslate);

        const modal = document.getElementById('modalAlertVerde');
        modal.style.display = 'block';
      } else {
        const q = {
          email: envia.objeto.email.trim(),
          plant: parseInt(plant.value, 10),
        };

        const insert = await nuevoCorreoAuth(q, '/nuevoAuth');

        if (insert.success) {
          const miAlerta = new Alerta();
          const obj = arrayGlobal.avisoVerde;
          obj.close.display = 'block';
          const texto =
            trO('Se registró con éxito.', objTranslate) ||
            'Se registró con éxito.';
          miAlerta.createVerde(obj, texto, objTranslate);

          const modal = document.getElementById('modalAlertVerde');
          modal.style.display = 'block';
        }
      }
    } catch (error) {
      console.error('Error en traerAuth:', error);
    }
  }
}

function creador(element) {
  let elemento = null;
  if (element.tag === 'label') {
    // eslint-disable-next-line no-param-reassign
    element.config.innerHTML =
      trO(element.config.innerHTML, objTranslate) || element.config.innerHTML;
    elemento = createLabel(element.config);
  }
  if (element.tag === 'input') {
    elemento = createInput(element.config);
  }
  if (element.tag === 'a') {
    // eslint-disable-next-line no-param-reassign
    element.config.textContent =
      trO(element.config.textContent, objTranslate) ||
      element.config.textContent;
    elemento = createA(element.config, element.config.textContent);
  }
  if (element.tag === 'select') {
    let array = [];
    // eslint-disable-next-line no-prototype-builtins
    if (element.hasOwnProperty('options')) {
      if (element.options.length > 0) {
        array = [...element.options];
      }
    }
    elemento = createSelect(array, element.config);
  }
  if (element.tag === 'button') {
    // eslint-disable-next-line no-param-reassign
    element.config.text =
      trO(element.config.text, objTranslate) || element.config.text;
    elemento = createButton(element.config);
  }
  if (element.tag === 'div') {
    elemento = createDiv(element.config);
  }
  if (element.tag === 'span') {
    // eslint-disable-next-line no-param-reassign
    element.config.text =
      trO(element.config.text, objTranslate) || element.config.text;
    elemento = createSpan(element.config);
  }
  return elemento;
}

function armadoDeHTML(obj) {
  try {
    const json = obj;
    const div = document.querySelector('.div-auth');
    const elementos = json.elements;
    elementos.forEach((element) => {
      if (element.tag === 'button') {
        // eslint-disable-next-line no-param-reassign
        element.config.onClick = autorizarCorreo;
      }
      const elementoCreado = creador(element);

      if (element.children) {
        const elementoChildren = element.children;
        elementoChildren.forEach((e) => {
          const hijo = creador(e);
          hijo ? elementoCreado.appendChild(hijo) : null;
        });
      }
      elementoCreado ? div.appendChild(elementoCreado) : null;
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.debug(error);
  }
}

function traduccionDeLabel(objTranslateL) {
  const div = document.querySelector('.div-auth');
  const labels = div.querySelectorAll('.label-auth');
  labels.forEach((element) => {
    const texto =
      trO(element.textContent.trim(), objTranslateL) ||
      element.textContent.trim();
    // eslint-disable-next-line no-param-reassign
    element.innerText = texto;
  });
}

function leeModelo(ruta) {
  readJSON(ruta)
    .then((data) => {
      armadoDeHTML(data);
      traduccionDeLabel(objTranslate);
    })
    .catch((error) => {
      console.error('Error al cargar el archivo:', error);
    });
}

function leeApp(json) {
  readJSON(json)
    .then((data) => {
      Object.assign(appJSON, data);
      configPHP(data, SERVER);
    })
    .catch((error) => {
      console.error('Error al cargar el archivo:', error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('keydown', (e) => {
    if (e.target.matches('.input-auth')) {
      if (e.key === ',' || e.key === ':' || e.key === "'" || e.key === '"') {
        e.preventDefault();
      }
    }
  });
});

document.addEventListener('DOMContentLoaded', async () => {
  inicioPerformance();
  spinner.style.visibility = 'visible';

  const hamburguesa = document.querySelector('#hamburguesa');
  hamburguesa.style.display = 'none';

  const person = document.querySelector('#person');
  person.style.display = 'none';

  const version = await leeVersion('version');
  document.querySelector('.version').innerText = version;

  async function inicializar() {
    objTranslate = await arraysLoadTranslate();
    leeApp('log');
    leeModelo('Auth/auth');

    const spanUbicacion = document.getElementById('spanUbicacion');
    const plant = desencriptar(sessionStorage.getItem('plant'));
    spanUbicacion.innerText = plant.texto;

    const volver = document.getElementById('volver');
    volver.style.display = 'block';

    spinner.style.visibility = 'hidden';
    finPerformance();
  }

  function verificarElementos() {
    const spanUbicacion = document.getElementById('spanUbicacion');
    const volver = document.getElementById('volver');

    if (spanUbicacion && volver) {
      inicializar();
    } else {
      requestAnimationFrame(verificarElementos); // Continúa intentando hasta que los elementos estén presentes
    }
  }

  requestAnimationFrame(verificarElementos); // Inicia la verificación de los elementos
});

function goBack() {
  try {
    let back = sessionStorage.getItem('volver');
    if (back) {
      back = desencriptar(back);
    }
    const url = `${SERVER}/Pages/${back}`;
    window.location.href = url;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.debug(error);
  }
}

const volver = document.getElementById('volver');
volver.addEventListener('click', () => {
  goBack(null);
});
