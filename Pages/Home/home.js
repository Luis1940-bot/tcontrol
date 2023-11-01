// eslint-disable-next-line no-unused-vars, import/extensions
import readJSON from '../../controllers/read-JSON.js';
// eslint-disable-next-line import/extensions
import createButton from '../../includes/atoms/createButton.js';
// eslint-disable-next-line import/extensions
import translate from '../../controllers/translate.js';

let arrayTranslateOperativo = [];
let arrayEspanolOperativo = [];
// eslint-disable-next-line no-unused-vars
let arrayTranslateArchivo = [];
// eslint-disable-next-line no-unused-vars
let arrayEspanolArchivo = [];

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

function tr(palabra) {
  const index = arrayEspanolOperativo.indexOf(palabra.trim());
  if (index !== -1) {
    return arrayTranslateOperativo[index];
  }
  return null;
}

/* eslint-disable no-use-before-define */
function asignarEventos() {
  const buttons = document.querySelectorAll('.button-selector-home');
  buttons.forEach((button, index) => {
    button.addEventListener('click', (e) => {
      if (objButtons[navegador.estadoAnteriorButton].type[index] === 'btn') {
        const lugar = tr(e.target.innerText) || e.target.innerText;
        document.getElementById('whereUs').innerText += `${espacio}${lugar}`;
        document.getElementById('volver').style.display = 'block';
        document.getElementById('whereUs').style.display = 'inline';
        completaButtons(e.target.name);
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
      navegador.estadoAnteriorButton = e.target.name;
      navegador.estadoAnteriorWhereUs.push(e.target.name);
    });
  });
}
/* eslint-enable no-use-before-define */

function completaButtons(obj) {
  const divButtons = document.querySelector('.div-home-buttons');
  divButtons.innerHTML = '';
  document.getElementById('spanUbicacion').innerText = objButtons.planta;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < objButtons[obj].name.length; i++) {
    const element = objButtons[obj].name[i];
    // const ruta = objButtons[obj].ruta[i];
    const params = {
      text: tr(element) || element,
      name: objButtons[obj].name[i],
      class: 'button-selector-home',
      innerHTML: null,
      height: '35px',
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
      background: null,
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

function dondeEstaEn() {
  const ustedEstaEn = `${tr('Usted está en')} ` || 'Usted está en ';
  document.getElementById('whereUs').innerText = ustedEstaEn;
}

async function loadLenguages(leng) {
  try {
    const {
      arrayTranslateOperativo: translateOperativo,
      arrayEspanolOperativo: espanolOperativo,
      arrayTranslateArchivo: translateArchivo,
      arrayEspanolArchivo: espanolArchivo,
    } = await translate.translate(leng);
    arrayTranslateOperativo = translateOperativo;
    arrayEspanolOperativo = espanolOperativo;
    arrayTranslateArchivo = translateArchivo;
    arrayEspanolArchivo = espanolArchivo;
    leeVersion('version');
    setTimeout(() => {
      dondeEstaEn();
      leeApp('app');
    }, 200);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Ocurrió un error al cargar los datos:', error);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  spinner.style.visibility = 'visible';
  const datosUser = localStorage.getItem('datosUser');
  if (datosUser) {
    const datos = JSON.parse(datosUser);
    document.querySelector('.custom-button').innerText = datos.lng.toUpperCase();
    loadLenguages(datos.lng);
  }
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

const goLanding = document.querySelector('.custom-button');
goLanding.addEventListener('click', () => {
  const url = '../../Pages/Landing';
  window.location.href = url;
});
