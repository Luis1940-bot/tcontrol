// const SERVER = '/iControl-Vanilla/icontrol';
const SERVER = '../../../..'

export default function traerRegistros(sql) {
  // eslint-disable-next-line no-console
  console.time('traerRegistros')
  return new Promise((resolve, reject) => {
    const rax = `&new=${new Date()}`
    const ruta = `${SERVER}/Pages/Control/Routes/traerRegistros.php?q=${sql}${rax}`
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
        let vecesLoad = localStorage.getItem('loadSystem')
        const cantidadProcesos = localStorage.getItem('cantidadProcesos')
        vecesLoad = Number(vecesLoad) + 1
        localStorage.setItem('loadSystem', vecesLoad)
        const modal = document.getElementById('modalAlertCarga')
        if (vecesLoad > Number(cantidadProcesos)) {
          modal.style.display = 'none'
          modal.remove()
          document.getElementById('wichC').style.display = 'inline'
        }
        // eslint-disable-next-line no-console
        console.timeEnd('traerRegistros')
      })
      .catch((error) => {
        reject(error)
      })
  })
}
