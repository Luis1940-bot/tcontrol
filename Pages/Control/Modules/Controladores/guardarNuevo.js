// eslint-disable-next-line import/extensions
import fechasGenerator from '../../../../controllers/fechas.js';
// eslint-disable-next-line import/extensions
// import respuestaColumna from './armadoDeObjetos.js';
// // eslint-disable-next-line import/extensions
// import guardaNotas from './guardaNotas.js';
// eslint-disable-next-line import/extensions, import/no-useless-path-segments
import { encriptar, desencriptar } from '../../../../controllers/cript.js';

// function convertirObjATextPlano(obj) {
//   const data = { ...obj };
//   // console.log(data);
//   delete data.src;

//   // Simplemente retornar JSON válido directamente
//   return JSON.stringify(data);
// }

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

function pushValoresObjetoControl(
  objetoControl,
  valores,
  arrayControl,
  i,
  displayRow,
) {
  try {
    // console.log(valores);
    // Clonar profundamente el objetoControl
    const objetoControlClonado = JSON.parse(JSON.stringify(objetoControl));
    const person = desencriptar(sessionStorage.getItem('user'));
    const idPerson = Number(person.id);
    const notificador = person.person;
    const mailUser = person.mail;
    const contenido = sessionStorage.getItem('contenido');
    const url = desencriptar(contenido);
    const controlN = Number(url.control_N);
    const planta = document.getElementById('planta').textContent;
    const reporte = document.getElementById('wichC').textContent;
    let valorSinSrc = '';
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
    // ...existing code...
    let valorFinal = valor1 || valor2 || '';
    if (
      (tipoDeDato === 's' || tipoDeDato === 'sd') &&
      valores &&
      typeof valorFinal === 'object' &&
      valorFinal.sel
    ) {
      valorFinal = valorFinal.sel;
    } else if (tipoDeDato === 'n') {
      valorFinal = Number(valorFinal);
    }
    objetoControlClonado.valor.push(valorFinal);
    // --- Ajuste para valorS ---
    let valorSFinal = valor1 || valor2 || 0;
    if (
      (tipoDeDato === 's' || tipoDeDato === 'sd') &&
      valores &&
      typeof valorSFinal === 'object' &&
      valorSFinal.valor !== undefined
    ) {
      valorSFinal = Number(valorSFinal.valor);
    } else {
      valorSFinal = 0;
    }
    objetoControlClonado.valorS.push(valorSFinal);
    // --- Ajuste para valorOBS ---
    let valorOBSFinal = valorObs || 0;
    if (
      (tipoDeObservacion === 's' || tipoDeObservacion === 'sd') &&
      valores &&
      typeof valorOBSFinal === 'object' &&
      valorOBSFinal.valor !== undefined
    ) {
      valorOBSFinal = Number(valorOBSFinal.valor);
    } else {
      valorOBSFinal = 0;
    }
    objetoControlClonado.valorOBS.push(valorOBSFinal);
    // --- Ajuste para selector ---
    let valorSelector = valor1 || valor2 || 0;
    if (
      (tipoDeDato === 's' || tipoDeDato === 'sd') &&
      valores &&
      typeof valorSelector === 'object' &&
      valorSelector.valor !== undefined
    ) {
      valorSelector = valorSelector.valor;
    } else {
      valorSelector = 0;
    }
    objetoControlClonado.selector.push(valorSelector);
    // --- Ajuste para selector2 ---
    let valorSelector2 = valorObs || 0;
    if (
      (tipoDeObservacion === 's' || tipoDeObservacion === 'sd') &&
      valores &&
      typeof valorSelector2 === 'object' &&
      valorSelector2.valor !== undefined
    ) {
      valorSelector2 = valorSelector2.valor;
    } else {
      valorSelector2 = 0;
    }
    objetoControlClonado.selector2.push(valorSelector2);
    objetoControlClonado.fecha.push(fechaActual);
    objetoControlClonado.hora.push(horaActual);
    objetoControlClonado.name.push(arrayControl[i][3]);
    objetoControlClonado.nuxpedido.push(0);
    objetoControlClonado.desvio.push(arrayControl[i][2]);
    objetoControlClonado.idusuario.push(idPerson);
    objetoControlClonado.tipodedato.push(arrayControl[i][5]);
    objetoControlClonado.idLTYreporte.push(controlN);
    objetoControlClonado.idLTYcontrol.push(arrayControl[i][1]);
    supervisor === 0
      ? objetoControlClonado.supervisor.push(0)
      : objetoControlClonado.supervisor.push(supervisor);
    objetoControlClonado.tpdeobserva.push(arrayControl[i][9]);
    objetoControlClonado.familiaselector.push(arrayControl[i][14]);
    // --- Ajuste para observacion ---
    let observacionFinal = valorObs;
    if (typeof observacionFinal === 'string') {
      observacionFinal = observacionFinal.trim();
    }
    if (
      tipoDeObservacion === 'btnqwery' ||
      tipoDeObservacion === 'checkhour' ||
      tipoDeObservacion === 'checkdate' ||
      tipoDeObservacion === 'checkdateh'
    ) {
      observacionFinal = '';
    } else if (
      observacionFinal &&
      typeof observacionFinal === 'object' &&
      observacionFinal.sel
    ) {
      observacionFinal = observacionFinal.sel;
    }
    objetoControlClonado.observacion.push(observacionFinal || '');
    objetoControlClonado.requerido.push(arrayControl[i][21]);
    // objetoControlClonado.imagenes.push('');
    if (tipoDeDato === 'img' && valorCelda3) {
      if (valorCelda3) {
        // Crear un objeto sin la clave 'src' si valorCelda3 es un string JSON
        valorSinSrc = valorCelda3;
        if (typeof valorCelda3 === 'string') {
          try {
            const parsedData = JSON.parse(valorCelda3);
            const { src, ...objetoSinSrc } = parsedData;
            valorSinSrc = JSON.stringify(objetoSinSrc);
            // .replace(/"/g, "'")  // Cambiar comillas dobles por simples
            // .replace(/\\\//g, "/");  // Limpiar barras invertidas de escape
          } catch (error) {
            // Si no se puede parsear, mantener el valor original
            // console.log('Error parsing valorCelda3:', error);
            valorSinSrc = valorCelda3;
          }
        }
        // console.log(valorSinSrc)
        objetoControlClonado.imagenes.push(valorSinSrc);
        objetoControlClonado.objImagen.push(valorCelda3);
      } else {
        objetoControlClonado.imagenes.push('');
      }
    } else {
      objetoControlClonado.imagenes.push('');
    }
    objetoControlClonado.displayRow.push(displayRow);
    const detalle = valorCelda3 || valorCelda33 || '';

    if (tipoDeDato !== 'tablex') {
      if (tipoDeDato === 'img') {
        // Si es imagen, guarda el detalle solo si valorCelda3 existe
        if (valorCelda3) {
          objetoControlClonado.detalle.push(String(valorSinSrc));
        } else {
          objetoControlClonado.detalle.push('');
        }
      } else {
        objetoControlClonado.detalle.push(String(detalle));
      }
    } else {
      objetoControlClonado.detalle.push(String(detalle));
    }

    objetoControlClonado.tipoDatoDetalle.push(arrayControl[i][33] || 'x');

    // Actualizar el objetoControl original con los datos del clonado
    Object.keys(objetoControl).forEach((key) => {
      // eslint-disable-next-line no-param-reassign
      objetoControl[key] = objetoControlClonado[key];
    });
    // eslint-disable-next-line no-unused-vars
    const objetoControlModificado = tuFuncion(
      objetoControl,
      arrayControl[0][28],
      planta,
      reporte,
      notificador,
      mailUser,
      fechaActual,
      horaActual,
      emailSupervisor,
    );
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
  // console.log(fila, tipo1, tipo2, arrayControl, filaIndex, plant, carpeta);
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
      case 'tablex':
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
      case 'n': {
        const inputNumber = celda.querySelector('input[type="text"]');
        if (
          inputNumber &&
          inputNumber.value !== undefined &&
          inputNumber.value !== ''
        ) {
          return Number(inputNumber.value);
        }
        return Number(celda.textContent);
      }
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
            // Usar JSON.stringify directamente en lugar de convertirObjATextPlano
            return JSON.stringify(imagenes);
          }
        }

        return '';
      }

      case 's':
      case 'sd': {
        const select = celda.querySelector('select');

        if (!select) {
          return '';
        }

        // Verificar si hay una opción seleccionada válida
        if (
          select.selectedIndex >= 0 &&
          select.options[select.selectedIndex] &&
          select.value !== '' &&
          select.options[select.selectedIndex].text.trim() !== ''
        ) {
          return {
            sel: select.options[select.selectedIndex].text,
            valor: select.value,
          };
        }

        return '';
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

  const valor1 = extraerValor(celda1, tipo1) || null;
  const valor2 = extraerValor(celda2, tipo2) || null;
  const valorObs = extraerValor(celdas[4], tipo2) || null;
  const valorCelda3 = extraerValor(celdas[3], tipo1) || null;
  const valorCelda33 = extraerValor(celdas[3], 't') || null;
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
    const table = document.getElementById('tableControl');
    const tbody = table.querySelector('tbody');
    const filas = tbody.querySelectorAll(':scope > tr');

    // Estructura para guardar los valores de todos los hijos de cada celda
    const resultadoTabla = [];
    for (let i = 0; i < filas.length; i++) {
      const resultadoFila = [];
      const fila = filas[i];
      const displayRow = window.getComputedStyle(fila).display;
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
      pushValoresObjetoControl(
        objetoControl,
        valores,
        arrayControl,
        i,
        displayRow,
      );
      // ...puedes seguir agregando info de celdas si lo necesitas...
      resultadoTabla.push(resultadoFila);
    }
    // Al final del recorrido, loguea la estructura de valores extraídos
    // console.log('Valores extraídos por fila:', resultadoTabla);
    // console.log(objetoControl);
    return objetoControl;
  } catch (error) {
    // eslint-disable-next-line no-console
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
