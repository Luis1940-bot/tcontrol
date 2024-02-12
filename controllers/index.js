// eslint-disable-next-line import/extensions, import/no-useless-path-segments
import { encriptar, desencriptar } from '../controllers/cript.js'
// const SERVER = '/iControl-Vanilla/icontrol';
const SERVER = ''

function configPHP() {
  const userDesencriptado = desencriptar(sessionStorage.getItem('user'))
  const user = userDesencriptado
  const { developer, content, logo, by } = user
  const metaDescription = document.querySelector('meta[name="description"]')
  metaDescription.setAttribute('content', content)
  const faviconLink = document.querySelector('link[rel="shortcut icon"]')
  faviconLink.href = `${SERVER}/assets/img/favicon.ico`
  document.title = developer
  const logoi = document.getElementById('logo_png')
  const srcValue = `${SERVER}/assets/img/${logo}.png`
  const altValue = 'Tenki Web'
  logoi.src = srcValue
  logoi.alt = altValue
  logoi.width = 100
  logoi.height = 40
  const linkInstitucional = document.getElementById('linkInstitucional')
  linkInstitucional.href = by
}

function session() {
  fetch(`${SERVER}/Pages/Session/session.php`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('No hay sesión activa')
      }
      return response.text() // Cambiado a text() para obtener la respuesta como texto
    })
    .then((data) => {
      // Imprimir la respuesta del servidor en la consola
      // console.log('Server response:', data);

      // Intentar analizar la respuesta como JSON
      try {
        let parsedData = JSON.parse(data)
        // const {
        //   email, plant, lng, person, id, tipo,
        // } = parsedData;

        parsedData = encriptar(parsedData)
        sessionStorage.setItem('user', parsedData)

        configPHP()
      } catch (error) {
        // Manejar errores al analizar JSON
        // eslint-disable-next-line no-console
        console.error('Error parsing JSON:', error.message)
      }
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error.message)
    })
}

function limpiezaDeCache() {
  if (!sessionStorage.getItem('firstLoad')) {
    // Limpiar la caché
    caches.keys().then((names) => {
      names.forEach((name) => {
        caches.delete(name)
      })
    })

    // Marcar que la aplicación ya se ha cargado
    sessionStorage.setItem('firstLoad', true)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const spinner = document.querySelector('.spinner')
  spinner.style.visibility = 'visible'
  limpiezaDeCache()
  session()
  setTimeout(() => {
    window.location.href = `${SERVER}/Pages/Home/`
  }, 1000)
})
