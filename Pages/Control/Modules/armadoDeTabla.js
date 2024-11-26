// eslint-disable-next-line import/extensions
import ElementGenerator from './elementGenerator.js'
// eslint-disable-next-line import/extensions
import fechasGenerator from '../../../controllers/fechas.js'
// eslint-disable-next-line import/extensions
import arrayGlobal from '../../../controllers/variables.js'
// eslint-disable-next-line import/extensions
import traerRegistros from './Controladores/traerRegistros.js'
// eslint-disable-next-line import/extensions
import { Alerta } from '../../../includes/atoms/alerta.js'
// eslint-disable-next-line import/extensions
import hacerMemoria from './Controladores/hacerMemoria.js'
// eslint-disable-next-line import/extensions, import/no-useless-path-segments
import { desencriptar } from '../../../controllers/cript.js'
import { trO, trA } from '../../../controllers/trOA.js'

let data = {}

const widthScreen = window.innerWidth
const widthScreenAjustado = 360 / widthScreen
let arrayWidthEncabezado
let selectDinamic
let elementHTML
let ID = 0
let fila = 0

function estilosTheadCell(element, index, objTrad) {
  const cell = document.createElement('th')
  if (index < 5) {
    const texto = trO(element, objTrad) || element
    cell.textContent = texto.toUpperCase()

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

function encabezado(encabezados, objTrad) {
  const thead = document.querySelector('thead')
  const newRow = document.createElement('tr')
  arrayWidthEncabezado = [...encabezados.width]
  encabezados.title.forEach((element, index) => {
    const cell = estilosTheadCell(element, index, objTrad)
    newRow.appendChild(cell)
  })
  thead.appendChild(newRow)
}

function estilosCell(
  alignCenter,
  paddingLeft,
  type,
  datos,
  colSpan,
  fontStyle,
  fontWeight,
  background,
  colorText,
  requerido,
  display,
  objTrad,
  enabled,
  borde
) {
  const cell = document.createElement('td')
  let dato = ''

  if (typeof datos === 'string' && datos !== null) {
    dato = trA(datos, objTrad) || datos
  } else {
    dato = datos
  }
  if (dato !== null && type === null) {
    cell.textContent = `${dato} ${requerido}` || `${dato} ${requerido}`
  } else if (dato === null && type !== null) {
    cell.appendChild(type)
    // Deshabilitar el elemento si enabled es 1
    if (enabled === 1) {
      type.disabled = true // Inhabilita el input, select, textarea
    } else {
      type.disabled = false // Asegura que esté habilitado si enabled no es 1
    }
  }
  let bordeStandar = '1px solid #cecece'
  if (borde) {
    bordeStandar = borde
  }
  cell.style.borderBottom = bordeStandar
  // cell.style.background = background;
  cell.style.zIndex = 2
  cell.style.textAlign = alignCenter
  cell.style.paddingLeft = paddingLeft
  cell.style.fontStyle = fontStyle
  cell.style.fontWeight = fontWeight
  cell.style.color = colorText
  // cell.style.borderBottom = border
  colSpan === 1 ? (cell.colSpan = 4) : null
  colSpan === 2 ? (cell.style.display = 'none') : null
  colSpan === 3 ? (cell.colSpan = 3) : null
  colSpan === 4 ? (cell.style.display = 'none') : null
  colSpan === 5 ? (cell.colSpan = 3) : null
  display !== null ? (cell.style.display = display) : null
  return cell
}

function estilosTbodyCell(element, index, cantidadDeRegistros, objTrad, plant) {
  const newRow = document.createElement('tr')
  // eslint-disable-next-line no-plusplus
  let maxTextarea = null
  let tipoColSpanTx = null
  for (let i = 0; i < 6; i++) {
    const orden = [0, 3, 4, 6, 7, 1]
    let dato = element[orden[i]]

    const tipoDeDato = element[5]
    const tipoDeObservacion = element[9]
    let enabled = 0
    let alignCenter = 'left'
    let paddingLeft = '0px'
    let colSpan = 0
    let fontStyle = 'normal'
    let fontWeight = 500
    let background = '#ffffff'
    let type = null
    let colorText = '#000000'
    let requerido = ''
    let display = null
    const separador = element[17].includes('solid')
    let borde = null
    if (separador) {
      borde = element[17]
    }

    if (i === 0) {
      ID += 1
      dato = ID
      alignCenter = 'center'
    } else if (i === 1) {
      paddingLeft = '5px'
      element[21] === '1' ? ((colorText = '#fe0404'), (requerido = '*')) : null
    } else if (i === 2) {
      alignCenter = 'center'
    } else if (i === 4) {
      dato = '' //null
    } else if (i === 5) {
      display = 'none'
    }
    if (i === 1 && tipoDeDato === 'l') {
      fontStyle = 'italic'
      dato = `${dato.charAt(0).toUpperCase()}${dato.slice(1)}`
      paddingLeft = '20px'
    }
    i === 1 && (tipoDeDato === 'subt' || tipoDeDato === 'title')
      ? ((fontWeight = 700), (paddingLeft = '20px'), (background = '#f4f1f1'))
      : null

    if (
      i === 1 &&
      (tipoDeDato === 'l' || tipoDeDato === 'subt' || tipoDeDato === 'title')
    ) {
      colSpan = 1
    }
    if (
      i > 1 &&
      (tipoDeDato === 'l' || tipoDeDato === 'subt' || tipoDeDato === 'title')
    ) {
      colSpan = 2
    }
    if (i === 2 && tipoDeDato === 'photo') {
      colSpan = 5
      paddingLeft = '0px'
    }
    if (i > 2 && tipoDeDato === 'photo') {
      display = 'none'
    }
    i === 1 &&
    orden[i] === 3 &&
    tipoDeDato !== 'l' &&
    tipoDeDato !== 'subt' &&
    tipoDeDato !== 'title'
      ? (dato = dato.toUpperCase())
      : null

    if (i === 3 && tipoDeDato === 'img') {
      colSpan = 3
      dato = null
      const ul = ElementGenerator.generateUl()
      type = ul
    }
    if (i > 3 && tipoDeDato === 'img') {
      colSpan = 4
    }

    if (i === 2 && tipoDeDato === 'd') {
      dato = null
      const [valorXDefecto] = element[20] !== '' ? [element[20]] : []
      const fecha = fechasGenerator.fecha_corta_yyyymmdd(new Date())
      const width = ''
      const inputDate = ElementGenerator.generateInputDate(
        fecha,
        width,
        valorXDefecto
      )
      type = inputDate
      element[29] === '1' ? ((background = '#cecece'), (enabled = 1)) : null
    } else if (i === 2 && tipoDeDato === 'h') {
      dato = null
      const [valorXDefecto] = element[20] !== '' ? [element[20]] : []
      const hora = fechasGenerator.hora_actual(new Date())
      const width = ''
      const inputHora = ElementGenerator.generateInputHora(
        hora,
        width,
        valorXDefecto
      )
      type = inputHora
      element[29] === '1' ? ((background = '#cecece'), (enabled = 1)) : null
    } else if (i === 2 && tipoDeDato === 'x') {
      dato = '' //null
      type = null
    } else if (i === 2 && tipoDeDato === 't') {
      dato = null
      const [valorXDefecto] = element[20] !== '' ? [element[20]] : []
      const width = ''
      const inputText = ElementGenerator.generateInputText(width, valorXDefecto)
      elementHTML = inputText
      type = inputText
      element[29] === '1' ? ((background = '#cecece'), (enabled = 1)) : null
    } else if (i === 2 && tipoDeDato === 'b') {
      dato = null
      let checked = false
      element[20] === '1' ? (checked = true) : (checked = false)
      const inputCheckBox = ElementGenerator.generateInputCheckBox(checked)
      type = inputCheckBox
      element[29] === '1' ? ((background = '#cecece'), (enabled = 1)) : null
    } else if (i === 2 && tipoDeDato === 'n') {
      dato = null
      const [valorXDefecto] = element[20] !== '' ? [element[20]] : []
      const width = ''
      const inputNumber = ElementGenerator.generateInputNumber(
        width,
        valorXDefecto
      )
      elementHTML = inputNumber
      type = inputNumber
      element[29] === '1' ? ((background = '#cecece'), (enabled = 1)) : null
    } else if (i === 2 && tipoDeDato === 'tx') {
      dato = null
      let filasTextArea = null
      let columnasTextArea = null

      maxTextarea = element[17]
      if (maxTextarea && maxTextarea.trim() !== '' && separador === false) {
        const ajustada = maxTextarea.replace(
          /(['"])?([a-zA-Z0-9_]+)(['"])?:/g,
          '"$2": '
        )

        const objetoTextarea = JSON.parse(ajustada)
        filasTextArea = parseInt(objetoTextarea.filatx)
        columnasTextArea = parseInt(objetoTextarea.colstx)
        tipoColSpanTx = parseInt(objetoTextarea.colspantx)
      }

      const [valorXDefecto] = element[20] !== '' ? [element[20]] : []
      const textArea = ElementGenerator.generateTextArea(
        valorXDefecto,
        filasTextArea,
        columnasTextArea
      )

      elementHTML = textArea
      type = textArea

      const indexMas = index + 1
      if (indexMas === cantidadDeRegistros) {
        colSpan = 1
        alignCenter = 'left'
        paddingLeft = '3px'
      } else if (maxTextarea !== null && tipoColSpanTx) {
        colSpan = tipoColSpanTx
        alignCenter = 'left'
        paddingLeft = '3px'
      }
      element[29] === '1' ? ((background = '#cecece'), (enabled = 1)) : null
    } else if (i === 2 && tipoDeDato === 'sd') {
      dato = null
      const hijo = element[24]
      const sqlHijo = element[25]
      selectDinamic = ElementGenerator.generateSelectDinamic(hijo, sqlHijo)
      type = selectDinamic
      element[29] === '1' ? ((background = '#cecece'), (enabled = 1)) : null
    } else if (i === 2 && tipoDeDato === 's') {
      dato = null
      const [valorXDefecto] = element[20] !== '' ? [element[20]] : []
      const arraySel = arrayGlobal.arraySelect.filter(
        (ele) => ele[2] === element[12]
      )
      const select = ElementGenerator.generateSelect(arraySel, valorXDefecto)
      type = select
      element[29] === '1' ? ((background = '#cecece'), (enabled = 1)) : null
    } else if (i === 2 && tipoDeDato === 'img') {
      dato = null
      const text = '📸'
      const img = ElementGenerator.generateButtonImage(text, index + 1)
      type = img
      background = 'transparent'
    } else if (i === 2 && tipoDeDato === 'cn') {
      dato = null
      let text = element[orden[1]].toUpperCase()
      const consulta = element[23] || ''
      const anchoButton =
        widthScreenAjustado * widthScreen * arrayWidthEncabezado[2] * 0.2
      const wordLenght = text.length * 7
      const caracteres = Math.ceil((wordLenght - anchoButton) / 7)
      text = `${text.substring(0, caracteres)}.`
      const inputButton = ElementGenerator.generateInputButton(
        text,
        element[orden[1]].toUpperCase(),
        consulta,
        'InputButton-transparent',
        index
      )
      type = inputButton
    } else if (i === 2 && tipoDeDato === 'btnqwery') {
      dato = null
      let text = element[orden[1]].toUpperCase()
      const consulta = element[23] || ''
      const anchoButton =
        widthScreenAjustado * widthScreen * arrayWidthEncabezado[2] * 0.9
      const wordLenght = text.length * 7
      const caracteres = Math.ceil((wordLenght - anchoButton) / 7)
      text = `${text.substring(0, caracteres)}...`
      const buttonQuery = ElementGenerator.generateButtonQuery(
        text,
        element[orden[1]].toUpperCase(),
        consulta,
        'InputButton-transparent'
      )
      type = buttonQuery
      element[29] === '1' ? ((background = '#cecece'), (enabled = 1)) : null
    } else if (i === 2 && tipoDeDato === 'r') {
      dato = null
      let checked = false
      let name = '0'
      element[20] === '1' ? (checked = true) : (checked = false)
      element[12] !== '0' ? (name = `Group${element[12]}`) : (name = '0')
      const radioButton = ElementGenerator.generateSelectedRadioButton(
        checked,
        name
      )
      type = radioButton
      element[29] === '1' ? ((background = '#cecece'), (enabled = 1)) : null
    } else if (i === 2 && tipoDeDato === 'photo') {
      dato = null
      const src = element[20]
      const alt = src.replace(/\.[^/.]+$/, '')
      const partes = element[20].split('.')
      const extension = partes.pop()
      const dimensiones = element[17]
      const { plant } = desencriptar(sessionStorage.getItem('user'))
      const img = ElementGenerator.generateImg(
        src,
        alt,
        dimensiones,
        extension,
        plant
      )
      type = img
    } else if (i === 2 && tipoDeDato === 'valid') {
      dato = null
      let text = 'VALIDAR'
      const anchoButton =
        widthScreenAjustado * widthScreen * arrayWidthEncabezado[2] * 0.2
      const wordLenght = text.length * 7
      const caracteres = Math.ceil((wordLenght - anchoButton) / 7)
      text = `${text.substring(0, caracteres)}.`
      const inputButton = ElementGenerator.generateValidButton(
        text,
        'VALIDAR',
        objTrad,
        'InputButton-transparent',
        plant,
        index
      )
      type = inputButton
    }

    if (i > 2 && tipoDeDato === 'tx') {
      const indexMas = index + 1
      indexMas === cantidadDeRegistros ? (colSpan = 2) : null
    }
    if (i > 2 && tipoDeDato === 'tx' && maxTextarea !== null && tipoColSpanTx) {
      display = 'none'
    }
    if (i === 4 && tipoDeObservacion === 'd') {
      const [valorXDefecto] = element[26] !== '' ? [element[26]] : []
      const fecha = fechasGenerator.fecha_corta_yyyymmdd(new Date())
      const width = ''
      const inputDate = ElementGenerator.generateInputDate(
        fecha,
        width,
        valorXDefecto
      )
      type = inputDate
    } else if (i === 4 && tipoDeObservacion === 'h') {
      dato = null
      const [valorXDefecto] = element[26] !== '' ? [element[26]] : []
      const hora = fechasGenerator.hora_actual(new Date())
      const width = ''
      const inputHora = ElementGenerator.generateInputHora(
        hora,
        width,
        valorXDefecto
      )
      type = inputHora
    } else if (i === 4 && tipoDeObservacion === 'x') {
      dato = '' //null
      type = null
    } else if (i === 4 && tipoDeObservacion === 't') {
      dato = null
      const [valorXDefecto] = element[26] !== '' ? [element[26]] : []
      const width = ''
      const inputText = ElementGenerator.generateInputText(width, valorXDefecto)
      elementHTML = inputText
      type = inputText
    } else if (i === 4 && tipoDeObservacion === 'b') {
      dato = null
      let checked = false
      element[26] === '1' ? (checked = true) : (checked = false)
      const inputCheckBox = ElementGenerator.generateInputCheckBox(checked)
      type = inputCheckBox
    } else if (i === 4 && tipoDeObservacion === 'n') {
      dato = null
      const [valorXDefecto] = element[26] !== '' ? [element[26]] : []
      const width = ''
      const inputNumber = ElementGenerator.generateInputNumber(
        width,
        valorXDefecto
      )
      elementHTML = inputNumber
      type = inputNumber
    } else if (i === 4 && tipoDeObservacion === 'tx') {
      dato = null
      const [valorXDefecto] = element[26] !== '' ? [element[26]] : []
      const textArea = ElementGenerator.generateTextArea(valorXDefecto, 3, 30)
      elementHTML = textArea
      type = textArea
      const indexMas = index + 1
      indexMas === cantidadDeRegistros
        ? ((colSpan = 1), (alignCenter = 'left'), (paddingLeft = '3px'))
        : null
    } else if (i === 4 && tipoDeObservacion === 'sd') {
      dato = null
      selectDinamic = ElementGenerator.generateSelectDinamic()
      type = selectDinamic
    } else if (i === 4 && tipoDeObservacion === 's') {
      dato = null
      const arraySel = arrayGlobal.arraySelect.filter(
        (ele) => ele[2] === element[15]
      )
      const select = ElementGenerator.generateSelect(arraySel)
      type = select
    } else if (i === 4 && tipoDeObservacion === 'cn') {
      dato = null
      let text = element[orden[1]].toUpperCase()
      const consulta = element[23] || ''
      const anchoButton =
        widthScreenAjustado * widthScreen * arrayWidthEncabezado[2] * 0.2
      const wordLenght = text.length * 7
      const caracteres = Math.ceil((wordLenght - anchoButton) / 7)
      text = `${text.substring(0, caracteres)}.`
      const inputButton = ElementGenerator.generateInputButton(
        text,
        element[orden[1]].toUpperCase(),
        consulta,
        'InputButton-transparent'
      )
      type = inputButton
    } else if (i === 4 && tipoDeObservacion === 'btnqwery') {
      dato = null
      let text = element[orden[1]].toUpperCase()
      const consulta = element[23] || ''
      const anchoButton =
        widthScreenAjustado * widthScreen * arrayWidthEncabezado[2] * 0.9
      const wordLenght = text.length * 7
      const caracteres = Math.ceil((wordLenght - anchoButton) / 7)
      text = `${text.substring(0, caracteres)}...`
      const buttonQuery = ElementGenerator.generateButtonQuery(
        text,
        element[orden[1]].toUpperCase(),
        consulta,
        'InputButton-transparent'
      )
      type = buttonQuery
    } else if (i === 4 && tipoDeObservacion === 'r') {
      dato = null
      let checked = false
      let name = '0'
      element[26] === '1' ? (checked = true) : (checked = false)
      element[15] !== '0' ? (name = `Group2${element[15]}`) : (name = '0')
      const radioButton = ElementGenerator.generateSelectedRadioButton(
        checked,
        name
      )
      type = radioButton
    }
    const cell = estilosCell(
      alignCenter,
      paddingLeft,
      type,
      dato,
      colSpan,
      fontStyle,
      fontWeight,
      background,
      colorText,
      requerido,
      display,
      objTrad,
      enabled,
      borde
    )

    newRow.appendChild(cell)
  }
  return newRow
}

async function traerRutina(sqli, selDinamico) {
  try {
    const sql = encodeURIComponent(sqli)
    const arraySelectDinamico = await traerRegistros(`traer_LTYsql`, `${sql}`) //encodeURIComponent
    ElementGenerator.generateOptions(arraySelectDinamico, selDinamico)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
  }
}
async function traerValorPorDefecto(sqli, tipo, html, url) {
  try {
    let sql_i = sqli
    const nr = url.nr

    if (sqli.includes('?') && nr !== '0') {
      sql_i = sql_i.replace('?', nr)
    } else if (sqli.includes('?') && nr === '0') {
      sql_i = sql_i.replace('?', '0')
    }

    const sql = encodeURIComponent(sql_i)

    if (tipo === 'n') {
      const arrayValor = await traerRegistros(`traer_LTYsql`, `${sql}`) //encodeURIComponent
      ElementGenerator.generateInputNumberQuery(arrayValor, html)
    } else if (tipo === 't' || tipo === 'tx') {
      const arrayValor = await traerRegistros(`traer_LTYsql`, `${sql}`) //encodeURIComponent
      ElementGenerator.generateInputTextQuery(arrayValor, html)
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
  }
}

function completaTabla(arrayControl, encabezados, objTrad, url, plant) {
  const tbody = document.querySelector('tbody')
  const cantidadDeRegistros = arrayControl.length
  const email = arrayControl[0][22]

  // Establecer valor en sessionStorage
  sessionStorage.setItem('envia_por_email', email === '1')

  // Función para actualizar el porcentaje de carga
  function updateProgress() {
    const idSpanCarga = document.getElementById('idSpanCarga')
    if (idSpanCarga) {
      const porcentaje = (100 * (fila / cantidadDeRegistros)).toFixed(0)
      idSpanCarga.innerText = `${porcentaje}%`
    } else {
      requestAnimationFrame(updateProgress) // Reintentar en el siguiente frame
    }
  }

  // Inicializar el progreso
  let fila = 0
  updateProgress()
  // console.log(arrayControl)
  // Procesar cada elemento del array
  arrayControl.forEach((element, index) => {
    const newRow = estilosTbodyCell(
      element,
      index,
      cantidadDeRegistros,
      objTrad,
      plant
    )
    tbody.appendChild(newRow)
    fila += 1

    // Ocultar filas específicas
    if (element[8] === 'n') {
      const filaOculta = tbody.querySelector(`tr:nth-child(${index + 1})`)
      if (filaOculta) {
        filaOculta.style.display = 'none'
      }
      ID -= 1
    }

    // Cargar consultas dinámicas
    if (element[5] === 'sd' && element[8] === 's' && element[19]) {
      traerRutina(element[19], selectDinamic)
    }

    // Cargar valor por defecto
    if (['n', 't', 'tx'].includes(element[5]) && element[23]) {
      traerValorPorDefecto(element[23], element[5], elementHTML, url)
    }

    if (element[9] === 'sd' && element[26]) {
      traerRutina(element[26], selectDinamic)
    }

    if (['n', 't', 'tx'].includes(element[9]) && element[27]) {
      traerValorPorDefecto(element[27], element[9], elementHTML, null)
    }
  })

  // Finalizar actualización de progreso
  updateProgress()
}

function controlT(objTrad) {
  const contenido = sessionStorage.getItem('contenido')
  const url = desencriptar(contenido)
  // console.log(url)
  // const url = new URL(window.location.href);
  const controlT = url.control_T // url.searchParams.get('control_T');
  const controlN = url.control_N
  const controlT_traducido = trA(controlT, objTrad) || controlT
  const mensaje = `${controlN}-${controlT_traducido}`
  document.getElementById('wichC').innerText = mensaje
  return url
}

function loadTabla(arrayControl, encabezados, objTrad, url, plant) {
  const miAlerta = new Alerta()
  if (arrayControl.length > 0) {
    encabezado(encabezados, objTrad)
    completaTabla(arrayControl, encabezados, objTrad, url, plant)
    const cantidadDeFilas = document.querySelector('table tbody')
    let mensaje = arrayGlobal.mensajesVarios.cargarControl.fallaCarga
    if (cantidadDeFilas.childElementCount !== arrayControl.length) {
      mensaje = trO(mensaje, objTrad) || mensaje
      miAlerta.createVerde(arrayGlobal.avisoRojo, mensaje, null)
      const modal = document.getElementById('modalAlert')
      modal.style.display = 'block'
    }
    // setTimeout(() => {
    //   const { plant } = desencriptar(sessionStorage.getItem('user'))
    //   hacerMemoria(arrayControl, plant)
    // }, 1000)
  } else {
    miAlerta.createVerde(arrayGlobal.avisoRojo, null, objTranslate)
    const modal = document.getElementById('modalAlert')
    modal.style.display = 'block'
  }
}

export default function tablaVacia(arrayControl, encabezados, objTrad, plant) {
  // arraysLoadTranslate()
  const url = controlT(objTrad)
  // console.log(url)
  setTimeout(() => {
    loadTabla(arrayControl, encabezados, objTrad, url, plant)
  }, 100)
}
