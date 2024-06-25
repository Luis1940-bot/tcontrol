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
import createSpan from '../../includes/atoms/createSpan.js'
import addCompania from './Controllers/nuevaCompania.js'
import { desencriptar } from '../../controllers/cript.js'
import enviaMailNuevoCliente from '../../Nodemailer/sendNuevoCliente.js'
import arrayGlobal from '../../controllers/variables.js'
import { Alerta } from '../../includes/atoms/alerta.js'

const SERVER = baseUrl

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

function checaRequeridos() {
  const cliente = document.getElementById('cliente')
  cliente.classList.remove('input-plant-requerido')
  cliente.classList.add('input-plant')
  if (cliente.value === '') {
    cliente.classList.remove('input-plant')
    cliente.classList.add('input-plant-requerido')
    return false
  }
  const contacto = document.getElementById('contacto')
  contacto.classList.remove('input-plant-requerido')
  contacto.classList.add('input-plant')
  if (contacto.value === '') {
    contacto.classList.remove('input-plant')
    contacto.classList.add('input-plant-requerido')
    return false
  }
  const email = document.getElementById('email')
  email.classList.remove('input-plant-requerido')
  email.classList.add('input-plant')
  if (email.value === '') {
    email.classList.remove('input-plant')
    email.classList.add('input-plant-requerido')
    return false
  }
  if (!validarEmail(email.value)) {
    email.classList.remove('input-plant')
    email.classList.add('input-plant-requerido')
    return false
  }
  const objeto = {
    cliente: cliente.value,
    detalle: '',
    contacto: contacto.value,
    email: email.value,
    activo: '',
  }
  return { add: true, objeto }
}

async function nuevaComapania() {
  let envia = checaRequeridos()

  if (envia.add) {
    const detalle = document.getElementById('detalle')
    envia.objeto.detalle = detalle.value
    envia.objeto.activo = 's'
    const response = await addCompania(envia.objeto, '/addCompania')
    if (response.success) {
      const newPlant = { name: envia.objeto.cliente, num: response.id }
      const json = await addCompania(newPlant, '/escribirJSON')
      const objetoEmail = {
        cliente: envia.objeto.cliente,
        contacto: envia.objeto.contacto,
        address: envia.objeto.email,
      }
      const miAlerta = new Alerta()
      const obj = arrayGlobal.avisoAmarillo
      const texto = 'Aguarde un instante luego será redirigido.'
      miAlerta.createVerde(obj, texto, objTranslate)
      const modal = document.getElementById('modalAlertVerde')
      modal.style.display = 'block'
      const mailEnviado = await enviaMailNuevoCliente(
        objetoEmail,
        '/sendNuevoCliente'
      )
      if (mailEnviado.success) {
        const id = document.getElementById('id')
        id.value = response.id
        modal.style.display = 'none'
        modal.remove()
        const url = `${SERVER}/Pages/Login`
        window.location.href = url
      }
    } else {
      const miAlerta = new Alerta()
      const obj = arrayGlobal.avisoRojo
      const texto = trO('Algo salió mal.', objTranslate) || 'Algo salió mal.'
      miAlerta.createVerde(obj, texto, objTranslate)
      const modal = document.getElementById('modalAlertVerde')
      modal.style.display = 'block'
    }
  }
}

function setearElementos() {
  const situacion = document.getElementById('situacion')
  situacion.options[1].selected = true
  situacion.setAttribute('disabled', true)

  const id = document.getElementById('id')
  id.setAttribute('disabled', true)

  const idRegisterButton = document.getElementById('idRegisterButton')
  idRegisterButton.addEventListener('click', (e) => {
    const clase = e.target.className
    if (clase === 'button-plant') {
      nuevaComapania()
    }
    if (clase === 'button-plant-update') {
    }
  })

  const cliente = document.getElementById('cliente')
  cliente.addEventListener('input', () => {
    if (cliente.value !== '') {
      cliente.classList.remove('input-plant-requerido')
      cliente.classList.add('input-plant')
    }
  })

  const contacto = document.getElementById('contacto')
  contacto.addEventListener('input', () => {
    if (contacto.value !== '') {
      contacto.classList.remove('input-plant-requerido')
      contacto.classList.add('input-plant')
    }
  })

  const email = document.getElementById('email')
  email.addEventListener('input', () => {
    if (email.value !== '') {
      email.classList.remove('input-plant-requerido')
      email.classList.add('input-plant')
    }
  })
}

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
  if (element.tag === 'span') {
    element.config.text =
      trO(element.config.text, objTranslate) || element.config.text
    elemento = createSpan(element.config)
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
      setearElementos()
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
    const divUbicacion = document.querySelector('.div-ubicacion')
    divUbicacion.style.display = 'none'
    const volver = document.getElementById('volver')
    volver.style.display = 'block'
  }, 200)

  spinner.style.visibility = 'hidden'

  finPerformance()
})

function goBack() {
  try {
    let back = sessionStorage.getItem('volver')
    if (back) {
      back = desencriptar(back)
    }
    const url = `${SERVER}/Pages/${back}`
    window.location.href = url
  } catch (error) {
    console.log(error)
  }
}

const volver = document.getElementById('volver')
volver.addEventListener('click', () => {
  goBack(null)
})
