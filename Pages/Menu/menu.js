// eslint-disable-next-line no-unused-vars, import/extensions
import readJSON from '../../controllers/read-JSON.js';
// eslint-disable-next-line import/extensions
import createButton from '../../includes/atoms/createButton.js';
// eslint-disable-next-line import/extensions, import/no-named-as-default
import translate, {
  // eslint-disable-next-line no-unused-vars
  arrayTranslateOperativo,
  // eslint-disable-next-line no-unused-vars
  arrayEspanolOperativo,
// eslint-disable-next-line import/extensions
} from '../../controllers/translate.js';
// eslint-disable-next-line import/extensions
import personModal from '../../controllers/person.js';
// eslint-disable-next-line import/extensions
import { inicioPerformance, finPerformance } from '../../includes/Conection/conection.js';
// eslint-disable-next-line import/extensions, import/no-useless-path-segments
import { desencriptar } from '../../controllers/cript.js';

let translateOperativo = [];
let espanolOperativo = [];
const objTranslate = {
  operativoES: [],
  operativoTR: [],
};

const spinner = document.querySelector('.spinner');
const objButtons = {};
const navegador = {
  estadoAnteriorButton: '',
  estadoAnteriorWhereUs: [],
};

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

function trO(palabra) {
  const palabraNormalizada = palabra.replace(/\s/g, '').toLowerCase();
  const index = espanolOperativo.findIndex(
    (item) => item.replace(/\s/g, '').toLowerCase() === palabraNormalizada,
  );
  if (index !== -1) {
    return translateOperativo[index];
  }
  return palabra;
}

/* eslint-disable no-use-before-define */
function asignarEventos() {
  const buttons = document.querySelectorAll('.button-selector-menu');
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      const ruta = objButtons[navegador.estadoAnteriorButton].name[index];
      window.location.href = `../${ruta}/index.php`;
    });
  });
}

/* eslint-enable no-use-before-define */

function completaButtons(obj) {
  const divButtons = document.querySelector('.div-menu-buttons');
  divButtons.innerHTML = '';
  document.getElementById('spanUbicacion').innerText = objButtons.planta;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < objButtons[obj].name.length; i++) {
    const element = objButtons[obj].name[i];
    // const ruta = objButtons[obj].ruta[i];
    const params = {
      text: trO(element) || element,
      name: objButtons[obj].name[i],
      class: 'button-selector-menu',
      innerHTML: null,
      height: null, // 35
      width: null, // 75%
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
      navegador.estadoAnteriorButton = 'Menu';
      navegador.estadoAnteriorWhereUs.push('Menu');
      completaButtons('Menu');
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error al cargar el archivo:', error);
    });
}

function dondeEstaEn() {
  // const ustedEstaEn = `${trO('Usted está en')} ` || 'Usted está en ';
  // document.getElementById('whereUs').innerText = ustedEstaEn;
  let lugar = trO('Menú') || 'Menú';
  lugar = `<img src='../../assets/img/icons8-brick-wall-50.png' height='10px' width='10px'> ${lugar}`;
  document.getElementById('whereUs').innerHTML = lugar;
  document.getElementById('whereUs').style.display = 'inline';
}

function configPHP() {
  const user = desencriptar(localStorage.getItem('user'));
  const {
    developer, content, by, rutaDeveloper, logo,
  } = user;
  const metaDescription = document.querySelector('meta[name="description"]');
  metaDescription.setAttribute('content', content);
  const faviconLink = document.querySelector('link[rel="shortcut icon"]');
  faviconLink.href = './../../assets/img/favicon.ico';
  document.title = developer;
  const logoi = document.getElementById('logo_factum');
  const srcValue = `./../../assets/img/${logo}.png`;
  const altValue = 'Tenki Web';
  logoi.src = srcValue;
  logoi.alt = altValue;
  logoi.width = 100;
  logoi.height = 40;
  const footer = document.getElementById('footer');
  footer.innerText = by;
  footer.href = rutaDeveloper;
  // const linkInstitucional = document.getElementById('linkInstitucional');
  // linkInstitucional.href = 'https://www.factumconsultora.com';
}

document.addEventListener('DOMContentLoaded', async () => {
  inicioPerformance();
  configPHP();
  spinner.style.visibility = 'visible';
  const hamburguesa = document.querySelector('#hamburguesa');
  hamburguesa.style.display = 'none';
  const persona = desencriptar(localStorage.getItem('user'));
  if (persona) {
    document.querySelector('.custom-button').innerText = persona.lng.toUpperCase();
    const data = await translate(persona.lng);
    translateOperativo = data.arrayTranslateOperativo;
    espanolOperativo = data.arrayEspanolOperativo;
    objTranslate.operativoES = [...espanolOperativo];
    objTranslate.operativoTR = [...translateOperativo];
    leeVersion('version');
    setTimeout(() => {
      dondeEstaEn();
      leeApp('app');
    }, 200);
  }
  spinner.style.visibility = 'hidden';
  finPerformance();
});

document.addEventListener('DOMContentLoaded', () => {
  const person = document.getElementById('person');
  person.addEventListener('click', () => {
    person.style.border = '3px solid #212121';
    person.style.background = '#212121';
    person.style.borderRadius = '10px 10px 0px 0px';
    const persona = desencriptar(localStorage.getItem('user'));
    const user = {
      person: persona.person,
      salir: trO('Cerrar sesión'),
    };
    personModal(user, objTranslate);
  });
});

const goLanding = document.querySelector('.custom-button');
goLanding.addEventListener('click', () => {
  const url = '../../Pages/Landing';
  window.location.href = url;
});
