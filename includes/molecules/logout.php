<?php
session_start();

// Elimina todas las variables de sesión
$_SESSION = array();

// Si se desea destruir la sesión, también se borra el cookie de sesión.
// Nota: Esto destruirá la sesión, y no solo los datos de la sesión.
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}
session_regenerate_id(true);
// Finalmente, destruye la sesión.
session_destroy();
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

// Redirige a la página de inicio de sesión o a donde desees.
header("Location: ../../../../Pages/Login/"); // Cambia "login.php" al nombre de tu página de inicio de sesión
exit;

?>
