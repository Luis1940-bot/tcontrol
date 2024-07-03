function createImg(params) {
  const nuevoImagen = document.createElement('img')
  params.id !== null && params.id !== undefined
    ? (nuevoImagen.id = params.id)
    : null
  params.class !== null && params.class !== undefined
    ? nuevoImagen.setAttribute('class', params.class)
    : null
  params.name !== null && params.name !== undefined
    ? nuevoImagen.setAttribute('name', params.name)
    : null

  params.float !== null && params.float !== undefined
    ? (nuevoImagen.style.float = params.float)
    : null
  params.src !== null && params.src !== undefined
    ? (nuevoImagen.src = params.src)
    : null
  params.alt !== null && params.alt !== undefined
    ? (nuevoImagen.alt = params.alt)
    : null
  params.height !== null && params.height !== undefined
    ? (nuevoImagen.style.height = params.height)
    : null
  params.width !== null && params.width !== undefined
    ? (nuevoImagen.style.width = params.width)
    : null
  params.margin !== null && params.margin !== undefined
    ? (nuevoImagen.style.margin = params.margin)
    : null
  return nuevoImagen
}

export default createImg
