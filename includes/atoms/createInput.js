function createInput(config) {
  const input = document.createElement('input');
  config.id !== null && config.id !== undefined ? (input.id = config.id) : null;
  input.type = config.type;
  if (config.type === 'password') {
    input.autocomplete = 'new-password';
  }
  config.name !== null && config.name !== undefined
    ? (input.name = config.name)
    : null;
  config.value !== null && config.value !== undefined
    ? (input.value = config.value)
    : null;
  config.checked !== null && config.checked !== undefined
    ? (input.style.checked = config.checked)
    : null;
  config.className !== null && config.className !== undefined
    ? (input.className = config.className)
    : null;
  config.height !== null && config.height !== undefined
    ? (input.style.height = config.height)
    : null;
  config.width !== null && config.width !== undefined
    ? (input.style.width = config.width)
    : null;
  config.color !== null && config.color !== undefined
    ? (input.style.color = config.color)
    : null;
  config.backgroundColor !== null && config.backgroundColor !== undefined
    ? (input.style.backgroundColor = config.backgroundColor)
    : null;
  config.padding !== null && config.padding !== undefined
    ? (input.style.padding = config.padding)
    : null;
  config.margin !== null && config.margin !== undefined
    ? (input.style.margin = config.margin)
    : null;
  config.cursor !== null && config.cursor !== undefined
    ? (input.style.cursor = config.cursor)
    : null;
  config.borderRadius !== null && config.borderRadius !== undefined
    ? (input.style.borderRadius = config.borderRadius)
    : null;
  config.outline !== null && config.outline !== undefined
    ? (input.style.outline = config.outline)
    : null;
  config.boxShadow !== null && config.boxShadow !== undefined
    ? (input.style.boxShadow = config.boxShadow)
    : null;
  config.textAlign !== null && config.textAlign !== undefined
    ? (input.style.textAlign = config.textAlign)
    : null;
  config.fontSize !== null && config.fontSize !== undefined
    ? (input.style.fontSize = config.fontSize)
    : null;
  config.fontFamily !== null && config.fontFamily !== undefined
    ? (input.style.fontFamily = config.fontFamily)
    : null;
  config.fontWeight !== null && config.fontWeight !== undefined
    ? (input.style.fontWeight = config.fontWeight)
    : null;
  config.innerHTML !== null && config.innerHTML !== undefined
    ? (input.innerHTML = config.innerHTML)
    : null;
  config.placeholder !== null && config.placeholder !== undefined
    ? (input.placeHolder = config.placeHolder)
    : null;
  config.focus !== null && config.focus !== undefined
    ? setTimeout(() => input.focus(), 0)
    : null;
  config.input !== null && config.input !== undefined
    ? (input.style.transition = 'background-color 0.3s')
    : null;

  config.accept !== null && config.accept !== undefined
    ? input.setAttribute('accept', config.accept)
    : null;

  config.hoverColor !== null && config.hoverColor !== undefined
    ? input.addEventListener('mouseover', () => {
        input.style.color = config.hoverColor;
      })
    : null;
  config.hoverColor !== null && config.hoverColor !== undefined
    ? input.addEventListener('mouseout', () => {
        input.style.color = config.fontColor;
      })
    : null;
  config.onClick !== null && config.onClick !== undefined
    ? input.addEventListener('click', config.onClick)
    : null;
  input.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      // Lógica que se ejecutará al presionar "Enter"
      if (config.onEnterPress) {
        config.onEnterPress();
      }
    }
  });
  input.addEventListener('focus', () => {
    // Lógica que se ejecutará al obtener el foco
    if (config.onFocus) {
      config.onFocus();
    }
  });
  return input;
}

export default createInput;
