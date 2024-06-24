// eslint-disable-next-line no-unused-vars, import/extensions
import readJSON from '../../controllers/read-JSON.js'
// eslint-disable-next-line import/extensions
import {
  inicioPerformance,
  finPerformance,
} from '../../includes/Conection/conection.js'

const spinner = document.querySelector('.spinner')
const appJSON = {}
let objTranslate = []

import baseUrl from '../../config.js'
import leeVersion from '../../controllers/leeVersion.js'
import { trO } from '../../controllers/trOA.js'
import { arraysLoadTranslate } from '../../controllers/arraysLoadTranslate.js'
import { configPHP } from '../../controllers/configPHP.js'

import { dondeEstaEn } from '../../controllers/dondeEstaEn.js'

const SERVER = baseUrl

function traduccionDeLabel(objTranslate) {
  const div = document.querySelector('.div-verify')
  const labels = div.querySelectorAll('.label-verify')
  labels.forEach((element) => {
    const texto =
      trO(element.textContent.trim(), objTranslate) ||
      element.textContent.trim()
    element.innerText = texto
  })
  const button = document.querySelector('.button-verify')
  const texto =
    trO(button.textContent.trim(), objTranslate) || button.textContent.trim()
  button.innerText = texto
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

document.addEventListener('DOMContentLoaded', async () => {
  inicioPerformance()
  spinner.style.visibility = 'visible'

  const hamburguesa = document.querySelector('#hamburguesa')
  hamburguesa.style.display = 'none'

  const person = document.querySelector('#person')
  person.style.display = 'none'

  const version = await leeVersion('version')
  document.querySelector('.version').innerText = version

  setTimeout(async () => {
    objTranslate = await arraysLoadTranslate()
    leeApp(`log`)
    const nuevaCadena = dondeEstaEn(objTranslate, 'Verificación.')
    const spanUbicacion = document.getElementById('spanUbicacion')
    traduccionDeLabel(objTranslate)
  }, 200)

  finPerformance()
})
