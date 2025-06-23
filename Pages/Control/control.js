// eslint-disable-next-line import/extensions
import traerRegistros from './Modules/Controladores/traerRegistros.js';
// eslint-disable-next-line import/extensions
import tablaVacia from './Modules/armadoDeTabla.js';
// eslint-disable-next-line import/extensions
import arrayGlobal from '../../controllers/variables.js';
// eslint-disable-next-line no-unused-vars, import/extensions
import readJSON from '../../controllers/read-JSON.js';
// eslint-disable-next-line import/extensions
import menuModal from '../../controllers/menu.js';
// eslint-disable-next-line import/extensions
import personModal from '../../controllers/person.js';
// eslint-disable-next-line import/extensions
// import { Alerta } from '../../includes/atoms/alerta.js';
import Alerta from '../../includes/atoms/alerta.js';
// eslint-disable-next-line import/extensions
import {
  inicioPerformance,
  finPerformance,
} from '../../includes/Conection/conection.js';
// eslint-disable-next-line import/extensions, import/no-useless-path-segments
import traerNR from './Modules/Controladores/traerNR.js';
// eslint-disable-next-line import/extensions, import/no-useless-path-segments
import cargarNR from './Modules/ControlNR/loadNR.js';
// eslint-disable-next-line import/extensions, import/no-useless-path-segments
import { encriptar, desencriptar } from '../../controllers/cript.js';
import { arraysLoadTranslate } from '../../controllers/arraysLoadTranslate.js';

import baseUrl from '../../config.js';
import { configPHP } from '../../controllers/configPHP.js';
import { trO } from '../../controllers/trOA.js';
import LogOut from '../../controllers/logout.js';
import { mostrarMensaje } from '../../controllers/ui/alertasLuis.js';

const SERVER = baseUrl;
let objTranslate = [];

let controlN = '';
let controlT = '';
let nr = 0;
const spinner = document.querySelector('.spinner');
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
let menuSelectivo = {};

function leeVersion(json) {
  readJSON(json)
    .then((datas) => {
      document.querySelector('.version').innerText = datas.version;
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error al cargar el archivo:', error);
    });
}

function leeApp(json) {
  readJSON(json)
    .then((data) => {
      document.getElementById('spanUbicacion').innerText = data.planta;
      document.querySelector('.div-encabezado').style.marginTop = '0px';
      menuSelectivo = data.menuSelectivo;
    })
    .catch((error) => {
      console.error('Error al cargar el archivo:', error);
    });
}

function configuracionLoad(user) {
  inicioPerformance();

  const contenido = sessionStorage.getItem('contenido');
  const url = desencriptar(contenido);

  controlN = url.control_N;
  controlT = url.control_T;
  nr = url.nr;
  nr === '0' || nr === ''
    ? (nr = '')
    : sessionStorage.setItem('doc', encriptar(nr));
  document.getElementById('doc').innerText = `Doc: ${nr}`;
  document.getElementById('wichC').innerText = `${controlN}-${controlT}`;

  configPHP(user, SERVER);

  // document.querySelector('.header-McCain').style.display = 'none';
  finPerformance();
}

function actualizarProgreso(porcentaje) {
  return new Promise((resolve, reject) => {
    const idSpanCarga = document.getElementById('idSpanCarga');

    // Validar que idSpanCarga exista
    if (!idSpanCarga) {
      console.error("Elemento 'idSpanCarga' no encontrado en el DOM.");
      reject(new Error("Elemento 'idSpanCarga' no disponible."));
      return;
    }

    // Permitir que porcentaje sea '100%', '100' o 100
    let targetPercentage = porcentaje;
    if (typeof targetPercentage === 'string') {
      targetPercentage = targetPercentage.replace('%', '');
    }
    targetPercentage = parseInt(targetPercentage, 10);

    // Obtener el porcentaje inicial mostrado en el span
    let startPercentage = parseFloat(idSpanCarga.innerText) || 0;
    // Si el target es 100 y el valor actual es menor a 40, forzar inicio en 40
    if (targetPercentage === 100 && startPercentage < 40) {
      startPercentage = 40;
      idSpanCarga.innerText = '40%';
    }

    const startTime = new Date().getTime();
    const duration = 500; // Duración total en milisegundos (1 segundo)

    function update() {
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - startTime;

      // Calcular el porcentaje interpolado y convertir a cadena para eliminar decimales
      const interpolatedPercentage = Math.min(
        targetPercentage,
        startPercentage +
          (elapsedTime / duration) * (targetPercentage - startPercentage),
      );
      const parteEntera = Math.floor(interpolatedPercentage);

      // Actualizar el elemento con el porcentaje interpolado
      idSpanCarga.innerText = `${parteEntera}%`;

      if (elapsedTime < duration) {
        // Si no ha pasado el tiempo total, seguir actualizando
        requestAnimationFrame(update);
      } else {
        // Si ha pasado el tiempo total, establecer el porcentaje final y resolver la promesa
        idSpanCarga.innerText = `${targetPercentage}%`;
        resolve();
      }
    }

    // Iniciar la actualización
    update();
  });
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function esperarTablaLista(callback) {
  const table = document.getElementById('tableControl');
  const tbody = table.querySelector('tbody');
  const tr = tbody.querySelectorAll('tr');

  // Si ya hay filas, ejecuta inmediatamente el callback
  if (tr.length > 0) {
    // console.log('Tabla ya lista con filas:', tr.length)
    callback();
    return;
  }

  // Si no hay filas, activa el observador
  const observer = new MutationObserver(() => {
    const tr2 = tbody.querySelectorAll('tr');
    if (tr2.length > 0) {
      // console.log('Tabla lista con filas:', tr.length)
      observer.disconnect(); // Detén el observador
      callback(); // Llama al callback
    }
  });

  observer.observe(tbody, { childList: true });
}

async function cargaDeRegistros(objTrad, plant) {
  try {
    inicioPerformance();

    await actualizarProgreso('10%');

    const countSelect = await traerRegistros(`countSelect,${controlN}`, null);
    sessionStorage.setItem('loadSystem', 2);
    sessionStorage.setItem('cantidadProcesos', Number(countSelect[0][0]) + 5);

    await actualizarProgreso('20%');
    const empresaData = await traerRegistros('empresa', plant);
    arrayGlobal.arrayEmpresa = [...empresaData];

    await actualizarProgreso('30%');
    const selectoresData = await traerRegistros(`Selectores,${controlN}`, null);
    arrayGlobal.arraySelect = [...selectoresData];

    await actualizarProgreso('40%');
    const nuevoControlData = await traerRegistros(
      `NuevoControl,${controlN}`,
      null,
    );

    arrayGlobal.arrayControl = [...nuevoControlData];
    const valorSql = nuevoControlData;
    tablaVacia(nuevoControlData, encabezados, objTrad, plant);
    // await delay(100); // Pequeño delay para UX, opcional
    const idSpanCarga = document.getElementById('idSpanCarga');
    idSpanCarga.innerText = '41%';
    await new Promise(requestAnimationFrame);
    await actualizarProgreso('100%');
    await delay(100); // Mostrar el 100% un instante
    let modal = document.getElementById('modalAlertCarga');

    if (!modal) {
      // eslint-disable-next-line no-console
      console.warn('El elemento modal no se encontró.');
    } else {
      modal.style.display = 'none';
      modal.remove();
      document.getElementById('wichC').style.display = 'inline';
      sessionStorage.setItem('loadSystem', '1');
      modal = document.getElementById('modalAlertVerde');
      if (modal) {
        modal.style.display = 'none';
        modal.remove();
      }
    }

    finPerformance();
    // Ajustar el porcentaje a 100%

    if (nr) {
      const controlNr = await traerNR(nr, plant);
      // await cargarNR(controlNr, plant) // Asegúrate de que cargarNR sea una función async
      esperarTablaLista(() => {
        // console.log('Ejecutando cargarNR después de que la tabla está lista');
        cargarNR(controlNr, plant, valorSql);
        sessionStorage.setItem('habilitaValidar', 'true');
      });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);
    // console.log('error por espera de la carga de un modal');
    window.location.reload(); // Puedes utilizar una redirección directa en lugar de setTimeout
    if (nr) {
      // console.log('entró otra vez');
      const controlNr = await traerNR(nr, plant);
      await cargarNR(controlNr, plant); // Asegúrate de que cargarNR sea una función async
    }
  }
}

async function mensajeDeCarga(objTrad, plant) {
  const miAlerta = new Alerta();
  const mensaje = trO(arrayGlobal.avisoCargandoControl.span.text, objTrad);
  miAlerta.createControl(arrayGlobal.avisoCargandoControl, mensaje, objTrad);
  const modal = document.getElementById('modalAlertCarga');
  modal.style.display = 'block';
  sessionStorage.setItem('loadSystem', 1);
  // Agrega un retraso antes de iniciar la carga de registros
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((resolve) => setTimeout(() => resolve(), 200));

  await cargaDeRegistros(objTrad, plant);
}

document.addEventListener('DOMContentLoaded', async () => {
  spinner.style.visibility = 'visible';
  console.time('timeControl'); // Medir tiempo de ejecución

  // Configuración inicial
  arrayGlobal.habilitadoGuardar = false;
  sessionStorage.setItem('firma', encriptar('x'));
  sessionStorage.setItem('config_menu', encriptar('x'));
  sessionStorage.setItem('envia_por_email', false);
  sessionStorage.setItem('doc', null);
  sessionStorage.setItem('habilitaValidar', 'false');
  const supervisor = {
    id: 0,
    mail: '',
    mi_cfg: '',
    nombre: '',
    tipo: 0,
  };
  sessionStorage.setItem('firmado', encriptar(supervisor));

  try {
    const persona = desencriptar(sessionStorage.getItem('user'));
    const quienEs = document.getElementById('spanPerson');
    quienEs.innerText = persona.person;
    const { plant } = persona;

    if (persona) {
      // Actualización de interfaz con datos del usuario
      document.querySelector('.custom-button').innerText =
        persona.lng.toUpperCase();

      // Cargar versión y traducciones
      await leeVersion('version');
      objTranslate = await arraysLoadTranslate();

      // Cargar configuraciones
      await configuracionLoad(persona);

      // Cargar mensaje de progreso y registros
      await mensajeDeCarga(objTranslate, plant);

      // Cargar información de la app
      await leeApp(`App/${plant}/app`);

      spinner.style.visibility = 'hidden'; // Ocultar spinner
      console.timeEnd('timeControl'); // Finalizar medición del tiempo
      // console.clear();
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error); // Manejo de errores
    spinner.style.visibility = 'hidden';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const hamburguesa = document.getElementById('hamburguesa');
  hamburguesa.addEventListener('click', () => {
    menuModal(objTranslate, menuSelectivo, controlN);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const person = document.getElementById('person');
  person.addEventListener('click', () => {
    const persona = desencriptar(sessionStorage.getItem('user'));
    const user = {
      person: persona.person,
      home: 'Inicio',
      salir: 'Cerrar sesión',
    };
    personModal(user, objTranslate);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const tableControl = document.getElementById('tableControl');

  tableControl.addEventListener('change', () => {
    arrayGlobal.habilitadoGuardar = true;
  });

  setTimeout(() => {
    mostrarMensaje(
      'Tu sesión está por expirar. Haz clic en Aceptar para continuar.',
    );

    LogOut();
  }, 43200000 - 300000);
});

const goLanding = document.querySelector('.custom-button');
goLanding.addEventListener('click', () => {
  const url = `${SERVER}/Pages/Landing`;
  window.location.href = url;
});
