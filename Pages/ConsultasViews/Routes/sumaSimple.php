<?php
/**
 * Procesa un array de clientes y realiza operaciones específicas.
 *
 * @param array<int, array<int|string, mixed>> $arr_customers
 * @return array<int, array<int|string, mixed>>
 */
function sumaSimple(array $arr_customers): array {
    try {
        $arrayPHP = $arr_customers;
        $posicionesCaracteresEspeciales = array();
        $primerElemento = reset($arrayPHP);

        // Validar que el primer elemento sea iterable antes de usar foreach
        if (!is_iterable($primerElemento)) {
            throw new InvalidArgumentException("El primer elemento no es iterable.");
        }

        foreach ($primerElemento as $posicion => $valor) {
            if (is_string($valor) && preg_match('/[#∑]/u', $valor)) {
                // Guardar la posición de la columna con caracteres especiales
                $posicionesCaracteresEspeciales[] = $posicion;
            }
        }

        // Eliminar el primer elemento del array (encabezados)
        array_shift($arrayPHP);


        usort($arrayPHP, function ($a, $b) {
            if (!isset($a[0], $b[0]) || !is_string($a[0]) || !is_string($b[0])) {
                return 0;
            }
            return strcmp($a[0], $b[0]);
        });

        $arrayNuevo = array();
        $parcial = array_fill(0, count($primerElemento), '');

        // Iterar sobre el array principal
        foreach ($arrayPHP as $indice => $fila) {
            // Validar que los índices necesarios existan
            if (!isset($fila[$posicionesCaracteresEspeciales[0]], $fila[$posicionesCaracteresEspeciales[1]])) {
                continue; // Ignorar filas inválidas
            }

            if ($fila[$posicionesCaracteresEspeciales[0]] === $parcial[$posicionesCaracteresEspeciales[0]]) {
                $sumando = is_numeric($fila[$posicionesCaracteresEspeciales[1]]) ? floatval($fila[$posicionesCaracteresEspeciales[1]]) : 0.0;
                $parcial[$posicionesCaracteresEspeciales[1]] = is_numeric($parcial[$posicionesCaracteresEspeciales[1]])
                    ? $parcial[$posicionesCaracteresEspeciales[1]] + $sumando
                    : $sumando;
                $fila[$posicionesCaracteresEspeciales[1]] = $parcial[$posicionesCaracteresEspeciales[1]];
                $fila = array_merge($fila, array_fill(1, max(0, count($fila) - 1), '')); // Rellenar con valores vacíos
            } else {
                // Agregar la fila parcial al arrayNuevo solo si no está vacía
                if (!empty(array_filter($parcial, fn($value) => $value !== ''))) {
                    $arrayNuevo[] = $parcial;
                }

                // Iniciar el acumulado para el nuevo grupo
                $parcial = $fila;
                $parcial[$posicionesCaracteresEspeciales[1]] = is_numeric($fila[$posicionesCaracteresEspeciales[1]])
                    ? floatval($fila[$posicionesCaracteresEspeciales[1]])
                    : 0.0;
                $fila = array_merge($fila, array_fill(1, max(0, count($fila) - 1), '')); // Rellenar con valores vacíos
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
/**
 * Normaliza y valida un array de clientes.
 *
 * @param mixed $data
 * @return array<int, array<int|string, mixed>>|null
 */
function normalizeCustomers($data): ?array {
    if (!is_array($data)) {
        return null;
    }

    $normalized = [];
    foreach ($data as $item) {
        if (!is_array($item)) {
            return null;
        }

        $normalized[] = $item; // PHPStan ya sabe que $item es del tipo esperado
    }

    return $normalized;
}
?>