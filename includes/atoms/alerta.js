// eslint-disable-next-line import/extensions
import arrayGlobal from '../../controllers/variables.js';
// eslint-disable-next-line import/extensions, import/no-named-as-default
import translate, {
  // eslint-disable-next-line no-unused-vars
  arrayTranslateOperativo,
  // eslint-disable-next-line no-unused-vars
  arrayEspanolOperativo,
// eslint-disable-next-line import/extensions
} from '../../controllers/translate.js';
// eslint-disable-next-line import/extensions
import guardarNuevo from '../../Pages/Control/Modules/Controladores/guardarNuevo.js';
// eslint-disable-next-line import/extensions
import traerFirma from '../../Pages/Control/Modules/Controladores/traerFirma.js';
// eslint-disable-next-line import/extensions
import guardaNotas from '../../Pages/Control/Modules/Controladores/guardaNotas.js';
// eslint-disable-next-line import/extensions
import insertarRegistro from '../../Pages/Control/Modules/Controladores/insertarRegistro.js';
// eslint-disable-next-line import/extensions
import enviaMail from '../../Nodemailer/sendEmail.js';

const objTraductor = {
  operativoES: [],
  operativoTR: [],
};

document.addEventListener('DOMContentLoaded', async () => {
  const datosUser = localStorage.getItem('datosUser');
  if (datosUser) {
    const datos = JSON.parse(datosUser);
    const data = await translate(datos.lng);
    const translateOperativo = data.arrayTranslateOperativo;
    const espanolOperativo = data.arrayEspanolOperativo;
    objTraductor.operativoES = [...espanolOperativo];
    objTraductor.operativoTR = [...translateOperativo];
    return objTraductor;
  }
  return null;
});

function createButton(config) {
  const button = document.createElement('button');
  button.className = `${config.className}`;
  button.textContent = config.text;
  config.id !== null ? button.id = config.id : null;
  config.display !== null ? button.style.display = config.display : null;
  config.fontSize !== null ? button.style.fontSize = config.fontSize : null;
  config.fontColor !== null ? button.style.color = config.fontColor : null;
  config.backColor !== null ? button.style.backgroundColor = config.backColor : null;
  config.marginTop !== null ? button.style.marginTop = config.marginTop : null;
  config.marginLeft !== null ? button.style.marginLeft = config.marginLeft : null;
  config.fontWeight !== null ? button.style.fontWeight = config.fontWeight : null;
  config.width !== null ? button.style.width = config.width : null;
  config.height !== null ? button.style.height = config.height : null;
  config.cursor !== null ? button.style.cursor = config.cursor : null;
  config.borderRadius !== null ? button.style.borderRadius = config.borderRadius : null;
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
  config.position !== null ? div.style.position = config.position : null;
  config.borderRadius !== null ? div.style.borderRadius = config.borderRadius : null;
  config.width !== null ? div.style.width = config.width : null;
  config.height !== null ? div.style.height = config.height : null;
  config.background !== null ? div.style.background = config.background : null;
  config.border !== null ? div.style.border = config.border : null;
  config.boxShadow !== null ? div.style.boxShadow = config.boxShadow : null;
  config.margin !== null ? div.style.margin = config.margin : null;
  config.display !== null ? div.style.display = config.display : null;
  config.flexDirection !== null ? div.style.flexDirection = config.flexDirection : null;
  config.padding !== null ? div.style.padding = config.padding : null;
  config.overflow !== null ? div.style.overflow = config.overflow : null;
  config.textAlign !== null ? div.style.textAlign = config.textAlign : null;
  config.gap !== null ? div.style.gap = config.gap : null;
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
  config.fontSize !== null ? span.style.fontSize = config.fontSize : null;
  config.fontColor !== null ? span.style.color = config.fontColor : null;
  config.id !== null ? span.id = config.id : null;
  config.marginTop !== null ? span.style.marginTop = config.marginTop : null;
  config.display !== null ? span.style.display = config.display : null;
  config.fontFamily !== null ? span.style.fontFamily = config.fontFamily : null;
  config.fontStyle !== null ? span.style.fontStyle = config.fontStyle : null;
  config.alignSelf !== null ? span.style.alignSelf = config.alignSelf : null;
  config.className !== null ? span.className = config.className : null;
  config.fontWeight !== null ? span.style.fontWeight = config.fontWeight : null;
  config.cursor !== null ? span.style.cursor = config.cursor : null;
  config.padding !== null ? span.style.padding = config.padding : null;
  config.position !== null ? span.style.position = config.position : null;
  config.top !== null ? span.style.top = config.top : null;
  config.right !== null ? span.style.right = config.right : null;
  config.left !== null ? span.style.left = config.left : null;
  config.innerHTML !== null ? span.innerHTML = config.innerHTML : null;
  config.margin !== null ? span.style.margin = config.margin : null;
  span.style.transition = 'background-color 0.3s';
  config.hoverColor !== null ? span.addEventListener('mouseover', () => {
    span.style.color = config.hoverColor;
  }) : null;
  config.hoverColor !== null ? span.addEventListener('mouseout', () => {
    span.style.color = config.fontColor;
  }) : null;
  config.onClick !== null ? span.addEventListener('click', (config.onClick)) : null;
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
  config.placeholder !== null ? input.placeHolder = config.placeHolder : null;
  config.focus !== null ? setTimeout(() => input.focus(), 0) : null;
  input.style.transition = 'background-color 0.3s';
  config.hoverColor !== null ? input.addEventListener('mouseover', () => {
    input.style.color = config.hoverColor;
  }) : null;
  config.hoverColor !== null ? input.addEventListener('mouseout', () => {
    input.style.color = config.fontColor;
  }) : null;
  config.onClick !== null ? input.addEventListener('click', (config.onClick)) : null;
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

function createH3(config, typeAlert) {
  const h3 = document.createElement('h3');
  h3.textContent = config.text[typeAlert];
  h3.style.fontSize = config.fontSize;
  h3.style.fontColor = config.fontColor;
  config.marginTop !== null ? h3.style.marginTop = config.marginTop : null;
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
  config.marginTop !== null ? hr.style.marginTop = config.marginTop : null;
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
  if (palabra === undefined) {
    return '';
  }
  const palabraNormalizada = palabra.replace(/\s/g, '').toLowerCase();
  const index = objTranslate.operativoES.findIndex(
    (item) => item.replace(/\s/g, '').toLowerCase() === palabraNormalizada,
  );
  if (index !== -1) {
    return objTranslate.operativoTR[index];
  }
  return palabra;
}

function procesoStyleDisplay(elementosStyle) {
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < elementosStyle.element.length; i++) {
    const elemento = document.getElementById(elementosStyle.element[i]);
    if (elemento) {
      elemento.style.display = elementosStyle.style[i];
      const remove = elementosStyle.remove[i];
      if (remove !== null && elemento) {
        elemento.remove();
      }
    }
  }
}

const funcionGuardar = () => {
  const { habilitadoGuardar } = arrayGlobal;
  if (habilitadoGuardar) {
    // eslint-disable-next-line no-use-before-define
    const miAlerta = new Alerta();
    const obj = arrayGlobal.objAlertaAceptarCancelar;
    miAlerta.createAlerta(obj, objTraductor, 'guardar');
    const elementosStyle = {
      element: ['modalAlert'],
      style: ['block'],
      remove: [null],
    };
    procesoStyleDisplay(elementosStyle);
  } else {
    // eslint-disable-next-line no-use-before-define
    const miAlerta = new Alerta();
    const obj = arrayGlobal.avisoRojo;
    const texto = arrayGlobal.mensajesVarios.guardar.sinModificaciones;
    miAlerta.createVerde(obj, texto, objTraductor);
    const elementosStyle = {
      element: ['modalAlertVerde'],
      style: ['block'],
      remove: [null],
    };
    procesoStyleDisplay(elementosStyle);
  }
};
const funcionGuardarCambio = () => {
  // funciones.GuardarCambio();
};
const funcionGuardarComoNuevo = () => {
  // funciones.GuardarComoNuevo();
};
const funcionRefrescar = () => {
  const url = new URL(window.location.href);
  window.location.href = url.href;
};
const funcionHacerFirmar = () => {
  // eslint-disable-next-line no-use-before-define
  const miAlertaFirmar = new Alerta();
  const obj = arrayGlobal.objAlertaAceptarCancelar;
  miAlertaFirmar.createFirma(obj, objTraductor, 'firmar');
  const elementosStyle = {
    element: ['modalAlert'],
    style: ['block'],
    remove: [null],
  };
  procesoStyleDisplay(elementosStyle);
};
const funcionSalir = () => {

};

async function firmar(firmadoPor) {
  const pass = document.getElementById('idInputFirma').value;
  const supervisor = await traerFirma(pass);

  const modal = document.getElementById('modalAlert');
  modal.style.display = 'none';
  modal.remove();
  const idMensajeFirmado = document.getElementById('idMensajeFirmado');
  idMensajeFirmado.innerText = `${firmadoPor}: ${supervisor.nombre}`;
  const elementosStyle = {
    element: ['idMensajeFirmado', 'idDivFirmar', 'idDivFirmado'],
    style: ['block', 'none', 'block'],
    remove: [null, null, null],
  };
  procesoStyleDisplay(elementosStyle);

  localStorage.setItem('firmado', JSON.stringify(supervisor));
  const configMenu = {
    guardar: true,
    guardarComo: false,
    guardarCambios: false,
    firma: false,
    configFirma: supervisor,
  };
  setTimeout(() => {
    const menu = document.getElementById('modalAlertM');
    menu.style.display = 'none';
    menu.remove();
  }, 1000);
  localStorage.setItem('config_menu', JSON.stringify(configMenu));
}

function limpiaArrays() {
  const existenciaControl = arrayGlobal.objetoControl.valor.length;
  const recarga = existenciaControl > 0;
  if (recarga) {
    Object.keys(arrayGlobal.objetoControl).forEach((clave) => {
      arrayGlobal.objetoControl[clave] = [];
    });
  }
}

function convertirObjATextPlano(data) {
  const lines = [];

  // Iterar sobre las claves del objeto
  Object.keys(data).forEach((key) => {
    // Obtener el valor asociado a la clave
    const values = data[key];

    // Crear una línea de texto concatenando la clave y sus valores
    const line = `${key}: ${JSON.stringify(values).replace(/\\/g, '')}`;

    // Agregar la línea al arreglo
    lines.push(line);
  });

  // Convertir el arreglo de líneas a un solo texto con saltos de línea
  const plainText = lines.join('\n');

  return plainText;
}

function subirImagenes(img) {
  const formData = new FormData();
  formData.append('imgBase64', encodeURIComponent(JSON.stringify(img[0])));
  fetch('../../Routes/Imagenes/photo_upload.php', {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      // eslint-disable-next-line no-console
      console.log('Respuesta del servidor:', data);
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error al enviar la imagen:', error);
    });
}

function insert(nuevoObjeto, convertido, objEncabezados) {
  const nuevoObjetoControl = { ...nuevoObjeto };
  delete nuevoObjetoControl.name;
  delete nuevoObjetoControl.email;
  delete nuevoObjetoControl.detalle;
  delete nuevoObjetoControl.objImagen;
  const insertado = insertarRegistro(nuevoObjetoControl);
  const promise = Promise.resolve(insertado);
  promise.then((value) => {
    console.log(value);
    const enviaPorEmail = JSON.parse(localStorage.getItem('envia_por_email'));
    const encabezados = { ...objEncabezados };
    encabezados.documento = value.documento;
    enviaPorEmail ? enviaMail(nuevoObjeto, encabezados) : null;
    guardaNotas(convertido);
  });
}

function armaEncabezado(arrayMensajes, objTrad) {
  const encabezadosEmail = arrayMensajes.objetoControl.email;
  let mensaje = arrayMensajes.mensajesVarios.email.fechaDeAlerta;
  const fechaDeAlerta = trO(mensaje, objTrad) || mensaje;
  mensaje = arrayMensajes.mensajesVarios.email.horaDeAlerta;
  const horaDeAlerta = trO(mensaje, objTrad) || mensaje;
  mensaje = arrayMensajes.mensajesVarios.email.notifica;
  const notifica = trO(mensaje, objTrad) || mensaje;
  mensaje = arrayMensajes.mensajesVarios.email.sistema;
  const sistema = trO(mensaje, objTrad) || mensaje;
  mensaje = arrayMensajes.mensajesVarios.email.irA;
  const irA = trO(mensaje, objTrad) || mensaje;
  mensaje = arrayMensajes.mensajesVarios.email.concepto;
  const concepto = trO(mensaje, objTrad) || mensaje;
  mensaje = arrayMensajes.mensajesVarios.email.relevamiento;
  const relevamiento = trO(mensaje, objTrad) || mensaje;
  mensaje = arrayMensajes.mensajesVarios.email.detalle;
  const detalle = trO(mensaje, objTrad) || mensaje;
  mensaje = arrayMensajes.mensajesVarios.email.observacion;
  const observacion = trO(mensaje, objTrad) || mensaje;
  const encabezados = {
    documento: '3333333333333',
    address: encabezadosEmail.address,
    fecha: encabezadosEmail.fecha,
    hora: encabezadosEmail.hora,
    notificador: encabezadosEmail.notificador,
    planta: encabezadosEmail.planta,
    reporte: encabezadosEmail.reporte,
    titulo: encabezadosEmail.titulo,
    url: encabezadosEmail.url,
    fechaDeAlerta,
    horaDeAlerta,
    notifica,
    sistema,
    irA,
    concepto,
    relevamiento,
    detalle,
    observacion,
  };
  return encabezados;
}

function soloEnviaEmail(nuevoObjeto, encabezados) {
  subirImagenes(nuevoObjeto.objImagen);
  // enviaMail(nuevoObjeto, encabezados);
}

class Alerta {
  constructor() {
    this.modal = null;
  }

  createAlerta(objeto, objTrad, typeAlert) {
    // Crear el elemento modal
    const obj = objeto;
    this.modal = document.createElement('div');
    this.modal.id = 'modalAlert';
    this.modal.className = 'modal';
    this.modal.style.background = 'rgba(0, 0, 0, 0.5)';
    // Crear el contenido del modal
    const modalContent = createDiv(obj.divContent);

    const span = createSpan(obj.close);
    modalContent.appendChild(span);

    let texto = trO(obj.titulo.text[typeAlert], objTrad) || obj.titulo.text[typeAlert];
    obj.titulo.text[typeAlert] = texto;
    const title = createH3(obj.titulo, typeAlert);
    modalContent.appendChild(title);

    texto = trO(obj.span.text[typeAlert], objTrad) || obj.span.text[typeAlert];
    obj.span.text[typeAlert] = texto;
    const spanTexto = createSpan(obj.span, texto);
    modalContent.appendChild(spanTexto);

    const divButton = createDiv(obj.divButtons);

    texto = trO(obj.btnaccept.text, objTrad) || obj.btnaccept.text;
    obj.btnaccept.text = texto;
    const buttonAceptar = createButton(obj.btnaccept);

    texto = trO(obj.btncancel.text, objTrad) || obj.btncancel.text;
    obj.btncancel.text = texto;
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
    const idAceptar = document.getElementById('idAceptar');
    idAceptar.addEventListener('click', () => {
      const elementosStyle = {
        element: ['modalAlert', 'modalAlertM'],
        style: ['none', 'none'],
        remove: ['remove', 'remove'],
      };
      procesoStyleDisplay(elementosStyle);
      limpiaArrays();
      const okGuardar = guardarNuevo(arrayGlobal.objetoControl, arrayGlobal.arrayControl);
      const requerido = JSON.parse(localStorage.getItem('requerido'));
      if (requerido.requerido && okGuardar) {
        const miAlerta = new Alerta();
        let mensaje = arrayGlobal.mensajesVarios.guardar.esperaAmarillo;
        arrayGlobal.avisoAmarillo.close.display = 'none';
        mensaje = trO(mensaje, objTrad);
        miAlerta.createVerde(arrayGlobal.avisoAmarillo, mensaje, null);
        const modal = document.getElementById('modalAlertVerde');
        modal.style.display = 'block';
        const convertido = convertirObjATextPlano(arrayGlobal.objetoControl);
        const nuevoObjeto = {
          ...arrayGlobal.objetoControl,
          // eslint-disable-next-line max-len
          objJSON: Array(arrayGlobal.objetoControl.fecha.length).fill(null).map((_, index) => (index === 0 ? convertido : null)),
        };
        const encabezados = armaEncabezado(arrayGlobal, objTrad);
        soloEnviaEmail(nuevoObjeto, encabezados);
        // insert(nuevoObjeto, convertido, encabezados);
      }
      if (!requerido.requerido || !okGuardar) {
        limpiaArrays();
        const fila = 1;
        const { idLTYcontrol } = requerido;
        const table = document.querySelector('#tableControl');
        const tbody = table.querySelector('tbody');
        let filas = tbody.querySelector(`tr:nth-child(${fila})`);
        let celda = filas.querySelector('td:nth-child(6)');
        let id = celda.textContent.trim();
        let incremento = fila;
        while (idLTYcontrol !== id) {
          filas.style.backgroundColor = '#ffffff';
          incremento += 1;
          filas = tbody.querySelector(`tr:nth-child(${incremento})`);
          celda = filas.querySelector('td:nth-child(6)');
          id = celda.textContent.trim();
        }
        filas.style.backgroundColor = '#f7bfc6';
        const miAlerta = new Alerta();
        let mensaje = arrayGlobal.mensajesVarios.guardar.faltanRequeridos;
        mensaje = trO(mensaje, objTrad);
        miAlerta.createVerde(arrayGlobal.avisoRojo, mensaje, null);
        const modal = document.getElementById('modalAlertVerde');
        modal.style.display = 'block';
      }
    });
  }

  createFirma(objeto, objTrad, typeAlert) {
    // Crear el elemento modal
    const obj = objeto;
    this.modal = document.createElement('div');
    this.modal.id = 'modalAlert';
    this.modal.className = 'modal';
    this.modal.style.background = 'rgba(0, 0, 0, 0.5)';
    // Crear el contenido del modal
    obj.divContent.height = '260px';
    const modalContent = createDiv(obj.divContent);

    const span = createSpan(obj.close);
    modalContent.appendChild(span);

    let texto = trO(obj.titulo.text[typeAlert], objTrad) || obj.titulo.text[typeAlert];
    obj.titulo.text[typeAlert] = texto;
    const title = createH3(obj.titulo, typeAlert);
    modalContent.appendChild(title);

    texto = trO(obj.span.text[typeAlert], objTrad) || obj.span.text[typeAlert];
    obj.span.text[typeAlert] = texto;
    const spanTexto = createSpan(obj.span, texto);
    modalContent.appendChild(spanTexto);

    const firmadoPor = trO('Firmado por', objTrad) || obj.mensajeFirmado.text;
    obj.divCajita.id = 'idDivFirmar';
    const divFirmar = createDiv(obj.divCajita);
    obj.input.id = 'idInputFirma';
    obj.input.type = 'password';
    const inputEmail = createInput(obj.input);
    texto = trO(obj.label.innerText, objTrad) || obj.label.innerText;
    obj.label.id = 'idLabelFirma';
    obj.label.for = 'idInputFirma';
    obj.label.innerText = texto;
    const labelEmail = createLabel(obj.label);
    divFirmar.appendChild(inputEmail);
    divFirmar.appendChild(labelEmail);
    modalContent.appendChild(divFirmar);

    const divButton = createDiv(obj.divButtons);
    texto = trO(obj.btnaccept.text, objTrad) || obj.btnaccept.text;
    obj.btnaccept.text = texto;
    const buttonAceptar = createButton(obj.btnaccept);

    texto = trO(obj.btncancel.text, objTrad) || obj.btncancel.text;
    obj.btncancel.text = texto;
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
    const idAceptar = document.getElementById('idAceptar');
    idAceptar.addEventListener('click', () => {
      firmar(firmadoPor);
      //! colocar la firma en el menu
    });
    const idInputFirma = document.getElementById('idInputFirma');
    idInputFirma.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        firmar(firmadoPor);
      }
    });
  }

  createVerde(obj, texto, objTrad) {
    this.modal = document.createElement('div');
    this.modal.id = 'modalAlertVerde';
    this.modal.className = 'modal';
    this.modal.style.background = 'rgba(224, 220, 220, 0.7)';
    const modalContent = createDiv(obj.div);
    const span = createSpan(obj.close);
    modalContent.appendChild(span);
    let frase = '';
    if (objTrad === null) {
      frase = texto;
    } else {
      frase = trO(texto, objTrad) || texto;
    }
    const spanTexto = createSpan(obj.span, frase);
    modalContent.appendChild(spanTexto);

    this.modal.appendChild(modalContent);

    // Agregar el modal al body del documento
    document.body.appendChild(this.modal);
  }

  createControl(obj, texto, objTrad) {
    this.modal = document.createElement('div');
    this.modal.id = 'modalAlertCarga';
    this.modal.className = 'modal';
    this.modal.style.background = 'rgba(224, 220, 220, 0.7)';
    const modalContent = createDiv(obj.div);
    const span = createSpan(obj.close);
    modalContent.appendChild(span);
    let frase = '';
    if (objTrad === null) {
      frase = texto;
    } else {
      frase = trO(texto, objTrad) || texto;
    }
    const spanTexto = createSpan(obj.span, frase);
    modalContent.appendChild(spanTexto);

    this.modal.appendChild(modalContent);

    // Agregar el modal al body del documento
    document.body.appendChild(this.modal);
  }

  createModalPerson(obj, user, objTranslate) {
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

    const texto = trO(user.salir, objTranslate) || user.salir;
    const spanSalir = createSpan(obj.salir, texto);
    modalContent.appendChild(spanSalir);

    this.modal.appendChild(modalContent);

    // Agregar el modal al body del documento
    document.body.appendChild(this.modal);
  }

  createModalMenu(objeto, objTranslate) {
    const configFirma = JSON.parse(localStorage.getItem('firma'));
    let configMenu = JSON.parse(localStorage.getItem('config_menu'));
    const enviaPorEmail = JSON.parse(localStorage.getItem('envia_por_email'));

    const obj = objeto;
    this.modal = document.createElement('div');
    this.modal.id = 'modalAlertM';
    this.modal.className = 'modal';
    this.modal.style.background = 'rgba(0, 0, 0, 0.1)';
    // Crear el contenido del modal
    const modalContent = createDiv(obj.divContent);

    const span = createSpan(obj.close);
    modalContent.appendChild(span);

    //! guardar
    obj.divCajita.id = 'idDivGuardar';
    obj.divCajita.onClick = funcionGuardar;
    let div = createDiv(obj.divCajita);
    const imgGuardar = createIMG(obj.imgGuardar);
    let texto = trO(obj.guardar.text, objTranslate) || obj.guardar.text;
    const spanGuardar = createSpan(obj.guardar, texto);
    div.appendChild(imgGuardar);
    div.appendChild(spanGuardar);
    modalContent.appendChild(div);
    obj.divCajita.onClick = null;

    obj.hr.id = 'idHrGuardar';
    let hr = createHR(obj.hr);
    modalContent.appendChild(hr);
    //! fin guardar

    //! guardar cambio
    obj.divCajita.id = 'idDivGuardarCambio';
    obj.divCajita.onClick = funcionGuardarCambio;
    div = createDiv(obj.divCajita);
    const imgGuardarCambio = createIMG(obj.imgGuardar);
    texto = trO(obj.guardarCambio.text, objTranslate) || obj.guardarCambio.text;
    const spanGuardarCambio = createSpan(obj.guardarCambio, texto);
    div.appendChild(imgGuardarCambio);
    div.appendChild(spanGuardarCambio);
    modalContent.appendChild(div);
    obj.divCajita.onClick = null;

    obj.hr.id = 'idHrGuardarCambio';
    hr = createHR(obj.hr);
    modalContent.appendChild(hr);
    //! fin guardar cambio

    //! guardar como nuevo
    obj.divCajita.id = 'idDivGuardarComoNuevo';
    obj.divCajita.onClick = funcionGuardarComoNuevo;
    div = createDiv(obj.divCajita);
    const imgGuardarComoNuevo = createIMG(obj.imgGuardar);
    texto = trO(obj.guardarComoNuevo.text, objTranslate) || obj.guardarComoNuevo.text;
    const spanGuardarComoNuevo = createSpan(obj.guardarComoNuevo, texto);
    div.appendChild(imgGuardarComoNuevo);
    div.appendChild(spanGuardarComoNuevo);
    modalContent.appendChild(div);
    obj.divCajita.onClick = null;

    obj.hr.id = 'idHrGuardarComoNuevo';
    hr = createHR(obj.hr);
    modalContent.appendChild(hr);
    //! fin guaradr como nuevo

    //! firmar
    obj.divCajita.id = 'idDivFirmar';
    obj.divCajita.onClick = funcionHacerFirmar;
    div = createDiv(obj.divCajita);
    const imgFirmar = createIMG(obj.imgFirmar);
    texto = trO(obj.firmar.text, objTranslate) || obj.firmar.text;
    const spanFirmar = createSpan(obj.firmar, texto);
    const spanFirmado = createSpan(obj.mensajeFirmado, null);
    div.appendChild(imgFirmar);
    div.appendChild(spanFirmar);

    modalContent.appendChild(span);
    modalContent.appendChild(div);

    obj.divCajita.id = 'idDivFirmado';
    obj.divCajita.hoverBackground = null;
    obj.divCajita.hoverColor = null;
    obj.divCajita.cursor = null;
    div = createDiv(obj.divCajita);

    div.appendChild(spanFirmado);
    modalContent.appendChild(div);
    obj.divCajita.onClick = null;

    obj.hr.id = 'idHrFirmar';
    hr = createHR(obj.hr);
    modalContent.appendChild(hr);
    obj.divCajita.hoverBackground = '#cecece';
    obj.divCajita.hoverColor = '#cecece';
    obj.divCajita.cursor = 'pointer';
    //! fin firmar

    //! refrescar
    obj.divCajita.id = 'idDivRefrescar';
    obj.divCajita.onClick = funcionRefrescar;
    div = createDiv(obj.divCajita);
    const imgRefresh = createIMG(obj.imgRefresh);
    texto = trO(obj.refresh.text, objTranslate) || obj.refresh.text;
    const spanRefresh = createSpan(obj.refresh, texto);
    div.appendChild(imgRefresh);
    div.appendChild(spanRefresh);
    modalContent.appendChild(div);
    obj.divCajita.onClick = null;

    obj.hr.id = 'idHrRefresh';
    hr = createHR(obj.hr);
    modalContent.appendChild(hr);
    //! fin refrescar

    //! salir
    obj.divCajita.id = 'idDivSalir';
    obj.divCajita.onClick = funcionSalir;
    div = createDiv(obj.divCajita);
    const imgSalir = createIMG(obj.imgSalir);
    texto = trO(obj.salir.text, objTranslate) || obj.salir.text;
    const spanSalir = createSpan(obj.salir, texto);
    div.appendChild(imgSalir);
    div.appendChild(spanSalir);
    modalContent.appendChild(div);
    obj.divCajita.onClick = null;

    obj.hr.id = 'idHrSalir';
    hr = createHR(obj.hr);
    modalContent.appendChild(hr);
    //! fin salir

    texto = trO(obj.mensaje1.text, objTranslate) || obj.mensaje1.text;
    const spanMensaje1 = createSpan(obj.mensaje1, texto);
    modalContent.appendChild(spanMensaje1);

    texto = trO(obj.mensaje2.text, objTranslate) || obj.mensaje2.text;
    const spanMensaje2 = createSpan(obj.mensaje2, texto);
    modalContent.appendChild(spanMensaje2);

    //! checkbox
    obj.input.id = 'idCheckBoxEmail';
    obj.input.type = 'checkbox';
    obj.divCajita.id = 'idDivCheckBoxEmail';
    div = createDiv(obj.divCajita);
    const inputEmail = createInput(obj.input);
    texto = trO(obj.label.innerText, objTranslate) || obj.label.innerText;
    obj.label.id = 'idLabelEmail';
    obj.label.for = 'idCheckBoxEmail';
    obj.label.innerText = texto;
    const labelEmail = createLabel(obj.label);
    div.appendChild(inputEmail);
    div.appendChild(labelEmail);
    modalContent.appendChild(div);
    //! fin checkbox

    this.modal.appendChild(modalContent);

    // Agregar el modal al body del documento
    document.body.appendChild(this.modal);

    if (configMenu === 'x') {
      configMenu = {
        guardar: true,
        guardarComo: false,
        guardarCambios: false,
        firma: true,
        configFirma,
      };
      const elementosStyle = {
        element: ['idDivGuardarCambio', 'idDivGuardarComoNuevo', 'idHrGuardarCambio', 'idHrGuardarComoNuevo', 'idDivFirmado'],
        style: ['none', 'none', 'none', 'none', 'none'],
        remove: [null, null, null, null, null],
      };
      procesoStyleDisplay(elementosStyle);
    } else {
      const textFirmado = arrayGlobal.objMenu.mensajeFirmado.text;
      const firmadoPor = trO(textFirmado, objTranslate) || textFirmado;
      const idMensajeFirmado = document.getElementById('idMensajeFirmado');
      idMensajeFirmado.innerText = `${firmadoPor}: ${configMenu.configFirma.nombre}`;
      idMensajeFirmado.style.display = 'block';
      const elementosStyle = {
        element: ['idMensajeFirmado', 'idDivFirmar', 'idDivFirmado', 'idDivGuardarCambio', 'idDivGuardarComoNuevo', 'idHrGuardarCambio', 'idHrGuardarComoNuevo', 'idMensaje2'],
        style: ['block', 'none', 'block', 'none', 'none', 'none', 'none', 'none'],
        remove: [null, null, null, null, null, null, null, null],
      };
      procesoStyleDisplay(elementosStyle);
    }
    const enviaEmail = document.getElementById('idCheckBoxEmail');
    enviaPorEmail ? enviaEmail.checked = true : enviaEmail.checked = false;
  }

  destroyAlerta() {
    if (this.modal) {
      // Elimina el elemento modal del DOM
      this.modal.remove();

      // Limpia la referencia al elemento
      this.modal = null;
    }
  }
}

export default Alerta;
