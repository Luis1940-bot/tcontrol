function createSelect(array, params) {
  const { id, className } = params
  const select = document.createElement('select')
  if (id) {
    select.setAttribute('id', id)
  }
  if (className) {
    select.setAttribute('class', className)
  }

  while (select.firstChild) {
    select.removeChild(select.firstChild)
  }
  const nuevoArray = [...array]
  // nuevoArray.forEach((element, index) => {
  //   index === 1 ? select.setAttribute('selector', element[1]) : null
  // })

  if (array.length > 0) {
    const emptyOption = document.createElement('option')
    emptyOption.value = ''
    emptyOption.text = ''
    select.appendChild(emptyOption)
    array.forEach(([value, text]) => {
      const option = document.createElement('option')
      option.value = value
      option.text = text
      select.appendChild(option)
    })
  }

  return select
}

export default createSelect
