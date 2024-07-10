<?php

        mb_internal_encoding('UTF-8');
        function updateSelector($q) {

          try {
            include_once BASE_DIR . "/Routes/datos_base.php";
          $detalle = $q['detalle'];
          $selector = $q['selector'];
          $nivel = $q['nivel']; 
           
            $conn = mysqli_connect($host,$user,$password,$dbname);
            if ($conn->connect_error) {
                die("Conexión fallida: " . $conn->connect_error);
            }
            mysqli_set_charset($conn, "utf8");
            $sql = "UPDATE LTYselect SET detalle = ?, nivel = ? WHERE selector = ?";
          
            $stmt = $conn->prepare($sql);
            if ($stmt === false) {
                die("Error al preparar la consulta: " . $conn->error);
            }
            $stmt->bind_param("sii", $detalle , $nivel, $selector);
          
            if ($stmt->execute() === true) {
                $response = array('success' => true, 'message' => 'Se actualizo el selector.');
            } else {
                $response = array('success' => false, 'message' => 'No se actualizo el selector.');
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
        // $datos = '{"q":"200","ruta":"/variableOnOff","rax":"&new=Fri May 03 2024 08:54:56 GMT-0300 (hora estándar de Argentina)","activo":"n"}';

        if (empty($datos)) {
          $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
          echo json_encode($response);
          exit;
        }
        $data = json_decode($datos, true);
        error_log('JSON response: ' . json_encode($data));

        if ($data !== null) {
          $q = $data['q'];
          updateSelector($q);
        } else {
          echo "Error al decodificar la cadena JSON";
        }


?>