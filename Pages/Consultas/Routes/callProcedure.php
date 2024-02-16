<?php
header("Content-Type: text/html;charset=utf-8");
session_start();
if (!isset($_SESSION['factum_validation']['email'])) {
    unset($_SESSION['factum_validation']['email']);
}

$q = $_GET['q'];
$new = $_GET['new'];

verifica();

function verifica()
{
    global $q;

    include_once '../../../Routes/datos_base.php';
    $pdo = new PDO("mysql:host={$host};dbname={$dbname};port={$port};chartset={$charset}",$user,$password);

    $call = urldecode($q);

    try {
        // Llamada al procedimiento almacenado con parámetros
        $sql = "CALL ".$call."('2024-01-01', '2024-02-16')";
        $con = mysqli_connect($host,$user,$password,$dbname);
            if (!$con) {
                // die('Could not connect: ' . mysqli_error($con));
            };
            
            mysqli_query ($con,"SET NAMES 'utf8'");
            mysqli_select_db($con,$dbname);

            $result = mysqli_query($con,$sql);
            $arr_customers = array();
            $column_names = array();
            while ($column = mysqli_fetch_field($result)) {
                $column_names[] = $column->name;
            }
            $arr_customers[] = $column_names;

            while ($row = mysqli_fetch_assoc($result)) {
                $arr_customers[] = array_values($row);
            }

            $json = json_encode($arr_customers);
            echo $json;
            mysqli_close($con);
            $pdo=null;
    } catch (\PDOException $e) {
       print "Error!: ".$e->getMessage()."<br>";
      die();
    }
}
?>
