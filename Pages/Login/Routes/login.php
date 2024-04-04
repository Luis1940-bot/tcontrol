<?php
mb_internal_encoding('UTF-8');
function consultar($planta, $email, $password) {
  try {
    $dbname = 'mc' . $planta . '000';
    $host = '190.228.29.59';
    $port = 3306;
    $user = 'fmc_oper2023';
    $pass="0uC6jos0bnC8";
    $cnn = new PDO("mysql:host={$host};dbname={$dbname};port={$port};charset=utf8",$user,$pass);
    $hash=hash('ripemd160',$password);
    $sql="SELECT nombre, idusuario, mail, idtipousuario, firma, qcodusuario, area, mi_cfg, activo FROM usuarios 
        WHERE mail=? and pass=?;";
    $activo = 's';
    $query = $cnn->prepare($sql);
    $query->bindParam(1, $email, PDO::PARAM_STR);
    $query->bindParam(2, $hash, PDO::PARAM_STR);
  
    $query->execute();
    // $data = $query->fetchAll();
    $data = $query->fetch(PDO::FETCH_ASSOC); 
    if ($data) {
    // Almacena los datos en una variable para enviar como respuesta JSON
        $response = array(
        'nombre' => $data['nombre'],
        'idusuario' => $data['idusuario'],
        'mail' => $data['mail'],
        'idtipousuario' => $data['idtipousuario'],
        'qcodusuario' => $data['qcodusuario'],
        'username' => $data['nombre'],
        'area' => $data['area'],
        'mi_cfg' => $data['mi_cfg'],
        'activo' => $data['activo'],
        );
      // Establece las variables de sesión si es necesario
      $_SESSION['login_sso']['mail'] = $data['mail'];
      $_SESSION['login_sso']['idusuario'] = $data['idusuario'];
      $_SESSION['login_sso']['nombre'] = $data['nombre'];
      $_SESSION['login_sso']['idtipousuario'] = $data['idtipousuario'];
      $_SESSION['login_sso']['qcodusuario'] = $data['qcodusuario'];
      $_SESSION['login_sso']['username'] = $data['nombre'];
      $_SESSION['login_sso']['area'] = $data['area'];
      $_SESSION['login_sso']['mi_cfg'] = $data['mi_cfg'];
      // $_SESSION['factum_validation']['ticket_email'] = $email; 
      $_SESSION['factum_validation']['plant'] = $planta;
      header('Content-Type: application/json');
        $json = json_encode($response);
        echo $json;
        return $json;
        }else{
            echo json_encode('Uno o más datos son erroneos, vuela a intentarlo.');
            return $data;
        }
        
        $query->closeCursor();
        $pdo=null;
  } catch (\Throwable $e) {
    print "Error!: ".$e->getMessage()."<br>";
      die();
  }
}


header("Content-Type: application/json; charset=utf-8");
$datos = file_get_contents("php://input");
// $datos = '{"planta":"1","email":"luisglogista@gmail.com","pass":"4488","ruta":"/login"}';

// if(isset($_POST['datos'])) {
//    $data = json_decode($_POST['datos'], true);
// } 

if (empty($datos)) {
    $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
    echo json_encode($response);
    exit;
}

$data = json_decode($datos, true);

error_log('JSON response: ' . json_encode($data));

if ($data !== null) {
  // Accede a los valores
  $planta = $data['planta'];
  $email = $data['email'];
  $password = $data['password'];
  consultar($planta, $email, $password);
} else {
  echo "Error al decodificar la cadena JSON";
}
?>