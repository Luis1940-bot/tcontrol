// eslint-disable-next-line import/extensions
import objVariables from '../../../controllers/variables.js'
// eslint-disable-next-line import/no-named-as-default
import translate, {
  // eslint-disable-next-line no-unused-vars
  arrayTranslateOperativo,
  // eslint-disable-next-line no-unused-vars
  arrayEspanolOperativo,
  // eslint-disable-next-line no-unused-vars
  arrayTranslateArchivo,
  // eslint-disable-next-line no-unused-vars
  arrayEspanolArchivo,
  // eslint-disable-next-line import/extensions
} from '../../../controllers/translate.js'
// eslint-disable-next-line import/extensions
import { Alerta } from '../../../includes/atoms/alerta.js'
// eslint-disable-next-line import/extensions, import/no-useless-path-segments
import { desencriptar } from '../../../controllers/cript.js'

let data = {}
let translateOperativo = []
let espanolOperativo = []
// let translateArchivo = [];
// let espanolArchivo = [];
// const objTranslate = {
//   operativoES: [...translateOperativo],
//   operativoTR: [...espanolOperativo],
// };
const reader = new FileReader()
function trO(palabra) {
  if (palabra === undefined) {
    return ''
  }
  const palabraNormalizada = palabra.replace(/\s/g, '').toLowerCase()
  const index = espanolOperativo.findIndex(
    (item) => item.replace(/\s/g, '').toLowerCase() === palabraNormalizada
  )
  if (index !== -1) {
    return translateOperativo[index]
  }
  return palabra
}

let row = 0
function buttonImage(id) {
  row = id
  const miAlerta = new Alerta()
  const mensaje =
    trO(objVariables.avisoImagenes.span.text) ||
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

function loadImage(selectedFile) {
  return new Promise((resolve, reject) => {
    // const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target.result
      let fileName = selectedFile.name
      const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1)
      fileName = `imagen_${Date.now()}.${fileExtension}`
      const fileNameWithoutExtension = fileName.substring(
        0,
        fileName.lastIndexOf('.')
      )
      img.setAttribute('data-filename', fileName)
      img.setAttribute('data-fileextension', fileExtension)
      img.setAttribute(
        'data-fileNameWithoutExtension',
        fileNameWithoutExtension
      )
      img.style.maxWidth = '100%'
      img.setAttribute('className', '')
      img.addEventListener('click', (event) => {
        event.stopPropagation()
        const miAlertaImagen = new Alerta()
        miAlertaImagen.createModalImagenes(objVariables.modalImagen, img)
        const modal = document.getElementById('modalAlert')
        modal.style.display = 'block'
      })
      img.onload = () => resolve(img)
      img.onerror = reject
      const modal = document.getElementById('modalAlertVerde')
      modal.style.display = 'none'
      modal.remove()
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
    data = await translate(persona.lng)
    translateOperativo = data.arrayTranslateOperativo
    espanolOperativo = data.arrayEspanolOperativo
    // objTranslate.operativoES = [...translateOperativo];
    // objTranslate.operativoTR = [...espanolOperativo];
  }
})

export default buttonImage
