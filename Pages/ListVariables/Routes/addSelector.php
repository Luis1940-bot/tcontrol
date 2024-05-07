<?php

        mb_internal_encoding('UTF-8');
        function addSelector($q) {

          try {
           include_once BASE_DIR . "/Routes/datos_base.php";

          $detalle = $q['detalle'];
          $orden = 1;
          $activo = 's';
          $nivel = $q['nivel']; 
          $concepto = $q['concepto'];


          $conn = mysqli_connect($host, $user, $password, $dbname);
          if ($conn->connect_error) {
              die("Conexión fallida: " . $conn->connect_error);
          }

          // Iniciar transacción
          $conn->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
          $conn->query("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE");

          // Consulta para obtener el máximo valor de 'selector'
          $sqlMax = "SELECT MAX(selector) AS max_selector FROM LTYselect";
          $result = $conn->query($sqlMax);
          if ($result === false) {
              $conn->rollback(); // Revertir transacción en caso de error
              die("Error al obtener el máximo valor de selector: " . $conn->error);
          }

          $row = $result->fetch_assoc();
          $maxSelector = $row['max_selector'];
          $selector = $maxSelector + 1;  // Incrementar el máximo valor encontrado

          // Preparar la sentencia de inserción con el nuevo valor de 'selector'
          $sql = "INSERT INTO LTYselect (selector, detalle, orden, activo, nivel, concepto) VALUES (?, ?, ?, ?, ?, ?);";
          $stmt = $conn->prepare($sql);
          if ($stmt === false) {
              $conn->rollback(); // Revertir transacción en caso de error
              die("Error al preparar la consulta: " . $conn->error);
          }

          $stmt->bind_param("isisis", $selector, $detalle, $orden, $activo, $nivel, $concepto);

          if ($stmt->execute() === true) {
              
              $last_id = $conn->insert_id;
              $response = array('success' => true, 'message' => 'Se agregó un nuevo selector.', 'id' => $last_id);
              $conn->commit(); // Confirmar transacción
          } else {
              $conn->rollback(); // Revertir transacción en caso de error
              $response = array('success' => false, 'message' => 'No se agregó el nuevo selector.');
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
        // $datos = '{"ruta":"/addSelector","rax":"&new=Mon May 06 2024 14:21:40 GMT-0300 (hora estándar de Argentina)","q":{"concepto":"","detalle":"FACTUM","nivel":"1"}}';

        if (empty($datos)) {
          $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
          echo json_encode($response);
          exit;
        }
        $data = json_decode($datos, true);
        error_log('JSON response: ' . json_encode($data));

        if ($data !== null) {
          $q = $data['q'];
          addSelector($q);
        } else {
          echo "Error al decodificar la cadena JSON";
        }


?>