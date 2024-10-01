// eslint-disable-next-line import/extensions
import arrayGlobal from '../../../controllers/variables.js'
// eslint-disable-next-line import/extensions
import { Alerta } from '../../../includes/atoms/alerta.js'
import { encriptar, desencriptar } from '../../../controllers/cript.js'
import baseUrl from '../../../config.js'
import traerRegistros from './Controladores/traerRegistros.js'
import turnControl from './Controladores/ux.js'
import agregarCampoNuevo from './Controladores/ix.js'
import { trA, trO } from '../../../controllers/trOA.js'

const widthScreen = window.innerWidth
const widthScreenAjustado = 1 //360 / widthScreen;
let arrayWidthEncabezado
let arraySinDuplicados = []

const SERVER = baseUrl
let arrayOrden = []
const encabezados = {
  title: [
    'ID',
    'Campo',
    'Tipo de dato',
    'Detalle',
    'Situación',
    'Requerido',
    'Visible',
    'Inhabilitar',
    'Orden',
    'Separador',
    'Valor si',
    'Valor por Defecto',
    'Selector de variable',
    'C/Hijo',
    'Rutina Hijo-Select',
    'Valor SQL por Defecto',
    'Tipo de Observación',
    '2do Selector',
    'Valor por defecto',
    '2do Valor SQL',
    'SQL Consulta dinámica',
    'Validar',
  ],
  width: [
    '0.2',
    '1',
    '1',
    '1',
    '1',
    '1',
    '1',
    '1',
    '1',
    '1',
    '1',
    '1',
    '1',
    '1',
    '1',
    '1',
    '1',
    '1',
    '1',
    '1',
    '1',
    '1',
  ],
}

function estilosTheadCell(element, index, columnas, objTranslate) {
  const cell = document.createElement('th')

  if (index < columnas && arrayWidthEncabezado[index] !== '0') {
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
    const cell = estilosTheadCell(element, index, 2, objTranslate)
    newRow.appendChild(cell)
  })
  thead.appendChild(newRow)
  return thead
}

function encabezadoCampos(encabezados, objTranslate) {
  const thead = document.createElement('thead')
  const newRow = document.createElement('tr')
  arrayWidthEncabezado = [...encabezados.width]
  encabezados.title.forEach((element, index) => {
    const cell = estilosTheadCell(element, index, 21, objTranslate)
    newRow.appendChild(cell)
  })
  thead.appendChild(newRow)
  return thead
}

function reconoceTipoDeDato(tipoDeDato, objTranslate) {
  let tipo = ''
  if (tipoDeDato === 'd') {
    tipo = trO('Fecha', objTranslate) || 'Fecha'
  }
  if (tipoDeDato === 'h') {
    tipo = trO('Hora', objTranslate) || 'Hora'
  }
  if (tipoDeDato === 't') {
    tipo = trO('Texto', objTranslate) || 'Texto'
  }
  if (tipoDeDato === 'tx') {
    tipo = trO('Texto-Largo', objTranslate) || 'Texto-Largo'
  }
  if (tipoDeDato === 'n') {
    tipo = trO('Número', objTranslate) || 'Número'
  }
  if (tipoDeDato === 'b') {
    tipo = trO('Check-Box', objTranslate) || 'Check-Box'
  }
  if (tipoDeDato === 'sd') {
    tipo = trO('Select-SQL', objTranslate) || 'Select SQL'
  }
  if (tipoDeDato === 's') {
    tipo = trO('Select-Variable', objTranslate) || 'Select-Variable'
  }
  if (tipoDeDato === 'title') {
    tipo = trO('Título-Separador', objTranslate) || 'Título-Separador'
  }
  if (tipoDeDato === 'l') {
    tipo = trO('Leyenda', objTranslate) || 'Leyenda'
  }
  if (tipoDeDato === 'subt') {
    tipo = trO('Sub-Título', objTranslate) || 'Sub-Título'
  }
  if (tipoDeDato === 'img') {
    tipo = trO('Imagen', objTranslate) || 'Imagen'
  }
  if (tipoDeDato === 'cn') {
    tipo = trO('Consulta SQL', objTranslate) || 'Consulta SQL'
  }
  if (tipoDeDato === 'btnqwery') {
    tipo = trO('Botón', objTranslate) || 'Botón SQL'
  }
  if (tipoDeDato === 'x') {
    tipo = trO('Nada', objTranslate) || 'Nada'
  }
  if (tipoDeDato === 'photo') {
    tipo = trO('Foto', objTranslate) || 'Foto'
  }
  if (tipoDeDato === 'r') {
    tipo = trO('Radio', objTranslate) || 'Radio'
  }
  if (tipoDeDato === 'valid') {
    tipo = trO('Validar', objTranslate) || 'Validar'
  }
  return tipo
}

function addEditar(indice, cantidadDeRegistros) {
  if (indice > 1 && indice < cantidadDeRegistros - 1) {
    return true
  }
  return false
}

function changeOrden(indice, cantidadDeRegistros) {
  if (indice <= 1 || indice === cantidadDeRegistros - 1) {
    return 0
  }
  if (indice > 1 && indice < cantidadDeRegistros - 1) {
    if (indice === 2) {
      return 2
    }
    if (indice === cantidadDeRegistros - 2) {
      return 3
    }
    return 1
  }
}

function reconoceColumna(
  i,
  array,
  index,
  selects,
  cantidadDeRegistros,
  objTranslate
) {
  const indice = index
  let texto = ''
  let textAlign = ''
  let paddingLeft = '5px'
  let color = '#212121'
  let background = '#fff'
  let fontStyle = 'Normal'
  let add = true
  let button = false
  let imgButton = 'off'
  let buttonEditar = false
  let buttonOrden = 0
  let fontWeight = 600

  switch (i) {
    case 0:
      add = false
      break
    case 1:
      // id
      texto = array[i]
      break
    case 2:
      // control
      add = false
      break
    case 3:
      // nombre del control
      texto = array[i].toUpperCase()
      buttonEditar = addEditar(indice, cantidadDeRegistros)
      break
    case 4:
      // tipodedato
      texto = reconoceTipoDeDato(array[i], objTranslate)
      buttonEditar = addEditar(indice, cantidadDeRegistros)
      break
    case 5:
      // detalle
      texto = array[i]
      if (array[4] === 'l' || array[4] === 'subt' || array[4] === 'title') {
        background = '#ffff59'
        fontStyle = 'Italic'
        fontWeight = 600
        texto = 'El texto va en Campo'
      }
      buttonEditar = addEditar(indice, cantidadDeRegistros)
      break
    case 6:
      // activo
      if (array[i] === 's') {
        texto = 'ON'
        imgButton = 'on'
      } else if (array[i] === 'n') {
        texto = 'OFF'
      }
      texto = ''
      button = true
      break
    case 7:
      // requerido
      if (array[i] === '0') {
        texto = 'OFF'
      } else if (array[i] === '1') {
        texto = 'ON'
        imgButton = 'on'
      }
      texto = ''
      button = true
      break
    case 8:
      // visible
      if (array[i] === 's') {
        texto = 'ON'
        imgButton = 'on'
      } else if (array[i] === 'n') {
        texto = 'OFF'
      }
      texto = ''
      button = true
      break
    case 9:
      // enabled
      if (array[i] === '0') {
        texto = 'OFF'
      } else if (array[i] === '1') {
        texto = 'ON'
        imgButton = 'on'
      }
      texto = ''
      button = true
      break
    case 10:
      // orden
      texto = array[i]
      buttonOrden = changeOrden(indice, cantidadDeRegistros)
      break
    case 11:
      // separador
      if (array[4] === 'photo' && array[i] === '') {
        background = '#ff7659'
        fontStyle = 'Italic'
        fontWeight = 700
        texto = 'Add: {"width":"100","height":"100"}'
      }
      if (array[i] && array[i] !== '') {
        if (array[i].trim().charAt(0) === '{') {
          const medidas = JSON.parse(array[i])
          texto = `width: ${medidas.width} - height: ${medidas.height}`
        }
        if (array[i].trim().charAt(0) === 's') {
          texto = '--------'
        }
      }
      buttonEditar = addEditar(indice, cantidadDeRegistros)
      break
    case 12:
      // oka
      texto = array[i]
      buttonEditar = addEditar(indice, cantidadDeRegistros)
      break
    case 13:
      // valorDefecto
      texto = array[i]
      if (array[4] === 'photo' && array[i] === '') {
        background = '#ff7659'
        fontStyle = 'Italic'
        fontWeight = 700
        texto = 'Add: photo.png'
      }
      buttonEditar = addEditar(indice, cantidadDeRegistros)
      break
    case 14:
      // selector de variable

      texto = array[i]
      if (texto !== '0') {
        const filtrado = selects.filter((subArray) => subArray[0] === texto)
        texto = `${texto}-${filtrado[0][1]}`
      } else {
        texto = ''
      }
      if (array[4] === 's' && array[i] === '0') {
        background = '#ff7659'
        texto = 'Vincular variable'
        fontStyle = 'Italic'
        fontWeight = 700
      }
      buttonEditar = addEditar(indice, cantidadDeRegistros)
      break
    case 15:
      // tieneHijo
      if (array[i] === '0') {
        texto = 'OFF'
      } else if (array[i] === '1') {
        texto = 'ON'
        imgButton = 'on'
      }
      texto = ''
      button = true
      break
    case 16:
      // rutinaSql
      texto = array[i].trim()
      if (texto && texto !== '-' && texto !== '') {
        texto = 'SQL'
      } else {
        texto = ''
      }
      if (array[15] === '1' && array[i] === '') {
        background = '#ff7659'
        texto = 'Add SQL-Hijo'
        fontStyle = 'Italic'
        fontWeight = 700
      }
      buttonEditar = addEditar(indice, cantidadDeRegistros)
      break
    case 17:
      // valor sql por defecto
      texto = array[i]
      if (texto && texto !== '-' && texto !== '') {
        texto = 'SQL'
      } else {
        texto = ''
      }
      if (
        (array[4] === 'cn' ||
          array[4] === 'btnqwery' ||
          array[6] === 'btnqwery') &&
        array[i] === ''
      ) {
        background = '#ff7659'
        texto = 'Add SQL'
        fontStyle = 'Italic'
        fontWeight = 700
      }
      buttonEditar = addEditar(indice, cantidadDeRegistros)
      break
    case 18:
      // tipo de observacion
      texto = reconoceTipoDeDato(array[i], objTranslate)
      buttonEditar = addEditar(indice, cantidadDeRegistros)
      break
    case 19:
      // selector2
      if (array[18] === 's' && array[i] === '0') {
        background = '#ff7659'
      }
      texto = array[i]
      if (texto !== '0') {
        const filtrado = selects.filter((subArray) => subArray[0] === texto)
        texto = `${texto}-${filtrado[0][1]}`
      } else {
        texto = ''
      }
      buttonEditar = addEditar(indice, cantidadDeRegistros)
      break
    case 20:
      // valorDefecto22
      texto = array[i]
      buttonEditar = addEditar(indice, cantidadDeRegistros)
      break
    case 21:
      // sqlVAlorDefecto
      texto = array[i]
      if (texto && texto !== '-' && texto !== '') {
        texto = 'SQL'
      } else {
        texto = ''
      }
      buttonEditar = addEditar(indice, cantidadDeRegistros)
      break
    case 22:
      // rutinaSql
      texto = array[i]
      if (texto && texto !== '-' && texto !== '') {
        texto = 'SQL'
      } else {
        texto = ''
      }

      if (array[4] === 'sd' && array[i] === '') {
        background = '#ff7659'
        texto = 'Add SQL'
        fontStyle = 'Italic'
        fontWeight = 700
      }
      buttonEditar = addEditar(indice, cantidadDeRegistros)
      break
    case 23:
      // xxx
      add = false
      break
    default:
      // Código para manejar casos inesperados, si es necesario
      break
  }
  const propiedadesCelda = {
    indice,
    texto,
    textAlign,
    paddingLeft,
    color,
    background,
    fontStyle,
    add,
    button,
    imgButton,
    buttonEditar,
    buttonOrden,
    fontWeight,
  }
  return propiedadesCelda
}

function estiloCellCampos(celda) {
  const cell = document.createElement('td')
  cell.textContent = celda.texto
  cell.style.textAlign = celda.textAlign
  cell.style.color = celda.color
  cell.style.background = celda.background
  cell.style.fontStyle = celda.fontStyle
  cell.style.paddingLeft = '2px'
  cell.style.fontWeight = celda.fontWeight
  return cell
}

async function turnOnOff(target, objTranslate, plant) {
  const turn = await turnControl(target, plant)

  if (turn.success) {
    const nuevoArray = JSON.parse(turn.actualizado)
    viewer(target.id, nuevoArray, objTranslate, plant)
  }
}

async function addCampo(target, objTranslate, plant) {
  // console.log(target)
  const turn = await agregarCampoNuevo(target, '/addNewCampo', plant)
  const id = String(target.idLTYreporte)
  if (turn.actualizado.success) {
    const nuevoArray = JSON.parse(turn.actualizado.data)
    viewer(id, nuevoArray, objTranslate, plant)
  }
}
async function clonarReporte(target) {
  const clon = await agregarCampoNuevo(target, '/clonarReporte', null)
  if (clon.success) {
    window.location.reload()
  }
}

function subirBajar(target, objTranslate, plant) {
  const { posicion, cantidadDeRegistros, arrayOrden, item, column, id } = target
  let { posActual } = posicion
  let nuevoArray = [...arrayOrden]
  posActual = Number(posActual)
  if (posicion.upDown === 'down') {
    if (posActual < cantidadDeRegistros - 1) {
      arrayOrden.forEach((element, index) => {
        if (element.id === item) {
          nuevoArray[index].orden = posActual + 1
          nuevoArray[index + 1].orden = posActual
        }
      })
    }
  } else if (posicion.upDown === 'up') {
    if (posActual > 3) {
      arrayOrden.forEach((element, index) => {
        if (element.id === item) {
          nuevoArray[index].orden = posActual - 1
          nuevoArray[index - 1].orden = posActual
        }
      })
    }
  }
  const nuevoTarget = {
    item,
    column,
    valor: nuevoArray,
    param: 'i',
    id,
    operation: 'upDown',
  }
  turnOnOff(nuevoTarget, objTranslate, plant)
}

function editCampos(target, objTranslate, LTYselect, plant) {
  try {
    const table = document.querySelector('.tabla-campos')
    const objeto = { ...arrayGlobal.objAlertaAceptarCancelar }
    const miAlerta = new Alerta()
    miAlerta.createCRUDControles(
      objeto,
      objTranslate,
      target,
      table,
      'editar',
      (response) => {
        let valor = ''
        if (response.dato && response.dato !== 'object') {
          valor = response.dato.toLowerCase()
        }
        if (
          response.param === 'i' &&
          response.dato &&
          response.dato !== 'object'
        ) {
          valor = parseInt(response.dato)
        }
        if (response.success) {
          const nuevoTarget = {
            item: target.item,
            column: parseInt(target.column),
            valor,
            param: response.param,
            id: target.id,
            operation: 'turnOnOff',
          }
          turnOnOff(nuevoTarget, objTranslate, plant)
        }
      },
      LTYselect
    )
    const modal = document.getElementById('modalAlert')
    modal.style.display = 'block'
  } catch (error) {
    console.log(error)
  }
}

export function nuevoCampo(objTranslate, target, plant) {
  try {
    const table = document.querySelector('.tabla-campos')
    const objeto = { ...arrayGlobal.objAlertaAceptarCancelar }
    const miAlerta = new Alerta()
    miAlerta.createNewCampo(objeto, objTranslate, target, table, (response) => {
      if (response.success) {
        const nuevoTarget = {
          reporte: target.despuesDelGuion,
          idLTYreporte: parseInt(target.antesDelGuion),
          campo: response.nombre,
          orden: response.orden,
          idObservacion: response.idObservacion,
        }
        addCampo(nuevoTarget, objTranslate, plant)
      }
    })
    const modal = document.getElementById('modalAlert')
    modal.style.display = 'block'
  } catch (error) {
    console.log(error)
  }
}

const filtrarSubarrays = (arrayPrincipal) => {
  const arrayResultante = arrayPrincipal
    .map((subarray) => {
      if (subarray.length > 2 && subarray[24] !== '' && subarray[25] === 3) {
        const reporte = `${subarray[24]}-${subarray[0]}`
        return [subarray[24], reporte]
      } else {
        // console.warn(
        //   `Subarray ${JSON.stringify(
        //     subarray
        //   )} no tiene al menos 3 elementos, no se procesará.`
        // )
        return null
      }
    })
    .filter((subarray) => subarray !== null)

  return arrayResultante
}

export function clonarCamposAReporte(objTranslate, target) {
  try {
    const arrayDeDosElementos = filtrarSubarrays(arraySinDuplicados)
    const objeto = { ...arrayGlobal.objAlertaAceptarCancelar }
    const miAlerta = new Alerta()
    miAlerta.clonarCampos(
      objeto,
      objTranslate,
      target,
      arrayDeDosElementos,
      (response) => {
        // console.log(response)
        if (response.success) {
          const nuevoTarget = {
            origen: parseInt(response.dato.idOrigen),
            destino: parseInt(response.dato.idDestino),
          }

          clonarReporte(nuevoTarget)
        }
      }
    )
    const modal = document.getElementById('modalAlert')
    modal.style.display = 'block'
  } catch (error) {
    console.log(error)
  }
}

function addCeldaFilaCampo(
  array,
  index,
  selects,
  cantidadDeRegistros,
  idReporte,
  objTranslate,
  plant
) {
  try {
    const newRow = document.createElement('tr')
    let col = 0
    for (let i = 0; i < array.length; i++) {
      const celda = reconoceColumna(
        i,
        array,
        index,
        selects,
        cantidadDeRegistros,
        objTranslate
      )

      if (celda.add) {
        const cell = estiloCellCampos(celda)
        col++
        if (celda.button) {
          const img = document.createElement('img')
          img.setAttribute('class', `img-status`)
          img.src = `${SERVER}/assets/img/${celda.imgButton}.png`
          img.style.cursor = 'pointer'
          img.setAttribute('data-item', array[1])
          img.setAttribute('data-column', i)
          img.setAttribute('data-id', idReporte)
          const valor = array[i] || '0'
          let param = 's'
          img.setAttribute('data-valor', valor)
          img.addEventListener('click', (e) => {
            e.preventDefault()
            let valor = e.target.getAttribute('data-valor')
            if (valor === '0') {
              valor = '1'
              param = 'i'
            } else if (valor === '1') {
              valor = '0'
              param = 'i'
            } else if (valor === 's') {
              valor = 'n'
            } else if (valor === 'n') {
              valor = 's'
            }
            const target = {
              item: e.target.getAttribute('data-item'),
              column: e.target.getAttribute('data-column'),
              valor,
              param,
              id: e.target.getAttribute('data-id'),
              operation: 'turnOnOff',
            }
            turnOnOff(target, objTranslate, plant)
          })
          cell.appendChild(img)
        }

        if (celda.buttonEditar) {
          const img = document.createElement('img')
          img.setAttribute('class', `img-edit`)
          img.src = `${SERVER}/assets/img/icons8-edit-24.png`
          img.style.cursor = 'pointer'
          img.setAttribute('data-item', array[1])
          img.setAttribute('data-column', i)
          img.setAttribute('data-id', idReporte)
          img.setAttribute('data-col', col)
          let param = 's'
          const vacio = trO('Vacío', objTranslate) || 'Vacío'
          img.addEventListener('click', (e) => {
            e.preventDefault()
            const target = {
              item: e.target.getAttribute('data-item'),
              column: e.target.getAttribute('data-column'),
              valor: e.target.offsetParent.childNodes[0].data || vacio,
              param,
              id: e.target.getAttribute('data-id'),
              col: e.target.getAttribute('data-col'),
            }
            editCampos(target, objTranslate, selects, plant)
          })
          cell.appendChild(img)
        }

        if (celda.buttonOrden !== 0) {
          let objetoOrden = {
            id: array[1],
            orden: parseInt(celda.texto),
          }
          arrayOrden.push(objetoOrden)
          const div = document.createElement('div')
          div.setAttribute('class', 'div-orden')
          const imgDown = document.createElement('img')
          imgDown.setAttribute('class', `img-orden`)
          imgDown.src = `${SERVER}/assets/img/icons8-page-down-button-50.png`
          imgDown.style.cursor = 'pointer'
          imgDown.setAttribute('data-item', array[1])
          imgDown.setAttribute('data-column', i)
          imgDown.setAttribute('data-id', idReporte)
          imgDown.setAttribute('data-baja', celda.texto)

          imgDown.addEventListener('click', (e) => {
            e.preventDefault()
            const posicion = {
              upDown: 'down',
              posActual: celda.texto,
            }
            const target = {
              item: e.target.getAttribute('data-item'),
              column: e.target.getAttribute('data-column'),
              index,
              cantidadDeRegistros,
              id: e.target.getAttribute('data-id'),
              posicion,
              arrayOrden,
            }
            subirBajar(target, objTranslate, plant)
          })
          const imgUp = document.createElement('img')
          imgUp.setAttribute('class', `img-orden`)
          imgUp.src = `${SERVER}/assets/img/icons8-page-up-button-50.png`
          imgUp.style.cursor = 'pointer'
          imgUp.setAttribute('data-item', array[1])
          imgUp.setAttribute('data-column', i)
          imgUp.setAttribute('data-id', idReporte)
          imgUp.setAttribute('data-sube', celda.texto)
          imgUp.addEventListener('click', (e) => {
            e.preventDefault()
            const posicion = {
              upDown: 'up',
              posActual: celda.texto,
            }
            const target = {
              item: e.target.getAttribute('data-item'),
              column: e.target.getAttribute('data-column'),
              index,
              cantidadDeRegistros,
              id: e.target.getAttribute('data-id'),
              posicion,
              arrayOrden,
            }
            subirBajar(target, objTranslate, plant)
          })

          if (celda.buttonOrden === 2) {
            div.appendChild(imgDown)
          }
          if (celda.buttonOrden === 3) {
            div.appendChild(imgUp)
          }
          if (celda.buttonOrden !== 2 && celda.buttonOrden !== 3) {
            div.appendChild(imgDown)
            div.appendChild(imgUp)
          }

          cell.appendChild(div)
        }
        newRow.appendChild(cell)
      }
    }
    return newRow
  } catch (error) {
    console.log(error)
  }
}

async function viewer(selector, array, objTranslate, plant) {
  //!editar
  try {
    arrayOrden = []
    const segundaTabla = document.querySelector('.tabla-campos')
    if (segundaTabla) {
      segundaTabla.innerHTML = ''
    }

    const filtrado = array.filter((subArray) => subArray[23] === selector)
    const selects = await traerRegistros(
      'traerSelects',
      '/traerLTYcontrol',
      plant
    )
    const elemento = document.querySelector('.div-encabezadoPastillas')
    const div1 = document.querySelector('.div1')
    const span = document.createElement('span')
    span.setAttribute('id', 'idTituloDelReporte')
    div1.innerHTML = ''
    const tituloDelReporte = `${selector}-${
      trA(filtrado[0][0], objTranslate) || filtrado[0][0]
    }`
    span.innerText = tituloDelReporte
    div1.appendChild(span)
    elemento.style.display = 'block'
    if (elemento) {
      div1.setAttribute('tabindex', '-1') // O cualquier otro valor de tabindex
      div1.focus()
      const div = document.querySelector('.div2')
      div.innerHTML = ''
      const tabla = document.createElement('table')
      tabla.style.marginTop = '10px'
      tabla.setAttribute('class', 'tabla-campos')
      const thead = encabezadoCampos(encabezados, objTranslate)
      tabla.appendChild(thead)
      div.appendChild(tabla)
      const tbody = document.createElement('tbody')
      filtrado.forEach((element, index) => {
        const newRow = addCeldaFilaCampo(
          element,
          index,
          selects,
          filtrado.length,
          selector,
          objTranslate,
          plant
        )
        tbody.appendChild(newRow)
      })
      tabla.appendChild(tbody)
      div.appendChild(tabla)
    }
  } catch (error) {
    console.log(error)
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
  items,
  itm,
  img,
  indice,
  objTranslate,
  arrayControl,
  id,
  plant
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
    imagen.src = `${SERVER}/assets/img/icons8-view-30.png`
    imagen.style.cursor = 'pointer'
    imagen.setAttribute('data-index', id)
    imagen.setAttribute('data-plant', plant)
    imagen.addEventListener('click', (e) => {
      const sel = e.target.getAttribute('data-index')
      viewer(sel, arrayControl, objTranslate, plant)
    })
    cell.appendChild(imagen)
  }

  return cell
}

function estilosTbodyCell(
  element,
  index,
  objTranslate,
  arrayControl,
  id,
  plant
) {
  const newRow = document.createElement('tr')
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 1; i++) {
    const dato = trA(element[1], objTranslate) || element[1]
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
      id,
      plant
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

function completaTabla(arrayControl, objTranslate, plant) {
  const tbody = document.querySelector('tbody')
  // const cantidadDeRegistros = arrayControl.length;
  const arrayMapeado = arrayControl.map((fila) => [
    trA(fila[0], objTranslate),
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

  arraySinDuplicados = eliminarDuplicadosPorPrimerElemento(arrayFinal)

  arraySinDuplicados.forEach((element, index) => {
    const id = element[24]

    const newRow = estilosTbodyCell(
      element,
      index,
      objTranslate,
      arrayControl,
      id,
      plant
    )
    tbody.appendChild(newRow)
  })
  const tableControlViews = document.getElementById('tableControlesViews')
  tableControlViews.style.display = 'block'
}

function loadTabla(arrayControl, encabezados, objTranslate, plant) {
  const miAlerta = new Alerta()
  const arraySinDuplicados = eliminarDuplicadosPorPrimerElemento(arrayControl)

  if (arraySinDuplicados.length > 0) {
    encabezado(encabezados, objTranslate)
    completaTabla(arrayControl, objTranslate, plant)

    const cantidadDeFilas = document.querySelector('table tbody')
    let mensaje = arrayGlobal.mensajesVarios.cargarControl.fallaCarga

    if (cantidadDeFilas.childElementCount !== arraySinDuplicados.length) {
      mensaje = trO(mensaje, objTranslate) || mensaje
      miAlerta.createVerde(arrayGlobal.avisoRojo, mensaje, null)
      const modal = document.getElementById('modalAlert')
      modal.style.display = 'block'
    }
  } else {
    let mensaje =
      trO(
        'No existen controles cargados. Comuníquese con el administrador.',
        objTranslate
      ) || 'No existen controles cargados. Comuníquese con el administrador.'
    miAlerta.createVerde(arrayGlobal.avisoRojo, mensaje, objTranslate)

    let modal = document.getElementById('modalAlertVerde')
    modal.style.display = 'block'
    modal = document.querySelector('.div-encabezadoPastillas')
    modal.style.display = 'none'
    modal = document.querySelector('.div-ubicacionSearch')
    modal.style.display = 'none'
  }
}

export default function tablaVacia(
  arrayControl,
  encabezados,
  objTranslate,
  plant
) {
  // Reemplazar setTimeout con requestAnimationFrame para garantizar que el DOM esté listo
  requestAnimationFrame(() => {
    loadTabla(arrayControl, encabezados, objTranslate, plant)
  })
}
