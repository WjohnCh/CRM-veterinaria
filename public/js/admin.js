
document.addEventListener("DOMContentLoaded", function() {
        const contenedorCita = document.getElementById('contenedor-citas-option');
        const opcionesCita = document.querySelectorAll('.opciones-cita')
        const opcionesAdmin = document.querySelectorAll('.option-admin');
        const flechaGira = document.querySelectorAll('.flecha-admin-opcion')
        // contenedorCita.addEventListener('click',()=>{
        //         opcionesCita.classList.toggle("motrar-elemento");
        //         flechaGira.classList.toggle('flecha-admin-opcion');
        // })


// LOGICA PARA CAMBIAR DE COLOR UN BOTON
        opcionesAdmin.forEach(function(element) {
            element.addEventListener('click', function() {
                let i =0;
                let aux = this;
                const flecha = this.querySelector('.flecha-admin');
                // Eliminar la clase 'active' de todos los elementos
                opcionesAdmin.forEach(function(el) {
                    if(aux != el){
                        opcionesCita[i].classList.remove("motrar-elemento");
                        flechaGira[i++].classList.add("flecha-admin-opcion");
                        el.classList.remove('active');
                    }else{
                        i++;
                    }
                    });
                this.nextElementSibling.classList.toggle("motrar-elemento");
                flecha.classList.toggle('flecha-admin-opcion');
                this.classList.add('active'); // this hace referencia al elemento que activó el evento
            });
        });
})