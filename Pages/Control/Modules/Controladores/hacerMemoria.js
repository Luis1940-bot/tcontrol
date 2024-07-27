// eslint-disable-next-line import/extensions
import arrayGlobal from '../../../../controllers/variables.js'
// eslint-disable-next-line import/extensions
import respuestaColumna from './armadoDeObjetos.js'
// eslint-disable-next-line import/extensions
import fechasGenerator from '../../../../controllers/fechas.js'
// eslint-disable-next-line import/extensions, import/no-useless-path-segments
import { desencriptar } from '../../../../controllers/cript.js'

function buscarEnArray(id, array) {
  const idStr = id.toString().trim()
  const resultado = array.find((registro) => registro[1] === idStr)
  return resultado
}

function hacerMemoria(arrayControl) {
  try {
    const person = desencriptar(sessionStorage.getItem('user'))
    const idPerson = person.id
    // const email = document.getElementById('idCheckBoxEmail').checked;
    // const url = new URL(window.location.href);
    const contenido = sessionStorage.getItem('contenido')
    const url = desencriptar(contenido)
    const controlN = url.control_N // url.searchParams.get('control_N');
    // const controlT = url.searchParams.get('control_T');
    const tbody = document.querySelector('tbody')
    const tr = tbody.querySelectorAll('tr')
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < tr.length; i++) {
      let valor
      let selector1
      let selector2
      let valorS
      let valorOBS
      let familiaselector
      // let imagenes;
      let observacion
      let respuesta
      const td = tr[i].querySelectorAll('td')
      // eslint-disable-next-line no-unused-vars
      const displayRow = window.getComputedStyle(tr[i]).display
      // eslint-disable-next-line no-plusplus
      for (let c = 2; c <= 4; c += 2) {
        const displayCell = window.getComputedStyle(td[c]).display
        const element = td[c]

        let node, datoCelda, valueCelda
        if (element.childNodes.length > 0) {
          node = element.childNodes[0]
          datoCelda = node.data || null
          valueCelda = node.value || null
        } else {
          // Si no hay nodos hijos, recupera el valor directamente del td
          node = null
          datoCelda = element.textContent || null
          valueCelda = null
          // console.warn(
          //   `El td en la columna ${c} no tiene nodos hijos. Valor de la celda: ${datoCelda}`
          // )
        }

        const colspanValue = td[1].getAttribute('colspan')
        const inputElement = element.querySelector('input')
        const nodeType = node ? node.nodeType : null
        const type = node ? node.type : null
        const tagName = node ? node.tagName : null

        let childeNode0
        let inputmode
        let select
        const checkbox = node ? node.checked : null
        const radio = node ? node.checked : null
        let divConsultas
        let liImages
        const selector = null
        const terceraColumna = td[3].firstChild

        let imagenes = {
          src: [],
          fileName: [],
          extension: [],
        }

        const objParametros = {
          displayCell,
          element,
          node,
          datoCelda,
          valueCelda,
          colspanValue,
          inputElement,
          nodeType,
          type,
          tagName,
          inputmode,
          childeNode0,
          select,
          checkbox,
          radio,
          divConsultas,
          liImages,
          selector,
          imagenes,
          terceraColumna,
        }

        let respuesta
        if (c === 2) {
          respuesta = respuestaColumna(c, i, objParametros)
          ;({ valor, selector1, valorS, familiaselector } = respuesta)
        }
        if (c === 4) {
          respuesta = respuestaColumna(c, i, objParametros)
          ;({ selector2, valorOBS, familiaselector, imagenes, observacion } =
            respuesta)
        }

        if (c === 4) {
          const founded = buscarEnArray(td[5].textContent, arrayControl)
          arrayGlobal.objetoMemoria.fecha.push(
            fechasGenerator.fecha_corta_yyyymmdd(new Date())
          )
          arrayGlobal.objetoMemoria.nuxpedido.push(0)
          arrayGlobal.objetoMemoria.valor.push(valor)
          arrayGlobal.objetoMemoria.desvio.push(founded[2])
          arrayGlobal.objetoMemoria.idusuario.push(idPerson)
          arrayGlobal.objetoMemoria.tipodedato.push(founded[5])
          arrayGlobal.objetoMemoria.idLTYreporte.push(controlN)
          arrayGlobal.objetoMemoria.idLTYcontrol.push(founded[1])
          arrayGlobal.objetoMemoria.supervisor.push(0)
          arrayGlobal.objetoMemoria.tpdeobserva.push(founded[9])
          arrayGlobal.objetoMemoria.selector.push(selector1)
          arrayGlobal.objetoMemoria.selector2.push(selector2)
          arrayGlobal.objetoMemoria.valorS.push(valorS)
          arrayGlobal.objetoMemoria.valorOBS.push(valorOBS)
          arrayGlobal.objetoMemoria.familiaselector.push(familiaselector)
          arrayGlobal.objetoMemoria.observacion.push(observacion)
          imagenes.src.length > 0
            ? arrayGlobal.objetoMemoria.imagenes.push(imagenes)
            : arrayGlobal.objetoMemoria.imagenes.push('')
          arrayGlobal.objetoMemoria.displayRow.push(displayRow)
        }
      }
    }
    // console.log(arrayGlobal.objetoMemoria)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
  }
}

export default hacerMemoria
