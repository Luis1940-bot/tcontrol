<?php
mb_internal_encoding('UTF-8');
  if (!isset($_SESSION['login_sso']['email'] )) {
      unset($_SESSION['login_sso']['email'] ); 
  }

function consultar($query, $desde, $hasta) {
  // include_once '../../../Routes/datos_base.php';
   include_once $_SERVER['DOCUMENT_ROOT']."/Routes/datos_base.php";
  try {
        $con = mysqli_connect($host,$user,$password,$dbname);
        if (!$con) {
            // die('Could not connect: ' . mysqli_error($con));
        };
        
        mysqli_query ($con,"SET NAMES 'utf8'");
        mysqli_select_db($con,$dbname);
        include('querys.php');
        $sql = obtenerConsulta($query, $desde, $hasta);
        $data = json_decode($sql, true);
        $success = $data['success'];
        if ($success === false) {
           $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
           echo json_encode($response);
           die();
        }
        $result = mysqli_query($con, $sql);
        $arr_customers = array();

        while ($row = mysqli_fetch_assoc($result)) {
            $arr_customers[] = array_values($row);
        }

        $json = json_encode($arr_customers);
        echo $json;
        mysqli_close($con);
  } catch (\Throwable $e) {
     print "Error!: ".$e->getMessage()."<br>";
      die();
  }
}


header("Content-Type: application/json; charset=utf-8");
$datos = file_get_contents("php://input");
      // $q = 'estespecialidades';//$data['q'];
      // $desde = '2024-03-28';//$data['desde'];
      // $hasta = '2024-03-28';//$data['hasta'];
      // consultar($q, $desde, $hasta);

if (empty($datos)) {
    $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
    echo json_encode($response);
    exit;
}

    $data = json_decode($datos, true);
    error_log('JSON response: ' . json_encode($data));
    // Verifica si la decodificación fue exitosa
    if ($data !== null) {
      // Accede a los valores
      $q = $data['q'];
      $desde = $data['desde'];
      $hasta = $data['hasta'];
      consultar($q, $desde, $hasta);
    } else {
      echo "Error al decodificar la cadena JSON";
    }
?>