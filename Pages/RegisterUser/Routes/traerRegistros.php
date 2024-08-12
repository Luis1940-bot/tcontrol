<?php

        $sql='';

        function traer($q, $sql_i) {
          $porciones = explode(",", $q);
          
          $plant = $sql_i;
          switch ($porciones[0]) {

              case 'traerLTYarea':
                  $sql="SELECT 
                            ar.idLTYarea AS id, 
                            ar.areax AS area 
                          FROM LTYarea ar 
                          WHERE ar.idLTYcliente = ". $plant ." AND ar.activo = 's' AND ar.visible = 's' 
                          ORDER BY ar.idLTYarea ASC;";
              break;

              case 'traerTipoDeUsuario':
                $sql = "SELECT c.idtipousuario AS 'ID', c.tipo AS 'TIPO', c.detalle AS 'DETALLE' FROM tipousuario c ORDER BY c.idtipousuario ASC;";
              break;

              default:
                  # code...
                  break;
          }

          
          require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
          include_once BASE_DIR . "/Routes/datos_base.php";
          
            // $host = "68.178.195.199"; 
            // $user = "developers";
            // $password = "6vLB#Q0bOVo4";
            // $dbname = "tc1000";
            // $port = 3306;
            // $charset = "utf-8";
          try {
        
              $con = mysqli_connect($host,$user,$password,$dbname);
              if (!$con) {
                  // die('Could not connect: ' . mysqli_error($con));
              };
              
              mysqli_query ($con,"SET NAMES 'utf8'");
              mysqli_select_db($con,$dbname);

              $result = mysqli_query($con,$sql);
              $arr_customers = array();
              $cantidadcampos = mysqli_num_fields($result);
              $contador = 0;
              while($row=mysqli_fetch_array($result)) {
                  
                  //******************************************** */
                  for ($x = 0; $x <= $cantidadcampos-1; $x++) {
                      $sincorchetes=$row[$x];
                      $arr_customers[$contador][$x] = $row[$x];
                  }
                  $contador++;
              }
              $json = json_encode($arr_customers);
              echo $json;
              mysqli_close($con);
              // $pdo=null;
              
          } catch (\PDOException $e) {
              error_log("Error al traer registros. Error: " . $e);
              print "Error!: ".$e->getMessage()."<br>";
              die();
          }
        }
        
        


        header("Content-Type: application/json; charset=utf-8");
        require_once dirname(dirname(dirname(__DIR__))) . '/ErrorLogger.php';
        ErrorLogger::initialize(dirname(dirname(dirname(__DIR__))) . '/logs/error.log');
        if (isset($_SESSION['timezone'])) {
            date_default_timezone_set($_SESSION['timezone']);
        } else {
            date_default_timezone_set('America/Argentina/Buenos_Aires');
        }
        $datos = file_get_contents("php://input");
        // $datos = '{"q":"traerTipoDeUsuario","ruta":"/traerTipoDeUsuarioParaRegistroUser","sql_i":null,"rax":"&new=Fri Jun 21 2024 19:20:33 GMT-0300 (hora estándar de Argentina)"}';
    

        if (empty($datos)) {
          $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
          echo json_encode($response);
          exit;
        }
        $data = json_decode($datos, true);

        error_log('Pages/RegiserUser/Routes/traerRegistros-JSON response: ' . json_encode($data));

        if ($data !== null) {
          $q = $data['q'];
          $sql_i = $data['sql_i'];
          traer($q, $sql_i);
        } else {
          echo "Error al decodificar la cadena JSON";
        }
   
?>