document.addEventListener('DOMContentLoaded', () => {
  const buttonRegistrate = document.getElementById('boton-registrarse-modal2')
  buttonRegistrate.addEventListener('click', async (event) => {
    const campos = [
      document.getElementById('registrate-name'),
      document.getElementById('registrate-email'),
      document.getElementById('registrate-password'),
      document.getElementById('registrate-confirm-password'),
    ]
    const termsAccepted = document.getElementById('registrate-terms').checked;
    
    let valid = true;
    
    campos.forEach(campo =>{
      console.log(campo);
      const isempty = !campo.value.trim(); // true: if it is empty || false: if it is full 
      const label = document.querySelector(`label[for="${campo.id}"]`);
      campo.classList.toggle('sin-llenar', isempty);
      label.classList.toggle('label-red', isempty);
      if (isempty) {
        valid = false;
        console.log('Hola');
      }
    })

    if (!valid) {
      console.log('Todos los campos son obligatorios.');
      return; // Detiene la ejecución si algún campo está vacío
    }
    const [nameField, emailField,passwordField, confirmPasswordField] = campos;
    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const password = passwordField.value.trim();
    const confirmPassword = confirmPasswordField.value.trim();

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

    event.preventDefault();

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