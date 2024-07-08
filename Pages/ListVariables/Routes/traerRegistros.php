<?php

        $sql='';

        function traer($q, $sql_i) {
          $porciones = explode(",", $q);
          
          
          switch ($porciones[0]) {

              case 'traerVariables':
                  $sql="SELECT SQL_NO_CACHE LTYselect.idLTYselect, LTYselect.detalle, LTYselect.concepto, LTYselect.activo
                            ,LTYselect.selector, LTYselect.orden, LTYselect.nivel, RAND(),NOW() 
                            FROM LTYselect 
                            WHERE LTYselect.idLTYcliente = ". $sql_i ."
                            ORDER BY LTYselect.detalle ASC;";
              break;

              case 'traerSelectReporte':
                $sql="SELECT 
                          SQL_NO_CACHE 
                          sRep.idLTYselectReporte,
                          sRep.selector,
                          sRep.idLTYreporte,
                          rep.nombre AS reporteNombre,
                          sRep.idusuario,
                          tu.tipo AS tipoUsuario,
                          sRep.activo
                        FROM 
                          LTYselectReporte sRep
                          INNER JOIN LTYreporte rep ON rep.idLTYreporte = sRep.idLTYreporte
                          INNER JOIN tipousuario tu ON tu.idtipousuario = sRep.idusuario
                        WHERE 
                          rep.idLTYreporte = ". $sql_i ." AND
                          rep.activo = 's';";
              break;

              case 'traerReporteParaVincular':
                $sql = "SELECT 
                            SQL_NO_CACHE 
                            rep.idLTYreporte AS id,
                            rep.nombre AS reporte,
                            rep.nivel AS tUsuario,
                            tUsu.tipo AS tipo
                          FROM 
                            LTYreporte rep
                            INNER JOIN tipousuario tUsu ON tUsu.idtipousuario = rep.nivel
                          WHERE 
                            rep.idLTYreporte = ". $sql_i ." AND
                            rep.activo = 's'
                          ORDER BY reporte ASC;";
              break;
              
              default:
                  # code...
                  break;
          }

          
          require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
          include_once BASE_DIR . "/Routes/datos_base.php";
          // include_once $_SERVER['DOCUMENT_ROOT']."/Routes/datos_base.php";
          // $pdo = new PDO("mysql:host={$host};dbname={$dbname};port={$port};chartset={$charset}",$user,$password);

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