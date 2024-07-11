// eslint-disable-next-line import/extensions, import/named
import {
  consultaCN,
  consultaQuery,
  eventSelect,
  // eslint-disable-next-line import/extensions
} from './accionButton.js'
// eslint-disable-next-line import/extensions
import buttonImage from './imagenes.js'

import baseUrl from '../../../config.js'
// const SERVER = '/iControl-Vanilla/icontrol';
const SERVER = baseUrl

class ElementGenerator {
  static generateInputDate(date, width, valorPorDefecto) {
    const inputDate = document.createElement('input')
    inputDate.setAttribute('type', 'date')
    date ? (inputDate.value = date) : null
    width ? (inputDate.style.width = width) : null
    valorPorDefecto !== '' &&
    valorPorDefecto !== ' ' &&
    valorPorDefecto !== null &&
    valorPorDefecto !== undefined
      ? (inputDate.value = valorPorDefecto)
      : null
    return inputDate
  }

  static generateInputHora(hora, width, valorPorDefecto) {
    const inputHora = document.createElement('input')
    inputHora.setAttribute('type', 'time')
    hora ? (inputHora.value = hora) : null
    width ? (inputHora.style.width = width) : null
    valorPorDefecto !== '' &&
    valorPorDefecto !== ' ' &&
    valorPorDefecto !== null &&
    valorPorDefecto !== undefined
      ? (inputHora.value = valorPorDefecto)
      : null

    return inputHora
  }

  static generateInputText(width, valorPorDefecto) {
    const inputText = document.createElement('input')
    inputText.setAttribute('type', 'text')
    width ? (inputText.style.width = width) : null
    valorPorDefecto !== '' &&
    valorPorDefecto !== ' ' &&
    valorPorDefecto !== null &&
    valorPorDefecto !== undefined
      ? (inputText.value = valorPorDefecto)
      : null
    return inputText
  }

  static generateInputCheckBox(checked) {
    const inputCheckBox = document.createElement('input')
    inputCheckBox.setAttribute('type', 'checkbox')
    inputCheckBox.checked = checked
    return inputCheckBox
  }

  static generateInputNumber(width, valorPorDefecto) {
    const inputNumber = document.createElement('input')
    inputNumber.setAttribute('type', 'text')
    inputNumber.setAttribute('inputmode', 'decimal')
    inputNumber.setAttribute('pattern', '^[0-9]{0,10}(\\.[0-9]{0,2})?$')
    width ? (inputNumber.style.width = width) : null
    valorPorDefecto !== '' &&
    valorPorDefecto !== ' ' &&
    valorPorDefecto !== null &&
    valorPorDefecto !== undefined
      ? (inputNumber.value = valorPorDefecto)
      : null
    inputNumber.addEventListener('input', function handleInput() {
      this.value = this.value.replace(/[^\d.]/g, '')
    })
    inputNumber.addEventListener('blur', function handleBlur() {
      this.value = parseFloat(this.value).toLocaleString()
    })
    return inputNumber
  }

  static generateInputNumberQuery(valorQuery, elementoHTML) {
    const elementoCopia = elementoHTML.cloneNode(true)
    const newValue =
      valorQuery !== '' &&
      valorQuery !== ' ' &&
      valorQuery !== null &&
      valorQuery !== undefined
        ? valorQuery
        : ''
    elementoCopia.value = newValue
    elementoHTML.parentNode.replaceChild(elementoCopia, elementoHTML)
  }

  static generateInputTextQuery(valorQuery, elementoHTML) {
    const elementoCopia = elementoHTML.cloneNode(true)
    const newValue =
      valorQuery !== '' &&
      valorQuery !== ' ' &&
      valorQuery !== null &&
      valorQuery !== undefined
        ? valorQuery
        : ''
    elementoCopia.value = newValue
    elementoHTML.parentNode.replaceChild(elementoCopia, elementoHTML)
  }

  static generateInputTextAreaQuery(valorQuery, elementoHTML) {
    const elementoCopia = elementoHTML.cloneNode(true)
    const newValue =
      valorQuery !== '' &&
      valorQuery !== ' ' &&
      valorQuery !== null &&
      valorQuery !== undefined
        ? valorQuery
        : ''
    elementoCopia.value = newValue
    elementoHTML.parentNode.replaceChild(elementoCopia, elementoHTML)
  }

  static generateTextArea(valorPorDefecto) {
    const textArea = document.createElement('textarea')
    valorPorDefecto ? (textArea.value = valorPorDefecto) : null
    valorPorDefecto !== '' &&
    valorPorDefecto !== ' ' &&
    valorPorDefecto !== null &&
    valorPorDefecto !== undefined
      ? (textArea.value = valorPorDefecto)
      : null
    return textArea
  }

  static generateSelectDinamic(hijo, sqlHijo) {
    const selectDinamic = document.createElement('select')
    selectDinamic.setAttribute('selector', 'selectDinamic')
    selectDinamic.addEventListener('change', (event) => {
      eventSelect(event, hijo, sqlHijo)
    })
    return selectDinamic
  }

  static generateSelect(array, valorXDefecto) {
    const select = document.createElement('select')
    while (select.firstChild) {
      select.removeChild(select.firstChild)
    }
    const nuevoArray = [...array]
    nuevoArray.forEach((element, index) => {
      index === 1 ? select.setAttribute('selector', element[2]) : null
    })

    if (array.length > 0) {
      const emptyOption = document.createElement('option')
      emptyOption.value = ''
      emptyOption.text = ''
      select.appendChild(emptyOption)
      array.forEach(([value, text]) => {
        const option = document.createElement('option')
        option.value = value
        option.text = text
        select.appendChild(option)
      })

      if (valorXDefecto) {
        for (let i = 0; i < select.options.length; i++) {
          if (select.options[i].text === valorXDefecto) {
            select.selectedIndex = i
            break
          }
        }
      }
    }

    return select
  }

  static generateOptions(array, select) {
    while (select.firstChild) {
      select.removeChild(select.firstChild)
    }
    if (array.length > 0) {
      const emptyOption = document.createElement('option')
      emptyOption.value = ''
      emptyOption.text = ''
      select.appendChild(emptyOption)
      array.forEach((subarray) => {
        const [value, text] = subarray
        const option = document.createElement('option')
        option.value = value
        option.text = text
        select.appendChild(option)
      })
    }
  }

  static generateImg(src, alt, dim, extension, plant) {
    // console.log(src, alt, dim, extension)

    const dimensiones = dim
    const img = document.createElement('img')
    img.src = `${SERVER}/assets/img/planos/${plant}/${src}`
    img.alt = alt
    img.dataset.extension = extension
    img.classList.add('planos')

    // Verificar si las dimensiones están presentes y no vacías
    if (dimensiones && dimensiones.trim() !== '') {
      try {
        // Utilizar JSON.parse para convertir la cadena en un objeto
        const ajustada = dimensiones.replace(
          /(['"])?([a-zA-Z0-9_]+)(['"])?:/g,
          '"$2": '
        )
        const objeto = JSON.parse(ajustada)
        // Verificar si el objeto tiene propiedades width y height
        if (objeto.width && objeto.height) {
          // img.style.width = `${objeto.width}px`
          // img.style.height = `${objeto.height}px`
        } else {
          // eslint-disable-next-line no-console
          console.error(
            'Las dimensiones proporcionadas no son válidas. Se aplicarán dimensiones predeterminadas.'
          )
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(
          'Error al analizar las dimensiones como JSON. Se aplicarán dimensiones predeterminadas.'
        )
      }
    }

    return img
  }

  static generateInputButton(text, name, consulta, clase) {
    const div = document.createElement('div')
    div.setAttribute('class', 'button-cn')
    const inputText = document.createElement('input')
    inputText.setAttribute('type', 'text')
    div.appendChild(inputText)
    const button = document.createElement('button')
    button.textContent = text
    button.setAttribute('name', name)
    button.setAttribute('class', clase)
    // button.style.background = '#97B7E8';
    div.appendChild(button)
    button.addEventListener('click', (event) => {
      consultaCN(event, consulta)
    })
    return div
  }

  static generateUl() {
    const ul = document.createElement('ul')
    return ul
  }

  static generateButtonImage(text, ID) {
    const button = document.createElement('button')
    button.textContent = text
    // button.style.background = '#97B7E8';
    button.setAttribute('data-row', ID)
    button.setAttribute('class', 'transparent-button')
    button.addEventListener('click', () => {
      buttonImage(ID)
    })
    return button
  }

  static generateButtonQuery(text, name, consulta, clase) {
    const button = document.createElement('button')
    button.textContent = text
    button.setAttribute('name', name)
    // button.style.background = '#97B7E8';
    button.setAttribute('class', clase)
    button.addEventListener('click', (event) => {
      consultaQuery(event, consulta)
    })
    return button
  }

  static generateSelectedRadioButton(checked, name) {
    const radioButton = document.createElement('input')
    radioButton.setAttribute('type', 'radio')
    radioButton.checked = checked
    name !== '0' ? (radioButton.name = name) : null
    return radioButton
  }
}

// Exporta la clase para que pueda ser utilizada desde otros archivos
export default ElementGenerator
