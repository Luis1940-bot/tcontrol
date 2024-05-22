<?php

        $sql='';

        function traer($q, $sql_i) {
          $porciones = explode(",", $q);
          
          
          switch ($porciones[0]) {

              case 'traerLTYcontrol':
                  $sql="SELECT SQL_NO_CACHE
                            UPPER(rep.nombre) AS reporte,
                            IFNULL(con.idLTYcontrol, '') AS id,
                            IFNULL(con.control, '') AS control,
                            IFNULL(con.nombre, '') AS nombre,
                            IFNULL(con.tipodato, '') AS tipodedato,
                            IFNULL(con.selector, '') AS selector,
                            IFNULL(con.detalle, '') AS detalle,
                            IFNULL(con.tpdeobserva, '') AS tipopdeobserva,
                            IFNULL(con.selector2, '') AS selector2,
                            IFNULL(rep.idLTYreporte, '') AS idLTYreporte,
                            IFNULL(con.orden, '') AS orden,
                            IFNULL(con.activo, '') AS activo,
                            IFNULL(con.visible, '') AS campo_visible,
                            IFNULL(con.ok, '') AS oka,
                            IFNULL(con.separador, '') AS separador,
                            IFNULL(con.rutinasql, '') AS rutinaSql,
                            IFNULL(con.valor_defecto, '') AS valorDefecto,
                            IFNULL(con.valor_defecto22, '') AS valorDefecto22,
                            IFNULL(con.sql_valor_defecto22, '') AS sqlValorDefecto,
                            IFNULL(con.valor_sql, '') AS valorSql,
                            IFNULL(con.requerido, '') AS requerido,
                            IFNULL(con.tiene_hijo, '') AS tieneHijo,
                            IFNULL(con.rutina_hijo, '') AS rutinaHijo,
                            IFNULL(con.enable1, '') AS enabled
                          FROM LTYreporte rep
                            LEFT JOIN LTYcontrol con ON con.idLTYreporte = rep.idLTYreporte
                          WHERE rep.activo = 's'
                            ORDER BY rep.nombre ASC;";
              break;

              case 'traerTipoDeUsuario':
                $sql = "SELECT c.idtipousuario AS 'ID', c.tipo AS 'TIPO', c.detalle AS 'DETALLE' FROM tipousuario c ORDER BY c.idtipousuario ASC;";
              break;

              case 'traerAreas':
                $sql = "SELECT c.idLTYarea AS 'ID', c.areax AS 'AREA' FROM LTYarea c WHERE c.activo='s' ORDER BY c.areax ASC;";
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
        // $datos = '{"q":"verificarControl,240408142616477","ruta":"/traerControles","rax":"&new=Tue Apr 09 2024 17:06:49 GMT-0300 (hora estándar de Argentina)","sql_i":null}';

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