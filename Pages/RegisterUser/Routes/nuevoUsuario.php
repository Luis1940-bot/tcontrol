<?php
        mb_internal_encoding('UTF-8');
        function addUsuario($objeto, $plant) {

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
            $idLTYcliente = $plant;
            $cod_verificador = bin2hex(random_bytes(16)); // Generar código de verificación

            // $host = "68.178.195.199"; 
            // $user = "developers";
            // $password = "6vLB#Q0bOVo4";
            // $dbname = "tc1000";
            // $port = 3306;
            // $charset = "utf-8";
            

            
            $conn = mysqli_connect($host,$user,$password,$dbname);
            if ($conn->connect_error) {
                die("Conexión fallida: " . $conn->connect_error);
            }
            if (!$conn->set_charset("utf8mb4")) {
                printf("Error al cargar el conjunto de caracteres utf8mb4: %s\n", $conn->error);
                exit();
            }
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
            print "Error!: ".$e->getMessage()."<br>";
            die();
          }
        }

        header("Content-Type: application/json; charset=utf-8");
        require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
        $datos = file_get_contents("php://input");
        //  $datos = '{"q":{"nombre":"Luis Gimenez","pass":"4488","valueArea":0,"area":"Área","puesto":"","idtipousuario":1,"textTipoDeUsuario":"Colaborador","valueSituacion":"s","textSituacion":"Activo","email":"luisfactum@gmail.com","firma":"","valueIdioma":"es","textIdioma":"Español"},"ruta":"/addUsuario","sql_i":7,"rax":"&new=Sat Jun 22 2024 19:51:22 GMT-0300 (hora estándar de Argentina)"}';



        if (empty($datos)) {
          $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
          echo json_encode($response);
          exit;
        }
        $data = json_decode($datos, true);
        error_log('JSON response: ' . json_encode($data));

        if ($data !== null) {
          $objeto = $data['q'];
          $plant = $data['sql_i'];
          addUsuario($objeto, $plant);
        } else {
          echo "Error al decodificar la cadena JSON";
        }


?>