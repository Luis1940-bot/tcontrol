let row = 0;
function buttonImage(id) {
  row = id;
  const imageInput = document.getElementById('imageInput');
  imageInput.click();
}

function generateLi(img) {
  const fila = document.querySelector(`tr:nth-child(${row})`);
  const ul = fila.querySelector('ul');
  const li = document.createElement('li');
  img.setAttribute('class', 'img-select');
  li.appendChild(img);
  const canvas = document.createElement('canvas');
  li.appendChild(canvas);
  ul.appendChild(li);
}

const imageInput = document.getElementById('imageInput');
imageInput.addEventListener('change', (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    if (/\.(jpg|jpeg|bmp|png)$/i.test(selectedFile.name)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.style.maxWidth = '100%';
        generateLi(img);
        // imageCell.innerHTML = '';
        // imageCell.appendChild(img);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      // eslint-disable-next-line no-alert
      alert('Por favor, selecciona un archivo de imagen válido.');
    }
  }
});

export default buttonImage;
