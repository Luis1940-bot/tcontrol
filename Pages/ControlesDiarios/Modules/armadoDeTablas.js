import { encriptar } from '../../../controllers/cript.js';
// eslint-disable-next-line import/extensions
import traerRegistros from './Controladores/traerRegistros.js';

import baseUrl from '../../../config.js';

const SERVER = baseUrl;

let translateOperativo = [];
let espanolOperativo = [];

const widthScreen = window.innerWidth;
const widthScreenAjustado = 1; // 360 / widthScreen
let arrayWidthEncabezado;

function trO(palabra) {
  const palabraNormalizada = palabra.replace(/\s/g, '').toLowerCase();
  const index = espanolOperativo.findIndex(
    (item) =>
      item.replace(/\s/g, '').toLowerCase().trim() ===
      palabraNormalizada.trim(),
  );
  if (index !== -1) {
    return translateOperativo[index];
  }
  return palabra;
}

function estilosTheadCell(element, index) {
  const cell = document.createElement('th');

  const mensaje = trO(element) || element;
  cell.textContent = mensaje.toUpperCase();
  cell.style.background = '#000000';
  cell.style.border = '1px solid #cecece';
  cell.style.overflow = 'hidden';
  const widthCell =
    widthScreenAjustado * widthScreen * arrayWidthEncabezado[index];
  cell.style.width = `${widthCell}px`;
  return cell;
}

function encabezado(encabezados, anchos) {
  const tabla = document.getElementById('tableControlesDiarios');
  const thead = tabla.querySelector('thead');
  const newRow = document.createElement('tr');
  arrayWidthEncabezado = [...anchos.width];
  encabezados.forEach((element, index) => {
    const cell = estilosTheadCell(element, index);
    newRow.appendChild(cell);
  });
  thead.appendChild(newRow);
}

function abrirControl(control) {
  try {
    const { controlN, controlT, nr } = control;
    let contenido = {
      control_N: controlN,
      control_T: controlT,
      nr,
    };
    contenido = encriptar(contenido);
    sessionStorage.setItem('contenido', contenido);
    // const url = '../../../Pages/Control/index.php'
    const timestamp = new Date().getTime();
    const url = `${SERVER}/Pages/Router/rutas.php?ruta=control&v=${timestamp}`;

    // window.location.href = url;
    window.open(url, '_blank');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warm(error);
  }
}

function estilosCell(
  alignCenter,
  paddingLeft,
  fontStyle,
  // fontWeight,
  colorText,
  // fontSize,
  element,
  index,
) {
  const cell = document.createElement('td');
  cell.style.borderBottom = '1px solid #cecece';
  cell.style.zIndex = 2;
  cell.style.textAlign = alignCenter;
  cell.style.paddingLeft = paddingLeft;
  cell.style.fontStyle = fontStyle;
  // cell.style.fontWeight = fontWeight
  // cell.style.fontSize = fontSize
  cell.style.color = colorText;

  // Crear el contenido de texto
  const content = document.createElement('span');
  content.textContent = `${element}`;

  // Agregar estilos para el efecto de hover
  if (index === 4) {
    content.addEventListener('mouseenter', () => {
      content.style.textDecoration = 'underline';
      content.style.color = 'blue';
    });
    // Agregar el evento de clic al contenido de la celda
    content.addEventListener('click', (e) => {
      const clickedElement = e.target;
      const row = clickedElement.closest('tr');
      if (row) {
        // Obtenemos el índice de la fila dentro del tbody (sin contar thead)
        const nr = e.target.innerText.trim();
        const cells = row.querySelectorAll('td');
        const controlN = cells[2]?.innerText.trim();
        const controlT = cells[3]?.innerText.trim();
        const control = {
          controlN,
          controlT,
          nr,
        };
        content.style.color = 'blue';
        abrirControl(control);
      } else {
        // eslint-disable-next-line no-console
        console.warn('No se encontró fila. ¿Clickeaste en una nube de ideas?');
      }
    });
    content.style.cursor = 'pointer';
  } else {
    content.style.cursor = 'default';
  }

  // Restablecer estilos cuando se quita el mouse
  content.addEventListener('mouseleave', () => {
    content.style.textDecoration = 'none';
    content.style.color = ''; // Restablecer a color original
  });

  // Agregar el contenido de texto a la celda
  cell.appendChild(content);

  // Retornar la celda
  return cell;
}

function estilosTbodyCell(element) {
  const newRow = document.createElement('tr');
  // eslint-disable-next-line no-plusplus
  const alignCenter = 'left';
  const paddingLeft = '10px';
  const fontStyle = 'normal';
  const colorText = '#000000';
  element.forEach((ele, index) => {
    const cell = estilosCell(
      alignCenter,
      paddingLeft,
      fontStyle,
      // fontWeight,
      colorText,
      // fontSize,
      ele,
      index,
    );
    newRow.appendChild(cell);
  });

  return newRow;
}

function completaTabla(arrayControl) {
  const tabla = document.getElementById('tableControlesDiarios');
  const tbody = tabla.querySelector('tbody');

  arrayControl.forEach((element) => {
    const newRow = estilosTbodyCell(element);
    tbody.appendChild(newRow);
  });

  tabla.style.display = 'block';
}

function loadTabla(arrayControl, objTranslate, encabezados) {
  encabezado(arrayControl.columns, encabezados);
  completaTabla(arrayControl.data, objTranslate);
}

async function traerControles(objTranslate, planta, encabezados) {
  try {
    const controlesDiarios = await traerRegistros(planta);
    if (controlesDiarios.columns.length > 0) {
      loadTabla(controlesDiarios, objTranslate, encabezados);
    }
  } catch (error) {
    console.log(error);
  }
}

export default function tablaVacia(objTranslate, plant, encabezados) {
  // Configurar las traducciones
  translateOperativo = objTranslate.operativoTR;
  espanolOperativo = objTranslate.operativoES;
  // translateArchivos = objTranslate.archivosTR;
  // espanolArchivos = objTranslate.archivosES;

  // Usar requestAnimationFrame para asegurarse de que el DOM esté listo antes de cargar la tabla
  requestAnimationFrame(() => {
    traerControles(objTranslate, plant, encabezados);
  });
}
