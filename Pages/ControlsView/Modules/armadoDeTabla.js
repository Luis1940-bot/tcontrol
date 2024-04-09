// eslint-disable-next-line import/extensions
import arrayGlobal from '../../../controllers/variables.js'
// eslint-disable-next-line import/extensions
import { Alerta } from '../../../includes/atoms/alerta.js'
// eslint-disable-next-line import/extensions, import/no-useless-path-segments
import { desencriptar, encriptar } from '../../../controllers/cript.js'
// eslint-disable-next-line import/extensions
import traerRegistros from './Controladores/traerRegistros.js'

const SERVER = '../../'

let translateOperativo = []
let espanolOperativo = []
let translateArchivos = []
let espanolArchivos = []

const widthScreen = window.innerWidth
const widthScreenAjustado = 1 // 360 / widthScreen
let arrayWidthEncabezado

function trO(palabra) {
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
}

function leyendaSubtituloTitulo(
  nombreControl,
  fila,
  fontStyle,
  fontWeight,
  paddingLeft
) {
  var texto = nombreControl.charAt(0).toUpperCase() + nombreControl.slice(1)
  var contenidoFilaUnido = texto
  for (let i = 1; i <= 5; i++) {
    contenidoFilaUnido += ''
  }

  var nuevaCelda = document.createElement('td')
  nuevaCelda.colSpan = 5
  nuevaCelda.innerHTML = contenidoFilaUnido
  for (let i = 1; i <= 5; i++) {
    fila.deleteCell(0)
  }
  fila.insertBefore(nuevaCelda, fila.cells[0])
  nuevaCelda.style.textAlign = 'left'
  nuevaCelda.style.borderBottom = '1px solid #cecece'
  nuevaCelda.style.fontStyle = fontStyle
  nuevaCelda.style.fontWeight = fontWeight
  nuevaCelda.style.paddingLeft = paddingLeft
  return null
}

function generatePhoto(src, alt, dim, extension, plant) {
  // console.log(src, alt, dim, extension)
  const dimensiones = dim
  const img = document.createElement('img')
  img.src = `../../../assets/img/planos/${plant}/${src}`
  img.alt = alt
  img.dataset.extension = extension

  // Verificar si las dimensiones están presentes y no vacías
  if (dimensiones && dimensiones.trim() !== '') {
    try {
      // Utilizar JSON.parse para convertir la cadena en un objeto
      const ajustada = dimensiones.replace(
        /(['"])?([a-zA-Z0-9_]+)(['"])?:/g,
        '"$2": '
      )
      const objeto = JSON.parse(ajustada)
      // Verificar si el objeto tiene propiedades width y height
      if (objeto.width && objeto.height) {
        img.style.width = `${objeto.width}px`
        img.style.height = `${objeto.height}px`
      } else {
        // eslint-disable-next-line no-console
        console.error(
          'Las dimensiones proporcionadas no son válidas. Se aplicarán dimensiones predeterminadas.'
        )
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        'Error al analizar las dimensiones como JSON. Se aplicarán dimensiones predeterminadas.'
      )
    }
  }

  return img
}

function detectarPhoto(valor, nombreControl, fila) {
  try {
    const { plant } = desencriptar(sessionStorage.getItem('user'))
    valor = JSON.parse(valor)
    const src = valor.img
    const alt = src.replace(/\.[^/.]+$/, '')
    const parte = valor.img.split('.')
    const extension = parte.pop()
    const dimensiones = ` { width: ${valor.width}, height: ${valor.height} }`
    const img = generatePhoto(src, alt, dimensiones, extension, plant)
    var texto = nombreControl.charAt(0).toUpperCase() + nombreControl.slice(1)
    var contenidoFilaUnido = texto
    for (let i = 1; i <= 5; i++) {
      contenidoFilaUnido += ''
    }
    var nuevaCelda = document.createElement('td')
    const div = document.createElement('div')
    div.style.display = 'flex'
    div.style.alignItems = 'center'
    div.style.justifyContent = 'center'
    div.style.flexDirection = 'row'
    nuevaCelda.colSpan = 5
    const span = document.createElement('span')
    span.innerText = contenidoFilaUnido
    span.style.marginRight = '10px'
    div.appendChild(span)
    for (let i = 1; i <= 5; i++) {
      fila.deleteCell(0)
    }

    div.appendChild(img)
    nuevaCelda.appendChild(div)
    fila.insertBefore(nuevaCelda, fila.cells[0])

    nuevaCelda.style.borderBottom = '1px solid #cecece'
  } catch (error) {
    console.log(error)
  }
}

function detectarImagenes(fila, imagenes) {
  try {
    const { plant } = desencriptar(sessionStorage.getItem('user'))
    if (imagenes) {
      let cadenaJSON = imagenes
      cadenaJSON = cadenaJSON.replace(/fileName/g, '"fileName"')
      cadenaJSON = cadenaJSON.replace(/extension/g, '"extension"')
      cadenaJSON = cadenaJSON.replace(
        /("fileName": \[.*?\])\s?("extension": \[.*?\])/,
        '$1, $2'
      )
      cadenaJSON = cadenaJSON.replace(/(\w+):/g, '"$1":')
      const objeto = JSON.parse(`{${cadenaJSON}}`)
      const cantidadDeImagenes = objeto.fileName.length
      const rutaBase = `../../../../assets/Imagenes/${plant}/`
      const ul = document.createElement('ul')
      ul.style.listStyle = 'none'
      ul.style.display = 'flex'
      var contenidoFilaUnido = 'oooo'
      for (let i = 1; i <= 5; i++) {
        contenidoFilaUnido += ''
      }
      var nuevaCelda = document.createElement('td')
      const div = document.createElement('div')
      div.style.display = 'flex'
      div.style.alignItems = 'center'
      div.style.justifyContent = 'center'
      div.style.flexDirection = 'row'
      nuevaCelda.colSpan = 5
      for (let i = 1; i <= 5; i++) {
        fila.deleteCell(0)
      }
      // eslint-disable-next-line no-plusplus
      for (let n = 0; n < cantidadDeImagenes; n++) {
        const src = objeto.fileName[n]
        const extension = objeto.extension[n]
        const li = document.createElement('li')
        const img = document.createElement('img')
        img.src = `${rutaBase}${src}`
        img.alt = ''
        img.width = 20
        img.height = 20
        li.style.marginRight = '5px'
        li.appendChild(img)
        ul.appendChild(li)
      }
      div.appendChild(ul)
      nuevaCelda.appendChild(div)
      fila.insertBefore(nuevaCelda, fila.cells[0])

      nuevaCelda.style.borderBottom = '1px solid #cecece'
    }
  } catch (error) {
    console.log(error)
  }
}

function formatado(valor, tipoDeDato, nombreControl, fila, imagenes) {
  switch (tipoDeDato) {
    case 'd':
      const partes = valor.split('-')
      const fechaVuelta = `${partes[2]}-${partes[1]}-${partes[0]}`
      return fechaVuelta
    case 'h':
      return valor
    case 'b':
      if (valor === '1') {
        return 'Ok'
      } else if (valor === '0') {
        return ''
      }
      break
    case 'r':
      if (valor === '1') {
        return 'Ok'
      } else if (valor === '0') {
        return ''
      }
      break
    case 'btnQwery':
      return nombreControl
    case 'x':
      return ''
    case 'photo':
      detectarPhoto(valor, nombreControl, fila)
      return null
    case 'img':
      detectarImagenes(fila, imagenes)
      return null
    case 'l':
      var resolve = leyendaSubtituloTitulo(
        nombreControl,
        fila,
        'Italic',
        500,
        '30px'
      )
      return resolve
    case 'title':
      var resolve = leyendaSubtituloTitulo(
        nombreControl,
        fila,
        'Normal',
        700,
        '30px'
      )
      return resolve
    case 'subt':
      var resolve = leyendaSubtituloTitulo(
        nombreControl,
        fila,
        'Normal',
        700,
        '30px'
      )
      return resolve
    case 'cn':
      return nombreControl
    case 'tx':
      break
    case 'sd':
      if (valor === 'sd') {
        return nombreControl
      } else {
        return valor
      }
    default:
      return valor
  }
}

function buscaCodigo(codigo, array, columna, tipo) {
  for (let i = 0; i < array.length; i++) {
    const codigoEnFila = array[i][5].trim()
    if (codigoEnFila === codigo.trim()) {
      const valor = array[i][columna]
      const tipoDeDato = array[i][tipo]
      const nombreControl = array[i][19]
      const img = array[i][14]
      return { valor, tipoDeDato, nombreControl, img }
    }
  }
  return ''
}

function completamosTablaModal(array) {
  try {
    const tbody = document.getElementById('idTbodyModal')
    for (let i = 0; i < tbody.rows.length; i++) {
      const fila = tbody.rows[i]
      const codigo = fila.cells[5].textContent

      for (let c = 0; c < fila.cells.length; c++) {
        const celda = fila.cells[c]
        const campoConsulta = celda.textContent.trim()
        if (campoConsulta === 'RELEVAMIENTO') {
          const { valor, tipoDeDato, nombreControl, img } = buscaCodigo(
            codigo,
            array,
            3,
            4
          )
          const valorConFormato = formatado(
            valor,
            tipoDeDato,
            nombreControl,
            fila,
            img
          )
          valorConFormato !== null
            ? (celda.textContent = valorConFormato)
            : null
        } else if (campoConsulta === 'OBSERVACION') {
          const { valor, tipoDeDato, nombreControl, img } = buscaCodigo(
            codigo,
            array,
            9,
            8
          )
          const valorConFormato = formatado(
            valor,
            tipoDeDato,
            nombreControl,
            fila,
            img
          )
          valorConFormato !== null
            ? (celda.textContent = valorConFormato)
            : null
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
}

function eliminarRegistro(array, objTranslate) {
  const nuxpedido = array[1]
  const control = desencriptar(sessionStorage.getItem('listadoCtrls'))
  const miAlerta = new Alerta()
  miAlerta.createEliminaRegistro(
    arrayGlobal.objAlertaAceptarCancelar,
    nuxpedido,
    objTranslate,
    control
  )
  const modal = document.getElementById('modalAlert')
  modal.style.display = 'block'
}

async function viewer(array, objTranslate) {
  const control = desencriptar(sessionStorage.getItem('listadoCtrls'))
  const { control_N, control_T } = control
  const nuxpedido = array[1]
  const traerControl = await traerRegistros(`NuevoControl,${control_N}`, null)
  const traerNuxpedido = await traerRegistros(`ctrlCargado,${nuxpedido}`, null)
  const miAlerta = new Alerta()
  miAlerta.createMenuListControls(
    arrayGlobal.tablaEnModal,
    control,
    nuxpedido,
    traerControl,
    objTranslate
  )
  completamosTablaModal(traerNuxpedido)
  const modal = document.getElementById('modalTablaView')
  modal.style.display = 'block'
}

function abrirControl(nr) {
  try {
    const control = desencriptar(sessionStorage.getItem('listadoCtrls'))
    const { control_N, control_T } = control
    let contenido = {
      control_N,
      control_T,
      nr,
    }
    contenido = encriptar(contenido)
    sessionStorage.setItem('contenido', contenido)
    // const url = '../../../Pages/Control/index.php'
    let timestamp = new Date().getTime()
    const url = `${SERVER}/Pages/Router/rutas.php?ruta=control&v=${timestamp}`
    window.location.href = url
    // window.open(url, '_blank')
  } catch (error) {
    console.log(error)
  }
}

function estilosCell(
  alignCenter,
  paddingLeft,
  fontStyle,
  // fontWeight,
  colorText,
  // fontSize,
  element,
  index,
  arrayControl,
  objTranslate,
  tipo
) {
  const cell = document.createElement('td')

  cell.style.borderBottom = '1px solid #cecece'
  cell.style.zIndex = 2
  cell.style.textAlign = alignCenter
  cell.style.paddingLeft = paddingLeft
  cell.style.fontStyle = fontStyle
  // cell.style.fontWeight = fontWeight
  // cell.style.fontSize = fontSize
  cell.style.color = colorText

  // Crear el contenido de texto
  const content = document.createElement('span')
  content.textContent = `${element[0]} - nº ${element[1]} - ${element[2]}  -  ${element[4]}`

  // Estilos para el texto normal
  content.style.cursor = 'pointer'

  // Agregar estilos para el efecto de hover
  content.addEventListener('mouseenter', () => {
    content.style.textDecoration = 'underline'
    content.style.color = 'blue'
  })

  // Restablecer estilos cuando se quita el mouse
  content.addEventListener('mouseleave', () => {
    content.style.textDecoration = 'none'
    content.style.color = '' // Restablecer a color original
  })

  // Agregar el contenido de texto a la celda
  cell.appendChild(content)

  // Crear y agregar la imagen
  const imagen = document.createElement('img')
  imagen.setAttribute('class', 'img-view')
  imagen.setAttribute('name', 'viewer')
  imagen.style.float = 'right'
  imagen.src = '../../../assets/img/icons8-view-30.png'
  // imagen.style.height = '12px'
  // imagen.style.width = '12px'
  // imagen.style.margin = 'auto 5px auto auto'
  imagen.style.cursor = 'pointer'
  imagen.setAttribute('data-index', index)
  imagen.addEventListener('click', (e) => {
    const i = e.target.getAttribute('data-index')
    viewer(arrayControl[i], objTranslate)
  })

  // Agregar el evento de clic al contenido de la celda
  content.addEventListener('click', () => {
    content.style.color = 'blue'
    const nr = element[1].trim()
    abrirControl(nr)
  })

  // Agregar la imagen a la celda
  cell.appendChild(imagen)
  if (tipo === 4 || tipo === 7) {
    const trash = document.createElement('img')
    trash.setAttribute('class', 'img-trash')
    trash.setAttribute('name', 'trash')
    trash.style.float = 'right'
    trash.src = '../../../assets/img/icons8-trash-48.png'
    // trash.style.height = '12px'
    // trash.style.width = '12px'
    // trash.style.margin = 'auto 15px auto auto'
    trash.style.cursor = 'pointer'
    trash.setAttribute('trash-index', index)
    trash.addEventListener('click', (e) => {
      const i = e.target.getAttribute('trash-index')
      eliminarRegistro(arrayControl[i], objTranslate)
    })
    cell.appendChild(trash)
  }

  // Retornar la celda
  return cell
}

function estilosTbodyCell(element, index, arrayControl, objTranslate, tipo) {
  const newRow = document.createElement('tr')
  // eslint-disable-next-line no-plusplus
  const alignCenter = 'left'
  const paddingLeft = '10px'
  const fontStyle = 'normal'
  // const fontWeight = 500
  const background = '#ffffff'
  const colorText = '#000000'

  const cell = estilosCell(
    alignCenter,
    paddingLeft,
    fontStyle,
    // fontWeight,
    colorText,
    // fontSize,
    element,
    index,
    arrayControl,
    objTranslate,
    tipo
  )
  newRow.appendChild(cell)
  return newRow
}

function completaTabla(arrayControl, objTranslate) {
  const tbody = document.querySelector('tbody')
  // const cantidadDeRegistros = arrayControl.length;
  let { tipo } = desencriptar(sessionStorage.getItem('user'))
  tipo = parseInt(tipo, 10)
  arrayControl.forEach((element, index) => {
    const newRow = estilosTbodyCell(
      element,
      index,
      arrayControl,
      objTranslate,
      tipo
    )
    tbody.appendChild(newRow)
  })
  const tableControlViews = document.getElementById('tableControlViews')
  tableControlViews.style.display = 'block'
}

function loadTabla(arrayControl, encabezados, objTranslate) {
  const miAlerta = new Alerta()
  if (arrayControl.length > 0) {
    encabezado(encabezados)
    completaTabla(arrayControl, objTranslate)
    // array = [...arrayControl];
    const cantidadDeFilas = document.querySelector('table tbody')
    let mensaje = arrayGlobal.mensajesVarios.cargarControl.fallaCarga
    if (cantidadDeFilas.childElementCount !== arrayControl.length) {
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
