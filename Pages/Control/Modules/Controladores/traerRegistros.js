// const SERVER = '/iControl-Vanilla/icontrol';
const SERVER = '../../../..'

export default function traerRegistros(q, sql_i) {
  // eslint-disable-next-line no-console
  console.time('traerRegistros')
  return new Promise((resolve, reject) => {
    const rax = `&new=${new Date()}`
    let obj = {
      q,
      ruta: '/traerRegistros',
      rax,
      sql_i,
    }
    const datos = JSON.stringify(obj)
    // console.log(datos)
    // const ruta = `${SERVER}/Pages/Control/Routes/traerRegistros.php?q=${sql}${rax}`
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

        let vecesLoad = sessionStorage.getItem('loadSystem')

        const cantidadProcesos = sessionStorage.getItem('cantidadProcesos')
        vecesLoad = Number(vecesLoad) + 1
        sessionStorage.setItem('loadSystem', vecesLoad)
        const modal = document.getElementById('modalAlertCarga')

        if (vecesLoad > Number(cantidadProcesos)) {
          modal.style.display = 'none'
          modal.remove()
          document.getElementById('wichC').style.display = 'inline'
          sessionStorage.setItem('loadSystem', '1')
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
