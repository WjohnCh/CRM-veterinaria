import {AbrirCerrarInterfaz} from '../js-admin/admin-Interfaz.mjs';


document.addEventListener("DOMContentLoaded", async ()=> {

        const opcionesAdmin = document.querySelectorAll('.option-admin');
        const asideNabvarClose= document.querySelector('.bar-right-img');
        const contenedorNavbarAdmin= document.querySelector('.administrador-navbar');
        const imgLogoCan = document.querySelector(".imgLogoCAN")
        const textoAdministrador = document.querySelector(".texto-administrador")

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

        const userInformation = document.querySelector(".user-information")
        let minimizado = false // Verifica en que estado tiene que estar el navbare
        asideNabvarClose.addEventListener('click', ()=>{
            minimizado = !minimizado
            if(minimizado){
                contenedorNavbarAdmin.style.width = "80px"
                asideNabvarClose.style.left = "36px"
                opcionesAdmin.forEach(element=>{
                    element.style.width= "50px"
                    element.querySelector('.descripcion-btn-admin').style.display = "none";
                })
                imgLogoCan.style.display = "none"
                textoAdministrador.style.color = "#191919"
            }else if (!minimizado){
                contenedorNavbarAdmin.style.width = "280px"
                asideNabvarClose.style.left = "240px"
                opcionesAdmin.forEach(element=>{
                    element.style.width= "auto"
                    element.querySelector('.descripcion-btn-admin').style.display = "block";
                })
                imgLogoCan.style.display = "block"
                textoAdministrador.style.color = "white"
            }

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