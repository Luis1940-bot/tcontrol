<?php
require_once dirname(dirname(dirname(__DIR__))) . '/ErrorLogger.php';
ErrorLogger::initialize(dirname(dirname(dirname(__DIR__))) . '/logs/error.log');
if (isset($_SESSION['timezone'])) {
    date_default_timezone_set($_SESSION['timezone']);
} else {
    date_default_timezone_set('America/Argentina/Buenos_Aires');
}
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
           error_log("Error al eliminar nux: " . $nux);
          // Manejar errores de PDO aquí si es necesario
          $pdo->rollBack();
          die("Error en la ejecución de la consulta: " . $e->getMessage());
      } finally {
          $result['numFilasDeleteadas'] = $numFilasDeleteadas;
      }
      return $result;
      

}



if (isset($_POST['elimina']) && $_POST['elimina'] === true) {
    // Si es así, realiza las operaciones deseadas

    header("Content-Type: text/html;charset=utf-8");

    if (isset($nux) && is_string($nux)) {
        eliminaNuxPedido($nux, $pdo);
    }
}
?>