<?php
session_start();
require_once dirname(dirname(__DIR__)) . '/config.php';
$url = "https://factumconsultora.com/mccain/index.php";
define('SSO', $_SESSION['login_sso']['sso']);

 if (isset($_SESSION['login_sso']['email'] )) {
      $url = "https://factumconsultora.com/mccain/index.php";
      if ( SSO === 'null' || SSO === ''  ) {
      $url = BASE_URL . "/index.php";
    }
  } else {
    if ( SSO === 'null' || SSO === ''  ) {
      $url = BASE_URL . "/index.php";
    }
    if ( SSO !== 'null') {
      $url = "https://factumconsultora.com/mccain/index.php";
    }
    
  }

unset($_SESSION['login_sso']);
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

header("Location: ". $url ."");
exit;

?>


