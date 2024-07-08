<?php
mb_internal_encoding('UTF-8');

function traerControlActualizado($conn, $plant) {
    $sql = "SELECT SQL_NO_CACHE
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
            WHERE rep.activo = 's' AND rep.idLTYcliente = " . $plant . "
            ORDER BY rep.nombre ASC, con.orden ASC;";
    
    try {
     
        
        // mysqli_set_charset($conn, 'utf8mb4');
        // mysqli_query ($conn,"SET NAMES 'utf8'");
        // mysqli_select_db($conn,$dbname);
        $result = mysqli_query($conn, $sql);
        if (!$result) {
            throw new Exception("Error en la consulta SQL: " . mysqli_error($conn));
        }

        $arr_customers = [];
        // while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        //     $arr_customers[] = $row; //mb_convert_encoding($row, 'UTF-8', 'auto');
        // }
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
           
        $json = json_encode(array('success' => true, 'data' => json_encode($arr_customers)), JSON_UNESCAPED_UNICODE);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("Error al codificar JSON: " . json_last_error_msg());
        }
    
        return $json;

    } catch (Exception $e) {
        $errorJson = json_encode(array('success' => false, 'message' => $e->getMessage()));
        // echo $errorJson;
        return $errorJson;
    }
}

if (isset($_POST['traerLTYcontrol']) && $_POST['traerLTYcontrol'] === true) {
    header("Content-Type: application/json;charset=utf-8");
    // require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
    // include_once BASE_DIR . "/Routes/datos_base.php";
    // $conn = mysqli_connect($host, $user, $password, $dbname);
    // mysqli_query ($conn,"SET NAMES 'utf8'");
    // mysqli_select_db($conn,$dbname);
    if (!$conn) {
        die('Could not connect: ' . mysqli_error($con));
    };

    if ($conn && !$conn->connect_error) {
         traerControlActualizado($conn, $plant);
    } else {
        echo json_encode(['success' => false, 'message' => 'Conexión a la base de datos no válida.']);
    }

}
?>
