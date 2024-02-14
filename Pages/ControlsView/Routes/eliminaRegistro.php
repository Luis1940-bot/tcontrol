<?php
function eliminaNuxPedido($nux){
      $decodificado =urldecode($nux);
      $numFilasDeleteadas = 0;
      include_once '../../../Routes/datos_base.php';
      $pdo = new PDO("mysql:host={$host};dbname={$dbname};port={$port};chartset={$charset}",$user,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
      $sql="DELETE FROM LTYregistrocontrol WHERE nuxpedido = ?";
      try {
        $pdo->beginTransaction();
        $sentencia = $pdo->prepare($sql);
        $sentencia->execute([$decodificado]);    
        $numFilasDeleteadas = $sentencia->rowCount();
        $pdo->commit(); 
      } catch (PDOException $e) {
          $pdo->rollBack();
          $response = array('success' => false, 'message' => 'Algo salió mal no hay registros eliminados');
          echo json_encode($response);
          die("Error en la ejecución de la consulta: " . $e->getMessage());
      } finally {
         $response = array('success' => true, 'message' => 'La operación fue exitosa con la eliminación del registro', 'registros' => $numFilasDeleteadas, 'documento' => $decodificado);
          echo json_encode($response);
      }
}

header("Content-Type: application/json; charset=utf-8");
$nux = $_POST['nux'];
// $nux = '231209220259584';
if (isset($nux) && is_string($nux)) {
    eliminaNuxPedido($nux);
}

?>