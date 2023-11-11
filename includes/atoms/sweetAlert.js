// class sweetAlerta {
//   constructor() {
//     this.modal = null;
//   }

//   createAlerta(obj) {
//     // Crear el elemento modal
//     this.modal = document.createElement('div');
//     this.modal.id = 'modalAlert';
//     this.modal.className = 'modal';
//     this.modal.style.background = 'rgba(0, 0, 0, 0.5)';
//     // Crear el contenido del modal
//     const modalContent = createDiv(obj.divContent);

//     const span = createSpan(obj.close);
//     modalContent.appendChild(span);

//     const title = createH3(obj.titulo);
//     modalContent.appendChild(title);

//     const spanTexto = createSpan(obj.span);
//     modalContent.appendChild(spanTexto);

//     const divButton = createDiv(obj.divButtons);

//     const buttonAceptar = createButton(obj.btnaccept);
//     const buttonCancelar = createButton(obj.btncancel);
//     const buttonOk = createButton(obj.btnok);

//     divButton.appendChild(buttonAceptar);
//     divButton.appendChild(buttonCancelar);
//     divButton.appendChild(buttonOk);

//     modalContent.appendChild(divButton);
//     // Agregar el contenido al modal
//     this.modal.appendChild(modalContent);

//     // Agregar el modal al body del documento
//     document.body.appendChild(this.modal);
//   }
// }

// export default sweetAlerta;
