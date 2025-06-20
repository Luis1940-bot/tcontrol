import baseUrl from '../../../../config.js';
import { mostrarMensajeError } from '../../../../controllers/utils.js';

const SERVER = baseUrl;

export default function traerNR(nr, sqlI) {
  // eslint-disable-next-line no-console
  console.time('traerNR');
  const sql = `ctrlCargado,${nr}`;
  return new Promise((resolve, reject) => {
    const rax = `&new=${new Date()}`;
    const obj = {
      q: sql,
      ruta: '/traerRegistros',
      rax,
      sqlI,
    };
    const datos = JSON.stringify(obj);
    // console.log(datos)
    // const ruta = `${SERVER}/Pages/Control/Routes/traerRegistros.php?q=${sql}${rax}`
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
        // console.log(data);
        resolve(data);
        // eslint-disable-next-line no-console
        console.timeEnd('traerNR');
      })
      .catch((error) => {
        console.error('Error en la solicitud:', error);
        reject(error);
        mostrarMensajeError('No se pudo establecer conexión con el servidor');
      });
  });
}
