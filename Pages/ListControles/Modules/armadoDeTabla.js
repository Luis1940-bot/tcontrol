// eslint-disable-next-line import/extensions
import arrayGlobal from '../../../controllers/variables.js'
// eslint-disable-next-line import/extensions
import { Alerta } from '../../../includes/atoms/alerta.js'
import { encriptar, desencriptar } from '../../../controllers/cript.js'

let translateOperativo = []
let espanolOperativo = []
let translateArchivos = []
let espanolArchivos = []

const widthScreen = window.innerWidth
const widthScreenAjustado = 1 //360 / widthScreen;
let arrayWidthEncabezado

import baseUrl from '../../../config.js'
// const SERVER = '/iControl-Vanilla/icontrol';
const SERVER = baseUrl

const encabezados = {
  title: ['Campos'],
  width: ['1'],
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

function estilosTheadCell(element, index) {
  const cell = document.createElement('th')
  if (index < 5) {
    const mensaje = trO(element) || element
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

function encabezado(encabezados) {
  const thead = document.querySelector('thead')
  const newRow = document.createElement('tr')
  arrayWidthEncabezado = [...encabezados.width]
  encabezados.title.forEach((element, index) => {
    const cell = estilosTheadCell(element, index)
    newRow.appendChild(cell)
  })
  thead.appendChild(newRow)
  return thead
}

function encabezadoCampos(encabezados) {
  const thead = document.createElement('thead')
  const newRow = document.createElement('tr')
  arrayWidthEncabezado = [...encabezados.width]
  encabezados.title.forEach((element, index) => {
    const cell = estilosTheadCell(element, index)
    newRow.appendChild(cell)
  })
  thead.appendChild(newRow)
  return thead
}

function estilosTbodyCellCampos(array) {
  const newRow = document.createElement('tr')
  for (let i = 0; i < array[0].length; i++) {}
}

function viewer(selector, array, objTranslate) {
  //!editar

  const filtrado = array.filter((subArray) => subArray[9] === selector)
  const elemento = document.querySelector('.div-encabezadoPastillas')
  elemento.style.display = 'block'
  if (elemento) {
    elemento.setAttribute('tabindex', '-1') // O cualquier otro valor de tabindex
    elemento.focus()
    const div = document.querySelector('.div-pastillas')
    const tabla = document.createElement('table')
    tabla.style.marginTop = '10px'
    const thead = encabezadoCampos(encabezados)
    tabla.appendChild(thead)
    div.appendChild(tabla)
    array.forEach((element, index) => {
      const newRow = estilosTbodyCellCampos(filtrado)
    })
    const tbody = document.createElement('tbody')
  }
  console.log(filtrado)
}

function estilosCell(
  alignCenter,
  paddingLeft,
  datos,
  fontStyle,
  fontWeight,
  background,
  colorText,
  items,
  itm,
  img,
  indice,
  objTranslate,
  arrayControl,
  id
) {
  const cell = document.createElement('td')
  cell.textContent = datos
  cell.style.borderBottom = '1px solid #cecece'
  cell.style.zIndex = 2
  cell.style.textAlign = alignCenter
  cell.style.paddingLeft = paddingLeft
  cell.style.fontStyle = fontStyle
  cell.style.fontWeight = fontWeight
  // cell.style.fontSize = fontSize
  let colorDelTexto = colorText
  let onOff = ''
  let colorItems = 'green'
  let textoSelector = items
  let dirImg = ''

  if (items === 0) {
    colorDelTexto = 'red'
    colorItems = 'red'
  }

  let spanOnOff = document.createElement('span')
  spanOnOff.style.color = colorItems
  spanOnOff.style.fontStyle = 'normal'
  spanOnOff.style.marginLeft = '14px'
  itm !== '' ? (spanOnOff.textContent = `${itm}: ${textoSelector}`) : null
  spanOnOff.style.fontWeight = 700
  spanOnOff.style.border = `1px solid ${colorItems}`
  spanOnOff.style.borderRadius = '5px'
  spanOnOff.style.padding = '3px'
  spanOnOff.style.display = 'inline-block'

  cell.appendChild(spanOnOff)

  if (img && onOff === '') {
    const imagen = document.createElement('img')
    imagen.setAttribute('class', 'img-view')
    imagen.setAttribute('name', 'viewer')
    imagen.style.float = 'right'
    imagen.src = `${SERVER}/assets/img/icons8-edit-30.png`
    imagen.style.cursor = 'pointer'
    imagen.setAttribute('data-index', id)
    imagen.addEventListener('click', (e) => {
      const sel = e.target.getAttribute('data-index')
      viewer(sel, arrayControl, objTranslate)
    })
    cell.appendChild(imagen)
  }

  return cell
}

function estilosTbodyCell(element, index, objTranslate, arrayControl, id) {
  const newRow = document.createElement('tr')
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 1; i++) {
    const dato = element[1]
    const items = element[25]
    const alignCenter = 'left'
    const paddingLeft = '10px'
    const fontStyle = 'normal'
    const fontWeight = 700
    const background = '#ffffff'
    const colorText = '#000000'
    const indice = index

    const cell = estilosCell(
      alignCenter,
      paddingLeft,
      dato,
      fontStyle,
      fontWeight,
      background,
      colorText,
      items,
      'Items',
      true,
      indice,
      objTranslate,
      arrayControl,
      id
    )
    newRow.appendChild(cell)
  }
  return newRow
}

function eliminarDuplicadosPorPrimerElemento(arr) {
  const visto = new Set()
  const resultado = arr.filter((subarray) => {
    const primerElemento = subarray[0]
    if (!visto.has(primerElemento)) {
      visto.add(primerElemento)
      return true
    }
    return false
  })
  return resultado
}

function completaTabla(arrayControl, objTranslate) {
  const tbody = document.querySelector('tbody')
  // const cantidadDeRegistros = arrayControl.length;
  const arrayMapeado = arrayControl.map((fila) => [
    trA(fila[0]),
    ...fila.slice(0),
  ])
  const conteos = {}
  arrayMapeado.forEach((fila) => {
    const primerElemento = fila[0]
    const segundoElemento = fila[2]

    if (conteos[primerElemento] !== undefined && segundoElemento.length !== 0) {
      conteos[primerElemento]++
    } else {
      segundoElemento.length === 0
        ? (conteos[primerElemento] = 0)
        : (conteos[primerElemento] = 1)
    }
  })
  const arrayFinal = arrayMapeado.map((fila) => {
    const primerElemento = fila[0]
    const conteo = conteos[primerElemento]
    return [...fila, conteo]
  })

  const arraySinDuplicados = eliminarDuplicadosPorPrimerElemento(arrayFinal)

  arraySinDuplicados.forEach((element, index) => {
    const id = element[10]
    const newRow = estilosTbodyCell(
      element,
      index,
      objTranslate,
      arrayControl,
      id
    )
    tbody.appendChild(newRow)
  })
  const tableControlViews = document.getElementById('tableControlesViews')
  tableControlViews.style.display = 'block'
}

function loadTabla(arrayControl, encabezados, objTranslate) {
  const miAlerta = new Alerta()
  const arraySinDuplicados = eliminarDuplicadosPorPrimerElemento(arrayControl)
  if (arraySinDuplicados.length > 0) {
    encabezado(encabezados)
    completaTabla(arrayControl, objTranslate)
    // array = [...arrayControl];
    const cantidadDeFilas = document.querySelector('table tbody')
    let mensaje = arrayGlobal.mensajesVarios.cargarControl.fallaCarga

    if (cantidadDeFilas.childElementCount !== arraySinDuplicados.length) {
      mensaje = trO(mensaje) || mensaje
      miAlerta.createVerde(arrayGlobal.avisoRojo, mensaje, null)
      const modal = document.getElementById('modalAlert')
      modal.style.display = 'block'
    }
    setTimeout(() => {}, 1000)
  } else {
    miAlerta.createVerde(arrayGlobal.avisoRojo, null, objTranslate)
    const modal = document.getElementById('modalAlert')
    modal.style.display = 'block'
  }
}

export default function tablaVacia(arrayControl, encabezados, objTranslate) {
  // arraysLoadTranslate();
  translateOperativo = objTranslate.operativoTR
  espanolOperativo = objTranslate.operativoES
  translateArchivos = objTranslate.archivosTR
  espanolArchivos = objTranslate.archivosES
  setTimeout(() => {
    loadTabla(arrayControl, encabezados, objTranslate)
  }, 200)
}
