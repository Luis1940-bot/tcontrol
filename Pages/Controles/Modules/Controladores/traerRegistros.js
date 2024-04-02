// const SERVER = '/iControl-Vanilla/icontrol';
const SERVER = '../../../..'

export default function traerRegistros(sql) {
  // eslint-disable-next-line no-console
  console.time('traerRegistros')
  return new Promise((resolve, reject) => {
    const rax = `&new=${new Date()}`
    const ruta = `${SERVER}/Pages/Controles/Routes/traerRegistros.php?q=${sql}${rax}`
    fetch(ruta, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        resolve(data)
        const modal = document.getElementById('modalAlertCarga')
        modal.style.display = 'none'
        modal.remove()
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
