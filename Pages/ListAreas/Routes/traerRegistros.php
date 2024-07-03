<?php

        $sql='';

        function traer($q, $sql_i) {
          $porciones = explode(",", $q);
          
          
          switch ($porciones[0]) {

              case 'traerLTYareas':
                  $sql="SELECT 
                              ar.idLTYarea AS id, 
                              ar.areax AS area ,
                              ar.activo AS situacion,
                              ar.visible AS visible
                            FROM LTYarea ar 
                            WHERE ar.idLTYcliente = 7 
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
              print "Error!: ".$e->getMessage()."<br>";
              die();
          }
        }
        
        


        header("Content-Type: application/json; charset=utf-8");
        $datos = file_get_contents("php://input");
        // $datos = '{"q":"traerReportes","ruta":"/traerControles","rax":"&new=Sun Apr 07 2024 20:13:49 GMT-0300 (hora estándar de Argentina)","sql_i":null}';
        // $datos = '{"q":"traerSelects","ruta":"/traerLTYcontrol","rax":"&new=Fri May 24 2024 10:08:27 GMT-0300 (hora estándar de Argentina)","sql_i":null}';

        if (empty($datos)) {
          $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
          echo json_encode($response);
          exit;
        }
        $data = json_decode($datos, true);

        error_log('JSON response: ' . json_encode($data));

        if ($data !== null) {
          $q = $data['q'];
          $sql_i = $data['sql_i'];
          traer($q, $sql_i);
        } else {
          echo "Error al decodificar la cadena JSON";
        }
   
?>