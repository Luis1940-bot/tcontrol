<?php
mb_internal_encoding('UTF-8');
function traerControlActualizado($conn) {

    $sql="SELECT SQL_NO_CACHE
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
            WHERE rep.activo = 's'
              ORDER BY rep.nombre ASC, con.orden ASC;";

  try {
      $result = mysqli_query($conn,$sql);
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
      return $json;
      // mysqli_close($conn);
      // $pdo=null;
      
  } catch (\PDOException $e) {
      print "Error!: ".$e->getMessage()."<br>";
      die();
  }
  
}



if (isset($_POST['traerLTYcontrol']) && $_POST['traerLTYcontrol'] === true) {
    // Si es así, realiza las operaciones deseadas

    header("Content-Type: text/html;charset=utf-8");
  if (isset($conn) && is_string($conn)) {
        traerControlActualizado($conn);
    }
    

}
   
?>