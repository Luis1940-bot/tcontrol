/**
 * Función para obtener la URL base dependiendo del entorno
 * @returns {string} URL base
 */
const getBaseUrl = () => {
  const { hostname, port } = window.location;

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // Para localhost usar ruta directa sin subdirectorios
    const currentPort = port ? `:${port}` : '';
    return `${window.location.protocol}//${hostname}${currentPort}`;
  }

  if (hostname === 'test.tenkiweb.com') {
    return 'https://test.tenkiweb.com/tcontrol';
  }

  return 'https://tenkiweb.com/tcontrol';
};

// Exportar la función en lugar de una variable mutable
export default getBaseUrl();
