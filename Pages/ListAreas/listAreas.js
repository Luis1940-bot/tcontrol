// eslint-disable-next-line no-unused-vars, import/extensions
import readJSON from '../../controllers/read-JSON.js'

// eslint-disable-next-line import/extensions, import/no-named-as-default
import personModal from '../../controllers/person.js'
// eslint-disable-next-line import/extensions
import {
  inicioPerformance,
  finPerformance,
} from '../../includes/Conection/conection.js'
// eslint-disable-next-line import/extensions, import/no-useless-path-segments
import { desencriptar, encriptar } from '../../controllers/cript.js'
// eslint-disable-next-line import/extensions
import cargaTabla from './areasViews.js'
// eslint-disable-next-line import/extensions
import arrayGlobal from '../../controllers/variables.js'
// eslint-disable-next-line import/extensions
// import tablaVacia from './Modules/armadoDeTabla.js'
import baseUrl from '../../config.js'
import { Alerta } from '../../includes/atoms/alerta.js'
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

const encabezados = {
  title: ['áreas'],
  width: ['1'],
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

function leeApp(json, plant) {
  readJSON(json)
    .then((data) => {
      Object.assign(objButtons, data)
      const search = document.getElementById('search')
      search.placeholder = trO('Buscar...', objTranslate) || 'Buscar...'
      search.style.display = 'inline'

      const planta = objButtons.planta
      document.getElementById('spanUbicacion').textContent = planta

      cargaTabla(objTranslate, plant)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error al cargar el archivo:', error)
    })
}

function dondeEstaEn() {
  // const ustedEstaEn = `${trO('Usted está en')} ` || 'Usted está en ';
  // document.getElementById('whereUs').innerText = ustedEstaEn;

  let lugar = trO('Admin', objTranslate) || 'Admin'
  lugar = `${trO('Áreas', objTranslate) || 'Áreas'}`
  lugar = `<img src='${SERVER}/assets/img/icons8-brick-wall-50.png' height='10px' width='10px'> ${lugar}`
  document.getElementById('whereUs').innerHTML = lugar
  document.getElementById('whereUs').style.display = 'inline'
}

document.addEventListener('DOMContentLoaded', async () => {
  const user = desencriptar(sessionStorage.getItem('user'))
  const { plant } = user
  inicioPerformance()
  configPHP(user, SERVER)
  spinner.style.visibility = 'visible'
  const hamburguesa = document.querySelector('#hamburguesa')
  hamburguesa.style.display = 'block'
  const divVolver = document.querySelector('.div-volver')
  divVolver.style.display = 'block'
  document.getElementById('volver').style.display = 'block'
  document.querySelector('.header-McCain').style.display = 'none'
  document.querySelector('.div-encabezado').style.marginTop = '5px'
  document.querySelector('.div-encabezadoSearch').style.display = 'none'

  const persona = desencriptar(sessionStorage.getItem('user'))
  if (persona) {
    document.querySelector('.custom-button').innerText =
      persona.lng.toUpperCase()

    leeVersion('version')
    setTimeout(async () => {
      objTranslate = await arraysLoadTranslate()
      dondeEstaEn()
      leeApp(`App/${plant}/app`, plant)
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
    miAlertaM.createModalMenuArea(arrayGlobal.objMenuRove, objTranslate)
    const modal = document.getElementById('modalAlertM')
    document.getElementById('idDivNuevaArea').style.display = 'flex'
    modal.style.display = 'block'
  })
})

const goLanding = document.querySelector('.custom-button')
goLanding.addEventListener('click', () => {
  const url = `${SERVER}/Pages/Landing`
  window.location.href = url
})

const volver = document.getElementById('volver')
volver.addEventListener('click', () => {
  const url = `${SERVER}/Pages/Admin`
  window.location.href = url
})
