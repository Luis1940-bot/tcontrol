function createRadioButton(params) {
  const nuevoRadioButton = document.createElement('input');
  nuevoRadioButton.setAttribute('type', 'radio');
  nuevoRadioButton.setAttribute('class', params.class);
  nuevoRadioButton.setAttribute('name', params.name);
  params.value !== null ? nuevoRadioButton.setAttribute('value', params.value) : null;
  params.id !== null ? nuevoRadioButton.setAttribute('id', params.id) : null;
  params.width !== null ? nuevoRadioButton.style.width = params.width : null;
  params.heigth !== null ? nuevoRadioButton.style.height = params.height : null;
  params.background !== null ? nuevoRadioButton.style.backgroundColor = params.background : null;
  params.border !== null ? nuevoRadioButton.style.border = params.border : null;
  params.marginLeft !== null ? nuevoRadioButton.style.marginLeft = params.marginLeft : null;
  params.marginRight !== null ? nuevoRadioButton.style.marginRight = params.marginRight : null;
  params.marginTop !== null ? nuevoRadioButton.style.marginTop = params.marginTop : null;
  params.marginBotton !== null ? nuevoRadioButton.style.marginBotton = params.marginBotton : null;
  params.paddingLeft !== null ? nuevoRadioButton.style.paddingLeft = params.paddingLeft : null;
  params.paddingRight !== null ? nuevoRadioButton.style.paddingRight = params.paddingRight : null;
  params.paddingTop !== null ? nuevoRadioButton.style.paddingTop = params.paddingTop : null;
  // eslint-disable-next-line max-len
  params.paddingBotton !== null ? nuevoRadioButton.style.paddingBotton = params.paddingBotton : null;
  params.disabled !== null ? nuevoRadioButton.setAttribute('disabled', params.disabled) : null;
  params.dataCustom !== null ? nuevoRadioButton.setAttribute('data-custom', params.dataCustom) : null;

  return nuevoRadioButton;
}

export default createRadioButton;
