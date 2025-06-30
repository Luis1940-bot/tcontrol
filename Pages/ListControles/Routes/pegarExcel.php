<?php
// Archivo: pegarExcelConConsulta.php
require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
$baseDir = BASE_DIR;
include_once $baseDir . "/Routes/datos_base.php";

// ✅ Función para generar código correctamente
function generarCodigoAlfabetico(string $reporte, int $orden): string
{
  $reporte = mb_convert_encoding($reporte, 'UTF-8', mb_detect_encoding($reporte, 'UTF-8, ISO-8859-1, ISO-8859-15', true));
  $reporte = preg_replace('/[^\p{L}\p{N}\s-]/u', '', $reporte);
  $palabras = preg_split('/[\s-]+/u', $reporte);

  $codigoBase = '';
  foreach ($palabras as $palabra) {
    $codigoBase .= strtolower(mb_substr($palabra, 0, 2, 'UTF-8'));
  }

  $codigoBase = substr($codigoBase, 0, 6);
  $ordenStr = str_pad((int) $orden, 4, "0", STR_PAD_LEFT);
  $hash = substr(md5($reporte . $orden), 0, 5);

  return strtolower(substr($codigoBase . $ordenStr . $hash, 0, 15));
}

// ✅ Definir valores predeterminados
$idLTYreporte = isset($_GET['idLTYreporte']) ? intval($_GET['idLTYreporte']) : 0;
$nombreReporte = "Desconocido";
$ultimoOrden = 0;
$datos = [];
$nombreCliente = "Desconocido";
$idCliente = 0;

if ($idLTYreporte > 0) {
  $mysqli = new mysqli($host, $user, $password, $dbname, $port);
  if ($mysqli->connect_error) {
    die("Error de conexión: " . $mysqli->connect_error);
  }
  mysqli_set_charset($mysqli, "utf8mb4");

  // ✅ Consulta SQL para obtener datos del reporte y calcular el último orden
  $query = "
        SELECT c.idLTYcontrol, c.control, c.detalle, c.tipodato, c.tpdeobserva, c.orden, r.nombre AS nombre_reporte, c.idLTYcliente AS id_cliente, t.cliente AS nombre_cliente
        FROM LTYcontrol c
        INNER JOIN LTYreporte r ON c.idLTYreporte = r.idLTYreporte
        INNER JOIN LTYcliente t ON c.idLTYcliente = t.idLTYcliente
        WHERE c.idLTYreporte = $idLTYreporte
        ORDER BY c.orden ASC
    ";

  $result = $mysqli->query($query);

  if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
      $datos[] = $row;
      $ultimoOrden = max($ultimoOrden, $row['orden']);
      $nombreReporte = $row['nombre_reporte'];
      $nombreCliente = $row['nombre_cliente'];
      $idCliente = $row['id_cliente'];
    }
  } else {
    error_log("⚠️ Advertencia: No se encontraron registros en LTYcontrol para idLTYreporte: $idLTYreporte");
  }

  $mysqli->close();
}

$nombreReporteJS = json_encode($nombreReporte);
$ultimoOrdenJS = json_encode($ultimoOrden);
?>

<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pegar Datos desde Excel</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
      text-align: center;
    }

    .container {
      width: 90%;
      margin: auto;
    }

    input,
    button {
      padding: 8px;
      font-size: 16px;
      border-radius: 5px;
      margin-bottom: 10px;
    }

    input {
      width: 95%;
      border: 1px solid #ccc;
      text-align: center;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    th,
    td {
      border: 1px solid black;
      padding: 8px;
      text-align: left;
    }

    th {
      background-color: #f2f2f2;
    }

    .btn {
      background-color: #007bff;
      color: white;
      border: none;
      cursor: pointer;
    }

    .btn:hover {
      background-color: #0056b3;
    }

    .flex-container {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }

    .textarea-container {
      flex: 1;
      min-width: 22%;
      margin: 5px;
    }

    textarea {
      width: 100%;
      height: 120px;
      padding: 8px;
      font-size: 14px;
      border: 1px solid #ccc;
      border-radius: 5px;
      resize: none;
    }

    .cliente-info h3 {
      display: inline-block;
      margin-right: 10px;
      /* Espaciado entre los elementos */
    }
  </style>
</head>

<body>

  <div class="container">
    <h2>Pegar Datos desde Excel</h2>

    <form id="reporteForm" method="GET">
      <label>Ingrese el ID del Reporte:</label>
      <input type="number" id="idLTYreporte" name="idLTYreporte" value="<?php echo htmlspecialchars($idLTYreporte); ?>">
      <button type="submit" class="btn">Buscar Reporte</button>
    </form>

    <h3>Reporte: <?php echo htmlspecialchars($nombreReporte); ?></h3>
    <div class="cliente-info">
      #<h3 id="idCliente"><?php echo htmlspecialchars($idCliente); ?></h3>
      <h3 id="nombreCliente">Cliente: <?php echo htmlspecialchars($nombreCliente); ?></h3>
    </div>


    <h4>Última Observación: <?php echo $ultimoOrden; ?></h4>

    <h3>Registros Existentes</h3>
    <table id="tablaExistente">
      <thead>
        <tr>
          <th>ID Control</th>
          <th>Control</th>
          <th>Detalle</th>
          <th>Tipo Dato</th>
          <th>Tp Observa</th>
          <th>Orden</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($datos as $dato): ?>
          <tr>
            <td><?php echo $dato['idLTYcontrol']; ?></td>
            <td><?php echo $dato['control']; ?></td>
            <td><?php echo $dato['detalle']; ?></td>
            <td><?php echo $dato['tipodato']; ?></td>
            <td><?php echo $dato['tpdeobserva']; ?></td>
            <td><?php echo $dato['orden']; ?></td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>

    <h3>Nuevos Datos</h3>
    <div class="flex-container">
      <textarea id="campoInput" placeholder="Pegar Campos"></textarea>
      <textarea id="detalleInput" placeholder="Pegar Detalles"></textarea>
      <textarea id="tipoDatoInput" placeholder="Pegar Tipo Dato"></textarea>
      <textarea id="tpObservaInput" placeholder="Pegar Tp Observa"></textarea>
    </div>

    <button class="btn" id="procesarBtn" onclick="procesarDatos($ultimoOrdenJS)">Procesar</button>
    <button class="btn" id="limpiarBtn" onclick="limpiarDatos()">Limpiar</button>


    <h3>Datos Procesados</h3>
    <table id="dataTable">
      <thead>
        <tr>
          <th>#</th>
          <th>Campo</th>
          <th>Detalle</th>
          <th>Tipo Dato</th>
          <th>Tp Observa</th>
          <th>Orden</th>
          <th>Código Generado</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>
  <hr>
  <div><button class="btn" id="guardarBtn">Guardar en Base de Datos</button>
  </div>
  <script>
    window.ultimoOrdenJS = <?php echo json_encode($ultimoOrden); ?>;
    window.nombreReporteJS = <?php echo json_encode($nombreReporte); ?>;
  </script>
  <script src="../../../controllers/crypto-js.min.js"></script>
  <script type='module' src='../Modules/Controladores/pegarExcel.js?v=<?php echo (time()); ?>'></script>

</body>

</html>