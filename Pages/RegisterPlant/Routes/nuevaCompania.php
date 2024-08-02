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

            
            $conn = mysqli_connect($host,$user,$password,$dbname);
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
                $last_id = $conn->insert_id;
                $response = array('success' => true, 'message' => 'Se agregó la nueva compania.', 'id' => $last_id);
            } else {
                $response = array('success' => false, 'message' => 'No se agregó la nueva compania.');
            }
            $stmt->close();
            $conn->close();
            
              header('Content-Type: application/json');
              echo  json_encode($response);
            // Cerrar la declaración y la conexión

            
          } catch (\Throwable $e) {
            error_log("Error al guardar nuevo cliente. Error: " . $e);
            print "Error!: ".$e->getMessage()."<br>";
            die();
          }
        }

        header("Content-Type: application/json; charset=utf-8");
        require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
        $datos = file_get_contents("php://input");
        // $datos = '{"ruta":"/addCompania","rax":"&new=Thu Jun 20 2024 17:59:43 GMT-0300 (hora estándar de Argentina)","objeto":{"cliente":"mccain-balcarce","detalle":"prueba 2","contacto":"Ernesto","email":"luisglogista@gmail.com","activo":"s"}}';


        if (empty($datos)) {
          $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
          echo json_encode($response);
          exit;
        }
        $data = json_decode($datos, true);
        error_log('JSON response: ' . json_encode($data));

        if ($data !== null) {
          $objeto = $data['objeto'];
          addCompania($objeto);
        } else {
          echo "Error al decodificar la cadena JSON";
        }


?>