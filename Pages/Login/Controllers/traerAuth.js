import baseUrl from '../../../config.js'
// const SERVER = '/iControl-Vanilla/icontrol';
const SERVER = baseUrl

export default function traerAuth(planta, email, ruta) {
  // eslint-disable-next-line no-console
  console.time('traerAuth')
  return new Promise((resolve, reject) => {
    const rax = `&new=${new Date()}`
    let obj = {
      planta,
      email,
      ruta,
      rax,
    }
    const datos = JSON.stringify(obj)
    // console.log(datos)
    const url = `${SERVER}/Routes/index.php`
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        // 'Access-Control-Allow-Origin': '*',
      },
      body: datos,
    })
      .then((res) => res.json())
      .then((data) => {
        resolve(data)
        // eslint-disable-next-line no-console
        console.timeEnd('traerAuth')
      })
      .catch((error) => {
        console.timeEnd('traerAuth')
        console.error('Error en la solicitud:', error)
        reject(error)
        alert('No se pudo establecer conexión con el servidor')
      })
  })
}
