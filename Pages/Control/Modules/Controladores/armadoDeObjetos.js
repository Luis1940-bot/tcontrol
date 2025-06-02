// eslint-disable-next-line no-unused-vars
function consologuear(c, i, objParams) {
  const obj = objParams;
  // eslint-disable-next-line no-console
  console.log(
    '*c-i:',
    c,
    i,
    ' element:',
    obj.element,
    ' node:',
    obj.node,
    ' inputElement:',
    obj.inputElement,
    ' nodeType:',
    obj.nodeType,
    ' type:',
    obj.type,
    ' tagName:',
    obj.tagName,
    ' inputmode:',
    obj.inputmode,
    ' childeNode0:',
    obj.childeNode0,
    ' valueCelda:',
    obj.valueCelda,
    ' datoCelda:',
    obj.datoCelda,
    ' colspanValue:',
    obj.colspanValue,
    ' tipoInput:',
    obj.tipoInput,
    ' select:',
    obj.select,
    ' checkbox',
    obj.checkbox,
    ' radio:',
    obj.radio,
    ' divConsultas:',
    obj.divConsultas,
    ' selector',
    obj.selector,
    ' images:',
    obj.images,
    ' terceraColumna:',
    obj.terceraColumna,
    '\n----------------------------------',
  );
}

function respuestaColumna(c, i, objParams, plant, carpeta) {
  try {
    // console.log(objParams);
    // ** tagName-INPUT   tagName-SELECT   tagName-DIV*/
    const obj = objParams;
    const { tagName, type } = obj;
    let inputmode = '';
    let valor = null;
    let selector1 = 0;
    let selector2 = 0;
    let valorS = 0;
    let valorOBS = 0;
    const familiaselector = 0;
    const { imagenes } = obj;
    let observacion = '';

    // console.log(c, tagName, type, plant, carpeta, obj);

    if (tagName === 'INPUT') {
      if (type === 'text') {
        inputmode = obj.inputElement.getAttribute('inputmode');
        obj.inputmode = inputmode;
        if (
          inputmode === 'decimal' &&
          obj.valueCelda !== '' &&
          obj.valueCelda !== null
        ) {
          let decimal = obj.valueCelda || 0;
          if (decimal === '') decimal = 0;

          // ✅ Convertir a string y reemplazar solo la coma decimal (sin eliminar puntos)
          let numeroFormateado = decimal.toString().replace(',', '.');

          // ✅ Limitar a 6 decimales sin eliminar el punto decimal
          if (numeroFormateado.includes('.')) {
            const partes = numeroFormateado.split('.');
            partes[1] = partes[1].slice(0, 6); // Tomar solo 6 decimales
            numeroFormateado = partes.join('.');
          }

          // ✅ Convertir a float sin perder decimales
          valor = parseFloat(numeroFormateado);

          if (c === 4) {
            observacion = valor;
            valor = null;
          }

          // let decimal = obj.valueCelda || 0;
          // decimal === '' ? (decimal = 0) : null;
          // const numeroFormateado = decimal
          //   .toString()
          //   .replace(/\.(?=\d{3})/g, '')
          //   .replace(',', '.');
          // valor = parseFloat(numeroFormateado) || 0;
          // c === 4
          //   ? ((observacion = parseFloat(numeroFormateado)), (valor = null))
          //   : null;
        } else {
          obj.valueCelda === null ? (valor = '') : (valor = obj.valueCelda);
          // valor = obj.valueCelda
          c === 4 ? ((observacion = valor), (valor = null)) : null;
        }
      }
      if (type === 'checkbox' || type === 'radio') {
        obj.checkbox ? (valor = 1) : (valor = 0);
        c === 4 ? ((observacion = valor), (valor = null)) : null;
      }
      if (type === 'date' || type === 'time') {
        obj.valueCelda === null ? (valor = '') : (valor = obj.valueCelda);
        // valor = obj.valueCelda
        c === 4 ? ((observacion = valor), (valor = null)) : null;
      }
    }
    if (tagName === 'TEXTAREA' && type === 'textarea') {
      obj.valueCelda === null ? (valor = '') : (valor = obj.valueCelda);
      // valor = obj.valueCelda
      c === 4 ? ((observacion = valor), (valor = null)) : null;
      const elementoColSpan = obj.element;
      const colspanValue = elementoColSpan.getAttribute('colspan');

      if (colspanValue && colspanValue === '4') {
        obj.valueCelda === null ? (valor = '') : null;
      }
    }
    if (tagName === 'SELECT' && type === 'select-one' && obj.valueCelda) {
      valor = obj.node.options[obj.node.selectedIndex].textContent;
      valorS = obj.valueCelda;
      obj.selector !== 'selectDinamic' && obj.selector !== 'select-hijo'
        ? (selector1 = obj.selector)
        : null;
      if (c === 4) {
        observacion = valor;
        valor = null;
        obj.valueCelda === null ? (valorOBS = '') : (valorOBS = obj.valueCelda);
        // valorOBS = obj.valueCelda
        obj.selector !== 'selectDinamic' && obj.selector !== 'select-hijo'
          ? (selector2 = obj.selector)
          : null;
      }
    }
    if (tagName === 'DIV') {
      obj.inputElement ? (valor = obj.inputElement.value) : null;
      c === 4 ? ((observacion = obj.inputElement), (valor = null)) : null;
      const hijos = obj.node.children;
      if (hijos.length > 0 && c === 2) {
        const hijosArray = Array.from(obj.node.children);
        if (
          hijosArray[0].tagName === 'DIV' &&
          hijosArray[0].classList.contains('pastilla')
        ) {
          const valores = hijosArray
            .map((pastilla) => {
              const span = pastilla.querySelector('span');
              return span ? span.textContent.trim() : '';
            })
            .filter((v) => v !== ''); // por si algún span estaba vacío
          valor = valores.join('-');
        }
      }
    }
    if (c === 4 && obj.terceraColumna.tagName === 'UL') {
      const ul = obj.terceraColumna;
      // eslint-disable-next-line no-plusplus
      for (let m = 0; m < ul.children.length; m++) {
        const li = ul.children[m].childNodes[0];
        const rutaSrc = li.getAttribute('src');
        const fileName = li.getAttribute('data-filename');
        const fileExtension = li.getAttribute('data-fileextension');

        imagenes.src.push(rutaSrc);
        imagenes.fileName.push(fileName);
        imagenes.extension.push(fileExtension);
        imagenes.plant.push(plant.value);
        imagenes.carpeta.push(carpeta);
      }
      // console.log(imagenes)
    }
    if (tagName === 'IMG') {
      const nombreDeLaImagen = obj.node.alt;
      const { extension } = obj.node.dataset;
      const imagen = `${nombreDeLaImagen}.${extension}`;
      const { width } = obj.node;
      const { height } = obj.node;
      valor = `{"img": "${imagen}", "width" : ${width}, "height": ${height}}`;
    }

    // console.log(c,i,valor)
    // consologuear(c, i, obj);
    // const valorr = `c:${c} i:${i} /${valor}`;
    // valor = valorr;
    return {
      valor,
      selector1,
      selector2,
      valorS,
      valorOBS,
      familiaselector,
      imagenes,
      observacion,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
  return {
    valor: null,
    selector1: 0,
    selector2: 0,
    valorS: 0,
    valorOBS: 0,
    familiaselector: 0,
    imagenes: null,
    observacion: '',
  };
}

export default respuestaColumna;
