<?php
        mb_internal_encoding('UTF-8');
          require_once dirname(dirname(dirname(__DIR__))) . '/ErrorLogger.php';
          ErrorLogger::initialize(dirname(dirname(dirname(__DIR__))) . '/logs/error.log');
          if (isset($_SESSION['timezone'])) {
              date_default_timezone_set($_SESSION['timezone']);
          } else {
              date_default_timezone_set('America/Argentina/Buenos_Aires');
          }
        function addUsuario($objeto, $idPlanta) {
          $nombre = '';
          try {
            include_once BASE_DIR . "/Routes/datos_base.php";
            $nombre = $objeto['nombre'];
            $pass = $objeto['pass'];
            $area = $objeto['area'];
            $puesto = $objeto['puesto'];
            $idtipousuario = $objeto['idtipousuario'];
            $activo = 's'; 
            $mail = $objeto['email'];
            $firma = $objeto['firma'];
            $mi_cfg = 'd-' . $objeto['valueIdioma'];
            $idLTYcliente = $idPlanta;
            $cod_verificador = bin2hex(random_bytes(16)); // Generar código de verificación

            // $host = "68.178.195.199"; 
            // $user = "developers";
            // $password = "6vLB#Q0bOVo4";
            // $dbname = "tc1000";
            // $port = 3306;
            // $charset = "utf-8";
            

            
            $conn = mysqli_connect($host,$user,$password,$dbname);
            if ($conn->connect_error) {
                 error_log("Conexion fallida: ");
                die("Conexión fallida: " . $conn->connect_error);
            }
            if (!$conn->set_charset("utf8mb4")) {
                printf("Error al cargar el conjunto de caracteres utf8mb4: %s\n", $conn->error);
                exit();
            }

            // Verificar si ya existe un usuario con el mismo email y cliente
            $sql_check = "SELECT * FROM usuario WHERE mail = ? AND idLTYcliente = ?";
            $stmt_check = $conn->prepare($sql_check);
            if ($stmt_check === false) {
                die("Error al preparar la consulta: " . $conn->error);
            }
            $stmt_check->bind_param("si", $mail, $idLTYcliente);
            $stmt_check->execute();
            $result_check = $stmt_check->get_result();

            if ($result_check->num_rows > 0) {
                $response = array('success' => false, 'message' => 'El usuario ya existe.');
                $stmt_check->close();
                $conn->close();
                header('Content-Type: application/json');
                echo json_encode($response);
                return;
            }
            $stmt_check->close();

            $hash=hash('ripemd160',$pass);
            $sql = "INSERT INTO usuario (nombre, pass, area, puesto, idtipousuario, activo, mail, firma, mi_cfg, idLTYcliente, cod_verificador) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
          
            $stmt = $conn->prepare($sql);
            if ($stmt === false) {
                die("Error al preparar la consulta: " . $conn->error);
            }
            
            $stmt->bind_param("ssssissssis", $nombre, $hash, $area, $puesto, $idtipousuario, $activo, $mail, $firma, $mi_cfg, $idLTYcliente, $cod_verificador);
          
            if ($stmt->execute() === true) {
                $last_id = $conn->insert_id;
                $response = array('success' => true, 'message' => 'Se agregó un nuevo usuario.', 'id' => $last_id, 'v' => $cod_verificador);
            } else {
                $response = array('success' => false, 'message' => 'No se agregó el usuario.');
            }
            $stmt->close();
            $conn->close();
            
              header('Content-Type: application/json');
              echo  json_encode($response);
            // Cerrar la declaración y la conexión

            
          } catch (\Throwable $e) {
            error_log("Error al crear el nuevo usuario: " . $nombre);
            print "Error!: ".$e->getMessage()."<br>";
            die();
          }
        }

        header("Content-Type: application/json; charset=utf-8");
        require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
        $datos = file_get_contents("php://input");
        //  $datos = '{"q":{"nombre":"trt","pass":"1","valueArea":0,"area":"Área","puesto":"d","idtipousuario":1,"textTipoDeUsuario":"Colaborador","valueSituacion":"s","textSituacion":"Activo","email":"d@.com.ar","firma":"","valueIdioma":"es","textIdioma":"Español"},"ruta":"/addUsuario","sql_i":2,"rax":"&new=Fri Jun 28 2024 08:50:30 GMT-0300 (hora estándar de Argentina)"}';



        if (empty($datos)) {
          $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
          echo json_encode($response);
          exit;
        }
        $data = json_decode($datos, true);
        // error_log('Pages/RegisterUser/Routes/nuevoUsuario-JSON response: ' . json_encode($data));

        if ($data !== null) {
          $objeto = $data['q'];
          $idPlanta = $data['sql_i'];
          addUsuario($objeto, $idPlanta);
        } else {
          echo "Error al decodificar la cadena JSON";
        }


?>