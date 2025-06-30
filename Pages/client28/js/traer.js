import baseUrl from '../../../config.js';

const SERVER = baseUrl;

export default function traerPivot(objeto) {
  // eslint-disable-next-line no-console
  console.time('pivot_data');
  return new Promise((resolve, reject) => {
    const rax = `&new=${new Date()}`;
    const ruta = `${SERVER}/Routes/index.php`;
    const payload = {
      ...objeto,
      rax,
      ruta: '/pivot_data',
    };
    const datos = JSON.stringify(payload);
    // console.log(datos);
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
        // console.log(data);
        resolve(data);

        // eslint-disable-next-line no-console
        console.timeEnd('pivot_data');
      })
      .catch((error) => {
        console.timeEnd('pivot_data');
        console.error('Error en la solicitud:', error);
        reject(error);
        alert('No se pudo establecer conexión con el servidor');
      });
  });
}
