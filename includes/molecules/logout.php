<?php
// ini_set('display_errors', '1');
// ini_set('display_startup_errors', '1');
// error_reporting(E_ALL);
if (session_status() == PHP_SESSION_NONE) {
  session_start();
}

require_once dirname(dirname(__DIR__)) . '/config.php';

/** @var string $baseUrl */
$baseUrl = BASE_URL;
$url = "https://tenkiweb.com/tcontrol/index.php";

if (isset($_SESSION['login_sso']) && is_array($_SESSION['login_sso'])) {
  define('SSO', $_SESSION['login_sso']['sso'] ?? '');

  if (isset($_SESSION['login_sso']['email'])) {
    $url = "https://tenkiweb.com/tcontrol/index.php";
    if (SSO === 'null' || SSO === '') {
      $url = $baseUrl . "/index.php";
    }
  } else {
    if (SSO === 'null' || SSO === '') {
      $url = $baseUrl . "/index.php";
    }
    if (SSO !== 'null') {
      $url = "https://tenkiweb.com/tcontrol/index.php";
    }
  }

  unset($_SESSION['login_sso']);
}

header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

header("Location: " . $url);
