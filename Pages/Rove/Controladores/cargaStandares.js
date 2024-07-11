import { trO } from '../../../controllers/trOA'

function createSpan(dato, clase) {
  const span = document.createElement('span')
  clase ? span.setAttribute('class', clase) : null
  span.innerText = dato
  return span
}

function carga(table, objTrad, fila, estandares) {
  let tr = table.getElementsByTagName('tr')
  estandares.forEach((element) => {
    const horaEstandar = parseInt(element[7])
    for (let hora = 0; hora < 24; hora++) {
      if (horaEstandar === hora) {
        let td = tr[fila].getElementsByTagName('td')[hora + 3]
        let span = td.querySelector('span')
        const producto = trO(element[1], objTrad) || element[1]
        span.innerText = producto

        td = tr[fila + 1].getElementsByTagName('td')[hora + 3]
        span = td.querySelector('span')
        span.innerText = element[2]

        td = tr[fila + 2].getElementsByTagName('td')[hora + 3]
        span = td.querySelector('span')
        span.innerText = element[3]

        td = tr[fila + 3].getElementsByTagName('td')[hora + 3]
        span = td.querySelector('span')
        span.innerText = element[4]

        td = tr[fila + 4].getElementsByTagName('td')[hora + 3]
        span = td.querySelector('span')
        const ton = parseFloat(element[6]) / 1000
        span.innerText = ton.toFixed(2)

        td = tr[fila + 5].getElementsByTagName('td')[hora + 3]
        span = td.querySelector('span')
        span.innerText = element[5]
      }
    }
  })
}

function cargaVacios(table, fila, claseOld, claseNew, claseSpan, relleno) {
  let tr = table.getElementsByTagName('tr')
  for (let c = 0; c < 24; c++) {
    let td = tr[fila].getElementsByTagName('td')[c + 3]
    td.classList.remove(claseOld)
    td.classList.add(claseNew)
    td.appendChild(createSpan(relleno, claseSpan))
  }
}

export default function cargarStandares(estandares, objTrad) {
  try {
    const table = document.getElementById('tableRove')
    cargaVacios(table, 0, 'col-barra', 'row-producto', 'producto', '-')
    cargaVacios(table, 1, 'col-barra', 'row-hrum', 'hrum', '-')
    cargaVacios(table, 2, 'col-barra', 'row-cap', 'cap', '-')
    cargaVacios(table, 3, 'col-barra', 'row-lr', 'lr', '-')
    cargaVacios(table, 4, 'col-barra', 'row-ton', 'ton', '-')
    cargaVacios(table, 5, 'col-barra', 'row-fc', 'fc', '-')
    carga(table, objTrad, 0, estandares)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error)
  }
}
