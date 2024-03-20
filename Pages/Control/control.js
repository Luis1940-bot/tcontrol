// eslint-disable-next-line import/extensions
import traerRegistros from './Modules/Controladores/traerRegistros.js'
// eslint-disable-next-line import/extensions
import tablaVacia from './Modules/armadoDeTabla.js'
// eslint-disable-next-line import/extensions
import arrayGlobal from '../../controllers/variables.js'
// eslint-disable-next-line no-unused-vars, import/extensions
import readJSON from '../../controllers/read-JSON.js'
// eslint-disable-next-line import/extensions
import menuModal from '../../controllers/menu.js'
// eslint-disable-next-line import/extensions
import personModal from '../../controllers/person.js'
// eslint-disable-next-line import/extensions, import/no-named-as-default
import translate, {
  // eslint-disable-next-line no-unused-vars
  arrayTranslateOperativo,
  // eslint-disable-next-line no-unused-vars
  arrayEspanolOperativo,
  // eslint-disable-next-line import/extensions
} from '../../controllers/translate.js'
// eslint-disable-next-line import/extensions
import { Alerta } from '../../includes/atoms/alerta.js'
// eslint-disable-next-line import/extensions
import {
  inicioPerformance,
  finPerformance,
} from '../../includes/Conection/conection.js'
// eslint-disable-next-line import/extensions, import/no-useless-path-segments
import traerNR from '../Control/Modules/Controladores/traerNR.js'
// eslint-disable-next-line import/extensions, import/no-useless-path-segments
import cargarNR from '../Control/Modules/ControlNR/loadNR.js'
// eslint-disable-next-line import/extensions, import/no-useless-path-segments
import { encriptar, desencriptar } from '../../controllers/cript.js'

let data = {}
let translateOperativo = []
let espanolOperativo = []
const objTranslate = {
  operativoES: [],
  operativoTR: [],
}

let controlN = ''
let controlT = ''
let nr = 0
const spinner = document.querySelector('.spinner')
const encabezados = {
  title: [
    'id',
    'concepto',
    'relevamiento',
    'detalle',
    'observación',
    'idControl',
  ],
  width: ['.05', '.15', '.25', '.25', '.25', '0'],
}

function leeVersion(json) {
  readJSON(json)
    .then((datas) => {
      document.querySelector('.version').innerText = datas.version
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error al cargar el archivo:', error)
    })
}

function configPHP() {
  const user = desencriptar(sessionStorage.getItem('user'))
  const { developer, content, by, rutaDeveloper, logo } = user
  const metaDescription = document.querySelector('meta[name="description"]')
  metaDescription.setAttribute('content', content)
  const faviconLink = document.querySelector('link[rel="shortcut icon"]')
  faviconLink.href = './../../assets/img/favicon.ico'
  document.title = developer
  const logoi = document.getElementById('logo_factum')
  const srcValue = `./../../assets/img/${logo}.png`
  const altValue = 'Tenki Web'
  logoi.src = srcValue
  logoi.alt = altValue
  logoi.width = 100
  logoi.height = 40
  const footer = document.getElementById('footer')
  footer.innerText = by
  footer.href = rutaDeveloper
  // const linkInstitucional = document.getElementById('linkInstitucional');
  // linkInstitucional.href = 'https://www.factumconsultora.com';
}

function configuracionLoad() {
  inicioPerformance()
  const contenido = sessionStorage.getItem('contenido')
  const url = desencriptar(contenido)
  controlN = url.control_N
  controlT = url.control_T
  nr = url.nr
  nr === '0' ? (nr = '') : sessionStorage.setItem('doc', encriptar(nr))
  document.getElementById('doc').innerText = `Doc: ${nr}`
  document.getElementById('wichC').innerText = controlT

  configPHP()
  finPerformance()
}

function trO(palabra) {
  if (palabra === undefined || palabra === null) {
    return ''
  }
  const palabraNormalizada = palabra.replace(/\s/g, '').toLowerCase()
  const index = espanolOperativo.findIndex(
    (item) => item.replace(/\s/g, '').toLowerCase() === palabraNormalizada
  )
  if (index !== -1) {
    return translateOperativo[index]
  }
  return palabra
}

function actualizarProgreso(porcentaje) {
  return new Promise((resolve) => {
    const idSpanCarga = document.getElementById('idSpanCarga')
    const startTime = new Date().getTime()
    const duration = 1000 // Duración total en milisegundos (1 segundo)
    const startPercentage = parseFloat(idSpanCarga.innerText) || 0 // Obtener el porcentaje inicial

    function update() {
      const currentTime = new Date().getTime()
      const elapsedTime = currentTime - startTime

      // Calcular el porcentaje interpolado y convertir a cadena para eliminar decimales
      const interpolatedPercentage = Math.min(
        100,
        startPercentage + (elapsedTime / duration) * 10
      )
      const parteEntera = Math.floor(interpolatedPercentage)

      // Actualizar el elemento con el porcentaje interpolado
      idSpanCarga.innerText = `${parteEntera}%`

      if (elapsedTime < duration) {
        // Si no ha pasado el tiempo total, seguir actualizando
        requestAnimationFrame(update)
      } else {
        // Si ha pasado el tiempo total, establecer el porcentaje final y resolver la promesa
        idSpanCarga.innerText = porcentaje
        resolve()
      }
    }

    // Iniciar la actualización
    update()
  })
}

async function cargaDeRegistros() {
  try {
    inicioPerformance()
    await actualizarProgreso('10%')
    const countSelect = await traerRegistros(`countSelect,${controlN}`)
    sessionStorage.setItem('loadSystem', 2)
    sessionStorage.setItem('cantidadProcesos', Number(countSelect[0][0]) + 4)

    await actualizarProgreso('20%')
    const empresaData = await traerRegistros('empresa')
    arrayGlobal.arrayEmpresa = [...empresaData]

    await actualizarProgreso('30%')
    const selectoresData = await traerRegistros(`Selectores,${controlN}`)
    arrayGlobal.arraySelect = [...selectoresData]

    await actualizarProgreso('40%')
    const nuevoControlData = await traerRegistros(`NuevoControl,${controlN}`)
    arrayGlobal.arrayControl = [...nuevoControlData]

    // Finaliza la carga y realiza cualquier otra acción necesaria
    tablaVacia(nuevoControlData, encabezados)
    finPerformance()
    // Ajustar el porcentaje a 100%

    if (nr) {
      // console.log(nr)
      const controlNr = await traerNR(nr)
      setTimeout(() => {
        cargarNR(controlNr)
        // eslint-disable-next-line no-console
        // console.log(cargaNR);
      }, 1000)
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error)
    // eslint-disable-next-line no-console
    console.log('error por espera de la carga de un modal')
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }
}

async function mensajeDeCarga() {
  const miAlerta = new Alerta()
  const mensaje = trO(arrayGlobal.avisoCargandoControl.span.text)
  miAlerta.createControl(
    arrayGlobal.avisoCargandoControl,
    mensaje,
    objTranslate
  )
  const modal = document.getElementById('modalAlertCarga')
  modal.style.display = 'block'
  sessionStorage.setItem('loadSystem', 1)

  // Agrega un retraso antes de iniciar la carga de registros
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((resolve) => setTimeout(() => resolve(), 200))

  await cargaDeRegistros()
}

async function arraysLoadTranslate() {
  const persona = desencriptar(sessionStorage.getItem('user'))
  if (persona) {
    data = await translate(persona.lng)
    translateOperativo = data.arrayTranslateOperativo
    espanolOperativo = data.arrayEspanolOperativo
    mensajeDeCarga()
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  spinner.style.visibility = 'visible'
  // eslint-disable-next-line no-console
  console.time('timeControl')
  arrayGlobal.habilitadoGuardar = false
  sessionStorage.setItem('firma', encriptar('x'))
  sessionStorage.setItem('config_menu', encriptar('x'))
  sessionStorage.setItem('envia_por_email', false)
  sessionStorage.setItem('doc', null)
  const supervisor = {
    id: 0,
    mail: '',
    mi_cfg: '',
    nombre: '',
    tipo: 0,
  }
  sessionStorage.setItem('firmado', encriptar(supervisor))
  try {
    const persona = desencriptar(sessionStorage.getItem('user'))
    if (persona) {
      document.querySelector('.custom-button').innerText =
        persona.lng.toUpperCase()
      leeVersion('version')
      const datas = await translate(persona.lng)
      translateOperativo = datas.arrayTranslateOperativo
      espanolOperativo = datas.arrayEspanolOperativo
      objTranslate.operativoES = [...espanolOperativo]
      objTranslate.operativoTR = [...translateOperativo]

      setTimeout(() => {
        configuracionLoad()
        arraysLoadTranslate()
        spinner.style.visibility = 'hidden'
        // eslint-disable-next-line no-console
        console.timeEnd('timeControl')
      }, 300)
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error)
    spinner.style.visibility = 'hidden'
  }
})

document.addEventListener('DOMContentLoaded', () => {
  const hamburguesa = document.getElementById('hamburguesa')
  hamburguesa.addEventListener('click', () => {
    menuModal(objTranslate)
  })
})

document.addEventListener('DOMContentLoaded', () => {
  const person = document.getElementById('person')
  person.addEventListener('click', () => {
    const persona = desencriptar(sessionStorage.getItem('user'))
    const user = {
      person: persona.person,
      home: 'Inicio',
      salir: 'Cerrar sesión',
    }
    personModal(user, objTranslate)
  })
})

document.addEventListener('DOMContentLoaded', () => {
  const tableControl = document.getElementById('tableControl')
  tableControl.addEventListener('change', () => {
    arrayGlobal.habilitadoGuardar = true
  })
})

const goLanding = document.querySelector('.custom-button')
goLanding.addEventListener('click', () => {
  const url = '../Landing'
  window.location.href = url
})
