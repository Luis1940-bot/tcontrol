// eslint-disable-next-line import/extensions
import traerSupervisor from '../Controladores/traerSupervisor.js'
// eslint-disable-next-line import/extensions
import { Alerta } from '../../../../includes/atoms/alerta.js'
// eslint-disable-next-line import/extensions
import objVariables from '../../../../controllers/variables.js'
// eslint-disable-next-line import/extensions, import/no-useless-path-segments
import { encriptar, desencriptar } from '../../../../controllers/cript.js'

import baseUrl from '../../../../config.js'
const SERVER = baseUrl

function columna2(
  tagName,
  type,
  tds,
  val,
  datos,
  i,
  columnaTd,
  selDatos,
  index,
  valor_sql,
  tipoDatoDetalle
) {
  // console.log(
  //   tagName,
  //   type,
  //   tds,
  //   val,
  //   datos,
  //   i,
  //   columnaTd,
  //   selDatos,
  //   index,
  //   tipoDatoDetalle
  // )
  if (valor_sql !== null) {
    return
  }
  let valor = val
  const td = tds
  if (
    (tagName === 'INPUT' && type === 'date') ||
    (tagName === 'INPUT' && type === 'time')
  ) {
    // console.log(value)
    // console.log(valor)
    td[columnaTd].childNodes[0].value = valor
  }
  if (
    (tagName === 'INPUT' && type === 'text') ||
    (tagName === 'TEXTAREA' && type === 'textarea')
  ) {
    td[columnaTd].childNodes[0].value = valor
  }

  if (tagName === 'SELECT' && type === 'select-one') {
    if (valor) {
      let optionFound = false
      let select
      let retries = 0 // Contador para reintentos
      const maxRetries = 20 // Número máximo de reintentos
      const retryDelay = 200 // Retraso entre cada reintento (en milisegundos)

      // Función para verificar y seleccionar el valor en el select
      function checkAndSetValues() {
        select = td[columnaTd].childNodes[0] // Seleccionamos el <select> dentro del <td>
        valor === 's' || valor === 'sd' ? (valor = null) : null
        // Verificar si el select existe y si tiene opciones cargadas
        if (select && select.options.length > 0) {
          for (let m = 0; m < select.options.length; m++) {
            if (select.options[m].innerText === valor) {
              select.selectedIndex = m // Seleccionar el valor coincidente
              optionFound = true
              return // Terminar la función ya que encontramos la opción
            }
          }

          // Si no se encontró la opción, agregarla como una nueva opción
          if (!optionFound) {
            const option = document.createElement('option')
            option.value = datos.valorS[index] // Asegúrate de que 'datos.valorS[index]' existe
            option.innerText = valor
            select.appendChild(option)
            select.selectedIndex = select.options.length - 1 // Seleccionar la nueva opción
          }
        } else {
          // Si no hay opciones, reintentar hasta que estén disponibles
          if (valor && select.hasAttribute('selector') === false) {
            const option = document.createElement('option')
            option.value = datos.valorS[index] // Asegúrate de que 'datos.valorS[index]' existe
            option.innerText = valor
            select.appendChild(option)
            select.selectedIndex = select.options.length - 1 // Seleccionar la nueva opción
            return
          }
          retries++
          if (retries < maxRetries) {
            setTimeout(checkAndSetValues, retryDelay) // Reintentar después de un breve retraso
          } else {
            console.warn(
              `No se pudo cargar el select después de ${maxRetries} intentos.`
            )
          }
        }
      }

      // Iniciar la función para verificar y establecer el valor en el select
      checkAndSetValues()
    }
  }
  if (tagName === 'INPUT' && type === 'checkbox') {
    const checkbox = td[columnaTd].childNodes[0]
    valor === 1 ? (checkbox.checked = true) : (checkbox.checked = false)
  }
  const imagen = datos.imagenes[index]
  if (tagName === 'BUTTON' && type === 'submit' && imagen !== '') {
    const { plant } = desencriptar(sessionStorage.getItem('user'))
    const jsonString = imagen.replace(/'/g, '"')
    const objeto = JSON.parse(jsonString)
    const cantidadDeImagenes = objeto.fileName.length
    // console.log(objeto)
    const rutaBase = `${SERVER}/assets/Imagenes/${plant}/`
    const ul = td[3].childNodes[0]

    // eslint-disable-next-line no-plusplus
    for (let n = 0; n < cantidadDeImagenes; n++) {
      const img = new Image()
      const nombreArchivo = objeto.fileName[n]
      const extension = objeto.extension[n]
      const li = document.createElement('li')
      const fileNameWithoutExtension = nombreArchivo.replace(/\.[^.]+$/, '')
      const rutaCompleta = `${rutaBase}${nombreArchivo}`
      // console.log(rutaCompleta)
      li.id = `li_${fileNameWithoutExtension}`
      img.setAttribute('class', 'img-select')
      img.setAttribute('data-filename', nombreArchivo)
      img.setAttribute('data-fileextension', extension)
      img.setAttribute(
        'data-fileNameWithoutExtension',
        fileNameWithoutExtension
      )
      img.addEventListener('click', () => {
        const miAlertaImagen = new Alerta()
        miAlertaImagen.createModalImagenes(objVariables.modalImagen, img)
        const modal = document.getElementById('modalAlert')
        modal.style.display = 'block'
      })
      fetch(rutaCompleta)
        .then((response) => response.blob())
        .then((blob) => {
          const reader = new FileReader()
          // console.log(reader)
          reader.onload = () => {
            // Establecer el atributo src con la representación base64 de la imagen
            img.src = reader.result
          }
          reader.readAsDataURL(blob)
        })
      li.appendChild(img)
      ul.appendChild(li)
    }
  }
  const tipodedato = datos.tipodedato[index]
  if (tagName === 'DIV' && tipodedato === 'cn') {
    //es una consulta cn con button
    let inputElement = document.querySelector('td div.button-cn input')
    inputElement.value = valor
  }
  if (tagName === 'DIV' && tipodedato === 'valid') {
    if (valor !== '') {
      const div = tds[2]
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
      inputText.value = `${valor}`

      div.appendChild(inputText)
    }
  }
  if (
    tagName === 'DIV' &&
    (tipodedato === 'checkhour' ||
      tipodedato === 'checkdate' ||
      tipodedato === 'checkdateh')
  ) {
    if (valor !== '') {
      const div = tds[2]
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
      inputText.value = `${valor}`

      div.appendChild(inputText)
    }
  }
  if (tagName === 'INPUT' && type === 'radio') {
    const radio = td[columnaTd].childNodes[0]
    valor === '1' ? (radio.checked = true) : (radio.checked = false)
  }
  if (tipoDatoDetalle === 'checkhour' && columnaTd === 2) {
    let checkhour = datos.detalle[index].replace('.', ':')
    const td_3 = tds[3]
    const td_2 = tds[2]
    // const buttonElement = td_3.querySelector('div > button')
    // buttonElement.remove()
    const buttonElement = td_3.querySelector('div > button')
    if (buttonElement) {
      buttonElement.remove()
    }
    const inputElement = td_3.querySelector('div > input')
    if (inputElement) {
      inputElement.value = checkhour
      inputElement.style.border = 'none'
      inputElement.style.display = 'block'
    }

    if (type === 'text') {
      const inputElement_2 = td_2.querySelector('input')
      inputElement_2.disabled = true
    }
    if (type === 'checkbox') {
      const inputElement_2 = td_2.querySelector('input')
      inputElement_2.disabled = true
    }
  }
}

async function verSupervisor(idSupervisor, plant) {
  let configMenu

  if (idSupervisor !== 0) {
    const supervisor = await traerSupervisor(idSupervisor, plant)
    configMenu = {
      guardar: false,
      guardarComo: true,
      guardarCambios: true,
      firma: true,
      configFirma: supervisor,
    }

    sessionStorage.setItem('config_menu', encriptar(configMenu))
    sessionStorage.setItem('firmado', encriptar(supervisor))
  } else if (idSupervisor === 0) {
    const supervisor = {
      id: 0,
      mail: '',
      mi_cfg: '',
      nombre: '',
      tipo: 0,
    }
    configMenu = {
      guardar: false,
      guardarComo: true,
      guardarCambios: true,
      firma: false,
      configFirma: supervisor,
    }

    sessionStorage.setItem('firma', encriptar('x'))
    sessionStorage.setItem('config_menu', encriptar('x'))
  }
}

async function cargarNR(res, plant, data) {
  try {
    const objString = res[0][14]
    const datos = JSON.parse(objString)
    const idSupervisor = datos.supervisor[0]
    const table = document.getElementById('tableControl')
    // console.log(
    //   'HTML de tableControl:',
    //   table ? table.outerHTML : 'No existe tableControl'
    // )

    if (!table) {
      console.error('tableControl no está disponible')
      return
    }
    const tbody = table.querySelector('tbody')
    if (!table) {
      console.error('tableControl no está disponible')
      return
    }
    const tr = tbody.querySelectorAll('tr')
    // console.log(tr.length)
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < tr.length - 0; i++) {
      const row = tr[i]
      const valor_sql = data[i][23]
      const td = row.querySelectorAll('td')
      const tipoDatoDetalle = data[i][33]
      const codigo = td[5].innerText

      const { tagName } = td[2].childNodes[0]
      const { type } = td[2].childNodes[0]
      const tagNameObservaciones = td[4].childNodes[0].tagName
      const typeObservaciones = td[4].childNodes[0].type
      const codigoString = codigo.toString().trim()

      const elementoEncontrado = datos.idLTYcontrol.indexOf(codigoString)

      if (elementoEncontrado !== -1) {
        let valor = datos.valor[elementoEncontrado]

        const valorObservaciones = datos.observacion[elementoEncontrado]
        if (valor === 'tx') {
          valor = null
        }

        columna2(
          tagName,
          type,
          td,
          valor,
          datos,
          i,
          2,
          12,
          elementoEncontrado,
          valor_sql,
          tipoDatoDetalle
        )
        columna2(
          tagNameObservaciones,
          typeObservaciones,
          td,
          valorObservaciones,
          datos,
          i,
          4,
          13,
          elementoEncontrado,
          valor_sql,
          tipoDatoDetalle
        )
      }
    }
    verSupervisor(idSupervisor, plant)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error)
  }
  // return 'ok';
}

export default cargarNR
