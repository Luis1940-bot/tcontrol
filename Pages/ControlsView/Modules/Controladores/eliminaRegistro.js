import baseUrl from '../../../../config.js'
const SERVER = baseUrl

function eliminarRegistro(nux) {
  // eslint-disable-next-line no-console
  console.time('delete_time')
  // const nuevoObjeto = encodeURIComponent(JSON.stringify(nux))
  // const ruta = `${SERVER}/Pages/ControlsView/Routes/eliminaRegistro.php?v=${Math.round(
  //   Math.random() * 10
  // )}`
  const rax = `&new=${new Date()}`
  let obj = {
    q: nux,
    ruta: '/ex2024',
    rax,
    sql_i: null,
  }
  const datos = JSON.stringify(obj)
  // console.log(datos)
  const ruta = `${SERVER}/Routes/index.php`
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
          console.timeEnd('delete_time')
          resolve(data) // Resuelve la promesa con el valor correcto
        } else {
          throw new Error('Error en el formato JSON')
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.warn(error.message)
        // eslint-disable-next-line no-console
        console.timeEnd('delete_time')
        reject(error) // Rechaza la promesa en caso de error
      })
  })
}

export default eliminarRegistro
