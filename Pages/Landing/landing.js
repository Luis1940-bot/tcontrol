// eslint-disable-next-line no-unused-vars, import/extensions
import readJSON from '../../controllers/read-JSON.js';
// eslint-disable-next-line import/extensions
import createButton from '../../includes/atoms/createButton.js';
// eslint-disable-next-line import/extensions
import createDiv from '../../includes/atoms/createDiv.js';
// eslint-disable-next-line import/extensions
import createRadioButton from '../../includes/atoms/createRadioButton.js';

const spinner = document.querySelector('.spinner');
const objButtons = {};

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

function storage(idioma) {
  const datos = {
    lng: idioma,
  };
  const datosString = JSON.stringify(datos);
  localStorage.setItem('datosUser', datosString);
}

function completaButtons(obj) {
  const divButtons = document.querySelector('.div-buttons');
  divButtons.innerHTML = '';
  document.getElementById('spanUbicacion').innerText = objButtons.planta;

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < objButtons[obj].bienvenido.length; i++) {
    const element = objButtons[obj].bienvenido[i];
    const abreviatura = objButtons[obj].abreviatura[i];

    // Crear un contenedor para el botón y el radio button
    let params = {
      textContent: null,
      name: null,
      class: 'div-selector',
      innerHTML: null,
      height: '50px',
      width: '70%',
      borderRadius: '10px',
      border: '2px solid #212121',
      textAlign: 'left',
      marginLeft: null,
      marginRight: null,
      marginTop: '15px',
      marginBotton: '10px',
      paddingLeft: '20px',
      paddingRight: null,
      paddingTop: '10px',
      paddingBotton: null,
      flex: 'flex',
      alignItems: 'center',
      display: null,
    };
    const container = createDiv(params);
    params = {
      text: `${element}<br>${abreviatura}`,
      name: abreviatura,
      class: 'button-selector',
      innerHTML: `<b>${element}</b><br>${objButtons[obj].abreviatura[i]}`,
      height: null,
      width: null,
      borderRadius: null,
      border: 'none',
      textAlign: 'left',
      marginLeft: null,
      marginRight: null,
      marginTop: null,
      marginBotton: null,
      paddingLeft: '20px',
      paddingRight: null,
      paddingTop: null,
      paddingBotton: null,
      background: 'transparent',
    };
    const newButton = createButton(params);
    params = {
      name: abreviatura,
      class: 'radio-selector',
      height: '20px',
      width: '20px',
      id: null,
      value: null,
      background: '#D9D9D9',
      border: '2px solid #cecece',
      marginLeft: '0px',
      marginRight: '20px',
      marginTop: '0px',
      marginBotton: null,
      paddingLeft: null,
      paddingRight: null,
      paddingTop: null,
      paddingBotton: null,
      disabled: 'disabled',
    };
    const newRadioButton = createRadioButton(params);
    // Agregar el botón y el radio button al contenedor
    container.appendChild(newButton);
    container.appendChild(newRadioButton);

    // Agregar el contenedor al divButtons
    divButtons.appendChild(container);
  }

  const divs = document.querySelectorAll('.div-selector');
  const radios = document.querySelectorAll('.radio-selector');
  divs.forEach((div, index) => {
    div.addEventListener('click', () => {
      const radio = radios[index];
      radio.checked = true;
      storage(radio.name);
      const seguir = document.querySelector('.my-button');
      seguir.disabled = false;
      seguir.style.background = '#212121';
      seguir.addEventListener('mouseover', () => {
        if (!seguir.disabled) {
          seguir.style.background = '#cecece';
        }
      });
      seguir.addEventListener('mouseout', () => {
        seguir.style.background = '#212121';
      });
    });
  });
}

function leeApp(json) {
  readJSON(json)
    .then((data) => {
      Object.assign(objButtons, data);
      completaButtons('idiomas');
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error al cargar el archivo:', error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  spinner.style.visibility = 'visible';
  const customButton = document.querySelector('.custom-button');
  customButton.innerText = '';
  const person = document.querySelector('#person');
  person.style.display = 'none';
  const hamburguesa = document.querySelector('#hamburguesa');
  hamburguesa.style.display = 'none';
  leeVersion('version');
  leeApp('app');
  spinner.style.visibility = 'hidden';
});

const button = document.querySelector('.my-button');
button.addEventListener('click', () => {
  const url = '../../Pages/Home';
  window.location.href = url;
});
