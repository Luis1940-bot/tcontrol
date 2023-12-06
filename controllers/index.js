// const SERVER = '/iControl-Vanilla/icontrol';
const SERVER = '';

function session() {
  fetch(`${SERVER}/Pages/Session/session.php`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('No hay sesión activa');
      }
      return response.text(); // Cambiado a text() para obtener la respuesta como texto
    })
    .then((data) => {
      // Imprimir la respuesta del servidor en la consola
      // console.log('Server response:', data);

      // Intentar analizar la respuesta como JSON
      try {
        const parsedData = JSON.parse(data);
        // const {
        //   email, plant, lng, person, id, tipo,
        // } = parsedData;
        localStorage.setItem('user', JSON.stringify(parsedData));
        // console.log(parsedData);
      } catch (error) {
        // Manejar errores al analizar JSON
        // eslint-disable-next-line no-console
        console.error('Error parsing JSON:', error.message);
      }
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error.message);
    });
}

function limpiezaDeCache() {
  if (!localStorage.getItem('firstLoad')) {
  // Limpiar la caché
    caches.keys().then((names) => {
      names.forEach((name) => {
        caches.delete(name);
      });
    });

    // Marcar que la aplicación ya se ha cargado
    localStorage.setItem('firstLoad', true);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const spinner = document.querySelector('.spinner');
  spinner.style.visibility = 'visible';
  limpiezaDeCache();
  session();
  setTimeout(() => {
    window.location.href = '/Pages/Landing/';
  }, 1000);
});
