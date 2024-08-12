<?php
mb_internal_encoding('UTF-8');
require_once dirname(dirname(dirname(__DIR__))) . '/ErrorLogger.php';
ErrorLogger::initialize(dirname(dirname(dirname(__DIR__))) . '/logs/error.log');
if (isset($_SESSION['timezone'])) {
    date_default_timezone_set($_SESSION['timezone']);
} else {
    date_default_timezone_set('America/Argentina/Buenos_Aires');
}

function verificarEmail($objeto, $cliente) {
   try {
     include_once BASE_DIR . "/Routes/datos_base.php";
    // $host = "68.178.195.199"; 
    // $user = "developers";
    // $password = "6vLB#Q0bOVo4";
    // $dbname = "tc1000";
    // $port = 3306;
    // $charset = "utf-8";

    $conn = new mysqli($host, $user, $password, $dbname, $port);
    if ($conn->connect_error) {
        die("Conexión fallida: " . $conn->connect_error);
    }

    if (!$conn->set_charset("utf8mb4")) {
        printf("Error al cargar el conjunto de caracteres utf8mb4: %s\n", $conn->error);
        exit();
    }
    $mail = $objeto['email1'];
    $pass = $objeto['pass1'];
    $hash=hash('ripemd160',$pass);
      
        
    $sql = "SELECT idusuario, nombre FROM usuario WHERE mail = ? AND idLTYcliente = ? AND verificador = ?";
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        die("Error al preparar la consulta: " . $conn->error);
    }
    $verificador = 1;


    $stmt->bind_param("sii", $mail, $cliente, $verificador);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0 ) {
      $user = $result->fetch_assoc();
      $idusuario = $user['idusuario'];
      $nombre = $user['nombre'];

      $cod_verificador = bin2hex(random_bytes(16)); 
      // Preparar la consulta UPDATE
      $updateSql = "UPDATE usuario SET cod_verificador = ?, verificador = ?, pass = ? WHERE idusuario = ?";
      $updateStmt = $conn->prepare($updateSql);
      if ($updateStmt === false) {
          die("Error al preparar la consulta de actualización: " . $conn->error);
      }
      $newVerificador = 0; // Nuevo valor para verificador
      
      $updateStmt->bind_param("sisi", $cod_verificador, $newVerificador, $hash, $idusuario);
      $updateStmt->execute();

      if ($updateStmt->affected_rows > 0) {
          $response = array('success' => true, 'v' => $cod_verificador, 'id' => $idusuario, 'nombre' => $nombre, 'email' => $mail);
      } else {
          $response = array('success' => false, 'message' => 'No se pudo actualizar el usuario.');
      }

      $updateStmt->close();
      $stmt->close();
      $conn->close();

      header('Content-Type: application/json');
      echo json_encode($response);
        
    } else {
        $response = array('success' => false, 'message' => 'No se encontró el usuario.');
        $stmt->close();
        $conn->close();
        header('Content-Type: application/json');
        echo  json_encode($response);
    }
   } catch (\Throwable $e) {
     error_log("Error al confirmar el email.");
    print "Error!: ".$e->getMessage()."<br>";
            die();
   }
}

header("Content-Type: application/json; charset=utf-8");
require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
$datos = file_get_contents("php://input");
// $datos = '{"q":{"email1":"luisfactum@gmail.com","email2":"luisfactum@gmail.com","pass1":"4488","pass2":"4488"},"ruta":"/confirmaEmail","sql_i":1,"rax":"&new=Thu Jun 27 2024 08:05:24 GMT-0300 (hora estándar de Argentina)"}';




if (empty($datos)) {
  $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
  echo json_encode($response);
  exit;
}
$data = json_decode($datos, true);
error_log('Pages/RecoveryPass/Routes/confirmaEmail-JSON response: ' . json_encode($data));

if ($data !== null) {
  $objeto = $data['q'];
  $plant = $data['sql_i'];
  verificarEmail($objeto, $plant);
} else {
  echo "Error al decodificar la cadena JSON";
}

?>
