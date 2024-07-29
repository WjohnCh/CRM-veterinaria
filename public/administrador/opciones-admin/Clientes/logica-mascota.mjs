import {VisualizarHistorialMedico} from '../Historial-Medico/logica-historial.mjs'
const modalDeCarga = document.getElementById("loading-screen")
export async function logicaMascotas() {
    const contenedor = document.getElementById("Cuerpo_tabla-Gestion-Producto")
    const plantilla = document.querySelector(".Fila_producto")


    try {
        modalDeCarga.style.display = "flex";
        const results = await fetch(`http://localhost:3000/mascotas/nombreUsuario`)
        const body = await results.json();

        if(results.ok){
            modalDeCarga.style.display = "none";
            body.forEach(mascota => {
                crearMascotaFila(mascota)
            })
        }else{
            modalDeCarga.style.display = "none";
            alert("OCURRIO UN ERROR, VUELVA A INTENTARLO")
        }


    } catch (error) {
        console.error(error)
    }
    function crearMascotaFila(mascota) {
        const newMascota = plantilla.cloneNode(true)

        const NombreCLiente = newMascota.querySelector(".Valor-Tabla__NombreCliente")
        const NombreMascota = newMascota.querySelector(".Valor-Tabla__Mascota")
        const Nacimiento = newMascota.querySelector(".Valor-Tabla__Nacimiento")
        const Especie = newMascota.querySelector(".Valor-Tabla__Especie")
        const Sexo = newMascota.querySelector(".Valor-Tabla__Sexo")
        const color = newMascota.querySelector(".Valor-Tabla__Color")
        const detalle = newMascota.querySelector(".Valor-Tabla__detalles")

        NombreCLiente.innerText = `${mascota.nombre_cliente} ${mascota.apellido}`
        NombreMascota.innerText = mascota.nombre_mascota
        Nacimiento.innerText = mascota.fecha_nacimiento
        Especie.innerText = mascota.especie
        if (mascota.sexo == "M") {
            Sexo.innerText = "Macho"
        } else {
            Sexo.innerText = "Hembra"
        }

        color.innerText = mascota.raza

        detalle.addEventListener("click", async()=>{
            localStorage.setItem('idMascota', mascota.idmascota);
            await CargarContenido("Historial-Medico/plantilla-historial.html")
            await VisualizarHistorialMedico();
        })


        newMascota.style.display = "table-row"
        contenedor.appendChild(newMascota)

    }


    let contenedorDinamico = document.getElementById("contenedor-main-admin")

    async function CargarContenido(url){
        try {
            modalDeCarga.style.display = "flex";
            let respuesta = await fetch(`/public/administrador/opciones-admin/${url}`);
            if (!respuesta.ok){
                throw new Error('Error al cargar los datos');
            }else{
                modalDeCarga.style.display = "none";
            }
            let contenido = await respuesta.text();
            contenedorDinamico.innerHTML = contenido
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // ----------------------------------------------------------------------
    // ------------------LOGICA PARA FILTRAR MASCOTAS------------------------
    // ----------------------------------------------------------------------

    const inputNombreCLiente = document.getElementById("Nombre_Cliente-gestionMascota-filtro")
    const inputNombreMascota = document.getElementById("Nombre_Mascota-gestionMascota-filtro")
    const btnFiltroCliente = document.getElementById("btn-buscar-gestionMascota-filtro")
    const btnFiltroMascota = document.getElementById("btn-Mascota-gestionMascota-filtro")

    btnFiltroCliente.addEventListener("click", async () => {
        const valorInputNombreCliente = inputNombreCLiente.value.trim()
        try {
            modalDeCarga.style.display = "flex";
            contenedor.innerText = "";
            const result = await fetch(`http://localhost:3000/sesiones/filtros/cliente/${valorInputNombreCliente}`)
            const body = await result.json();
            if (result.ok) {
                
                modalDeCarga.style.display = "none";
                body.forEach(mascota => {
                    crearMascotaFila(mascota)
                })
            } else {
                modalDeCarga.style.display = "none";
                alert('OCURRIO UN ERROR VUELVA A INTENTARLO')
            }
        } catch (error) {
            modalDeCarga.style.display = "none";
            console.error(error)
        }
    })
    btnFiltroMascota.addEventListener("click", async () => {
        const valorInputNombreMascota = inputNombreMascota.value.trim()
        try {
            modalDeCarga.style.display = "flex";
            contenedor.innerText = "";
            const result = await fetch(`http://localhost:3000/sesiones/filtros/mascota/${valorInputNombreMascota}`)
            const body = await result.json();
            if (result.ok) {
                
                modalDeCarga.style.display = "none";
                body.forEach(mascota => {
                    crearMascotaFila(mascota)
                })
            } else {
                modalDeCarga.style.display = "none";
                alert('OCURRIO UN ERROR VUELVA A INTENTARLO')
            }
        } catch (error) {
            modalDeCarga.style.display = "none";
            console.error(error)
        }
    })

}

