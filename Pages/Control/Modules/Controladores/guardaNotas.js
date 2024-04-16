import baseUrl from '../../../../config.js'
const SERVER = baseUrl

function guardaNotas(obj) {
  // console.log(obj)
  const urlGuardar = `${SERVER}/Pages/Control/Routes/backup.php`
  const objetoFormateado = JSON.stringify(obj, null, 2)
  const objetoFormateadoConSaltos = objetoFormateado.replace(/\],/g, '],\n')

  // Configuración de la solicitud Fetch
  const opcionesSolicitud = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: objetoFormateadoConSaltos,
  }

  // Realizar la solicitud Fetch al archivo PHP
  fetch(urlGuardar, opcionesSolicitud)
    .then((response) => response.json())
    .then((data) => {
      // eslint-disable-next-line no-console
      console.log(data.message) // Mensaje de confirmación desde el servidor
    })
    // eslint-disable-next-line no-console
    .catch((error) =>
      console.error('Error al intentar guardar el archivo:', error)
    )
}

export default guardaNotas
