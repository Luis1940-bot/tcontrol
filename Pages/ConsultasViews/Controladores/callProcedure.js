import baseUrl from '../../../config.js'
const SERVER = baseUrl

export default function callProcedure(q, desde, hasta, operation) {
  // eslint-disable-next-line no-console
  console.time('callProcedure')
  return new Promise((resolve, reject) => {
    const rax = `&new=${new Date()}`
    // const ruta = `${SERVER}/Pages/ConsultasViews/Routes/callProcedure.php?${rax}`
    const ruta = `${SERVER}/Routes/index.php`
    const requestBody = {
      q,
      desde,
      hasta,
      operation,
      ruta: '/callProcedure',
      rax,
    }
    const datos = JSON.stringify(requestBody)
    // console.log(datos)
    fetch(ruta, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: datos,
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data)
        resolve(data)
        // eslint-disable-next-line no-console
        console.timeEnd('callProcedure')
      })
      .catch((error) => {
        console.timeEnd('callProcedure')
        console.error('Error en la solicitud:', error)
        reject(error)
        alert('No se pudo establecer conexión con el servidor')
      })
  })
}
