<?php
// ==========================================
// DIAGNÓSTICO COMPLETO DE RECURSOS Y QUIRKS
// ==========================================
while (ob_get_level()) {
  ob_end_clean();
}

header_remove();
header('Content-Type: text/html; charset=UTF-8');

$baseUrl = '/test-tenkiweb/tcontrol';
?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Diagnóstico de Recursos y Quirks</title>
  <style>
    body {
      font-family: 'Courier New', monospace;
      margin: 20px;
      background: #0a0a0a;
      color: #00ff00;
      line-height: 1.6;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .section {
      margin: 20px 0;
      padding: 15px;
      border: 1px solid #00ff00;
      border-radius: 5px;
      background: rgba(0, 255, 0, 0.1);
    }

    .success {
      color: #00ff00;
    }

    .error {
      color: #ff0000;
    }

    .warning {
      color: #ffff00;
    }

    .info {
      color: #00ffff;
    }

    pre {
      background: #1a1a1a;
      padding: 10px;
      border-radius: 3px;
      overflow-x: auto;
    }

    .resource-test {
      margin: 10px 0;
      padding: 10px;
      border: 1px solid #333;
      border-radius: 3px;
    }

    .resource-test img {
      max-width: 50px;
      max-height: 50px;
      border: 1px solid #00ff00;
    }
  </style>
</head>

<body>
  <div class="container">
    <h1>🔍 Diagnóstico Completo de Recursos y Quirks</h1>

    <div class="section">
      <h2>1. Verificación de Modo de Documento</h2>
      <p><strong>document.compatMode:</strong> <span id="compatMode" class="info"></span></p>
      <p><strong>Resultado:</strong> <span id="quirksResult"></span></p>
    </div>

    <div class="section">
      <h2>2. Información del DOCTYPE</h2>
      <pre id="doctypeInfo"></pre>
    </div>

    <div class="section">
      <h2>3. Base URL Configurada</h2>
      <p><strong>Base URL PHP:</strong> <code><?php echo htmlspecialchars($baseUrl); ?></code></p>
      <p><strong>URL Actual:</strong> <span id="currentUrl" class="info"></span></p>
    </div>

    <div class="section">
      <h2>4. Test de Carga de Recursos CSS</h2>
      <div class="resource-test">
        <p><strong>CSS Principal (style.css):</strong></p>
        <link rel="stylesheet" href="<?php echo $baseUrl; ?>/assets/css/style.css" id="mainCSS">
        <span id="cssStatus">Verificando...</span>
      </div>
    </div>

    <div class="section">
      <h2>5. Test de Carga de Imágenes</h2>
      <div class="resource-test">
        <p><strong>Logo Principal:</strong></p>
        <img src="<?php echo $baseUrl; ?>/assets/img/logo.png"
          alt="Logo"
          onload="updateImageStatus('logoStatus', true)"
          onerror="updateImageStatus('logoStatus', false)">
        <span id="logoStatus" class="warning">Cargando...</span>
      </div>

      <div class="resource-test">
        <p><strong>Favicon:</strong></p>
        <img src="<?php echo $baseUrl; ?>/assets/img/favicon.ico"
          alt="Favicon"
          onload="updateImageStatus('faviconStatus', true)"
          onerror="updateImageStatus('faviconStatus', false)">
        <span id="faviconStatus" class="warning">Cargando...</span>
      </div>

      <div class="resource-test">
        <p><strong>Ícono de menú:</strong></p>
        <img src="<?php echo $baseUrl; ?>/assets/img/menu.png"
          alt="Menu"
          onload="updateImageStatus('menuStatus', true)"
          onerror="updateImageStatus('menuStatus', false)">
        <span id="menuStatus" class="warning">Cargando...</span>
      </div>
    </div>

    <div class="section">
      <h2>6. Rutas de Recursos Calculadas</h2>
      <pre id="resourcePaths"></pre>
    </div>

    <div class="section">
      <h2>7. Headers HTTP Recibidos</h2>
      <pre id="headers"><?php
                        foreach (getallheaders() as $name => $value) {
                          echo htmlspecialchars("$name: $value") . "\n";
                        }
                        ?></pre>
    </div>

    <div class="section">
      <h2>8. Test de Fetch a Recursos</h2>
      <div id="fetchResults">Ejecutando tests...</div>
    </div>

    <div class="section">
      <h2>9. Información del Navegador</h2>
      <pre id="browserInfo"></pre>
    </div>

    <div class="section">
      <h2>10. Acciones Recomendadas</h2>
      <div id="recommendations"></div>
    </div>
  </div>

  <script>
    // Verificar modo de documento
    function checkDocumentMode() {
      const compatMode = document.compatMode;
      const quirksResult = document.getElementById('quirksResult');
      const compatModeSpan = document.getElementById('compatMode');

      compatModeSpan.textContent = compatMode;

      if (compatMode === 'CSS1Compat') {
        quirksResult.innerHTML = '<span class="success">✅ MODO ESTÁNDAR - Correcto</span>';
      } else {
        quirksResult.innerHTML = '<span class="error">❌ MODO QUIRKS - Problema detectado</span>';
      }
    }

    // Verificar DOCTYPE
    function checkDoctype() {
      const doctypeInfo = document.getElementById('doctypeInfo');
      const doctype = document.doctype;

      if (doctype) {
        doctypeInfo.textContent = `DOCTYPE encontrado:
Nombre: ${doctype.name}
Public ID: ${doctype.publicId || 'N/A'}
System ID: ${doctype.systemId || 'N/A'}`;
      } else {
        doctypeInfo.innerHTML = '<span class="error">❌ DOCTYPE no encontrado</span>';
      }
    }

    // Actualizar estado de imagen
    function updateImageStatus(elementId, success) {
      const element = document.getElementById(elementId);
      if (success) {
        element.innerHTML = '<span class="success">✅ Cargada correctamente</span>';
      } else {
        element.innerHTML = '<span class="error">❌ Error al cargar</span>';
      }
    }

    // Verificar CSS
    function checkCSS() {
      const cssLink = document.getElementById('mainCSS');
      const cssStatus = document.getElementById('cssStatus');

      cssLink.onload = function() {
        cssStatus.innerHTML = '<span class="success">✅ CSS cargado correctamente</span>';
      };

      cssLink.onerror = function() {
        cssStatus.innerHTML = '<span class="error">❌ Error al cargar CSS</span>';
      };
    }

    // Test de fetch a recursos
    async function testResourceFetch() {
      const baseUrl = '<?php echo $baseUrl; ?>';
      const resources = [{
          name: 'CSS Principal',
          url: `${baseUrl}/assets/css/style.css`
        },
        {
          name: 'Logo PNG',
          url: `${baseUrl}/assets/img/logo.png`
        },
        {
          name: 'Favicon',
          url: `${baseUrl}/assets/img/favicon.ico`
        }
      ];

      const resultsDiv = document.getElementById('fetchResults');
      resultsDiv.innerHTML = '';

      for (const resource of resources) {
        try {
          const response = await fetch(resource.url);
          const status = response.status;
          const statusText = response.statusText;

          const result = document.createElement('div');
          result.style.margin = '5px 0';

          if (status === 200) {
            result.innerHTML = `<span class="success">✅ ${resource.name}: ${status} ${statusText}</span>`;
          } else {
            result.innerHTML = `<span class="warning">⚠️ ${resource.name}: ${status} ${statusText}</span>`;
          }

          resultsDiv.appendChild(result);
        } catch (error) {
          const result = document.createElement('div');
          result.innerHTML = `<span class="error">❌ ${resource.name}: Error de red - ${error.message}</span>`;
          resultsDiv.appendChild(result);
        }
      }
    }

    // Mostrar información del navegador
    function showBrowserInfo() {
      const browserInfo = document.getElementById('browserInfo');
      browserInfo.textContent = `User Agent: ${navigator.userAgent}
URL: ${window.location.href}
Referrer: ${document.referrer || 'N/A'}
Cookies habilitadas: ${navigator.cookieEnabled}
Idioma: ${navigator.language}`;
    }

    // Mostrar rutas calculadas
    function showResourcePaths() {
      const resourcePaths = document.getElementById('resourcePaths');
      const baseUrl = '<?php echo $baseUrl; ?>';

      resourcePaths.textContent = `Base URL: ${baseUrl}
CSS: ${baseUrl}/assets/css/style.css
Imágenes: ${baseUrl}/assets/img/
JavaScript: ${baseUrl}/assets/js/
Actual: ${window.location.pathname}`;
    }

    // Mostrar URL actual
    function showCurrentUrl() {
      document.getElementById('currentUrl').textContent = window.location.href;
    }

    // Generar recomendaciones
    function generateRecommendations() {
      const recommendations = document.getElementById('recommendations');
      const compatMode = document.compatMode;

      let html = '';

      if (compatMode !== 'CSS1Compat') {
        html += '<div class="error">🔧 CRÍTICO: Corregir modo Quirks - Verificar DOCTYPE y salida previa</div>';
      }

      html += '<div class="info">📋 Verificar que todas las páginas principales usen la solución anti-quirks</div>';
      html += '<div class="info">🖼️ Si las imágenes fallan, verificar permisos y rutas del servidor</div>';
      html += '<div class="info">🎨 Si el CSS falla, verificar Content-Type y compresión del servidor</div>';

      recommendations.innerHTML = html;
    }

    // Ejecutar todos los diagnósticos
    document.addEventListener('DOMContentLoaded', function() {
      checkDocumentMode();
      checkDoctype();
      checkCSS();
      showBrowserInfo();
      showResourcePaths();
      showCurrentUrl();
      generateRecommendations();

      // Ejecutar test de fetch después de un pequeño delay
      setTimeout(testResourceFetch, 1000);
    });
  </script>
</body>

</html>