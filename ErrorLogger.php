
<?php
class ErrorLogger
{
  private static string $logFile = __DIR__ . '/logs/error.log';

  public static function initialize(?string $logFilePath = null): void
  {
    if ($logFilePath) {
      self::$logFile = $logFilePath;
    }

    ini_set('error_log', self::$logFile);
    set_error_handler([self::class, 'customErrorHandler']);
    set_exception_handler([self::class, 'customExceptionHandler']);
  }

  public static function customErrorHandler(int $errno, string $errstr, string $errfile, int $errline): bool
  {
    $timestamp = date('[Y-m-d H:i:s T]');
    $context = self::getClientContext();
    $message = "$timestamp [Error $errno] $errstr in $errfile on line $errline$context";
    error_log(self::lineNumberPrefix() . $message);
    return true;
  }

  public static function customExceptionHandler(\Throwable $exception): void
  {
    $timestamp = date('[Y-m-d H:i:s T]');
    $context = self::getClientContext();
    $message = "$timestamp [Exception] " . $exception->getMessage() .
      " in " . $exception->getFile() .
      " on line " . $exception->getLine() . $context;
    error_log(self::lineNumberPrefix() . $message);
  }

  private static function getClientContext(): string
  {
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'IP desconocida';
    $uri = $_SERVER['REQUEST_URI'] ?? 'URI desconocida';
    $agent = $_SERVER['HTTP_USER_AGENT'] ?? 'User-Agent desconocido';

    return " | IP: $ip | URI: $uri | UA: $agent";
  }

  /**
   * Lee el último número de línea del archivo log y devuelve el siguiente.
   */
  private static function lineNumberPrefix(): string
  {
    if (!file_exists(self::$logFile)) {
      return '1' . "\t";
    }

    $lines = file(self::$logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $lastLine = end($lines);
    $lastNumber = 0;

    if ($lastLine && preg_match('/^(\d+)\s+/', $lastLine, $matches)) {
      $lastNumber = (int) $matches[1];
    }

    return ($lastNumber + 1) . "\t";
  }
}
