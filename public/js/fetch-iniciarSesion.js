document.getElementById('boton-iniciar-sesion').addEventListener('click', async function(event) {
    event.preventDefault();
    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;

    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const result = await response.json();
    if (result.success) {
        // Handle successful login
        alert('Login successful!');
    } else {
        // Handle login failure
        alert('Login failed: ' + result.message);
    }
});