// eslint-disable-next-line import/extensions
import fechasGenerator from '../../../../controllers/fechas.js';
// eslint-disable-next-line import/extensions
import respuestaColumna from './armadoDeObjetos.js';
// // eslint-disable-next-line import/extensions
// import guardaNotas from './guardaNotas.js';

function buscarEnArray(id, array) {
  const idStr = id.toString().trim();
  const resultado = array.find((registro) => registro[1] === idStr);
  return resultado;
}

function recorroTable(objetoControl, arrayControl) {
  try {
    const idPerson = document.getElementById('sessionIdPerson').textContent;
    // const email = document.getElementById('idCheckBoxEmail').checked;
    const url = new URL(window.location.href);
    const controlN = url.searchParams.get('control_N');
    // const controlT = url.searchParams.get('control_T');
    // const numberDoc = document.getElementById('numberDoc').textContent;
    const tbody = document.querySelector('tbody');
    const tr = tbody.querySelectorAll('tr');
    let estanTodosLosRequeridos = true;

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < tr.length; i++) {
      let valor;
      let selector1;
      let selector2;
      let valorS;
      let valorOBS;
      let familiaselector;
      // let imagenes;
      let observacion;
      let respuesta;
      const td = tr[i].querySelectorAll('td');
      // eslint-disable-next-line no-unused-vars
      const displayRow = window.getComputedStyle(tr[i]).display;
      // eslint-disable-next-line no-plusplus
      for (let c = 2; c <= 4; c += 2) {
        const displayCell = window.getComputedStyle(td[c]).display;
        const element = td[c];
        const node = element.childNodes[0];
        const datoCelda = element.childNodes[0].data;
        const valueCelda = element.childNodes[0].value;
        const colspanValue = td[1].getAttribute('colspan');
        const inputElement = element.querySelector('input');
        const { nodeType } = node;
        const { type } = node;
        const { tagName } = node;
        let childeNode0;
        let inputmode;
        let select;
        const checkbox = node.checked;
        const radio = node.checked;
        let divConsultas;
        let liImages;
        const selector = null;
        const terceraColumna = td[3].firstChild;

        let imagenes = {
          src: [],
          fileName: [],
          extension: [],
        };

        const objParametros = {
          displayCell,
          element,
          node,
          datoCelda,
          valueCelda,
          colspanValue,
          inputElement,
          nodeType,
          type,
          tagName,
          inputmode,
          childeNode0,
          select,
          checkbox,
          radio,
          divConsultas,
          liImages,
          selector,
          imagenes,
          terceraColumna,
        };

        if (c === 2) {
          respuesta = respuestaColumna(c, i, objParametros);
          ({
            valor, selector1, valorS, familiaselector,
          } = respuesta);
        }
        if (c === 4) {
          respuesta = respuestaColumna(c, i, objParametros);
          ({
            selector2, valorOBS, familiaselector, imagenes, observacion,
          } = respuesta);
        }

        if (c === 4) {
          // console.log(valor,displayRow)
          const founded = buscarEnArray(td[5].textContent, arrayControl);
          objetoControl.fecha.push(fechasGenerator.fecha_corta_yyyymmdd(new Date()));
          objetoControl.nuxpedido.push(0);
          objetoControl.valor.push(valor);
          objetoControl.desvio.push(founded[2]);
          objetoControl.idusuario.push(idPerson);
          objetoControl.tipodedato.push(founded[5]);
          objetoControl.idLTYreporte.push(controlN);
          objetoControl.idLTYcontrol.push(founded[1]);
          objetoControl.supervisor.push(0);
          objetoControl.tpdeobserva.push(founded[9]);
          objetoControl.selector.push(selector1);
          objetoControl.selector2.push(selector2);
          objetoControl.valorS.push(valorS);
          objetoControl.valorOBS.push(valorOBS);
          objetoControl.familiaselector.push(familiaselector);
          objetoControl.observacion.push(observacion);
          objetoControl.requerido.push(founded[21]);
          imagenes.src.length > 0 ? objetoControl.imagenes.push(imagenes) : objetoControl.imagenes.push('');
          objetoControl.displayRow.push(displayRow);

          // console.log(typeof founded[21], founded[21], valor);
          if (founded[21] === '0' || founded[21] === null || founded[21] === undefined) {
            estanTodosLosRequeridos = true;
          }
          if (founded[21] === '1' && (valor === '' || valor === null || valor === undefined)) {
            estanTodosLosRequeridos = false;
            const requerido = {
              requerido: false,
              fila: i,
              idLTYcontrol: founded[1],
            };
            localStorage.setItem('requerido', JSON.stringify(requerido));
            return false;
          // eslint-disable-next-line max-len
          }
        }
      }
    }

    // console.log(objetoMemoria);
    // console.log(objetoControl)
    // console.log(arrayControl);
    // console.log(estanTodosLosRequeridos)
    if (estanTodosLosRequeridos) {
      const requerido = {
        requerido: true,
        fila: 0,
        idLTYcontrol: 0,
      };
      localStorage.setItem('requerido', JSON.stringify(requerido));
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
  return null;
}
function guardarNuevo(objetoControl, arrayControl) {
  // console.log(objetoControl, arrayControl);
  recorroTable(objetoControl, arrayControl);
}

export default guardarNuevo;
