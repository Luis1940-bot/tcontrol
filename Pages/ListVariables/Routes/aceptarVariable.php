<?php

        mb_internal_encoding('UTF-8');
        function addVariable($objeto) {

          try {
            include_once BASE_DIR . "/Routes/datos_base.php";
            $selector = $objeto['selector'];
            $detalle = $objeto['nombre'];
            $orden = $objeto['orden'];
            $activo = 's';
            $nivel = 3; 
            $concepto = $objeto['concepto'];

            
            $conn = mysqli_connect($host,$user,$password,$dbname);
            if ($conn->connect_error) {
                die("Conexión fallida: " . $conn->connect_error);
            }
            $sql = "INSERT INTO LTYselect (selector, detalle, orden, activo, nivel, concepto) VALUES (?, ?, ?, ?, ?, ?);";
          
            $stmt = $conn->prepare($sql);
            if ($stmt === false) {
                die("Error al preparar la consulta: " . $conn->error);
            }
            $stmt->bind_param("isisis", $selector, $detalle, $orden, $activo, $nivel, $concepto);
          
            if ($stmt->execute() === true) {
                $last_id = $conn->insert_id;
                $response = array('success' => true, 'message' => 'Se agregó la nueva variable.', 'id' => $last_id);
            } else {
                $response = array('success' => false, 'message' => 'No se agregó la nueva variable.');
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
        // $datos = '{"ruta":"/addVariable","rax":"&new=Mon May 06 2024 08:42:24 GMT-0300 (hora estándar de Argentina)","objeto":{"selector":"32","nombre":"COMPORTAMIENTO","orden":4,"concepto":"riesgo"}}';

        if (empty($datos)) {
          $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
          echo json_encode($response);
          exit;
        }
        $data = json_decode($datos, true);
        error_log('JSON response: ' . json_encode($data));

        if ($data !== null) {
          $objeto = $data['objeto'];
          addVariable($objeto);
        } else {
          echo "Error al decodificar la cadena JSON";
        }


?>