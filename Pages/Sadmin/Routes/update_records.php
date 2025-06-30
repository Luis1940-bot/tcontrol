<?php
// ini_set('display_errors', '1');
// ini_set('display_startup_errors', '1');
// error_reporting(E_ALL);

require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
/** @var string $baseDir */
$baseDir = BASE_DIR;
include_once BASE_DIR . "/Routes/datos_base.php";
/** @var string $charset */
/** @var string $dbname */
/** @var string $host */
/** @var int $port */
/** @var string $password */
/** @var string $user */
/** @var PDO $pdo */
// $host = "34.174.211.66";
// $user = "uumwldufguaxi";
// $password = "5lvvumrslp0v";
// $dbname = "db5i8ff3wrjzw3";
// $port = 3306;
$charset = "utf8mb4";
$mysqli = new mysqli($host, $user, $password, $dbname, $port);
if ($mysqli->connect_error) {
  die(json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos.']));
}

mysqli_set_charset($mysqli, "utf8mb4");

$sqlUpdate = "
    UPDATE LTYregistrocontrol l
    INNER JOIN LTYreporte l2 ON l2.idLTYreporte = l.idLTYreporte
    SET l.idLTYcliente = l2.idLTYcliente
    WHERE l.idLTYcliente = 0
";

if ($mysqli->query($sqlUpdate)) {
  echo json_encode(['success' => true, 'message' => 'Registros actualizados correctamente.']);
} else {
  echo json_encode(['success' => false, 'message' => 'Error en la actualización: ' . $mysqli->error]);
}
