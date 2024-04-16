import baseUrl from '../../../config.js'
const SERVER = baseUrl

export default function enviarLogin(objeto) {
  let obj = { ...objeto }
  // eslint-disable-next-line no-console
  return new Promise((resolve, reject) => {
    const rax = `&new=${new Date()}`
    obj.rax = rax
    const datos = JSON.stringify(obj)
    // console.log(datos)
    // const ruta = `${SERVER}/Pages/Login/Routes/login.php?${rax}`
    const ruta = `${SERVER}/Routes/index.php`
    // console.log(ruta)
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
