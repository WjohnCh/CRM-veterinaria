document.addEventListener("DOMContentLoaded", function() {
        const contenedorCita = document.getElementById('contenedor-citas-option');
        const opcionesCita = document.getElementById('opciones-cita')

        contenedorCita.addEventListener('click',()=>{
            if (opcionesCita.style.display === 'none' || opcionesCita.style.display === '') {
                opcionesCita.style.display = 'block';
            } else {
                opcionesCita.style.display = 'none';
            }
        })
})