window.addEventListener('DOMContentLoaded', () => {
  // Usar destructuring para obtener el hostname
  const { hostname } = window.location;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

  if (!isLocalhost) {
    // Si NO estamos en localhost, deshabilitar la consola
    const frozenConsole = {
      log: () => {},
      warn: () => {},
      error: () => {},
      time: () => {},
      timeEnd: () => {},
      info: () => {},
      debug: () => {},
      trace: () => {},
    };

    Object.assign(console, frozenConsole);

    // Aplicar también a los iframes
    Array.from(document.getElementsByTagName('iframe')).forEach(
      ({ contentWindow }) => {
        if (contentWindow) {
          try {
            Object.assign(contentWindow.console, frozenConsole);
          } catch (e) {
            // eslint-disable-next-line no-console
            console.warn('No se pudo acceder al console del iframe:', e);
          }
        }
      },
    );
  }
});
