function createA(config, text) {
  const a = document.createElement('a')
  const texto = text || config.text
  a.textContent = texto
  config.fontSize !== null && config.fontSize !== undefined
    ? (a.style.fontSize = config.fontSize)
    : null
  config.fontColor !== null && config.fontColor !== undefined
    ? (a.style.color = config.fontColor)
    : null
  config.id !== null && config.id !== undefined ? (a.id = config.id) : null
  a.style.width = 'auto'
  config.marginTop !== null && config.marginTop !== undefined
    ? (a.style.marginTop = config.marginTop)
    : null
  config.display !== null && config.display !== undefined
    ? (a.style.display = config.display)
    : null
  config.fontFamily !== null && config.fontFamily !== undefined
    ? (a.style.fontFamily = config.fontFamily)
    : null
  config.fontStyle !== null && config.fontStyle !== undefined
    ? (a.style.fontStyle = config.fontStyle)
    : null
  config.alignSelf !== null && config.alignSelf !== undefined
    ? (a.style.alignSelf = config.alignSelf)
    : null
  config.className !== null && config.className !== undefined
    ? (a.className = config.className)
    : null
  config.fontWeight !== null && config.fontWeight !== undefined
    ? (a.style.fontWeight = config.fontWeight)
    : null
  config.cursor !== null && config.cursor !== undefined
    ? (a.style.cursor = config.cursor)
    : null
  config.padding !== null && config.padding !== undefined
    ? (a.style.padding = config.padding)
    : null
  config.position !== null && config.position !== undefined
    ? (a.style.position = config.position)
    : null
  config.top !== null && config.top !== undefined
    ? (a.style.top = config.top)
    : null
  config.right !== null && config.right !== undefined
    ? (a.style.right = config.right)
    : null
  config.left !== null && config.left !== undefined
    ? (a.style.left = config.left)
    : null
  config.innerHTML !== null && config.innerHTML !== undefined
    ? (a.innerHTML = config.innerHTML)
    : null
  config.margin !== null && config.margin !== undefined
    ? (a.style.margin = config.margin)
    : null
  config.href !== null && config.href !== undefined
    ? a.setAttribute('href', config.href)
    : null
  config.data !== null && config.data !== undefined
    ? a.setAttribute('data', config.data)
    : null
  config.transition !== null && config.transition !== undefined
    ? (a.style.transition = 'background-color 0.3s')
    : null

  config.hoverColor !== null && config.hoverColor !== undefined
    ? a.addEventListener('mouseover', () => {
        a.style.color = config.hoverColor
      })
    : null
  config.hoverColor !== null && config.hoverColor !== undefined
    ? a.addEventListener('mouseout', () => {
        a.style.color = config.fontColor
      })
    : null
  config.onClick !== null && config.onClick !== undefined
    ? a.addEventListener('click', config.onClick)
    : null
  return a
}

export default createA
