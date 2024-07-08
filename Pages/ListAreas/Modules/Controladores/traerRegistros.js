import baseUrl from '../../../../config.js'
// const SERVER = '/iControl-Vanilla/icontrol';
const SERVER = baseUrl

export default function traerRegistros(q, rut, sql_i) {
  // eslint-disable-next-line no-console
  console.time('traerRegistros')
  return new Promise((resolve, reject) => {
    const rax = `&new=${new Date()}`
    let obj = {
      q,
      ruta: rut,
      rax,
      sql_i,
    }
    const datos = JSON.stringify(obj)
    // console.log(datos)

    const ruta = `${SERVER}/Routes/index.php`
    fetch(ruta, {
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
        const modal = document.getElementById('modalAlertCarga')
        if (modal !== null) {
          modal.style.display = 'none'
          modal.remove()
        }

        resolve(data)
        // eslint-disable-next-line no-console
        console.timeEnd('traerRegistros')
      })
      .catch((error) => {
        console.timeEnd('traerRegistros')
        console.error('Error en la solicitud:', error)
        reject(error)
        alert('No se pudo establecer conexión con el servidor')
      })
  })
}
