// eslint-disable-next-line no-unused-vars, import/extensions
import readJSON from '../../controllers/read-JSON.js';
// eslint-disable-next-line import/extensions
import createButton from '../../includes/atoms/createButton.js';

const spinner = document.querySelector('.spinner');
const objButtons = {};
const navegador = {
  estadoAnteriorButton: '',
  estadoAnteriorWhereUs: [],
};
const espacio = ' > ';

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

/* eslint-disable no-use-before-define */
function asignarEventos() {
  const buttons = document.querySelectorAll('.button-selector');
  buttons.forEach((button, index) => {
    button.addEventListener('click', (e) => {
      if (objButtons[navegador.estadoAnteriorButton].type[index] === 'btn') {
        document.getElementById('whereUs').innerText += `${espacio}${e.target.innerText}`;
        document.getElementById('volver').style.display = 'block';
        document.getElementById('whereUs').style.display = 'inline';
        completaButtons(e.target.innerText);
      } else {
        const control = `${objButtons[navegador.estadoAnteriorButton].ruta[index]}`;
        let url = '';
        if (objButtons[navegador.estadoAnteriorButton].ruta[index] === '404') {
          url = `../../${control}.php`;
        } else {
          url = `../../Pages/${control}`;
        }
        localStorage.setItem('history_pages', navegador.estadoAnteriorWhereUs);
        window.location.href = url;
      }
      navegador.estadoAnteriorButton = e.target.innerText;
      navegador.estadoAnteriorWhereUs.push(e.target.innerText);
    });
  });
}
/* eslint-enable no-use-before-define */

function completaButtons(obj) {
  const divButtons = document.querySelector('.div-buttons');
  divButtons.innerHTML = '';
  document.getElementById('spanUbicacion').innerText = objButtons.planta;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < objButtons[obj].name.length; i++) {
    const element = objButtons[obj].name[i];
    // const ruta = objButtons[obj].ruta[i];
    const params = {
      text: element,
      name: objButtons[obj].name[i],
      class: 'button-selector',
      innerHTML: null,
      height: '40px',
      width: '75%',
      borderRadius: '5px',
      border: null,
      textAlign: 'center',
      marginLeft: null,
      marginRight: null,
      marginTop: null,
      marginBotton: null,
      paddingLeft: null,
      paddingRight: null,
      paddingTop: null,
      paddingBotton: null,
    };
    const newButton = createButton(params);
    divButtons.appendChild(newButton);
  }
  asignarEventos();
}

function leeApp(json) {
  readJSON(json)
    .then((data) => {
      Object.assign(objButtons, data);
      navegador.estadoAnteriorButton = 'apps';
      navegador.estadoAnteriorWhereUs.push('apps');
      completaButtons('apps');
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error al cargar el archivo:', error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  spinner.style.visibility = 'visible';
  const ustedEstaEn = 'Usted está en ';
  document.getElementById('whereUs').innerText = ustedEstaEn;
  leeVersion('version');
  leeApp('app');
  spinner.style.visibility = 'hidden';
});

function goBack() {
  const quitarCadena = ` > ${navegador.estadoAnteriorWhereUs[navegador.estadoAnteriorWhereUs.length - 1]}`;
  navegador.estadoAnteriorWhereUs.pop();
  // eslint-disable-next-line max-len
  navegador.estadoAnteriorButton = navegador.estadoAnteriorWhereUs[navegador.estadoAnteriorWhereUs.length - 1];
  if (navegador.estadoAnteriorWhereUs[navegador.estadoAnteriorWhereUs.length - 1] === 'apps') {
    const cadena = `${document.getElementById('whereUs').innerText}`;
    const nuevaCadena = cadena.replace(quitarCadena, '');
    document.getElementById('whereUs').innerText = `${nuevaCadena}`;
    document.getElementById('volver').style.display = 'none';
    document.getElementById('whereUs').style.display = 'none';
  } else {
    const cadena = `${document.getElementById('whereUs').innerText}`;
    const nuevaCadena = cadena.replace(quitarCadena, '');
    document.getElementById('whereUs').innerText = `${nuevaCadena}`;
  }
  completaButtons(navegador.estadoAnteriorWhereUs[navegador.estadoAnteriorWhereUs.length - 1]);
}

const volver = document.getElementById('volver');
volver.addEventListener('click', () => {
  goBack(null);
});
