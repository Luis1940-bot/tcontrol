// eslint-disable-next-line import/extensions
import traerRegistros from './Controladores/traerRegistros.js'
// eslint-disable-next-line import/extensions, import/no-useless-path-segments
import { desencriptar } from '../../../controllers/cript.js'
import { trO } from '../../../controllers/trOA.js'
import { arraysLoadTranslate } from '../../../controllers/arraysLoadTranslate.js'
import traerFirma from './Controladores/traerFirma.js'
import Alerta from '../../../includes/atoms/alerta.js'
// eslint-disable-next-line import/extensions
import arrayGlobal from '../../../controllers/variables.js'

let objTranslate = []

async function cargaModal(respuesta, input, haceClick) {
  try {
    const etiquetaInput = input
    const table = document.querySelector('.modal-content table')
    const thead = table.querySelector('.modal-content table thead')
    const tbody = table.querySelector('.modal-content table tbody')
    while (thead.firstChild) {
      thead.removeChild(thead.firstChild)
    }
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild)
    }
    const headers = [respuesta[0][2]]
    const theadRow = document.createElement('tr')
    headers.forEach((headerText) => {
      const th = document.createElement('th')
      th.textContent = headerText
      theadRow.appendChild(th)
    })
    thead.appendChild(theadRow)

    respuesta.forEach((item) => {
      const row = document.createElement('tr')
      const value = item[1] // Obtén el valor de la columna 1
      const cell = document.createElement('td')
      cell.textContent = value
      row.appendChild(cell)
      tbody.appendChild(row)
    })

    tbody.addEventListener('click', (e) => {
      const cell = e.target.closest('td') // Encuentra la celda más cercana al elemento clicado
      if (cell && haceClick) {
        const cellText = cell.textContent
        etiquetaInput.value = cellText
        const modal = document.getElementById('myModal')
        modal.style.display = 'none'
      }
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
  }
}

async function consultaCN(event, consulta) {
  const button = event.target
  const cell = button.closest('td')
  const div = cell.querySelector('div')
  const input = div.querySelector('input')
  const wichCn = document.getElementById('wichCn')
  wichCn.textContent = event.target.name
  wichCn.style.display = 'block'
  const modal = document.getElementById('myModal')
  modal.style.display = 'inline-block'
  const resultado = await traerRegistros(
    `traer_LTYsql`,
    `${encodeURIComponent(consulta)}`
  )
  resultado.length > 0 ? cargaModal(resultado, input, true) : null
}

async function consultaQuery(event, consulta) {
  const wichCn = document.getElementById('wichCn')
  wichCn.textContent = event.target.name
  wichCn.style.display = 'block'
  const modal = document.getElementById('myModal')
  modal.style.display = 'inline-block'
  const resultado = await traerRegistros(
    `traer_LTYsql`,
    `${encodeURIComponent(consulta)}`
  )
  resultado.length > 0 ? cargaModal(resultado, '', false) : null
}

async function traerHijo(sql, array) {
  try {
    if (array[0].length === 0) {
      return null
    }
    const objTraerHijo = {
      filaInserta: sql.substring(0, 4).replace(/@/g, ''),
      tipoDeElemento: sql.substring(5, 8).replace(/@/g, ''),
      columnas: sql.substring(9, 12).replace(/@/g, ''),
      variables: sql.substring(13, 16).replace(/@/g, ''),
      posicionReferencia: sql.substring(17, 20).replace(/@/g, ''),
      res: [],
    }
    const resultado = sql.substring(21, sql.length)
    const textoDespuesDelDolar = resultado.replace(/\?/g, () => array.shift())

    objTraerHijo.res = await traerRegistros(
      `traer_LTYsql`,
      `${encodeURIComponent(textoDespuesDelDolar)}`
    )
    return objTraerHijo
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error en traerHijo:', error)
    throw error // Re-lanzar el error para que pueda ser manejado en el evento
  }
}

async function validation(val, plant, objTrad, div, index) {
  try {
    if (!val) {
      return
    }
    const supervisor = await traerFirma(val, plant)
    if (supervisor.id !== null) {
      while (div.firstChild) {
        div.removeChild(div.firstChild)
      }
      const tbody = document.querySelector('#tableControl tbody')
      const row = tbody.rows[index]
      if (row && row.cells.length >= 3) {
        row.cells[3].innerHTML = ''
        const previousCell = row.cells[2]
        previousCell.colSpan = (previousCell.colSpan || 1) + 1
        row.removeChild(row.cells[3])
      }
      const inputText = document.createElement('input')
      inputText.setAttribute('type', 'text')
      inputText.setAttribute('disabled', false)
      inputText.style.border = 'none'
      inputText.value = `Validado por ${supervisor.nombre}`

      div.appendChild(inputText)
    } else {
      const miAlerta = new Alerta()
      const obj = arrayGlobal.avisoRojo
      const texto = arrayGlobal.mensajesVarios.firma.no_encontrado
      miAlerta.createVerde(obj, texto, objTrad)

      let modal = document.getElementById('modalAlertVerde')
      modal.style.display = 'block'
    }
  } catch (error) {
    console.log(error)
  }
}

function generateOptions(array, select) {
  console.log(array, select)
  while (select.firstChild) {
    select.removeChild(select.firstChild)
  }
  if (array.length > 0) {
    const emptyOption = document.createElement('option')
    emptyOption.value = ''
    emptyOption.text = ''
    select.appendChild(emptyOption)
    array.forEach((subarray) => {
      const [value, text] = subarray
      const option = document.createElement('option')
      option.value = value
      option.text = text
      select.appendChild(option)
    })
  }
}

function removeAllOptions(select) {
  while (select.firstChild) {
    select.removeChild(select.firstChild)
  }
}

function insertarDatoEnFila(obj) {
  try {
    const posicion = Number(obj.filaInserta) + 1
    const fila = document.querySelector(`tr:nth-child(${posicion})`)
    const select = fila.querySelector('td:nth-child(3) select')

    select.setAttribute('selector', 'select-hijo')
    const nuevoArray = obj.res
    if (nuevoArray[0][0] !== '') {
      generateOptions(nuevoArray, select)
    } else {
      removeAllOptions(select)
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
  }
}

async function eventSelect(event, hijo, sqlHijo) {
  const select = event.target
  const selectedOptions = select.selectedOptions

  const indexTextPairs = []

  for (let i = 0; i < selectedOptions.length; i++) {
    const option = selectedOptions[i]
    indexTextPairs.push([option.value, option.textContent])
  }

  let obj
  if (hijo === '1' && indexTextPairs.length > 0) {
    try {
      // Aquí puedes usar indexTextPairs para acceder a los índices y textos
      obj = await traerHijo(sqlHijo, indexTextPairs[0])
      if (obj === null) {
        return
      }

      insertarDatoEnFila(obj)
    } catch (error) {
      console.error('Error al llamar a traerHijo:', error)
    }
  }
}

document.getElementById('closeModalButton').onclick = () => {
  document.getElementById('myModal').style.display = 'none'
}

const buscarModal = document.getElementById('searchInput')

buscarModal.addEventListener('input', (e) => {
  const valorBuscado = e.target.value.trim().toLowerCase()
  const table = document.querySelector('.modal-content table')
  const tbody = table.querySelector('tbody')
  const rows = tbody.querySelectorAll('tr')
  rows.forEach((row) => {
    const cells = row.querySelectorAll('td')
    let filaCoincide = false

    cells.forEach((cell, index) => {
      if (index === 0) {
        const cellValue = cell.textContent.trim().toLowerCase()
        if (cellValue.includes(valorBuscado)) {
          filaCoincide = true
        }
      }
    })

    if (filaCoincide) {
      // eslint-disable-next-line no-param-reassign
      row.style.display = 'table-row' // Muestra la fila si coincide
    } else {
      // eslint-disable-next-line no-param-reassign
      row.style.display = 'none' // Oculta la fila si no coincide
    }
  })
})

document.addEventListener('DOMContentLoaded', async () => {
  const persona = desencriptar(sessionStorage.getItem('user'))
  if (persona) {
    document.querySelector('.custom-button').innerText =
      persona.lng.toUpperCase()
    objTranslate = await arraysLoadTranslate()

    const placeholder = buscarModal.placeholder
    buscarModal.placeholder = trO(placeholder, objTranslate) || placeholder
  }
})

export { consultaCN, consultaQuery, eventSelect, validation }
