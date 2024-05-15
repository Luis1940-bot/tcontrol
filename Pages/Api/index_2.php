<?php 

header("Content-Type: application/json; charset=utf-8");
// $http_host = 'https://factumconsultora.com/scg2-mccain/Pages/Api/proc_TnEspecialidades/2024-04-07/2024-04-15/1?token=d96188a658f11da082b06679eda358a07f068f083b17539cf139a9bbb7bd262e&data=valor.data.bueno';
$http_host = $_SERVER['HTTP_HOST'];
$url = htmlentities($_SERVER["HTTP_HOST"] . $_SERVER["REQUEST_URI"], ENT_QUOTES, 'UTF-8');
// Verificar si el token está presente en la URL

$url_parts = parse_url($url);
$path = $url_parts['path'];
echo $path;
if (empty($path)) {
  $response = array('success' => false, 'message' => 'Faltan datos necesarios.');
  echo json_encode($response);
  exit;
}
if ($path !== null) {
  // preparaDatos($path);
} else {
  echo "Error al decodificar la cadena JSON";
}
?>