import baseUrl from '../../../../config.js';

const SERVER = baseUrl;

export default function addSelector(q, ruta) {
  // eslint-disable-next-line no-console
  console.time('addSelector');
  return new Promise((resolve, reject) => {
    const rax = `&new=${new Date()}`;
    const obj = {
      ruta,
      rax,
      q,
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
        console.timeEnd('addSelector');
        return data;
      })
      .catch((error) => {
        console.timeEnd('addSelector');
        console.error('Error en la solicitud:', error);
        reject(error);
        alert('No se pudo establecer conexión con el servidor');
      });
  });
}
