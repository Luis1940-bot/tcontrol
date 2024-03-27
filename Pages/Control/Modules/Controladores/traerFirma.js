// const SERVER = '/iControl-Vanilla/icontrol';
const SERVER = '../../../..'

export default function traerFirma(pss) {
  // eslint-disable-next-line no-console
  return new Promise((resolve, reject) => {
    const rax = `&new=${new Date()}`
    const pass = encodeURIComponent(pss)
    const ruta = `${SERVER}/Pages/Control/Routes/supervisores.php?q=${pass}${rax}`
    fetch(ruta, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
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
        reject(error)
      })
  })
}
