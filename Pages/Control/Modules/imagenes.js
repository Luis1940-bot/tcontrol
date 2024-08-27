// eslint-disable-next-line import/extensions
import objVariables from '../../../controllers/variables.js'
// eslint-disable-next-line import/extensions
import { Alerta } from '../../../includes/atoms/alerta.js'
// eslint-disable-next-line import/extensions, import/no-useless-path-segments
import { desencriptar } from '../../../controllers/cript.js'
import { arraysLoadTranslate } from '../../../controllers/arraysLoadTranslate.js'
import { trO } from '../../../controllers/trOA.js'

let objTranslate = []
const reader = new FileReader()
const MAX_IMAGE_SIZE = 500 * 1024 // 500 KB en bytes
const MAX_WIDTH = 800 // Ajusta según tus necesidades
const MAX_HEIGHT = 800 // Ajusta según tus necesidades
const QUALITY = 0.8 // Calidad inicial de compresión

let row = 0
function buttonImage(id) {
  row = id
  const miAlerta = new Alerta()
  const mensaje =
    trO(objVariables.avisoImagenes.span.text, objTranslate) ||
    objVariables.avisoImagenes.span.text
  miAlerta.createVerde(objVariables.avisoImagenes, mensaje, null)
  const modal = document.getElementById('modalAlertVerde')
  modal.style.display = 'block'
  const imageInput = document.getElementById('imageInput')
  setTimeout(() => {
    imageInput.click()
  }, 500)
}

function generateLi(image) {
  const img = image
  const dataFilename = img.getAttribute('data-filenamewithoutextension')
  const fila = document.querySelector(`tr:nth-child(${row})`)
  const ul = fila.querySelector('ul')
  const li = document.createElement('li')
  li.id = `li_${dataFilename}`
  img.setAttribute('class', 'img-select')
  li.appendChild(img)
  // const canvas = document.createElement('canvas');
  // li.appendChild(canvas);
  ul.appendChild(li)
}

function compressImage(image, fileName, fileExtension) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    // Ajustar la escala de la imagen al tamaño máximo permitido
    let width = image.width
    let height = image.height

    if (width > height) {
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width
        width = MAX_WIDTH
      }
    } else {
      if (height > MAX_HEIGHT) {
        width *= MAX_HEIGHT / height
        height = MAX_HEIGHT
      }
    }

    canvas.width = width
    canvas.height = height
    ctx.drawImage(image, 0, 0, width, height)

    // Comprimir la imagen
    function attemptCompression(quality) {
      canvas.toBlob(
        (blob) => {
          if (blob && blob.size > MAX_IMAGE_SIZE && quality > 0.5) {
            attemptCompression(quality - 0.05)
          } else if (blob) {
            // Convertir el blob comprimido a base64
            const reader = new FileReader()
            reader.onloadend = () => {
              const base64data = reader.result // Aquí tienes la imagen en base64
              resolve(base64data)
            }
            reader.readAsDataURL(blob) // Convertir el blob a base64
          } else {
            reject(new Error('Compression failed.'))
          }
        },
        `image/${fileExtension}`,
        quality
      )
    }

    attemptCompression(QUALITY)
  })
}

function loadImage(selectedFile) {
  return new Promise((resolve, reject) => {
    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target.result // Aquí el formato es base64

      let fileName = selectedFile.name
      const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1)
      fileName = `imagen_${Date.now()}.${fileExtension}`
      img.onload = () => {
        const modalVerde = document.getElementById('modalAlertVerde')
        if (modalVerde) {
          modalVerde.style.display = 'none'
          modalVerde.remove()
        }

        compressImage(img, fileName, fileExtension)
          .then((base64data) => {
            const imgElement = new Image()
            imgElement.src = base64data // Aquí el formato es base64

            imgElement.onload = () => {
              imgElement.setAttribute('data-filename', fileName)
              imgElement.setAttribute('data-fileextension', fileExtension)
              imgElement.setAttribute(
                'data-fileNameWithoutExtension',
                fileName.substring(0, fileName.lastIndexOf('.'))
              )
              imgElement.style.maxWidth = '100%'
              imgElement.setAttribute('className', '')
              imgElement.addEventListener('click', (event) => {
                event.stopPropagation()
                const miAlertaImagen = new Alerta()
                miAlertaImagen.createModalImagenes(
                  objVariables.modalImagen,
                  imgElement
                )
                const modal = document.getElementById('modalAlert')
                modal.style.display = 'block'
              })

              // Puedes usar `base64data` para enviar la imagen al servidor si es necesario
              // console.log('Base64 image data:', base64data)

              resolve(imgElement)
            }
          })
          .catch(reject)
      }
      img.onerror = reject
    }
    reader.readAsDataURL(selectedFile)
  })
}

const imageInput = document.getElementById('imageInput')
imageInput.addEventListener('change', async (event) => {
  event.preventDefault()
  const selectedFiles = event.target.files
  // Verificar si se seleccionaron archivos
  if (selectedFiles.length > 0) {
    const selectedFile = selectedFiles[0]

    if (/\.(jpg|jpeg|bmp|png)$/i.test(selectedFile.name)) {
      try {
        const img = await loadImage(selectedFile)
        generateLi(img)
      } catch (error) {
        // eslint-disable-next-line no-alert
        alert('No se pudo cargar la imagen.')
      }
    } else {
      // eslint-disable-next-line no-alert
      alert('Por favor, selecciona un archivo de imagen válido.')
    }
  } else {
    // No se seleccionaron archivos (se presionó "Cancelar")
    const modal = document.getElementById('modalAlertVerde')
    modal.style.display = 'none'
    modal.remove()
  }
})

document.addEventListener('DOMContentLoaded', async () => {
  const persona = desencriptar(sessionStorage.getItem('user'))
  if (persona) {
    document.querySelector('.custom-button').innerText =
      persona.lng.toUpperCase()
    objTranslate = await arraysLoadTranslate()
  }
})

export default buttonImage
