// eslint-disable-next-line import/extensions
import traerRegistros from './Modules/Controladores/traerRegistros.js'
// eslint-disable-next-line import/extensions
import tablaVacia from './Modules/armadoDeTabla.js'
// eslint-disable-next-line import/extensions
import arrayGlobal from '../../controllers/variables.js'
// eslint-disable-next-line no-unused-vars, import/extensions
import readJSON from '../../controllers/read-JSON.js'
// eslint-disable-next-line import/extensions
import menuModal from '../../controllers/menu.js'
// eslint-disable-next-line import/extensions
import personModal from '../../controllers/person.js'
// eslint-disable-next-line import/extensions
import { Alerta } from '../../includes/atoms/alerta.js'
// eslint-disable-next-line import/extensions
import {
  inicioPerformance,
  finPerformance,
} from '../../includes/Conection/conection.js'
// eslint-disable-next-line import/extensions, import/no-useless-path-segments
import traerNR from '../Control/Modules/Controladores/traerNR.js'
// eslint-disable-next-line import/extensions, import/no-useless-path-segments
import cargarNR from '../Control/Modules/ControlNR/loadNR.js'
// eslint-disable-next-line import/extensions, import/no-useless-path-segments
import { encriptar, desencriptar } from '../../controllers/cript.js'
import { arraysLoadTranslate } from '../../controllers/arraysLoadTranslate.js'

import baseUrl from '../../config.js'
import { configPHP } from '../../controllers/configPHP.js'
import { trO } from '../../controllers/trOA.js'
import LogOut from '../../controllers/logout.js'

const SERVER = baseUrl
let objTranslate = []

let controlN = ''
let controlT = ''
let nr = 0
const spinner = document.querySelector('.spinner')
const encabezados = {
  title: [
    'id',
    'concepto',
    'relevamiento',
    'detalle',
    'observación',
    'idControl',
  ],
  width: ['.05', '.15', '.25', '.25', '.25', '0'],
}

function leeVersion(json) {
  readJSON(json)
    .then((datas) => {
      document.querySelector('.version').innerText = datas.version
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error al cargar el archivo:', error)
    })
}

function leeApp(json) {
  readJSON(json)
    .then((data) => {
      document.getElementById('spanUbicacion').innerText = data.planta
      document.querySelector('.div-encabezado').style.marginTop = '0px'
    })
    .catch((error) => {
      console.error('Error al cargar el archivo:', error)
    })
}

function configuracionLoad(user) {
  inicioPerformance()
  const contenido = sessionStorage.getItem('contenido')
  const url = desencriptar(contenido)
  controlN = url.control_N
  controlT = url.control_T
  nr = url.nr
  nr === '0' || nr === ''
    ? (nr = '')
    : sessionStorage.setItem('doc', encriptar(nr))
  document.getElementById('doc').innerText = `Doc: ${nr}`
  document.getElementById('wichC').innerText = controlT
  configPHP(user, SERVER)
  document.querySelector('.header-McCain').style.display = 'none'
  finPerformance()
}

function actualizarProgreso(porcentaje) {
  return new Promise((resolve, reject) => {
    const idSpanCarga = document.getElementById('idSpanCarga')

    // Validar que idSpanCarga exista
    if (!idSpanCarga) {
      console.error("Elemento 'idSpanCarga' no encontrado en el DOM.")
      return reject(new Error("Elemento 'idSpanCarga' no disponible."))
    }

    const startTime = new Date().getTime()
    const duration = 1000 // Duración total en milisegundos (1 segundo)
    const startPercentage = parseFloat(idSpanCarga.innerText) || 0 // Obtener el porcentaje inicial

    function update() {
      const currentTime = new Date().getTime()
      const elapsedTime = currentTime - startTime

      // Calcular el porcentaje interpolado y convertir a cadena para eliminar decimales
      const interpolatedPercentage = Math.min(
        100,
        startPercentage + (elapsedTime / duration) * 10
      )
      const parteEntera = Math.floor(interpolatedPercentage)

      // Actualizar el elemento con el porcentaje interpolado
      idSpanCarga.innerText = `${parteEntera}%`

      if (elapsedTime < duration) {
        // Si no ha pasado el tiempo total, seguir actualizando
        requestAnimationFrame(update)
      } else {
        // Si ha pasado el tiempo total, establecer el porcentaje final y resolver la promesa
        idSpanCarga.innerText = porcentaje
        resolve()
      }
    }

    // Iniciar la actualización
    update()
  })
}

async function cargaDeRegistros(objTrad, plant) {
  try {
    inicioPerformance()
    await actualizarProgreso('10%')

    const countSelect = await traerRegistros(`countSelect,${controlN}`, null)
    sessionStorage.setItem('loadSystem', 2)
    sessionStorage.setItem('cantidadProcesos', Number(countSelect[0][0]) + 4)

    await actualizarProgreso('20%')
    const empresaData = await traerRegistros('empresa', plant)
    arrayGlobal.arrayEmpresa = [...empresaData]

    await actualizarProgreso('30%')
    const selectoresData = await traerRegistros(`Selectores,${controlN}`, null)
    arrayGlobal.arraySelect = [...selectoresData]

    await actualizarProgreso('40%')
    const nuevoControlData = await traerRegistros(
      `NuevoControl,${controlN}`,
      null
    )
    arrayGlobal.arrayControl = [...nuevoControlData]

    tablaVacia(nuevoControlData, encabezados, objTrad)
    finPerformance()
    // Ajustar el porcentaje a 100%
    // console.log(nr)
    if (nr) {
      const controlNr = await traerNR(nr, plant)
      await cargarNR(controlNr, plant) // Asegúrate de que cargarNR sea una función async
    }
  } catch (error) {
    console.warn(error)
    console.log('error por espera de la carga de un modal')
    window.location.reload() // Puedes utilizar una redirección directa en lugar de setTimeout
  }
}

async function mensajeDeCarga(objTrad, plant) {
  const miAlerta = new Alerta()
  const mensaje = trO(arrayGlobal.avisoCargandoControl.span.text, objTrad)
  miAlerta.createControl(arrayGlobal.avisoCargandoControl, mensaje, objTrad)
  const modal = document.getElementById('modalAlertCarga')
  modal.style.display = 'block'
  sessionStorage.setItem('loadSystem', 1)

  // Agrega un retraso antes de iniciar la carga de registros
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((resolve) => setTimeout(() => resolve(), 200))

  await cargaDeRegistros(objTrad, plant)
}

document.addEventListener('DOMContentLoaded', async () => {
  spinner.style.visibility = 'visible'
  console.time('timeControl') // Medir tiempo de ejecución

  // Configuración inicial
  arrayGlobal.habilitadoGuardar = false
  sessionStorage.setItem('firma', encriptar('x'))
  sessionStorage.setItem('config_menu', encriptar('x'))
  sessionStorage.setItem('envia_por_email', false)
  sessionStorage.setItem('doc', null)

  const supervisor = {
    id: 0,
    mail: '',
    mi_cfg: '',
    nombre: '',
    tipo: 0,
  }
  sessionStorage.setItem('firmado', encriptar(supervisor))

  try {
    const persona = desencriptar(sessionStorage.getItem('user'))
    const { plant } = persona

    if (persona) {
      // Actualización de interfaz con datos del usuario
      document.querySelector('.custom-button').innerText =
        persona.lng.toUpperCase()

      // Cargar versión y traducciones
      await leeVersion('version')
      objTranslate = await arraysLoadTranslate()

      // Cargar configuraciones
      await configuracionLoad(persona)

      // Cargar mensaje de progreso y registros
      await mensajeDeCarga(objTranslate, plant)

      // Cargar información de la app
      await leeApp(`App/${plant}/app`)

      spinner.style.visibility = 'hidden' // Ocultar spinner
      console.timeEnd('timeControl') // Finalizar medición del tiempo
    }
  } catch (error) {
    console.warn(error) // Manejo de errores
    spinner.style.visibility = 'hidden'
  }
})

document.addEventListener('DOMContentLoaded', () => {
  const hamburguesa = document.getElementById('hamburguesa')
  hamburguesa.addEventListener('click', () => {
    menuModal(objTranslate)
  })
})

document.addEventListener('DOMContentLoaded', () => {
  const person = document.getElementById('person')
  person.addEventListener('click', () => {
    const persona = desencriptar(sessionStorage.getItem('user'))
    const user = {
      person: persona.person,
      home: 'Inicio',
      salir: 'Cerrar sesión',
    }
    personModal(user, objTranslate)
  })
})

document.addEventListener('DOMContentLoaded', () => {
  const tableControl = document.getElementById('tableControl')

  tableControl.addEventListener('change', () => {
    arrayGlobal.habilitadoGuardar = true
  })

  setTimeout(function () {
    alert('Tu sesión está por expirar. Haz clic en Aceptar para continuar.')
    LogOut()
  }, 43200000 - 300000)
})

const goLanding = document.querySelector('.custom-button')
goLanding.addEventListener('click', () => {
  const url = `${SERVER}/Pages/Landing`
  window.location.href = url
})
