// eslint-disable-next-line import/extensions
import Alerta from '../../../includes/atoms/alerta.js';
// eslint-disable-next-line import/extensions
import objVariables from './variables.js';

let row = 0;

function buttonImage(id) {
  row = id;
  const miAlerta = new Alerta();

  miAlerta.createVerde(objVariables.avisoAmarillo);
  const modal = document.getElementById('modalAlert');
  modal.style.display = 'block';
  const imageInput = document.getElementById('imageInput');
  setTimeout(() => {
    imageInput.click();
  }, 1500);
}

function generateLi(image) {
  const img = image;
  const fila = document.querySelector(`tr:nth-child(${row})`);
  const ul = fila.querySelector('ul');
  const li = document.createElement('li');
  img.setAttribute('class', 'img-select');
  li.appendChild(img);
  // const canvas = document.createElement('canvas');
  // li.appendChild(canvas);
  ul.appendChild(li);
}

function loadImage(selectedFile) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.style.maxWidth = '100%';
      img.onload = () => resolve(img);
      img.onerror = reject;
      const modal = document.getElementById('modalAlert');
      modal.style.display = 'none';
    };
    reader.readAsDataURL(selectedFile);
  });
}

const imageInput = document.getElementById('imageInput');
imageInput.addEventListener('change', async (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    if (/\.(jpg|jpeg|bmp|png)$/i.test(selectedFile.name)) {
      try {
        const img = await loadImage(selectedFile);
        generateLi(img);
      } catch (error) {
        // eslint-disable-next-line no-alert
        alert('No se pudo cargar la imagen.');
      }
    } else {
      // eslint-disable-next-line no-alert
      alert('Por favor, selecciona un archivo de imagen válido.');
    }
  }
});

export default buttonImage;
