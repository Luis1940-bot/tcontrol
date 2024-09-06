// eslint-disable-next-line no-unused-vars, import/extensions
import readJSON from '../../controllers/read-JSON.js'
// eslint-disable-next-line import/extensions, import/no-named-as-default
import translate, {
  // eslint-disable-next-line no-unused-vars
  arrayTranslateOperativo,
  // eslint-disable-next-line no-unused-vars
  arrayEspanolOperativo,
  // eslint-disable-next-line import/extensions
} from '../../controllers/arraysLoadTranslate.js'
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
// import callProcedure from '../ConsultasViews/Controladores/callProcedure.js'
// eslint-disable-next-line import/extensions
import { Alerta } from '../../includes/atoms/alerta.js'
// eslint-disable-next-line import/extensions
import arrayGlobal from '../../controllers/variables.js'
// eslint-disable-next-line import/extensions
import menuModalConsultasView from '../../controllers/menuConsultasView.js'

import baseUrl from '../../config.js'
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

const goLanding = document.querySelector('.custom-button')
goLanding.addEventListener('click', () => {
  const url = `${SERVER}/Pages/Landing`
  window.location.href = url
})

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
  const palabraNormalizada = palabra.replace(/\s/g, '').toLowerCase()
  const index = espanolOperativo.findIndex(
    (item) => item.replace(/\s/g, '').toLowerCase() === palabraNormalizada
  )
  if (index !== -1) {
    return translateOperativo[index]
  }
  return palabra
}

async function mensajeDeCarga(objTranslate, procedure, plant) {
  const miAlerta = new Alerta()
  const aviso =
    'Se está realizando la consulta, va a demorar unos segundos, esta puede ser muy compleja dependiendo de los archivos involucrados y el intervalo de tiempo solicitado. Asegure la conexión de internet.' //arrayGlobal.avisoListandoControles.span.text
  const mensaje = trO(aviso) || aviso
  // arrayGlobal.avisoListandoControles.div.height = '200px'
  // arrayGlobal.avisoListandoControles.div.top = '70px'
  miAlerta.createSinCalendar(
    arrayGlobal.avisoListandoControles,
    mensaje,
    objTranslate,
    procedure,
    plant
  )
  const modal = document.getElementById('modalAlertCarga')
  modal.style.display = 'block'
}

function abrirCalendar(objTrad, procedure, plant) {
  const miAlerta = new Alerta()
  arrayGlobal.porFechaEnModal.titulo.text.text = procedure.name
  miAlerta.createCalendar(
    arrayGlobal.porFechaEnModal,
    objTrad,
    procedure,
    plant
  )
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
  const contenido = sessionStorage.getItem('procedure')
  const url = desencriptar(contenido)
  const name = url.name
  document.getElementById('whereUs').innerHTML = name
  document.getElementById('whereUs').style.display = 'inline'
  document.getElementById('volver').style.display = 'block'
}

function configPHP(user) {
  // const user = desencriptar(sessionStorage.getItem('user'))
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

function verificaTipoDeConsulta(objTranslate, plant) {
  try {
    const procedure = desencriptar(sessionStorage.getItem('procedure'))
    // console.log(procedure)
    if (procedure.confecha === '1') {
      abrirCalendar(objTranslate, procedure, plant)
    }
    if (procedure.confecha === '0') {
      mensajeDeCarga(objTranslate, procedure, plant)
    }
  } catch (error) {
    console.log(error)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const hamburguesa = document.getElementById('hamburguesa')
  hamburguesa.addEventListener('click', () => {
    menuModalConsultasView(objTranslate)
  })
})

// document.addEventListener('DOMContentLoaded', async () => {
//   const user = desencriptar(sessionStorage.getItem('user'))
//   const { plant } = user
//   inicioPerformance()
//   configPHP(user)
//   spinner.style.visibility = 'visible'
//   const hamburguesa = document.querySelector('#hamburguesa')
//   // hamburguesa.style.display = 'none'
//   const persona = desencriptar(sessionStorage.getItem('user'))
//   if (persona) {
//     document.querySelector('.custom-button').innerText =
//       persona.lng.toUpperCase()
//     const data = await translate(persona.lng)
//     translateOperativo = data.arrayTranslateOperativo
//     espanolOperativo = data.arrayEspanolOperativo
//     translateArchivos = data.arrayTranslateArchivo
//     espanolArchivos = data.arrayEspanolArchivo
//     objTranslate.operativoES = [...espanolOperativo]
//     objTranslate.operativoTR = [...translateOperativo]
//     objTranslate.archivosES = [...espanolArchivos]
//     objTranslate.archivosTR = [...translateArchivos]
//     leeVersion('version')
//     setTimeout(() => {
//       dondeEstaEn()
//       leeApp(`App/${plant}/app`, false)
//       verificaTipoDeConsulta(objTranslate, plant)
//     }, 200)
//   }
//   spinner.style.visibility = 'hidden'
//   finPerformance()
// })

document.addEventListener('DOMContentLoaded', async () => {
  const spinner = document.querySelector('#spinner') // Asegúrate de que el elemento spinner esté disponible
  spinner.style.visibility = 'visible'

  const user = desencriptar(sessionStorage.getItem('user'))
  const { plant } = user

  inicioPerformance()
  configPHP(user)

  async function inicializar() {
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

      const version = await leeVersion('version')
      document.querySelector('.version').innerText = version

      dondeEstaEn()
      leeApp(`App/${plant}/app`, false)
      verificaTipoDeConsulta(objTranslate, plant)

      spinner.style.visibility = 'hidden'
      finPerformance()
    }
  }

  function verificarElementos() {
    const customButton = document.querySelector('.custom-button')
    const spinner = document.querySelector('#spinner')

    if (customButton && spinner) {
      inicializar()
    } else {
      requestAnimationFrame(verificarElementos) // Continúa intentando hasta que los elementos estén presentes
    }
  }

  requestAnimationFrame(verificarElementos) // Inicia la verificación de los elementos
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

function goBack() {
  const url = `${SERVER}/Pages/Consultas/index.php`
  window.location.href = url
}

const volver = document.getElementById('volver')
volver.addEventListener('click', () => {
  goBack()
})
