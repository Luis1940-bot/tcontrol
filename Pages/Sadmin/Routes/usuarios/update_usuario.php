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

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $idusuario = $_POST['idusuario'];
  $nombre = $mysqli->real_escape_string($_POST['nombre']);
  $area = $mysqli->real_escape_string($_POST['area']);
  $activo = $mysqli->real_escape_string($_POST['activo']);
  $puesto = $mysqli->real_escape_string($_POST['puesto']);
  $mail = $mysqli->real_escape_string($_POST['mail']);
  $verificador = $mysqli->real_escape_string($_POST['verificador']);
  $cod_verificador = $_POST['cod_verificador'] === "" ? "NULL" : "'" . $mysqli->real_escape_string($_POST['cod_verificador']) . "'";
  $idtipousuario = intval($_POST['idtipousuario']);
  $idLTYcliente = intval($_POST['idLTYcliente']);

  $sqlUpdate = "UPDATE usuario SET 
                    nombre = '$nombre', 
                    area = '$area', 
                    activo = '$activo', 
                    puesto = '$puesto', 
                    mail = '$mail', 
                    verificador = '$verificador', 
                    cod_verificador = $cod_verificador, 
                    idtipousuario = $idtipousuario, 
                    idLTYcliente = $idLTYcliente 
                  WHERE idusuario = $idusuario";

  if ($mysqli->query($sqlUpdate)) {
    header("Location: index.php?success=1");
  } else {
    echo json_encode(['success' => false, 'message' => 'Error en la actualización: ' . $mysqli->error]);
  }
}
