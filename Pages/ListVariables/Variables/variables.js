// eslint-disable-next-line no-unused-vars, import/extensions
import readJSON from '../../../controllers/read-JSON.js'

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
} from '../../../controllers/translate.js'
// eslint-disable-next-line import/extensions
import personModal from '../../../controllers/person.js'
// eslint-disable-next-line import/extensions
import {
  inicioPerformance,
  finPerformance,
} from '../../../includes/Conection/conection.js'
// eslint-disable-next-line import/extensions, import/no-useless-path-segments
import { desencriptar } from '../../../controllers/cript.js'
import fechasGenerator from '../../../controllers/fechas.js'
import baseUrl from '../../../config.js'
// const SERVER = '/iControl-Vanilla/icontrol';
// eslint-disable-next-line import/extensions
import traerRegistros from '../Modules/Controladores/traerRegistros.js'
// eslint-disable-next-line import/extensions
import arrayGlobal from '../../../controllers/variables.js'
import { Alerta } from '../../../includes/atoms/alerta.js'
import variableOnOff from '../Modules/Controladores/variableOnOff.js'
import variableUpDown from '../Modules/Controladores/variableUpDown.js'
import addVariable from '../Modules/Controladores/aceptarVariable.js'

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

function trA(palabra) {
  const palabraNormalizada = palabra.replace(/\s/g, '').toLowerCase()
  const index = espanolArchivos.findIndex(
    (item) => item.replace(/\s/g, '').toLowerCase() === palabraNormalizada
  )
  if (index !== -1) {
    return translateArchivos[index]
  }
  return palabra
}

async function conceptoOnOff(id, status, item, arrayActual) {
  let nuevoArray = [...arrayActual]
  let nuevoStatus = 's'
  if (status === 'OFF') {
    nuevoStatus = 'n'
  }
  const actualizado = await variableOnOff(id, nuevoStatus, '/variableOnOff')
  if (actualizado.success) {
    const div2 = document.querySelector('.div2')
    div2.innerHTML = ''

    if (status === 'OFF') {
      nuevoStatus = 's'
    }
    if (status === 'ON') {
      nuevoStatus = 'n'
    }

    nuevoArray[item][3] = nuevoStatus
    cargaVariables(nuevoArray)
  }
}

function traduccionDeLabels() {
  const form = document.querySelector('#formVariable')
  const labels = form.querySelectorAll('label')
  labels.forEach((label) => {
    let texto = trO(label.textContent) || label.textContent
    label.innerText = texto
  })
}

function limpiarInputs() {
  const form = document.querySelector('#formVariable')
  const inputs = form.querySelectorAll('input')
  inputs.forEach((input) => {
    input.value = ''
  })
  const textareas = form.querySelectorAll('textarea')
  textareas.forEach((textarea) => {
    textarea.value = ''
  })

  const dates = form.querySelectorAll('input[type=date]')
  dates.forEach((date) => {
    date.value = fechasGenerator.fecha_corta_yyyymmdd(new Date())
  })
}

function fijarTextoSelect(selectElement, texto) {
  if (!selectElement) {
    console.log('El elemento select no fue encontrado.')
    return
  }
  for (let i = 0; i < selectElement.options.length; i++) {
    let option = selectElement.options[i]
    if (option.text === texto) {
      selectElement.selectedIndex = i // Establece el índice seleccionado directamente
      break
    }
  }
}

function fijarValorSelect(selectElement, valor) {
  if (!selectElement) {
    console.log('El elemento select no fue encontrado.')
    return
  }
  for (let i = 0; i < selectElement.options.length; i++) {
    let option = selectElement.options[i]
    if (option.value === valor) {
      selectElement.selectedIndex = i // Establece el índice seleccionado directamente
      break
    }
  }
}

function cargaInputs(array) {
  try {
    const numeroDelSelector = document.getElementById('numeroDelSelector')
    numeroDelSelector.value = array[4]
    const nombreDelSelect = document.getElementById('nombreDelSelect')
    nombreDelSelect.value = array[1]

    const tipodeusuario = document.getElementById('tipodeusuario')
    setTimeout(() => {
      fijarValorSelect(tipodeusuario, array[6])
    }, 500)
  } catch (error) {
    console.log(error)
  }
}

function reorderArray(id, orden, array, subebaja) {
  let newArray = [...array]
  newArray.sort((a, b) => {
    let valA = Number(a[5])
    let valB = Number(b[5])

    return valA - valB
  })
  if (subebaja === 'up') {
    for (let i = 0; i < array.length; i++) {
      const element = Number(array[i][5])
      if (Number(orden) === element) {
        const nuevoOrden = Number(orden) - 1
        newArray[i][5] = String(nuevoOrden)
        i > 0 ? (newArray[i - 1][5] = String(orden)) : null
        break
      }
    }
  }

  if (subebaja === 'down') {
    for (let i = 0; i < array.length; i++) {
      const element = Number(array[i][5])
      if (Number(orden) === element) {
        const nuevoOrden = Number(orden) + 1
        newArray[i][5] = String(nuevoOrden)
        i < array.length - 1 ? (newArray[i + 1][5] = String(orden)) : null
        break
      }
    }
  }

  return newArray
}

async function cambiarOrden(id, orden, subebaja, array) {
  let reorderedArray = reorderArray(id, orden, array, subebaja)

  const upDown = await variableUpDown(id, reorderedArray, '/variableUpDown')
  if (upDown.success) {
    const div2 = document.querySelector('.div2')
    div2.innerHTML = ''
    const nuevoArray = [...upDown.array]
    nuevoArray.sort((a, b) => {
      let valA = Number(a[5])
      let valB = Number(b[5])

      return valA - valB
    })
    cargaVariables(nuevoArray)
  }
}

function cargaVariables(array) {
  const div2 = document.querySelector('.div2')

  try {
    const titulo = document.createElement('span')
    titulo.innerText = trO('Variables') || 'Variables'
    titulo.setAttribute('id', 'titulo')
    div2.appendChild(titulo)
    array.forEach((element, index) => {
      const div = document.createElement('div')
      div.setAttribute('class', 'div-pastillita')
      div.setAttribute('id', `p${index}`)
      const input = document.createElement('input')
      input.value = element[2]
      input.setAttribute('class', 'span-variable')
      input.setAttribute('id', element[0])
      let spanOnOff = document.createElement('span')
      let selector = element[3]
      let dirImg = ''
      if (selector === 'n') {
        selector = 'OFF'
        dirImg = 'icons8-inactive-24'
      }
      if (selector === 's') {
        selector = 'ON'
        dirImg = 'icons8-active-48'
      }
      let arrow = ''
      let dobleArrow = ''
      let subeBaja = ''
      const orden = parseInt(element[5])
      if (orden <= 1) {
        arrow = 'icons8-page-down-button-50'
        subeBaja = 'down'
      } else if (orden >= array.length) {
        arrow = 'icons8-page-up-button-50'
        subeBaja = 'up'
      } else {
        arrow = 'icons8-page-down-button-50'
        dobleArrow = 'icons8-page-up-button-50'
        subeBaja = 'down'
      }

      spanOnOff.setAttribute('class', `span-${selector}`)
      spanOnOff.innerText = selector
      div.appendChild(input)
      div.appendChild(spanOnOff)
      const imgStatus = document.createElement('img')
      imgStatus.setAttribute('class', `img-view-${selector}`)
      imgStatus.setAttribute('name', 'viewer')
      imgStatus.src = `${SERVER}/assets/img/${dirImg}.png`
      imgStatus.style.cursor = 'pointer'
      imgStatus.setAttribute('data-index', element[0])
      imgStatus.setAttribute('data-status', selector)
      imgStatus.setAttribute('data-item', index)
      imgStatus.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-index')
        const status = e.target.getAttribute('data-status')
        const item = e.target.getAttribute('data-item')
        conceptoOnOff(id, status, item, array)
      })
      div.appendChild(imgStatus)
      let imgArrow = document.createElement('img')
      imgArrow.setAttribute('class', `img-arrow`)
      imgArrow.src = `${SERVER}/assets/img/${arrow}.png`
      imgArrow.setAttribute('data-index', element[0])
      imgArrow.setAttribute('data-item', index)
      imgArrow.setAttribute('data-orden', element[5])
      imgArrow.setAttribute('data-subebaja', subeBaja)

      imgArrow.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-index')
        const orden = e.target.getAttribute('data-orden')
        const item = e.target.getAttribute('data-item')
        const subebaja = e.target.getAttribute('data-subebaja')
        cambiarOrden(id, orden, subebaja, array)
      })
      div.appendChild(imgArrow)
      if (dobleArrow !== '') {
        imgArrow = document.createElement('img')
        imgArrow.setAttribute('class', `img-arrow`)
        imgArrow.src = `${SERVER}/assets/img/${dobleArrow}.png`
        subeBaja = 'up'
        imgArrow.setAttribute('data-index', element[0])
        imgArrow.setAttribute('data-item', index)
        imgArrow.setAttribute('data-orden', element[5])
        imgArrow.setAttribute('data-subebaja', subeBaja)
        imgArrow.addEventListener('click', (e) => {
          const id = e.target.getAttribute('data-index')
          const orden = e.target.getAttribute('data-orden')
          const item = e.target.getAttribute('data-item')
          const subebaja = e.target.getAttribute('data-subebaja')
          cambiarOrden(id, orden, subebaja, array)
        })
        div.appendChild(imgArrow)
      }
      div2.appendChild(div)
    })
  } catch (error) {
    console.log(error)
  }
}

function intercambioDeDivs() {
  const pastillita = document.querySelectorAll('.div-pastillita')
  let idPastillita = 0
  pastillita.forEach((element) => {
    idPastillita = element.getAttribute('id')
  })
  idPastillita = Number(idPastillita.slice(1))
  const formGroup = document.getElementById(`p${idPastillita}`)
  const inputElement = document.querySelector(
    `#p${idPastillita} .span-variable`
  )
  const inputValue = inputElement.value
  formGroup.remove()
  const leyenda = document.getElementById('leyenda')
  leyenda.style.display = 'none'
  const addButton = document.getElementById('addButton')
  addButton.style.display = 'flex'
  return { inputValue, idPastillita }
}

async function agregarVariable() {
  const { inputValue, idPastillita } = intercambioDeDivs()

  if (inputValue !== '') {
    const nuevoOrden = idPastillita + 1
    const numeroDelSelector = document.getElementById('numeroDelSelector')
    const nombreDelSelect = document.getElementById('nombreDelSelect')
    const objeto = {
      selector: parseInt(numeroDelSelector.value),
      nombre: nombreDelSelect.value,
      orden: nuevoOrden,
      concepto: inputValue,
    }

    const resultado = await addVariable(objeto, '/addVariable')

    if (resultado.success) {
      const variable = desencriptar(sessionStorage.getItem('variable'))

      let arrayActualizado = [...variable.filtrado]
      const id = String(resultado.id)
      const nuevoArray = [
        id,
        nombreDelSelect,
        inputValue,
        's',
        numeroDelSelector,
        nuevoOrden,
        '3',
      ]
      arrayActualizado.push(nuevoArray)
      const div2 = document.querySelector('.div2')
      div2.innerHTML = ''
      cargaVariables(arrayActualizado)
    }
  }
}

function cancelarVariable() {
  intercambioDeDivs()
}

const buttonAgregar = document.getElementById('buttonAgregar')
buttonAgregar.addEventListener('click', (e) => {
  try {
    e.preventDefault()
    const addButton = document.getElementById('addButton')
    addButton.style.display = 'none'
    const leyenda = document.getElementById('leyenda')
    leyenda.style.display = 'block'
    const pastillita = document.querySelectorAll('.div-pastillita')
    let idPastillita = 0
    pastillita.forEach((element) => {
      idPastillita = element.getAttribute('id')
    })
    idPastillita = Number(idPastillita.slice(1))
    idPastillita++

    const div2 = document.querySelector('.div2')
    const div = document.createElement('div')
    div.style.background = '#9d9d9d'
    div.setAttribute('class', 'div-pastillita')
    div.setAttribute('id', `p${idPastillita}`)
    const input = document.createElement('input')
    input.value = ''
    input.style.width = '55%'
    input.setAttribute('class', 'span-variable')
    input.addEventListener('keypress', function (event) {
      const key = event.key

      // Condición para bloquear puntos y comas
      if (key === '.' || key === ',') {
        // Previene que el caracter sea ingresado
        event.preventDefault()
      }
    })
    input.focus()
    const buttonAceptar = document.createElement('button')
    buttonAceptar.setAttribute('class', 'button-add')
    buttonAceptar.innerText = trO('Aceptar') || 'Aceptar'
    buttonAceptar.style.marginLeft = '5px'
    buttonAceptar.addEventListener('click', () => {
      //aceptar
      agregarVariable(e)
    })
    const buttonCancel = document.createElement('button')
    buttonCancel.setAttribute('class', 'button-add')
    buttonCancel.innerText = trO('Cancelar') || 'Cancelar'
    buttonCancel.style.marginLeft = '5px'
    buttonCancel.style.color = 'red'
    buttonCancel.addEventListener('click', () => {
      //cancelar
      cancelarVariable()
    })
    div.appendChild(input)
    div.appendChild(buttonAceptar)
    div.appendChild(buttonCancel)
    div2.appendChild(div)
  } catch (error) {
    console.log(error)
  }
})

function leeApp(json) {
  readJSON(json)
    .then((data) => {
      Object.assign(objButtons, data)

      const planta = objButtons.planta
      document.getElementById('spanUbicacion').textContent = planta
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error al cargar el archivo:', error)
    })
}

function dondeEstaEn(lugar, control_T) {
  // const { control_T } = desencriptar(sessionStorage.getItem('contenido'))

  // let lugar = trO('EDITAR: ') || 'EDITAR: '
  lugar = `${lugar} ${trO(control_T) || control_T}`
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

function cargarSelects(array, selector, primerOption) {
  let select = document.querySelector(`#${selector}`)
  select.innerHTML = ''
  const option = document.createElement('option')
  option.text = ''
  option.value = ''
  primerOption ? select.appendChild(option) : null
  array.forEach((element) => {
    const option = document.createElement('option')
    option.text = trO(element[1]) || element[1]
    option.value = element[0]
    select.appendChild(option)
  })
}

async function traerInfoSelects() {
  const tipoDeUsuario = await traerRegistros(
    'traerTipoDeUsuario',
    '/traerReportes',
    null
  )
  cargarSelects(tipoDeUsuario, 'tipodeusuario', false)
}

document.addEventListener('DOMContentLoaded', async () => {
  const variable = desencriptar(sessionStorage.getItem('variable'))

  const user = desencriptar(sessionStorage.getItem('user'))
  const { plant } = user
  inicioPerformance()
  configPHP(user)
  spinner.style.visibility = 'visible'
  const hamburguesa = document.querySelector('#hamburguesa')
  hamburguesa.style.display = 'block'
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
      // dondeEstaEn()
      leeApp(`App/${plant}/app`)
      traduccionDeLabels()
      limpiarInputs()
      if (typeof variable.control_N === 'number') {
        document.getElementById('whereUs').style.display = 'none'
        dondeEstaEn('', trO('Variable nueva') || 'Variable nueva')
      }
      arrayGlobal.guardarSelectorComo = true
      if (typeof variable.control_N === 'number' && variable.control_N === 0) {
        const addButton = document.getElementById('addButton')
        addButton.style.display = 'none'
        arrayGlobal.guardarSelectorComo = false
      }
      if (typeof variable.control_N === 'string') {
        let lugar = trO('EDITAR: ') || 'EDITAR: '
        dondeEstaEn(lugar, variable.control_T)
        cargaInputs(variable.filtrado[0])
        cargaVariables(variable.filtrado)
      }
      traerInfoSelects()
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

document.addEventListener('DOMContentLoaded', () => {
  // Seleccionar todos los inputs de texto y textareas
  const inputs = document.querySelectorAll('input[type=text], textarea')

  // Función para bloquear caracteres
  function bloquearCaracteres(event) {
    const blockedChars = ['.', ',', '/'] // Caracteres que quieres bloquear
    if (blockedChars.includes(event.key)) {
      event.preventDefault() // Prevenir la acción por defecto (evita que se ingrese el carácter)
    }
  }

  // Añadir el evento keydown a cada input y textarea
  inputs.forEach((input) => {
    input.addEventListener('keydown', bloquearCaracteres)
  })
})

document.addEventListener('DOMContentLoaded', () => {
  const hamburguesa = document.getElementById('hamburguesa')
  hamburguesa.addEventListener('click', () => {
    const miAlertaM = new Alerta()
    miAlertaM.createModalMenuCRUDSelector(
      arrayGlobal.objMenu,
      objTranslate,
      arrayGlobal.guardarSelectorComo
    )
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

const volver = document.getElementById('volver')
volver.addEventListener('click', () => {
  const url = `${SERVER}/Pages/ListVariables`
  window.location.href = url
})
