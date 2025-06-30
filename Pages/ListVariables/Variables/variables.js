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
import fechasGenerator from '../../../controllers/fechas.js';
import baseUrl from '../../../config.js';
// const SERVER = '/iControl-Vanilla/icontrol';
// eslint-disable-next-line import/extensions
import traerRegistros from '../Modules/Controladores/traerRegistros.js';
// eslint-disable-next-line import/extensions
import arrayGlobal from '../../../controllers/variables.js';
// import { Alerta } from '../../../includes/atoms/alerta.js';
import Alerta from '../../../includes/atoms/alerta.js';
import variableOnOff from '../Modules/Controladores/variableOnOff.js';
import variableUpDown from '../Modules/Controladores/variableUpDown.js';
import addVariable from '../Modules/Controladores/aceptarVariable.js';
import { configPHP } from '../../../controllers/configPHP.js';
import { arraysLoadTranslate } from '../../../controllers/arraysLoadTranslate.js';
import { trO } from '../../../controllers/trOA.js';

const SERVER = baseUrl;
let objTranslate = [];

let arrayReportesVinculdaos = [];

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

async function conceptoOnOff(id, status, item, arrayActual) {
  const nuevoArray = [...arrayActual];
  let nuevoStatus = 's';
  if (status === 'OFF') {
    nuevoStatus = 'n';
  }
  const actualizado = await variableOnOff(id, nuevoStatus, '/variableOnOff');
  if (actualizado.success) {
    const div2 = document.querySelector('.div2');
    div2.innerHTML = '';

    if (status === 'OFF') {
      nuevoStatus = 's';
    }
    if (status === 'ON') {
      nuevoStatus = 'n';
    }

    nuevoArray[item][3] = nuevoStatus;
    cargaVariables(nuevoArray);
  }
}

async function selectReporteOnOff(id, status, item, array) {
  const nuevoArray = [...array];
  let nuevoStatus = 's';
  const src = '';
  if (status === 'OFF') {
    nuevoStatus = 'n';
  }
  // console.log(id, status, item, array)
  const actualizado = await variableOnOff(
    id,
    nuevoStatus,
    '/selectReporteOnOff',
  );
  if (actualizado.success) {
    const div3 = document.querySelector('.div3');
    div3.innerHTML = '';
    const sinControles = document.createElement('label');
    sinControles.setAttribute('id', 'sinControles');
    div3.appendChild(sinControles);

    if (status === 'OFF') {
      nuevoStatus = 's';
    }
    if (status === 'ON') {
      nuevoStatus = 'n';
    }

    nuevoArray.forEach((arr) => {
      if (arr[0] === id) {
        // Modificar algún valor basado en la condición
        arr[6] = nuevoStatus;
      }
    });

    cargaReportesVinculado(nuevoArray);
  }
}

function traduccionDeLabels() {
  const form = document.querySelector('#formVariable');
  const labels = form.querySelectorAll('label');
  labels.forEach((label) => {
    const texto = trO(label.textContent, objTranslate) || label.textContent;
    label.innerText = texto;
  });
}

function limpiarInputs() {
  const form = document.querySelector('#formVariable');
  const inputs = form.querySelectorAll('input');
  inputs.forEach((input) => {
    input.value = '';
  });
  const textareas = form.querySelectorAll('textarea');
  textareas.forEach((textarea) => {
    textarea.value = '';
  });

  const dates = form.querySelectorAll('input[type=date]');
  dates.forEach((date) => {
    date.value = fechasGenerator.fecha_corta_yyyymmdd(new Date());
  });
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

function cargaInputs(array) {
  try {
    const numeroDelSelector = document.getElementById('numeroDelSelector');
    numeroDelSelector.value = array[4];
    const nombreDelSelect = document.getElementById('nombreDelSelect');
    nombreDelSelect.value = array[1];

    const tipodeusuario = document.getElementById('tipodeusuario');
    function checkAndSetValues() {
      if (tipodeusuario.options.length > 0) {
        fijarValorSelect(tipodeusuario, array[6]);
      } else {
        setTimeout(checkAndSetValues, 100); // Reintentar después de 100ms
      }
    }
    checkAndSetValues();
  } catch (error) {
    console.log(error);
  }
}

function reorderArray(id, orden, array, subebaja) {
  const newArray = [...array];
  newArray.sort((a, b) => {
    const valA = Number(a[5]);
    const valB = Number(b[5]);

    return valA - valB;
  });
  if (subebaja === 'up') {
    for (let i = 0; i < array.length; i++) {
      const element = Number(array[i][5]);
      if (Number(orden) === element) {
        const nuevoOrden = Number(orden) - 1;
        newArray[i][5] = String(nuevoOrden);
        i > 0 ? (newArray[i - 1][5] = String(orden)) : null;
        break;
      }
    }
  }

  if (subebaja === 'down') {
    for (let i = 0; i < array.length; i++) {
      const element = Number(array[i][5]);
      if (Number(orden) === element) {
        const nuevoOrden = Number(orden) + 1;
        newArray[i][5] = String(nuevoOrden);
        i < array.length - 1 ? (newArray[i + 1][5] = String(orden)) : null;
        break;
      }
    }
  }

  return newArray;
}

async function cambiarOrden(id, orden, subebaja, array) {
  const reorderedArray = reorderArray(id, orden, array, subebaja);

  const upDown = await variableUpDown(id, reorderedArray, '/variableUpDown');
  if (upDown.success) {
    const div2 = document.querySelector('.div2');
    div2.innerHTML = '';
    const nuevoArray = [...upDown.array];
    nuevoArray.sort((a, b) => {
      const valA = Number(a[5]);
      const valB = Number(b[5]);

      return valA - valB;
    });
    cargaVariables(nuevoArray);
  }
}

function cargaVariables(array) {
  // console.log(array)
  const div2 = document.querySelector('.div2');

  try {
    const titulo = document.createElement('span');
    titulo.innerText = trO('Variables', objTranslate) || 'Variables';
    titulo.setAttribute('id', 'titulo');
    div2.appendChild(titulo);
    array.forEach((element, index) => {
      const div = document.createElement('div');
      div.setAttribute('class', 'div-pastillita');
      div.setAttribute('id', `p${index}`);
      const input = document.createElement('input');
      input.value = element[2];
      input.setAttribute('class', 'span-variable');
      input.setAttribute('id', element[0]);
      const spanOnOff = document.createElement('span');
      let selector = element[3];
      let dirImg = '';
      if (selector === 'n') {
        selector = 'OFF';
        dirImg = 'icons8-inactive-24';
      }
      if (selector === 's') {
        selector = 'ON';
        dirImg = 'icons8-active-48';
      }
      let arrow = '';
      let dobleArrow = '';
      let subeBaja = '';
      const orden = parseInt(element[5]);
      if (orden <= 1) {
        arrow = 'icons8-page-down-button-50';
        subeBaja = 'down';
      } else if (orden >= array.length) {
        arrow = 'icons8-page-up-button-50';
        subeBaja = 'up';
      } else {
        arrow = 'icons8-page-down-button-50';
        dobleArrow = 'icons8-page-up-button-50';
        subeBaja = 'down';
      }

      spanOnOff.setAttribute('class', `span-${selector}`);
      spanOnOff.innerText = selector;
      div.appendChild(input);
      div.appendChild(spanOnOff);
      const imgStatus = document.createElement('img');
      imgStatus.setAttribute('class', `img-view-${selector}`);
      imgStatus.setAttribute('name', 'viewer');
      imgStatus.src = `${SERVER}/assets/img/${dirImg}.png`;
      imgStatus.style.cursor = 'pointer';
      imgStatus.setAttribute('data-index', element[0]);
      imgStatus.setAttribute('data-status', selector);
      imgStatus.setAttribute('data-item', index);
      imgStatus.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-index');
        const status = e.target.getAttribute('data-status');
        const item = e.target.getAttribute('data-item');
        conceptoOnOff(id, status, item, array);
      });
      div.appendChild(imgStatus);
      let imgArrow = document.createElement('img');
      imgArrow.setAttribute('class', 'img-arrow');
      imgArrow.src = `${SERVER}/assets/img/${arrow}.png`;
      imgArrow.setAttribute('data-index', element[0]);
      imgArrow.setAttribute('data-item', index);
      imgArrow.setAttribute('data-orden', element[5]);
      imgArrow.setAttribute('data-subebaja', subeBaja);

      imgArrow.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-index');
        const orden = e.target.getAttribute('data-orden');
        const item = e.target.getAttribute('data-item');
        const subebaja = e.target.getAttribute('data-subebaja');
        cambiarOrden(id, orden, subebaja, array);
      });
      div.appendChild(imgArrow);
      if (dobleArrow !== '') {
        imgArrow = document.createElement('img');
        imgArrow.setAttribute('class', 'img-arrow');
        imgArrow.src = `${SERVER}/assets/img/${dobleArrow}.png`;
        subeBaja = 'up';
        imgArrow.setAttribute('data-index', element[0]);
        imgArrow.setAttribute('data-item', index);
        imgArrow.setAttribute('data-orden', element[5]);
        imgArrow.setAttribute('data-subebaja', subeBaja);
        imgArrow.addEventListener('click', (e) => {
          const id = e.target.getAttribute('data-index');
          const orden = e.target.getAttribute('data-orden');
          const item = e.target.getAttribute('data-item');
          const subebaja = e.target.getAttribute('data-subebaja');
          cambiarOrden(id, orden, subebaja, array);
        });
        div.appendChild(imgArrow);
      }
      div2.appendChild(div);
    });
  } catch (error) {
    console.log(error);
  }
}

function intercambioDeDivs() {
  const pastillita = document.querySelectorAll('.div-pastillita');
  let idPastillita = 0;
  pastillita.forEach((element) => {
    idPastillita = element.getAttribute('id');
  });
  idPastillita = Number(idPastillita.slice(1));
  const formGroup = document.getElementById(`p${idPastillita}`);
  const inputElement = document.querySelector(
    `#p${idPastillita} .span-variable`,
  );
  const inputValue = inputElement.value;
  formGroup.remove();
  const leyenda = document.getElementById('leyenda');
  leyenda.style.display = 'none';
  const addButton = document.getElementById('addButton');
  addButton.style.display = 'flex';
  return { inputValue, idPastillita };
}

async function agregarVariable() {
  const { inputValue, idPastillita } = intercambioDeDivs();

  if (inputValue !== '') {
    const nuevoOrden = idPastillita + 1;
    const numeroDelSelector = document.getElementById('numeroDelSelector');
    const nombreDelSelect = document.getElementById('nombreDelSelect');
    const user = desencriptar(sessionStorage.getItem('user'));
    const { plant } = user;
    const objeto = {
      selector: parseInt(numeroDelSelector.value),
      nombre: nombreDelSelect.value,
      orden: nuevoOrden,
      concepto: inputValue,
      idLTYcliente: plant,
    };

    const resultado = await addVariable(objeto, '/addVariable');
    if (resultado.success) {
      const arrayActualizado = [...resultado.array];
      const div2 = document.querySelector('.div2');
      div2.innerHTML = '';
      cargaVariables(arrayActualizado);
    }
  }
}

function cancelarVariable() {
  intercambioDeDivs();
}

function intercambioDeDivsVinculo() {
  const pastillita = document.querySelectorAll('.div-pastillita-s');
  let idPastillita = 0;
  pastillita.forEach((element) => {
    idPastillita = element.getAttribute('id');
  });
  idPastillita = Number(idPastillita.slice(1));
  const formGroup = document.getElementById(`v${idPastillita}`);
  const selectElement = document.querySelector(
    `#v${idPastillita} .select-control`,
  );

  const selectValue = selectElement.value;
  const { selectedIndex } = selectElement;
  const selectedOption = selectElement.options[selectedIndex];
  const selectText = selectedOption ? selectedOption.text : '';
  formGroup.remove();
  const sinControles = document.getElementById('sinControles');

  idPastillita >= 1
    ? (sinControles.style.display = 'none')
    : (sinControles.style.display = 'flex');
  const addButton = document.getElementById('addButtonVincular');
  addButton.style.display = 'flex';
  return { selectValue, selectText, idPastillita };
}

async function agregarVinculo(div) {
  const { selectValue, selectText, idPastillita } = intercambioDeDivsVinculo();
  if (selectValue) {
    let guarda = true;
    const numeroDelSelector = document.getElementById('numeroDelSelector');
    const tipodeusuario = document.getElementById('tipodeusuario');
    const pastillita = document.querySelectorAll('.div-pastillita-s');
    pastillita.forEach((element) => {
      const idPasti = element.getAttribute('id');
      const input = document.querySelector(`#${idPasti} input`);
      const dataIndex = input.dataset.index;
      if (dataIndex === selectValue) {
        div.remove();
        guarda = false;
      }
    });

    const user = desencriptar(sessionStorage.getItem('user'));
    const { plant } = user;

    if (guarda) {
      const objeto = {
        selector: Number(numeroDelSelector.value),
        idLTYreporte: Number(selectValue),
        activo: 's',
        idusuario: Number(tipodeusuario.value),
        idLTYcliente: plant,
      };

      const resultado = await addVariable(objeto, '/addVinculo');
      if (resultado.success) {
        const pastillita = document.querySelectorAll('.div-pastillita-s');
        pastillita.forEach((element) => {
          const idPast = element.getAttribute('id');
          const divPastillita = document.getElementById(idPast);
          divPastillita.remove();
        });
        const titulo = document.getElementById('titulo-c');
        if (titulo) {
          titulo.remove();
        }

        traerSelectReportes(plant);
      }
    }
  }
}

function cancelarVinculo() {
  intercambioDeDivsVinculo();
}

const buttonAgregar = document.getElementById('buttonAgregar');
buttonAgregar.addEventListener('click', (e) => {
  try {
    e.preventDefault();
    const addButton = document.getElementById('addButton');
    addButton.style.display = 'none';
    const leyenda = document.getElementById('leyenda');
    leyenda.style.display = 'block';
    const pastillita = document.querySelectorAll('.div-pastillita');
    let idPastillita = 0;
    pastillita.forEach((element) => {
      idPastillita = element.getAttribute('id');
    });
    idPastillita = Number(idPastillita.slice(1));
    idPastillita++;

    const div2 = document.querySelector('.div2');
    const div = document.createElement('div');
    div.style.background = '#9d9d9d';
    div.setAttribute('class', 'div-pastillita');
    div.setAttribute('id', `p${idPastillita}`);
    const input = document.createElement('input');
    input.value = '';
    input.style.width = '55%';
    input.setAttribute('class', 'span-variable');
    input.addEventListener('keypress', (event) => {
      const { key } = event;

      // Condición para bloquear puntos y comas
      if (key === '.' || key === ',' || e.key === "'" || e.key === '"') {
        // Previene que el caracter sea ingresado
        event.preventDefault();
      }
    });
    input.focus();
    const buttonAceptar = document.createElement('button');
    buttonAceptar.setAttribute('class', 'button-add');
    buttonAceptar.innerText = trO('Aceptar', objTranslate) || 'Aceptar';
    buttonAceptar.style.marginLeft = '5px';
    buttonAceptar.addEventListener('click', (ele) => {
      // aceptar
      agregarVariable(ele);
    });
    const buttonCancel = document.createElement('button');
    buttonCancel.setAttribute('class', 'button-add');
    buttonCancel.innerText = trO('Cancelar', objTranslate) || 'Cancelar';
    buttonCancel.style.marginLeft = '5px';
    buttonCancel.style.color = 'red';
    buttonCancel.addEventListener('click', () => {
      // cancelar
      cancelarVariable('');
    });
    div.appendChild(input);
    div.appendChild(buttonAceptar);
    div.appendChild(buttonCancel);
    div2.appendChild(div);
  } catch (error) {
    console.log(error);
  }
});

const buttonVincular = document.getElementById('buttonVincular');
buttonVincular.addEventListener('click', (e) => {
  e.preventDefault();
  try {
    const addButton = document.getElementById('addButtonVincular');
    addButton.style.display = 'none';
    const sinControles = document.getElementById('sinControles');

    const pastillita = document.querySelectorAll('.div-pastillita-s');

    let idPastillita = 0;
    let cantidadPastillitas = 0;
    pastillita.forEach((element) => {
      idPastillita = element.getAttribute('id');
      cantidadPastillitas++;
    });

    if (idPastillita === 0) {
      idPastillita = Number(idPastillita);
    }
    if (idPastillita !== 0) {
      idPastillita = Number(idPastillita.slice(1));
    }
    idPastillita++;

    if (cantidadPastillitas >= 1) {
      sinControles.style.display = 'none';
    } else {
      sinControles.style.display = 'block';
    }
    const div3 = document.querySelector('.div3');
    const div = document.createElement('div');
    div.style.background = '#9d9d9d';
    div.setAttribute('class', 'div-pastillita-s');
    div.setAttribute('id', `v${idPastillita}`);

    const select = document.createElement('select');
    select.style.width = '55%';
    select.setAttribute('class', 'select-control');

    if (arrayReportesVinculdaos.length > 0) {
      const option = document.createElement('option');
      option.value = '';
      option.text = '';
      select.appendChild(option);
      arrayReportesVinculdaos.forEach((element) => {
        const value = element[0];
        const text = element[1];
        const option = document.createElement('option');
        option.value = value;
        option.text = `#${value}-${text}`;
        select.appendChild(option);
      });
    }
    const buttonAceptar = document.createElement('button');
    buttonAceptar.setAttribute('class', 'button-add');
    buttonAceptar.setAttribute('id', `b${idPastillita}`);
    buttonAceptar.innerText = trO('Aceptar', objTranslate) || 'Aceptar';
    buttonAceptar.style.marginLeft = '5px';
    buttonAceptar.addEventListener('click', (e) => {
      // aceptar
      const id = e.target.id.slice(1);
      const div = document.getElementById(`v${id}`);
      agregarVinculo(div);
    });
    const buttonCancel = document.createElement('button');
    buttonCancel.setAttribute('class', 'button-add');
    buttonCancel.setAttribute('id', `c${idPastillita}`);
    buttonCancel.innerText = trO('Cancelar', objTranslate) || 'Cancelar';
    buttonCancel.style.marginLeft = '5px';
    buttonCancel.style.color = 'red';
    buttonCancel.addEventListener('click', () => {
      // cancelar
      cancelarVinculo();
    });
    div.appendChild(select);
    div.appendChild(buttonAceptar);
    div.appendChild(buttonCancel);
    div3.appendChild(div);
  } catch (error) {
    console.log(error);
  }
});

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

function dondeEstaEn(lugar, control_T) {
  // const { control_T } = desencriptar(sessionStorage.getItem('contenido'))

  // let lugar = trO('EDITAR: ') || 'EDITAR: '
  lugar = `${lugar} ${trO(control_T, objTranslate) || control_T}`;
  lugar = `<img src='${SERVER}/assets/img/icons8-brick-wall-50.png' height='10px' width='10px'> ${lugar}`;
  document.getElementById('whereUs').innerHTML = lugar;
  document.getElementById('whereUs').style.display = 'inline';
}

function cargarSelects(array, selector, primerOption) {
  const select = document.querySelector(`#${selector}`);
  select.innerHTML = '';
  const option = document.createElement('option');
  option.text = '';
  option.value = '';
  primerOption ? select.appendChild(option) : null;
  array.forEach((element) => {
    const option = document.createElement('option');
    option.text = trO(element[1], objTranslate) || element[1];
    option.value = element[0];
    select.appendChild(option);
  });
}

function cargaReportesVinculado(arraySelectReporte) {
  const div3 = document.querySelector('.div3');
  const numeroDelSelector = document.getElementById('numeroDelSelector');
  const idSelector = numeroDelSelector.value;

  try {
    const array = arraySelectReporte.filter(
      (subArray) => subArray[1] === idSelector,
    );

    if (array.length === 0) {
      const sinControles = document.getElementById('sinControles');
      sinControles.style.display = 'block';
    } else {
      const sinControles = document.getElementById('sinControles');
      sinControles.style.display = 'none';
      const titulo = document.createElement('span');
      titulo.innerText = trO('Controles', objTranslate) || 'Controles';
      titulo.setAttribute('id', 'titulo-c');
      div3.appendChild(titulo);
    }

    array.forEach((element, index) => {
      const div = document.createElement('div');
      div.setAttribute('class', 'div-pastillita-s');
      div.setAttribute('id', `v${index}`);

      const input = document.createElement('input');
      input.value = element[3];
      input.setAttribute('class', 'span-variable-s');
      input.setAttribute('id', element[0]);
      input.setAttribute('data-index', `${element[2]}`);
      const spanOnOff = document.createElement('span');
      let selector = element[6];
      let dirImg = '';
      if (selector === 'n') {
        selector = 'OFF';
        dirImg = 'icons8-inactive-24';
      }
      if (selector === 's') {
        selector = 'ON';
        dirImg = 'icons8-active-48';
      }

      spanOnOff.setAttribute('class', `s-span-${selector}`);
      spanOnOff.innerText = selector;
      div.appendChild(input);
      div.appendChild(spanOnOff);
      const imgStatus = document.createElement('img');
      imgStatus.setAttribute('class', `s-img-view-${selector}`);
      imgStatus.setAttribute('name', 'viewer');
      imgStatus.src = `${SERVER}/assets/img/${dirImg}.png`;
      imgStatus.style.cursor = 'pointer';
      imgStatus.setAttribute('data-index', element[0]);
      imgStatus.setAttribute('data-status', selector);
      imgStatus.setAttribute('data-item', index);
      imgStatus.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-index');
        const status = e.target.getAttribute('data-status');
        const item = e.target.getAttribute('data-item');
        selectReporteOnOff(id, status, item, arraySelectReporte);
      });
      div.appendChild(imgStatus);
      div3.appendChild(div);
    });
  } catch (error) {
    console.log(error);
  }
}

async function traerInfoSelects() {
  const tipoDeUsuario = await traerRegistros(
    'traerTipoDeUsuario',
    '/traerReportes',
    null,
  );
  cargarSelects(tipoDeUsuario, 'tipodeusuario', false);
}

async function traerSelectReportes(plant) {
  const selectReporte = await traerRegistros(
    'traerSelectReporte',
    '/traerSelectReporte',
    plant,
  );
  const numeroDelSelector = document.getElementById('numeroDelSelector');
  const id = numeroDelSelector.value;
  const seen = new Set(); // Set para rastrear elementos únicos
  const arrayFiltrado = selectReporte
    .filter((arr) => {
      const element = arr[2]; // Segundo elemento es el criterio
      if (!seen.has(element)) {
        seen.add(element);
        return true;
      }
      return false;
    })
    .filter((arr) => arr[1] !== id);

  arrayFiltrado.sort((a, b) => {
    const elementA = a[3].toLowerCase();
    const elementB = b[3].toLowerCase();
    if (elementA < elementB) {
      return -1;
    }
    if (elementA > elementB) {
      return 1;
    }
    return 0;
  });

  arrayReportesVinculdaos = await traerRegistros(
    'traerReporteParaVincular',
    '/traerReporteParaVincular',
    plant,
  );
  cargaReportesVinculado(selectReporte);
}

document.addEventListener('DOMContentLoaded', async () => {
  const variable = desencriptar(sessionStorage.getItem('variable'));
  const divVolver = document.querySelector('.div-volver');
  divVolver.style.display = 'block';
  document.getElementById('volver').style.display = 'block';
  const user = desencriptar(sessionStorage.getItem('user'));
  const { plant } = user;
  inicioPerformance();
  configPHP(user, SERVER);
  // document.querySelector('.header-McCain').style.display = 'none';
  document.querySelector('.div-encabezado').style.marginTop = '5px';

  spinner.style.visibility = 'visible';
  const hamburguesa = document.querySelector('#hamburguesa');
  hamburguesa.style.display = 'block';
  const persona = desencriptar(sessionStorage.getItem('user'));
  if (persona) {
    document.querySelector('.custom-button').innerText =
      persona.lng.toUpperCase();
    objTranslate = await arraysLoadTranslate();
    const buttonAgregar = document.getElementById('buttonAgregar');
    buttonAgregar.innerText = trO('Variables', objTranslate) || 'Variables';
    const buttonVincular = document.getElementById('buttonVincular');
    buttonVincular.innerText = trO('Controles', objTranslate) || 'Controles';
    leeVersion('version');
    setTimeout(() => {
      // dondeEstaEn()
      leeApp(`App/${plant}/app`);
      traduccionDeLabels(objTranslate);
      limpiarInputs();
      if (typeof variable.control_N === 'number') {
        document.getElementById('whereUs').style.display = 'none';
        dondeEstaEn(
          '',
          trO('Variable nueva', objTranslate) || 'Variable nueva',
        );
      }
      arrayGlobal.guardarSelectorComo = true;

      if (typeof variable.control_N === 'number' && variable.control_N === 0) {
        const addButton = document.getElementById('addButton');
        addButton.style.display = 'none';
        const addButtonVincular = document.getElementById('addButtonVincular');
        addButtonVincular.style.display = 'none';
        arrayGlobal.guardarSelectorComo = false;
      }
      if (typeof variable.control_N === 'string') {
        const lugar = trO('EDITAR: ', objTranslate) || 'EDITAR: ';
        dondeEstaEn(lugar, variable.control_T);
        cargaInputs(variable.filtrado[0]);
        cargaVariables(variable.filtrado, objTranslate);
        traerSelectReportes(plant);
      }
      traerInfoSelects();
    }, 200);
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
});

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const simulateAsignarEventos = urlParams.get('simulateAsignarEventos');
  if (simulateAsignarEventos === 'true') {
    const persona = desencriptar(sessionStorage.getItem('user'));
    if (persona) {
      document.querySelector('.custom-button').innerText =
        persona.lng.toUpperCase();
      objTranslate = await arraysLoadTranslate();
      setTimeout(() => {
        // segundaCargaListado()
      }, 200);
    }
  }
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

document.addEventListener('DOMContentLoaded', () => {
  const hamburguesa = document.getElementById('hamburguesa');
  hamburguesa.addEventListener('click', () => {
    const miAlertaM = new Alerta();
    miAlertaM.createModalMenuCRUDSelector(
      arrayGlobal.objMenu,
      objTranslate,
      arrayGlobal.guardarSelectorComo,
    );
    const modal = document.getElementById('modalAlertM');
    // const closeButton = document.querySelector('.modal-close')
    // closeButton.addEventListener('click', closeModal)
    modal.style.display = 'block';
  });
});

const goLanding = document.querySelector('.custom-button');
goLanding.addEventListener('click', () => {
  const url = `${SERVER}/Pages/Landing`;
  window.location.href = url;
});

const volver = document.getElementById('volver');
volver.addEventListener('click', () => {
  const url = `${SERVER}/Pages/ListVariables`;
  window.location.href = url;
});
