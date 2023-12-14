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
  const buttons = document.querySelectorAll('.button-selector-home');
  buttons.forEach((button, index) => {
    button.addEventListener('click', (e) => {
      if (objButtons[navegador.estadoAnteriorButton].type[index] === 'btn') {
        const lugar = trO(e.target.innerText) || e.target.innerText;
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
      text: trO(element) || element,
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
  const ustedEstaEn = `${trO('Usted está en')} ` || 'Usted está en ';
  document.getElementById('whereUs').innerText = ustedEstaEn;
}

function configPHP() {
  const user = JSON.parse(localStorage.getItem('user'));
  const {
    developer, content, by, rutaDeveloper,
  } = user;
  const metaDescription = document.querySelector('meta[name="description"]');
  metaDescription.setAttribute('content', content);
  const faviconLink = document.querySelector('link[rel="shortcut icon"]');
  faviconLink.href = './../../assets/img/favicon.ico';
  document.title = developer;
  // const logo = document.getElementById('logo_factum');
  // const srcValue = './assets/img/icontrol.png';
  // const altValue = 'Tenki Web';
  // logo.src = srcValue;
  // logo.alt = altValue;
  // logo.width = 100;
  // logo.height = 40;
  const footer = document.getElementById('footer');
  footer.innerText = by;
  footer.href = rutaDeveloper;
  // const linkInstitucional = document.getElementById('linkInstitucional');
  // linkInstitucional.href = 'https://www.factumconsultora.com';
}

document.addEventListener('DOMContentLoaded', async () => {
  configPHP();
  spinner.style.visibility = 'visible';
  const hamburguesa = document.querySelector('#hamburguesa');
  hamburguesa.style.display = 'none';
  const persona = JSON.parse(localStorage.getItem('user'));
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

document.addEventListener('DOMContentLoaded', () => {
  const person = document.getElementById('person');
  person.addEventListener('click', () => {
    person.style.border = '3px solid #212121';
    person.style.background = '#212121';
    person.style.borderRadius = '10px 10px 0px 0px';
    const persona = JSON.parse(localStorage.getItem('user'));
    const user = {
      person: persona.person,
      salir: trO('Cerrar sesión'),
    };
    personModal(user, objTranslate);
  });
});

const volver = document.getElementById('volver');
volver.addEventListener('click', () => {
  goBack(null);
});

const goLanding = document.querySelector('.custom-button');
goLanding.addEventListener('click', () => {
  const url = '../../Pages/Landing';
  window.location.href = url;
});
