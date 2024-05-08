function utf8_to_b64(str) {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode('0x' + p1)
    })
  )
}

function b64_to_utf8(str) {
  return decodeURIComponent(
    Array.from(
      atob(str),
      (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join('')
  )
}

function encriptar(params) {
  const stringifiedParams = JSON.stringify(params)
  const base64Encoded = utf8_to_b64(stringifiedParams)
  // console.log(base64Encoded)
  return base64Encoded
}

function desencriptar(params) {
  const jsonString = b64_to_utf8(params)
  return JSON.parse(jsonString)
}

export { encriptar, desencriptar }
