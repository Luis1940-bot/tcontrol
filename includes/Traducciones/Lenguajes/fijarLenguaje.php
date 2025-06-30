<?php
// ini_set('display_errors', '1');
// ini_set('display_startup_errors', '1');
// error_reporting(E_ALL);
declare(strict_types=1); // Forzar uso de tipos estrictos
mb_internal_encoding('UTF-8');

/**
 * Función para actualizar el lenguaje del usuario en la base de datos.
 *
 * @param int $id      ID del usuario
 * @param string $mi_cfg Configuración del lenguaje
 */
function fijarLenguaje(int $id, string $mi_cfg): void
{
  try {
    if (!defined('BASE_DIR')) {
      die(json_encode(['success' => false, 'message' => 'BASE_DIR no está definido.']));
    }

    if (defined('BASE_DIR')) {
      include_once BASE_DIR . "/Routes/datos_base.php";
    } else {
      die(json_encode(['success' => false, 'message' => 'BASE_DIR no está definido correctamente.']));
    }


    if (
      !isset($host, $user, $password, $dbname) ||
      !is_string($host) || !is_string($user) || !is_string($password) || !is_string($dbname)
    ) {
      die(json_encode(['success' => false, 'message' => 'Parámetros de conexión a la base de datos no definidos.']));
    }

    $conn = mysqli_connect($host, $user, $password, $dbname);

    if (!$conn) {
      die(json_encode(['success' => false, 'message' => 'Conexión fallida: ' . mysqli_connect_error()]));
    }

    $sql = "UPDATE usuario SET mi_cfg = ? WHERE idusuario = ?";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
      die(json_encode(['success' => false, 'message' => 'Error al preparar la consulta: ' . $conn->error]));
    }

    $stmt->bind_param("si", $mi_cfg, $id);

    $response = [
      'success' => $stmt->execute(),
      'message' => $stmt->execute() ? 'Se actualizó el lenguaje.' : 'No se actualizó el lenguaje.'
    ];

    $stmt->close();
    $conn->close();

    header('Content-Type: application/json');
    echo json_encode($response);
  } catch (Throwable $e) {
    die(json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]));
  }
}

header("Content-Type: application/json; charset=utf-8");
require_once dirname(__DIR__, 3) . '/config.php';

$datos = file_get_contents("php://input");

if (empty($datos)) {
  echo json_encode(['success' => false, 'message' => 'Faltan datos necesarios.']);
  exit;
}

$data = json_decode($datos, true);

if (!is_array($data) || !isset($data['id'], $data['leng']) || !is_int($data['id']) || !is_string($data['leng'])) {
  echo json_encode(['success' => false, 'message' => 'Datos inválidos o faltantes.']);
  exit;
}

$id = (int) $data['id'];
$mi_cfg = 'd-' . $data['leng'];

fijarLenguaje($id, $mi_cfg);
