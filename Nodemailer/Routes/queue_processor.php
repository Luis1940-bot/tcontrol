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

function logMessage($message) {
    $logFile = BASE_DIR . '/logs/email_queue.log';
    $maxSize = 5 * 1024 * 1024; // 5MB

    // Rotar el log si supera el tamaño máximo
    if (file_exists($logFile) && filesize($logFile) > $maxSize) {
        rename($logFile, $logFile . '.' . date('Y-m-d_H-i-s') . '.bak');
    }

    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
}

function connectToDatabase() {
    global $host, $dbname, $port, $charset, $user, $password;
    try {
        $pdo = new PDO("mysql:host={$host};dbname={$dbname};port={$port};chartset={$charset}", $user, $password, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        try {
            // Configurar la zona horaria para la conexión
            $pdo->exec("SET time_zone = '+00:00'");
        } catch (PDOException $e) {
            logMessage("Error al configurar la zona horaria: " . $e->getMessage());
        }
        return $pdo;
    } catch (PDOException $e) {
        logMessage("Error en la conexión a la base de datos: " . $e->getMessage());
        die("Error en la conexión a la base de datos: " . $e->getMessage());
    }
}

$pdo = connectToDatabase();

$iterationLimit = 20; // Limite de iteraciones para evitar ejecución infinita
$iterations = 0;

$startTime = time(); // Registrar el tiempo de inicio
$maxExecutionTime = 180; // Tiempo máximo de ejecución en segundos (4.5 minutos)

while ($iterations < $iterationLimit) {
    $iterations++;
    set_time_limit(60); // Extiende el tiempo de ejecución en cada iteración

    // Verificar el tiempo transcurrido
    if (time() - $startTime > $maxExecutionTime) {
        logMessage("Tiempo máximo de ejecución alcanzado.");
        break;
    }

    try {
        $pdo->beginTransaction();
        
        $stmt = $pdo->prepare("SELECT * FROM email_queue WHERE status = 'pending' LIMIT 1");
        $stmt->execute();
        $email = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$email) {
            logMessage("No hay correos electrónicos pendientes.");
            $pdo->commit();
            sleep(5); // Reducir el tiempo de espera
            continue;
        }

        logMessage("Correo electrónico encontrado: " . print_r($email['subject'], true));

        // Marcar el correo electrónico como 'processing'
        $stmt = $pdo->prepare("UPDATE email_queue SET status = 'processing' WHERE id = :id");
        if ($stmt->execute([':id' => $email['id']])) {
            logMessage("Correo electrónico marcado como 'processing'.");
        } else {
            logMessage("Error al marcar el correo electrónico como 'processing'.");
            $pdo->rollBack();
            sleep(5); // Reducir el tiempo de espera
            continue;
        }
        $pdo->commit();

        $mail = new PHPMailer(true);

        try {
            $mail->isSMTP();
            $mail->CharSet = 'UTF-8';
            $mail->Encoding = "quoted-printable";
            $mail->SMTPAuth = true;
            $mail->Host = HOST;
            $mail->Username = USERNAME;
            $mail->Password = PASS;
            $mail->Port = 25;
            $mail->SMTPOptions = array(
                'ssl' => array(
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true
                )
            );
            $mail->isHTML(true);

            $mail->SetFrom(SET_FROM);
            // $mail->addAddress($email['email_address']);
            // Separar las direcciones de correo por '/'
            $addresses = explode('/', $email['email_address']);
            foreach ($addresses as $address) {
                $mail->addAddress(trim($address));
            }
            $mail->Subject = $email['subject'];
            $mail->Body = $email['body'];

            if ($mail->send()) {
                logMessage("Correo electrónico enviado con éxito.");
                $pdo->beginTransaction();
                $stmt = $pdo->prepare("UPDATE email_queue SET status = 'done' WHERE id = :id");
                $stmt->execute([':id' => $email['id']]);
                $pdo->commit();
            } else {
                logMessage("Error al enviar el correo electrónico.");
                $pdo->beginTransaction();
                $stmt = $pdo->prepare("UPDATE email_queue SET status = 'failed' WHERE id = :id");
                $stmt->execute([':id' => $email['id']]);
                $pdo->commit();
            }
        } catch (Exception $e) {
            logMessage("Error en el envío del correo: " . $e->getMessage());
            // Marcar el correo electrónico como 'failed'
            $pdo->beginTransaction();
            $stmt = $pdo->prepare("UPDATE email_queue SET status = 'failed' WHERE id = :id");
            if ($stmt->execute([':id' => $email['id']])) {
                logMessage("Correo electrónico marcado como 'failed'.");
            } else {
                logMessage("Error al marcar el correo electrónico como 'failed'.");
            }
            $pdo->commit();
        }
    } catch (Exception $e) {
        $pdo->rollBack();
        logMessage("Error en la transacción: " . $e->getMessage());
    }

    sleep(5); // Reducir el tiempo de espera
}
logMessage("Script finalizado después de $iterations iteraciones.");
?>
