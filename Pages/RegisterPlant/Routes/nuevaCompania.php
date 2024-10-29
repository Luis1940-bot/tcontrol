<?php
mb_internal_encoding('UTF-8');
require_once dirname(dirname(dirname(__DIR__))) . '/ErrorLogger.php';
ErrorLogger::initialize(dirname(dirname(dirname(__DIR__))) . '/logs/error.log');

if (isset($_SESSION['timezone'])) {
    date_default_timezone_set($_SESSION['timezone']);
} else {
    date_default_timezone_set('America/Argentina/Buenos_Aires');
}

function addCompania($objeto) {
    try {
        include_once BASE_DIR . "/Routes/datos_base.php";
        $cliente = $objeto['cliente'];
        $detalle = $objeto['detalle'];
        $contacto = $objeto['contacto'];
        $activo = $objeto['activo'];
        $email = $objeto['email'];

        $conn = mysqli_connect($host, $user, $password, $dbname);
        if ($conn->connect_error) {
            die("Conexión fallida: " . $conn->connect_error);
        }
        if (!$conn->set_charset("utf8mb4")) {
            printf("Error al cargar el conjunto de caracteres utf8mb4: %s\n", $conn->error);
            exit();
        }

        $sql = "INSERT INTO LTYcliente (cliente, detalle, contacto, activo, email) VALUES (?, ?, ?, ?, ?);";
        $stmt = $conn->prepare($sql);
        if ($stmt === false) {
            die("Error al preparar la consulta: " . $conn->error);
        }
        $stmt->bind_param("sssss", $cliente, $detalle, $contacto, $activo, $email);

        if ($stmt->execute() === true) {
            $last_id = $conn->insert_id; // id del nuevo cliente agregado
            $response = array('success' => true, 'message' => 'Se agregó la nueva compañía.', 'id' => $last_id);

            // Verificar si el usuario ya existe en la tabla `usuario`
            $checkUserSql = "SELECT * FROM usuario WHERE mail = ? AND idLTYcliente = ?";
            $checkStmt = $conn->prepare($checkUserSql);
            if ($checkStmt === false) {
                die("Error al preparar la consulta: " . $conn->error);
            }
            $email = "luisglogista@gmail.com";
            $checkStmt->bind_param("si", $email, $last_id);
            $checkStmt->execute();
            $result = $checkStmt->get_result();

            if ($result->num_rows === 0) {
                // Insertar nuevo usuario si no existe
                $nombre = 'Luis';
                $pass = '5678';
                $area = 'Desarrollo';
                $puesto = 'Developer';
                $idtipousuario = 8;
                $activo = 's';
                $firma = 'LEG';
                $mi_cfg = 'd-es';
                $idLTYcliente = $last_id;
                $verificador = 1;
                $hash = hash('ripemd160', $pass);

                $userInsertSql = "INSERT INTO usuario (nombre, pass, area, puesto, idtipousuario, activo, mail, firma, mi_cfg, idLTYcliente, verificador) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
                $userStmt = $conn->prepare($userInsertSql);
                if ($userStmt === false) {
                    die("Error al preparar la consulta: " . $conn->error);
                }
                $userStmt->bind_param("ssssissssii", $nombre, $hash, $area, $puesto, $idtipousuario, $activo, $email, $firma, $mi_cfg, $idLTYcliente, $verificador);

                if ($userStmt->execute() === true) {
                    $response['message'] .= ' Usuario agregado correctamente.';
                } else {
                    $response['message'] .= ' No se pudo agregar el usuario.';
                }

                $userStmt->close();
            } else {
                $response['message'] .= ' El usuario ya existe.';
            }

            $checkStmt->close();
        } else {
            $response = array('success' => false, 'message' => 'No se agregó la nueva compañía.');
        }

        $stmt->close();
        $conn->close();

        header('Content-Type: application/json');
        echo json_encode($response);

    } catch (\Throwable $e) {
        error_log("Error al guardar nuevo cliente. Error: " . $e);
        print "Error!: " . $e->getMessage() . "<br>";
        die();
    }
}

header("Content-Type: application/json; charset=utf-8");
require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
$datos = file_get_contents("php://input");

if (empty($datos)) {
    $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
    echo json_encode($response);
    exit;
}

$data = json_decode($datos, true);

if ($data !== null) {
    $objeto = $data['objeto'];
    addCompania($objeto);
} else {
    echo "Error al decodificar la cadena JSON";
}
?>
