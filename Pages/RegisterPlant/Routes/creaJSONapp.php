<?php
  mb_internal_encoding('UTF-8');
  function writeJSON($objeto) {
      $clienteNum = $objeto['num'];
     
      $directorio = BASE_DIR . '/models/App/' . $clienteNum . '/';
      if (!file_exists($directorio)) {
          mkdir($directorio, 0777, true);
      }
      $file = $directorio . 'app.json';

      // Comprobar si el archivo app.json existe
    if (!file_exists($file)) {
        // Estructura inicial del archivo JSON
        $initialContent = [
            "planta" => $objeto['name'],
            "idiomas" => [
                "bienvenido" => ["Bienvenido", "Bem-vindo(Br)", "Welcome"],
                "abreviatura" => ["es", "bra", "en"]
            ],
            "Menu" => [
                "name" => ["Controles", "Consultas"],
                "type" => ["", ""],
                "ruta" => ["Controles/index.php", "Consultas/index.php"]
            ],
            "Controles" => [
                "name" => ["Controles", "Imprimir control"],
                "type" => ["", ""],
                "ruta" => ["Controles/index.php", ""]
            ],
            "Ad" => [
                "name" => ["Reportes", "Controles", "Variables", "Areas"],
                "type" => ["", "", "", ""],
                "ruta" => [
                    "ListReportes/index.php",
                    "ListControles/index.php",
                    "ListVariables/index.php",
                    "ListAreas/index.php"
                ]
            ],
            "apps" => [
                "name" => ["SCG", "Admin"],
                "type" => ["ctrl", "ctrl"],
                "ruta" => ["Menu/index.php", "Admin/index.php"],
                "nivel" => [3, 4]
            ],
        ];

        // Convertir el array a JSON y escribirlo en el archivo
        $jsonContent = json_encode($initialContent, JSON_PRETTY_PRINT);
        $jsonContent = str_replace('\/', '/', $jsonContent);
        // file_put_contents($file, json_encode($initialContent, JSON_PRETTY_PRINT));
        file_put_contents($file, $jsonContent);
    }

    // Leer el contenido actual de app.json
    $currentData = json_decode(file_get_contents($file), true);


          // Guardar los datos actualizados en log.json
      if (file_put_contents($file, json_encode($currentData, JSON_PRETTY_PRINT))) {
          echo json_encode(['success' => true]);
      } else {
          echo json_encode(['success' => false, 'message' => 'Failed tocreate to app.json']);
      }
  }

        header("Content-Type: application/json; charset=utf-8");
        require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
        $datos = file_get_contents("php://input");
          // $datos = '{"ruta":"/escribirJSON","rax":"&new=Thu Jun 20 2024 18:04:48 GMT-0300 (hora estándar de Argentina)","objeto":{"name":"xxxxxxxxxx","num":4}}';

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

        // $objeto = $data['objeto'];

        if ($data !== null) {
          $objeto = $data['objeto'];
          writeJSON($objeto);
        } else {
          echo "Error al decodificar la cadena JSON";
        }
?>
