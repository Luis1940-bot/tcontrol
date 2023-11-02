// eslint-disable-next-line import/extensions
import ElementGenerator from './elementGenerator.js';
// eslint-disable-next-line import/extensions
import fechasGenerator from '../../../controllers/fechas.js';
// eslint-disable-next-line import/extensions
import arrayGlobal from './variables.js';
// eslint-disable-next-line import/extensions
import traerRegistros from './traerRegistros.js';
// eslint-disable-next-line import/extensions
import Alerta from '../../../includes/atoms/alerta.js';
// eslint-disable-next-line import/extensions
import translate, {
  // eslint-disable-next-line no-unused-vars
  arrayTranslateOperativo,
  // eslint-disable-next-line no-unused-vars
  arrayEspanolOperativo,
  // eslint-disable-next-line no-unused-vars
  arrayTranslateArchivo,
  // eslint-disable-next-line no-unused-vars
  arrayEspanolArchivo,
// eslint-disable-next-line import/extensions
} from '../../../controllers/translate.js';

let data = {};
let translateOperativo = [];
let espanolOperativo = [];
let translateArchivo = [];
let espanolArchivo = [];

const widthScreen = window.innerWidth;
let arrayWidthEncabezado;
let selectDinamic;
let elementHTML;
let ID = 0;
let fila = 0;

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
  const index = espanolArchivo.findIndex(
    (item) => item.replace(/\s/g, '').toLowerCase() === palabraNormalizada,
  );
  if (index !== -1) {
    return translateArchivo[index];
  }
  return palabra;
}

function estilosTheadCell(element, index) {
  const cell = document.createElement('th');
  cell.textContent = trO(element.toUpperCase()) || element.toUpperCase();
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
  datos,
  colSpan,
  fontStyle,
  fontWeight,
  background,
  colorText,
  requerido,
) {
  const cell = document.createElement('td');
  let dato = '';
  typeof datos === 'string' && datos !== null ? dato = trA(datos) : dato = datos;
  if (dato !== null && type === null) {
    cell.textContent = `${dato} ${requerido}` || `${dato} ${requerido}`;
  } else if ((dato === null && type !== null)) {
    cell.appendChild(type);
  }
  cell.style.borderBottom = '1px solid #cecece';
  // cell.style.background = background;
  cell.style.zIndex = 2;
  cell.style.textAlign = alignCenter;
  cell.style.paddingLeft = paddingLeft;
  cell.style.fontStyle = fontStyle;
  cell.style.fontWeight = fontWeight;
  cell.style.color = colorText;
  colSpan === 1 ? cell.colSpan = 4 : null;
  colSpan === 2 ? cell.style.display = 'none' : null;
  colSpan === 3 ? cell.colSpan = 3 : null;
  colSpan === 4 ? cell.style.display = 'none' : null;
  return cell;
}

function estilosTbodyCell(element, index, cantidadDeRegistros) {
  const newRow = document.createElement('tr');
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 5; i++) {
    const orden = [0, 3, 4, 6, 7];
    let dato = element[orden[i]];
    const tipoDeDato = element[5];
    const tipoDeObservacion = element[9];
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
      ID += 1;
      dato = ID;
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

    if (i === 3 && tipoDeDato === 'img') {
      colSpan = 3;
      dato = null;
      const ul = ElementGenerator.generateUl();
      type = ul;
    }
    if (i > 3 && tipoDeDato === 'img') {
      colSpan = 4;
    }

    if (i === 2 && tipoDeDato === 'd') {
      dato = null;
      const [valorXDefecto] = element[20] !== '' ? [element[20]] : [];
      const fecha = fechasGenerator.fecha_corta_yyyymmdd(new Date());
      const width = '';
      const inputDate = ElementGenerator.generateInputDate(fecha, width, valorXDefecto);
      type = inputDate;
    } else if (i === 2 && tipoDeDato === 'h') {
      dato = null;
      const [valorXDefecto] = element[20] !== '' ? [element[20]] : [];
      const hora = fechasGenerator.hora_actual(new Date());
      const width = '';
      const inputHora = ElementGenerator.generateInputHora(hora, width, valorXDefecto);
      type = inputHora;
    } else if (i === 2 && tipoDeDato === 'x') {
      dato = '';
      type = null;
    } else if (i === 2 && tipoDeDato === 't') {
      dato = null;
      const [valorXDefecto] = element[20] !== '' ? [element[20]] : [];
      const width = '';
      const inputText = ElementGenerator.generateInputText(width, valorXDefecto);
      elementHTML = inputText;
      type = inputText;
    } else if (i === 2 && tipoDeDato === 'b') {
      dato = null;
      let checked = false;
      element[20] === '1' ? checked = true : checked = false;
      const inputCheckBox = ElementGenerator.generateInputCheckBox(checked);
      type = inputCheckBox;
    } else if (i === 2 && tipoDeDato === 'n') {
      dato = null;
      const [valorXDefecto] = element[20] !== '' ? [element[20]] : [];
      const width = '';
      const inputNumber = ElementGenerator.generateInputNumber(width, valorXDefecto);
      elementHTML = inputNumber;
      type = inputNumber;
    } else if (i === 2 && tipoDeDato === 'tx') {
      dato = null;
      const [valorXDefecto] = element[20] !== '' ? [element[20]] : [];
      const textArea = ElementGenerator.generateTextArea(valorXDefecto);
      elementHTML = textArea;
      type = textArea;
      const indexMas = index + 1;
      indexMas === cantidadDeRegistros ? (colSpan = 1, alignCenter = 'left', paddingLeft = '3px') : null;
    } else if (i === 2 && tipoDeDato === 'sd') {
      dato = null;
      const hijo = element[24];
      const sqlHijo = element[25];
      selectDinamic = ElementGenerator.generateSelectDinamic(hijo, sqlHijo);
      type = selectDinamic;
    } else if (i === 2 && tipoDeDato === 's') {
      dato = null;
      const arraySel = arrayGlobal.arraySelect.filter((ele) => ele[2] === element[12]);
      const select = ElementGenerator.generateSelect(arraySel);
      type = select;
    } else if (i === 2 && tipoDeDato === 'img') {
      dato = null;
      const text = '📸';
      const img = ElementGenerator.generateButtonImage(text, fila + 1);
      type = img;
      background = 'transparent';
    } else if (i === 2 && tipoDeDato === 'cn') {
      dato = null;
      let text = element[orden[1]].toUpperCase();
      const consulta = element[23] || '';
      const anchoButton = widthScreen * arrayWidthEncabezado[2] * 0.2;
      const wordLenght = text.length * 7;
      const caracteres = Math.ceil((wordLenght - anchoButton) / 7);
      text = `${text.substring(0, caracteres)}.`;
      const inputButton = ElementGenerator.generateInputButton(
        text,
        element[orden[1]].toUpperCase(),
        consulta,
        'InputButton-transparent',
      );
      type = inputButton;
    } else if (i === 2 && tipoDeDato === 'btnQwery') {
      dato = null;
      let text = element[orden[1]].toUpperCase();
      const consulta = element[23] || '';
      const anchoButton = widthScreen * arrayWidthEncabezado[2] * 0.9;
      const wordLenght = text.length * 7;
      const caracteres = Math.ceil((wordLenght - anchoButton) / 7);
      text = `${text.substring(0, caracteres)}...`;
      const buttonQuery = ElementGenerator.generateButtonQuery(
        text,
        element[orden[1]].toUpperCase(),
        consulta,
        'InputButton-transparent',
      );
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
    if (i === 4 && tipoDeObservacion === 'd') {
      const [valorXDefecto] = element[26] !== '' ? [element[26]] : [];
      const fecha = fechasGenerator.fecha_corta_yyyymmdd(new Date());
      const width = '';
      const inputDate = ElementGenerator.generateInputDate(fecha, width, valorXDefecto);
      type = inputDate;
    } else if (i === 4 && tipoDeObservacion === 'h') {
      dato = null;
      const [valorXDefecto] = element[26] !== '' ? [element[26]] : [];
      const hora = fechasGenerator.hora_actual(new Date());
      const width = '';
      const inputHora = ElementGenerator.generateInputHora(hora, width, valorXDefecto);
      type = inputHora;
    } else if (i === 4 && tipoDeObservacion === 'x') {
      dato = '';
      type = null;
    } else if (i === 4 && tipoDeObservacion === 't') {
      dato = null;
      const [valorXDefecto] = element[26] !== '' ? [element[26]] : [];
      const width = '';
      const inputText = ElementGenerator.generateInputText(width, valorXDefecto);
      elementHTML = inputText;
      type = inputText;
    } else if (i === 4 && tipoDeObservacion === 'b') {
      dato = null;
      let checked = false;
      element[26] === '1' ? checked = true : checked = false;
      const inputCheckBox = ElementGenerator.generateInputCheckBox(checked);
      type = inputCheckBox;
    } else if (i === 4 && tipoDeObservacion === 'n') {
      dato = null;
      const [valorXDefecto] = element[26] !== '' ? [element[26]] : [];
      const width = '';
      const inputNumber = ElementGenerator.generateInputNumber(width, valorXDefecto);
      elementHTML = inputNumber;
      type = inputNumber;
    } else if (i === 4 && tipoDeObservacion === 'tx') {
      dato = null;
      const [valorXDefecto] = element[26] !== '' ? [element[26]] : [];
      const textArea = ElementGenerator.generateTextArea(valorXDefecto);
      elementHTML = textArea;
      type = textArea;
      const indexMas = index + 1;
      indexMas === cantidadDeRegistros ? (colSpan = 1, alignCenter = 'left', paddingLeft = '3px') : null;
    } else if (i === 4 && tipoDeObservacion === 'sd') {
      dato = null;
      selectDinamic = ElementGenerator.generateSelectDinamic();
      type = selectDinamic;
    } else if (i === 4 && tipoDeObservacion === 's') {
      dato = null;
      const arraySel = arrayGlobal.arraySelect.filter((ele) => ele[2] === element[15]);
      const select = ElementGenerator.generateSelect(arraySel);
      type = select;
    } else if (i === 4 && tipoDeObservacion === 'cn') {
      dato = null;
      let text = element[orden[1]].toUpperCase();
      const consulta = element[23] || '';
      const anchoButton = widthScreen * arrayWidthEncabezado[2] * 0.2;
      const wordLenght = text.length * 7;
      const caracteres = Math.ceil((wordLenght - anchoButton) / 7);
      text = `${text.substring(0, caracteres)}.`;
      const inputButton = ElementGenerator.generateInputButton(
        text,
        element[orden[1]].toUpperCase(),
        consulta,
        'InputButton-transparent',
      );
      type = inputButton;
    } else if (i === 4 && tipoDeObservacion === 'btnQwery') {
      dato = null;
      let text = element[orden[1]].toUpperCase();
      const consulta = element[23] || '';
      const anchoButton = widthScreen * arrayWidthEncabezado[2] * 0.9;
      const wordLenght = text.length * 7;
      const caracteres = Math.ceil((wordLenght - anchoButton) / 7);
      text = `${text.substring(0, caracteres)}...`;
      const buttonQuery = ElementGenerator.generateButtonQuery(
        text,
        element[orden[1]].toUpperCase(),
        consulta,
        'InputButton-transparent',
      );
      type = buttonQuery;
    } else if (i === 4 && tipoDeObservacion === 'r') {
      dato = null;
      let checked = false;
      let name = '0';
      element[26] === '1' ? checked = true : checked = false;
      element[15] !== '0' ? name = `Group2${element[15]}` : name = '0';
      const radioButton = ElementGenerator.generateSelectedRadioButton(checked, name);
      type = radioButton;
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
async function traerValorPorDefecto(sql, tipo, html) {
  try {
    if (tipo === 'n') {
      const arrayValor = await traerRegistros(`traer_LTYsql&sql=${encodeURIComponent(sql)}`);
      ElementGenerator.generateInputNumberQuery(arrayValor, html);
    } else if (tipo === 't' || tipo === 'tx') {
      const arrayValor = await traerRegistros(`traer_LTYsql&sql=${encodeURIComponent(sql)}`);
      ElementGenerator.generateInputTextQuery(arrayValor, html);
    }
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
    fila += 1;
    // ! ocultamos la columnas para la observacion
    if (element[8] === 'n') {
      const filaOculta = tbody.querySelector(`tr:nth-child(${index + 1})`);
      if (filaOculta) {
        filaOculta.style.display = 'none';
      }
      ID -= 1;
    }
    // ! cargamos consultas dinamicas sd en columna 2
    if (element[5] === 'sd' && element[8] === 's' && (element[19] !== '' || element[19] !== null)) {
      traerRutina(element[19], selectDinamic);
    }
    // ! cargamos valor por defecto de un sql query en columna 2
    if (element[5] === 'n' || element[5] === 't' || element[5] === 'tx') {
      if (element[23] !== '' && element[23] !== ' ' && element[23] !== null && element[23] !== undefined) {
        traerValorPorDefecto(element[23], element[5], elementHTML);
      }
    }
    // ! cargamos consultas dinamicas sd en columna 4
    if (element[9] === 'sd' && (element[26] !== '' || element[26] !== null)) {
      traerRutina(element[26], selectDinamic);
    }
    // ! cargamos valor por defecto de un sql query en columna 4
    if (element[9] === 'n' || element[9] === 't' || element[9] === 'tx') {
      if (element[27] !== '' && element[27] !== ' ' && element[27] !== null && element[27] !== undefined) {
        traerValorPorDefecto(element[27], element[9], elementHTML);
      }
    }
  });
}

async function arraysLoad() {
  const datosUser = localStorage.getItem('datosUser');
  if (datosUser) {
    const datos = JSON.parse(datosUser);
    document.querySelector('.custom-button').innerText = datos.lng.toUpperCase();
    data = await translate(datos.lng);
    translateOperativo = data.arrayTranslateOperativo;
    espanolOperativo = data.arrayEspanolOperativo;
    translateArchivo = data.arrayTranslateArchivo;
    espanolArchivo = data.arrayEspanolArchivo;
    const url = new URL(window.location.href);
    const controlT = url.searchParams.get('control_T');
    document.getElementById('wichC').innerText = trA(controlT);
  }
}

function loadTabla(arrayControl, encabezados) {
  const miAlerta = new Alerta();
  if (arrayControl.length > 0) {
    encabezado(encabezados);
    completaTabla(arrayControl, encabezados);
    const cantidadDeFilas = document.querySelector('table tbody');
    if (cantidadDeFilas.childElementCount !== arrayControl.length) {
      const mensaje = trO('La tabla no se completó según lo esperado, vuelva a intentarlo.') || 'La tabla no se completó según lo esperado, vuelva a intentarlo.';
      miAlerta.createVerde(arrayGlobal.avisoRojo, mensaje);
      const modal = document.getElementById('modalAlert');
      modal.style.display = 'block';
    }
  } else {
    miAlerta.createVerde(arrayGlobal.avisoRojo, null);
    const modal = document.getElementById('modalAlert');
    modal.style.display = 'block';
  }
}

export default function tablaVacia(arrayControl, encabezados) {
  arraysLoad();
  setTimeout(() => {
    loadTabla(arrayControl, encabezados);
  }, 100);
}
