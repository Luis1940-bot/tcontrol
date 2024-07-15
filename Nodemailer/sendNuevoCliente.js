import baseUrl from '../config.js'
const SERVER = baseUrl

export default function enviaMailNuevoCliente(objeto, ruta) {
  // eslint-disable-next-line no-console
  console.time('sendEmail')
  return new Promise((resolve, reject) => {
    const rax = `&new=${new Date()}`
    let obj = {
      ruta,
      rax,
      objeto,
    }
    const datos = JSON.stringify(obj)
    // console.log(datos)
    const url = `${SERVER}/Routes/index.php`
    // Agregar tiempo de espera a la solicitud fetch
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 240000) // 60 segundos

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        // 'Access-Control-Allow-Origin': '*',
      },
      body: datos,
      signal: controller.signal,
    })
      .then((response) => {
        // console.log(response)
        clearTimeout(timeoutId)
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText)
        }
        return response.json()
      })
      .then((data) => {
        // console.log(data)
        resolve(data)
        // eslint-disable-next-line no-console
        console.timeEnd('sendEmail')
        return data
      })
      .catch((error) => {
        clearTimeout(timeoutId)
        console.timeEnd('sendEmail')
        console.error('Error en la solicitud:', error)
        reject(error)
        alert('No se pudo establecer conexión con el servidor')
      })
  })
}
