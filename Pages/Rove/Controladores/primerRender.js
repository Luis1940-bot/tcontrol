const widthScreen = window.innerWidth

function trO(palabra, objTranslate) {
  console.log(objTranslate)
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

function TbodyCell(c, r) {
  const cell = document.createElement('td')
  cell.setAttribute('class', 'col-barra')
  if (c < 3 && r < 19) {
    cell.setAttribute('class', 'col-estandar')
  }
  if (r === 19) {
    cell.setAttribute('class', 'fila-19')
  }
  cell.innerText = ''
  return cell
}

function titulos(table, rove, objTrad) {
  let tr = table.getElementsByTagName('tr')

  let td1 = tr[0].getElementsByTagName('td')[2]
  let td2 = tr[1].getElementsByTagName('td')[2]
  let td3 = tr[2].getElementsByTagName('td')[2]
  let td4 = tr[3].getElementsByTagName('td')[2]
  let td17 = ''
  let fila_0 = ''
  let fila_1 = ''
  let fila_2 = ''
  let fila_3 = ''
  let fila_4 = ''
  let fila_16 = ''
  let tot = []
  switch (rove) {
    case 'especialidades':
      fila_0 = trO('Producto', objTrad) || 'Producto'
      fila_1 = '[Kg/h]'
      fila_2 = trO('Meta', objTrad) || 'Meta'
      fila_3 = 'Target'
      fila_4 = 'Tn Emp.'
      fila_16 = trO('Hora', objTrad) || 'Hora'

      tot[0] = 'Hs Rum:'
      tot[1] = 'Cump. Plan:'
      tot[2] = 'Tn Empac.:'
      tot[3] = 'Tn Prog.:'
      tot[4] = 'Performance:'
      tot[5] = 'DWT NoPlan:'
      tot[6] = 'DWT NoAsig.:'
      break
    case 'fritas_L2':
      fila_0 = 'MP'
      fila_1 = 'hRum'
      fila_2 = 'LR c/DWT'
      fila_3 = 'LR Nominal'
      fila_4 = 'Tn/hr'
      fila_16 = trO('Hora', objTrad) || 'Hora'

      tot[0] = 'Hs Rum:'
      tot[1] = 'Cump. Plan:'
      tot[2] = 'Tn Empac.:'
      tot[3] = 'Tn Prog.:'
      tot[4] = 'Performance:'
      tot[5] = 'DWT NoPlan:'
      tot[6] = 'DWT NoAsig.:'
      break
    case 'fritas_L1':
      fila_0 = 'MP'
      fila_1 = 'hRum'
      fila_2 = 'LR c/DWT'
      fila_3 = 'LR Nominal'
      fila_4 = 'Tn/hr'
      fila_16 = trO('Hora', objTrad) || 'Hora'

      tot[0] = 'Hs Rum:'
      tot[1] = 'Cump. Plan:'
      tot[2] = 'Tn Empac.:'
      tot[3] = 'Tn Prog.:'
      tot[4] = 'Performance:'
      tot[5] = 'DWT NoPlan:'
      tot[6] = 'DWT NoAsig.:'
      break
    case 'pure':
      fila_0 = 'MP'
      fila_1 = 'hRum'
      fila_2 = 'LR c/DWT'
      fila_3 = 'LR Nominal'
      fila_4 = 'Tn/hr'
      fila_16 = trO('Hora', objTrad) || 'Hora'

      tot[0] = 'Hs Rum:'
      tot[1] = 'Cump. Plan:'
      tot[2] = 'Tn Empac.:'
      tot[3] = 'Tn Prog.:'
      tot[4] = 'Performance:'
      tot[5] = 'DWT NoPlan:'
      tot[6] = 'DWT NoAsig.:'
      break
    default:
      break
  }
  let span = document.createElement('span')
  span.innerText = fila_0
  td1.appendChild(span)
  span.innerText = fila_1
  td2.appendChild(span)
}

export default function primerRender(rove, objTrad) {
  const table = document.getElementById('tableRove')
  const tbody = document.createElement('tbody')
  for (let r = 0; r < 20; r++) {
    const newRow = document.createElement('tr')
    for (let c = 0; c < 27; c++) {
      //generar celda vacía
      const celda = TbodyCell(c, r)
      newRow.appendChild(celda)
    }
    tbody.appendChild(newRow)
  }

  table.appendChild(tbody)
  titulos(table, rove, objTrad)
}
