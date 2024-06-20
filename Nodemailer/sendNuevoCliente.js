import baseUrl from '../config.js'
const SERVER = baseUrl

async function send(nuevoObjeto) {
  try {
    const formData = new FormData()
    formData.append('datos', JSON.stringify(nuevoObjeto))
    // console.log(formData)
    const response = await fetch(
      `${SERVER}/Nodemailer/Routes/sendNuevoCliente.php`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (response.ok) {
      const data = await response.json()
      return data // Devuelve la respuesta del servidor
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error:', error)
    throw error // Re-lanza el error para que pueda ser manejado por el bloque catch en insert
  }
  return null
}

function enviaMail(datos) {
  try {
    const enviado = send(datos)
    return enviado
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
  }
  return null
}

export default enviaMail
