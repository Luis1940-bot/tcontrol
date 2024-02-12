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
import enviaMail from '../../Nodemailer/sendEmail.js'
// eslint-disable-next-line import/extensions, import/no-useless-path-segments
import { encriptar, desencriptar } from '../../controllers/cript.js'
import fechasGenerator from '../../controllers/fechas.js'

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
  // funciones.GuardarCambio();
}
const funcionGuardarComoNuevo = () => {
  // funciones.GuardarComoNuevo();
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

async function firmar(firmadoPor) {
  const pass = document.getElementById('idInputFirma').value
  const supervisor = await traerFirma(pass)

  const modal = document.getElementById('modalAlert')
  modal.style.display = 'none'
  modal.remove()
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
  setTimeout(() => {
    const menu = document.getElementById('modalAlertM')
    menu.style.display = 'none'
    menu.remove()
  }, 1000)
  sessionStorage.setItem('config_menu', encriptar(configMenu))
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

function subirImagenes(img) {
  if (img.length === 0) {
    return null
  }
  if (img[0].extension.length === 0) {
    return null
  }
  // console.log(img)
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
  obj.span.fontSize = '16px'
  obj.span.fontColor = '#ececec'
  obj.span.fontWeight = '700'
  obj.span.marginTop = '10px'
  const spanTitulo = createSpan(obj.span, texto)
  modalContent.appendChild(spanTitulo)
  span = createSpan(obj.close)
  modalContent.appendChild(span)
  let frase = ''
  texto = trO(mensaje.cantidadRegistros, objTrad) || mensaje.cantidadRegistros
  frase = `${texto} ${insertado.registros}`
  texto = trO(mensaje.items, objTrad) || mensaje.items
  frase = `${frase} ${texto}`
  obj.span.text = frase
  obj.span.fontSize = '14px'
  obj.span.fontColor = '#ececec'
  obj.span.fontWeight = '500'
  obj.span.marginTop = '0px'
  let spanTexto = createSpan(obj.span, frase)
  modalContent.appendChild(spanTexto)
  texto = trO(mensaje.documento, objTrad) || mensaje.documento
  frase = `${texto} ${insertado.documento}.`
  obj.span.text = frase
  obj.span.fontSize = '14px'
  obj.span.fontColor = '#ececec'
  obj.span.fontWeight = '500'
  obj.span.marginTop = '0px'
  spanTexto = createSpan(obj.span, frase)
  modalContent.appendChild(spanTexto)
  modal.appendChild(modalContent)
  if (enviado) {
    texto = trO(mensaje.enviado, objTrad) || mensaje.enviado
    frase = `${texto}`
    obj.span.text = frase
    obj.span.fontSize = '14px'
    obj.span.fontColor = '#ececec'
    obj.span.fontWeight = '500'
    obj.span.marginTop = '0px'
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
  obj.span.fontSize = '16px'
  obj.span.fontColor = '#ececec'
  obj.span.fontWeight = '700'
  obj.span.marginTop = '10px'
  const spanTitulo = createSpan(obj.span, texto)
  modalContent.appendChild(spanTitulo)
  span = createSpan(obj.close)
  modalContent.appendChild(span)
  const frase = trO(mensaje.fail, objTrad) || mensaje.fail
  obj.span.text = frase
  obj.span.fontSize = '14px'
  obj.span.fontColor = '#ececec'
  obj.span.fontWeight = '500'
  obj.span.marginTop = '0px'
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

    const documento = document.getElementById('numberDoc')
    documento.innerText = insertado.documento
    sessionStorage.setItem('doc', encriptar(insertado.documento))
    const configMenuStorage = desencriptar(
      sessionStorage.getItem('config_menu')
    )
    const configMenu = {
      guardar: true,
      guardarComo: false,
      guardarCambios: false,
      firma: false,
      configFirma: {},
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
  modal
) {
  try {
    const nuevoObjetoControl = { ...nuevoObjeto }
    delete nuevoObjetoControl.name
    delete nuevoObjetoControl.email
    delete nuevoObjetoControl.detalle
    delete nuevoObjetoControl.objImagen

    const insertado = await insertarRegistro(nuevoObjetoControl)
    // eslint-disable-next-line max-len
    // const insertado = { success: true, message: 'ok', registros: '18', documento: '22222222222' };
    // console.log(insertado);

    const imagenes = await subirImagenes(nuevoObjeto.objImagen)
    // const imagenes = { success: true, message: 'ok', rutaImagen: '../../' };
    // console.log(imagenes);

    const enviaPorEmail = sessionStorage.getItem('envia_por_email')
    const encabezados = { ...objEncabezados }
    encabezados.documento = insertado.documento
    let enviado = ''
    if (enviaPorEmail) {
      enviado = await enviaMail(nuevoObjeto, encabezados)
      // enviado = { success: true, message: 'ok', reporte: 'DWT', documento: '22222222222' };
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

function armaEncabezado(arrayMensajes, objTrad) {
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
    documento: '3333333333333',
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
  const firmado =
    configMenu.configFirma && Object.keys(configMenu.configFirma).length !== 0
  let elementosStyle
  let nuevoConfigMenu
  if (doc === 'null' && firmado === undefined) {
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
    idMensajeFirmado.innerText = `${firmadoPor}: ${configMenu.configFirma.nombre}`
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
  if (doc !== 'null' && firmado === undefined) {
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
      ],
      style: ['none', 'none', 'flex', 'flex', 'flex', 'flex', 'none'],
      remove: [null, null, null, null, null, null, null],
    }
  }
  if (doc !== 'null' && firmado === true) {
    //! console.log('menú guardado con firma');
    const textFirmado = arrayGlobal.objMenu.mensajeFirmado.text
    const firmadoPor = trO(textFirmado, objTranslate) || textFirmado
    const idMensajeFirmado = document.getElementById('idMensajeFirmado')
    idMensajeFirmado.innerText = `${firmadoPor}: ${configMenu.configFirma.nombre}`
    idMensajeFirmado.style.display = 'flex'
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
        'flex',
        'flex',
        'none',
      ],
      remove: [null, null, null, null, null, null, null, null, null],
    }
  }
  procesoStyleDisplay(elementosStyle)
}

function estilosTheadCell(element, index, objTrad, arrayWidthEncabezado) {
  const cell = document.createElement('th')
  cell.textContent =
    trO(element.toUpperCase(), objTrad) || element.toUpperCase()
  cell.style.background = '#000000'
  cell.style.border = '1px solid #cecece'
  cell.style.overflow = 'hidden'

  const widthCell =
    widthScreenAjustado * widthScreen * arrayWidthEncabezado[index]

  let size = '8px'
  if (widthScreen >= 800) {
    size = '10px'
  }
  cell.style.fontSize = size
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
  typeof datos === 'string' && datos !== null
    ? (dato = trA(datos, objTrad) || datos)
    : (dato = datos)
  if (dato !== null && type === null) {
    cell.textContent = `${dato} ${requerido}` || `${dato} ${requerido}`
  } else if (dato === null && type !== null) {
    cell.appendChild(type)
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
      procesoStyleDisplay(elementosStyle)
      limpiaArrays()
      const okGuardar = guardarNuevo(
        arrayGlobal.objetoControl,
        arrayGlobal.arrayControl
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
        const convertido = convertirObjATextPlano(arrayGlobal.objetoControl)
        const nuevoObjeto = {
          ...arrayGlobal.objetoControl,
          // eslint-disable-next-line max-len
          objJSON: Array(arrayGlobal.objetoControl.fecha.length)
            .fill(null)
            .map((_, index) => (index === 0 ? convertido : null)),
        }
        const encabezados = armaEncabezado(arrayGlobal, objTrad)
        // soloEnviaEmail(nuevoObjeto, encabezados);
        // console.log(encabezados);
        insert(
          nuevoObjeto,
          convertido,
          encabezados,
          miAlertaInforme,
          objTrad,
          modal
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
    trash.style.width = '20px'
    trash.src = `${ruta}`
    buttonAceptar.appendChild(trash)
    modalContent.appendChild(buttonAceptar)
    const img = imgCopy.cloneNode(true)
    img.id = 'idVisualizador'
    img.style.height = '250px'
    img.style.width = '250px'
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
    this.modal.style.background = 'rgba(224, 220, 220, 0.7)'
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
    console.log(enviaPorEmail)
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
            'No teine permiso para crear o revisar este control. Póngase en contacto con su supervisor. Gracias',
            objTrad
          ) ||
          'No teine permiso para crear o revisar este control. Póngase en contacto con su supervisor. Gracias'
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
        const fechaDesde = new Date(desde)
        const fechaHasta = new Date(hasta)
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

  createMenuListControls(objeto, control, nuxpedido, traerControl, objTrad) {
    try {
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
        const cell = estilosTheadCell(
          element,
          index,
          objTrad,
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