// eslint-disable-next-line import/extensions
import arrayGlobal from '../../../controllers/variables.js'
// eslint-disable-next-line import/extensions
import { Alerta } from '../../../includes/atoms/alerta.js'

const widthScreen = window.innerWidth
const widthScreenAjustado = 1 //360 / widthScreen;
let arrayWidthEncabezado

import baseUrl from '../../../config.js'
import { trO, trA } from '../../../controllers/trOA.js'
const SERVER = baseUrl

function estilosTheadCell(element, index, objTranslate) {
  const cell = document.createElement('th')
  if (index < 5) {
    const mensaje = trO(element, objTranslate) || element
    cell.textContent = mensaje.toUpperCase()
    cell.style.background = '#000000'
    cell.style.border = '1px solid #cecece'
    cell.style.overflow = 'hidden'
    const widthCell =
      widthScreenAjustado * widthScreen * arrayWidthEncabezado[index]
    cell.style.width = `${widthCell}px`
  } else {
    cell.style.display = 'none'
  }
  return cell
}

function encabezado(encabezados, objTranslate) {
  const thead = document.querySelector('thead')
  const newRow = document.createElement('tr')
  arrayWidthEncabezado = [...encabezados.width]
  encabezados.title.forEach((element, index) => {
    const cell = estilosTheadCell(element, index, objTranslate)
    newRow.appendChild(cell)
  })
  thead.appendChild(newRow)
}

function viewer(array, objTranslate) {
  console.log(array)
  const miAlerta = new Alerta()
  miAlerta.createViewerAreas(arrayGlobal.objAlertaViewer, array, objTranslate)
  const modal = document.getElementById('modalAlertView')
  modal.style.display = 'block'
}

async function conceptoOnOff(id, status, objTranslate) {
  const actualizado = await variableOnOff(id, status, '/variableOnOff')
  if (actualizado.success) {
    await cargaDeRegistros(objTranslate)
  }
}

function estilosCell(
  alignCenter,
  paddingLeft,
  datos,
  fontStyle,
  fontWeight,
  background,
  colorText,
  activo,
  visible,
  indice,
  objTranslate,
  arrayControl
) {
  const cell = document.createElement('td')
  cell.textContent = datos.toUpperCase()
  cell.style.borderBottom = '1px solid #cecece'
  cell.style.zIndex = 2
  cell.style.textAlign = alignCenter
  cell.style.paddingLeft = paddingLeft
  cell.style.fontStyle = fontStyle
  cell.style.fontWeight = fontWeight
  // cell.style.fontSize = fontSize
  let colorDelTexto = colorText
  let onOff = ''
  let colorOnOff = 'green'
  let textoSelector = ''
  let dirImg = 'on'

  const imagen = document.createElement('img')
  imagen.setAttribute('class', 'img-view')
  imagen.setAttribute('name', 'viewer')
  imagen.style.float = 'right'
  imagen.src = `${SERVER}/assets/img/icons8-edit-30.png`
  // imagen.style.height = '12px'
  // imagen.style.width = '12px'
  imagen.style.margin = 'auto 5px auto auto'
  imagen.style.cursor = 'pointer'
  imagen.setAttribute('data-index', indice)
  imagen.addEventListener('click', (e) => {
    const i = e.target.getAttribute('data-index')
    viewer(arrayControl[i], objTranslate)
  })
  cell.appendChild(imagen)

  if (visible === 'n') {
    colorDelTexto = '#818181'
    onOff = 'OFF'
    colorOnOff = 'red'
    textoSelector = 'OFF'
    dirImg = 'img.icons8'
  }

  if (visible === 's') {
    textoSelector = 'ON'
    dirImg = 'icons8-view-30'
    onOff = 'ON'
  }

  if (onOff !== '') {
    const imgStatus = document.createElement('img')
    imgStatus.setAttribute('class', `img-view-${onOff}`)
    imgStatus.setAttribute('name', 'viewer')
    imgStatus.style.float = 'right'
    imgStatus.src = `${SERVER}/assets/img/${dirImg}.png`
    imgStatus.style.cursor = 'pointer'
    imgStatus.setAttribute('data-index', indice)
    imgStatus.setAttribute('data-status', visible)
    imgStatus.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-index')
      const status = e.target.getAttribute('data-status')
      conceptoOnOff(id, status, objTranslate)
    })
    cell.appendChild(imgStatus)
  }

  if (activo === 'n') {
    colorDelTexto = '#818181'
    onOff = 'OFF'
    colorOnOff = 'red'
    textoSelector = 'OFF'
    dirImg = 'off'
  }
  if (activo === 's') {
    textoSelector = 'ON'
    dirImg = 'on'
    onOff = 'ON'
  }

  if (onOff !== '') {
    const imgStatus = document.createElement('img')
    imgStatus.setAttribute('class', `img-view-${onOff}`)
    imgStatus.setAttribute('name', 'viewer')
    imgStatus.style.float = 'right'
    imgStatus.src = `${SERVER}/assets/img/${dirImg}.png`
    imgStatus.style.cursor = 'pointer'
    imgStatus.setAttribute('data-index', indice)
    imgStatus.setAttribute('data-status', activo)
    imgStatus.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-index')
      const status = e.target.getAttribute('data-status')
      conceptoOnOff(id, status, objTranslate)
    })
    cell.appendChild(imgStatus)
  }

  return cell
}

function estilosTbodyCell(element, index, objTranslate, arrayControl) {
  const newRow = document.createElement('tr')
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 1; i++) {
    const dato = element[0]
    const activo = element[3]
    const visible = element[4]
    const alignCenter = 'left'
    const paddingLeft = '10px'
    const fontStyle = 'normal'
    const fontWeight = 700
    const background = '#ffffff'
    const colorText = '#000000'
    // let size = '10px'
    // if (widthScreen > 1000) {
    //   size = '10px'
    // }
    // const fontSize = size
    const indice = index

    const cell = estilosCell(
      alignCenter,
      paddingLeft,
      dato,
      fontStyle,
      fontWeight,
      background,
      colorText,
      activo,
      visible,
      indice,
      objTranslate,
      arrayControl
    )
    newRow.appendChild(cell)
  }
  return newRow
}

function completaTabla(arrayControl, objTranslate) {
  const tbody = document.querySelector('tbody')
  // const cantidadDeRegistros = arrayControl.length;
  const arrayMapeado = arrayControl.map((fila) => [
    trA(fila[1], objTranslate),
    ...fila.slice(0),
  ])

  arrayMapeado.sort((a, b) => a[0].localeCompare(b[0]))

  arrayMapeado.forEach((element, index) => {
    const newRow = estilosTbodyCell(element, index, objTranslate, arrayMapeado)
    tbody.appendChild(newRow)
  })
  const tableControlViews = document.getElementById('tableAreasViews')
  tableControlViews.style.display = 'block'
}

function loadTabla(arrayControl, encabezados, objTranslate) {
  const miAlerta = new Alerta()
  if (arrayControl.length > 0) {
    encabezado(encabezados, objTranslate)
    completaTabla(arrayControl, objTranslate)
    // array = [...arrayControl];
    const cantidadDeFilas = document.querySelector('table tbody')
    let mensaje = arrayGlobal.mensajesVarios.cargarControl.fallaCarga

    if (cantidadDeFilas.childElementCount !== arrayControl.length) {
      mensaje = trO(mensaje, objTranslate) || mensaje
      miAlerta.createVerde(arrayGlobal.avisoRojo, mensaje, null)
      const modal = document.getElementById('modalAlert')
      modal.style.display = 'block'
    }
    setTimeout(() => {}, 1000)
  } else {
    let mensaje =
      trO(
        'No existen áreas cargadas. Comuníquese con el administrador.',
        objTranslate
      ) || 'No existen áreas cargadas. Comuníquese con el administrador.'
    miAlerta.createVerde(arrayGlobal.avisoRojo, mensaje, objTranslate)
    let modal = document.getElementById('modalAlertVerde')
    modal.style.display = 'block'
    modal = document.querySelector('.div-ubicacionSearch')
    modal.style.display = 'none'
  }
}

export default function tablaVacia(arrayControl, encabezados, objTranslate) {
  setTimeout(() => {
    loadTabla(arrayControl, encabezados, objTranslate)
  }, 200)
}
