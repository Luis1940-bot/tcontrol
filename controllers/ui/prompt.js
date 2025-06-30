// prompt.js

export function mostrarPrompt(
  titulo = 'Ingrese un valor',
  textoBoton = 'Aceptar',
  soloConfirmar = false,
  valorPorDefecto = '',
) {
  return new Promise((resolve) => {
    const overlay = document.getElementById('promptOverlay');
    const input = overlay.querySelector('#promptInput');
    const tituloEl = overlay.querySelector('#promptTitulo');
    const btnOk = overlay.querySelector('#promptOk');
    const btnCancel = overlay.querySelector('#promptCancelar');

    if (!overlay || !input || !tituloEl || !btnOk || !btnCancel) {
      console.error('❌ El prompt no está bien cargado en el HTML.');
      resolve(null);
      return;
    }

    tituloEl.textContent = titulo;
    btnOk.textContent = textoBoton;
    input.value = valorPorDefecto;

    if (soloConfirmar) {
      input.style.display = 'none';
    } else {
      input.style.display = 'block';
    }

    // overlay.style.display = 'flex';
    overlay.classList.add('visible');

    document.body.style.overflow = 'hidden';

    btnOk.onclick = () => {
      // overlay.style.display = 'none';
      overlay.classList.remove('visible');

      document.body.style.overflow = '';
      resolve(soloConfirmar ? true : input.value.trim());
    };

    btnCancel.onclick = () => {
      // overlay.style.display = 'none';
      overlay.classList.remove('visible');

      document.body.style.overflow = '';
      resolve(null);
    };

    input.onkeydown = (e) => {
      if (e.key === 'Enter') btnOk.click();
      if (e.key === 'Escape') btnCancel.click();
    };

    if (!soloConfirmar) input.focus();
  });
}
