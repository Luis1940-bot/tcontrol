// eslint-disable-next-line import/extensions
import traerRegistros from './Controladores/traerRegistros.js';
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
// let translateArchivo = [];
// let espanolArchivo = [];

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

// function trA(palabra) {
//   const palabraNormalizada = palabra.replace(/\s/g, '').toLowerCase();
//   const index = espanolArchivo.findIndex(
//     (item) => item.replace(/\s/g, '').toLowerCase() === palabraNormalizada,
//   );
//   if (index !== -1) {
//     return translateArchivo[index];
//   }
//   return palabra;
// }

async function cargaModal(respuesta, input, haceClick) {
  try {
    const etiquetaInput = input;
    const table = document.querySelector('.modal-content table');
    const thead = table.querySelector('.modal-content table thead');
    const tbody = table.querySelector('.modal-content table tbody');
    while (thead.firstChild) {
      thead.removeChild(thead.firstChild);
    }
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }
    const headers = [respuesta[0][2]];
    const theadRow = document.createElement('tr');
    headers.forEach((headerText) => {
      const th = document.createElement('th');
      th.textContent = headerText;
      theadRow.appendChild(th);
    });
    thead.appendChild(theadRow);

    respuesta.forEach((item) => {
      const row = document.createElement('tr');
      const value = item[1]; // Obtén el valor de la columna 1
      const cell = document.createElement('td');
      cell.textContent = value;
      row.appendChild(cell);
      tbody.appendChild(row);
    });

    tbody.addEventListener('click', (e) => {
      const cell = e.target.closest('td'); // Encuentra la celda más cercana al elemento clicado
      if (cell && haceClick) {
        const cellText = cell.textContent;
        etiquetaInput.value = cellText;
        const modal = document.getElementById('myModal');
        modal.style.display = 'none';
      }
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}

async function consultaCN(event, consulta) {
  const button = event.target;
  const cell = button.closest('td');
  const div = cell.querySelector('div');
  const input = div.querySelector('input');
  const wichCn = document.getElementById('wichCn');
  wichCn.textContent = event.target.name;
  wichCn.style.display = 'block';
  const modal = document.getElementById('myModal');
  modal.style.display = 'inline-block';
  const resultado = await traerRegistros(`traer_LTYsql&sql=${encodeURIComponent(consulta)}`);
  resultado.length > 0 ? cargaModal(resultado, input, true) : null;
}

async function consultaQuery(event, consulta) {
  const wichCn = document.getElementById('wichCn');
  wichCn.textContent = event.target.name;
  wichCn.style.display = 'block';
  const modal = document.getElementById('myModal');
  modal.style.display = 'inline-block';
  const resultado = await traerRegistros(`traer_LTYsql&sql=${encodeURIComponent(consulta)}`);
  resultado.length > 0 ? cargaModal(resultado, '', false) : null;
}

async function traerHijo(sql, array) {
  try {
    const objTraerHijo = {
      filaInserta: sql.substring(0, 4).replace(/@/g, ''),
      tipoDeElemento: sql.substring(5, 8).replace(/@/g, ''),
      columnas: sql.substring(9, 12).replace(/@/g, ''),
      variables: sql.substring(13, 16).replace(/@/g, ''),
      posicionReferencia: sql.substring(17, 20).replace(/@/g, ''),
      res: [],
    };
    const resultado = sql.substring(21, sql.length);
    const textoDespuesDelDolar = resultado.replace(/\?/g, () => array.shift());
    objTraerHijo.res = await traerRegistros(`traer_LTYsql&sql=${encodeURIComponent(textoDespuesDelDolar)}`);
    return objTraerHijo;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error en traerHijo:', error);
    throw error; // Re-lanzar el error para que pueda ser manejado en el evento
  }
}

function generateOptions(array, select) {
  while (select.firstChild) {
    select.removeChild(select.firstChild);
  }
  if (array.length > 0) {
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.text = '';
    select.appendChild(emptyOption);
    array.forEach((subarray) => {
      const [value, text] = subarray;
      const option = document.createElement('option');
      option.value = value;
      option.text = text;
      select.appendChild(option);
    });
  }
}

function insertarDatoEnFila(obj) {
  try {
    const posicion = Number(obj.filaInserta) + 1;
    const fila = document.querySelector(`tr:nth-child(${posicion})`);
    const select = fila.querySelector('td:nth-child(3) select');
    select.setAttribute('selector', 'select-hijo');
    const nuevoArray = obj.res;
    generateOptions(nuevoArray, select);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}

async function eventSelect(event, hijo, sqlHijo) {
  const select = event.target;
  // eslint-disable-next-line prefer-destructuring
  const selectedOptions = select.selectedOptions;
  const columnValues = Array.from(selectedOptions).map((option) => option.value);
  let obj;
  if (hijo === '1') {
    try {
      obj = await traerHijo(sqlHijo, columnValues);
      insertarDatoEnFila(obj);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error al llamar a traerHijo:', error);
    }
  }
}

document.getElementById('closeModalButton').onclick = () => {
  document.getElementById('myModal').style.display = 'none';
};

const buscarModal = document.getElementById('searchInput');

buscarModal.addEventListener('input', (e) => {
  const valorBuscado = e.target.value.trim().toLowerCase();
  const table = document.querySelector('.modal-content table');
  const tbody = table.querySelector('tbody');
  const rows = tbody.querySelectorAll('tr');
  rows.forEach((row) => {
    const cells = row.querySelectorAll('td');
    let filaCoincide = false;

    cells.forEach((cell, index) => {
      if (index === 0) {
        const cellValue = cell.textContent.trim().toLowerCase();
        if (cellValue.includes(valorBuscado)) {
          filaCoincide = true;
        }
      }
    });

    if (filaCoincide) {
      // eslint-disable-next-line no-param-reassign
      row.style.display = 'table-row'; // Muestra la fila si coincide
    } else {
      // eslint-disable-next-line no-param-reassign
      row.style.display = 'none'; // Oculta la fila si no coincide
    }
  });
});

document.addEventListener('DOMContentLoaded', async () => {
  const datosUser = localStorage.getItem('datosUser');
  if (datosUser) {
    const datos = JSON.parse(datosUser);
    document.querySelector('.custom-button').innerText = datos.lng.toUpperCase();
    data = await translate(datos.lng);
    translateOperativo = data.arrayTranslateOperativo;
    espanolOperativo = data.arrayEspanolOperativo;
    // translateArchivo = data.arrayTranslateArchivo;
    // espanolArchivo = data.arrayEspanolArchivo;
    // eslint-disable-next-line prefer-destructuring
    const placeholder = buscarModal.placeholder;
    buscarModal.placeholder = trO(placeholder) || placeholder;
  }
});

export {
  consultaCN,
  consultaQuery,
  eventSelect,
};
