import baseUrl from '../config.js';
import { mostrarMensajeError } from '../controllers/utils.js';

const SERVER = baseUrl;

export default function enviaMailNuevoCliente(objeto, ruta) {
  // eslint-disable-next-line no-console
  // const startTime = performance.now();
  return new Promise((resolve, reject) => {
    const rax = `&new=${new Date()}`;
    const obj = {
      ruta,
      rax,
      objeto,
    };
    const datos = JSON.stringify(obj);
    // console.log(datos)
    const url = `${SERVER}/Routes/index.php`;
    // Agregar tiempo de espera a la solicitud fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 240000); // 60 segundos

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        // 'Access-Control-Allow-Origin': '*',
      },
      body: datos,
      signal: controller.signal,
    })
      .then((response) => {
        // console.log(response)
        clearTimeout(timeoutId);
        if (!response.ok) {
          throw new Error(`Network response was not ok ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        // console.log(data)
        resolve(data);
        // const endTime = performance.now(); // Alternativa a console.timeEnd()
        // console.log(
        //   `Tiempo de ejecución: ${(endTime - startTime).toFixed(2)}ms`,
        // );
        return data;
      })
      .catch((error) => {
        clearTimeout(timeoutId);

        console.error('Error en la solicitud:', error);
        reject(error);
        mostrarMensajeError(
          'Tu sesión está por expirar. Haz clic en Aceptar para continuar.',
        );
      });
  });
}
