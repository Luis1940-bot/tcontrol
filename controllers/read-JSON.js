function readJSON(json) {
  return new Promise((resolve, reject) => {
    const ruta = `../../models/${json}.json`
    fetch(ruta)
      .then((response) => {
        if (!response.ok) {
          throw new Error('No se pudo cargar el archivo app.json')
        }
        return response.json()
      })
      .then((data) => {
        resolve(data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export default readJSON
