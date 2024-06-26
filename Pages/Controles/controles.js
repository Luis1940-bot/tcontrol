// eslint-disable-next-line no-unused-vars, import/extensions
import readJSON from '../../controllers/read-JSON.js'
// eslint-disable-next-line import/extensions
import createButton from '../../includes/atoms/createButton.js'
// eslint-disable-next-line import/extensions
import createImg from '../../includes/atoms/createImg.js'
// eslint-disable-next-line import/extensions, import/no-named-as-default
import translate, {
  // eslint-disable-next-line no-unused-vars
  arrayTranslateOperativo,
  // eslint-disable-next-line no-unused-vars
  arrayEspanolOperativo,
  // eslint-disable-next-line no-unused-vars
  arrayTranslateArchivo,
  // eslint-disable-next-line no-unused-vars
  arrayEspanolArchivo,
  // eslint-disable-next-line import/extensions
} from '../../controllers/translate.js'
// eslint-disable-next-line import/extensions
import personModal from '../../controllers/person.js'
// eslint-disable-next-line import/extensions
import {
  inicioPerformance,
  finPerformance,
} from '../../includes/Conection/conection.js'
// eslint-disable-next-line import/extensions, import/no-useless-path-segments
import { desencriptar, encriptar } from '../../controllers/cript.js'
// eslint-disable-next-line import/extensions
import cargaTabla from './controlViews.js'
// eslint-disable-next-line import/extensions
import traerRegistros from './Modules/Controladores/traerRegistros.js'
// eslint-disable-next-line import/extensions
import { Alerta } from '../../includes/atoms/alerta.js'
// eslint-disable-next-line import/extensions
import arrayGlobal from '../../controllers/variables.js'

import baseUrl from '../../config.js'
// const SERVER = '/iControl-Vanilla/icontrol';
const SERVER = baseUrl

let translateOperativo = []
let espanolOperativo = []
let translateArchivos = []
let espanolArchivos = []
const objTranslate = {
  operativoES: [],
  operativoTR: [],
  archivosES: [],
  archivosTR: [],
}

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

function trO(palabra) {
  if (palabra === undefined || palabra === null) {
    return ''
  }
  const palabraNormalizada = palabra.replace(/\s/g, '').toLowerCase()
  const index = espanolOperativo.findIndex(
    (item) =>
      item.replace(/\s/g, '').toLowerCase().trim() === palabraNormalizada.trim()
  )
  if (index !== -1) {
    return translateOperativo[index]
  }
  return palabra
}

function leeApp(json) {
  readJSON(json)
    .then((data) => {
      Object.assign(objButtons, data)
      const search = document.getElementById('search')
      search.placeholder = trO('Buscar...' || 'Buscar...')
      search.style.display = 'inline'
      const doc = document.getElementById('doc')
      doc.placeholder = trO('Doc' || 'Doc')
      const divUbicacionDoc = document.querySelector('.div-ubicacionDoc')
      divUbicacionDoc.style.display = 'block'
      const planta = objButtons.planta
      document.getElementById('spanUbicacion').textContent = planta
      const divButtons = document.querySelector('.div-controles-buttons')
      divButtons.style.display = 'none'

      cargaTabla(objTranslate)
      // navegador.estadoAnteriorButton = 'Menu'
      // navegador.estadoAnteriorWhereUs.push('Controles')
      // completaButtons('Controles')
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error al cargar el archivo:', error)
    })
}

function dondeEstaEn() {
  // const ustedEstaEn = `${trO('Usted está en')} ` || 'Usted está en ';
  // document.getElementById('whereUs').innerText = ustedEstaEn;
  let lugar = trO('Menú') || 'Menú'
  lugar = `${trO('Controles') || 'Controles'}`
  lugar = `<img src='${SERVER}/assets/img/icons8-brick-wall-50.png' height='10px' width='10px'> ${lugar}`
  document.getElementById('whereUs').innerHTML = lugar
  document.getElementById('whereUs').style.display = 'inline'
}

function configPHP(user) {
  const divVolver = document.querySelector('.div-volver')
  divVolver.style.display = 'block'
  document.getElementById('volver').style.display = 'block'
  const { developer, content, by, rutaDeveloper, logo } = user
  const metaDescription = document.querySelector('meta[name="description"]')
  metaDescription.setAttribute('content', content)
  const faviconLink = document.querySelector('link[rel="shortcut icon"]')
  faviconLink.href = `${SERVER}/assets/img/favicon.ico`
  document.title = developer
  const logoi = document.getElementById('logo_factum')
  const srcValue = `${SERVER}/assets/img/${logo}.png`
  const altValue = 'Tenki Web'
  logoi.src = srcValue
  logoi.alt = altValue
  logoi.width = 100
  logoi.height = 40
  const footer = document.getElementById('footer')
  footer.innerText = by
  footer.href = rutaDeveloper
  document.querySelector('.header-McCain').style.display = 'none'
  document.querySelector('.div-encabezado').style.marginTop = '5px'
  // const linkInstitucional = document.getElementById('linkInstitucional');
  // linkInstitucional.href = 'https://www.factumconsultora.com';
}

document.addEventListener('DOMContentLoaded', async () => {
  const user = desencriptar(sessionStorage.getItem('user'))
  const { plant } = user
  inicioPerformance()
  configPHP(user)
  spinner.style.visibility = 'visible'
  const hamburguesa = document.querySelector('#hamburguesa')
  hamburguesa.style.display = 'none'
  const persona = desencriptar(sessionStorage.getItem('user'))
  if (persona) {
    document.querySelector('.custom-button').innerText =
      persona.lng.toUpperCase()
    const data = await translate(persona.lng)
    translateOperativo = data.arrayTranslateOperativo
    espanolOperativo = data.arrayEspanolOperativo

    translateArchivos = data.arrayTranslateArchivo
    espanolArchivos = data.arrayEspanolArchivo

    objTranslate.operativoES = [...espanolOperativo]
    objTranslate.operativoTR = [...translateOperativo]

    objTranslate.archivosES = [...espanolArchivos]
    objTranslate.archivosTR = [...translateArchivos]

    leeVersion('version')
    setTimeout(() => {
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
      salir: trO('Cerrar sesión'),
    }
    personModal(user, objTranslate)
  })
})

function segundaCargaListado() {
  try {
    const button = document.getElementsByName('Controles')
    let lugar = document.getElementById('whereUs').innerText
    const newLugar = trO(button.name || 'Controles')
    lugar = `${lugar} > ${newLugar}`
    const search = document.getElementById('search')
    const placeholder = trO('Buscar...' || 'Buscar...')
    search.placeholder = placeholder
    search.style.display = 'inline'
    const doc = document.getElementById('doc')
    doc.placeholder = trO('Doc' || 'Doc')
    const divUbicacionDoc = document.querySelector('.div-ubicacionDoc')
    divUbicacionDoc.style.display = 'block'
    const divButtons = document.querySelector('.div-controles-buttons')
    divButtons.style.display = 'none'
    document.getElementById('whereUs').innerHTML = lugar
    cargaTabla(objTranslate)
  } catch (error) {
    console.log(error)
  }
}

const buscaDoc = document.getElementById('imgDoc')
buscaDoc.addEventListener('click', async () => {
  let documento = document.getElementById('doc').value
  if (!isNaN(documento)) {
    const array = await traerRegistros(
      `verificarControl,${documento.trim()}`,
      null
    )
    if (array.length > 0) {
      let contenido = {
        control_N: array[0][0],
        control_T: array[0][1],
        nr: documento.trim(),
      }
      contenido = encriptar(contenido)
      sessionStorage.setItem('contenido', contenido)
      // const url = '../Control/index.php'
      let timestamp = new Date().getTime()
      const url = `${SERVER}/Pages/Router/rutas.php?ruta=control&v=${timestamp}`
      // console.log(url)
      window.location.href = url
      // window.open(url, '_blank')
    } else {
      const miAlerta = new Alerta()
      const aviso = `No se encontraron registros con el documento`
      const mensaje = trO(aviso) || aviso
      arrayGlobal.avisoRojo.div.top = '500px'
      arrayGlobal.avisoRojo.close.id = 'idCloseAvisoAmarillo'
      miAlerta.createVerde(
        arrayGlobal.avisoRojo,
        `${mensaje} ${documento}.`,
        objTranslate
      )
      const modal = document.getElementById('modalAlertVerde')
      modal.style.display = 'block'
    }
  } else {
    const miAlerta = new Alerta()
    const aviso = 'Error. El código del documento debe ser un número.'
    const mensaje = trO(aviso) || aviso
    arrayGlobal.avisoRojo.div.top = '500px'
    arrayGlobal.avisoRojo.close.id = 'idCloseAvisoAmarillo'
    miAlerta.createVerde(arrayGlobal.avisoRojo, mensaje, objTranslate)
    const modal = document.getElementById('modalAlertVerde')
    modal.style.display = 'block'
    // console.log('El valor no es un número.')
  }
})

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const simulateAsignarEventos = urlParams.get('simulateAsignarEventos')
  if (simulateAsignarEventos === 'true') {
    const persona = desencriptar(sessionStorage.getItem('user'))
    if (persona) {
      document.querySelector('.custom-button').innerText =
        persona.lng.toUpperCase()
      const data = await translate(persona.lng)
      translateOperativo = data.arrayTranslateOperativo
      espanolOperativo = data.arrayEspanolOperativo

      translateArchivos = data.arrayTranslateArchivo
      espanolArchivos = data.arrayEspanolArchivo

      objTranslate.operativoES = [...espanolOperativo]
      objTranslate.operativoTR = [...translateOperativo]

      objTranslate.archivosES = [...espanolArchivos]
      objTranslate.archivosTR = [...translateArchivos]
      setTimeout(() => {
        // segundaCargaListado()
      }, 200)
    }
  }
})

const goLanding = document.querySelector('.custom-button')
goLanding.addEventListener('click', () => {
  const url = `${SERVER}/Pages/Landing`
  window.location.href = url
})

const volver = document.getElementById('volver')
volver.addEventListener('click', () => {
  const url = `${SERVER}/Pages/Menu`
  window.location.href = url
})
