function createTextArea(config) {
  const textarea = document.createElement('textarea')
  config.id !== null && config.id !== undefined
    ? (textarea.id = config.id)
    : null
  config.name !== null && config.name !== undefined
    ? (textarea.name = config.name)
    : null
  config.value !== null && config.value !== undefined
    ? (textarea.value = config.value)
    : null
  config.className !== null && config.className !== undefined
    ? (textarea.className = config.className)
    : null
  config.height !== null && config.height !== undefined
    ? (textarea.style.height = config.height)
    : null
  config.width !== null && config.width !== undefined
    ? (textarea.style.width = config.width)
    : null
  config.color !== null && config.color !== undefined
    ? (textarea.style.color = config.color)
    : null
  config.backgroundColor !== null && config.backgroundColor !== undefined
    ? (textarea.style.backgroundColor = config.backgroundColor)
    : null
  config.padding !== null && config.padding !== undefined
    ? (textarea.style.padding = config.padding)
    : null
  config.margin !== null && config.margin !== undefined
    ? (textarea.style.margin = config.margin)
    : null
  config.cursor !== null && config.cursor !== undefined
    ? (textarea.style.cursor = config.cursor)
    : null
  config.borderRadius !== null && config.borderRadius !== undefined
    ? (textarea.style.borderRadius = config.borderRadius)
    : null
  config.outline !== null && config.outline !== undefined
    ? (textarea.style.outline = config.outline)
    : null
  config.boxShadow !== null && config.boxShadow !== undefined
    ? (textarea.style.boxShadow = config.boxShadow)
    : null
  config.textAlign !== null && config.textAlign !== undefined
    ? (textarea.style.textAlign = config.textAlign)
    : null
  config.fontSize !== null && config.fontSize !== undefined
    ? (textarea.style.fontSize = config.fontSize)
    : null
  config.fontFamily !== null && config.fontFamily !== undefined
    ? (textarea.style.fontFamily = config.fontFamily)
    : null
  config.fontWeight !== null && config.fontWeight !== undefined
    ? (textarea.style.fontWeight = config.fontWeight)
    : null
  config.innerHTML !== null && config.innerHTML !== undefined
    ? (textarea.innerHTML = config.innerHTML)
    : null
  config.placeholder !== null && config.placeholder !== undefined
    ? (textarea.placeHolder = config.placeHolder)
    : null
  config.focus !== null && config.focus !== undefined
    ? setTimeout(() => textarea.focus(), 0)
    : null
  config.textarea !== null && config.textarea !== undefined
    ? (textarea.style.transition = 'background-color 0.3s')
    : null

  config.rows !== null && config.rows !== undefined
    ? textarea.setAttribute('rows', config.rows)
    : null

  config.cols !== null && config.cols !== undefined
    ? textarea.setAttribute('cols', config.cols)
    : null

  config.hoverColor !== null && config.hoverColor !== undefined
    ? textarea.addEventListener('mouseover', () => {
        textarea.style.color = config.hoverColor
      })
    : null
  config.hoverColor !== null && config.hoverColor !== undefined
    ? textarea.addEventListener('mouseout', () => {
        textarea.style.color = config.fontColor
      })
    : null
  config.onClick !== null && config.onClick !== undefined
    ? textarea.addEventListener('click', config.onClick)
    : null
  textarea.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      // Lógica que se ejecutará al presionar "Enter"
      if (config.onEnterPress) {
        config.onEnterPress()
      }
    }
  })
  textarea.addEventListener('focus', () => {
    // Lógica que se ejecutará al obtener el foco
    if (config.onFocus) {
      config.onFocus()
    }
  })
  return textarea
}

export default createTextArea
