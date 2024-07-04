<?php

        mb_internal_encoding('UTF-8');
        function updateArea($q) {
            // $host = "68.178.195.199"; 
            // $user = "developers";
            // $password = "6vLB#Q0bOVo4";
            // $dbname = "tc1000";
            // $port = '3306';
            // $charset='utf-8';

          try {
            include_once BASE_DIR . "/Routes/datos_base.php";
            $id = $q['id'];
            $area = $q['value'];
           
            $conn = mysqli_connect($host,$user,$password,$dbname);
            if ($conn->connect_error) {
                die("Conexión fallida: " . $conn->connect_error);
            }
            
              $sql = "UPDATE LTYarea SET areax = ? WHERE idLTYarea = ?";
            
            
          
            $stmt = $conn->prepare($sql);
            if ($stmt === false) {
                die("Error al preparar la consulta: " . $conn->error);
            }
            $stmt->bind_param("si", $area , $id);
          
            if ($stmt->execute() === true) {
                $response = array('success' => true, 'message' => 'Se actualizo el area.');
            } else {
                $response = array('success' => false, 'message' => 'No se actualizo el area.');
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
        // $datos = '{"q":{"id":4,"value":"DESARROLLOSSSSS","filtrado":[]},"ruta":"/guardarCambioArea","rax":"&new=Thu Jul 04 2024 07:59:34 GMT-0300 (hora estándar de Argentina)"}';

        if (empty($datos)) {
          $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
          echo json_encode($response);
          exit;
        }
        $data = json_decode($datos, true);
        error_log('JSON response: ' . json_encode($data));

        if ($data !== null) {
          $q = $data['q'];
    
          updateArea($q);
        } else {
          echo "Error al decodificar la cadena JSON";
        }


?>