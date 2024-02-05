<?php
header("Content-Type: text/html;charset=utf-8");
$nux=$_POST['nux'];
// $nux = '231206215202113';
eliminaNuxPedido($nux);

function eliminaNuxPedido($nux){
      $decodificado =urldecode($nux);
      $numFilasDeleteadas = 0;
      include_once '../../../Routes/datos_base.php';
      $pdo = new PDO("mysql:host={$host};dbname={$dbname};port={$port};chartset={$chartset}",$user,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
      $sql="DELETE FROM LTYregistrocontrol WHERE nuxpedido = ?";
      $pdo->beginTransaction();
      $sentencia = $pdo->prepare($sql);
      $sentencia->execute([$decodificado]);    
      $numFilasDeleteadas = $sentencia->rowCount();
      // echo $numFilasDeleteadas.'<br>';
       $pdo->commit(); 
      return $numFilasDeleteadas;
      

}
?>