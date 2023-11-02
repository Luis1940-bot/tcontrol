function createButton(config) {
  const button = document.createElement('button');
  button.className = `${config.className}`;
  button.textContent = config.text;
  button.style.display = config.display;
  button.style.fontSize = config.fontSize;
  button.style.color = config.fontColor;
  button.style.background = config.backColor;
  button.style.marginTop = config.marginTop;
  button.style.fontWeight = config.fontWeight;
  button.style.width = config.width;
  button.style.height = config.height;
  button.style.cursor = config.cursor;
  button.style.borderRadius = config.borderRadius;
  button.style.transition = 'background-color 0.3s';
  button.addEventListener('mouseover', () => {
    button.style.backgroundColor = config.hoverBackground;
    button.style.color = config.hoverColor;
  });
  button.addEventListener('mouseout', () => {
    button.style.backgroundColor = config.backColor;
    button.style.color = config.fontColor;
  });
  button.addEventListener('click', (config.onClick));

  return button;
}

function createDiv(config) {
  const div = document.createElement('div');
  div.className = config.className;
  div.style.position = config.position;
  div.style.borderRadius = config.borderRadius;
  div.style.width = config.width;
  div.style.height = config.height;
  div.style.background = config.background;
  div.style.border = config.border;
  div.style.boxShadow = config.boxShadow;
  div.style.margin = config.margin;
  div.style.display = config.display;
  div.style.flexDirection = config.flexDirection;
  div.style.padding = config.padding;
  div.style.overflow = config.overflow;
  div.style.textAlign = config.textAlign;
  div.style.gap = config.gap;
  config.top !== null ? div.style.top = config.top : null;
  return div;
}

function createSpan(config, text) {
  const span = document.createElement('span');
  const texto = text || config.text;
  span.textContent = texto;
  span.style.fontSize = config.fontSize;
  span.style.color = config.fontColor;
  config.marginTop !== null ? span.style.marginTop = config.marginTop : null;
  span.style.display = config.display;
  span.style.fontFamily = config.fontFamily;
  span.style.alignSelf = config.alignSelf;
  span.className = config.className;
  span.style.fontWeight = config.fontWeight;
  config.cursor !== null ? span.style.cursor = config.cursor : null;
  config.padding !== null ? span.style.padding = config.padding : null;
  config.position !== null ? span.style.position = config.position : null;
  config.top !== null ? span.style.top = config.top : null;
  config.right !== null ? span.style.right = config.right : null;
  config.left !== null ? span.style.left = config.left : null;
  config.innerHTML !== null ? span.innerHTML = config.innerHTML : null;
  span.style.transition = 'background-color 0.3s';
  config.hoverColor !== null ? span.addEventListener('mouseover', () => {
    span.style.color = config.hoverColor;
  }) : null;
  config.hoverColor !== null ? span.addEventListener('mouseout', () => {
    span.style.color = config.fontColor;
  }) : null;
  span.addEventListener('click', (config.onClick));
  return span;
}

function createH3(config) {
  const h3 = document.createElement('h3');
  h3.textContent = config.text;
  h3.style.fontSize = config.fontSize;
  h3.style.fontColor = config.fontColor;
  h3.style.marginTop = config.marginTop;
  h3.style.display = config.display;
  h3.style.fontFamily = config.fontFamily;
  h3.style.alignSelf = config.alignSelf;
  h3.className = config.className;
  return h3;
}

class Alerta {
  constructor() {
    this.modal = null;
  }

  createAlerta(obj) {
    // Crear el elemento modal
    this.modal = document.createElement('div');
    this.modal.id = 'modalAlert';
    this.modal.className = 'modal';
    this.modal.style.background = 'rgba(0, 0, 0, 0.5)';
    // Crear el contenido del modal
    const modalContent = createDiv(obj.divContent);

    const span = createSpan(obj.close);
    modalContent.appendChild(span);

    const title = createH3(obj.titulo);
    modalContent.appendChild(title);

    const spanTexto = createSpan(obj.span);
    modalContent.appendChild(spanTexto);

    const divButton = createDiv(obj.divButtons);

    const buttonAceptar = createButton(obj.btnaccept);
    const buttonCancelar = createButton(obj.btncancel);
    const buttonOk = createButton(obj.btnok);

    divButton.appendChild(buttonAceptar);
    divButton.appendChild(buttonCancelar);
    divButton.appendChild(buttonOk);

    modalContent.appendChild(divButton);
    // Agregar el contenido al modal
    this.modal.appendChild(modalContent);

    // Agregar el modal al body del documento
    document.body.appendChild(this.modal);
  }

  createVerde(obj, texto) {
    this.modal = document.createElement('div');
    this.modal.id = 'modalAlert';
    this.modal.className = 'modal';
    this.modal.style.background = 'rgba(224, 220, 220, 0.7)';
    const modalContent = createDiv(obj.div);
    const span = createSpan(obj.close);
    modalContent.appendChild(span);
    const spanTexto = createSpan(obj.span, texto);
    modalContent.appendChild(spanTexto);

    this.modal.appendChild(modalContent);

    // Agregar el modal al body del documento
    document.body.appendChild(this.modal);
  }
}

export default Alerta;
