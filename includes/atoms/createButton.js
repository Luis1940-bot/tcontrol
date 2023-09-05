function createButton(params) {
  const nuevoBoton = document.createElement('button');
  nuevoBoton.textContent = params.text;
  nuevoBoton.setAttribute('class', params.class);
  nuevoBoton.setAttribute('name', params.name);
  return nuevoBoton;
}

export default createButton;
