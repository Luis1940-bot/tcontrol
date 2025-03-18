<?php
require_once dirname(dirname(dirname(__DIR__))) . '/ErrorLogger.php';
ErrorLogger::initialize(dirname(dirname(dirname(__DIR__))) . '/logs/error.log');
/** 
 * @var array{timezone?: string} $_SESSION 
 */
if (isset($_SESSION['timezone']) && is_string($_SESSION['timezone'])) {
  date_default_timezone_set($_SESSION['timezone']);
} else {
  date_default_timezone_set('America/Argentina/Buenos_Aires');
}
/**
 * Elimina un pedido basado en un identificador único.
 *
 * @param string $nux El identificador único del pedido (debe ser una cadena URL decodificable).
 * @param PDO $pdo La conexión PDO a la base de datos.
 * @return array{numFilasDeleteadas: int} Un array con el número de filas eliminadas.
 */
function eliminaNuxPedido(string $nux, PDO $pdo): array
{
  // $result = array(
  //   'numFilasDeleteadas' => 0
  // );
  $result = [
    'numFilasDeleteadas' => 0
  ];
  $decodificado = urldecode($nux);
  $numFilasDeleteadas = 0;
  $sql = "DELETE FROM LTYregistrocontrol WHERE nuxpedido = ?";
  try {
    $pdo->beginTransaction();
    $sentencia = $pdo->prepare($sql);
    $sentencia->execute([$decodificado]);
    $numFilasDeleteadas = $sentencia->rowCount();
    $pdo->commit();
  } catch (PDOException $e) {
    error_log("Error al eliminar nux: " . $nux);
    // Manejar errores de PDO aquí si es necesario
    $pdo->rollBack();
    die("Error en la ejecución de la consulta: " . $e->getMessage());
  } finally {
    $result['numFilasDeleteadas'] = $numFilasDeleteadas;
  }
  return $result;
}


if (isset($_POST['elimina']) && $_POST['elimina'] === true) {
  // Establecer el encabezado de contenido
  header("Content-Type: text/html;charset=utf-8");

  // Validar si $pdo está definido y es una instancia de PDO
  if (!isset($pdo) || !$pdo instanceof PDO) {
    error_log('La conexión PDO no está definida o no es válida.');
    http_response_code(500); // Internal Server Error
    echo json_encode(['message' => 'Error interno: Conexión a la base de datos no válida.']);
    exit;
  }

  // Validar si $nux es una cadena
  if (isset($nux) && is_string($nux)) {
    try {
      // Llamar a la función para eliminar el pedido
      $resultado = eliminaNuxPedido($nux, $pdo);
      echo json_encode(['success' => true, 'data' => $resultado]);
    } catch (RuntimeException $e) {
      error_log('Error al eliminar el pedido: ' . $e->getMessage());
      http_response_code(500); // Internal Server Error
      echo json_encode(['message' => 'No se pudo eliminar el pedido.']);
    }
  } else {
    // Si $nux no es válido
    error_log('El identificador $nux no es válido.');
    http_response_code(400); // Bad Request
    echo json_encode(['message' => 'El identificador del pedido no es válido.']);
  }
}
