<?php
// ini_set('display_errors', '1');
// ini_set('display_startup_errors', '1');
// error_reporting(E_ALL);

require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
/** @var string $baseDir */
$baseDir = BASE_DIR;

include_once BASE_DIR . "/Routes/datos_base.php";
/** @var string $charset */
/** @var string $dbname */
/** @var string $host */
/** @var int $port */
/** @var string $password */
/** @var string $user */
/** @var PDO $pdo */
// $host = "34.174.211.66";
// $user = "uumwldufguaxi";
// $password = "5lvvumrslp0v";
// $dbname = "db5i8ff3wrjzw3";
// $port = 3306;
$charset = "utf8mb4";
$mysqli = new mysqli($host, $user, $password, $dbname, $port);
if ($mysqli->connect_error) {
  die(json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos.']));
}

mysqli_set_charset($mysqli, "utf8mb4");

// 📌 Modo API: Si se llama con AJAX, devolver solo JSON
if (isset($_GET['ajax']) && $_GET['ajax'] == '1') {
  $query = "
      SELECT l.nuxpedido, l.fecha, l.hora, l.idusuario, l.idLTYreporte, 
             l2.idLTYcliente AS idClienteReporte, l.idLTYcliente AS idClienteRegistro
      FROM LTYregistrocontrol l 
      INNER JOIN LTYreporte l2 ON l2.idLTYreporte = l.idLTYreporte 
      WHERE l.idLTYcliente = 0 
      ORDER BY l.horaautomatica DESC
  ";

  $result = $mysqli->query($query);
  $records = [];

  if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
      $records[] = $row;
    }
  }

  echo json_encode(['success' => true, 'data' => $records]);
  exit; // 🔹 Evitar que se mezcle con HTML
}
?>

<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Actualizar Registros</title>
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <style>
    table {
      width: 100%;
      border-collapse: collapse;
    }

    th,
    td {
      padding: 8px;
      border: 1px solid black;
      text-align: center;
    }

    th {
      background-color: #f2f2f2;
    }

    button {
      padding: 10px 20px;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
      color: white;
      background-color: #007bff;
      border: none;
      border-radius: 5px;
      transition: background 0.3s ease, transform 0.1s ease;
    }

    button:hover {
      background-color: #0056b3;
      transform: scale(1.05);
    }

    button:active {
      background-color: #004494;
      transform: scale(0.98);
    }
  </style>
</head>

<body>

  <h2>Registros a Actualizar</h2>
  <table id="recordsTable">
    <thead>
      <tr>
        <th>NuxPedido</th>
        <th>Fecha</th>
        <th>Hora</th>
        <th>ID Usuario</th>
        <th>ID Reporte</th>
        <th>ID Cliente Reporte</th>
        <th>ID Cliente Registro</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>

  <button id="updateButton">Corregir Registros</button>

  <script>
    $(document).ready(function() {
      function loadRecords() {
        $.get(window.location.href + "?ajax=1", function(response) {
          let data = JSON.parse(response);
          if (data.success) {
            let tableBody = $("#recordsTable tbody");
            tableBody.empty();
            data.data.forEach(record => {
              tableBody.append(`
                <tr>
                  <td>${record.nuxpedido}</td>
                  <td>${record.fecha}</td>
                  <td>${record.hora}</td>
                  <td>${record.idusuario}</td>
                  <td>${record.idLTYreporte}</td>
                  <td>${record.idClienteReporte}</td>
                  <td>${record.idClienteRegistro}</td>
                </tr>
              `);
            });
          } else {
            alert("Error al cargar los registros.");
          }
        });
      }

      // Cargar registros al inicio
      loadRecords();

      // Botón para actualizar registros
      $("#updateButton").click(function() {
        if (confirm("¿Estás seguro de actualizar los registros?")) {
          $.post('update_records.php', function(response) {
            let data = JSON.parse(response);
            alert(data.message);
            if (data.success) {
              loadRecords(); // Recargar la tabla después de actualizar
            }
          });
        }
      });
    });
  </script>

</body>

</html>