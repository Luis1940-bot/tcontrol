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
// eslint-disable-next-line import/extensions
import { encriptar, desencriptar } from '../../controllers/cript.js'
import { Alerta } from '../../includes/atoms/alerta.js'
import arrayGlobal from '../../controllers/variables.js'

// const SERVER = '/iControl-Vanilla/icontrol';
const SERVER = '../..'

let translateOperativo = []
let espanolOperativo = []
const objTranslate = {
  operativoES: [],
  operativoTR: [],
}

const spinner = document.querySelector('.spinner')
const appJSON = {}
const navegador = {
  estadoAnteriorButton: '',
  estadoAnteriorWhereUs: [],
  estadoNavButton: {},
}

const espacio = ' > '

function leeVersion(json) {
  readJSON(json)
    .then((data) => {
      document.querySelector('.version').innerText = data.version
    })
    .catch((error) => {
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

function obtenerNombres(objeto, clave) {
  if (objeto.hasOwnProperty(clave) && objeto[clave].hasOwnProperty('name')) {
    return {
      name: objeto[clave].name || null,
      type: objeto[clave].type || null,
      ruta: objeto[clave].ruta || null,
      nivel: objeto[clave].nivel || null,
    }
  } else {
    for (const prop in objeto) {
      if (typeof objeto[prop] === 'object') {
        const resultadoRecursivo = obtenerNombres(objeto[prop], clave)
        if (resultadoRecursivo) {
          return resultadoRecursivo
        }
      }
    }
  }
  return null // Devuelve null si la clave no se encuentra en el objeto
}

function extraeIndice(array, clave) {
  for (let index = 0; index < array.length; index++) {
    const element = array[index]
    if (element.trim() === clave.trim()) {
      return index
    }
  }
  return -1
}

function localizador(e) {
  const lugar = trO(e.target.innerText) || e.target.innerText

  document.getElementById('whereUs').innerText += `${espacio}${lugar}`
  document.getElementById('volver').style.display = 'block'
  document.getElementById('whereUs').style.display = 'inline'
  navegador.estadoAnteriorButton = e.target.name
  navegador.estadoAnteriorWhereUs.push(e.target.name)
}

function completaButtons(obj) {
  const persona = desencriptar(sessionStorage.getItem('user'))
  const { tipo } = persona
  const divButtons = document.querySelector('.div-home-buttons')
  divButtons.innerHTML = ''
  document.getElementById('spanUbicacion').innerText = appJSON.planta
  for (let i = 0; i < obj.name.length; i++) {
    const { nivel } = obj
    if (nivel[i] <= parseInt(tipo)) {
      const element = obj.name[i]
      const params = {
        text: trO(element) || element,
        name: obj.name[i],
        class: 'button-selector-home',
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
        confecha: null,
        operation: null,
        ini: null,
        outi: null,
        tipo: null,
        procedure: null,

        onClick: funcionDeClick,
      }
      const newButton = createButton(params)
      divButtons.appendChild(newButton)
    }
  }
}

function llamarCtrl(control) {
  try {
    const primeraBarraIndex = control.indexOf('/')
    let tipoDeArchivo = control.substring(0, primeraBarraIndex)
    let tipoDeRove = control.substring(primeraBarraIndex + 1)
    let timestamp = new Date().getTime()
    let url = ''
    let ruta = ''
    let tipoUrl = true
    if (!control) {
      url = '404'
      tipoUrl = false
    }

    if (control && !tipoDeArchivo) {
      url = `${SERVER}/Pages/Router/rutas.php?${control}`
      tipoUrl = true
    }
    if (control && tipoDeArchivo !== '' && tipoDeArchivo === 'rove') {
      url = `${SERVER}/Pages/Router/rutas.php?`
      ruta = `${url}ruta=rove&rove=${tipoDeRove}?v=${timestamp}`
      tipoUrl = false
    }
    if (control && tipoDeArchivo !== '' && tipoDeArchivo !== 'rove') {
      url = `${SERVER}/Pages/Router/rutas.php?`
      ruta = `${url}ruta=${control}?v=${timestamp}`
      tipoUrl = false
    }

    sessionStorage.setItem(
      'history_pages',
      encriptar(navegador.estadoAnteriorWhereUs)
    )

    if (tipoUrl) {
      const [subcadena, parametros] = url.split('?')
      const pares = parametros.split('&')
      const objeto = pares.reduce((objs, par) => {
        const obj = objs
        const [clave, valor] = par.split('=')
        obj[clave] = decodeURIComponent(valor)
        return obj
      }, {})

      sessionStorage.setItem('contenido', encriptar(objeto))
      ruta = `${subcadena}?ruta=control&${control}?v=${timestamp}`
    } else {
      sessionStorage.setItem('contenido', encriptar('x'))
    }
    console.log(ruta)
    window.location.href = ruta
    // window.open(ruta, '_blank')
  } catch (error) {
    console.log(error)
  }
}

const funcionDeClick = (e) => {
  const claveBuscada = e.target.name
  const indice = extraeIndice(navegador.estadoNavButton.name, claveBuscada)
  const btnCtrl = navegador.estadoNavButton.type[indice]
  const nuevoObjeto = obtenerNombres(appJSON, claveBuscada)

  if (nuevoObjeto === null) {
    const control = navegador.estadoNavButton.ruta[indice]
    llamarCtrl(control)
    return
  }
  navegador.estadoNavButton = nuevoObjeto
  if (btnCtrl === 'btn') {
    completaButtons(nuevoObjeto)
  }
  localizador(e)
}

function alertar(men) {
  const miAlerta = new Alerta()
  const mensaje = trO(arrayGlobal.mensajesVarios.json[men])
  arrayGlobal.avisoRojo.close.display = 'none'
  miAlerta.createVerde(arrayGlobal.avisoRojo, mensaje, objTranslate)
  const modal = document.getElementById('modalAlertVerde')
  modal.style.display = 'block'
}

function leeApp(json) {
  readJSON(json)
    .then((data) => {
      Object.assign(appJSON, data)
      navegador.estadoAnteriorButton = 'apps'
      navegador.estadoAnteriorWhereUs.push('apps')
      const nuevoObjeto = obtenerNombres(appJSON, 'apps')
      navegador.estadoNavButton = nuevoObjeto
      completaButtons(nuevoObjeto)
    })
    .catch((error) => {
      if (error.name === 'SyntaxError') {
        console.error('El archivo no tiene el formato JSON adecuado')
        alertar('formato')
        // Aquí puedes ejecutar acciones específicas para este tipo de error
      } else if (error.code === 'ENOENT') {
        console.error('El archivo no existe')
        alertar('no_existe')
        // Aquí puedes ejecutar acciones específicas para este tipo de error
      } else {
        console.error('Error al cargar el archivo:', error)
        alertar('no_carga')
        // Aquí puedes manejar otros tipos de errores
      }
    })
}

function dondeEstaEn(array) {
  const ustedEstaEn = `${trO('Usted está en')} ` || 'Usted está en '
  let nuevaCadena = ''
  array.forEach((element, index) => {
    index > 0 ? (nuevaCadena += ` > ${element}`) : null
    if (array.length === 1) {
      nuevaCadena = ''
      document.getElementById('whereUs').style.display = 'none'
      document.getElementById('volver').style.display = 'none'
    }
  })
  document.getElementById('whereUs').innerText = `${ustedEstaEn}${nuevaCadena}`
}

function configPHP(user) {
  // const user = desencriptar(sessionStorage.getItem('user'))
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
  document.querySelector('.header-McCain').style.display = 'none'
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
    objTranslate.operativoES = [...espanolOperativo]
    objTranslate.operativoTR = [...translateOperativo]
    leeVersion('version')
    setTimeout(() => {
      dondeEstaEn(navegador.estadoAnteriorWhereUs)
      leeApp(`App/${plant}/app`)
    }, 200)
  }
  spinner.style.visibility = 'hidden'
  finPerformance()
})

function goBack() {
  try {
    navegador.estadoAnteriorWhereUs.pop()
    navegador.estadoAnteriorButton =
      navegador.estadoAnteriorWhereUs[
        navegador.estadoAnteriorWhereUs.length - 1
      ]
    const clave =
      navegador.estadoAnteriorWhereUs[
        navegador.estadoAnteriorWhereUs.length - 1
      ]
    // console.log('clave>>> ', clave)
    const nuevoObjeto = obtenerNombres(appJSON, clave)
    navegador.estadoNavButton = nuevoObjeto
    completaButtons(nuevoObjeto)
    dondeEstaEn(navegador.estadoAnteriorWhereUs)
  } catch (error) {
    console.log(error)
  }
}

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

const volver = document.getElementById('volver')
volver.addEventListener('click', () => {
  goBack(null)
})

const goLanding = document.querySelector('.custom-button')
goLanding.addEventListener('click', () => {
  const url = '../../Pages/Landing'
  window.location.href = url
})
