// eslint-disable-next-line import/extensions
import { Alerta } from '../includes/atoms/alerta.js'
// eslint-disable-next-line import/extensions
import objVariables from './variables.js'

function closeModal() {
  const person = document.getElementById('person')
  person.style.border = 'none'
  person.style.backgroundColor = 'transparent'
  person.style.borderRadius = '0px 0px 0px 0px'
  person.addEventListener('mouseenter', () => {
    person.style.border = '3px solid #212121'
    person.style.backgroundColor = '#212121'
    person.style.borderRadius = '10px 10px 0px 0px'
  })

  // Quitar los estilos al salir del :hover
  person.addEventListener('mouseleave', () => {
    person.style.border = 'none'
    person.style.backgroundColor = 'transparent'
    person.style.borderRadius = '0px 0px 0px 0px'
  })
}

export default function personModal(user, objTranslate) {
  const miAlertaP = new Alerta()
  miAlertaP.createModalPerson(objVariables.objPerson, user, objTranslate)
  const modal = document.getElementById('modalAlertP')
  const closeButton = document.querySelector('.modal-close')
  closeButton.addEventListener('click', closeModal)
  modal.style.display = 'block'
}
