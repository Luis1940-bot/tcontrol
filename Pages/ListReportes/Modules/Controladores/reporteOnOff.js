import baseUrl from '../../../../config.js';
// const SERVER = '/iControl-Vanilla/icontrol';
const SERVER = baseUrl;

export default function reporteOnOff(q, activo) {
  // eslint-disable-next-line no-console
  console.time('reporteOnOff');
  return new Promise((resolve, reject) => {
    const rax = `&new=${new Date()}`;
    const obj = {
      q,
      ruta: '/reporteOnOff',
      rax,
      activo,
    };
    const datos = JSON.stringify(obj);
    // console.log(datos)

    const ruta = `${SERVER}/Routes/index.php`;
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
        resolve(data);
        // eslint-disable-next-line no-console
        console.timeEnd('reporteOnOff');
      })
      .catch((error) => {
        console.timeEnd('reporteOnOff');
        console.error('Error en la solicitud:', error);
        reject(error);
        alert('No se pudo establecer conexión con el servidor');
      });
  });
}
