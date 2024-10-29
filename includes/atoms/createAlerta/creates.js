import { trO } from '../../../controllers/trOA.js'
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
  config.marginRight !== null
    ? (button.style.marginRight = config.marginRight)
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
  let valor = config.value
  config.id !== null ? (input.id = config.id) : null
  input.type = config.type
  if (config.type === 'password') {
    input.autocomplete = 'new-password'
  }
  if (config.type === 'number' && valor !== null && valor !== '') {
    valor = parseFloat(config.value)
  }
  config.name !== null ? (input.name = config.id) : null
  config.value !== null ? (input.value = valor) : null
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
  config.innerText !== null
    ? (label.innerText = config.innerText.replace(/\n/g, ''))
    : null
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
  label.innerHTML = label.innerHTML.replace('<br>', '')
  return label
}

function createH3(config, typeAlert) {
  const h3 = document.createElement('h3')
  typeAlert !== null
    ? (h3.textContent = config.text[typeAlert])
    : (h3.textContent = typeAlert)
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

function createSelect(array, params, objTranslate) {
  const { id, className } = params
  const select = document.createElement('select')
  if (id) {
    select.setAttribute('id', id)
  }
  if (className) {
    select.setAttribute('class', className)
  }

  while (select.firstChild) {
    select.removeChild(select.firstChild)
  }
  const nuevoArray = [...array]
  // nuevoArray.forEach((element, index) => {
  //   index === 1 ? select.setAttribute('selector', element[1]) : null
  // })

  if (array.length > 0) {
    const emptyOption = document.createElement('option')
    emptyOption.value = ''
    emptyOption.text = ''
    select.appendChild(emptyOption)
    array.forEach(([value, text]) => {
      const option = document.createElement('option')
      option.value = value
      option.text = trO(text, objTranslate) || text
      select.appendChild(option)
    })
  }

  return select
}

function createRadioButton(params) {
  const nuevoRadioButton = document.createElement('input')
  nuevoRadioButton.setAttribute('type', 'radio')
  nuevoRadioButton.setAttribute('class', params.class)
  nuevoRadioButton.setAttribute('name', params.name)
  params.checked !== null
    ? nuevoRadioButton.setAttribute('checked', params.name)
    : null
  params.value !== null
    ? nuevoRadioButton.setAttribute('value', params.value)
    : null
  params.id !== null ? nuevoRadioButton.setAttribute('id', params.id) : null
  params.width !== null ? (nuevoRadioButton.style.width = params.width) : null
  params.heigth !== null
    ? (nuevoRadioButton.style.height = params.height)
    : null
  params.background !== null
    ? (nuevoRadioButton.style.backgroundColor = params.background)
    : null
  params.border !== null
    ? (nuevoRadioButton.style.border = params.border)
    : null
  params.marginLeft !== null
    ? (nuevoRadioButton.style.marginLeft = params.marginLeft)
    : null
  params.marginRight !== null
    ? (nuevoRadioButton.style.marginRight = params.marginRight)
    : null
  params.marginTop !== null
    ? (nuevoRadioButton.style.marginTop = params.marginTop)
    : null
  params.marginBotton !== null
    ? (nuevoRadioButton.style.marginBotton = params.marginBotton)
    : null
  params.paddingLeft !== null
    ? (nuevoRadioButton.style.paddingLeft = params.paddingLeft)
    : null
  params.paddingRight !== null
    ? (nuevoRadioButton.style.paddingRight = params.paddingRight)
    : null
  params.paddingTop !== null
    ? (nuevoRadioButton.style.paddingTop = params.paddingTop)
    : null
  // eslint-disable-next-line max-len
  params.paddingBotton !== null
    ? (nuevoRadioButton.style.paddingBotton = params.paddingBotton)
    : null
  params.disabled !== null
    ? nuevoRadioButton.setAttribute('disabled', params.disabled)
    : null
  params.dataCustom !== null
    ? nuevoRadioButton.setAttribute('data-custom', params.dataCustom)
    : null

  return nuevoRadioButton
}

function createTextArea(config) {
  const textArea = document.createElement('textarea')
  config.id !== null ? (textArea.id = config.id) : null
  config.value !== null ? (textArea.value = config.value) : null
  config.className !== null ? (textArea.className = config.className) : null
  config.margin !== null ? (textArea.margin = config.margin) : null
  config.fontWeight !== null
    ? (textArea.style.fontWeight = config.fontWeight)
    : null
  config.rows !== null ? textArea.setAttribute('rows', config.rows) : null
  config.disabled !== null ? (textArea.disabled = config.disabled) : null
  return textArea
}

export {
  createButton,
  createDiv,
  createSpan,
  createInput,
  createLabel,
  createH3,
  createHR,
  createIMG,
  createSelect,
  createRadioButton,
  createTextArea,
}
