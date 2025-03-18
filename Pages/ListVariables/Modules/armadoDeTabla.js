// eslint-disable-next-line import/extensions
import arrayGlobal from '../../../controllers/variables.js';
// eslint-disable-next-line import/extensions
// import { Alerta } from '../../../includes/atoms/alerta.js';
import Alerta from '../../../includes/atoms/alerta.js';
import variableOnOff from './Controladores/variableOnOff.js';
import { encriptar, desencriptar } from '../../../controllers/cript.js';

import baseUrl from '../../../config.js';
import { trA, trO } from '../../../controllers/trOA.js';

const widthScreen = window.innerWidth;
const widthScreenAjustado = 1; // 360 / widthScreen;
let arrayWidthEncabezado;
const SERVER = baseUrl;

function estilosTheadCell(element, index, objTranslate) {
  const cell = document.createElement('th');
  if (index < 5) {
    const mensaje = trO(element, objTranslate) || element;
    cell.textContent = mensaje.toUpperCase();
    cell.style.background = '#000000';
    cell.style.border = '1px solid #cecece';
    cell.style.overflow = 'hidden';
    const widthCell =
      widthScreenAjustado * widthScreen * arrayWidthEncabezado[index];
    cell.style.width = `${widthCell}px`;
  } else {
    cell.style.display = 'none';
  }
  return cell;
}

function encabezado(encabezados, objTranslate) {
  const thead = document.querySelector('thead');
  const newRow = document.createElement('tr');
  arrayWidthEncabezado = [...encabezados.width];
  encabezados.title.forEach((element, index) => {
    const cell = estilosTheadCell(element, index, objTranslate);
    newRow.appendChild(cell);
  });
  thead.appendChild(newRow);
}

function viewer(selector, array, objTranslate) {
  //! editar
  const filtrado = array.filter((subArray) => subArray[4] === selector);
  const objetoRuta = {
    control_N: selector,
    control_T: decodeURIComponent(filtrado[0][1]),
    nr: '0',
    filtrado,
  };

  sessionStorage.setItem('variable', encriptar(objetoRuta));

  const timestamp = new Date().getTime();
  const ruta = `${SERVER}/Pages/Router/rutas.php?ruta=variables&v=${timestamp}`;
  window.location.href = ruta;
}

async function cargaDeRegistros(objTranslate) {
  try {
    const reportes = await traerRegistros(
      'traerVariables',
      '/traerVariables',
      null,
    );
    arrayGlobal.arrayReportes = [...reportes];
    // Finaliza la carga y realiza cualquier otra acción necesaria
    tablaVacia(reportes, null, objTranslate);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);
    // eslint-disable-next-line no-console
    console.log('error por espera de la carga de un modal');
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }
}

async function conceptoOnOff(id, status, objTranslate) {
  const actualizado = await variableOnOff(id, status, '/variableOnOff');
  if (actualizado.success) {
    await cargaDeRegistros(objTranslate);
  }
}

function estilosCell(
  alignCenter,
  paddingLeft,
  datos,
  fontStyle,
  fontWeight,
  background,
  colorText,
  selector,
  Sel,
  img,
  indice,
  objTranslate,
  arrayControl,
) {
  const cell = document.createElement('td');
  cell.textContent = datos;
  cell.style.borderBottom = '1px solid #cecece';
  cell.style.zIndex = 2;
  cell.style.textAlign = alignCenter;
  cell.style.paddingLeft = paddingLeft;
  cell.style.fontStyle = fontStyle;
  cell.style.fontWeight = fontWeight;
  // cell.style.fontSize = fontSize
  let colorDelTexto = colorText;
  let onOff = '';
  let colorOnOff = 'green';
  let textoSelector = selector;
  let dirImg = '';

  if (selector === 'n') {
    colorDelTexto = '#818181';
    onOff = 'OFF';
    colorOnOff = 'red';
    textoSelector = 'OFF';
    dirImg = 'icons8-inactive-24';
  }
  if (selector === 's') {
    textoSelector = 'ON';
    dirImg = 'icons8-active-48';
    onOff = 'ON';
  }

  const spanOnOff = document.createElement('span');
  spanOnOff.style.color = colorOnOff;
  spanOnOff.style.fontStyle = 'normal';
  spanOnOff.style.marginLeft = '14px';
  Sel !== '' ? (spanOnOff.textContent = `${Sel}: ${textoSelector}`) : null;
  spanOnOff.style.fontWeight = 700;
  spanOnOff.style.border = `1px solid ${colorOnOff}`;
  spanOnOff.style.borderRadius = '5px';
  spanOnOff.style.padding = '3px';
  spanOnOff.style.display = 'inline-block';

  cell.appendChild(spanOnOff);

  if (img && onOff === '') {
    const imagen = document.createElement('img');
    imagen.setAttribute('class', 'img-view');
    imagen.setAttribute('name', 'viewer');
    imagen.style.float = 'right';
    imagen.src = `${SERVER}/assets/img/icons8-edit-30.png`;
    imagen.style.cursor = 'pointer';
    imagen.setAttribute('data-index', selector);
    imagen.addEventListener('click', (e) => {
      const sel = e.target.getAttribute('data-index');
      viewer(sel, arrayControl, objTranslate);
    });
    cell.appendChild(imagen);

    const imgEye = document.createElement('img');
    imgEye.setAttribute('class', 'img-view');
    imgEye.setAttribute('name', 'viewer');
    imgEye.style.float = 'right';
    imgEye.src = `${SERVER}/assets/img/icons8-view-30.png`;
    imgEye.style.cursor = 'pointer';
    imgEye.setAttribute('data-index', indice);
    imgEye.addEventListener('click', (e) => {
      const i = e.target.getAttribute('data-index');
      const arrayFiltrado = arrayControl.filter((e) => e[4] === selector);
      viewerConceptos(arrayFiltrado, objTranslate);
    });
    cell.appendChild(imgEye);
  }

  if (onOff !== '') {
    const imgStatus = document.createElement('img');
    imgStatus.setAttribute('class', `img-view-${onOff}`);
    imgStatus.setAttribute('name', 'viewer');
    imgStatus.style.float = 'right';
    imgStatus.src = `${SERVER}/assets/img/${dirImg}.png`;
    imgStatus.style.cursor = 'pointer';
    imgStatus.setAttribute('data-index', indice);
    imgStatus.setAttribute('data-status', selector);
    imgStatus.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-index');
      const status = e.target.getAttribute('data-status');
      conceptoOnOff(id, status, objTranslate);
    });
    cell.appendChild(imgStatus);
  }
  return cell;
}

function estilosTbodyCellConcepto(element, index, objTranslate, arrayControl) {
  const newRow = document.createElement('tr');
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 1; i++) {
    const dato = element[2];
    const status = element[3];

    const alignCenter = 'left';
    const paddingLeft = '10px';
    const fontStyle = 'normal';
    const fontWeight = 700;
    const background = '#ffffff';
    const colorText = '#000000';
    const indice = element[0];
    const Ord = trO('Status', objTranslate) || 'Status';

    const cell = estilosCell(
      alignCenter,
      paddingLeft,
      dato,
      fontStyle,
      fontWeight,
      background,
      colorText,
      status,
      Ord,
      false,
      indice,
      objTranslate,
      arrayControl,
    );
    newRow.appendChild(cell);
  }
  return newRow;
}

function viewerConceptos(array, objTrad) {
  const encabezados = {
    title: ['concepto'],
    width: ['1'],
  };
  const table = document.getElementById('tableConceptosViews');
  if (!table.tHead) {
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    arrayWidthEncabezado = [...encabezados.width];
    const cell = estilosTheadCell('Concepto', 0, objTrad);
    tr.appendChild(cell);
    thead.appendChild(tr);
    table.appendChild(thead);
  }
  if (table.tBodies.length > 0) {
    table.removeChild(table.tBodies[0]);
  }
  const tbody = document.createElement('tbody');
  const arrayMapeado = array.sort((a, b) => a[5].localeCompare(b[5]));
  arrayMapeado.forEach((element, index) => {
    const newRow = estilosTbodyCellConcepto(element, index, objTrad, array);
    tbody.appendChild(newRow);
  });
  table.appendChild(tbody);
  table.style.display = 'block';
  table.style.marginTop = '20px';
  table.style.marginBottom = '20px';
  table.focus();
}

function estilosTbodyCell(element, index, objTranslate, arrayControl) {
  const newRow = document.createElement('tr');
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 1; i++) {
    const dato = element[1];
    const status = element[4];
    const alignCenter = 'left';
    const paddingLeft = '10px';
    const fontStyle = 'normal';
    const fontWeight = 700;
    const background = '#ffffff';
    const colorText = '#000000';
    const indice = index;

    const cell = estilosCell(
      alignCenter,
      paddingLeft,
      dato,
      fontStyle,
      fontWeight,
      background,
      colorText,
      status,
      'Sel',
      true,
      indice,
      objTranslate,
      arrayControl,
    );
    newRow.appendChild(cell);
  }
  return newRow;
}

function eliminarDuplicadosPorSegundoElemento(arr) {
  const visto = new Set();
  const resultado = arr.filter((subarray) => {
    const segundoElemento = subarray[1];
    if (!visto.has(segundoElemento)) {
      visto.add(segundoElemento);
      return true;
    }
    return false;
  });
  return resultado;
}

function completaTabla(arrayControl, objTranslate) {
  const tbody = document.querySelector('tbody');
  // const cantidadDeRegistros = arrayControl.length;
  const arrayMapeado = arrayControl.map((fila) => [
    trA(fila[1], objTranslate),
    ...fila.slice(1),
  ]);
  arrayMapeado.sort((a, b) => a[1].localeCompare(b[1]));
  const arraySinDuplicados = eliminarDuplicadosPorSegundoElemento(arrayMapeado);
  arraySinDuplicados.forEach((element, index) => {
    const newRow = estilosTbodyCell(element, index, objTranslate, arrayControl);
    tbody.appendChild(newRow);
  });
  const tableControlViews = document.getElementById('tableVariablesViews');
  tableControlViews.style.display = 'block';
}

function loadTabla(arrayControl, encabezados, objTranslate) {
  const miAlerta = new Alerta();
  const arraySinDuplicados = eliminarDuplicadosPorSegundoElemento(arrayControl);

  if (arraySinDuplicados.length > 0) {
    encabezado(encabezados, objTranslate);
    completaTabla(arrayControl, objTranslate);

    const cantidadDeFilas = document.querySelector('table tbody');
    let mensaje = arrayGlobal.mensajesVarios.cargarControl.fallaCarga;

    if (cantidadDeFilas.childElementCount !== arraySinDuplicados.length) {
      mensaje = trO(mensaje, objTranslate) || mensaje;
      miAlerta.createVerde(arrayGlobal.avisoRojo, mensaje, null);
      const modal = document.getElementById('modalAlert');
      modal.style.display = 'block';
      const divUbicacionSearch = document.querySelector('.div-ubicacionSearch');
      divUbicacionSearch.style.display = 'none';
    }
  } else {
    const mensaje =
      trO(
        'No existen variables cargadas. Comuníquese con el administrador.',
        objTranslate,
      ) || 'No existen variables cargadas. Comuníquese con el administrador.';
    miAlerta.createVerde(arrayGlobal.avisoRojo, mensaje, objTranslate);
    const modal = document.getElementById('modalAlertVerde');
    modal.style.display = 'block';
  }
}

export default function tablaVacia(arrayControl, encabezados, objTranslate) {
  function requestAnimationFrameCallback() {
    loadTabla(arrayControl, encabezados, objTranslate);
  }

  // Use requestAnimationFrame to ensure the function runs at the next repaint.
  requestAnimationFrame(requestAnimationFrameCallback);
}
