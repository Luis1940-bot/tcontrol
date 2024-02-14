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
        $consulta = $porciones[0];
        
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

            default:
                # code...
                break;
        }

        
        include_once '../../../Routes/datos_base.php';
        $pdo = new PDO("mysql:host={$host};dbname={$dbname};port={$port};chartset={$charset}",$user,$password);

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