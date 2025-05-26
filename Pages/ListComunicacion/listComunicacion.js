// eslint-disable-next-line no-unused-vars, import/extensions
import readJSON from '../../controllers/read-JSON.js';

// eslint-disable-next-line import/extensions, import/no-named-as-default
import personModal from '../../controllers/person.js';
// eslint-disable-next-line import/extensions
import {
  inicioPerformance,
  finPerformance,
} from '../../includes/Conection/conection.js';
// eslint-disable-next-line import/extensions, import/no-useless-path-segments
import { desencriptar } from '../../controllers/cript.js';
// eslint-disable-next-line import/extensions
import arrayGlobal from '../../controllers/variables.js';
import baseUrl from '../../config.js';
import Alerta from '../../includes/atoms/alerta.js';
import { configPHP } from '../../controllers/configPHP.js';
import { arraysLoadTranslate } from '../../controllers/arraysLoadTranslate.js';
import { trO } from '../../controllers/trOA.js';
import LogOut from '../../controllers/logout.js';
import traerRegistros from './Modules/traerRegistros.js';
import reporteOnOff from './Modules/habilitarEmail.js';
import { mostrarMensaje } from '../../controllers/alertasLuis.js';

const SERVER = baseUrl;
let objTranslate = [];

const spinner = document.querySelector('.spinner');
const objButtons = {};
// eslint-disable-next-line no-unused-vars
const navegador = {
  estadoAnteriorButton: '',
  estadoAnteriorWhereUs: [],
};

// Función interna para cargar reportes por área

let opcionesOriginales = [];
let dataGlobal = [];
let raciTemp = [];

const selectUsuarios = document.getElementById('usuarios');
const btnAdd = document.getElementById('btnAdd');
const divPastillas = document.getElementById('divPastillas');

function resaltarPastillasYTabla() {
  document.querySelectorAll('#divPastillas .pastilla').forEach((p) => {
    p.classList.add('resaltar');
    setTimeout(() => p.classList.remove('resaltar'), 1200);
  });
  const tabla = document.querySelector('#divPastillaGeneral .tabla-pastillas');
  if (tabla) {
    tabla.classList.add('resaltar');
    setTimeout(() => tabla.classList.remove('resaltar'), 1200);
  }
}

async function cargaUsuarios(plant) {
  try {
    const usuarios = await traerRegistros(
      'traerUsuariosActivosVerificados',
      '/traerUsuariosActivosVerificados',
      plant,
    );
    // console.log(usuarios);
    if (usuarios) {
      // const selectUsuarios = document.getElementById('usuarios');

      selectUsuarios.innerHTML =
        '<option disabled selected>Seleccione el usuario</option>';

      const usuariosFormateados = usuarios.map((u) => ({
        id: u[0],
        nombre: u[1],
        area: u[2],
        puesto: u[3],
        correo: u[4],
        rol: u[5],
      }));

      usuariosFormateados.forEach((usuario) => {
        const option = document.createElement('option');
        option.value = usuario.id;
        option.textContent = `${usuario.nombre} – ${usuario.area}`;

        option.dataset.nombre = usuario.nombre;
        option.dataset.area = usuario.area;
        option.dataset.puesto = usuario.puesto;
        option.dataset.correo = usuario.correo;
        option.dataset.rol = usuario.rol;

        selectUsuarios.appendChild(option);
      });
    }
  } catch (error) {
    // console.log(error);
    mostrarMensaje(
      'Error al cargar los usuarios. Por favor, inténtalo de nuevo más tarde.',
      'error',
    );
  }
}

function cargarReportesPorArea(areaId, select, array) {
  const selectReportes = select;
  const nuevasOpciones = [];

  selectReportes.innerHTML =
    '<option disabled selected>Seleccione el formato</option>';

  const reportesFiltrados = array.filter(
    (item) =>
      String(item[28]) === areaId && String(item[20])?.toLowerCase() === 's',
  );

  if (reportesFiltrados.length === 0) {
    const option = document.createElement('option');
    option.disabled = true;
    option.textContent = 'No hay reportes para esta área';
    selectReportes.appendChild(option);
    return nuevasOpciones;
  }

  reportesFiltrados.forEach((reporte) => {
    if (!reporte[1] || !reporte[0]) return; // saltar reportes corruptos
    const texto = `${reporte[1]} - ${reporte[0]}`;
    const valor = reporte.id || `${reporte[0]}-${reporte[1]}`;

    const option = document.createElement('option');
    option.value = valor;
    option.textContent = texto;
    selectReportes.appendChild(option);

    nuevasOpciones.push({ value: valor, text: texto });
  });

  return nuevasOpciones;
}

function renderizarTablaPastillas() {
  const divPastillaGeneral = document.getElementById('divPastillaGeneral');
  // Elimina cualquier tabla previa
  const tablaExistente = divPastillaGeneral.querySelector('table');
  if (tablaExistente) divPastillaGeneral.removeChild(tablaExistente);

  const btnExistente = divPastillaGeneral.querySelector('#btnGuardarRaci');
  if (btnExistente) divPastillaGeneral.removeChild(btnExistente);

  // Si no hay datos, no renderiza nada
  if (!raciTemp.length) return;

  // Crear tabla
  const tabla = document.createElement('table');
  tabla.classList.add('tabla-pastillas');
  tabla.style.width = '100%';
  tabla.style.marginTop = '10px';

  // Encabezado
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>ID</th>
      <th>Nombre</th>
      <th>Correo</th>
      <th>Rol</th>
    </tr>
  `;
  tabla.appendChild(thead);

  // Cuerpo
  const tbody = document.createElement('tbody');
  raciTemp.forEach((usuario) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${usuario.id}</td>
      <td>${usuario.nombre}</td>
      <td>${usuario.correo}</td>
      <td>${usuario.rol}</td>
    `;
    tbody.appendChild(tr);
  });
  tabla.appendChild(tbody);

  divPastillaGeneral.appendChild(tabla);

  const btnGuardar = document.createElement('button');
  btnGuardar.id = 'btnGuardarRaci';
  btnGuardar.className = 'add-button';
  btnGuardar.textContent = 'Guardar cambios';
  btnGuardar.style.marginTop = '12px';

  btnGuardar.addEventListener('click', async () => {
    try {
      const user = desencriptar(sessionStorage.getItem('user'));
      const { plant } = user;
      // console.log(raciTemp);
      const response = await reporteOnOff(
        plant,
        raciTemp,
        '/registrarReglaComunicacion',
      );

      if (response.success) {
        // alert(response.message);
        mostrarMensaje(response.message, 'ok');
      } else {
        // alert('Error al guardar los cambios.');
        mostrarMensaje(
          'Error al guardar los cambios. Por favor, inténtalo de nuevo más tarde.',
          'error',
        );
      }
    } catch (error) {
      // alert('Error de conexión al guardar los cambios.');
      mostrarMensaje(
        'Error de conexión al guardar los cambios. Por favor, inténtalo de nuevo más tarde.',
        'error',
      );
    }
  });
  divPastillaGeneral.appendChild(btnGuardar);
}

function cargaAreas(array) {
  try {
    const selectAreas = document.getElementById('areas');
    const selectReportes = document.getElementById('reportes');
    const searchInput = document.getElementById('search');
    const resultadoBusqueda = document.getElementById('resultadoBusqueda');

    // 1️⃣ Construcción de opciones únicas de áreas
    const soloAreas = array.map((item) => ({
      id: item[28],
      nombre: `${item[28]}-${item[13]}`,
    }));

    const mapaUnicos = new Map();
    soloAreas.forEach((area) => {
      if (area.id && !mapaUnicos.has(area.id)) {
        mapaUnicos.set(area.id, area.nombre);
      }
    });

    // 2️⃣ Cargar opciones al <select> de áreas
    selectAreas.innerHTML =
      '<option disabled selected>Seleccione un área</option>';
    mapaUnicos.forEach((nombre, id) => {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = nombre;
      selectAreas.appendChild(option);
    });

    // 3️⃣ ⚠️ NUEVO BLOQUE: cargar TODOS los reportes activos para búsqueda libre
    opcionesOriginales = array
      .filter(
        (item) => String(item[20])?.toLowerCase() === 's' && item[1] && item[0],
      )
      .map((reporte) => {
        const texto = `${reporte[1]} - ${reporte[0]}`;
        const valor = reporte.id || `${reporte[0]}-${reporte[1]}`;
        return { value: valor, text: texto };
      });

    // 4️⃣ Mostrar todos los reportes en el select al inicio
    selectReportes.innerHTML =
      '<option disabled selected>Seleccione el formato</option>';
    opcionesOriginales.forEach((op) => {
      const option = document.createElement('option');
      option.value = op.value;
      option.textContent = op.text;
      selectReportes.appendChild(option);
    });

    // 5️⃣ Evento: al cambiar el área, recargar reportes filtrados
    selectAreas.addEventListener('change', () => {
      if (divPastillas.children.length > 0 || raciTemp.length > 0) {
        // alert(
        //   'Atención: Al cambiar el área se perderán las asignaciones actuales.',
        // );
        mostrarMensaje(
          'Atención: Al cambiar el área se perderán las asignaciones actuales.',
          'warning',
        );
        resaltarPastillasYTabla();
        // Limpia las pastillas y la tabla si lo deseas:
        // divPastillas.innerHTML = '';
        raciTemp = [];
        renderizarTablaPastillas();
      }
      const areaSeleccionada = selectAreas.value;
      opcionesOriginales = cargarReportesPorArea(
        areaSeleccionada,
        selectReportes,
        array,
      );
      searchInput.value = '';
      // console.log('Opciones originales cargadas:', opcionesOriginales);
    });

    // 6️⃣ Evento: búsqueda en el input de reportes (usando opcionesOriginales)
    searchInput.addEventListener('input', () => {
      const wrapper = document.getElementById('comunicacionWrapper');
      const resumenReporte = document.getElementById('resumenReporte');
      wrapper.classList.remove('visible');
      wrapper.classList.add('oculto');
      resumenReporte.innerHTML = '';
      // resumenReporte.classList.add('oculto');
      const filtro = searchInput.value.toLowerCase();
      selectReportes.innerHTML =
        '<option disabled selected>Seleccione el formato</option>';

      const filtradas = opcionesOriginales.filter((op) =>
        op.text.toLowerCase().includes(filtro),
      );

      if (filtradas.length === 0) {
        const option = document.createElement('option');
        option.disabled = true;
        option.textContent = 'No hay coincidencias';
        selectReportes.appendChild(option);
        resultadoBusqueda.textContent = 'No se encontraron coincidencias.';
        return;
      }

      filtradas.forEach((op) => {
        const option = document.createElement('option');
        option.value = op.value;
        option.textContent = op.text;
        selectReportes.appendChild(option);
      });
      const resumen = filtradas
        .slice(0, 3)
        .map((op) => op.text)
        .join(', ');
      resultadoBusqueda.textContent = `Encontrados ${filtradas.length}: ${resumen}${filtradas.length > 3 ? ', ...' : ''}`;
    });
  } catch (error) {
    // console.log(error);
    mostrarMensaje(
      'Error al cargar las áreas. Por favor, inténtalo de nuevo más tarde.',
      'error',
    );
  }
}

function cargaReportes(array) {
  try {
    const selectReportes = document.getElementById('reportes');

    // Limpiar el select por si ya hay datos viejos
    selectReportes.innerHTML =
      '<option disabled selected>Seleccione el formato</option>';

    // Filtrar el array para incluir solo los que tienen situacion = 's'
    const reportesFiltrados = array.filter(
      (reporte) => reporte[20]?.toLowerCase() === 's',
    );

    // Agregar opciones al select
    reportesFiltrados.forEach((reporte) => {
      const option = document.createElement('option');
      option.value = reporte.id || `${reporte[1]}-${reporte[0]}`; // Si no hay 'id', se puede usar otro campo como valor
      option.textContent = `${reporte[1]} - ${reporte[0]}`;
      selectReportes.appendChild(option);
    });

    selectReportes.addEventListener('change', () => {
      if (divPastillas.children.length > 0 || raciTemp.length > 0) {
        // alert(
        //   'Atención: Al cambiar el reporte se perderán las asignaciones actuales.',
        // );
        mostrarMensaje(
          'Atención: Al cambiar el reporte se perderán las asignaciones actuales.',
          'warning',
        );
        resaltarPastillasYTabla();
        // divPastillas.innerHTML = '';
        raciTemp = [];
        renderizarTablaPastillas();
      }
      const resumenDiv = document.getElementById('resumenReporte');
      resumenDiv.classList.replace('visible', 'oculto');
      // Render del resumen HTML
      resumenDiv.innerHTML = '';
      const comunicacionWrapper = document.getElementById(
        'comunicacionWrapper',
      );
      comunicacionWrapper.classList.remove('visible');
      comunicacionWrapper.classList.add('oculto');
    });
  } catch (error) {
    // console.log(error);
    mostrarMensaje(
      'Error al cargar los reportes. Por favor, inténtalo de nuevo más tarde.',
      'error',
    );
  }
}

async function cargaSelects(plant) {
  try {
    const reportes = await traerRegistros(
      'traerReportes',
      '/traerReportes',
      plant,
    );
    dataGlobal = reportes;
    cargaAreas(reportes);
    cargaReportes(reportes);
    cargaUsuarios(plant);
  } catch (error) {
    // console.log(error);
    mostrarMensaje(
      'Error al cargar los datos. Por favor, inténtalo de nuevo más tarde.',
      'error',
    );
  }
}

const modal = document.getElementById('modalRaci');
const btnCerrarModal = document.getElementById('btnCerrarModal');
const btnConfirmarRaci = document.getElementById('btnConfirmarRaci');

function abrirModalRaci(usuario) {
  if (!modal) {
    console.error('No se encontró el modal con ID modalRaci');
    return;
  }
  const rolSelect = document.getElementById('rolSelect');
  if (rolSelect) rolSelect.value = 'Sel';
  modal.classList.remove('oculto');
  modal.classList.add('visible');
  modal.dataset.usuarioId = usuario.id;
  modal.dataset.usuarioNombre = usuario.nombre;
  modal.dataset.usuarioCorreo = usuario.correo;
  const nombreDiv = document.getElementById('nombreUsuarioRaci');
  if (nombreDiv) nombreDiv.textContent = usuario.nombre;
}

btnCerrarModal.addEventListener('click', () => {
  modal.classList.remove('visible');
  modal.classList.add('oculto');
});

// Llama a esta función cada vez que agregues o modifiques raciTemp, por ejemplo después de btnConfirmarRaci.onclick:
btnConfirmarRaci.onclick = () => {
  const rolSelect = document.getElementById('rolSelect');
  const rolSeleccionado = rolSelect.value;

  if (rolSeleccionado === 'Sel') {
    // alert('Por favor, selecciona una responsabilidad RACI.');
    mostrarMensaje(
      'Por favor, selecciona una responsabilidad RACI.',
      'warning',
    );
    return;
  }

  const { usuarioId } = modal.dataset;
  const { usuarioNombre } = modal.dataset;
  const { usuarioCorreo } = modal.dataset;

  const resumenDiv = document.getElementById('resumenReporte');
  const liId = resumenDiv.querySelector('li strong');
  const idReporte = liId ? liId.nextSibling.textContent.trim() : null;

  const yaExiste = raciTemp.some((u) => u.id === usuarioId);
  if (!yaExiste) {
    raciTemp.push({
      id: usuarioId,
      nombre: usuarioNombre,
      correo: usuarioCorreo,
      rol: rolSeleccionado,
      idReporte,
    });
  } else {
    raciTemp = raciTemp.map((u) =>
      u.id === usuarioId ? { ...u, rol: rolSeleccionado, idReporte } : u,
    );
  }

  renderizarTablaPastillas(); // <-- Actualiza la tabla
  modal.classList.remove('visible');
  modal.classList.add('oculto');
};

// const selectUsuarios = document.getElementById('usuarios');
// const btnAdd = document.getElementById('btnAdd');
// const divPastillas = document.getElementById('divPastillas');

btnAdd.addEventListener('click', () => {
  const selected = selectUsuarios.options[selectUsuarios.selectedIndex];
  if (!selected || selected.disabled) return;

  const id = selected.value;
  const { nombre } = selected.dataset;
  const { correo } = selected.dataset;

  // Verificar si ya existe una pastilla con ese ID
  if (divPastillas.querySelector(`[data-id="${id}"]`)) {
    // alert('Este usuario ya fue agregado.');
    mostrarMensaje('Este usuario ya fue agregado.', 'warning');
    return;
  }

  const pastilla = document.createElement('div');
  pastilla.classList.add('pastilla');
  pastilla.dataset.id = id;
  pastilla.dataset.correo = correo;
  pastilla.title = correo; // Tooltip al pasar el mouse

  const span = document.createElement('span');
  span.textContent = nombre;

  const btnCerrar = document.createElement('button');
  btnCerrar.textContent = '✖';
  btnCerrar.classList.add('btn-cerrar');
  btnCerrar.addEventListener('click', () => {
    divPastillas.removeChild(pastilla);

    // Elimina de raciTemp si existe
    const index = raciTemp.findIndex((u) => u.id === id);
    if (index !== -1) {
      raciTemp.splice(index, 1);
      renderizarTablaPastillas();
    }
  });
  // btnCerrar.addEventListener('click', () => {
  //   divPastillas.removeChild(pastilla);
  // });

  const asignarBtn = document.createElement('button');
  asignarBtn.textContent = '➕';
  asignarBtn.classList.add('btn-asignar');
  asignarBtn.addEventListener('click', () => {
    abrirModalRaci({ id, nombre, correo }); // pasa el usuario a asignar
  });

  pastilla.appendChild(span);
  pastilla.appendChild(asignarBtn);
  pastilla.appendChild(btnCerrar);
  divPastillas.appendChild(pastilla);
});

function cargarPastillasComunicacion(comunicación, reporte) {
  // Limpia las pastillas y raciTemp antes de agregar nuevas
  divPastillas.innerHTML = '';
  raciTemp = [];

  // Si hay usuarios en comunicación, crea las pastillas automáticamente
  if (Array.isArray(comunicación) && comunicación.length > 0) {
    comunicación.forEach((usuario) => {
      // Ajusta los índices según el orden de tu respuesta PHP
      const id = usuario.id || usuario[2]; // idusuario
      const nombre = usuario.nombre || usuario[6] || ''; // nombre (ajusta si tu backend lo envía)
      const correo = usuario.correo || usuario[7] || ''; // correo (ajusta si tu backend lo envía)
      const rol = usuario.rol || usuario[3] || ''; // rol

      // Evita duplicados
      if (divPastillas.querySelector(`[data-id="${id}"]`)) return;

      // Crea la pastilla
      const pastilla = document.createElement('div');
      pastilla.classList.add('pastilla');
      pastilla.dataset.id = id;
      pastilla.dataset.correo = correo;
      pastilla.title = correo;

      const span = document.createElement('span');
      span.textContent = nombre;

      const btnCerrar = document.createElement('button');
      btnCerrar.textContent = '✖';
      btnCerrar.classList.add('btn-cerrar');
      btnCerrar.addEventListener('click', () => {
        divPastillas.removeChild(pastilla);
        const index = raciTemp.findIndex((u) => u.id === id);
        if (index !== -1) {
          raciTemp.splice(index, 1);
          renderizarTablaPastillas();
        }
      });

      const asignarBtn = document.createElement('button');
      asignarBtn.textContent = '➕';
      asignarBtn.classList.add('btn-asignar');
      asignarBtn.addEventListener('click', () => {
        abrirModalRaci({ id, nombre, correo });
      });

      pastilla.appendChild(span);
      pastilla.appendChild(asignarBtn);
      pastilla.appendChild(btnCerrar);
      divPastillas.appendChild(pastilla);

      // Agrega a raciTemp para la tabla
      raciTemp.push({
        id,
        nombre,
        correo,
        rol,
        idReporte: reporte[1],
      });
    });

    renderizarTablaPastillas();
  }
}

document.getElementById('btnMostrar').addEventListener('click', async () => {
  const selectedValue = document.getElementById('reportes').value;

  if (!selectedValue || selectedValue === 'Seleccione el formato') {
    // alert('Por favor, selecciona un reporte válido.');
    mostrarMensaje('Por favor, selecciona un reporte válido.', 'warning');
    return;
  }

  // Buscar el reporte en el array original
  const reporte = dataGlobal.find((item) => {
    const valor = item.id || `${item[0]}-${item[1]}`;
    return valor === selectedValue;
  });

  if (!reporte) {
    // alert('No se encontró el reporte seleccionado.');
    mostrarMensaje('No se encontró el reporte seleccionado.', 'error');
    return;
  }

  const resumenDiv = document.getElementById('resumenReporte');
  // resumenDiv.classList.replace('oculto', 'visible');

  // Render del resumen HTML
  resumenDiv.innerHTML = `
    <h3>Resumen del Reporte</h3>
    <ul>
      <li><strong>ID:</strong> ${reporte[1]}</li>
      <li><strong>Nombre:</strong> ${reporte[0]}</li>
      <li><strong>Primera Fecha:</strong> ${reporte[16]}</li>
      <li><strong>Última Fecha:</strong> ${reporte[3]}</li>
      <li><strong>Nivel:</strong> ${reporte[19]}</li>
      <li><strong>Área:</strong> ${reporte[13]}</li>
      <li><strong>Detalle:</strong> ${reporte[2]}</li>
      <li><strong>Comunicación:</strong> ${reporte[15] === '1' ? 'Comunica' : 'No comunica'}</li>
      <li><strong>Emails:</strong> ${reporte[24] || 'N/D'}</li>
    </ul>
  `;
  const check = document.getElementById('checkComunica');
  const newCheck = check.cloneNode(true);
  const wrapper = document.getElementById('comunicacionWrapper');
  wrapper.classList.remove('oculto');
  wrapper.classList.add('visible');
  check.checked = String(reporte[15]) === '1';
  // const divPastillaGeneral = document.getElementById('divPastillaGeneral');
  const agrupaPastillas = document.getElementById('agrupaPastillas');

  if (check.checked) {
    agrupaPastillas.classList.remove('oculto');
    agrupaPastillas.classList.add('visible');

    const comunicacion = await traerRegistros(
      'traerReglasComunicacion',
      '/traerReglasComunicacion',
      reporte[1],
    );

    if (comunicacion && comunicacion.length > 0) {
      cargarPastillasComunicacion(comunicacion, reporte[15]);
    }
  } else {
    agrupaPastillas.classList.remove('visible');
    agrupaPastillas.classList.add('oculto');
  }
  newCheck.addEventListener('change', async () => {
    const nuevoValor = check.checked ? 1 : 0;
    const idReporte = parseInt(reporte[1], 10); // asumimos que ID está en el índice 0

    if (nuevoValor === 1) {
      agrupaPastillas.classList.remove('oculto');
      agrupaPastillas.classList.add('visible');
    } else {
      agrupaPastillas.classList.remove('visible');
      agrupaPastillas.classList.add('oculto');
    }
    // solo actualizar el campo en backend
    const response = await reporteOnOff(
      idReporte,
      nuevoValor,
      '/habilitarEmail',
    );
    // console.log(response);
    if (!response.success) {
      // alert('Error al actualizar el estado de comunicación.');
      mostrarMensaje('Error al actualizar el estado de comunicación.', 'error');
    }
  });
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

function leeApp(json) {
  readJSON(json)
    .then((data) => {
      Object.assign(objButtons, data);
      const search = document.getElementById('search');
      search.placeholder = trO('Buscar...', objTranslate) || 'Buscar...';
      search.style.display = 'inline';

      const { planta } = objButtons;
      document.getElementById('spanUbicacion').textContent = planta;

      const user = desencriptar(sessionStorage.getItem('user'));
      const { plant } = user;
      cargaSelects(plant);
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error al cargar el archivo:', error);
    });
}

function dondeEstaEn() {
  // const ustedEstaEn = `${trO('Usted está en')} ` || 'Usted está en ';
  // document.getElementById('whereUs').innerText = ustedEstaEn;

  let lugar = trO('Admin', objTranslate) || 'Admin';
  lugar = `${trO('Reglas de Comunicación', objTranslate) || 'Reglas de Comunicación'}`;
  lugar = `<img src='${SERVER}/assets/img/icons8-brick-wall-50.png' height='10px' width='10px'> ${lugar}`;
  document.getElementById('whereUs').innerHTML = lugar;
  document.getElementById('whereUs').style.display = 'inline';
}

document.addEventListener('DOMContentLoaded', async () => {
  const user = desencriptar(sessionStorage.getItem('user'));
  const { plant } = user;
  inicioPerformance();
  configPHP(user, SERVER);
  spinner.style.visibility = 'visible';
  const hamburguesa = document.querySelector('#hamburguesa');
  hamburguesa.style.display = 'block';
  const divVolver = document.querySelector('.div-volver');
  divVolver.style.display = 'block';
  document.getElementById('volver').style.display = 'block';
  document.querySelector('.header-McCain').style.display = 'none';
  document.querySelector('.div-encabezado').style.marginTop = '5px';
  document.querySelector('.div-encabezadoPastillas').style.display = 'none';

  const persona = desencriptar(sessionStorage.getItem('user'));
  const quienEs = document.getElementById('spanPerson');
  quienEs.innerText = persona.person;
  if (persona) {
    document.querySelector('.custom-button').innerText =
      persona.lng.toUpperCase();

    leeVersion('version');
    setTimeout(async () => {
      objTranslate = await arraysLoadTranslate();
      dondeEstaEn();
      leeApp(`App/${plant}/app`);
    }, 200);
  }
  spinner.style.visibility = 'hidden';
  finPerformance();
});

document.addEventListener('DOMContentLoaded', () => {
  const person = document.getElementById('person');
  if (person) {
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
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const hamburguesa = document.getElementById('hamburguesa');
  if (hamburguesa) {
    hamburguesa.addEventListener('click', () => {
      const miAlertaM = new Alerta();
      miAlertaM.createModalMenuReportes(arrayGlobal.objMenuRove, objTranslate);
      const modalM = document.getElementById('modalAlertM');
      // const closeButton = document.querySelector('.modal-close')
      // closeButton.addEventListener('click', closeModal)
      document.getElementById('idDivNuevoReporte').style.display = 'none';
      modalM.style.display = 'block';
    });
  }
  setTimeout(() => {
    // alert('Tu sesión está por expirar. Haz clic en Aceptar para continuar.');
    mostrarMensaje(
      'Tu sesión está por expirar. Haz clic en Aceptar para continuar.',
      'warning',
    );
    LogOut();
  }, 43200000 - 300000);
});

const goLanding = document.querySelector('.custom-button');
goLanding.addEventListener('click', () => {
  const url = `${SERVER}/Pages/Landing`;
  window.location.href = url;
});

const volver = document.getElementById('volver');
volver.addEventListener('click', () => {
  const url = `${SERVER}/Pages/Admin`;
  window.location.href = url;
});
