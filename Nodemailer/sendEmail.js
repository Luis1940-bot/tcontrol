// const SERVER = '/iControl-Vanilla/icontrol';
const SERVER = '../../../..';

function send(filtrado, encabezados) {
  try {
    const formData = new FormData();
    formData.append('datos', JSON.stringify(filtrado));
    formData.append('encabezados', JSON.stringify(encabezados));
    console.log(formData);
    fetch(`${SERVER}/Nodemailer/Routes/sendEmail.php`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.text();
        }
        throw new Error('Error en la respuesta de la red.');
      })
      .then((data) => {
        // eslint-disable-next-line no-console
        console.log(data);
      })
      .catch((error) => {
        // eslint-disable-next-line indent, no-console
        console.error('Error:', error);
      });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);
  }
}

function enviaMail(datos, encabezados) {
  try {
    const filtrados = datos.displayRow.map((valor, indice) => {
      const tipoDeDato = datos.tipodedato[indice];
      const campoValor = datos.valor[indice];
      let valorHtmlValor = campoValor;
      const valorHtmlName = datos.name[indice];
      let valorHtmlDetalle = datos.detalle[indice];
      let valorHtmlObservacion = datos.observacion[indice];
      const image = datos.imagenes[indice];
      let colSpanName = '1';
      let colSpanValor = '1';
      let colSpanDetalle = '1';
      let colSpanObservacion = '1';
      let displayName = '';
      let displayValor = '';
      let displayDetalle = '';
      let displayObservacion = '';
      let dataURL;

      if (tipoDeDato === 'b') {
        campoValor === 1 ? valorHtmlValor = '<input type="checkbox"  checked disabled>' : valorHtmlValor = '<input type="checkbox" disabled>';
      }
      if (tipoDeDato === 'r') {
        campoValor === 1 ? valorHtmlValor = '<input type="radio"  checked disabled>' : valorHtmlValor = '<input type="radio" disabled>';
      }
      if (tipoDeDato === 'x' || tipoDeDato === 'btnQwery' || tipoDeDato === 'img') {
        valorHtmlValor = '';
      }
      if (tipoDeDato === 'img' && image !== '') {
        valorHtmlValor = 'img';
      }
      if (tipoDeDato === 's' || tipoDeDato === 'sd') {
        if (valorHtmlValor === '' || valorHtmlValor === 's' || valorHtmlValor === 'sd') {
          valorHtmlValor = '';
          valorHtmlDetalle = '';
          valorHtmlObservacion = '';
        }
      }
      if (tipoDeDato === 'l' || tipoDeDato === 'subt' || tipoDeDato === 'title') {
        valorHtmlValor = '';
        valorHtmlDetalle = '';
        valorHtmlObservacion = '';
        colSpanName = '4';
        colSpanValor = '1';
        colSpanDetalle = '1';
        colSpanObservacion = '1';
        displayValor = 'none';
        displayDetalle = 'none';
        displayObservacion = 'none';
        displayName = '';
      }

      if (valor === 'table-row') {
        return {
          name: valorHtmlName,
          valor: valorHtmlValor,
          detalle: valorHtmlDetalle,
          observacion: valorHtmlObservacion,
          colSpanName,
          colSpanValor,
          colSpanDetalle,
          colSpanObservacion,
          displayName,
          displayValor,
          displayDetalle,
          displayObservacion,
          image,
          dataURL,
        };
      }
      return null;
    }).filter((elemento) => elemento !== null);
    send(filtrados, encabezados);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}

export default enviaMail;
