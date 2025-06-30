import baseUrl from '../../../config.js';
// const SERVER = '/iControl-Vanilla/icontrol';
const SERVER = baseUrl;

function mostrarMensajeError(mensaje) {
  const errorDiv = document.createElement('div');
  errorDiv.textContent = mensaje;
  errorDiv.style.position = 'fixed';
  errorDiv.style.top = '20px';
  errorDiv.style.left = '50%';
  errorDiv.style.transform = 'translateX(-50%)';
  errorDiv.style.backgroundColor = 'red';
  errorDiv.style.color = 'white';
  errorDiv.style.padding = '10px';
  errorDiv.style.borderRadius = '5px';
  errorDiv.style.zIndex = '9999';

  document.body.appendChild(errorDiv);

  setTimeout(() => {
    errorDiv.remove();
  }, 4000);
}

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
