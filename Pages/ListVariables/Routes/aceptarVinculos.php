<?php
        mb_internal_encoding('UTF-8');
        require_once dirname(dirname(dirname(__DIR__))) . '/ErrorLogger.php';
        ErrorLogger::initialize(dirname(dirname(dirname(__DIR__))) . '/logs/error.log');
        if (isset($_SESSION['timezone'])) {
            date_default_timezone_set($_SESSION['timezone']);
        } else {
            date_default_timezone_set('America/Argentina/Buenos_Aires');
        }
        function addVinculo($objeto) {

          try {
            ob_start();
            include_once BASE_DIR . "/Routes/datos_base.php";
            $selector = $objeto['selector'];
            $idLTYreporte = $objeto['idLTYreporte'];
            $activo = $objeto['activo'];
            $idusuario = $objeto['idusuario'];
            $idLTYcliente = $objeto['idLTYcliente'];

            
            $conn = mysqli_connect($host,$user,$password,$dbname);
            if ($conn->connect_error) {
                ob_end_clean();
                die("Conexión fallida: " . $conn->connect_error);
            }
            $sql = "INSERT INTO LTYselectReporte (selector, idLTYreporte, activo, idusuario, idLTYcliente) VALUES (?, ?, ?, ?, ?);";
          
            $stmt = $conn->prepare($sql);
            if ($stmt === false) {
                die("Error al preparar la consulta: " . $conn->error);
            }
            $stmt->bind_param("iisii", $selector, $idLTYreporte, $activo, $idusuario, $idLTYcliente);
          
            if ($stmt->execute() === true) {
                $last_id = $conn->insert_id;
                $conn->commit();
                $response = array('success' => true, 'message' => 'Se hizo el vinculo.', 'id' => $last_id);
            } else {
                $conn->rollback();
                $response = array('success' => false, 'message' => 'No se hizo el vinculo.');
            }
            $stmt->close();
            $conn->close();
              ob_end_clean();
              header('Content-Type: application/json');
              echo  json_encode($response);
            // Cerrar la declaración y la conexión

            
          } catch (\Throwable $e) {
             error_log("Error al aceptar vinculos: " . $e);
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
          addVinculo($objeto);
        } else {
          echo "Error al decodificar la cadena JSON";
        }


?>