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

export default createSpan
