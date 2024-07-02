import {AbrirCerrarInterfaz} from '../js-admin/admin-Interfaz.mjs';


document.addEventListener("DOMContentLoaded", async ()=> {

        const contenedorCita = document.getElementById('contenedor-citas-option');
        // const opcionesCita = document.querySelectorAll('.opciones-cita')
        const opcionesAdmin = document.querySelectorAll('.option-admin');
        const opcionesAdminOptions = document.querySelectorAll('.contenedor-opcion-admin.opcionesAd');
        const flechaGira = document.querySelectorAll('.flecha-admin-opcion')
        const arrayOpciones = document.querySelectorAll('.opcion-admin');
        const asideNabvarClose= document.querySelector('.bar-right-img');
        const contenedorNavbarAdmin= document.querySelector('.administrador-navbar');
        const arrayInterfazOpciones = document.querySelectorAll('.Mostrar-Opcion-Interfaz')

        const equis = document.querySelectorAll(".modal-generico");

        equis.forEach(element=>{
            const equisCerrar = element.querySelector(".equis-ubicacion")
            if(equisCerrar){
                equisCerrar.addEventListener("click", ()=>{
                element.style.display = "none";
            })           
            }

            element.addEventListener("click", (event)=>{
                if(event.target == element){
                    element.style.display = "none";
                }
            })
        })

        let UltimaOpcionClick = null;
        let UltimaOpcionAdmin = null;
        
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

        opcionesAdmin.forEach((elemento)=>{
            elemento.addEventListener("click", ()=>{
                if(UltimaOpcionAdmin){
                    UltimaOpcionAdmin.classList.remove('active')
                    console.log("hello");
                }
                elemento.classList.add('active')
                UltimaOpcionAdmin = elemento;
                if(UltimoOptionAdmin && estadoFlecha){
                    UltimoOptionAdmin.classList.remove("motrar-elemento");
                    estadoFlecha.classList.add("flecha-admin-opcion");
                }
            })
        })

        let UltimoOptionAdmin = null
        let estadoFlecha = null

        opcionesAdminOptions.forEach((elemento)=>{
            elemento.addEventListener("click", ()=>{
                const flecha = elemento.querySelector('.flecha-admin');
                const opcionesCita = elemento.querySelector('.opciones-cita')
                if(UltimoOptionAdmin && estadoFlecha){
                    UltimoOptionAdmin.classList.remove("motrar-elemento");
                    estadoFlecha.classList.add("flecha-admin-opcion");
                }
                flecha.classList.remove("flecha-admin-opcion")
                opcionesCita.classList.add("motrar-elemento")

                UltimoOptionAdmin = opcionesCita
                estadoFlecha = flecha
            })
        })

        asideNabvarClose.addEventListener('click', ()=>{
            document.body.appendChild(asideNabvarClose);
            document.body.classList.toggle('solo-un-elemento');
            contenedorNavbarAdmin.classList.toggle('hidden-admin-navbar');
            asideNabvarClose.classList.toggle('mover-bar');
        })



        // LOGICA QUE ENVIA AÑADE UN NUEVO PRODUCTO

        const btEnviar = document.getElementById("Formulario_AñadirProductoBD");

        console.log("HOLA");

        console.log(btEnviar, "pepe");
        btEnviar.addEventListener("submit", async (event)=>{
            alert('Producto actualizado exitosamente');
            event.preventDefault();
            const form = event.target;
            const formData = new FormData(form);

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: formData
                });

                if (response.ok) {
                    
                    const result = await response.json();
                } else {
                    const errorText = await response.text();
                    throw new Error(`Error al añadir producto: ${errorText}`)
                }
            } catch (error) {
                document.getElementById('respuesta').textContent = `Error: ${error.message}`;
            }
        })

})