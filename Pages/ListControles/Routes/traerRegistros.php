<?php

        $sql='';

        function traer($q, $sql_i) {
          $porciones = explode(",", $q);
          
          
          switch ($porciones[0]) {

              case 'traerLTYcontrol':
                  $sql="SELECT 
                            UPPER(rep.nombre) AS reporte,
                            IFNULL(con.idLTYcontrol, '') AS id,
                            IFNULL(con.control, '') AS control,
                            IFNULL(con.nombre, '') AS nombre,
                            IFNULL(con.tipodato, '') AS tipodedato,
                            IFNULL(con.detalle, '') AS detalle,
                            IFNULL(con.activo, '') AS activo,
                             IFNULL(con.requerido, '') AS requerido,
                            IFNULL(con.visible, '') AS campo_visible,
                            IFNULL(con.enable1, '') AS enabled,
                            IFNULL(con.orden, '') AS orden,
                            IFNULL(con.separador, '') AS separador,
                            IFNULL(con.ok, '') AS oka,
                            IFNULL(con.valor_defecto, '') AS valorDefecto,
                            IFNULL(con.selector, '') AS selector,
                            IFNULL(con.tiene_hijo, '') AS tieneHijo,
                            IFNULL(con.rutina_hijo, '') AS rutinaHijo,
                            IFNULL(con.valor_sql, '') AS valorSql,
                            IFNULL(con.tpdeobserva, '') AS tipopdeobserva,
                            IFNULL(con.selector2, '') AS selector2,
                            IFNULL(con.valor_defecto22, '') AS valorDefecto22,
                            IFNULL(con.sql_valor_defecto22, '') AS sqlValorDefecto,
                            IFNULL(con.rutinasql, '') AS rutinaSql,
                            IFNULL(rep.idLTYreporte, '') AS idLTYreporte
                          FROM LTYreporte rep
                            LEFT JOIN LTYcontrol con ON con.idLTYreporte = rep.idLTYreporte
                          WHERE rep.activo = 's' and rep.idLTYcliente = ". $sql_i ."
                            ORDER BY rep.nombre ASC, con.orden ASC;";
              break;

              case 'traerTipoDeUsuario':
                $sql = "SELECT c.idtipousuario AS 'ID', c.tipo AS 'TIPO', c.detalle AS 'DETALLE' FROM tipousuario c ORDER BY c.idtipousuario ASC;";
              break;

              case 'traerSelects':
                $sql = "SELECT 
                            sel.selector AS selector,
                            sel.detalle AS con
                          FROM LTYselect sel 
                          WHERE sel.idLTYcliente = ". $sql_i ."
                          GROUP BY sel.detalle
                          ORDER BY sel.detalle ASC;";
              break;

              default:
                  # code...
                  break;
          }

          
          require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
          include_once BASE_DIR . "/Routes/datos_base.php";
          require_once dirname(dirname(dirname(__DIR__))) . '/ErrorLogger.php';
          ErrorLogger::initialize(dirname(dirname(dirname(__DIR__))) . '/logs/error.log');
          if (isset($_SESSION['timezone'])) {
              date_default_timezone_set($_SESSION['timezone']);
          } else {
              date_default_timezone_set('America/Argentina/Buenos_Aires');
          }
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
              error_log("Error al traer registros. Error: " . $sql . " Cliente: " . $sql_i);
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

        

        if ($data !== null) {
          $q = $data['q'];
          $sql_i = $data['sql_i'];
          traer($q, $sql_i);
        } else {
          echo "Error al decodificar la cadena JSON";
          error_log('Pages/ListControles/Routes/traerRegistros-JSON response: ' . json_encode($data));
        }
   
?>