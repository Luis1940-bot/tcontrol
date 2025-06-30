<?php
// ini_set('display_errors', '1');
// ini_set('display_startup_errors', '1');
// error_reporting(E_ALL);
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
function generarCodigoAlfabetico(string $nombre): string
{
  $palabras = explode(' ', $nombre);
  $codigo = '';

  foreach ($palabras as $palabra) {
    $codigo .= strtolower(substr($palabra, 0, 3));
  }

  return $codigo;
}
/**
 * Agrega un nuevo campo en la base de datos y devuelve el estado de la operación.
 *
 * @param string $nombre
 * @param int $lastInsertedId
 * @param int $idLTYcliente
 * @param PDO $pdo
 * @return array{success: bool, actualizado?: array<string, mixed>, message?: string}
 */
function addCampos(string $nombre, PDO $pdo, int $lastInsertedId, int $idLTYcliente): array
{
  $codigoBase = generarCodigoAlfabetico($nombre);
  $campos = "control, nombre, tipodato, detalle, tpdeobserva, idLTYreporte, orden, visible, requerido, idLTYcliente, enable1";
  $interrogantes = "?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?";

  try {
    $pdo->beginTransaction();

    for ($i = 1; $i <= 3; $i++) {
      $codigo = $codigoBase . $i;
      $tipoDeDato = '';
      $nombreCampo = '';
      $detalle = '';
      $requerido = 0;
      $enable1 = 1;

      if ($i === 1) {
        $tipoDeDato = 'd';
        $nombreCampo = 'FECHA';
        $detalle = 'La fecha cuando se origina el control.';
        $requerido = 1;
        $enable1 = 1;
      } elseif ($i === 2) {
        $tipoDeDato = 'h';
        $nombreCampo = 'HORA';
        $detalle = 'La hora del momento de la realización.';
        $requerido = 1;
        $enable1 = 1;
      } elseif ($i === 3) {
        $tipoDeDato = 'tx';
        $nombreCampo = 'OBSERVACIÓN';
        $requerido = 0;
        $enable1 = 0;
      }

      $datos = [$codigo, $nombreCampo, $tipoDeDato, $detalle, 'x', $lastInsertedId, $i, 's', $requerido, $idLTYcliente, $enable1];
      $sql = "INSERT INTO LTYcontrol ($campos) VALUES ($interrogantes);";
      $sentencia = $pdo->prepare($sql);
      $sentencia->execute($datos);
    }

    $pdo->commit();
  } catch (PDOException $e) {
    error_log("Error al cargar los campos básicos. Error:" . $e);
    $pdo->rollBack();
    return ['success' => false, 'message' => "Error en la ejecución de la consulta: " . $e->getMessage()];
  }
  return ['success' => true, 'message' => 'Campos agregados correctamente.'];
}
