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

document.addEventListener('DOMContentLoaded', async () => {
  const spinner = document.querySelector('.spinner')
  spinner.style.visibility = 'visible'

  try {
    // Ejecuta la limpieza de caché
    await limpiezaDeCache()

    // Procesa el email si es necesario
    const email = document.getElementById('email')
    // Puedes hacer algo con email.value aquí si es necesario
    // console.log(email.value);

    // Redirige después de un breve retraso simulado
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Realiza el redireccionamiento
    window.location.href = `${SERVER}/Pages/Router/rutas.php?ruta=login`

    // Alternativamente, si necesitas redirigir a otra página
    // window.location.href = `${SERVER}/Pages/Router/rutas.php?ruta=home`;
  } catch (error) {
    console.warn('Error:', error)
  } finally {
    spinner.style.visibility = 'hidden'
  }
})
