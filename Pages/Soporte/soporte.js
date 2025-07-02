/**
 * JavaScript para el sistema de soporte técnico
 * TenkiWeb - Soporte
 */
import baseUrl from '../../config.js';
import { mostrarMensaje } from '../../controllers/ui/alertasLuis.js';
import readJSON from '../../controllers/read-JSON.js';
import leeVersion from '../../controllers/leeVersion.js';

const SERVER = baseUrl;

// Variables globales para almacenar datos
const appJSON = {};
// let versionSistema = '';

/**
 * Carga los datos de la aplicación (compañías) desde el archivo JSON
 */
async function cargarDatosApp() {
  try {
    const data = await readJSON('log');
    Object.assign(appJSON, data);
    return data;
  } catch (error) {
    console.error('Error al cargar datos de la app:', error);
    mostrarMensaje('Error al cargar datos de compañías', 'error');
    return null;
  }
}

/**
 * Carga la versión del sistema
 */
async function cargarVersion() {
  try {
    const version = await leeVersion('version');
    // versionSistema = version;
    return version;
  } catch (error) {
    console.error('Error al cargar versión:', error);
    return 'V1.0'; // Versión por defecto
  }
}

/**
 * Carga las compañías en el select planta_cliente
 */
function cargarCompaniasEnSelect(datos) {
  const selectPlanta = document.getElementById('planta_cliente');
  if (!selectPlanta || !datos || !datos.plantas) {
    return;
  }

  // Limpiar opciones existentes (excepto las primeras que son estáticas)
  // Mantener: "", "otra", "no_aplica" pero remover "102" ya que será reemplazada
  const opcionesAMantener = ['', 'otra', 'no_aplica'];

  // Remover opciones dinámicas y la opción estática "102"
  Array.from(selectPlanta.options).forEach((option) => {
    if (!opcionesAMantener.includes(option.value)) {
      option.remove();
    }
  });

  // Agregar las compañías dinámicamente
  const { plantas } = datos;
  if (plantas && plantas.length > 0) {
    // Ordenar plantas por nombre
    const plantasOrdenadas = [...plantas].sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });

    // Insertar las opciones de compañías antes de "Otra ubicación"
    const otraOpcion = selectPlanta.querySelector('option[value="otra"]');

    plantasOrdenadas.forEach((planta) => {
      const option = document.createElement('option');
      option.value = planta.num;
      option.textContent = planta.name;

      if (otraOpcion) {
        selectPlanta.insertBefore(option, otraOpcion);
      } else {
        selectPlanta.appendChild(option);
      }
    });

    // Mostrar mensaje de éxito solo en desarrollo/debug
    // console.log(
    //   `✅ Se cargaron ${plantas.length} compañías en el select de soporte`,
    // );
  } else {
    // console.warn('⚠️ No se encontraron compañías disponibles');
  }
}

// Auto-detectar página actual para el campo modulo_pagina
document.addEventListener('DOMContentLoaded', async () => {
  // Cargar datos de compañías al inicializar
  try {
    const datos = await cargarDatosApp();
    if (datos) {
      cargarCompaniasEnSelect(datos);
    }
  } catch (error) {
    console.error('Error al cargar datos de compañías:', error);
    mostrarMensaje('Error al cargar lista de compañías', 'error');
  }

  // Cargar y mostrar la versión del sistema
  try {
    const version = await cargarVersion();
    const versionElement = document.querySelector('.version');
    if (versionElement && version) {
      versionElement.innerText = version;
      // versionSistema = version;
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
    // console.warn('Error al cargar versión, usando versión por defecto');
  }

  const { referrer } = document;
  if (referrer && referrer.includes('tenkiweb.com')) {
    const moduloInput = document.createElement('input');
    moduloInput.type = 'hidden';
    moduloInput.name = 'modulo_pagina';
    moduloInput.value = referrer;
    const form = document.querySelector('form');
    if (form) {
      form.appendChild(moduloInput);
    }
  }

  // Lógica para mostrar/ocultar campos según el tipo de cliente
  const tipoCliente = document.getElementById('tipo_cliente');
  if (tipoCliente) {
    tipoCliente.addEventListener('change', function selectTipoCliente() {
      const plantaField = document.getElementById('planta_cliente');
      const comoConocioField = document.getElementById('como_conocio');

      if (this.value === 'cliente_existente') {
        plantaField.required = true;
        const label = plantaField.parentElement.querySelector('label');
        if (label) {
          label.innerHTML = 'Planta/Ubicación *';
        }
      } else {
        plantaField.required = false;
        const label = plantaField.parentElement.querySelector('label');
        if (label) {
          label.innerHTML = 'Planta/Ubicación';
        }
      }

      if (this.value === 'cliente_potencial') {
        if (comoConocioField && comoConocioField.parentElement) {
          comoConocioField.parentElement.style.display = 'block';
        }
      } else if (comoConocioField && comoConocioField.parentElement) {
        comoConocioField.parentElement.style.display = 'block'; // Siempre visible pero opcional
      }
    });
  }
});

// Validación del formulario
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', function escuchaForm(e) {
      const archivo = document.getElementById('archivo_adjunto');
      if (
        archivo &&
        archivo.files[0] &&
        archivo.files[0].size > 5 * 1024 * 1024
      ) {
        e.preventDefault();
        mostrarMensaje('El archivo adjunto no puede ser mayor a 5MB.', 'info');
        return false;
      }

      // Validación del tipo de cliente (siempre requerido)
      const tipoClienteField = document.getElementById('tipo_cliente');
      if (tipoClienteField && !tipoClienteField.value) {
        e.preventDefault();
        mostrarMensaje(
          'Por favor selecciona el tipo de solicitante.',
          'warning',
        );
        return false;
      }

      // Agregar loading spinner al botón
      const btnEnviar = this.querySelector('.btn-enviar');
      if (btnEnviar) {
        btnEnviar.classList.add('loading');
        btnEnviar.disabled = true;
      }

      return true;
    });
  }
});

// Mostrar/ocultar información adicional según la prioridad seleccionada
document.addEventListener('DOMContentLoaded', () => {
  const prioridadSelect = document.getElementById('prioridad');
  const person = document.getElementById('person');
  person.style.display = 'none'; // Ocultar el botón de persona
  document.getElementById('volver').style.display = 'block';
  const hamburguesa = document.getElementById('hamburguesa');
  hamburguesa.style.display = 'none'; // Ocultar el botón de menú hamburguesa
  if (prioridadSelect) {
    prioridadSelect.addEventListener('change', function selectPrioridad() {
      // Aquí se puede agregar lógica adicional si se necesita
      // console.log('Prioridad seleccionada:', this.value);
      mostrarMensaje(`Prioridad seleccionada: ${this.value}`, 'info');
      // Mostrar notificación o realizar alguna acción adicional
    });
  }
});

// Funciones de utilidad para el soporte
const SoporteUtils = {
  // Función para validar email
  validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  // Función para formatear texto
  formatearTexto(texto) {
    return texto.trim().replace(/\s+/g, ' ');
  },

  // Función para mostrar notificaciones
  mostrarNotificacion(mensaje, tipo = 'info') {
    // Implementar notificaciones toast si se necesita
    mostrarMensaje(`[${tipo.toUpperCase()}] ${mensaje}`, 'info');
    // console.log(`[${tipo.toUpperCase()}] ${mensaje}`);
  },
};

// Exportar funciones globales para uso en HTML (si es necesario)
window.SoporteUtils = SoporteUtils;

function goBack() {
  const url = `${SERVER}/Pages/Home`;
  window.location.href = url;
}

const volver = document.getElementById('volver');
volver.addEventListener('click', () => {
  goBack();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    goBack();
  }
});
