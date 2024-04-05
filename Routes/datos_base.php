<?php
  // // Verificar si el archivo session.php existe
  // $session_file = "../Pages/Session/session.php";
  // if (file_exists($session_file)) {
  //     // Obtener los datos de la sesión desde session.php
  //     $session_data = file_get_contents($session_file);
  //     preg_match('/\'plant\'\s*=>\s*\'([^\']+)\'/', $session_data, $matches);
  //     $plant = isset($matches[1]) ? $matches[1] : '1';
  // } else {
  //     // Si el archivo session.php no existe, asignar un valor predeterminado para $plant
  //     $plant = '0'; // O cualquier valor predeterminado que desees
  // }
 
// Iniciar sesión
session_start();

// Verificar si la sesión está establecida y si existe el índice 'login_sso' y 'plant'
if (isset($_SESSION['login_sso']['plant'])) {
    // Obtener el valor de 'plant'
    $plant = $_SESSION['login_sso']['plant'];
} else {
    $plant = '0';
}



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