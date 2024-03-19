<?php
mb_internal_encoding('UTF-8');

function consultar($call, $desde, $hasta)
{

    include_once '../../Routes/datos_base.php';
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
    
            // echo "Después de la inclusión: " . json_encode($arrayResultdo) . PHP_EOL;
            $json = json_encode($arr_customers);
            echo $json;
            mysqli_close($con);
            // $pdo=null;
    } catch (\PDOException $e) {
       print "Error!: ".$e->getMessage()."<br>";
      die();
    }
}

header("Content-Type: application/json; charset=utf-8");
session_start();

if (!isset($_SESSION['factum_validation'])) {

}
$http_host = $_SERVER['HTTP_HOST'];
$url = htmlentities($_SERVER["HTTP_HOST"] . $_SERVER["REQUEST_URI"], ENT_QUOTES, 'UTF-8');
$read_url = explode('/', $url);
$url_parts = parse_url($url);

if (empty($read_url)) {
    $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
    echo json_encode($response);
    exit;
}
$largo = sizeof($read_url);
$last_part = end($read_url);
if (substr($last_part, -1) === '*') {
    $desdeI = null;
    $hastaI = null;
    $url_sin_ultimo_caracter = substr($url, 0, -1);
    $posicion_ultima_barra = strrpos($url_sin_ultimo_caracter, '/');
    $q = substr($url_sin_ultimo_caracter, $posicion_ultima_barra + 1);
} else {
  $q = trim($read_url[$largo - 3]);
  if (empty($q)) {
      $response = array('success' => false, 'message' => 'Falta el Call.');
      echo json_encode($response);
      exit;
  }
  $desdeI = trim($read_url[$largo - 2]);
  $hastaI = trim($read_url[$largo - 1]);
  if ($hastaI < $desdeI) {
    $response = array('success' => false, 'message' => 'La fecha HASTA es anterior a la fecha DESDE');
    echo json_encode($response);
    exit;
  } 
  //FORMAT VALIDATION 
  $alphaNumericPattern = '/^[0-9]{4}-[0-9]{2}-[0-9]{2}+$/';
  $inputInitial = preg_match($alphaNumericPattern, $desdeI);
  $inputHasta = preg_match($alphaNumericPattern, $hastaI);


  if (!$inputInitial or !$inputHasta) {
    $modifiedUrl = preg_replace('/\/\d{4}-\d{1,2}-\d{1,2}(\/|$)/', '/', $url);
    $modifiedUrl = preg_replace('/\/\d{4}-0?(\d{1,2})-0?(\d{1,2})(\/|$)/', '/', $modifiedUrl);
    $response = array('success' => false, 'message' => 'Fecha Formato invalido. El formato a utilizar es 1900-01-01, no olvide completar ambas fechas separasdas por / y controle la url '.$modifiedUrl.'/1900-01-01/1900-01-02');
    echo json_encode($response);
    exit;
  }
}

consultar($q, $desdeI, $hastaI);

?>
