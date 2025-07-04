// Verificación de funcionamiento de traducciones
console.log('=== VERIFICACIÓN DE TRADUCCIONES ===');

// Verificar que los archivos de traducción existen
const SERVER = window.location.origin;
const OperativoURL = `${SERVER}/includes/Traducciones/Operativo/`;
const FileURL = `${SERVER}/includes/Traducciones/Archivos/`;

async function verificarArchivo(url) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const text = await response.text();
      return {
        url,
        status: 'OK',
        size: text.length,
        hasContent: text.trim().length > 0,
      };
    }
    return {
      url,
      status: 'ERROR',
      httpStatus: response.status,
      hasContent: false,
    };
  } catch (error) {
    return {
      url,
      status: 'FETCH_ERROR',
      error: error.message,
      hasContent: false,
    };
  }
}

async function verificarTraducciones() {
  const idiomas = ['es', 'en', 'pt']; // Verificar idiomas comunes

  console.log('Verificando archivos de traducción...');

  for (const idioma of idiomas) {
    console.log(`\n--- Idioma: ${idioma} ---`);

    const operativoResult = await verificarArchivo(
      `${OperativoURL}${idioma}.txt`,
    );
    const archivoResult = await verificarArchivo(`${FileURL}${idioma}.txt`);

    console.log('Operativo:', operativoResult);
    console.log('Archivo:', archivoResult);
  }
}

// Solo ejecutar si estamos en el navegador
if (typeof window !== 'undefined') {
  verificarTraducciones();
}
