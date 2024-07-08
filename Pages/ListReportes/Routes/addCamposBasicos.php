<?php
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

            if ($i === 1) {
                $tipoDeDato = 'd';
                $nombreCampo = 'FECHA';
                $detalle = 'La fecha cuando se origina el control.';
            } elseif ($i === 2) {
                $tipoDeDato = 'h';
                $nombreCampo = 'HORA';
                $detalle = 'La hora del momento de la realización.';
            } elseif ($i === 3) {
                $tipoDeDato = 'tx';
                $nombreCampo = 'OBSERVACIÓN';
            }

            $datos = [$codigo, $nombreCampo, $tipoDeDato, $detalle, 'x', $lastInsertedId, $i, 's', 1, $idLTYcliente];
            $sql = "INSERT INTO LTYcontrol ($campos) VALUES ($interrogantes);";
            $sentencia = $pdo->prepare($sql);
            $sentencia->execute($datos);
        }
        
        $pdo->commit();
    } catch (PDOException $e) {
        $pdo->rollBack();
        die("Error en la ejecución de la consulta: " . $e->getMessage());
    }
    return;
}
?>
