// eslint-disable-next-line import/extensions
import traerRegistros from './Modules/traerRegistros.js';
// eslint-disable-next-line import/extensions
import tablaVacia from './Modules/armadoDeTabla.js';

let controlN = '';
let controlT = '';
let nr = 0;
const encabezados = {
  title: [
    'id', 'concepto', 'relevamiento', 'detalle', 'observación',
  ],
  width: [
    '.05', '.15', '.25', '.25', '.25',
  ],
};

function configuracionLoad() {
  const url = new URL(window.location.href);
  controlN = url.searchParams.get('control_N');
  controlT = url.searchParams.get('control_T');
  nr = url.searchParams.get('nr');
  nr === '0' ? nr = '-' : nr;
  document.getElementById('doc').innerText = `Doc: ${nr}`;
  document.getElementById('wichC').innerText = controlT;
  document.getElementById('wichC').style.display = 'inline';
}

document.addEventListener('DOMContentLoaded', () => {
  const spinner = document.querySelector('.spinner');
  spinner.style.visibility = 'visible';
  configuracionLoad();
  traerRegistros(`NuevoControl,${controlN}`)
    .then((data) => {
      tablaVacia(data, encabezados);
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.warn(error);
    });

  spinner.style.visibility = 'hidden';
});
