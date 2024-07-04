<?php

        mb_internal_encoding('UTF-8');
        function onOff($id, $status, $tipo) {
            // $host = "68.178.195.199"; 
            // $user = "developers";
            // $password = "6vLB#Q0bOVo4";
            // $dbname = "tc1000";
            // $port = '3306';
            // $charset='utf-8';

          try {
            include_once BASE_DIR . "/Routes/datos_base.php";
            if ($status === 's') {
              $status = 'n';
            } else if($status === 'n') {
              $status = 's';
            }
           
            $conn = mysqli_connect($host,$user,$password,$dbname);
            if ($conn->connect_error) {
                die("Conexión fallida: " . $conn->connect_error);
            }
            if ($tipo === 'activo') {
              $sql = "UPDATE LTYarea SET activo = ? WHERE idLTYarea = ?";
            }
            if ($tipo === 'visible') {
              $sql = "UPDATE LTYarea SET visible = ? WHERE idLTYarea = ?";
            }
            
          
            $stmt = $conn->prepare($sql);
            if ($stmt === false) {
                die("Error al preparar la consulta: " . $conn->error);
            }
            $stmt->bind_param("si", $status , $id);
          
            if ($stmt->execute() === true) {
                $response = array('success' => true, 'message' => 'Se actualizo la situación del area.');
            } else {
                $response = array('success' => false, 'message' => 'No se actualizo la situación del area.');
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
        // $datos = '{"q":4,"ruta":"/areaOnOff","rax":"&new=Wed Jul 03 2024 15:32:45 GMT-0300 (hora estándar de Argentina)","status":"s","tipo":"activo"}';

        if (empty($datos)) {
          $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
          echo json_encode($response);
          exit;
        }
        $data = json_decode($datos, true);
        error_log('JSON response: ' . json_encode($data));

        if ($data !== null) {
          $q = $data['q'];
          $status = $data['status'];
          $tipo = $data['tipo'];
          onOff($q, $status, $tipo);
        } else {
          echo "Error al decodificar la cadena JSON";
        }


?>