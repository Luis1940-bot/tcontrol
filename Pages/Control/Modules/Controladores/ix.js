import baseUrl from '../../../../config.js';
import { desencriptar } from '../../../../controllers/cript.js';

const SERVER = baseUrl;

// eslint-disable-next-line quotes
function limpiarObjeto(objeto) {
  const { displayRow, requerido, ...restoDelObjeto } = objeto;
  const nuevoObjeto = {
    ...restoDelObjeto,
  };

  return nuevoObjeto;
}

function insertarRegistro(objeto, planta) {
  // eslint-disable-next-line no-console
  console.time('insert_time');
  // console.log(objeto);
  const objLimpio = limpiarObjeto(objeto);
  const nuevoObjeto = encodeURIComponent(JSON.stringify(objLimpio));
  console.log(objLimpio);
  return;
  let plant = planta;
  if (!plant || plant === 0 || plant === '') {
    plant = desencriptar(sessionStorage.getItem('user')).plant;
  }
  const rax = `&new=${new Date()}`;
  const obj = {
    q: nuevoObjeto,
    ruta: '/ix2024',
    rax,
    sql25: String(plant),
  };
  const datos = JSON.stringify(obj);
  const ruta = `${SERVER}/Routes/index.php`;
  // console.log(datos);

  return new Promise((resolve, reject) => {
    // Realiza el fetch y maneja la lógica de la respuesta
    fetch(ruta, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: datos,
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        throw new Error(`Error en la solicitud: ${response.status}`);
      })
      .then((data) => {
        if (typeof data === 'object') {
          // eslint-disable-next-line no-console
          // console.log(data)
          // eslint-disable-next-line no-console
          console.timeEnd('insert_time');
          resolve(data); // Resuelve la promesa con el valor correcto
        } else {
          throw new Error('Error en el formato JSON');
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.warn(error.message);
        // eslint-disable-next-line no-console
        console.timeEnd('insert_time');
        reject(error); // Rechaza la promesa en caso de error
      });
  });
}

export default insertarRegistro;
