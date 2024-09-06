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
// eslint-disable-next-line import/extensions
import cargaTabla from './controlViews.js'

import baseUrl from '../../config.js'
import { configPHP } from '../../controllers/configPHP.js'
import { arraysLoadTranslate } from '../../controllers/arraysLoadTranslate.js'
import { trO } from '../../controllers/trOA.js'
const SERVER = baseUrl

const objButtons = {}
let objTranslate = []
const spinner = document.querySelector('.spinner')

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

function leeApp(json) {
  readJSON(json)
    .then((data) => {
      Object.assign(objButtons, data)
      document.getElementById('spanUbicacion').innerText = objButtons.planta
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error al cargar el archivo:', error)
    })
}

function dondeEstaEn(objTrad) {
  let lugar = `${trO('Controles', objTrad) || 'Controles'}`
  lugar = `<img src='${SERVER}/assets/img/icons8-brick-wall-50.png' height='10px' width='10px'> ${lugar}`
  document.getElementById('whereUs').innerHTML = lugar
  document.getElementById('whereUs').style.display = 'inline'
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
  hamburguesa.style.display = 'none'

  const persona = desencriptar(sessionStorage.getItem('user'))
  if (persona) {
    document.querySelector('.custom-button').innerText =
      persona.lng.toUpperCase()

    leeVersion('version')

    // Reemplazar setTimeout con requestAnimationFrame
    requestAnimationFrame(async () => {
      objTranslate = await arraysLoadTranslate()
      dondeEstaEn(objTranslate)
      leeApp(`App/${plant}/app`)
      const control = desencriptar(sessionStorage.getItem('listadoCtrls'))
      cargaTabla(objTranslate, control, plant)
    })
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

const goLanding = document.querySelector('.custom-button')
goLanding.addEventListener('click', () => {
  const url = `${SERVER}/Pages/Landing`
  window.location.href = url
})
