<?php
// Establecer la conexión con la base de datos
$servername = "localhost";
$username = "root";
$password = "****";
$database = "crm2";

$conn = mysqli_connect($servername, $username, $password, $database);

if (!$conn) {
    die("Error al conectar a la base de datos: " . mysqli_connect_error());
}

// Obtener los datos del formulario
$email = $_POST['email'];
$password = $_POST['password'];

// Consultar la base de datos
$sql = "SELECT * FROM cliente WHERE email='$email'";
$result = mysqli_query($conn, $sql);

if (mysqli_num_rows($result) > 0) {
    // Verificar la contraseña
    $row = mysqli_fetch_assoc($result);
    if (password_verify($password, $row['password'])) {
        // Contraseña correcta, redireccionar al usuario a una página de inicio de sesión exitosa
        header("Location: inicio_exitoso.php");
        exit();
    } else {
        // Contraseña incorrecta, mostrar mensaje de error
        echo "Contraseña incorrecta. Por favor, inténtalo de nuevo.";
    }
} else {
    // El correo electrónico no está registrado, mostrar mensaje de error
    echo "El correo electrónico proporcionado no está registrado.";
}

// Cerrar la conexión
mysqli_close($conn);
?>