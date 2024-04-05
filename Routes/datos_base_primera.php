<?php
  $plant = '0';

  header("Content-Type: text/html;charset=utf-8");
  $host = "190.228.29.59"; 
  $user = "fmc_oper2023";
  $password = "0uC6jos0bnC8";
  $number = "";
  $desired_length = 4;
  while(strlen($number) + strlen($plant) < $desired_length) {
      $number .= "0"; // Agregar un cero a la cadena
  }
  $dbname = "mc" . $plant . $number;
  $conexion = null;
  $port = 3306;
  $charset = "utf-8";

?>