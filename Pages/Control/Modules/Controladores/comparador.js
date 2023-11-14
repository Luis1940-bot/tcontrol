// eslint-disable-next-line import/extensions
import arrayGlobal from '../../../../controllers/variables.js';

function comparador(arrayQuery, numberDoc) {
  try {
    const { objetoControl } = arrayGlobal;
    const { objetoMemoria } = arrayGlobal;
    const { objetoMensaje } = arrayGlobal;
    // console.log(arrayQuery);
    // console.log(objetoControl);
    // console.log(objetoMemoria);
    let diferenciasConIndices = [];

    Object.keys(objetoControl).forEach((key) => {
      const arrayControl = objetoControl[key];
      const arrayMemoria = objetoMemoria[key];
      // console.log(key)
      // console.log(arrayControl);
      // console.log(arrayMemoria);

      // Verificar si las claves coinciden y ambos son arrays
      if (Array.isArray(arrayControl) && Array.isArray(arrayMemoria)) {
        // eslint-disable-next-line no-unused-vars
        const diferenciasConIndicesEnKey = arrayControl.reduce((result, valor, index) => {
          const valorAnterior = arrayMemoria[index];
          const valorActual = arrayControl[index];
          // console.log(valor , valorAnterior, i, index);
          if (valor !== valorAnterior) {
            result.push({ valor, indice: index });
            // console.log(valor, index, arrayQuery[index][3], key, valorActual, valorAnterior);
            if (typeof valor === 'object') {
              objetoMensaje.imagenes.push(valor);
            }
            if (key === 'valor') {
              const nameControl = arrayQuery[index][3];
              key === 'valor' ? (objetoMensaje.valor.push(valor), objetoMensaje.valorAnterior.push(valorAnterior)) : (objetoMensaje.valorAnterior.valor.push(''), objetoMensaje.valorAnterior.push(''));

              objetoMensaje.nameControl.push(nameControl);

              if ((valorAnterior === '' || valorAnterior === null || valorAnterior === undefined) && valorActual !== '') {
                objetoMensaje.tipoDeAccion.push('Nuevo');
              } else if (valorAnterior !== '' && (valorActual === '' || valorActual === null || valorActual === undefined)) {
                objetoMensaje.tipoDeAccion.push('Eliminado');
              } else {
                objetoMensaje.tipoDeAccion.push('Modificacion');
              }
              if (numberDoc === '') {
                objetoMensaje.controlNuevoUpdate.push('Nuevo');
              } else {
                objetoMensaje.controlNuevoUpdate.push('Modificación');
              }
            }
          }
          return result;
        }, []);
        diferenciasConIndices = diferenciasConIndices.concat(diferenciasConIndicesEnKey);
      }
    });
    // console.log(diferenciasConIndices);
    // console.log(arrayGlobal.objetoMensaje);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}

export default comparador;
