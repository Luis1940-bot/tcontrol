<?php
// header("Content-Type: text/html;charset=utf-8");
// session_start();
  // if (!isset($_SESSION['factum_validation']['email'] )) {
  //     unset($_SESSION['factum_validation']['email'] ); 
  // }
require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
require_once dirname(dirname(dirname(__DIR__))) . '/ErrorLogger.php';
ErrorLogger::initialize(dirname(dirname(dirname(__DIR__))) . '/logs/error.log');
if (isset($_SESSION['timezone'])) {
    date_default_timezone_set($_SESSION['timezone']);
} else {
    date_default_timezone_set('America/Argentina/Buenos_Aires');
}

function verifica($q, $sql_i){
  global $q;
  // $pass=urldecode($q);
  // $hash=hash('ripemd160',$pass);
 
  $decoded_q = base64_decode($q);
  $decoded_q = str_replace('"', '', $decoded_q);
  $decoded_q = trim($decoded_q);
  if ($decoded_q === false || is_null($decoded_q)) {
      $errorResponse = array('error' => 'Error en la desencriptacion de los datos.');
      echo json_encode($errorResponse);
      return $errorResponse;
  }

  $hash=hash('ripemd160',$decoded_q);

  include_once BASE_DIR . "/Routes/datos_base.php";
  // include_once $_SERVER['DOCUMENT_ROOT']."/Routes/datos_base.php";
  $pdo = new PDO("mysql:host={$host};dbname={$dbname};port={$port};chartset={$charset}",$user,$password);
  try {

    $sql="SELECT u.idusuario, u.nombre, u.mail, u.idtipousuario, u.mi_cfg  FROM usuario u WHERE u.pass=? AND u.idLTYcliente=?";
    $query = $pdo->prepare($sql);

    $query->bindParam(1, $hash, PDO::PARAM_STR);
    $query->bindParam(2, $sql_i, PDO::PARAM_INT);
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

            $errorResponse = array('error' => 'Uno o mas datos son incorrectos, vuelve a intentarlo.');
            echo json_encode($errorResponse);
            return $errorResponse;

        }
    
  } catch (\PDOException $e) {
             error_log("Error al verificar el supervisor. Error: " . $e);
            $errorResponse = array('error' => 'Error!: ' . $e->getMessage());
            echo json_encode($errorResponse);
            return $errorResponse;
  }

}

header("Content-Type: application/json; charset=utf-8");
$datos = file_get_contents("php://input");
// $datos = '{"q":"4488","ruta":"/traerFirma","rax":"&new=Thu Jul 11 2024 11:07:07 GMT-0300 (hora estándar de Argentina)","sql_i":15}';
// $datos = '{"q":"IjQ0ODgi","ruta":"/traerFirma","rax":"&new=Fri Sep 27 2024 12:24:09 GMT-0300 (hora estándar de Argentina)","sql_i":15}';

if (empty($datos)) {
  $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
  echo json_encode($response);
  exit;
}
$data = json_decode($datos, true);

// error_log('supervisores-JSON response: ' . json_encode($data));

if ($data !== null) {
  $q = $data['q'];
  $sql_i = $data['sql_i'];
  verifica($q, $sql_i);
} else {
  echo "Error al decodificar la cadena JSON";
}

?>