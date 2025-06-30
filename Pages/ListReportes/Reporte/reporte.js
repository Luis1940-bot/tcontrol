// eslint-disable-next-line no-unused-vars, import/extensions
import readJSON from '../../../controllers/read-JSON.js';
// eslint-disable-next-line import/extensions
import personModal from '../../../controllers/person.js';
// eslint-disable-next-line import/extensions
import {
  inicioPerformance,
  finPerformance,
} from '../../../includes/Conection/conection.js';
// eslint-disable-next-line import/extensions, import/no-useless-path-segments
import { desencriptar } from '../../../controllers/cript.js';
import fechasGenerator from '../../../controllers/fechas.js';
import baseUrl from '../../../config.js';
// const SERVER = '/iControl-Vanilla/icontrol';
// eslint-disable-next-line import/extensions
import traerRegistros from '../Modules/Controladores/traerRegistros.js';
// eslint-disable-next-line import/extensions
import arrayGlobal from '../../../controllers/variables.js';
// import { Alerta } from '../../../includes/atoms/alerta.js';
import Alerta from '../../../includes/atoms/alerta.js';
import { configPHP } from '../../../controllers/configPHP.js';
import { arraysLoadTranslate } from '../../../controllers/arraysLoadTranslate.js';
import { trO, trA } from '../../../controllers/trOA.js';

const SERVER = baseUrl;
let objTranslate = [];

const spinner = document.querySelector('.spinner');
const objButtons = {};

function leeVersion(json) {
  readJSON(json)
    .then((data) => {
      document.querySelector('.version').innerText = data.version;
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error al cargar el archivo:', error);
    });
}

function traduccionDeLabels(objTrad) {
  const form = document.querySelector('#formReporte');
  const labels = form.querySelectorAll('label');
  labels.forEach((label) => {
    const texto = trO(label.textContent, objTrad) || label.textContent;
    label.innerText = texto;
  });
}

function limpiarInputs() {
  const form = document.querySelector('#formReporte');
  const inputs = form.querySelectorAll('input');
  inputs.forEach((input) => {
    input.value = '';
  });
  const textareas = form.querySelectorAll('textarea');
  textareas.forEach((textarea) => {
    textarea.value = '';
  });

  const dates = form.querySelectorAll('input[type=date]');
  dates.forEach((date) => {
    date.value = fechasGenerator.fecha_corta_yyyymmdd(new Date());
  });
  document.getElementById('version').value = '01';
  document.getElementById('firstName').focus();
}

function fijarTextoSelect(selectElement, texto) {
  if (!selectElement) {
    console.log('El elemento select no fue encontrado.');
    return;
  }
  for (let i = 0; i < selectElement.options.length; i++) {
    const option = selectElement.options[i];
    if (option.text === texto) {
      selectElement.selectedIndex = i; // Establece el índice seleccionado directamente
      break;
    }
  }
}

function fijarValorSelect(selectElement, valor) {
  if (!selectElement) {
    console.log('El elemento select no fue encontrado.');
    return;
  }

  const numberOfOptions = selectElement.options.length;
  for (let i = 0; i < selectElement.options.length; i++) {
    const option = selectElement.options[i];
    if (option.value === valor) {
      selectElement.selectedIndex = i; // Establece el índice seleccionado directamente
      break;
    }
  }
}

function convertirFecha(fechaOriginal) {
  if (fechaOriginal === '' || fechaOriginal === '-') {
    return;
  }
  const [dia, mes, año] = fechaOriginal.split('/');

  // Asegurarse de que el día y el mes tengan dos dígitos
  const diaFormateado = dia.padStart(2, '0');
  const mesFormateado = mes.padStart(2, '0');

  // Reconstruir la fecha en el formato correcto para input date
  const fechaConvertida = `${año}-${mesFormateado}-${diaFormateado}`;
  return fechaConvertida;
}

function findAndLogLabels(emailGroup, email) {
  const labels = emailGroup.querySelectorAll('.div-pastillita label');
  let existe = false;
  // Verificar si encontramos labels
  if (labels.length > 0) {
    labels.forEach((label) => {
      if (label.textContent === email) {
        existe = true;
      }
    });
  }
  return existe;
}

function agregaPastillaEmail(email) {
  const group = document.querySelector('.email-group');
  const existe = findAndLogLabels(group, email);

  if (!existe) {
    const div = document.createElement('div');
    div.setAttribute('class', 'div-pastillita');
    const label = document.createElement('label');
    const button = document.createElement('button');
    label.innerText = email;
    label.setAttribute('class', 'label-email');
    button.innerText = 'x';
    button.setAttribute('class', 'button-email');
    button.addEventListener('click', handleButtonEmailClick);
    div.appendChild(label);
    div.appendChild(button);
    group.appendChild(div);
  }
}

function cargaInputs(array, objTrad) {
  // console.log(array)
  try {
    const idControl = document.getElementById('idControl');
    idControl.value = array[1];

    const firstName = document.getElementById('firstName');
    firstName.value = trA(array[0], objTrad) || array[0];
    const controlReporte = document.getElementById('controlReporte');
    controlReporte.innerText = trA(array[0], objTrad) || array[0];

    const titulo = document.getElementById('titulo');
    titulo.value = trA(array[25], objTrad) || array[25];

    const detalle = document.getElementById('detalle');
    detalle.value = trO(array[2], objTrad) || array[2];

    const establecimiento = document.getElementById('establecimiento');
    establecimiento.value = trO(array[4], objTrad) || array[4];
    const areaReporte = document.getElementById('areaReporte');
    areaReporte.innerText = `${trO('Área', objTrad) || 'Área'}: ${
      trO(array[13], objTrad) || array[13]
    }`;

    const empresaReporte = document.getElementById('empresaReporte');
    empresaReporte.innerText = trO(array[4], objTrad) || array[4];

    const sectorControlado = document.getElementById('sectorControlado');
    sectorControlado.value = trO(array[26], objTrad) || array[26];

    const regdc = document.getElementById('regdc');
    regdc.value = trO(array[8], objTrad) || array[8];
    const regdcReporte = document.getElementById('regdcReporte');
    regdcReporte.innerText = trO(array[8], objTrad) || array[8];

    const pieDeInforme = document.getElementById('pieDeInforme');
    pieDeInforme.value = trO(array[22], objTrad) || array[22];

    const elaboro = document.getElementById('elaboro');
    elaboro.value = trO(array[5], objTrad) || array[5];
    const elaboroReporte = document.getElementById('elaboroReporte');
    elaboroReporte.innerText = `${trO('Elaboró', objTrad) || 'Elaboró'}: ${
      trO(array[5], objTrad) || array[5]
    }`;

    const reviso = document.getElementById('reviso');
    reviso.value = trO(array[6], objTrad) || array[6];
    const revisoReporte = document.getElementById('revisoReporte');
    revisoReporte.innerText = `${trO('Revisó', objTrad) || 'Revisó'}: ${
      trO(array[6], objTrad) || array[6]
    }`;

    const aprobo = document.getElementById('aprobo');
    aprobo.value = trO(array[7], objTrad) || array[7];
    const aproboReporte = document.getElementById('aproboReporte');
    aproboReporte.innerText = `${trO('Aprobó', objTrad) || 'Aprobó'}: ${
      trO(array[7], objTrad) || array[7]
    }`;

    let fecha = convertirFecha(array[9]);
    const vigencia = document.getElementById('vigencia');
    vigencia.value = fecha;
    const vigenciaReporte = document.getElementById('vigenciaReporte');
    vigenciaReporte.innerText = `${
      trO('Vigencia', objTrad) || 'Vigencia'
    }: ${fecha}`;

    fecha = convertirFecha(array[11]);

    const modificacion = document.getElementById('modificacion');
    modificacion.value = fecha;
    const modificacionReporte = document.getElementById('modificacionReporte');
    modificacionReporte.innerText = `${
      trO('Modificación', objTrad) || 'Modificación'
    } ${fecha}`;

    const version = document.getElementById('version');
    version.value = array[12];
    const versionReporte = document.getElementById('versionReporte');
    versionReporte.innerText = `${trO('Versión', objTrad) || 'Versión'} ${
      array[12]
    }`;

    const testimado = document.getElementById('testimado');
    testimado.value = parseInt(array[23]);

    let envioEmail = array[15];
    const emails = array[24];
    if (envioEmail === '1' && emails !== '') {
      const arrayEmails = emails.split('/');
      arrayEmails.forEach((element) => {
        agregaPastillaEmail(element);
      });
      envioEmail = '2';
    } else if (envioEmail === '0') {
      envioEmail = '1';
    }

    const areaControladora = document.getElementById('areaControladora');
    const situacion = document.getElementById('situacion');
    const frecuencia = document.getElementById('frecuencia');
    const tipodeusuario = document.getElementById('tipodeusuario');
    const emailSiNo = document.getElementById('email');
    function checkAndSetValues() {
      if (
        areaControladora.options.length > 0 &&
        situacion.options.length > 0 &&
        frecuencia.options.length > 0 &&
        tipodeusuario.options.length > 0 &&
        emailSiNo.options.length > 0
      ) {
        fijarValorSelect(areaControladora, array[28]);
        fijarTextoSelect(situacion, trO(array[20], objTrad) || array[20]);
        fijarValorSelect(frecuencia, array[23]);
        fijarTextoSelect(tipodeusuario, trO(array[19], objTrad) || array[19]);
        fijarValorSelect(emailSiNo, envioEmail);
      } else {
        setTimeout(checkAndSetValues, 100); // Reintentar después de 100ms
      }
    }
    checkAndSetValues();

    const fechaReporte = document.getElementById('fechaReporte');
    fechaReporte.innerText = `${
      trO('Fecha actual', objTrad) || 'Fecha actual'
    }: ${fechasGenerator.fecha_corta_ddmmyyyy(new Date())}`;

    const docReporte = document.getElementById('docReporte');
    docReporte.innerText = `${trO('Doc', objTrad) || 'Doc'}: `;

    const firma1 = document.getElementById('firma1');
    firma1.innerText = `${trO('Firma control', objTrad) || 'Firma control'}: ${
      trO(array[26], objTrad) || array[26]
    }`;

    const firma2 = document.getElementById('firma2');
    firma2.innerText = `${
      trO('Firma supervisa', objTrad) || 'Firma supervisa'
    }: ${trO(array[27], objTrad) || array[27]}`;

    const controlCambios = document.getElementById('controlCambios');
    controlCambios.innerText =
      trO('Control de cambios', objTrad) || 'Control de cambios';
  } catch (error) {
    console.log(error);
  }
}

function cargarSelects(array, selector, primerOption, objTrad) {
  const select = document.querySelector(`#${selector}`);
  select.innerHTML = '';
  const option = document.createElement('option');
  option.text = '';
  option.value = '';
  primerOption ? select.appendChild(option) : null;
  array.forEach((element) => {
    const option = document.createElement('option');
    option.text = trO(element[1], objTrad) || element[1];
    option.value = element[0];
    select.appendChild(option);
  });
}

async function traerInfoSelects(plant, objTrad) {
  const tipoDeUsuario = await traerRegistros(
    'traerTipoDeUsuario',
    '/traerReportes',
    plant,
  );
  cargarSelects(tipoDeUsuario, 'tipodeusuario', false, objTrad);
  const areas = await traerRegistros('traerAreas', '/traerReportes', plant);
  cargarSelects(areas, 'areaControladora', true, objTrad);

  const situacion = [
    [1, 'ON'],
    [2, 'OFF'],
  ];
  cargarSelects(situacion, 'situacion', false, objTrad);
  const email = [
    [1, 'No'],
    [2, 'Si'],
  ];
  cargarSelects(email, 'email', false, objTrad);
  const frecuencia = [
    [0, 'Indeterminado'],
    [1, 'Todos los días'],
    [7, 'Una vez por semana'],
    [14, 'Una vez por quincena'],
    [30, 'Una vez por mes'],
    [90, 'Una vez por trimestre'],
    [180, 'Una vez por semestre'],
    [365, 'Una vez por año'],
  ];
  cargarSelects(frecuencia, 'frecuencia', false, objTrad);
  document.getElementById('testimado').value = 5;
}

function leeApp(json) {
  readJSON(json)
    .then((data) => {
      Object.assign(objButtons, data);

      const { planta } = objButtons;
      document.getElementById('spanUbicacion').textContent = planta;
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error al cargar el archivo:', error);
    });
}

function dondeEstaEn(lugar, control_T, objTrad) {
  // const { control_T } = desencriptar(sessionStorage.getItem('contenido'))

  // let lugar = trO('EDITAR: ') || 'EDITAR: '
  lugar = `${lugar} ${trO(control_T, objTrad) || control_T}`;
  lugar = `<img src='${SERVER}/assets/img/icons8-brick-wall-50.png' height='10px' width='10px'> ${lugar}`;
  document.getElementById('whereUs').innerHTML = lugar;
  document.getElementById('whereUs').style.display = 'inline';
}

document.addEventListener('DOMContentLoaded', async () => {
  const reporte = desencriptar(sessionStorage.getItem('reporte'));
  const user = desencriptar(sessionStorage.getItem('user'));
  const { plant } = user;
  const divVolver = document.querySelector('.div-volver');
  divVolver.style.display = 'block';
  document.getElementById('volver').style.display = 'block';
  inicioPerformance();
  configPHP(user, SERVER);
  // document.querySelector('.header-McCain').style.display = 'none';
  document.querySelector('.div-encabezado').style.marginTop = '5px';
  spinner.style.visibility = 'visible';
  const hamburguesa = document.querySelector('#hamburguesa');
  hamburguesa.style.display = 'block';
  const persona = desencriptar(sessionStorage.getItem('user'));
  if (persona) {
    document.querySelector('.custom-button').innerText =
      persona.lng.toUpperCase();
    leeVersion('version');
    objTranslate = await arraysLoadTranslate();
    setTimeout(async () => {
      leeApp(`App/${plant}/app`);
      traduccionDeLabels(objTranslate);
      limpiarInputs();
      if (typeof reporte.control_N === 'number') {
        document.getElementById('whereUs').style.display = 'none';
        dondeEstaEn(
          '',
          trO('Reporte nuevo', objTranslate) || 'Reporte nuevo',
          objTranslate,
        );
      }
      if (typeof reporte.control_N === 'string') {
        const lugar = trO('EDITAR: ', objTranslate) || 'EDITAR: ';
        dondeEstaEn(lugar, reporte.control_T, objTranslate);
        cargaInputs(reporte.filtrado[0], objTranslate);
      }
      traerInfoSelects(plant, objTranslate);
    }, 200);
  }
  spinner.style.visibility = 'hidden';
  finPerformance();
});

document.addEventListener('DOMContentLoaded', () => {
  const person = document.getElementById('person');
  person.addEventListener('click', () => {
    person.style.border = '3px solid #212121';
    person.style.background = '#212121';
    person.style.borderRadius = '10px 10px 0px 0px';
    const persona = desencriptar(sessionStorage.getItem('user'));
    const user = {
      person: persona.person,
      home: 'Inicio',
      salir: trO('Cerrar sesión', objTranslate),
    };
    personModal(user, objTranslate);
  });
});

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const simulateAsignarEventos = urlParams.get('simulateAsignarEventos');
  if (simulateAsignarEventos === 'true') {
    const persona = desencriptar(sessionStorage.getItem('user'));
    if (persona) {
      document.querySelector('.custom-button').innerText =
        persona.lng.toUpperCase();
      setTimeout(async () => {
        objTranslate = await arraysLoadTranslate();
      }, 200);
    }
  }
});

function handleButtonEmailClick(event) {
  event.preventDefault();

  // `event.target` es el botón que fue clickeado
  const buttonClicked = event.target;

  // Obtener el contenedor más grande que incluye todos los divs 'div-pastillita'
  const emailGroup = buttonClicked.closest('.email-group');

  // Navegar al contenedor padre, que es el `div` con la clase 'div-pastillita'
  const parentDiv = buttonClicked.parentNode;

  // Si deseas eliminar el `div` al hacer click en el botón, puedes hacerlo así:
  parentDiv.remove();

  // Opcional: verificar cuántos quedan después de la eliminación
  const remainingPastillitas = emailGroup.querySelectorAll('.div-pastillita');
  if (remainingPastillitas.length === 0) {
    const emailSiNo = document.getElementById('email');
    fijarValorSelect(emailSiNo, '1');
  }
  // console.log(
  //   'Número de divs .div-pastillita después de remover:',
  //   remainingPastillitas.length
  // )
}

function validateEmail(email) {
  // const re =
  //   /^(([^<>()[]\\.,;:s@"]+(.[^<>()[]\\.,;:s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function handleButtonClick(event) {
  event.preventDefault();
  const direccionesEmails = document.getElementById('direccionesEmails');
  if (direccionesEmails !== '') {
    if (validateEmail(direccionesEmails.value)) {
      // emailError.style.display = 'none'
      direccionesEmails.style.borderColor = 'green';
      agregaPastillaEmail(direccionesEmails.value);
      direccionesEmails.value = '';
      direccionesEmails.style.border = '1px solid #000';
    } else {
      // emailError.style.display = 'block'
      direccionesEmails.style.borderColor = 'red';
    }
  }
  // Aquí puedes añadir más lógica que quieras ejecutar
}

function handleChangeEmail(event) {
  event.preventDefault();
  const email = document.getElementById('email');
  const { value } = email.options[email.selectedIndex];
  const div = document.querySelector('.input-button');
  if (value === '1') {
    div.style.display = 'none';
    const emailGroup = document.querySelector('.email-group');
    emailGroup.innerHTML = '';
  } else if (value === '2') {
    div.style.display = 'flex';
  }
}

const firstName = document.getElementById('firstName');
firstName.addEventListener('change', () => {
  const titulo = document.getElementById('titulo');
  titulo.value = firstName.value;
  const controlReporte = document.getElementById('controlReporte');
  controlReporte.innerText = firstName.value.toUpperCase();
});
firstName.addEventListener('keypress', () => {
  const titulo = document.getElementById('titulo');
  titulo.value = firstName.value;
});

const establecimiento = document.getElementById('establecimiento');
establecimiento.addEventListener('change', () => {
  const empresaReporte = document.getElementById('empresaReporte');
  empresaReporte.innerText = establecimiento.value.toUpperCase();
});

const titulo = document.getElementById('titulo');
titulo.addEventListener('change', () => {
  const controlReporte = document.getElementById('controlReporte');
  controlReporte.innerText = titulo.value.toUpperCase();
});

const sectorControlado = document.getElementById('sectorControlado');
sectorControlado.addEventListener('change', () => {
  const areaReporte = document.getElementById('areaReporte');
  areaReporte.innerText = `${
    trO('Área', objTranslate) || 'Área'
  }: ${sectorControlado.value.toUpperCase()}`;
});

const regdc = document.getElementById('regdc');
regdc.addEventListener('change', () => {
  const regdcReporte = document.getElementById('regdcReporte');
  regdcReporte.innerText = regdc.value.toUpperCase();
});

const elaboro = document.getElementById('elaboro');
elaboro.addEventListener('change', () => {
  const elaboroReporte = document.getElementById('elaboroReporte');
  elaboroReporte.innerText = `${
    trO('Elaboró', objTranslate) || 'Elaboró'
  }: ${elaboro.value.toUpperCase()}`;
});

const reviso = document.getElementById('reviso');
reviso.addEventListener('change', () => {
  const revisoReporte = document.getElementById('revisoReporte');
  revisoReporte.innerText = `${
    trO('Revisó', objTranslate) || 'Revisó'
  }: ${reviso.value.toUpperCase()}`;
});

const aprobo = document.getElementById('aprobo');
aprobo.addEventListener('change', () => {
  const aproboReporte = document.getElementById('aproboReporte');
  aproboReporte.innerText = `${
    trO('Aprobó', objTranslate) || 'Aprobó'
  }: ${aprobo.value.toUpperCase()}`;
});

const vigencia = document.getElementById('vigencia');
vigencia.addEventListener('change', () => {
  const vigenciaReporte = document.getElementById('vigenciaReporte');
  vigenciaReporte.innerText = `${
    trO('Vigencia', objTranslate) || 'Vigencia'
  }: ${vigencia.value.toUpperCase()}`;
});

const version = document.getElementById('version');
version.addEventListener('change', () => {
  const versionReporte = document.getElementById('versionReporte');
  versionReporte.innerText = `${
    trO('Versión', objTranslate) || 'Versión'
  }: ${version.value.toUpperCase()}`;
});

document.addEventListener('DOMContentLoaded', () => {
  const hamburguesa = document.getElementById('hamburguesa');
  hamburguesa.addEventListener('click', () => {
    const reporte = desencriptar(sessionStorage.getItem('reporte'));
    // let guardarReporteComo = false
    if (typeof reporte.control_N === 'string') {
      arrayGlobal.guardarReporteComo = true;
    }
    const miAlertaM = new Alerta();
    miAlertaM.createModalMenuCRUDReporte(
      arrayGlobal.objMenu,
      objTranslate,
      arrayGlobal.guardarReporteComo,
    );
    const modal = document.getElementById('modalAlertM');
    // const closeButton = document.querySelector('.modal-close')
    // closeButton.addEventListener('click', closeModal)
    modal.style.display = 'block';
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const addButton = document.querySelector('.add-button');
  addButton.addEventListener('click', handleButtonClick);

  const email = document.querySelector('#email');
  email.addEventListener('change', handleChangeEmail);
});

document.addEventListener('DOMContentLoaded', () => {
  // Seleccionar todos los inputs de texto y textareas
  const inputs = document.querySelectorAll('input[type=text], textarea');

  // Función para bloquear caracteres
  function bloquearCaracteres(event) {
    const blockedChars = ['.', ',', ':', "'", '"']; // Caracteres que quieres bloquear
    if (blockedChars.includes(event.key)) {
      event.preventDefault(); // Prevenir la acción por defecto (evita que se ingrese el carácter)
    }
  }

  // Añadir el evento keydown a cada input y textarea
  inputs.forEach((input) => {
    input.addEventListener('keydown', bloquearCaracteres);
  });
});

const goLanding = document.querySelector('.custom-button');
goLanding.addEventListener('click', () => {
  const url = `${SERVER}/Pages/Landing`;
  window.location.href = url;
});

const volver = document.getElementById('volver');
volver.addEventListener('click', () => {
  const url = `${SERVER}/Pages/ListReportes`;
  window.location.href = url;
});
