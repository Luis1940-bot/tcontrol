import { encriptar, desencriptar } from '../../../controllers/cript.js'
import traerRegistros from '../../Rove/Controladores/traerRegistros.js'

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

async function handleClickEnlace(dato) {
  const { rove } = desencriptar(sessionStorage.getItem('contenido'))
  const control = await traerRegistros(`controlNT,${dato}`, null)
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
  sessionStorage.setItem('contenido', encriptar({ rove: rove }))
}

function generarUrlParaEnlace(dato) {
  const link = document.createElement('a')
  link.href = '#' // Reemplaza con la lógica real para generar la URL del enlace
  link.textContent = dato
  link.style.color = 'blue' // Establece el color del enlace, puedes personalizar según tus necesidades
  link.style.textDecoration = 'underline' // Subraya el enlace
  link.classList.add('nr-rove')

  // link.target = '_blank'
  link.addEventListener('click', function (event) {
    event.preventDefault()
    handleClickEnlace(dato)
  })
  return link
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

class AlertaRove {
  constructor() {
    this.modal = null
  }

  createMostrarNumDocumentos(objeto, objTrad, filtrado, typeAlert) {
    const obj = objeto

    this.modal = document.createElement('div')
    this.modal.id = 'modalAlert'
    this.modal.className = 'modal'
    this.modal.style.background = 'rgba(0, 0, 0, 0.5)'

    obj.divContent.id = 'divAlertRove'
    obj.divContent.className = 'modal-doc-rove'
    const modalContent = createDiv(obj.divContent)
    const span = createSpan(obj.close)
    modalContent.appendChild(span)

    let texto =
      trO(obj.titulo.text[typeAlert], objTrad) || obj.titulo.text[typeAlert]
    obj.titulo.text[typeAlert] = texto
    const title = createH3(obj.titulo, typeAlert)
    modalContent.appendChild(title)

    obj.divCajita.id = 'divCajitaAlertRove'
    const divCajita = createDiv(obj.divCajita)
    filtrado.forEach((element) => {
      const docs = generarUrlParaEnlace(element[2])
      divCajita.appendChild(docs)
    })
    modalContent.appendChild(divCajita)
    this.modal.appendChild(modalContent)
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

export default AlertaRove
export { AlertaRove }
