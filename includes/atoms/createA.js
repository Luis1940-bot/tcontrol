function createA(config, text) {
  const a = document.createElement('a')
  const texto = text || config.text
  a.textContent = texto
  config.fontSize !== null ? (a.style.fontSize = config.fontSize) : null
  config.fontColor !== null ? (a.style.color = config.fontColor) : null
  config.id !== null ? (a.id = config.id) : null
  a.style.width = 'auto'
  config.marginTop !== null ? (a.style.marginTop = config.marginTop) : null
  config.display !== null ? (a.style.display = config.display) : null
  config.fontFamily !== null ? (a.style.fontFamily = config.fontFamily) : null
  config.fontStyle !== null ? (a.style.fontStyle = config.fontStyle) : null
  config.alignSelf !== null ? (a.style.alignSelf = config.alignSelf) : null
  config.className !== null ? (a.className = config.className) : null
  config.fontWeight !== null ? (a.style.fontWeight = config.fontWeight) : null
  config.cursor !== null ? (a.style.cursor = config.cursor) : null
  config.padding !== null ? (a.style.padding = config.padding) : null
  config.position !== null ? (a.style.position = config.position) : null
  config.top !== null ? (a.style.top = config.top) : null
  config.right !== null ? (a.style.right = config.right) : null
  config.left !== null ? (a.style.left = config.left) : null
  config.innerHTML !== null ? (a.innerHTML = config.innerHTML) : null
  config.margin !== null ? (a.style.margin = config.margin) : null
  config.href !== null ? a.setAttribute('href', config.href) : null
  config.data !== null ? a.setAttribute('data', config.data) : null
  a.style.transition = 'background-color 0.3s'
  config.hoverColor !== null
    ? a.addEventListener('mouseover', () => {
        a.style.color = config.hoverColor
      })
    : null
  config.hoverColor !== null
    ? a.addEventListener('mouseout', () => {
        a.style.color = config.fontColor
      })
    : null
  config.onClick !== null ? a.addEventListener('click', config.onClick) : null
  return a
}

export default createA
