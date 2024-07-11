// import { trO } from '../../../controllers/trOA'

function createSpan(dato, clase) {
  const span = document.createElement('span')
  clase ? span.setAttribute('class', clase) : null
  span.innerText = dato
  return span
}

function agregaHoras(table, fila) {
  let tr = table.getElementsByTagName('tr')
  for (let hora = 0; hora < 24; hora++) {
    const horaFormateada = hora.toString().padStart(2, '0')
    let td = tr[fila].getElementsByTagName('td')[hora + 3]
    td.appendChild(createSpan(`${horaFormateada}:00`, null))
  }
}

function porcentajes(table, objTrad, filas, trO) {
  let tr = table.getElementsByTagName('tr')
  let porciento = 100
  for (let r = 6; r < filas; r++) {
    let td = tr[r].getElementsByTagName('td')[2]
    td.appendChild(createSpan(`${porciento}%`, null))
    porciento = porciento - 10
  }

  let td = tr[filas].getElementsByTagName('td')[2]
  let span = trO('Hora', objTrad) || 'Hora'
  td.appendChild(createSpan(span, null))
}

function titulos(table, rove, objTrad, trO) {
  let tr = table.getElementsByTagName('tr')

  let fila = Array()
  let tot = Array()
  // let fila_16 = ''
  switch (rove) {
    case 'especialidades':
      fila[0] = trO('Producto', objTrad) || 'Producto'
      fila[1] = '[Kg/h]'
      fila[2] = trO('Meta', objTrad) || 'Meta'
      fila[3] = 'Target'
      fila[4] = 'Tn Emp.'
      // fila_16 = trO('Hora', objTrad) || 'Hora'

      tot[0] = 'Hs Rum:'
      tot[1] = 'Cump. Plan:'
      tot[2] = 'Tn Empac.:'
      tot[3] = 'Tn Prog.:'
      tot[4] = 'Performance:'
      tot[5] = 'DWT NoPlan:'
      tot[6] = 'DWT NoAsig.:'
      break
    case 'fritas_L2':
      fila[0] = 'MP'
      fila[1] = 'hRum'
      fila[2] = 'LR c/DWT'
      fila[3] = 'LR Nominal'
      fila[4] = 'Tn/hr'
      // fila_16 = trO('Hora', objTrad) || 'Hora'

      tot[0] = 'Hs Rum:'
      tot[1] = 'Cump. Plan:'
      tot[2] = 'Tn Empac.:'
      tot[3] = 'Tn Prog.:'
      tot[4] = 'Performance:'
      tot[5] = 'DWT NoPlan:'
      tot[6] = 'DWT NoAsig.:'
      break
    case 'fritas_L1':
      fila[0] = 'MP'
      fila[1] = 'hRum'
      fila[2] = 'LR c/DWT'
      fila[3] = 'LR Nominal'
      fila[4] = 'Tn/hr'
      // fila_16 = trO('Hora', objTrad) || 'Hora'

      tot[0] = 'Hs Rum:'
      tot[1] = 'Cump. Plan:'
      tot[2] = 'Tn Empac.:'
      tot[3] = 'Tn Prog.:'
      tot[4] = 'Performance:'
      tot[5] = 'DWT NoPlan:'
      tot[6] = 'DWT NoAsig.:'
      break
    case 'pure':
      fila[0] = 'MP'
      fila[1] = 'hRum'
      fila[2] = 'LR c/DWT'
      fila[3] = 'LR Nominal'
      fila[4] = 'Tn/hr'
      // fila_16 = trO('Hora', objTrad) || 'Hora'

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

  for (let c = 0; c < fila.length; c++) {
    let td = tr[c].getElementsByTagName('td')[2]
    td.appendChild(createSpan(fila[c], null))
  }
  for (let t = 0; t < tot.length; t++) {
    let td = tr[t + 1].getElementsByTagName('td')[0]
    td.appendChild(createSpan(tot[t], null))
  }
}

function TbodyCell(c, r) {
  const cell = document.createElement('td')
  cell.setAttribute('class', 'col-barra')
  if (c === 0 && r < 18) {
    cell.setAttribute('class', 'col-estandar-0')
  }
  if (c === 1 && r < 18) {
    cell.setAttribute('class', 'col-estandar-1')
  }
  if (c === 2 && r < 18) {
    cell.setAttribute('class', 'col-estandar-2')
  }
  if (r === 16) {
    cell.setAttribute('class', 'fila-16')
  }
  if (r === 18) {
    cell.setAttribute('class', 'fila-19')
  }
  cell.innerText = ''
  return cell
}

export default function primerRender(rove, objTrad, trO) {
  try {
    const table = document.getElementById('tableRove')
    const tbody = document.createElement('tbody')
    tbody.setAttribute('id', 'primerTbody')
    for (let r = 0; r < 19; r++) {
      const newRow = document.createElement('tr')
      for (let c = 0; c < 27; c++) {
        //generar celda vacía
        const celda = TbodyCell(c, r)
        newRow.appendChild(celda)
      }
      tbody.appendChild(newRow)
    }

    table.appendChild(tbody)
    titulos(table, rove, objTrad, trO)
    porcentajes(table, objTrad, 16, trO)
    agregaHoras(table, 16)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error)
  }
}
