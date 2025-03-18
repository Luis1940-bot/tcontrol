// eslint-disable-next-line import/extensions
import arrayGlobal from '../../../controllers/variables.js';
// eslint-disable-next-line import/extensions
// import { Alerta } from '../../../includes/atoms/alerta.js';
import Alerta from '../../../includes/atoms/alerta.js';

import baseUrl from '../../../config.js';
import { trO, trA } from '../../../controllers/trOA.js';

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

function viewer(array, objTranslate) {
  const miAlerta = new Alerta();
  miAlerta.createViewer(arrayGlobal.objAlertaViewer, array, objTranslate);
  const modal = document.getElementById('modalAlertView');
  modal.style.display = 'block';
}

function estilosCell(
  alignCenter,
  paddingLeft,
  datos,
  fontStyle,
  fontWeight,
  background,
  colorText,
  ultimo,
  primero,
  // fontSize,
  indice,
  objTranslate,
  arrayControl,
  id,
) {
  const cell = document.createElement('td');
  cell.textContent = `#${id} - ${datos}`;
  cell.style.borderBottom = '1px solid #cecece';
  cell.style.zIndex = 2;
  cell.style.textAlign = alignCenter;
  cell.style.paddingLeft = paddingLeft;
  cell.style.fontStyle = fontStyle;
  cell.style.fontWeight = fontWeight;
  // cell.style.fontSize = fontSize
  cell.style.color = colorText;

  const ultima = trO('Última', objTranslate) || 'Última';
  const primera = trO('Primera', objTranslate) || 'Primera';
  const fechas = `${ultima} ${ultimo} - ${primera} ${primero}`;
  const span = document.createElement('span');
  span.style.color = 'red';
  // let size = '8px'
  // if (widthScreen > 1000) {
  //   size = '10px'
  // }
  // span.style.fontSize = size
  span.style.fontStyle = 'Italic';
  span.style.marginLeft = '10px';
  span.textContent = fechas;
  span.style.fontWeight = 500;
  cell.appendChild(span);

  const imagen = document.createElement('img');
  imagen.setAttribute('class', 'img-view');
  imagen.setAttribute('name', 'viewer');
  imagen.style.float = 'right';
  imagen.src = `${SERVER}/assets/img/icons8-view-30.png`;
  // imagen.style.height = '12px'
  // imagen.style.width = '12px'
  imagen.style.margin = 'auto 5px auto auto';
  imagen.style.cursor = 'pointer';
  imagen.setAttribute('data-index', indice);
  imagen.addEventListener('click', (e) => {
    const i = e.target.getAttribute('data-index');
    viewer(arrayControl[i], objTranslate);
  });
  cell.appendChild(imagen);
  return cell;
}

function estilosTbodyCell(element, index, objTranslate, arrayControl) {
  const newRow = document.createElement('tr');
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 1; i++) {
    const dato = element[0];
    const id = element[1];
    const ultimo = element[3];
    const primero = element[16];
    const alignCenter = 'left';
    const paddingLeft = '10px';
    const fontStyle = 'normal';
    const fontWeight = 700;
    const background = '#ffffff';
    const colorText = '#000000';
    // let size = '10px'
    // if (widthScreen > 1000) {
    //   size = '10px'
    // }
    // const fontSize = size
    const indice = index;

    const cell = estilosCell(
      alignCenter,
      paddingLeft,
      dato,
      fontStyle,
      fontWeight,
      background,
      colorText,
      ultimo,
      primero,
      // fontSize,
      indice,
      objTranslate,
      arrayControl,
      id,
    );
    newRow.appendChild(cell);
  }
  return newRow;
}

function completaTabla(arrayControl, objTranslate) {
  const tbody = document.querySelector('tbody');
  // const cantidadDeRegistros = arrayControl.length;
  const arrayMapeado = arrayControl.map((fila) => [
    trA(fila[0], objTranslate),
    ...fila.slice(1),
  ]);
  arrayMapeado.sort((a, b) => a[0].localeCompare(b[0]));

  arrayMapeado.forEach((element, index) => {
    const newRow = estilosTbodyCell(element, index, objTranslate, arrayMapeado);
    tbody.appendChild(newRow);
  });
  const tableControlViews = document.getElementById('tableControlViews');
  tableControlViews.style.display = 'block';
}

function loadTabla(arrayControl, encabezados, objTranslate) {
  const miAlerta = new Alerta();

  if (arrayControl.length > 0) {
    // Utilizar requestAnimationFrame para asegurar que el DOM está listo
    requestAnimationFrame(() => {
      encabezado(encabezados, objTranslate);
      completaTabla(arrayControl, objTranslate, arrayControl);

      const cantidadDeFilas = document.querySelector('table tbody');
      let mensaje = arrayGlobal.mensajesVarios.cargarControl.fallaCarga;
      if (cantidadDeFilas.childElementCount !== arrayControl.length) {
        mensaje = trO(mensaje, objTranslate) || mensaje;
        miAlerta.createVerde(arrayGlobal.avisoRojo, mensaje, null);
        const modal = document.getElementById('modalAlert');
        modal.style.display = 'block';
      }
    });
  } else {
    const mensaje =
      trO(
        'No existen controles cargados. Comuníquese con el administrador.',
        objTranslate,
      ) || 'No existen controles cargados. Comuníquese con el administrador.';
    miAlerta.createVerde(arrayGlobal.avisoRojo, mensaje, objTranslate);
    const modal = document.getElementById('modalAlertVerde');
    modal.style.display = 'block';
  }
}

export default async function tablaVacia(
  arrayControl,
  encabezados,
  objTranslate,
) {
  // Asegúrate de que arrayControl y objTranslate están completamente cargados
  if (arrayControl && arrayControl.length > 0) {
    await loadTabla(arrayControl, encabezados, objTranslate);
  } else {
    const miAlerta = new Alerta();
    const mensaje =
      trO(
        'No existen controles cargados. Comuníquese con el administrador.',
        objTranslate,
      ) || 'No existen controles cargados. Comuníquese con el administrador.';
    miAlerta.createVerde(arrayGlobal.avisoRojo, mensaje, objTranslate);
    const modal = document.getElementById('modalAlertVerde');
    modal.style.display = 'block';
  }
}
