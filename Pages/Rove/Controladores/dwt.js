function trO(palabra, objTranslate) {
  if (palabra === undefined || palabra === null) {
    return ''
  }
  const palabraNormalizada = palabra.replace(/\s/g, '').toLowerCase()
  const index = objTranslate.operativoES.findIndex(
    (item) =>
      item.replace(/\s/g, '').toLowerCase().trim() === palabraNormalizada.trim()
  )
  if (index !== -1) {
    return objTranslate.operativoTR[index]
  }
  return palabra
}

function trA(palabra, objTrad) {
  try {
    if (palabra === undefined || palabra === null || objTrad === null) {
      return ''
    }
    const palabraNormalizada = palabra.replace(/\s/g, '').toLowerCase()

    const index = objTrad.archivosES.findIndex(
      (item) =>
        item.replace(/\s/g, '').toLowerCase().trim() ===
        palabraNormalizada.trim()
    )
    if (index !== -1) {
      return objTrad.archivosTR[index]
    }
    return palabra
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    return palabra
  }
  // return palabra;
}

function createSpan(dato, clase) {
  const span = document.createElement('span')
  clase ? span.setAttribute('class', clase) : null
  span.innerText = dato
  return span
}
function creatDiv(clase) {
  const div = document.createElement('div')
  clase ? div.setAttribute('class', clase) : null
  return div
}

function compararHoras(hora1, hora2) {
  const [hora1Hora, hora1Minutos] = hora1.split(':').map(Number)
  const [hora2Hora, hora2Minutos] = hora2.split(':').map(Number)

  const minutos1 = hora1Hora * 60 + hora1Minutos
  const minutos2 = hora2Hora * 60 + hora2Minutos
  let diferenciaMinutos = minutos2 - minutos1
  if (diferenciaMinutos < 0) {
    diferenciaMinutos += 24 * 60 // Agregar 24 horas en minutos si la diferencia es negativa
  }
  const sonIguales = minutos1 === minutos2
  if (sonIguales === true) {
    return {
      sonIguales: null,
      diferenciaMinutos: null,
      mayor: null,
      hora1: null,
    }
  }
  const mayor = diferenciaMinutos >= 720 ? hora1 : hora2

  return { sonIguales, diferenciaMinutos, mayor, hora1: hora1Hora }
}

function completaLineas(inicio, fin, caracter, clase, id) {
  const tr = document.createElement('tr')
  for (let i = inicio; i <= fin; i++) {
    const td = document.createElement('td')
    clase ? td.setAttribute('class', clase) : null
    td.innerText = caracter
    tr.appendChild(td)
  }
  return tr
}

function sumarTotales(sumando, col, tr) {
  const primerTbody = document.getElementById('primerTbody')
  let fila18 = primerTbody.getElementsByTagName('tr')[18]
  let totalEnFila18 = parseInt(fila18.cells[col + 3].textContent) || 0
  fila18.cells[col + 3].innerText = totalEnFila18 + sumando

  let td = tr.getElementsByTagName('td')[2]
  const columna2 = parseInt(td.textContent) || 0
  td.setAttribute('class', 'columna2')
  td.innerText = columna2 + sumando
}

function consultaLrr(lrr, tr) {
  // console.log(tr, lrr, col)
  if (tr === 'LRR/DWT' || tr === 'DWT/LRR') {
    return tr
  }
  if (tr === 'LRR' && lrr === 'LRR') {
    return lrr
  }
  if (tr === 'DWT' && lrr === 'DWT') {
    return lrr
  }
  if (tr === 'LRR' && lrr === 'DWT') {
    return 'LRR/DWT'
  }
  if (tr === 'DWT' && lrr === 'LRR') {
    return 'DWT/LRR'
  }
  return lrr
}

function calculos(diferenciaMinutos, tr, hora1, lrr) {
  let minutos = diferenciaMinutos
  let valorMinutos = ''
  let td = document.createElement('td')
  const tbody = document.getElementById('primerTbody')
  let trParada = tbody.getElementsByTagName('tr')[17]
  let tdParada = document.createElement('td')

  for (let col = 0; col <= 23; col++) {
    td = tr.getElementsByTagName('td')[col + 3]
    if (col === hora1) {
      if (minutos > 60) {
        td.setAttribute('class', `celda-${lrr}`)
        td.innerText = 60
        sumarTotales(60, col, tr)
        minutos = minutos - 60
        tdParada = trParada.cells[col + 3]
        tdParada.setAttribute('class', 'dwt-lrr')
        tdParada.innerText = consultaLrr(lrr, tdParada.textContent) || '' //lrr
        while (minutos > 60 && col <= 23) {
          col++
          if (col === 24) {
            return
          }
          td = tr.getElementsByTagName('td')[col + 3]
          td.setAttribute('class', `celda-${lrr}`)
          td.innerText = 60
          sumarTotales(60, col, tr)
          tdParada = trParada.cells[col + 3]
          tdParada.setAttribute('class', 'dwt-lrr')
          tdParada.innerText = consultaLrr(lrr, tdParada.textContent) || '' //lrr

          minutos = minutos - 60
        }
        if (minutos > 0 && minutos <= 60 && col <= 23) {
          col++
          if (col === 24) {
            return
          }
          td = tr.getElementsByTagName('td')[col + 3]
          td.setAttribute('class', `celda-${lrr}`)
          td.innerText = minutos
          sumarTotales(minutos, col, tr)

          tdParada = trParada.cells[col + 3]
          tdParada.setAttribute('class', 'dwt-lrr')
          tdParada.innerText = consultaLrr(lrr, tdParada.textContent) || '' //lrr
        }
      }
      if (minutos <= 60) {
        if (col === 24) {
          return
        }
        valorMinutos = minutos
        td.setAttribute('class', `celda-${lrr}`)
        td.innerText = minutos
        sumarTotales(minutos, col, tr)
        tdParada = trParada.cells[col + 3]
        tdParada.setAttribute('class', 'dwt-lrr')
        tdParada.innerText = consultaLrr(lrr, tdParada.textContent) || '' //lrr
      }
    } else {
      valorMinutos = ''
      // td.setAttribute('class', 'celda-dwt-vacia')
      td.innerText = valorMinutos
    }
  }
  return
}

export default function dwt(dwts, objTrad) {
  try {
    const nameReporte = new Set()
    dwts.forEach((element) => {
      nameReporte.add(element[2])
    })

    const table = document.getElementById('tableRove')
    const tbody = document.createElement('tbody')
    tbody.setAttribute('id', 'dwtTbody')
    tbody.setAttribute('class', 'dwt-tbody')
    nameReporte.forEach((element) => {
      let tr = document.createElement('tr')
      let td = document.createElement('td')
      tr = completaLineas(1, 27, '', 'celda-dwt-DWT', null)
      tbody.appendChild(tr)
      td = tr.getElementsByTagName('td')[0]
      td.setAttribute('class', 'celda-dwt-DWT')
      td.innerText = trA(element, objTrad) || element
      const filtrados = dwts.filter((subarray) => subarray[2] === element)
      for (let i = 0; i < filtrados.length; i++) {
        const filt = filtrados[i]
        const textoNormalizado = filtrados[i][4]
          .replace(/\s+/g, '_', '_')
          .toLowerCase()
        if ('inicio_de_parada' === textoNormalizado) {
          const inicioDeParada = filtrados[i][5]
          const finDeParada = filtrados[i + 1][5]
          let parada = filtrados[i - 1][4]
          let tipoDeParada = filtrados[i - 1][5]
          if (
            parada.replace(/\s+/g, '_', '_').toLowerCase() ===
            'tipo_de_mantenimiento'
          ) {
            parada = trA(filtrados[i - 2][4], objTrad) || filtrados[i - 2][4]
            tipoDeParada = trA(tipoDeParada, objTrad) || tipoDeParada
            parada = `${parada} ${tipoDeParada}`
          }
          const { sonIguales, diferenciaMinutos, mayor, hora1 } = compararHoras(
            inicioDeParada,
            finDeParada
          )

          if (sonIguales === false) {
            td = document.createElement('td')
            tr = completaLineas(0, 26, '', null, null)
            tbody.appendChild(tr)
            td = tr.getElementsByTagName('td')[0]
            td.setAttribute('class', 'celda-dwt-parada')
            td.innerText = parada
            const div = creatDiv('div-doc')
            const span = createSpan(filtrados[i][7], 'docu')
            div.appendChild(span)
            td = tr.getElementsByTagName('td')[1]
            td.appendChild(div)
            const valorAFiltrar = filtrados[i][7]
            const filtradoPorDocumento = filtrados.filter(
              (subarray) => subarray[7] === valorAFiltrar
            )
            const tieneParadaTotal = filtradoPorDocumento.some(
              (subarray) =>
                subarray[4].replace(/\s+/g, '_', '_').toLowerCase() ===
                'parada_total'
            )
            let lrr = 'LRR'
            if (tieneParadaTotal) {
              lrr = 'DWT'
            }
            calculos(diferenciaMinutos, tr, hora1, lrr)
          }
        }
      }
    })

    table.appendChild(tbody)
  } catch (error) {
    console.log(error)
  }
}
