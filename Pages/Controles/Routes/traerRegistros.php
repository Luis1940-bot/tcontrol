<?php
  // header('Content-Type: text/html;charset=utf-8');
  // session_start();
  // mb_internal_encoding('UTF-8');
  // if (!isset($_SESSION['login_sso']['email'] )) {
  //     unset($_SESSION['login_sso']['email'] ); 
  //     header("Location: /");
  //   exit;
  // }

        // $variable=$_GET['q'];
        // $new=$_GET['new'];   
        $sql='';

        function traer($q, $sql_i) {
          $porciones = explode(",", $q);
          
          
          switch ($porciones[0]) {

              case 'traerReportes':
                  $sql="SELECT  SQL_NO_CACHE LTYreporte.nombre, LTYreporte.idLTYreporte, LTYreporte.detalle 
                  ,IFNULL((SELECT MAX(LTYregistrocontrol.fecha) FROM LTYregistrocontrol WHERE  LTYregistrocontrol.idLTYreporte=LTYreporte.idLTYreporte),'.')  AS ULTIMA_FECHA
                  ,LTYreporte.rotulo1 AS CIA, LTYreporte.elaboro, LTYreporte.reviso, LTYreporte.aprobo, LTYreporte.regdc, LTYreporte.vigencia, LTYreporte.cambio
                  ,LTYreporte.modificacion, LTYreporte.version,LTYreporte.rotulo3,LTYreporte.nivel,LTYreporte.envio_mail
                  ,IFNULL((SELECT MIN(LTYregistrocontrol.fecha) FROM LTYregistrocontrol WHERE  LTYregistrocontrol.idLTYreporte=LTYreporte.idLTYreporte),'.')  AS PRIMERA_FECHA
                  , RAND(),NOW()
                  , tipousuario.tipo AS nivel
                  FROM LTYreporte
                  LEFT JOIN tipousuario ON tipousuario.idtipousuario=LTYreporte.nivel  
                  WHERE LTYreporte.activo='s' ORDER BY LTYreporte.nombre ASC;";
              break;

              case 'verificarControl':
                $nuxpedido = $porciones[1];
                $sql="SELECT SQL_NO_CACHE DISTINCT(c.idLTYreporte) AS reporte, LTYreporte.nombre 
                FROM LTYregistrocontrol c 
                INNER JOIN LTYreporte ON LTYreporte.idLTYreporte=c.idLTYreporte
                WHERE c.nuxpedido='".$nuxpedido."';";
              break;

              default:
                  # code...
                  break;
          }

          
          // include_once '../../../Routes/datos_base.php';
          include_once $_SERVER['DOCUMENT_ROOT']."/Routes/datos_base.php";
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