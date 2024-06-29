document.getElementById('boton-registrarse').addEventListener('click', async function(event) {
    event.preventDefault();
    const campos =[ 
        document.getElementById('email-iniciar-sesion'),
        document.getElementById('password-iniciar')
    ]
    
    let camposVacios=false;
    
    campos.forEach((campo)=>{
        let valorVacio = !campo.value.trim() // devuelve falso si esta vacio por lo que lo capturamos y devolvemos true
        const label = document.querySelector(`label[for="${campo.id}"]`);
        const textoRojo = document.querySelector(`p[for="${campo.id}"]`);        
        campo.classList.toggle('sin-llenar', valorVacio) // si valorVacio es true anade si es falso lo quita
        label.classList.toggle('label-red', valorVacio);
        textoRojo.classList.toggle('motrar-elemento', valorVacio);
        if (valorVacio){
            camposVacios = true;
        }
    })
    const mensajeRegistroLogin = document.querySelector(`p[for="validacion-rojo-registro"]`)
    if(camposVacios){
        mensajeRegistroLogin.classList.remove('motrar-elemento');
        return;
    }
    const email = document.querySelector('#email-iniciar-sesion').value.trim();
    const password = document.querySelector('#password-iniciar').value.trim();

    
    
    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password})
    });
    const result = await response.json();

    if (response.ok && result.success){
            localStorage.setItem('token', result.token);

            window.location.href = '/public/cliente/cliente-index.html';
    } else {
        mensajeRegistroLogin.classList.add("motrar-elemento");
    }
});