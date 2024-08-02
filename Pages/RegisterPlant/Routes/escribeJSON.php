<?php
  mb_internal_encoding('UTF-8');
  require_once dirname(dirname(dirname(__DIR__))) . '/ErrorLogger.php';
  ErrorLogger::initialize(dirname(dirname(dirname(__DIR__))) . '/logs/error.log');
  if (isset($_SESSION['timezone'])) {
    date_default_timezone_set($_SESSION['timezone']);
} else {
    date_default_timezone_set('America/Argentina/Buenos_Aires');
}

  function writeJSON($objeto) {
      try {
        $file = BASE_DIR . '/models/log.json';
        $currentData = json_decode(file_get_contents($file), true);

            // Asegurarse de que 'plantas' existe y es un array
        if (!isset($currentData['plantas']) || !is_array($currentData['plantas'])) {
            $currentData['plantas'] = [];
        }

          // Agregar el nuevo elemento a 'plantas'
        $currentData['plantas'][] = $objeto;

            // Guardar los datos actualizados en log.json
        if (file_put_contents($file, json_encode($currentData, JSON_PRETTY_PRINT))) {
            echo json_encode(['success' =>true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to write to log.json']);
        }
      } catch (\Throwable $e) {
          error_log("Error al escribir el JSON. Error: " . $e);
          print "Error!: ".$e->getMessage()."<br>";
      }
  }

        header("Content-Type: application/json; charset=utf-8");
        require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
        $datos = file_get_contents("php://input");
          // $datos = '{"ruta":"/escribirJSON","rax":"&new=Thu Jun 20 2024 18:04:48 GMT-0300 (hora estándar de Argentina)","objeto":{"name":"mccain-balcarce","num":3}}';

        if (empty($datos)) {
          $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
          echo json_encode($response);
          exit;
        }
        $data = json_decode($datos, true);
        // error_log('JSON response: ' . json_encode($data));

        if ($data === null) {
          echo "Error al decodificar la cadena JSON principal";
          exit;
        }

        $objeto = $data['objeto'];

        if ($objeto !== null) {
          // $objeto = $data['objeto'];
          writeJSON($objeto);
        } else {
          echo "Error al decodificar la cadena JSON";
        }
?>
