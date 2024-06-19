<?php
        mb_internal_encoding('UTF-8');
        function addCompania($objeto) {

          try {
            include_once BASE_DIR . "/Routes/datos_base.php";
            $cliente = $objeto['cliente'];
            $detalle = $objeto['detalle'];
            $contacto = $objeto['contacto'];
            $activo = 's'; 
            $email = $objeto['email'];

            
            $conn = mysqli_connect($host,$user,$password,$dbname);
            if ($conn->connect_error) {
                die("Conexión fallida: " . $conn->connect_error);
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
            print "Error!: ".$e->getMessage()."<br>";
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
        error_log('JSON response: ' . json_encode($data));

        if ($data !== null) {
          $objeto = $data['objeto'];
          addCompania($objeto);
        } else {
          echo "Error al decodificar la cadena JSON";
        }


?>