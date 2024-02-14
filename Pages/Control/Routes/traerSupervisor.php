<?php
header("Content-Type: text/html;charset=utf-8");
session_start();
  if (!isset($_SESSION['factum_validation']['email'] )) {
      unset($_SESSION['factum_validation']['email'] ); 
  }

$q=$_GET['q'];
$new=$_GET['new'];

verifica();

function verifica(){
  global $q;
  $idSupervisor=urldecode($q);

  include_once '../../../Routes/datos_base.php';
  $pdo = new PDO("mysql:host={$host};dbname={$dbname};port={$port};chartset={$charset}",$user,$password);
  try {

    $sql="SELECT u.idusuario, u.nombre, u.mail, u.idtipousuario, u.mi_cfg  FROM usuarios u WHERE u.idusuario=?";
    $query = $pdo->prepare($sql);
    $query->bindParam(1, $idSupervisor, PDO::PARAM_STR);
    $query->execute();
    $data = $query->fetchAll();
    // echo count($data).'<br>';
     if(count($data)!==0){          
            $response = array(
              'id' => $data[0]['idusuario'], 
              'nombre' =>  $data[0]['nombre'], 
              'mail' => $data[0]['mail'], 
              'tipo' =>  $data[0]['idtipousuario'], 
              'mi_cfg' => $data[0]['mi_cfg'],
            );
           
            echo json_encode($response);
            return $response;
        }else{

            $errorResponse = array('error' => 'Uno o más datos son incorrectos, vuelve a intentarlo.');
            echo json_encode($errorResponse);
            return $errorResponse;

        }
    
  } catch (\PDOException $e) {
            $errorResponse = array('error' => 'Error!: ' . $e->getMessage());
            echo json_encode($errorResponse);
            return $errorResponse;
  }

}



?>