import baseUrl from '../../../../config.js'
const SERVER = baseUrl

function agregarCampoNuevo(objeto, ruta, sql_i) {
  // eslint-disable-next-line no-console
  console.time('insert_time')
  const nuevoObjeto = encodeURIComponent(JSON.stringify(objeto))
  // const ruta = `${SERVER}/Pages/Control/Routes/insert.php?v=${Math.round(
  //   Math.random() * 10
  // )}`
  // console.log(nuevoObjeto)
  const rax = `&new=${new Date()}`
  let obj = {
    q: nuevoObjeto,
    ruta,
    rax,
    sql_i,
  }
  const datos = JSON.stringify(obj)
  const url = `${SERVER}/Routes/index.php`
  // console.log(datos)
  return new Promise((resolve, reject) => {
    // Realiza el fetch y maneja la lógica de la respuesta
    fetch(url, {
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
          // console.log(data);
          // eslint-disable-next-line no-console
          console.timeEnd('insert_time')
          resolve(data) // Resuelve la promesa con el valor correcto
        } else {
          throw new Error('Error en el formato JSON')
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.warn(error.message)
        // eslint-disable-next-line no-console
        console.timeEnd('insert_time')
        reject(error) // Rechaza la promesa en caso de error
      })
  })
}

export default agregarCampoNuevo
