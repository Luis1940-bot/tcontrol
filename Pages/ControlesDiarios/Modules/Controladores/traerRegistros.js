import baseUrl from '../../../../config.js';

const SERVER = baseUrl;

export default function traerRegistros(planta) {
  // eslint-disable-next-line no-console
  console.time('traerRegistros');
  return new Promise((resolve, reject) => {
    const rax = `&new=${new Date()}`;
    // const ruta = `${SERVER}/Pages/ControlsView/Routes/traerRegistros.php?q=${sql}${rax}`
    const ruta = `${SERVER}/Routes/index.php`;
    const obj = {
      planta,
      ruta: '/traerCargadosDiario',
      rax,
    };
    const datos = JSON.stringify(obj);
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
        console.timeEnd('traerRegistros');
      })
      .catch((error) => {
        console.timeEnd('traerRegistros');
        console.error('Error en la solicitud:', error);
        reject(error);
        alert('No se pudo establecer conexión con el servidor');
      });
  });
}
