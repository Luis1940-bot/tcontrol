<?php


function paradaPorManteniemiento($cantidadDeFilas, $indice, $originalArr) {
  try {
    $arrayResultado = array();
    $arrayFila = array();
    $arrayUbicacionTecnica = array();
    $arrayEquipo = array();
    $arrayComponente = array();
    $arrayParadaTotal = array();
    $arrayBajaVelocidad= array();

    $inicioDeParada = '0:00';
    $finDeParada = '0:00';
    $minutos = '0';
    $fecha = $originalArr[$indice][0];
    $doc = $originalArr[$indice][1];
    $reporte = $originalArr[$indice][2];
    $usuario = $originalArr[$indice][5];
    $paradaPorMantenimiento = $originalArr[$indice][6];
    $tipodeMantenimiento = json_decode('"' . $originalArr[$indice + 1][6] . '"');// una fila +
    $tipo = json_decode('"' . $originalArr[$indice + 1][3] . '"');// una fila +
    $valorUbicacionTecnica = '';
    $nombreUbicacionTecnica = '';
    $valorEquipo = '';
    $nombreEquipo = '';
    $componente = '';
    $valorComponente = '';
    $nombreComponente = '';
    $nombreParadaTotal = '';
    $valorParadaTotal = '';
    $nombreBajaVelocidad = '';
    $valorBajaVelocidad = '';
    for ($i=$indice; $i < $indice + $cantidadDeFilas; $i++) { 
      $ini = preg_replace('/[^a-z0-9]+/i', '_', $originalArr[$i][6]);
      $fin = preg_replace('/[^a-z0-9]+/i', '_', $originalArr[$i][6]);
      if (strtolower($ini) === 'inicio_de_parada') {
        $inicioDeParada = $originalArr[$i][3];
      }
      if (strtolower($fin) === 'fin_de_parada') {
        $finDeParada = $originalArr[$i][3];
        if ($inicioDeParada != null && $finDeParada != null) {
          $dateTimeIni = DateTime::createFromFormat('H:i', $inicioDeParada);
          $dateTimeFin = DateTime::createFromFormat('H:i', $finDeParada);
          if ($dateTimeIni && $dateTimeFin) {
            if ($dateTimeFin < $dateTimeIni) {
                $dateTimeFin->modify('+1 day'); // Sumar 24 horas a la segunda hora
            }
            $diferencia = $dateTimeIni->diff($dateTimeFin);
            $minutos = $diferencia->h * 60 + $diferencia->i;
          }
        }
      }
  //  echo $originalArr[$i][6]."   ----- ".$i."\n";
      $ubicacionTecnica  = mb_substr($originalArr[$i][6], 0, 7);
      $ubicacionTecnica = preg_replace('/[^\p{L}0-9]+/u', '_', $ubicacionTecnica);
      if (mb_strtolower($ubicacionTecnica) === 'ubicaci') {
        $valorUbicacionTecnica = $originalArr[$i][3];
        $nombreUbicacionTecnica = ucfirst($originalArr[$i][6]);
      }

      $tipoEquipo = mb_substr($originalArr[$i][6], 0, 10);
      $tipoEquipo = preg_replace('/[^\p{L}0-9]+/u', '_', $tipoEquipo);
      // echo $originalArr[$i][6]."\n";
      // echo $tipoEquipo."\n";
      if (mb_strtolower($tipoEquipo) === 'denominaci') {
        $valorEquipo = $originalArr[$i][3];
        $nombreEquipo = ucfirst($originalArr[$i][6]);
      } 

      $componente  = mb_substr($originalArr[$i][6], 0, 7);
      $componente = preg_replace('/[^\p{L}0-9]+/u', '_', $componente);
      if (mb_strtolower($componente) === 'componente') {
        $valorComponente = $originalArr[$i][3];
        $nombreComponente = ucfirst($originalArr[$i][6]);
      }

      $paradaTotal = mb_substr($originalArr[$i][6], 0, 12);
      $paradaTotal = preg_replace('/[^\p{L}0-9]+/u', '_', $paradaTotal);
      if (mb_strtolower($paradaTotal) === 'parada_total') {
        $valorParadaTotal = 'Si';
        $nombreParadaTotal = ucfirst($originalArr[$i][6]);
      }

      $bajaVelocidad = $originalArr[$i][6];
      $bajaVelocidad = preg_replace('/[^\p{L}0-9]+/u', '_', $bajaVelocidad);
      if (mb_strtolower($bajaVelocidad) === 'baja_en_la_velocidad') {
        $valorBajaVelocidad = 'Si';
        $nombreBajaVelocidad = ucfirst($originalArr[$i][6]);
      }

    }

       $arrayFila = array(
                    $fecha,
                    $doc,
                    $reporte, 
                    $paradaPorMantenimiento,
                    $minutos,
                    $usuario,
                );
        array_push($arrayResultado, $arrayFila);

        $arrayTipo = array(
            '',
            '',
            '', 
            $tipodeMantenimiento,
            $tipo,
            '',
        );
        array_push($arrayResultado, $arrayTipo);


        $arrayUbicacionTecnica = array(
              '',
              '',
              '', 
              $nombreUbicacionTecnica,
              $valorUbicacionTecnica,
              '',
        );

        $nombreUbicacionTecnica !== '' ? array_push($arrayResultado, $arrayUbicacionTecnica): null;
        
        $arrayEquipo = array(
              '',
              '',
              '', 
              $nombreEquipo,
              $valorEquipo,
              '',
        );

        $nombreEquipo !== '' ? array_push($arrayResultado, $arrayEquipo): null;
          
        $arrayComponente = array(
              '',
              '',
              '', 
              $nombreComponente,
              $valorComponente,
              '',
        );
        
        $nombreComponente !== '' ? array_push($arrayResultado, $arrayComponente): null;

        $arrayParadaTotal = array(
              '',
              '',
              '', 
              $nombreParadaTotal,
              $valorParadaTotal,
              '',
        );
        
        $nombreParadaTotal !== '' ? array_push($arrayResultado, $arrayParadaTotal): null;
        
        $arrayBajaVelocidad = array(
              '',
              '',
              '', 
              $nombreBajaVelocidad,
              $valorBajaVelocidad,
              '',
        );
        
        $nombreBajaVelocidad !== '' ? array_push($arrayResultado, $arrayBajaVelocidad): null;


        return $arrayResultado;

  } catch (\Throwable $e) {
    print "Error!: " . $e->getMessage() . "<br>";
    die();
  }
}

function sumaSimple($arr_customers) {
  try {
        $arrayNuevo = array();
        $primerElemento = $arr_customers[0];
        array_pop($primerElemento);
        $docsUnicos = [];
        foreach ($arr_customers as $key => $row) {
          if ($key === 0) {
              // Ignora la primera fila que contiene encabezados
              continue;
          }
          $doc = $row[1];
          // Agrega el valor a $docsUnicos si no existe
          if (!in_array($doc, $docsUnicos)) {
              $docsUnicos[] = $doc;
          }
        }

        // Recorre el array principal para cada valor único de "DOC"
        foreach ($docsUnicos as $docUnico) {
            $filasDocUnico = array_filter($arr_customers, function ($row) use ($docUnico) {
              return $row[1] === $docUnico;
            });
             foreach ($filasDocUnico as $index => $fila) {
                $filas = count($filasDocUnico);
                $con = preg_replace('/[^a-z0-9]+/i', '_', $fila[6]);
                if (strtolower($con) === 'parada_por_mantenimiento' || strtolower($con) === 'tipos_de_mantenimiento') {
                  $originalArr = $arr_customers;
                  $nuevaFila = paradaPorManteniemiento($filas, $index, $originalArr);
                  if (is_array($nuevaFila)) {
                      $arrayNuevo = array_merge($arrayNuevo, $nuevaFila);
                      // echo json_encode($arrayNuevo );
                      //  array_unshift($arrayNuevo, $primerElemento);
                      // return $arrayNuevo;
                  }
                }
             }
        }
         array_unshift($arrayNuevo, $primerElemento);
        //  echo json_encode($arrayNuevo );
         return $arrayNuevo;
  } catch (\Throwable $e) {
    print "Error!: " . $e->getMessage() . "<br>";
    die();
  }
}

if (basename(__FILE__) == basename($_SERVER['PHP_SELF'])) {
    header("Content-Type: application/json; charset=utf-8");
    $primeraFila = true;
    $arr_customers = $_POST['arr_customers'];
    
    

    $result = sumaSimple($arr_customers);
    echo json_encode($result);
}
?>