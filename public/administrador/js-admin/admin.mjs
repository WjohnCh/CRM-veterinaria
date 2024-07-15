import {AbrirCerrarInterfaz} from '../js-admin/admin-Interfaz.mjs';


document.addEventListener("DOMContentLoaded", async ()=> {

        const opcionesAdmin = document.querySelectorAll('.option-admin');
        const asideNabvarClose= document.querySelector('.bar-right-img');
        const contenedorNavbarAdmin= document.querySelector('.administrador-navbar');

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

        let UltimaOpcionAdmin = null;
        
        await AbrirCerrarInterfaz();


        opcionesAdmin.forEach((elemento)=>{
            elemento.addEventListener("click", ()=>{
                if(UltimaOpcionAdmin){
                    UltimaOpcionAdmin.classList.remove('active')
                }
                elemento.classList.add('active')
                UltimaOpcionAdmin = elemento;
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