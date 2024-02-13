function encriptar(params) {
  // console.log('para encript', params);
  return btoa(JSON.stringify(params))
}
function desencriptar(params) {
  // console.log('para desencript', params)
  return JSON.parse(atob(params))
}

export { encriptar, desencriptar }
