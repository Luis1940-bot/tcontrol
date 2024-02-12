// listarsessionStorage.js

console.log('Script cargado correctamente')

function listarLocalStorage() {
  const keys = Object.keys(localStorage)

  keys.forEach((key) => {
    const value = localStorage.getItem(key)
    console.log(`Key: ${key}, Value: ${value}`)
  })
}

listarLocalStorage() // Llama a la función al cargar el script
