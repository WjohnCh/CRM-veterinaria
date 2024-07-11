export async function GestionMascotasCliente() {

    const token = localStorage.getItem('token');

    const btnEditarMascota = document.querySelector(".editar-mascota-btn")
    const btnAniadirMascota = document.querySelector("#btnAniadir-new-pet")

    const ModalAniadirNuevaMascota = document.getElementById("Modal-aniadirNuevaMascota")
    

    const modalExito = document.getElementById("Modal-InterfazExito");
    const modalRechazo = document.getElementById("Modal-InterfazRechazo");
    const modalAdvertencia = document.getElementById("Modal-InterfazAdvertencia");
    const modalAdvertenciaTittle = modalAdvertencia.querySelector(".tittle")
    const modalAdvertenciamensaje = modalAdvertencia.querySelector(".Ayuda-text")
    const modalRechazomensaje = modalRechazo.querySelector(".Ayuda-text")
    const equis = document.querySelectorAll("#caja_contenedora_cliente-content .modal-generico");

    let idmascotaGlobal; // Guarda el id de la mascota

    const ModalEditarMascota = document.getElementById("Modal-EditarNuevaMascota")
    const editar_nombre = document.querySelector(".editar_nombre")
    const editar_especie = document.querySelector(".editar_especie")
    const editar_raza = document.querySelector(".editar_raza")
    const editar_color = document.querySelector(".editar_color")
    const editar_nacimiento = document.querySelector(".editar_nacimiento")
    const editar_peso = document.querySelector(".editar_peso")
    const editar_sexo = document.querySelector(".editar_sexo")

    equis.forEach(element => {

        const equisCerrar = element.querySelector(".equis-ubicacion")
        if (equisCerrar) {
            equisCerrar.addEventListener("click", () => {
                element.style.display = "none";
            })
        }

        element.addEventListener("click", (event) => {
            if (event.target == element) {
                
                element.style.display = "none";
            }
            
        })
    })
    // FUNCION QUE VERIFICA SI SON SOLO LETRAS DE LA "A" A LA "Z"
    function isOnlyLetters(str) {
        const regex = /^[A-Za-z]+$/;
        return regex.test(str);
      }
    function MensajeError(elemento){
        elemento.style.border = "1px solid red"
        elemento.style.backgroundColor = "white"
    }
    function MensajeNOError(elemento){
        elemento.style.border = "none"
        elemento.style.backgroundColor = "#EAEAEA"
    }
    // LOGICA PARA VER LAS MASCOTAS DE CADA CLIENTE

    const ContenedorMascota = document.querySelector(".Contenedor_Mascotas_cliente-lista");
    const plantillaMascota = document.querySelector(".Descripcion_mascota_cliente-lista");
    const mensajeNoHayMascotas = document.getElementById("Mensaje_NoHayMascotas")
    let bad =  []; //GUARDA ELEMENTOS
    async function CrearEstructuraMascota() {
        try {
            ContenedorMascota.innerText = '';
            const response = await fetch('http://localhost:3000/api/cliente/mascotas', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });
            const arrayMascotas = await response.json()

            if (arrayMascotas.pets == false) {
                mensajeNoHayMascotas.style.display = "block";
            } else {
                mensajeNoHayMascotas.style.display = "none";
                arrayMascotas.forEach(mascota => {
                    const newMascota = plantillaMascota.cloneNode(true);
                    const nombre = newMascota.querySelector(".Mascota_cliente_nombre")
                    const especie = newMascota.querySelector(".Mascota_cliente_especie")
                    const raza = newMascota.querySelector(".Mascota_cliente_raza")
                    const color = newMascota.querySelector(".Mascota_cliente_color")
                    const nacimiento = newMascota.querySelector(".Mascota_cliente_nacimiento")
                    const peso = newMascota.querySelector(".Mascota_cliente_peso")
                    const sexo = newMascota.querySelector(".Mascota_cliente_sexo")
                    const btnEditarMascota = newMascota.querySelector(".editar-mascota-btn")
                    nombre.innerText = mascota.nombre_mascota;
                    especie.innerText = mascota.especie;
                    if (mascota.raza) {
                        raza.innerText = mascota.raza;
                    }
                    if (mascota.peso) {
                        peso.innerText = `${mascota.peso} kg`
                    }
                    color.innerText = mascota.color;
                    nacimiento.innerText = mascota.fecha_nacimiento;
                    if (mascota.sexo == "M") {
                        sexo.innerText = "Macho";
                    } else if (mascota.sexo == "H") {
                        sexo.innerText = "Hembra";
                    }

                    btnEditarMascota.onclick = abrirInterfazEditarMascota;

                    function abrirInterfazEditarMascota(){
                        for(let i=0; i<bad.length; i++){
                            MensajeNOError(bad[i]);
                        }
                        bad =  []
                        ModalEditarMascota.style.display = "grid";
                        editar_nombre.value = mascota.nombre_mascota
                        editar_especie.innerText = mascota.especie;
                        editar_color.innerText = mascota.color
                        editar_nacimiento.value = mascota.fecha_nacimiento
                        if (mascota.peso){
                            editar_peso.value = mascota.peso;
                        }
                        if (mascota.raza) {
                            editar_raza.value = mascota.raza;
                        }else{
                            editar_raza.value = 'No especificado';
                        }
                        editar_sexo.innerText =  mascota.sexo

                        idmascotaGlobal = mascota.idmascota
                    }

                    newMascota.style.display = "flex"
                    ContenedorMascota.appendChild(newMascota);
                })
            }

        } catch (error) {
            console.error(error);
        }
    }
    await CrearEstructuraMascota();


    // AL APRETAR EL BOTON SE ABRE UN MODAL PARA QUE SE PUEDA CREAR UNA NUEVA MASCOTA
    btnAniadirMascota.addEventListener("click", async () => {
        ModalAniadirNuevaMascota.style.display = "grid";
    })
    const fechaNacimientoAgregar = document.getElementById("fechaNacimiento")
    const today = new Date().toISOString().split('T')[0];
    fechaNacimientoAgregar.setAttribute('max', today);

    
    Formulario_AniadirMascota.addEventListener("submit", async (event) => {
        event.preventDefault();
        for(let i=0; i<bad.length; i++){
            MensajeNOError(bad[i]);
        }
        bad =  []; // Recolecta los elementos malos
        const nombreMascota = document.getElementById("nombre_mascota-aniadorFRM")
        const Raza = document.getElementById("raza_mascota-aniadorFRM");
        const color = document.getElementById("color_mascota-aniadorFRM");
        if (!isOnlyLetters(nombreMascota.value)) {
            bad.push(nombreMascota)
        }
        if(!isOnlyLetters(Raza.value)){
            bad.push(Raza)
        }
        if(!isOnlyLetters(color.value)){
            bad.push(color)
        }

        if(bad.length >= 1){
            for(let i=0; i<bad.length; i++){
                MensajeError(bad[i]);
            }
            modalRechazomensaje.innerText = "Algunos campo solo pueden contener letras de la A a la Z"
            modalRechazo.style.display = "grid";
        }
        else{

        const formData = new FormData(Formulario_AniadirMascota);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value.trim();
        });

        try {
            const response = await fetch(`http://localhost:3000/crear-mascota`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                modalRechazo.style.display = "grid"
                throw new Error('Error al actualizar el producto');
            } else {
                await CrearEstructuraMascota();
                ModalAniadirNuevaMascota.style.display = "none";
                modalExito.style.display = "grid"
                Formulario_AniadirMascota.reset();
            }

        } catch (error) {
            modalRechazo.style.display = "grid"
            throw new Error('Error al actualizar el producto');
        }
        }
    })

    const frm_editarMascota = document.getElementById("Formulario_EditarMascota");
    const NacimientoEditar = frm_editarMascota.querySelector(".editar_nacimiento");
    NacimientoEditar.setAttribute('max', today);
    frm_editarMascota.addEventListener("submit", async (event)=>{
        event.preventDefault();
        for(let i=0; i<bad.length; i++){
            MensajeNOError(bad[i]);
        }
        bad =  []; // Recolecta los elementos malos
        const nombreMascota = document.getElementById("nombre_mascota-editarFRM")
        const Raza = document.getElementById("raza_mascota-editarFRM");
        if (!isOnlyLetters(nombreMascota.value)) {
            bad.push(nombreMascota)
        }
        if(!isOnlyLetters(Raza.value)){
            bad.push(Raza)
        }

        if(bad.length >= 1){
            for(let i=0; i<bad.length; i++){
                MensajeError(bad[i]);
            }
            modalRechazomensaje.innerText = "Algunos campo solo pueden contener letras de la A a la Z"
            modalRechazo.style.display = "grid";
        }else{

        
        const formData = new FormData(frm_editarMascota);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        try {
            const response = await fetch(`http://localhost:3000/editar-mascota/cliente/${idmascotaGlobal}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(data)
            });
            const respuesta = await response.json()

            if (!response.ok) {

                modalRechazo.style.display = "grid";
                throw new Error('Error al actualizar el producto');
            } else {
                if(respuesta.success ==true){
                    await CrearEstructuraMascota();
                    ModalEditarMascota.style.display = "none";
                    modalExito.style.display = "grid"
                }else{
                    modalAdvertenciaTittle.innerText = "Sin modificaciones detectadas"
                    modalAdvertencia.style.display = "grid"
                }
            }
        } catch (error) {
            modalRechazo.style.display = "grid"
            throw new Error('Error al actualizar el producto');
        }
        }
    })

}