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

export default createLabel
