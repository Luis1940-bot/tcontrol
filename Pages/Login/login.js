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
import enviarLogin from './Controllers/enviarFormulario.js'
// eslint-disable-next-line import/extensions
import arrayGlobal from '../../controllers/variables.js'

const spinner = document.querySelector('.spinner')
const appJSON = {}

function leeVersion(json) {
  readJSON(json)
    .then((data) => {
      document.querySelector('.version').innerText = data.version
    })
    .catch((error) => {
      console.error('Error al cargar el archivo:', error)
    })
}

function trO(palabra) {
  if (palabra === undefined || palabra === null) {
    return ''
  }
  const palabraNormalizada = palabra.replace(/\s/g, '').toLowerCase()
  const index = espanolOperativo.findIndex(
    (item) =>
      item.replace(/\s/g, '').toLowerCase().trim() === palabraNormalizada.trim()
  )
  if (index !== -1) {
    return translateOperativo[index]
  }
  return palabra
}

function leeApp(json) {
  readJSON(json)
    .then((data) => {
      Object.assign(appJSON, data)
      // console.log(data)
      const { developer, content, by, rutaDeveloper, logo } = data
      const metaDescription = document.querySelector('meta[name="description"]')
      metaDescription.setAttribute('content', content)
      const faviconLink = document.querySelector('link[rel="shortcut icon"]')
      faviconLink.href = './../../assets/img/favicon.ico'
      document.title = developer
      const logoi = document.getElementById('logo_factum')
      const srcValue = `./../../assets/img/${logo}.png`
      const altValue = 'Tenki Web'
      logoi.src = srcValue
      logoi.alt = altValue
      logoi.width = 100
      logoi.height = 40
      const footer = document.getElementById('footer')
      footer.innerText = by
      footer.href = rutaDeveloper
      // document.querySelector('.header-McCain').style.display = 'none'
      configPHP(data)
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

function enviarFormulario() {
  // enviarLogin()
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

function configPHP(json) {
  try {
    const { plantas, elements } = json
    const div = document.querySelector('.div-login-buttons')
    for (const key in elements) {
      // console.log(elements)
      if (elements.hasOwnProperty(key)) {
        if (key === 'select') {
          let params = objParams(
            'Plants',
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
        }
        if (key === 'input') {
          elements.input.forEach((element, index) => {
            let params = objParams(
              element.name,
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
          let params = objParams(
            null,
            'button-login',
            null,
            'idLogin',
            null,
            null,
            null,
            elements.button[0].name,
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

document.addEventListener('DOMContentLoaded', async () => {
  inicioPerformance()
  spinner.style.visibility = 'visible'
  const hamburguesa = document.querySelector('#hamburguesa')
  hamburguesa.style.display = 'none'
  const person = document.querySelector('#person')
  person.style.display = 'none'
  leeVersion('version')
  setTimeout(() => {
    leeApp(`log`)
  }, 200)
  spinner.style.visibility = 'hidden'
  finPerformance()
})
