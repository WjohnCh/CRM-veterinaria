document.addEventListener('DOMContentLoaded', () => {
  const buttonRegistrate = document.getElementById('boton-registrarse-modal2')
  const formUserRegistration = document.getElementById("user-registrate");

  formUserRegistration.addEventListener("submit", async (event)=>{
    event.preventDefault();
    const campos = [
      document.getElementById('registrate-name'),
      document.getElementById('registrate-email'),
      document.getElementById('registrate-password'),
    ]
    const [nameField, emailField,passwordField] = campos;
    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const password = passwordField.value.trim();


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
      const result = await response.json();
      
      if(result.existenciaCorreo){
        campos[1].classList.add('sin-llenar');
        const label = document.querySelector(`label[for="${campos[1].id}"]`);
        const mensajeError = document.querySelector(`p[for="${campos[1].id}-err"]`);
        mensajeError.classList.add('motrar-elemento')
        label.classList.add('label-red');
        alert('ERROR AL REGISTRARSE\nEl correo electrónico ya existe.');
      }

      if (response.ok && result.success) {
        localStorage.setItem('token', result.token);
    
        // Redirigir al usuario a otra página después de un registro exitoso
        window.location.href = '/public/cliente/cliente-index.html';
      } else {
        // Manejo de errores cuando la respuesta no es exitosa
        console.error('Error en la respuesta de la red:', response.statusText);
      }
      }catch(err){
        console.error('Error:', err);
      }
  })
  buttonRegistrate.addEventListener('click', async (event) => {
    const campos = [
      document.getElementById('registrate-name'),
      document.getElementById('registrate-email'),
      document.getElementById('registrate-password'),
    ]
    const termsAccepted = document.getElementById('registrate-terms').checked;
    const confirmPasswordField = document.getElementById('registrate-confirm-password');
    let valid = true;
    
    campos.forEach(campo =>{
      const isempty = !campo.value.trim(); // true: if it is empty || false: if it is full 
      const label = document.querySelector(`label[for="${campo.id}"]`);
      const mensajeError = document.querySelector(`p[for="${campo.id}-err"]`);
      campo.classList.toggle('sin-llenar', isempty);
      label.classList.toggle('label-red', isempty);
      mensajeError.classList.toggle('motrar-elemento', isempty);
      if (isempty) {
        valid = false;
      }
    })

    if (!valid) {
      console.log('Todos los campos son obligatorios.');
      return; // Detiene la ejecución si algún campo está vacío
    }
    const [nameField, emailField,passwordField] = campos;
    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const password = passwordField.value.trim();
    const confirmPassword = confirmPasswordField.value.trim();
    
    const mensajeError1 = document.querySelector(`p[for="registrate-confirm-password-err"]`);
    if (password !== confirmPassword) {
      confirmPasswordField.classList.add('sin-llenar');
      mensajeError1.classList.add("motrar-elemento")
      console.log('Las contraseñas no coinciden.');
      return;
    }else{
      confirmPasswordField.classList.remove('sin-llenar');
      mensajeError1.classList.remove("motrar-elemento")
    }
    if (!termsAccepted) {
      const terms = document.querySelector('.Terminos-condiciones a');
      terms.classList.add('volver-iniciar-terms');
      console.log('Debes aceptar los Términos y Condiciones.');
      return;
    }
  });
});