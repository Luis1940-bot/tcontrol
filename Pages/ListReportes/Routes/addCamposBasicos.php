<?php
require_once dirname(dirname(dirname(__DIR__))) . '/ErrorLogger.php';
ErrorLogger::initialize(dirname(dirname(dirname(__DIR__))) . '/logs/error.log');
if (isset($_SESSION['timezone'])) {
    date_default_timezone_set($_SESSION['timezone']);
} else {
    date_default_timezone_set('America/Argentina/Buenos_Aires');
}
function generarCodigoAlfabetico($nombre) {
  $palabras = explode(' ', $nombre);
  $codigo = '';

  foreach ($palabras as $palabra) {
    $codigo .= strtolower(substr($palabra, 0, 3));
  }

  return $codigo;
}

function addCampos($nombre, $pdo, $lastInsertedId, $idLTYcliente){
    $codigoBase = generarCodigoAlfabetico($nombre);
    $campos = "control, nombre, tipodato, detalle, tpdeobserva, idLTYreporte, orden, visible, requerido, idLTYcliente";
    $interrogantes = "?, ?, ?, ?, ?, ?, ?, ?, ?, ?";
    
    try {
        $pdo->beginTransaction();
        
        for ($i = 1; $i <= 3; $i++) {
            $codigo = $codigoBase . $i;
            $tipoDeDato = '';
            $nombreCampo = '';
            $detalle = '';
            $requerido = 0;

            if ($i === 1) {
                $tipoDeDato = 'd';
                $nombreCampo = 'FECHA';
                $detalle = 'La fecha cuando se origina el control.';
                $requerido = 1;
            } elseif ($i === 2) {
                $tipoDeDato = 'h';
                $nombreCampo = 'HORA';
                $detalle = 'La hora del momento de la realización.';
                $requerido = 1;
            } elseif ($i === 3) {
                $tipoDeDato = 'tx';
                $nombreCampo = 'OBSERVACIÓN';
                $requerido = 0;
            }

            $datos = [$codigo, $nombreCampo, $tipoDeDato, $detalle, 'x', $lastInsertedId, $i, 's', $requerido, $idLTYcliente];
            $sql = "INSERT INTO LTYcontrol ($campos) VALUES ($interrogantes);";
            $sentencia = $pdo->prepare($sql);
            $sentencia->execute($datos);
        }
        
        $pdo->commit();
    } catch (PDOException $e) {
         error_log("Error al cargar los campos básicos. Error:" . $e);
        $pdo->rollBack();
        die("Error en la ejecución de la consulta: " . $e->getMessage());
    }
    return;
}
?>
