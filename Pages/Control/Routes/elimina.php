<?php
function eliminaNuxPedido($nux, $pdo){
      $result = array(
            'numFilasDeleteadas' => 0
        );
      $decodificado =urldecode($nux);
      $numFilasDeleteadas = 0;
      $sql="DELETE FROM LTYregistrocontrol WHERE nuxpedido = ?";
      try {
        $pdo->beginTransaction();
        $sentencia = $pdo->prepare($sql);
        $sentencia->execute([$decodificado]);    
        $numFilasDeleteadas = $sentencia->rowCount();
        $pdo->commit(); 
      } catch (PDOException $e) {
          // Manejar errores de PDO aquí si es necesario
          $pdo->rollBack();
          die("Error en la ejecución de la consulta: " . $e->getMessage());
      } finally {
          $result['numFilasDeleteadas'] = $numFilasDeleteadas;
      }
      return $result;
      

}
if (basename(__FILE__) == basename($_SERVER['PHP_SELF'])) {
    // Si es así, realiza las operaciones deseadas

    header("Content-Type: text/html;charset=utf-8");
    $nux = $_POST['nux'];
    
    if (isset($nux) && is_string($nux)) {
        eliminaNuxPedido($nux, $pdo);
    }
}
?>