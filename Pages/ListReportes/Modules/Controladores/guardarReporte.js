import baseUrl from '../../../../config.js';

const SERVER = baseUrl;

function guardarReporte(objeto, ruta) {
  // eslint-disable-next-line no-console
  console.time('insert_time');

  const plantx = objeto.idLTYcliente;
  const nuevoObjeto = encodeURIComponent(JSON.stringify(objeto));
  const rax = `&new=${new Date()}`;

  const obj = {
    q: nuevoObjeto,
    ruta,
    rax,
    planta: plantx,
  };
  // console.log(plantx)
  const datos = JSON.stringify(obj);
  const url = `${SERVER}/Routes/index.php`;

  return new Promise((resolve, reject) => {
    // Realiza el fetch y maneja la lógica de la respuesta
    fetch(url, {
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

function guardarNuevoReporte(objetoReporte, ruta) {
  // console.log(objetoControl, arrayControl, nuxpedido)
  return guardarReporte(objetoReporte, ruta);
}

export default guardarNuevoReporte;
