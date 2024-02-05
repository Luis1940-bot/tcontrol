// eslint-disable-next-line import/extensions
import traerSupervisor from '../Controladores/traerSupervisor.js'
// eslint-disable-next-line import/extensions
import { Alerta } from '../../../../includes/atoms/alerta.js'
// eslint-disable-next-line import/extensions
import objVariables from '../../../../controllers/variables.js'
// eslint-disable-next-line import/extensions, import/no-useless-path-segments
import { encriptar } from '../../../../controllers/cript.js'

function columna2(tagName, type, tds, valor, datos, i, columnaTd, selDatos) {
  // console.log(tagName, type, tds, valor, datos, i, columnaTd, selDatos)
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
      const select = td[columnaTd].childNodes[0]
      // eslint-disable-next-line no-plusplus
      for (let m = 0; m < select.options.length; m++) {
        if (select.options[m].innerText === valor) {
          select.selectedIndex = m
          break
        }
      }
      if (select.options.length === 0) {
        const option = document.createElement('option')
        // eslint-disable-next-line prefer-destructuring
        option.value = datos[i][selDatos]
        option.innerText = valor
        select.appendChild(option)
      }
    }
  }
  if (tagName === 'INPUT' && type === 'checkbox') {
    const checkbox = td[columnaTd].childNodes[0]
    valor === '1' ? (checkbox.checked = true) : (checkbox.checked = false)
  }
  if (tagName === 'BUTTON' && type === 'submit' && datos[i][23] !== '') {
    let cadenaJSON = datos[i][23]
    cadenaJSON = cadenaJSON.replace(/fileName/g, '"fileName"')
    cadenaJSON = cadenaJSON.replace(/extension/g, '"extension"')
    cadenaJSON = cadenaJSON.replace(
      /("fileName": \[.*?\])\s?("extension": \[.*?\])/,
      '$1, $2'
    )
    cadenaJSON = cadenaJSON.replace(/(\w+):/g, '"$1":')
    const objeto = JSON.parse(`{${cadenaJSON}}`)
    const cantidadDeImagenes = objeto.fileName.length
    const rutaBase = '../../../../assets/Imagenes/'
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

async function verSupervisor(idSupervisor) {
  let configMenu
  // console.log(idSupervisor)
  if (idSupervisor !== '0') {
    const supervisor = await traerSupervisor(idSupervisor)
    configMenu = {
      guardar: false,
      guardarComo: true,
      guardarCambios: true,
      firma: true,
      configFirma: supervisor,
    }
    localStorage.setItem('config_menu', encriptar(configMenu))
  } else if (idSupervisor === '0') {
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
    localStorage.setItem('firma', encriptar('x'))
    localStorage.setItem('config_menu', encriptar('x'))
  }
}

function cargarNR(datos) {
  // console.log(datos)
  try {
    const idSupervisor = datos[0][6]
    const tbody = document.querySelector('tbody')
    const tr = tbody.querySelectorAll('tr')
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < tr.length - 1; i++) {
      const row = tr[i]
      // console.log(row);
      const td = row.querySelectorAll('td')
      // console.log(td);
      const codigo = td[5].innerText
      const { tagName } = td[2].childNodes[0]
      const { type } = td[2].childNodes[0]
      // const { value } = td[2].childNodes[0];
      const valor = datos[i][3]
      const tagNameObservaciones = td[4].childNodes[0].tagName
      const typeObservaciones = td[4].childNodes[0].type
      // const valueObservaciones = td[4].childNodes[0].value;
      const valorObservaciones = datos[i][9]

      if (codigo.trim() === datos[i][5].trim()) {
        columna2(tagName, type, td, valor, datos, i, 2, 12)
        columna2(
          tagNameObservaciones,
          typeObservaciones,
          td,
          valorObservaciones,
          datos,
          i,
          4,
          13
        )
      }
    }
    verSupervisor(idSupervisor)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error)
  }
  // return 'ok';
}

export default cargarNR
