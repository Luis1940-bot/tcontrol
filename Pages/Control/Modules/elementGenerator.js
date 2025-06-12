// eslint-disable-next-line import/extensions, import/named
import {
  consultaCN,
  consultaQuery,
  eventSelect,
  validation,
  checkHour,
  checkDate,
  checkDateHour,
  addPastillaText,
  addComponentTable,

  // eslint-disable-next-line import/extensions
} from './accionButton.js';
// eslint-disable-next-line import/extensions
import buttonImage from './imagenes.js';

import baseUrl from '../../../config.js';
import { encriptar } from '../../../controllers/cript.js';
import { mostrarMensaje } from '../../../controllers/ui/alertasLuis.js';

// const SERVER = '/iControl-Vanilla/icontrol';
const SERVER = baseUrl;

// function sanitizeJsonString(jsonString) {
//   // Solo reemplaza saltos de línea por \n dentro de strings, pero NO escapa comillas dobles
//   let inString = false;
//   let prevChar = '';
//   let result = '';
//   for (let i = 0; i < jsonString.length; i++) {
//     const char = jsonString[i];
//     if (char === '"' && prevChar !== '\\') {
//       inString = !inString;
//     }
//     if (inString && char === '\n') {
//       result += '\\n';
//     } else {
//       result += char;
//     }
//     prevChar = char;
//   }
//   return result;
// }

function sanitizeJsonString(jsonString) {
  if (!jsonString) {
    return null;
  }
  // Elimina saltos de línea reales, literales \n, literales \\n y tabulaciones dentro de los valores de "query"
  return jsonString.replace(
    /("query"\s*:\s*")([\s\S]*?)(?<!\\)"/g,
    (match, p1, p2) => {
      // Escapa comillas dobles internas, elimina saltos de línea, literales \n, literales \\n y tabulaciones
      const sanitized = p2
        .replace(/\\?"/g, '\\"') // escapa comillas dobles internas
        .replace(/\\\\n|\\n|[\r\n\t]/g, ''); // elimina \\n, \n, saltos de línea reales y tabulaciones
      return `${p1}${sanitized}"`;
    },
  );
}

class ElementGenerator {
  static generateInputDate(date, width, valorPorDefecto) {
    const inputDate = document.createElement('input');
    inputDate.setAttribute('type', 'date');
    date ? (inputDate.value = date) : null;
    width ? (inputDate.style.width = width) : null;
    valorPorDefecto !== '' &&
    valorPorDefecto !== ' ' &&
    valorPorDefecto !== null &&
    valorPorDefecto !== undefined
      ? (inputDate.value = valorPorDefecto)
      : null;
    return inputDate;
  }

  static generateInputHora(hora, width, valorPorDefecto) {
    const inputHora = document.createElement('input');
    inputHora.setAttribute('type', 'time');
    hora ? (inputHora.value = hora) : null;
    width ? (inputHora.style.width = width) : null;
    valorPorDefecto !== '' &&
    valorPorDefecto !== ' ' &&
    valorPorDefecto !== null &&
    valorPorDefecto !== undefined
      ? (inputHora.value = valorPorDefecto)
      : null;

    return inputHora;
  }

  static generateInputText(width, valorPorDefecto) {
    const inputText = document.createElement('input');
    inputText.setAttribute('type', 'text');
    width ? (inputText.style.width = width) : null;
    valorPorDefecto !== '' &&
    valorPorDefecto !== ' ' &&
    valorPorDefecto !== null &&
    valorPorDefecto !== undefined
      ? (inputText.value = valorPorDefecto)
      : null;

    function validateInput(event) {
      const inputElement = event.target.value;
      // Reemplazar caracteres no permitidos
      const eve = event;
      eve.target.value = inputElement.replace(/[,:"'*/;]/g, '');
      // const newValue = inputElement.replace(/[,:"']/g, '');
      // event.target.value = newValue;
    }

    // Agregar evento input al input
    inputText.addEventListener('input', validateInput);
    return inputText;
  }

  static generateInputCheckBox(checked) {
    const inputCheckBox = document.createElement('input');
    inputCheckBox.setAttribute('type', 'checkbox');
    inputCheckBox.classList.add('custom-checkbox');
    inputCheckBox.checked = checked;
    return inputCheckBox;
  }

  static generateInputNumber(width, valorPorDefecto, hijo, sqlHijo) {
    const inputNumber = document.createElement('input');
    inputNumber.setAttribute('type', 'text'); // Cambiado a 'text' para compatibilidad con inputmode
    inputNumber.setAttribute('inputmode', 'decimal'); // Sugerir teclado numérico con punto decimal
    inputNumber.setAttribute('placeholder', '0.0'); // Guía para el usuario

    // Aplicar ancho si se especifica
    if (width) inputNumber.style.width = width;

    // Establecer valor por defecto si es válido
    if (valorPorDefecto?.toString().trim()) {
      inputNumber.value = valorPorDefecto;
    }

    // Validar entrada en tiempo real
    inputNumber.addEventListener('input', function inputNumberEventInput() {
      // Permitir solo dígitos, un único punto decimal y un signo negativo al principio
      let sanitizedValue = this.value.replace(/(?!^-)[^\d.-]/g, '');

      // Limitar el signo negativo al principio
      if (sanitizedValue.indexOf('-') > 0) {
        sanitizedValue = sanitizedValue.replace('-', '');
      }

      // Limitar a un solo punto decimal
      const parts = sanitizedValue.split('.');
      if (parts.length > 2) {
        sanitizedValue = `${parts[0]}.${parts[1]}`;
      }

      // Limitar a 6 decimales
      if (parts[1]?.length > 6) {
        sanitizedValue = `${parts[0]}.${parts[1].slice(0, 6)}`;
      }

      // Corregir ".5" a "0.5"
      if (sanitizedValue.startsWith('.')) {
        sanitizedValue = `0${sanitizedValue}`;
      }

      // Corregir "-.5" a "-0.5"
      if (sanitizedValue.startsWith('-.')) {
        sanitizedValue = `-0${sanitizedValue.slice(1)}`;
      }

      this.value = sanitizedValue;
    });
    inputNumber.dispatchEvent(new Event('input', { bubbles: true }));
    // Validar valor final al perder el foco
    inputNumber.addEventListener('blur', function inputNumberEventBlur() {
      if (this.value === '' || Number.isNaN(Number(this.value))) {
        this.value = ''; // Si el valor no es válido, limpiar el input
      }
    });
    // eslint-disable-next-line no-unused-vars
    inputNumber.addEventListener('change', async (event) => {
      // console.log('eventooooooo');
      // await eventSelect(event, hijo, sqlHijo);
    });
    if (hijo === '1' && sqlHijo) {
      inputNumber.dispatchEvent(new Event('change', { bubbles: true })); // Dispara el evento input manualmente
    }

    return inputNumber;
  }

  static generateInputNumberQuery(valorQuery, elementoHTML) {
    const elementoCopia = elementoHTML.cloneNode(true);
    const newValue =
      valorQuery !== '' &&
      valorQuery !== ' ' &&
      valorQuery !== null &&
      valorQuery !== undefined
        ? valorQuery
        : '';
    elementoCopia.value = newValue;
    elementoHTML.parentNode.replaceChild(elementoCopia, elementoHTML);
  }

  static generateInputTextQuery(valorQuery, elementoHTML) {
    const elementoCopia = elementoHTML.cloneNode(true);
    const newValue =
      valorQuery !== '' &&
      valorQuery !== ' ' &&
      valorQuery !== null &&
      valorQuery !== undefined
        ? valorQuery
        : '';
    elementoCopia.value = newValue;
    elementoHTML.parentNode.replaceChild(elementoCopia, elementoHTML);
  }

  static generateInputTextAreaQuery(valorQuery, elementoHTML) {
    const elementoCopia = elementoHTML.cloneNode(true);
    const newValue =
      valorQuery !== '' &&
      valorQuery !== ' ' &&
      valorQuery !== null &&
      valorQuery !== undefined
        ? valorQuery
        : '';
    elementoCopia.value = newValue;
    elementoHTML.parentNode.replaceChild(elementoCopia, elementoHTML);
  }

  static generateTextArea(valorPorDefecto, filas = 5, cols = 50) {
    const textArea = document.createElement('textarea');
    textArea.rows = filas ?? 5;
    textArea.cols = cols ?? 50;
    valorPorDefecto ? (textArea.value = valorPorDefecto) : null;
    valorPorDefecto !== '' &&
    valorPorDefecto !== ' ' &&
    valorPorDefecto !== null &&
    valorPorDefecto !== undefined
      ? (textArea.value = valorPorDefecto)
      : null;
    function validateInput(event) {
      const currentValue = event.target.value;
      // Reemplazar caracteres no permitidos
      const eve = event;
      eve.target.value = currentValue.replace(/[,:"'*/;]/g, '');
    }

    // Agregar evento input al input
    textArea.addEventListener('input', validateInput);
    return textArea;
  }

  static generateSelectDinamic(hijo, sqlHijo) {
    const selectDinamic = document.createElement('select');
    selectDinamic.setAttribute('selector', 'selectDinamic');

    selectDinamic.addEventListener('change', async (event) => {
      // Prevenir cambios simultáneos
      if (selectDinamic.dataset.loading === 'true') return;

      try {
        // Indicar que se está cargando
        if (!sqlHijo) {
          return;
        }
        selectDinamic.dataset.loading = 'true';
        const sqlCorregido = sanitizeJsonString(sqlHijo);
        const jsonStringSinSaltos = sqlCorregido.replace(/[\r\n]+/g, ' ');

        const sqlJSON = JSON.parse(jsonStringSinSaltos);
        if (Array.isArray(sqlJSON.hijos)) {
          sqlJSON.hijos.forEach(async (nieto) => {
            await eventSelect(event, 1, nieto);
          });
        }
      } catch (error) {
        console.error('Error en el evento change:', error);
      } finally {
        // Finalizar el estado de carga
        selectDinamic.dataset.loading = 'false';
      }
    });

    return selectDinamic;
  }

  static generateSelect(array, valorXDefecto, hijo, sqlHijo) {
    const select = document.createElement('select');
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }
    const nuevoArray = [...array];
    nuevoArray.forEach((element, index) => {
      index === 1 ? select.setAttribute('selector', element[2]) : null;
    });

    select.addEventListener('change', async (event) => {
      // Prevenir cambios simultáneos
      if (select.dataset.loading === 'true') return;

      try {
        // Indicar que se está cargando
        if (!sqlHijo) {
          return;
        }
        select.dataset.loading = 'true';
        const sqlCorregido = sanitizeJsonString(sqlHijo);
        const jsonStringSinSaltos = sqlCorregido.replace(/[\r\n]+/g, ' ');

        const sqlJSON = JSON.parse(jsonStringSinSaltos);

        if (Array.isArray(sqlJSON.hijos)) {
          sqlJSON.hijos.forEach(async (nieto) => {
            await eventSelect(event, 1, nieto);
          });
        }
      } catch (error) {
        console.error('Error en el evento change:', error);
      } finally {
        // Finalizar el estado de carga
        select.dataset.loading = 'false';
      }
    });

    if (array.length > 0) {
      const emptyOption = document.createElement('option');
      emptyOption.value = '';
      emptyOption.text = '';
      select.appendChild(emptyOption);
      array.forEach(([value, text]) => {
        const option = document.createElement('option');
        option.value = value;
        option.text = text;
        select.appendChild(option);
      });

      if (valorXDefecto) {
        for (let i = 0; i < select.options.length; i++) {
          if (select.options[i].text === valorXDefecto) {
            select.selectedIndex = i;
            break;
          }
        }
      }
    }

    return select;
  }

  static generateOptions(array, select) {
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

  static generateImg(src, alt, dim, extension, plant) {
    // console.log(src, alt, dim, extension)

    const dimensiones = dim;
    const img = document.createElement('img');
    img.src = `${SERVER}/assets/img/planos/${plant}/${src}`;
    img.alt = alt;
    img.dataset.extension = extension;
    img.classList.add('planos');

    // Verificar si las dimensiones están presentes y no vacías
    if (dimensiones && dimensiones.trim() !== '') {
      try {
        // Utilizar JSON.parse para convertir la cadena en un objeto
        const ajustada = dimensiones.replace(
          /(['"])?([a-zA-Z0-9_]+)(['"])?:/g,
          '"$2": ',
        );
        const objeto = JSON.parse(ajustada);
        // Verificar si el objeto tiene propiedades width y height
        if (objeto.width && objeto.height) {
          img.style.width = `${objeto.width}vw`;
          img.style.height = `${objeto.height}vw`;
        } else {
          // eslint-disable-next-line no-console
          console.error(
            'Las dimensiones proporcionadas no son válidas. Se aplicarán dimensiones predeterminadas.',
          );
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(
          'Error al analizar las dimensiones como JSON. Se aplicarán dimensiones predeterminadas.',
        );
      }
    }

    return img;
  }

  static generateInputButton(
    text,
    name,
    consulta,
    clase,
    index,
    hijo,
    sqlHijo,
  ) {
    const div = document.createElement('div');
    div.setAttribute('class', 'button-cn');
    const inputText = document.createElement('input');
    inputText.setAttribute('type', 'text');
    const id = `${index}-buttonCn`;
    inputText.setAttribute('id', id);
    function validateInput(event) {
      const currentValue = event.target.value;
      // Reemplazar caracteres no permitidos
      const eve = event;
      eve.target.value = currentValue.replace(/[,:"'/]/g, '');
    }

    // Agregar evento input al input
    inputText.addEventListener('input', validateInput);
    inputText.addEventListener('input', async (event) => {
      // Prevenir cambios simultáneos

      if (inputText.dataset.loading === 'true') return;

      try {
        // Indicar que se está cargando
        inputText.dataset.loading = 'true';

        // const sqlCorregido = sanitizeJsonString(sqlHijo);

        // const sqlJSON = JSON.parse(sqlCorregido);
        const sqlCorregido = sanitizeJsonString(sqlHijo);
        const jsonStringSinSaltos = sqlCorregido.replace(/[\r\n]+/g, ' ');
        const sqlJSON = JSON.parse(jsonStringSinSaltos);
        if (Array.isArray(sqlJSON.hijos)) {
          sqlJSON.hijos.forEach(async (nieto) => {
            await eventSelect(event, 1, nieto);
          });
        }
      } catch (error) {
        console.error('Error en el evento change:', error);
      } finally {
        // Finalizar el estado de carga
        inputText.dataset.loading = 'false';
      }
    });
    div.appendChild(inputText);
    const button = document.createElement('button');
    button.textContent = text;
    button.setAttribute('name', name);
    button.setAttribute('class', clase);
    button.setAttribute('data-input', id);
    // button.style.background = '#97B7E8';
    div.appendChild(button);
    button.addEventListener('click', (event) => {
      consultaCN(event, consulta);
    });

    return div;
  }

  static generateUl() {
    const ul = document.createElement('ul');
    return ul;
  }

  static generateButtonImage(text, ID) {
    const button = document.createElement('button');
    button.textContent = text;
    // button.style.background = '#97B7E8';
    button.setAttribute('data-row', ID);
    button.setAttribute('class', 'transparent-button');
    button.addEventListener('click', () => {
      buttonImage(ID);
    });
    return button;
  }

  static generateButtonQuery(text, name, consulta, clase) {
    const button = document.createElement('button');
    button.textContent = text;
    button.setAttribute('name', name);
    // button.style.background = '#97B7E8';
    button.setAttribute('class', clase);
    button.addEventListener('click', (event) => {
      consultaQuery(event, consulta);
    });
    return button;
  }

  static generateSelectedRadioButton(checked, name) {
    const radioButton = document.createElement('input');
    radioButton.setAttribute('type', 'radio');
    radioButton.checked = checked;
    name !== '0' ? (radioButton.name = name) : null;
    return radioButton;
  }

  static generateValidButton(text, name, objTrad, clase, plant, index) {
    const div = document.createElement('div');
    div.setAttribute('class', 'button-cn');
    const inputText = document.createElement('input');
    inputText.setAttribute('type', 'password');
    inputText.autocomplete = 'new-password';
    div.appendChild(inputText);
    const button = document.createElement('button');
    button.textContent = text;
    button.setAttribute('name', name);
    button.setAttribute('class', clase);
    // button.style.background = '#97B7E8';
    div.appendChild(button);
    button.addEventListener('click', (event) => {
      event.preventDefault();
      let encriptado = encriptar(inputText.value.trim());
      if (inputText.value.trim() === '') {
        encriptado = null;
      }
      validation(encriptado, plant, objTrad, div, index);
      const habilitaValidar = sessionStorage.getItem('habilitaValidar');
      if (habilitaValidar === 'true') {
        mostrarMensaje(
          'Tiene que guardar los cambios para registrar su firma.',
          'info',
        );
        // alert('Tiene que guardar los cambios para registrar su firma.');
      } else if (habilitaValidar === 'false') {
        mostrarMensaje('No olvide de guardar el documento.', 'info');
        // alert('No olvide de guardar el documento.');
      }
    });
    return div;
  }

  static generateButtonCheckHour(text, name, clase, index, columna) {
    const div = document.createElement('div');
    div.setAttribute('class', 'button-cn');
    const inputText = document.createElement('input');
    inputText.setAttribute('type', 'checkHour');
    inputText.style.display = 'none';
    inputText.disabled = true;

    div.appendChild(inputText);
    const button = document.createElement('button');
    button.textContent = text;
    button.setAttribute('name', name);
    button.setAttribute('class', clase);
    // button.style.background = '#97B7E8';
    div.appendChild(button);
    button.addEventListener('click', (event) => {
      event.preventDefault();
      checkHour(div, index, columna);
    });
    return div;
  }

  static generateButtonCheckDate(text, name, clase, index) {
    const div = document.createElement('div');
    div.setAttribute('class', 'button-cn');
    const inputText = document.createElement('input');
    inputText.setAttribute('type', 'checkDate');
    inputText.style.display = 'none';
    inputText.disabled = true;

    div.appendChild(inputText);
    const button = document.createElement('button');
    button.textContent = text;
    button.setAttribute('name', name);
    button.setAttribute('class', clase);
    // button.style.background = '#97B7E8';
    div.appendChild(button);
    button.addEventListener('click', (event) => {
      event.preventDefault();
      checkDate(div, index);
    });
    return div;
  }

  static generateButtonCheckDateHour(text, name, clase, index) {
    const div = document.createElement('div');
    div.setAttribute('class', 'button-cn');
    const inputText = document.createElement('input');
    inputText.setAttribute('type', 'checkDateHour');
    inputText.style.display = 'none';
    inputText.disabled = true;

    div.appendChild(inputText);
    const button = document.createElement('button');
    button.textContent = text;
    button.setAttribute('name', name);
    button.setAttribute('class', clase);
    // button.style.background = '#97B7E8';
    div.appendChild(button);
    button.addEventListener('click', (event) => {
      event.preventDefault();
      checkDateHour(div, index);
    });
    return div;
  }

  static generateDivPastillita(index) {
    const div = document.createElement('div');
    div.setAttribute('id', `pastillita${index}`);
    return div;
  }

  static generateAddPastillita(
    text,
    name,
    clase,
    plant,
    index,
    tipoDeEelemento,
    selector,
  ) {
    const button = document.createElement('button');
    button.textContent = text;
    button.setAttribute('name', name);
    button.setAttribute('class', clase);
    button.setAttribute('data-sel', selector);
    button.addEventListener('click', async (event) => {
      event.preventDefault();

      const valor = await addPastillaText(tipoDeEelemento, selector);

      const divPastilla = document.getElementById(`pastillita${index}`);
      divPastilla.className = 'div-pastillita';

      // Crea el contenedor individual para cada pastilla
      const pastilla = document.createElement('div');
      pastilla.className = 'pastilla';
      pastilla.setAttribute('data-id', `${Date.now()}-${Math.random()}`); // id único, por si querés rastrear

      const span = document.createElement('span');
      span.className = 'label-email';
      span.innerHTML = valor;

      const buttonCerrar = document.createElement('button');
      buttonCerrar.className = 'button-email';
      buttonCerrar.innerHTML = 'x';

      // Acción de eliminar la pastilla al hacer clic
      buttonCerrar.addEventListener('click', () => {
        pastilla.remove();
      });

      pastilla.appendChild(span);
      pastilla.appendChild(buttonCerrar);

      divPastilla.appendChild(pastilla);
    });

    return button;
  }

  static generaComponentTable(posicion, plant, filaTomaValor) {
    const table = document.createElement('table');
    table.setAttribute('id', `tabla-${posicion}`);
    table.setAttribute('data-plant', plant);
    table.setAttribute(`data-fila${posicion}`, filaTomaValor);
    table.setAttribute('class', 'table-componente');
    return table;
  }

  static generateRowsTable(query, index, tablaComponente) {
    const tbody = addComponentTable(query, index, tablaComponente);
    return tbody;
  }
}

// Exporta la clase para que pueda ser utilizada desde otros archivos
export default ElementGenerator;
