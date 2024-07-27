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
  valor,
  datos,
  i,
  columnaTd,
  selDatos,
  index
) {
  // console.log(tagName, type, tds, valor, datos, i, columnaTd, selDatos, index)
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
      function getSelectedText(selectElement) {
        if (
          selectElement &&
          selectElement.options &&
          selectElement.selectedIndex !== -1
        ) {
          return selectElement.options[selectElement.selectedIndex].innerText
        }
        return null
      }
      function checkAndSetValues() {
        select = td[columnaTd].childNodes[0]
        if (select.options.length > 0) {
          for (let m = 0; m < select.options.length; m++) {
            if (select.options[m].innerText === valor) {
              select.selectedIndex = m
              optionFound = true
              break
            }
          }

          if (!optionFound) {
            const option = document.createElement('option')
            // eslint-disable-next-line prefer-destructuring
            option.value = datos.valorS[index]
            option.innerText = valor
            select.appendChild(option)
          }
        } else {
          setTimeout(checkAndSetValues, 200)
        }
      }
      checkAndSetValues()
      const selectedText = getSelectedText(select)
      if (selectedText === null && valor) {
        const option = document.createElement('option')
        option.value = datos.valorS[index]
        option.innerText = valor
        select.appendChild(option)
      }
      // eslint-disable-next-line no-plusplus
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

function cargarNR(res, plant) {
  try {
    const objString = res[0][14]
    const datos = JSON.parse(objString)
    const idSupervisor = datos.supervisor[0]
    const tbody = document.querySelector('tbody')
    const tr = tbody.querySelectorAll('tr')
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < tr.length - 0; i++) {
      const row = tr[i]
      // console.log(row)
      const td = row.querySelectorAll('td')

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
        columna2(tagName, type, td, valor, datos, i, 2, 12, elementoEncontrado)
        columna2(
          tagNameObservaciones,
          typeObservaciones,
          td,
          valorObservaciones,
          datos,
          i,
          4,
          13,
          elementoEncontrado
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
