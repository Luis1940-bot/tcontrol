// eslint-disable-next-line import/extensions
import ElementGenerator from './elementGenerator.js';
// eslint-disable-next-line import/extensions
import fechasGenerator from '../../../controllers/fechas.js';
// eslint-disable-next-line import/extensions
import arrayGlobal from './variables.js';
// eslint-disable-next-line import/extensions
import traerRegistros from './traerRegistros.js';

const widthScreen = window.innerWidth;
let arrayWidthEncabezado;
let selectDinamic;

function estilosTheadCell(element, index) {
  const cell = document.createElement('th');
  cell.textContent = element.toUpperCase();
  cell.style.background = '#000000';
  cell.style.border = '1px solid #cecece';
  cell.style.overflow = 'hidden';
  const widthCell = widthScreen * arrayWidthEncabezado[index];
  cell.style.width = `${widthCell}px`;
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

function estilosCell(
  alignCenter,
  paddingLeft,
  type,
  dato,
  colSpan,
  fontStyle,
  fontWeight,
  background,
  colorText,
  requerido,
) {
  const cell = document.createElement('td');
  if (dato !== null && type === null) {
    cell.textContent = `${dato} ${requerido}`;
  } else if ((dato === null && type !== null)) {
    cell.appendChild(type);
  }
  cell.style.borderBottom = '1px solid #cecece';
  cell.style.background = background;
  cell.style.zIndex = 2;
  cell.style.textAlign = alignCenter;
  cell.style.paddingLeft = paddingLeft;
  cell.style.fontStyle = fontStyle;
  cell.style.fontWeight = fontWeight;
  cell.style.color = colorText;
  colSpan === 1 ? cell.colSpan = 4 : null;
  colSpan === 2 ? cell.style.display = 'none' : null;
  return cell;
}

function estilosTbodyCell(element, index, cantidadDeRegistros) {
  const newRow = document.createElement('tr');
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 5; i++) {
    const orden = [0, 3, 4, 6, 7];
    let dato = element[orden[i]];
    const tipoDeDato = element[5];
    let alignCenter = 'left';
    let paddingLeft = '0px';
    let colSpan = 0;
    let fontStyle = 'normal';
    let fontWeight = 500;
    let background = '#ffffff';
    let type = null;
    let colorText = '#000000';
    let requerido = '';

    if (i === 0) {
      dato = index + 1;
      alignCenter = 'center';
    } else if (i === 1) {
      paddingLeft = '5px';
      element[21] === '1' ? (colorText = '#fe0404', requerido = '*') : null;
    } else if (i === 2) {
      alignCenter = 'center';
    } else if (i === 4) {
      dato = '';
    }
    if (i === 1 && tipoDeDato === 'l') {
      fontStyle = 'italic';
      dato = `${dato.charAt(0).toUpperCase()}${dato.slice(1)}`;
      paddingLeft = '20px';
    }
    i === 1 && (tipoDeDato === 'subt' || tipoDeDato === 'title') ? (fontWeight = 700, paddingLeft = '20px', background = '#f4f1f1') : null;

    if (i === 1 && (tipoDeDato === 'l' || tipoDeDato === 'subt' || tipoDeDato === 'title')) {
      colSpan = 1;
    }
    if (i > 1 && (tipoDeDato === 'l' || tipoDeDato === 'subt' || tipoDeDato === 'title')) {
      colSpan = 2;
    }
    i === 1 && orden[i] === 3 && (tipoDeDato !== 'l' && tipoDeDato !== 'subt' && tipoDeDato !== 'title') ? dato = dato.toUpperCase() : null;

    if (i === 2 && tipoDeDato === 'd') {
      dato = null;
      const fecha = fechasGenerator.fecha_corta_yyyymmdd(new Date());
      const width = '';
      const inputDate = ElementGenerator.generateInputDate(fecha, width);
      type = inputDate;
    } else if (i === 2 && tipoDeDato === 'h') {
      dato = null;
      const hora = fechasGenerator.hora_actual(new Date());
      const width = '';
      const inputHora = ElementGenerator.generateInputHora(hora, width);
      type = inputHora;
    } else if (i === 2 && tipoDeDato === 'x') {
      dato = '';
      type = null;
    } else if (i === 2 && tipoDeDato === 't') {
      dato = null;
      const width = '';
      const inputText = ElementGenerator.generateInputText(width);
      type = inputText;
    } else if (i === 2 && tipoDeDato === 'b') {
      dato = null;
      let checked = false;
      element[20] === '1' ? checked = true : checked = false;
      const inputCheckBox = ElementGenerator.generateInputCheckBox(checked);
      type = inputCheckBox;
    } else if (i === 2 && tipoDeDato === 'n') {
      dato = null;
      const width = '';
      const inputNumber = ElementGenerator.generateInputNumber(width);
      type = inputNumber;
    } else if (i === 2 && tipoDeDato === 'tx') {
      dato = null;
      const textArea = ElementGenerator.generateTextArea();
      type = textArea;
      const indexMas = index + 1;
      indexMas === cantidadDeRegistros ? (colSpan = 1, alignCenter = 'left', paddingLeft = '3px') : null;
    } else if (i === 2 && tipoDeDato === 'sd') {
      dato = null;
      selectDinamic = ElementGenerator.generateSelectDinamic();
      type = selectDinamic;
    } else if (i === 2 && tipoDeDato === 's') {
      dato = null;
      const arraySel = arrayGlobal.arraySelect.filter((ele) => ele[2] === element[12]);
      const select = ElementGenerator.generateSelect(arraySel);
      type = select;
    } else if (i === 2 && tipoDeDato === 'img') {
      dato = null;
      const text = 'SEL';
      const img = ElementGenerator.generateButtonQuery(text);
      type = img;
    } else if (i === 2 && tipoDeDato === 'cn') {
      dato = null;
      let text = element[orden[1]].toUpperCase();
      const anchoButton = widthScreen * arrayWidthEncabezado[2] * 0.2;
      const wordLenght = text.length * 7;
      const caracteres = Math.ceil((wordLenght - anchoButton) / 7);
      text = `${text.substring(0, caracteres)}.`;
      const inputButton = ElementGenerator.generateInputButton(text);
      type = inputButton;
    } else if (i === 2 && tipoDeDato === 'btnQwery') {
      dato = null;
      let text = element[orden[1]].toUpperCase();
      const anchoButton = widthScreen * arrayWidthEncabezado[2] * 0.9;
      const wordLenght = text.length * 7;
      const caracteres = Math.ceil((wordLenght - anchoButton) / 7);
      text = `${text.substring(0, caracteres)}...`;
      const buttonQuery = ElementGenerator.generateButtonQuery(text);
      type = buttonQuery;
    } else if (i === 2 && tipoDeDato === 'r') {
      dato = null;
      let checked = false;
      let name = '0';
      element[20] === '1' ? checked = true : checked = false;
      element[12] !== '0' ? name = `Group${element[12]}` : name = '0';
      const radioButton = ElementGenerator.generateSelectedRadioButton(checked, name);
      type = radioButton;
    }
    if (i > 2 && tipoDeDato === 'tx') {
      const indexMas = index + 1;
      indexMas === cantidadDeRegistros ? colSpan = 2 : null;
    }
    const cell = estilosCell(
      alignCenter,
      paddingLeft,
      type,
      dato,
      colSpan,
      fontStyle,
      fontWeight,
      background,
      colorText,
      requerido,
    );
    newRow.appendChild(cell);
  }
  return newRow;
}

async function traerRutina(sql, selDinamico) {
  try {
    const arraySelectDinamico = await traerRegistros(`traer_LTYsql&sql=${encodeURIComponent(sql)}`);
    ElementGenerator.generateOptions(arraySelectDinamico, selDinamico);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}

function completaTabla(arrayControl) {
  const tbody = document.querySelector('tbody');
  const cantidadDeRegistros = arrayControl.length;
  arrayControl.forEach((element, index) => {
    const newRow = estilosTbodyCell(element, index, cantidadDeRegistros);
    tbody.appendChild(newRow);
    // ! ocultamos la colomnas para la observacion
    if (element[8] === 'n') {
      const filaOculta = tbody.querySelector(`tr:nth-child(${index + 1})`);
      if (filaOculta) {
        filaOculta.style.display = 'none';
      }
    }
    // ! cargamos consultas dinamicas sd
    if (element[5] === 'sd' && element[8] === 's' && (element[19] !== '' || element[19] !== null)) {
      traerRutina(element[19], selectDinamic);
    }
  });
}

export default function tablaVacia(arrayControl, encabezados) {
  console.log(arrayControl);
  encabezado(encabezados);
  completaTabla(arrayControl, encabezados);
}
