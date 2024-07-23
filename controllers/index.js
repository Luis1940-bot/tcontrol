// eslint-disable-next-line import/extensions, import/no-useless-path-segments
// import { encriptar, desencriptar } from '../controllers/cript.js'
import baseUrl from '../config.js'
const SERVER = baseUrl

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
  const email = document.getElementById('email')
  // console.log(email.value)
  // session()
  setTimeout(() => {
    // window.location.href = `${SERVER}/Pages/Home/`
    // window.location.href = `${SERVER}/Pages/Login/`
    // console.log(`${SERVER}/Pages/Router/rutas.php?ruta=login`)
    window.location.href = `${SERVER}/Pages/Router/rutas.php?ruta=login`
    // window.location.href = `${SERVER}/Pages/Router/rutas.php?ruta=home`
  }, 1000)
})
