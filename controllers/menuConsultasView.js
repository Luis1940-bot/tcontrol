// eslint-disable-next-line import/extensions
// import { Alerta } from '../includes/atoms/alerta.js';
import Alerta from '../includes/atoms/alerta.js';
// eslint-disable-next-line import/extensions
import objVariables from './variables.js';

function closeModal() {
  const hamburguesa = document.getElementById('hamburguesa');
  hamburguesa.style.border = 'none';
  hamburguesa.style.backgroundColor = 'transparent';
  hamburguesa.style.borderRadius = '0px 0px 0px 0px';
  hamburguesa.addEventListener('mouseenter', () => {
    hamburguesa.style.border = '3px solid #212121';
    hamburguesa.style.backgroundColor = '#212121';
    hamburguesa.style.borderRadius = '10px 10px 0px 0px';
  });

  // Quitar los estilos al salir del :hover
  hamburguesa.addEventListener('mouseleave', () => {
    hamburguesa.style.border = 'none';
    hamburguesa.style.backgroundColor = 'transparent';
    hamburguesa.style.borderRadius = '0px 0px 0px 0px';
  });
}

export default function menuModalConsultasView(objTranslate) {
  const miAlertaM = new Alerta();
  miAlertaM.createModalConsultaView(objVariables.objMenuCView, objTranslate);
  const modal = document.getElementById('modalAlertM');
  const closeButton = document.querySelector('.modal-close');
  closeButton.addEventListener('click', closeModal);
  modal.style.display = 'block';
}
