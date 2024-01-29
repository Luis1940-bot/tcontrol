// eslint-disable-next-line import/extensions
import arrayGlobal from '../../../controllers/variables.js';
// eslint-disable-next-line import/extensions
import { Alerta } from '../../../includes/atoms/alerta.js';

let translateOperativo = [];
let espanolOperativo = [];
let translateArchivos = [];
let espanolArchivos = [];

const widthScreen = window.innerWidth;
const widthScreenAjustado = 360 / widthScreen;
let arrayWidthEncabezado;

// let array = [];

function trO(palabra) {
  const palabraNormalizada = palabra.replace(/\s/g, '').toLowerCase();
  const index = espanolOperativo.findIndex(
    (item) => item.replace(/\s/g, '').toLowerCase() === palabraNormalizada,
  );
  if (index !== -1) {
    return translateOperativo[index];
  }
  return palabra;
}

function trA(palabra) {
  const palabraNormalizada = palabra.replace(/\s/g, '').toLowerCase();
  const index = espanolArchivos.findIndex(
    (item) => item.replace(/\s/g, '').toLowerCase() === palabraNormalizada,
  );
  if (index !== -1) {
    return translateArchivos[index];
  }
  return palabra;
}

function estilosTheadCell(element, index) {
  const cell = document.createElement('th');
  if (index < 5) {
    const mensaje = trO(element) || element;
    cell.textContent = mensaje.toUpperCase();
    cell.style.background = '#000000';
    cell.style.border = '1px solid #cecece';
    cell.style.overflow = 'hidden';
    const widthCell = widthScreenAjustado * widthScreen * arrayWidthEncabezado[index];
    cell.style.width = `${widthCell}px`;
  } else {
    cell.style.display = 'none';
  }
  return cell;
}

function encabezado(encabezados) {
  const thead = document.querySelector('thead');
  const newRow = document.createElement('tr');
  arrayWidthEncabezado = [...encabezados.width];
  encabezados.title.forEach((element, index) => {
    const cell = estilosTheadCell(element, index);
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
  fontSize,
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
  cell.style.fontSize = fontSize;
  cell.style.color = colorText;

  const ultima = trO('Última') || 'Última';
  const primera = trO('Primera') || 'Primera';
  const fechas = `${ultima} ${ultimo} - ${primera} ${primero}`;
  const span = document.createElement('span');
  span.style.color = 'red';
  span.style.fontSize = '8px';
  span.style.fontStyle = 'Italic';
  span.style.marginLeft = '10px';
  span.textContent = fechas;
  span.style.fontWeight = 500;
  cell.appendChild(span);

  const imagen = document.createElement('img');
  imagen.setAttribute('class', 'img-view');
  imagen.setAttribute('name', 'viewer');
  imagen.style.float = 'right';
  imagen.src = '../../../assets/img/icons8-view-30.png';
  imagen.style.height = '12px';
  imagen.style.width = '12px';
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
    const ultimo = element[3];
    const primero = element[16];
    const alignCenter = 'left';
    const paddingLeft = '10px';
    const fontStyle = 'normal';
    const fontWeight = 700;
    const background = '#ffffff';
    const colorText = '#000000';
    const fontSize = '8px';
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
      fontSize,
      indice,
      objTranslate,
      arrayControl,
    );
    newRow.appendChild(cell);
  }
  return newRow;
}

function completaTabla(arrayControl, objTranslate) {
  const tbody = document.querySelector('tbody');
  // const cantidadDeRegistros = arrayControl.length;
  const arrayMapeado = arrayControl.map((fila) => [trA(fila[0]), ...fila.slice(1)]);
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
    encabezado(encabezados);
    completaTabla(arrayControl, objTranslate, arrayControl);
    // array = [...arrayControl];
    const cantidadDeFilas = document.querySelector('table tbody');
    let mensaje = arrayGlobal.mensajesVarios.cargarControl.fallaCarga;
    if (cantidadDeFilas.childElementCount !== arrayControl.length) {
      mensaje = trO(mensaje) || mensaje;
      miAlerta.createVerde(arrayGlobal.avisoRojo, mensaje, null);
      const modal = document.getElementById('modalAlert');
      modal.style.display = 'block';
    }
    setTimeout(() => {
    }, 1000);
  } else {
    miAlerta.createVerde(arrayGlobal.avisoRojo, null, objTranslate);
    const modal = document.getElementById('modalAlert');
    modal.style.display = 'block';
  }
}

export default function tablaVacia(arrayControl, encabezados, objTranslate) {
  // arraysLoadTranslate();
  translateOperativo = objTranslate.operativoTR;
  espanolOperativo = objTranslate.operativoES;
  translateArchivos = objTranslate.archivosTR;
  espanolArchivos = objTranslate.archivosES;
  setTimeout(() => {
    loadTabla(arrayControl, encabezados, objTranslate);
  }, 200);
}
