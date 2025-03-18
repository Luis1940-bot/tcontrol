// eslint-disable-next-line no-unused-vars, import/extensions
import readJSON from '../../controllers/read-JSON.js';
// eslint-disable-next-line import/extensions
import personModal from '../../controllers/person.js';
// eslint-disable-next-line import/extensions
import {
  inicioPerformance,
  finPerformance,
} from '../../includes/Conection/conection.js';
// eslint-disable-next-line import/extensions, import/no-useless-path-segments
import { desencriptar } from '../../controllers/cript.js';
// eslint-disable-next-line import/extensions
// import callProcedure from '../ConsultasViews/Controladores/callProcedure.js'
// eslint-disable-next-line import/extensions
// import { Alerta } from '../../includes/atoms/alerta.js';
import Alerta from '../../includes/atoms/alerta.js';
// eslint-disable-next-line import/extensions
import arrayGlobal from '../../controllers/variables.js';
// eslint-disable-next-line import/extensions
import menuModalConsultasView from '../../controllers/menuConsultasView.js';
import { arraysLoadTranslate } from '../../controllers/arraysLoadTranslate.js';
import { configPHP } from '../../controllers/configPHP.js';
import { trO } from '../../controllers/trOA.js';
import baseUrl from '../../config.js';
import LogOut from '../../controllers/logout.js';
import { mostrarMensajeError } from '../../controllers/utils.js';

const SERVER = baseUrl;

const spinner = document.querySelector('.spinner');
const objButtons = {};
const navegador = {
  estadoAnteriorButton: '',
  estadoAnteriorWhereUs: [],
};
let objTranslate = [];
const goLanding = document.querySelector('.custom-button');
goLanding.addEventListener('click', () => {
  const url = `${SERVER}/Pages/Landing`;
  window.location.href = url;
});

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

async function mensajeDeCarga(objTranslateM, procedure, plant) {
  const miAlerta = new Alerta();
  const aviso =
    'Se está realizando la consulta, va a demorar unos segundos, esta puede ser muy compleja dependiendo de los archivos involucrados y el intervalo de tiempo solicitado. Asegure la conexión de internet.'; // arrayGlobal.avisoListandoControles.span.text
  const mensaje = trO(aviso, objTranslateM) || aviso;
  // arrayGlobal.avisoListandoControles.div.height = '200px'
  // arrayGlobal.avisoListandoControles.div.top = '70px'
  miAlerta.createSinCalendar(
    arrayGlobal.avisoListandoControles,
    mensaje,
    objTranslateM,
    procedure,
    plant,
  );
  const modal = document.getElementById('modalAlertCarga');
  modal.style.display = 'block';
}

function abrirCalendar(objTrad, procedure, plant) {
  const miAlerta = new Alerta();
  arrayGlobal.porFechaEnModal.titulo.text.text = procedure.name;
  miAlerta.createCalendar(
    arrayGlobal.porFechaEnModal,
    objTrad,
    procedure,
    plant,
  );
  const modal2 = document.getElementById('modalTablaViewFecha');
  modal2.style.display = 'block';
}

// eslint-disable-next-line no-unused-vars
function leeApp(json, complit) {
  readJSON(json)
    .then((data) => {
      Object.assign(objButtons, data);
      navegador.estadoAnteriorButton = 'Consultas';
      navegador.estadoAnteriorWhereUs.push('Consultas');
      document.getElementById('spanUbicacion').innerText = objButtons.planta;
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error al cargar el archivo:', error);
    });
}

function dondeEstaEn() {
  const contenido = sessionStorage.getItem('procedure');
  const url = desencriptar(contenido);
  const { name } = url;
  document.getElementById('whereUs').innerHTML = name;
  document.getElementById('whereUs').style.display = 'inline';
  document.getElementById('volver').style.display = 'block';
}

function verificaTipoDeConsulta(objTranslateM, plant) {
  try {
    const procedure = desencriptar(sessionStorage.getItem('procedure'));
    // console.log(procedure);
    if (procedure.confecha === '1') {
      abrirCalendar(objTranslateM, procedure, plant);
    }
    if (procedure.confecha === '0') {
      mensajeDeCarga(objTranslateM, procedure, plant);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const hamburguesa = document.getElementById('hamburguesa');
  hamburguesa.addEventListener('click', () => {
    menuModalConsultasView(objTranslate);
  });
});

document.addEventListener('DOMContentLoaded', async () => {
  const user = desencriptar(sessionStorage.getItem('user'));
  const { plant } = user;

  inicioPerformance();
  configPHP(user, SERVER);
  document.querySelector('.header-McCain').style.display = 'none';
  document.querySelector('.div-encabezado').style.marginTop = '5px';

  async function iniciarAplicacion() {
    objTranslate = await arraysLoadTranslate();
    dondeEstaEn();
    leeApp(`App/${plant}/app`);
    spinner.style.visibility = 'hidden';
    verificaTipoDeConsulta(objTranslate, plant);
    finPerformance();
  }

  const persona = desencriptar(sessionStorage.getItem('user'));
  const quienEs = document.getElementById('spanPerson');
  quienEs.innerText = persona.person;
  if (persona) {
    document.querySelector('.custom-button').innerText =
      persona.lng.toUpperCase();
    await leeVersion('version');

    requestAnimationFrame(iniciarAplicacion);
  } else {
    spinner.style.visibility = 'hidden';
    finPerformance();
  }
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
      salir: trO('Cerrar sesión', objTranslate) || 'Cerrar sesión',
    };
    personModal(user, objTranslate);
  });
  setTimeout(() => {
    mostrarMensajeError(
      'Tu sesión está por expirar. Haz clic en Aceptar para continuar.',
    );
    LogOut();
  }, 43200000 - 300000);
});

function goBack() {
  const url = `${SERVER}/Pages/Consultas/index.php`;
  window.location.href = url;
}

const volver = document.getElementById('volver');
volver.addEventListener('click', () => {
  goBack();
});
