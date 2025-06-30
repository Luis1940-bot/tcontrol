// eslint-disable-next-line import/extensions
import traerRegistros from './Controladores/traerRegistros.js';
// eslint-disable-next-line import/extensions, import/no-useless-path-segments
import { desencriptar } from '../../../controllers/cript.js';
import { trO } from '../../../controllers/trOA.js';
import { arraysLoadTranslate } from '../../../controllers/arraysLoadTranslate.js';
import traerFirma from './Controladores/traerFirma.js';
import Alerta from '../../../includes/atoms/alerta.js';
// eslint-disable-next-line import/extensions
import arrayGlobal from '../../../controllers/variables.js';
import fechasGenerator from '../../../controllers/fechas.js';

let objTranslate = [];

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

async function cargaModal(respuesta, input, haceClick, idInput) {
  try {
    // console.log(respuesta, input, haceClick, idInput);
    // const etiquetaInput = input;
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

    tbody.replaceWith(tbody.cloneNode(true));
    const newTbody = table.querySelector('.modal-content table tbody');
    newTbody.addEventListener(
      'click',
      (e) => {
        if (haceClick && e.target.tagName === 'TD') {
          const id = idInput;
          const inputTD = document.getElementById(id);
          inputTD.value = e.target.textContent;
          const event = new Event('input', { bubbles: true });
          inputTD.dispatchEvent(event);

          const modal = document.getElementById('myModal');
          if (!modal) {
            // eslint-disable-next-line no-console
            console.warn('Error de carga en el modal');
          }
          modal.style.display = 'none';
        }
      },
      { once: true }, // Este listener solo se ejecutará una vez
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}

function renderTablaConsulta(resultado, divContenido) {
  const contenedor = document.createElement('div');
  contenedor.setAttribute('class', 'div-table-modal');
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Buscar...';
  input.id = 'searchInput';

  const tabla = document.createElement('table');
  tabla.style.width = '100%';
  const tbody = document.createElement('tbody');
  tabla.appendChild(tbody);

  const mensajeSeleccion = document.createElement('span');
  mensajeSeleccion.style.fontSize = '12px';
  mensajeSeleccion.style.fontWeight = 'bold';
  mensajeSeleccion.style.display = 'block';
  mensajeSeleccion.style.marginTop = '5px';

  let seleccionado = null;

  const render = (filtro = '') => {
    tbody.innerHTML = '';
    resultado.forEach((fila) => {
      const nombre = fila[1]?.trim() || '';
      if (nombre.toLowerCase().includes(filtro.toLowerCase())) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.textContent = nombre;
        td.className = 'label-email';
        td.style.cursor = 'pointer';
        td.onclick = () => {
          seleccionado = nombre;
          [...tbody.querySelectorAll('td')].forEach((el) =>
            el.classList.remove('selected'),
          );
          td.classList.add('selected'); // marcás el que elegiste
          mensajeSeleccion.textContent = `Seleccionaste: ${nombre}`;
        };
        tr.appendChild(td);
        tbody.appendChild(tr);
      }
    });
  };

  input.addEventListener('input', (e) => render(e.target.value));
  render();

  // contenedor.appendChild(input);
  divContenido.appendChild(input);
  contenedor.appendChild(tabla);
  contenedor.appendChild(mensajeSeleccion);

  return {
    tablaCompleta: contenedor,
    getSeleccionado: () => seleccionado,
  };
}

function crearModalPastillas(tipo = 'text', selector = null) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    const fondo = document.createElement('div');
    fondo.className = 'modal';
    fondo.id = 'modalDinamico';

    const modal = document.createElement('div');
    modal.className = 'modal-content';

    const cerrar = document.createElement('span');
    cerrar.setAttribute('class', 'close');
    cerrar.innerHTML = '&times;';
    cerrar.style.cursor = 'pointer';
    cerrar.onclick = () => {
      document.body.removeChild(fondo);
      resolve(null); // El usuario cerró sin aceptar nada
    };

    const divContenido = document.createElement('div');
    divContenido.className = 'div-span';

    let inputElement;
    let valorGetter = null;

    if (tipo === 'select') {
      const select = document.createElement('select');
      select.style.width = '90%';
      select.style.padding = '10px';
      select.style.marginBottom = '10px';
      generateOptions(selector.opciones, select);

      inputElement = select;
    } else if (tipo === 'consulta') {
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Escribe algo...';
      input.id = 'searchInput';
      inputElement = input;

      // modal.style.display = 'inline-block';
      const resultado = await traerRegistros(
        'traer_LTYsql',
        `${encodeURIComponent(selector)}`,
      );
      const { tablaCompleta, getSeleccionado } = renderTablaConsulta(
        resultado,
        divContenido,
      );
      valorGetter = getSeleccionado;
      inputElement = tablaCompleta;

      // return;
    } else {
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Escribe algo...';
      input.id = 'searchInput';
      inputElement = input;
    }

    const hr = document.createElement('hr');

    const boton = document.createElement('button');
    boton.textContent = 'Aceptar';
    boton.className = 'div-button';
    boton.onclick = () => {
      let valor = '';
      if (tipo === 'text') {
        valor = inputElement.value;
      } else if (tipo === 'select') {
        valor = inputElement.options[inputElement.selectedIndex].text;
      } else if (tipo === 'consulta') {
        valor = valorGetter();
      }

      document.body.removeChild(fondo);
      valor !== '' ? resolve(valor) : null; // Acá te devuelve el valor final
    };

    divContenido.appendChild(inputElement);
    divContenido.appendChild(hr);
    divContenido.appendChild(boton);

    modal.appendChild(cerrar);
    modal.appendChild(divContenido);
    fondo.appendChild(modal);
    document.body.appendChild(fondo);

    fondo.style.display = 'block';
  });
}

async function consultaCN(event, consulta) {
  const idButton = event.target.dataset.input;
  const button = event.target;
  const cell = button.closest('td');
  const div = cell.querySelector('div');
  const input = div.querySelector('input');
  const wichCn = document.getElementById('wichCn');
  wichCn.textContent = event.target.name;
  wichCn.style.display = 'block';
  const modal = document.getElementById('myModal');
  modal.style.display = 'inline-block';
  const resultado = await traerRegistros(
    'traer_LTYsql',
    `${encodeURIComponent(consulta)}`,
  );
  resultado.length > 0 ? cargaModal(resultado, input, true, idButton) : null;
}

async function consultaQuery(event, consulta) {
  const wichCn = document.getElementById('wichCn');
  wichCn.textContent = event.target.name;
  wichCn.style.display = 'block';
  const modal = document.getElementById('myModal');
  modal.style.display = 'inline-block';
  const resultado = await traerRegistros(
    'traer_LTYsql',
    `${encodeURIComponent(consulta)}`,
  );
  resultado.length > 0 ? cargaModal(resultado, '', false) : null;
}

async function cambioDeVariables(sql, array) {
  try {
    const objTraerHijo = {
      filaInserta: sql.filaInserta || 0, // Posición del dato a insertar
      tipoDeElemento: sql.tipoElemento || '',
      columnas: sql.columnasQuery || 0,
      variables: sql.reemplazos || 0, // Número de reemplazos
      posicionReferencia: sql.posicionReferencia || 0,
      res: [],
      query: sql.query,
    };

    const replacements = array.slice(0, objTraerHijo.variables);
    let replacedQuery = objTraerHijo.query || '';
    let currentIndex = 0;

    for (let i = 0; i < objTraerHijo.variables; i++) {
      const questionMarkPosition = replacedQuery.indexOf('?', currentIndex);
      if (questionMarkPosition === -1) break; // Si no hay más "?", salir del bucle

      // Reemplazar el "?" por el valor correspondiente con comillas
      replacedQuery = `${replacedQuery.slice(0, questionMarkPosition)}"${replacements[i]}"${replacedQuery.slice(questionMarkPosition + 1)}`;

      currentIndex = questionMarkPosition + 1;
    }

    objTraerHijo.query = replacedQuery || '';

    return objTraerHijo;
  } catch (error) {
    console.error('Error en cambiar las ?: ', error);
    return null;
  }
}

async function traerHijo(sql, array) {
  try {
    if (array[0].length === 0) {
      return null;
    }

    const objTraerHijo = await cambioDeVariables(sql, array);

    objTraerHijo.res = await traerRegistros(
      'traer_LTYsql',
      `${encodeURIComponent(objTraerHijo.query)}`,
    );

    return objTraerHijo;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error en traerHijo:', error);
    throw error; // Re-lanzar el error para que pueda ser manejado en el evento
  }
}

async function validation(val, plant, objTrad, div, index) {
  try {
    if (!val) {
      return;
    }

    const supervisor = await traerFirma(val, plant);
    if (supervisor.id !== null) {
      const habilitaValidar = sessionStorage.getItem('habilitaValidar');
      while (div.firstChild) {
        div.removeChild(div.firstChild);
      }
      const tbody = document.querySelector('#tableControl tbody');
      const row = tbody.rows[index];
      if (row && row.cells.length >= 3) {
        row.cells[3].innerHTML = '';
        const previousCell = row.cells[2];
        previousCell.colSpan = (previousCell.colSpan || 1) + 1;
        row.removeChild(row.cells[3]);
      }
      const inputText = document.createElement('input');
      inputText.setAttribute('type', 'text');
      inputText.setAttribute('disabled', false);
      inputText.style.border = 'none';
      inputText.value = `Validado por ${supervisor.nombre}`;

      div.appendChild(inputText);
      sessionStorage.setItem('habilitaValidar', habilitaValidar);
    } else {
      const miAlerta = new Alerta();
      const obj = arrayGlobal.avisoRojo;
      const texto = arrayGlobal.mensajesVarios.firma.no_encontrado;
      miAlerta.createVerde(obj, texto, objTrad);

      const modal = document.getElementById('modalAlertVerde');
      modal.style.display = 'block';
      sessionStorage.setItem('habilitaValidar', 'false');
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}

async function checkHour(div, index, columna) {
  try {
    const tbody = document.querySelector('#tableControl tbody');
    const row = tbody.rows[index];
    while (div.firstChild) {
      div.removeChild(div.firstChild);
    }
    if (row && row.cells.length >= 3 && columna === 2) {
      row.cells[3].innerHTML = '';
      const previousCell = row.cells[2];
      previousCell.colSpan = (previousCell.colSpan || 1) + 1;
      row.removeChild(row.cells[3]);
    }

    // Encontrar y deshabilitar el input en la celda anterior
    if (row && row.cells.length > 0) {
      const previousInputCell = row.cells[columna - 1];
      const previousInput =
        previousInputCell.querySelector('input[type="text"]');
      if (previousInput) {
        previousInput.disabled = true;
      }
    }

    const inputText = document.createElement('input');
    inputText.setAttribute('type', 'text');
    inputText.setAttribute('disabled', false);
    inputText.style.display = 'block';
    inputText.style.border = 'none';
    inputText.value = fechasGenerator.hora_actual(new Date());
    div.appendChild(inputText);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}

async function checkDate(div, index) {
  try {
    while (div.firstChild) {
      div.removeChild(div.firstChild);
    }
    const tbody = document.querySelector('#tableControl tbody');
    const row = tbody.rows[index];
    if (row && row.cells.length >= 3) {
      row.cells[3].innerHTML = '';
      const previousCell = row.cells[2];
      previousCell.colSpan = (previousCell.colSpan || 1) + 1;
      row.removeChild(row.cells[3]);
    }
    const inputText = document.createElement('input');
    inputText.setAttribute('type', 'text');
    inputText.setAttribute('disabled', false);
    inputText.style.display = 'block';
    inputText.style.border = 'none';
    inputText.value = fechasGenerator.fecha_corta_ddmmyyyy(new Date());

    div.appendChild(inputText);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}

async function checkDateHour(div, index) {
  try {
    while (div.firstChild) {
      div.removeChild(div.firstChild);
    }
    const tbody = document.querySelector('#tableControl tbody');
    const row = tbody.rows[index];
    if (row && row.cells.length >= 3) {
      row.cells[3].innerHTML = '';
      const previousCell = row.cells[2];
      previousCell.colSpan = (previousCell.colSpan || 1) + 1;
      row.removeChild(row.cells[3]);
    }
    const inputText = document.createElement('input');
    inputText.setAttribute('type', 'text');
    inputText.setAttribute('disabled', false);
    inputText.style.display = 'block';
    inputText.style.border = 'none';
    inputText.value = fechasGenerator.fecha_larga_dateHour(new Date());

    div.appendChild(inputText);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}

function removeAllOptions(select) {
  while (select.firstChild) {
    select.removeChild(select.firstChild);
  }
}

function insertarDatoEnFila(obj) {
  try {
    const tabla = document.querySelector('#tableControl');
    const tbody = tabla.querySelector('tbody');
    const posicion = Number(obj.filaInserta) + 1;
    const fila = tbody.querySelector(`tr:nth-child(${posicion})`);

    const { tipoDeElemento } = obj;
    if (tipoDeElemento === 's') {
      const select = fila.querySelector('td:nth-child(3) select');
      select.setAttribute('selector', 'select-hijo');
      const nuevoArray = obj.res;
      if (
        nuevoArray.length > 0 &&
        nuevoArray[0].length > 0 &&
        nuevoArray[0][0] !== ''
      ) {
        generateOptions(nuevoArray, select);
      } else {
        removeAllOptions(select);
      }
    }
    if (tipoDeElemento === 't' || tipoDeElemento === 'n') {
      const texto = fila.querySelector('td:nth-child(3) input');
      const valorRes = obj.res[0] || '';
      tipoDeElemento === 't' ? (texto.value = valorRes) : null;
      tipoDeElemento === 'n'
        ? (texto.value = parseInt(valorRes, 10) || 0)
        : null;
      texto.dispatchEvent(new Event('change', { bubbles: true }));
    }
    if (tipoDeElemento === 'tx') {
      const texto = fila.querySelector('td:nth-child(3) textarea');
      const valorRes = obj.res[0] || '';
      texto.value = valorRes;
      texto.dispatchEvent(new Event('change', { bubbles: true }));
    }
    if (tipoDeElemento === 'table') {
      const tablaComponente = fila.querySelector('td:nth-child(3) table');
      if (tablaComponente === null) {
        // eslint-disable-next-line no-console
        // console.warn('No se encontró la tabla en la celda esperada.');
        return;
      }
      const valorRes = obj.res || [];

      const tbodyComponente = document.createElement('tbody');

      if (valorRes.length > 0) {
        valorRes.forEach((item) => {
          const row = document.createElement('tr');
          item.forEach((cellData) => {
            const cell = document.createElement('td');
            cell.textContent = cellData;
            row.appendChild(cell);
          });
          tbodyComponente.appendChild(row);
        });
        tablaComponente.appendChild(tbodyComponente);
        tablaComponente.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}

async function eventSelect(event, hijo, sqlHijo) {
  const valorInput = event.target.value;
  const select = event.target;
  const { selectedOptions } = select;
  const indexTextPairs = [];

  if (selectedOptions) {
    // Asegúrate de que hay opciones seleccionadas válidas
    if (selectedOptions.length === 0) {
      return;
    }

    for (let i = 0; i < selectedOptions.length; i++) {
      const option = selectedOptions[i];
      indexTextPairs.push([option.value, option.textContent]);
    }
  }

  let obj;
  if (hijo === 1 && indexTextPairs.length > 0) {
    try {
      // Aquí puedes usar indexTextPairs para acceder a los índices y textos
      obj = await traerHijo(sqlHijo, indexTextPairs[0]);
      if (obj === null) {
        // eslint-disable-next-line no-console
        console.warn('No se encontraron datos para la selección.');
        return;
      }

      insertarDatoEnFila(obj);
    } catch (error) {
      console.error('Error al llamar a traerHijo:', error);
    }
  } else if (hijo === 1 && event.type === 'input') {
    indexTextPairs.push(valorInput);
    obj = await traerHijo(sqlHijo, indexTextPairs);
    if (obj === null) {
      // eslint-disable-next-line no-console
      console.warn('No se encontraron datos para la selección.');
      return;
    }

    insertarDatoEnFila(obj);
  } else if (hijo === 1 && event.type === 'change') {
    indexTextPairs.push(valorInput);
    obj = await traerHijo(sqlHijo, indexTextPairs);
    if (obj === null) {
      // eslint-disable-next-line no-console
      console.warn('No se encontraron datos para la selección.');
      return;
    }

    insertarDatoEnFila(obj);
  }
}

async function addPastillaText(tipoDeEelemento, selector) {
  const valor = await crearModalPastillas(tipoDeEelemento, selector);
  // console.log(valor);
  return valor;
}

async function addComponentTable(consulta, index, tablaComponente) {
  try {
    let query = consulta;
    const tabla = document.querySelector('#tableControl');
    const valorFila = parseInt(
      tablaComponente.getAttribute(`data-fila${index}`),
      10,
    );
    const fila = tabla.tBodies[0].rows[valorFila];
    const terceraCelda = fila.cells[2]; // Índice 2 es la tercera celda
    const componente = terceraCelda.firstElementChild;
    const valorReferencia = componente.value || null;
    if (valorReferencia && query) {
      query = query.replace('?', valorReferencia);
    }
    const resultado = await traerRegistros(
      'traer_LTYsql',
      `${encodeURIComponent(query)}`,
    );
    if (resultado.length > 0) {
      const tbody = document.createElement('tbody');
      resultado.forEach((item) => {
        const row = document.createElement('tr');
        item.forEach((cellData) => {
          const cell = document.createElement('td');
          cell.textContent = cellData;
          row.appendChild(cell);
        });
        tbody.appendChild(row);
      });

      return tbody;
    }
    return null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return null;
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
  const persona = desencriptar(sessionStorage.getItem('user'));
  if (persona) {
    document.querySelector('.custom-button').innerText =
      persona.lng.toUpperCase();
    objTranslate = await arraysLoadTranslate();

    const { placeholder } = buscarModal;
    buscarModal.placeholder = trO(placeholder, objTranslate) || placeholder;
  }
});

export {
  consultaCN,
  consultaQuery,
  eventSelect,
  validation,
  checkHour,
  checkDate,
  checkDateHour,
  addPastillaText,
  addComponentTable,
};
