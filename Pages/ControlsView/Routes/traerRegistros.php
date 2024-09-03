<?php

        $sql='';
        function traer($q, $sql_i) {
            // $variable=$_GET['q'];
            $porciones = explode(",", $q);
            $operacion = $porciones[0];
            
            switch ($operacion) {
              case 'traerControles':
                      $reporte = $porciones[1];
                      $sql="SELECT SQL_NO_CACHE LTYregistrocontrol.fecha,LTYregistrocontrol.nuxpedido,date_format(LTYregistrocontrol.hora,'%H:%i') as hora,LTYregistrocontrol.observacion,
                      usuario.nombre, RAND(),NOW()  
                      FROM LTYregistrocontrol 
                      INNER JOIN usuario ON LTYregistrocontrol.idusuario=usuario.idusuario
                      WHERE LTYregistrocontrol.idLTYreporte=".$reporte." 
                      GROUP BY LTYregistrocontrol.nuxpedido
                      ORDER BY LTYregistrocontrol.fecha DESC, LTYregistrocontrol.hora DESC LIMIT 1000;";
                break;

                case 'traerControlesFechas':
                      $reporte = $porciones[1];
                      $fechaInicial = $porciones[2];
                      $fechaActual = $porciones[3];
                      $sql="SELECT SQL_NO_CACHE LTYregistrocontrol.fecha,LTYregistrocontrol.nuxpedido,date_format(LTYregistrocontrol.hora,'%H:%i') as hora,LTYregistrocontrol.observacion,
                      usuario.nombre, RAND(),NOW()  
                      FROM LTYregistrocontrol 
                      INNER JOIN usuario ON LTYregistrocontrol.idusuario=usuario.idusuario
                      WHERE LTYregistrocontrol.idLTYreporte=".$reporte." AND 
                      LTYregistrocontrol.fecha>='".$fechaInicial."' AND LTYregistrocontrol.fecha<='".$fechaActual."' 
                      GROUP BY LTYregistrocontrol.nuxpedido
                      ORDER BY LTYregistrocontrol.fecha DESC, LTYregistrocontrol.hora DESC;";
                break;

                case 'NuevoControl':
                    $reporte = $porciones[1];
                    $sql="SELECT SQL_NO_CACHE 'ID',LTYcontrol.idLTYcontrol AS id, LTYcontrol.control AS CONTROL_1, LTYcontrol.nombre AS NOMBRE,'RELEVAMIENTO', LTYcontrol.tipodato AS TIPO, 
                    LTYcontrol.detalle AS DETALLE, 'OBSERVACION', LTYcontrol.visible AS VISIBLE, LTYcontrol.tpdeobserva AS TPDOBSV
                    ,LTYcontrol.requerido AS REQUERIDO
                    ,LTYcontrol.enable1 AS ENABLE, RAND(),NOW()
                    FROM LTYcontrol  
                    RIGHT JOIN LTYreporte ON LTYcontrol.idLTYreporte=LTYreporte.idLTYreporte
                    WHERE LTYcontrol.idLTYreporte=".$reporte."  AND LTYcontrol.activo='s'
                    ORDER BY orden ASC, idLTYcontrol ASC;";
                break;

                case 'ctrlCargado':
                  $reporte = $porciones[1];
                    $sql="SELECT SQL_NO_CACHE LTYregistrocontrol.fecha AS FECHA, LTYregistrocontrol.nuxpedido AS PEDIDO, LTYregistrocontrol.desvio AS DESVIO, LTYregistrocontrol.valor AS VALOR, 
                        LTYregistrocontrol.tipodedato AS TIPODEDATO, LTYregistrocontrol.idLTYcontrol AS IDCONTROL, LTYregistrocontrol.supervisor AS DISUPERVISOR, IF(LTYregistrocontrol.supervisor=0,'',u.nombre) AS NOMBRE_SUPERVISOR,
                        LTYregistrocontrol.tpdeobserva AS TIPO_OBSERVA,LTYregistrocontrol.observacion AS OBSERVACION
                  ,LTYregistrocontrol.idusuario
                        ,w.nombre AS NOMBRE_USUARIO
                      ,LTYcontrol.requerido AS REQUERIDO
                      , LTYcontrol.tiene_hijo AS HIJO,LTYregistrocontrol.imagenes AS IMG, LTYreporte.direcciones_mail AS DIR_MAIL
                      , RAND(),NOW(), LTYregistrocontrol.idLTYregistrocontrol AS ID, LTYcontrol.nombre AS NOMBRE
                        FROM LTYregistrocontrol
                        LEFT JOIN usuario u ON LTYregistrocontrol.supervisor=u.idusuario 
                        LEFT JOIN usuario w ON LTYregistrocontrol.idusuario=w.idusuario
                        INNER JOIN LTYcontrol ON LTYcontrol.idLTYcontrol=LTYregistrocontrol.idLTYcontrol
                        INNER JOIN LTYreporte ON LTYreporte.idLTYreporte=LTYregistrocontrol.idLTYreporte
                        WHERE LTYregistrocontrol.nuxpedido=".$reporte."   ORDER BY LTYcontrol.orden ASC, LTYregistrocontrol.idLTYcontrol ASC;";
                break;

                case 'controlNT':
                  $reporte = $porciones[1];
                  $sql = "SELECT DISTINCT r.idLTYreporte, r.nombre
                              FROM LTYregistrocontrol c
                              INNER JOIN LTYreporte r ON r.idLTYreporte = c.idLTYreporte
                              WHERE c.nuxpedido = ".$reporte.";";
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
            // include_once '../../../Routes/datos_base.php';
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
                // $cantidadcampos = mysqli_num_fields($result);
                // $contador = 0;
                // while($row=mysqli_fetch_array($result)) {
                    
                //     //******************************************** */
                //     for ($x = 0; $x <= $cantidadcampos-1; $x++) {
                //         $sincorchetes=$row[$x];
                //         $arr_customers[$contador][$x] = $row[$x];
                //     }
                //     $contador++;
                // }
                while ($row = mysqli_fetch_assoc($result)) {
                    $arr_customers[] = array_values($row);
                }
                $json = json_encode($arr_customers);
                echo $json;
                mysqli_close($con);
                // $pdo=null;
                
            } catch (\PDOException $e) {
               error_log("Error al traer registros. "  . $sql . " Error: " . $e);
                print "Error!: ".$e->getMessage()."<br>";
                die();
            }
        }



        header("Content-Type: application/json; charset=utf-8");
        require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
        $datos = file_get_contents("php://input");

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
          error_log('Pages/ControlsViews/Routes/traerRegistros-JSON response: ' . json_encode($data));
        }
   
?>