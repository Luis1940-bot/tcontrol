<?php
$plant = "1"; //$_SESSION['login_sso']['plant'];

  // header("Content-Type: text/html;charset=utf-8");
  $host = "34.174.211.66"; //"68.178.195.199"; 
  $user = "uumwldufguaxi"; //"developers";
  $password = "5lvvumrslp0v"; //"6vLB#Q0bOVo4";
  $number = "";
  $desired_length = 4;
  while(strlen($number) + strlen($plant) < $desired_length) {
      $number .= "0"; // Agregar un cero a la cadena
  }
  $dbname = "db5i8ff3wrjzw3"; //"tc" . $plant . $number;
  $conexion = null;
  $port = 3306;
  $charset = "utf-8";

?>