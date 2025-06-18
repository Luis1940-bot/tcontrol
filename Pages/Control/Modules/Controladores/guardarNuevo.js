// eslint-disable-next-line import/extensions
import fechasGenerator from '../../../../controllers/fechas.js';
// eslint-disable-next-line import/extensions
import respuestaColumna from './armadoDeObjetos.js';
// // eslint-disable-next-line import/extensions
// import guardaNotas from './guardaNotas.js';
// eslint-disable-next-line import/extensions, import/no-useless-path-segments
import { encriptar, desencriptar } from '../../../../controllers/cript.js';

function buscarEnArray(id, array) {
  try {
    const idStr = id.toString().trim();
    const resultado = array.find((registro) => registro[1] === idStr);
    return resultado;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return null;
  }
}

function convertirObjATextPlano(obj) {
  const data = { ...obj };
  console.log(data);
  delete data.src;
  const lines = [];

  // Iterar sobre las claves del objeto
  Object.keys(data).forEach((key) => {
    // Obtener el valor asociado a la clave
    const values = data[key];

    // Crear una línea de texto concatenando la clave y sus valores
    // const line = `${key}: ${JSON.stringify(values).replace(/\\/g, '')}`;
    const line = `${key}: ${JSON.stringify(values)}`;

    // Agregar la línea al arreglo
    lines.push(line);
  });

  // Convertir el arreglo de líneas a un solo texto con saltos de línea
  const plainText = lines.join(',');

  return `{${plainText}}`;
}

function tuFuncion(
  objetoControl,
  founded,
  planta,
  reporte,
  notificador,
  mailUser,
  fechaActual,
  horaActual,
  supervisor,
) {
  // Crea una copia del objeto para evitar modificar el parámetro directamente
  let emailSupervisor = '';
  if (supervisor) {
    emailSupervisor = `/${supervisor}`;
  }
  const objetoControlCopia = { ...objetoControl };
  // eslint-disable-next-line prefer-destructuring
  objetoControlCopia.email.address = `${founded[28]}${emailSupervisor}`;
  objetoControlCopia.email.planta = planta;
  objetoControlCopia.email.titulo = 'Notificación del sistema de alerta';
  objetoControlCopia.email.reporte = reporte;
  objetoControlCopia.email.fecha = fechaActual;
  objetoControlCopia.email.hora = horaActual;
  objetoControlCopia.email.notificador = notificador;
  objetoControlCopia.email.url = 'https://tenkiweb.com/tcontrol';
  objetoControlCopia.email.mailNotificador = mailUser;

  // Puedes retornar la copia del objeto si es necesario
  return objetoControlCopia;
}

function recorroTable(objetoControl, arrayControl, nux, plant, carpeta) {
  try {
    const person = desencriptar(sessionStorage.getItem('user'));
    const idPerson = person.id;
    // const email = document.getElementById('idCheckBoxEmail').checked;
    // const url = new URL(window.location.href);
    const contenido = sessionStorage.getItem('contenido');
    const url = desencriptar(contenido);
    const controlN = url.control_N; // url.searchParams.get('control_N');
    // const controlT = url.searchParams.get('control_T');
    // const numberDoc = document.getElementById('numberDoc').textContent;
    // const tbody = document.querySelector('tbody')
    const table = document.getElementById('tableControl');
    const tbody = table.querySelector('tbody');
    const tr = tbody.querySelectorAll(':scope > tr');
    // const tr = tbody.querySelectorAll('tr');
    let estanTodosLosRequeridos = true;
    let emailSupervisor = null;
    let supervisor = desencriptar(sessionStorage.getItem('firmado'));

    // eslint-disable-next-line max-len
    supervisor.id === 0
      ? (supervisor = 0)
      : ((supervisor = Number(supervisor.id)),
        (emailSupervisor = desencriptar(
          sessionStorage.getItem('firmado'),
        ).mail));

    let founded;
    let fechaActual = '';
    let horaActual = '';
    // let nuxpedido;
    // if (nux === false) {
    //   nuxpedido = 0;
    // } else {
    //   nuxpedido = nux;
    // }
    // eslint-disable-next-line no-plusplus
    const largoTr = tr.length;

    for (let i = 0; i < largoTr; i++) {
      const td = tr[i].querySelectorAll('td');
      // const elementoPruebaDeTabla = td[2];
      const swap = true;

      if (swap) {
        // console.log(swap, i, td);
        // }
        let valor;
        let selector1;
        let selector2;
        let valorS;
        let valorOBS;
        let familiaselector;
        // const valid = false;
        // let imagenes;
        let observacion;
        let respuesta;

        // eslint-disable-next-line no-unused-vars
        const displayRow = window.getComputedStyle(tr[i]).display;
        // eslint-disable-next-line no-plusplus
        for (let c = 2; c <= 4; c += 1) {
          const displayCell = window.getComputedStyle(td[c]).display;
          const element = td[c];
          const campo = td[1];

          let node;
          let datoCelda;
          let valueCelda;
          if (element.childNodes.length > 0) {
            [node] = element.childNodes;
            datoCelda = node?.data || null;
            valueCelda = node?.value || null;
          } else {
            // Si no hay nodos hijos, recupera el valor directamente del td
            node = null;
            datoCelda = element.textContent || null;
            valueCelda = null;
            // console.warn(
            //   `El td en la columna ${c} no tiene nodos hijos. Valor de la celda: ${datoCelda}`
            // )
          }

          // const node = element.childNodes[0]
          // const datoCelda = element.childNodes[0].data
          // const valueCelda = element.childNodes[0].value
          const colspanValue = td[1].getAttribute('colspan');
          const inputElement = element.querySelector('input');
          const { nodeType } = node;
          const { type } = node;
          const { tagName } = node;
          let childeNode0;
          let inputmode;
          let select;
          const checkbox = node.checked;
          const radio = node.checked;
          let divConsultas;
          let liImages;
          const selector = null;
          const terceraColumna = td[3].firstChild;

          let imagenes = {
            src: [],
            fileName: [],
            extension: [],
            plant: [],
            carpeta: [],
          };

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
          };

          if (c === 2) {
            respuesta = respuestaColumna(c, i, objParametros);
            ({ valor, selector1, valorS, familiaselector } = respuesta);
            i === 0 && type === 'date' ? objetoControl.fecha.push(valor) : null;
            i === 1 && type === 'time' ? objetoControl.hora.push(valor) : null;
          }
          if (c === 4) {
            respuesta = respuestaColumna(c, i, objParametros, plant, carpeta);
            ({ selector2, valorOBS, familiaselector, imagenes, observacion } =
              respuesta);
          }
          if (c === 4) {
            const tdCount = tr[i].cells.length;
            let valorTd5;
            if (tdCount > 5) {
              valorTd5 = td[5].textContent.trim();
            }

            const esNumero = /^\d+$/.test(valorTd5);
            if (tdCount === 6 && esNumero) {
              founded = buscarEnArray(td[5].textContent, arrayControl);
            } else if (tdCount === 5 && esNumero) {
              founded = buscarEnArray(td[4].textContent, arrayControl);
            }

            const tipoDeDatoFounded = founded[5] || 'table';
            if (!valor && tipoDeDatoFounded === 'table') {
              valor = 'table';
            }
            objetoControl.name.push(campo.textContent);
            fechaActual = fechasGenerator.fecha_corta_yyyymmdd(new Date());
            horaActual = fechasGenerator.hora_actual(new Date());
            // objetoControl.fecha.push(fechaActual)
            // objetoControl.hora.push(valor)

            objetoControl.nuxpedido.push(0);
            valor !== null
              ? objetoControl.valor.push(valor)
              : objetoControl.valor.push(founded[5]);
            objetoControl.desvio.push(founded[2]);
            objetoControl.idusuario.push(idPerson);
            objetoControl.tipodedato.push(tipoDeDatoFounded);
            objetoControl.idLTYreporte.push(controlN);
            objetoControl.idLTYcontrol.push(founded[1]);
            // eslint-disable-next-line max-len
            supervisor === 0
              ? objetoControl.supervisor.push(0)
              : objetoControl.supervisor.push(supervisor);
            objetoControl.tpdeobserva.push(founded[9]);
            // eslint-disable-next-line max-len
            selector1 !== null
              ? objetoControl.selector.push(selector1)
              : objetoControl.selector.push(0);
            // eslint-disable-next-line max-len
            selector2 !== null
              ? objetoControl.selector2.push(selector2)
              : objetoControl.selector2.push(0);
            objetoControl.valorS.push(valorS);
            objetoControl.valorOBS.push(valorOBS);
            objetoControl.familiaselector.push(familiaselector);
            objetoControl.observacion.push(observacion);
            objetoControl.requerido.push(founded[21]);
            console.log(imagenes);
            if (imagenes.src.length > 0) {
              const convertido = convertirObjATextPlano(imagenes);
              console.log(convertido);
              objetoControl.imagenes.push(convertido);
              objetoControl.objImagen.push(imagenes);
            } else {
              objetoControl.imagenes.push('');
            }
            objetoControl.displayRow.push(displayRow);
            // objetoControl.detalle.push(terceraColumna.textContent)

            // console.log(typeof founded[21], founded[21], valor);
            if (
              founded[21] === '0' ||
              founded[21] === null ||
              founded[21] === undefined
            ) {
              estanTodosLosRequeridos = true;
            }
            if (
              founded[21] === '1' &&
              (valor === '' || valor === null || valor === undefined)
            ) {
              estanTodosLosRequeridos = false;
              const requerido = {
                requerido: false,
                fila: i,
                idLTYcontrol: founded[1],
              };
              sessionStorage.setItem('requerido', encriptar(requerido));
              return false;
              // eslint-disable-next-line max-len
            }
          }
          if (c === 3) {
            const tipoDatoDetalle = arrayControl[i][33];
            objetoControl.tipoDatoDetalle.push(tipoDatoDetalle);
            console.log(tipoDatoDetalle, td[3]);
            if (tipoDatoDetalle === 'checkhour') {
              const inputElement3 = td[3].querySelector('div > input');
              let detalle = inputElement3.value;
              detalle = detalle.replace(':', '.');
              objetoControl.detalle.push(detalle);
            } else if (tipoDatoDetalle === 'x') {
              objetoControl.detalle.push(terceraColumna.textContent);
            }
          }
        }
      } else {
        estanTodosLosRequeridos = true;
      }
      console.log(objetoControl);
    }
    // console.log(objetoMemoria);
    // console.log(objetoControl)
    // console.log(arrayControl);
    // console.log(estanTodosLosRequeridos);
    const planta = document.getElementById('planta').textContent;
    const reporte = document.getElementById('wichC').textContent;
    const persona = desencriptar(sessionStorage.getItem('user'));
    const notificador = persona.person;
    const mailUser = person.mail;
    // eslint-disable-next-line no-unused-vars, max-len
    const objetoControlModificado = tuFuncion(
      objetoControl,
      founded,
      planta,
      reporte,
      notificador,
      mailUser,
      fechaActual,
      horaActual,
      emailSupervisor,
    );
    if (estanTodosLosRequeridos) {
      const requerido = {
        requerido: true,
        fila: 0,
        idLTYcontrol: 0,
      };
      sessionStorage.setItem('requerido', encriptar(requerido));
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
  return true;
}

function checaRequeridos(estanTodosLosRequeridos, requeridoVacio) {
  try {
    const requerido = {
      requerido: estanTodosLosRequeridos,
      fila: 0,
      idLTYcontrol: requeridoVacio,
    };
    sessionStorage.setItem('requerido', encriptar(requerido));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}

function pushValoresObjetoControl(objetoControl, valores, arrayControl, i) {
  try {
    const person = desencriptar(sessionStorage.getItem('user'));
    const idPerson = person.id;
    const contenido = sessionStorage.getItem('contenido');
    const url = desencriptar(contenido);
    const controlN = url.control_N;

    let emailSupervisor = null;
    let supervisor = desencriptar(sessionStorage.getItem('firmado'));
    if (supervisor.id === 0) {
      supervisor = 0;
    } else {
      supervisor = Number(supervisor.id);
      emailSupervisor = desencriptar(sessionStorage.getItem('firmado')).mail;
    }
    const fechaActual = fechasGenerator.fecha_corta_yyyymmdd(new Date());
    const horaActual = fechasGenerator.hora_actual(new Date());
    const {
      valor1,
      valor2,
      valorObs,
      valorCelda3,
      valorCelda33,
      tipoDeDato,
      tipoDeObservacion,
    } = valores;
    objetoControl.name.push(arrayControl[i][3]);
    objetoControl.nuxpedido.push(0);
    objetoControl.desvio.push(arrayControl[i][2]);
    objetoControl.idusuario.push(idPerson);
    objetoControl.tipodedato.push(arrayControl[i][5]);
    objetoControl.idLTYreporte.push(controlN);
    objetoControl.idLTYcontrol.push(arrayControl[i][1]);
    supervisor === 0
      ? objetoControl.supervisor.push(0)
      : objetoControl.supervisor.push(supervisor);
    objetoControl.tpdeobserva.push(arrayControl[i][9]);
    objetoControl.selector.push(arrayControl[i][12]);
    objetoControl.selector2.push(arrayControl[i][15]);
    objetoControl.valorS.push(arrayControl[i][13]);
    objetoControl.valorOBS.push(arrayControl[i][16]);
    objetoControl.familiaselector.push(arrayControl[i][14]);
    objetoControl.observacion.push(valorObs || '');
    objetoControl.requerido.push(arrayControl[i][21]);
    if (tipoDeDato === 'img') {
      if (valorCelda3.src > 0) {
        objetoControl.imagenes.push(valorCelda3);
        objetoControl.objImagen.push(valorCelda3);
      } else {
        objetoControl.imagenes.push('');
      }
    }
    objetoControl.displayRow.push(arrayControl[i][22] || 'none');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}

// Devuelve un objeto {valor1, valor2} según los tipos de dato de arrayControl (pos 5 y 9), calculando la celda relevante para cada uno
function obtenerValoresPorTipos(
  fila,
  tipo1,
  tipo2,
  arrayControl,
  filaIndex,
  plant,
  carpeta,
) {
  const celdas = fila.querySelectorAll('td');
  const faltanRequeridos = arrayControl[filaIndex][1];

  // --- Lógica para valor1 (tipo1) ---
  let celda1;
  // Tipos especiales que se leen en celda 1 (índice 1) si colspan=4
  const tiposCelda1 = ['l', 'title', 'subt'];
  if (
    tiposCelda1.includes(tipo1) &&
    parseInt(celdas[1]?.getAttribute('colspan') || '1', 10) === 4
  ) {
    // eslint-disable-next-line prefer-destructuring
    celda1 = celdas[1];
  } else {
    // Para todos los demás tipos, se lee de la celda 2 (índice 2)
    // eslint-disable-next-line prefer-destructuring
    celda1 = celdas[2];
  }

  // --- Lógica para valor2 (tipo2) ---
  // Se mantiene la lógica anterior para valor2, pero puedes adaptarla igual si lo deseas
  let celdaIndex2 = 4;
  switch (tipo2) {
    case 'd':
    case 'h':
    case 't':
    case 'tx':
    case 'pastillaTx':
      celdaIndex2 = 2;
      break;
    case 'obs':
      celdaIndex2 = 4;
      break;
    case 'checkhour':
      celdaIndex2 = 3;
      break;
    case 'pastillatx':
    case 'pastillase':
    case 'pastillaco':
      celdaIndex2 = 3;
      break;
    default:
      if (
        arrayControl &&
        arrayControl[filaIndex] &&
        arrayControl[filaIndex][35]
      ) {
        celdaIndex2 = parseInt(arrayControl[filaIndex][35], 10) || 4;
      } else {
        celdaIndex2 = 4;
      }
      break;
  }
  let offset2 = 0;
  for (let i = 0; i < celdaIndex2; i++) {
    const colspan = parseInt(celdas[i]?.getAttribute('colspan') || '1', 10);
    if (colspan > 1) {
      offset2 += colspan - 1;
    }
  }
  const realIndex2 = celdaIndex2 + offset2;
  const celda2 = celdas[realIndex2] || celdas[celdaIndex2] || celdas[4];

  // --- Extracción de valores ---
  function extraerValor(celda, tipo) {
    if (!celda) return '';
    if (tipo === 'x') return '';

    // checaRequeridos(faltanRequeridos);
    switch (tipo) {
      case 'table':
        return '';
      case 'd':
        return (
          celda.querySelector('input[type="date"]')?.value || celda.textContent
        );
      case 'h':
        return (
          celda.querySelector('input[type="time"]')?.value || celda.textContent
        );
      case 't':
        return (
          celda.querySelector('textarea')?.value ||
          celda.querySelector('input[type="text"]')?.value ||
          celda.textContent
        );
      case 'tx':
        return (
          celda.querySelector('textarea')?.value ||
          celda.querySelector('input[type="text"]')?.value ||
          celda.textContent
        );
      case 'n':
        return (
          celda.querySelector('input[type="number"]')?.value ||
          celda.textContent
        );
      case 'img': {
        let lis;
        const ul = Array.from(celda.childNodes).find(
          (node) => node.nodeType === 1 && node.tagName === 'UL',
        );
        if (ul) {
          lis = Array.from(ul.children).filter(
            (child) => child.tagName === 'LI',
          );
          const imagenes = {
            src: [],
            fileName: [],
            extension: [],
            plant: [],
            carpeta: [],
          };
          lis.forEach((li) => {
            const img = li.querySelector('img');
            if (img) {
              const { src, alt } = img;
              const { extension, filename, fileextension } = img.dataset;
              imagenes.src.push(src);
              imagenes.fileName.push(filename || alt);
              imagenes.extension.push(fileextension || extension);
              imagenes.plant.push(plant.value);
              imagenes.carpeta.push(carpeta);
            }
          });
          if (lis.length > 0) {
            // const info = `{"img": "${imagen}", "width" : ${width}, "height": ${height}}`;
            const convertido = convertirObjATextPlano(imagenes);
            return convertido;
          }
        }

        return '';
      }

      case 's':
      case 'sd': {
        const select = celda.querySelector('select');
        return select && select.options[select.selectedIndex]
          ? select.options[select.selectedIndex].text
          : celda.textContent;
      }
      case 'cn':
        return celda.querySelector('input[type="text"]')?.value || '';
      case 'btnqwery':
        return celda.querySelector('button')?.textContent || celda.textContent;
      case 'b':
        return celda.querySelector('input[type="checkbox"]')?.checked ? 1 : 0;
      case 'r': {
        const radio = celda.querySelector('input[type="radio"]:checked');
        return radio ? 1 : 0;
      }
      case 'photo': {
        const img = celda.querySelector('img');
        if (img) {
          const { alt } = img;
          // const { src } = img;
          const { width } = img;
          const { height } = img;
          const { extension } = img.dataset;
          const imagen = `${alt}.${extension}`;
          const info = `{"img": "${imagen}", "width" : ${width}, "height": ${height}}`;
          return info;
        }
        return null;
      }
      case 'l':
      case 'subt':
      case 'title':
      case 'valid': {
        const input = celda.querySelector('input[type="text"]');
        return input ? input.value : '';
      }
      case 'checkhour': {
        // Primero intenta input[type="time"], si no existe busca input[type="text"]
        const inputTime = celda.querySelector('input[type="time"]');
        if (inputTime) return inputTime.value;
        const inputText = celda.querySelector('input[type="text"]');
        return inputText ? inputText.value : celda.textContent;
      }
      case 'checkdate': {
        // Primero intenta input[type="date"], si no existe busca input[type="text"]
        const inputDate = celda.querySelector('input[type="date"]');
        if (inputDate) return inputDate.value;
        const inputText = celda.querySelector('input[type="text"]');
        return inputText ? inputText.value : celda.textContent;
      }
      case 'checkdateh': {
        // Busca ambos, si no existen busca input[type="text"]
        const dateInput = celda.querySelector('input[type="date"]');
        const timeInput = celda.querySelector('input[type="time"]');
        if (dateInput || timeInput) {
          const dateVal = dateInput ? dateInput.value : '';
          const timeVal = timeInput ? timeInput.value : '';
          return (dateVal + (dateVal && timeVal ? ' ' : '') + timeVal).trim();
        }
        const inputText = celda.querySelector('input[type="text"]');
        return inputText ? inputText.value : celda.textContent;
      }
      case 'pastillatx':
      case 'pastillase':
      case 'pastillaco': {
        // Buscar todos los span.label-email dentro de div.pastilla
        const pastillas = celda.querySelectorAll('.pastilla .label-email');
        const valores = Array.from(pastillas).map((span) =>
          span.textContent.trim(),
        );
        return valores.join('-');
      }
      default:
        return celda.textContent;
    }
  }

  const valor1 = extraerValor(celda1, tipo1);
  const valor2 = extraerValor(celda2, tipo2);
  const valorObs = extraerValor(celdas[4], tipo2);
  const valorCelda3 = extraerValor(celdas[3], tipo1);
  const valorCelda33 = extraerValor(celdas[3], 't');
  const requeridoVacio = arrayControl[filaIndex][21] || 0;

  if (
    (valor1 === undefined ||
      valor1 === null ||
      (typeof valor1 === 'string' && valor1.trim() === '')) &&
    Number(requeridoVacio) === 1
  ) {
    checaRequeridos(false, faltanRequeridos);
    return false;
  }
  checaRequeridos(true, 0);
  return {
    valor1,
    valor2,
    valorObs,
    valorCelda3,
    valorCelda33,
    tipoDeDato: tipo1,
    tipoDeObservacion: tipo2,
  };
}

function recorroFullTable(objetoControl, arrayControl, nux, plant, carpeta) {
  try {
    console.log(objetoControl);
    const table = document.getElementById('tableControl');
    const tbody = table.querySelector('tbody');
    const filas = tbody.querySelectorAll(':scope > tr');

    // const objParametros = {
    //   displayCell,
    //   element,
    //   node,
    //   datoCelda,
    //   valueCelda,
    //   colspanValue,
    //   inputElement,
    //   nodeType,
    //   type,
    //   tagName,
    //   inputmode,
    //   childeNode0,
    //   select,
    //   checkbox,
    //   radio,
    //   divConsultas,
    //   liImages,
    //   selector,
    //   imagenes,
    //   terceraColumna,
    // };

    // Estructura para guardar los valores de todos los hijos de cada celda
    const resultadoTabla = [];
    for (let i = 0; i < filas.length; i++) {
      const resultadoFila = [];
      const fila = filas[i];
      const celdas = fila.querySelectorAll('td');
      let valores;
      // Leer el valor de la última celda de la fila
      if (celdas.length > 0) {
        // Obtener los valores principales de la fila
        valores = obtenerValoresPorTipos(
          fila,
          arrayControl[i][5], // tipoDeDato
          arrayControl[i][9], // tipoDeObservacion
          arrayControl,
          i,
          plant,
          carpeta,
        );
        if (valores === false) {
          // Detener el flujo y salir de la función si hay requeridos faltantes
          return false;
        }
        const {
          valor1,
          valor2,
          valorObs,
          valorCelda3,
          valorCelda33,
          tipoDeDato,
          tipoDeObservacion,
        } = valores;
        // Guardar los valores en el resultado de la fila
        resultadoFila.push({
          valor1,
          valor2,
          valorObs,
          valorCelda3,
          valorCelda33,
          tipoDeDato,
          tipoDeObservacion,
        });
      }
      pushValoresObjetoControl(objetoControl, valores, arrayControl, i);
      // ...puedes seguir agregando info de celdas si lo necesitas...
      resultadoTabla.push(resultadoFila);
    }
    // Al final del recorrido, loguea la estructura de valores extraídos
    console.log('Valores extraídos por fila:', resultadoTabla);
    return '';
  } catch (error) {
    console.log(error);
    return '';
  }
}

function guardarNuevo(objetoControl, arrayControl, nuxpedido, planta, carpeta) {
  // console.log(objetoControl, arrayControl, nuxpedido)

  return recorroFullTable(
    objetoControl,
    arrayControl,
    nuxpedido,
    planta,
    carpeta,
  );
}

export default guardarNuevo;
