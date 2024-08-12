<?php

        mb_internal_encoding('UTF-8');
        require_once dirname(dirname(dirname(__DIR__))) . '/ErrorLogger.php';
        ErrorLogger::initialize(dirname(dirname(dirname(__DIR__))) . '/logs/error.log');
        if (isset($_SESSION['timezone'])) {
            date_default_timezone_set($_SESSION['timezone']);
        } else {
            date_default_timezone_set('America/Argentina/Buenos_Aires');
        }
        function onOff($id, $activo) {
          try {
            include_once BASE_DIR . "/Routes/datos_base.php";
            if ($activo === 's') {
              $activo = 'n';
            } else if($activo === 'n') {
              $activo = 's';
            }
           
            $conn = mysqli_connect($host,$user,$password,$dbname);
            if ($conn->connect_error) {
                die("Conexión fallida: " . $conn->connect_error);
            }
            $sql = "UPDATE LTYreporte SET activo = ? WHERE idLTYreporte = ?";
          
            $stmt = $conn->prepare($sql);
            if ($stmt === false) {
                die("Error al preparar la consulta: " . $conn->error);
            }
            $stmt->bind_param("si", $activo , $id);
          
            if ($stmt->execute() === true) {
                $response = array('success' => true, 'message' => 'Se actualizo la situación del reporte.');
            } else {
                $response = array('success' => false, 'message' => 'No se actualizo la situación del reporte.');
            }
            $stmt->close();
            $conn->close();
            
              header('Content-Type: application/json');
              echo  json_encode($response);
            // Cerrar la declaración y la conexión

            
          } catch (\Throwable $e) {
             error_log("Error en on off reporte. Error: " . $e);
            print "Error!: ".$e->getMessage()."<br>";
            die();
          }
        }

        header("Content-Type: application/json; charset=utf-8");
        require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
        $datos = file_get_contents("php://input");
        // $datos = '{"q":"4","ruta":"/reporteOnOff","rax":"&new=Fri Apr 26 2024 09:39:17 GMT-0300 (hora estándar de Argentina)","activo":"s"}';

        if (empty($datos)) {
          $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
          echo json_encode($response);
          exit;
        }
        $data = json_decode($datos, true);
        error_log('Pages/ListReportes/Routes/reporteOnOff-JSON response: ' . json_encode($data));

        if ($data !== null) {
          $q = $data['q'];
          $activo = $data['activo'];
          onOff($q, $activo);
        } else {
          echo "Error al decodificar la cadena JSON";
        }


?>