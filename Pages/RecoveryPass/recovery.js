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
import createA from '../../includes/atoms/createA.js'
import createButton from '../../includes/atoms/createButton.js'
import createDiv from '../../includes/atoms/createDiv.js'
import createLabel from '../../includes/atoms/createLabel.js'
import createInput from '../../includes/atoms/createInput.js'
import createSelect from '../../includes/atoms/createSelect.js'
import createSpan from '../../includes/atoms/createSpan.js'
import arrayGlobal from '../../controllers/variables.js'
import { Alerta } from '../../includes/atoms/alerta.js'
import { desencriptar } from '../../controllers/cript.js'
import traerRegistros from './Controllers/traerRegistros.js'
import enviaMailNuevoCliente from '../../Nodemailer/sendNuevoCliente.js'

const SERVER = baseUrl

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
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
  if (element.tag === 'span') {
    element.config.text =
      trO(element.config.text, objTranslate) || element.config.text
    elemento = createSpan(element.config)
  }
  return elemento
}

function checaRequeridos() {
  const email1 = document.getElementById('email1')
  email1.classList.remove('input-register-requerido')
  email1.classList.add('input-register')
  if (email1.value === '') {
    email1.classList.remove('input-register')
    email1.classList.add('input-register-requerido')
    return false
  }

  const email2 = document.getElementById('email2')
  email2.classList.remove('input-register-requerido')
  email2.classList.add('input-register')
  if (email2.value === '') {
    email2.classList.remove('input-register')
    email2.classList.add('input-register-requerido')
    return false
  }

  if (!validarEmail(email1.value)) {
    email1.classList.remove('input-register')
    email1.classList.add('input-register-requerido')
    return false
  }

  if (!validarEmail(email2.value)) {
    email2.classList.remove('input-register')
    email2.classList.add('input-register-requerido')
    return false
  }

  const pass1 = document.getElementById('pass1')
  pass1.classList.remove('input-register-requerido')
  pass1.classList.add('input-register')
  if (pass1.value === '') {
    pass1.classList.remove('input-register')
    pass1.classList.add('input-register-requerido')
    return false
  }

  const pass2 = document.getElementById('pass2')
  pass2.classList.remove('input-register-requerido')
  pass2.classList.add('input-register')
  if (pass2.value === '') {
    pass2.classList.remove('input-register')
    pass2.classList.add('input-register-requerido')
    return false
  }

  const objeto = {
    email1: email1.value,
    email2: email2.value,
    pass1: pass1.value,
    pass2: pass2.value,
  }
  return { add: true, objeto }
}

function checaEmails(emails) {
  if (emails.email1 !== emails.email2) {
    return false
  }
  return true
}

function checaPass(pass) {
  if (pass.pass1 !== pass.pass2) {
    return false
  }
  return true
}

async function envioEmailPlanta() {
  let envia = checaRequeridos()
  if (envia.add) {
    let mailsIguales = checaEmails(envia.objeto)
    let passIguales = checaPass(envia.objeto)

    if (mailsIguales && passIguales) {
      const plant = desencriptar(sessionStorage.getItem('plant'))
      const response = await traerRegistros(
        envia.objeto,
        '/confirmaEmail',
        parseInt(plant.value)
      )

      if (response.success) {
        //enviar email para cambiar la contraseña
        const objetoEmail = {
          cliente: plant.texto,
          usuario: response.nombre,
          idusuario: response.id,
          email: response.email,
          v: response.v,
          subject: 'Blanqueo',
          mensaje: 'Se modificó la contraseña:',
        }
        const miAlerta = new Alerta()
        const obj = arrayGlobal.avisoAmarillo
        obj.close.display = 'none'
        const texto =
          trO('Aguarde un instante luego será redirigido.', objTranslate) ||
          'Aguarde un instante luego será redirigido.'
        miAlerta.createVerde(obj, texto, objTranslate)
        const modal = document.getElementById('modalAlertVerde')
        modal.style.display = 'block'
        const mailEnviado = await enviaMailNuevoCliente(
          objetoEmail,
          '/sendNuevoUsuario'
        )
        if (mailEnviado.success) {
          modal.style.display = 'none'
          modal.remove()
          const url = `${SERVER}/Pages/Login`
          window.location.href = url
        }
      } else {
        // no se encontró el usuario o pasó algo
        const miAlerta = new Alerta()
        const obj = arrayGlobal.avisoRojo
        const texto =
          trO('No se encontró el usuario.', objTranslate) ||
          'No se encontró el usuario.'
        miAlerta.createVerde(obj, texto, objTranslate)
        const modal = document.getElementById('modalAlertVerde')
        modal.style.display = 'block'
      }
    } else {
      //hay diferencias en los emails
      const miAlerta = new Alerta()
      const obj = arrayGlobal.avisoRojo
      let texto =
        trO('Hay diferencias entre los campos escritos.', objTranslate) ||
        'Hay diferencias entres los campos escritos.'
      if (mailsIguales === true && passIguales === false) {
        texto =
          trO(
            'Hay diferencias entre las contraseñas escritas.',
            objTranslate
          ) || 'Hay diferencias entre las contraseñas escritas.'
      }
      if (passIguales === true && mailsIguales === false) {
        texto =
          trO('Hay diferencias entre los emails escritos.', objTranslate) ||
          'Hay diferencias entre los emails escritos.'
      }

      miAlerta.createVerde(obj, texto, objTranslate)
      const modal = document.getElementById('modalAlertVerde')
      modal.style.display = 'block'
    }
  } else {
    //falta completar algo
    const miAlerta = new Alerta()
    const obj = arrayGlobal.avisoRojo
    const texto =
      trO('Falta completar algún campos.', objTranslate) ||
      'Falta completar algún campos.'
    miAlerta.createVerde(obj, texto, objTranslate)
    const modal = document.getElementById('modalAlertVerde')
    modal.style.display = 'block'
  }
}

function armadoDeHTML(json) {
  try {
    const div = document.querySelector('.div-recovery')
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
    const button = document.getElementById('idButtonRecoveryUser')
    button.addEventListener('click', (e) => {
      const clase = e.target.className
      if (clase === 'button-recovery') {
        envioEmailPlanta()
      }
      if (clase === 'button-recovery-update') {
      }
    })
  } catch (error) {
    console.log(error)
  }
}

function traduccionDeLabel(objTranslate) {
  const div = document.querySelector('.div-recovery')
  const labels = div.querySelectorAll('.label-recovery')
  labels.forEach((element) => {
    const texto =
      trO(element.textContent.trim(), objTranslate) ||
      element.textContent.trim()
    element.innerText = texto
  })
  const button = document.querySelector('.button-recovery')
  const texto =
    trO(button.textContent.trim(), objTranslate) || button.textContent.trim()
  button.innerText = texto
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
    if (e.target.matches('.input-recovery')) {
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
    leeModelo('Recovery/recoveryPass')
    const nuevaCadena = dondeEstaEn(objTranslate, 'Blanqueo de contraseña.')
    const spanUbicacion = document.getElementById('spanUbicacion')
    const plant = desencriptar(sessionStorage.getItem('plant'))
    spanUbicacion.innerText = plant.texto
    const volver = document.getElementById('volver')
    volver.style.display = 'block'
  }, 200)

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
