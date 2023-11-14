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

const objTraductor = {
  operativoES: [],
  operativoTR: [],
};

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
    const title = createH3(obj.titulo);
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
      cerrarModales();
      guardarNuevo(arrayGlobal.objetoControl, arrayGlobal.arrayControl, objTraductor);
      // createInforme(arrayGlobal.objetoMensaje);
      // guardaNotas(arrayGlobal.objetoControl);
      // funciones.Guardar(arrayGlobal.objetoControl, arrayGlobal.arrayControl);
      const miAlerta = new Alerta();
      let mensaje = arrayGlobal.mensajesVarios.guardar.esperaAmarillo;
      arrayGlobal.avisoAmarillo.close.display = 'none';
      mensaje = trO(mensaje, objTrad);
      miAlerta.createVerde(arrayGlobal.avisoAmarillo, mensaje);
      const modal = document.getElementById('modalAlertVerde');
      modal.style.display = 'block';
    });
  }
}

export default Alerta;
