// eslint-disable-next-line import/extensions, import/named
import {
  consultaCN,
  consultaQuery,
  eventSelect,
  validation,
  checkHour,
  checkDate,
  checkDateHour,
  // eslint-disable-next-line import/extensions
} from './accionButton.js';
// eslint-disable-next-line import/extensions
import buttonImage from './imagenes.js';

import baseUrl from '../../../config.js';
import { encriptar } from '../../../controllers/cript.js';

// const SERVER = '/iControl-Vanilla/icontrol';
const SERVER = baseUrl;

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
      event.target.value = inputElement.replace(/[,:"'*/;]/g, '');
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

  static generateInputNumber(width, valorPorDefecto) {
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
    inputNumber.addEventListener('input', function () {
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

    // Validar valor final al perder el foco
    inputNumber.addEventListener('blur', function () {
      if (this.value === '' || Number.isNaN(Number(this.value))) {
        this.value = ''; // Si el valor no es válido, limpiar el input
      }
    });

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
      event.target.value = currentValue.replace(/[,:"'*/;]/g, '');
    }

    // Agregar evento input al input
    textArea.addEventListener('input', validateInput);
    return textArea;
  }

  static generateSelectDinamic(hijo, sqlHijo) {
    const selectDinamic = document.createElement('select');
    selectDinamic.setAttribute('selector', 'selectDinamic');
    // selectDinamic.addEventListener('change', (event) => {
    //   eventSelect(event, hijo, sqlHijo)
    // })
    selectDinamic.addEventListener('change', async (event) => {
      // Prevenir cambios simultáneos
      if (selectDinamic.dataset.loading === 'true') return;

      try {
        // Indicar que se está cargando
        selectDinamic.dataset.loading = 'true';

        // Llamar a la función y pasar los parámetros necesarios
        await eventSelect(event, hijo, sqlHijo);
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

    // select.addEventListener('change', (event) => {
    //   eventSelect(event, hijo, sqlHijo)
    // })

    select.addEventListener('change', async (event) => {
      // Prevenir cambios simultáneos
      if (select.dataset.loading === 'true') return;

      try {
        // Indicar que se está cargando
        select.dataset.loading = 'true';

        // Llamar a la función y pasar los parámetros necesarios
        await eventSelect(event, hijo, sqlHijo);
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
      array.forEach((subarray, index) => {
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

  static generateInputButton(text, name, consulta, clase, index) {
    const div = document.createElement('div');
    div.setAttribute('class', 'button-cn');
    const inputText = document.createElement('input');
    inputText.setAttribute('type', 'text');
    const id = `${index}-buttonCn`;
    inputText.setAttribute('id', id);
    function validateInput(event) {
      const currentValue = event.target.value;
      // Reemplazar caracteres no permitidos
      event.target.value = currentValue.replace(/[,:"'/]/g, '');
    }

    // Agregar evento input al input
    inputText.addEventListener('input', validateInput);
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
        alert('Tiene que guardar los cambios para registrar su firma.');
      } else if (habilitaValidar === 'false') {
        alert('No olvide de guardar el documento.');
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
}

// Exporta la clase para que pueda ser utilizada desde otros archivos
export default ElementGenerator;
