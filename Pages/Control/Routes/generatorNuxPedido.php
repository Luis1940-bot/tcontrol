<?php
header("Content-Type: text/html;charset=utf-8");
require_once dirname(dirname(dirname(__DIR__))) . '/ErrorLogger.php';
ErrorLogger::initialize(dirname(dirname(dirname(__DIR__))) . '/logs/error.log');
if (isset($_SESSION['timezone'])) {
    date_default_timezone_set($_SESSION['timezone']);
} else {
    date_default_timezone_set('America/Argentina/Buenos_Aires');
}

function generaNuxPedido(){
  
    try {
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
    } catch (\Throwable $e) {
       error_log("Error al generar nuxpedido. Error: " . $e);
    }
      

}
?>