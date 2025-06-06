function createDiv(params) {
  const nuevoDiv = document.createElement('Div');
  params.id !== null && params.id !== undefined
    ? nuevoDiv.setAttribute('id', params.id)
    : null;
  params.text !== null && params.text !== undefined
    ? (nuevoDiv.textContent = params.text)
    : null;
  params.class !== null && params.class !== undefined
    ? nuevoDiv.setAttribute('class', params.class)
    : null;
  params.name !== null && params.name !== undefined
    ? nuevoDiv.setAttribute('name', params.name)
    : null;
  params.innerHTML !== null && params.innerHTML !== undefined
    ? (nuevoDiv.innerHTML = params.innerHTML)
    : null;
  params.height !== null && params.height !== undefined
    ? (nuevoDiv.style.height = params.height)
    : null;
  params.width !== null && params.width !== undefined
    ? (nuevoDiv.style.width = params.width)
    : null;
  params.borderRadius !== null && params.borderRadius !== undefined
    ? (nuevoDiv.style.borderRadius = params.borderRadius)
    : null;
  params.border !== null && params.border !== undefined
    ? (nuevoDiv.style.border = params.border)
    : null;
  params.textAlign !== null && params.textAlign !== undefined
    ? (nuevoDiv.style.textAlign = params.textAlign)
    : null;
  params.marginLeft !== null && params.marginLeft !== undefined
    ? (nuevoDiv.style.marginLeft = params.marginLeft)
    : null;
  params.marginRight !== null && params.marginRight !== undefined
    ? (nuevoDiv.style.marginRight = params.marginRight)
    : null;
  params.marginTop !== null && params.marginTop !== undefined
    ? (nuevoDiv.style.marginTop = params.marginTop)
    : null;
  params.marginBotton !== null && params.marginBotton !== undefined
    ? (nuevoDiv.style.marginBotton = params.marginBotton)
    : null;
  params.paddingLeft !== null && params.paddingLeft !== undefined
    ? (nuevoDiv.style.paddingLeft = params.paddingLeft)
    : null;
  params.paddingRight !== null && params.paddingRight !== undefined
    ? (nuevoDiv.style.paddingRight = params.paddingRight)
    : null;
  params.paddingTop !== null && params.paddingTop !== undefined
    ? (nuevoDiv.style.paddingTop = params.paddingTop)
    : null;
  params.paddingBotton !== null && params.paddingBotton !== undefined
    ? (nuevoDiv.style.paddingBotton = params.paddingBotton)
    : null;
  params.display !== null && params.display !== undefined
    ? (nuevoDiv.style.display = params.display)
    : null;
  params.justifyContent !== null && params.justifyContent !== undefined
    ? (nuevoDiv.style.justifyContent = params.justifyContent)
    : null;
  return nuevoDiv;
}

export default createDiv;
