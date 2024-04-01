import arrayGlobal from '../../../controllers/variables.js'
import { AlertaRove } from './alertaRove.js'

function render(doc, table, fila, raz, hora, objTrad) {
  let razon = Number(raz.toFixed(2))
  let tr = table.getElementsByTagName('tr')
  const tdFc = tr[5].getElementsByTagName('td')[hora + 3]
  let fc = Number(tdFc.querySelector('span').innerText)
  fc = fc.toFixed(2)
  let clase = 'celda-verde'
  if (razon < fc) {
    clase = 'celda-roja'
  }
  let escala = 0.1
  if (Number(escala.toFixed(2)) === 0.1 && razon === 0.0) {
    const td = tr[fila].getElementsByTagName('td')[hora + 3]
    td.setAttribute('class', clase)
    let dato = Number(raz) * 100
    td.innerText = `${dato.toFixed(1)}%`
    return
  }

  for (let r = fila; r > fila - 10; r--) {
    let dato = Number(raz) * 100
    let td = tr[r].getElementsByTagName('td')[hora + 3]
    if (Number(escala.toFixed(2)) <= razon) {
      td.setAttribute('class', clase)
      td.addEventListener('click', function clickCelda(e) {
        const hr = hora.toString()
        const filtrado = doc.filter((elemento) => elemento[1] === hr)

        if (filtrado.length >= 1) {
          const miAlerta = new AlertaRove()
          const obj = arrayGlobal.objAlertaAceptarCancelar
          miAlerta.createMostrarNumDocumentos(
            obj,
            objTrad,
            filtrado,
            'documentos'
          )

          const modal = document.getElementById('modalAlert')
          modal.style.display = 'block'
        }
      })
      if (r - 1 === fila - 10) {
        td.innerText = `${dato.toFixed(1)}%`
      }
    } else {
      td = tr[r + 1].getElementsByTagName('td')[hora + 3]
      td.innerText = `${dato.toFixed(1)}%`
      break
    }

    escala = escala + 0.1
  }
}

function productividad(doc, table, fila, objTrad) {
  let tr = table.getElementsByTagName('tr')
  for (let hora = 0; hora < 24; hora++) {
    doc.forEach((element) => {
      const horaEstandar = parseInt(element[1])
      if (horaEstandar === hora) {
        const tdTonEmpacadas = tr[4].getElementsByTagName('td')[hora + 3]
        const tonEmpacadas =
          parseFloat(tdTonEmpacadas.querySelector('span').innerText) / 1000

        const tdTonTarget = tr[3].getElementsByTagName('td')[hora + 3]
        const tonTarget = parseFloat(
          tdTonTarget.querySelector('span').innerText
        )
        const razon = tonEmpacadas / tonTarget
        render(doc, table, fila, razon, hora, objTrad)
      }
    })
  }
}
export default function pintaBarras(doc, objTrad) {
  try {
    const table = document.getElementById('tableRove')
    productividad(doc, table, 15, objTrad)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error)
  }
}
