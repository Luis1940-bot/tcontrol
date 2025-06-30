function createSpan(config, text) {
  const span = document.createElement('span');
  const texto = text || config.text;
  span.textContent = texto;
  config.fontSize !== null && config.fontSize !== undefined
    ? (span.style.fontSize = config.fontSize)
    : null;
  config.fontColor !== null && config.fontColor !== undefined
    ? (span.style.color = config.fontColor)
    : null;
  config.id !== null && config.id !== undefined ? (span.id = config.id) : null;
  span.style.width = 'auto';
  config.marginTop !== null && config.marginTop !== undefined
    ? (span.style.marginTop = config.marginTop)
    : null;
  config.display !== null && config.display !== undefined
    ? (span.style.display = config.display)
    : null;
  config.fontFamily !== null && config.fontFamily !== undefined
    ? (span.style.fontFamily = config.fontFamily)
    : null;
  config.fontStyle !== null && config.fontStyle !== undefined
    ? (span.style.fontStyle = config.fontStyle)
    : null;
  config.alignSelf !== null && config.alignSelf !== undefined
    ? (span.style.alignSelf = config.alignSelf)
    : null;
  config.className !== null && config.className !== undefined
    ? (span.className = config.className)
    : null;
  config.fontWeight !== null && config.fontWeight !== undefined
    ? (span.style.fontWeight = config.fontWeight)
    : null;
  config.cursor !== null && config.cursor !== undefined
    ? (span.style.cursor = config.cursor)
    : null;
  config.padding !== null && config.padding !== undefined
    ? (span.style.padding = config.padding)
    : null;
  config.position !== null && config.position !== undefined
    ? (span.style.position = config.position)
    : null;
  config.top !== null && config.top !== undefined
    ? (span.style.top = config.top)
    : null;
  config.right !== null && config.right !== undefined
    ? (span.style.right = config.right)
    : null;
  config.left !== null && config.left !== undefined
    ? (span.style.left = config.left)
    : null;
  config.innerHTML !== null && config.innerHTML !== undefined
    ? (span.innerHTML = config.innerHTML)
    : null;
  config.margin !== null && config.margin !== undefined
    ? (span.style.margin = config.margin)
    : null;
  config.transition !== null && config.transition !== undefined
    ? (span.style.transition = 'background-color 0.3s')
    : null;

  config.hoverColor !== null && config.hoverColor !== undefined
    ? span.addEventListener('mouseover', () => {
        span.style.color = config.hoverColor;
      })
    : null;
  config.hoverColor !== null && config.hoverColor !== undefined
    ? span.addEventListener('mouseout', () => {
        span.style.color = config.fontColor;
      })
    : null;
  config.onClick !== null && config.onClick !== undefined
    ? span.addEventListener('click', config.onClick)
    : null;
  return span;
}

export default createSpan;
