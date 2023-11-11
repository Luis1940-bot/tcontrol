// eslint-disable-next-line import/extensions
import guardarNuevo from './Controladores/guardarNuevo.js';

function cerrarModales() {
  let modal = document.getElementById('modalAlert');
  modal.style.display = 'none';
  modal = document.getElementById('modalAlertM');
  modal.style.display = 'none';
}

// eslint-disable-next-line import/prefer-default-export
export const funciones = {
  Guardar(objetoControl, array) {
    cerrarModales();
    guardarNuevo(objetoControl, array);
  },
  GuardarCambio() {
    cerrarModales();
  },
  GuardarComoNuevo() {
    const modal = document.getElementById('modalAlertM');
    // modal.style.display = 'none';
    console.log('guardar como nuevo');
  },
  Refrescar() {
    const modal = document.getElementById('modalAlertM');
    // modal.style.display = 'none';
    console.log('refrescar');
  },
  Firmar() {
    const modal = document.getElementById('modalAlertM');
    // modal.style.display = 'none';
    console.log('firmar');
  },
  Salir() {
    const modal = document.getElementById('modalAlertM');
    // modal.style.display = 'none';
    // eslint-disable-next-line no-console
    console.log('salir');
  },
};
