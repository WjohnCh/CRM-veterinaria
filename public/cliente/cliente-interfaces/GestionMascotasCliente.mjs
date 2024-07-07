export async function GestionMascotasCliente(){

    const token = localStorage.getItem('token');

    const btnEditarMascota = document.querySelector(".editar-mascota-btn")
    const btnAniadirMascota = document.querySelector("#btnAniadir-new-pet")

    const ModalAniadirNuevaMascota = document.getElementById("Modal-aniadirNuevaMascota")

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

    // LOGICA PARA VER LAS MASCOTAS DE CADA CLIENTE

    const ContenedorMascota = document.querySelector(".Contenedor_Mascotas_cliente-lista");
    const plantillaMascota = document.querySelector(".Descripcion_mascota_cliente-lista");
    const mensajeNoHayMascotas = document.getElementById("Mensaje_NoHayMascotas")
    try {
        const response = await fetch('http://localhost:3000/api/cliente/mascotas', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        const arrayMascotas = await response.json()
        
        if(arrayMascotas.pets == false){
            mensajeNoHayMascotas.style.display="block";
        }else{
            mensajeNoHayMascotas.style.display="none";
            arrayMascotas.forEach(mascota =>{
                const newMascota = plantillaMascota.cloneNode(true);
                const nombre = newMascota.querySelector(".Mascota_cliente_nombre")
                const especie = newMascota.querySelector(".Mascota_cliente_especie")
                const raza = newMascota.querySelector(".Mascota_cliente_raza")
                const color = newMascota.querySelector(".Mascota_cliente_color")
                const nacimiento = newMascota.querySelector(".Mascota_cliente_nacimiento")
                const peso = newMascota.querySelector(".Mascota_cliente_peso")
                const sexo = newMascota.querySelector(".Mascota_cliente_sexo")
    
                nombre.innerText = mascota.nombre_mascota;
                especie.innerText = mascota.especie;
                raza.innerText = mascota.raza;
                color.innerText = mascota.color;
                nacimiento.innerText = mascota.fecha_nacimiento;
                peso.innerText = mascota.peso;
                sexo.innerText = mascota.sexo;
                newMascota.style.display = "flex"
                ContenedorMascota.appendChild(newMascota);
            })
        }

    } catch (error) {
        
    }


    // AL APRETAR EL BOTON SE ABRE UN MODAL PARA QUE SE PUEDA CREAR UNA NUEVA MASCOTA
    btnAniadirMascota.addEventListener("click",async()=>{
        try {
            
            
            ModalAniadirNuevaMascota.style.display = "grid";

        }catch (error) {
            console.log(error);
        }
    })

    btnEditarMascota.addEventListener("click",async ()=>{
        try {
            
            

        }catch (error) {
            
        }
    })

}