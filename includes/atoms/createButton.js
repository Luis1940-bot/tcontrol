function createButton(params) {
  const nuevoBoton = document.createElement('button');
  params.text !== null ? nuevoBoton.textContent = params.text : null;
  nuevoBoton.setAttribute('class', params.class);
  nuevoBoton.setAttribute('name', params.name);
  params.innerHTML !== null ? nuevoBoton.innerHTML = params.innerHTML : null;
  params.height !== null ? nuevoBoton.style.height = params.height : null;
  params.width !== null ? nuevoBoton.style.width = params.width : null;
  params.borderRadius !== null ? nuevoBoton.style.borderRadius = params.borderRadius : null;
  params.border !== null ? nuevoBoton.style.border = params.border : null;
  params.textAlign !== null ? nuevoBoton.style.textAlign = params.textAlign : null;
  params.marginLeft !== null ? nuevoBoton.style.marginLeft = params.marginLeft : null;
  params.marginRight !== null ? nuevoBoton.style.marginRight = params.marginRight : null;
  params.marginTop !== null ? nuevoBoton.style.marginTop = params.marginTop : null;
  params.marginBotton !== null ? nuevoBoton.style.marginBotton = params.marginBotton : null;
  params.paddingLeft !== null ? nuevoBoton.style.paddingLeft = params.paddingLeft : null;
  params.paddingRight !== null ? nuevoBoton.style.paddingRight = params.paddingRight : null;
  params.paddingTop !== null ? nuevoBoton.style.paddingTop = params.paddingTop : null;
  params.paddingBotton !== null ? nuevoBoton.style.paddingBotton = params.paddingBotton : null;
  params.background !== null ? nuevoBoton.style.backgroundColor = params.background : null;
  params.onClick !== null ? nuevoBoton.addEventListener('click', (params.onClick)) : null;
  return nuevoBoton;
}

export default createButton;
