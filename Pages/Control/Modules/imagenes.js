function buttonImage() {
  const imageInput = document.getElementById('imageInput');
  imageInput.click();
}

const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    if (/\.(jpg|jpeg|bmp|png)$/i.test(selectedFile.name)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.style.maxWidth = '100%';
        imageCell.innerHTML = '';
        imageCell.appendChild(img);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      // eslint-disable-next-line no-alert
      alert('Por favor, selecciona un archivo de imagen válido.');
    }
  }
});

export default buttonImage;
