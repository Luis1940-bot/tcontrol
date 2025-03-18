<?php
// ini_set('display_errors', '1');
// ini_set('display_startup_errors', '1');
// error_reporting(E_ALL);
mb_internal_encoding('UTF-8');
ErrorLogger::initialize(dirname(dirname(dirname(__DIR__))) . '/logs/error.log');
/** 
 * @var array{timezone?: string} $_SESSION 
 */
if (isset($_SESSION['timezone']) && is_string($_SESSION['timezone'])) {
  date_default_timezone_set($_SESSION['timezone']);
} else {
  date_default_timezone_set('America/Argentina/Buenos_Aires');
}

function traerControlActualizado(mysqli $conn, int $plant): string
{
  $sql = "SELECT 
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
                IFNULL(rep.idLTYreporte, '') AS idLTYreporte,
                IFNULL(con.tipoDatoDetalle, '') AS tipoDatoDetalle
            FROM LTYreporte rep
            LEFT JOIN LTYcontrol con ON con.idLTYreporte = rep.idLTYreporte
            WHERE rep.activo = 's' AND rep.idLTYcliente = ?
            ORDER BY rep.nombre ASC, con.orden ASC;";

  try {
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
      throw new Exception("Error al preparar la consulta: " . $conn->error);
    }

    // ✅ Usar `bind_param` para evitar inyección SQL
    $stmt->bind_param("i", $plant);
    $stmt->execute();
    $result = $stmt->get_result();

    if (!$result) {
      throw new Exception("Error en la consulta SQL: " . $conn->error);
    }

    $arr_customers = [];
    $cantidadcampos = mysqli_num_fields($result);

    $contador = 0;
    while ($row = mysqli_fetch_array($result)) {
      //******************************************** */
      for ($x = 0; $x <= $cantidadcampos - 1; $x++) {
        $sincorchetes = $row[$x];
        $arr_customers[$contador][$x] = $row[$x];
      }
      $contador++;
    }

    $stmt->close();


    $json = json_encode(array('success' => true, 'data' => json_encode($arr_customers)), JSON_UNESCAPED_UNICODE);

    return $json !== false ? $json : '{"success":false,"message":"Error desconocido al codificar JSON"}';
  } catch (Exception $e) {
    $errorJson = json_encode(['success' => false, 'message' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
    return $errorJson !== false ? $errorJson : '{"success":false,"message":"Error desconocido al codificar JSON"}';
  }
}
if (isset($_POST['traerLTYcontrol']) && $_POST['traerLTYcontrol'] === true) {
  header("Content-Type: application/json;charset=utf-8");

  // 📌 Verificar que `$conn` ya está disponible antes de usarlo
  if (!isset($conn) || !$conn instanceof mysqli) {
    die(json_encode(['success' => false, 'message' => 'Error: Conexión no válida o no establecida.'], JSON_UNESCAPED_UNICODE));
  }

  // 📌 Verificar si la conexión es válida antes de ejecutar la consulta
  if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Conexión a la base de datos no válida: ' . $conn->connect_error], JSON_UNESCAPED_UNICODE);
    exit;
  }

  // 📌 Ejecutar la función con la conexión existente
  // $plant = $plant ?? 0; // Asignar valor predeterminado si `$plant` no está definido
  $plant = isset($_POST['plant']) && is_numeric($_POST['plant']) ? (int) $_POST['plant'] : 0;


  traerControlActualizado($conn, (int) $plant);
}
