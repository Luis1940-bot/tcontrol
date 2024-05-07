import baseUrl from '../../../../config.js'
const SERVER = baseUrl

export default function variableOnOff(q, activo, ruta) {
  // eslint-disable-next-line no-console
  console.time('variableOnOff')
  return new Promise((resolve, reject) => {
    const rax = `&new=${new Date()}`
    let obj = {
      q,
      ruta,
      rax,
      activo,
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
        // console.log(data)
        resolve(data)
        // eslint-disable-next-line no-console
        console.timeEnd('variableOnOff')
        return data
      })
      .catch((error) => {
        console.timeEnd('variableOnOff')
        console.error('Error en la solicitud:', error)
        reject(error)
        alert('No se pudo establecer conexión con el servidor')
      })
  })
}
