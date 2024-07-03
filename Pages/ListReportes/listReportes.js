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
import cargaTabla from './reportesViews.js'
// eslint-disable-next-line import/extensions
import arrayGlobal from '../../controllers/variables.js'
// eslint-disable-next-line import/extensions
import tablaVacia from './Modules/armadoDeTabla.js'
import baseUrl from '../../config.js'
import { Alerta } from '../../includes/atoms/alerta.js'
import { configPHP } from '../../controllers/configPHP.js'
import { trO } from '../../controllers/trOA.js'
import { arraysLoadTranslate } from '../../controllers/arraysLoadTranslate.js'

const SERVER = baseUrl
let objTranslate = []

const spinner = document.querySelector('.spinner')
const objButtons = {}
const navegador = {
  estadoAnteriorButton: '',
  estadoAnteriorWhereUs: [],
}

const encabezados = {
  title: ['reportes'],
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

function leeApp(json) {
  readJSON(json)
    .then((data) => {
      Object.assign(objButtons, data)
      const search = document.getElementById('search')
      search.placeholder = trO('Buscar...', objTranslate) || 'Buscar...'
      search.style.display = 'inline'

      const planta = objButtons.planta
      document.getElementById('spanUbicacion').textContent = planta
      const divButtons = document.querySelector('.div-reportes-buttons')
      divButtons.style.display = 'none'

      cargaTabla(objTranslate)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error al cargar el archivo:', error)
    })
}

function dondeEstaEn() {
  let lugar = trO('Admin', objTranslate) || 'Admin'
  lugar = `${trO('Reportes', objTranslate) || 'Reportes'}`
  lugar = `<img src='${SERVER}/assets/img/icons8-brick-wall-50.png' height='10px' width='10px'> ${lugar}`
  document.getElementById('whereUs').innerHTML = lugar
  document.getElementById('whereUs').style.display = 'inline'
}

function cambiaColorPastillas(button) {
  const pastillas = document.querySelectorAll('.pastilla')
  pastillas.forEach((pastilla) => {
    pastilla.style.color = '#393939'
    pastilla.style.background = '#d9d9d9'
  })
  button.target.style.color = '#cecece'
  button.target.style.background = '#212121'
}

function verTodos(e) {
  cambiaColorPastillas(e)
  const tabla = document.getElementById('tableControlViews')
  const thead = tabla.querySelector('thead')
  const tbody = tabla.querySelector('tbody')
  thead.innerHTML = ''
  tbody.innerHTML = ''
  tablaVacia(arrayGlobal.arrayReportes, encabezados, objTranslate)
}
function verActivos(e) {
  cambiaColorPastillas(e)
  const tabla = document.getElementById('tableControlViews')
  const thead = tabla.querySelector('thead')
  const tbody = tabla.querySelector('tbody')
  thead.innerHTML = ''
  tbody.innerHTML = ''
  const filteredArray = arrayGlobal.arrayReportes.filter(
    (subArray) => subArray[20] === 's'
  )
  tablaVacia(filteredArray, encabezados, objTranslate)
}
function verApagados(e) {
  cambiaColorPastillas(e)
  const tabla = document.getElementById('tableControlViews')
  const thead = tabla.querySelector('thead')
  const tbody = tabla.querySelector('tbody')
  thead.innerHTML = ''
  tbody.innerHTML = ''
  const filteredArray = arrayGlobal.arrayReportes.filter(
    (subArray) => subArray[20] === 'n'
  )
  tablaVacia(filteredArray, encabezados, objTranslate)
}

function cargaPastillas(pastillas) {
  try {
    const divPastillas = document.querySelector('.div-pastillas')
    for (let i = 0; i < pastillas.clase.length; i++) {
      let button = document.createElement('button')
      button.setAttribute('class', pastillas.clase[i])
      button.textContent =
        trO(pastillas.text[i], objTranslate) || pastillas.text[i]
      button.style.color = pastillas.color[i]
      button.style.background = pastillas.background[i]
      button.onclick = pastillas.funcion[i]
      divPastillas.appendChild(button)
    }
  } catch (error) {
    console.log(error)
  }
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
  const pastillas = {
    clase: ['pastilla', 'pastilla', 'pastilla'],
    text: ['Todos', 'Activos', 'Apagados'],
    funcion: [verTodos, verActivos, verApagados],
    color: ['#cecece', '#393939', '#393939'],
    background: ['#212121', '#d9d9d9', '#d9d9d9'],
  }

  const persona = desencriptar(sessionStorage.getItem('user'))
  if (persona) {
    document.querySelector('.custom-button').innerText =
      persona.lng.toUpperCase()
    leeVersion('version')
    setTimeout(async () => {
      objTranslate = await arraysLoadTranslate()
      cargaPastillas(pastillas)
      dondeEstaEn()
      leeApp(`App/${plant}/app`)
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
    miAlertaM.createModalMenuReportes(arrayGlobal.objMenuRove, objTranslate)
    const modal = document.getElementById('modalAlertM')
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
