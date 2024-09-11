<?php
require_once dirname(dirname(dirname(__DIR__))) . '/ErrorLogger.php';
ErrorLogger::initialize(dirname(dirname(dirname(__DIR__))) . '/logs/error.log');
if (isset($_SESSION['timezone'])) {
    date_default_timezone_set($_SESSION['timezone']);
} else {
    date_default_timezone_set('America/Argentina/Buenos_Aires');
}

function eliminaNuxPedido($nux, $sql_i){
      $numFilasDeleteadas = 0;
        include_once BASE_DIR . "/Routes/datos_base.php";
      // include_once $_SERVER['DOCUMENT_ROOT']."/Routes/datos_base.php";
      $pdo = new PDO("mysql:host={$host};dbname={$dbname};port={$port};chartset={$charset}",$user,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
      $sql="DELETE FROM LTYregistrocontrol WHERE nuxpedido = ?";
      try {
        $pdo->beginTransaction();
        $sentencia = $pdo->prepare($sql);
        $sentencia->execute([$nux]);    
        $numFilasDeleteadas = $sentencia->rowCount();
        $pdo->commit(); 
      } catch (PDOException $e) {
           error_log("Error al eliminar: " . $nux);
          $pdo->rollBack();
          $response = array('success' => false, 'message' => 'Algo salió mal no hay registros eliminados');
          echo json_encode($response);
          die("Error en la ejecución de la consulta: " . $e->getMessage());
      } finally {
         $response = array('success' => true, 'message' => 'La operación fue exitosa con la eliminación del registro', 'registros' => $numFilasDeleteadas, 'documento' => $nux);
          echo json_encode($response);
      }
}

  header("Content-Type: application/json; charset=utf-8");
  require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
  $datos = file_get_contents("php://input");
  // $datos = '{"q":240327134607826,"ruta":"/ex2024","rax":"&new=Mon Apr 08 2024 07:10:03 GMT-0300 (hora estándar de Argentina)","sql_i":null}';
  // echo $datos;

  if (empty($datos)) {
    $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
    echo json_encode($response);
    exit;
  }
  $data = json_decode($datos, true, 512, JSON_BIGINT_AS_STRING);

  // error_log('Pages/ControlViews/Routes/eliminaRegistr-JSON response: ' . json_encode($data));

  if ($data !== null) {
    $nux = $data['q'];
    $sql_i = $data['sql_i'];
    
  if (isset($nux) && is_string($nux)) {
      eliminaNuxPedido($nux, $sql_i);
  }
  } else {
    echo "Error al decodificar la cadena JSON";
     error_log('Pages/ControlViews/Routes/eliminaRegistr-JSON response: ' . json_encode($data));
  }

?>