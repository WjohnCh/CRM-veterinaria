document.addEventListener('DOMContentLoaded', (event) => {
  event.preventDefault();
  const form = document.getElementById('user-registrate');
  const buttonRegistrate = document.getElementById('boton-registrarse-modal2')
  
  buttonRegistrate.addEventListener('click', async (event) => {
    const nameField = document.getElementById('registrate-name');
    const emailField = document.getElementById('registrate-email');
    const passwordField = document.getElementById('registrate-password');
    const confirmPasswordField = document.getElementById('registrate-confirm-password');
    const termsAccepted = document.getElementById('registrate-terms').checked;

    const name = nameField.value;
    const email = emailField.value;
    const password = passwordField.value;
    const confirmPassword = confirmPasswordField.value;

    let valid = true;

    // Verificar si algún campo está vacío y añadir la clase sin-llenar si es así
    if (!name) {
      nameField.classList.add('sin-llenar');
      valid = false;
    } else {
      nameField.classList.remove('sin-llenar');
    }

    if (!email) {
      emailField.classList.add('sin-llenar');
      valid = false;
    } else {
      emailField.classList.remove('sin-llenar');
    }

    if (!password) {
      passwordField.classList.add('sin-llenar');
      valid = false;
    } else {
      passwordField.classList.remove('sin-llenar');
    }

    if (!confirmPassword) {
      confirmPasswordField.classList.add('sin-llenar');
      valid = false;
    } else {
      confirmPasswordField.classList.remove('sin-llenar');
    }

    if (!valid) {
      console.log('Todos los campos son obligatorios.');
      return; // Detiene la ejecución si algún campo está vacío
    }



    if (password !== confirmPassword) {
      confirmPasswordField.classList.add('sin-llenar');
      console.log('Las contraseñas no coinciden.');
      return;
    }else{
      confirmPasswordField.classList.remove('sin-llenar');
    }
    if (!termsAccepted) {
      console.log('Debes aceptar los Términos y Condiciones.');
      return;
    }

      try {
        const response = await fetch('http://localhost:3000/procesar-datos', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              name: name,
              email: email,
              password: password,
          })
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('Éxito:', result);
    
        // Redirigir al usuario a otra página después de un registro exitoso
        window.location.href = '/public/cliente.html';
      } else {
        // Manejo de errores cuando la respuesta no es exitosa
        console.error('Error en la respuesta de la red:', response.statusText);
        alert('Hubo un problema al procesar los datos. Por favor, inténtalo de nuevo.');
      }
      }catch(err){
        console.error('Error:', error);
      }
  });
});