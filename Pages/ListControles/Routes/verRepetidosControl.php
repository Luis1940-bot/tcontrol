<?php
require_once dirname(dirname(dirname(__DIR__))) . '/config.php';
$baseDir = BASE_DIR;
include_once $baseDir . "/Routes/datos_base.php";

/**
 * Genera un nuevo código basado en el `nombre_reporte` y el `orden`
 */
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
  $i = str_pad((int) $orden + 1, 4, "0", STR_PAD_LEFT);
  $hash = substr(md5($reporte . $orden), 0, 5);
  return strtolower(substr($codigoBase . $i . $hash, 0, 15));
}

function mostrarControlesRepetidos()
{
  global $host, $user, $password, $dbname, $port;

  $mysqli = new mysqli($host, $user, $password, $dbname, $port);
  if ($mysqli->connect_error) {
    die("Error de conexión: " . $mysqli->connect_error);
  }
  mysqli_set_charset($mysqli, "utf8mb4");

  $sql = "
        SELECT c.control, c.idLTYcontrol, c.idLTYreporte, c.orden, r.nombre AS nombre_reporte
        FROM LTYcontrol c
        INNER JOIN LTYreporte r ON c.idLTYreporte = r.idLTYreporte
        WHERE c.control IN (
            SELECT control FROM LTYcontrol 
            GROUP BY control HAVING COUNT(*) > 1
        )
        ORDER BY c.idLTYreporte, c.orden, c.idLTYcontrol ASC
    ";

  $result = $mysqli->query($sql);
  if (!$result) {
    die("Error en la consulta: " . $mysqli->error);
  }

  echo "<!DOCTYPE html>
    <html lang='es'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Registros Repetidos en LTYcontrol</title>
        <style>
            table { width: 95%; border-collapse: collapse; margin: 20px auto; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .copy-btn, .update-btn, .update-all-btn {
                background-color: #007bff; color: white; border: none;
                padding: 5px 10px; cursor: pointer; border-radius: 5px;
            }
            .copy-btn:hover, .update-btn:hover, .update-all-btn:hover { background-color: #0056b3; }
            #searchInput { margin: 10px auto; display: block; width: 50%; padding: 8px; font-size: 16px; border: 1px solid #ccc; border-radius: 5px; }
        </style>
        <script>
            document.addEventListener('DOMContentLoaded', function () {
                document.querySelectorAll('.update-btn').forEach(button => {
                    button.addEventListener('click', function () {
                        let idLTYcontrol = this.dataset.idltycontrol;
                        let nuevoCodigo = this.dataset.nuevocodigo;

                        if (!idLTYcontrol || !nuevoCodigo) {
                            alert('Error: No se encontró la información del control.');
                            return;
                        }

                        if (confirm('¿Seguro que deseas actualizar el control ' + idLTYcontrol + ' con el nuevo código ' + nuevoCodigo + '?')) {
                            fetch('updateControl.php', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ idLTYcontrol, nuevoCodigo })
                            })
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    alert('Código actualizado correctamente.');
                                    location.reload();
                                } else {
                                    alert('Error al actualizar: ' + data.message);
                                }
                            })
                            .catch(error => console.error('Error en la petición:', error));
                        }
                    });
                });
            });

            function copiarAlPortapapeles(texto, boton) {
                navigator.clipboard.writeText(texto).then(() => {
                    boton.textContent = '✔ Copiado';
                    setTimeout(() => { boton.textContent = '📋 Copiar'; }, 1500);
                }).catch(err => console.error('Error al copiar: ', err));
            }

            function actualizarTodosPorReporte(idLTYreporte) {
                if (confirm('¿Actualizar todos los controles con idLTYreporte ' + idLTYreporte + '?')) {
                    fetch('updateControl.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ idLTYreporte })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            alert('Todos los controles fueron actualizados.');
                            location.reload();
                        } else {
                            alert('Error al actualizar: ' + data.message);
                        }
                    })
                    .catch(error => console.error('Error en la petición:', error));
                }
            }
        </script>
    </head>
    <body>
        <h2>Registros Repetidos en LTYcontrol</h2>
        <input type='text' id='searchInput' onkeyup='filtrarPorIdLTYreporte()' placeholder='Buscar por ID LTYreporte'>

        <table id='dataTable'>
            <tr>
                <th>Control</th>
                <th>ID LTYcontrol</th>
                <th>ID LTYreporte</th>
                <th>Nombre Reporte</th>
                <th>Orden</th>
                <th>Nuevo Código</th>
                <th>Acciones</th>
            </tr>";

  if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
      $nuevoCodigo = generarCodigoAlfabetico($row['nombre_reporte'], $row['orden']);
      $nuevoCodigo = mb_convert_encoding(
        $nuevoCodigo,
        'UTF-8',
        'auto'
      );
      $nuevoCodigo = preg_replace('/[^\p{L}\p{N}\s-]/u', '', $nuevoCodigo);
      echo "<tr>
                    <td>{$row['control']}</td>
                    <td>{$row['idLTYcontrol']}</td>
                    <td>{$row['idLTYreporte']}</td>
                    <td>{$row['nombre_reporte']}</td>
                    <td>{$row['orden']}</td>
                    <td>{$nuevoCodigo}</td>
                    <td>
                        <button class='copy-btn' onclick='copiarAlPortapapeles(\"{$nuevoCodigo}\", this)'>📋 Copiar</button>
                        <button class='update-btn' data-idltycontrol='{$row['idLTYcontrol']}' data-nuevocodigo='{$nuevoCodigo}'>🔄 Actualizar</button>
                        <button class='update-all-btn' onclick='actualizarTodosPorReporte({$row['idLTYreporte']})'>🔄 Actualizar Todo</button>
                    </td>
                </tr>";
    }
  }

  echo "</table></body></html>";

  $mysqli->close();
}

mostrarControlesRepetidos();
