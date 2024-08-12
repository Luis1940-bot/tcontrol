// eslint-disable-next-line no-unused-vars, import/extensions
import readJSON from '../../controllers/read-JSON.js'
// eslint-disable-next-line import/extensions
import createButton from '../../includes/atoms/createButton.js'
// eslint-disable-next-line import/extensions
import createDiv from '../../includes/atoms/createDiv.js'
// eslint-disable-next-line import/extensions
import createRadioButton from '../../includes/atoms/createRadioButton.js'
// eslint-disable-next-line import/extensions, import/no-named-as-default
import { arraysLoadTranslate } from '../../controllers/arraysLoadTranslate.js'
// eslint-disable-next-line import/extensions
import {
  inicioPerformance,
  finPerformance,
} from '../../includes/Conection/conection.js'
// eslint-disable-next-line import/extensions, import/no-useless-path-segments
import { encriptar, desencriptar } from '../../controllers/cript.js'
import actualizarLenguaje from '../../includes/Traducciones/Lenguajes/fijarLenguaje.js'

import baseUrl from '../../config.js'
import { configPHP } from '../../controllers/configPHP.js'
// const SERVER = '/iControl-Vanilla/icontrol';
const SERVER = baseUrl

const spinner = document.querySelector('.spinner')
const objButtons = {}

function leeVersion(json) {
  readJSON(json)
    .then((data) => {
      document.querySelector('.version').innerText = data.version
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error al cargar el archivo:', error)
    })
}

function completaButtons(obj) {
  const divButtons = document.querySelector('.div-landing-buttons')
  divButtons.innerHTML = ''
  document.getElementById('spanUbicacion').innerText = objButtons.planta

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < objButtons[obj].bienvenido.length; i++) {
    const element = objButtons[obj].bienvenido[i]
    const abreviatura = objButtons[obj].abreviatura[i]

    // Crear un contenedor para el botón y el radio button
    let params = {
      textContent: null,
      name: null,
      class: 'div-selector',
      innerHTML: null,
      height: null,
      width: null,
      borderRadius: '10px',
      border: '2px solid #212121',
      textAlign: 'left',
      marginLeft: null,
      marginRight: null,
      marginTop: null,
      marginBotton: '10px',
      paddingLeft: '20px',
      paddingRight: null,
      paddingTop: '10px',
      paddingBotton: null,
      flex: 'flex',
      alignItems: 'center',
      display: null,
    }
    const container = createDiv(params)
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
    }
    const newButton = createButton(params)
    params = {
      name: 'radio',
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
      dataCustom: abreviatura,
    }
    const newRadioButton = createRadioButton(params)
    // Agregar el botón y el radio button al contenedor
    container.appendChild(newButton)
    container.appendChild(newRadioButton)

    // Agregar el contenedor al divButtons
    divButtons.appendChild(container)
  }
  const divs = document.querySelectorAll('.div-selector')
  const radios = document.querySelectorAll('.radio-selector')
  // const seguir = document.querySelector('.my-button')
  let language = ''
  let index = 0
  divs.forEach((div, i) => {
    language = radios[i].getAttribute('data-custom')
    index = i
    div.addEventListener('click', () => {
      const radio = radios[i]
      // // Obtener el objeto almacenado en sessionStorage
      const userData = desencriptar(sessionStorage.getItem('user'))
      radio.checked = true
      language = radios[i].getAttribute('data-custom')
      userData.lng = language.slice(0, 2)
      sessionStorage.setItem('user', encriptar(userData))
      document.querySelector('.custom-button').innerText = language
        .slice(0, 2)
        .toUpperCase()
      const persona = desencriptar(sessionStorage.getItem('user'))

      spinner.style.visibility = 'visible'
      loadLenguages(persona)
    })

    const persona = desencriptar(sessionStorage.getItem('user'))
    const buttonSelector = div.childNodes[0].name.slice(0, 2)

    if (
      buttonSelector.slice(0, 2).toLowerCase() === persona.lng.toLowerCase()
    ) {
      radios[index].checked = true
      // seguir.disabled = false
      // seguir.style.background = '#212121'
    }
  })
}

function leeApp(json) {
  readJSON(json)
    .then((data) => {
      Object.assign(objButtons, data)
      completaButtons('idiomas')
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error al cargar el archivo:', error)
    })
}

document.addEventListener('DOMContentLoaded', () => {
  const user = desencriptar(sessionStorage.getItem('user'))
  const { plant } = user
  inicioPerformance()
  configPHP(user, SERVER)
  spinner.style.visibility = 'visible'
  const customButton = document.getElementById('planta')
  const persona = desencriptar(sessionStorage.getItem('user'))
  const personaLng = persona.lng
  customButton.innerText = personaLng.toUpperCase()
  const person = document.querySelector('#person')
  person.style.display = 'none'
  const hamburguesa = document.querySelector('#hamburguesa')
  hamburguesa.style.display = 'none'
  leeVersion('version')
  leeApp(`App/${plant}/app`)
  spinner.style.visibility = 'hidden'
  finPerformance()
})

async function loadLenguages(persona) {
  try {
    // console.log(persona)
    const leng = persona.lng
    const id = persona.id
    const objetoLng = {
      leng,
      id,
      ruta: '/mi_cfg',
    }
    const lenguaje = await actualizarLenguaje(objetoLng)
    await arraysLoadTranslate(leng)
    setTimeout(() => {
      const url = `${SERVER}/Pages/Home`
      window.location.href = url
      // window.open(url, '_blank')
    }, 1000)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Ocurrió un error al cargar los datos:', error)
  }
}
