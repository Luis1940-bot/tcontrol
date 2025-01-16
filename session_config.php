<?php
// Set session cookie parameters
session_set_cookie_params([
    'secure' => true,
    // Use HTTPS only
    'httponly' => true,
    // Prevent JavaScript access
    'samesite' => 'Strict', // Protect against CSRF attacks
]);

// Start or resume the session
if (session_status() == PHP_SESSION_NONE) { session_start(); };

// Regenerate session ID to prevent session fixation attacks
session_regenerate_id(true);
?>