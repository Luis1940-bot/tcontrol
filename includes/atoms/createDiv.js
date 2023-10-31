function createDiv(params) {
  const nuevoDiv = document.createElement('Div');
  params.text !== null ? nuevoDiv.textContent = params.text : null;
  nuevoDiv.setAttribute('class', params.class);
  nuevoDiv.setAttribute('name', params.name);
  params.innerHTML !== null ? nuevoDiv.innerHTML = params.innerHTML : null;
  params.height !== null ? nuevoDiv.style.height = params.height : null;
  params.width !== null ? nuevoDiv.style.width = params.width : null;
  params.borderRadius !== null ? nuevoDiv.style.borderRadius = params.borderRadius : null;
  params.border !== null ? nuevoDiv.style.border = params.border : null;
  params.textAlign !== null ? nuevoDiv.style.textAlign = params.textAlign : null;
  params.marginLeft !== null ? nuevoDiv.style.marginLeft = params.marginLeft : null;
  params.marginRight !== null ? nuevoDiv.style.marginRight = params.marginRight : null;
  params.marginTop !== null ? nuevoDiv.style.marginTop = params.marginTop : null;
  params.marginBotton !== null ? nuevoDiv.style.marginBotton = params.marginBotton : null;
  params.paddingLeft !== null ? nuevoDiv.style.paddingLeft = params.paddingLeft : null;
  params.paddingRight !== null ? nuevoDiv.style.paddingRight = params.paddingRight : null;
  params.paddingTop !== null ? nuevoDiv.style.paddingTop = params.paddingTop : null;
  params.paddingBotton !== null ? nuevoDiv.style.paddingBotton = params.paddingBotton : null;
  params.display !== null ? nuevoDiv.style.display = params.display : null;
  return nuevoDiv;
}

export default createDiv;
