// eslint-disable-next-line import/extensions
import arrayGlobal from '../../controllers/variables.js'
// eslint-disable-next-line import/extensions, import/no-named-as-default
import translate, {
  // eslint-disable-next-line no-unused-vars
  arrayTranslateOperativo,
  // eslint-disable-next-line no-unused-vars
  arrayEspanolOperativo,
  // eslint-disable-next-line import/extensions
} from '../../controllers/translate.js'
// eslint-disable-next-line import/extensions
import guardarNuevo from '../../Pages/Control/Modules/Controladores/guardarNuevo.js'
// eslint-disable-next-line import/extensions
import traerFirma from '../../Pages/Control/Modules/Controladores/traerFirma.js'
// eslint-disable-next-line import/extensions
import guardaNotas from '../../Pages/Control/Modules/Controladores/guardaNotas.js'
// eslint-disable-next-line import/extensions
import insertarRegistro from '../../Pages/Control/Modules/Controladores/insertarRegistro.js'
// eslint-disable-next-line import/extensions
import updateRegistro from '../../Pages/Control/Modules/Controladores/updateRegistro.js'
// eslint-disable-next-line import/extensions
import enviaMail from '../../Nodemailer/sendEmail.js'
// eslint-disable-next-line import/extensions, import/no-useless-path-segments
import { encriptar, desencriptar } from '../../controllers/cript.js'
import fechasGenerator from '../../controllers/fechas.js'
import eliminarRegistro from '../../Pages/ControlsView/Modules/Controladores/eliminaRegistro.js'
// eslint-disable-next-line import/extensions
import callProcedure from '../../Pages/ConsultasViews/Controladores/callProcedure.js'
import traerRegistros from '../../Pages/ControlsView/Modules/Controladores/traerRegistros.js'
import callRove from '../../Pages/Rove/Controladores/callRove.js'
import primerRender from '../../Pages/Rove/Controladores/primerRender.js'
import cargarStandares from '../../Pages/Rove/Controladores/cargaStandares.js'
import pintaBarras from '../../Pages/Rove/Controladores/pintaBarras.js'
import dwt from '../../Pages/Rove/Controladores/dwt.js'

// const SERVER = '/iControl-Vanilla/icontrol';
const SERVER = '../../'

const objTraductor = {
  operativoES: [],
  operativoTR: [],
  archivosES: [],
  archivosTR: [],
}

const widthScreen = window.innerWidth
const widthScreenAjustado = 360 / widthScreen
let arrayWidthEncabezado
let ID = 0
let fila = 0

document.addEventListener('DOMContentLoaded', async () => {
  const persona = desencriptar(sessionStorage.getItem('user'))
  if (persona) {
    const data = await translate(persona.lng)
    const translateOperativo = data.arrayTranslateOperativo
    const espanolOperativo = data.arrayEspanolOperativo

    const translateArchivos = data.arrayTranslateArchivo
    const espanolArchivos = data.arrayEspanolArchivo

    objTraductor.operativoES = [...espanolOperativo]
    objTraductor.operativoTR = [...translateOperativo]

    objTraductor.archivosES = [...espanolArchivos]
    objTraductor.archivosTR = [...translateArchivos]

    return objTraductor
  }
  return null
})

function createButton(config) {
  const button = document.createElement('button')
  button.className = `${config.className}`
  button.textContent = config.text
  config.id !== null ? (button.id = config.id) : null
  config.display !== null ? (button.style.display = config.display) : null
  config.fontSize !== null ? (button.style.fontSize = config.fontSize) : null
  config.fontColor !== null ? (button.style.color = config.fontColor) : null
  config.backColor !== null
    ? (button.style.backgroundColor = config.backColor)
    : null
  config.marginTop !== null ? (button.style.marginTop = config.marginTop) : null
  config.marginLeft !== null
    ? (button.style.marginLeft = config.marginLeft)
    : null
  config.fontWeight !== null
    ? (button.style.fontWeight = config.fontWeight)
    : null
  config.width !== null ? (button.style.width = config.width) : null
  config.height !== null ? (button.style.height = config.height) : null
  config.cursor !== null ? (button.style.cursor = config.cursor) : null
  config.borderRadius !== null
    ? (button.style.borderRadius = config.borderRadius)
    : null
  button.style.transition = 'background-color 0.3s'
  button.addEventListener('mouseover', () => {
    button.style.backgroundColor = config.hoverBackground
    button.style.color = config.hoverColor
  })
  button.addEventListener('mouseout', () => {
    button.style.backgroundColor = config.backColor
    button.style.color = config.fontColor
  })
  button.addEventListener('click', config.onClick)

  return button
}

function createDiv(config) {
  const div = document.createElement('div')
  config.className !== null ? (div.className = config.className) : null
  config.id !== null ? (div.id = config.id) : null
  config.position !== null ? (div.style.position = config.position) : null
  config.borderRadius !== null
    ? (div.style.borderRadius = config.borderRadius)
    : null
  config.width !== null ? (div.style.width = config.width) : null
  config.height !== null ? (div.style.height = config.height) : null
  config.background !== null ? (div.style.background = config.background) : null
  config.border !== null ? (div.style.border = config.border) : null
  config.boxShadow !== null ? (div.style.boxShadow = config.boxShadow) : null
  config.margin !== null ? (div.style.margin = config.margin) : null
  config.display !== null ? (div.style.display = config.display) : null
  config.flexDirection !== null
    ? (div.style.flexDirection = config.flexDirection)
    : null
  config.padding !== null ? (div.style.padding = config.padding) : null
  config.overflow !== null ? (div.style.overflow = config.overflow) : null
  config.textAlign !== null ? (div.style.textAlign = config.textAlign) : null
  config.gap !== null ? (div.style.gap = config.gap) : null
  config.top !== null ? (div.style.top = config.top) : null
  config.cursor !== null ? (div.style.cursor = config.cursor) : null
  config.alignItems !== null ? (div.style.alignItems = config.alignItems) : null
  div.style.transition = 'background-color 0.3s'
  config.hoverColor !== null
    ? div.addEventListener('mouseover', () => {
        // div.style.color = config.hoverColor;
        div.style.backgroundColor = config.hoverBackground
      })
    : null
  config.hoverColor !== null
    ? div.addEventListener('mouseout', () => {
        // div.style.color = config.fontColor;
        div.style.backgroundColor = '#ffffff'
      })
    : null
  div.addEventListener('click', config.onClick)
  return div
}

function createSpan(config, text) {
  const span = document.createElement('span')
  const texto = text || config.text
  span.textContent = texto
  config.fontSize !== null ? (span.style.fontSize = config.fontSize) : null
  config.fontColor !== null ? (span.style.color = config.fontColor) : null
  config.id !== null ? (span.id = config.id) : null
  span.style.width = 'auto'
  config.marginTop !== null ? (span.style.marginTop = config.marginTop) : null
  config.display !== null ? (span.style.display = config.display) : null
  config.fontFamily !== null
    ? (span.style.fontFamily = config.fontFamily)
    : null
  config.fontStyle !== null ? (span.style.fontStyle = config.fontStyle) : null
  config.alignSelf !== null ? (span.style.alignSelf = config.alignSelf) : null
  config.className !== null ? (span.className = config.className) : null
  config.fontWeight !== null
    ? (span.style.fontWeight = config.fontWeight)
    : null
  config.cursor !== null ? (span.style.cursor = config.cursor) : null
  config.padding !== null ? (span.style.padding = config.padding) : null
  config.position !== null ? (span.style.position = config.position) : null
  config.top !== null ? (span.style.top = config.top) : null
  config.right !== null ? (span.style.right = config.right) : null
  config.left !== null ? (span.style.left = config.left) : null
  config.innerHTML !== null ? (span.innerHTML = config.innerHTML) : null
  config.margin !== null ? (span.style.margin = config.margin) : null
  span.style.transition = 'background-color 0.3s'
  config.hoverColor !== null
    ? span.addEventListener('mouseover', () => {
        span.style.color = config.hoverColor
      })
    : null
  config.hoverColor !== null
    ? span.addEventListener('mouseout', () => {
        span.style.color = config.fontColor
      })
    : null
  config.onClick !== null
    ? span.addEventListener('click', config.onClick)
    : null
  return span
}

function createInput(config) {
  const input = document.createElement('input')
  config.id !== null ? (input.id = config.id) : null
  input.type = config.type
  config.name !== null ? (input.name = config.id) : null
  config.value !== null ? (input.value = config.value) : null
  config.checked !== null ? (input.style.checked = config.checked) : null
  config.className !== null ? (input.className = config.className) : null
  config.height !== null ? (input.style.height = config.height) : null
  config.width !== null ? (input.style.width = config.width) : null
  config.color !== null ? (input.style.color = config.color) : null
  config.backgroundColor !== null
    ? (input.style.backgroundColor = config.backgroundColor)
    : null
  config.padding !== null ? (input.style.padding = config.padding) : null
  config.margin !== null ? (input.style.margin = config.margin) : null
  config.cursor !== null ? (input.style.cursor = config.cursor) : null
  config.borderRadius !== null
    ? (input.style.borderRadius = config.borderRadius)
    : null
  config.outline !== null ? (input.style.outline = config.outline) : null
  config.boxShadow !== null ? (input.style.boxShadow = config.boxShadow) : null
  config.textAlign !== null ? (input.style.textAlign = config.textAlign) : null
  config.fontSize !== null ? (input.style.fontSize = config.fontSize) : null
  config.fontFamily !== null
    ? (input.style.fontFamily = config.fontFamily)
    : null
  config.fontWeight !== null
    ? (input.style.fontWeight = config.fontWeight)
    : null
  config.innerHTML !== null ? (input.innerHTML = config.innerHTML) : null
  config.placeholder !== null ? (input.placeHolder = config.placeHolder) : null
  config.focus !== null ? setTimeout(() => input.focus(), 0) : null
  input.style.transition = 'background-color 0.3s'
  config.hoverColor !== null
    ? input.addEventListener('mouseover', () => {
        input.style.color = config.hoverColor
      })
    : null
  config.hoverColor !== null
    ? input.addEventListener('mouseout', () => {
        input.style.color = config.fontColor
      })
    : null
  config.onClick !== null
    ? input.addEventListener('click', config.onClick)
    : null
  input.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      // Lógica que se ejecutará al presionar "Enter"
      if (config.onEnterPress) {
        config.onEnterPress()
      }
    }
  })
  input.addEventListener('focus', () => {
    // Lógica que se ejecutará al obtener el foco
    if (config.onFocus) {
      config.onFocus()
    }
  })
  return input
}

function createLabel(config) {
  const label = document.createElement('label')
  config.id !== null ? (label.id = config.id) : null
  config.htmlFor !== null ? (label.htmlFor = config.htmlFor) : null
  config.innerText !== null ? (label.innerText = config.innerText) : null
  config.className !== null ? (label.className = config.className) : null
  config.height !== null ? (label.style.height = config.height) : null
  config.width !== null ? (label.style.width = config.width) : null
  config.color !== null ? (label.color = config.color) : null
  config.backgroundColor !== null
    ? (label.style.backgroundColor = config.backgroundColor)
    : null
  config.padding !== null ? (label.style.padding = config.padding) : null
  config.margin !== null ? (label.style.margin = config.margin) : null
  config.cursor !== null ? (label.style.cursor = config.cursor) : null
  config.borderRadius !== null
    ? (label.style.borderRadius = config.borderRadius)
    : null
  config.boxShadow !== null ? (label.style.boxShadow = config.boxShadow) : null
  config.textAlign !== null ? (label.style.textAlign = config.textAlign) : null
  config.fontSize !== null ? (label.style.fontSize = config.fontSize) : null
  config.fontColor !== null ? (label.style.fontColor = config.fontColor) : null
  config.fontFamily !== null
    ? (label.style.fontFamily = config.fontFamily)
    : null
  config.fontWeight !== null
    ? (label.style.fontWeight = config.fontWeight)
    : null
  config.innerHTML !== null ? (label.innerHTML = config.innerHTML) : null
  config.placeolder !== null ? (label.placeHolder = config.placeHolder) : null
  config.onClick !== null
    ? (label.style.transition = 'background-color 0.3s')
    : null
  config.hoverColor !== null
    ? label.addEventListener('mouseover', () => {
        label.style.color = config.hoverColor
      })
    : null
  config.hoverColor !== null
    ? label.addEventListener('mouseout', () => {
        label.style.color = config.fontColor
      })
    : null
  config.onClick !== null
    ? label.addEventListener('click', config.onClick)
    : null
  return label
}

function createH3(config, typeAlert) {
  const h3 = document.createElement('h3')
  h3.textContent = config.text[typeAlert]
  h3.style.fontSize = config.fontSize
  h3.style.fontColor = config.fontColor
  config.marginTop !== null ? (h3.style.marginTop = config.marginTop) : null
  h3.style.display = config.display
  h3.style.fontFamily = config.fontFamily
  h3.style.alignSelf = config.alignSelf
  h3.className = config.className
  return h3
}

function createHR(config) {
  const hr = document.createElement('hr')
  config.id !== null ? (hr.id = config.id) : null
  config.width !== null ? (hr.style.width = config.width) : null
  config.border !== null ? (hr.style.border = config.border) : null
  config.height !== null ? (hr.style.height = config.height) : null
  config.marginTop !== null ? (hr.style.marginTop = config.marginTop) : null
  config.backgroundColor !== null
    ? (hr.style.backgroundColor = config.backgroundColor)
    : null
  return hr
}

function createIMG(config) {
  // console.log(config)
  const img = document.createElement('img')
  config.id !== null ? (img.id = config.id) : null
  img.src = config.src
  img.className = config.className
  img.alt = config.alt
  img.height = config.height
  img.width = config.width
  config.marginRigth !== null ? (img.marginRigth = config.marginRigth) : null
  config.filter !== null ? (img.filter = config.filter) : null
  return img
}

function trO(palabra, objTranslate) {
  if (palabra === undefined || palabra === null) {
    return ''
  }
  const palabraNormalizada = palabra.replace(/\s/g, '').toLowerCase()
  const index = objTranslate.operativoES.findIndex(
    (item) =>
      item.replace(/\s/g, '').toLowerCase().trim() === palabraNormalizada.trim()
  )
  if (index !== -1) {
    return objTranslate.operativoTR[index]
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

function procesoStyleDisplay(elementosStyle) {
  if (!elementosStyle) {
    return
  }
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < elementosStyle.element.length; i++) {
    const elemento = document.getElementById(elementosStyle.element[i])
    if (elemento) {
      elemento.style.display = elementosStyle.style[i]
      const remove = elementosStyle.remove[i]
      if (remove !== null && elemento) {
        elemento.remove()
      }
    }
  }
}

const funcionGuardar = () => {
  const { habilitadoGuardar } = arrayGlobal
  if (habilitadoGuardar) {
    // eslint-disable-next-line no-use-before-define
    const miAlerta = new Alerta()
    const obj = arrayGlobal.objAlertaAceptarCancelar
    miAlerta.createAlerta(obj, objTraductor, 'guardar')
    const elementosStyle = {
      element: ['modalAlert'],
      style: ['block'],
      remove: [null],
    }
    procesoStyleDisplay(elementosStyle)
  } else {
    // eslint-disable-next-line no-use-before-define
    const miAlerta = new Alerta()
    const obj = arrayGlobal.avisoRojo
    const texto = arrayGlobal.mensajesVarios.guardar.sinModificaciones
    miAlerta.createVerde(obj, texto, objTraductor)
    const elementosStyle = {
      element: ['modalAlertVerde'],
      style: ['block'],
      remove: [null],
    }
    procesoStyleDisplay(elementosStyle)
  }
}
const funcionGuardarCambio = () => {
  arrayGlobal.habilitadoGuardar = true
  const { habilitadoGuardar } = arrayGlobal
  if (habilitadoGuardar) {
    // eslint-disable-next-line no-use-before-define
    const miAlerta = new Alerta()
    const obj = arrayGlobal.objAlertaAceptarCancelar
    miAlerta.createAlerta(obj, objTraductor, 'guardarCambio')
    const elementosStyle = {
      element: ['modalAlert'],
      style: ['block'],
      remove: [null],
    }
    procesoStyleDisplay(elementosStyle)
  } else {
    // eslint-disable-next-line no-use-before-define
    const miAlerta = new Alerta()
    const obj = arrayGlobal.avisoRojo
    const texto = arrayGlobal.mensajesVarios.guardar.sinModificaciones
    miAlerta.createVerde(obj, texto, objTraductor)
    const elementosStyle = {
      element: ['modalAlertVerde'],
      style: ['block'],
      remove: [null],
    }
    procesoStyleDisplay(elementosStyle)
  }
}
const funcionGuardarComoNuevo = () => {
  arrayGlobal.habilitadoGuardar = true
  sessionStorage.setItem('doc', null)
  const { habilitadoGuardar } = arrayGlobal
  if (habilitadoGuardar) {
    // eslint-disable-next-line no-use-before-define
    const miAlerta = new Alerta()
    const obj = arrayGlobal.objAlertaAceptarCancelar
    miAlerta.createAlerta(obj, objTraductor, 'guardarComoNuevo')
    const elementosStyle = {
      element: ['modalAlert'],
      style: ['block'],
      remove: [null],
    }
    procesoStyleDisplay(elementosStyle)
    arrayGlobal.habilitadoGuardar = false
  } else {
    // eslint-disable-next-line no-use-before-define
    const miAlerta = new Alerta()
    const obj = arrayGlobal.avisoRojo
    const texto = arrayGlobal.mensajesVarios.guardar.sinModificaciones
    miAlerta.createVerde(obj, texto, objTraductor)
    const elementosStyle = {
      element: ['modalAlertVerde'],
      style: ['block'],
      remove: [null],
    }
    procesoStyleDisplay(elementosStyle)
  }
}
const funcionRefrescar = () => {
  const url = new URL(window.location.href)
  window.location.href = url.href
}
const funcionHacerFirmar = () => {
  // eslint-disable-next-line no-use-before-define
  const miAlertaFirmar = new Alerta()
  const obj = arrayGlobal.objAlertaAceptarCancelar
  miAlertaFirmar.createFirma(obj, objTraductor, 'firmar')
  const elementosStyle = {
    element: ['modalAlert'],
    style: ['block'],
    remove: [null],
  }
  procesoStyleDisplay(elementosStyle)
}
const funcionSalir = () => {
  window.close()
}

const funcionExportarExcel = () => {
  try {
    const tabla = document.getElementById('tableConsultaViews')
    const wb = XLSX.utils.table_to_book(tabla, { sheet: 'Sheet JS' })
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([wbout], { type: 'application/octet-stream' })
    const nameConsulta = document.getElementById('whereUs').textContent
    // Crear un enlace y simular un clic en él
    const a = document.createElement('a')
    const url = URL.createObjectURL(blob)
    a.href = url
    const fechaDeHoy = fechasGenerator.fecha_larga_ddmmyyyyhhmm(new Date())
    a.download = `${nameConsulta} ${fechaDeHoy}.xlsx` // Nombre predeterminado

    // Abrir una ventana emergente para que el usuario elija la ubicación y el nombre del archivo
    a.addEventListener('click', () => {
      setTimeout(() => {
        URL.revokeObjectURL(url)
      }, 100)
    })

    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => {
      const menu = document.getElementById('modalAlertM')
      menu.style.display = 'none'
      menu.remove()
    }, 100)
  } catch (error) {
    console.log(error)
  }
}

const funcionExportarPDF = () => {
  try {
    // Obtener la tabla
    const tabla = document.getElementById('tableConsultaViews')
    html2canvas(tabla)
      .then((canvas) => {
        const nameConsulta = document.getElementById('whereUs').textContent
        const imgData = canvas.toDataURL('image/png', 1.0)
        const pdf = new jsPDF('p', 'pt', 'a4')
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width // Calcular la altura en función de la relación de aspecto de la imagen
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
        // pdf.addImage(imgData, 'PNG', 0, 0)
        const fechaDeHoy = fechasGenerator.fecha_larga_ddmmyyyyhhmm(new Date())
        pdf.save(`${nameConsulta} ${fechaDeHoy}.pdf`)
      })
      .catch((error) => {
        console.error('Error en html2canvas:', error)
      })
    setTimeout(() => {
      const menu = document.getElementById('modalAlertM')
      menu.style.display = 'none'
      menu.remove()
    }, 100)
  } catch (error) {
    console.log(error)
  }
}

const funcionExportarJSON = () => {
  try {
    const tbody = document
      .getElementById('tableConsultaViews')
      .getElementsByTagName('tbody')[0]
    const thead = document
      .getElementById('tableConsultaViews')
      .getElementsByTagName('thead')[0]
    const columnNames = Array.from(thead.getElementsByTagName('th')).map(
      (th) => th.innerText
    )
    const rows = tbody.getElementsByTagName('tr')
    const jsonData = []
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName('td')
      const rowData = {}

      for (let j = 0; j < cells.length; j++) {
        rowData[columnNames[j]] = cells[j].innerText
      }

      jsonData.push(rowData)
    }
    // Crear un formulario dinámicamente
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = '../../Routes/viewJson.php'
    form.target = '_blank'

    // Adjuntar los datos al formulario
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = 'data'
    input.value = JSON.stringify(jsonData)
    form.appendChild(input)

    // Adjuntar el formulario al cuerpo del documento
    document.body.appendChild(form)

    // Enviar el formulario
    form.submit()

    // Remover el formulario del cuerpo del documento (opcional)
    document.body.removeChild(form)
    setTimeout(() => {
      const menu = document.getElementById('modalAlertM')
      menu.style.display = 'none'
      menu.remove()
    }, 100)
  } catch (error) {
    console.log(error)
  }
}

const funcionApi = () => {
  try {
    const { procedure, desde, hasta } = desencriptar(
      sessionStorage.getItem('api')
    )

    console.log(desencriptar(sessionStorage.getItem('api')))
    const url = window.location.host
    let ruta = ''
    if (desde === null || hasta === null) {
      ruta = `${url}/Pages/Api/${procedure}*`
    } else {
      ruta = `${url}/Pages/Api/${procedure}/${desde}/${hasta}`
    }
    const mensaje0 = document.getElementById('idMensajeInstructivo')
    mensaje0.style.display = 'block'
    const mensajeCopiado = document.getElementById('idMensajeCopiado')
    mensajeCopiado.textContent = ruta
    const elementoTemporal = document.createElement('textarea')
    elementoTemporal.value = ruta
    document.body.appendChild(elementoTemporal)
    elementoTemporal.select()
    navigator.clipboard
      .writeText(ruta)
      .then(() => {
        // console.log('Ruta copiada al portapapeles:', ruta)
      })
      .catch((err) => {
        console.error('Error al copiar la ruta al portapapeles:', err)
      })
      .finally(() => {
        // Eliminar el elemento temporal
        document.body.removeChild(elementoTemporal)
      })
  } catch (error) {
    console.log(error)
  }
}

async function firmar(firmadoPor) {
  const pass = document.getElementById('idInputFirma').value
  const supervisor = await traerFirma(pass)

  const modal = document.getElementById('modalAlert')
  modal.style.display = 'none'
  modal.remove()
  if (supervisor.id !== null) {
    const idMensajeFirmado = document.getElementById('idMensajeFirmado')
    idMensajeFirmado.innerText = `${firmadoPor}: ${supervisor.nombre}`
    const elementosStyle = {
      element: ['idMensajeFirmado', 'idDivFirmar', 'idDivFirmado'],
      style: ['block', 'none', 'block'],
      remove: [null, null, null],
    }
    procesoStyleDisplay(elementosStyle)

    sessionStorage.setItem('firmado', encriptar(supervisor))
    const configMenu = {
      guardar: true,
      guardarComo: false,
      guardarCambios: false,
      firma: false,
      configFirma: supervisor,
    }

    sessionStorage.setItem('config_menu', encriptar(configMenu))
  }
  setTimeout(() => {
    const menu = document.getElementById('modalAlertM')
    menu.style.display = 'none'
    menu.remove()
  }, 1000)
}

function limpiaArrays() {
  const existenciaControl = arrayGlobal.objetoControl.valor.length
  const recarga = existenciaControl > 0
  if (recarga) {
    Object.keys(arrayGlobal.objetoControl).forEach((clave) => {
      arrayGlobal.objetoControl[clave] = []
    })
  }
}

function convertirObjATextPlano(obj) {
  const data = { ...obj }
  delete data.objImagen
  const lines = []

  // Iterar sobre las claves del objeto
  Object.keys(data).forEach((key) => {
    // Obtener el valor asociado a la clave
    const values = data[key]

    // Crear una línea de texto concatenando la clave y sus valores
    const line = `${key}: ${JSON.stringify(values).replace(/\\/g, '')}`

    // Agregar la línea al arreglo
    lines.push(line)
  })

  // Convertir el arreglo de líneas a un solo texto con saltos de línea
  const plainText = lines.join('\n')

  return plainText
}

function subirImagenes(img, plant) {
  if (img.length === 0) {
    return null
  }
  if (img[0].extension.length === 0) {
    return null
  }

  img[0].plant = plant

  const formData = new FormData()
  formData.append('imgBase64', JSON.stringify(img[0])) // encodeURIComponent
  // console.log(formData);
  fetch(`${SERVER}/Routes/Imagenes/photo_upload.php`, {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      // eslint-disable-next-line no-console
      console.log('Respuesta del servidor:', data)
      return data
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error al enviar la imagen:', error)
    })
  return null
}

function cartelVerdeInsertado(
  typeAlert,
  objeto,
  modalContent,
  objTrad,
  mensaje,
  insertado,
  modal,
  enviado
) {
  const obj = objeto
  let span = document.getElementById('idSpanAvisoVerde')
  span.style.display = 'none'
  let texto = trO(mensaje[typeAlert], objTrad) || mensaje[typeAlert]
  obj.span.text = texto
  // obj.span.fontSize = '16px'
  obj.span.fontColor = '#ececec'
  obj.span.fontWeight = '700'
  obj.span.marginTop = '10px'
  span = createSpan(obj.close)
  modalContent.appendChild(span)
  const spanTitulo = createSpan(obj.span, texto)
  modalContent.appendChild(spanTitulo)

  let frase = ''
  texto = trO(mensaje.cantidadRegistros, objTrad) || mensaje.cantidadRegistros
  frase = `${texto} ${insertado.registros}`
  texto = trO(mensaje.items, objTrad) || mensaje.items
  frase = `${frase} ${texto}`
  obj.span.text = frase
  // obj.span.fontSize = '14px'
  obj.span.fontColor = '#ececec'
  obj.span.fontWeight = '500'
  obj.span.marginTop = '0px'
  obj.span.id = 'idSpanAvisoVerde2'
  let spanTexto = createSpan(obj.span, frase)
  modalContent.appendChild(spanTexto)
  texto = trO(mensaje.documento, objTrad) || mensaje.documento
  frase = `${texto} ${insertado.documento}.`
  obj.span.text = frase
  // obj.span.fontSize = '14px'
  obj.span.fontColor = '#ececec'
  obj.span.fontWeight = '500'
  obj.span.marginTop = '0px'
  obj.span.id = 'idSpanAvisoVerde3'
  spanTexto = createSpan(obj.span, frase)
  modalContent.appendChild(spanTexto)
  modal.appendChild(modalContent)
  if (enviado) {
    texto = trO(mensaje.enviado, objTrad) || mensaje.enviado
    frase = `${texto}`
    obj.span.text = frase
    // obj.span.fontSize = '14px'
    obj.span.fontColor = '#ececec'
    obj.span.fontWeight = '500'
    obj.span.marginTop = '0px'
    obj.span.id = 'idSpanAvisoVerde4'
    spanTexto = createSpan(obj.span, frase)
    modalContent.appendChild(spanTexto)
    modal.appendChild(modalContent)
  }
  document.body.appendChild(modal)
}

function cartelRojoInsertado(
  typeAlert,
  objeto,
  modalContent,
  objTrad,
  mensaje,
  modal
) {
  const obj = objeto
  let span = document.getElementById('idSpanAvisoVerde')
  span.style.display = 'none'
  const texto = trO(mensaje[typeAlert], objTrad) || mensaje[typeAlert]
  obj.span.text = texto
  // obj.span.fontSize = '16px'
  obj.span.fontColor = '#ececec'
  obj.span.fontWeight = '700'
  obj.span.marginTop = '10px'
  const spanTitulo = createSpan(obj.span, texto)
  modalContent.appendChild(spanTitulo)
  span = createSpan(obj.close)
  modalContent.appendChild(span)
  const frase = trO(mensaje.fail, objTrad) || mensaje.fail
  obj.span.text = frase
  // obj.span.fontSize = '14px'
  obj.span.fontColor = '#ececec'
  obj.span.fontWeight = '500'
  obj.span.marginTop = '0px'
  obj.span.id = 'idSpanAvisoVerde2'
  const spanTexto = createSpan(obj.span, frase)
  modalContent.appendChild(spanTexto)
  modal.appendChild(modalContent)
  document.body.appendChild(modal)
}

function informe(
  convertido,
  insertado,
  imagenes,
  enviado,
  miAlerta,
  objTrad,
  mod
) {
  const modal = mod
  const mensaje = arrayGlobal.mensajesVarios.guardar
  const obj = arrayGlobal.procesoExitoso
  modal.style.background = 'rgba(224, 220, 220, 0.7)'
  if (insertado.success) {
    obj.div.background = '#21D849'
    const modalContent = createDiv(obj.div)
    const typeAlert = 'success'
    cartelVerdeInsertado(
      typeAlert,
      obj,
      modalContent,
      objTrad,
      mensaje,
      insertado,
      modal,
      enviado.success
    )

    const documento = document.getElementById('doc').textContent
    if (documento.trim() === 'Doc:') {
      document.getElementById('doc').innerText = `Doc: ${insertado.documento}`
    }
    const resultado = documento.match(/Doc:\s*(\d+)/)
    if (resultado) {
      const numeroExtraido = resultado[1]
      if (insertado.documento.trim() !== numeroExtraido.trim()) {
        document.getElementById('doc').innerText = `Doc: ${insertado.documento}`
      }
    }

    sessionStorage.setItem('doc', encriptar(insertado.documento))
    const configMenuStorage = desencriptar(
      sessionStorage.getItem('config_menu')
    )
    let datoDeFirma = 'x'
    if (configMenuStorage !== false) {
      if (
        Object.prototype.toString.call(configMenuStorage.configFirma) ===
        '[object Object]'
      ) {
        datoDeFirma = configMenuStorage
      }
    }
    const configMenu = {
      guardar: true,
      guardarComo: false,
      guardarCambios: false,
      firma: false,
      configFirma: datoDeFirma,
    }
    configMenu.guardar = false
    configMenu.guardarComo = true
    configMenu.guardarCambios = true
    configMenu.configFirma = {
      ...configMenu.configFirma,
      ...configMenuStorage.configFirma,
    }

    sessionStorage.setItem('config_menu', encriptar(configMenu))

    limpiaArrays()
    guardaNotas(convertido)
  } else {
    obj.div.background = '#D82137'
    const modalContent = createDiv(obj.div)
    const typeAlert = 'ups'
    cartelRojoInsertado(typeAlert, obj, modalContent, objTrad, mensaje, modal)
    limpiaArrays()
  }
  // Agregar el modal al body del documento
  document.body.appendChild(modal)
}

async function insert(
  nuevoObjeto,
  convertido,
  objEncabezados,
  miAlertaInforme,
  objTrad,
  modal,
  docStorage
) {
  try {
    const { plant } = desencriptar(sessionStorage.getItem('user'))
    const nuevoObjetoControl = { ...nuevoObjeto }
    delete nuevoObjetoControl.name
    delete nuevoObjetoControl.email
    delete nuevoObjetoControl.detalle
    delete nuevoObjetoControl.objImagen

    let insertado
    if (docStorage === false) {
      insertado = await insertarRegistro(nuevoObjetoControl)
    } else {
      insertado = await updateRegistro(nuevoObjetoControl, docStorage)
    }

    // console.log(insertado);

    const imagenes = await subirImagenes(nuevoObjeto.objImagen, plant)
    // console.log(imagenes);

    const enviaPorEmail = sessionStorage.getItem('envia_por_email')
    const encabezados = { ...objEncabezados }
    encabezados.documento = insertado.documento
    let enviado = ''
    if (enviaPorEmail) {
      enviado = await enviaMail(nuevoObjeto, encabezados, plant)
      // console.log(enviado);
    }
    const amarillo = document.getElementById('idDivAvisoVerde')
    amarillo.style.display = 'none'
    informe(
      convertido,
      insertado,
      imagenes,
      enviado,
      miAlertaInforme,
      objTrad,
      modal
    )
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error:', error)
  }
}

function armaEncabezado(arrayMensajes, objTrad, docStorage) {
  const encabezadosEmail = arrayMensajes.objetoControl.email
  let mensaje = arrayMensajes.mensajesVarios.email.fechaDeAlerta
  const fechaDeAlerta = trO(mensaje, objTrad) || mensaje
  mensaje = arrayMensajes.mensajesVarios.email.horaDeAlerta
  const horaDeAlerta = trO(mensaje, objTrad) || mensaje
  mensaje = arrayMensajes.mensajesVarios.email.notifica
  const notifica = trO(mensaje, objTrad) || mensaje
  mensaje = arrayMensajes.mensajesVarios.email.sistema
  const sistema = trO(mensaje, objTrad) || mensaje
  mensaje = arrayMensajes.mensajesVarios.email.irA
  const irA = trO(mensaje, objTrad) || mensaje
  mensaje = arrayMensajes.mensajesVarios.email.concepto
  const concepto = trO(mensaje, objTrad) || mensaje
  mensaje = arrayMensajes.mensajesVarios.email.relevamiento
  const relevamiento = trO(mensaje, objTrad) || mensaje
  mensaje = arrayMensajes.mensajesVarios.email.detalle
  const detalle = trO(mensaje, objTrad) || mensaje
  mensaje = arrayMensajes.mensajesVarios.email.observacion
  const observacion = trO(mensaje, objTrad) || mensaje
  mensaje = arrayMensajes.mensajesVarios.email.subject
  const subject = trO(mensaje, objTrad) || mensaje
  mensaje = arrayMensajes.mensajesVarios.email.titulo
  const titulo = trO(mensaje, objTrad) || mensaje
  const encabezados = {
    documento: docStorage,
    address: encabezadosEmail.address,
    fecha: encabezadosEmail.fecha,
    hora: encabezadosEmail.hora,
    notificador: encabezadosEmail.notificador,
    planta: encabezadosEmail.planta,
    reporte: encabezadosEmail.reporte,
    titulo,
    url: encabezadosEmail.url,
    fechaDeAlerta,
    horaDeAlerta,
    notifica,
    sistema,
    irA,
    concepto,
    relevamiento,
    detalle,
    observacion,
    subject,
  }

  return encabezados
}

function formatarMenu(doc, configMenu, objTranslate) {
  let firmado = undefined
  let count = 0
  if (
    configMenu &&
    configMenu.configFirma &&
    typeof configMenu.configFirma === 'object'
  ) {
    // Verificar si configFirma es un objeto y no un string
    if (
      Object.prototype.toString.call(configMenu.configFirma) ===
      '[object Object]'
    ) {
      for (let key in configMenu.configFirma) {
        if (configMenu.configFirma.hasOwnProperty(key)) {
          count++
        }
      }
      count > 1 ? (firmado = true) : (firmado = false)
    }
  }

  let elementosStyle
  let nuevoConfigMenu
  if ((doc === 'null' && firmado === undefined) || firmado === false) {
    //! console.log('menu básico sin doc');
    nuevoConfigMenu = {
      guardar: true,
      guardarComo: false,
      guardarCambios: false,
      firma: true,
      configFirma: 'x',
    }
    elementosStyle = {
      element: [
        'idDivGuardarCambio',
        'idDivGuardarComoNuevo',
        'idHrGuardarCambio',
        'idHrGuardarComoNuevo',
        'idDivFirmado',
      ],
      style: ['none', 'none', 'none', 'none', 'none'],
      remove: [null, null, null, null, null],
    }
  }
  if (doc === 'null' && firmado === true) {
    //! console.log('menú con firma sin doc');
    const textFirmado = arrayGlobal.objMenu.mensajeFirmado.text
    const firmadoPor = trO(textFirmado, objTranslate) || textFirmado
    const idMensajeFirmado = document.getElementById('idMensajeFirmado')
    idMensajeFirmado.innerText = `${firmadoPor}: ${configMenu.configFirma['nombre']}`
    idMensajeFirmado.style.display = 'flex'
    nuevoConfigMenu = {
      guardar: configMenu.guardar,
      guardarComo: configMenu.guardarComo,
      guardarCambios: configMenu.guardarCambios,
      firma: configMenu.firma,
      configFirma: configMenu.configFirma,
    }
    elementosStyle = {
      element: [
        'idMensajeFirmado',
        'idDivFirmar',
        'idDivFirmado',
        'idDivGuardarCambio',
        'idDivGuardarComoNuevo',
        'idHrGuardarCambio',
        'idHrGuardarComoNuevo',
        'idMensaje2',
      ],
      style: ['flex', 'none', 'flex', 'none', 'none', 'none', 'none', 'none'],
      remove: [null, null, null, null, null, null, null, null],
    }
  }
  if ((doc !== 'null' && firmado === undefined) || firmado === false) {
    //! console.log('menú guardado con doc y  sin firma');
    nuevoConfigMenu = {
      guardar: false,
      guardarComo: true,
      guardarCambios: true,
      firma: false,
      configFirma: 'x',
    }
    sessionStorage.setItem('config_menu', encriptar(nuevoConfigMenu))
    elementosStyle = {
      element: [
        'idDivGuardar',
        'idHrGuardar',
        'idDivGuardarCambio',
        'idDivGuardarComoNuevo',
        'idHrGuardarCambio',
        'idHrGuardarComoNuevo',
        'idDivFirmado',
        'idMensajeFirmado',
        'idDivFirmar',
      ],
      style: [
        'none',
        'none',
        'flex',
        'flex',
        'flex',
        'flex',
        'none',
        'flex',
        'flex',
      ],
      remove: [null, null, null, null, null, null, null, null, null],
    }
  }
  if (doc !== 'null' && firmado === true) {
    //! console.log('menú guardado con firma');
    const nombreFirma = configMenu.configFirma['nombre']
    const textFirmado = arrayGlobal.objMenu.mensajeFirmado.text
    const firmadoPor = trO(textFirmado, objTranslate) || textFirmado
    const idMensajeFirmado = document.getElementById('idMensajeFirmado')
    idMensajeFirmado.innerText = `${firmadoPor}: ${nombreFirma}`
    idMensajeFirmado.style.display = 'flex'
    nuevoConfigMenu = {
      guardar: false,
      guardarComo: true,
      guardarCambios: true,
      firma: false,
      configFirma: configMenu.configFirma,
    }
    sessionStorage.setItem('config_menu', encriptar(nuevoConfigMenu))
    elementosStyle = {
      element: [
        'idDivGuardar',
        'idHrGuardar',
        'idDivGuardarCambio',
        'idDivGuardarComoNuevo',
        'idHrGuardarCambio',
        'idHrGuardarComoNuevo',
        'idDivFirmado',
        'idMensajeFirmado',
        'idDivFirmar',
      ],
      style: [
        'none',
        'none',
        'flex',
        'flex',
        'flex',
        'flex',
        'flex',
        'flex',
        'none',
      ],
      remove: [null, null, null, null, null, null, null, null, null],
    }
  }
  procesoStyleDisplay(elementosStyle)
}

function estilosTheadCell(element, index, arrayWidthEncabezado) {
  const cell = document.createElement('th')
  cell.textContent = element
  // trO(element.toUpperCase(), objTrad) || element.toUpperCase()
  cell.style.background = '#000000'
  cell.style.border = '1px solid #cecece'
  cell.style.overflow = 'hidden'

  const widthCell =
    widthScreenAjustado * widthScreen * arrayWidthEncabezado[index]

  // let size = '8px'
  // if (widthScreen >= 800) {
  //   size = '10px'
  // }
  // cell.style.fontSize = size
  cell.style.width = `${widthCell}px`
  widthCell === 0 ? (cell.style.display = 'none') : null

  return cell
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
  arrayWidthEncabezado,
  index
) {
  const cell = document.createElement('td')
  const widthCell =
    widthScreenAjustado * widthScreen * arrayWidthEncabezado[index]
  let dato = ''
  if (type === 'link' && datos instanceof HTMLAnchorElement) {
    cell.appendChild(datos)
  } else {
    typeof datos === 'string' &&
    datos !== null &&
    datos.toLocaleLowerCase() !== 'observacion'
      ? (dato = trA(datos, objTrad) || datos)
      : (dato = datos)
    if (dato !== null && type === null) {
      cell.textContent = `${dato} ${requerido}` || `${dato} ${requerido}`
    } else if (dato === null && type !== null) {
      cell.appendChild(type)
    }
  }

  cell.style.borderBottom = '1px solid #cecece'
  // cell.style.background = background;
  cell.style.zIndex = 2
  cell.style.textAlign = alignCenter
  cell.style.paddingLeft = paddingLeft
  cell.style.fontStyle = fontStyle
  cell.style.fontWeight = fontWeight
  cell.style.color = colorText

  colSpan === 1 ? (cell.colSpan = 4) : null
  colSpan === 2 ? (cell.style.display = 'none') : null
  colSpan === 3 ? (cell.colSpan = 3) : null
  colSpan === 4 ? (cell.style.display = 'none') : null
  colSpan === 5 ? (cell.colSpan = 3) : null
  display !== null ? (cell.style.display = display) : null
  cell.style.width = `${widthCell}px`
  return cell
}

function estilosTbodyCell(
  element,
  index,
  cantidadDeRegistros,
  objTrad,
  arrayWidthEncabezado
) {
  const newRow = document.createElement('tr')
  for (let i = 0; i < 6; i++) {
    const orden = [0, 3, 4, 6, 7, 1]
    let dato = element[orden[i]]
    const tipoDeDato = element[5]
    const tipoDeObservacion = element[9]
    let alignCenter = 'left'
    let paddingLeft = '5px'
    let colSpan = 0
    let fontStyle = 'normal'
    let fontWeight = 500
    let background = '#ffffff'
    let type = null
    let colorText = '#000000'
    let requerido = ''
    let display = null
    if (i === 0) {
      ID += 1
      dato = ID
      alignCenter = 'center'
    }
    if (i === 5) {
      display = 'none'
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
      arrayWidthEncabezado,
      i
    )
    newRow.appendChild(cell)
  }
  return newRow
}

async function handleClickEnlace(dato) {
  const control = await traerRegistros(`controlNT,${dato}`)
  const control_N = control[0][0]
  const control_T = control[0][1]
  let contenido = {
    control_N,
    control_T,
    nr: dato,
  }
  contenido = encriptar(contenido)
  sessionStorage.setItem('contenido', contenido)

  const url = '../../Pages/Control/index.php'
  const ruta = `${url}?v=${Math.round(Math.random() * 10)}`
  window.open(ruta, '_blank')
}

function generarUrlParaEnlace(dato) {
  const link = document.createElement('a')
  link.href = '#' // Reemplaza con la lógica real para generar la URL del enlace
  link.textContent = dato
  link.style.color = 'blue' // Establece el color del enlace, puedes personalizar según tus necesidades
  link.style.textDecoration = 'underline' // Subraya el enlace
  link.classList.add('nr')
  // link.target = '_blank'
  link.addEventListener('click', function (event) {
    event.preventDefault()
    handleClickEnlace(dato)
  })
  return link
}

function estilosTbodyCellConsulta(
  element,
  index,
  cantidadDeRegistros,
  objTranslate,
  arrayWidthEncabezado,
  filaDoc
) {
  const newRow = document.createElement('tr')
  for (let i = 0; i < cantidadDeRegistros; i++) {
    let dato = element[i]
    let type = null
    if (!isNaN(filaDoc) && filaDoc === i) {
      dato = generarUrlParaEnlace(dato)
      type = 'link'
    }
    let alignCenter = 'left'
    let paddingLeft = '5px'
    let colSpan = 0
    let fontStyle = 'normal'
    let fontWeight = 500
    let background = '#ffffff'
    // let type = null
    let colorText = '#000000'
    let requerido = ''
    let display = null
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
      null,
      arrayWidthEncabezado,
      i
    )
    newRow.appendChild(cell)
  }
  return newRow
}

function printDiv() {
  let objeto = document.getElementById('idDivTablas') // Obtén el objeto a imprimir
  let ventana = window.open('', '_blank') // Abre una ventana vacía nueva
  ventana.document.write(objeto.innerHTML) // Imprime el HTML del objeto en la nueva ventana
  ventana.document.close() // Cierra el documento
  let style = ventana.document.createElement('style')
  style.innerHTML = `
  @media print {
    /* Estilos de impresión personalizados */
    body {
      margin: 10mm; /* Márgenes de impresión */
      color: #333;
      background-color: #fff; 
    }
    #idDivTablas {
      border: 1px solid #ccc; /* Borde para el contenedor principal */
      padding: 10px; /* Espaciado interno */
    }
    #idDivTablasEncabezado {
      visibility: hidden;
      display: none;
    }
    #idCloseModal {
        visibility: hidden;
        display: none;
    }
    h3 {
       margin-top: 5mm;
    }
    #idTablaViewer {
      width: 100%;
      margin: 0 auto;
    }
    @page {
      size: auto;
      margin: 0;
    }
  }
`
  ventana.document.head.appendChild(style)
  ventana.print() // Imprime la ventana
  ventana.close() // Cierra la ventana
}

async function eliminarR(objTraductor) {
  const nux = document.getElementById('idEliminaRegistro')
  let registro = nux.textContent
  const matches = registro.match(/\d+/)
  registro = matches ? parseInt(matches[0], 10) : null
  const deleteados = await eliminarRegistro(registro)
  let modal = document.getElementById('modalAlert')
  modal.style.display = 'none'
  modal.remove()
  const miAlerta = new Alerta()
  let obj = arrayGlobal.avisoRojo
  obj.div.width = '80%'
  obj.close.id = 'idCloseDeleteado'
  let texto = trO(deleteados.message, objTraductor) || deleteados.message
  texto = `${texto}: ${registro}`
  miAlerta.createVerde(obj, texto, null)
  modal = document.getElementById('modalAlertVerde')
  modal.style.display = 'block'
  const closeModalButton = document.getElementById('idCloseDeleteado')
  closeModalButton.addEventListener('click', () => {
    // Se ejecutará después de que se haga clic en el botón de cierre del modal
    window.location.reload()
  })
}

class Alerta {
  constructor() {
    this.modal = null
  }

  createAlerta(objeto, objTrad, typeAlert) {
    // Crear el elemento modal
    const obj = objeto
    this.modal = document.createElement('div')
    this.modal.id = 'modalAlert'
    this.modal.className = 'modal'
    this.modal.style.background = 'rgba(0, 0, 0, 0.5)'
    // Crear el contenido del modal
    if (typeAlert === 'guardar') {
      obj.divContent.height = '210px'
    }
    if (typeAlert === 'guardarCambio') {
      obj.divContent.height = '210px'
    }

    const modalContent = createDiv(obj.divContent)

    const span = createSpan(obj.close)
    modalContent.appendChild(span)

    let texto =
      trO(obj.titulo.text[typeAlert], objTrad) || obj.titulo.text[typeAlert]
    obj.titulo.text[typeAlert] = texto
    const title = createH3(obj.titulo, typeAlert)
    modalContent.appendChild(title)

    texto = trO(obj.span.text[typeAlert], objTrad) || obj.span.text[typeAlert]
    obj.span.text[typeAlert] = texto
    const spanTexto = createSpan(obj.span, texto)
    modalContent.appendChild(spanTexto)

    const divButton = createDiv(obj.divButtons)

    texto = trO(obj.btnaccept.text, objTrad) || obj.btnaccept.text
    obj.btnaccept.text = texto
    const buttonAceptar = createButton(obj.btnaccept)

    texto = trO(obj.btncancel.text, objTrad) || obj.btncancel.text
    obj.btncancel.text = texto
    const buttonCancelar = createButton(obj.btncancel)
    const buttonOk = createButton(obj.btnok)

    divButton.appendChild(buttonAceptar)
    divButton.appendChild(buttonCancelar)
    divButton.appendChild(buttonOk)

    modalContent.appendChild(divButton)
    // Agregar el contenido al modal
    this.modal.appendChild(modalContent)

    // Agregar el modal al body del documento
    document.body.appendChild(this.modal)
    const idAceptar = document.getElementById('idAceptar')
    idAceptar.addEventListener('click', () => {
      const elementosStyle = {
        element: ['modalAlert', 'modalAlertM'],
        style: ['none', 'none'],
        remove: ['remove', 'remove'],
      }
      let docStorage = sessionStorage.getItem('doc') !== 'null'
      docStorage === true
        ? (docStorage = desencriptar(sessionStorage.getItem('doc')))
        : null
      procesoStyleDisplay(elementosStyle)
      limpiaArrays()
      const okGuardar = guardarNuevo(
        arrayGlobal.objetoControl,
        arrayGlobal.arrayControl,
        docStorage
      )

      const requerido = desencriptar(sessionStorage.getItem('requerido'))
      if (requerido.requerido && okGuardar) {
        const miAlerta = new Alerta()
        const miAlertaInforme = new Alerta()
        let mensaje = arrayGlobal.mensajesVarios.guardar.esperaAmarillo
        arrayGlobal.avisoAmarillo.close.display = 'none'
        mensaje = trO(mensaje, objTrad)
        miAlerta.createVerde(arrayGlobal.avisoAmarillo, mensaje, null)
        const modal = document.getElementById('modalAlertVerde')
        modal.style.display = 'block'
        if (docStorage !== false) {
          arrayGlobal.objetoControl.nuxpedido.fill(docStorage)
        }
        const convertido = convertirObjATextPlano(arrayGlobal.objetoControl)
        const nuevoObjeto = {
          ...arrayGlobal.objetoControl,
          // eslint-disable-next-line max-len
          objJSON: Array(arrayGlobal.objetoControl.fecha.length)
            .fill(null)
            .map((_, index) => (index === 0 ? convertido : null)),
        }
        const encabezados = armaEncabezado(arrayGlobal, objTrad, docStorage)
        // soloEnviaEmail(nuevoObjeto, encabezados)
        // console.log(encabezados, ' >>>nuevo objeto: ', nuevoObjeto)
        insert(
          nuevoObjeto,
          convertido,
          encabezados,
          miAlertaInforme,
          objTrad,
          modal,
          docStorage
        )
      }
      if (!requerido.requerido || !okGuardar) {
        limpiaArrays()
        const fila = 1
        const { idLTYcontrol } = requerido
        const table = document.querySelector('#tableControl')
        const tbody = table.querySelector('tbody')
        let filas = tbody.querySelector(`tr:nth-child(${fila})`)
        let celda = filas.querySelector('td:nth-child(6)')
        let id = celda.textContent.trim()
        let incremento = fila
        while (idLTYcontrol !== id) {
          filas.style.backgroundColor = '#ffffff'
          incremento += 1
          filas = tbody.querySelector(`tr:nth-child(${incremento})`)
          celda = filas.querySelector('td:nth-child(6)')
          id = celda.textContent.trim()
        }
        filas.style.backgroundColor = '#f7bfc6'
        const miAlerta = new Alerta()
        let mensaje = arrayGlobal.mensajesVarios.guardar.faltanRequeridos
        mensaje = trO(mensaje, objTrad)
        miAlerta.createVerde(arrayGlobal.avisoRojo, mensaje, null)
        const modal = document.getElementById('modalAlertVerde')
        modal.style.display = 'block'
      }
    })
  }

  createFirma(objeto, objTrad, typeAlert) {
    // Crear el elemento modal
    const obj = objeto
    this.modal = document.createElement('div')
    this.modal.id = 'modalAlert'
    this.modal.className = 'modal'
    this.modal.style.background = 'rgba(0, 0, 0, 0.5)'
    // Crear el contenido del modal

    if (typeAlert === 'firmar' && widthScreen !== 360) {
      obj.divContent.height = '290px'
    }
    const modalContent = createDiv(obj.divContent)

    const span = createSpan(obj.close)
    modalContent.appendChild(span)

    let texto =
      trO(obj.titulo.text[typeAlert], objTrad) || obj.titulo.text[typeAlert]
    obj.titulo.text[typeAlert] = texto
    const title = createH3(obj.titulo, typeAlert)
    modalContent.appendChild(title)

    texto = trO(obj.span.text[typeAlert], objTrad) || obj.span.text[typeAlert]
    obj.span.text[typeAlert] = texto
    const spanTexto = createSpan(obj.span, texto)
    modalContent.appendChild(spanTexto)

    const firmadoPor = trO('Firmado por', objTrad) || obj.mensajeFirmado.text
    obj.divCajita.id = 'idDivFirmar'
    const divFirmar = createDiv(obj.divCajita)
    obj.input.id = 'idInputFirma'
    obj.input.type = 'password'
    const inputEmail = createInput(obj.input)
    texto = trO(obj.label.innerText, objTrad) || obj.label.innerText
    obj.label.id = 'idLabelFirma'
    obj.label.for = 'idInputFirma'
    obj.label.innerText = texto
    const labelEmail = createLabel(obj.label)
    divFirmar.appendChild(inputEmail)
    divFirmar.appendChild(labelEmail)
    modalContent.appendChild(divFirmar)

    const divButton = createDiv(obj.divButtons)
    texto = trO(obj.btnaccept.text, objTrad) || obj.btnaccept.text
    obj.btnaccept.text = texto
    const buttonAceptar = createButton(obj.btnaccept)

    texto = trO(obj.btncancel.text, objTrad) || obj.btncancel.text
    obj.btncancel.text = texto
    const buttonCancelar = createButton(obj.btncancel)
    const buttonOk = createButton(obj.btnok)

    divButton.appendChild(buttonAceptar)
    divButton.appendChild(buttonCancelar)
    divButton.appendChild(buttonOk)

    modalContent.appendChild(divButton)
    // Agregar el contenido al modal
    this.modal.appendChild(modalContent)

    // Agregar el modal al body del documento
    document.body.appendChild(this.modal)
    const idAceptar = document.getElementById('idAceptar')
    idAceptar.addEventListener('click', () => {
      firmar(firmadoPor)
      //! colocar la firma en el menu
    })
    const idInputFirma = document.getElementById('idInputFirma')
    idInputFirma.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        firmar(firmadoPor)
      }
    })
  }

  createModalImagenes(objeto, imagen) {
    const imgCopy = imagen
    const obj = objeto
    this.modal = document.createElement('div')
    this.modal.id = 'modalAlert'
    this.modal.className = 'modal'
    this.modal.style.background = 'rgba(0, 0, 0, 0.5)'
    // obj.div.height = '260px';
    const modalContent = createDiv(obj.div)
    const span = createSpan(obj.close)
    modalContent.appendChild(span)
    const buttonAceptar = createButton(obj.btntrash)
    buttonAceptar.style.padding = '0px'
    const trash = document.createElement('img')
    const ruta = '../../assets/img/icons8-trash-48.png'
    trash.style.height = '20px'
    // trash.style.width = '20px'
    trash.src = `${ruta}`
    buttonAceptar.appendChild(trash)
    modalContent.appendChild(buttonAceptar)
    const img = imgCopy.cloneNode(true)
    img.id = 'idVisualizador'
    img.style.height = '250px'
    // img.style.width = '250px'
    img.style.margin = 'auto auto auto auto'
    modalContent.appendChild(img)
    this.modal.appendChild(modalContent)
    document.body.appendChild(this.modal)
  }

  createVerde(obj, texto, objTrad) {
    this.modal = document.createElement('div')
    this.modal.id = 'modalAlertVerde'
    this.modal.className = 'modal'
    this.modal.style.background = '#0D0E0F;' // 'rgba(224, 220, 220, 0.7)';
    const modalContent = createDiv(obj.div)

    // Crear el spinner
    const spinner = document.createElement('div')
    spinner.id = 'idSpanInsert'
    spinner.className = 'spinner'
    spinner.style.width = '100px'
    spinner.style.height = '2px'
    spinner.style.borderRadius = '2px'
    spinner.style.borderTop = '4px solid transparent'
    spinner.style.position = 'absolute'
    spinner.style.top = '4px'
    spinner.style.left = '50%'
    spinner.style.transform = 'translate(-50%, -50%)'
    spinner.style.zIndex = '9999'
    spinner.style.background = '#212121'
    spinner.style.animation = 'spinner 2s linear infinite'
    spinner.style.visibility = 'visible'
    modalContent.appendChild(spinner)

    const span = createSpan(obj.close)
    modalContent.appendChild(span)

    let frase = ''
    if (objTrad === null) {
      frase = texto
    } else {
      frase = trO(texto, objTrad) || texto
    }
    const spanTexto = createSpan(obj.span, frase)
    modalContent.appendChild(spanTexto)

    this.modal.appendChild(modalContent)

    // Agregar el modal al body del documento
    document.body.appendChild(this.modal)
  }

  createControl(obj, texto, objTrad) {
    this.modal = document.createElement('div')
    this.modal.id = 'modalAlertCarga'
    this.modal.className = 'modal'
    // this.modal.style.background = 'rgba(224, 220, 220, 0.7)'
    this.modal.style.background = 'rgba(45, 45, 45, 0.97)'
    const modalContent = createDiv(obj.div)
    const span = createSpan(obj.close)
    modalContent.appendChild(span)

    const spanCarga = createSpan(obj.spanCarga)
    this.modal.appendChild(spanCarga)

    let frase = ''
    if (objTrad === null) {
      frase = texto
    } else {
      frase = trO(texto, objTrad) || texto
    }
    const spanTexto = createSpan(obj.span, frase)
    modalContent.appendChild(spanTexto)

    this.modal.appendChild(modalContent)

    // Agregar el modal al body del documento
    document.body.appendChild(this.modal)
  }

  createModalPerson(obj, user, objTranslate) {
    this.modal = document.createElement('div')
    this.modal.id = 'modalAlertP'
    this.modal.className = 'modal'
    this.modal.style.background = 'rgba(0, 0, 0, 0.1)'
    // Crear el contenido del modal
    const modalContent = createDiv(obj.divContent)

    const span = createSpan(obj.close)
    modalContent.appendChild(span)

    const spanUser = createSpan(obj.user, user.person)
    modalContent.appendChild(spanUser)

    let texto = trO(user.home, objTranslate) || user.home
    const spanHome = createSpan(obj.home, texto)
    modalContent.appendChild(spanHome)

    const screen = `Screen: ${widthScreen}`
    const spanScreen = createSpan(obj.screen, screen)
    modalContent.appendChild(spanScreen)

    const hr = createHR(obj.hr)
    modalContent.appendChild(hr)

    texto = trO(user.salir, objTranslate) || user.salir
    const spanSalir = createSpan(obj.salir, texto)
    modalContent.appendChild(spanSalir)

    this.modal.appendChild(modalContent)

    // Agregar el modal al body del documento
    document.body.appendChild(this.modal)
  }

  createModalMenu(objeto, objTranslate) {
    // eslint-disable-next-line no-unused-vars
    const configFirma = desencriptar(sessionStorage.getItem('firma'))
    const configMenu = desencriptar(sessionStorage.getItem('config_menu'))
    const enviaPorEmail = sessionStorage.getItem('envia_por_email') === 'true'
    const obj = objeto
    this.modal = document.createElement('div')
    this.modal.id = 'modalAlertM'
    this.modal.className = 'modal'
    this.modal.style.background = 'rgba(0, 0, 0, 0.1)'
    // Crear el contenido del modal
    const modalContent = createDiv(obj.divContent)

    const span = createSpan(obj.close)
    modalContent.appendChild(span)

    //! guardar
    obj.divCajita.id = 'idDivGuardar'
    obj.divCajita.onClick = funcionGuardar
    let div = createDiv(obj.divCajita)
    const imgGuardar = createIMG(obj.imgGuardar)
    let texto = trO(obj.guardar.text, objTranslate) || obj.guardar.text
    const spanGuardar = createSpan(obj.guardar, texto)
    div.appendChild(imgGuardar)
    div.appendChild(spanGuardar)
    modalContent.appendChild(div)
    obj.divCajita.onClick = null

    obj.hr.id = 'idHrGuardar'
    let hr = createHR(obj.hr)
    modalContent.appendChild(hr)
    //! fin guardar

    //! guardar cambio
    obj.divCajita.id = 'idDivGuardarCambio'
    obj.divCajita.onClick = funcionGuardarCambio
    div = createDiv(obj.divCajita)
    const imgGuardarCambio = createIMG(obj.imgGuardar)
    texto = trO(obj.guardarCambio.text, objTranslate) || obj.guardarCambio.text
    const spanGuardarCambio = createSpan(obj.guardarCambio, texto)
    div.appendChild(imgGuardarCambio)
    div.appendChild(spanGuardarCambio)
    modalContent.appendChild(div)
    obj.divCajita.onClick = null

    obj.hr.id = 'idHrGuardarCambio'
    hr = createHR(obj.hr)
    modalContent.appendChild(hr)
    //! fin guardar cambio

    //! guardar como nuevo
    obj.divCajita.id = 'idDivGuardarComoNuevo'
    obj.divCajita.onClick = funcionGuardarComoNuevo
    div = createDiv(obj.divCajita)
    const imgGuardarComoNuevo = createIMG(obj.imgGuardar)
    texto =
      trO(obj.guardarComoNuevo.text, objTranslate) || obj.guardarComoNuevo.text
    const spanGuardarComoNuevo = createSpan(obj.guardarComoNuevo, texto)
    div.appendChild(imgGuardarComoNuevo)
    div.appendChild(spanGuardarComoNuevo)
    modalContent.appendChild(div)
    obj.divCajita.onClick = null

    obj.hr.id = 'idHrGuardarComoNuevo'
    hr = createHR(obj.hr)
    modalContent.appendChild(hr)
    //! fin guaradr como nuevo

    //! firmar
    obj.divCajita.id = 'idDivFirmar'
    obj.divCajita.onClick = funcionHacerFirmar
    div = createDiv(obj.divCajita)
    const imgFirmar = createIMG(obj.imgFirmar)
    texto = trO(obj.firmar.text, objTranslate) || obj.firmar.text
    const spanFirmar = createSpan(obj.firmar, texto)
    const spanFirmado = createSpan(obj.mensajeFirmado, null)
    div.appendChild(imgFirmar)
    div.appendChild(spanFirmar)

    modalContent.appendChild(span)
    modalContent.appendChild(div)

    obj.divCajita.id = 'idDivFirmado'
    obj.divCajita.hoverBackground = null
    obj.divCajita.hoverColor = null
    obj.divCajita.cursor = null
    div = createDiv(obj.divCajita)

    div.appendChild(spanFirmado)
    modalContent.appendChild(div)
    obj.divCajita.onClick = null

    obj.hr.id = 'idHrFirmar'
    hr = createHR(obj.hr)
    modalContent.appendChild(hr)
    obj.divCajita.hoverBackground = '#cecece'
    obj.divCajita.hoverColor = '#cecece'
    obj.divCajita.cursor = 'pointer'
    //! fin firmar

    //! refrescar
    obj.divCajita.id = 'idDivRefrescar'
    obj.divCajita.onClick = funcionRefrescar
    div = createDiv(obj.divCajita)
    const imgRefresh = createIMG(obj.imgRefresh)
    texto = trO(obj.refresh.text, objTranslate) || obj.refresh.text
    const spanRefresh = createSpan(obj.refresh, texto)
    div.appendChild(imgRefresh)
    div.appendChild(spanRefresh)
    modalContent.appendChild(div)
    obj.divCajita.onClick = null

    obj.hr.id = 'idHrRefresh'
    hr = createHR(obj.hr)
    modalContent.appendChild(hr)
    //! fin refrescar

    //! salir
    obj.divCajita.id = 'idDivSalir'
    obj.divCajita.onClick = funcionSalir
    div = createDiv(obj.divCajita)
    const imgSalir = createIMG(obj.imgSalir)
    texto = trO(obj.salir.text, objTranslate) || obj.salir.text
    const spanSalir = createSpan(obj.salir, texto)
    div.appendChild(imgSalir)
    div.appendChild(spanSalir)
    modalContent.appendChild(div)
    obj.divCajita.onClick = null

    obj.hr.id = 'idHrSalir'
    hr = createHR(obj.hr)
    modalContent.appendChild(hr)
    //! fin salir

    texto = trO(obj.mensaje1.text, objTranslate) || obj.mensaje1.text
    const spanMensaje1 = createSpan(obj.mensaje1, texto)
    modalContent.appendChild(spanMensaje1)

    texto = trO(obj.mensaje2.text, objTranslate) || obj.mensaje2.text
    const spanMensaje2 = createSpan(obj.mensaje2, texto)
    modalContent.appendChild(spanMensaje2)

    //! checkbox
    obj.input.id = 'idCheckBoxEmail'
    obj.input.type = 'checkbox'
    obj.divCajita.id = 'idDivCheckBoxEmail'
    div = createDiv(obj.divCajita)
    const inputEmail = createInput(obj.input)
    texto = trO(obj.label.innerText, objTranslate) || obj.label.innerText
    obj.label.id = 'idLabelEmail'
    obj.label.for = 'idCheckBoxEmail'
    obj.label.innerText = texto
    const labelEmail = createLabel(obj.label)
    div.appendChild(inputEmail)
    div.appendChild(labelEmail)
    modalContent.appendChild(div)
    //! fin checkbox
    this.modal.appendChild(modalContent)

    // Agregar el modal al body del documento
    document.body.appendChild(this.modal)
    // let elementosStyle;
    const doc = sessionStorage.getItem('doc')
    // console.log(doc)

    formatarMenu(doc, configMenu, objTranslate)
    const enviaEmail = document.getElementById('idCheckBoxEmail')
    enviaPorEmail ? (enviaEmail.checked = true) : (enviaEmail.checked = false)
  }

  createModalConsultaView(objeto, objTranslate) {
    // eslint-disable-next-line no-unused-vars
    const obj = objeto
    // console.log(obj)
    this.modal = document.createElement('div')
    this.modal.id = 'modalAlertM'
    this.modal.className = 'modal'
    this.modal.style.background = 'rgba(0, 0, 0, 0.1)'
    // Crear el contenido del modal
    const modalContent = createDiv(obj.divContent)

    const span = createSpan(obj.close)
    modalContent.appendChild(span)

    const user = desencriptar(sessionStorage.getItem('user'))
    const { tipo } = user

    //! excel
    obj.divCajita.id = 'idExcel'
    obj.divCajita.onClick = funcionExportarExcel
    let div = createDiv(obj.divCajita)
    const imgExcel = createIMG(obj.imgExcel)
    let texto = trO(obj.excel.text, objTranslate) || obj.excel.text
    const spanExcel = createSpan(obj.excel, texto)
    div.appendChild(imgExcel)
    div.appendChild(spanExcel)
    modalContent.appendChild(div)
    obj.divCajita.onClick = null

    obj.hr.id = 'idHrExcel'
    let hr = createHR(obj.hr)
    modalContent.appendChild(hr)
    //! fin excel

    //! pdf
    obj.divCajita.id = 'idPDF'
    obj.divCajita.onClick = funcionExportarPDF
    div = createDiv(obj.divCajita)
    const imgPdf = createIMG(obj.imgPdf)
    texto = trO(obj.pdf.text, objTranslate) || obj.pdf.text
    const spanPdf = createSpan(obj.pdf, texto)
    div.appendChild(imgPdf)
    div.appendChild(spanPdf)
    modalContent.appendChild(div)
    obj.divCajita.onClick = null

    obj.hr.id = 'idHrPdf'
    hr = createHR(obj.hr)
    modalContent.appendChild(hr)
    //! fin pdf

    //! json
    obj.divCajita.id = 'idJson'
    obj.divCajita.onClick = funcionExportarJSON

    div = createDiv(obj.divCajita)
    const imgJson = createIMG(obj.imgJson)
    texto = trO(obj.json.text, objTranslate) || obj.json.text
    const spanJson = createSpan(obj.json, texto)
    div.appendChild(imgJson)
    div.appendChild(spanJson)
    modalContent.appendChild(div)
    obj.divCajita.onClick = null

    obj.hr.id = 'idHrJson'
    hr = createHR(obj.hr)
    modalContent.appendChild(hr)
    //! fin json

    //! api
    obj.divCajita.id = 'idDivApi'
    if (parseInt(tipo) >= 3) {
      obj.divCajita.onClick = funcionApi
    }
    div = createDiv(obj.divCajita)
    const imgApi = createIMG(obj.imgApi)
    texto = trO(obj.api.text, objTranslate) || obj.api.text
    const spanApi = createSpan(obj.api, texto)
    div.appendChild(imgApi)
    div.appendChild(spanApi)

    modalContent.appendChild(div)
    obj.divCajita.onClick = null

    obj.mensaje0.id = 'idMensajeInstructivo'
    obj.mensaje0.display = 'none'
    texto = trO(obj.mensaje0.text, objTranslate) || obj.mensaje0.text
    const spanMensaje0 = createSpan(obj.mensaje0, texto)
    modalContent.appendChild(spanMensaje0)

    obj.mensaje1.id = 'idMensajeCopiado'
    texto = trO(obj.mensaje1.text, objTranslate) || obj.mensaje1.text
    const spanMensaje1 = createSpan(obj.mensaje1, texto)
    modalContent.appendChild(spanMensaje1)

    obj.hr.id = 'idHrApi'
    hr = createHR(obj.hr)
    modalContent.appendChild(hr)
    //! fin api

    //! refrescar
    obj.divCajita.id = 'idDivRefrescar'
    obj.divCajita.onClick = funcionRefrescar
    div = createDiv(obj.divCajita)
    const imgRefresh = createIMG(obj.imgRefresh)
    texto = trO(obj.refresh.text, objTranslate) || obj.refresh.text
    const spanRefresh = createSpan(obj.refresh, texto)
    div.appendChild(imgRefresh)
    div.appendChild(spanRefresh)
    modalContent.appendChild(div)
    obj.divCajita.onClick = null

    obj.hr.id = 'idHrRefresh'
    hr = createHR(obj.hr)
    modalContent.appendChild(hr)
    //! fin refrescar

    //! salir
    obj.divCajita.id = 'idDivSalir'
    obj.divCajita.onClick = funcionSalir
    div = createDiv(obj.divCajita)
    const imgSalir = createIMG(obj.imgSalir)
    texto = trO(obj.salir.text, objTranslate) || obj.salir.text
    const spanSalir = createSpan(obj.salir, texto)
    div.appendChild(imgSalir)
    div.appendChild(spanSalir)
    modalContent.appendChild(div)
    obj.divCajita.onClick = null

    obj.hr.id = 'idHrSalir'
    hr = createHR(obj.hr)
    // modalContent.appendChild(hr)
    //! fin salir

    this.modal.appendChild(modalContent)

    // Agregar el modal al body del documento
    document.body.appendChild(this.modal)
  }

  createViewer(objeto, array, objTrad) {
    try {
      const nivelReporte = array[14]
      const persona = desencriptar(sessionStorage.getItem('user'))
      const { tipo } = persona
      const obj = objeto
      this.modal = document.createElement('div')
      this.modal.id = 'modalAlertView'
      this.modal.className = 'modal'
      this.modal.style.background = 'rgba(0, 0, 0, 0.5)'
      // Crear el contenido del modal
      const modalContent = createDiv(obj.divContent)
      const span = createSpan(obj.close)
      modalContent.appendChild(span)
      let texto = array[0]
      let typeAlert = 'viewer'
      // texto = trA(texto, objTrad) || texto;

      obj.titulo.text[typeAlert] = `${array[1]} - ${texto}`
      const title = createH3(obj.titulo, typeAlert)
      title.id = 'idTituloH3'
      title.setAttribute('data-index', array[1])
      title.setAttribute('data-name', array[0])
      modalContent.appendChild(title)

      // eslint-disable-next-line prefer-destructuring
      texto = array[2]
      texto = trA(texto, objTrad) || texto
      typeAlert = 'descripcion'
      obj.span.text[typeAlert] = texto
      obj.span.marginTop = '10px'
      let spanTexto = createSpan(obj.span, texto)
      modalContent.appendChild(spanTexto)

      texto = trO('Primera', objTrad) || 'Primera'
      typeAlert = 'fechas'
      let mensaje = `${texto} ${array[16]}`
      texto = trO('Última', objTrad) || 'Última'
      mensaje = `${mensaje} - ${texto} ${array[3]}`
      obj.span.text[typeAlert] = mensaje
      obj.span.fontSize = '10px'
      obj.span.fontColor = 'red'
      obj.span.marginTop = '10px'
      spanTexto = createSpan(obj.span, mensaje)
      modalContent.appendChild(spanTexto)

      texto = trO('Tipo de usuario:', objTrad) || 'Tipo de usuario:'
      texto = `${texto} ${array[14]}-${array[19]}`
      typeAlert = 'nivelUsuario'
      obj.span.text[typeAlert] = `${texto} ${array[14]}-${array[19]}`
      obj.span.fontSize = '12px'
      obj.span.fontColor = '#212121'
      obj.span.marginTop = '10px'
      spanTexto = createSpan(obj.span, texto)
      modalContent.appendChild(spanTexto)

      if (nivelReporte <= parseInt(tipo)) {
        const divButton = createDiv(obj.divButtons)
        texto = trO(obj.btnNuevo.text, objTrad) || obj.btnNuevo.text
        obj.btnNuevo.text = texto
        const btnNuevo = createButton(obj.btnNuevo)

        texto = trO(obj.btnVerCargados.text, objTrad) || obj.btnVerCargados.text
        obj.btnVerCargados.text = texto
        const btnVerCargados = createButton(obj.btnVerCargados)

        texto =
          trO(obj.btnProcedimiento.text, objTrad) || obj.btnProcedimiento.text
        obj.btnProcedimiento.text = texto
        const btnProcedimiento = createButton(obj.btnProcedimiento)

        texto =
          trO(obj.btnVerCargadosPorFecha.text, objTrad) ||
          obj.btnVerCargadosPorFecha.text
        obj.btnVerCargadosPorFecha.text = texto
        const btnVerCargadosPorFecha = createButton(obj.btnVerCargadosPorFecha)

        divButton.appendChild(btnNuevo)
        divButton.appendChild(btnVerCargados)
        divButton.appendChild(btnProcedimiento)
        divButton.appendChild(btnVerCargadosPorFecha)
        modalContent.appendChild(divButton)
        this.modal.appendChild(modalContent)
        document.body.appendChild(this.modal)
        const idbtnNuevo = document.getElementById('idbtnNuevo')
        idbtnNuevo.addEventListener('click', () => {
          const idTituloH3 = document.getElementById('idTituloH3')
          const cod = idTituloH3.getAttribute('data-index')
          const name = idTituloH3.getAttribute('data-name')
          const url = `${cod}`
          const ruta = `../../Pages/Control/index.php?v=${Math.round(
            Math.random() * 10
          )}`
          const objetoRuta = {
            control_N: url,
            control_T: decodeURIComponent(name),
            nr: '0',
          }
          sessionStorage.setItem('contenido', encriptar(objetoRuta))
          // window.location.href = ruta
          window.open(ruta, '_blank')
        })
        const idbtnCargados = document.getElementById('idVerCargados')
        idbtnCargados.addEventListener('click', () => {
          const idTituloH3 = document.getElementById('idTituloH3')
          const cod = idTituloH3.getAttribute('data-index')
          const name = idTituloH3.getAttribute('data-name')
          const url = `${cod}`
          const ruta = `../../Pages/ControlsView/index.php?v=${Math.round(
            Math.random() * 10
          )}`
          const objetoRuta = {
            control_N: url,
            control_T: decodeURIComponent(name),
            nr: '0',
          }
          sessionStorage.setItem('listadoCtrls', encriptar(objetoRuta))
          window.location.href = ruta
        })
        const idbtnCargadosPorFecha = document.getElementById(
          'idVerCargadosPorFecha'
        )
        idbtnCargadosPorFecha.addEventListener('click', () => {
          const idTituloH3 = document.getElementById('idTituloH3')
          const cod = idTituloH3.getAttribute('data-index')
          const name = idTituloH3.getAttribute('data-name')
          const url = `${cod}`
          const datos = {
            titulo: idTituloH3.textContent,
            cod,
            name,
          }
          const miAlerta = new Alerta()
          miAlerta.createViewerPorFecha(
            arrayGlobal.porFechaEnModal,
            datos,
            objTrad
          )
          const modal2 = document.getElementById('modalTablaViewFecha')
          modal2.style.display = 'block'
        })
      } else {
        texto =
          trO(
            'No tiene permiso para crear o revisar este control. Póngase en contacto con su supervisor. Gracias',
            objTrad
          ) ||
          'No tiene permiso para crear o revisar este control. Póngase en contacto con su supervisor. Gracias'
        typeAlert = 'descripcion'
        obj.span.text[typeAlert] = texto
        obj.span.marginTop = '10px'
        obj.span.fontSize = '18px'
        obj.span.fontColor = 'red'
        let spanTexto = createSpan(obj.span, texto)
        modalContent.appendChild(spanTexto)
        this.modal.appendChild(modalContent)
        document.body.appendChild(this.modal)
      }
    } catch (error) {
      console.log(error)
    }
  }

  createViewerPorFecha(objeto, datos, objTrad) {
    try {
      const obj = objeto
      this.modal = document.createElement('div')
      this.modal.id = 'modalTablaViewFecha'
      this.modal.className = 'modal'
      this.modal.style.background = 'rgba(0, 0, 0, 0.5)'
      // Crear el contenido del modal
      const modalContent = createDiv(obj.divContent)
      let span = createSpan(obj.close)
      modalContent.appendChild(span)

      let texto = trO(obj.span.text, objTrad) || obj.span.text
      span = createSpan(obj.span, texto)
      modalContent.appendChild(span)
      obj.titulo.text['text'] = datos.titulo
      const title = createH3(obj.titulo, 'text')
      title.id = 'idTituloFechasH3'
      title.setAttribute('data-index', datos.cod)
      title.setAttribute('data-name', datos.name)
      modalContent.appendChild(title)

      const divEncabezado = createDiv(obj.divEncabezado)
      obj.imgPrint.display = 'inline-block'
      const imagenButton = createIMG(obj.imgPrint)
      obj.span.alignSelf = 'left'
      obj.span.passing = null
      obj.span.className = null
      obj.span.padding = null
      obj.span.left = '10px'
      obj.imgPrint.display = 'inline-block'
      span = createSpan(obj.span, 'Fechas')
      divEncabezado.appendChild(imagenButton)

      divEncabezado.appendChild(span)
      modalContent.appendChild(divEncabezado)
      const hr = createHR(obj)
      modalContent.appendChild(hr)
      const fechaDeHoy = fechasGenerator.fecha_corta_yyyymmdd(new Date())
      let divInput = createDiv(obj.divInput)
      obj.input.id = 'idDesde'
      obj.input.value = fechaDeHoy
      let input = createInput(obj.input)
      texto = trO('Desde:', objTrad) || 'Desde:'
      obj.label.innerText = `${texto}: `
      obj.label.margin = 'auto 10px'
      let label = createLabel(obj.label)
      divInput.appendChild(label)
      divInput.appendChild(input)
      modalContent.appendChild(divInput)
      obj.divInput.id = 'idDivInputPorFechaHasta'
      divInput = createDiv(obj.divInput)
      obj.input.id = 'idHasta'
      obj.input.value = fechaDeHoy
      input = createInput(obj.input)
      texto = trO('Hasta:', objTrad) || 'Hasta:'
      obj.label.innerText = `${texto}: `
      obj.label.margin = 'auto 10px'
      label = createLabel(obj.label)
      divInput.appendChild(label)
      divInput.appendChild(input)
      modalContent.appendChild(divInput)
      texto = trO('Enviar', objTrad) || 'Enviar:'
      obj.btnEnviar.text = texto
      const btn = createButton(obj.btnEnviar)
      modalContent.appendChild(btn)
      // Agregar el contenido al modal
      this.modal.appendChild(modalContent)

      // Agregar el modal al body del documento
      document.body.appendChild(this.modal)
      const idbtnEnviar = document.getElementById('idbtnEnviar')
      idbtnEnviar.addEventListener('click', () => {
        const idTituloH3 = document.getElementById('idTituloH3')
        const cod = idTituloH3.getAttribute('data-index')
        const name = idTituloH3.getAttribute('data-name')
        let inputDesde = document.getElementById('idDesde')
        let inputHasta = document.getElementById('idHasta')
        let desde = inputDesde.value
        let hasta = inputHasta.value
        const fechaDesde = new Date(`${desde}T00:00:00-03:00`)
        const fechaHasta = new Date(`${hasta}T00:00:00-03:00`)
        // const fechaDesde = new Date(desde)
        // const fechaHasta = new Date(hasta)
        const soloFecha1 = new Date(
          fechaDesde.getFullYear(),
          fechaDesde.getMonth(),
          fechaDesde.getDate()
        )
        const soloFecha2 = new Date(
          fechaHasta.getFullYear(),
          fechaHasta.getMonth(),
          fechaHasta.getDate()
        )
        const comparaFechas = soloFecha1 <= soloFecha2
        if (comparaFechas) {
          const ruta = `../../Pages/ControlsView/index.php?v=${Math.round(
            Math.random() * 10
          )}`
          const objetoRuta = {
            control_N: cod,
            control_T: decodeURIComponent(name),
            nr: '0',
            desde: inputDesde.value,
            hasta: inputHasta.value,
          }
          sessionStorage.setItem('listadoCtrls', encriptar(objetoRuta))
          window.location.href = ruta
        } else {
          inputDesde.style.background = 'red'
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  createCalendar(objeto, objTranslate, procedure) {
    try {
      const obj = objeto
      this.modal = document.createElement('div')
      this.modal.id = 'modalTablaViewFecha'
      this.modal.className = 'modal'
      this.modal.style.background = 'rgba(0, 0, 0, 0.5)'
      // Crear el contenido del modal
      const modalContent = createDiv(obj.divContent)
      let span = createSpan(obj.close)
      modalContent.appendChild(span)

      let texto = 'Seleccione el intervalo de fechas para la consulta:'
      texto = trO(texto, objTranslate) || texto
      obj.span.text = texto
      span = createSpan(obj.span, texto)
      modalContent.appendChild(span)
      obj.titulo.text.text = procedure.name
      const title = createH3(obj.titulo, 'text')
      title.id = 'idTituloFechasH3'
      title.setAttribute('data-name', procedure.procedure)
      modalContent.appendChild(title)

      const divEncabezado = createDiv(obj.divEncabezado)
      obj.imgPrint.display = 'inline-block'
      const imagenButton = createIMG(obj.imgPrint)
      obj.span.alignSelf = 'left'
      obj.span.passing = null
      obj.span.className = null
      obj.span.padding = null
      obj.span.left = '10px'
      obj.imgPrint.display = 'inline-block'
      span = createSpan(obj.span, 'Fechas')
      divEncabezado.appendChild(imagenButton)

      divEncabezado.appendChild(span)
      modalContent.appendChild(divEncabezado)
      const hr = createHR(obj)
      modalContent.appendChild(hr)
      const fechaDeHoy = fechasGenerator.fecha_corta_yyyymmdd(new Date())
      let divInput = createDiv(obj.divInput)
      obj.input.id = 'idDesde'
      obj.input.value = fechaDeHoy
      let input = createInput(obj.input)
      texto = trO('Desde:', objTranslate) || 'Desde:'
      obj.label.innerText = `${texto}: `
      obj.label.margin = 'auto 10px'
      let label = createLabel(obj.label)
      divInput.appendChild(label)
      divInput.appendChild(input)
      modalContent.appendChild(divInput)
      obj.divInput.id = 'idDivInputPorFechaHasta'
      divInput = createDiv(obj.divInput)
      obj.input.id = 'idHasta'
      obj.input.value = fechaDeHoy
      input = createInput(obj.input)
      texto = trO('Hasta:', objTranslate) || 'Hasta:'
      obj.label.innerText = `${texto}: `
      obj.label.margin = 'auto 10px'
      label = createLabel(obj.label)
      divInput.appendChild(label)
      divInput.appendChild(input)
      modalContent.appendChild(divInput)
      texto = trO('Enviar', objTranslate) || 'Enviar:'
      obj.btnEnviar.text = texto
      const btn = createButton(obj.btnEnviar)
      btn.setAttribute('data-procedure', procedure.procedure)
      modalContent.appendChild(btn)
      // Agregar el contenido al modal
      this.modal.appendChild(modalContent)

      // Agregar el modal al body del documento
      document.body.appendChild(this.modal)
      const idbtnEnviar = document.getElementById('idbtnEnviar')
      idbtnEnviar.addEventListener('click', async (e) => {
        const name = e.target.attributes[3].value
        // console.log(name)
        let inputDesde = document.getElementById('idDesde')
        let inputHasta = document.getElementById('idHasta')
        let desde = inputDesde.value
        let hasta = inputHasta.value
        const fechaDesde = new Date(`${desde}T00:00:00-03:00`)
        const fechaHasta = new Date(`${hasta}T00:00:00-03:00`)
        // const fechaDesde = new Date(desde)
        // const fechaHasta = new Date(hasta)
        const soloFecha1 = new Date(
          fechaDesde.getFullYear(),
          fechaDesde.getMonth(),
          fechaDesde.getDate()
        )
        const soloFecha2 = new Date(
          fechaHasta.getFullYear(),
          fechaHasta.getMonth(),
          fechaHasta.getDate()
        )
        const comparaFechas = soloFecha1 <= soloFecha2
        if (comparaFechas) {
          const miAlerta = new Alerta()
          const aviso =
            'Se está realizando la consulta, va a demorar unos segundos, esta puede ser muy compleja dependiendo de los archivos involucrados y el intervalo de tiempo solicitado. Asegure la conexión de internet.' //arrayGlobal.avisoListandoControles.span.text
          const mensaje = trO(aviso, objTranslate) || aviso
          // arrayGlobal.avisoListandoControles.div.height = '200px'
          // arrayGlobal.avisoListandoControles.div.top = '70px'
          miAlerta.createControl(
            arrayGlobal.avisoListandoControles,
            mensaje,
            objTranslate
          )
          const modal = document.getElementById('modalAlertCarga')
          modal.style.display = 'block'
          document.getElementById('idSpanCarga').style.display = 'none'
          await new Promise((resolve) => setTimeout(() => resolve(), 200))
          let consulta = await callProcedure(
            procedure.procedure,
            desde,
            hasta,
            procedure.operation
          )
          const api = {
            procedure: procedure.procedure,
            desde,
            hasta,
          }

          if (consulta.length <= 1) {
            const miAlerta = new Alerta()
            const aviso =
              'No se encotró algún registro que coincida con la fechas proporcionadas. Revise las fechas en Controles cargados.'
            const mensaje = trO(aviso, objTranslate) || aviso
            arrayGlobal.avisoRojo.span.text = mensaje
            arrayGlobal.avisoRojo.span.padding = '0px 0px 0px 0px'
            arrayGlobal.avisoRojo.div.height = '110px'
            arrayGlobal.avisoRojo.div.margin = '200px auto auto auto'
            miAlerta.createVerde(arrayGlobal.avisoRojo, mensaje, objTranslate)
            let modal = document.getElementById('modalAlertCarga')
            modal.remove()
            modal = document.getElementById('modalAlertVerde')
            modal.style.display = 'block'
          }
          if (consulta.length > 1) {
            sessionStorage.setItem('api', encriptar(api))
            let modal = document.getElementById('modalAlertCarga')
            modal.remove()
            modal = document.getElementById('modalTablaViewFecha')
            modal.remove()
            const table = document.getElementById('tableConsultaViews')

            table.style.display = 'block'
            const encabezados = {
              title: consulta[0],
            }
            const arrayWidth = []
            consulta[0].forEach(() => {
              arrayWidth.push(1)
            })
            const thead = document.createElement('thead')
            const newRow = document.createElement('tr')
            let filaDoc = null
            encabezados.title.forEach((element, index) => {
              if (element.toLowerCase() === 'doc') {
                filaDoc = index
              }
              const elementoTranslate =
                trA(element.toUpperCase(), objTranslate) ||
                element.toUpperCase()
              const cell = estilosTheadCell(
                elementoTranslate,
                index,
                arrayWidth
              )
              newRow.appendChild(cell)
            })
            thead.appendChild(newRow)
            table.appendChild(thead)
            consulta.shift()
            const nuevoArray = [...consulta]
            const cantidadDeRegistros = nuevoArray[0].length
            const tbody = document.createElement('tbody')
            nuevoArray.forEach((element, index) => {
              const newRow = estilosTbodyCellConsulta(
                element,
                index,
                cantidadDeRegistros,
                objTranslate,
                arrayWidth,
                filaDoc
              )
              tbody.appendChild(newRow)
            })
            table.appendChild(tbody)
          }
        } else {
          inputDesde.style.background = 'red'
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  async createSinCalendar(objeto, texto, objTranslate, procedure) {
    try {
      const obj = objeto
      this.modal = document.createElement('div')
      this.modal.id = 'modalAlertCarga'
      this.modal.className = 'modal'
      this.modal.style.background = 'rgba(224, 220, 220, 0.7)'
      const modalContent = createDiv(obj.div)
      const span = createSpan(obj.close)
      modalContent.appendChild(span)

      const spanCarga = createSpan(obj.spanCarga)
      this.modal.appendChild(spanCarga)

      let frase = ''
      if (objTranslate === null) {
        frase = texto
      } else {
        frase = trO(texto, objTranslate) || texto
      }
      const spanTexto = createSpan(obj.span, frase)
      modalContent.appendChild(spanTexto)

      this.modal.appendChild(modalContent)

      // Agregar el modal al body del documento
      document.body.appendChild(this.modal)
      let consulta = await callProcedure(
        procedure.procedure,
        null,
        null,
        procedure.operation
      )
      const api = {
        procedure: procedure.procedure,
        desde: null,
        hasta: null,
      }
      if (consulta.length <= 1) {
        const miAlerta = new Alerta()
        const aviso =
          'No se encotró algún registro que coincida con la fechas proporcionadas. Revise las fechas en Controles cargados.'
        const mensaje = trO(aviso, objTranslate) || aviso
        arrayGlobal.avisoRojo.span.text = mensaje
        arrayGlobal.avisoRojo.span.padding = '0px 0px 0px 0px'
        arrayGlobal.avisoRojo.div.height = '110px'
        arrayGlobal.avisoRojo.div.margin = '200px auto auto auto'
        miAlerta.createVerde(arrayGlobal.avisoRojo, mensaje, objTranslate)
        let modal = document.getElementById('modalAlertCarga')
        modal.remove()
        modal = document.getElementById('modalAlertVerde')
        modal.style.display = 'block'
      }
      if (consulta.length > 1) {
        sessionStorage.setItem('api', encriptar(api))
        let modal = document.getElementById('modalAlertCarga')
        modal.remove()
        const table = document.getElementById('tableConsultaViews')
        table.style.display = 'block'
        const encabezados = {
          title: consulta[0],
        }
        const arrayWidth = []
        consulta[0].forEach(() => {
          arrayWidth.push(1)
        })
        const thead = document.createElement('thead')
        const newRow = document.createElement('tr')
        let filaDoc = null
        encabezados.title.forEach((element, index) => {
          if (element.toLowerCase() === 'doc') {
            filaDoc = index
          }
          const elementoTranslate =
            trA(element.toUpperCase(), objTranslate) || element.toUpperCase()
          const cell = estilosTheadCell(elementoTranslate, index, arrayWidth)
          newRow.appendChild(cell)
        })
        thead.appendChild(newRow)
        table.appendChild(thead)
        consulta.shift()
        const nuevoArray = [...consulta]
        const cantidadDeRegistros = nuevoArray[0].length
        const tbody = document.createElement('tbody')
        nuevoArray.forEach((element, index) => {
          const newRow = estilosTbodyCellConsulta(
            element,
            index,
            cantidadDeRegistros,
            objTranslate,
            arrayWidth,
            filaDoc
          )
          tbody.appendChild(newRow)
        })
        table.appendChild(tbody)
      }
    } catch (error) {
      console.log(error)
    }
  }

  createMenuListControls(objeto, control, nuxpedido, traerControl, objTrad) {
    try {
      //! viewer para print
      const obj = objeto
      this.modal = document.createElement('div')
      this.modal.id = 'modalTablaView'
      this.modal.className = 'modal'
      this.modal.style.background = 'rgba(0, 0, 0, 0.5)'
      // Crear el contenido del modal
      const modalContent = createDiv(obj.divContent)
      const span = createSpan(obj.close)
      modalContent.appendChild(span)

      const divEncabezado = createDiv(obj.divEncabezado)
      const buttonPDF = createButton(obj.btnPDF)
      const imagenButton = createIMG(obj.imgPrint)
      buttonPDF.appendChild(imagenButton)
      buttonPDF.addEventListener('click', () => {
        printDiv()
      })
      divEncabezado.appendChild(buttonPDF)
      modalContent.appendChild(divEncabezado)

      const texto = `${control.control_N} - ${control.control_T} - ${nuxpedido}`
      // console.log(texto)
      obj.titulo.text.control = texto
      const title = createH3(obj.titulo, 'control')
      modalContent.appendChild(title)

      const table = document.createElement('table')
      table.setAttribute('id', 'idTablaViewer')
      const thead = document.createElement('thead')
      const newRow = document.createElement('tr')
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
      arrayWidthEncabezado = [...encabezados.width]
      encabezados.title.forEach((element, index) => {
        const elementoTranslate =
          trO(element.toUpperCase(), objTrad) || element.toUpperCase()
        const cell = estilosTheadCell(
          elementoTranslate,
          index,
          arrayWidthEncabezado
        )
        newRow.appendChild(cell)
      })
      thead.appendChild(newRow)
      table.appendChild(thead)
      const tbody = document.createElement('tbody')
      tbody.setAttribute('id', 'idTbodyModal')
      const cantidadDeRegistros = traerControl.length
      traerControl.forEach((element, index) => {
        const newRow = estilosTbodyCell(
          element,
          index,
          cantidadDeRegistros,
          objTrad,
          arrayWidthEncabezado
        )
        tbody.appendChild(newRow)
      })
      table.appendChild(tbody)
      modalContent.appendChild(table)
      this.modal.appendChild(modalContent)
      document.body.appendChild(this.modal)
    } catch (error) {
      console.log(error)
    }
  }

  createEliminaRegistro(objeto, nuxpedido, objTrad, control) {
    const { control_N, control_T } = control
    const obj = objeto
    this.modal = document.createElement('div')
    this.modal.id = 'modalAlert'
    this.modal.className = 'modal'
    this.modal.style.background = 'rgba(0, 0, 0, 0.7)'

    obj.divContent.background = 'rgba(230, 32, 32, 1)'
    obj.divContent.height = '290px'
    const modalContent = createDiv(obj.divContent)
    const span = createSpan(obj.close)
    modalContent.appendChild(span)

    let texto =
      trO(obj.titulo.text['eliminar'], objTrad) || obj.titulo.text['eliminar']
    obj.titulo.text['eliminar'] = `${texto}!!!`
    const title = createH3(obj.titulo, 'eliminar')
    modalContent.appendChild(title)

    texto =
      trO(obj.titulo.text['eliminar'], objTrad) || obj.titulo.text['eliminar']
    obj.titulo.text['eliminar'] = `${control_N} - ${control_T}`
    obj.titulo.marginTop = '0px'
    const ctrl = createH3(obj.titulo, 'eliminar')
    modalContent.appendChild(ctrl)

    texto = trO(obj.span.text['eliminar'], objTrad) || obj.span.text['eliminar']
    const registro = `${texto}: ${nuxpedido}`
    obj.span.id = 'idEliminaRegistro'
    obj.span.text['eliminar'] = registro
    const spanTexto = createSpan(obj.span, registro)
    modalContent.appendChild(spanTexto)

    obj.divButtons.background = 'rgba(230, 32, 32, 1)'
    const divButton = createDiv(obj.divButtons)

    texto = trO(obj.btnaccept.text, objTrad) || obj.btnaccept.text
    obj.btnaccept.text = texto
    const buttonAceptar = createButton(obj.btnaccept)

    texto = trO(obj.btncancel.text, objTrad) || obj.btncancel.text
    obj.btncancel.text = texto
    const buttonCancelar = createButton(obj.btncancel)

    divButton.appendChild(buttonAceptar)
    divButton.appendChild(buttonCancelar)

    modalContent.appendChild(divButton)
    // Agregar el contenido al modal
    this.modal.appendChild(modalContent)
    document.body.appendChild(this.modal)

    const idAceptar = document.getElementById('idAceptar')
    idAceptar.addEventListener('click', () => {
      eliminarR(objTrad)
    })
  }

  createCalendarROVE(objeto, objTranslate, rove) {
    try {
      const obj = objeto
      this.modal = document.createElement('div')
      this.modal.id = 'modalTablaViewFecha'
      this.modal.className = 'modal'
      this.modal.style.background = 'rgba(0, 0, 0, 0.5)'
      // Crear el contenido del modal
      const modalContent = createDiv(obj.divContent)
      let span = createSpan(obj.close)
      modalContent.appendChild(span)

      let texto = 'Seleccione el intervalo de fechas para la consulta:'
      texto = trO(texto, objTranslate) || texto
      obj.span.text = texto
      span = createSpan(obj.span, texto)
      modalContent.appendChild(span)
      obj.titulo.text.text = `ROVE: ${rove.toUpperCase()}`
      const title = createH3(obj.titulo, 'text')
      title.id = 'idTituloFechasH3'
      title.setAttribute('data-name', rove)
      modalContent.appendChild(title)

      const divEncabezado = createDiv(obj.divEncabezado)
      obj.imgPrint.display = 'inline-block'
      const imagenButton = createIMG(obj.imgPrint)
      obj.span.alignSelf = 'left'
      obj.span.passing = null
      obj.span.className = null
      obj.span.padding = null
      obj.span.left = '10px'
      obj.imgPrint.display = 'inline-block'
      span = createSpan(obj.span, 'Fechas')
      divEncabezado.appendChild(imagenButton)

      divEncabezado.appendChild(span)
      modalContent.appendChild(divEncabezado)
      const hr = createHR(obj)
      modalContent.appendChild(hr)
      const fechaDeHoy = fechasGenerator.fecha_corta_yyyymmdd(new Date())
      let divInput = createDiv(obj.divInput)
      obj.input.id = 'idDesde'
      obj.input.value = fechaDeHoy
      let input = createInput(obj.input)
      texto = trO('Desde:', objTranslate) || 'Desde:'
      obj.label.innerText = `${texto}: `
      obj.label.margin = 'auto 10px'
      let label = createLabel(obj.label)
      divInput.appendChild(label)
      divInput.appendChild(input)
      modalContent.appendChild(divInput)
      obj.divInput.id = 'idDivInputPorFechaHasta'
      divInput = createDiv(obj.divInput)

      texto = trO('Enviar', objTranslate) || 'Enviar:'
      obj.btnEnviar.text = texto
      const btn = createButton(obj.btnEnviar)
      btn.setAttribute('data-procedure', rove)
      modalContent.appendChild(btn)
      // Agregar el contenido al modal
      this.modal.appendChild(modalContent)

      // Agregar el modal al body del documento
      document.body.appendChild(this.modal)
      const idbtnEnviar = document.getElementById('idbtnEnviar')
      idbtnEnviar.addEventListener('click', async (e) => {
        const name = e.target.attributes[3].value
        // console.log(name)
        let inputDesde = document.getElementById('idDesde')
        let desde = inputDesde.value
        // const fechaDesde = new Date(desde)
        const fechaDesde = new Date(`${desde}T00:00:00-03:00`)
        let fechaCorta = fechasGenerator.fecha_corta_ddmmyyyy(fechaDesde)
        document.getElementById('whereUs').innerText += ` [${fechaCorta}]`
        const miAlerta = new Alerta()
        const aviso =
          'Se está realizando la consulta, va a demorar unos segundos, esta puede ser muy compleja dependiendo de los archivos involucrados y el intervalo de tiempo solicitado. Asegure la conexión de internet.' //arrayGlobal.avisoListandoControles.span.text
        const mensaje = trO(aviso, objTranslate) || aviso
        // arrayGlobal.avisoListandoControles.div.height = '200px'
        // arrayGlobal.avisoListandoControles.div.top = '70px'
        miAlerta.createControl(
          arrayGlobal.avisoListandoControles,
          mensaje,
          objTranslate
        )
        let modal = document.getElementById('modalAlertCarga')
        modal.style.display = 'block'
        document.getElementById('idSpanCarga').style.display = 'none'
        await new Promise((resolve) => setTimeout(() => resolve(), 200))
        //! comienza la busqueda del rove
        const estandaresRove = await callRove(`est${rove}`, desde, desde)

        if (estandaresRove.success === false) {
          const miAlerta = new Alerta()
          const aviso =
            'No se encotró algún registro que coincida con la fechas proporcionadas. Revise las fechas en Controles cargados.'
          const mensaje = trO(aviso, objTranslate) || aviso
          arrayGlobal.avisoRojo.span.text = mensaje
          arrayGlobal.avisoRojo.span.padding = '0px 0px 0px 0px'
          arrayGlobal.avisoRojo.div.height = '110px'
          arrayGlobal.avisoRojo.div.margin = '200px auto auto auto'
          miAlerta.createVerde(arrayGlobal.avisoRojo, mensaje, objTranslate)
          let modal = document.getElementById('modalAlertCarga')
          modal.remove()
          modal = document.getElementById('modalAlertVerde')
          modal.style.display = 'block'
        }
        if (estandaresRove.success !== false) {
          modal = document.getElementById('modalAlertCarga')
          modal.remove()
          modal = document.getElementById('modalTablaViewFecha')
          modal.remove()
          primerRender(rove, objTranslate)
          cargarStandares(estandaresRove, objTranslate)
          const documentos = await callRove(`doc${rove}`, desde, desde)
          setTimeout(() => {
            pintaBarras(documentos, objTranslate)
          }, 100)
          const downtimes = await callRove(`dwt${rove}`, desde, desde)
          setTimeout(() => {
            dwt(downtimes, objTranslate)
          }, 100)
          const table = document.getElementById('tableRove')
          table.style.display = 'block'
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  createModalMenuRove(objeto, objTranslate) {
    // eslint-disable-next-line no-unused-vars

    const obj = objeto
    this.modal = document.createElement('div')
    this.modal.id = 'modalAlertM'
    this.modal.className = 'modal'
    this.modal.style.background = 'rgba(0, 0, 0, 0.1)'
    // Crear el contenido del modal
    const modalContent = createDiv(obj.divContent)

    const span = createSpan(obj.close)
    modalContent.appendChild(span)

    //! refrescar
    obj.divCajita.id = 'idDivRefrescar'
    obj.divCajita.onClick = funcionRefrescar
    let div = createDiv(obj.divCajita)
    const imgRefresh = createIMG(obj.imgRefresh)
    let texto = trO(obj.refresh.text, objTranslate) || obj.refresh.text
    const spanRefresh = createSpan(obj.refresh, texto)
    div.appendChild(imgRefresh)
    div.appendChild(spanRefresh)
    modalContent.appendChild(div)
    obj.divCajita.onClick = null

    //! fin refrescar

    //! salir
    obj.divCajita.id = 'idDivSalir'
    obj.divCajita.onClick = funcionSalir
    div = createDiv(obj.divCajita)
    const imgSalir = createIMG(obj.imgSalir)
    texto = trO(obj.salir.text, objTranslate) || obj.salir.text
    const spanSalir = createSpan(obj.salir, texto)
    div.appendChild(imgSalir)
    div.appendChild(spanSalir)
    modalContent.appendChild(div)
    obj.divCajita.onClick = null
    //! fin salir

    this.modal.appendChild(modalContent)

    // Agregar el modal al body del documento
    document.body.appendChild(this.modal)
  }

  destroyAlerta() {
    if (this.modal) {
      // Elimina el elemento modal del DOM
      this.modal.remove()

      // Limpia la referencia al elemento
      this.modal = null
    }
  }
}

export default Alerta
export { Alerta }
