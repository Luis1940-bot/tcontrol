import baseUrl from '../../../config.js';

const SERVER = baseUrl;

export default function enviarLogin(objeto) {
  const obj = { ...objeto };
  return new Promise((resolve, reject) => {
    const rax = `&new=${new Date()}`;
    obj.rax = rax;
    const datos = JSON.stringify(obj);
    // console.log(datos)

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
        // Registrar el tipo de contenido
        console.log('Content-Type:', res.headers.get('Content-Type'));
        return res.text(); // Cambiar a res.text() temporalmente para registro
      })
      .then((text) => {
        // console.log('Respuesta del servidor:', text)
        try {
          const data = JSON.parse(text);
          // console.log(data)

          resolve(data);
        } catch (error) {
          reject(`Error al parsear JSON: ${error.message}`);
        }
      })
      .catch((error) => {
        console.error('Error en la solicitud:', error);
        reject(error);
        alert('No se pudo establecer conexión con el servidor');
      });
  });
}
