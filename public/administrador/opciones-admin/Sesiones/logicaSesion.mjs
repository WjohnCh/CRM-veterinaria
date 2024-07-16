import{VisualizarHistorialMedico} from "../Historial-Medico/logica-historial.mjs"
export async function LogicaSesion() {
    const btnAniadirClienteBtn = document.getElementById("idBtAnidir-new-Cliente-sesion")
    const modalBuscarCliente = document.getElementById("modal-buscar-sesion-cliente");

    const inputBuscarCliente = document.getElementById("input-nombreCLiente-sesion")
    const lupaBuscarCliente = document.getElementById("lupa-Buscar-cliente-sesion")


    const contenedorClienteBody = document.getElementById("Contenido-nombre-coincidencias")
    const plantilla = document.querySelector(".Nombre-coincidencia-sesion")

    const equis = document.querySelectorAll(".modal-generico");

    const modalMascotaUsuarioSesion = document.getElementById("modal-vermascotas-cliente-sesionContenedor")
    const addMascotaUsuarioSesion = document.getElementById("add-NuevaMascotaClienteSesion")
    const regresarMascotaUsuarioSesion = document.getElementById("Regresar-NuevaMascotaClienteSesion")

    const NombreClienteMascota = document.getElementById("NombreClienteNuevaMascota")

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript van de 0 a 11
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    document.getElementById('fecha-sesion-realizado').value = formattedDate;

    let idClienteCrearMascota = 0; // Un id que servirá para actualizar un usuario 
    let idMascota = 0 // Un id que guarda el ID del usuario para actualizar un usuario 
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

    

    lupaBuscarCliente.addEventListener("click", async () => {
        const valorInput = inputBuscarCliente.value

        try {
            contenedorClienteBody.innerText = ""
            const result = await fetch(`http://localhost:3000/buscarcliente/barra/${valorInput}`)
            if (!result.ok) {
                throw new Error(`Error: ${result.status} ${result.statusText}`);
            }
            const body = await result.json();

            if (body.length) {
                body.forEach(cliente => {
                    crearCliente(cliente)
                })
            } else {
                const NoValor = plantilla.cloneNode("true")
                NoValor.style.display = "block"
                contenedorClienteBody.appendChild(NoValor)
            }

        } catch (error) {
            const NoValor = plantilla.cloneNode("true")
            NoValor.style.display = "block"
            contenedorClienteBody.appendChild(NoValor)
            console.error(error)
        }
    })

    inputBuscarCliente.addEventListener("keydown", async (event) => {
        if (event.key === "Enter") {
            const valorInput = inputBuscarCliente.value

            try {
                contenedorClienteBody.innerText = ""
                const result = await fetch(`http://localhost:3000/buscarcliente/barra/${valorInput}`)

                if (!result.ok) {
                    throw new Error(`Error: ${result.status} ${result.statusText}`);
                }
                const body = await result.json();

                if (body.length) {
                    body.forEach(cliente => {
                        crearCliente(cliente)
                    })
                } else {
                    const NoValor = plantilla.cloneNode("true")
                    NoValor.style.display = "block"
                    contenedorClienteBody.appendChild(NoValor)
                }

            } catch (error) {
                const NoValor = plantilla.cloneNode("true")
                NoValor.style.display = "block"
                contenedorClienteBody.appendChild(NoValor)
                console.error(error)
            }
        }
    })

    const nombreClienteVerMascotas = document.getElementById("Nombre-Cliente-Seleccionado")

    // LOGICA PARA CREAR UNA NUEVA FILA DE CLIENTES
    function crearCliente(cliente) {
        const nuevoCLiente = plantilla.cloneNode("true");
        nuevoCLiente.innerText = cliente.NombreCompleto;
        nuevoCLiente.style.display = "block";
        contenedorClienteBody.appendChild(nuevoCLiente)

        nuevoCLiente.addEventListener("click", async () => {
            try {
                const result = await fetch(`http://localhost:3000/obtenerMascotas/cliente/${cliente.idcliente}`)
                const body = await result.json();
                localStorage.setItem('nombreCliente', cliente.NombreCompleto);
                nombreClienteVerMascotas.innerText = cliente.NombreCompleto
                idClienteCrearMascota = cliente.idcliente;
                ContenedorMascota.innerText = ""
                body.forEach(mascota => {
                    GenerarMascotas(mascota, cliente)
                })
                if (body.length == 0) {
                    ContenedorMascota.innerText = "No tiene mascotas registradas ERROR"
                }
            } catch (error) {
                console.error(error)
            }
            modalBuscarCliente.style.display = "none"
            modalMascotaUsuarioSesion.style.display = "grid"
        })


    }

    //PLANTILLA PARA AGREGAR A LA MASCOTA
    const ContenedorMascota = document.getElementById("ContenedorMascotas-cliente-sesion");
    const plantillaMascota = document.querySelector(".Mascota-unica-cliente-sesion");

    // FUNCION PARA CREAR LAS MASCOTAS SELECCIONADAS
    const infoCliente = document.getElementById("informacion-Cliente-nombre-cliente")
    const infoMascota = document.getElementById("informacion-Cliente-nombre-mascota")
    function GenerarMascotas(mascota, cliente) {
        const newMascota = plantillaMascota.cloneNode(true);
        const NombreMascota = newMascota.querySelector(".Nombre_cliente_seleccionado_sesion")
        const EspecieMascota = newMascota.querySelector(".Especie_cliente_seleccionado_sesion")
        const SexoMascota = newMascota.querySelector(".Sexo_cliente_seleccionado_sesion")
        const RazaMascota = newMascota.querySelector(".Raza_cliente_seleccionado_sesion")

        NombreMascota.innerText = mascota.nombre_mascota
        EspecieMascota.innerText = mascota.especie
        SexoMascota.innerText = mascota.sexo
        if (mascota.raza) {
            RazaMascota.innerText = mascota.raza
        }

        newMascota.style.display = "grid"

        newMascota.addEventListener("click", () => {
            idMascota = mascota.idmascota
            console.log(idMascota);
            modalMascotaUsuarioSesion.style.display = "none"
            frmCrearNuevaSesion.style.display = "grid"
            infoCliente.innerText = cliente.NombreCompleto
            infoMascota.innerText = mascota.nombre_mascota
            localStorage.setItem('nombreCliente', cliente.NombreCompleto);
            localStorage.setItem('nombreMascota', mascota.nombre_mascota);
        })
        ContenedorMascota.appendChild(newMascota)
    }

    const modalfrmAniadirMascotaCliente = document.getElementById("modal-AniadirNuevoCliente&&Mascota")
    const frmAniadirMascotaCliente = document.getElementById("AniadirNuevoClienteMascota")
    const frmCrearNuevaSesion = document.getElementById("frmCrearNuevaSesion")

    btnAniadirClienteBtn.addEventListener("click", async () => {
        modalfrmAniadirMascotaCliente.style.display = "grid"
        modalBuscarCliente.style.display = "none"
    })

    frmAniadirMascotaCliente.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(frmAniadirMascotaCliente);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value.trim();
        });

        try {
            const response = await fetch(`http://localhost:3000/nuevocliente`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            const {idmascota,nombreMascota,nombreCompleto} = await response.json();
            idMascota = idmascota
            console.log(idMascota);
            if (response.ok) {
                infoCliente.innerText = nombreCompleto
                infoMascota.innerText = nombreMascota
                modalfrmAniadirMascotaCliente.style.display = "none"
                frmCrearNuevaSesion.style.display = "grid"
            } else {
                throw new Error('Error al actualizar el producto');
            }
        } catch (error) {
            throw new Error('Error al actualizar el producto');
        }

    })

    const frmAniadirMascotaRegistrado = document.getElementById("modal-AniadirNuevaMascotaSesion")

    addMascotaUsuarioSesion.addEventListener("click", () => {
        NombreClienteMascota.innerText = localStorage.getItem('nombreCliente')
        modalMascotaUsuarioSesion.style.display = "none"
        frmAniadirMascotaRegistrado.style.display = "grid"
    })
    regresarMascotaUsuarioSesion.addEventListener("click", () => {
        modalMascotaUsuarioSesion.style.display = "none"
        modalBuscarCliente.style.display = "grid"
    })

    const frmAniadirMascotaClienteRegis = document.getElementById("AniadirNuevoMascotaMascotaSesion")

    frmAniadirMascotaClienteRegis.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(frmAniadirMascotaClienteRegis);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value.trim();
        });
        try {
            const response = await fetch(`http://localhost:3000/aniadirmascota/${idClienteCrearMascota}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const {idmascota, nombreMascota} = await response.json();
            
            idMascota = idmascota
            console.log(idMascota);
            


            if (response.ok) {
                infoCliente.innerText = localStorage.getItem('nombreCliente')
                infoMascota.innerText = nombreMascota
                alert("Mascota añadida correctamente")
                frmAniadirMascotaRegistrado.style.display = "none"
                frmCrearNuevaSesion.style.display = "grid"
            } else {
                alert("Hubo un error al  añadir la mascota")
                throw new Error('Error al actualizar el producto');
            }
        } catch (error) {
            alert("Hubo un error al  añadir la mascota")
            throw new Error('Error al actualizar el producto');
        }
    })

    const frmCrearNewSesion = document.getElementById("frm-agendar-Nueva-sesion-Cliente")

    frmCrearNewSesion.addEventListener("submit", async (event)=>{
        event.preventDefault();
        const formData = new FormData(frmCrearNewSesion);
        const data = {};
        formData.forEach((value, key) => {
            if (key === 'servicios') {
                if (!data[key]) {
                    data[key] = [];
                }
                data[key].push(value);
            } else {
                data[key] = value.trim();
            }
        });

        try {
            const response = await fetch(`http://localhost:3000/crearsesion/${idMascota}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                console.log(idMascota);
                localStorage.setItem('idMascota', idMascota);
                await CargarContenido("Historial-Medico/plantilla-historial.html")
                await VisualizarHistorialMedico();
                alert("Sesion Creada Correctamente")
                frmCrearNuevaSesion.style.display = "none"
            } else {
                alert("Hubo un error al  añadir la mascota")
                throw new Error('Error al actualizar el producto');
            }
        } catch (error) {
            alert("Hubo un error al  añadir la mascota")
            throw new Error('Error al actualizar el producto');
        }
        
    })

    let contenedorDinamico = document.getElementById("contenedor-main-admin")

    async function CargarContenido(url){
        try {
            let respuesta = await fetch(`/public/administrador/opciones-admin/${url}`);
            if (!respuesta.ok){
                throw new Error('Error al cargar los datos');
            }
            let contenido = await respuesta.text();
            contenedorDinamico.innerHTML = contenido
        } catch (error) {
            console.error('Error:', error);
        }
    }


}