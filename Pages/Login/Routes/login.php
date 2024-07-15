<?php
mb_internal_encoding('UTF-8');
require_once dirname(dirname(dirname(__DIR__))) . '/config.php';



function consultar($planta, $email, $pass) {
  try {
    include_once BASE_DIR."/Routes/datos_base_primera.php";
    $dbnameLogin = 'tc1000'; // . $planta . '000';
    // $host = '190.228.29.59';
    // $port = 3306;
    // $user = 'fmc_oper2023';
    // $password="0uC6jos0bnC8";
  
    $cnn = new PDO("mysql:host={$host};dbname={$dbnameLogin};port={$port};charset=utf8",$user,$password);
    $hash=hash('ripemd160',$pass);
    $sql="SELECT nombre, idusuario, mail, idtipousuario, firma, qcodusuario, area, mi_cfg, activo, verificador FROM usuario 
        WHERE mail=? and pass=? and idLTYcliente=?;";
    $activo = 's';
    $verificador = 1;
    $query = $cnn->prepare($sql);
    $query->bindParam(1, $email, PDO::PARAM_STR);
    $query->bindParam(2, $hash, PDO::PARAM_STR);
    $query->bindParam(3, $planta, PDO::PARAM_INT);

    $query->execute();
    // $data = $query->fetchAll();
    $data = $query->fetch(PDO::FETCH_ASSOC); 

    $query->closeCursor();
    $pdo=null;

    if ($data) {
    // Almacena los datos en una variable para enviar como respuesta JSON
        $response = array(
        'email' => $data['mail'],
        'plant' => $planta,
        'lng' => substr($data['mi_cfg'], -2),
        'person' => $data['nombre'],
        'id' => $data['idusuario'],
        'tipo' => $data['idtipousuario'],
        'developer' => BASE_DEVELOPER,
        'content' => BASE_CONTENT,
        'logo' => BASE_LOGO,
        'by' => BASE_BY, 
        'rutaDeveloper' => BASE_RUTA,
        'qcodusuario' => $data['qcodusuario'],
        'username' => $data['nombre'],
        'area' => $data['area'],
        'activo' => $data['activo'],
        'verificador' => $data['verificador'],
        'sso' => 'null',
        );
     
      // Establece las variables de sesión si es necesario
      $_SESSION['login_sso']['email'] = $data['mail'];
      $_SESSION['login_sso']['plant'] = $planta;
      $_SESSION['login_sso']['lng'] = substr($data['mi_cfg'], -2);
      $_SESSION['login_sso']['person'] = $data['nombre'];
      $_SESSION['login_sso']['id'] = $data['idusuario'];
      $_SESSION['login_sso']['tipo'] = $data['idtipousuario'];
      $_SESSION['login_sso']['developer'] = BASE_DEVELOPER;
      $_SESSION['login_sso']['content'] = BASE_CONTENT;
      $_SESSION['login_sso']['logo'] = BASE_LOGO;
      $_SESSION['login_sso']['by'] = BASE_BY;
      $_SESSION['login_sso']['rutaDeveloper'] = BASE_RUTA;

      $_SESSION['login_sso']['qcodusuario'] = $data['qcodusuario'];
      $_SESSION['login_sso']['username'] = $data['nombre'];
      $_SESSION['login_sso']['area'] = $data['area'];
      $_SESSION['login_sso']['verificador'] = $data['verificador'];
      if (!isset($_SESSION['login_sso']['sso'])) {
          $_SESSION['login_sso']['sso'] = 'null';
      }
      
      $_SESSION['factum_validation']['plant'] = $planta;
      $json = json_encode($response);
        // Antes de enviar la respuesta
        error_log('JSON response: ' . $json);
        $response = array('success' => true, 'res' => $response);
        header('Content-Type: application/json');
        echo json_encode($response);

        }else{
            $response = array('success' => false, 'message' => 'Hay un dato que no es correcto.');
            echo json_encode($response);
            return $data;
        }
        
  } catch (\Throwable $e) {
    print "Error!: ".$e->getMessage()."<br>";
      die();
  }
}


header("Content-Type: application/json; charset=utf-8");
$datos = file_get_contents("php://input");
// $datos = '{"planta":15,"email":"luisfactum@gmail.com","password":"4488","ruta":"/login","rax":"&new=Wed Jul 10 2024 19:19:11 GMT-0300 (hora estándar de Argentina)"}';

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
  $pass = $data['password'];
  consultar($planta, $email, $pass);
} else {
  echo "Error al decodificar la cadena JSON";
}
?>