// eslint-disable-next-line import/extensions
import traerSupervisor from '../Controladores/traerSupervisor.js';
// eslint-disable-next-line import/extensions
import Alerta from '../../../../includes/atoms/alerta.js';
// eslint-disable-next-line import/extensions
import objVariables from '../../../../controllers/variables.js';
// eslint-disable-next-line import/extensions, import/no-useless-path-segments
import { encriptar, desencriptar } from '../../../../controllers/cript.js';

import baseUrl from '../../../../config.js';

const SERVER = baseUrl;

function columna2(
  tagName,
  type,
  tds,
  val,
  datos,
  i,
  columnaTd,
  selDatos,
  index,
  valorSql,
  tipoDatoDetalle,
) {
  if (valorSql !== null) {
    // return;
  }
  // console.log(
  //   tagName,
  //   type,
  //   tds,
  //   val,
  //   datos,
  //   i,
  //   columnaTd,
  //   selDatos,
  //   index,
  //   valorSql,
  //   tipoDatoDetalle,
  // );
  const valorVal = val;
  const td = tds;

  function checkAndSetValues(select, value, data, dataIndex, retries = 0) {
    const maxRetries = 20; // Número máximo de reintentos
    const retryDelay = 200; // Retraso entre cada reintento (en milisegundos)
    let valor = value;
    let retryCount = retries;
    const selectElement = select;
    if (valor === 's' || valor === 'sd') {
      valor = null;
    }

    if (selectElement && selectElement.options.length > 0) {
      for (let m = 0; m < selectElement.options.length; m++) {
        if (selectElement.options[m].innerText === valor) {
          selectElement.selectedIndex = m;
          return;
        }
      }

      // Si no se encontró la opción, agregarla como nueva
      const option = document.createElement('option');
      option.value = data.valorS[dataIndex] || valor;
      option.innerText = valor;
      selectElement.appendChild(option);
      selectElement.selectedIndex = selectElement.options.length - 1;
    } else {
      if (valor && !selectElement.hasAttribute('selector')) {
        const option = document.createElement('option');
        option.value = datos.valorS[dataIndex] || valor;
        option.innerText = valor;
        selectElement.appendChild(option);
        selectElement.selectedIndex = selectElement.options.length - 1;
        return;
      }

      retryCount++;
      if (retryCount < maxRetries) {
        setTimeout(
          () =>
            checkAndSetValues(selectElement, valor, data, dataIndex, retries),
          retryDelay,
        );
      } else {
        // eslint-disable-next-line no-console
        console.warn(
          `No se pudo cargar el select después de ${maxRetries} intentos.`,
        );
      }
    }
  }

  if (
    (tagName === 'INPUT' && type === 'date') ||
    (tagName === 'INPUT' && type === 'time') ||
    (tagName === 'INPUT' && type === 'text') ||
    (tagName === 'TEXTAREA' && type === 'textarea')
  ) {
    td[columnaTd].childNodes[0].value = valorVal;
  }

  if (tagName === 'SELECT' && type === 'select-one' && valorVal) {
    const select = td[columnaTd].childNodes[0];
    checkAndSetValues(select, valorVal, datos, index);
  }

  if (tagName === 'INPUT' && type === 'checkbox') {
    td[columnaTd].childNodes[0].checked = valorVal === 1;
  }

  if (
    tagName === 'BUTTON' &&
    type === 'submit' &&
    datos.imagenes[index] !== ''
  ) {
    const { plant } = desencriptar(sessionStorage.getItem('user'));
    const jsonString = datos.imagenes[index].replace(/'/g, '"');
    const objeto = JSON.parse(jsonString);
    const rutaBase = `${SERVER}/assets/Imagenes/${plant}/`;
    const ul = td[3].childNodes[0];

    objeto.fileName.forEach((nombreArchivo, n) => {
      const img = new Image();
      const extension = objeto.extension[n];
      const fileNameWithoutExtension = nombreArchivo.replace(/\.[^.]+$/, '');
      const rutaCompleta = `${rutaBase}${nombreArchivo}`;
      const li = document.createElement('li');

      li.id = `li_${fileNameWithoutExtension}`;
      img.classList.add('img-select');
      img.dataset.filename = nombreArchivo;
      img.dataset.fileextension = extension;
      img.dataset.fileNameWithoutExtension = fileNameWithoutExtension;

      img.addEventListener('click', () => {
        const miAlertaImagen = new Alerta();
        miAlertaImagen.createModalImagenes(objVariables.modalImagen, img);
        document.getElementById('modalAlert').style.display = 'block';
      });

      fetch(rutaCompleta)
        .then((response) => response.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onload = () => {
            img.src = reader.result;
          };
          reader.readAsDataURL(blob);
        });

      li.appendChild(img);
      ul.appendChild(li);
    });
  }

  const tipodedato = datos.tipodedato[index];

  if (tagName === 'DIV' && (tipodedato === 'cn' || tipodedato === 'valid')) {
    if (valorVal !== '') {
      const div = tds[2];
      while (div.firstChild) {
        div.removeChild(div.firstChild);
      }
      const row = document.querySelector('#tableControl tbody').rows[index];
      if (row && row.cells.length >= 3) {
        row.cells[3].innerHTML = '';
        row.cells[2].colSpan += 1;
        row.removeChild(row.cells[3]);
      }
      const inputText = document.createElement('input');
      inputText.setAttribute('type', 'text');
      inputText.setAttribute('disabled', false);
      inputText.style.border = 'none';

      inputText.value = valorVal;
      div.appendChild(inputText);
    }
  }

  if (
    tagName === 'DIV' &&
    ['checkhour', 'checkdate', 'checkdateh'].includes(tipodedato)
  ) {
    if (valorVal !== '') {
      const div = tds[2];
      while (div.firstChild) {
        div.removeChild(div.firstChild);
      }
      const row = document.querySelector('#tableControl tbody').rows[index];
      if (row && row.cells.length >= 3) {
        row.cells[3].innerHTML = '';
        row.cells[2].colSpan += 1;
        row.removeChild(row.cells[3]);
      }
      const inputText = document.createElement('input');
      // inputText.type = 'text';
      // inputText.disabled = false;
      inputText.setAttribute('type', 'text');
      inputText.setAttribute('disabled', false);
      inputText.style.border = 'none';
      inputText.value = valorVal;
      div.appendChild(inputText);
    }
  }

  if (
    tagName === 'DIV' &&
    ['pastillatx', 'pastillase', 'pastillaco'].includes(tipodedato)
  ) {
    const celda = tds[2];
    if (!val) {
      return;
    }
    const divInterno = celda.querySelector('div');
    const partes = valorVal.split('-');
    // let pastilla;
    partes.forEach((parte) => {
      const pastilla = document.createElement('div');
      pastilla.className = 'pastilla';
      pastilla.setAttribute('data-id', `${Date.now()}-${Math.random()}`); // id único, por si querés rastrear

      const span = document.createElement('span');
      span.className = 'label-email';
      span.innerHTML = parte;
      const buttonCerrar = document.createElement('button');
      buttonCerrar.className = 'button-email';
      buttonCerrar.innerHTML = 'x';

      // Acción de eliminar la pastilla al hacer clic
      buttonCerrar.addEventListener('click', (e) => {
        const pastillaE = e.target.closest('.pastilla');
        if (pastillaE) {
          pastillaE.remove(); // Fin del drama
        }
      });

      pastilla.appendChild(span);
      pastilla.appendChild(buttonCerrar);
      divInterno.appendChild(pastilla);
    });
  }
  if (tagName === 'INPUT' && type === 'radio') {
    td[columnaTd].childNodes[0].checked = valorVal === '1';
  }

  if (tipoDatoDetalle === 'checkhour' && columnaTd === 2) {
    const checkhour = datos.detalle[index].replace('.', ':');
    const td3 = tds[3];
    const td2 = tds[2];

    const buttonElement = td3.querySelector('div > button');
    if (buttonElement) {
      buttonElement.remove();
    }

    const inputElement = td3.querySelector('div > input');
    if (inputElement) {
      inputElement.value = checkhour;
      inputElement.style.border = 'none';
      inputElement.style.display = 'block';
    }

    if (type === 'text' || type === 'checkbox') {
      const inputElement2 = td2.querySelector('input');
      inputElement2.disabled = true;
    }
  }
}

async function verSupervisor(idSupervisor, plant) {
  let configMenu;

  if (idSupervisor !== 0) {
    const supervisor = await traerSupervisor(idSupervisor, plant);
    configMenu = {
      guardar: false,
      guardarComo: true,
      guardarCambios: true,
      firma: true,
      configFirma: supervisor,
    };

    sessionStorage.setItem('config_menu', encriptar(configMenu));
    sessionStorage.setItem('firmado', encriptar(supervisor));
  } else if (idSupervisor === 0) {
    const supervisor = {
      id: 0,
      mail: '',
      mi_cfg: '',
      nombre: '',
      tipo: 0,
    };
    configMenu = {
      guardar: false,
      guardarComo: true,
      guardarCambios: true,
      firma: false,
      configFirma: supervisor,
    };

    sessionStorage.setItem('firma', encriptar('x'));
    sessionStorage.setItem('config_menu', encriptar('x'));
  }
}

async function cargarNR(res, plant, data) {
  try {
    const objString = res[0][14];
    const datos = JSON.parse(objString);
    const idSupervisor = datos.supervisor[0];
    const table = document.getElementById('tableControl');
    // console.log(
    //   'HTML de tableControl:',
    //   table ? table.outerHTML : 'No existe tableControl'
    // )

    if (!table) {
      console.error('tableControl no está disponible');
      return;
    }
    const tbody = table.querySelector('tbody');
    if (!table) {
      console.error('tableControl no está disponible');
      return;
    }
    const tr = tbody.querySelectorAll('tr');
    // console.log(tr.length);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < tr.length - 0; i++) {
      const row = tr[i];
      const valorSql = data[i][23];
      const td = row.querySelectorAll('td');
      const tipoDatoDetalle = data[i][33];
      const codigo = td[5].innerText;

      const { tagName } = td[2].childNodes[0];
      const { type } = td[2].childNodes[0];
      const tagNameObservaciones = td[4].childNodes[0].tagName;
      const typeObservaciones = td[4].childNodes[0].type;
      const codigoString = codigo.toString().trim();

      const elementoEncontrado = datos.idLTYcontrol.indexOf(codigoString);

      if (elementoEncontrado !== -1) {
        let valor = datos.valor[elementoEncontrado];

        const valorObservaciones = datos.observacion[elementoEncontrado];
        if (valor === 'tx') {
          valor = null;
        }

        columna2(
          tagName,
          type,
          td,
          valor,
          datos,
          i,
          2,
          12,
          elementoEncontrado,
          valorSql,
          tipoDatoDetalle,
        );
        columna2(
          tagNameObservaciones,
          typeObservaciones,
          td,
          valorObservaciones,
          datos,
          i,
          4,
          13,
          elementoEncontrado,
          valorSql,
          tipoDatoDetalle,
        );
      }
    }
    verSupervisor(idSupervisor, plant);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);
  }
  // return 'ok';
}

export default cargarNR;
