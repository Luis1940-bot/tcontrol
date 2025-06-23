import baseUrl from '../../../../config.js';
import { mostrarMensajeError } from '../../../../controllers/utils.js';

const SERVER = baseUrl;

export default function traerRegistros(q, sqlI) {
  // eslint-disable-next-line no-console

  return new Promise((resolve, reject) => {
    const rax = `&new=${new Date()}`;
    const obj = {
      q,
      ruta: '/traerRegistros',
      rax,
      sqlI,
    };
    const datos = JSON.stringify(obj);
    const ruta = `${SERVER}/Routes/index.php`;
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

        let vecesLoad = sessionStorage.getItem('loadSystem');

        const cantidadProcesos = sessionStorage.getItem('cantidadProcesos');
        vecesLoad = Number(vecesLoad) + 1;

        sessionStorage.setItem('loadSystem', vecesLoad);
        const modal = document.getElementById('modalAlertCarga');

        if (vecesLoad > Number(cantidadProcesos)) {
          if (!modal) {
            // eslint-disable-next-line no-console
            console.warn('El elemento modal no se encontró.');
          } else {
            modal.style.display = 'none';
            modal.remove();
          }

          document.getElementById('wichC').style.display = 'inline';
          sessionStorage.setItem('loadSystem', '1');
        }
        resolve(data);
        // eslint-disable-next-line no-console
        console.timeEnd('traerRegistros');
      })
      .catch((error) => {
        console.timeEnd('traerRegistros');
        console.error('Error en la solicitud:', error);
        reject(error);
        mostrarMensajeError('No se pudo establecer conexión con el servidor');
      });
  });
}
