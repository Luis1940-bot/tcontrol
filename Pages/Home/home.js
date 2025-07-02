// eslint-disable-next-line no-unused-vars, import/extensions
import readJSON from '../../controllers/read-JSON.js';
// eslint-disable-next-line import/extensions
import createButton from '../../includes/atoms/createButton.js';
// eslint-disable-next-line import/extensions
import personModal from '../../controllers/person.js';
// eslint-disable-next-line import/extensions
import {
  inicioPerformance,
  finPerformance,
} from '../../includes/Conection/conection.js';
// eslint-disable-next-line import/extensions
import { encriptar, desencriptar } from '../../controllers/cript.js';
// import { Alerta } from '../../includes/atoms/alerta.js';
import Alerta from '../../includes/atoms/alerta.js';
import arrayGlobal from '../../controllers/variables.js';

import baseUrl from '../../config.js';
import { configPHP } from '../../controllers/configPHP.js';
import { arraysLoadTranslate } from '../../controllers/arraysLoadTranslate.js';
import { trO } from '../../controllers/trOA.js';
import LogOut from '../../controllers/logout.js';
import { mostrarMensaje } from '../../controllers/ui/alertasLuis.js';

const SERVER = baseUrl;

let objTranslate = [];

const spinner = document.querySelector('.spinner');
const appJSON = {};
const navegador = {
  estadoAnteriorButton: '',
  estadoAnteriorWhereUs: [],
  estadoNavButton: {},
};

const espacio = ' > ';

function leeVersion(json) {
  readJSON(json)
    .then((data) => {
      document.querySelector('.version').innerText = data.version;
    })
    .catch((error) => {
      // console.error('Error al cargar el archivo:', error)
      const miAlerta = new Alerta();
      const obj = arrayGlobal.avisoRojo;
      const texto =
        trO('Error al cargar el archivo.', objTranslate) ||
        'Error al cargar el archivo.';
      miAlerta.createVerde(obj, texto, objTranslate);
      const modal = document.getElementById('modalAlertVerde');
      modal.style.display = 'block';
      // eslint-disable-next-line no-console
      console.log(error);
    });
}

function obtenerNombres(objeto, clave) {
  if (typeof objeto !== 'object' || objeto === null) return null;

  if (
    Object.prototype.hasOwnProperty.call(objeto, clave) &&
    typeof objeto[clave] === 'object' &&
    objeto[clave] !== null
  ) {
    const item = objeto[clave];
    if ('name' in item) {
      const resultado = {
        name: item.name || null,
        type: item.type || null,
        ruta: item.ruta || null,
        nivel: item.nivel || null,
      };

      return resultado;
    }
  }

  let resultadoFinal = null;

  Object.keys(objeto).forEach((key) => {
    const value = objeto[key];
    if (
      resultadoFinal === null &&
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value)
    ) {
      const resultado = obtenerNombres(value, clave);
      if (resultado) {
        resultadoFinal = resultado;
      }
    }
  });

  return resultadoFinal;
}

function extraeIndice(array, clave) {
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if (element.trim() === clave.trim()) {
      return index;
    }
  }
  return -1;
}

function localizador(e) {
  const lugar = trO(e.target.innerText, objTranslate) || e.target.innerText;
  document.getElementById('whereUs').innerText += `${espacio}${lugar}`;
  let { textContent } = document.getElementById('whereUs');
  textContent = textContent.replace('<br>', '');
  document.getElementById('whereUs').innerText = textContent;
  document.getElementById('volver').style.display = 'block';
  document.getElementById('whereUs').style.display = 'inline';
  navegador.estadoAnteriorButton = e.target.name;
  navegador.estadoAnteriorWhereUs.push(e.target.name);
}

function completaButtons(obj) {
  const persona = desencriptar(sessionStorage.getItem('user'));
  const { tipo } = persona;
  const divButtons = document.querySelector('.div-home-buttons');
  divButtons.innerHTML = '';
  document.getElementById('spanUbicacion').innerText = appJSON.planta;
  for (let i = 0; i < obj.name.length; i++) {
    const { nivel } = obj;
    if (nivel[i] <= parseInt(tipo, 10)) {
      const element = obj.name[i];
      const params = {
        text: trO(element, objTranslate) || element,
        name: obj.name[i],
        class: 'btn-modern',
        innerHTML: null,
        height: null, // 35
        width: null, // 75%
        borderRadius: '5px',
        border: null,
        textAlign: 'center',
        marginLeft: null,
        marginRight: null,
        marginTop: null,
        marginBotton: null,
        paddingLeft: null,
        paddingRight: null,
        paddingTop: null,
        paddingBotton: null,
        background: null,
        confecha: null,
        operation: null,
        ini: null,
        outi: null,
        tipo: null,
        procedure: null,

        // eslint-disable-next-line no-use-before-define
        onClick: funcionDeClick,
      };
      const newButton = createButton(params);
      divButtons.appendChild(newButton);
    }
  }
}

function llamarCtrl(control) {
  try {
    const primeraBarraIndex = control.indexOf('/');
    const tipoDeArchivo = control.substring(0, primeraBarraIndex);
    const tipoDeRove = control.substring(primeraBarraIndex + 1);
    const timestamp = new Date().getTime();
    let url = '';
    let ruta = '';

    sessionStorage.setItem(
      'history_pages',
      encriptar(navegador.estadoAnteriorWhereUs),
    );

    if (!control) {
      url = '404';
    } else {
      url = `?${control}`;
      // console.log(tipoDeArchivo);
      if (tipoDeArchivo === '') {
        // eslint-disable-next-line no-unused-vars
        const [subcadena, parametros] = url.split('?');

        const pares = parametros.split('&');
        const objeto = pares.reduce((objs, par) => {
          const obj = objs;
          const [clave, valor] = par.split('=');
          obj[clave] = decodeURIComponent(valor);
          return obj;
        }, {});
        sessionStorage.setItem('contenido', encriptar(objeto));
        ruta = `${SERVER}/Pages/Router/rutas.php?ruta=control&v=${timestamp}`;
      }

      if (tipoDeArchivo !== '' && tipoDeArchivo.toLowerCase() === 'rove') {
        const objeto = {
          rove: tipoDeRove,
        };
        sessionStorage.setItem('rove', encriptar(objeto));
        ruta = `${SERVER}/Pages/Router/rutas.php?ruta=rove&v=${timestamp}`;
      }
      if (tipoDeArchivo !== '' && tipoDeArchivo.toLowerCase() === 'menu') {
        ruta = `${SERVER}/Pages/Router/rutas.php?ruta=menu&v=${timestamp}`;
      }
      if (tipoDeArchivo !== '' && tipoDeArchivo.toLowerCase() === 'admin') {
        ruta = `${SERVER}/Pages/Router/rutas.php?ruta=admin&v=${timestamp}`;
      }
      if (tipoDeArchivo !== '' && tipoDeArchivo.toLowerCase() === 'sadmin') {
        ruta = `${SERVER}/Pages/Router/rutas.php?ruta=sadmin&v=${timestamp}`;
      }
    }

    // console.log(url);
    // console.log(ruta);
    window.location.href = ruta;
    // window.open(ruta, '_blank')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}
let rutaPag = {};
const funcionDeClick = (e) => {
  const claveBuscada = e.target.name;

  const indice = extraeIndice(navegador.estadoNavButton.name, claveBuscada);

  const btnCtrl = navegador.estadoNavButton.type[indice];

  const nuevoObjeto = obtenerNombres(appJSON, claveBuscada);

  if (nuevoObjeto === null && btnCtrl !== 'pag') {
    const control = navegador.estadoNavButton.ruta[indice];
    llamarCtrl(control);
    return;
  }

  if (nuevoObjeto === null && btnCtrl === 'pag') {
    let pagina = '';
    try {
      pagina = nuevoObjeto.ruta;
    } catch (error) {
      pagina = rutaPag.ruta[indice];
    }
    const url = `${SERVER}/${pagina}`;
    window.location.href = url;
    // window.open(url, '_blank');
  }

  if (nuevoObjeto !== null && btnCtrl === 'pag') {
    let pagina = '';
    try {
      pagina = nuevoObjeto.ruta;
    } catch (error) {
      pagina = rutaPag.ruta[indice];
    }
    const url = `${SERVER}/${pagina}`;
    window.location.href = url;
    // window.open(url, '_blank');
  }

  navegador.estadoNavButton = nuevoObjeto;

  if (btnCtrl === 'btn' || btnCtrl === 'pag_0') {
    completaButtons(nuevoObjeto);
    rutaPag = nuevoObjeto;
  }

  localizador(e);
};

function alertar(men) {
  const miAlerta = new Alerta();
  const mensaje =
    trO(arrayGlobal.mensajesVarios.json[men], objTranslate) ||
    arrayGlobal.mensajesVarios.json[men];
  arrayGlobal.avisoRojo.close.display = 'none';
  miAlerta.createVerde(arrayGlobal.avisoRojo, mensaje, objTranslate);
  const modal = document.getElementById('modalAlertVerde');
  modal.style.display = 'block';
}

function leeApp(json) {
  readJSON(json)
    .then((data) => {
      Object.assign(appJSON, data);
      // console.log(data);
      navegador.estadoAnteriorButton = 'apps';
      navegador.estadoAnteriorWhereUs.push('apps');
      const nuevoObjeto = obtenerNombres(data, 'apps');
      navegador.estadoNavButton = nuevoObjeto;
      const cantidadDeApp = data.apps.name.length;
      if (cantidadDeApp >= 2) {
        completaButtons(nuevoObjeto);
      } else {
        const mensaje =
          trO(
            'No está desarrollado el árbol de controles. Póngase en contacto con el Administrador o con el Desarrolador.',
            objTranslate,
          ) || 'No está desarrollado el árbol de controles.';
        const whereUs = document.getElementById('whereUs');
        whereUs.innerText = mensaje;
        whereUs.style.display = 'block';
      }
    })
    .catch((error) => {
      if (error.name === 'SyntaxError') {
        console.error('El archivo no tiene el formato JSON adecuado');
        alertar('formato');
        // Aquí puedes ejecutar acciones específicas para este tipo de error
      } else if (error.code === 'ENOENT') {
        console.error('El archivo no existe');
        alertar('no_existe');
        // Aquí puedes ejecutar acciones específicas para este tipo de error
      } else {
        console.error('Error al cargar el archivo:', error);
        alertar('no_carga');
        // Aquí puedes manejar otros tipos de errores
      }
    });
}

function dondeEstaEn(array) {
  const ustedEstaEn =
    `${trO('Usted está en', objTranslate)} ` || 'Usted está en';
  let nuevaCadena = '';
  array.forEach((element, index) => {
    index > 0 ? (nuevaCadena += ` > ${element}`) : null;
    if (array.length === 1) {
      nuevaCadena = '';
      document.getElementById('whereUs').style.display = 'none';
      document.getElementById('volver').style.display = 'none';
    }
  });
  document.getElementById('whereUs').innerText = `${ustedEstaEn}${nuevaCadena}`;
  let { textContent } = document.getElementById('whereUs');
  textContent = textContent.replace('<br>', '');
  document.getElementById('whereUs').innerText = textContent;
}

document.addEventListener('DOMContentLoaded', async () => {
  const user = desencriptar(sessionStorage.getItem('user'));
  const { plant } = user;
  inicioPerformance();
  configPHP(user, SERVER);
  // document.querySelector('.header-McCain').style.display = 'none';
  spinner.style.visibility = 'visible';

  const hamburguesa = document.querySelector('#hamburguesa');
  hamburguesa.style.display = 'none';

  // const persona = user; // desencriptar(sessionStorage.getItem('user'));

  function iniciarAplicacion() {
    if (document.querySelector('.custom-button')) {
      dondeEstaEn(navegador.estadoAnteriorWhereUs);
      leeApp(`App/${plant}/app`);
      spinner.style.visibility = 'hidden';
      finPerformance();
    } else {
      requestAnimationFrame(iniciarAplicacion); // Continúa intentando hasta que el elemento esté listo
    }
  }

  if (user) {
    const quienEs = document.getElementById('spanPerson');
    quienEs.innerText = user.person;

    document.querySelector('.custom-button').innerText = user.lng.toUpperCase();

    objTranslate = await arraysLoadTranslate();
    await leeVersion('version');

    requestAnimationFrame(iniciarAplicacion); // Inicia la verificación de los elementos
  } else {
    spinner.style.visibility = 'hidden';
    finPerformance();
  }
});

function goBack() {
  try {
    navegador.estadoAnteriorWhereUs.pop();
    navegador.estadoAnteriorButton =
      navegador.estadoAnteriorWhereUs[
        navegador.estadoAnteriorWhereUs.length - 1
      ];
    const clave =
      navegador.estadoAnteriorWhereUs[
        navegador.estadoAnteriorWhereUs.length - 1
      ];
    // console.log('clave>>> ', clave)
    const nuevoObjeto = obtenerNombres(appJSON, clave);
    navegador.estadoNavButton = nuevoObjeto;
    completaButtons(nuevoObjeto);
    dondeEstaEn(navegador.estadoAnteriorWhereUs);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}

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
  setTimeout(() => {
    mostrarMensaje(
      'Bienvenido a la aplicación. Si tienes alguna duda, contacta con el administrador.',
      'info',
    );
    LogOut();
  }, 43200000 - 300000);
  // console.clear();
});

const volver = document.getElementById('volver');
volver.addEventListener('click', () => {
  goBack(null);
});

const goLanding = document.querySelector('.custom-button');
goLanding.addEventListener('click', () => {
  const url = `${SERVER}/Pages/Landing`;
  window.location.href = url;
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    if (navegador.estadoAnteriorWhereUs.length > 1) {
      goBack(null);
    }
  }
});

// Función para ver mis tickets (solo para usuarios logueados)
function verMisTickets() {
  try {
    const user = desencriptar(sessionStorage.getItem('user'));
    if (user && user.email) {
      const url = `${SERVER}/Pages/Soporte/index.php?action=mis_tickets&email=${encodeURIComponent(user.email)}`;
      // window.open(url, '_blank');
      window.location.href = url;
    } else {
      const miAlerta = new Alerta();
      const obj = arrayGlobal.avisoRojo;
      const texto =
        trO(
          'Error: No se pudo obtener la información del usuario.',
          objTranslate,
        ) || 'Error: No se pudo obtener la información del usuario.';
      miAlerta.createVerde(obj, texto, objTranslate);
      const modal = document.getElementById('modalAlertVerde');
      modal.style.display = 'block';
    }
  } catch (error) {
    console.error('Error al abrir mis tickets:', error);
    const miAlerta = new Alerta();
    const obj = arrayGlobal.avisoRojo;
    const texto =
      trO('Error al acceder a los tickets.', objTranslate) ||
      'Error al acceder a los tickets.';
    miAlerta.createVerde(obj, texto, objTranslate);
    const modal = document.getElementById('modalAlertVerde');
    modal.style.display = 'block';
  }
}

// Hacer la función global
window.verMisTickets = verMisTickets;
