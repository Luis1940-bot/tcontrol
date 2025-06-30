function createLabel(config) {
  const label = document.createElement('label');
  config.id !== null && config.id !== undefined ? (label.id = config.id) : null;
  config.htmlFor !== null && config.htmlFor !== undefined
    ? (label.htmlFor = config.htmlFor)
    : null;
  config.innerText !== null && config.innerText !== undefined
    ? (label.innerText = config.innerText)
    : null;
  config.className !== null && config.className !== undefined
    ? (label.className = config.className)
    : null;
  config.height !== null && config.height !== undefined
    ? (label.style.height = config.height)
    : null;
  config.width !== null && config.width !== undefined
    ? (label.style.width = config.width)
    : null;
  config.color !== null && config.color !== undefined
    ? (label.color = config.color)
    : null;
  config.backgroundColor !== null && config.backgroundColor !== undefined
    ? (label.style.backgroundColor = config.backgroundColor)
    : null;
  config.padding !== null && config.padding !== undefined
    ? (label.style.padding = config.padding)
    : null;
  config.margin !== null && config.margin !== undefined
    ? (label.style.margin = config.margin)
    : null;
  config.cursor !== null && config.cursor !== undefined
    ? (label.style.cursor = config.cursor)
    : null;
  config.borderRadius !== null && config.borderRadius !== undefined
    ? (label.style.borderRadius = config.borderRadius)
    : null;
  config.boxShadow !== null && config.boxShadow !== undefined
    ? (label.style.boxShadow = config.boxShadow)
    : null;
  config.textAlign !== null && config.textAlign !== undefined
    ? (label.style.textAlign = config.textAlign)
    : null;
  config.fontSize !== null && config.fontSize !== undefined
    ? (label.style.fontSize = config.fontSize)
    : null;
  config.fontColor !== null && config.fontColor !== undefined
    ? (label.style.fontColor = config.fontColor)
    : null;
  config.fontFamily !== null &&
  config.fontFamily !== undefined &&
  config.fontFamily !== undefined
    ? (label.style.fontFamily = config.fontFamily)
    : null;
  config.fontWeight !== null && config.fontWeight !== undefined
    ? (label.style.fontWeight = config.fontWeight)
    : null;
  config.innerHTML !== null && config.innerHTML !== undefined
    ? (label.innerHTML = config.innerHTML)
    : null;
  config.placeolder !== null && config.placeolder !== undefined
    ? (label.placeHolder = config.placeHolder)
    : null;
  config.onClick !== null && config.onClick !== undefined
    ? (label.style.transition = 'background-color 0.3s')
    : null;
  config.hoverColor !== null && config.hoverColor !== undefined
    ? label.addEventListener('mouseover', () => {
        label.style.color = config.hoverColor;
      })
    : null;
  config.hoverColor !== null && config.hoverColor !== undefined
    ? label.addEventListener('mouseout', () => {
        label.style.color = config.fontColor;
      })
    : null;
  config.onClick !== null && config.onClick !== undefined
    ? label.addEventListener('click', config.onClick)
    : null;

  return label;
}

export default createLabel;
