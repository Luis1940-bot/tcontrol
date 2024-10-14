<?php
  // header('Content-Type: text/html;charset=utf-8');
  // session_start();
  // if (!isset($_SESSION['login_sso']['email'] )) {
  //     unset($_SESSION['login_sso']['email'] ); 
  // }
        // include('datos.php');
        $sql='';
        
        function traer($q, $sql_i) {
          $porciones = explode(",", $q);
                  switch ($porciones[0]) {

                      case 'empresa':
                          $sql="SELECT c.cliente FROM LTYcliente c WHERE c.idLTYcliente =".$sql_i.";";
                      break;

                      case 'NuevoControl':
                          $sql="SELECT   'ID',LTYcontrol.idLTYcontrol AS id, LTYcontrol.control AS CONTROL_1, LTYcontrol.nombre AS NOMBRE,'RELEVAMIENTO', LTYcontrol.tipodato AS TIPO, 
                          LTYcontrol.detalle AS DETALLE, 'OBSERVACION', LTYcontrol.visible AS VISIBLE, LTYcontrol.tpdeobserva AS TPDOBSV,'valorOBS','idselector1', LTYcontrol.selector AS SELECTOR, 'valorSEL','idselector2',
                          LTYcontrol.selector2 AS SELECTOR2,'valorSEL2', LTYcontrol.separador AS SEPARADOR, LTYreporte.botonesaccion, IFNULL(LTYcontrol.rutinasql,'') AS RUTINA, IFNULL(LTYcontrol.valor_defecto,'') AS VALOR_DEFECTO
                          ,LTYcontrol.requerido AS REQUERIDO,LTYreporte.envio_mail AS X_MAIL,LTYcontrol.valor_sql AS VALOR_SQL
                          , LTYcontrol.tiene_hijo AS HIJO, LTYcontrol.rutina_hijo AS SQL_HIJO, LTYcontrol.valor_defecto22 AS VALOR_DEFECTO22, LTYcontrol.sql_valor_defecto22 AS SQL_VALOR_DEFECTO22, LTYreporte.direcciones_mail AS DIR_MAIL
                          ,LTYcontrol.enable1 AS ENABLE, RAND(),NOW(),'idLTY'
                          FROM LTYcontrol  
                          RIGHT JOIN LTYreporte ON LTYcontrol.idLTYreporte=LTYreporte.idLTYreporte
                          WHERE LTYcontrol.idLTYreporte=".$porciones[1]."  AND LTYcontrol.activo='s'
                          ORDER BY orden ASC, idLTYcontrol ASC;";
                      break;

                      case 'Selectores':
                          // SE USA PARA LA CARGA DE LOS SELECTORES
                          $sql="SELECT  LTYselect.idLTYselect AS ID, LTYselect.concepto AS CONCEPT, LTYselect.selector AS SELEC, LTYselect.detalle AS DETALLE, RAND(),NOW()
                          FROM LTYselectReporte 
                          INNER JOIN LTYselect ON LTYselectReporte.selector=LTYselect.selector
                          WHERE LTYselect.activo='s' AND LTYselectReporte.idLTYreporte=".$porciones[1]." ORDER BY LTYselect.orden ASC;";
                      break;

                      case 'ctrlCargado':
                          $control_cargado=$porciones[1];
                          $sql="SELECT  LTYregistrocontrol.fecha AS FECHA, LTYregistrocontrol.hora AS HORA, LTYregistrocontrol.nuxpedido AS PEDIDO, 
                              LTYregistrocontrol.supervisor AS DISUPERVISOR, IF(LTYregistrocontrol.supervisor=0,'',u.nombre) AS NOMBRE_SUPERVISOR,
                              LTYregistrocontrol.observacion AS OBSERVACION,
                              LTYregistrocontrol.idusuario
                              ,w.nombre AS NOMBRE_USUARIO
                            ,LTYreporte.envio_mail AS X_MAIL,LTYregistrocontrol.imagenes AS IMG, LTYreporte.direcciones_mail AS DIR_MAIL
                            , RAND(),NOW(), LTYregistrocontrol.idLTYregistrocontrol AS ID, LTYregistrocontrol.newJSON AS newJSON
                              FROM LTYregistrocontrol
                              LEFT JOIN usuario u ON LTYregistrocontrol.supervisor=u.idusuario 
                              LEFT JOIN usuario w ON LTYregistrocontrol.idusuario=w.idusuario
                              INNER JOIN LTYreporte ON LTYreporte.idLTYreporte=LTYregistrocontrol.idLTYreporte
                              WHERE LTYregistrocontrol.nuxpedido=".$control_cargado.";";
                          // echo $sql.'<br><br>';".$control_cargado."
                      break;

                      case 'img21':
                          $sql="SELECT  LTYimage.idLTYimage, LTYimage.idLTYreporte, LTYimage.imagen, LTYimage.altura,
                          LTYimage.ancho, LTYimage.tipo, LTYimage.orden, LTYimage.detalle, RAND(),NOW()
                          FROM LTYimage
                          WHERE LTYimage.activo='s'
                          ORDER BY LTYimage.orden ASC;";
                      break;

                      case 'countSelect':
                          $sql="SELECT COUNT(*)
                                    FROM LTYcontrol c
                                    WHERE c.idLTYreporte = ".$porciones[1]."
                                      AND (
                                        (c.tipodato NOT IN (TRIM('cn'), TRIM('btnqwery')))
                                        AND (c.tpdeobserva NOT IN (TRIM('cn'), TRIM('btnqwery')))
                                        AND (c.activo = 's')
                                        AND (c.visible = 's')
                                      )
                                      AND (
                                        c.rutinasql LIKE 'SELECT%'
                                        OR c.valor_defecto LIKE 'SELECT%'
                                        OR c.valor_defecto22 LIKE 'SELECT%'
                                        OR c.sql_valor_defecto22 LIKE 'SELECT%'
                                        OR c.valor_sql LIKE 'SELECT%'
                                      );";
                      break;

                      case 'traer_LTYsql':
                        
                          $sql=$sql_i; //$_GET['sql'];
                          $sql = str_replace("+","%2B",$sql);
                          $sql = urldecode($sql);
                        // echo $sql.'<br>';
                      break;

                      default:
                          # code...
                          break;
                  }

                  
                  include_once BASE_DIR . "/Routes/datos_base.php";
                  require_once dirname(dirname(dirname(__DIR__))) . '/ErrorLogger.php';
                  ErrorLogger::initialize(dirname(dirname(dirname(__DIR__))) . '/logs/error.log');
                  if (isset($_SESSION['timezone'])) {
                      date_default_timezone_set($_SESSION['timezone']);
                  } else {
                      date_default_timezone_set('America/Argentina/Buenos_Aires');
                  }
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
                      $pdo=null;
                      
                  } catch (\PDOException $e) {
                       error_log("Error al traer registros. Consulta: " . $sql);
                      print "Error!: ".$e->getMessage()."<br>";
                      die();
                  }
        }
        
        

        header("Content-Type: application/json; charset=utf-8");
        require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
        $datos = file_get_contents("php://input");
        $datos = '{"q":"traer_LTYsql","ruta":"/traerRegistros","rax":"&new=Sun Oct 13 2024 09:23:52 GMT-0600 (hora estándar central)","sql_i":"SET%20%40sql%20%3D%20%0D%0A%20%20%20%20SELECT%0D%0A%20%20%20%20%20%20%20%20CONCAT(%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%22DOC%20%22%2C%20reg.nuxpedido%2C%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20STR_TO_DATE(JSON_UNQUOTE(JSON_EXTRACT(newJSON%2C%20%22%24.valor%5B0%5D%22))%2C%20%22%25Y-%25m-%25d%22)%2C%20%22%20%22%2C%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20JSON_UNQUOTE(JSON_EXTRACT(newJSON%2C%20%22%24.valor%5B1%5D%22))%2C%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Usuario%20%22%2C%20usuario.nombre%2C%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20JSON_UNQUOTE(JSON_EXTRACT(newJSON%2C%20%22%24.valor%5B5%5D%22))%0D%0A%20%20%20%20%20%20%20%20)%20AS%20HISTORIAL%0D%0A%20%20%20%20FROM%20LTYregistrocontrol%20reg%0D%0A%20%20%20%20INNER%20JOIN%20usuario%20ON%20usuario.idusuario%20%3D%20reg.idusuario%0D%0A%20%20%20%20WHERE%20reg.idLTYreporte%20%3D%2062%0D%0A%20%20%20%20ORDER%20BY%20%0D%0A%20%20%20%20%20%20%20%20STR_TO_DATE(JSON_UNQUOTE(JSON_EXTRACT(newJSON%2C%20%22%24.valor%5B0%5D%22))%2C%20%22%25Y-%25m-%25d%22)%20ASC%2C%0D%0A%20%20%20%20%20%20%20%20JSON_UNQUOTE(JSON_EXTRACT(newJSON%2C%20%22%24.valor%5B1%5D%22))%20ASC%0D%0A%3B%0D%0A%0D%0A--%20Preparar%20y%20ejecutar%20la%20consulta%20din%C3%A1mica%0D%0APREPARE%20stmt%20FROM%20%40sql%3B%0D%0AEXECUTE%20stmt%3B%0D%0ADEALLOCATE%20PREPARE%20stmt%3B"}';

        if (empty($datos)) {
          $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
          echo json_encode($response);
          exit;
        }
        $data = json_decode($datos, true);

        

        if ($data !== null) {
          $q = $data['q'];
          $sql_i = urldecode($data['sql_i']);
          traer($q, $sql_i);
        } else {
          echo "Error al decodificar la cadena JSON";
          error_log('Control/Routes/traerRegistros-JSON response: ' . json_encode($data));
        }
   
?>