console.log('Script cargado correctamente')

function listarSessionStorage() {
  const keys = Object.keys(sessionStorage)

  keys.forEach((key) => {
    const value = sessionStorage.getItem(key)
    console.log(`Key: ${key}, Value: ${value}`)
  })
}

listarSessionStorage() // Llama a la función al cargar el script
