import { mostrarMensajeError } from '../../../controllers/utils.js';
import baseUrl from '../../../config.js';

const SERVER = baseUrl;
function hardReload() {
  const url = new URL(window.location.href);
  url.searchParams.set('cache', Date.now());
  window.location.replace(url.toString());
}
function startReloadCountdown() {
  let counter = 20;

  const interval = setInterval(() => {
    if (counter === 0) {
      clearInterval(interval);
      hardReload();
    } else {
      mostrarMensajeError(
        `⏳ Reinicio en ${counter} segundos... ¡Guardá ahora!`,
      );
      counter--;
    }
  }, 1000);
}
function showConfirmBeforeReload() {
  const overlay = document.createElement('div');
  overlay.id = 'modalOverlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '99999';

  const modal = document.createElement('div');
  modal.style.background = 'white';
  modal.style.padding = '20px';
  modal.style.borderRadius = '8px';
  modal.style.maxWidth = '400px';
  modal.style.textAlign = 'center';
  modal.style.fontFamily = 'sans-serif';
  modal.style.boxShadow = '0 2px 10px rgba(0,0,0,0.4)';

  modal.innerHTML = `
    <h2>🔄 Actualización del sistema</h2>
    <p>Se han realizado cambios importantes en la aplicación.</p>
    <p><strong>Al aceptar, tendrás 20 segundos</strong> para guardar tu trabajo antes de que la página se recargue.</p>
    <p style="color: red;"><strong>⚠️ Si no guardás, podrías perder datos no almacenados.</strong></p>
    <button id="confirmReload" style="padding: 10px 20px; margin-top: 15px;">Aceptar</button>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  document.getElementById('confirmReload').addEventListener('click', () => {
    overlay.remove();
    mostrarMensajeError(
      '🔔 ¡Tenés 20 segundos para guardar antes de reiniciar!',
    );
    startReloadCountdown();
  });
}

function checkForReload() {
  const ruta = `${SERVER}/Pages/Sadmin/api/restart-check.php`;
  // console.log(ruta);
  fetch(ruta, {
    credentials: 'include',
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.restart === true) {
        // console.log('🔁 Reinicio remoto detectado.');
        showConfirmBeforeReload();
      }
    })
    // eslint-disable-next-line no-console
    .catch((err) => console.warn('❌ Error en reloadWatcher:', err));
}

const interval = window.reloadInterval || 300000;
setInterval(checkForReload, interval);
