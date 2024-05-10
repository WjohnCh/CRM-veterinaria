document.addEventListener("DOMContentLoaded", function() {
    const signinLink = document.getElementById('signin-link');
    const modalContainer = document.getElementById('modal-container');
    const cerrarModalLink = document.getElementById('cerrar-modal');
    const botonRegistrarse = document.getElementById('boton-registrarse');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Función para mostrar el modal
    function mostrarModal() {
        modalContainer.style.display = 'grid';
    }

    // Función para ocultar el modal
    function ocultarModal() {
        modalContainer.style.display = 'none';
    }

    // Función para validar los campos
    function validarCampos() {
        if (emailInput.value.trim() === "" || passwordInput.value.trim() === "") {
            return false; // Devuelve falso si algún campo está vacío
        }
        return true; // Devuelve verdadero si todos los campos están llenados
    }

    // Agrega un controlador de eventos al enlace de "Sign In"
    signinLink.addEventListener("click", function(event) {
        event.preventDefault(); // Evita que el enlace se comporte como un enlace normal
        mostrarModal();
    });

    // Agrega un controlador de eventos al enlace de cerrar el modal
    cerrarModalLink.addEventListener("click", function(event) {
        ocultarModal();
    });

    // Agrega un controlador de eventos al botón "Registrarse"
    botonRegistrarse.addEventListener("click", function(event) {
        if (!validarCampos()) {
            event.preventDefault(); // Evitar que se cierre el modal si los campos no están llenados
        } else {
            ocultarModal();
        }
    });

    // Agrega un controlador de eventos al contenedor del modal para cerrarlo cuando se hace clic fuera de él
    modalContainer.addEventListener("click", function(event) {
        if (event.target === modalContainer) { // Verifica si se hizo clic fuera del contenido del modal
            ocultarModal();
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    var abrirModal2 = document.getElementById("abrir-modal2");
    var modal1 = document.getElementById("modal-container");
    var modal2 = document.getElementById("modal-container2");
    var cerrarModal1 = modal1.querySelector(".cerrar-modal");
    var botonRegistrarseModal2 = modal2.querySelector("#boton-registrarse-modal2");
    var cerrarModal2 = modal2.querySelector(".cerrar-modal");
    var equisSvg = modal2.querySelector(".corner-image");

    abrirModal2.addEventListener("click", function(event) {
        event.preventDefault();
        modal1.style.display = "none"; // Oculta el primer modal
        modal2.style.display = "grid"; // Muestra el segundo modal
    });

    cerrarModal1.addEventListener("click", function(event) {
        event.preventDefault();
        modal1.style.display = "none"; // Oculta el primer modal
    });

    botonRegistrarseModal2.addEventListener("click", function(event) {
        // Validar que todos los campos estén llenados antes de cerrar el modal
        var camposLlenados = validarCamposLlenados(); // Función para validar campos
        if (!camposLlenados) {
            event.preventDefault(); // Evitar que se cierre el modal si los campos no están llenados
        }
    });

    cerrarModal2.addEventListener("click", function(event) {
        event.preventDefault();
        modal2.style.display = "none"; // Oculta el segundo modal
    });

    equisSvg.addEventListener("click", function(event) {
        event.preventDefault();
        modal2.style.display = "none"; // Oculta el segundo modal
    });

    modal2.addEventListener("click", function(event) {
        if (event.target === modal2) { // Verifica si se hizo clic fuera del contenido del modal
            modal2.style.display = "none"; // Oculta el segundo modal
        }
    });

    function validarCamposLlenados() {
        var inputs = modal2.querySelectorAll(".principal");
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].value.trim() === "") {
                return false; // Devuelve falso si algún campo está vacío
            }
        }
        return true; // Devuelve verdadero si todos los campos están llenados
    }
});




document.addEventListener("DOMContentLoaded", function() {
    var abrirModal3 = document.querySelector(".olvide-contrasena");
    var modal1 = document.getElementById("modal-container");
    var modal2 = document.getElementById("modal-container2");
    var modal3 = document.getElementById("modal-container3");
    var cerrarModal1 = modal1.querySelector(".cerrar-modal");
    var botonRegistrarseModal2 = modal2.querySelector("#boton-registrarse-modal2");
    var cerrarModal2 = modal2.querySelector(".cerrar-modal");
    var cerrarModal3 = modal3.querySelector(".cerrar-modal");
    
    abrirModal3.addEventListener("click", function(event) {
        event.preventDefault();
        modal1.style.display = "none"; // Oculta el primer modal
        modal2.style.display = "none"; // Oculta el segundo modal
        modal3.style.display = "grid"; // Muestra el tercer modal
    });

    cerrarModal1.addEventListener("click", function(event) {
        event.preventDefault();
        modal1.style.display = "none"; // Oculta el primer modal
    });

    botonRegistrarseModal2.addEventListener("click", function(event) {
        // Validar que todos los campos estén llenados antes de cerrar el modal
        var camposLlenados = validarCamposLlenadosModal2(); // Función para validar campos del segundo modal
        if (!camposLlenados) {
            event.preventDefault(); // Evitar que se cierre el segundo modal si los campos no están llenados
        }
    });

    cerrarModal2.addEventListener("click", function(event) {
        event.preventDefault();
        modal2.style.display = "none"; // Oculta el segundo modal
    });

    cerrarModal3.addEventListener("click", function(event) {
        event.preventDefault();
        modal3.style.display = "none"; // Oculta el tercer modal
    });

    modal2.addEventListener("click", function(event) {
        if (event.target === modal2) { // Verifica si se hizo clic fuera del contenido del segundo modal
            modal2.style.display = "none"; // Oculta el segundo modal
        }
    });

    modal3.addEventListener("click", function(event) {
        if (event.target === modal3) { // Verifica si se hizo clic fuera del contenido del tercer modal
            modal3.style.display = "none"; // Oculta el tercer modal
        }
    });

    function validarCamposLlenadosModal2() {
        var inputs = modal2.querySelectorAll(".principal");
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].value.trim() === "") {
                return false; // Devuelve falso si algún campo está vacío
            }
        }
        return true; // Devuelve verdadero si todos los campos están llenados
    }
});