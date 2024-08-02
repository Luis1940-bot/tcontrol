<?php
class ErrorLogger {
    private static $logFile = __DIR__ . '/logs/error.log';

    public static function initialize($logFilePath = null) {
        if ($logFilePath) {
            self::$logFile = $logFilePath;
        }
        ini_set('error_log', self::$logFile);
        set_error_handler([self::class, 'customErrorHandler']);
        set_exception_handler([self::class, 'customExceptionHandler']);
    }

    public static function customErrorHandler($errno, $errstr, $errfile, $errline) {
        $errorMessage = "[Error $errno] $errstr in $errfile on line $errline";
        error_log($errorMessage);
        return true;
    }

    public static function customExceptionHandler($exception) {
        $errorMessage = "[Exception] " . $exception->getMessage() . " in " . $exception->getFile() . " on line " . $exception->getLine();
        error_log($errorMessage);
    }
}
?>
