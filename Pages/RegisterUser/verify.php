<?php
require_once dirname(dirname(__DIR__)) . '/config.php';
require_once dirname(dirname(__DIR__)) . '/ErrorLogger.php';
ErrorLogger::initialize(dirname(dirname(__DIR__)) . '/logs/error.log');
if (isset($_SESSION['timezone'])) {
    date_default_timezone_set($_SESSION['timezone']);
} else {
    date_default_timezone_set('America/Argentina/Buenos_Aires');
}
// echo "Zona horaria actual: " . date_default_timezone_get() . "<br>";
// echo "Fecha y hora actual: " . date('Y-m-d H:i:s') . "<br>";

function verificarCodigo($idusuario, $codigo_verificacion, $codigo_ingresado) {
    include_once BASE_DIR . "/Routes/datos_base.php";
    $conn = new mysqli($host, $user, $password, $dbname, $port);
    if ($conn->connect_error) {
            error_log("Conexion fallida: " . $conn->connect_error);
            print "Error!: ".$e->getMessage()."<br>";
        die("Conexión fallida: " . $conn->connect_error);
    }

    if (!$conn->set_charset("utf8mb4")) {
        printf("Error al cargar el conjunto de caracteres utf8mb4: %s\n", $conn->error);
        exit();
    }

    $sql = "SELECT * FROM usuario WHERE idusuario = ? AND cod_verificador = ?";
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        die("Error al preparar la consulta: " . $conn->error);
    }
    $stmt->bind_param("is", $idusuario, $codigo_verificacion);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0 && $codigo_verificacion === $codigo_ingresado) {
        $sql = "UPDATE usuario SET verificador = 1, cod_verificador = NULL WHERE idusuario = ?";
        $stmt = $conn->prepare($sql);
        if ($stmt === false) {
            die("Error al preparar la consulta: " . $conn->error);
        }
        $stmt->bind_param("i", $idusuario);
        if ($stmt->execute()) {
            $stmt->close();
            $conn->close();
            return true;
        } else {
            $stmt->close();
            $conn->close();
            return false;
        }
    } else {
        error_log("Error en UPDATE usuario. Diferencia de odigo ingresado.");
        $stmt->close();
        $conn->close();
        return false;
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['codigo']) && isset($_GET['id'])) {
    $codigo_verificacion = $_GET['codigo'];
    $idusuario = $_GET['id'];
?>
<!DOCTYPE html>
<!-- <html lang="es"> -->
<head>
    <meta charset="UTF-8">
    <meta name="description" content="Luis1940-bot">
    <meta name="author" content="Luis1940-bot">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel='shortcut icon' type='image/x-icon' href='../../assets/img/favicon.ico'>
    <link rel='stylesheet' type='text/css' href='../../Pages/RegisterUser/verify.css?v=<?php echo(time()); ?>' media='screen'>
    <link rel='stylesheet' type='text/css' href='../../assets/css/spinner.css?v=<?php echo(time()); ?>' media='screen'>
    <title>Tenki</title>
</head>
<body>
    <div class="spinner"></div>
    <header>
        <?php
        include_once('../../includes/molecules/header.php');
        include_once('../../includes/molecules/encabezado.php');
        include_once('../../includes/molecules/whereUs.php');
        ?>
    </header>
    <main>
        <div class="div-verify">
            <form method="POST" action="verify.php">
                <input type="hidden" name="idusuario" value="<?php echo htmlspecialchars($idusuario); ?>">
                <input type="hidden" name="cod_verificador" value="<?php echo htmlspecialchars($codigo_verificacion); ?>">
                <label for="codigo" class="label-verify">Ingrese el código de verificación:</label>
                <input type="text" id="codigo" name="codigo" class="input-verify" required>
                <button type="submit" class="button-verify">Verificar</button>
            </form>
        </div>
    </main>
    <footer>
        <?php
        include_once('../../includes/molecules/footer.php');
        ?>
    </footer>
    <script type='module' src='../../config.js?v=<?php echo(time()); ?>'></script>
    <script type='module' src='../../Pages/RegisterUser/verify.js?v=<?php echo(time()); ?>'></script>
</body>
</html>
<?php
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $idusuario = $_POST['idusuario'];
    $codigo_verificacion = $_POST['cod_verificador'];
    $codigo_ingresado = $_POST['codigo'];

    if (verificarCodigo($idusuario, $codigo_verificacion, $codigo_ingresado)) {
        header('Location: ' . BASE_URL . '/index.php');
        exit();
    } else {
        echo "Código de verificación incorrecto.";
    }
} else {
    echo "Solicitud no válida.";
}
?>
