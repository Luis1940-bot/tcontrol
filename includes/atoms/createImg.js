function createImg(params) {
  const nuevoImagen = document.createElement('img');
  nuevoImagen.setAttribute('class', params.class);
  nuevoImagen.setAttribute('name', params.name);
  params.float !== null ? nuevoImagen.style.float = params.float : null;
  params.src !== null ? nuevoImagen.src = params.src : null;
  params.alt !== null ? nuevoImagen.alt = params.alt : null;
  params.height !== null ? nuevoImagen.style.height = params.height : null;
  params.width !== null ? nuevoImagen.style.width = params.width : null;
  params.margin !== null ? nuevoImagen.style.margin = params.margin : null;
  return nuevoImagen;
}

export default createImg;
