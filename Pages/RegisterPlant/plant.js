// eslint-disable-next-line no-unused-vars, import/extensions
import readJSON from '../../controllers/read-JSON.js'
// eslint-disable-next-line import/extensions
import {
  inicioPerformance,
  finPerformance,
} from '../../includes/Conection/conection.js'

const spinner = document.querySelector('.spinner')
const appJSON = {}
let objTranslate = []

import baseUrl from '../../config.js'
import leeVersion from '../../controllers/leeVersion.js'
import { trO } from '../../controllers/trOA.js'
import { arraysLoadTranslate } from '../../controllers/arraysLoadTranslate.js'
import { configPHP } from '../../controllers/configPHP.js'
import { dondeEstaEn } from '../../controllers/dondeEstaEn.js'
// import traerRegistros from './Controllers/traerRegistros.js'
import createA from '../../includes/atoms/createA.js'
import createButton from '../../includes/atoms/createButton.js'
import createDiv from '../../includes/atoms/createDiv.js'
import createLabel from '../../includes/atoms/createLabel.js'
import createInput from '../../includes/atoms/createInput.js'
import createSelect from '../../includes/atoms/createSelect.js'
import createTextArea from '../../includes/atoms/createTextArea.js'

const SERVER = baseUrl

function creador(element) {
  let elemento = null
  if (element.tag === 'label') {
    element.config.innerHTML =
      trO(element.config.innerHTML, objTranslate) || element.config.innerHTML
    elemento = createLabel(element.config)
  }
  if (element.tag === 'input') {
    elemento = createInput(element.config)
  }
  if (element.tag === 'a') {
    element.config.textContent =
      trO(element.config.textContent, objTranslate) ||
      element.config.textContent
    elemento = createA(element.config, element.config.textContent)
  }
  if (element.tag === 'select') {
    let array = []
    if (element.hasOwnProperty('options')) {
      if (element.options.length > 0) {
        array = [...element.options]
      }
    }
    elemento = createSelect(array, element.config)
  }
  if (element.tag === 'button') {
    element.config.text =
      trO(element.config.text, objTranslate) || element.config.text
    elemento = createButton(element.config)
  }
  if (element.tag === 'div') {
    elemento = createDiv(element.config)
  }
  if (element.tag === 'textarea') {
    elemento = createTextArea(element.config)
  }
  return elemento
}

function armadoDeHTML(json) {
  try {
    const div = document.querySelector('.div-plant')
    const elementos = json.elements
    elementos.forEach((element) => {
      const elementoCreado = creador(element)
      if (element.children) {
        const elementoChildren = element.children
        elementoChildren.forEach((e) => {
          const hijo = creador(e)
          hijo ? elementoCreado.appendChild(hijo) : null
        })
      }
      elementoCreado ? div.appendChild(elementoCreado) : null
    })
  } catch (error) {
    console.log(error)
  }
}

function leeModelo(ruta) {
  readJSON(ruta)
    .then((data) => {
      armadoDeHTML(data)
      traduccionDeLabel(objTranslate)
    })
    .catch((error) => {
      console.error('Error al cargar el archivo:', error)
    })
}

function traduccionDeLabel(objTranslate) {
  const div = document.querySelector('.div-plant')
  const labels = div.querySelectorAll('.label-plant')
  labels.forEach((element) => {
    const texto =
      trO(element.textContent.trim(), objTranslate) ||
      element.textContent.trim()
    element.innerText = texto
  })
}

function leeApp(json) {
  readJSON(json)
    .then((data) => {
      Object.assign(appJSON, data)
      configPHP(data, SERVER)
    })
    .catch((error) => {
      console.error('Error al cargar el archivo:', error)
    })
}

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('keydown', (e) => {
    if (e.target.matches('.input-plant, .textarea-plant')) {
      if (e.key === ',') {
        e.preventDefault()
      }
    }
  })
})

document.addEventListener('DOMContentLoaded', async () => {
  inicioPerformance()
  spinner.style.visibility = 'visible'

  const hamburguesa = document.querySelector('#hamburguesa')
  hamburguesa.style.display = 'none'

  const person = document.querySelector('#person')
  person.style.display = 'none'

  const version = await leeVersion('version')
  document.querySelector('.version').innerText = version

  setTimeout(async () => {
    objTranslate = await arraysLoadTranslate()
    leeApp(`log`)
    leeModelo('Register/registerPlant')
    const nuevaCadena = dondeEstaEn(objTranslate, 'Nueva compañía.')
  }, 200)

  spinner.style.visibility = 'hidden'

  finPerformance()
})
