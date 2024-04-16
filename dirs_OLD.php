<?php 
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$domain = parse_url($_SERVER['SERVER_NAME'], PHP_URL_HOST);
$ruta = dirname(dirname(dirname($_SERVER['DOCUMENT_ROOT'] . $_SERVER['SCRIPT_NAME'])));
$carpetas = explode("/", $_SERVER['SCRIPT_NAME']);
$folder1 = $carpetas[1];
$folder2 = $carpetas[2];
$http_host = $_SERVER['HTTP_HOST'];
if($http_host === 'localhost' || $http_host === '127.0.0.1' || $http_host === 'localhost:8080') {
      echo 'Estás trabajando en localhost.'.'<br>';
      $ruta = dirname(dirname(dirname($_SERVER['DOCUMENT_ROOT'] . $_SERVER['SCRIPT_NAME'])));
   }
   else {
      echo 'Estás trabajando en servidor.'.'<br>';
      $server = $_SERVER['SERVER_NAME'];
      $ruta = 'https://' . $server . '/' . $folder1 . '/' . $folder2;
   }

define('ROOT_PATH', $ruta);
define('ASSETS', ROOT_PATH.'/assets');
define('CONTROLLERS', ROOT_PATH.'/controllers');
define('INCLUDES', ROOT_PATH.'/includes');
define('PAGES', ROOT_PATH.'/Pages');
define('ROUTS', ROOT_PATH.'/Routes');
define('NODEMAILRES', ROOT_PATH.'/Nodemailer');
define('MOLECULES', INCLUDES.'/molecules');
?>
