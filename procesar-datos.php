<?php
// Verificar si se ha enviado el formulario
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Conectar a la base de datos
    $servername = "localhost";
    $username = "root";
    $password = "Predh2204"; // Reemplaza "tucontraseña" con tu contraseña de MySQL
    $dbname = "crm2"; // Reemplaza "nombre_base_de_datos" con el nombre de tu base de datos

    $conn = new mysqli($servername, $username, $password, $dbname);

    // Verificar la conexión
    if ($conn->connect_error) {
        die("Conexión fallida: " . $conn->connect_error);
    } else {
        echo "Conexión exitosa a la base de datos: " . $dbname;
    }

    // Obtener datos del formulario
    $nombre = $_POST["name"];
    $email = $_POST["email"];
    $password = $_POST["password"];
    // Puedes agregar más campos según sea necesario

    // Preparar y ejecutar la consulta SQL para insertar datos en la tabla correspondiente
    $sql = "INSERT INTO cliente (nombre, email, password) VALUES ('$nombre', '$email', '$password')";

    if ($conn->query($sql) === TRUE) {
        echo "Registro exitoso";
    } else {
        echo "Error al registrar: " . $conn->error;
    }

    // Cerrar la conexión a la base de datos
    $conn->close();
}
?>