<?php
  header('Content-Type: text/html;charset=utf-8');
  session_start();
  if (!isset($_SESSION['factum_validation']['email'] )) {
      unset($_SESSION['factum_validation']['email'] ); 
  }

        $variable=$_GET['q'];
        $new=$_GET['new'];   
        $sql='';
        ;
        
        $porciones = explode(",", $variable);
        
        switch ($porciones[0]) {

            case 'empresa':
                $sql='SELECT c.cliente FROM LTYcliente c;';
            break;

            case 'NuevoControl':
                $sql="SELECT  SQL_NO_CACHE 'ID',LTYcontrol.idLTYcontrol AS id, LTYcontrol.control AS CONTROL_1, LTYcontrol.nombre AS NOMBRE,'RELEVAMIENTO', LTYcontrol.tipodato AS TIPO, 
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
                $sql="SELECT SQL_NO_CACHE LTYselect.idLTYselect AS ID, LTYselect.concepto AS CONCEPT, LTYselect.selector AS SELEC, LTYselect.detalle AS DETALLE, RAND(),NOW()
                FROM LTYselectReporte 
                INNER JOIN LTYselect ON LTYselectReporte.selector=LTYselect.selector
                WHERE LTYselect.activo='s' AND LTYselectReporte.idLTYreporte=".$porciones[1]." ORDER BY LTYselect.orden ASC;";
            break;

            case 'ctrlCargado':
                $control_cargado=$porciones[1];
                $sql="SELECT SQL_NO_CACHE LTYregistrocontrol.fecha AS FECHA, LTYregistrocontrol.nuxpedido AS PEDIDO, LTYregistrocontrol.desvio AS DESVIO, LTYregistrocontrol.valor AS VALOR, 
                    LTYregistrocontrol.tipodedato AS TIPODEDATO, LTYregistrocontrol.idLTYcontrol AS IDCONTROL, LTYregistrocontrol.supervisor AS DISUPERVISOR, IF(LTYregistrocontrol.supervisor=0,'',u.nombre) AS NOMBRE_SUPERVISOR,
                    LTYregistrocontrol.tpdeobserva AS TIPO_OBSERVA,LTYregistrocontrol.observacion AS OBSERVACION,LTYregistrocontrol.selector AS SELECTOR,LTYregistrocontrol.selector2 AS SELECTOR_2,
                    LTYregistrocontrol.valorS,LTYregistrocontrol.valorOBS,LTYregistrocontrol.idusuario
                    ,w.nombre AS NOMBRE_USUARIO
                  ,IFNULL(LTYcontrol.rutinasql,'') AS RUTINA, IFNULL(LTYcontrol.valor_defecto,'') AS VALOR_DEFECTO
                  ,LTYcontrol.requerido AS REQUERIDO,LTYreporte.envio_mail AS X_MAIL,LTYcontrol.valor_sql AS VALOR_SQL
                  , LTYcontrol.tiene_hijo AS HIJO, LTYcontrol.rutina_hijo AS SQL_HIJO,LTYregistrocontrol.imagenes AS IMG, LTYreporte.direcciones_mail AS DIR_MAIL
                  , RAND(),NOW(), LTYregistrocontrol.idLTYregistrocontrol AS ID
                    FROM LTYregistrocontrol
                    LEFT JOIN usuarios u ON LTYregistrocontrol.supervisor=u.idusuario 
                    LEFT JOIN usuarios w ON LTYregistrocontrol.idusuario=w.idusuario
                    INNER JOIN LTYcontrol ON LTYcontrol.idLTYcontrol=LTYregistrocontrol.idLTYcontrol
                    INNER JOIN LTYreporte ON LTYreporte.idLTYreporte=LTYregistrocontrol.idLTYreporte
                    WHERE LTYregistrocontrol.nuxpedido=".$control_cargado." ORDER BY LTYcontrol.orden ASC, LTYregistrocontrol.idLTYcontrol ASC;";
                // echo $sql.'<br><br>';".$control_cargado."
            break;

            case 'img21':
                $sql="SELECT SQL_NO_CACHE LTYimage.idLTYimage, LTYimage.idLTYreporte, LTYimage.imagen, LTYimage.altura,
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
                              (c.tipodato NOT IN (TRIM('cn'), TRIM('btnQwery')))
                              AND (c.tpdeobserva NOT IN (TRIM('cn'), TRIM('btnQwery')))
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
              
                $sql=$_GET['sql'];
                $sql = str_replace("+","%2B",$sql);
                $sql = urldecode($sql);
              
            break;

            default:
                # code...
                break;
        }

        
        include_once '../../../Routes/datos_base.php';
        $pdo = new PDO("mysql:host={$host};dbname={$dbname};port={$port};chartset={$chartset}",$user,$password);

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
            print "Error!: ".$e->getMessage()."<br>";
            die();
        }
   
?>