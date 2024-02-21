<?php
function sumaSimple($arr_customers) {
    try {
        $arrayPHP = $arr_customers;
        $posicionesCaracteresEspeciales = array();
        $primerElemento = reset($arrayPHP);

        foreach ($primerElemento as $posicion => $valor) {
            if (preg_match('/[#∑]/u', $valor)) {
                // Guardar la posición de la columna con caracteres especiales
                $posicionesCaracteresEspeciales[] = $posicion;
            }
        }

        array_shift($arrayPHP);

        usort($arrayPHP, function ($a, $b) {
            return strcmp($a[0], $b[0]);
        });

        $arrayNuevo = array();
        $parcial = array_fill(0, count($primerElemento), '');

        foreach ($arrayPHP as $indice => $fila) {
            if ($fila[$posicionesCaracteresEspeciales[0]] === $parcial[$posicionesCaracteresEspeciales[0]]) {
                $sumando = floatval($fila[$posicionesCaracteresEspeciales[1]]);
                $parcial[$posicionesCaracteresEspeciales[1]] += $sumando;
                $fila[$posicionesCaracteresEspeciales[1]] = $parcial[$posicionesCaracteresEspeciales[1]];
                $fila = array_merge($fila, array_fill(1, count($fila) - 1, '')); // Rellenar con valores vacíos
            } else {
                // Agregar la fila parcial al arrayNuevo solo si no está vacía
                if (!empty(array_filter($parcial, function ($value) {
                    return $value !== '';
                }))) {
                    $arrayNuevo[] = $parcial;
                }

                // Iniciar el acumulado para el nuevo grupo
                $parcial = $fila;
                $parcial[$posicionesCaracteresEspeciales[1]] = floatval($fila[$posicionesCaracteresEspeciales[1]]);
                $fila = array_merge($fila, array_fill(1, count($fila) - 1, '')); // Rellenar con valores vacíos
            }
        }

        // Agregar la última fila del grupo actual solo si no está vacía
        if (!empty(array_filter($parcial, function ($value) {
            return $value !== '';
        }))) {
            $arrayNuevo[] = $parcial;
        }

        // Calcular la suma total
        $sumaTotal = array_fill(0, count($primerElemento), '');
        $sumaTotal[$posicionesCaracteresEspeciales[1]] = array_sum(array_column($arrayNuevo, $posicionesCaracteresEspeciales[1]));
        $arrayNuevo[] = $sumaTotal;

        // Agregar la primera fila al principio
        array_unshift($arrayNuevo, $primerElemento);

        return $arrayNuevo;
    } catch (\Throwable $e) {
        print "Error!: " . $e->getMessage() . "<br>";
        die();
    }
}

if (basename(__FILE__) == basename($_SERVER['PHP_SELF'])) {
    header("Content-Type: application/json; charset=utf-8");

    $arr_customers = $_POST['arr_customers'];

    $result = sumaSimple($arr_customers);
    echo json_encode($result);
}
?>
