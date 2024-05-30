document.getElementById('boton-registrarse').addEventListener('click', async function(event) {
    event.preventDefault();
    const email = document.querySelector('#email-iniciar-sesion').value.trim();
    const password = document.querySelector('#password-iniciar').value.trim();

    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password})
    });
    console.log("HOLAAAAAAAAAAAAAA")
    const result = await response.json();
    if (result.success) {
        if (result.rol === 'admin') {
            window.location.href = '/public/administrador.html';
        } else{
            window.location.href = '/public/cliente.html';
        }
    } else {
        alert('Login failed: ' + result.message);
    }
});