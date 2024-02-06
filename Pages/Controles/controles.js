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

//! no se usan las funciones de asignarEventos y completarButtons porque quitamos un segundo menu intermedio
/* eslint-disable no-use-before-define */
function asignarEventos() {
  const buttons = document.querySelectorAll('.button-controles-menu')
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      let lugar = document.getElementById('whereUs').innerText
      const newLugar = trO(button.name || button.name)
      lugar = `${lugar} > ${newLugar}`
      const search = document.getElementById('search')
      search.placeholder = trO('Buscar...' || 'Buscar...')
      search.style.display = 'inline'
      const doc = document.getElementById('doc')
      doc.placeholder = trO('Doc' || 'Doc')
      const divUbicacionDoc = document.querySelector('.div-ubicacionDoc')
      divUbicacionDoc.style.display = 'block'
      const divButtons = document.querySelector('.div-controles-buttons')
      divButtons.style.display = 'none'
      document.getElementById('whereUs').innerHTML = lugar
      cargaTabla(objTranslate)
    })
  })
}

/* eslint-enable no-use-before-define */
function completaButtons(obj) {
  const divButtons = document.querySelector('.div-controles-buttons')
  divButtons.innerHTML = ''
  document.getElementById('spanUbicacion').innerText = objButtons.planta
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < objButtons[obj].name.length; i++) {
    const element = objButtons[obj].name[i]
    // const ruta = objButtons[obj].ruta[i];
    let params = {
      text: trO(element) || element,
      name: objButtons[obj].name[i],
      class: 'button-controles-menu',
      innerHTML: null,
      height: null, // 35
      width: null, // 75%
      borderRadius: '1px',
      border: null,
      textAlign: 'left',
      marginLeft: null,
      marginRight: null,
      marginTop: null,
      marginBotton: null,
      paddingLeft: null,
      paddingRight: null,
      paddingTop: null,
      paddingBotton: null,
      background: null,
    }
    const newButton = createButton(params)
    params = {
      class: 'img-selector-menu',
      name: null,
      float: 'right',
      src: '../../assets/img/icons8-arrow-30.png',
      alt: null,
      height: '20px',
      width: '20px',
      margin: 'auto 10px auto auto',
    }
    const newImg = createImg(params)
    newButton.appendChild(newImg)
    divButtons.appendChild(newButton)
  }
  asignarEventos()
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
  lugar = `<img src='../../assets/img/icons8-brick-wall-50.png' height='10px' width='10px'> ${lugar}`
  document.getElementById('whereUs').innerHTML = lugar
  document.getElementById('whereUs').style.display = 'inline'
}

function configPHP() {
  const user = desencriptar(localStorage.getItem('user'))
  const divVolver = document.querySelector('.div-volver')
  divVolver.style.display = 'none'
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

document.addEventListener('DOMContentLoaded', async () => {
  inicioPerformance()
  configPHP()
  spinner.style.visibility = 'visible'
  const hamburguesa = document.querySelector('#hamburguesa')
  hamburguesa.style.display = 'none'
  const persona = desencriptar(localStorage.getItem('user'))
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
      leeApp('app')
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
    const persona = desencriptar(localStorage.getItem('user'))
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
    const array = await traerRegistros(`verificarControl,${documento.trim()}`)
    if (array.length > 0) {
      let contenido = {
        control_N: array[0][0],
        control_T: array[0][1],
        nr: documento.trim(),
      }
      contenido = encriptar(contenido)
      localStorage.setItem('contenido', contenido)
      const url = '../Control/index.php'
      // window.location.href = url
      window.open(url, '_blank')
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
  console.log(simulateAsignarEventos)
  if (simulateAsignarEventos === 'true') {
    const persona = desencriptar(localStorage.getItem('user'))
    console.log(persona)
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
        segundaCargaListado()
      }, 200)
    }
  }
})

const goLanding = document.querySelector('.custom-button')
goLanding.addEventListener('click', () => {
  const url = '../../Pages/Landing'
  window.location.href = url
})
