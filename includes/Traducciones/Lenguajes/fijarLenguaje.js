import baseUrl from '../../../config.js'
const SERVER = baseUrl

function actualizarLenguaje(objeto) {
  // eslint-disable-next-line no-console
  let obj = { ...objeto }
  return new Promise((resolve, reject) => {
    // Realiza el fetch y maneja la lógica de la respuesta
    const rax = `&new=${new Date()}`
    obj.rax = rax
    const datos = JSON.stringify(obj)
    // console.log(datos)
    const ruta = `${SERVER}/Routes/index.php`
    fetch(ruta, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: datos,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `Error en la solicitud: ${res.status} ${res.statusText}`
          )
        }
        return res.json()
      })
      .then((data) => {
        // console.log(data)
        resolve(data)
      })
      .catch((error) => {
        console.error('Error en la solicitud:', error)
        reject(error)
        alert('No se pudo establecer conexión con el servidor')
      })
  })
}

export default actualizarLenguaje
