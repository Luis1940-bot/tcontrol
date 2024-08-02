<?php
        mb_internal_encoding('UTF-8');
        require_once dirname(dirname(dirname(__DIR__))) . '/ErrorLogger.php';
        ErrorLogger::initialize(dirname(dirname(dirname(__DIR__))) . '/logs/error.log');
        if (isset($_SESSION['timezone'])) {
            date_default_timezone_set($_SESSION['timezone']);
        } else {
            date_default_timezone_set('America/Argentina/Buenos_Aires');
        }
        function addVariable($objeto) {

          try {
            include_once BASE_DIR . "/Routes/datos_base.php";
            // $host = "68.178.195.199"; 
            // $user = "developers";
            // $password = "6vLB#Q0bOVo4";
            // $dbname = "tc1000";

            $selector = $objeto['selector'];
            $detalle = $objeto['nombre'];
            $orden = $objeto['orden'];
            $activo = 's';
            $nivel = 3; 
            $concepto = $objeto['concepto'];
            $idLTYcliente = $objeto['idLTYcliente'];

            
            $conn = mysqli_connect($host,$user,$password,$dbname);
            if ($conn->connect_error) {
                die("Conexión fallida: " . $conn->connect_error);
            }
            mysqli_set_charset($conn, "utf8");
            $sql = "INSERT INTO LTYselect (selector, detalle, orden, activo, nivel, concepto, idLTYcliente) VALUES (?, ?, ?, ?, ?, ?, ?);";
          
            $stmt = $conn->prepare($sql);
            if ($stmt === false) {
                die("Error al preparar la consulta: " . $conn->error);
            }
            
            $stmt->bind_param("isisisi", $selector, $detalle, $orden, $activo, $nivel, $concepto, $idLTYcliente);
          
            if ($stmt->execute() === true) {
                $last_id = $conn->insert_id;
                $sqlSelect = "SELECT SQL_NO_CACHE LTYselect.idLTYselect, LTYselect.detalle, LTYselect.concepto, LTYselect.activo
                                      ,LTYselect.selector, LTYselect.orden, LTYselect.nivel, RAND(),NOW() 
                                      FROM LTYselect 
                                      WHERE LTYselect.idLTYcliente = ? AND LTYselect.selector = ?
                                      ORDER BY LTYselect.detalle ASC;";
                $stmtSelect = $conn->prepare($sqlSelect);
                if ($stmtSelect === false) {
                    die("Error al preparar la consulta SELECT: " . $conn->error);
                }
                $stmtSelect->bind_param("ii", $idLTYcliente, $selector);
                $stmtSelect->execute();
                $result = $stmtSelect->get_result();
                $updatedRecords = [];
                while ($row = $result->fetch_assoc()) {
                    $updatedRecords[] = array_values($row); 
                }
                $response = array('success' => true, 'message' => 'Se agregó la nueva variable.', 'id' => $last_id, 'array' => $updatedRecords);
            } else {
                $response = array('success' => false, 'message' => 'No se agregó la nueva variable.');
            }
            $stmt->close();
            $conn->close();
            
              header('Content-Type: application/json');
              echo  json_encode($response);
            // Cerrar la declaración y la conexión

            
          } catch (\Throwable $e) {
             error_log("Error al insertar nueva variable: " . $e);
            print "Error!: ".$e->getMessage()."<br>";
            die();
          }
        }

        header("Content-Type: application/json; charset=utf-8");
        require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
        $datos = file_get_contents("php://input");
        // $datos = '{"ruta":"/addVariable","rax":"&new=Wed Jul 10 2024 20:30:35 GMT-0300 (hora estándar de Argentina)","objeto":{"selector":1,"nombre":"PRIORIDAD","orden":3,"concepto":"Baja","idLTYcliente":15}}';

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