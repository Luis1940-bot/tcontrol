function createRadioButton(params) {
  const nuevoRadioButton = document.createElement('input')
  nuevoRadioButton.setAttribute('type', 'radio')
  nuevoRadioButton.setAttribute('class', params.class)
  nuevoRadioButton.setAttribute('name', params.name)
  params.value !== null && params.value !== undefined
    ? nuevoRadioButton.setAttribute('value', params.value)
    : null
  params.id !== null && params.id !== undefined
    ? nuevoRadioButton.setAttribute('id', params.id)
    : null
  params.width !== null && params.width !== undefined
    ? (nuevoRadioButton.style.width = params.width)
    : null
  params.heigth !== null && params.heigth !== undefined
    ? (nuevoRadioButton.style.height = params.height)
    : null
  params.background !== null && params.background !== undefined
    ? (nuevoRadioButton.style.backgroundColor = params.background)
    : null
  params.border !== null && params.border !== undefined
    ? (nuevoRadioButton.style.border = params.border)
    : null
  params.marginLeft !== null && params.marginLeft !== undefined
    ? (nuevoRadioButton.style.marginLeft = params.marginLeft)
    : null
  params.marginRight !== null && params.marginRight !== undefined
    ? (nuevoRadioButton.style.marginRight = params.marginRight)
    : null
  params.marginTop !== null && params.marginTop !== undefined
    ? (nuevoRadioButton.style.marginTop = params.marginTop)
    : null
  params.marginBotton !== null && params.marginBotton !== undefined
    ? (nuevoRadioButton.style.marginBotton = params.marginBotton)
    : null
  params.paddingLeft !== null && params.paddingLeft !== undefined
    ? (nuevoRadioButton.style.paddingLeft = params.paddingLeft)
    : null
  params.paddingRight !== null && params.paddingRight !== undefined
    ? (nuevoRadioButton.style.paddingRight = params.paddingRight)
    : null
  params.paddingTop !== null && params.paddingTop !== undefined
    ? (nuevoRadioButton.style.paddingTop = params.paddingTop)
    : null
  // eslint-disable-next-line max-len
  params.paddingBotton !== null && params.paddingBotton !== undefined
    ? (nuevoRadioButton.style.paddingBotton = params.paddingBotton)
    : null
  params.disabled !== null && params.disabled !== undefined
    ? nuevoRadioButton.setAttribute('disabled', params.disabled)
    : null
  params.dataCustom !== null && params.dataCustom !== undefined
    ? nuevoRadioButton.setAttribute('data-custom', params.dataCustom)
    : null

  return nuevoRadioButton
}

export default createRadioButton
