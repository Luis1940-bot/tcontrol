import baseUrl from '../../../../config.js'
const SERVER = baseUrl

// eslint-disable-next-line quotes
function limpiarObjeto(objeto) {
  const { displayRow, requerido, ...restoDelObjeto } = objeto
  const nuevoObjeto = {
    ...restoDelObjeto,
  }

  return nuevoObjeto
}

function updateRegistro(objeto, nux) {
  // eslint-disable-next-line no-console
  console.time('update_time')
  const objLimpio = limpiarObjeto(objeto)
  const nuevoObjeto = encodeURIComponent(JSON.stringify(objLimpio))
  // console.log(nuevoObjeto)
  const rax = `&new=${new Date()}`
  let obj = {
    q: nuevoObjeto,
    ruta: '/ux2024',
    rax,
    nux,
  }

  const datos = JSON.stringify(obj)
  // console.log(datos)
  const ruta = `${SERVER}/Routes/index.php`
  // const datos = new URLSearchParams()
  // datos.append('nuevoObjeto', nuevoObjeto)
  // datos.append('nux', nux)

  return new Promise((resolve, reject) => {
    // Realiza el fetch y maneja la lógica de la respuesta
    fetch(ruta, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: datos,
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json()
        }
        throw new Error(`Error en la solicitud: ${response.status}`)
      })
      .then((data) => {
        if (typeof data === 'object') {
          // eslint-disable-next-line no-console
          // eslint-disable-next-line no-console
          console.timeEnd('update_time')
          resolve(data) // Resuelve la promesa con el valor correcto
        } else {
          throw new Error('Error en el formato JSON')
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.warn(error.message)
        // eslint-disable-next-line no-console
        console.timeEnd('update_time')
        reject(error) // Rechaza la promesa en caso de error
      })
  })
}

export default updateRegistro
