import baseUrl from '../config.js'
const SERVER = baseUrl

async function send(nuevoObjeto, encabezados) {
  const formData = new FormData()
  formData.append('datos', JSON.stringify(nuevoObjeto))
  formData.append('encabezados', JSON.stringify(encabezados))
  const url = `${SERVER}/Nodemailer/Routes/sendEmail.php`

  console.time('sendEmail')

  // Controlador de aborto para manejar el timeout
  const controller = new AbortController()
  const signal = controller.signal

  // Tiempo máximo permitido para la solicitud (600 segundos)
  const timeoutId = setTimeout(() => controller.abort(), 600000)

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      signal: signal,
    })

    clearTimeout(timeoutId) // Limpiar el timeout si se recibe la respuesta antes de que expire

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText)
    }

    // Forzamos a tratar la respuesta como JSON
    const contentType = response.headers.get('content-type')

    // Intentamos forzar siempre la respuesta como JSON
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json()
      console.timeEnd('sendEmail')
      return {
        success: true,
        message: 'Correo enviado correctamente',
        data,
      }
    } else {
      // Si por alguna razón no es JSON pero lo trataremos como JSON
      try {
        const data = await response.json() // Forzar a tratar como JSON
        console.timeEnd('sendEmail')
        return {
          success: true,
          message: 'Correo enviado correctamente',
          data,
        }
      } catch (jsonError) {
        // Manejo de errores si no es JSON
        const text = await response.text() // Si no es JSON, manejar como texto
        console.timeEnd('sendEmail')
        console.error('Respuesta no es JSON:', text)
        return {
          success: false,
          message: 'El servidor no devolvió una respuesta JSON: ' + text,
        }
      }
    }
  } catch (error) {
    clearTimeout(timeoutId)
    console.timeEnd('sendEmail')

    if (error.name === 'AbortError') {
      console.error('La solicitud fue abortada debido a un timeout.')
      return {
        success: false,
        message: 'La solicitud tardó demasiado y fue abortada.',
      }
    } else {
      console.error('Error en la solicitud:', error)
      return {
        success: false,
        message: 'Error en la solicitud: ' + error.message,
      }
    }
  }
}

// async function send(nuevoObjeto, encabezados) {
//   const formData = new FormData()
//   formData.append('datos', JSON.stringify(nuevoObjeto))
//   formData.append('encabezados', JSON.stringify(encabezados))
//   const url = `${SERVER}/Nodemailer/Routes/sendEmail.php`

//   console.time('sendEmail')

//   const controller = new AbortController()
//   const signal = controller.signal

//   const timeoutId = setTimeout(() => controller.abort(), 600000) // 10 minutos

//   try {
//     const response = await fetch(url, {
//       method: 'POST',
//       body: formData,
//       signal: signal,
//     })

//     clearTimeout(timeoutId)

//     if (!response.ok) {
//       throw new Error('Network response was not ok ' + response.statusText)
//     }

//     // Verificar si el tipo de contenido es JSON antes de intentar parsear
//     const contentType = response.headers.get('content-type')

//     if (contentType && contentType.includes('application/json')) {
//       const data = await response.json()
//       console.timeEnd('sendEmail')
//       return {
//         success: true,
//         message: 'Correo enviado correctamente',
//         data,
//       }
//     } else {
//       // Si la respuesta no es JSON, manejarla como texto
//       const text = await response.text()
//       console.timeEnd('sendEmail')
//       console.error('Respuesta no es JSON:', text)
//       return {
//         success: false,
//         message: 'El servidor no devolvió una respuesta JSON: ' + text,
//       }
//     }
//   } catch (error) {
//     clearTimeout(timeoutId)
//     console.timeEnd('sendEmail')

//     if (error.name === 'AbortError') {
//       console.error('La solicitud fue abortada debido a un timeout.')
//       return {
//         success: false,
//         message: 'La solicitud tardó demasiado y fue abortada.',
//       }
//     } else {
//       console.error('Error en la solicitud:', error)
//       return {
//         success: false,
//         message: 'Error en la solicitud: ' + error.message,
//       }
//     }
//   }
// }

function enviaMail(datos, encabezados, plant) {
  try {
    const filtrados = datos.displayRow
      .map((valor, indice) => {
        const tipoDeDato = datos.tipodedato[indice]
        const campoValor = datos.valor[indice]
        let valorHtmlValor = campoValor
        const valorHtmlName = datos.name[indice]
        let valorHtmlDetalle = datos.detalle[indice]
        let valorHtmlObservacion = datos.observacion[indice]
        const image = datos.imagenes[indice]
        let colSpanName = '1'
        let colSpanValor = '1'
        let colSpanDetalle = '1'
        let colSpanObservacion = '1'
        let displayName = ''
        let displayValor = ''
        let displayDetalle = ''
        let displayObservacion = ''
        let dataURL

        if (tipoDeDato === 'b') {
          campoValor === 1
            ? (valorHtmlValor = '<input type="checkbox"  checked disabled>')
            : (valorHtmlValor = '<input type="checkbox" disabled>')
        }
        if (tipoDeDato === 'r') {
          campoValor === 1
            ? (valorHtmlValor = '<input type="radio"  checked disabled>')
            : (valorHtmlValor = '<input type="radio" disabled>')
        }
        if (
          tipoDeDato === 'x' ||
          tipoDeDato === 'btnqwery' ||
          tipoDeDato === 'img'
        ) {
          valorHtmlValor = ''
        }
        if (tipoDeDato === 'img' && image !== '') {
          valorHtmlValor = 'img'
        }
        if (tipoDeDato === 'photo') {
          valorHtmlValor = 'photo'
          displayDetalle = campoValor
        }
        if (tipoDeDato === 's' || tipoDeDato === 'sd') {
          if (
            valorHtmlValor === '' ||
            valorHtmlValor === 's' ||
            valorHtmlValor === 'sd'
          ) {
            valorHtmlValor = ''
            valorHtmlDetalle = ''
            valorHtmlObservacion = ''
          }
        }
        if (
          tipoDeDato === 'l' ||
          tipoDeDato === 'subt' ||
          tipoDeDato === 'title'
        ) {
          valorHtmlValor = ''
          valorHtmlDetalle = ''
          valorHtmlObservacion = ''
          colSpanName = '4'
          colSpanValor = '1'
          colSpanDetalle = '1'
          colSpanObservacion = '1'
          displayValor = 'none'
          displayDetalle = 'none'
          displayObservacion = 'none'
          displayName = ''
        }

        if (valor === 'table-row') {
          return {
            name: valorHtmlName,
            valor: valorHtmlValor,
            detalle: valorHtmlDetalle,
            observacion: valorHtmlObservacion,
            colSpanName,
            colSpanValor,
            colSpanDetalle,
            colSpanObservacion,
            displayName,
            displayValor,
            displayDetalle,
            displayObservacion,
            image,
            dataURL,
          }
        }
        return null
      })
      .filter((elemento) => elemento !== null)
    // console.log(filtrados)
    // console.log(encabezados);
    const enviado = send(filtrados, encabezados, plant)
    return enviado
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
  }
  return null
}

export default enviaMail
