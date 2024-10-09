<?php
mb_internal_encoding('UTF-8');
require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
require_once dirname(dirname(dirname(__DIR__))) . '/ErrorLogger.php';
// Inicializar el logger con la ruta deseada
ErrorLogger::initialize(dirname(dirname(dirname(__DIR__))) . '/logs/error.log');

function consultar($planta, $email) {
    try {
        include_once BASE_DIR."/Routes/datos_base_primera.php";
        // $dbnameLogin = 'tc1000';

        $cnn = new PDO("mysql:host={$host};dbname={$dbname};port={$port};charset=utf8", $user, $password);
        $sql = "SELECT id, plant, mail FROM auth
                WHERE mail=?  and plant=?;";
        $query = $cnn->prepare($sql);
        $query->bindParam(1, $email, PDO::PARAM_STR);
        $query->bindParam(2, $planta, PDO::PARAM_INT);

        $query->execute();
        $data = $query->fetch(PDO::FETCH_ASSOC); 
        $query->closeCursor();
        $cnn = null;

        if ($data) {
            $response = array(
                'id' => $data['id'],
                'mail' => $data['mail'],
                'plant' => $data['plant']
            );

            $response = array('success' => true, 'res' => $response);
            header('Content-Type: application/json'); 
            echo json_encode($response);
        } else {
            error_log("No autorizado: $email, planta: $planta");
            $response = array('success' => false, 'message' => 'Este correo no está autorizado, consulte con el Super Admin o con el Desarrollador.');
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
// $datos = '{"planta":15,"email":"luis@ftm.com.ar","ruta":"/auth","rax":"&new=Fri Oct 04 2024 20:06:24 GMT-0300 (hora estándar de Argentina)"}';

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
 
    consultar($planta, $email);
} else {
    error_log("Error decoding JSON: " . $datos);
    $response = array('success' => false, 'message' => 'Error al decodificar la cadena JSON');
    echo json_encode($response);
}
?>
