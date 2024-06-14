// eslint-disable-next-line no-unused-vars, import/extensions
import readJSON from '../../controllers/read-JSON.js'
// eslint-disable-next-line import/extensions
import createButton from '../../includes/atoms/createButton.js'
// eslint-disable-next-line import/extensions
import {
  inicioPerformance,
  finPerformance,
} from '../../includes/Conection/conection.js'
// eslint-disable-next-line import/extensions
import { encriptar, desencriptar } from '../../controllers/cript.js'
import createSelect from '../../includes/atoms/createSelect.js'
import createInput from '../../includes/atoms/createInput.js'
import createLabel from '../../includes/atoms/createLabel.js'
import createSpan from '../../includes/atoms/createSpan.js'
import enviarLogin from './Controllers/enviarFormulario.js'
// eslint-disable-next-line import/extensions
import arrayGlobal from '../../controllers/variables.js'
import createDiv from '../../includes/atoms/createDiv.js'

const spinner = document.querySelector('.spinner')
const appJSON = {}

import baseUrl from '../../config.js'
import leeVersion from '../../controllers/leeVersion.js'

const SERVER = baseUrl

const espanolOperativo = {
  error: {
    es: 'Hay un dato que no es correcto.',
    en: 'There is one piece of information that is not correct.',
    br: 'Há uma informação que não está correta.',
  },
  planta: {
    es: 'Planta',
    en: 'Plants',
    br: 'Plantar',
  },
  Email: {
    es: 'Correo electrónico',
    en: 'E-mail',
    br: 'E-mail',
  },
  Password: {
    es: 'Contraseña',
    en: 'Password',
    br: 'Senha',
  },
  Login: {
    es: 'Acceso',
    en: 'Login',
    br: 'Conecte-se',
  },
  alertas: {
    mail: {
      es: 'Complete el correo electrónico.',
      en: 'Complete the email.',
      br: 'Preencha o e-mail.',
    },
    planta: {
      es: 'Seleccione la planta.',
      en: 'Select the plant.',
      br: 'Selecione a planta.',
    },
    pass: {
      es: 'Complete la contraseña.',
      en: 'Fill in the password.',
      br: 'Preencha a senha.',
    },
  },
}

function leeApp(json) {
  readJSON(json)
    .then((data) => {
      Object.assign(appJSON, data)
      // console.log(data)
      const idiomaPreferido = navigator.language || navigator.languages[0]
      const partesIdioma = idiomaPreferido.split('-')
      const idioma = partesIdioma[0]
      const { developer, content, by, rutaDeveloper, logo } = data
      const metaDescription = document.querySelector('meta[name="description"]')
      metaDescription.setAttribute('content', content)
      const faviconLink = document.querySelector('link[rel="shortcut icon"]')
      faviconLink.href = `${SERVER}/assets/img/favicon.ico`
      document.title = developer
      const logoi = document.getElementById('logo_factum')
      const srcValue = `${SERVER}/assets/img/${logo}.png`
      const altValue = 'Tenki Web'
      logoi.src = srcValue
      logoi.alt = altValue
      logoi.width = 100
      logoi.height = 40
      const footer = document.getElementById('footer')
      footer.innerText = by
      footer.href = rutaDeveloper
      // document.querySelector('.header-McCain').style.display = 'none'
      configPHP(data, idioma)
      setTimeout(() => {
        const select = document.querySelector('.select-login')
        if (select) {
          select.focus()
        }
      }, 100)
    })
    .catch((error) => {
      console.error('Error al cargar el archivo:', error)
    })
}

function session(session) {
  // console.log(session)
  const idiomaPreferido = navigator.language || navigator.languages[0]
  const partesIdioma = idiomaPreferido.split('-')
  const idioma = partesIdioma[0]
  var spanLogin = document.querySelector('.span-login')
  if (spanLogin) {
    // Eliminar el elemento
    spanLogin.parentNode.removeChild(spanLogin)
  }
  if (session.success === false) {
    const div = document.querySelector('.div-login-buttons')
    let span = document.createElement('span')
    const texto = espanolOperativo.error[idioma]
    let params = objParams(
      null,
      'span-login',
      null,
      null,
      null,
      null,
      null,
      null
    )
    span = createSpan(params, texto)
    div.appendChild(span)
    let input = document.getElementById('idInput0')
    input.style.color = '#f81212'
    input = document.getElementById('idInput1')
    input.style.color = '#f81212'
    let select = document.getElementById('idSelectLogin')
    select.style.color = '#f81212'
  } else {
    let parsedData = encriptar(session)
    sessionStorage.setItem('user', parsedData)
    setTimeout(() => {
      window.location.href = `${SERVER}/Pages/Router/rutas.php?ruta=home`
    }, 1000)
  }
}

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

async function enviarFormulario() {
  try {
    const idiomaPreferido = navigator.language || navigator.languages[0]
    const partesIdioma = idiomaPreferido.split('-')
    const idioma = partesIdioma[0]
    const select = document.getElementById('idSelectLogin')
    const email = document.getElementById('idInput0')
    const password = document.getElementById('idInput1')
    let objeto = {
      planta: '',
      email: '',
      password: '',
      ruta: '/login',
    }
    if (!select.value) {
      showAlert(espanolOperativo.alertas.planta[idioma])
      return
    } else {
      objeto.planta = select.value
    }
    if (!email.value) {
      showAlert(espanolOperativo.alertas.mail[idioma])
      return
    } else {
      objeto.email = email.value
    }
    if (!password.value) {
      showAlert(espanolOperativo.alertas.pass[idioma])
      return
    } else {
      objeto.password = password.value
    }
    if (validarEmail(email.value)) {
      // console.log('El email es válido.')
    } else {
      console.log('El email no es válido.')
    }
    const login = await enviarLogin(objeto)
    setTimeout(() => {
      session(login)
    }, 200)
  } catch (error) {
    console.log(error)
  }
}

function objParams(
  innerHTML,
  className,
  fontFamily,
  id,
  fontSize,
  type,
  value,
  text,
  clase,
  name,
  onClick
) {
  const params = {
    innerHTML,
    className,
    fontFamily,
    id,
    fontSize,
    type,
    value,
    text,
    class: clase,
    name,
    onClick,
  }
  return params
}

function configPHP(json, idioma) {
  try {
    const { plantas, elements } = json
    const div = document.querySelector('.div-login-buttons')
    for (const key in elements) {
      // console.log(elements)
      if (elements.hasOwnProperty(key)) {
        if (key === 'select') {
          let labelPlanta = espanolOperativo.planta[idioma]
          let params = objParams(
            labelPlanta,
            'label-login',
            null,
            null,
            null,
            null,
            null,
            null
          )
          let label = createLabel(params)
          div.appendChild(label)
          //*----------------------------------
          const nombresPlantas = plantas.map((planta) => [
            planta.num,
            planta.name,
          ])
          params = objParams(
            null,
            'select-login',
            null,
            'idSelectLogin',
            null,
            null,
            null,
            null
          )
          const select = createSelect(nombresPlantas, params)
          div.appendChild(select)
          //*------------------------------------
        }
        if (key === 'input') {
          elements.input.forEach((element, index) => {
            let labelInput = espanolOperativo[element.name][idioma]
            let params = objParams(
              labelInput,
              'label-login',
              null,
              null,
              null,
              null,
              null,
              null
            )
            let label = createLabel(params)
            div.appendChild(label)
            let id = index === 0 ? 'idInput0' : `idInput${index}`
            params = objParams(
              null,
              'input-login',
              null,
              id,
              null,
              element.type,
              '',
              null,
              null,
              null
            )
            let input = createInput(params)
            div.appendChild(input)
            if (index === 0) {
              input.focus()
            }
          })
        }

        if (key === 'button') {
          let labelButton = espanolOperativo[elements.button[0].name][idioma]
          let params = objParams(
            null,
            'button-login',
            null,
            'idLogin',
            null,
            null,
            null,
            labelButton,
            'button-login',
            null,
            enviarFormulario
          )

          const button = createButton(params)
          div.appendChild(button)
        }
      }
      const firstInput = div.querySelector('.input-login[type="text"]:focus')
      if (firstInput) {
        firstInput.focus()
      }
    }
  } catch (error) {
    console.log(error)
  }
}

function showAlert(message) {
  var overlay = document.getElementById('overlay')
  var alertMessage = document.getElementById('alert-message')
  alertMessage.textContent = message
  overlay.style.display = 'flex'
}

function closeAlert() {
  var overlay = document.getElementById('overlay')
  overlay.style.display = 'none'
}

function generaOverlay() {
  const body = document.querySelector('body')
  const paramsDiv = objParams(
    null,
    null,
    null,
    'overlay',
    null,
    null,
    null,
    null,
    'overlay',
    null
  )
  const div = createDiv(paramsDiv)
  //*-------------------------------
  const paramsDivBox = objParams(
    null,
    null,
    null,
    'idAlertBox',
    null,
    null,
    null,
    null,
    'alert-box',
    null
  )
  const divBox = createDiv(paramsDivBox)
  //*-----------------------------------------
  const paramsSpan = objParams(
    null,
    'span-alerta',
    null,
    'alert-message',
    null,
    null,
    null,
    ''
  )
  const span = createSpan(paramsSpan)
  //*--------------------------------------
  const paramsButton = objParams(
    null,
    null,
    null,
    'idButtonAlert',
    null,
    null,
    null,
    'oK',
    'button-alerta',
    null,
    closeAlert
  )
  const button = createButton(paramsButton)
  //*----------------------------------------------
  divBox.appendChild(span)
  divBox.appendChild(button)
  div.style.display = 'none'
  div.appendChild(divBox)
  body.appendChild(div)
}

document.addEventListener('DOMContentLoaded', async () => {
  inicioPerformance()
  spinner.style.visibility = 'visible'

  const hamburguesa = document.querySelector('#hamburguesa')
  hamburguesa.style.display = 'none'

  const person = document.querySelector('#person')
  person.style.display = 'none'

  const version = await leeVersion('version')
  document.querySelector('.version').innerText = version

  setTimeout(() => {
    leeApp(`log`)
  }, 200)
  generaOverlay()
  spinner.style.visibility = 'hidden'
  finPerformance()
})
