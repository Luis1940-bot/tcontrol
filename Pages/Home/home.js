// eslint-disable-next-line no-unused-vars, import/extensions
import readJSON from '../../controllers/read-JSON.js';
// eslint-disable-next-line import/extensions
import createButton from '../../includes/atoms/createButton.js';

const spinner = document.querySelector('.spinner');
function leeVersion(json) {
  readJSON(json)
    .then((data) => {
      document.querySelector('.version').innerText = data.version;
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error al cargar el archivo:', error);
    });
}

function asignarEventos() {
  const buttons = document.querySelectorAll('.button-selector');
  buttons.forEach((button) => {
    button.addEventListener('click', (e) => {
      console.log(e.target.name);
    });
  });
}

function completaButtons(obj) {
  const divButtons = document.querySelector('.div-buttons');
  document.getElementById('spanUbicacion').innerText = obj.planta;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < obj.apps.name.length; i++) {
    const element = obj.apps.name[i];
    const ruta = obj.apps.ruta[i];
    const params = {
      text: element,
      name: ruta,
      class: 'button-selector',
    };
    const newButton = createButton(params);
    divButtons.appendChild(newButton);
  }
  asignarEventos();
}

function leeApp(json) {
  readJSON(json)
    .then((data) => {
      completaButtons(data);
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error al cargar el archivo:', error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  spinner.style.visibility = 'visible';
  leeVersion('version');
  leeApp('app');
  spinner.style.visibility = 'hidden';
});
