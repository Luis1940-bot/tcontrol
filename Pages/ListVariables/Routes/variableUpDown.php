<?php

        mb_internal_encoding('UTF-8');
        require_once dirname(dirname(dirname(__DIR__))) . '/ErrorLogger.php';
        ErrorLogger::initialize(dirname(dirname(dirname(__DIR__))) . '/logs/error.log');
        if (isset($_SESSION['timezone'])) {
            date_default_timezone_set($_SESSION['timezone']);
        } else {
            date_default_timezone_set('America/Argentina/Buenos_Aires');
        }
        function upDown($id, $array) {

          try {
            include_once BASE_DIR . "/Routes/datos_base.php";
            
            $conn = mysqli_connect($host,$user,$password,$dbname);
            if ($conn->connect_error) {
                die("Conexión fallida: " . $conn->connect_error);
            }
            $sql = "UPDATE LTYselect SET orden = ? WHERE idLTYselect = ?";
          
            $stmt = $conn->prepare($sql);
            if ($stmt === false) {
                die("Error al preparar la consulta: " . $conn->error);
            }

            $all_success = true;

            foreach ($array as $row) {
              $id = $row[0];
              $orden = $row[5];

              $stmt->bind_param("si", $orden, $id);

              if ($stmt->execute() !== true) {
                  $all_success = false; // Si algo falla, marcamos que no todas fueron exitosas
              }
          }

          if ($all_success) {
              $response = ['success' => true, 'message' => 'Todas las actualizaciones fueron exitosas.', 'array' => $array];
          } else {
              $response = ['success' => false, 'message' => 'Al menos una actualización falló.', 'array' => $array];
          }

          header('Content-Type: application/json');
          echo json_encode($response);

          $stmt->close();
          $conn->close();

            
          } catch (\Throwable $e) {
             error_log("Error de up down de variable. Error: " . $e);
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
          $q = $data['q'];
          $array = $data['array'];
          upDown($q, $array);
        } else {
          echo "Error al decodificar la cadena JSON";
        }


?>