<?php

        mb_internal_encoding('UTF-8');
        function updateVariable($q) {

          try {
            include_once BASE_DIR . "/Routes/datos_base.php";

            $arrayId = $q['id'];
            $arrayValue = $q['value'];

            $conn = mysqli_connect($host, $user, $password, $dbname);
            if ($conn->connect_error) {
                die("Conexión fallida: " . $conn->connect_error);
            }
            mysqli_set_charset($conn, "utf8");
            $sql = "UPDATE LTYselect SET concepto = ? WHERE idLTYselect = ?";

            $stmt = $conn->prepare($sql);
            if ($stmt === false) {
                die("Error al preparar la consulta: " . $conn->error);
            }

            // Asegurarse de que ambos arrays tienen la misma longitud
            if (count($arrayId) != count($arrayValue)) {
                die("Los arrays no tienen la misma longitud");
            }

            for ($i = 0; $i < count($arrayId); $i++) {
                $id = $arrayId[$i];
                $value = $arrayValue[$i];

                // Vincular parámetros para cada par de ID y valor
                $stmt->bind_param("si", $value, $id);

                if ($stmt->execute() === true) {
                    $response[] = array('id' => $id, 'success' => true, 'message' => 'Actualizado correctamente.');
                } else {
                    $response[] = array('id' => $id, 'success' => false, 'message' => 'Error al actualizar.');
                }
            }

            $stmt->close();
            $conn->close();

            header('Content-Type: application/json');
            echo json_encode($response);


            
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
          $q = $data['objeto'];
          updateVariable($q);
        } else {
          echo "Error al decodificar la cadena JSON";
        }


?>