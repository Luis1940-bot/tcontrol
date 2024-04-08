<?php
mb_internal_encoding('UTF-8');
// if (!isset($_SESSION['login_sso']['email'] )) {
//     unset($_SESSION['login_sso']['email'] ); 
// }

function consultar($call, $desde, $hasta, $operation)
{
     include_once $_SERVER['DOCUMENT_ROOT']."/Routes/datos_base.php";
    // include_once '../../../Routes/datos_base.php';
    // $pdo = new PDO("mysql:host={$host};dbname={$dbname};port={$port};chartset={$charset}",$user,$password);

    try {
        // Llamada al procedimiento almacenado con parámetros
        $sql = "CALL ".$call."('".$desde."', '".$hasta."')";
        if ($desde === null || $hasta === null) {
          $sql = "CALL ".$call."()";
        }
        $con = mysqli_connect($host,$user,$password,$dbname);
            if (!$con) {
                // die('Could not connect: ' . mysqli_error($con));
            };
            
            mysqli_query ($con,"SET NAMES 'utf8'");
            mysqli_select_db($con,$dbname);

            $result = mysqli_query($con,$sql);
            $arr_customers = array();
            $arrayResultdo = array();
            $column_names = array();
            while ($column = mysqli_fetch_field($result)) {
                $column_names[] = $column->name;
            }
            $arr_customers[] = $column_names;

            while ($row = mysqli_fetch_assoc($result)) {
                $arr_customers[] = array_values($row);
            }
    
          // echo "Antes de la inclusión: " . json_encode($arr_customers) . PHP_EOL;
            if ($operation !== null && count($arr_customers) > 1) {
              switch ($operation) {
                case 'sum':
                  include('sumaSimple.php');
                  break;
                case 'DWT':
                  include('sumaDWT.php');
                  break;
                case 'DWTFritas':
                  include('sumaDWTFritas.php');
                  break;

                default:
                  
                  break;
              }
              $arrayResultdo = sumaSimple($arr_customers);
            }
            if ($operation === NULL) {
                  $arrayResultdo = $arr_customers;
             }
            // echo "Después de la inclusión: " . json_encode($arrayResultdo) . PHP_EOL;
            $json = json_encode($arrayResultdo);
            echo $json;
            mysqli_close($con);
            // $pdo=null;
    } catch (\PDOException $e) {
       print "Error!: ".$e->getMessage()."<br>";
      die();
    }
}

header("Content-Type: application/json; charset=utf-8");
$datos = file_get_contents("php://input");
// $datos = '{"q":"proc_DWTFritasL1","desde":"2024-01-01","hasta":"2024-01-03","operation":"DWTFritas"}';
// $datos = '{"q":"proc_TnEspecialidades","desde":"2024-01-01","hasta":"2024-01-03","operation": null}';
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
      $operation = $data['operation'];
      consultar($q, $desde, $hasta, $operation);
    } else {
      echo "Error al decodificar la cadena JSON";
    }

?>
