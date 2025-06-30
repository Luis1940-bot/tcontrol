<?php
require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
$baseDir = BASE_DIR;
include_once $baseDir . "/Routes/datos_base.php";

header("Content-Type: application/json");

// 📌 Leer datos enviados desde JavaScript
$data = json_decode(file_get_contents("php://input"), true);
if (!$data || !isset($data['datos']) || !isset($data['ultimoID'])) {
  echo json_encode(['success' => false, 'message' => 'Datos no válidos.']);
  exit;
}

$mysqli = new mysqli($host, $user, $password, $dbname, $port);
if ($mysqli->connect_error) {
  echo json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos.']);
  exit;
}
mysqli_set_charset($mysqli, "utf8mb4");

$mysqli->begin_transaction(); // 🔹 Iniciar transacción

try {
  $ultimoID = intval($data['ultimoID']); // 🔹 Tomar el ID enviado desde JavaScript
  $ultimoOrden = 0; // 🔹 Variable para almacenar el último orden insertado
  $idLTYreporte = intval($data['idLTYreporte']);
  $idLTYcliente = intval($data['idLTYcliente']);
  $visible = 's';

  // 🔹 Insertar nuevos registros en LTYcontrol
  foreach ($data['datos'] as $registro) {
    $control = $mysqli->real_escape_string($registro['control']);
    $nombre = $mysqli->real_escape_string($registro['nombre']);
    $detalle = $mysqli->real_escape_string($registro['detalle']);
    $tipodato = $mysqli->real_escape_string($registro['tipodato']);
    $tpdeobserva = $mysqli->real_escape_string($registro['tpdeobserva']);
    $orden = intval($registro['orden']);

    $sqlInsert = "INSERT INTO LTYcontrol (control, nombre, detalle, tipodato, tpdeobserva, orden, idLTYreporte, idLTYcliente, visible)
                  VALUES ('$control', '$nombre', '$detalle', '$tipodato', '$tpdeobserva', $orden, $idLTYreporte, $idLTYcliente, '$visible')";
    $mysqli->query($sqlInsert);

    $ultimoOrden = $orden; // 🔹 Guardamos el último orden insertado
  }

  // 🔹 Actualizar el último registro de la tabla con orden +1
  $nuevoOrden = $ultimoOrden + 1;
  $sqlUpdate = "UPDATE LTYcontrol SET orden = $nuevoOrden WHERE idLTYcontrol = $ultimoID";
  $mysqli->query($sqlUpdate);

  $mysqli->commit(); // 🔹 Confirmar la transacción

  echo json_encode(['success' => true, 'message' => 'Registros guardados correctamente.']);
} catch (Exception $e) {
  $mysqli->rollback(); // 🔹 Revertir cambios en caso de error
  echo json_encode(['success' => false, 'message' => 'Error al guardar datos: ' . $e->getMessage()]);
}

$mysqli->close();
exit;
