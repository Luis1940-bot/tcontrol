import baseUrl from '../../../../config.js'
const SERVER = baseUrl

function guardaNotas(obj, plant) {
  // console.log(obj)
  const urlGuardar = `${SERVER}/Pages/Control/Routes/backup.php`
  // const objetoFormateado = JSON.stringify(obj, null, 2)
  // const objetoFormateadoConSaltos = objetoFormateado.replace(/\],/g, '],\n')
  const dataToSend = {
    plant: plant,
    notes: obj,
  }
  // console.log(JSON.stringify(dataToSend))
  // Configuración de la solicitud Fetch
  const opcionesSolicitud = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataToSend),
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
