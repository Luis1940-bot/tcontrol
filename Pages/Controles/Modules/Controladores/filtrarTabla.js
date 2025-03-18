function filtrarTabla(tableId, searchTerm) {
  const table = document.getElementById(tableId);
  const tbody = table.getElementsByTagName('tbody')[0]; // Obtén el tbody

  const rows = tbody.getElementsByTagName('tr');

  // eslint-disable-next-line no-restricted-syntax
  for (const row of rows) {
    const cells = row.getElementsByTagName('td');
    let shouldHide = true;

    // eslint-disable-next-line prefer-const, no-restricted-syntax
    for (let cell of cells) {
      const text = cell.textContent || cell.innerText;

      if (text.toLowerCase().includes(searchTerm)) {
        shouldHide = false;
        break;
      }
    }

    if (shouldHide) {
      row.style.display = 'none';
    } else {
      row.style.display = '';
    }
  }
}

export default filtrarTabla;
