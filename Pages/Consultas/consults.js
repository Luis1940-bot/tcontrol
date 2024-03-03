// eslint-disable-next-line no-unused-vars, import/extensions
import readJSON from '../../controllers/read-JSON.js'
// eslint-disable-next-line import/extensions
import createButton from '../../includes/atoms/createButton.js'
// eslint-disable-next-line import/extensions, import/no-named-as-default
import translate, {
  // eslint-disable-next-line no-unused-vars
  arrayTranslateOperativo,
  // eslint-disable-next-line no-unused-vars
  arrayEspanolOperativo,
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

const espacio = ' > '

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
    (item) => item.replace(/\s/g, '').toLowerCase() === palabraNormalizada
  )
  if (index !== -1) {
    return translateOperativo[index]
  }
  return palabra
}

function trA(palabra, objTrad) {
  try {
    if (palabra === undefined || palabra === null || objTrad === null) {
      return ''
    }
    const palabraNormalizada = palabra.replace(/\s/g, '').toLowerCase()
    const index = objTrad.archivosES.findIndex(
      (item) =>
        item.replace(/\s/g, '').toLowerCase().trim() ===
        palabraNormalizada.trim()
    )
    if (index !== -1) {
      return objTrad.archivosTR[index]
    }
    return palabra
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    return palabra
  }
  // return palabra;
}

function localizador(e) {
  const lugar = trO(e.target.innerText) || e.target.innerText
  document.getElementById('whereUs').innerText += `${espacio}${lugar}`
  document.getElementById('volver').style.display = 'block'
  document.getElementById('whereUs').style.display = 'inline'
  navegador.estadoAnteriorButton = e.target.name
  navegador.estadoAnteriorWhereUs.push(e.target.name)
}

function dondeEstaEn() {
  let lugar = trO('Consultas') || 'Consultas'
  lugar = `<img src='../../assets/img/icons8-brick-wall-50.png' height='10px' width='10px'> ${lugar}`
  document.getElementById('whereUs').innerHTML = lugar
  document.getElementById('whereUs').style.display = 'inline'
  document.getElementById('volver').style.display = 'none'
}

function llamarProcedure(name, confecha, ini, outi, procedure, operation) {
  try {
    if (procedure) {
      const ruta = `../../Pages/ConsultasViews/viewsGral.php?v=${Math.round(
        Math.random() * 10
      )}`
      let contenido = {
        name,
        confecha,
        ini,
        outi,
        procedure,
        operation,
      }
      contenido = encriptar(contenido)
      sessionStorage.setItem('procedure', contenido)
      window.open(ruta, '_blank')
    }
  } catch (error) {
    console.log(error)
  }
}

/* eslint-enable no-use-before-define */
function completaButtons(obj) {
  const divButtons = document.querySelector('.div-consultas-buttons')
  divButtons.innerHTML = ''
  // document.getElementById('spanUbicacion').innerText = objButtons.planta
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < objButtons[obj].name.length; i++) {
    const element = objButtons[obj].name[i]
    const active = objButtons[obj].active[i]
    let procedure,
      ini,
      outi,
      confecha = null,
      operation = null
    const boton = objButtons[obj].button[i]
    if (boton === 0) {
      procedure = objButtons[obj].procedure[i]
      ini = JSON.stringify(objButtons[obj].in[i])
      outi = JSON.stringify(objButtons[obj].out[i])
      confecha = objButtons[obj].confecha[i]
      operation = objButtons[obj].operation[i]
    }
    const name = objButtons[obj].name[i]
    const params = {
      text: trA(element, objTranslate) || element,
      name,
      class: 'button-selector-consultas',
      innerHTML: null,
      height: null, // 35
      width: null, // 75%
      borderRadius: '5px',
      border: null,
      textAlign: 'center',
      marginLeft: null,
      marginRight: null,
      marginTop: null,
      marginBotton: null,
      paddingLeft: null,
      paddingRight: null,
      paddingTop: null,
      paddingBotton: null,
      background: null,
      tipo: objButtons[obj].button[i],
      procedure,
      confecha,
      ini,
      outi,
      operation,
      onClick: funcionDeClick,
    }
    if (active === 1) {
      const newButton = createButton(params)
      divButtons.appendChild(newButton)
    }
  }
}

const funcionDeClick = (e) => {
  const claveBuscada = e.target.name
  const tipoValue = e.target.getAttribute('tipo')
  localizador(e)
  if (tipoValue === '1') {
    completaButtons(claveBuscada)
  } else if (tipoValue === '0') {
    const procedure = e.target.getAttribute('procedure')
    const name = e.target.getAttribute('name')
    const ini = e.target.getAttribute('ini')
    const outi = e.target.getAttribute('outi')
    const confecha = e.target.getAttribute('confecha')
    const operation = e.target.getAttribute('operation')
    llamarProcedure(name, confecha, ini, outi, procedure, operation)
  }
}

function leeApp(json, complit) {
  readJSON(json)
    .then((data) => {
      Object.assign(objButtons, data)
      navegador.estadoAnteriorButton = 'Consultas'
      navegador.estadoAnteriorWhereUs.push('Consultas')
      document.getElementById('spanUbicacion').innerText = objButtons.planta
      complit ? completaButtons('Consultas') : null
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

document.addEventListener('DOMContentLoaded', async () => {
  inicioPerformance()
  configPHP()
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
      leeApp('app', false)
      leeApp('consultas/app', true)
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

function goBack() {
  try {
    let quitarCadena = ` > ${
      navegador.estadoAnteriorWhereUs[
        navegador.estadoAnteriorWhereUs.length - 1
      ]
    }`
    navegador.estadoAnteriorWhereUs.pop()
    navegador.estadoAnteriorButton =
      navegador.estadoAnteriorWhereUs[
        navegador.estadoAnteriorWhereUs.length - 1
      ]
    const clave =
      navegador.estadoAnteriorWhereUs[
        navegador.estadoAnteriorWhereUs.length - 1
      ]
    completaButtons(clave)
    const cadena = `${document.getElementById('whereUs').innerText}`
    quitarCadena = quitarCadena.replace('>', '')
    quitarCadena = trO(quitarCadena || quitarCadena)
    let nuevaCadena = cadena.replace(quitarCadena, '')
    const ultimoIndice = nuevaCadena.lastIndexOf('>')
    nuevaCadena =
      nuevaCadena.slice(0, ultimoIndice) + nuevaCadena.slice(ultimoIndice + 1)
    if (clave === 'Consultas') {
      dondeEstaEn()
      return
    }
    document.getElementById('whereUs').innerText = `${nuevaCadena}`
  } catch (error) {
    console.log(error)
  }
}

const volver = document.getElementById('volver')
volver.addEventListener('click', () => {
  goBack(null)
})

const goLanding = document.querySelector('.custom-button')
goLanding.addEventListener('click', () => {
  const url = '../../Pages/Landing'
  window.location.href = url
})
