import baseUrl from '../../../config.js';
import { mostrarMensaje } from '../../../controllers/ui/alertasLuis.js';
// const SERVER = '/iControl-Vanilla/icontrol';
const SERVER = baseUrl;

export default function traerRegistros(q, ruta, sqlI) {
  // eslint-disable-next-line no-console
  console.time('traerRegistros');
  return new Promise((resolve, reject) => {
    const rax = `&new=${new Date()}`;
    const obj = {
      q,
      ruta,
      sqlI,
      rax,
    };
    const datos = JSON.stringify(obj);
    // console.log(datos)
    const url = `${SERVER}/Routes/index.php`;
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
        resolve(data);
        // eslint-disable-next-line no-console
        console.timeEnd('traerRegistros');
      })
      .catch((error) => {
        console.timeEnd('traerRegistros');
        console.error('Error en la solicitud:', error);
        reject(error);
        mostrarMensaje('Error al traer los registros', 'error');
        // alert('No se pudo establecer conexión con el servidor');
      });
  });
}
