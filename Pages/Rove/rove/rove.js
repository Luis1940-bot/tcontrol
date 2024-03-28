//!--cuando se abre la página esta está en blanco mostrando solamente el encabezado
//!--se dispone de 2 botones, uno trae el rove del día el otro trae abre el calendar para seleccionar entre fechas
//!--las consultas se realizan desde traer_rove.php
//!--consulta de estandares target
//!--consulta de de los campos que se incluyen en planeado y no planeado
//!--consulta de dwt con el nombre al grupo de parada que pertenecen para poder realizar los totales
//!--consulta de los totales de kg de producto procesado

import { fecha_corta_yyyymmdd } from './utils/fechas.js'
// invocar : alert(fecha_larga_yyyymmddhhmm(new Date()))
import { scrWidth, scrHeight } from './utils/medidas.js'
import { getStandares } from './modulos/getStandares.js'
import { armar_primerGrafico } from './modulos/armar_primerGrafico.js'
import { pintar_barras } from './modulos/pintar_barras.js'
import { indicadores } from './modulos/indicadores.js'
import { CargaDWT, respuesta_modulo, paradasDWT } from './modulos/cargaDWT.js'
import { contenidoRow } from './modulos/insertarFila.js'
import { pintamos } from './modulos/pintamosDWT.js'
import { traducir } from '../traducciones/variables/traducir.js'

let nombreDeReporte = '_'
let tipo_rove = ''
let tabla = document.getElementById('bodyDatos')
let parametrosQuery = ''
let arrayDocumentos = []

// //!-----------------------
// let objetoError={
//   qq:'',
//   descripcion:'',
//   tipo_error:'',
//   gravedad:'',
//   ubicacion:'',
//   usuario:'',
//   comentario:''
// }
// //!---------------------

document.addEventListener('DOMContentLoaded', () => {
  console.time('miTemporizador')
  tabla.innerHTML = ''
  nombreDeReporte = '_' + document.getElementById('tipo_rove').textContent
  tipo_rove = document.getElementById('tipo_rove').textContent
  console.log('Carga completa de ROVE [1]')
  // let mi_cfg=document.getElementById('mi_cfg').textContent;
  // let tema_guardado=mi_cfg.slice(0,1);
  // let lenguaje_guardado=mi_cfg.slice(2,4);
  // lectura_miConfig(tema_guardado,lenguaje_guardado);
  setTimeout(() => {
    let nombreDeTabla = document.getElementById('nombreDeTabla').textContent
    document.getElementById('nombreDeTabla').innerText = traducir(nombreDeTabla)
  }, 100)
})

document.addEventListener('click', function (evento) {
  let colorFondoCelda = evento.target.style.backgroundColor
  if (
    evento.target.classList.value ===
    'fa fa-exclamation-triangle fa-2x text-danger'
  ) {
    // Acciones a realizar cuando se hace clic en el icono
    $('#contenidoEmergente').modal('toggle')
  }

  if (
    colorFondoCelda == 'rgb(255, 0, 0)' ||
    colorFondoCelda == 'rgb(0, 255, 0)'
  ) {
    const numColumna = evento.target.cellIndex - 3
    let arrayEnviaDoc = []
    let obj = { doc: [], idRepo: [], repo: [] }

    arrayDocumentos.forEach((element) => {
      if (numColumna === parseInt(element[1])) {
        obj.doc.push(element[2])
        obj.idRepo.push(element[3])
        obj.repo.push(element[4])
      }
    })
    arrayEnviaDoc.push(obj)

    armaDocumentsTons(arrayEnviaDoc)
  }
})

document.addEventListener('click', function (evento) {
  let clase = evento.target.classList.value.split('!')[0]
  let doc = evento.target.classList.value.split('!')[1]
  let linea = traducir('Línea')
  if (clase === 'fa fa-info-circle fa-1x text-success ') {
    document.getElementById('infoDoc').innerHTML = `<div>${linea} <b>${
      paradasDWT.linea[0]
    }</b><br>&nbsp${
      document.getElementById('idtablero').textContent
    }</div><br><br>`
    for (const key in paradasDWT) {
      if (Object.hasOwnProperty.call(paradasDWT, key)) {
        const element = paradasDWT[key]

        if (element.paradapor) {
          const index = element.paradapor.Doc.indexOf(doc)
          let tipoParada = ''

          let ubicaciontecnica = ''
          let denominaciondeequipo = ''
          let componente = ''
          let observaciones = '-'
          let objetoDoc = {
            nr: '', //numero del reporte ej 226
            control_T: '', //nombre del reporte DWT
            doc: '', //numero del nuxpedido
          }

          element.tipodemanto.tipo_de_mantto[index] !== 'X'
            ? (tipoParada = element.tipodemanto.tipo_de_mantto[index])
            : null

          element.tipodemanto.ubicaciontecnica[index] !== 'X'
            ? (ubicaciontecnica = element.tipodemanto.ubicaciontecnica[index])
            : null

          element.tipodemanto.denominaciondeequipo[index] !== 'X'
            ? (denominaciondeequipo =
                element.tipodemanto.denominaciondeequipo[index])
            : null

          element.tipodemanto.componente[index] !== 'X'
            ? (componente = element.tipodemanto.componente[index])
            : null

          element.paradapor.observaciones.obs[index] !== 'X'
            ? (observaciones = element.paradapor.observaciones.obs[index])
            : null

          objetoDoc.nr = element.paradapor.idLTYreporte[index]
          objetoDoc.control_T = element.paradapor.name_reporte[index]
          objetoDoc.doc = doc

          let bajaVelocidad = element.paradapor.LRR.doc.filter(
            (nux) => nux === doc
          )

          bajaVelocidad.length > 0
            ? (bajaVelocidad = 'por baja de velocidad.')
            : (bajaVelocidad = 'por parada total.')

          //*-----variables del informe
          let docu_mento = traducir('Documento')
          let tipodedwt = traducir('Tipo de DWT')
          let parada = traducir('Parada')
          let mantenimiento = traducir('Mantenimiento')
          let horainicio = traducir('Hora Inicio')
          let horafin = traducir('Hora Fin')
          let tiempoparado = traducir('Tiempo parado')
          let ubicacion = traducir('Ubicación')
          let equipo = traducir('Equipo')
          let compo_nente = traducir('Componente')
          let impactoenlinea = traducir('Impacto en la línea')
          let observa_ciones = traducir('Observaciones')

          //*---------------------------

          document.getElementById(
            'infoDoc'
          ).innerHTML += `<div>${docu_mento}: <a href="#" onclick='DOC_numero(${JSON.stringify(
            objetoDoc
          )})'>${doc}</a><br>
        ${tipodedwt}: ${traducir(element.paradapor.name_reporte[index])}<br>
        ${parada}: ${traducir(element.paradapor.parada[index])}<br>
        ${mantenimiento}: ${tipoParada}<br>
        &nbsp${horainicio}: ${element.paradapor.ini[index]}<br>
        &nbsp${horafin}: ${element.paradapor.fin[index]}<br>
        &nbsp${tiempoparado}: ${element.paradapor.diferencia.dif[index]}min<br>
        ${ubicacion}: ${ubicaciontecnica}<br>
        ${equipo}: ${denominaciondeequipo}<br>
        ${compo_nente}: ${componente}<br>
        <b>${impactoenlinea} ${traducir(bajaVelocidad)}</b><br><br>
        ${observa_ciones}: ${observaciones}<br>
        </div>`
        }
      }
    }

    $('#informeDelDocumento').modal('toggle')
  }
})

//? configuración
// function lectura_miConfig(tema_guardado,lenguaje_guardado){
//   try {
//     lenguaje(lenguaje_guardado,true)
//     recargaArrays(lenguaje_guardado.toUpperCase());

//   } catch (error) {
//      console.warn(error)
//   }
// }
//?-----------------------------

var traerDia = document.getElementById('traerDia')
traerDia.addEventListener('click', function () {
  console.log('traerDia')
  console.log(fecha_corta_yyyymmdd(new Date()))
  let desde = fecha_corta_yyyymmdd(new Date())
  let hasta = fecha_corta_yyyymmdd(new Date())

  parametrosQuery = `est${tipo_rove},${desde},${hasta}`
  document.getElementById('idtablero').innerText = desde
  tabla.innerHTML = ''

  tabla.width = scrWidth
  armar_primerGrafico(tipo_rove)
  console.log(
    `llama a traer_rove con parámetro ${parametrosQuery} para traer los estándares y tn horarias. Luego direcciona a cargarStandares`
  )
  traer_rove(parametrosQuery, cargarStandares)
})

var filtroPorDia = document.getElementById('botonFILTRO')
filtroPorDia.addEventListener('click', function () {
  console.log('filtrado por fecha')
  console.log(fecha_corta_yyyymmdd(new Date()))
  let desde = fecha_corta_yyyymmdd(new Date())
  let hasta = fecha_corta_yyyymmdd(new Date())
  document.getElementById('fecha_calendarDESDE').value = desde
  document.getElementById('fecha_calendarHASTA').value = hasta
  $('#asignaReporte').modal('toggle')
})

var refresh = document.getElementById('refresh')
refresh.addEventListener('click', function () {
  location.reload(true)
})

$('#botonControl').click(function (e) {
  e.preventDefault()
  let desde = document.getElementById('fecha_calendarDESDE').value
  let hasta = desde
  parametrosQuery = `est${tipo_rove},${desde},${hasta}`
  console.log('Consulta a: >>> ' + parametrosQuery)
  document.getElementById('idtablero').innerText = desde
  tabla.innerHTML = ''
  tabla.width = scrWidth
  armar_primerGrafico(tipo_rove)
  console.log('llama a traer_rove para traer los estándares y tn horarias')
  traer_rove(parametrosQuery, cargarStandares)
})

function cargarStandares(respuesta) {
  console.log(
    'sigue en el modulo ROVE, tiene ',
    respuesta.length,
    ' horas de producción.'
  )

  if (respuesta.length > 0) {
    getStandares(tabla, respuesta)

    // document.getElementById("nombreDeTabla").innerText = traducir(tipo_rove.toLocaleUpperCase());
    const promise = Promise.resolve(respuesta)
    promise.then((value) => {
      pintar_barras(tabla)
      indicadores(tabla, value)
      //* agregamos una linea al final
      let contenidoClase = contenidoRow(
        '"border-top-0 border-bottom-0 border-left-0 font-weight-bold bg-white"',
        'style="font-size:10px; width:5px;text-align:center;"',
        'style="font-size:10px; width:5px;text-align:center;"',
        'style="font-size:10px; width:5px;text-align:center;"',
        'style="font-size:10px; width:5px;text-align:center;"',
        ''
      )
      $(`#${tabla.id}`).append(contenidoClase)

      //?traemos los dwt
      parametrosQuery = parametrosQuery.replace('est', 'dwt')
      console.log('llama a traer_rove para traer DWTs')
      traer_rove(parametrosQuery, preparaCargaDWT)
    })
  } else {
    let mensaje = 'No hay datos que mostrar para esta fecha de hoy.'
    let icono = 'error'
    // let titulo = traducir("No hay datos.");
    tabla.innerHTML = ''
    alertAceptar(mensaje, icono, titulo, noHacerNada, '')
  }
}

function preparaCargaDWT(respuesta) {
  //?formatamos el query de los DWT's en un objeto con la info necesaria

  // console.log(respuesta);

  const promise = Promise.resolve(respuesta)
  promise.then((value) => {
    CargaDWT(tabla, respuesta)

    //* agregamos la linea gris con los titutlos

    let contenidoClase = contenidoRow(
      '',
      'style="font-size:10px; width:5px;text-align:center;background-color:grey"',
      'style="font-size:10px; width:5px;text-align:center;background-color:grey"',
      'style="font-size:10px; width:5px;text-align:center;background-color:grey"',
      'style="font-size:10px; width:5px;text-align:center;background-color:grey"',
      ''
    )

    $(`#${tabla.id}`).append(contenidoClase)
    let ultima_fila = document.getElementById(tabla.id).rows.length - 1
    tabla.rows[ultima_fila].cells[0].innerText = 'DWT '
    negrita(tabla, ultima_fila, 0)
    tabla.rows[ultima_fila].cells[1].innerText = 'Doc '
    negrita(tabla, ultima_fila, 1)
    tabla.rows[ultima_fila].cells[2].innerText = 'Total '
    negrita(tabla, ultima_fila, 2)

    //**-------comenzamos la lectura del objeto para el pintado de los DW */
    pintamos(paradasDWT, tabla)
    // console.clear();

    console.log(
      `llama a traer_rove con parámetro ${parametrosQuery} para completar los documentos`
    )
    parametrosQuery = parametrosQuery.replace('dwt', 'doc')
    traer_rove(parametrosQuery, cargarDocumentos)
  })
}

function cargarDocumentos(respuesta) {
  // console.log(respuesta)
  try {
    if (respuesta.length > 0) {
      arrayDocumentos = [...respuesta]
    }
  } catch (error) {
    console.warn(error)
  }
  console.timeEnd('miTemporizador')
  console.log('res', respuesta_modulo)
}

function armaDocumentsTons(array) {
  let docs = document.getElementById('docs')
  docs.innerHTML = ''
  let br = document.createElement('br')

  for (let i = 0; i < array[0].doc.length; i++) {
    let div = document.createElement('div')
    let anchor = document.createElement('a')
    anchor.href = '#'
    anchor.addEventListener('click', function () {
      DOC_Tn(array, i)
    })
    anchor.appendChild(document.createTextNode(array[0].doc[i]))
    div.appendChild(anchor)
    div.appendChild(br)
    docs.appendChild(div)
  }

  $('#documents').modal('toggle')
}

function DOC_Tn(array, i) {
  let origen = window.location.origin
  let pathname = window.location.pathname
  pathname = pathname.replace('rove/rove.php', '')
  let mensaje =
    'control_N=' + //numero de idLTYreporte
    array[0].idRepo[i] +
    '&' +
    'control_T=' +
    array[0].repo[i] + //nombre del DWT reporte
    '&nr=' +
    array[0].doc[i] //numero del doc
  window.open(
    origen +
      pathname +
      'control/index.php?' +
      mensaje +
      '&' +
      Math.round(Math.random() * 10),
    '_blank'
  )

  $('#documents').modal('hide')
}

function traer_rove(sql, cFuncion) {
  let rax = '&new=' + new Date()
  var ruta = './routes/traer_rove.php?q=' + sql + rax

  fetch(ruta, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      cFuncion(data)
      return
    })
    .catch((error) => {
      console.warn(error)
    })
}

function traerRegistros(sql, cFuncion) {
  if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    var xmlhttp = new XMLHttpRequest()
  } else {
    // code for IE6, IE5
    var xmlhttp = new ActiveXObject('Microsoft.XMLHTTP')
  }

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === XMLHttpRequest.DONE && xmlhttp.status === 200) {
      let foo = []
      xmlhttp.status === 200 ? (foo = JSON.parse(xmlhttp.responseText)) : null

      cFuncion(foo)
    } else {
    }
  }
  var qq = '../traer_registros.php?q=' + sql + '&new=' + new Date()

  xmlhttp.open('GET', qq, true)
  xmlhttp.send()
}

function alertAceptar(mensaje, icono, titulo, fucnXion, VariaBle) {
  Swal.fire({
    //position: "top-start",
    title: titulo,
    icon: icono,
    html: mensaje,
    showCloseButton: true,
    //showCancelButton: true,
    focusConfirm: false,
    //cancelButtonText: '<i class="fas fa-thumbs-down"></i> Cancelar',
    confirmButtonText: '<i class="fas fa-thumbs-up"></i> Acepte!',
  }).then((result) => {
    if (result.value) {
      fucnXion(VariaBle)
    }
  })
}

function negrita(tabla, row, col) {
  tabla.rows[row].cells[col].style.fontWeight = '900'
}

function salida() {
  throw 'Something went badly wrong!'
}

function noHacerNada() {
  console.log('No hacer nada')
}

function Salir() {
  window.close()
}
