<?php


function paradaPorManteniemiento($cantidadDeFilas, $indice, $originalArr) {
  try {
    $arrayResultado = array();
    $arrayFila = array();
    $arrayUbicacionTecnica = array();
    $arrayEquipo = array();
    $arrayComponente = array();

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
    for ($i=$indice; $i < $indice + $cantidadDeFilas - 1; $i++) { 
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
   echo $originalArr[$i][6]."\n";
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
        // array_shift($arr_customers);
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
                if (strtolower($con) === 'parada_por_mantenimiento') {
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
    // $arr_customers = $_POST['arr_customers'];
    $arr_customers = [["FECHA","DOC","REPORTE","VALOR","-","USUARIO","CONTROL"],["2024-01-02","240102213749104","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","subt","6","MARCELO GABRIEL MOULIA CAP SAINT JEAN","Parada por MANTENIMIENTO"],["2024-01-02","240102213749104","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","MEC\u00c1NICO","7","MARCELO GABRIEL MOULIA CAP SAINT JEAN","Tipo de MANTENIMIENTO"],["2024-01-02","240102213749104","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","15:00","8","MARCELO GABRIEL MOULIA CAP SAINT JEAN","inicio de parada"],["2024-01-02","240102213749104","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","15:00","9","MARCELO GABRIEL MOULIA CAP SAINT JEAN","fin de parada"],["2024-01-02","240102213749104","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","BLC FRITAS L1 FREIDORA","0","MARCELO GABRIEL MOULIA CAP SAINT JEAN","ubicaci\u00f3n t\u00e9cnica"],["2024-01-02","240102213749104","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","126-005_FRYER CIRCULATING PUMP","1","MARCELO GABRIEL MOULIA CAP SAINT JEAN","denominaci\u00f3n de equipo"],["2024-01-02","240102213749104","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","subt","3","MARCELO GABRIEL MOULIA CAP SAINT JEAN","impacto en la l\u00ednea"],["2024-01-02","240102213749104","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","1","5","MARCELO GABRIEL MOULIA CAP SAINT JEAN","parada total"],["2024-01-02","240103011549383","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","subt","6","MARIA ELVIRA CUCULICH","Parada por MANTENIMIENTO"],["2024-01-02","240103011549383","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","MEC\u00c1NICO","7","MARIA ELVIRA CUCULICH","Tipo de MANTENIMIENTO"],["2024-01-02","240103011549383","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","22:00","8","MARIA ELVIRA CUCULICH","inicio de parada"],["2024-01-02","240103011549383","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","22:00","9","MARIA ELVIRA CUCULICH","fin de parada"],["2024-01-02","240103011549383","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","BLC FRITAS L#1 FREIDORA","0","MARIA ELVIRA CUCULICH","ubicaci\u00f3n t\u00e9cnica"],["2024-01-02","240103011549383","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","126-005_FRYER CIRCULATING PUMP","1","MARIA ELVIRA CUCULICH","denominaci\u00f3n de equipo"],["2024-01-02","240103011549383","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","CA\u00d1O","2","MARIA ELVIRA CUCULICH","componente"],["2024-01-02","240103011549383","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","subt","3","MARIA ELVIRA CUCULICH","impacto en la l\u00ednea"],["2024-01-02","240103011549383","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","1","5","MARIA ELVIRA CUCULICH","parada total"],["2024-01-03","240103054535147","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","subt","6","MARIA ELVIRA CUCULICH","Parada por MANTENIMIENTO"],["2024-01-03","240103054535147","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","MEC\u00c1NICO","7","MARIA ELVIRA CUCULICH","Tipo de MANTENIMIENTO"],["2024-01-03","240103054535147","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","00:00","8","MARIA ELVIRA CUCULICH","inicio de parada"],["2024-01-03","240103054535147","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","00:00","9","MARIA ELVIRA CUCULICH","fin de parada"],["2024-01-03","240103054535147","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","126-005_FRYER CIRCULATING PUMP","1","MARIA ELVIRA CUCULICH","denominaci\u00f3n de equipo"],["2024-01-03","240103054535147","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","CA\u00d1O","2","MARIA ELVIRA CUCULICH","componente"],["2024-01-03","240103054535147","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","subt","3","MARIA ELVIRA CUCULICH","impacto en la l\u00ednea"],["2024-01-03","240103054535147","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","1","5","MARIA ELVIRA CUCULICH","parada total"],["2024-01-03","240103122404837","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","subt","6","CLAUDIA CACERES","Parada por MANTENIMIENTO"],["2024-01-03","240103122404837","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","MEC\u00c1NICO","7","CLAUDIA CACERES","Tipo de MANTENIMIENTO"],["2024-01-03","240103122404837","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","12:00","8","CLAUDIA CACERES","inicio de parada"],["2024-01-03","240103122404837","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","12:00","9","CLAUDIA CACERES","fin de parada"],["2024-01-03","240103122404837","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","126-005_FRYER CIRCULATING PUMP","1","CLAUDIA CACERES","denominaci\u00f3n de equipo"],["2024-01-03","240103122404837","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","subt","3","CLAUDIA CACERES","impacto en la l\u00ednea"],["2024-01-03","240103122404837","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","1","5","CLAUDIA CACERES","parada total"],["2024-01-03","240103175049006","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","subt","6","MARIA BEATRIZ FOLINI","Parada por MANTENIMIENTO"],["2024-01-03","240103175049006","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","MEC\u00c1NICO","7","MARIA BEATRIZ FOLINI","Tipo de MANTENIMIENTO"],["2024-01-03","240103175049006","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","14:15","8","MARIA BEATRIZ FOLINI","inicio de parada"],["2024-01-03","240103175049006","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","14:15","9","MARIA BEATRIZ FOLINI","fin de parada"],["2024-01-03","240103175049006","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","BLC FRITAS L#1 FREEZER","0","MARIA BEATRIZ FOLINI","ubicaci\u00f3n t\u00e9cnica"],["2024-01-03","240103175049006","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","128-019_Precool Belt Dryer No.1","1","MARIA BEATRIZ FOLINI","denominaci\u00f3n de equipo"],["2024-01-03","240103175049006","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","subt","3","MARIA BEATRIZ FOLINI","impacto en la l\u00ednea"],["2024-01-03","240103175049006","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","1","5","MARIA BEATRIZ FOLINI","parada total"],["2024-01-03","240103175151981","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","subt","6","MARIA BEATRIZ FOLINI","Parada por MANTENIMIENTO"],["2024-01-03","240103175151981","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","MEC\u00c1NICO","7","MARIA BEATRIZ FOLINI","Tipo de MANTENIMIENTO"],["2024-01-03","240103175151981","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","14:40","8","MARIA BEATRIZ FOLINI","inicio de parada"],["2024-01-03","240103175151981","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","14:40","9","MARIA BEATRIZ FOLINI","fin de parada"],["2024-01-03","240103175151981","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","BLC FRITAS L#1 FREEZER","0","MARIA BEATRIZ FOLINI","ubicaci\u00f3n t\u00e9cnica"],["2024-01-03","240103175151981","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","128-001_Precool Fan No.1","1","MARIA BEATRIZ FOLINI","denominaci\u00f3n de equipo"],["2024-01-03","240103175151981","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","subt","3","MARIA BEATRIZ FOLINI","impacto en la l\u00ednea"],["2024-01-03","240103175151981","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","1","5","MARIA BEATRIZ FOLINI","parada total"],["2024-01-03","240103181735113","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","subt","6","MARIA BEATRIZ FOLINI","Parada por MANTENIMIENTO"],["2024-01-03","240103181735113","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","EL\u00c9CTRICO","7","MARIA BEATRIZ FOLINI","Tipo de MANTENIMIENTO"],["2024-01-03","240103181735113","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","16:00","8","MARIA BEATRIZ FOLINI","inicio de parada"],["2024-01-03","240103181735113","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","16:35","9","MARIA BEATRIZ FOLINI","fin de parada"],["2024-01-03","240103181735113","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","BLC FRITAS L#1 SAPP","0","MARIA BEATRIZ FOLINI","ubicaci\u00f3n t\u00e9cnica"],["2024-01-03","240103181735113","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","SAPP-TANK","1","MARIA BEATRIZ FOLINI","denominaci\u00f3n de equipo"],["2024-01-03","240103181735113","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","subt","3","MARIA BEATRIZ FOLINI","impacto en la l\u00ednea"],["2024-01-03","240103181735113","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","1","5","MARIA BEATRIZ FOLINI","parada total"],["2024-01-03","240103182029468","DWT FRITAS L1 NO PLANEADO PRODUCCI\u00d3N PROCESO","subt","6","MARIA BEATRIZ FOLINI","Parada por BUENAS PR\u00c1CTICAS DE MANUFACTURA"],["2024-01-03","240103182029468","DWT FRITAS L1 NO PLANEADO PRODUCCI\u00d3N PROCESO","18:19","7","MARIA BEATRIZ FOLINI","inicio de parada"],["2024-01-03","240103182029468","DWT FRITAS L1 NO PLANEADO PRODUCCI\u00d3N PROCESO","18:19","8","MARIA BEATRIZ FOLINI","fin de parada"],["2024-01-03","240103182029468","DWT FRITAS L1 NO PLANEADO PRODUCCI\u00d3N PROCESO","subt","0","MARIA BEATRIZ FOLINI","Parada por FALTA DE MATERIA PRIMA"],["2024-01-03","240103182029468","DWT FRITAS L1 NO PLANEADO PRODUCCI\u00d3N PROCESO","18:19","1","MARIA BEATRIZ FOLINI","inicio de parada"],["2024-01-03","240103182029468","DWT FRITAS L1 NO PLANEADO PRODUCCI\u00d3N PROCESO","18:19","2","MARIA BEATRIZ FOLINI","fin de parada"],["2024-01-03","240103182029468","DWT FRITAS L1 NO PLANEADO PRODUCCI\u00d3N PROCESO","subt","4","MARIA BEATRIZ FOLINI","Parada por FALLAS OPERATIVAS"],["2024-01-03","240103182029468","DWT FRITAS L1 NO PLANEADO PRODUCCI\u00d3N PROCESO","16:35","5","MARIA BEATRIZ FOLINI","inicio de parada"],["2024-01-03","240103182029468","DWT FRITAS L1 NO PLANEADO PRODUCCI\u00d3N PROCESO","17:00","6","MARIA BEATRIZ FOLINI","fin de parada"],["2024-01-03","240103182029468","DWT FRITAS L1 NO PLANEADO PRODUCCI\u00d3N PROCESO","BLC FRITAS L#1 FREEZER","7","MARIA BEATRIZ FOLINI","ubicaci\u00f3n t\u00e9cnica"],["2024-01-03","240103182029468","DWT FRITAS L1 NO PLANEADO PRODUCCI\u00d3N PROCESO","subt","8","MARIA BEATRIZ FOLINI","Parada por BOMBA DE CORTE TRABADA"],["2024-01-03","240103182029468","DWT FRITAS L1 NO PLANEADO PRODUCCI\u00d3N PROCESO","18:19","9","MARIA BEATRIZ FOLINI","inicio de parada"],["2024-01-03","240103182029468","DWT FRITAS L1 NO PLANEADO PRODUCCI\u00d3N PROCESO","18:19","0","MARIA BEATRIZ FOLINI","fin de parada"],["2024-01-03","240103182029468","DWT FRITAS L1 NO PLANEADO PRODUCCI\u00d3N PROCESO","subt","2","MARIA BEATRIZ FOLINI","Parada por MANEJO DE LR"],["2024-01-03","240103182029468","DWT FRITAS L1 NO PLANEADO PRODUCCI\u00d3N PROCESO","18:19","3","MARIA BEATRIZ FOLINI","inicio de parada"],["2024-01-03","240103182029468","DWT FRITAS L1 NO PLANEADO PRODUCCI\u00d3N PROCESO","18:19","4","MARIA BEATRIZ FOLINI","fin de parada"],["2024-01-03","240103182029468","DWT FRITAS L1 NO PLANEADO PRODUCCI\u00d3N PROCESO","subt","4","MARIA BEATRIZ FOLINI","Parada por CINTA TEGRA"],["2024-01-03","240103182029468","DWT FRITAS L1 NO PLANEADO PRODUCCI\u00d3N PROCESO","18:19","5","MARIA BEATRIZ FOLINI","inicio de parada"],["2024-01-03","240103182029468","DWT FRITAS L1 NO PLANEADO PRODUCCI\u00d3N PROCESO","18:19","6","MARIA BEATRIZ FOLINI","fin de parada"],["2024-01-03","240103182029468","DWT FRITAS L1 NO PLANEADO PRODUCCI\u00d3N PROCESO","subt","8","MARIA BEATRIZ FOLINI","IMPACTO EN LA L\u00cdNEA"],["2024-01-03","240103182029468","DWT FRITAS L1 NO PLANEADO PRODUCCI\u00d3N PROCESO","1","0","MARIA BEATRIZ FOLINI","parada total"],["2024-01-03","240103184943891","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","subt","6","MARIA BEATRIZ FOLINI","Parada por MANTENIMIENTO"],["2024-01-03","240103184943891","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","MEC\u00c1NICO","7","MARIA BEATRIZ FOLINI","Tipo de MANTENIMIENTO"],["2024-01-03","240103184943891","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","18:05","8","MARIA BEATRIZ FOLINI","inicio de parada"],["2024-01-03","240103184943891","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","18:35","9","MARIA BEATRIZ FOLINI","fin de parada"],["2024-01-03","240103184943891","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","BLC FRITAS L#1 PELAD Y EVENFLOW","0","MARIA BEATRIZ FOLINI","ubicaci\u00f3n t\u00e9cnica"],["2024-01-03","240103184943891","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","2 VANMARK","1","MARIA BEATRIZ FOLINI","denominaci\u00f3n de equipo"],["2024-01-03","240103184943891","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","subt","3","MARIA BEATRIZ FOLINI","impacto en la l\u00ednea"],["2024-01-03","240103184943891","DWT FRITAS L1 NO PLANEADO MANTENIMIENTO","1","4","MARIA BEATRIZ FOLINI","baja en la velocidad"]];
    

    $result = sumaSimple($arr_customers);
    echo json_encode($result);
}
?>