<?php
require_once dirname(dirname(dirname(dirname(__DIR__)))) . '/config.php';
$baseDir = BASE_DIR;
include_once BASE_DIR . "/Routes/datos_base.php";
$charset = "utf8mb4";
$mysqli = new mysqli($host, $user, $password, $dbname, $port);
if ($mysqli->connect_error) {
  die(json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos.']));
}
mysqli_set_charset($mysqli, "utf8mb4");

// Obtener usuarios
$sql = "SELECT u.idusuario, u.nombre, u.area, LOWER(u.activo) AS activo, u.puesto, u.modificacion, u.mail, 
        u.verificador, u.cod_verificador, u.idtipousuario, t.tipo, u.firma, 
        u.mi_cfg, u.idLTYcliente, l.cliente 
        FROM usuario u
        INNER JOIN LTYcliente l ON l.idLTYcliente = u.idLTYcliente
        INNER JOIN tipousuario t ON t.idtipousuario = u.idtipousuario 
        ORDER BY u.idusuario ASC";
$result = $mysqli->query($sql);

// Obtener tipos de usuario
$sqlTipos = "SELECT idtipousuario, tipo FROM tipousuario ORDER BY idtipousuario ASC";
$resultTipos = $mysqli->query($sqlTipos);
$tiposUsuarios = [];
while ($row = $resultTipos->fetch_assoc()) {
  $tiposUsuarios[] = $row;
}

// Obtener clientes
$sqlClientes = "SELECT idLTYcliente, cliente FROM LTYcliente ORDER BY idLTYcliente ASC";
$resultClientes = $mysqli->query($sqlClientes);
$clientes = [];
while ($row = $resultClientes->fetch_assoc()) {
  $clientes[] = $row;
}
?>
<!DOCTYPE html>
<html>

<head>
  <title>Gestión de Usuarios</title>
  <link rel="stylesheet" type="text/css" href="update_usuario.css">
  <script src="update_usuario.js" defer></script>
</head>

<body>
  <h1>Gestión de Usuarios</h1>
  <input type="text" id="searchInput" placeholder="Buscar por nombre o email" onkeyup="filtrarTabla()" style="width: 50%; padding: 10px; margin-bottom: 10px;">
  <table id="usuariosTable">
    <tr>
      <th>ID</th>
      <th>Nombre</th>
      <th>Área</th>
      <th>Activo</th>
      <th>Puesto</th>
      <th>Mail</th>
      <th>Verificador</th>
      <th>Código Verificador</th>
      <th>Tipo de Usuario</th>
      <th>Cliente</th>
      <th>Acciones</th>
    </tr>
    <?php while ($usuario = $result->fetch_assoc()): ?>
      <tr>
        <td><?= $usuario['idusuario'] ?></td>
        <td><?= $usuario['nombre'] ?></td>
        <td><?= $usuario['area'] ?></td>
        <td><?= $usuario['activo'] ?></td>
        <td><?= $usuario['puesto'] ?></td>
        <td><?= $usuario['mail'] ?></td>
        <td><?= $usuario['verificador'] ?></td>
        <td><?= $usuario['cod_verificador'] ?></td>
        <td><?= $usuario['tipo'] ?></td>
        <td><?= $usuario['cliente'] ?></td>
        <td><button class="btn-edit" onclick="cargarUsuario('<?= $usuario['idusuario'] ?>', '<?= addslashes($usuario['nombre']) ?>', '<?= addslashes($usuario['area']) ?>', '<?= $usuario['activo'] ?>', '<?= addslashes($usuario['puesto']) ?>', '<?= addslashes($usuario['mail']) ?>', '<?= $usuario['verificador'] ?>', '<?= $usuario['cod_verificador'] ?>', '<?= $usuario['idtipousuario'] ?>', '<?= $usuario['idLTYcliente'] ?>')">Editar</button></td>
      </tr>
    <?php endwhile; ?>
  </table>
  <div id="editModal" class="modal">
    <div class="modal-content">
      <span class="close" onclick="cerrarModal()">&times;</span>
      <h2>Editar Usuario</h2>
      <form action="update_usuario.php" method="POST">
        <input type="hidden" id="edit_idusuario" name="idusuario">
        <label>Nombre: <input type="text" id="edit_nombre" name="nombre"></label><br>
        <label>Área: <input type="text" id="edit_area" name="area"></label><br>
        <label>Activo: <select id="edit_activo" name="activo">
            <option value="s">s</option>
            <option value="n">n</option>
          </select></label><br>
        <label>Puesto: <input type="text" id="edit_puesto" name="puesto"></label><br>
        <label>Mail: <input type="text" id="edit_mail" name="mail"></label><br>
        <label>Verificador: <select id="edit_verificador" name="verificador">
            <option value="1">1</option>
            <option value="0">0</option>
          </select></label><br>
        <label>Código Verificador: <input type="text" id="edit_cod_verificador" name="cod_verificador"></label><br>
        <label>Tipo Usuario: <select id="edit_idtipousuario" name="idtipousuario">
            <?php foreach ($tiposUsuarios as $tipo) {
              echo "<option value='{$tipo['idtipousuario']}'>{$tipo['tipo']}</option>";
            } ?>
          </select></label><br>
        <label>Cliente: <select id="edit_idLTYcliente" name="idLTYcliente">
            <?php foreach ($clientes as $cliente) {
              echo "<option value='{$cliente['idLTYcliente']}'>{$cliente['cliente']}</option>";
            } ?>
          </select></label><br>
        <button type="submit" class="btn-edit">Guardar</button>
        <button type="button" class="btn-cancel" onclick="cerrarModal()">Cancelar</button>
      </form>
    </div>
  </div>
</body>

</html>