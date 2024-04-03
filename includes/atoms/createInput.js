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

export default createInput
