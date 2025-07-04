// Test para verificar que arraysLoadTranslate funciona correctamente
import { arraysLoadTranslate } from './controllers/arraysLoadTranslate.js';

async function testArraysLoadTranslate() {
  console.log('Probando arraysLoadTranslate...');

  try {
    const result = await arraysLoadTranslate();
    console.log('✅ Función ejecutada exitosamente');
    console.log('Resultado:', {
      operativoES: Array.isArray(result.operativoES)
        ? `Array con ${result.operativoES.length} elementos`
        : 'No es un array',
      operativoTR: Array.isArray(result.operativoTR)
        ? `Array con ${result.operativoTR.length} elementos`
        : 'No es un array',
      archivosES: Array.isArray(result.archivosES)
        ? `Array con ${result.archivosES.length} elementos`
        : 'No es un array',
      archivosTR: Array.isArray(result.archivosTR)
        ? `Array con ${result.archivosTR.length} elementos`
        : 'No es un array',
    });

    // Verificar que todos los elementos sean arrays
    const esValidoObjTranslate =
      Array.isArray(result.operativoES) &&
      Array.isArray(result.operativoTR) &&
      Array.isArray(result.archivosES) &&
      Array.isArray(result.archivosTR);

    if (esValidoObjTranslate) {
      console.log('✅ Todos los arrays son válidos');
    } else {
      console.log('❌ Algunos arrays no son válidos');
    }
  } catch (error) {
    console.log('❌ Error al ejecutar arraysLoadTranslate:', error);
  }
}

// Solo ejecutar si estamos en un entorno que lo permita
if (typeof window !== 'undefined') {
  testArraysLoadTranslate();
}
