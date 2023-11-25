<?php
header("Content-Type: text/html;charset=utf-8");

function generaNuxPedido(){
  
    // Obtenemos la fecha y hora actual
      $fecha_actual = new DateTime();

      // Obtenemos los milisegundos actuales
      $microsegundos = microtime(true);

      // Convertimos los milisegundos a segundos y milisegundos
      $segundos = floor($microsegundos);
      $milisegundos = round(($microsegundos - $segundos) * 1000);

      // Formateamos la fecha y hora en el formato deseado
      $fecha_formateada = $fecha_actual->format('YmdHis') . '' . str_pad($milisegundos, 3, '0', STR_PAD_LEFT);

      // Mostramos la fecha formateada
      $largo=strlen($fecha_formateada);
      $fecha_formateada = substr($fecha_formateada, 2, $largo);
      return $fecha_formateada;
      

}
?>