#!/usr/bin/env php
<?php
// Script completo de pruebas para verificar configuración multi-entorno

class EnvironmentTester
{
  private $testResults = [];

  public function runAllTests()
  {
    echo "🧪 === SUITE COMPLETA DE PRUEBAS tControl ===\n\n";

    $this->testEnvironmentDetection();
    $this->testConfigurationFiles();
    $this->testDatabaseConnections();
    $this->testScriptSyntax();

    $this->showResults();
  }

  private function testEnvironmentDetection()
  {
    echo "📍 1. PROBANDO DETECCIÓN DE ENTORNOS\n";
    echo "─" . str_repeat("─", 50) . "\n";

    $environments = [
      'localhost' => 'development',
      '127.0.0.1' => 'development',
      'test.tenkiweb.com' => 'testing',
      'tenkiweb.com' => 'production'
    ];

    foreach ($environments as $host => $expectedEnv) {
      $this->testSingleEnvironment($host, $expectedEnv);
    }
    echo "\n";
  }

  private function testSingleEnvironment($host, $expectedEnv)
  {
    echo "  🌐 Probando: $host → $expectedEnv ... ";

    // Ejecutar en proceso separado para evitar conflictos de constantes
    $testScript = "<?php
            \$_SERVER['HTTP_HOST'] = '$host';
            include 'config_env.php';
            echo ENVIRONMENT;
        ";

    $tempFile = tempnam(sys_get_temp_dir(), 'env_test_');
    file_put_contents($tempFile, $testScript);

    $result = trim(shell_exec("php $tempFile"));
    unlink($tempFile);

    if ($result === $expectedEnv) {
      echo "✅ CORRECTO\n";
      $this->testResults['env_detection'][] = true;
    } else {
      echo "❌ ERROR (esperado: $expectedEnv, obtenido: $result)\n";
      $this->testResults['env_detection'][] = false;
    }
  }

  private function testConfigurationFiles()
  {
    echo "📁 2. PROBANDO ARCHIVOS DE CONFIGURACIÓN\n";
    echo "─" . str_repeat("─", 50) . "\n";

    $files = [
      'config_env.php' => 'Configuración de entornos',
      'config.php.example' => 'Plantilla de configuración',
      'deploy_fixed.ps1' => 'Script de despliegue Windows',
      'deploy.sh' => 'Script de despliegue Unix',
      'DEPLOYMENT_STRATEGY.md' => 'Documentación de estrategia'
    ];

    foreach ($files as $file => $description) {
      echo "  📄 $description ... ";
      if (file_exists($file)) {
        echo "✅ EXISTE\n";
        $this->testResults['files'][] = true;
      } else {
        echo "❌ FALTANTE\n";
        $this->testResults['files'][] = false;
      }
    }
    echo "\n";
  }

  private function testDatabaseConnections()
  {
    echo "🗄️  3. PROBANDO CONFIGURACIÓN DE BASE DE DATOS\n";
    echo "─" . str_repeat("─", 50) . "\n";

    $environments = ['development', 'testing', 'production'];

    foreach ($environments as $env) {
      echo "  🗃️  Configuración BD $env ... ";

      $testScript = "<?php
                \$_SERVER['HTTP_HOST'] = " .
        ($env === 'development' ? "'localhost'" : ($env === 'testing' ? "'test.tenkiweb.com'" : "'tenkiweb.com'")) . ";
                include 'config_env.php';
                echo DB_HOST . '|' . DB_NAME . '|' . DB_USER;
            ";

      $tempFile = tempnam(sys_get_temp_dir(), 'db_test_');
      file_put_contents($tempFile, $testScript);

      $result = shell_exec("php $tempFile");
      unlink($tempFile);

      if ($result && !empty(trim($result))) {
        echo "✅ CONFIGURADA\n";
        $this->testResults['database'][] = true;
      } else {
        echo "❌ ERROR EN CONFIGURACIÓN\n";
        $this->testResults['database'][] = false;
      }
    }
    echo "\n";
  }

  private function testScriptSyntax()
  {
    echo "🔍 4. PROBANDO SINTAXIS DE SCRIPTS\n";
    echo "─" . str_repeat("─", 50) . "\n";

    $phpFiles = [
      'index.php',
      'config_env.php',
      'config.php.example'
    ];

    foreach ($phpFiles as $file) {
      echo "  📝 Sintaxis $file ... ";
      if (file_exists($file)) {
        $output = shell_exec("php -l $file 2>&1");
        if (strpos($output, 'No syntax errors') !== false) {
          echo "✅ VÁLIDA\n";
          $this->testResults['syntax'][] = true;
        } else {
          echo "❌ ERRORES DE SINTAXIS\n";
          $this->testResults['syntax'][] = false;
        }
      } else {
        echo "⚠️  ARCHIVO NO ENCONTRADO\n";
        $this->testResults['syntax'][] = false;
      }
    }
    echo "\n";
  }

  private function showResults()
  {
    echo "📊 === RESUMEN DE RESULTADOS ===\n";
    echo "═" . str_repeat("═", 50) . "\n";

    $categories = [
      'env_detection' => 'Detección de Entornos',
      'files' => 'Archivos de Configuración',
      'database' => 'Configuración de BD',
      'syntax' => 'Sintaxis de Scripts'
    ];

    $totalTests = 0;
    $totalPassed = 0;

    foreach ($categories as $key => $name) {
      if (isset($this->testResults[$key])) {
        $passed = array_sum($this->testResults[$key]);
        $total = count($this->testResults[$key]);
        $percentage = $total > 0 ? round(($passed / $total) * 100) : 0;

        echo sprintf(
          "  %-25s: %d/%d (%d%%) %s\n",
          $name,
          $passed,
          $total,
          $percentage,
          $percentage === 100 ? '✅' : '⚠️'
        );

        $totalTests += $total;
        $totalPassed += $passed;
      }
    }

    echo "─" . str_repeat("─", 50) . "\n";
    $overallPercentage = $totalTests > 0 ? round(($totalPassed / $totalTests) * 100) : 0;
    echo sprintf(
      "  %-25s: %d/%d (%d%%)\n",
      'TOTAL GENERAL',
      $totalPassed,
      $totalTests,
      $overallPercentage
    );

    echo "\n";
    if ($overallPercentage >= 90) {
      echo "🎉 ¡EXCELENTE! El sistema está listo para producción.\n";
    } elseif ($overallPercentage >= 75) {
      echo "✅ BUENO. Algunos ajustes menores recomendados.\n";
    } elseif ($overallPercentage >= 50) {
      echo "⚠️  REGULAR. Se requieren correcciones importantes.\n";
    } else {
      echo "❌ CRÍTICO. Se requiere revisión completa.\n";
    }

    echo "\n📋 PRÓXIMOS PASOS RECOMENDADOS:\n";
    if ($overallPercentage >= 90) {
      echo "• Proceder con invitación a usuarios beta\n";
      echo "• Configurar monitoreo en test.tenkiweb.com\n";
      echo "• Preparar plan de migración a producción\n";
    } else {
      echo "• Revisar y corregir los elementos fallidos\n";
      echo "• Re-ejecutar pruebas hasta alcanzar 90%+\n";
      echo "• Documentar cualquier limitación conocida\n";
    }
  }
}

// Ejecutar las pruebas
$tester = new EnvironmentTester();
$tester->runAllTests();
