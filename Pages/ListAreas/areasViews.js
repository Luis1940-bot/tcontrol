// eslint-disable-next-line import/extensions
import traerRegistros from './Modules/Controladores/traerRegistros.js'
// eslint-disable-next-line import/extensions
import tablaVacia from './Modules/armadoDeTabla.js'
// eslint-disable-next-line import/extensions
import arrayGlobal from '../../controllers/variables.js'
// eslint-disable-next-line import/extensions
import { Alerta } from '../../includes/atoms/alerta.js'
import { trO } from '../../controllers/trOA.js'

const encabezados = {
  title: ['Áreas'],
  width: ['1'],
}

async function cargaDeRegistros(objTranslate, plant) {
  try {
    const reportes = await traerRegistros(
      'traerLTYareas',
      '/traerLTYareas',
      plant
    )

    arrayGlobal.arrayReportes = [...reportes]
    // Finaliza la carga y realiza cualquier otra acción necesaria
    tablaVacia(reportes, encabezados, objTranslate)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error)
    // eslint-disable-next-line no-console
    console.log('error por espera de la carga de un modal')
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }
}

async function mensajeDeCarga(objTranslate, plant) {
  const miAlerta = new Alerta()
  const aviso =
    'Aguarde unos instantes, se están listando las áreas activas. Gracias!'

  const mensaje = trO(aviso, objTranslate) || aviso
  miAlerta.createControl(
    arrayGlobal.avisoListandoControles,
    mensaje,
    objTranslate
  )
  const modal = document.getElementById('modalAlertCarga')
  modal.style.display = 'block'

  // Agrega un retraso antes de iniciar la carga de registros
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((resolve) => setTimeout(() => resolve(), 200))

  await cargaDeRegistros(objTranslate, plant)
}

function cargaTabla(objTranslate, plant) {
  try {
    mensajeDeCarga(objTranslate, plant)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error)
  }
}

export default cargaTabla
