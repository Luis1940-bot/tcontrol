// eslint-disable-next-line no-unused-vars, import/extensions
import readJSON from '../../controllers/read-JSON.js'
// eslint-disable-next-line import/extensions
import {
  inicioPerformance,
  finPerformance,
} from '../../includes/Conection/conection.js'
import baseUrl from '../../config.js'
import leeVersion from '../../controllers/leeVersion.js'
import { trO } from '../../controllers/trOA.js'
import { arraysLoadTranslate } from '../../controllers/arraysLoadTranslate.js'
import { configPHP } from '../../controllers/configPHP.js'
import { dondeEstaEn } from '../../controllers/dondeEstaEn.js'
// import traerRegistros from './Controllers/traerRegistros.js'
import createA from '../../includes/atoms/createA.js'
import createButton from '../../includes/atoms/createButton.js'
import createDiv from '../../includes/atoms/createDiv.js'
import createLabel from '../../includes/atoms/createLabel.js'
import createInput from '../../includes/atoms/createInput.js'
import createSelect from '../../includes/atoms/createSelect.js'
import createTextArea from '../../includes/atoms/createTextArea.js'
import createSpan from '../../includes/atoms/createSpan.js'
import addCompania from './Controllers/nuevaCompania.js'
import { desencriptar } from '../../controllers/cript.js'
import enviaMailNuevoCliente from '../../Nodemailer/sendNuevoCliente.js'
import arrayGlobal from '../../controllers/variables.js'
import { Alerta } from '../../includes/atoms/alerta.js'
import createImg from '../../includes/atoms/createImg.js'
import personModal from '../../controllers/person.js'

const spinner = document.querySelector('.spinner')
const appJSON = {}
let objTranslate = []

const SERVER = baseUrl
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

function checaRequeridos() {
  const cliente = document.getElementById('cliente')
  cliente.classList.remove('input-plant-requerido')
  cliente.classList.add('input-plant')
  if (cliente.value === '') {
    cliente.classList.remove('input-plant')
    cliente.classList.add('input-plant-requerido')
    return false
  }
  const contacto = document.getElementById('contacto')
  contacto.classList.remove('input-plant-requerido')
  contacto.classList.add('input-plant')
  if (contacto.value === '') {
    contacto.classList.remove('input-plant')
    contacto.classList.add('input-plant-requerido')
    return false
  }
  const email = document.getElementById('email')
  email.classList.remove('input-plant-requerido')
  email.classList.add('input-plant')
  if (email.value === '') {
    email.classList.remove('input-plant')
    email.classList.add('input-plant-requerido')
    return false
  }
  if (!validarEmail(email.value)) {
    email.classList.remove('input-plant')
    email.classList.add('input-plant-requerido')
    return false
  }

  var imagenLogo = document.getElementById('idImgLogo')
  let fileName = []
  let src = []
  let extension = []
  let plant = []
  let carpeta = []

  if (imagenLogo) {
    fileName.push(imagenLogo.getAttribute('fileName'))
    src.push(imagenLogo.src)
    extension.push(imagenLogo.getAttribute('extension'))
    carpeta.push('Logos/')
  }

  const objetoImagen = {
    fileName,
    src,
    extension,
    plant,
    carpeta,
  }

  const objeto = {
    cliente: cliente.value,
    detalle: '',
    contacto: contacto.value,
    email: email.value,
    activo: '',
    objetoImagen,
  }
  return { add: true, objeto }
}

async function subirImagenes(img, plant) {
  if (img.length === 0) {
    return null
  }
  if (img.extension[0].length === 0) {
    return null
  }

  img.plant.push(plant)

  const formData = new FormData()
  formData.append('imgBase64', JSON.stringify(img)) // encodeURIComponent
  // console.log(formData)
  fetch(`${SERVER}/Routes/Imagenes/photo_upload.php`, {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      // eslint-disable-next-line no-console
      // console.log('Respuesta del servidor:', data)
      return data
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error al enviar la imagen:', error)
    })
  return null
}

async function nuevaCompania() {
  try {
    const miAlerta = new Alerta()
    let obj = arrayGlobal.avisoRojo
    let texto = ''

    let envia = checaRequeridos()
    if (envia.add) {
      const detalle = document.getElementById('detalle')
      envia.objeto.detalle = detalle.value
      envia.objeto.activo = 's'

      const response = await addCompania(envia.objeto, '/addCompania')
      if (response.success) {
        const newPlant = { name: envia.objeto.cliente, num: response.id }
        await Promise.all([
          addCompania(newPlant, '/escribirJSON'),
          addCompania(newPlant, '/creaJSONapp'),
        ])

        const objetoEmail = {
          cliente: envia.objeto.cliente,
          contacto: envia.objeto.contacto,
          address: envia.objeto.email,
        }

        obj = arrayGlobal.avisoAmarillo
        obj.close.display = 'none'
        texto = 'Aguarde un instante luego será redirigido.'
        miAlerta.createVerde(obj, texto, objTranslate)

        const modal = document.getElementById('modalAlertVerde')
        modal.style.display = 'block'

        const mailEnviado = await enviaMailNuevoCliente(
          objetoEmail,
          '/sendNuevoCliente'
        )

        if (envia.objeto.objetoImagen.extension[0] !== null) {
          await subirImagenes(envia.objeto.objetoImagen, response.id)
        }

        const id = document.getElementById('id')
        id.value = response.id

        modal.style.display = 'none'

        // Espera a que el modal sea removido del DOM antes de redirigir
        await new Promise((resolve) => {
          requestAnimationFrame(() => {
            modal.remove()
            resolve()
          })
        })

        const url = `${SERVER}/Pages/Login`
        window.location.href = url
      } else {
        texto = trO('Algo salió mal.', objTranslate) || 'Algo salió mal.'
        miAlerta.createVerde(obj, texto, objTranslate)

        const modal = document.getElementById('modalAlertVerde')
        modal.style.display = 'block'
      }
    }
  } catch (error) {
    console.log(error)
  }
}

function cargaImagen(file) {
  if (file) {
    // Leer y mostrar la miniatura
    var reader = new FileReader()
    reader.onload = function (e) {
      var thumbnail = document.getElementById('idImgLogo')
      thumbnail.src = e.target.result
      thumbnail.style.display = 'block'
      thumbnail.setAttribute('fileName', 'logo.png')
      thumbnail.setAttribute('extension', 'png')
    }
    reader.readAsDataURL(file)
  } else {
    document.getElementById('file-name').textContent = 'Sin logo.'
    document.getElementById('idImgLogo').style.display = 'none'
  }
}

function setearElementos() {
  const situacion = document.getElementById('situacion')
  situacion.options[1].selected = true
  situacion.setAttribute('disabled', true)

  const id = document.getElementById('id')
  id.setAttribute('disabled', true)

  const idRegisterButton = document.getElementById('idRegisterButton')
  idRegisterButton.addEventListener('click', (e) => {
    const clase = e.target.className
    if (clase === 'button-plant') {
      nuevaCompania()
    }
    if (clase === 'button-plant-update') {
    }
  })

  const idLogo = document.getElementById('idLogo')
  idLogo.addEventListener('click', (e) => {
    document.getElementById('logo').click()
  })

  const inputLogo = document.getElementById('logo')
  inputLogo.addEventListener('change', function () {
    var fileName = this.files[0] ? this.files[0].name : 'Sin logo.'
    document.getElementById('idSpanLogo').textContent = fileName
    cargaImagen(this.files[0])
  })

  const cliente = document.getElementById('cliente')
  cliente.addEventListener('input', () => {
    if (cliente.value !== '') {
      cliente.classList.remove('input-plant-requerido')
      cliente.classList.add('input-plant')
    }
  })

  const contacto = document.getElementById('contacto')
  contacto.addEventListener('input', () => {
    if (contacto.value !== '') {
      contacto.classList.remove('input-plant-requerido')
      contacto.classList.add('input-plant')
    }
  })

  const email = document.getElementById('email')
  email.addEventListener('input', () => {
    if (email.value !== '') {
      email.classList.remove('input-plant-requerido')
      email.classList.add('input-plant')
    }
  })
}

function creador(element) {
  let elemento = null
  if (element.tag === 'label') {
    element.config.innerHTML =
      trO(element.config.innerHTML, objTranslate) || element.config.innerHTML
    elemento = createLabel(element.config)
  }
  if (element.tag === 'input') {
    elemento = createInput(element.config)
  }
  if (element.tag === 'a') {
    element.config.textContent =
      trO(element.config.textContent, objTranslate) ||
      element.config.textContent
    elemento = createA(element.config, element.config.textContent)
  }
  if (element.tag === 'select') {
    let array = []
    if (element.hasOwnProperty('options')) {
      if (element.options.length > 0) {
        array = [...element.options]
      }
    }
    elemento = createSelect(array, element.config)
  }
  if (element.tag === 'button') {
    element.config.text =
      trO(element.config.text, objTranslate) || element.config.text
    elemento = createButton(element.config)
  }
  if (element.tag === 'div') {
    elemento = createDiv(element.config)
  }
  if (element.tag === 'textarea') {
    elemento = createTextArea(element.config)
  }
  if (element.tag === 'span') {
    element.config.text =
      trO(element.config.text, objTranslate) || element.config.text
    elemento = createSpan(element.config)
  }
  if (element.tag === 'img') {
    elemento = createImg(element.config)
  }
  return elemento
}

function armadoDeHTML(json) {
  try {
    const div = document.querySelector('.div-plant')
    const elementos = json.elements
    elementos.forEach((element) => {
      const elementoCreado = creador(element)
      if (element.children) {
        const elementoChildren = element.children
        elementoChildren.forEach((e) => {
          const hijo = creador(e)
          hijo ? elementoCreado.appendChild(hijo) : null
        })
      }
      elementoCreado ? div.appendChild(elementoCreado) : null
    })
  } catch (error) {
    console.log(error)
  }
}

function leeModelo(ruta) {
  readJSON(ruta)
    .then((data) => {
      armadoDeHTML(data)
      traduccionDeLabel(objTranslate)
      setearElementos()
    })
    .catch((error) => {
      console.error('Error al cargar el archivo:', error)
    })
}

function traduccionDeLabel(objTranslate) {
  const div = document.querySelector('.div-plant')
  const labels = div.querySelectorAll('.label-plant')
  labels.forEach((element) => {
    const texto =
      trO(element.textContent.trim(), objTranslate) ||
      element.textContent.trim()
    element.innerText = texto
  })
}

function leeApp(json) {
  readJSON(json)
    .then((data) => {
      Object.assign(appJSON, data)
      configPHP(data, SERVER)
    })
    .catch((error) => {
      console.error('Error al cargar el archivo:', error)
    })
}

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('keydown', (e) => {
    if (e.target.matches('.input-plant, .textarea-plant')) {
      if (e.key === ',' || e.key === ':') {
        e.preventDefault()
      }
    }
  })
})

document.addEventListener('DOMContentLoaded', async () => {
  inicioPerformance()
  spinner.style.visibility = 'visible'

  const hamburguesa = document.querySelector('#hamburguesa')
  hamburguesa.style.display = 'none'

  const person = document.querySelector('#person')
  person.style.display = 'block'

  const version = await leeVersion('version')
  document.querySelector('.version').innerText = version

  async function inicializar() {
    objTranslate = await arraysLoadTranslate()
    leeApp(`log`)
    leeModelo('Register/registerPlant')

    const nuevaCadena = dondeEstaEn(objTranslate, 'Nueva compañía.')
    const divUbicacion = document.querySelector('.div-ubicacion')
    if (divUbicacion) {
      divUbicacion.style.display = 'none'
    }

    const volver = document.getElementById('volver')
    if (volver) {
      volver.style.display = 'block'
    }

    spinner.style.visibility = 'hidden'
    finPerformance()
  }

  function verificarElementos() {
    const divUbicacion = document.querySelector('.div-ubicacion')
    const volver = document.getElementById('volver')

    if (divUbicacion && volver) {
      inicializar()
    } else {
      requestAnimationFrame(verificarElementos) // Continúa intentando hasta que los elementos estén presentes
    }
  }

  requestAnimationFrame(verificarElementos) // Inicia la verificación de los elementos
})

document.addEventListener('DOMContentLoaded', () => {
  const person = document.getElementById('person')
  person.addEventListener('click', () => {
    person.style.border = '3px solid #212121'
    person.style.background = '#212121'
    person.style.borderRadius = '10px 10px 0px 0px'
    const persona = desencriptar(sessionStorage.getItem('user'))
    const user = {
      person: persona.person,
      home: 'Inicio',
      salir: trO('Cerrar sesión', objTranslate),
    }
    personModal(user, objTranslate)
  })

  setTimeout(function () {
    alert('Tu sesión está por expirar. Haz clic en Aceptar para continuar.')
    LogOut()
  }, 43200000 - 300000)
})

function goBack() {
  try {
    let back = sessionStorage.getItem('volver')
    if (back) {
      back = desencriptar(back)
    }
    const url = `${SERVER}/Pages/${back}`
    window.location.href = url
  } catch (error) {
    console.log(error)
  }
}

const volver = document.getElementById('volver')
volver.addEventListener('click', () => {
  goBack(null)
})
