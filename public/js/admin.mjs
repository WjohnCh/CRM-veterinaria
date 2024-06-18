import {AbrirCerrarInterfaz} from './admin-Interfaz.mjs'

document.addEventListener("DOMContentLoaded", async ()=> {

        const contenedorCita = document.getElementById('contenedor-citas-option');
        const opcionesCita = document.querySelectorAll('.opciones-cita')
        const opcionesAdmin = document.querySelectorAll('.option-admin');
        const flechaGira = document.querySelectorAll('.flecha-admin-opcion')
        const arrayOpciones = document.querySelectorAll('.opcion-admin');
        const asideNabvarClose= document.querySelector('.bar-right-img');
        const contenedorNavbarAdmin= document.querySelector('.administrador-navbar');
        const arrayInterfazOpciones = document.querySelectorAll('.Mostrar-Opcion-Interfaz')
        // contenedorCita.addEventListener('click',()=>{
        //         opcionesCita.classList.toggle("motrar-elemento");
        //         flechaGira.classList.toggle('flecha-admin-opcion');
        // })


        let UltimaOpcionClick = null;
        
        
        await AbrirCerrarInterfaz();

        arrayOpciones.forEach((opcion)=>{
            opcion.addEventListener("click", ()=>{

                if (UltimaOpcionClick) {
                    UltimaOpcionClick.style.backgroundColor = "";
                }
                opcion.style.backgroundColor = "#45474B";
                UltimaOpcionClick = opcion;
            })
        })

    // LOGICA PARA CAMBIAR DE COLOR UN BOTON
        opcionesAdmin.forEach(function(element){
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

        asideNabvarClose.addEventListener('click', ()=>{
            document.body.appendChild(asideNabvarClose);
            document.body.classList.toggle('solo-un-elemento');
            contenedorNavbarAdmin.classList.toggle('hidden-admin-navbar');
            asideNabvarClose.classList.toggle('mover-bar');
        })

})