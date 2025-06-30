<?php
require_once dirname(dirname(__DIR__)) . '/config.php';

// Función de logging
function logMessage($message) {
    $logFile = BASE_DIR . '/logs/shell_exec_tester.log';
    $maxSize = 5 * 1024 * 1024; // 5MB

    // Rotar el log si supera el tamaño máximo
    if (file_exists($logFile) && filesize($logFile) > $maxSize) {
        rename($logFile, $logFile . '.' . date('Y-m-d_H-i-s') . '.bak');
    }

    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
}

logMessage("El script shell_exec_tester.php ha sido ejecutado.");

?>