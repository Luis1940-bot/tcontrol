<?php
// Captura de errores para diagnosticar index.php

// Habilitar reporte de errores temporalmente
error_reporting(E_ALL);
ini_set('display_errors', '1');
ini_set('log_errors', '1');

echo "Iniciando diagnóstico...<br>";

// Verificar si el archivo original existe
$index_file = __DIR__ . '/index.php';
if (file_exists($index_file)) {
  echo "✅ Archivo index.php existe<br>";

  // Verificar permisos
  if (is_readable($index_file)) {
    echo "✅ Archivo es legible<br>";

    // Verificar sintaxis PHP
    $output = [];
    $return_var = 0;
    exec("php -l \"$index_file\"", $output, $return_var);

    if ($return_var === 0) {
      echo "✅ Sintaxis PHP correcta<br>";
    } else {
      echo "❌ Error de sintaxis PHP:<br>";
      foreach ($output as $line) {
        echo htmlspecialchars($line) . "<br>";
      }
    }

    // Intentar incluir el archivo y capturar errores
    echo "<hr><strong>Intentando cargar index.php:</strong><br>";

    ob_start();
    $error_occurred = false;

    try {
      // Capturar errores fatales
      register_shutdown_function(function () use (&$error_occurred) {
        $error = error_get_last();
        if ($error && $error['type'] === E_ERROR) {
          $error_occurred = true;
          echo "❌ Error Fatal: " . $error['message'] . " en línea " . $error['line'] . "<br>";
        }
      });

      include $index_file;
    } catch (Exception $e) {
      $error_occurred = true;
      echo "❌ Excepción: " . $e->getMessage() . "<br>";
    } catch (Error $e) {
      $error_occurred = true;
      echo "❌ Error: " . $e->getMessage() . "<br>";
    }

    $content = ob_get_contents();
    ob_end_clean();

    if (!$error_occurred) {
      echo "✅ Archivo se cargó sin errores PHP<br>";
      echo "<strong>Tamaño del contenido generado:</strong> " . strlen($content) . " bytes<br>";

      // Verificar DOCTYPE
      if (strpos($content, '<!DOCTYPE html>') !== false) {
        echo "✅ DOCTYPE presente<br>";
      } else {
        echo "❌ DOCTYPE faltante<br>";
      }

      // Mostrar inicio del contenido
      echo "<hr><strong>Primeros 500 caracteres del contenido:</strong><br>";
      echo "<pre>" . htmlspecialchars(substr($content, 0, 500)) . "</pre>";
    }
  } else {
    echo "❌ Archivo no es legible<br>";
  }
} else {
  echo "❌ Archivo index.php no existe<br>";
}
