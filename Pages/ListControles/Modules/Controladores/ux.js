import baseUrl from '../../../../config.js';

const SERVER = baseUrl;

function turnControl(target, sqlI) {
  // eslint-disable-next-line no-console
  console.time('update_time');
  // console.log(target)
  const rax = `&new=${new Date()}`;
  const obj = {
    q: target,
    ruta: '/turnOnOff',
    rax,
    sqlI,
  };

  const datos = JSON.stringify(obj);
  // console.log(datos);
  const ruta = `${SERVER}/Routes/index.php`;

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
          // console.log(data)
          // eslint-disable-next-line no-console
          // eslint-disable-next-line no-console
          console.timeEnd('update_time');
          resolve(data); // Resuelve la promesa con el valor correcto
        } else {
          throw new Error('Error en el formato JSON');
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.warn(error.message);
        // eslint-disable-next-line no-console
        console.timeEnd('update_time');
        reject(error); // Rechaza la promesa en caso de error
      });
  });
}

export default turnControl;
