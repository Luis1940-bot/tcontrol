// eslint-disable-next-line no-unused-vars, import/extensions
import readJSON from '../../controllers/read-JSON.js';
// eslint-disable-next-line import/extensions
import createButton from '../../includes/atoms/createButton.js';
// eslint-disable-next-line import/extensions
import {
  inicioPerformance,
  finPerformance,
} from '../../includes/Conection/conection.js';
// eslint-disable-next-line import/extensions
import { encriptar, desencriptar } from '../../controllers/cript.js';
import createSelect from '../../includes/atoms/createSelect.js';
import createInput from '../../includes/atoms/createInput.js';
import createLabel from '../../includes/atoms/createLabel.js';
import createSpan from '../../includes/atoms/createSpan.js';
import enviarLogin from './Controllers/enviarFormulario.js';
import createDiv from '../../includes/atoms/createDiv.js';

import baseUrl from '../../config.js';
import leeVersion from '../../controllers/leeVersion.js';
import createA from '../../includes/atoms/createA.js';
import { configPHP } from '../../controllers/configPHP.js';
import { trO } from '../../controllers/trOA.js';
import { arraysLoadTranslate } from '../../controllers/arraysLoadTranslate.js';
import Alerta from '../../includes/atoms/alerta.js';
import arrayGlobal from '../../controllers/variables.js';
import traerAuth from './Controllers/traerAuth.js';
import { mostrarMensaje } from '../../controllers/ui/alertasLuis.js';

// const spinner = document.querySelector('.spinner')
const appJSON = {};

const SERVER = baseUrl;
let objTranslate = [];
const espanolOperativo = {
  error: {
    es: 'Hay un dato que no es correcto.',
    en: 'There is one piece of information that is not correct.',
    br: 'Há uma informação que não está correta.',
  },
  planta: {
    es: 'Compañía',
    en: 'Company',
    br: 'Plantar',
  },
  Email: {
    es: 'Correo electrónico',
    en: 'Email',
    br: 'E-mail',
  },
  Password: {
    es: 'Contraseña',
    en: 'Password',
    br: 'Senha',
  },
  Login: {
    es: 'Acceso',
    en: 'Login',
    br: 'Conecte-se',
  },
  alertas: {
    mail: {
      es: 'Complete el correo electrónico.',
      en: 'Complete the email.',
      br: 'Preencha o e-mail.',
    },
    mailError: {
      es: 'Formato de correo no válido.',
      en: 'Invalid email format.',
      br: 'Formato de email inválido.',
    },
    planta: {
      es: 'Seleccione una compañía.',
      en: 'Select company.',
      br: 'Selecione a empresa.',
    },
    pass: {
      es: 'Complete la contraseña.',
      en: 'Fill in the password.',
      br: 'Preencha a senha.',
    },
  },
  a: {
    planta: {
      es: 'Registra tu compañía.',
      en: 'Register your company.',
      br: 'Registre sua empresa.',
    },
    usuario: {
      es: 'Regístrese.',
      en: 'Sign Up.',
      br: 'Registre-se.',
    },
    pass: {
      es: 'Recuperar contraseña.',
      en: 'Recover password.',
      br: 'Recuperar senha.',
    },
  },
};

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function RegisterUser(a, email) {
  const { id } = a.target;
  const etiqueta = document.getElementById(id);
  const data = etiqueta.getAttribute('data');
  sessionStorage.setItem('volver', encriptar('Login'));
  sessionStorage.setItem('mailInvitado', encriptar(email));
  sessionStorage.setItem('habilitaValidar', 'false');

  window.location.href = `${SERVER}/Pages/Router/rutas.php?ruta=${data}`;
}

function inicioSession(session) {
  // console.log(session, ' --- session --- ');
  const idiomaPreferido = navigator.language || navigator.languages[0];
  const partesIdioma = idiomaPreferido.split('-');
  const idioma = partesIdioma[0];
  const spanLogin = document.querySelector('.span-login');
  if (spanLogin) {
    // Eliminar el elemento
    spanLogin.parentNode.removeChild(spanLogin);
  }

  if (session.success === false) {
    const div = document.querySelector('.div-login-buttons');
    let span = document.createElement('span');
    const texto = espanolOperativo.error[idioma];
    // eslint-disable-next-line no-use-before-define
    const params = objParams(
      null,
      'span-login',
      null,
      null,
      null,
      null,
      null,
      null,
    );
    span = createSpan(params, texto);
    div.appendChild(span);
    let input = document.getElementById('idInput0');
    input.style.color = '#f81212';
    input = document.getElementById('idInput1');
    input.style.color = '#f81212';
    const select = document.getElementById('idSelectLogin');
    select.style.color = '#f81212';
  } else if (session.success) {
    if (session.res.verificador === '1' || session.res.verificador === 1) {
      const parsedData = encriptar(session.res);
      sessionStorage.setItem('user', parsedData);
      setTimeout(() => {
        window.location.href = `${SERVER}/Pages/Router/rutas.php?ruta=home`;
      }, 1000);
    } else if (
      session.res.verificador === '0' ||
      session.res.verificador === 0
    ) {
      const miAlerta = new Alerta();
      const obj = arrayGlobal.avisoRojo;
      const texto =
        trO(
          'Su usuario no está verificado, debe buscar el email para verificar o comuníquese con el administrador.',
          objTranslate,
        ) ||
        'Su usuario no está verificado, debe buscar el email para verificar o comuníquese con el administrador.';
      miAlerta.createVerde(obj, texto, objTranslate);
      const modal = document.getElementById('modalAlertVerde');
      modal.style.display = 'block';
    }
  }
}

function showAlert(message) {
  const overlay = document.getElementById('overlay');
  const alertMessage = document.getElementById('idAlertMessage');
  alertMessage.textContent = message;
  overlay.style.display = 'flex';
}

async function enviar() {
  try {
    const idiomaPreferido = navigator.language || navigator.languages[0];
    const partesIdioma = idiomaPreferido.split('-');
    const idioma = partesIdioma[0];
    const select = document.getElementById('idSelectLogin');
    const email = document.getElementById('idInput0');
    const password = document.getElementById('idInput1');
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const objeto = {
      planta: 0,
      email: '',
      password: '',
      ruta: '/login',
      timezone,
    };

    if (!select.value) {
      showAlert(espanolOperativo.alertas.planta[idioma]);
      return;
    }
    objeto.planta = parseInt(select.value, 10);

    if (!email.value) {
      showAlert(espanolOperativo.alertas.mail[idioma]);
      return;
    }
    objeto.email = email.value;

    if (!password.value) {
      showAlert(espanolOperativo.alertas.pass[idioma]);
      return;
    }
    objeto.password = password.value;

    if (validarEmail(email.value)) {
      // console.log('El email es válido.')
    } else {
      showAlert(espanolOperativo.alertas.mailError[idioma]);
    }
    const login = await enviarLogin(objeto);
    setTimeout(() => {
      inicioSession(login);
    }, 200);
    email.value = '';
    password.value = '';
  } catch (error) {
    mostrarMensaje(error, 'error');
  }
}

function cargarSelectCompania(json) {
  try {
    // console.log(json)
    //! { "name": "McCain Balcarce-Argentina", "num": 1 },
    // !{ "name": "McCain Araxa-Brasil", "num": 2 }
    const idAcceso = document.getElementById('idAcceso');
    const idSelectLogin = document.getElementById('idSelectLogin');
    let idAltaUsuario = document.getElementById('idAltaUsuario');
    let idOlvidoPass = document.getElementById('idOlvidoPass');

    if (!idSelectLogin) {
      console.error('ERROR: Elemento idSelectLogin no encontrado');
      return;
    }

    const { plantas } = json;
    let claseButton = 'button-login';
    let array = [];
    // console.log(plantas, ' ----- ', plantas.length)
    if (plantas.length === 0) {
      claseButton = 'button-login button-login-apagado';
      // idAcceso.setAttribute('disabled', false)
      idAcceso.disabled = false;
      const option = document.createElement('option');
      option.value = 0;
      const texto = trO('Sin compañías', objTranslate) || 'Sin compañías';
      option.text = texto;
      idSelectLogin.appendChild(option);
      idAltaUsuario = document.getElementById('idAltaUsuario');
      idAltaUsuario.classList.remove('a-login');
      idAltaUsuario.classList.add('a-login-disabled');
      idOlvidoPass = document.getElementById('idOlvidoPass');
      idOlvidoPass.classList.remove('a-login');
      idOlvidoPass.classList.add('a-login-disabled');
      const idInput0 = document.getElementById('idInput0');
      idInput0.classList.remove('input-login');
      idInput0.classList.add('input-login-disabled');
      const idInput1 = document.getElementById('idInput1');
      idInput1.classList.remove('input-login');
      idInput1.classList.add('input-login-disabled');
    } else {
      const nombresPlantas = plantas.map((planta) => [planta.num, planta.name]);
      array = [...nombresPlantas];
      array.sort((a, b) => {
        // Compara el segundo elemento (índice 1) de cada sub-array
        if (a[1] < b[1]) {
          return -1;
        }
        if (a[1] > b[1]) {
          return 1;
        }
        return 0;
      });
      const emptyOption = document.createElement('option');
      emptyOption.value = '';
      emptyOption.text = '';
      idSelectLogin.appendChild(emptyOption);
      array.forEach(([value, text]) => {
        const option = document.createElement('option');
        option.value = value;
        option.text = text;
        idSelectLogin.appendChild(option);
      });

      idSelectLogin.addEventListener('change', (e) => {
        const selectedText = e.target.options[e.target.selectedIndex].text;
        const selectedValue = e.target.value;
        const plant = { texto: selectedText, value: selectedValue };
        sessionStorage.setItem('plant', encriptar(plant));
        // console.log(selectedValue)
        if (selectedValue !== '') {
          idSelectLogin.classList.remove('select-rojo');
          idSelectLogin.classList.add('class', 'select-login');
          const mensaje = document.querySelector('.span-sin-planta');
          mensaje.style.display = 'none';
        } else {
          idSelectLogin.classList.remove('select-login');
          idSelectLogin.classList.add('class', 'select-rojo');
          const mensaje = document.querySelector('.span-sin-planta');
          mensaje.style.display = 'block';
        }
      });

      idAcceso.addEventListener('click', () => {
        enviar();
      });
    }

    idAcceso.setAttribute('class', claseButton);

    idAltaUsuario.addEventListener('click', async (event) => {
      event.preventDefault();
      const idiomaPreferido = navigator.language || navigator.languages[0];
      const partesIdioma = idiomaPreferido.split('-');
      const idioma = partesIdioma[0];
      const plant = desencriptar(sessionStorage.getItem('plant'));
      const idInput0 = document.getElementById('idInput0');

      if (validarEmail(idInput0.value)) {
        // console.log('El email es válido.')
      } else {
        showAlert(espanolOperativo.alertas.mailError[idioma]);
      }
      const plantValue = plant.value;
      if (plantValue === null) {
        const mensaje = document.querySelector('.span-sin-planta');
        mensaje.style.display = 'block';
        const selectPlanta = document.querySelector('#idSelectLogin');
        selectPlanta.classList.remove('select-login');
        selectPlanta.classList.add('class', 'select-rojo');
      } else {
        const auth = await traerAuth(
          parseInt(plant.value, 10),
          idInput0.value,
          '/auth',
        );

        if (auth.success) {
          await RegisterUser(event, idInput0.value);
        } else {
          const miAlerta = new Alerta();
          const obj = arrayGlobal.avisoRojo;
          const texto = trO(auth.message, objTranslate) || auth.message;
          miAlerta.createVerde(obj, texto, objTranslate);
          const modal = document.getElementById('modalAlertVerde');
          modal.style.display = 'block';
        }
      }
    });
    // const idAltaCompania = document.getElementById('idAltaCompania')
    // idAltaCompania.addEventListener('click', (event) => {
    //   event.preventDefault()
    //   RegisterUser(event)
    // })
    idOlvidoPass.addEventListener('click', (event) => {
      event.preventDefault();
      const plant = desencriptar(sessionStorage.getItem('plant'));
      const plantValue = plant.value;
      if (plantValue === null) {
        const mensaje = document.querySelector('.span-sin-planta');
        mensaje.style.display = 'block';
        const selectPlanta = document.querySelector('#idSelectLogin');
        selectPlanta.classList.remove('select-login');
        selectPlanta.classList.add('class', 'select-rojo');
      } else {
        RegisterUser(event, null);
      }
    });
  } catch (error) {
    mostrarMensaje(error, 'error');
    // console.log(error);
  }
}

async function leeApp(json) {
  try {
    const data = await readJSON(json);
    Object.assign(appJSON, data);
    configPHP(data, SERVER);

    // No esperar por el select aquí, eso se hará después de que se cree el DOM
    return data;
  } catch (error) {
    console.error('Error detallado al cargar archivo JSON:', error);

    // Si es un error de JSON, mostrar mensaje más específico
    if (
      error.message.includes('JSON') ||
      error.message.includes('Unexpected token')
    ) {
      console.error('Error de formato JSON. Verificar archivo:', json);
    }

    // Datos fallback en caso de error
    const fallbackData = {
      plantas: [
        {
          name: 'Tenki',
          num: 27,
        },
      ],
      company: 'Luis Gimenez',
      developer: 'Tenki',
      by: 'by Luis Gimenez',
      logo: 'tcontrol',
    };

    // Usar datos fallback
    Object.assign(appJSON, fallbackData);
    configPHP(fallbackData, SERVER);

    const miAlerta = new Alerta();
    const obj = arrayGlobal.avisoRojo;
    const texto =
      trO(
        'Error al cargar configuración. Usando configuración por defecto.',
        objTranslate,
      ) || 'Error al cargar configuración. Usando configuración por defecto.';
    miAlerta.createVerde(obj, texto, objTranslate);
    const modal = document.getElementById('modalAlertVerde');
    modal.style.display = 'block';

    return fallbackData;
    // No re-lanzar el error para permitir que continúe la carga
  }
}

function creador(element) {
  try {
    let elemento = null;
    if (element.tag === 'label') {
      // eslint-disable-next-line no-param-reassign
      element.config.innerHTML =
        trO(element.config.innerHTML, objTranslate) || element.config.innerHTML;
      elemento = createLabel(element.config);
    }
    if (element.tag === 'input') {
      elemento = createInput(element.config);
      if (element.config.type === 'email') {
        elemento.setAttribute('autocomplete', 'off');
      }
      if (element.config.type === 'pasword') {
        elemento.setAttribute('autocomplete', 'new-password');
      }
    }
    if (element.tag === 'a') {
      // eslint-disable-next-line no-param-reassign
      element.config.textContent =
        trO(element.config.textContent, objTranslate) ||
        element.config.textContent;
      elemento = createA(element.config, element.config.textContent);
    }
    if (element.tag === 'select') {
      let array = [];
      // eslint-disable-next-line no-prototype-builtins
      if (element.hasOwnProperty('options')) {
        if (element.options.length > 0) {
          array = [...element.options];
        }
      }
      elemento = createSelect(array, element.config);
    }
    if (element.tag === 'button') {
      // eslint-disable-next-line no-param-reassign
      element.config.text =
        trO(element.config.text, objTranslate) || element.config.text;
      elemento = createButton(element.config);
    }
    if (element.tag === 'div') {
      elemento = createDiv(element.config);
    }
    if (element.tag === 'span') {
      // eslint-disable-next-line no-param-reassign
      element.config.text =
        trO(element.config.text, objTranslate) || element.config.text;
      elemento = createSpan(element.config);
    }

    return elemento;
  } catch (error) {
    console.error('Error en creador:', error, 'Elemento:', element);
    return null;
  }
}

function armadoDeHTML(json) {
  try {
    const div = document.querySelector('.div-login-buttons');
    if (!div) {
      console.error('ERROR: div-login-buttons no encontrado');
      return;
    }

    const elementos = json.elements;

    elementos.forEach((element) => {
      const elementoCreado = creador(element);
      if (element.children) {
        const elementoChildren = element.children;
        elementoChildren.forEach((e) => {
          const hijo = creador(e);
          hijo ? elementoCreado.appendChild(hijo) : null;
        });
      }
      elementoCreado ? div.appendChild(elementoCreado) : null;
    });
  } catch (error) {
    console.error('Error en armadoDeHTML:', error);
  }
}

function leeModelo(ruta) {
  readJSON(ruta)
    .then((data) => {
      armadoDeHTML(data);

      // Después de crear HTML elementos, cargar datos en select
      // Esperar un poco para que el DOM se actualice
      setTimeout(() => {
        if (Object.keys(appJSON).length > 0) {
          // Solo cargar el select si ya tenemos los datos de appJSON
          const select = document.querySelector('#idSelectLogin');
          if (select) {
            cargarSelectCompania(appJSON);
            select.focus();
          }
        }
      }, 100);
    })
    .catch((error) => {
      console.error('Error al cargar el modelo:', error);
      const miAlerta = new Alerta();
      const obj = arrayGlobal.avisoRojo;
      const texto =
        trO('Error al cargar el modelo de formulario.', objTranslate) ||
        'Error al cargar el modelo de formulario.';
      miAlerta.createVerde(obj, texto, objTranslate);
      const modal = document.getElementById('modalAlertVerde');
      modal.style.display = 'block';
    });
}

function objParams(
  innerHTML,
  className,
  fontFamily,
  id,
  fontSize,
  type,
  value,
  text,
  clase,
  name,
  onClick,
  href,
  data,
) {
  const params = {
    innerHTML,
    className,
    fontFamily,
    id,
    fontSize,
    type,
    value,
    text,
    class: clase,
    name,
    onClick,
    href,
    data,
  };
  return params;
}

function closeAlert() {
  const overlay = document.getElementById('overlay');
  overlay.style.display = 'none';
}

function generaOverlay() {
  try {
    const body = document.querySelector('body');
    const paramsDiv = objParams(
      null,
      null,
      null,
      'overlay',
      null,
      null,
      null,
      null,
      'overlay',
      null,
    );
    const div = createDiv(paramsDiv);
    //*-------------------------------
    const paramsDivBox = objParams(
      null,
      null,
      null,
      'idAlertBox',
      null,
      null,
      null,
      null,
      'alert-box',
      null,
    );
    const divBox = createDiv(paramsDivBox);

    //*-----------------------------------------
    const paramsSpan = objParams(
      null,
      'span-alerta',
      null,
      'idAlertMessage',
      null,
      null,
      null,
      '',
    );
    const span = createSpan(paramsSpan);
    //*--------------------------------------
    const paramsButton = objParams(
      null,
      null,
      null,
      'idButtonAlert',
      null,
      null,
      null,
      'oK',
      'button-alerta',
      null,
      closeAlert,
    );
    const button = createButton(paramsButton);
    //*----------------------------------------------

    divBox.appendChild(span);
    divBox.appendChild(button);

    div.style.display = 'none';
    div.appendChild(divBox);
    body.appendChild(div);
  } catch (error) {
    mostrarMensaje(error, 'error');
    // console.log(error);
  }
}

// Habilita/deshabilita campos según selección de empresa
function toggleLoginFields() {
  const select = document.getElementById('idSelectLogin');
  const email = document.getElementById('idInput0');
  const password = document.getElementById('idInput1');
  if (!select || !email || !password) return;
  if (select.value && select.value !== '0') {
    email.removeAttribute('disabled');
    email.classList.remove('input-login-disabled');
    email.classList.add('input-login');
    password.removeAttribute('disabled');
    password.classList.remove('input-login-disabled');
    password.classList.add('input-login');
  } else {
    email.setAttribute('disabled', true);
    email.classList.remove('input-login');
    email.classList.add('input-login-disabled');
    password.setAttribute('disabled', true);
    password.classList.remove('input-login');
    password.classList.add('input-login-disabled');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('idSelectLogin');
  if (select) {
    select.addEventListener('change', toggleLoginFields);
    toggleLoginFields();
  } else {
    // Si el select aún no existe, esperar a que se cree dinámicamente
    const observer = new MutationObserver(() => {
      const selector = document.getElementById('idSelectLogin');
      if (selector) {
        selector.addEventListener('change', toggleLoginFields);
        toggleLoginFields();
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('keydown', (e) => {
    if (e.target.matches('.input-login')) {
      if (e.key === ',' || e.key === ':' || e.key === "'" || e.key === '"') {
        e.preventDefault();
      }
    }
  });
});

document.addEventListener('DOMContentLoaded', async () => {
  try {
    inicioPerformance(); // Inicia la medición del rendimiento

    const spinner = document.querySelector('.spinner');
    if (spinner) {
      spinner.style.visibility = 'visible';
    }
    // const logoMccain = document.getElementById('logo_mccain');
    // logoMccain.style.display = 'none';
    // Oculta elementos en el DOM
    const hamburguesa = document.querySelector('#hamburguesa');
    if (hamburguesa) {
      hamburguesa.style.display = 'none';
    }

    const person = document.querySelector('#person');
    if (person) {
      person.style.display = 'none';
    }

    // Obtiene la versión y la muestra en el DOM de forma segura
    try {
      const version = await leeVersion('version');
      const versionElement = document.querySelector('.version');
      if (versionElement && version) {
        versionElement.innerText = version;
      }
    } catch (versionError) {
      // Si el error contiene información sobre JSON parsing de "V1.0",
      // significa que algo está tratando de parsear el contenido HTML
      if (versionError.message && versionError.message.includes('V1.0')) {
        console.error(
          'PROBLEMA DETECTADO: Algo está tratando de parsear el contenido HTML como JSON',
        );
        console.error(
          'Esto puede deberse a un problema de CSP o de configuración del servidor',
        );
      }
      // Mantener la versión por defecto que ya está en el HTML
    }

    // Guarda el objeto `plant` en sessionStorage
    const plant = { texto: null, value: null };
    sessionStorage.setItem('plant', encriptar(plant));

    // Espera 200ms antes de continuar
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Ejecuta las funciones restantes en orden
    try {
      await leeApp('log'); // Si es asincrónico, espera que termine
    } catch (appError) {
      console.error('Error específico al cargar log.json:', appError);
      // Continuar con el resto del proceso incluso si falla la carga del log
    }

    try {
      objTranslate = await arraysLoadTranslate(); // Carga la traducción
    } catch (translateError) {
      // console.warn('Error al cargar traducciones:', translateError);
      mostrarMensaje(
        `Error al cargar traducciones ${translateError}. Usando traducción por defecto.`,
        'error',
      );
      objTranslate = []; // Usar array vacío como fallback
    }

    try {
      leeModelo('Login/login'); // Carga el modelo
    } catch (modelError) {
      mostrarMensaje(`Error al cargar modelo de login ${modelError}.`, 'error');
      // console.warn('Error al cargar modelo de login:', modelError);
    }

    try {
      generaOverlay(); // Genera el overlay
    } catch (overlayError) {
      mostrarMensaje(`Error al generar overlay ${overlayError}.`, 'error');
      // console.warn('Error al generar overlay:', overlayError);
    }

    // Oculta el spinner y finaliza la medición del rendimiento
    if (spinner) {
      spinner.style.visibility = 'hidden';
    }

    finPerformance();
  } catch (error) {
    console.error('Error crítico en la carga de la página:', error);

    // Ocultar spinner incluso si hay error
    const spinner = document.querySelector('.spinner');
    if (spinner) {
      spinner.style.visibility = 'hidden';
    }

    // Mostrar mensaje de error al usuario
    try {
      const miAlerta = new Alerta();
      const obj = arrayGlobal.avisoRojo;
      const texto =
        'Error al cargar la página. Por favor, recargue e intente de nuevo.';
      miAlerta.createVerde(obj, texto, objTranslate);
      const modal = document.getElementById('modalAlertVerde');
      if (modal) {
        modal.style.display = 'block';
      }
    } catch (alertError) {
      // Si no se puede mostrar alerta, mostrar alert nativo
      mostrarMensaje(
        `Error al mostrar alerta: ${alertError}. Error original: ${error}`,
        'error',
      );
      // alert(
      //   'Error al cargar la página. Por favor, recargue e intente de nuevo.',
      // );
    }
  }
});
