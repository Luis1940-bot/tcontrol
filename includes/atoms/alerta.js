// eslint-disable-next-line import/extensions
import arrayGlobal from '../../controllers/variables.js';
// eslint-disable-next-line import/extensions
import guardarNuevo from '../../Pages/Control/Modules/Controladores/guardarNuevo.js';
// eslint-disable-next-line import/extensions
import traerFirma from '../../Pages/Control/Modules/Controladores/traerFirma.js';
// eslint-disable-next-line import/extensions
import guardaNotas from '../../Pages/Control/Modules/Controladores/guardaNotas.js';
// eslint-disable-next-line import/extensions
import insertarRegistro from '../../Pages/Control/Modules/Controladores/ix.js';
// eslint-disable-next-line import/extensions
import updateRegistro from '../../Pages/Control/Modules/Controladores/ux.js';
// eslint-disable-next-line import/extensions
import enviaMail from '../../Nodemailer/sendEmail.js';
// eslint-disable-next-line import/extensions, import/no-useless-path-segments
import { encriptar, desencriptar } from '../../controllers/cript.js';
import fechasGenerator from '../../controllers/fechas.js';
import eliminarRegistro from '../../Pages/ControlsView/Modules/Controladores/eliminaRegistro.js';
// eslint-disable-next-line import/extensions
import callProcedure from '../../Pages/ConsultasViews/Controladores/callProcedure.js';
import traerRegistros from '../../Pages/ControlsView/Modules/Controladores/traerRegistros.js';
import onOff from '../../Pages/ListReportes/Modules/Controladores/reporteOnOff.js';
import baseUrl from '../../config.js';
import guardarNuevoReporte from '../../Pages/ListReportes/Modules/Controladores/guardarReporte.js';
import addSelector from '../../Pages/ListVariables/Modules/Controladores/addSelector.js';
import addVariable from '../../Pages/ListVariables/Modules/Controladores/aceptarVariable.js';
import guardarNuevaArea from '../../Pages/ListAreas/Modules/Controladores/guardarArea.js';
import { arraysLoadTranslate } from '../../controllers/arraysLoadTranslate.js';
import { trO, trA } from '../../controllers/trOA.js';
import {
  createButton,
  createDiv,
  createSpan,
  createInput,
  createLabel,
  createH3,
  createHR,
  createIMG,
  createSelect,
  createRadioButton,
  createTextArea,
} from './createAlerta/creates.js';
import createSpinner from './createSpinner.js';
import { mostrarMensaje } from '../../controllers/ui/alertasLuis.js';
// import * as XLSX from './cdnjs/xlsx.full.min';

const SERVER = baseUrl;
let objTraductor = [];

const widthScreen = window.innerWidth;
const widthScreenAjustado = 360 / widthScreen;
let arrayWidthEncabezado;
let ID = 0;
// eslint-disable-next-line no-unused-vars
const fila = 0;

document.addEventListener('DOMContentLoaded', async () => {
  const persona = desencriptar(sessionStorage.getItem('user'));
  if (persona) {
    try {
      objTraductor = await arraysLoadTranslate();
    } catch (error) {
      console.error('Error al cargar traducciones en alerta:', error);
      objTraductor = []; // Usar array vacío como fallback
    }

    return objTraductor;
  }
  return null;
});

function procesoStyleDisplay(elementosStyle) {
  // remove modales
  if (!elementosStyle) {
    return;
  }
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < elementosStyle.element.length; i++) {
    const elemento = document.getElementById(elementosStyle.element[i]);
    if (elemento) {
      elemento.style.display = elementosStyle.style[i];
      const remove = elementosStyle.remove[i];
      if (remove !== null && elemento) {
        elemento.remove();
      }
    }
  }
}

const funcionGuardar = async () => {
  const { habilitadoGuardar } = arrayGlobal;

  if (habilitadoGuardar) {
    let objTraductorFG;
    try {
      objTraductorFG = await arraysLoadTranslate();
    } catch (error) {
      console.error('Error al cargar traducciones en funcionGuardar:', error);
      objTraductorFG = []; // Usar array vacío como fallback
    }
    // eslint-disable-next-line no-use-before-define
    const miAlerta = new Alerta();
    const obj = arrayGlobal.objAlertaAceptarCancelar;
    miAlerta.createAlerta(obj, objTraductorFG, 'guardar');
    const elementosStyle = {
      element: ['modalAlert'],
      style: ['flex'],
      remove: [null],
    };
    procesoStyleDisplay(elementosStyle);
  } else {
    // eslint-disable-next-line no-use-before-define
    const miAlerta = new Alerta();
    const obj = arrayGlobal.avisoRojo;
    const texto = arrayGlobal.mensajesVarios.guardar.sinModificaciones;
    miAlerta.createVerde(obj, texto, objTraductor);
    const elementosStyle = {
      element: ['modalAlertVerde'],
      style: ['block'],
      remove: [null],
    };
    procesoStyleDisplay(elementosStyle);
  }
};
const funcionGuardarCambio = async () => {
  let objTraductorFGC;
  try {
    objTraductorFGC = await arraysLoadTranslate();
  } catch (error) {
    console.error(
      'Error al cargar traducciones en funcionGuardarCambio:',
      error,
    );
    objTraductorFGC = []; // Usar array vacío como fallback
  }
  arrayGlobal.habilitadoGuardar = true;
  const { habilitadoGuardar } = arrayGlobal;
  if (habilitadoGuardar) {
    // eslint-disable-next-line no-use-before-define
    const miAlerta = new Alerta();
    const obj = arrayGlobal.objAlertaAceptarCancelar;
    miAlerta.createAlerta(obj, objTraductorFGC, 'guardarCambio');
    const elementosStyle = {
      element: ['modalAlert'],
      style: ['flex'],
      remove: [null],
    };
    procesoStyleDisplay(elementosStyle);
  } else {
    // eslint-disable-next-line no-use-before-define
    const miAlerta = new Alerta();
    const obj = arrayGlobal.avisoRojo;
    const texto = arrayGlobal.mensajesVarios.guardar.sinModificaciones;
    miAlerta.createVerde(obj, texto, objTraductor);
    const elementosStyle = {
      element: ['modalAlertVerde'],
      style: ['block'],
      remove: [null],
    };
    procesoStyleDisplay(elementosStyle);
  }
};
const funcionGuardarComoNuevo = async () => {
  let objTraductorFGCN;
  try {
    objTraductorFGCN = await arraysLoadTranslate();
  } catch (error) {
    console.error(
      'Error al cargar traducciones en funcionGuardarComoNuevo:',
      error,
    );
    objTraductorFGCN = []; // Usar array vacío como fallback
  }
  arrayGlobal.habilitadoGuardar = true;
  sessionStorage.setItem('doc', null);
  const { habilitadoGuardar } = arrayGlobal;
  if (habilitadoGuardar) {
    // eslint-disable-next-line no-use-before-define
    const miAlerta = new Alerta();
    const obj = arrayGlobal.objAlertaAceptarCancelar;
    miAlerta.createAlerta(obj, objTraductorFGCN, 'guardarComoNuevo');
    const elementosStyle = {
      element: ['modalAlert'],
      style: ['flex'],
      remove: [null],
    };
    procesoStyleDisplay(elementosStyle);
    arrayGlobal.habilitadoGuardar = false;
  } else {
    // eslint-disable-next-line no-use-before-define
    const miAlerta = new Alerta();
    const obj = arrayGlobal.avisoRojo;
    const texto = arrayGlobal.mensajesVarios.guardar.sinModificaciones;
    miAlerta.createVerde(obj, texto, objTraductor);
    const elementosStyle = {
      element: ['modalAlertVerde'],
      style: ['block'],
      remove: [null],
    };
    procesoStyleDisplay(elementosStyle);
  }
};
const funcionRefrescar = () => {
  const url = new URL(window.location.href);
  window.location.href = url.href;
};
const funcionHacerFirmar = async () => {
  // eslint-disable-next-line no-use-before-define
  let objTraductorFHF;
  try {
    objTraductorFHF = await arraysLoadTranslate();
  } catch (error) {
    console.error('Error al cargar traducciones en funcionHacerFirmar:', error);
    objTraductorFHF = []; // Usar array vacío como fallback
  }
  // eslint-disable-next-line no-use-before-define
  const miAlertaFirmar = new Alerta();
  const obj = arrayGlobal.objAlertaAceptarCancelar;
  miAlertaFirmar.createFirma(obj, objTraductorFHF, 'firmar');
  const elementosStyle = {
    element: ['modalAlert'],
    style: ['flex'],
    remove: [null],
  };
  procesoStyleDisplay(elementosStyle);
};
const funcionSalir = () => {
  // window.close()
  window.history.back();
};

const funcionExportarExcel = () => {
  try {
    const tabla = document.getElementById('tableConsultaViews');
    if (!tabla) {
      mostrarMensaje(
        '❌ No se encontró la tabla con id tableConsultaViews',
        'error',
      );
      // console.warn('❌ No se encontró la tabla con id tableConsultaViews');
      return;
    }

    // Recolectar filas
    const filasHTML = Array.from(tabla.querySelectorAll('tr'));

    // Construir la data como array de arrays
    const data = filasHTML.map((filaExcel) => {
      const celdas = Array.from(filaExcel.querySelectorAll('th, td'));

      return celdas.map((celda) => {
        const valorOriginal = celda.textContent.trim();

        // Detectar valores que Excel puede transformar
        const pareceFecha = /^\d{1,2}[/-]\d{1,2}[/-]\d{2,4}$/.test(
          valorOriginal,
        );
        const esFechaReal = !Number.isNaN(Date.parse(valorOriginal));
        const esNumeroCorto = /^\d{1,2}$/.test(valorOriginal); // tipo "6"
        const esTextoValido =
          Number.isNaN(valorOriginal) || valorOriginal.includes(' ');

        // Forzar todo como texto, porque Excel es un gremlin
        if (pareceFecha || esFechaReal || esNumeroCorto || !esTextoValido) {
          return { t: 's', v: valorOriginal };
        }

        return { t: 's', v: valorOriginal }; // TODO se fuerza como texto, por seguridad
      });
    });

    // Crear hoja y libro
    // eslint-disable-next-line no-undef
    const hoja = XLSX.utils.aoa_to_sheet([]);
    data.forEach((filaExcel, r) => {
      filaExcel.forEach((celda, c) => {
        // eslint-disable-next-line no-undef
        const ref = XLSX.utils.encode_cell({ r, c });
        hoja[ref] = celda;
      });
    });
    // eslint-disable-next-line no-undef
    hoja['!ref'] = XLSX.utils.encode_range({
      s: { r: 0, c: 0 },
      e: { r: data.length - 1, c: data[0].length - 1 },
    });

    // eslint-disable-next-line no-undef
    const wb = XLSX.utils.book_new();
    // eslint-disable-next-line no-undef
    XLSX.utils.book_append_sheet(wb, hoja, 'Export');

    // eslint-disable-next-line no-undef
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });

    // Obtener nombre y fecha
    const nameConsulta =
      document.getElementById('whereUs')?.textContent.trim() || 'Reporte';
    const fechaDeHoy =
      window.fechasGenerator?.fecha_larga_ddmmyyyyhhmm?.(new Date()) ||
      new Date().toISOString();

    // Descargar archivo
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${nameConsulta} ${fechaDeHoy}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);

    // Cerrar modal si existe
    const menu = document.getElementById('modalAlertM');
    if (menu) {
      menu.style.display = 'none';
      menu.remove();
    }
  } catch (error) {
    console.error('🧨 Error al exportar a Excel:', error);
    // alert('Algo salió mal al exportar. Revisá la consola.');
    mostrarMensaje('Algo salió mal al exportar. Revisá la consola.', 'error');
  }
};

const funcionExportarPDF = async () => {
  try {
    // Obtener la tabla
    const tabla = document.getElementById('tableConsultaViews');
    const nameConsulta = document.getElementById('whereUs').textContent.trim();
    const fechaDeHoy = fechasGenerator.fecha_larga_ddmmyyyyhhmm(new Date());

    // Capturar la tabla como imagen utilizando html2canvas
    /* global html2canvas */
    const canvas = await html2canvas(tabla);
    const imgData = canvas.toDataURL('image/png', 1.0);

    // Crear y configurar el PDF
    // eslint-disable-next-line new-cap, no-undef
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width; // Calcular la altura en función de la relación de aspecto de la imagen
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    // Guardar el PDF
    pdf.save(`${nameConsulta} ${fechaDeHoy}.pdf`);

    // Ocultar y eliminar el modal si existe
    const menu = document.getElementById('modalAlertM');
    if (menu) {
      menu.style.display = 'none';
      menu.remove();
    }
  } catch (error) {
    console.error('Error al exportar la tabla a PDF:', error);
  }
};

const funcionExportarJSON = () => {
  try {
    const tabla = document.getElementById('tableConsultaViews');
    const tbody = tabla.querySelector('tbody');
    const thead = tabla.querySelector('thead');

    // Obtener los nombres de las columnas
    const columnNames = Array.from(thead.getElementsByTagName('th')).map((th) =>
      th.innerText.trim(),
    );

    // Crear los datos JSON a partir de las filas de la tabla
    const jsonData = Array.from(tbody.getElementsByTagName('tr')).map((row) => {
      const cells = row.getElementsByTagName('td');
      const rowData = {};

      columnNames.forEach((name, index) => {
        rowData[name] = cells[index].innerText.trim();
      });

      return rowData;
    });

    // Crear un formulario dinámico
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `${SERVER}/Routes/viewJson.php`;
    form.target = '_blank';

    // Crear y adjuntar el input oculto con los datos JSON
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'data';
    input.value = JSON.stringify(jsonData);
    form.appendChild(input);

    // Agregar el formulario al cuerpo, enviarlo y luego eliminarlo
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    // Ocultar y eliminar el modal si existe
    const menu = document.getElementById('modalAlertM');
    if (menu) {
      menu.style.display = 'none';
      menu.remove();
    }
  } catch (error) {
    console.error('Error al exportar la tabla a JSON:', error);
  }
};

const funcionApi = () => {
  try {
    const { procedure, desde, hasta, plant } = desencriptar(
      sessionStorage.getItem('api'),
    );

    const url = window.location.host;
    const path = window.location.pathname;
    const folders = path.split('/').filter((folder) => folder !== '');
    let primeraSubCarpeta = '';
    if (folders.length >= 2) {
      // eslint-disable-next-line prefer-destructuring
      primeraSubCarpeta = folders[0];
    }

    let ruta = '';
    if (desde === null || hasta === null) {
      ruta = `https://${url}/${primeraSubCarpeta}/Pages/Api/api.php/${procedure}/${plant}/*`;
    } else {
      ruta = `https://${url}/${primeraSubCarpeta}/Pages/Api/api.php/${procedure}/${desde}/${hasta}/${plant}`;
    }
    const mensaje0 = document.getElementById('idMensajeInstructivo');
    mensaje0.style.display = 'block';
    const mensajeCopiado = document.getElementById('idMensajeCopiado');
    mensajeCopiado.textContent = `${ruta}?token=TOKEN&data=DATA`;
    const elementoTemporal = document.createElement('textarea');
    elementoTemporal.value = `${ruta}?token=TOKEN&data=DATA`;
    document.body.appendChild(elementoTemporal);
    elementoTemporal.select();
    navigator.clipboard
      .writeText(`${ruta}?token=TOKEN&data=DATA`)
      .then(() => {
        // console.log('Ruta copiada al portapapeles:', ruta)
      })
      .catch((err) => {
        console.error('Error al copiar la ruta al portapapeles:', err);
      })
      .finally(() => {
        // Eliminar el elemento temporal
        document.body.removeChild(elementoTemporal);
      });
  } catch (error) {
    // console.log(error);
    mostrarMensaje(error, 'error');
  }
};

const funcionNuevaArea = () => {
  const objetoRuta = {
    idLTYCliente: 0,
    idArea: 0,
    area: '',
    filtrado: [],
  };
  sessionStorage.setItem('area', encriptar(objetoRuta));
  const timestamp = new Date().getTime();
  const ruta = `${SERVER}/Pages/Router/rutas.php?ruta=areas&v=${timestamp}`;
  window.location.href = ruta;
};

const funcionNuevoReporte = () => {
  const objetoRuta = {
    control_N: 0,
    control_T: '',
    nr: '0',
    filtrado: [],
  };
  sessionStorage.setItem('reporte', encriptar(objetoRuta));
  const timestamp = new Date().getTime();
  const ruta = `${SERVER}/Pages/Router/rutas.php?ruta=reporte&v=${timestamp}`;
  window.location.href = ruta;
};

const funcionNuevoSelect = () => {
  const objetoRuta = {
    control_N: 0,
    control_T: 'Nueva variable',
    nr: '0',
    filtrado: [],
  };
  sessionStorage.setItem('variable', encriptar(objetoRuta));
  const timestamp = new Date().getTime();
  const ruta = `${SERVER}/Pages/Router/rutas.php?ruta=variables&v=${timestamp}`;
  window.location.href = ruta;
};

function checaCamposReporte(elemento) {
  if (elemento.value === '') {
    const copia = { ...elemento };
    copia.style.background = 'rgb(254, 4, 4)';
  }
}

function completaObjetoReporte() {
  const inputs = document.querySelectorAll('input');
  inputs.forEach((input) => {
    const copia = { ...input };
    copia.style.background = '#fff'; // Establece el fondo a blanco
  });
  const selects = document.querySelectorAll('select');
  selects.forEach((select) => {
    const copia = { ...select };
    copia.style.background = '#fff';
  });
  const user = desencriptar(sessionStorage.getItem('user'));
  const { plant } = user;
  const objetoReporte = {
    id: '',
    nombre: '',
    detalle: '',
    idLTYcliente: plant,
    idLTYarea: 0,
    titulo: '',
    rotulo1: '',
    rotulo2: '',
    rotulo3: '',
    rotulo4: '',
    piedeinforme: '',
    firma1: '',
    firma2: '',
    firma3: '',
    foto: 'n',
    activo: '',
    elaboro: '',
    reviso: '',
    aprobo: '',
    regdc: '',
    vigencia: '',
    cambio: '',
    modificacion: '',
    version: '',
    frecuencia: 1,
    testimado: 1,
    asignado: 0,
    nivel: 1,
    envio_mail: 0,
    direcciones_mail: '',
  };

  const idControl = document.getElementById('idControl');
  objetoReporte.id = idControl.value;

  const firstName = document.getElementById('firstName');
  objetoReporte.nombre = firstName.value.toUpperCase();
  checaCamposReporte(firstName);

  const titulo = document.getElementById('titulo');
  if (titulo === '') {
    objetoReporte.titulo = firstName.value.toUpperCase();
  } else {
    objetoReporte.titulo = titulo.value;
  }

  const detalle = document.getElementById('detalle');
  objetoReporte.detalle = detalle.value;

  const establecimiento = document.getElementById('establecimiento');
  objetoReporte.rotulo1 = establecimiento.value.toUpperCase();
  checaCamposReporte(establecimiento);

  const areaControladora = document.getElementById('areaControladora');
  objetoReporte.idLTYarea = parseInt(areaControladora.value, 10);
  const selectedOption =
    areaControladora.options[areaControladora.selectedIndex];
  objetoReporte.rotulo3 = selectedOption.textContent.toUpperCase();
  checaCamposReporte(areaControladora);

  const sectorControlado = document.getElementById('sectorControlado');
  objetoReporte.firma1 = sectorControlado.value.toUpperCase();
  checaCamposReporte(sectorControlado);

  const regdc = document.getElementById('regdc');
  objetoReporte.regdc = regdc.value;
  checaCamposReporte(regdc);

  const pieDeInforme = document.getElementById('pieDeInforme');
  objetoReporte.piedeinforme = pieDeInforme.value;

  const elaboro = document.getElementById('elaboro');
  objetoReporte.elaboro = elaboro.value;
  checaCamposReporte(elaboro);

  const reviso = document.getElementById('reviso');
  objetoReporte.reviso = reviso.value;
  checaCamposReporte(reviso);

  const aprobo = document.getElementById('aprobo');
  objetoReporte.aprobo = aprobo.value;
  checaCamposReporte(aprobo);

  const vigencia = document.getElementById('vigencia');
  let fechaObj = new Date(vigencia.value);
  let dia = fechaObj.getUTCDate().toString().padStart(2, '0');
  let mes = (fechaObj.getUTCMonth() + 1).toString().padStart(2, '0');
  let ano = fechaObj.getUTCFullYear();
  let nuevaFecha = `${dia}/${mes}/${ano}`;
  objetoReporte.vigencia = nuevaFecha;

  const modificacion = document.getElementById('modificacion');
  fechaObj = new Date(modificacion.value);
  dia = fechaObj.getUTCDate().toString().padStart(2, '0');
  mes = (fechaObj.getUTCMonth() + 1).toString().padStart(2, '0');
  ano = fechaObj.getUTCFullYear();
  nuevaFecha = `${dia}/${mes}/${ano}`;
  objetoReporte.modificacion = nuevaFecha;

  const version = document.getElementById('version');
  let version01 = '01';
  version.value !== '' ? (version01 = version.value) : null;
  objetoReporte.version = version01;

  const situacion = document.getElementById('situacion');
  let activo = 's';
  situacion.value === '2' ? (activo = 'n') : null;
  objetoReporte.activo = activo;

  const email = document.getElementById('email');
  let email01 = 0;
  email.value === '2' ? (email01 = 1) : null;
  objetoReporte.envio_mail = email01;
  if (email01 === 1) {
    const emailGroup = document.querySelector('.email-group');
    const remainingPastillitas = emailGroup.querySelectorAll(
      '.div-pastillita .label-email',
    );
    let direccionesEmails = '';
    for (let i = 0; i < remainingPastillitas.length; i++) {
      const element = remainingPastillitas[i];
      direccionesEmails += `/${element.textContent}`;
    }
    direccionesEmails = direccionesEmails.slice(1);
    objetoReporte.direcciones_mail = direccionesEmails;
  }

  const frecuencia = document.getElementById('frecuencia');
  objetoReporte.frecuencia = parseInt(frecuencia.value, 10);

  const number = document.getElementById('testimado');
  objetoReporte.testimado = parseFloat(number.value);

  const tipodeusuario = document.getElementById('tipodeusuario');
  objetoReporte.nivel = tipodeusuario.value;

  return objetoReporte;
}

const funcionReporteGuardarNuevo = async () => {
  try {
    // eslint-disable-next-line no-use-before-define
    const miAlerta = new Alerta();
    let aviso = 'Se dará de alta un nuevo reporte.';
    let mensaje = trO(aviso, objTraductor) || aviso;
    miAlerta.createVerde(arrayGlobal.avisoAmarillo, mensaje, objTraductor);
    let modal = document.getElementById('modalAlertVerde');
    modal.style.display = 'block';
    const objetoGuardarReporte = completaObjetoReporte();
    delete objetoGuardarReporte.id;

    const guardar = await guardarNuevoReporte(
      objetoGuardarReporte,
      '/guardarReporteNuevo',
    );
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!modal) {
      // console.warn('Error de carga en el modal');
      mostrarMensaje('Error de carga en el modal', 'error');
    }
    modal.style.display = 'none';
    modal.remove();

    if (guardar.success === true) {
      // colocar el numero de id del nuevo reporte idControl
      const id = guardar.last_insert_id;
      aviso = `El reporte nuevo se generó correctamente con el id: ${id}`;
      const idControl = document.getElementById('idControl');
      idControl.value = id;
      idControl.style.background = '#a8eea8';
      // Acceder al elemento span
      const spanElement = document.getElementById('whereUs');

      // Crear un nuevo elemento img para preservarlo
      const newImg = document.createElement('img');
      newImg.src = `${SERVER}/assets/img/icons8-brick-wall-50.png`;
      newImg.height = '10'; // Asegúrate de usar string para atributos que no son de estilo
      newImg.width = '10';

      // Remover todos los nodos hijos del span (esto incluye el texto y la imagen)
      while (spanElement.firstChild) {
        spanElement.removeChild(spanElement.firstChild);
      }

      // Añadir de nuevo la imagen y el nuevo texto
      spanElement.appendChild(newImg);
      spanElement.append(objetoGuardarReporte.nombre.toLocaleUpperCase()); // Usa append para añadir texto directamente

      mensaje = trO(aviso, objTraductor) || aviso;
      arrayGlobal.avisoVerde.span.fontSize = '20px';
      miAlerta.createVerde(arrayGlobal.avisoVerde, mensaje, objTraductor);
    }
    if (guardar.success === false) {
      aviso = 'Algo salió mal y no se guardó el nuevo reporte!';
      mensaje = trO(aviso, objTraductor) || aviso;
      miAlerta.createVerde(arrayGlobal.avisoRojo, mensaje, objTraductor);
    }

    modal = document.getElementById('modalAlertVerde');
    modal.style.display = 'block';
    modal = document.getElementById('modalAlertM');
    if (!modal) {
      // console.warn('Error de carga en el modal');
      mostrarMensaje('Error de carga en el modal', 'error');
    }
    modal.style.display = 'none';
    modal.remove();
  } catch (error) {
    // console.log(error);
    mostrarMensaje(error, 'error');
  }
};

const funcionReporteGuardarCambios = async () => {
  try {
    // eslint-disable-next-line no-use-before-define
    const miAlerta = new Alerta();
    let aviso = 'Se modificarán los datos del reporte.';
    let mensaje = trO(aviso, objTraductor) || aviso;
    miAlerta.createVerde(arrayGlobal.avisoAmarillo, mensaje, objTraductor);
    let modal = document.getElementById('modalAlertVerde');
    modal.style.display = 'block';
    const objetoGuardarReporte = completaObjetoReporte();
    const guardar = await guardarNuevoReporte(
      objetoGuardarReporte,
      '/guardarReporteCambios',
    );
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (!modal) {
      // console.warn('Error de carga en el modal');
      mostrarMensaje('Error de carga en el modal', 'error');
    }
    modal.style.display = 'none';
    modal.remove();

    if (guardar.success === true) {
      aviso = 'Se guardaron las modificaciones al reporte.';
      mensaje = trO(aviso, objTraductor) || aviso;
      arrayGlobal.avisoVerde.span.fontSize = '20px';
      miAlerta.createVerde(arrayGlobal.avisoVerde, mensaje, objTraductor);
    }
    if (guardar.success === false) {
      aviso = 'Algo salió mal y no se guardaron las modificaciones!';
      mensaje = trO(aviso, objTraductor) || aviso;
      miAlerta.createVerde(arrayGlobal.avisoRojo, mensaje, objTraductor);
    }

    modal = document.getElementById('modalAlertVerde');
    modal.style.display = 'block';
    modal = document.getElementById('modalAlertM');
    if (!modal) {
      // console.warn('Error de carga en el modal');
      mostrarMensaje('Error de carga en el modal', 'error');
    }
    modal.style.display = 'none';
    modal.remove();
  } catch (error) {
    // console.log(error);
    mostrarMensaje(error, 'error');
  }
};

const funcionReporteGuardarComo = async () => {
  try {
    // eslint-disable-next-line no-use-before-define
    const miAlerta = new Alerta();
    let aviso = 'Se dará de alta una copia del reporte actual.';
    let mensaje = trO(aviso, objTraductor) || aviso;
    miAlerta.createVerde(arrayGlobal.avisoAmarillo, mensaje, objTraductor);
    let modal = document.getElementById('modalAlertVerde');
    modal.style.display = 'block';
    const objetoGuardarReporte = completaObjetoReporte();
    delete objetoGuardarReporte.id;

    const guardar = await guardarNuevoReporte(
      objetoGuardarReporte,
      '/guardarReporteNuevo',
    );
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (!modal) {
      // console.warn('Error de carga en el modal');
      mostrarMensaje('Error de carga en el modal', 'error');
    }
    modal.style.display = 'none';
    modal.remove();

    if (guardar.success === true) {
      // colocar el numero de id del nuevo reporte idControl
      const id = guardar.last_insert_id;
      aviso = `La copia del reporte se generó correctamente con el id: ${id}`;
      const idControl = document.getElementById('idControl');
      idControl.value = id;
      idControl.style.background = '#a8eea8';
      // Acceder al elemento span
      const spanElement = document.getElementById('whereUs');

      // Crear un nuevo elemento img para preservarlo
      const newImg = document.createElement('img');
      newImg.src = `${SERVER}/assets/img/icons8-brick-wall-50.png`;
      newImg.height = '10'; // Asegúrate de usar string para atributos que no son de estilo
      newImg.width = '10';

      // Remover todos los nodos hijos del span (esto incluye el texto y la imagen)
      while (spanElement.firstChild) {
        spanElement.removeChild(spanElement.firstChild);
      }

      // Añadir de nuevo la imagen y el nuevo texto
      spanElement.appendChild(newImg);
      spanElement.append(objetoGuardarReporte.nombre.toLocaleUpperCase()); // Usa append para añadir texto directamente

      mensaje = trO(aviso, objTraductor) || aviso;
      arrayGlobal.avisoVerde.span.fontSize = '20px';
      miAlerta.createVerde(arrayGlobal.avisoVerde, mensaje, objTraductor);
    }
    if (guardar.success === false) {
      aviso = 'Algo salió mal y no se realizó la copia del reporte!';
      mensaje = trO(aviso, objTraductor) || aviso;
      miAlerta.createVerde(arrayGlobal.avisoRojo, mensaje, objTraductor);
    }

    modal = document.getElementById('modalAlertVerde');
    modal.style.display = 'block';
    modal = document.getElementById('modalAlertM');
    if (!modal) {
      // console.warn('Error de carga en el modal');
      mostrarMensaje('Error de carga en el modal', 'error');
    }
    modal.style.display = 'none';
    modal.remove();
  } catch (error) {
    // console.log(error);
    mostrarMensaje(error, 'error');
  }
};

const funcionSelectorGuardarNuevo = async () => {
  const nombreDelSelect = document.getElementById('nombreDelSelect');
  const tipoDeUsuario = document.getElementById('tipodeusuario');
  const user = desencriptar(sessionStorage.getItem('user'));
  const { plant } = user;

  if (nombreDelSelect.value !== '') {
    const objeto = {
      concepto: trO('Modificar', objTraductor) || 'Modificar',
      detalle: nombreDelSelect.value.toUpperCase(),
      nivel: tipoDeUsuario.value,
      idLTYcliente: plant,
    };
    const resultado = await addSelector(objeto, '/addSelector');
    if (resultado.success) {
      const modalAlertM = document.getElementById('modalAlertM');
      modalAlertM.style.display = 'none';
      modalAlertM.remove();
      // eslint-disable-next-line no-use-before-define
      const miAlertaM = new Alerta();
      miAlertaM.createVerde(arrayGlobal.avisoVerde, null, objTraductor);
      const modal = document.getElementById('modalAlertVerde');
      modal.style.display = 'block';
      modal.addEventListener('click', () => {
        if (!modal) {
          // console.warn('Error de carga en el modal');
          mostrarMensaje('Error de carga en el modal', 'error');
        }
        modal.style.display = 'none'; // Cerrar el modal
        const url = `${SERVER}/Pages/ListVariables`;
        window.location.href = url; // Redireccionar
      });
    }
  }
};

const funcionSelectorGuardarCambios = async () => {
  const nombreDelSelect = document.getElementById('nombreDelSelect');
  const tipoDeUsuario = document.getElementById('tipodeusuario');
  const numeroDelSelector = document.getElementById('numeroDelSelector');

  if (nombreDelSelect.value !== '') {
    const objeto = {
      selector: numeroDelSelector.value,
      detalle: nombreDelSelect.value.toUpperCase(),
      nivel: tipoDeUsuario.value,
    };
    const resultado = await addSelector(objeto, '/updateSelector');
    if (resultado.success) {
      const modalAlertM = document.getElementById('modalAlertM');
      modalAlertM.style.display = 'none';
      modalAlertM.remove();
    }
  }
};
const funcionGuardarCambiosEnVariables = async () => {
  const pastillitas = document.querySelectorAll('.div-pastillita');
  const divsSinFondoEspecifico = [];
  pastillitas.forEach((div) => {
    const colorFondo = div.style.background;
    if (colorFondo.replace(/\s+/g, '').indexOf('rgb(157,157,157)') === -1) {
      // Si no tiene el fondo deseado, añadir a la lista
      divsSinFondoEspecifico.push(div);
    }
  });
  const arrayId = [];
  const arrayValue = [];

  divsSinFondoEspecifico.forEach((element) => {
    const input = element.querySelector('input');
    const valor = input.value;

    if (valor !== '') {
      const id = input.getAttribute('id');

      arrayId.push(id);
      arrayValue.push(valor);
    }
  });
  const user = desencriptar(sessionStorage.getItem('user'));
  const { plant } = user;
  if (arrayId.length > 0) {
    const objeto = {
      id: arrayId,
      value: arrayValue,
      idLTYcliente: plant,
    };
    const response = await addVariable(objeto, '/updateVariable');

    if (response[0].success) {
      const modalAlertM = document.getElementById('modalAlertM');
      modalAlertM.style.display = 'none';
      modalAlertM.remove();
      divsSinFondoEspecifico.forEach((element) => {
        const input = element.querySelector('input');
        const valor = input.value;
        input.value = valor.toUpperCase();
        input.style.background = '#cecece';
      });
    }
  }
};

function completaObjetoArea() {
  const user = desencriptar(sessionStorage.getItem('user'));
  const { plant } = user;
  const inputs = document.querySelectorAll('input');
  inputs.forEach((input) => {
    const copia = { ...input };
    copia.style.background = '#fff'; // Establece el fondo a blanco
  });
  const selects = document.querySelectorAll('select');
  selects.forEach((select) => {
    const copia = { ...select };
    copia.style.background = '#fff';
  });
  const objetoReporte = {
    idLTYarea: 0,
    area: '',
    idLTYcliente: plant,
    activo: '',
    visible: '',
  };

  const numeroDeArea = document.getElementById('numeroDeArea');
  objetoReporte.idLTYarea = numeroDeArea.value;

  const nombreDeArea = document.getElementById('nombreDeArea');
  objetoReporte.area = nombreDeArea.value;
  checaCamposReporte(nombreDeArea);

  const situacion = document.getElementById('situacion');
  let activo = 's';
  situacion.value === '2' ? (activo = 'n') : null;
  objetoReporte.activo = activo;

  const vis = document.getElementById('visible');
  let visible = 's';
  vis.value === '2' ? (visible = 'n') : null;
  objetoReporte.visible = visible;

  return objetoReporte;
}

const funcionAreaGuardarNuevo = async () => {
  try {
    // eslint-disable-next-line no-use-before-define
    const miAlerta = new Alerta();
    let aviso = 'Se dará de alta una nueva área.';
    let mensaje = trO(aviso, objTraductor) || aviso;
    miAlerta.createVerde(arrayGlobal.avisoAmarillo, mensaje, objTraductor);
    let modal = document.getElementById('modalAlertVerde');
    modal.style.display = 'block';
    const objetoGuardarArea = completaObjetoArea();
    delete objetoGuardarArea.id;
    const guardar = await guardarNuevaArea(
      objetoGuardarArea,
      '/guardarAreaNuevo',
    );
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (!modal) {
      // console.warn('Error de carga en el modal');
      mostrarMensaje('Error de carga en el modal', 'error');
    }
    modal.style.display = 'none';
    modal.remove();

    if (guardar.success === true) {
      // colocar el numero de id del nuevo reporte idControl
      const id = guardar.last_insert_id;
      aviso = 'La nueva área se generó correctamente.';
      const numeroDeArea = document.getElementById('numeroDeArea');
      numeroDeArea.value = id;
      numeroDeArea.style.background = '#cecece';

      mensaje = trO(aviso, objTraductor) || aviso;
      arrayGlobal.avisoVerde.span.fontSize = '20px';
      miAlerta.createVerde(arrayGlobal.avisoVerde, mensaje, objTraductor);
    }
    if (guardar.success === false) {
      aviso = 'Algo salió mal y no se guardó la nueva área!';
      mensaje = trO(aviso, objTraductor) || aviso;
      miAlerta.createVerde(arrayGlobal.avisoRojo, mensaje, objTraductor);
    }

    modal = document.getElementById('modalAlertVerde');
    modal.style.display = 'block';
    modal = document.getElementById('modalAlertM');
    if (!modal) {
      // console.warn('Error de carga en el modal');
      mostrarMensaje('Error de carga en el modal', 'error');
    }
    modal.style.display = 'none';
    modal.remove();
  } catch (error) {
    // console.log(error);
    mostrarMensaje(error, 'error');
  }
};

const funcionAreaGuardarCambios = async () => {
  try {
    // eslint-disable-next-line no-use-before-define
    const miAlerta = new Alerta();
    let aviso = 'Se modificarán los datos del área.';
    let mensaje = trO(aviso, objTraductor) || aviso;
    miAlerta.createVerde(arrayGlobal.avisoAmarillo, mensaje, objTraductor);
    let modal = document.getElementById('modalAlertVerde');
    modal.style.display = 'block';
    // const objetoGuardarArea = completaObjetoArea()
    const objetoGuardarArea = desencriptar(sessionStorage.getItem('area'));
    const guardar = await guardarNuevaArea(
      objetoGuardarArea,
      '/guardarCambioArea',
    );
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (!modal) {
      // console.warn('Error de carga en el modal');
      mostrarMensaje('Error de carga en el modal', 'error');
    }
    modal.style.display = 'none';
    modal.remove();

    if (guardar.success === true) {
      aviso = 'Se guardaron las modificaciones del área.';
      mensaje = trO(aviso, objTraductor) || aviso;
      arrayGlobal.avisoVerde.span.fontSize = '20px';
      miAlerta.createVerde(arrayGlobal.avisoVerde, mensaje, objTraductor);
    }
    if (guardar.success === false) {
      aviso = 'Algo salió mal y no se guardaron las modificaciones!';
      mensaje = trO(aviso, objTraductor) || aviso;
      miAlerta.createVerde(arrayGlobal.avisoRojo, mensaje, objTraductor);
    }

    modal = document.getElementById('modalAlertVerde');
    modal.style.display = 'block';
  } catch (error) {
    // console.log(error);
    mostrarMensaje(error, 'error');
  }
};

async function firmar(firmadoPor, objTrad) {
  try {
    const pass = encriptar(document.getElementById('idInputFirma').value);
    const persona = desencriptar(sessionStorage.getItem('user'));
    const { plant } = persona;

    const supervisor = await traerFirma(pass, plant);

    const modal = document.getElementById('modalAlert');
    if (!modal) {
      // eslint-disable-next-line no-console
      console.warn('Error de carga en el modal');
    }
    modal.style.display = 'none';
    modal.remove();

    if (supervisor.id !== null) {
      const idMensajeFirmado = document.getElementById('idMensajeFirmado');
      idMensajeFirmado.innerText = `${firmadoPor}: ${supervisor.nombre}`;

      const elementosStyle = {
        element: ['idMensajeFirmado', 'idDivFirmar', 'idDivFirmado'],
        style: ['block', 'none', 'block'],
        remove: [null, null, null],
      };
      procesoStyleDisplay(elementosStyle);

      sessionStorage.setItem('firmado', encriptar(supervisor));

      const configMenu = {
        guardar: true,
        guardarComo: false,
        guardarCambios: false,
        firma: false,
        configFirma: supervisor,
      };
      sessionStorage.setItem('config_menu', encriptar(configMenu));
    } else {
      // eslint-disable-next-line no-use-before-define
      const miAlerta = new Alerta();
      const obj = arrayGlobal.avisoRojo;
      const texto = arrayGlobal.mensajesVarios.firma.no_encontrado;
      miAlerta.createVerde(obj, texto, objTrad);

      const modalAlertVerde = document.getElementById('modalAlertVerde');
      modalAlertVerde.style.display = 'block';
    }

    // Esperar la eliminación del modal con promesas en lugar de setTimeout
    await new Promise((resolve) => {
      const menu = document.getElementById('modalAlertM');
      menu.style.display = 'none';
      menu.remove();
      resolve();
    });
  } catch (error) {
    console.error('Error en firmar:', error);
  }
}

function limpiaArrays() {
  const existenciaControl = arrayGlobal.objetoControl.valor.length;
  const recarga = existenciaControl > 0;
  if (recarga) {
    Object.keys(arrayGlobal.objetoControl).forEach((clave) => {
      arrayGlobal.objetoControl[clave] = [];
    });
  }
}

function convertirObjATextPlano(obj) {
  const data = { ...obj };

  delete data.objImagen;

  // Simplemente retornar JSON válido directamente
  return JSON.stringify(data);
}

// eslint-disable-next-line camelcase, no-unused-vars
async function subirImagenes_OLD(img) {
  // console.log(img);
  if (img.length === 0) {
    return null;
  }
  if (img[0].extension.length === 0) {
    return null;
  }

  const imgJsonString = JSON.stringify(img);
  try {
    JSON.parse(imgJsonString); // Esto lanzará un error si el JSON no es válido
  } catch (e) {
    console.error('JSON inválido:', e);
    return null;
  }

  const formData = new FormData();
  formData.append('imgBase64', imgJsonString);

  // console.log(formData);
  // return;
  fetch(`${SERVER}/Routes/Imagenes/photo_upload.php`, {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then(
      (data) =>
        // eslint-disable-next-line no-console
        // console.log('Respuesta del servidor:', data)
        data,
    )
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error al enviar la imagen:', error);
    });
  return null;
}

function base64ToFile(base64String, filename, mimeType) {
  const byteString = atob(base64String.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new File([ab], filename, { type: mimeType });
}

async function subirImagenes(img) {
  try {
    // Si no hay imágenes, retornar sin mostrar mensaje (es normal)
    if (!img || !Array.isArray(img) || img.length === 0) {
      return null;
    }

    // Parsear los strings JSON si es necesario
    const parsedData = img
      .map((item, index) => {
        if (typeof item === 'string') {
          try {
            return JSON.parse(item);
          } catch (parseError) {
            console.error(`Error al parsear item ${index}:`, parseError);
            return null;
          }
        }
        return item;
      })
      .filter((item) => item !== null);

    // Verificar que tengamos datos válidos
    if (parsedData.length === 0) {
      return null;
    }

    // Verificar el formato esperado por el servidor
    if (
      !parsedData[0] ||
      !parsedData[0].extension ||
      parsedData[0].extension.length === 0
    ) {
      return null;
    }

    // Transformar los datos al formato que espera el PHP
    const transformedData = {
      src: [],
      fileName: [],
      extension: [],
      plant: [],
      carpeta: [],
    };

    // Combinar todos los arrays de todos los objetos
    parsedData.forEach((item) => {
      if (item.src && Array.isArray(item.src)) {
        transformedData.src.push(...item.src);
      }
      if (item.fileName && Array.isArray(item.fileName)) {
        transformedData.fileName.push(...item.fileName);
      }
      if (item.extension && Array.isArray(item.extension)) {
        transformedData.extension.push(...item.extension);
      }
      if (item.plant && Array.isArray(item.plant)) {
        transformedData.plant.push(...item.plant);
      }
      if (item.carpeta && Array.isArray(item.carpeta)) {
        transformedData.carpeta.push(...item.carpeta);
      }
    });

    // Enviar como JSON string
    const imgJsonString = JSON.stringify(transformedData);

    try {
      JSON.parse(imgJsonString); // Verificar que el JSON sea válido
      // console.log('JSON válido confirmado');
    } catch (e) {
      console.error('JSON inválido:', e);
      return null;
    }

    const formData = new FormData();
    formData.append('imgBase64', imgJsonString);

    // Enviar las imágenes al servidor y retornar la respuesta
    const response = await fetch(`${SERVER}/Routes/Imagenes/photo_upload.php`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    // Obtener el texto de la respuesta primero para verificar qué está devolviendo
    const responseText = await response.text();

    // Intentar parsear solo si hay contenido
    if (!responseText || responseText.trim() === '') {
      return { success: false, message: 'Respuesta vacía del servidor' };
    }

    let uploadResult;
    try {
      uploadResult = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error al parsear la respuesta del servidor:', parseError);
      return {
        success: false,
        message: 'Error al parsear respuesta del servidor',
      };
    }

    return uploadResult;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`Error al subir imagenes: ${error}`);
    return null;
  }
}

function cartelVerdeInsertado(
  typeAlert,
  objeto,
  modalContent,
  objTrad,
  mensaje,
  insertado,
  modal,
  enviado,
) {
  const obj = objeto;
  // const obj = JSON.parse(JSON.stringify(objeto))
  let span = document.getElementById('idSpanAvisoVerde');
  span.style.display = 'none';
  let texto = trO(mensaje[typeAlert], objTrad) || mensaje[typeAlert];
  obj.span.text = texto;
  // obj.span.fontSize = '16px'
  obj.span.fontColor = '#ececec';
  obj.span.fontWeight = '700';
  obj.span.marginTop = '10px';
  span = createSpan(obj.close);
  modalContent.appendChild(span);
  const spanTitulo = createSpan(obj.span, texto);
  modalContent.appendChild(spanTitulo);

  let frase = '';
  texto = trO(mensaje.cantidadRegistros, objTrad) || mensaje.cantidadRegistros;
  frase = `${texto} ${insertado.registros}`;
  texto = trO(mensaje.items, objTrad) || mensaje.items;
  frase = `${frase} ${texto}`;
  obj.span.text = frase;
  // obj.span.fontSize = '14px'
  obj.span.fontColor = '#ececec';
  obj.span.fontWeight = '500';
  obj.span.marginTop = '0px';
  obj.span.id = 'idSpanAvisoVerde2';
  let spanTexto = createSpan(obj.span, frase);
  modalContent.appendChild(spanTexto);
  texto = trO(mensaje.documento, objTrad) || mensaje.documento;
  frase = `${texto} ${insertado.documento}.`;
  obj.span.text = frase;
  // obj.span.fontSize = '14px'
  obj.span.fontColor = '#ececec';
  obj.span.fontWeight = '500';
  obj.span.marginTop = '0px';
  obj.span.id = 'idSpanAvisoVerde3';
  spanTexto = createSpan(obj.span, frase);
  modalContent.appendChild(spanTexto);
  modal.appendChild(modalContent);
  if (enviado) {
    texto = trO(mensaje.enviado, objTrad) || mensaje.enviado;
    frase = `${texto}`;
    obj.span.text = frase;
    // obj.span.fontSize = '14px'
    obj.span.fontColor = '#ececec';
    obj.span.fontWeight = '500';
    obj.span.marginTop = '0px';
    obj.span.id = 'idSpanAvisoVerde4';
    spanTexto = createSpan(obj.span, frase);
    modalContent.appendChild(spanTexto);
    modal.appendChild(modalContent);
  }

  obj.divButtons.alignItems = 'center';
  const divButtons = createDiv(obj.divButtons);
  obj.btnaccept.marginLeft = 'auto';
  obj.btnaccept.marginRight = 'auto';
  const button = createButton(obj.btnaccept);
  divButtons.appendChild(button);
  modalContent.appendChild(divButtons);

  document.body.appendChild(modal);
}

function cartelRojoInsertado(
  typeAlert,
  objeto,
  modalContent,
  objTrad,
  mensaje,
  modal,
) {
  const obj = objeto;
  // const obj = JSON.parse(JSON.stringify(objeto))
  let span = document.getElementById('idSpanAvisoVerde');
  span.style.display = 'none';
  const texto = trO(mensaje[typeAlert], objTrad) || mensaje[typeAlert];
  obj.span.text = texto;
  // obj.span.fontSize = '16px'
  obj.span.fontColor = '#ececec';
  obj.span.fontWeight = '700';
  obj.span.marginTop = '10px';
  const spanTitulo = createSpan(obj.span, texto);
  modalContent.appendChild(spanTitulo);
  span = createSpan(obj.close);
  modalContent.appendChild(span);
  const frase = trO(mensaje.fail, objTrad) || mensaje.fail;
  obj.span.text = frase;
  // obj.span.fontSize = '14px'
  obj.span.fontColor = '#ececec';
  obj.span.fontWeight = '500';
  obj.span.marginTop = '0px';
  obj.span.id = 'idSpanAvisoVerde2';
  const spanTexto = createSpan(obj.span, frase);
  modalContent.appendChild(spanTexto);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
}

function informe(
  convertido,
  insertado,
  imagenes,
  enviado,
  miAlerta,
  objTrad,
  mod,
  plant,
  nuxpedido,
) {
  const modal = mod;
  const mensaje = arrayGlobal.mensajesVarios.guardar;
  const obj = arrayGlobal.procesoExitoso;
  modal.style.background = 'rgba(224, 220, 220, 0.7)';
  if (insertado.success) {
    obj.div.background = '#21D849';
    const modalContent = createDiv(obj.div);
    const typeAlert = 'success';
    let enviadoSuccess = '';
    if (enviado === null) {
      enviadoSuccess = '';
    } else {
      enviadoSuccess = enviado.success;
    }
    cartelVerdeInsertado(
      typeAlert,
      obj,
      modalContent,
      objTrad,
      mensaje,
      insertado,
      modal,
      enviadoSuccess,
    );

    const documento = document.getElementById('doc').textContent;
    if (documento.trim() === 'Doc:') {
      document.getElementById('doc').innerText = `Doc: ${insertado.documento}`;
    }
    const resultado = documento.match(/Doc:\s*(\d+)/);
    if (resultado) {
      const numeroExtraido = resultado[1];
      if (insertado.documento.trim() !== numeroExtraido.trim()) {
        document.getElementById('doc').innerText =
          `Doc: ${insertado.documento}`;
      }
    }

    sessionStorage.setItem('doc', encriptar(insertado.documento));
    const configMenuStorage = desencriptar(
      sessionStorage.getItem('config_menu'),
    );
    let datoDeFirma = 'x';
    if (configMenuStorage !== false) {
      if (
        Object.prototype.toString.call(configMenuStorage.configFirma) ===
        '[object Object]'
      ) {
        datoDeFirma = configMenuStorage;
      }
    }
    const configMenu = {
      guardar: true,
      guardarComo: false,
      guardarCambios: false,
      firma: false,
      configFirma: datoDeFirma,
    };
    configMenu.guardar = false;
    configMenu.guardarComo = true;
    configMenu.guardarCambios = true;
    configMenu.configFirma = {
      ...configMenu.configFirma,
      ...configMenuStorage.configFirma,
    };

    sessionStorage.setItem('config_menu', encriptar(configMenu));

    limpiaArrays();
    const stringConvertido = `NUXPEDIDO: ${nuxpedido}, ${convertido}`;
    guardaNotas(stringConvertido, plant);
  } else {
    obj.div.background = '#D82137';
    const modalContent = createDiv(obj.div);
    const typeAlert = 'ups';
    cartelRojoInsertado(typeAlert, obj, modalContent, objTrad, mensaje, modal);
    limpiaArrays();
  }
  // Agregar el modal al body del documento
  document.body.appendChild(modal);
}

async function insert(
  nuevoObjeto,
  convertido,
  objEncabezados,
  miAlertaInforme,
  objTrad,
  modal,
  docStorage,
  enviaPorEmailBooleano,
) {
  // console.log(nuevoObjeto);
  // console.log(enviaPorEmailBooleano)
  try {
    const { plant } = desencriptar(sessionStorage.getItem('user'));

    const nuevoObjetoControl = { ...nuevoObjeto };
    delete nuevoObjetoControl.name;
    delete nuevoObjetoControl.email;
    delete nuevoObjetoControl.detalle;
    delete nuevoObjetoControl.objImagen;

    let insertado;
    // console.log(nuevoObjetoControl, plant);
    try {
      if (docStorage === false) {
        insertado = await insertarRegistro(nuevoObjetoControl, plant);
        // console.log(insertado);
        sessionStorage.setItem('habilitaValidar', 'true');
      } else {
        insertado = await updateRegistro(nuevoObjetoControl, docStorage);
      }
    } catch (error) {
      console.error('Error insert:', error);
      return; // Manejar el error y detener la ejecución
    }

    let imagenes;

    try {
      imagenes = await subirImagenes(nuevoObjeto.objImagen);
    } catch (error) {
      console.error('Error subir imagenes:', error);
      return; // Manejar el error y detener la ejecución
    }

    const encabezados = { ...objEncabezados };
    encabezados.documento = insertado.documento;

    let enviado = '';

    try {
      if (enviaPorEmailBooleano) {
        enviado = await enviaMail(nuevoObjeto, encabezados, plant); // Espera la resolución de la promesa
      }
    } catch (error) {
      console.error('Error envio email:', error);
      return; // Manejar el error y detener la ejecución
    }

    // Ocultar el aviso amarillo
    const amarillo = document.getElementById('idDivAvisoVerde');
    amarillo.style.display = 'none';

    // Llamar a informe() solo después de que todas las promesas anteriores se hayan resuelto
    informe(
      convertido,
      insertado,
      imagenes,
      enviado, // Ahora 'enviado' tiene el valor correcto
      miAlertaInforme,
      objTrad,
      modal,
      plant,
      insertado.documento,
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error:', error);
  }
}

function armaEncabezado(arrayMensajes, objTrad, docStorage, planta) {
  const encabezadosEmail = arrayMensajes.objetoControl.email;
  let mensaje = arrayMensajes.mensajesVarios.email.fechaDeAlerta;
  const fechaDeAlerta = trO(mensaje, objTrad) || mensaje;
  mensaje = arrayMensajes.mensajesVarios.email.horaDeAlerta;
  const horaDeAlerta = trO(mensaje, objTrad) || mensaje;
  mensaje = arrayMensajes.mensajesVarios.email.notifica;
  const notifica = trO(mensaje, objTrad) || mensaje;
  mensaje = arrayMensajes.mensajesVarios.email.sistema;
  const sistema = trO(mensaje, objTrad) || mensaje;
  mensaje = arrayMensajes.mensajesVarios.email.irA;
  const irA = trO(mensaje, objTrad) || mensaje;
  mensaje = arrayMensajes.mensajesVarios.email.concepto;
  const concepto = trO(mensaje, objTrad) || mensaje;
  mensaje = arrayMensajes.mensajesVarios.email.relevamiento;
  const relevamiento = trO(mensaje, objTrad) || mensaje;
  mensaje = arrayMensajes.mensajesVarios.email.detalle;
  const detalle = trO(mensaje, objTrad) || mensaje;
  mensaje = arrayMensajes.mensajesVarios.email.observacion;
  const observacion = trO(mensaje, objTrad) || mensaje;
  mensaje = arrayMensajes.mensajesVarios.email.subject;
  const subject = trO(mensaje, objTrad) || mensaje;
  mensaje = arrayMensajes.mensajesVarios.email.titulo;
  const titulo = trO(mensaje, objTrad) || mensaje;
  const idLTYreporte = arrayMensajes.objetoControl.idLTYreporte[0];
  const { texto, value } = planta;
  const numeroPlanta = parseInt(value, 10);
  const nombrePlanta = texto;
  const encabezados = {
    documento: docStorage,
    address: encabezadosEmail.address,
    fecha: encabezadosEmail.fecha,
    hora: encabezadosEmail.hora,
    notificador: encabezadosEmail.notificador,
    planta: nombrePlanta,
    idPlanta: numeroPlanta,
    reporte: encabezadosEmail.reporte,
    titulo,
    url: encabezadosEmail.url,
    fechaDeAlerta,
    horaDeAlerta,
    notifica,
    sistema,
    irA,
    concepto,
    relevamiento,
    detalle,
    observacion,
    subject,
    idLTYreporte,
  };

  return encabezados;
}

function formatarMenu(doc, configMenu, objTranslate) {
  // console.log(configMenu);
  let firmado;
  let count = 0;
  if (
    configMenu &&
    configMenu.configFirma &&
    typeof configMenu.configFirma === 'object'
  ) {
    // Verificar si configFirma es un objeto y no un string
    if (
      Object.prototype.toString.call(configMenu.configFirma) ===
      '[object Object]'
    ) {
      // for (const key in configMenu.configFirma) {
      //   if (configMenu.configFirma.hasOwnProperty(key)) {
      //     count++;
      //   }
      // }
      count += Object.keys(configMenu.configFirma).length;
      count > 1 ? (firmado = true) : (firmado = false);
    }
  }

  let elementosStyle;
  let nuevoConfigMenu;
  if ((doc === 'null' && firmado === undefined) || firmado === false) {
    //! console.log('menu básico sin doc');
    nuevoConfigMenu = {
      guardar: true,
      guardarComo: false,
      guardarCambios: false,
      firma: true,
      configFirma: 'x',
    };
    elementosStyle = {
      element: [
        'idDivGuardarCambio',
        'idDivGuardarComoNuevo',
        'idHrGuardarCambio',
        'idHrGuardarComoNuevo',
        'idDivFirmado',
      ],
      style: ['none', 'none', 'none', 'none', 'none'],
      remove: [null, null, null, null, null],
    };
  }
  if (doc === 'null' && firmado === true) {
    //! console.log('menú con firma sin doc');
    const idMensaje2 = document.getElementById('idMensaje2');
    const mensajeFirmado =
      trO('Documento firmado digitalmente.', objTranslate) ||
      'Documento firmado digitalmente.';

    idMensaje2.innerText = `${mensajeFirmado}`;
    const textFirmado = arrayGlobal.objMenu.mensajeFirmado.text;
    const firmadoPor = trO(textFirmado, objTranslate) || textFirmado;
    const idMensajeFirmado = document.getElementById('idMensajeFirmado');

    idMensajeFirmado.innerText = `${firmadoPor}: ${configMenu.configFirma.nombre}`;
    idMensajeFirmado.style.display = 'flex';
    nuevoConfigMenu = {
      guardar: configMenu.guardar,
      guardarComo: configMenu.guardarComo,
      guardarCambios: configMenu.guardarCambios,
      firma: configMenu.firma,
      configFirma: configMenu.configFirma,
    };
    elementosStyle = {
      element: [
        'idMensajeFirmado',
        'idDivFirmar',
        'idDivFirmado',
        'idDivGuardarCambio',
        'idDivGuardarComoNuevo',
        'idHrGuardarCambio',
        'idHrGuardarComoNuevo',
        'idMensaje2',
      ],
      style: ['flex', 'none', 'flex', 'none', 'none', 'none', 'none', 'none'],
      remove: [null, null, null, null, null, null, null, null],
    };
  }
  if ((doc !== 'null' && firmado === undefined) || firmado === false) {
    //! console.log('menú guardado con doc y  sin firma');
    const idMensaje1 = document.getElementById('idMensaje1');
    const mensajeDoc =
      trO(
        'Estás trabajando con un control guardado con el número:',
        objTranslate,
      ) || 'Estás trabajando con un control guardado con el número:';
    const documentoNumero = desencriptar(doc);
    idMensaje1.innerText = `${mensajeDoc} ${documentoNumero}`;
    nuevoConfigMenu = {
      guardar: false,
      guardarComo: true,
      guardarCambios: true,
      firma: false,
      configFirma: 'x',
    };
    sessionStorage.setItem('config_menu', encriptar(nuevoConfigMenu));
    elementosStyle = {
      element: [
        'idDivGuardar',
        'idHrGuardar',
        'idDivGuardarCambio',
        'idDivGuardarComoNuevo',
        'idHrGuardarCambio',
        'idHrGuardarComoNuevo',
        'idDivFirmado',
        'idMensajeFirmado',
        'idDivFirmar',
      ],
      style: [
        'none',
        'none',
        'flex',
        'flex',
        'flex',
        'flex',
        'none',
        'flex',
        'flex',
      ],
      remove: [null, null, null, null, null, null, null, null, null],
    };
  }
  if (doc !== 'null' && firmado === true) {
    //! console.log('menú guardado con firma');
    const idMensaje1 = document.getElementById('idMensaje1');
    const idMensaje2 = document.getElementById('idMensaje2');
    const mensajeDoc =
      trO(
        'Estás trabajando con un control guardado con el número:',
        objTranslate,
      ) || 'Estás trabajando con un control guardado con el número:';
    const documentoNumero = desencriptar(doc);
    idMensaje1.innerText = `${mensajeDoc} ${documentoNumero}`;
    const mensajeFirmado =
      trO('Documento firmado digitalmente.', objTranslate) ||
      'Documento firmado digitalmente.';

    idMensaje2.innerText = `${mensajeFirmado}`;
    const nombreFirma = configMenu.configFirma.nombre;
    const textFirmado = arrayGlobal.objMenu.mensajeFirmado.text;
    const firmadoPor = trO(textFirmado, objTranslate) || textFirmado;
    const idMensajeFirmado = document.getElementById('idMensajeFirmado');
    idMensajeFirmado.innerText = `${firmadoPor}: ${nombreFirma}`;
    idMensajeFirmado.style.display = 'flex';
    nuevoConfigMenu = {
      guardar: false,
      guardarComo: true,
      guardarCambios: true,
      firma: false,
      configFirma: configMenu.configFirma,
    };
    sessionStorage.setItem('config_menu', encriptar(nuevoConfigMenu));
    elementosStyle = {
      element: [
        'idDivGuardar',
        'idHrGuardar',
        'idDivGuardarCambio',
        'idDivGuardarComoNuevo',
        'idHrGuardarCambio',
        'idHrGuardarComoNuevo',
        'idDivFirmado',
        'idMensajeFirmado',
        'idDivFirmar',
      ],
      style: [
        'none',
        'none',
        'flex',
        'flex',
        'flex',
        'flex',
        'flex',
        'flex',
        'none',
      ],
      remove: [null, null, null, null, null, null, null, null, null],
    };
  }
  procesoStyleDisplay(elementosStyle);
}

function estilosTheadCell(element, index, arrayWidthEncabezadoThead) {
  const cell = document.createElement('th');
  cell.textContent = element;
  // trO(element.toUpperCase(), objTrad) || element.toUpperCase()
  cell.style.background = '#000000';
  cell.style.border = '1px solid #cecece';
  cell.style.overflow = 'hidden';

  const widthCell =
    widthScreenAjustado * widthScreen * arrayWidthEncabezadoThead[index];

  // let size = '8px'
  // if (widthScreen >= 800) {
  //   size = '10px'
  // }
  // cell.style.fontSize = size
  cell.style.width = `${widthCell}px`;
  widthCell === 0 ? (cell.style.display = 'none') : null;

  return cell;
}

function estilosCell(
  alignCenter,
  paddingLeft,
  type,
  datos,
  colSpan,
  fontStyle,
  fontWeight,
  background,
  colorText,
  requerido,
  display,
  objTrad,
  arrayWidthEncabezadoThead,
  index,
) {
  const cell = document.createElement('td');
  const widthCell =
    widthScreenAjustado * widthScreen * arrayWidthEncabezadoThead[index];
  let dato = '';
  if (type === 'link' && datos instanceof HTMLAnchorElement) {
    cell.appendChild(datos);
  } else {
    typeof datos === 'string' &&
    datos !== null &&
    datos.toLocaleLowerCase() !== 'observacion'
      ? (dato = trA(datos, objTrad) || datos)
      : (dato = datos);
    if (dato !== null && type === null) {
      cell.textContent = `${dato} ${requerido}` || `${dato} ${requerido}`;
    } else if (dato === null && type !== null) {
      cell.appendChild(type);
    }
  }

  cell.style.borderBottom = '1px solid #cecece';
  // cell.style.background = background;
  cell.style.zIndex = 2;
  cell.style.textAlign = alignCenter;
  cell.style.paddingLeft = paddingLeft;
  cell.style.fontStyle = fontStyle;
  cell.style.fontWeight = fontWeight;
  cell.style.color = colorText;
  cell.style.background = '#ffffff';
  cell.style.maxWidth = '20rem'; // o el valor que mejor te quede
  cell.style.minWidth = '5rem';
  cell.style.overflowWrap = 'break-word';
  cell.style.wordBreak = 'break-word';
  cell.style.whiteSpace = 'normal';

  colSpan === 1 ? (cell.colSpan = 4) : null;
  colSpan === 2 ? (cell.style.display = 'none') : null;
  colSpan === 3 ? (cell.colSpan = 3) : null;
  colSpan === 4 ? (cell.style.display = 'none') : null;
  colSpan === 5 ? (cell.colSpan = 3) : null;
  display !== null ? (cell.style.display = display) : null;
  cell.style.width = `${widthCell}px`;
  return cell;
}

function estilosTbodyCell(
  element,
  index,
  cantidadDeRegistros,
  objTrad,
  arrayWidthEncabezadoTbody,
) {
  const newRow = document.createElement('tr');
  for (let i = 0; i < 6; i++) {
    const orden = [0, 3, 4, 6, 7, 1];
    let dato = element[orden[i]];
    // const tipoDeDato = element[5];
    // const tipoDeObservacion = element[9];
    let alignCenter = 'left';
    const paddingLeft = '5px';
    const colSpan = 0;
    const fontStyle = 'normal';
    const fontWeight = 500;
    const background = '#ffffff';
    const type = null;
    const colorText = '#000000';
    const requerido = '';
    let display = null;
    if (i === 0) {
      ID += 1;
      dato = ID;
      alignCenter = 'center';
    }
    if (i === 5) {
      display = 'none';
    }

    const cell = estilosCell(
      alignCenter,
      paddingLeft,
      type,
      dato,
      colSpan,
      fontStyle,
      fontWeight,
      background,
      colorText,
      requerido,
      display,
      objTrad,
      arrayWidthEncabezadoTbody,
      i,
    );
    newRow.appendChild(cell);
  }
  return newRow;
}

async function handleClickEnlace(dato) {
  const control = await traerRegistros(`controlNT,${dato}`, null);
  // eslint-disable-next-line camelcase
  const control_N = control[0][0];
  // eslint-disable-next-line camelcase
  const control_T = control[0][1];
  let contenido = {
    // eslint-disable-next-line camelcase
    control_N,
    // eslint-disable-next-line camelcase
    control_T,
    nr: dato,
  };
  contenido = encriptar(contenido);
  sessionStorage.setItem('contenido', contenido);

  // const url = '../../Pages/Control/index.php'
  // const ruta = `${url}?v=${Math.round(Math.random() * 10)}`
  // window.open(ruta, '_blank')
  const timestamp = new Date().getTime();
  const ruta = `${SERVER}/Pages/Router/rutas.php?ruta=control&v=${timestamp}`;
  // window.location.href = ruta
  window.open(ruta, '_blank');
}

function generarUrlParaEnlace(dato) {
  const link = document.createElement('a');
  link.href = '#'; // Reemplaza con la lógica real para generar la URL del enlace
  link.textContent = dato;
  link.style.color = 'blue'; // Establece el color del enlace, puedes personalizar según tus necesidades
  link.style.textDecoration = 'underline'; // Subraya el enlace
  link.classList.add('nr');
  // link.target = '_blank'
  link.addEventListener('click', (event) => {
    event.preventDefault();
    handleClickEnlace(dato);
  });
  return link;
}

function estilosTbodyCellConsulta(
  element,
  index,
  cantidadDeRegistros,
  objTranslate,
  arrayWidthEncabezadoTcell,
  filaDoc,
) {
  const newRow = document.createElement('tr');
  for (let i = 0; i < cantidadDeRegistros; i++) {
    let dato = element[i];
    let type = null;
    if (!Number.isNaN(filaDoc) && filaDoc === i) {
      dato = generarUrlParaEnlace(dato);
      type = 'link';
    }

    const alignCenter = 'left';
    const paddingLeft = '5px';
    const colSpan = 0;
    const fontStyle = 'normal';
    const fontWeight = 500;
    const background = '#ffffff';
    // let type = null
    const colorText = '#000000';
    const requerido = '';
    const display = null;
    const cell = estilosCell(
      alignCenter,
      paddingLeft,
      type,
      dato,
      colSpan,
      fontStyle,
      fontWeight,
      background,
      colorText,
      requerido,
      display,
      null,
      arrayWidthEncabezadoTcell,
      i,
    );
    newRow.appendChild(cell);
  }
  return newRow;
}

function printDiv() {
  const objeto = document.getElementById('idDivTablas'); // Obtén el objeto a imprimir
  const ventana = window.open('', '_blank'); // Abre una ventana vacía nueva
  ventana.document.write(objeto.innerHTML); // Imprime el HTML del objeto en la nueva ventana
  ventana.document.close(); // Cierra el documento
  const style = ventana.document.createElement('style');
  style.innerHTML = `
  @media print {
    /* Estilos de impresión personalizados */
    body {
      margin: 10mm; /* Márgenes de impresión */
      color: #333;
      background-color: #fff; 
    }
    #idDivTablas {
      border: 1px solid #ccc; /* Borde para el contenedor principal */
      padding: 10px; /* Espaciado interno */
    }
    #idDivTablasEncabezado {
      visibility: hidden;
      display: none;
    }
    #idCloseModal {
        visibility: hidden;
        display: none;
    }
    h3 {
       margin-top: 5mm;
    }
    #idTablaViewer {
      width: 100%;
      margin: 0 auto;
    }
    @page {
      size: auto;
      margin: 0;
    }
  }
`;
  ventana.document.head.appendChild(style);
  ventana.print(); // Imprime la ventana
  ventana.close(); // Cierra la ventana
}

async function eliminarR(objTraductor2) {
  const nux = document.getElementById('idEliminaRegistro');
  let registro = nux.textContent;
  const matches = registro.match(/\d+/);
  registro = matches ? parseInt(matches[0], 10) : null;
  const deleteados = await eliminarRegistro(registro);
  let modal = document.getElementById('modalAlert');
  if (!modal) {
    // eslint-disable-next-line no-console
    console.warn('Error de carga en el modal');
  }
  modal.style.display = 'none';
  modal.remove();
  // eslint-disable-next-line no-use-before-define
  const miAlerta = new Alerta();
  const obj = arrayGlobal.avisoRojo;
  obj.div.width = '80%';
  obj.close.id = 'idCloseDeleteado';
  let texto = trO(deleteados.message, objTraductor2) || deleteados.message;
  texto = `${texto}: ${registro}`;
  miAlerta.createVerde(obj, texto, null);
  modal = document.getElementById('modalAlertVerde');
  modal.style.display = 'block';
  const closeModalButton = document.getElementById('idCloseDeleteado');
  closeModalButton.addEventListener('click', () => {
    // Se ejecutará después de que se haga clic en el botón de cierre del modal
    window.location.reload();
  });
}

function cerrarModal(modal) {
  try {
    const menu = document.getElementById(modal);
    menu.style.display = 'none';
    menu.remove();
  } catch (error) {
    // console.log(error);
  }
}

function formatoDivsMedidas(m1, m2, m3, num) {
  // console.log(m1, m2, m3, num);
  let px = 'px';
  m1 === 'auto' ? (px = '') : null;
  m2 === 'auto' ? (px = '') : null;
  let div = document.getElementById('idDivListControles');
  div.style.height = `${m1}${px}`;
  div = document.getElementById('idDivSEPARADOR');
  div.style.height = `${m2}${px}`;
  const divsRadios = document.querySelectorAll('.div-radios');
  divsRadios.forEach((element) => {
    const copia = { ...element };
    copia.style.height = `${m3}${px}`;
  });
  if (num === 1) {
    // vacio
    div = document.getElementById('idDivCajitaHWtx');
    div.style.display = 'none';
    div = document.getElementById('idDivCajitaHW');
    div.style.display = 'none';
    div = document.getElementById('idDivCajitaSeparador');
    div.style.display = 'none';
    const divsMedidas = document.querySelectorAll('.div-medidas');
    divsMedidas.forEach((element) => {
      const copia = { ...element };
      copia.style.display = 'none';
      // const inputs = element.getElementsByTagName('input');
      // Array.from(inputs).forEach((input) => {
      //   // input.value = 100
      // });
    });
  }
  if (num === 2) {
    // con separador
    div = document.getElementById('idDivCajitaHW');
    div.style.display = 'none';
    div = document.getElementById('idDivCajitaHWtx');
    div.style.display = 'none';
    div = document.getElementById('idDivCajitaSeparador');
    div.style.display = 'block';
    div = document.querySelector('.div-separador');
    div.style.display = 'block';
    const divsMedidas = document.querySelectorAll('.div-medidas');
    divsMedidas.forEach((element) => {
      const copia = { ...element };
      copia.style.display = 'none';
      // const inputs = element.getElementsByTagName('input');
      // Array.from(inputs).forEach((input) => {
      //   // input.value = 100
      // });
    });
  }
  if (num === 3) {
    // con foto
    div = document.getElementById('idDivCajitaHW');
    div.style.display = 'block';
    div = document.getElementById('idDivCajitaHWtx');
    div.style.display = 'none';
    div = document.getElementById('idDivCajitaSeparador');
    div.style.display = 'none';
    const divsMedidas = document.querySelectorAll('.div-medidas');
    divsMedidas.forEach((element) => {
      const copia = { ...element };
      copia.style.display = 'block';
      // const inputs = element.getElementsByTagName('input');
      // Array.from(inputs).forEach((input) => {
      //   // input.value = 100
      // });
    });
  }

  if (num === 4) {
    // con foto
    div = document.getElementById('idDivCajitaHW');
    div.style.display = 'none';
    div = document.getElementById('idDivCajitaHWtx');
    div.style.display = 'block';
    div = document.getElementById('idDivCajitaSeparador');
    div.style.display = 'none';
    const divsMedidas = document.querySelectorAll('.div-medidas');
    divsMedidas.forEach((element) => {
      const copia = { ...element };
      copia.style.display = 'block';
      // const inputs = element.getElementsByTagName('input');
      // Array.from(inputs).forEach((input) => {
      //   // input.value = 100
      // });
    });
  }
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function sanitiza(texto) {
  const blacklist = [
    'SELECT',
    'INSERT',
    'UPDATE',
    'DELETE',
    'DROP',
    'ALTER',
    'CREATE',
    'TRUNCATE',
    'EXEC',
    'UNION',
    'TABLE',
    'DATABASE',
    'FROM',
    'WHERE',
    'JOIN',
    'OR',
    'AND',
    'NOT',
    'IN',
    'VALUES',
    'SET',
    'GO',
    'EXECUTE',
    'MERGE',
    'CALL',
    'COMMIT',
    'ROLLBACK',
    'GRANT',
    'REVOKE',
    'DECLARE',
    '--',
    ';',
    "'",
    '"',
    '/*',
    '*/',
    '#',
    '*',
    '\x00',
    '\x1a',
  ];

  let valorLimpio = texto.toLocaleUpperCase();

  blacklist.forEach((pattern) => {
    const escapedPattern = escapeRegExp(pattern);
    const regex = new RegExp(`\\b${escapedPattern}\\b`, 'gi'); // new RegExp(escapedPattern, 'gi')
    valorLimpio = valorLimpio.replace(regex, '');
  });

  return valorLimpio;
}

export default class Alerta {
  constructor() {
    this.modal = null;
  }

  createAlerta(objeto, objTrad, typeAlert) {
    // Crear el elemento modal

    const obj = objeto;
    const planta = desencriptar(sessionStorage.getItem('plant'));
    const carpeta = 'Imagenes/';
    const enviaPorEmail = sessionStorage.getItem('envia_por_email');
    const enviaPorEmailBooleano = enviaPorEmail === 'true';
    // const obj = JSON.parse(JSON.stringify(objeto))
    this.modal = document.createElement('div');
    this.modal.id = 'modalAlert';
    this.modal.className = 'modal';
    this.modal.style.background = 'rgba(0, 0, 0, 0.8)';
    // Crear el contenido del modal
    if (typeAlert === 'guardar') {
      obj.divContent.height = '25vh';
    }
    if (typeAlert === 'guardarCambio') {
      obj.divContent.height = '30vh';
    }

    const modalContent = createDiv(obj.divContent);

    // const span = createSpan(obj.close)
    // modalContent.appendChild(span)
    const span = createSpan(obj.close);
    obj.divCajita.hoverColor = null;
    obj.divCajita.position = null;
    obj.divCajita.height = null;
    const divClose = createDiv(obj.divCajita);
    divClose.appendChild(span);
    modalContent.appendChild(divClose);
    obj.divCajita.height = '100px';
    let texto =
      trO(obj.titulo.text[typeAlert], objTrad) || obj.titulo.text[typeAlert];
    obj.titulo.text[typeAlert] = texto;
    obj.titulo.marginTop = null;
    const title = createH3(obj.titulo, typeAlert);
    modalContent.appendChild(title);

    texto = trO(obj.span.text[typeAlert], objTrad) || obj.span.text[typeAlert];
    obj.span.text[typeAlert] = texto;
    const spanTexto = createSpan(obj.span, texto);
    modalContent.appendChild(spanTexto);

    const divButton = createDiv(obj.divButtons);

    texto = trO(obj.btnaccept.text, objTrad) || obj.btnaccept.text;
    obj.btnaccept.text = texto;
    const buttonAceptar = createButton(obj.btnaccept);

    texto = trO(obj.btncancel.text, objTrad) || obj.btncancel.text;
    obj.btncancel.text = texto;
    const buttonCancelar = createButton(obj.btncancel);
    const buttonOk = createButton(obj.btnok);

    divButton.appendChild(buttonAceptar);
    divButton.appendChild(buttonCancelar);
    divButton.appendChild(buttonOk);

    modalContent.appendChild(divButton);
    // Agregar el contenido al modal
    this.modal.appendChild(modalContent);
    // Agregar el modal al body del documento
    document.body.appendChild(this.modal);
    const idAceptar = document.getElementById('idAceptar');
    idAceptar.addEventListener('click', () => {
      const elementosStyle = {
        element: ['modalAlert', 'modalAlertM'],
        style: ['none', 'none'],
        remove: ['remove', 'remove'],
      };
      let docStorage = sessionStorage.getItem('doc') !== 'null';
      docStorage === true
        ? (docStorage = desencriptar(sessionStorage.getItem('doc')))
        : null;
      procesoStyleDisplay(elementosStyle);
      limpiaArrays();
      // console.log(arrayGlobal.objetoControl);
      const okGuardar = guardarNuevo(
        arrayGlobal.objetoControl,
        arrayGlobal.arrayControl,
        docStorage,
        planta,
        carpeta,
      );

      const requerido = desencriptar(sessionStorage.getItem('requerido'));

      if (requerido.requerido && okGuardar) {
        const miAlerta = new Alerta();
        const miAlertaInforme = new Alerta();
        let mensaje = arrayGlobal.mensajesVarios.guardar.esperaAmarillo;

        arrayGlobal.avisoAmarillo.close.display = 'none';
        mensaje = trO(mensaje, objTrad);
        if (enviaPorEmailBooleano) {
          mensaje = `${mensaje} ${trO(
            arrayGlobal.mensajesVarios.guardar.esperaAmarilloConEmail,
            objTrad,
          )}`;
        }
        miAlerta.createVerde(arrayGlobal.avisoAmarillo, mensaje, null);
        const modal = document.getElementById('modalAlertVerde');
        modal.style.display = 'block';
        if (docStorage !== false) {
          arrayGlobal.objetoControl.nuxpedido.fill(docStorage);
        }

        const convertido = convertirObjATextPlano(arrayGlobal.objetoControl);

        const nuevoObjeto = {
          ...arrayGlobal.objetoControl,
          // eslint-disable-next-line max-len
          objJSON: Array(arrayGlobal.objetoControl.fecha.length)
            .fill(null)
            .map((_, index) => (index === 0 ? convertido : null)),
        };

        const encabezados = armaEncabezado(
          arrayGlobal,
          objTrad,
          docStorage,
          planta,
        );

        // soloEnviaEmail(nuevoObjeto, encabezados)
        // console.log(encabezados, ' >>>nuevo objeto: ', nuevoObjeto);
        insert(
          nuevoObjeto,
          convertido,
          encabezados,
          miAlertaInforme,
          objTrad,
          modal,
          docStorage,
          enviaPorEmailBooleano,
        );
      }
      if (!requerido.requerido || !okGuardar) {
        limpiaArrays();
        const fila3 = 1;
        const { idLTYcontrol } = requerido;
        const table = document.querySelector('#tableControl');
        const tbody = table.querySelector('tbody');
        let filas = tbody.querySelector(`tr:nth-child(${fila3})`);
        let celda = filas.querySelector('td:nth-child(6)');
        let id = celda.textContent.trim();
        let incremento = fila3;
        while (idLTYcontrol !== id) {
          filas.style.backgroundColor = '#ffffff';
          incremento += 1;
          filas = tbody.querySelector(`tr:nth-child(${incremento})`);
          celda = filas.querySelector('td:nth-child(6)');
          id = celda.textContent.trim();
        }
        filas.style.backgroundColor = '#f7bfc6';
        const miAlerta = new Alerta();
        let mensaje = arrayGlobal.mensajesVarios.guardar.faltanRequeridos;
        mensaje = trO(mensaje, objTrad);
        miAlerta.createVerde(arrayGlobal.avisoRojo, mensaje, null);
        const modal = document.getElementById('modalAlertVerde');
        modal.style.display = 'block';
      }
    });
  }

  createFirma(objeto, objTrad, typeAlert) {
    // Crear el elemento modal
    const obj = objeto;
    // const obj = JSON.parse(JSON.stringify(objeto))
    this.modal = document.createElement('div');
    this.modal.id = 'modalAlert';
    this.modal.className = 'modal';
    this.modal.style.background = 'rgba(0, 0, 0, 0.8)';
    this.modal.style.zIndex = '9999';
    this.modal.style.position = 'fixed';
    // Centrado horizontal y arriba
    this.modal.style.display = 'flex';
    this.modal.style.flexDirection = 'column';
    this.modal.style.alignItems = 'center';
    this.modal.style.justifyContent = 'flex-start';
    this.modal.style.paddingTop = '60px'; // o el valor que prefieras

    // Crear el contenido del modal
    if (typeAlert === 'firmar' && widthScreen !== 360) {
      obj.divContent.height = '290px';
    }
    const modalContent = createDiv(obj.divContent);

    // const span = createSpan(obj.close)
    // modalContent.appendChild(span)
    const span = createSpan(obj.close);
    obj.divCajita.hoverColor = null;
    obj.divCajita.position = null;
    obj.divCajita.height = null;
    const divClose = createDiv(obj.divCajita);
    divClose.appendChild(span);
    modalContent.appendChild(divClose);
    obj.divCajita.height = '100px';
    obj.titulo.marginTop = null;
    let texto =
      trO(obj.titulo.text[typeAlert], objTrad) || obj.titulo.text[typeAlert];
    obj.titulo.text[typeAlert] = texto;
    const title = createH3(obj.titulo, typeAlert);
    modalContent.appendChild(title);

    texto = trO(obj.span.text[typeAlert], objTrad) || obj.span.text[typeAlert];
    obj.span.text[typeAlert] = texto;
    const spanTexto = createSpan(obj.span, texto);
    modalContent.appendChild(spanTexto);

    const firmadoPor = trO('Firmado por', objTrad) || obj.mensajeFirmado.text;
    obj.divCajita.id = 'idDivFirmar';
    const divFirmar = createDiv(obj.divCajita);
    obj.input.id = 'idInputFirma';
    obj.input.type = 'password';
    obj.input.value = '';
    const inputEmail = createInput(obj.input);
    texto = trO(obj.label.innerText, objTrad) || obj.label.innerText;
    obj.label.id = 'idLabelFirma';
    obj.label.for = 'idInputFirma';
    obj.label.innerText = texto;
    const labelEmail = createLabel(obj.label);
    divFirmar.appendChild(inputEmail);
    divFirmar.appendChild(labelEmail);
    modalContent.appendChild(divFirmar);

    const divButton = createDiv(obj.divButtons);
    texto = trO(obj.btnaccept.text, objTrad) || obj.btnaccept.text;
    obj.btnaccept.text = texto;
    const buttonAceptar = createButton(obj.btnaccept);

    texto = trO(obj.btncancel.text, objTrad) || obj.btncancel.text;
    obj.btncancel.text = texto;
    const buttonCancelar = createButton(obj.btncancel);
    const buttonOk = createButton(obj.btnok);

    divButton.appendChild(buttonAceptar);
    divButton.appendChild(buttonCancelar);
    divButton.appendChild(buttonOk);

    modalContent.appendChild(divButton);
    // Agregar el contenido al modal
    this.modal.appendChild(modalContent);

    // Agregar el modal al body del documento
    document.body.appendChild(this.modal);
    const idAceptar = document.getElementById('idAceptar');
    idAceptar.addEventListener('click', () => {
      firmar(firmadoPor, objTrad);
      //! colocar la firma en el menu
    });
    const idInputFirma = document.getElementById('idInputFirma');
    idInputFirma.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        firmar(firmadoPor, objTrad);
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        cerrarModal('modalAlert');
      }
    });
  }

  createModalImagenes(objeto, imagen) {
    const imgCopy = imagen;
    const obj = objeto;
    // const obj = JSON.parse(JSON.stringify(objeto))
    this.modal = document.createElement('div');
    this.modal.id = 'modalAlert';
    this.modal.className = 'modal';
    this.modal.style.background = 'rgba(0, 0, 0, 0.5)';
    // obj.div.height = '260px';
    const modalContent = createDiv(obj.div);
    const span = createSpan(obj.close);
    modalContent.appendChild(span);
    const buttonAceptar = createButton(obj.btntrash);
    buttonAceptar.style.padding = '0px';
    const trash = document.createElement('img');
    const ruta = `${SERVER}/assets/img/icons8-trash-48.png`;
    trash.style.height = '20px';
    // trash.style.width = '20px'
    trash.src = `${ruta}`;
    buttonAceptar.appendChild(trash);
    modalContent.appendChild(buttonAceptar);
    const img = imgCopy.cloneNode(true);
    img.id = 'idVisualizador';
    img.style.height = '250px';
    // img.style.width = '250px'
    img.style.margin = 'auto auto auto auto';
    modalContent.appendChild(img);
    this.modal.appendChild(modalContent);
    document.body.appendChild(this.modal);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        cerrarModal('modalAlert');
      }
    });
  }

  createVerde(obj, texto, objTrad) {
    this.modal = document.createElement('div');
    this.modal.id = 'modalAlertVerde';
    this.modal.className = 'modal';
    this.modal.style.background = '#0D0E0F;'; // 'rgba(224, 220, 220, 0.7)';
    const modalContent = createDiv(obj.div);

    // Crear el spinner
    const spinner = document.createElement('div');
    spinner.id = 'idSpanInsert';
    spinner.className = 'spinner';
    spinner.style.width = '100px';
    spinner.style.height = '2px';
    spinner.style.borderRadius = '2px';
    spinner.style.borderTop = '4px solid transparent';
    spinner.style.position = 'absolute';
    spinner.style.top = '4px';
    spinner.style.left = '50%';
    spinner.style.transform = 'translate(-50%, -50%)';
    spinner.style.zIndex = '9999';
    spinner.style.background = '#212121';
    spinner.style.animation = 'spinner 2s linear infinite';
    spinner.style.visibility = 'visible';
    modalContent.appendChild(spinner);

    const span = createSpan(obj.close);
    modalContent.appendChild(span);

    let frase = '';
    if (objTrad === null) {
      frase = texto;
    } else {
      frase = trO(texto, objTrad) || texto;
    }
    const spanTexto = createSpan(obj.span, frase);
    modalContent.appendChild(spanTexto);

    this.modal.appendChild(modalContent);

    // Agregar el modal al body del documento
    document.body.appendChild(this.modal);
  }

  createControl(obj, texto, objTrad) {
    this.modal = document.createElement('div');
    this.modal.id = 'modalAlertCarga';
    this.modal.className = 'modal';
    // this.modal.style.background = 'rgba(224, 220, 220, 0.7)'
    this.modal.style.background = 'rgba(45, 45, 45, 0.97)';
    const modalContent = createDiv(obj.div);
    const span = createSpan(obj.close);
    modalContent.appendChild(span);
    const spinner = createSpinner(obj.spinner);
    spinner.id = 'idSpanInsert';
    modalContent.appendChild(spinner);

    const spanCarga = createSpan(obj.spanCarga);
    modalContent.appendChild(spanCarga);
    // this.modal.appendChild(spanCarga);

    let frase = '';
    if (objTrad === null) {
      frase = texto;
    } else {
      frase = trO(texto, objTrad) || texto;
    }
    const spanTexto = createSpan(obj.span, frase);
    modalContent.appendChild(spanTexto);

    this.modal.appendChild(modalContent);

    // Agregar el modal al body del documento
    document.body.appendChild(this.modal);
  }

  createModalPerson(obj, user, objTranslate) {
    this.modal = document.createElement('div');
    this.modal.id = 'modalAlertP';
    this.modal.className = 'modal';
    this.modal.style.background = 'rgba(0, 0, 0, 0.8)';
    // Crear el contenido del modal
    const modalContent = createDiv(obj.divContent);

    const span = createSpan(obj.close);
    modalContent.appendChild(span);

    const spanUser = createSpan(obj.user, user.person);
    modalContent.appendChild(spanUser);

    let texto = trO(user.home, objTranslate) || user.home;
    const spanHome = createSpan(obj.home, texto);
    modalContent.appendChild(spanHome);

    const screen = `Screen: ${widthScreen}`;
    const spanScreen = createSpan(obj.screen, screen);
    modalContent.appendChild(spanScreen);

    const hr = createHR(obj.hr);
    modalContent.appendChild(hr);

    texto = trO(user.salir, objTranslate) || user.salir;
    const spanSalir = createSpan(obj.salir, texto);
    modalContent.appendChild(spanSalir);

    this.modal.appendChild(modalContent);

    // Agregar el modal al body del documento
    document.body.appendChild(this.modal);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        cerrarModal('modalAlertP');
      }
    });
  }

  createModalMenu(objeto, objTranslate, menuSelectivo, controlN) {
    // eslint-disable-next-line no-unused-vars
    const configFirma = desencriptar(sessionStorage.getItem('firma'));
    const configMenu = desencriptar(sessionStorage.getItem('config_menu'));
    const enviaPorEmail = sessionStorage.getItem('envia_por_email') === 'true';
    const obj = objeto;
    const sinMenus = menuSelectivo.sin;
    const conMenus = menuSelectivo.con;
    // const obj = JSON.parse(JSON.stringify(objeto))
    this.modal = document.createElement('div');
    this.modal.id = 'modalAlertM';
    this.modal.className = 'modal';
    this.modal.style.background = 'rgba(0, 0, 0, 0.8)';
    this.modal.style.zIndex = '9999';
    this.modal.style.position = 'fixed';
    // Centrado horizontal y arriba
    this.modal.style.display = 'flex';
    this.modal.style.flexDirection = 'column';
    this.modal.style.alignItems = 'center';
    this.modal.style.justifyContent = 'flex-start';
    this.modal.style.paddingTop = '60px'; // o el valor que prefieras
    // Crear el contenido del modal
    const modalContent = createDiv(obj.divContent);

    const span = createSpan(obj.close);
    obj.divCajita.hoverColor = null;
    obj.divCajita.position = null;
    const divClose = createDiv(obj.divCajita);
    divClose.appendChild(span);
    modalContent.appendChild(divClose);
    let div;
    let texto;
    // let hr;
    let existeSin = false;
    let existeCon = false;

    //! guardar
    if (sinMenus.sinGuardar || conMenus.sinGuardar) {
      if (sinMenus.sinGuardar.length > 0) {
        existeSin = sinMenus.sinGuardar.includes(parseInt(controlN, 10));
      }
      if (conMenus.conGuardar.length > 0) {
        existeCon = conMenus.conGuardar.includes(parseInt(controlN, 10));
      }
    }

    if (
      (!existeSin && !existeCon) ||
      (!existeSin && existeCon) ||
      (existeSin && existeCon)
    ) {
      obj.divCajita.id = 'idDivGuardar';
      obj.divCajita.onClick = funcionGuardar;
      obj.divCajita.hoverColor = '#cecece';
      div = createDiv(obj.divCajita);
      const imgGuardar = createIMG(obj.imgGuardar);
      texto = trO(obj.guardar.text, objTranslate) || obj.guardar.text;
      const spanGuardar = createSpan(obj.guardar, texto);
      div.appendChild(imgGuardar);
      div.appendChild(spanGuardar);
      modalContent.appendChild(div);
      obj.divCajita.onClick = null;

      obj.hr.id = 'idHrGuardar';
      // hr = createHR(obj.hr);
      // modalContent.appendChild(hr)
    }
    existeSin = false;
    existeCon = false;
    //! fin guardar

    //! guardar cambio
    if (sinMenus.sinGuardarCambio || conMenus.conGuardarCambio) {
      if (sinMenus.sinGuardarCambio.length > 0) {
        existeSin = sinMenus.sinGuardarCambio.includes(parseInt(controlN, 10));
      }
      if (conMenus.conGuardarCambio.length > 0) {
        existeCon = conMenus.conGuardarCambio.includes(parseInt(controlN, 10));
      }
    }

    if (
      (!existeSin && !existeCon) ||
      (!existeSin && existeCon) ||
      (existeSin && existeCon)
    ) {
      obj.divCajita.id = 'idDivGuardarCambio';
      obj.divCajita.onClick = funcionGuardarCambio;
      obj.divCajita.hoverColor = '#cecece';
      div = createDiv(obj.divCajita);
      const imgGuardarCambio = createIMG(obj.imgGuardar);
      texto =
        trO(obj.guardarCambio.text, objTranslate) || obj.guardarCambio.text;
      const spanGuardarCambio = createSpan(obj.guardarCambio, texto);
      div.appendChild(imgGuardarCambio);
      div.appendChild(spanGuardarCambio);
      modalContent.appendChild(div);
      obj.divCajita.onClick = null;

      obj.hr.id = 'idHrGuardarCambio';
      // hr = createHR(obj.hr);
      // modalContent.appendChild(hr)
    }
    existeSin = false;
    existeCon = false;

    //! fin guardar cambio

    //! guardar como nuevo
    if (sinMenus.sinGuardarComoNuevo || conMenus.conGuardarComoNuevo) {
      if (sinMenus.sinGuardarComoNuevo.length > 0) {
        existeSin = sinMenus.sinGuardarComoNuevo.includes(
          parseInt(controlN, 10),
        );
      }
      if (conMenus.conGuardarComoNuevo.length > 0) {
        existeCon = conMenus.conGuardarComoNuevo.includes(
          parseInt(controlN, 10),
        );
      }
    }

    if (
      (!existeSin && !existeCon) ||
      (!existeSin && existeCon) ||
      (existeSin && existeCon)
    ) {
      obj.divCajita.id = 'idDivGuardarComoNuevo';
      obj.divCajita.onClick = funcionGuardarComoNuevo;
      obj.divCajita.hoverColor = '#cecece';
      div = createDiv(obj.divCajita);
      const imgGuardarComoNuevo = createIMG(obj.imgGuardar);
      texto =
        trO(obj.guardarComoNuevo.text, objTranslate) ||
        obj.guardarComoNuevo.text;
      const spanGuardarComoNuevo = createSpan(obj.guardarComoNuevo, texto);
      div.appendChild(imgGuardarComoNuevo);
      div.appendChild(spanGuardarComoNuevo);
      modalContent.appendChild(div);
      obj.divCajita.onClick = null;

      obj.hr.id = 'idHrGuardarComoNuevo';
      // hr = createHR(obj.hr);
      // modalContent.appendChild(hr)
    }
    existeSin = false;
    existeCon = false;
    //! fin guaradr como nuevo
    //! firmar
    if (sinMenus.sinHacerFirmar || conMenus.conHacerFirmar) {
      if (sinMenus.sinHacerFirmar.length > 0) {
        existeSin = sinMenus.sinHacerFirmar.includes(parseInt(controlN, 10));
      }
      if (conMenus.conHacerFirmar.length > 0) {
        existeCon = conMenus.conHacerFirmar.includes(parseInt(controlN, 10));
      }
    }

    if (
      (!existeSin && !existeCon) ||
      (!existeSin && existeCon) ||
      (existeSin && existeCon)
    ) {
      obj.divCajita.id = 'idDivFirmar';
      obj.divCajita.onClick = funcionHacerFirmar;
      obj.divCajita.hoverColor = '#cecece';
      div = createDiv(obj.divCajita);
      const imgFirmar = createIMG(obj.imgFirmar);
      texto = trO(obj.firmar.text, objTranslate) || obj.firmar.text;
      const spanFirmar = createSpan(obj.firmar, texto);
      const spanFirmado = createSpan(obj.mensajeFirmado, null);
      div.appendChild(imgFirmar);
      div.appendChild(spanFirmar);

      modalContent.appendChild(span);
      modalContent.appendChild(div);

      obj.divCajita.id = 'idDivFirmado';
      obj.divCajita.hoverBackground = null;
      obj.divCajita.hoverColor = null;
      obj.divCajita.cursor = null;
      div = createDiv(obj.divCajita);

      div.appendChild(spanFirmado);
      modalContent.appendChild(div);
      obj.divCajita.onClick = null;

      obj.hr.id = 'idHrFirmar';
      // hr = createHR(obj.hr);
      // modalContent.appendChild(hr)
      obj.divCajita.hoverBackground = '#cecece';
      obj.divCajita.hoverColor = '#cecece';
      obj.divCajita.cursor = 'pointer';
    }
    existeSin = false;
    existeCon = false;
    //! fin firmar

    //! refrescar
    obj.divCajita.id = 'idDivRefrescar';
    obj.divCajita.onClick = funcionRefrescar;
    obj.divCajita.hoverColor = '#cecece';
    div = createDiv(obj.divCajita);
    const imgRefresh = createIMG(obj.imgRefresh);
    texto = trO(obj.refresh.text, objTranslate) || obj.refresh.text;
    const spanRefresh = createSpan(obj.refresh, texto);
    div.appendChild(imgRefresh);
    div.appendChild(spanRefresh);
    modalContent.appendChild(div);
    obj.divCajita.onClick = null;

    obj.hr.id = 'idHrRefresh';
    // hr = createHR(obj.hr);
    // modalContent.appendChild(hr)
    //! fin refrescar

    //! salir
    obj.divCajita.id = 'idDivSalir';
    obj.divCajita.onClick = funcionSalir;
    obj.divCajita.hoverColor = '#cecece';
    div = createDiv(obj.divCajita);
    const imgSalir = createIMG(obj.imgSalir);
    texto = trO(obj.salir.text, objTranslate) || obj.salir.text;
    const spanSalir = createSpan(obj.salir, texto);
    div.appendChild(imgSalir);
    div.appendChild(spanSalir);
    modalContent.appendChild(div);
    obj.divCajita.onClick = null;

    obj.hr.id = 'idHrSalir';
    // hr = createHR(obj.hr);
    // modalContent.appendChild(hr)
    //! fin salir

    texto = trO(obj.mensaje1.text, objTranslate) || obj.mensaje1.text;
    const spanMensaje1 = createSpan(obj.mensaje1, texto);
    modalContent.appendChild(spanMensaje1);

    texto = trO(obj.mensaje2.text, objTranslate) || obj.mensaje2.text;
    const spanMensaje2 = createSpan(obj.mensaje2, texto);
    modalContent.appendChild(spanMensaje2);

    //! checkbox
    obj.input.id = 'idCheckBoxEmail';
    obj.input.type = 'checkbox';
    obj.divCajita.id = 'idDivCheckBoxEmail';
    obj.divCajita.hoverColor = '#cecece';
    div = createDiv(obj.divCajita);
    const inputEmail = createInput(obj.input);
    texto = trO(obj.label.innerText, objTranslate) || obj.label.innerText;
    obj.label.id = 'idLabelEmail';
    obj.label.for = 'idCheckBoxEmail';
    obj.label.innerText = texto;
    const labelEmail = createLabel(obj.label);
    div.appendChild(inputEmail);
    div.appendChild(labelEmail);
    modalContent.appendChild(div);
    //! fin checkbox
    this.modal.appendChild(modalContent);

    // Agregar el modal al body del documento
    document.body.appendChild(this.modal);
    // let elementosStyle;
    const doc = sessionStorage.getItem('doc');
    // console.log(doc)

    formatarMenu(doc, configMenu, objTranslate);
    const enviaEmail = document.getElementById('idCheckBoxEmail');
    enviaPorEmail ? (enviaEmail.checked = true) : (enviaEmail.checked = false);

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        cerrarModal('modalAlertM');
      }
    });
  }

  createModalConsultaView(objeto, objTranslate) {
    // eslint-disable-next-line no-unused-vars
    const obj = objeto;

    // const obj = JSON.parse(JSON.stringify(objeto))
    this.modal = document.createElement('div');
    this.modal.id = 'modalAlertM';
    this.modal.className = 'modal';
    this.modal.style.background = 'rgba(0, 0, 0, 0.8)';
    this.modal.style.zIndex = '9999';
    this.modal.style.position = 'fixed';
    // Centrado horizontal y arriba
    this.modal.style.display = 'flex';
    this.modal.style.flexDirection = 'column';
    this.modal.style.alignItems = 'center';
    this.modal.style.justifyContent = 'flex-start';

    // Crear el contenido del modal
    const modalContent = createDiv(obj.divContent);

    const span = createSpan(obj.close);
    obj.divCajita.hoverColor = null;
    obj.divCajita.position = null;
    const divClose = createDiv(obj.divCajita);
    divClose.appendChild(span);
    modalContent.appendChild(divClose);

    const user = desencriptar(sessionStorage.getItem('user'));
    const { tipo } = user;

    //! excel
    obj.divCajita.id = 'idExcel';
    obj.divCajita.onClick = funcionExportarExcel;
    let div = createDiv(obj.divCajita);
    const imgExcel = createIMG(obj.imgExcel);
    let texto = trO(obj.excel.text, objTranslate) || obj.excel.text;
    const spanExcel = createSpan(obj.excel, texto);
    div.appendChild(imgExcel);
    div.appendChild(spanExcel);
    modalContent.appendChild(div);
    obj.divCajita.onClick = null;

    obj.hr.id = 'idHrExcel';
    let hr = createHR(obj.hr);
    // modalContent.appendChild(hr)
    //! fin excel

    //! pdf
    obj.divCajita.id = 'idPDF';
    obj.divCajita.onClick = funcionExportarPDF;
    div = createDiv(obj.divCajita);
    const imgPdf = createIMG(obj.imgPdf);
    texto = trO(obj.pdf.text, objTranslate) || obj.pdf.text;
    const spanPdf = createSpan(obj.pdf, texto);
    div.appendChild(imgPdf);
    div.appendChild(spanPdf);
    modalContent.appendChild(div);
    obj.divCajita.onClick = null;

    obj.hr.id = 'idHrPdf';
    hr = createHR(obj.hr);
    // modalContent.appendChild(hr)
    //! fin pdf

    //! json
    obj.divCajita.id = 'idJson';
    obj.divCajita.onClick = funcionExportarJSON;

    div = createDiv(obj.divCajita);
    const imgJson = createIMG(obj.imgJson);
    texto = trO(obj.json.text, objTranslate) || obj.json.text;
    const spanJson = createSpan(obj.json, texto);
    div.appendChild(imgJson);
    div.appendChild(spanJson);
    modalContent.appendChild(div);
    obj.divCajita.onClick = null;

    obj.hr.id = 'idHrJson';
    hr = createHR(obj.hr);
    // modalContent.appendChild(hr)
    //! fin json

    //! api
    obj.divCajita.id = 'idDivApi';
    if (parseInt(tipo, 10) >= 3) {
      obj.divCajita.onClick = funcionApi;
    }
    div = createDiv(obj.divCajita);
    const imgApi = createIMG(obj.imgApi);
    texto = trO(obj.api.text, objTranslate) || obj.api.text;
    const spanApi = createSpan(obj.api, texto);
    div.appendChild(imgApi);
    div.appendChild(spanApi);

    modalContent.appendChild(div);
    obj.divCajita.onClick = null;

    obj.mensaje0.id = 'idMensajeInstructivo';
    obj.mensaje0.display = 'none';
    texto = trO(obj.mensaje0.text, objTranslate) || obj.mensaje0.text;
    const spanMensaje0 = createSpan(obj.mensaje0, texto);
    modalContent.appendChild(spanMensaje0);

    obj.mensaje1.id = 'idMensajeCopiado';
    texto = trO(obj.mensaje1.text, objTranslate) || obj.mensaje1.text;
    const spanMensaje1 = createSpan(obj.mensaje1, texto);
    modalContent.appendChild(spanMensaje1);

    obj.hr.id = 'idHrApi';
    hr = createHR(obj.hr);
    modalContent.appendChild(hr);
    //! fin api

    //! refrescar
    obj.divCajita.id = 'idDivRefrescar';
    obj.divCajita.onClick = funcionRefrescar;
    div = createDiv(obj.divCajita);
    const imgRefresh = createIMG(obj.imgRefresh);
    texto = trO(obj.refresh.text, objTranslate) || obj.refresh.text;
    const spanRefresh = createSpan(obj.refresh, texto);
    div.appendChild(imgRefresh);
    div.appendChild(spanRefresh);
    modalContent.appendChild(div);
    obj.divCajita.onClick = null;

    obj.hr.id = 'idHrRefresh';
    hr = createHR(obj.hr);
    // modalContent.appendChild(hr)
    //! fin refrescar

    //! salir
    obj.divCajita.id = 'idDivSalir';
    obj.divCajita.onClick = funcionSalir;
    div = createDiv(obj.divCajita);
    const imgSalir = createIMG(obj.imgSalir);
    texto = trO(obj.salir.text, objTranslate) || obj.salir.text;
    const spanSalir = createSpan(obj.salir, texto);
    div.appendChild(imgSalir);
    div.appendChild(spanSalir);
    modalContent.appendChild(div);
    obj.divCajita.onClick = null;

    obj.hr.id = 'idHrSalir';
    // hr = createHR(obj.hr);
    // modalContent.appendChild(hr)
    //! fin salir

    this.modal.appendChild(modalContent);

    // Agregar el modal al body del documento
    document.body.appendChild(this.modal);

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        cerrarModal('modalAlertM');
      }
    });
  }

  createViewer(objeto, array, objTrad) {
    try {
      const nivelReporte = array[14];
      const persona = desencriptar(sessionStorage.getItem('user'));
      const { tipo } = persona;
      const obj = objeto;
      // console.log(obj);
      // const obj = JSON.parse(JSON.stringify(objeto))
      this.modal = document.createElement('div');
      this.modal.id = 'modalAlertView';
      this.modal.className = 'modal';
      this.modal.style.background = 'rgba(0, 0, 0, 0.8)';
      this.modal.style.zIndex = '9999';
      this.modal.style.position = 'fixed';
      // Centrado horizontal y arriba
      this.modal.style.display = 'flex';
      this.modal.style.flexDirection = 'column';
      this.modal.style.alignItems = 'center';
      this.modal.style.justifyContent = 'flex-start';
      // Crear el contenido del modal
      const modalContent = createDiv(obj.divContent);
      // const span = createSpan(obj.close)
      // modalContent.appendChild(span)

      const span = createSpan(obj.close);
      obj.divCajita.hoverColor = null;
      obj.divCajita.position = null;
      const divClose = createDiv(obj.divCajita);
      divClose.appendChild(span);
      modalContent.appendChild(divClose);

      let texto = array[0];
      let typeAlert = 'viewer';
      // texto = trA(texto, objTrad) || texto;

      obj.titulo.text[typeAlert] = `#${array[1]} - ${texto}`;
      const title = createH3(obj.titulo, typeAlert);
      title.id = 'idTituloH3';
      title.setAttribute('data-index', array[1]);
      title.setAttribute('data-name', array[0]);
      modalContent.appendChild(title);

      // eslint-disable-next-line prefer-destructuring
      texto = array[2];
      texto = trA(texto, objTrad) || texto;
      typeAlert = 'descripcion';
      obj.span.text[typeAlert] = texto;
      obj.span.marginTop = '10px';
      let spanTexto = createSpan(obj.span, texto);
      modalContent.appendChild(spanTexto);

      texto = trO('Primera', objTrad) || 'Primera';
      typeAlert = 'fechas';
      let mensaje = `${texto} ${array[16]}`;
      texto = trO('Última', objTrad) || 'Última';
      mensaje = `${mensaje} - ${texto} ${array[3]}`;
      obj.span.text[typeAlert] = mensaje;
      obj.span.fontSize = '10px';
      obj.span.fontColor = 'red';
      obj.span.marginTop = '10px';
      spanTexto = createSpan(obj.span, mensaje);
      modalContent.appendChild(spanTexto);

      texto = trO('Tipo de usuario:', objTrad) || 'Tipo de usuario:';
      texto = `${texto} ${array[14]}-${array[19]}`;
      typeAlert = 'nivelUsuario';
      obj.span.text[typeAlert] = `${texto} ${array[14]}-${array[19]}`;
      obj.span.fontSize = '12px';
      obj.span.fontColor = '#212121';
      obj.span.marginTop = '10px';
      spanTexto = createSpan(obj.span, texto);
      modalContent.appendChild(spanTexto);

      if (nivelReporte <= parseInt(tipo, 10)) {
        const divButton = createDiv(obj.divButtons);
        texto = trO(obj.btnNuevo.text, objTrad) || obj.btnNuevo.text;
        obj.btnNuevo.text = texto;
        const btnNuevo = createButton(obj.btnNuevo);

        texto =
          trO(obj.btnVerCargados.text, objTrad) || obj.btnVerCargados.text;
        obj.btnVerCargados.text = texto;
        const btnVerCargados = createButton(obj.btnVerCargados);

        texto =
          trO(obj.btnProcedimiento.text, objTrad) || obj.btnProcedimiento.text;
        obj.btnProcedimiento.text = texto;
        const btnProcedimiento = createButton(obj.btnProcedimiento);

        texto =
          trO(obj.btnVerCargadosPorFecha.text, objTrad) ||
          obj.btnVerCargadosPorFecha.text;
        obj.btnVerCargadosPorFecha.text = texto;
        const btnVerCargadosPorFecha = createButton(obj.btnVerCargadosPorFecha);

        divButton.appendChild(btnNuevo);
        divButton.appendChild(btnVerCargados);
        divButton.appendChild(btnProcedimiento);
        divButton.appendChild(btnVerCargadosPorFecha);
        modalContent.appendChild(divButton);
        this.modal.appendChild(modalContent);
        document.body.appendChild(this.modal);
        const idbtnNuevo = document.getElementById('idbtnNuevo');
        idbtnNuevo.addEventListener('click', () => {
          const idTituloH3 = document.getElementById('idTituloH3');
          const cod = idTituloH3.getAttribute('data-index');
          const name = idTituloH3.getAttribute('data-name');
          const url = `${cod}`;

          const objetoRuta = {
            control_N: url,
            control_T: decodeURIComponent(name),
            nr: '0',
          };
          sessionStorage.setItem('contenido', encriptar(objetoRuta));

          const timestamp = new Date().getTime();
          const ruta = `${SERVER}/Pages/Router/rutas.php?ruta=control&v=${timestamp}`;
          window.location.href = ruta;
          // window.open(ruta, '_blank')
        });
        const idbtnCargados = document.getElementById('idVerCargados');
        idbtnCargados.addEventListener('click', () => {
          const idTituloH3 = document.getElementById('idTituloH3');
          const cod = idTituloH3.getAttribute('data-index');
          const name = idTituloH3.getAttribute('data-name');
          const url = `${cod}`;
          const timestamp = new Date().getTime();
          const ruta = `${SERVER}/Pages/Router/rutas.php?ruta=controlView&v=${timestamp}`;
          // const ruta = `../../Pages/ControlsView/index.php?v=${Math.round(
          //   Math.random() * 10
          // )}`
          // console.log(url);
          const objetoRuta = {
            control_N: url,
            control_T: decodeURIComponent(name),
            nr: '0',
          };
          sessionStorage.setItem('listadoCtrls', encriptar(objetoRuta));
          // console.log(ruta)
          window.location.href = ruta;
        });
        const idbtnCargadosPorFecha = document.getElementById(
          'idVerCargadosPorFecha',
        );
        idbtnCargadosPorFecha.addEventListener('click', () => {
          const idTituloH3 = document.getElementById('idTituloH3');
          const cod = idTituloH3.getAttribute('data-index');
          const name = idTituloH3.getAttribute('data-name');
          // const url = `${cod}`;
          const datos = {
            titulo: idTituloH3.textContent,
            cod,
            name,
          };
          const miAlerta = new Alerta();
          miAlerta.createViewerPorFecha(
            arrayGlobal.porFechaEnModal,
            datos,
            objTrad,
          );
          const modal2 = document.getElementById('modalTablaViewFecha');
          modal2.style.display = 'flex';
        });
      } else {
        texto =
          trO(
            'No tiene permiso para crear o revisar este control. Póngase en contacto con su jefe. Gracias',
            objTrad,
          ) ||
          'No tiene permiso para crear o revisar este control. Póngase en contacto con su jefe. Gracias';
        typeAlert = 'descripcion';
        obj.span.text[typeAlert] = texto;
        obj.span.marginTop = '10px';
        obj.span.fontSize = '18px';
        obj.span.fontColor = 'red';
        const spanTexto2 = createSpan(obj.span, texto);
        modalContent.appendChild(spanTexto2);
        this.modal.appendChild(modalContent);
        document.body.appendChild(this.modal);
      }
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          cerrarModal('modalAlertView');
        }
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }

  createViewerPorFecha(objeto, datos, objTrad) {
    try {
      const obj = objeto;
      // const obj = JSON.parse(JSON.stringify(objeto))
      this.modal = document.createElement('div');
      this.modal.id = 'modalTablaViewFecha';
      this.modal.className = 'modal';
      this.modal.style.background = 'rgba(0, 0, 0, 0.5)';

      // Crear el contenido del modal
      const modalContent = createDiv(obj.divContent);
      // let span = createSpan(obj.close)
      // modalContent.appendChild(span)

      let span = createSpan(obj.close);
      obj.divCajita.hoverColor = null;
      obj.divCajita.position = null;
      const divClose = createDiv(obj.divCajita);
      divClose.appendChild(span);
      modalContent.appendChild(divClose);

      let texto = trO(obj.span.text, objTrad) || obj.span.text;
      span = createSpan(obj.span, texto);
      modalContent.appendChild(span);
      obj.titulo.text.text = datos.titulo;
      const title = createH3(obj.titulo, 'text');
      title.id = 'idTituloFechasH3';
      title.setAttribute('data-index', datos.cod);
      title.setAttribute('data-name', datos.name);
      modalContent.appendChild(title);

      const divEncabezado = createDiv(obj.divEncabezado);
      obj.imgPrint.display = 'inline-block';
      const imagenButton = createIMG(obj.imgPrint);
      obj.span.alignSelf = 'left';
      obj.span.passing = null;
      obj.span.className = null;
      obj.span.padding = null;
      obj.span.left = '10px';
      obj.imgPrint.display = 'inline-block';
      span = createSpan(obj.span, 'Fechas');
      divEncabezado.appendChild(imagenButton);

      divEncabezado.appendChild(span);
      modalContent.appendChild(divEncabezado);
      const hr = createHR(obj);
      modalContent.appendChild(hr);
      const fechaDeHoy = fechasGenerator.fecha_corta_yyyymmdd(new Date());
      let divInput = createDiv(obj.divInput);
      obj.input.id = 'idDesde';
      obj.input.value = fechaDeHoy;
      let input = createInput(obj.input);
      texto = trO('Desde', objTrad) || 'Desde';

      obj.label.innerText = `${texto}: `;
      obj.label.margin = 'auto 10px';
      let label = createLabel(obj.label);
      divInput.appendChild(label);
      divInput.appendChild(input);
      modalContent.appendChild(divInput);
      obj.divInput.id = 'idDivInputPorFechaHasta';
      divInput = createDiv(obj.divInput);
      obj.input.id = 'idHasta';
      obj.input.value = fechaDeHoy;
      input = createInput(obj.input);
      texto = trO('Hasta', objTrad) || 'Hasta';
      obj.label.innerText = `${texto}: `;
      obj.label.margin = 'auto 10px';
      label = createLabel(obj.label);
      divInput.appendChild(label);
      divInput.appendChild(input);
      modalContent.appendChild(divInput);
      texto = trO('Enviar', objTrad) || 'Enviar:';
      obj.btnEnviar.text = texto;
      const btn = createButton(obj.btnEnviar);
      modalContent.appendChild(btn);
      // Agregar el contenido al modal
      this.modal.appendChild(modalContent);

      // Agregar el modal al body del documento
      document.body.appendChild(this.modal);
      const idbtnEnviar = document.getElementById('idbtnEnviar');
      idbtnEnviar.addEventListener('click', () => {
        const idTituloH3 = document.getElementById('idTituloH3');
        const cod = idTituloH3.getAttribute('data-index');
        const name = idTituloH3.getAttribute('data-name');
        const inputDesde = document.getElementById('idDesde');
        const inputHasta = document.getElementById('idHasta');
        const desde = inputDesde.value;
        const hasta = inputHasta.value;
        const fechaDesde = new Date(`${desde}T00:00:00-03:00`);
        const fechaHasta = new Date(`${hasta}T00:00:00-03:00`);
        // const fechaDesde = new Date(desde)
        // const fechaHasta = new Date(hasta)
        const soloFecha1 = new Date(
          fechaDesde.getFullYear(),
          fechaDesde.getMonth(),
          fechaDesde.getDate(),
        );
        const soloFecha2 = new Date(
          fechaHasta.getFullYear(),
          fechaHasta.getMonth(),
          fechaHasta.getDate(),
        );
        const comparaFechas = soloFecha1 <= soloFecha2;
        if (comparaFechas) {
          const ruta = `${SERVER}/Pages/ControlsView/index.php?v=${Math.round(
            Math.random() * 10,
          )}`;
          const objetoRuta = {
            control_N: cod,
            control_T: decodeURIComponent(name),
            nr: '0',
            desde: inputDesde.value,
            hasta: inputHasta.value,
          };
          sessionStorage.setItem('listadoCtrls', encriptar(objetoRuta));
          window.location.href = ruta;
        } else {
          inputDesde.style.background = 'red';
        }
        document.addEventListener('keydown', (event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            cerrarModal('modalTablaViewFecha');
          }
        });
      });
    } catch (error) {
      // console.log(error);
      mostrarMensaje(error, 'error');
    }
  }

  createViewerReportes(objeto, array, objTrad) {
    try {
      const nivelReporte = array[14];
      const persona = desencriptar(sessionStorage.getItem('user'));
      const { tipo } = persona;
      const obj = objeto;
      this.modal = document.createElement('div');
      this.modal.id = 'modalAlertView';
      this.modal.className = 'modal';
      this.modal.style.background = 'rgba(0, 0, 0, 0.8)';
      this.modal.style.zIndex = '9999';
      this.modal.style.position = 'fixed';
      // Centrado horizontal y arriba
      this.modal.style.display = 'flex';
      this.modal.style.flexDirection = 'column';
      this.modal.style.alignItems = 'center';
      this.modal.style.justifyContent = 'flex-start';

      // Crear el contenido del modal
      const modalContent = createDiv(obj.divContent);
      const span = createSpan(obj.close);
      obj.divCajita.hoverColor = null;
      obj.divCajita.position = null;
      const divClose = createDiv(obj.divCajita);
      divClose.appendChild(span);
      modalContent.appendChild(divClose);

      let texto = array[0];
      let typeAlert = 'viewer';

      obj.titulo.text[typeAlert] = `${array[1]} - ${texto}`;
      const title = createH3(obj.titulo, typeAlert);
      title.id = 'idTituloH3';
      title.setAttribute('data-index', array[1]);
      title.setAttribute('data-name', array[0]);
      title.setAttribute('data-status', array[20]);
      modalContent.appendChild(title);

      // eslint-disable-next-line prefer-destructuring
      texto = array[2];
      texto = trA(texto, objTrad) || texto;
      typeAlert = 'descripcion';
      obj.span.text[typeAlert] = texto;
      obj.span.marginTop = '10px';
      let spanTexto = createSpan(obj.span, texto);
      modalContent.appendChild(spanTexto);

      let onOf = 'ON';
      let colorOnOff = 'green';
      if (array[20] === 'n') {
        onOf = 'OFF';
        colorOnOff = 'red';
      }

      texto = `Status: ${onOf}`;
      typeAlert = 'status';
      obj.span.text[typeAlert] = texto;
      obj.span.marginTop = '2px';
      obj.span.fontColor = colorOnOff;
      const spanStatus = createSpan(obj.span, texto);
      modalContent.appendChild(spanStatus);

      texto = trO('Primera', objTrad) || 'Primera';
      typeAlert = 'fechas';
      let mensaje = `${texto} ${array[16]}`;
      texto = trO('Última', objTrad) || 'Última';
      mensaje = `${mensaje} - ${texto} ${array[3]}`;
      obj.span.text[typeAlert] = mensaje;
      obj.span.fontSize = '10px';
      obj.span.fontColor = 'red';
      obj.span.marginTop = '10px';
      spanTexto = createSpan(obj.span, mensaje);
      modalContent.appendChild(spanTexto);

      texto = trO('Tipo de usuario:', objTrad) || 'Tipo de usuario:';
      texto = `${texto} ${array[14]}-${array[19]}`;
      typeAlert = 'nivelUsuario';
      obj.span.text[typeAlert] = texto;
      obj.span.fontSize = '12px';
      obj.span.fontColor = '#212121';
      obj.span.marginTop = '10px';
      spanTexto = createSpan(obj.span, texto);
      modalContent.appendChild(spanTexto);

      if (nivelReporte <= parseInt(tipo, 10)) {
        const divButton = createDiv(obj.divButtons);
        texto = trO('Editar', objTrad) || 'Editar';
        obj.btnNuevo.text = texto;
        const btnNuevo = createButton(obj.btnNuevo);

        texto = trO('ON/OFF', objTrad) || 'ON/OFF';
        obj.btnVerCargados.text = texto;
        const btnVerCargados = createButton(obj.btnVerCargados);

        texto =
          trO(obj.btnProcedimiento.text, objTrad) || obj.btnProcedimiento.text;
        obj.btnProcedimiento.text = texto;
        const btnProcedimiento = createButton(obj.btnProcedimiento);

        divButton.appendChild(btnNuevo);
        divButton.appendChild(btnVerCargados);
        divButton.appendChild(btnProcedimiento);

        modalContent.appendChild(divButton);
        this.modal.appendChild(modalContent);
        document.body.appendChild(this.modal);

        const idbtnNuevo = document.getElementById('idbtnNuevo');
        idbtnNuevo.addEventListener('click', () => {
          //! editar
          const idTituloH3 = document.getElementById('idTituloH3');
          const cod = idTituloH3.getAttribute('data-index');
          const name = idTituloH3.getAttribute('data-name');
          const url = `${cod}`;
          const filtrado = arrayGlobal.arrayReportes.filter(
            (subArray) => subArray[1] === cod,
          );
          const objetoRuta = {
            control_N: url,
            control_T: decodeURIComponent(name),
            nr: '0',
            filtrado,
          };
          sessionStorage.setItem('reporte', encriptar(objetoRuta));

          const timestamp = new Date().getTime();
          const ruta = `${SERVER}/Pages/Router/rutas.php?ruta=reporte&v=${timestamp}`;
          window.location.href = ruta;
        });

        const idbtnCargados = document.getElementById('idVerCargados');
        idbtnCargados.addEventListener('click', async () => {
          //! ON/OFF
          const idTituloH3 = document.getElementById('idTituloH3');
          const cod = idTituloH3.getAttribute('data-index');
          // const name = idTituloH3.getAttribute('data-name');
          const status = idTituloH3.getAttribute('data-status');
          await onOff(cod, status);

          // Recargar la página sin necesidad de setTimeout
          window.location.reload();
        });
      } else {
        texto =
          trO(
            'No tiene permiso para crear o revisar este reporte. Póngase en contacto con su jefe. Gracias',
            objTrad,
          ) ||
          'No tiene permiso para crear o revisar este reporte. Póngase en contacto con su jefe. Gracias';
        typeAlert = 'descripcion';
        obj.span.text[typeAlert] = texto;
        obj.span.marginTop = '10px';
        obj.span.fontSize = '18px';
        obj.span.fontColor = 'red';
        const spanTexto2 = createSpan(obj.span, texto);
        modalContent.appendChild(spanTexto2);
        this.modal.appendChild(modalContent);
        document.body.appendChild(this.modal);
      }

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          cerrarModal('modalAlertView');
        }
      });
    } catch (error) {
      // console.log(error);
      mostrarMensaje(error, 'error');
    }
  }

  createViewerAreas(objeto, array, callback) {
    try {
      const obj = objeto;

      this.modal = document.createElement('div');
      this.modal.id = 'modalAlert';
      this.modal.className = 'modal';
      this.modal.style.background = 'rgba(0, 0, 0, 0.5)';

      obj.divContent.height = '35vh';
      const modalContent = createDiv(obj.divContent);

      const span = createSpan(obj.close);
      obj.divCajita.hoverColor = null;
      obj.divCajita.position = null;
      obj.divCajita.height = null;
      const divClose = createDiv(obj.divCajita);
      divClose.appendChild(span);
      modalContent.appendChild(divClose);

      let texto = array[0];
      let typeAlert = 'editar';

      obj.titulo.text[typeAlert] = `${array[1]} - ${texto.toUpperCase()}`;
      const title = createH3(obj.titulo, typeAlert);
      title.id = 'idTituloH3';
      title.setAttribute('data-index', array[1]);
      title.setAttribute('data-name', array[0]);
      title.setAttribute('data-status', array[3]);
      title.setAttribute('data-visible', array[4]);
      modalContent.appendChild(title);

      let onOf = 'ON';
      let colorOnOff = 'green';
      if (array[3] === 'n') {
        onOf = 'OFF';
        colorOnOff = 'red';
      }

      texto = `Status: ${onOf}`;
      typeAlert = 'status';
      obj.span.text = texto;
      obj.span.marginTop = '2px';
      obj.span.fontColor = colorOnOff;
      obj.span.fontSize = '18px';
      let spanStatus = createSpan(obj.span, texto);
      modalContent.appendChild(spanStatus);

      onOf = 'ON';
      colorOnOff = 'green';
      if (array[4] === 'n') {
        onOf = 'OFF';
        colorOnOff = 'red';
      }

      texto = `Visible: ${onOf}`;
      typeAlert = 'status';
      obj.span.text = texto;
      obj.span.marginTop = '2px';
      obj.span.fontColor = colorOnOff;
      obj.span.fontSize = '18px';
      spanStatus = createSpan(obj.span, texto);
      modalContent.appendChild(spanStatus);

      obj.input.width = null;
      obj.input.type = 'text';
      obj.input.fontWeight = null;
      // eslint-disable-next-line prefer-destructuring
      obj.input.value = array[0];
      obj.input.id = 'idInputArea';
      const input = createInput(obj.input);
      input.addEventListener('keydown', (e) => {
        if (e.key === ',' || e.key === ':' || e.key === "'" || e.key === '"') {
          e.preventDefault();
        }
      });
      modalContent.appendChild(input);

      const divButton = createDiv(obj.divButtons);
      const btnaccept = createButton(obj.btnaccept);
      divButton.appendChild(btnaccept);

      const btncancel = createButton(obj.btncancel);
      divButton.appendChild(btncancel);

      modalContent.appendChild(divButton);

      this.modal.appendChild(modalContent);
      document.body.appendChild(this.modal);
      const idAceptar = document.getElementById('idAceptar');
      idAceptar.addEventListener('click', () => {
        //! editar
        const idTituloH3 = document.getElementById('idTituloH3');
        const cod = idTituloH3.getAttribute('data-index');
        let { value } = document.getElementById('idInputArea');
        const id = parseInt(cod, 10);
        const filtrado = arrayGlobal.arrayReportes.filter(
          (subArray) => subArray[1] === cod,
        );

        if (value !== '' && value.toLowerCase() !== array[0].toLowerCase()) {
          value = sanitiza(value).trim();
          const objetoArea = {
            id,
            value,
            filtrado,
          };
          sessionStorage.setItem('area', encriptar(objetoArea));
          funcionAreaGuardarCambios();
          callback(value);
        }
        cerrarModal('modalAlert');
      });

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          cerrarModal('modalAlert');
        }
      });
    } catch (error) {
      // console.log(error);
      mostrarMensaje(error, 'error');
    }
  }

  createCalendar(objeto, objTranslate, procedure, plant) {
    try {
      const obj = objeto;
      // const obj = JSON.parse(JSON.stringify(objeto))
      this.modal = document.createElement('div');
      this.modal.id = 'modalTablaViewFecha';
      this.modal.className = 'modal';
      this.modal.style.background = 'rgba(0, 0, 0, 0.8)';
      this.modal.style.zIndex = '9999';
      this.modal.style.position = 'fixed';
      // Centrado horizontal y arriba
      this.modal.style.display = 'flex';
      this.modal.style.flexDirection = 'column';
      this.modal.style.alignItems = 'center';
      this.modal.style.justifyContent = 'flex-start';
      this.modal.style.paddingTop = '60px';
      // Crear el contenido del modal
      const modalContent = createDiv(obj.divContent);
      // let span = createSpan(obj.close)
      // modalContent.appendChild(span)
      let span = createSpan(obj.close);
      obj.divCajita.hoverColor = null;
      obj.divCajita.position = null;
      const divClose = createDiv(obj.divCajita);
      divClose.appendChild(span);
      modalContent.appendChild(divClose);
      let texto = 'Seleccione el intervalo de fechas para la consulta:';
      texto = trO(texto, objTranslate) || texto;
      obj.span.text = texto;
      span = createSpan(obj.span, texto);
      modalContent.appendChild(span);
      obj.titulo.text.text = procedure.name;
      const title = createH3(obj.titulo, 'text');
      title.id = 'idTituloFechasH3';
      title.setAttribute('data-name', procedure.procedure);
      modalContent.appendChild(title);

      const divEncabezado = createDiv(obj.divEncabezado);
      obj.imgPrint.display = 'inline-block';
      const imagenButton = createIMG(obj.imgPrint);
      obj.span.alignSelf = 'left';
      obj.span.passing = null;
      obj.span.className = null;
      obj.span.padding = null;
      obj.span.left = '10px';
      obj.imgPrint.display = 'inline-block';
      span = createSpan(obj.span, 'Fechas');
      divEncabezado.appendChild(imagenButton);

      divEncabezado.appendChild(span);
      modalContent.appendChild(divEncabezado);
      const hr = createHR(obj);
      modalContent.appendChild(hr);
      const fechaDeHoy = fechasGenerator.fecha_corta_yyyymmdd(new Date());
      let divInput = createDiv(obj.divInput);
      obj.input.id = 'idDesde';
      obj.input.value = fechaDeHoy;
      let input = createInput(obj.input);
      texto = trO('Desde', objTranslate) || 'Desde';

      obj.label.innerText = `${texto}: `;
      obj.label.margin = 'auto 10px';
      obj.color = '#212121';
      let label = createLabel(obj.label);
      divInput.appendChild(label);
      divInput.appendChild(input);
      modalContent.appendChild(divInput);
      obj.divInput.id = 'idDivInputPorFechaHasta';
      divInput = createDiv(obj.divInput);
      obj.input.id = 'idHasta';
      obj.input.value = fechaDeHoy;
      input = createInput(obj.input);
      texto = trO('Hasta', objTranslate) || 'Hasta';
      obj.label.innerText = `${texto}: `;
      obj.label.margin = 'auto 10px';
      label = createLabel(obj.label);
      divInput.appendChild(label);
      divInput.appendChild(input);
      modalContent.appendChild(divInput);
      texto = trO('Enviar', objTranslate) || 'Enviar:';
      obj.btnEnviar.text = texto;
      const btn = createButton(obj.btnEnviar);
      btn.setAttribute('data-procedure', procedure.procedure);
      modalContent.appendChild(btn);
      // Agregar el contenido al modal
      this.modal.appendChild(modalContent);

      // Agregar el modal al body del documento
      document.body.appendChild(this.modal);
      const idbtnEnviar = document.getElementById('idbtnEnviar');
      idbtnEnviar.addEventListener('click', async () => {
        // const name = e.target.attributes[3].value;
        // console.log(name)
        const inputDesde = document.getElementById('idDesde');
        const inputHasta = document.getElementById('idHasta');
        const desde = inputDesde.value;
        const hasta = inputHasta.value;
        const fechaDesde = new Date(`${desde}T00:00:00-03:00`);
        const fechaHasta = new Date(`${hasta}T00:00:00-03:00`);
        // const fechaDesde = new Date(desde)
        // const fechaHasta = new Date(hasta)
        const soloFecha1 = new Date(
          fechaDesde.getFullYear(),
          fechaDesde.getMonth(),
          fechaDesde.getDate(),
        );
        const soloFecha2 = new Date(
          fechaHasta.getFullYear(),
          fechaHasta.getMonth(),
          fechaHasta.getDate(),
        );
        const comparaFechas = soloFecha1 <= soloFecha2;
        if (comparaFechas) {
          const miAlerta = new Alerta();
          const aviso =
            'Se está realizando la consulta, va a demorar unos segundos, esta puede ser muy compleja dependiendo de los archivos involucrados y el intervalo de tiempo solicitado. Asegure la conexión de internet.'; // arrayGlobal.avisoListandoControles.span.text
          const mensaje = trO(aviso, objTranslate) || aviso;
          // arrayGlobal.avisoListandoControles.div.height = '200px'
          // arrayGlobal.avisoListandoControles.div.top = '70px'
          miAlerta.createControl(
            arrayGlobal.avisoListandoControles,
            mensaje,
            objTranslate,
          );
          const modal = document.getElementById('modalAlertCarga');
          modal.style.display = 'block';
          document.getElementById('idSpanCarga').style.display = 'none';
          // eslint-disable-next-line no-promise-executor-return
          await new Promise((resolve) => setTimeout(() => resolve(), 200));
          const consulta = await callProcedure(
            procedure.procedure,
            desde,
            hasta,
            procedure.operation,
          );
          const api = {
            procedure: procedure.procedure,
            desde,
            hasta,
            plant,
          };

          if (consulta.length <= 1) {
            const miAlerta2 = new Alerta();
            const aviso2 =
              'No se encotró algún registro que coincida con la fechas proporcionadas. Revise las fechas en Controles cargados.';
            const mensaje2 = trO(aviso2, objTranslate) || aviso2;
            arrayGlobal.avisoRojo.span.text = mensaje2;
            arrayGlobal.avisoRojo.span.padding = '0px 0px 0px 0px';
            arrayGlobal.avisoRojo.div.height = '110px';
            arrayGlobal.avisoRojo.div.margin = '200px auto auto auto';
            miAlerta2.createVerde(
              arrayGlobal.avisoRojo,
              mensaje2,
              objTranslate,
            );
            let modal2 = document.getElementById('modalAlertCarga');
            modal2.remove();
            modal2 = document.getElementById('modalAlertVerde');
            modal2.style.display = 'block';
          }
          if (consulta.length > 1) {
            sessionStorage.setItem('api', encriptar(api));
            let modal3 = document.getElementById('modalAlertCarga');
            modal3.remove();
            modal3 = document.getElementById('modalTablaViewFecha');
            modal3.remove();
            const table = document.getElementById('tableConsultaViews');

            table.style.display = 'block';
            const encabezados = {
              title: consulta[0],
            };
            const arrayWidth = [];
            consulta[0].forEach(() => {
              arrayWidth.push(1);
            });
            const thead = document.createElement('thead');
            const newRow = document.createElement('tr');
            let filaDoc = null;
            encabezados.title.forEach((element, index) => {
              if (element.toLowerCase() === 'doc') {
                filaDoc = index;
              }
              const elementoTranslate =
                trA(element.toUpperCase(), objTranslate) ||
                element.toUpperCase();
              const cell = estilosTheadCell(
                elementoTranslate,
                index,
                arrayWidth,
              );
              newRow.appendChild(cell);
            });
            thead.appendChild(newRow);
            table.appendChild(thead);
            consulta.shift();
            const nuevoArray = [...consulta];
            const cantidadDeRegistros = nuevoArray[0].length;
            const tbody = document.createElement('tbody');
            nuevoArray.forEach((element, index) => {
              const newRowCalendar = estilosTbodyCellConsulta(
                element,
                index,
                cantidadDeRegistros,
                objTranslate,
                arrayWidth,
                filaDoc,
              );
              tbody.appendChild(newRowCalendar);
            });
            table.appendChild(tbody);
          }
        } else {
          inputDesde.style.background = 'red';
        }
      });
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          cerrarModal('modalTablaViewFecha');
        }
      });
    } catch (error) {
      // console.log(error);
      mostrarMensaje(error, 'error');
    }
  }

  async createSinCalendar(objeto, texto, objTranslate, procedure, plant) {
    try {
      const obj = objeto;
      // const obj = JSON.parse(JSON.stringify(objeto))
      this.modal = document.createElement('div');
      this.modal.id = 'modalAlertCarga';
      this.modal.className = 'modal';
      this.modal.style.background = 'rgba(224, 220, 220, 0.7)';
      const modalContent = createDiv(obj.div);
      const span = createSpan(obj.close);
      modalContent.appendChild(span);

      const spanCarga = createSpan(obj.spanCarga);
      this.modal.appendChild(spanCarga);

      let frase = '';
      if (objTranslate === null) {
        frase = texto;
      } else {
        frase = trO(texto, objTranslate) || texto;
      }
      const spanTexto = createSpan(obj.span, frase);
      modalContent.appendChild(spanTexto);

      this.modal.appendChild(modalContent);

      // Agregar el modal al body del documento
      document.body.appendChild(this.modal);
      const consulta = await callProcedure(
        procedure.procedure,
        null,
        null,
        procedure.operation,
      );
      const api = {
        procedure: procedure.procedure,
        desde: null,
        hasta: null,
        plant,
      };
      if (consulta.length <= 1) {
        const miAlerta = new Alerta();
        const aviso =
          'No se encotró algún registro que coincida con la fechas proporcionadas. Revise las fechas en Controles cargados.';
        const mensaje = trO(aviso, objTranslate) || aviso;
        arrayGlobal.avisoRojo.span.text = mensaje;
        arrayGlobal.avisoRojo.span.padding = '0px 0px 0px 0px';
        arrayGlobal.avisoRojo.div.height = '110px';
        arrayGlobal.avisoRojo.div.margin = '200px auto auto auto';
        miAlerta.createVerde(arrayGlobal.avisoRojo, mensaje, objTranslate);
        let modal = document.getElementById('modalAlertCarga');
        modal.remove();
        modal = document.getElementById('modalAlertVerde');
        modal.style.display = 'block';
      }
      if (consulta.length > 1) {
        sessionStorage.setItem('api', encriptar(api));
        const modal = document.getElementById('modalAlertCarga');
        modal.remove();
        const table = document.getElementById('tableConsultaViews');
        table.style.display = 'block';
        const encabezados = {
          title: consulta[0],
        };
        const arrayWidth = [];
        consulta[0].forEach(() => {
          arrayWidth.push(1);
        });
        const thead = document.createElement('thead');
        const newRow = document.createElement('tr');
        let filaDoc = null;
        encabezados.title.forEach((element, index) => {
          if (element.toLowerCase() === 'doc') {
            filaDoc = index;
          }
          const elementoTranslate =
            trA(element.toUpperCase(), objTranslate) || element.toUpperCase();
          const cell = estilosTheadCell(elementoTranslate, index, arrayWidth);
          newRow.appendChild(cell);
        });
        thead.appendChild(newRow);
        table.appendChild(thead);
        consulta.shift();
        const nuevoArray = [...consulta];
        const cantidadDeRegistros = nuevoArray[0].length;
        const tbody = document.createElement('tbody');
        nuevoArray.forEach((element, index) => {
          const newRow2 = estilosTbodyCellConsulta(
            element,
            index,
            cantidadDeRegistros,
            objTranslate,
            arrayWidth,
            filaDoc,
          );
          tbody.appendChild(newRow2);
        });
        table.appendChild(tbody);
      }
    } catch (error) {
      mostrarMensaje(error, 'error');
    }
  }

  createMenuListControls(objeto, control, nuxpedido, traerControl, objTrad) {
    try {
      let firma = document.getElementById('spanUbicacion').textContent;
      //! viewer para print
      const obj = objeto;
      // const obj = JSON.parse(JSON.stringify(objeto))
      this.modal = document.createElement('div');
      this.modal.id = 'modalTablaView';
      this.modal.className = 'modal';
      this.modal.style.background = 'rgba(0, 0, 0, 0.5)';
      // Crear el contenido del modal
      const modalContent = createDiv(obj.divContent);
      const span = createSpan(obj.close);
      this.modal.appendChild(span);

      const divEncabezado = createDiv(obj.divEncabezado);
      const buttonPDF = createButton(obj.btnPDF);
      const imagenButton = createIMG(obj.imgPrint);
      buttonPDF.appendChild(imagenButton);
      buttonPDF.addEventListener('click', () => {
        printDiv();
      });
      divEncabezado.appendChild(buttonPDF);
      this.modal.appendChild(divEncabezado);

      obj.titulo.text.control = firma;
      obj.titulo.fontSize = '20px';
      obj.titulo.marginTop = '0px';
      firma = createH3(obj.titulo, 'control');
      modalContent.appendChild(firma);

      const texto = `${control.control_N} - ${control.control_T} - ${nuxpedido}`;
      // console.log(texto)
      obj.titulo.text.control = texto;
      obj.titulo.fontSize = '14px';
      const title = createH3(obj.titulo, 'control');
      modalContent.appendChild(title);

      const table = document.createElement('table');
      table.setAttribute('id', 'idTablaViewer');
      const thead = document.createElement('thead');
      const newRow = document.createElement('tr');
      const encabezados = {
        title: [
          'id',
          'concepto',
          'relevamiento',
          'detalle',
          'observación',
          'idControl',
        ],
        width: ['.05', '.15', '.25', '.25', '.25', '0'],
      };
      arrayWidthEncabezado = [...encabezados.width];
      encabezados.title.forEach((element, index) => {
        const elementoTranslate =
          trO(element.toUpperCase(), objTrad) || element.toUpperCase();
        const cell = estilosTheadCell(
          elementoTranslate,
          index,
          arrayWidthEncabezado,
        );
        newRow.appendChild(cell);
      });
      thead.appendChild(newRow);
      table.appendChild(thead);
      const tbody = document.createElement('tbody');
      tbody.setAttribute('id', 'idTbodyModal');
      const cantidadDeRegistros = traerControl.length;
      traerControl.forEach((element, index) => {
        const newRow2 = estilosTbodyCell(
          element,
          index,
          cantidadDeRegistros,
          objTrad,
          arrayWidthEncabezado,
        );
        tbody.appendChild(newRow2);
      });
      table.appendChild(tbody);
      const divAuxiliar = document.createElement('div');
      divAuxiliar.setAttribute('id', 'divAuxiliar');
      divAuxiliar.appendChild(table);
      modalContent.appendChild(divAuxiliar);
      // modalContent.appendChild(table);
      this.modal.appendChild(modalContent);
      document.body.appendChild(this.modal);
    } catch (error) {
      mostrarMensaje(error, 'error');
    }
  }

  createEliminaRegistro(objeto, nuxpedido, objTrad, control) {
    // eslint-disable-next-line camelcase
    const { control_N, control_T } = control;
    const obj = objeto;
    // const obj = JSON.parse(JSON.stringify(objeto))
    this.modal = document.createElement('div');
    this.modal.id = 'modalAlert';
    this.modal.className = 'modal';
    this.modal.style.background = 'rgba(0, 0, 0, 0.7)';

    obj.divContent.background = 'rgba(230, 32, 32, 1)';
    obj.divContent.height = '290px';
    const modalContent = createDiv(obj.divContent);
    const span = createSpan(obj.close);
    modalContent.appendChild(span);

    let texto =
      trO(obj.titulo.text.eliminar, objTrad) || obj.titulo.text.eliminar;
    obj.titulo.text.eliminar = `${texto}!!!`;
    const title = createH3(obj.titulo, 'eliminar');
    modalContent.appendChild(title);

    texto = trO(obj.titulo.text.eliminar, objTrad) || obj.titulo.text.eliminar;
    // eslint-disable-next-line camelcase
    obj.titulo.text.eliminar = `${control_N} - ${control_T}`;
    obj.titulo.marginTop = '0px';
    const ctrl = createH3(obj.titulo, 'eliminar');
    modalContent.appendChild(ctrl);

    texto = trO(obj.span.text.eliminar, objTrad) || obj.span.text.eliminar;
    const registro = `${texto}: ${nuxpedido}`;
    obj.span.id = 'idEliminaRegistro';
    obj.span.text.eliminar = registro;
    const spanTexto = createSpan(obj.span, registro);
    modalContent.appendChild(spanTexto);

    obj.divButtons.background = 'rgba(230, 32, 32, 1)';
    const divButton = createDiv(obj.divButtons);

    texto = trO(obj.btnaccept.text, objTrad) || obj.btnaccept.text;
    obj.btnaccept.text = texto;
    const buttonAceptar = createButton(obj.btnaccept);

    texto = trO(obj.btncancel.text, objTrad) || obj.btncancel.text;
    obj.btncancel.text = texto;
    const buttonCancelar = createButton(obj.btncancel);

    divButton.appendChild(buttonAceptar);
    divButton.appendChild(buttonCancelar);

    modalContent.appendChild(divButton);
    // Agregar el contenido al modal
    this.modal.appendChild(modalContent);
    document.body.appendChild(this.modal);

    const idAceptar = document.getElementById('idAceptar');
    idAceptar.addEventListener('click', () => {
      eliminarR(objTrad);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        cerrarModal('modalAlert');
      }
    });
  }

  createModalMenuReportes(objeto, objTranslate) {
    // eslint-disable-next-line no-unused-vars

    const obj = objeto;
    // const obj = JSON.parse(JSON.stringify(objeto))
    this.modal = document.createElement('div');
    this.modal.id = 'modalAlertM';
    this.modal.className = 'modal';
    this.modal.style.background = 'rgba(0, 0, 0, 0.8)';
    this.modal.style.zIndex = '9999';
    this.modal.style.position = 'fixed';
    // Centrado horizontal y arriba
    this.modal.style.display = 'flex';
    this.modal.style.flexDirection = 'column';
    this.modal.style.alignItems = 'center';
    this.modal.style.justifyContent = 'flex-start';
    // Crear el contenido del modal
    const modalContent = createDiv(obj.divContent);

    const span = createSpan(obj.close);
    obj.divCajita.hoverColor = null;
    obj.divCajita.position = null;
    const divClose = createDiv(obj.divCajita);
    divClose.appendChild(span);
    modalContent.appendChild(divClose);

    //! nuevo reporte
    obj.divCajita.id = 'idDivNuevoReporte';
    obj.divCajita.onClick = funcionNuevoReporte;
    let div = createDiv(obj.divCajita);
    const imgNuevoReporte = createIMG(obj.imgNuevoReporte);
    let texto = trO(obj.nuevo.text, objTranslate) || obj.nuevo.text;
    const spanNuevoReporte = createSpan(obj.nuevo, texto);
    div.appendChild(imgNuevoReporte);
    div.appendChild(spanNuevoReporte);
    modalContent.appendChild(div);
    obj.divCajita.onClick = null;

    //! fin nuevo reporte

    //! refrescar
    obj.divCajita.id = 'idDivRefrescar';
    obj.divCajita.onClick = funcionRefrescar;
    div = createDiv(obj.divCajita);
    const imgRefresh = createIMG(obj.imgRefresh);
    texto = trO(obj.refresh.text, objTranslate) || obj.refresh.text;
    const spanRefresh = createSpan(obj.refresh, texto);
    div.appendChild(imgRefresh);
    div.appendChild(spanRefresh);
    modalContent.appendChild(div);
    obj.divCajita.onClick = null;

    //! fin refrescar

    //! salir
    obj.divCajita.id = 'idDivSalir';
    obj.divCajita.onClick = funcionSalir;
    div = createDiv(obj.divCajita);
    const imgSalir = createIMG(obj.imgSalir);
    texto = trO(obj.salir.text, objTranslate) || obj.salir.text;
    const spanSalir = createSpan(obj.salir, texto);
    div.appendChild(imgSalir);
    div.appendChild(spanSalir);
    modalContent.appendChild(div);
    obj.divCajita.onClick = null;
    //! fin salir

    this.modal.appendChild(modalContent);

    // Agregar el modal al body del documento
    document.body.appendChild(this.modal);
  }

  createModalMenuCRUDReporte(objeto, objTranslate, guardarComo) {
    // eslint-disable-next-line no-unused-vars

    const obj = objeto;
    // const obj = JSON.parse(JSON.stringify(objeto))
    this.modal = document.createElement('div');
    this.modal.id = 'modalAlertM';
    this.modal.className = 'modal';
    this.modal.style.background = 'rgba(0, 0, 0, 0.1)';
    // Crear el contenido del modal
    const modalContent = createDiv(obj.divContent);

    const span = createSpan(obj.close);
    obj.divCajita.hoverColor = null;
    obj.divCajita.position = null;
    const divClose = createDiv(obj.divCajita);
    divClose.appendChild(span);
    modalContent.appendChild(divClose);

    if (!guardarComo) {
      //! guardar nuevo reporte
      obj.divCajita.id = 'idDivCRUDReporte';
      obj.divCajita.onClick = funcionReporteGuardarNuevo;
      const div = createDiv(obj.divCajita);
      const imgGuardar = createIMG(obj.imgGuardar);
      const texto = trO(obj.guardar.text, objTranslate) || obj.guardar.text;
      const spanGuardar = createSpan(obj.guardarCambio, texto);
      div.appendChild(imgGuardar);
      div.appendChild(spanGuardar);
      modalContent.appendChild(div);
      obj.divCajita.onClick = null;

      //! fin guardar nuevo reporte
    } else {
      //! guardar cambios
      obj.divCajita.id = 'idDivCRUDReporte';
      obj.divCajita.onClick = funcionReporteGuardarCambios;
      let div = createDiv(obj.divCajita);
      const imgGuardarCambios = createIMG(obj.imgGuardarComo);
      let texto =
        trO(obj.guardarCambio.text, objTranslate) || obj.guardarCambio.text;
      const spanGuardarCambios = createSpan(obj.guardarCambio, texto);
      div.appendChild(imgGuardarCambios);
      div.appendChild(spanGuardarCambios);
      modalContent.appendChild(div);
      obj.divCajita.onClick = null;

      //! fin guardar cambios

      //! guardar como nuevo
      obj.divCajita.id = 'idDivGuardarComoReporte';
      obj.divCajita.onClick = funcionReporteGuardarComo;
      div = createDiv(obj.divCajita);
      const imgGuardarComo = createIMG(obj.imgGuardarComo);
      texto =
        trO(obj.guardarComoNuevo.text, objTranslate) ||
        obj.guardarComoNuevo.text;
      const spanGuardarComo = createSpan(obj.guardarComoNuevo, texto);
      div.appendChild(imgGuardarComo);
      div.appendChild(spanGuardarComo);
      modalContent.appendChild(div);
      obj.divCajita.onClick = null;

      //! fin guardar como nuevo
    }

    //! refrescar
    obj.divCajita.id = 'idDivRefrescar';
    obj.divCajita.onClick = funcionRefrescar;
    let div = createDiv(obj.divCajita);
    const imgRefresh = createIMG(obj.imgRefresh);
    let texto = trO(obj.refresh.text, objTranslate) || obj.refresh.text;
    const spanRefresh = createSpan(obj.refresh, texto);
    div.appendChild(imgRefresh);
    div.appendChild(spanRefresh);
    modalContent.appendChild(div);
    obj.divCajita.onClick = null;

    //! fin refrescar

    //! salir
    obj.divCajita.id = 'idDivSalir';
    obj.divCajita.onClick = funcionSalir;
    div = createDiv(obj.divCajita);
    const imgSalir = createIMG(obj.imgSalir);
    texto = trO(obj.salir.text, objTranslate) || obj.salir.text;
    const spanSalir = createSpan(obj.salir, texto);
    div.appendChild(imgSalir);
    div.appendChild(spanSalir);
    modalContent.appendChild(div);
    obj.divCajita.onClick = null;
    //! fin salir

    this.modal.appendChild(modalContent);

    // Agregar el modal al body del documento
    document.body.appendChild(this.modal);
  }

  createModalMenuListVariables(objeto, objTranslate) {
    // eslint-disable-next-line no-unused-vars

    const obj = objeto;
    // const obj = JSON.parse(JSON.stringify(objeto))
    this.modal = document.createElement('div');
    this.modal.id = 'modalAlertM';
    this.modal.className = 'modal';
    this.modal.style.background = 'rgba(0, 0, 0, 0.1)';
    // Crear el contenido del modal
    const modalContent = createDiv(obj.divContent);

    const span = createSpan(obj.close);
    obj.divCajita.hoverColor = null;
    obj.divCajita.position = null;
    const divClose = createDiv(obj.divCajita);
    divClose.appendChild(span);
    modalContent.appendChild(divClose);

    //! nuevo select
    obj.divCajita.id = 'idDivNuevoSelect';
    obj.divCajita.onClick = funcionNuevoSelect;
    let div = createDiv(obj.divCajita);
    const imgNuevoReporte = createIMG(obj.imgNuevoReporte);
    const mensaje = trO('Nuevo selector', objTranslate) || 'Nuevo selector';
    let texto = mensaje;
    const spanNuevoReporte = createSpan(obj.nuevo, texto);
    div.appendChild(imgNuevoReporte);
    div.appendChild(spanNuevoReporte);
    modalContent.appendChild(div);
    obj.divCajita.onClick = null;

    //! fin nuevo select

    //! refrescar
    obj.divCajita.id = 'idDivRefrescar';
    obj.divCajita.onClick = funcionRefrescar;
    div = createDiv(obj.divCajita);
    const imgRefresh = createIMG(obj.imgRefresh);
    texto = trO(obj.refresh.text, objTranslate) || obj.refresh.text;
    const spanRefresh = createSpan(obj.refresh, texto);
    div.appendChild(imgRefresh);
    div.appendChild(spanRefresh);
    modalContent.appendChild(div);
    obj.divCajita.onClick = null;

    //! fin refrescar

    //! salir
    obj.divCajita.id = 'idDivSalir';
    obj.divCajita.onClick = funcionSalir;
    div = createDiv(obj.divCajita);
    const imgSalir = createIMG(obj.imgSalir);
    texto = trO(obj.salir.text, objTranslate) || obj.salir.text;
    const spanSalir = createSpan(obj.salir, texto);
    div.appendChild(imgSalir);
    div.appendChild(spanSalir);
    modalContent.appendChild(div);
    obj.divCajita.onClick = null;
    //! fin salir

    this.modal.appendChild(modalContent);

    // Agregar el modal al body del documento
    document.body.appendChild(this.modal);
  }

  createModalMenuCRUDSelector(objeto, objTranslate, guardarComo) {
    // eslint-disable-next-line no-unused-vars

    const obj = objeto;
    // const obj = JSON.parse(JSON.stringify(objeto))
    this.modal = document.createElement('div');
    this.modal.id = 'modalAlertM';
    this.modal.className = 'modal';
    this.modal.style.background = 'rgba(0, 0, 0, 0.1)';
    // Crear el contenido del modal
    const modalContent = createDiv(obj.divContent);
    const span = createSpan(obj.close);
    obj.divCajita.hoverColor = null;
    obj.divCajita.position = null;
    const divClose = createDiv(obj.divCajita);
    divClose.appendChild(span);
    modalContent.appendChild(divClose);

    if (!guardarComo) {
      //! guardar nuevo reporte
      obj.divCajita.id = 'idDivCRUDSelector';
      obj.divCajita.onClick = funcionSelectorGuardarNuevo;
      const div = createDiv(obj.divCajita);
      const imgGuardar = createIMG(obj.imgGuardar);
      const texto = trO(obj.guardar.text, objTranslate) || obj.guardar.text;
      const spanGuardar = createSpan(obj.guardarCambio, texto);
      div.appendChild(imgGuardar);
      div.appendChild(spanGuardar);
      modalContent.appendChild(div);
      obj.divCajita.onClick = null;

      //! fin guardar nuevo reporte
    } else {
      //! guardar cambios
      obj.divCajita.id = 'idDivCRUDSelector';
      obj.divCajita.onClick = funcionSelectorGuardarCambios;
      let div = createDiv(obj.divCajita);
      const imgGuardarCambios = createIMG(obj.imgGuardarComo);
      let texto =
        trO(obj.guardarCambio.text, objTranslate) || obj.guardarCambio.text;
      const spanGuardarCambios = createSpan(obj.guardarCambio, texto);
      div.appendChild(imgGuardarCambios);
      div.appendChild(spanGuardarCambios);
      modalContent.appendChild(div);
      obj.divCajita.onClick = null;

      //! fin guardar cambios

      //! guardar cambios en las variables
      obj.divCajita.id = 'idDivGuardarCambiosEnVariables';
      obj.divCajita.onClick = funcionGuardarCambiosEnVariables;
      div = createDiv(obj.divCajita);
      const imgGuardarComo = createIMG(obj.imgGuardarComo);
      texto =
        trO('Guardar cambio en variables', objTranslate) ||
        'Guardar cambio en variables';
      const spanGuardarComo = createSpan(obj.guardarComoNuevo, texto);
      div.appendChild(imgGuardarComo);
      div.appendChild(spanGuardarComo);
      modalContent.appendChild(div);
      obj.divCajita.onClick = null;

      //! fin guardar como dar cambios en las variables
    }

    //! refrescar
    obj.divCajita.id = 'idDivRefrescar';
    obj.divCajita.onClick = funcionRefrescar;
    let div = createDiv(obj.divCajita);
    const imgRefresh = createIMG(obj.imgRefresh);
    let texto = trO(obj.refresh.text, objTranslate) || obj.refresh.text;
    const spanRefresh = createSpan(obj.refresh, texto);
    div.appendChild(imgRefresh);
    div.appendChild(spanRefresh);
    modalContent.appendChild(div);
    obj.divCajita.onClick = null;

    //! fin refrescar

    //! salir
    obj.divCajita.id = 'idDivSalir';
    obj.divCajita.onClick = funcionSalir;
    div = createDiv(obj.divCajita);
    const imgSalir = createIMG(obj.imgSalir);
    texto = trO(obj.salir.text, objTranslate) || obj.salir.text;
    const spanSalir = createSpan(obj.salir, texto);
    div.appendChild(imgSalir);
    div.appendChild(spanSalir);
    modalContent.appendChild(div);
    obj.divCajita.onClick = null;
    //! fin salir

    this.modal.appendChild(modalContent);

    // Agregar el modal al body del documento
    document.body.appendChild(this.modal);
  }

  createCRUDControles(
    objeto,
    objTrad,
    target,
    table,
    typeAlert,
    callback,
    LTYselect,
  ) {
    // console.log(objeto, objTrad, target, table, typeAlert, callback, LTYselect)
    // Crear el elemento modal
    const obj = JSON.parse(JSON.stringify(objeto));
    let datoSeleccionado = null;
    const col = parseInt(target.col, 10) - 1;
    const { column, valor } = target;
    const bindParam = [
      's',
      'i',
      's',
      's',
      's',
      's',
      's',
      'i',
      's',
      'i',
      'i',
      's',
      's',
      's',
      'i',
      'i',
      's',
      's',
      's',
      'i',
      's',
      's',
      's',
      's',
      's',
    ];
    const tipoDeParametro = bindParam[parseInt(column, 10)];
    this.modal = document.createElement('div');
    this.modal.id = 'modalAlert';
    this.modal.className = 'modal';
    this.modal.style.background = 'rgba(0, 0, 0, 0.5)';

    // Crear el contenido del modal
    obj.divContent.id = 'idDivListControles';
    // console.log(column);
    // console.log(objeto, typeAlert);
    switch (column) {
      case '3':
      case '5':
      case '12':
      case '13':
      case '20':
      case '4':
      case '14':
      case '16':
      case '17':
      case '18':
      case '21':
      case '19':
      case '22':
      case '24':
        obj.divContent.height = '300px';
        if (
          column === '5' ||
          column === '16' ||
          column === '17' ||
          column === '21'
        ) {
          obj.divContent.height = 'auto';
        }
        break;
      case '11':
        obj.divContent.height = 'auto';
        break;
      default:
        break;
    }
    // console.log(obj);
    const modalContent = createDiv(obj.divContent);
    const spanClose = createSpan(obj.close);
    spanClose.addEventListener('click', () => {
      cerrarModal('modalAlert');
    });
    obj.divCajita.hoverColor = null;
    obj.divCajita.position = null;
    obj.divCajita.height = null;
    const divClose = createDiv(obj.divCajita);
    divClose.appendChild(spanClose);
    modalContent.appendChild(divClose);
    obj.divCajita.height = '100px';

    const thead = table.getElementsByTagName('thead')[0];
    const row = thead.getElementsByTagName('tr')[0];
    let texto = row.cells[col].textContent;

    obj.titulo.marginTop = null;
    const title = createH3(obj.titulo, typeAlert);

    modalContent.appendChild(title);

    obj.span.text.control = texto;
    const spanTexto = createSpan(obj.span, texto);
    modalContent.appendChild(spanTexto);

    //! tipo de informacion
    texto = texto.replace(/\s+/g, '');
    obj.divCajita.id = `idDiv${texto}`;
    const actualMente = trO('Actual', objTrad) || 'Actual';
    switch (column) {
      case '3':
      case '5':
      case '12':
      case '13':
      case '20':
      case '16':
      case '17':
      case '21':
      case '22':
        obj.divCajita.height = null;
        // eslint-disable-next-line no-case-declarations
        const divDetalle = createDiv(obj.divCajita);
        obj.label.id = `idLabel${texto}`;
        obj.label.innerText = `${actualMente}: ${valor}`;
        obj.label.fontSize = '18px';
        obj.label.backgroundColor = '#cecece';
        // eslint-disable-next-line no-case-declarations
        const label = createLabel(obj.label);
        obj.input.id = `idInput${texto.trim()}`;
        obj.input.width = '250px';
        obj.input.fontWeight = 600;
        obj.input.value = valor;

        // eslint-disable-next-line no-case-declarations
        let input = '';
        if (column === '5') {
          obj.input.className = 'textArea-detalle';
          obj.input.rows = 3;
          input = createTextArea(obj.input);
        }
        if (column === '16') {
          let valorModificado = valor;
          if (valor === 'SQL') {
            valorModificado = `TIENE SQL.\nAcceso solamente por desarrollador.\n1º donde se inserta\n2º tipo de dato\n3º columnas del query\n4º variables a reemplazar\n5º donde se toma el valor\nEjemplo: @@@8@@@s@@@1 @@@1
            @@@5
            $SELECT tipousuario.tipo FROM tipousuario WHERE tipousuario.idtipousuario=?;
            `;
          } else {
            valorModificado = `No tiene consulta SQL.\nAcceso solamente por desarrollador.\n1º donde se inserta\n2º tipo de dato\n3º columnas del query\n4º variables a reemplazar\n5º donde se toma el valor\nEjemplo: @@@8@@@s@@@1 @@@1
            @@@5
            $SELECT tipousuario.tipo FROM tipousuario WHERE tipousuario.idtipousuario=?;`;
          }
          obj.input.className = 'textArea-detalle';
          obj.input.rows = 5;
          obj.input.value = valorModificado;
          obj.input.fontWeight = 500;
          obj.input.disabled = 'disabled';
          input = createTextArea(obj.input);
        }
        if (column === '17' || column === '21' || column === '22') {
          let valorModificado = valor;
          if (valor === 'SQL') {
            valorModificado =
              'TIENE SQL.\nAcceso solamente por desarrollador.\nDetermina un valor por un query.';
          } else {
            valorModificado =
              'No tiene consulta SQL.\nAcceso solamente por desarrollador.\nDetermina un valor por un query.';
          }
          obj.input.className = 'textArea-detalle';
          obj.input.rows = 4;
          obj.input.value = valorModificado;
          obj.input.fontWeight = 500;
          obj.input.disabled = 'disabled';
          input = createTextArea(obj.input);
        }

        if (
          column !== '5' &&
          column !== '16' &&
          column !== '17' &&
          column !== '21' &&
          column !== '22'
        ) {
          input = createTextArea(obj.input);
        }

        input.addEventListener('keydown', (e) => {
          if (
            e.key === ',' ||
            e.key === ':' ||
            e.key === "'" ||
            e.key === '"'
          ) {
            e.preventDefault();
          }
        });
        input.addEventListener('input', (e) => {
          datoSeleccionado = e.target.value;
        });

        divDetalle.appendChild(label);
        divDetalle.appendChild(input);
        modalContent.appendChild(divDetalle);
        break;
      case '4':
      case '18':
      case '24':
        obj.divCajita.height = null;
        obj.divCajita.alignItems = 'center';
        // eslint-disable-next-line no-case-declarations
        const divDetalleS = createDiv(obj.divCajita);
        obj.label.id = `idLabel${texto.trim()}`;
        obj.label.innerText = `${actualMente}: ${valor}`;
        obj.label.fontSize = '18px';
        obj.label.backgroundColor = '#cecece';
        // eslint-disable-next-line no-case-declarations
        const labelS = createLabel(obj.label);
        // eslint-disable-next-line no-case-declarations
        const nameOptions = [
          ['d', 'Fecha'],
          ['h', 'Hora'],
          ['t', 'Texto'],
          ['x', 'Nada'],
          ['n', 'Número'],
          ['tx', 'Texto-Largo'],
          ['img', 'Imagen'],
          ['s', 'Select-Variable'], // abrir la seleccion de variables
          ['cn', 'Consulta SQL'],
          ['btnqwery', 'Botón SQL'],
          ['b', 'Check-Box'],
          ['r', 'Radio'],
          ['photo', 'Foto'], // abrir campo separador para colocar width-height
          ['sd', 'Select SQL'],
          ['l', 'Leyenda'],
          ['subt', 'Sub.Título'],
          ['title', 'Título'],
          ['valid', 'Validar'],
          ['checkhour', 'Check Hora'],
          ['checkdate', 'Check Date'],
          ['checkdatehour', 'Check Date Hora'],
          ['pastillaTx', 'Pastilla Texto'],
          ['pastillaSelect', 'Pastilla Select'],
          ['pastillaConsulta', 'Pastilla Consulta'],
          ['tablex', 'Tabla'],
        ];
        // eslint-disable-next-line no-case-declarations
        const params = {
          id: '',
          className: 'select-tipodedato',
        };
        // eslint-disable-next-line no-case-declarations
        const select = createSelect(nameOptions, params, objTrad);
        datoSeleccionado = '';
        select.addEventListener('change', (e) => {
          datoSeleccionado = e.target.value;
        });
        divDetalleS.appendChild(labelS);
        divDetalleS.appendChild(select);
        modalContent.appendChild(divDetalleS);
        break;

      case '11':
        obj.divCajita.height = 'auto';
        // obj.divCajita.display = 'flex'
        // eslint-disable-next-line no-case-declarations
        const divDetalleP = createDiv(obj.divCajita);
        obj.label.id = `idLabel${texto.trim()}`;
        obj.label.innerText = `${actualMente}: ${valor}`;
        obj.label.fontSize = '18px';
        obj.label.backgroundColor = '#cecece';
        // eslint-disable-next-line no-case-declarations
        const labelTituloCampo = createLabel(obj.label);
        modalContent.appendChild(labelTituloCampo);
        // eslint-disable-next-line no-case-declarations
        const paramsRadio = {
          name: 'radio',
          class: 'radio-selector',
          height: '20px',
          width: '20px',
          id: null,
          value: null,
          background: '#D9D9D9',
          border: '2px solid #cecece',
          marginLeft: '0px',
          marginRight: '20px',
          marginTop: '1px',
          marginBotton: null,
          paddingLeft: null,
          paddingRight: null,
          paddingTop: null,
          paddingBotton: null,
          disabled: null,
          dataCustom: null,
          checked: 'checked',
        };

        //* se agrega la cajita para contener los radios
        obj.divCajita.id = null;
        obj.divCajita.className = 'div-radios';
        obj.divCajita.width = '100%';
        obj.divCajita.flexDirection = 'row';
        obj.divCajita.height = '50px';
        // eslint-disable-next-line no-case-declarations
        let divCajitaRB = createDiv(obj.divCajita);
        // eslint-disable-next-line no-case-declarations
        const radio = createRadioButton(paramsRadio);
        radio.addEventListener('change', () => {
          formatoDivsMedidas('auto', 120, 120, 1);
          datoSeleccionado = ' ';
        });
        obj.span.className = 'radio';
        obj.span.fontSize = '18px';
        obj.span.fontWeight = 600;
        obj.span.alignSelf = 'normal';
        // eslint-disable-next-line no-case-declarations
        let spanRB = createSpan(obj.span, trO('Vacío', objTrad) || 'Vacío');
        divCajitaRB.appendChild(radio);
        divCajitaRB.appendChild(spanRB);
        divDetalleP.appendChild(divCajitaRB);
        paramsRadio.checked = null;

        // eslint-disable-next-line no-case-declarations
        const radio2 = createRadioButton(paramsRadio);
        spanRB = createSpan(
          obj.span,
          trO('Con separador', objTrad) || 'Con separador',
        );
        radio2.addEventListener('change', () => {
          formatoDivsMedidas('auto', 250, 50, 2);
          datoSeleccionado = 'grey 2px solid';
        });
        divCajitaRB = createDiv(obj.divCajita);
        divCajitaRB.appendChild(radio2);
        divCajitaRB.appendChild(spanRB);
        divDetalleP.appendChild(divCajitaRB);

        //* se agrega otra cajita para separador
        obj.divCajita.id = 'idDivCajitaSeparador';
        obj.divCajita.className = null;
        obj.divCajita.heigth = '100px';
        obj.divCajita.flexDirection = 'column';
        obj.divCajita.display = 'none';
        divCajitaRB = createDiv(obj.divCajita);
        obj.divCajita.className = 'div-separador';
        obj.divCajita.id = null;
        obj.divCajita.height = null;
        obj.divCajita.width = '90%';
        obj.divCajita.flexDirection = null;
        obj.divCajita.textAlign = 'center';
        obj.label.fontWeight = 600;
        // eslint-disable-next-line no-case-declarations
        const divSeparador = createDiv(obj.divCajita);
        obj.label.id = null;
        obj.label.fontSize = '18px';
        obj.label.margin = null;
        obj.label.className = 'label-separador';
        obj.label.innerText =
          trO('----Separador----', objTrad) || '----Separador----';
        // eslint-disable-next-line no-case-declarations
        const labelSeparador = createLabel(obj.label);
        divSeparador.appendChild(labelSeparador);
        divCajitaRB.appendChild(divSeparador);
        divDetalleP.appendChild(divCajitaRB);
        modalContent.appendChild(divDetalleP);
        //*

        // eslint-disable-next-line no-case-declarations
        const radio3 = createRadioButton(paramsRadio);
        radio3.addEventListener('change', () => {
          formatoDivsMedidas('auto', 250, 150, 3);
          const ancho = document.getElementById('idWidth').value;
          const alto = document.getElementById('idHeight').value;
          const dimensions = {
            width: ancho,
            height: alto,
          };
          datoSeleccionado = JSON.stringify(dimensions);
          // datoSeleccionado = ''
        });
        spanRB = createSpan(obj.span, trO('Con Photo', objTrad) || 'Con Photo');
        obj.divCajita.id = null;
        obj.divCajita.className = 'div-radios';
        obj.divCajita.display = 'flex';
        obj.divCajita.width = '100%';
        divCajitaRB = createDiv(obj.divCajita);
        divCajitaRB.appendChild(radio3);
        divCajitaRB.appendChild(spanRB);
        obj.divCajita.id = 'idDivCajitaHW';
        obj.divCajita.className = null;
        obj.divCajita.height = 'auto'; // '800px'
        obj.divCajita.flexDirection = 'column';
        obj.divCajita.display = 'none';
        divDetalleP.appendChild(divCajitaRB);

        //* se agrega otra cajita con los inputs
        divCajitaRB = createDiv(obj.divCajita);
        obj.divCajita.className = 'div-medidas';
        obj.divCajita.id = null;
        obj.divCajita.height = null;
        obj.divCajita.width = '90%';
        obj.divCajita.flexDirection = null;
        obj.divCajita.textAlign = 'left';

        // eslint-disable-next-line no-case-declarations
        let divHW = createDiv(obj.divCajita);
        // eslint-disable-next-line no-case-declarations
        const objInput3 = { ...obj.input };
        // eslint-disable-next-line no-case-declarations
        const inputCols = { ...obj.input };
        objInput3.type = 'number';
        objInput3.width = '60%';
        objInput3.textAlign = 'left';
        objInput3.fontWeight = 600;
        objInput3.padding = '0px 0px 0px 4px';
        objInput3.value = 100;
        objInput3.className = 'solonumeros';
        obj.label.id = null;
        obj.label.fontSize = '14px';
        obj.label.margin = '15px 0px 0px 10px';
        obj.label.className = 'label-HW';
        obj.label.innerText = 'Width';
        objInput3.id = 'idWidth';
        // eslint-disable-next-line no-case-declarations
        const inputH = createInput(objInput3);
        // eslint-disable-next-line no-case-declarations
        const labelH = createLabel(obj.label);
        divHW.appendChild(inputH);
        divHW.appendChild(labelH);
        divCajitaRB.appendChild(divHW);
        divHW = createDiv(obj.divCajita);
        objInput3.id = 'idHeight';
        // eslint-disable-next-line no-case-declarations
        const inputW = createInput(objInput3);
        obj.label.innerText = 'Height';
        // eslint-disable-next-line no-case-declarations
        const labelW = createLabel(obj.label);
        divHW.appendChild(inputW);
        divHW.appendChild(labelW);
        divCajitaRB.appendChild(divHW);
        divDetalleP.appendChild(divCajitaRB);
        modalContent.appendChild(divDetalleP);

        //* se agrega para texto largo
        // eslint-disable-next-line no-case-declarations
        const radio4 = createRadioButton(paramsRadio);
        radio4.addEventListener('change', () => {
          formatoDivsMedidas('auto', 250, 150, 4); // 500
          const filaTx = document.getElementById('idWidthTx').value;
          const colsTx = document.getElementById('idHeightTx').value;
          const chkBox = document.getElementById('idboxTx');
          let colSpanTx = null;
          if (chkBox.checked === true) {
            colSpanTx = '1';
            const dimensions = {
              filaTx,
              colsTx,
              colSpanTx,
            };
            datoSeleccionado = JSON.stringify(dimensions);
          } else {
            datoSeleccionado = '';
          }
        });
        spanRB = createSpan(
          obj.span,
          trO('Texto Largo', objTrad) || 'Texto Largo',
        );
        obj.divCajita.id = null;
        obj.divCajita.className = 'div-radios';
        obj.divCajita.display = 'flex';
        obj.divCajita.width = '100%';
        divCajitaRB = createDiv(obj.divCajita);
        divCajitaRB.appendChild(radio4);
        divCajitaRB.appendChild(spanRB);
        obj.divCajita.id = 'idDivCajitaHWtx';
        obj.divCajita.className = null;
        obj.divCajita.height = 'auto'; // '800px'
        obj.divCajita.flexDirection = 'column';
        obj.divCajita.display = 'none';
        divDetalleP.appendChild(divCajitaRB);

        //* se agrega otra cajita con los inputs
        divCajitaRB = createDiv(obj.divCajita);
        obj.divCajita.className = 'div-medidas';
        obj.divCajita.id = null;
        obj.divCajita.height = null;
        obj.divCajita.width = '90%';
        obj.divCajita.flexDirection = null;
        obj.divCajita.textAlign = 'left';

        // eslint-disable-next-line no-case-declarations
        let divHWtx = createDiv(obj.divCajita);
        inputCols.type = 'number';
        inputCols.width = '60%';
        inputCols.textAlign = 'left';
        inputCols.fontWeight = 600;
        inputCols.padding = '0px 0px 0px 4px';
        inputCols.value = 3;
        inputCols.className = 'solonumeros';
        obj.label.id = null;
        obj.label.fontSize = '14px';
        obj.label.margin = '15px 0px 0px 10px';
        obj.label.className = 'label-HW';
        obj.label.innerText = 'Rows';
        inputCols.id = 'idWidthTx';
        // eslint-disable-next-line no-case-declarations
        const inputHtx = createInput(inputCols);
        // eslint-disable-next-line no-case-declarations
        const labelHtx = createLabel(obj.label);
        divHWtx.appendChild(inputHtx);
        divHWtx.appendChild(labelHtx);
        divCajitaRB.appendChild(divHWtx);
        divHWtx = createDiv(obj.divCajita);
        inputCols.id = 'idHeightTx';
        inputCols.value = 50;
        // eslint-disable-next-line no-case-declarations
        const inputWtx = createInput(inputCols);
        obj.label.innerText = 'Cols';
        // eslint-disable-next-line no-case-declarations
        const labelWtx = createLabel(obj.label);
        divHWtx.appendChild(inputWtx);
        divHWtx.appendChild(labelWtx);
        divCajitaRB.appendChild(divHWtx);
        divDetalleP.appendChild(divCajitaRB);

        obj.input.type = 'checkbox';
        obj.input.padding = '0px 0px 0px 4px';
        obj.label.id = 'idBoxTx';
        obj.label.fontSize = '14px';
        obj.label.margin = '15px 0px 0px 10px';
        obj.label.className = 'label-HW';
        obj.label.innerText = 'Si tilda ocupa 4 celdas';
        obj.input.id = 'idboxTx';
        obj.input.cursor = 'pointer';
        obj.input.width = '25px';
        // eslint-disable-next-line no-case-declarations
        const boxTx = createInput(obj.input);
        // eslint-disable-next-line no-case-declarations
        const labelBox = createLabel(obj.label);
        divCajitaRB.appendChild(boxTx);
        divCajitaRB.appendChild(labelBox);

        divDetalleP.appendChild(divCajitaRB);
        modalContent.appendChild(divDetalleP);

        break;
      case '14':
      case '19':
        //* selector de variable
        obj.divCajita.height = null;
        obj.divCajita.alignItems = 'center';
        // eslint-disable-next-line no-case-declarations
        const divDetalleSelects = createDiv(obj.divCajita);
        obj.label.id = `idLabel${texto.trim()}`;
        obj.label.innerText = `${actualMente}: ${valor}`;
        obj.label.fontSize = '18px';
        obj.label.backgroundColor = '#cecece';
        // eslint-disable-next-line no-case-declarations
        const labelSelects = createLabel(obj.label);
        // eslint-disable-next-line no-case-declarations
        const nameOptionSelect = LTYselect;
        // eslint-disable-next-line no-case-declarations
        const paramSelect = {
          id: '',
          className: 'select-tipodedato',
        };
        // eslint-disable-next-line no-case-declarations
        const selects = createSelect(nameOptionSelect, paramSelect, objTrad);
        datoSeleccionado = '';
        selects.addEventListener('change', (e) => {
          datoSeleccionado = e.target.value;
        });
        divDetalleSelects.appendChild(labelSelects);
        divDetalleSelects.appendChild(selects);
        modalContent.appendChild(divDetalleSelects);
        break;
      default:
        break;
    }

    obj.divButtons.height = null;
    obj.divButtons.margin = '10px 0px 0px 0px';
    const divButton = createDiv(obj.divButtons);
    texto = trO(obj.btnaccept.text, objTrad) || obj.btnaccept.text;
    obj.btnaccept.text = texto;

    //* ACEPTAR
    const buttonAceptar = createButton(obj.btnaccept);
    buttonAceptar.addEventListener('click', (e) => {
      e.preventDefault();
      // aceptar el cambio
      let response = false;
      let datoSatinizado = '';

      if (
        typeof datoSeleccionado === 'object' ||
        column === '16' ||
        column === '17' ||
        column === '21' ||
        column === '22' ||
        column === '11'
      ) {
        datoSatinizado = datoSeleccionado;
      } else {
        datoSatinizado = sanitiza(datoSeleccionado).trim();
      }

      if (datoSeleccionado !== null && datoSatinizado !== valor) {
        response = {
          success: true,
          dato: datoSatinizado,
          param: tipoDeParametro,
        };
      } else {
        response = { success: false, response: null };
      }

      callback(response);
      cerrarModal('modalAlert');
    });

    texto = trO(obj.btncancel.text, objTrad) || obj.btncancel.text;
    obj.btncancel.text = texto;
    const buttonCancelar = createButton(obj.btncancel);
    buttonCancelar.addEventListener('click', (e) => {
      e.preventDefault();
      cerrarModal('modalAlert');
    });
    const buttonOk = createButton(obj.btnok);

    divButton.appendChild(buttonAceptar);
    divButton.appendChild(buttonCancelar);
    divButton.appendChild(buttonOk);

    modalContent.appendChild(divButton);
    // Agregar el contenido al modal
    this.modal.appendChild(modalContent);

    // Agregar el modal al body del documento
    document.body.appendChild(this.modal);

    //! funciones de guardado

    //! --detectar escape
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        cerrarModal('modalAlert');
      }
    });
    const inputs = document.querySelectorAll('.solonumeros');
    inputs.forEach((input) => {
      input.addEventListener('input', () => {
        const copia = { ...input };
        copia.value = input.value.replace(/\D/g, ''); // Remueve cualquier carácter que no sea un dígito
      });
    });
    const chkBox = document.getElementById('idboxTx');
    const filaTx = document.getElementById('idWidthTx');
    const colsTx = document.getElementById('idHeightTx');
    if (filaTx && colsTx && colsTx) {
      let firstLoad = true;

      const handleChange = () => {
        const colSpanTx = chkBox.checked ? '1' : null;
        const dimensions = {
          filaTx: filaTx.value,
          colsTx: colsTx.value,
          colSpanTx,
        };
        if (!firstLoad && colSpanTx) {
          datoSeleccionado = JSON.stringify(dimensions);
        }
        if (!firstLoad && !colSpanTx) {
          datoSeleccionado = '';
        }
        firstLoad = false;
      };
      // Agrega el evento `change` a ambos elementos
      filaTx.addEventListener('input', handleChange);
      colsTx.addEventListener('input', handleChange);
      chkBox.addEventListener('change', handleChange);
      handleChange();
    }
    const anchoPhoto = document.getElementById('idWidth');
    const altoPhoto = document.getElementById('idHeight');
    if (anchoPhoto && altoPhoto) {
      let firstLoad = true;
      const handleChange = () => {
        const dimensions = {
          width: anchoPhoto.value,
          height: altoPhoto.value,
        };
        if (!firstLoad) {
          datoSeleccionado = JSON.stringify(dimensions);
        }
        firstLoad = false;
      };
      // Agrega el evento `change` a ambos elementos
      anchoPhoto.addEventListener('input', handleChange);
      altoPhoto.addEventListener('input', handleChange);
      handleChange();
    }
  }

  createNewCampo(objeto, objTrad, target, table, callback) {
    const obj = JSON.parse(JSON.stringify(objeto));
    let datoSeleccionado = null;
    // eslint-disable-next-line no-unused-vars
    const { antesDelGuion, despuesDelGuion } = target;
    this.modal = document.createElement('div');
    this.modal.id = 'modalAlert';
    this.modal.className = 'modal';
    this.modal.style.background = 'rgba(0, 0, 0, 0.5)';
    // Crear el contenido del modal
    obj.divContent.id = 'idDivListControles';
    obj.divContent.height = 'auto';
    const modalContent = createDiv(obj.divContent);
    const spanClose = createSpan(obj.close);
    spanClose.addEventListener('click', () => {
      cerrarModal('modalAlert');
    });
    obj.divCajita.hoverColor = null;
    obj.divCajita.position = null;
    obj.divCajita.height = null;
    const divClose = createDiv(obj.divCajita);
    divClose.appendChild(spanClose);
    modalContent.appendChild(divClose);

    obj.divCajita.height = '100px';
    let texto = `${target.antesDelGuion}-${target.despuesDelGuion}`;
    obj.titulo.marginTop = null;
    obj.titulo.text.nuevo = texto;
    const title = createH3(obj.titulo, 'nuevo');

    modalContent.appendChild(title);
    texto = trO('Campo nuevo', objTrad) || 'Campo nuevo';
    obj.span.text.control = texto;
    const spanTexto = createSpan(obj.span, texto);
    modalContent.appendChild(spanTexto);

    obj.divCajita.id = 'idDivCampNuevo';
    obj.divCajita.height = null;
    const divDetalle = createDiv(obj.divCajita);
    obj.input.id = 'idInputCampoNuevo';
    obj.input.width = '250px';
    obj.input.fontWeight = 600;
    obj.input.value = '';
    const input = createInput(obj.input);
    input.addEventListener('keydown', (e) => {
      if (e.key === ',' || e.key === ':' || e.key === "'" || e.key === '"') {
        e.preventDefault();
      }
    });
    input.addEventListener('input', (e) => {
      datoSeleccionado = e.target.value;
    });
    divDetalle.appendChild(input);
    modalContent.appendChild(divDetalle);
    obj.divButtons.height = null;
    obj.divButtons.margin = '10px 0px 0px 0px';
    const divButton = createDiv(obj.divButtons);
    texto = trO(obj.btnaccept.text, objTrad) || obj.btnaccept.text;
    obj.btnaccept.text = texto;
    const buttonAceptar = createButton(obj.btnaccept);

    buttonAceptar.addEventListener('click', (e) => {
      e.preventDefault();
      // aceptar el cambio
      let response = false;
      const datoSatinizado = sanitiza(datoSeleccionado).trim();
      if (datoSeleccionado !== null && datoSatinizado !== '') {
        const tbody = table.querySelector('tbody');
        const filas = tbody.querySelectorAll('tr');
        const cantidadDeFilas = filas.length - 1;
        const fila2 = tbody.rows[cantidadDeFilas];
        let celda = fila2.cells[8];
        const orden = parseInt(celda.textContent.trim(), 10);
        // eslint-disable-next-line prefer-destructuring
        celda = fila2.cells[0];
        const idObservacion = parseInt(celda.textContent.trim(), 10);
        response = {
          success: true,
          nombre: datoSatinizado,
          orden,
          idObservacion,
        };
      } else {
        response = { success: false, response: null };
      }
      callback(response);
      // console.log(response)
      cerrarModal('modalAlert');
    });

    texto = trO(obj.btncancel.text, objTrad) || obj.btncancel.text;
    obj.btncancel.text = texto;
    const buttonCancelar = createButton(obj.btncancel);
    buttonCancelar.addEventListener('click', (e) => {
      e.preventDefault();
      cerrarModal('modalAlert');
    });
    const buttonOk = createButton(obj.btnok);

    divButton.appendChild(buttonAceptar);
    divButton.appendChild(buttonCancelar);
    divButton.appendChild(buttonOk);

    modalContent.appendChild(divButton);
    // Agregar el contenido al modal
    this.modal.appendChild(modalContent);

    // Agregar el modal al body del documento
    document.body.appendChild(this.modal);

    //! funciones de guardado

    //! --detectar escape
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        cerrarModal('modalAlert');
      }
    });
  }

  clonarCampos(objeto, objTrad, target, array, callback) {
    // console.log(target)
    const obj = JSON.parse(JSON.stringify(objeto));
    const { idLTYreporte, nameReporte } = target;
    this.modal = document.createElement('div');
    this.modal.id = 'modalAlert';
    this.modal.className = 'modal';
    this.modal.style.background = 'rgba(0, 0, 0, 0.5)';
    // Crear el contenido del modal
    obj.divContent.id = 'idDivListControles';
    obj.divContent.height = 'auto';
    const modalContent = createDiv(obj.divContent);
    const spanClose = createSpan(obj.close);
    spanClose.addEventListener('click', () => {
      cerrarModal('modalAlert');
    });
    obj.divCajita.hoverColor = null;
    obj.divCajita.position = null;
    obj.divCajita.height = null;
    const divClose = createDiv(obj.divCajita);
    divClose.appendChild(spanClose);
    modalContent.appendChild(divClose);

    obj.divCajita.height = '100px';
    let texto = `${idLTYreporte}-${nameReporte}`;
    obj.titulo.marginTop = null;
    obj.titulo.text.clonar = texto;
    const h3 = createH3(obj.titulo, 'clonar');
    modalContent.appendChild(h3);
    texto = trO('Clonar este contol a:', objTrad) || 'Clonar este contol a:';
    obj.span.text.control = texto;
    const spanTexto = createSpan(obj.span, texto);
    modalContent.appendChild(spanTexto);
    obj.divCajita.id = 'idDivCampNuevo';
    obj.divCajita.height = null;
    const divDetalle = createDiv(obj.divCajita);
    const paramSelect = {
      id: '',
      className: 'select-tipodedato',
    };
    let datoSeleccionado = '';
    const selects = createSelect(array, paramSelect, objTrad);
    selects.addEventListener('change', (e) => {
      datoSeleccionado = {
        idOrigen: idLTYreporte,
        idDestino: e.target.value,
      };
    });
    divDetalle.appendChild(selects);
    modalContent.appendChild(divDetalle);
    obj.divButtons.height = null;
    obj.divButtons.margin = '10px 0px 0px 0px';
    const divButton = createDiv(obj.divButtons);
    texto = trO(obj.btnaccept.text, objTrad) || obj.btnaccept.text;
    obj.btnaccept.text = texto;
    const buttonAceptar = createButton(obj.btnaccept);

    buttonAceptar.addEventListener('click', (e) => {
      e.preventDefault();
      // aceptar el cambio
      let response = false;
      if (datoSeleccionado !== null) {
        response = {
          success: true,
          dato: datoSeleccionado,
        };
      } else {
        response = { success: false, response: null };
      }
      callback(response);
      cerrarModal('modalAlert');
    });

    texto = trO(obj.btncancel.text, objTrad) || obj.btncancel.text;
    obj.btncancel.text = texto;
    const buttonCancelar = createButton(obj.btncancel);
    buttonCancelar.addEventListener('click', (e) => {
      e.preventDefault();
      cerrarModal('modalAlert');
    });
    const buttonOk = createButton(obj.btnok);

    divButton.appendChild(buttonAceptar);
    divButton.appendChild(buttonCancelar);
    divButton.appendChild(buttonOk);

    modalContent.appendChild(divButton);
    this.modal.appendChild(modalContent);
    document.body.appendChild(this.modal);
    //! --detectar escape
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        cerrarModal('modalAlert');
      }
    });
  }

  createModalMenuArea(objeto, objTranslate) {
    // eslint-disable-next-line no-unused-vars

    const obj = objeto;
    // const obj = JSON.parse(JSON.stringify(objeto))
    this.modal = document.createElement('div');
    this.modal.id = 'modalAlertM';
    this.modal.className = 'modal';
    this.modal.style.background = 'rgba(0, 0, 0, 0.1)';
    // Crear el contenido del modal
    const modalContent = createDiv(obj.divContent);

    const span = createSpan(obj.close);
    obj.divCajita.hoverColor = null;
    obj.divCajita.position = null;
    const divClose = createDiv(obj.divCajita);
    divClose.appendChild(span);
    modalContent.appendChild(divClose);

    //! nuevo reporte
    obj.divCajita.id = 'idDivNuevaArea';
    obj.divCajita.onClick = funcionNuevaArea;
    let div = createDiv(obj.divCajita);
    const imgNuevaArea = createIMG(obj.imgNuevoReporte);
    let texto = trO('Área nueva', objTranslate) || 'Área nueva';
    const spanNuevaArea = createSpan(obj.nuevo, texto);
    div.appendChild(imgNuevaArea);
    div.appendChild(spanNuevaArea);
    modalContent.appendChild(div);
    obj.divCajita.onClick = null;

    //! fin nuevo reporte

    //! refrescar
    obj.divCajita.id = 'idDivRefrescar';
    obj.divCajita.onClick = funcionRefrescar;
    div = createDiv(obj.divCajita);
    const imgRefresh = createIMG(obj.imgRefresh);
    texto = trO(obj.refresh.text, objTranslate) || obj.refresh.text;
    const spanRefresh = createSpan(obj.refresh, texto);
    div.appendChild(imgRefresh);
    div.appendChild(spanRefresh);
    modalContent.appendChild(div);
    obj.divCajita.onClick = null;

    //! fin refrescar

    //! salir
    obj.divCajita.id = 'idDivSalir';
    obj.divCajita.onClick = funcionSalir;
    div = createDiv(obj.divCajita);
    const imgSalir = createIMG(obj.imgSalir);
    texto = trO(obj.salir.text, objTranslate) || obj.salir.text;
    const spanSalir = createSpan(obj.salir, texto);
    div.appendChild(imgSalir);
    div.appendChild(spanSalir);
    modalContent.appendChild(div);
    obj.divCajita.onClick = null;
    //! fin salir

    this.modal.appendChild(modalContent);

    // Agregar el modal al body del documento
    document.body.appendChild(this.modal);
  }

  createModalMenuCRUDArea(objeto, objTranslate, guardarComo) {
    // eslint-disable-next-line no-unused-vars

    const obj = objeto;
    // const obj = JSON.parse(JSON.stringify(objeto))
    this.modal = document.createElement('div');
    this.modal.id = 'modalAlertM';
    this.modal.className = 'modal';
    this.modal.style.background = 'rgba(0, 0, 0, 0.1)';
    // Crear el contenido del modal
    const modalContent = createDiv(obj.divContent);

    const span = createSpan(obj.close);
    obj.divCajita.hoverColor = null;
    obj.divCajita.position = null;
    const divClose = createDiv(obj.divCajita);
    divClose.appendChild(span);
    modalContent.appendChild(divClose);

    if (!guardarComo) {
      //! guardar nuevo area
      obj.divCajita.id = 'idDivCRUDArea';
      obj.divCajita.onClick = funcionAreaGuardarNuevo;
      const div = createDiv(obj.divCajita);
      const imgGuardar = createIMG(obj.imgGuardar);
      const texto = trO(obj.guardar.text, objTranslate) || obj.guardar.text;
      const spanGuardar = createSpan(obj.guardarCambio, texto);
      div.appendChild(imgGuardar);
      div.appendChild(spanGuardar);
      modalContent.appendChild(div);
      obj.divCajita.onClick = null;

      //! fin guardar nuevo area
    }

    //! refrescar
    obj.divCajita.id = 'idDivRefrescar';
    obj.divCajita.onClick = funcionRefrescar;
    let div = createDiv(obj.divCajita);
    const imgRefresh = createIMG(obj.imgRefresh);
    let texto = trO(obj.refresh.text, objTranslate) || obj.refresh.text;
    const spanRefresh = createSpan(obj.refresh, texto);
    div.appendChild(imgRefresh);
    div.appendChild(spanRefresh);
    modalContent.appendChild(div);
    obj.divCajita.onClick = null;

    //! fin refrescar

    //! salir
    obj.divCajita.id = 'idDivSalir';
    obj.divCajita.onClick = funcionSalir;
    div = createDiv(obj.divCajita);
    const imgSalir = createIMG(obj.imgSalir);
    texto = trO(obj.salir.text, objTranslate) || obj.salir.text;
    const spanSalir = createSpan(obj.salir, texto);
    div.appendChild(imgSalir);
    div.appendChild(spanSalir);
    modalContent.appendChild(div);
    obj.divCajita.onClick = null;
    //! fin salir

    this.modal.appendChild(modalContent);

    // Agregar el modal al body del documento
    document.body.appendChild(this.modal);
  }

  destroyAlerta() {
    if (this.modal) {
      // Elimina el elemento modal del DOM
      this.modal.remove();
      // Limpia la referencia al elemento
      this.modal = null;
    }
  }
}
