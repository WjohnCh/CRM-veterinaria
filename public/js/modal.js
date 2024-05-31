document.addEventListener("DOMContentLoaded", function() {
    const modalContainer = document.getElementById('modal-container');
    const modal2 = document.getElementById('modal-container2');
    const modal3 = document.getElementById('modal-container3');
    const cerrarModales = document.querySelectorAll('.cerrar-modal');
    const equisSvg = document.querySelector(".corner-image");

    const modals = [modalContainer, modal2, modal3];

    function mostrarModal(modal) {
        document.body.style.overflow = "hidden";
        modal.style.display = 'grid';
    }
    
    function ocultarModal(modal) {
        document.body.style.overflow = "auto";
        modal.style.display = 'none';
    }
    
    function ocultarTodosModales() {
        document.body.style.overflow = "auto";
        modals.forEach(modal => modal.style.display = 'none');
    }

    document.getElementById('signin-link').addEventListener("click", function(event) {
        event.preventDefault();
        mostrarModal(modalContainer);
    });

    document.getElementById('cerrar-modal').addEventListener("click", function(event) {
        ocultarModal(modalContainer);
    });

    // document.getElementById('boton-registrarse').addEventListener("click", function(event) {
    //     ocultarModal(modalContainer);
    // });

    modalContainer.addEventListener("click", function(event) {
        if (event.target === modalContainer) {
            ocultarModal(modalContainer);
        }
    });

    document.getElementById("abrir-modal2").addEventListener("click", function(event) {
        event.preventDefault();
        ocultarModal(modalContainer);
        mostrarModal(modal2);
    });

    document.querySelector(".olvide-contrasena").addEventListener("click", function(event) {
        event.preventDefault();
        ocultarTodosModales();
        mostrarModal(modal3);
    });

    cerrarModales.forEach(cerrar => cerrar.addEventListener("click", function(event) {
        event.preventDefault();
        ocultarTodosModales();
    }));

    equisSvg.addEventListener("click", function(event) {
        event.preventDefault();
        ocultarModal(modal2);
    });

    modal2.addEventListener("click", function(event) {
        if (event.target === modal2) {
            ocultarModal(modal2);
        }
    });

    modal3.addEventListener("click", function(event) {
        if (event.target === modal3) {
            ocultarModal(modal3);
        }
    });
});