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
import traerRegistros from './Controllers/traerRegistros.js';
import createA from '../../includes/atoms/createA.js';
import createButton from '../../includes/atoms/createButton.js';
import createDiv from '../../includes/atoms/createDiv.js';
import createLabel from '../../includes/atoms/createLabel.js';
import createInput from '../../includes/atoms/createInput.js';
import createSelect from '../../includes/atoms/createSelect.js';
import { desencriptar } from '../../controllers/cript.js';
import createSpan from '../../includes/atoms/createSpan.js';
import enviaMailNuevoCliente from '../../Nodemailer/sendNuevoCliente.js';
import arrayGlobal from '../../controllers/variables.js';
// import { Alerta } from '../../includes/atoms/alerta.js';
import Alerta from '../../includes/atoms/alerta.js';

const spinner = document.querySelector('.spinner');
const appJSON = {};
let objTranslate = [];

const SERVER = baseUrl;

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function checaRequeridos() {
  const nombre = document.getElementById('nombre');
  nombre.classList.remove('input-register-requerido');
  nombre.classList.add('input-register');
  if (nombre.value === '') {
    nombre.classList.remove('input-register');
    nombre.classList.add('input-register-requerido');
    return false;
  }

  const pass = document.getElementById('pass');
  pass.classList.remove('input-register-requerido');
  pass.classList.add('input-register');
  if (pass.value === '') {
    pass.classList.remove('input-register');
    pass.classList.add('input-register-requerido');
    return false;
  }

  const repetirPass = document.getElementById('repetirPass');
  repetirPass.classList.remove('input-register-requerido');
  repetirPass.classList.add('input-register');
  if (repetirPass.value === '') {
    repetirPass.classList.remove('input-register');
    repetirPass.classList.add('input-register-requerido');
    return false;
  }
  const email = document.getElementById('email');
  if (!validarEmail(email.value)) {
    email.classList.remove('input-register');
    email.classList.add('input-register-requerido');
    return false;
  }

  const areaSelect = document.getElementById('area');
  const selectedValue = areaSelect.value;
  const selectedText = areaSelect.options[areaSelect.selectedIndex].text;

  const puesto = document.getElementById('puesto');

  const selectedTipoDeUsuario = document.getElementById('tipo_usuario');
  const selectedTipoValue = selectedTipoDeUsuario.value;
  const selectedTipoText =
    selectedTipoDeUsuario.options[selectedTipoDeUsuario.selectedIndex].text;

  const selectedSituacion = document.getElementById('situacion');
  const selectedSituacionValue = selectedSituacion.value;
  const selectedSituacionText =
    selectedSituacion.options[selectedSituacion.selectedIndex].text;

  const firma = document.getElementById('firma');

  const selectedIdioma = document.getElementById('idioma');
  const selectedIdiomaValue = selectedIdioma.value;
  const selectedIdiomaText =
    selectedIdioma.options[selectedIdioma.selectedIndex].text;

  const objeto = {
    nombre: nombre.value,
    pass: pass.value,
    valueArea: parseInt(selectedValue, 10),
    area: selectedText,
    puesto: puesto.value,
    idtipousuario: parseInt(selectedTipoValue, 10),
    textTipoDeUsuario: selectedTipoText,
    valueSituacion: selectedSituacionValue,
    textSituacion: selectedSituacionText,
    email: email.value,
    firma: firma.value,
    valueIdioma: selectedIdiomaValue,
    textIdioma: selectedIdiomaText,
  };
  return { add: true, objeto };
}

async function nuevoUser() {
  const envia = checaRequeridos();
  if (envia.add) {
    const plant = desencriptar(sessionStorage.getItem('plant'));
    const response = await traerRegistros(
      envia.objeto,
      '/addUsuario',
      parseInt(plant.value, 10),
    );

    if (response.success) {
      const objetoEmail = {
        cliente: plant.texto,
        usuario: envia.objeto.nombre,
        idusuario: response.id,
        email: envia.objeto.email,
        v: response.v,
        subject: 'Nuevo usuario',
        mensaje: 'Se dio de alta un nuevo usuario:',
      };

      const miAlerta = new Alerta();
      const obj = arrayGlobal.avisoAmarillo;
      obj.close.display = 'none';
      const texto =
        trO('Aguarde un instante luego será redirigido.', objTranslate) ||
        'Aguarde un instante luego será redirigido.';
      miAlerta.createVerde(obj, texto, objTranslate);

      const modal = document.getElementById('modalAlertVerde');
      modal.style.display = 'block';

      const mailEnviado = await enviaMailNuevoCliente(
        objetoEmail,
        '/sendNuevoUsuario',
      );

      if (mailEnviado.success) {
        const id = document.getElementById('id');
        id.value = response.id;
        if (!modal) {
          // console.warn('Error de carga en el modal');
        }
        modal.style.display = 'none';

        // Espera a que el modal sea removido del DOM antes de redirigir
        await new Promise((resolve) => {
          requestAnimationFrame(() => {
            modal.remove();
            resolve();
          });
        });

        const url = `${SERVER}/Pages/Login`;
        window.location.href = url;
      }
    } else {
      const miAlerta = new Alerta();
      const obj = arrayGlobal.avisoRojo;
      const texto =
        trO('El usuario ya existe', objTranslate) || 'El usuario ya existe';
      miAlerta.createVerde(obj, texto, objTranslate);
      const modal = document.getElementById('modalAlertVerde');
      modal.style.display = 'block';
    }
  }
}

function setearSelects() {
  const id = document.getElementById('id');
  id.setAttribute('disabled', true);
  const situacion = document.getElementById('situacion');
  situacion.options[1].selected = true;
  situacion.setAttribute('disabled', true);
  const verificador = document.getElementById('verificador');
  verificador.options[1].selected = true;
  verificador.setAttribute('disabled', true);
  const idiomaPreferido = navigator.languages[1];
  const idioma = document.getElementById('idioma');
  idioma.value = idiomaPreferido;
  const idSpanRepetirPass = document.getElementById('idSpanRepetirPass');
  idSpanRepetirPass.style.display = 'none';

  const repetirPass = document.getElementById('repetirPass');
  repetirPass.addEventListener('input', (e) => {
    const pass = document.getElementById('pass');

    if (e.target.value !== pass.value) {
      idSpanRepetirPass.classList.remove('span-no-repite-pass');
      idSpanRepetirPass.classList.add('span-si-repite-pass');
      idSpanRepetirPass.innerText = 'No están coincidiendo.';
      idSpanRepetirPass.style.display = 'block';
      repetirPass.classList.remove('input-register');
      repetirPass.classList.add('input-register-requerido');
    } else {
      idSpanRepetirPass.classList.remove('span-si-repite-pass');
      idSpanRepetirPass.classList.add('span-no-repite-pass');
      idSpanRepetirPass.innerText = 'Correcto!';
      repetirPass.classList.remove('input-register-requerido');
      repetirPass.classList.add('input-register');
    }
  });

  const button = document.getElementById('idButtonRegisterUser');
  button.addEventListener('click', (e) => {
    const clase = e.target.className;
    if (clase === 'button-register') {
      nuevoUser();
    }
    if (clase === 'button-user-update') {
      // console.log('Actualizar usuario');
    }
  });
}

function creador(element) {
  let elemento = null;
  if (element.tag === 'label') {
    const elem = element;
    elem.config.innerHTML =
      trO(element.config.innerHTML, objTranslate) || element.config.innerHTML;
    elemento = createLabel(element.config);
  }
  if (element.tag === 'input') {
    elemento = createInput(element.config);
  }
  if (element.tag === 'a') {
    const elem = element;
    elem.config.textContent =
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
    const elem = element;
    elem.config.text =
      trO(element.config.text, objTranslate) || element.config.text;
    elemento = createButton(element.config);
  }
  if (element.tag === 'div') {
    elemento = createDiv(element.config);
  }
  if (element.tag === 'span') {
    const elem = element;
    elem.config.text =
      trO(element.config.text, objTranslate) || element.config.text;
    elemento = createSpan(element.config);
  }
  return elemento;
}

function armadoDeHTML(json) {
  try {
    const div = document.querySelector('.div-register');
    const elementos = json.elements;
    elementos.forEach((element) => {
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
    const mailInvitado = desencriptar(sessionStorage.getItem('mailInvitado'));
    const email = document.getElementById('email');
    email.value = mailInvitado;
  } catch (error) {
    // console.log(error);
  }
}

function traduccionDeLabel(objTraduce) {
  const div = document.querySelector('.div-register');
  const labels = div.querySelectorAll('.label-login');
  labels.forEach((element) => {
    const texto =
      trO(element.textContent.trim(), objTraduce) || element.textContent.trim();
    const elem = element;
    elem.innerText = texto;
  });
}

async function cargaSelectArea(objTraduce) {
  const plant = desencriptar(sessionStorage.getItem('plant'));
  const areas = await traerRegistros(
    'traerLTYarea',
    '/traerAreasParaRegistroUser',
    plant.value,
  );

  if (areas.length === 0) {
    const select = document.getElementById('area');
    const option = document.createElement('option');
    option.value = 0;
    const texto = trO('Área', objTraduce) || 'Área';
    option.text = texto;
    select.appendChild(option);
  } else if (areas.length > 0) {
    const select = document.getElementById('area');
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.text = '';
    select.appendChild(emptyOption);
    areas.forEach(([value, text]) => {
      const option = document.createElement('option');
      option.value = value;
      option.text = trO(text, objTraduce) || text;
      select.appendChild(option);
    });
  }
}

async function cargaTipoDeUsuario(objTraduce) {
  const tipoDeUsuario = await traerRegistros(
    'traerTipoDeUsuario',
    '/traerTipoDeUsuarioParaRegistroUser',
    null,
  );
  if (tipoDeUsuario.length > 0) {
    const select = document.getElementById('tipo_usuario');
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.text = '';
    select.appendChild(emptyOption);
    tipoDeUsuario.forEach(([value, text]) => {
      const option = document.createElement('option');
      option.value = value;
      option.text = trO(text, objTraduce) || text;
      select.appendChild(option);
    });
    select.selectedIndex = 1;
    select.disabled = true;
  }
}

function leeModelo(ruta) {
  readJSON(ruta)
    .then((data) => {
      armadoDeHTML(data);
      traduccionDeLabel(objTranslate);
      cargaSelectArea(objTranslate);
      cargaTipoDeUsuario(objTranslate);
      setearSelects();
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
    if (e.target.matches('.input-register')) {
      if (
        e.key === ',' ||
        e.key === ':' ||
        e.key === "'" ||
        e.key === '"' ||
        e.key === '/' ||
        e.key === '*'
      ) {
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
    try {
      objTranslate = await arraysLoadTranslate();
    } catch (error) {
      console.error('Error al cargar traducciones en register:', error);
      objTranslate = []; // Usar array vacío como fallback
    }
    leeApp('log');
    leeModelo('Register/registerUser');

    // const nuevaCadena = dondeEstaEn(objTranslate, 'Regístrese.');
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
    // console.log(error);
  }
}

const volver = document.getElementById('volver');
volver.addEventListener('click', () => {
  goBack(null);
});
