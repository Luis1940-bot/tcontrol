// eslint-disable-next-line import/extensions
import {funciones} from '../../Pages/Control/Modules/funcionesMenu.js';

// const {
//   Guardar,
//   GuardarComo,
//   GuardarComoNuevo,
//   Refrescar,
//   Firmar,
//   Salir,
// } = funciones;

function createButton(config) {
  const button = document.createElement('button');
  button.className = `${config.className}`;
  button.textContent = config.text;
  config.id !== null ? button.id = config.id : null;
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
  config.className !== null ? div.className = config.className : null;
  config.id !== null ? div.id = config.id : null;
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
  config.cursor !== null ? div.style.cursor = config.cursor : null;
  config.alignItems !== null ? div.style.alignItems = config.alignItems : null;
  div.style.transition = 'background-color 0.3s';
  config.hoverColor !== null ? div.addEventListener('mouseover', () => {
    // div.style.color = config.hoverColor;
    div.style.backgroundColor = config.hoverBackground;
  }) : null;
  config.hoverColor !== null ? div.addEventListener('mouseout', () => {
    // div.style.color = config.fontColor;
    div.style.backgroundColor = '#ffffff';
  }) : null;
  div.addEventListener('click', (config.onClick));
  return div;
}

function createSpan(config, text) {
  const span = document.createElement('span');
  const texto = text || config.text;
  span.textContent = texto;
  span.style.fontSize = config.fontSize;
  span.style.color = config.fontColor;
  config.id !== null ? span.id = config.id : null;
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
  config.margin !== null ? span.margin = config.margin : null;
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

function createInput(config) {
  const input = document.createElement('input');
  config.id !== null ? input.id = config.id : null;
  input.type = config.type;
  config.name !== null ? input.name = config.id : null;
  config.value !== null ? input.value = config.value : null;
  config.className !== null ? input.className = config.className : null;
  config.height !== null ? input.style.height = config.height : null;
  config.width !== null ? input.style.width = config.width : null;
  config.color !== null ? input.style.color = config.color : null;
  config.backgroundColor !== null ? input.style.backgroundColor = config.backgroundColor : null;
  config.padding !== null ? input.style.padding = config.padding : null;
  config.margin !== null ? input.style.margin = config.margin : null;
  config.cursor !== null ? input.style.cursor = config.cursor : null;
  config.borderRadius !== null ? input.style.borderRadius = config.borderRadius : null;
  config.outline !== null ? input.style.outline = config.outline : null;
  config.boxShadow !== null ? input.style.boxShadow = config.boxShadow : null;
  config.textAlign !== null ? input.style.textAlign = config.textAlign : null;
  config.fontSize !== null ? input.style.fontSize = config.fontSize : null;
  config.fontFamily !== null ? input.style.fontFamily = config.fontFamily : null;
  config.fontWeight !== null ? input.style.fontWeight = config.fontWeight : null;
  config.innerHTML !== null ? input.innerHTML = config.innerHTML : null;
  config.placeolder !== null ? input.placeHolder = config.placeHolder : null;
  config.focus !== null ? input.focus = config.focus : null;
  input.style.transition = 'background-color 0.3s';
  config.hoverColor !== null ? input.addEventListener('mouseover', () => {
    input.style.color = config.hoverColor;
  }) : null;
  config.hoverColor !== null ? input.addEventListener('mouseout', () => {
    input.style.color = config.fontColor;
  }) : null;
  config.onClick !== null ? input.addEventListener('click', (config.onClick)) : null;
  return input;
}

function createLabel(config) {
  const label = document.createElement('label');
  config.id !== null ? label.id = config.id : null;
  config.htmlFor !== null ? label.htmlFor = config.htmlFor : null;
  config.innerText !== null ? label.innerText = config.innerText : null;
  config.className !== null ? label.className = config.className : null;
  config.height !== null ? label.style.height = config.height : null;
  config.width !== null ? label.style.width = config.width : null;
  config.color !== null ? label.color = config.color : null;
  config.backgroundColor !== null ? label.style.backgroundColor = config.backgroundColor : null;
  config.padding !== null ? label.style.padding = config.padding : null;
  config.margin !== null ? label.style.margin = config.margin : null;
  config.cursor !== null ? label.style.cursor = config.cursor : null;
  config.borderRadius !== null ? label.style.borderRadius = config.borderRadius : null;
  config.boxShadow !== null ? label.style.boxShadow = config.boxShadow : null;
  config.textAlign !== null ? label.style.textAlign = config.textAlign : null;
  config.fontSize !== null ? label.style.fontSize = config.fontSize : null;
  config.fontColor !== null ? label.style.fontColor = config.fontColor : null;
  config.fontFamily !== null ? label.style.fontFamily = config.fontFamily : null;
  config.fontWeight !== null ? label.style.fontWeight = config.fontWeight : null;
  config.innerHTML !== null ? label.innerHTML = config.innerHTML : null;
  config.placeolder !== null ? label.placeHolder = config.placeHolder : null;
  config.onClick !== null ? label.style.transition = 'background-color 0.3s' : null;
  config.hoverColor !== null ? label.addEventListener('mouseover', () => {
    label.style.color = config.hoverColor;
  }) : null;
  config.hoverColor !== null ? label.addEventListener('mouseout', () => {
    label.style.color = config.fontColor;
  }) : null;
  config.onClick !== null ? label.addEventListener('click', (config.onClick)) : null;
  return label;
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

function createHR(config) {
  const hr = document.createElement('hr');
  config.id !== null ? hr.id = config.id : null;
  config.width !== null ? hr.style.width = config.width : null;
  config.border !== null ? hr.style.border = config.border : null;
  config.height !== null ? hr.style.height = config.height : null;
  config.backgroundColor !== null ? hr.style.backgroundColor = config.backgroundColor : null;
  return hr;
}

function createIMG(config) {
  const img = document.createElement('img');
  config.id !== null ? img.id = config.id : null;
  img.src = config.src;
  img.className = config.className;
  img.alt = config.alt;
  img.height = config.height;
  img.width = config.width;
  config.marginRigth !== null ? img.marginRigth = config.marginRigth : null;
  config.filter !== null ? img.filter = config.filter : null;
  return img;
}

function trO(palabra, objTranslate) {
  const palabraNormalizada = palabra.replace(/\s/g, '').toLowerCase();
  const index = objTranslate.operativoES.findIndex(
    (item) => item.replace(/\s/g, '').toLowerCase() === palabraNormalizada,
  );
  if (index !== -1) {
    return objTranslate.operativoTR[index];
  }
  return palabra;
}

const funcionGuardar = () => {
  funciones.Guardar();
};
const funcionGuardarComo = () => {
  funciones.GuardarComo();
};
const funcionGuardarComoNuevo = () => {
  funciones.GuardarComoNuevo();
};
const funcionRefrescar = () => {
  funciones.Refrescar();
};
const funcionHacerFirmar = () => {
  funciones.Firmar();
};
const funcionSalir = () => {
  funciones.Salir();
};

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

  createModalPerson(obj, user) {
    this.modal = document.createElement('div');
    this.modal.id = 'modalAlertP';
    this.modal.className = 'modal';
    this.modal.style.background = 'rgba(0, 0, 0, 0.1)';
    // Crear el contenido del modal
    const modalContent = createDiv(obj.divContent);

    const span = createSpan(obj.close);
    modalContent.appendChild(span);

    const spanUser = createSpan(obj.user, user.person);
    modalContent.appendChild(spanUser);

    const hr = createHR(obj.hr);
    modalContent.appendChild(hr);

    const spanSalir = createSpan(obj.salir, user.salir);
    modalContent.appendChild(spanSalir);

    this.modal.appendChild(modalContent);

    // Agregar el modal al body del documento
    document.body.appendChild(this.modal);
  }

  createModalMenu(objeto, objTranslate) {
    const obj = objeto;
    this.modal = document.createElement('div');
    this.modal.id = 'modalAlertM';
    this.modal.className = 'modal';
    this.modal.style.background = 'rgba(0, 0, 0, 0.1)';
    // Crear el contenido del modal
    const modalContent = createDiv(obj.divContent);

    const span = createSpan(obj.close);
    modalContent.appendChild(span);

    obj.divCajita.id = 'idDivGuardar';
    obj.divCajita.onClick = funcionGuardar;
    let div = createDiv(obj.divCajita);
    const imgGuardar = createIMG(obj.imgGuardar);
    let texto = trO(obj.guardar.text, objTranslate) || obj.guardar.text;
    const spanGuardar = createSpan(obj.guardar, texto);
    div.appendChild(imgGuardar);
    div.appendChild(spanGuardar);
    modalContent.appendChild(div);
    // obj.divCajita.onClick = null;

    obj.hr.id = 'idHrGuardar';
    let hr = createHR(obj.hr);
    modalContent.appendChild(hr);

    obj.divCajita.id = 'idDivGuardarComo';
    obj.divCajita.onClick = funcionGuardarComo;
    div = createDiv(obj.divCajita);
    const imgGuardarComo = createIMG(obj.imgGuardar);
    texto = trO(obj.guardarComo.text, objTranslate) || obj.guardarComo.text;
    const spanGuardarComo = createSpan(obj.guardarComo, texto);
    div.appendChild(imgGuardarComo);
    div.appendChild(spanGuardarComo);
    modalContent.appendChild(div);
    // obj.divCajita.onClick = null;

    obj.hr.id = 'idHrGuardarComo';
    hr = createHR(obj.hr);
    modalContent.appendChild(hr);

    obj.divCajita.id = 'idDivGuardarComoNuevo';
    obj.divCajita.onClick = funcionGuardarComoNuevo;
    div = createDiv(obj.divCajita);
    const imgGuardarComoNuevo = createIMG(obj.imgGuardar);
    texto = trO(obj.guardarComoNuevo.text, objTranslate) || obj.guardarComoNuevo.text;
    const spanGuardarComoNuevo = createSpan(obj.guardarComoNuevo, texto);
    div.appendChild(imgGuardarComoNuevo);
    div.appendChild(spanGuardarComoNuevo);
    modalContent.appendChild(div);
    // obj.divCajita.onClick = null;

    obj.hr.id = 'idHrGuardarComoNuevo';
    hr = createHR(obj.hr);
    modalContent.appendChild(hr);

    obj.divCajita.id = 'idDivFirmar';
    obj.divCajita.onClick = funcionHacerFirmar;
    div = createDiv(obj.divCajita);
    const imgFirmar = createIMG(obj.imgFirmar);
    texto = trO(obj.firmar.text, objTranslate) || obj.firmar.text;
    const spanFirmar = createSpan(obj.firmar, texto);
    div.appendChild(imgFirmar);
    div.appendChild(spanFirmar);
    modalContent.appendChild(div);
    // obj.divCajita.onClick = null;

    obj.hr.id = 'idHrFirmar';
    hr = createHR(obj.hr);
    modalContent.appendChild(hr);

    div = createDiv(obj.divCajita);
    obj.divCajita.onClick = funcionRefrescar;
    const imgRefresh = createIMG(obj.imgRefresh);
    texto = trO(obj.refresh.text, objTranslate) || obj.refresh.text;
    const spanRefresh = createSpan(obj.refresh, texto);
    div.appendChild(imgRefresh);
    div.appendChild(spanRefresh);
    modalContent.appendChild(div);
    // obj.divCajita.onClick = null;

    obj.hr.id = 'idHrRefresh';
    hr = createHR(obj.hr);
    modalContent.appendChild(hr);

    div = createDiv(obj.divCajita);
    obj.divCajita.onClick = funcionSalir;
    const imgSalir = createIMG(obj.imgSalir);
    texto = trO(obj.salir.text, objTranslate) || obj.salir.text;
    const spanSalir = createSpan(obj.salir, texto);
    div.appendChild(imgSalir);
    div.appendChild(spanSalir);
    modalContent.appendChild(div);
    // obj.divCajita.onClick = null;

    obj.hr.id = 'idHrSalir';
    hr = createHR(obj.hr);
    modalContent.appendChild(hr);

    texto = trO(obj.mensaje1.text, objTranslate) || obj.mensaje1.text;
    const spanMensaje1 = createSpan(obj.mensaje1, texto);
    modalContent.appendChild(spanMensaje1);

    texto = trO(obj.mensaje2.text, objTranslate) || obj.mensaje2.text;
    const spanMensaje2 = createSpan(obj.mensaje2, texto);
    modalContent.appendChild(spanMensaje2);

    div = createDiv(obj.divCajita);
    obj.input.id = 'idCheckBoxEmail';
    obj.input.type = 'checkbox';
    const inputEmail = createInput(obj.input);
    texto = trO(obj.label.innerText, objTranslate) || obj.label.innerText;
    obj.label.id = 'idLabelEmail';
    obj.label.for = 'idCheckBoxEmail';
    obj.label.innerText = texto;
    const labelEmail = createLabel(obj.label);
    div.appendChild(inputEmail);
    div.appendChild(labelEmail);
    modalContent.appendChild(div);

    this.modal.appendChild(modalContent);

    // Agregar el modal al body del documento
    document.body.appendChild(this.modal);

    const idDivGuardarComo = document.getElementById('idDivGuardarComo');
    idDivGuardarComo.style.display = 'none';
    const idDivGuardarComoNuevo = document.getElementById('idDivGuardarComoNuevo');
    idDivGuardarComoNuevo.style.display = 'none';
    const idDivFirmar = document.getElementById('idDivFirmar');
    idDivFirmar.style.display = 'none';
    const idHrGuardarComo = document.getElementById('idHrGuardarComo');
    idHrGuardarComo.style.display = 'none';
    const idHrGuardarComoNuevo = document.getElementById('idHrGuardarComoNuevo');
    idHrGuardarComoNuevo.style.display = 'none';
    const idHrFirmar = document.getElementById('idHrFirmar');
    idHrFirmar.style.display = 'none';
  }
}

export default Alerta;
