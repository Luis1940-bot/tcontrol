<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Calculadora de Hash</title>
</head>
<body>
    <h2>Calculadora de Hash</h2>
    <form method="post" action="">
        <label for="inputText">Ingresa el texto:</label><br>
        <input type="text" id="inputText" name="inputText" required><br><br>
        <button type="submit">Calcular Hash</button>
    </form>

    <?php
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $inputText = $_POST["inputText"] ?? '';
    if (is_string($inputText) || is_numeric($inputText)) {
        $hash = hash('ripemd160', strval($inputText));
        echo "<h3>Resultado del Hash:</h3>";
        echo "<p>$hash</p>";
    } else {
        echo "<h3>Error:</h3>";
        echo "<p>El valor de inputText no es válido.</p>";
    }
}

    ?>
</body>
</html>
