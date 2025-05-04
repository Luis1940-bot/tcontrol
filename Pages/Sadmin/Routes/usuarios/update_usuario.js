document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM completamente cargado');
  document.getElementById('searchInput').value = '';
});

// eslint-disable-next-line no-unused-vars
function cargarUsuario(
  id,
  nombre,
  area,
  activo,
  puesto,
  mail,
  verificador,
  codVerificador,
  idtipousuario,
  idLTYcliente,
) {
  console.log('Cargando usuario: ', id);

  const modal = document.getElementById('editModal');
  modal.style.display = 'block';

  document.getElementById('edit_idusuario').value = id;
  document.getElementById('edit_nombre').value = nombre;
  document.getElementById('edit_area').value = area;
  document.getElementById('edit_activo').value = activo;
  document.getElementById('edit_puesto').value = puesto;
  document.getElementById('edit_mail').value = mail;
  document.getElementById('edit_verificador').value = verificador;
  document.getElementById('edit_cod_verificador').value =
    codVerificador === 'NULL' ? '' : codVerificador;
  document.getElementById('edit_idtipousuario').value = idtipousuario;
  document.getElementById('edit_idLTYcliente').value = idLTYcliente;
}

// eslint-disable-next-line no-unused-vars
function cerrarModal() {
  document.getElementById('editModal').style.display = 'none';
}

// eslint-disable-next-line no-unused-vars
function filtrarTabla() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const table = document.getElementById('usuariosTable');
  const rows = table.getElementsByTagName('tr');

  for (let i = 1; i < rows.length; i++) {
    const nombre = rows[i]
      .getElementsByTagName('td')[1]
      .textContent.toLowerCase();
    const mail = rows[i]
      .getElementsByTagName('td')[5]
      .textContent.toLowerCase();

    if (nombre.includes(input) || mail.includes(input)) {
      rows[i].style.display = '';
    } else {
      rows[i].style.display = 'none';
    }
  }
}
