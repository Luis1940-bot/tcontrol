<?php
  if (session_status() == PHP_SESSION_NONE) {
    session_start();
    }
    if (!isset($_SESSION['factum_validation'])) {
        include_once "./Pages/Session/session.php";
    }
  $jsonData = $_POST['data']; // El nombre del campo oculto en el formulario es 'data'
  
  if ($jsonData) {
    $decodedData = json_decode($jsonData); // Decodificar la cadena JSON
    
    if ($decodedData !== null) {
      echo json_encode($decodedData); // Volver a codificar los datos como respuesta JSON
    } else {
      echo 'Error al decodificar la cadena JSON.';
    }
  } else {
    echo 'No hay nada que mostrar.';
  }
?>