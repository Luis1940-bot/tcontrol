<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('max_execution_time', 300); // 5 minutos
header("Content-Type: text/html;charset=utf-8");
header("Cache-Control: no-cache, must-revalidate");
header("Expires: Sat, 1 Jul 2000 05:00:00 GMT");
header("MIME-Version: 1.0");

require_once dirname(dirname(__DIR__)) . '/config.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require __DIR__ . '/../PHPMailer-6.8.0/PHPMailer-6.8.0/src/Exception.php';
require __DIR__ . '/../PHPMailer-6.8.0/PHPMailer-6.8.0/src/PHPMailer.php';
require __DIR__ . '/../PHPMailer-6.8.0/PHPMailer-6.8.0/src/SMTP.php';

include_once BASE_DIR . "/Routes/datos_base.php";

function logMessage($message)
{
  $logFile = BASE_DIR . '/logs/email_queue.log';
  $maxSize = 5 * 1024 * 1024; // 5MB

  if (file_exists($logFile) && filesize($logFile) > $maxSize) {
    rename($logFile, $logFile . '.' . date('Y-m-d_H-i-s') . '.bak');
  }

  $timestamp = date('Y-m-d H:i:s');
  file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
}

function connectToDatabase()
{
  global $host, $dbname, $port, $charset, $user, $password;
  try {
    $pdo = new PDO("mysql:host={$host};dbname={$dbname};port={$port};charset=utf8", $user, $password, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("SET time_zone = '+00:00'");
    return $pdo;
  } catch (PDOException $e) {
    logMessage("Error en la conexión a la base de datos: " . $e->getMessage());
    die("Error en la conexión a la base de datos: " . $e->getMessage());
  }
}

$pdo = connectToDatabase();

$iterationLimit = 3; // Limite de iteraciones para evitar ejecución infinita
$emailsPerIteration = 10; // Número de correos a procesar por iteración
$iterations = 0;
$startTime = time(); // Registrar el tiempo de inicio
$maxExecutionTime = 180; // Tiempo máximo de ejecución en segundos (3 minutos)

while ($iterations < $iterationLimit) {
  $iterations++;

  // Verificar el tiempo transcurrido
  if (time() - $startTime > $maxExecutionTime) {
    logMessage("Tiempo máximo de ejecución alcanzado.");
    break;
  }

  try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("SELECT * FROM email_queue WHERE status = 'pending' LIMIT :limit");
    $stmt->bindValue(':limit', $emailsPerIteration, PDO::PARAM_INT);
    $stmt->execute();
    $emails = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!$emails) {
      logMessage("No hay correos electrónicos pendientes.");
      $pdo->commit();
      break; // Salir del bucle si no hay correos pendientes
    }

    foreach ($emails as $email) {
      // Marcar el correo electrónico como 'processing'
      $stmt = $pdo->prepare("UPDATE email_queue SET status = 'processing' WHERE id = :id");
      if ($stmt->execute([':id' => $email['id']])) {
        logMessage("Procesando correo para: " . $email['email_address']);
      } else {
        logMessage("Error al marcar el correo electrónico como 'processing'.");
        continue;
      }

      $mail = new PHPMailer(true);
      try {
        $mail->isSMTP();
        $mail->CharSet = 'UTF-8';
        $mail->Encoding = "quoted-printable";
        $mail->SMTPAuth = true;
        // Usar SSL con puerto 465 ahora que OpenSSL está habilitado
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Host = HOST;
        $mail->Username = USERNAME;
        $mail->Password = PASS;
        $mail->Port = 465;
        $mail->SMTPOptions = array(
          'ssl' => array(
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
          )
        );
        $mail->isHTML(true);

        $mail->SetFrom(SET_FROM);
        $addresses = explode('/', $email['email_address']);
        foreach ($addresses as $address) {
          $mail->addAddress(trim($address));
        }
        $mail->Subject = $email['subject'];
        $mail->Body = $email['body'];

        if ($mail->send()) {
          logMessage("Correo electrónico enviado con éxito.");
          $stmt = $pdo->prepare("UPDATE email_queue SET status = 'done' WHERE id = :id");
          $stmt->execute([':id' => $email['id']]);
        } else {
          logMessage("Error al enviar el correo electrónico.");
          $stmt = $pdo->prepare("UPDATE email_queue SET status = 'failed' WHERE id = :id");
          $stmt->execute([':id' => $email['id']]);
        }
      } catch (Exception $e) {
        logMessage("Error en el envío del correo: " . $e->getMessage());
        $stmt = $pdo->prepare("UPDATE email_queue SET status = 'failed' WHERE id = :id");
        $stmt->execute([':id' => $email['id']]);
      }
    }

    $pdo->commit();
  } catch (Exception $e) {
    $pdo->rollBack();
    logMessage("Error en la transacción: " . $e->getMessage());
  }

  sleep(1); // Reducir el tiempo de espera para iteraciones más rápidas
}
logMessage("Script finalizado después de $iterations iteraciones.");
