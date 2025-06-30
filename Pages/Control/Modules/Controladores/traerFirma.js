import baseUrl from '../../../../config.js';
import { mostrarMensajeError } from '../../../../controllers/utils.js';

const SERVER = baseUrl;

export default function traerFirma(pss, sqlI) {
  // eslint-disable-next-line no-console
  return new Promise((resolve, reject) => {
    const rax = `&new=${new Date()}`;
    const obj = {
      q: pss,
      ruta: '/traerFirma',
      rax,
      sqlI,
    };
    const datos = JSON.stringify(obj);
    // console.log(datos);
    const ruta = `${SERVER}/Routes/index.php`;
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
            `Error en la solicitud: ${res.status} ${res.statusText}`,
          );
        }
        return res.json();
      })
      .then((data) => {
        const objeto = {
          id: data.id || null,
          nombre: data.nombre || null,
          mail: data.mail || null,
          tipo: data.tipo || null,
          mi_cfg: data.mi_cfg || null,
        };
        resolve(objeto);
      })
      .catch((error) => {
        console.error('Error en la solicitud:', error);
        reject(error);
        mostrarMensajeError('No se pudo establecer conexión con el servidor');
      });
  });
}
