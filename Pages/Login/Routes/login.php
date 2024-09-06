<?php
mb_internal_encoding('UTF-8');
require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
require_once dirname(dirname(dirname(__DIR__))) . '/ErrorLogger.php';
// Inicializar el logger con la ruta deseada
ErrorLogger::initialize(dirname(dirname(dirname(__DIR__))) . '/logs/error.log');

function consultar($planta, $email, $pass) {
    try {
        include_once BASE_DIR."/Routes/datos_base_primera.php";
        // $dbnameLogin = 'tc1000';

        $cnn = new PDO("mysql:host={$host};dbname={$dbname};port={$port};charset=utf8", $user, $password);
        $hash = hash('ripemd160', $pass);
        $sql = "SELECT nombre, idusuario, mail, idtipousuario, firma, qcodusuario, area, mi_cfg, activo, verificador FROM usuario
                WHERE mail=? and pass=? and idLTYcliente=?;";
        $query = $cnn->prepare($sql);
        $query->bindParam(1, $email, PDO::PARAM_STR);
        $query->bindParam(2, $hash, PDO::PARAM_STR);
        $query->bindParam(3, $planta, PDO::PARAM_INT);

        $query->execute();
        $data = $query->fetch(PDO::FETCH_ASSOC); 
        $query->closeCursor();
        $cnn = null;

        if ($data) {
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

            // Establecer las variables de sesión si es necesario
            $_SESSION['login_sso'] = array(
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
                'verificador' => $data['verificador'],
                'sso' => 'null',
            );
            
            $_SESSION['factum_validation']['plant'] = $planta;

            $response = array('success' => true, 'res' => $response);
            header('Content-Type: application/json'); 
            echo json_encode($response);
        } else {
            error_log("Login failed for email: $email, planta: $planta");
            $response = array('success' => false, 'message' => 'Hay un dato que no es correcto.');
            echo json_encode($response);
            return $data;
        }
    } catch (Throwable $e) {
        error_log('Exception: ' . $e->getMessage() . ' in ' . $e->getFile() . ' on line ' . $e->getLine());
        echo "Error!: ".$e->getMessage()."<br>";
        die();
    }
}

header("Content-Type: application/json; charset=utf-8");
$datos = file_get_contents("php://input");
$datos = '{"planta":15,"email":"luisfactum@gmail.com","password":"4488","ruta":"/login","timezone":"America/Argentina/Buenos_Aires","rax":"&new=Fri Sep 06 2024 16:06:45 GMT-0300 (hora estándar de Argentina)"}';

if (empty($datos)) {
    $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
    echo json_encode($response);
    exit;
}

$data = json_decode($datos, true);

if ($data !== null) {

    if (isset($data['timezone'])) {
        $GLOBALS['timezone'] = $data['timezone'];
        date_default_timezone_set($data['timezone']);
    } else {
        $GLOBALS['timezone'] = 'America/Argentina/Buenos_Aires';
        date_default_timezone_set('America/Argentina/Buenos_Aires');
    }

    $planta = $data['planta'];
    $email = $data['email'];
    $pass = $data['password'];
    consultar($planta, $email, $pass);
} else {
    error_log("Error decoding JSON: " . $datos);
    $response = array('success' => false, 'message' => 'Error al decodificar la cadena JSON');
    echo json_encode($response);
}
?>
