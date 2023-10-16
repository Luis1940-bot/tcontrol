const widthScreen = window.innerWidth;
let arrayWidthEncabezado;

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
function estilosCell(alignCenter, paddingLeft, type, dato, colSpan, fontStyle, fontWeight) {
  const cell = document.createElement('td');
  if (dato !== null && type === null) {
    cell.textContent = dato;
  } else if ((dato === null && type !== null)) {
    cell.appendChild(type);
  }
  cell.style.borderBottom = '1px solid #cecece';
  cell.style.background = '#ffffff';
  cell.style.zIndex = 2;
  cell.style.textAlign = alignCenter;
  cell.style.paddingLeft = paddingLeft;
  cell.style.fontStyle = fontStyle;
  cell.style.fontWeight = fontWeight;
  colSpan === 1 ? cell.colSpan = 4 : null;
  colSpan === 2 ? cell.style.display = 'none' : null;
  return cell;
}

function generateInputDate() {
  const inputDate = document.createElement('input');
  inputDate.setAttribute('type', 'date');
  return inputDate;
}
function generateInputHora() {
  const inputHora = document.createElement('input');
  inputHora.setAttribute('type', 'time');
  return inputHora;
}

function estilosTbodyCell(element, index) {
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
    let type = null;
    if (i === 0) {
      dato = index + 1;
      alignCenter = 'center';
    } else if (i === 1) {
      paddingLeft = '5px';
    } else if (i === 4) {
      dato = '';
    }
    i === 1 && tipoDeDato === 'l' ? fontStyle = 'italic' : null;
    i === 1 && (tipoDeDato === 'subt' || tipoDeDato === 'title') ? (fontWeight = 700, paddingLeft = '20px') : null;

    if (i === 1 && (tipoDeDato === 'l' || tipoDeDato === 'subt' || tipoDeDato === 'title')) {
      colSpan = 1;
    }
    if (i > 1 && (tipoDeDato === 'l' || tipoDeDato === 'subt' || tipoDeDato === 'title')) {
      colSpan = 2;
    }
    i === 1 && orden[i] === 3 && (tipoDeDato !== 'l' && tipoDeDato !== 'subt' && tipoDeDato !== 'title') ? dato = dato.toUpperCase() : null;

    if (i === 2 && tipoDeDato === 'd') {
      dato = null;
      type = generateInputDate();
    } else if (i === 2 && tipoDeDato === 'h') {
      dato = null;
      type = generateInputHora();
    }

    const cell = estilosCell(alignCenter, paddingLeft, type, dato, colSpan, fontStyle, fontWeight);
    newRow.appendChild(cell);
  }
  return newRow;
}

function completaTabla(arrayControl) {
  const tbody = document.querySelector('tbody');
  arrayControl.forEach((element, index) => {
    const newRow = estilosTbodyCell(element, index);
    tbody.appendChild(newRow);
  });
}
export default function tablaVacia(arrayControl, encabezados) {
  console.log(arrayControl);
  encabezado(encabezados);
  completaTabla(arrayControl, encabezados);
}
