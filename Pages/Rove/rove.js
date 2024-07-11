// eslint-disable-next-line no-unused-vars, import/extensions
import readJSON from '../../controllers/read-JSON.js'
// eslint-disable-next-line import/extensions
import personModal from '../../controllers/person.js'
// eslint-disable-next-line import/extensions
import {
  inicioPerformance,
  finPerformance,
} from '../../includes/Conection/conection.js'
// eslint-disable-next-line import/extensions, import/no-useless-path-segments
import { desencriptar } from '../../controllers/cript.js'
import { Alerta } from '../../includes/atoms/alerta.js'
// eslint-disable-next-line import/extensions
import arrayGlobal from '../../controllers/variables.js'
// eslint-disable-next-line import/extensions

import baseUrl from '../../config.js'
import { configPHP } from '../../controllers/configPHP.js'
import { arraysLoadTranslate } from '../../controllers/arraysLoadTranslate.js'
import { trO } from '../../controllers/trOA.js'
const SERVER = baseUrl
let objTranslate = []

const spinner = document.querySelector('.spinner')
const objButtons = {}
const navegador = {
  estadoAnteriorButton: '',
  estadoAnteriorWhereUs: [],
}

function leeVersion(json) {
  readJSON(json)
    .then((data) => {
      document.querySelector('.version').innerText = data.version
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error al cargar el archivo:', error)
    })
}

function abrirCalendar(objTrad, rove) {
  const miAlerta = new Alerta()
  arrayGlobal.porFechaEnModal.titulo.text.text = rove
  miAlerta.createCalendarROVE(arrayGlobal.porFechaEnModal, objTrad, rove)
  const modal2 = document.getElementById('modalTablaViewFecha')
  modal2.style.display = 'block'
}

function leeApp(json, complit) {
  readJSON(json)
    .then((data) => {
      Object.assign(objButtons, data)
      navegador.estadoAnteriorButton = 'Consultas'
      navegador.estadoAnteriorWhereUs.push('Consultas')
      document.getElementById('spanUbicacion').innerText = objButtons.planta
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error al cargar el archivo:', error)
    })
}

function dondeEstaEn() {
  const contenido = sessionStorage.getItem('rove')
  const url = desencriptar(contenido)
  const name = url.rove
  document.getElementById('whereUs').innerHTML = `ROVE: ${name.toUpperCase()}`
  document.getElementById('whereUs').style.display = 'inline'
}

function verificaTipoDeConsulta(objTranslate) {
  try {
    const { rove } = desencriptar(sessionStorage.getItem('rove'))
    abrirCalendar(objTranslate, rove)
  } catch (error) {
    console.log(error)
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const user = desencriptar(sessionStorage.getItem('user'))
  const { plant } = user
  inicioPerformance()
  configPHP(user, SERVER)
  document.querySelector('.header-McCain').style.display = 'none'
  document.querySelector('.div-encabezado').style.marginTop = '5px'
  spinner.style.visibility = 'visible'
  const hamburguesa = document.querySelector('#hamburguesa')
  // hamburguesa.style.display = 'none'
  const persona = desencriptar(sessionStorage.getItem('user'))
  if (persona) {
    document.querySelector('.custom-button').innerText =
      persona.lng.toUpperCase()
    leeVersion('version')
    setTimeout(async () => {
      objTranslate = await arraysLoadTranslate()
      dondeEstaEn(objTranslate)
      leeApp(`App/${plant}/app`, false)
      verificaTipoDeConsulta(objTranslate)
    }, 200)
  }
  spinner.style.visibility = 'hidden'
  finPerformance()
})

document.addEventListener('DOMContentLoaded', () => {
  const person = document.getElementById('person')
  person.addEventListener('click', () => {
    person.style.border = '3px solid #212121'
    person.style.background = '#212121'
    person.style.borderRadius = '10px 10px 0px 0px'
    const persona = desencriptar(sessionStorage.getItem('user'))
    const user = {
      person: persona.person,
      home: 'Inicio',
      salir: trO('Cerrar sesión', objTranslate),
    }
    personModal(user, objTranslate)
  })
})

document.addEventListener('DOMContentLoaded', () => {
  const hamburguesa = document.getElementById('hamburguesa')
  hamburguesa.addEventListener('click', () => {
    const miAlertaM = new Alerta()
    miAlertaM.createModalMenuRove(arrayGlobal.objMenuRove, objTranslate)
    const modal = document.getElementById('modalAlertM')
    // const closeButton = document.querySelector('.modal-close')
    // closeButton.addEventListener('click', closeModal)
    modal.style.display = 'block'
  })
})

const goLanding = document.querySelector('.custom-button')
goLanding.addEventListener('click', () => {
  const url = `${SERVER}/Pages/Landing`
  window.location.href = url
})
