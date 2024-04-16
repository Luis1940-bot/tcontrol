<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
ob_clean(); // Limpia el búfer de salida
header('Content-Type: application/json');
// session_start();
header('Cache-Control: no-cache, must-revalidate');

$_SESSION['factum_validation'] = [
    'email' => 'luisglogista@gmail.com',
    'plant' => '1',
    'lng' => 'br',
    'person' => 'Luis Gimenez',
    'id' =>  '6',
    'tipo' =>  '7',
    'developer' => 'Factum', //* Tenki Web
    'content' => 'Factum Consultora',
    'logo' => 'ftm', //* icontrol 
    'by' => 'by Factum Consultora', //* by Tenkyweb
    'rutaDeveloper' => 'https://www.factumconsultora.com', //* https://linkedin.com/in/luisergimenez/
];

// $_SESSION['factum_validation'] = [
//     'email' => isset($_SESSION['factum_validation']['email']) ? $_SESSION['factum_validation']['email'] : 'luisglogista@gmail.com',
//     'plant' => isset($_SESSION['factum_validation']['plant']) ? $_SESSION['factum_validation']['plant'] : '1',
//     'lng' => isset($_SESSION['factum_validation']['lng']) ? $_SESSION['factum_validation']['lng'] : 'br',
//     'person' => isset($_SESSION['factum_validation']['person']) ? $_SESSION['factum_validation']['person'] : 'Luis Gimenez',
//     'id' => isset($_SESSION['factum_validation']['id']) ? $_SESSION['factum_validation']['id'] : '6',
//     'tipo' => isset($_SESSION['factum_validation']['tipo']) ? $_SESSION['factum_validation']['tipo'] : '7',
//     'developer' => 'Factum', //* Tenki Web
//     'content' => 'Factum Consultora',
//     'logo' => 'ftm', //* icontrol 
//     'by' => 'by Factum Consultora', //* by Tenkyweb
//     'rutaDeveloper' => 'https://www.factumconsultora.com', //* https://linkedin.com/in/luisergimenez/
// ];



echo json_encode($_SESSION['factum_validation']);
exit;
?>


