<?php
require_once dirname(dirname(__DIR__)) . '/config.php';
startSecureSession();
$nonce = setSecurityHeaders();

// Verificar autenticación simple
$user_id = null;
if (isset($_SESSION['user_id'])) {
  $user_id = $_SESSION['user_id'];
} elseif (isset($_SESSION['login_sso']['email']) && !empty($_SESSION['login_sso']['email'])) {
  $user_id = 1; // ID temporal para pruebas
} else {
  header("Location: " . BASE_URL . "/Pages/Login/index.php");
  exit();
}

$baseUrl = BASE_URL;
?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Historial de Tickets - TenkiWeb Soporte</title>
  <link rel="stylesheet" href="<?= $baseUrl ?>/assets/css/style.css">
  <link rel="stylesheet" href="<?= $baseUrl ?>/assets/css/common-components.css">
  <link rel="stylesheet" href="<?= $baseUrl ?>/Pages/Soporte/soporte.css?v=<?php echo time(); ?>">
</head>

<body>
  <div class="historial-container">
    <div class="historial-header">
      <h1>📋 Mis Tickets de Soporte</h1>
      <p>Gestiona y da seguimiento a tus solicitudes de soporte</p>
    </div>

    <div class="historial-content">
      <div class="tickets-info">
        <p><strong>Usuario ID:</strong> <?= $user_id ?></p>
        <p><strong>Email:</strong> <?= $_SESSION['login_sso']['email'] ?? 'No definido' ?></p>
      </div>

      <?php
      // Intentar cargar tickets por email
      $tickets = [];
      $error_message = '';
      $user_email = $_SESSION['login_sso']['email'] ?? null;

      try {
        require_once dirname(dirname(__DIR__)) . '/Nodemailer/Routes/SoporteTicket.php';
        $soporteTicket = new SoporteTicket();

        if ($user_email) {
          // Buscar tickets por email del contacto
          $tickets = $soporteTicket->obtenerTicketsPorEmail($user_email, 10);
          echo "<p><strong>Buscando tickets para email:</strong> {$user_email}</p>";
        } else {
          // Buscar por usuario_id como respaldo
          $tickets = $soporteTicket->obtenerTicketsUsuario($user_id, 10);
          echo "<p><strong>Buscando tickets para usuario_id:</strong> {$user_id}</p>";
        }

        echo "<p><strong>Tickets encontrados:</strong> " . count($tickets) . "</p>";

        if (!empty($tickets)) {
          echo "<div class='tickets-list'>";
          foreach ($tickets as $ticket) {
            echo "<div class='ticket-item'>";
            echo "<h3>{$ticket['ticket_id']}</h3>";
            echo "<p><strong>Empresa:</strong> {$ticket['empresa']}</p>";
            echo "<p><strong>Asunto:</strong> {$ticket['asunto']}</p>";
            echo "<p><strong>Estado:</strong> {$ticket['estado']}</p>";
            echo "<p><strong>Prioridad:</strong> {$ticket['prioridad']}</p>";
            echo "<p><strong>Fecha:</strong> {$ticket['fecha_creacion']}</p>";
            echo "</div>";
          }
          echo "</div>";
        } else {
          echo "<div class='no-tickets'>";
          echo "<p>No se encontraron tickets para tu email: <strong>{$user_email}</strong></p>";
          echo "<p>Los tickets se asocian al email que uses en el formulario de soporte.</p>";
          echo "<p><a href='{$baseUrl}/Pages/Soporte/'>Crear nuevo ticket</a></p>";
          echo "</div>";
        }
      } catch (Exception $e) {
        echo "<div class='error-message'>";
        echo "<p><strong>Error:</strong> " . $e->getMessage() . "</p>";
        echo "</div>";
      }
      ?>
    </div>

    <div class="historial-actions">
      <a href="<?= $baseUrl ?>/Pages/Soporte/" class="btn btn-primary">➕ Crear Nuevo Ticket</a>
      <a href="<?= $baseUrl ?>/Pages/Home/" class="btn btn-secondary">🏠 Volver al Inicio</a>
    </div>
  </div>

  <style>
    .historial-container {
      max-width: 1000px;
      margin: 2rem auto;
      padding: 2rem;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .historial-header {
      text-align: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #e9ecef;
    }

    .tickets-info {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 2rem;
    }

    .ticket-item {
      background: #fff;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      padding: 1rem;
      margin-bottom: 1rem;
    }

    .no-tickets {
      text-align: center;
      padding: 2rem;
      background: #f8f9fa;
      border-radius: 4px;
    }

    .error-message {
      background: #f8d7da;
      color: #721c24;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }

    .historial-actions {
      text-align: center;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #e9ecef;
    }

    .btn {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      margin: 0 0.5rem;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 500;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn:hover {
      opacity: 0.8;
    }
  </style>
</body>

</html>