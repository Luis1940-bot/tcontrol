import baseUrl from '../../../../config.js'
const SERVER = baseUrl

export default function traerFirma(pss) {
  // eslint-disable-next-line no-console
  return new Promise((resolve, reject) => {
    const rax = `&new=${new Date()}`
    let obj = {
      q: pss,
      ruta: '/traerFirma',
      rax,
    }
    const datos = JSON.stringify(obj)
    // const pass = encodeURIComponent(pss)
    // const ruta = `${SERVER}/Pages/Control/Routes/supervisores.php?q=${pass}${rax}`
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
        const objeto = {
          id: data.id || null,
          nombre: data.nombre || null,
          mail: data.mail || null,
          tipo: data.tipo || null,
          mi_cfg: data.mi_cfg || null,
        }
        resolve(objeto)
      })
      .catch((error) => {
        console.error('Error en la solicitud:', error)
        reject(error)
        alert('No se pudo establecer conexión con el servidor')
      })
  })
}
