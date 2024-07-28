const modalDeCarga = document.getElementById("loading-screen")
export async function logicaSesionGestion() {
    const contenedor = document.getElementById("Cuerpo_tabla-Gestion-Producto")
    const plantilla = document.querySelector(".Fila_producto")


    try {
        modalDeCarga.style.display = "flex";
        const results = await fetch(`http://localhost:3000/sesiones`)
        const body = await results.json();

        if (results.ok) {
            //CARGAR MODAL DE ACEPTAR
            modalDeCarga.style.display = "none";
        } else {
            modalDeCarga.style.display = "none";
            //CARGAR MODAL DE ERROR
        }

        body.forEach(async (sesion) => {
            const results = await fetch(`http://localhost:3000/sesiones/servicios/${sesion.idSesion}`)
            const body1 = await results.json();
            crearSesionFila(sesion, body1)
        })

    } catch (error) {
        console.error(error)
    }

    function crearSesionFila(sesion, body1) {
        const newSesion = plantilla.cloneNode(true)
        const sesion1 = newSesion.querySelector(".Valor-Tabla__NombreSesion")
        const fecha = newSesion.querySelector(".Valor-Tabla__Nacimiento")
        const monto = newSesion.querySelector(".Valor-Tabla__Especie")
        const nombreCliente = newSesion.querySelector(".Valor-Tabla__nombreCliente")
        const nomMascota = newSesion.querySelector(".Valor-Tabla__Mascota")
        const Asunto = newSesion.querySelector(".Valor-Tabla__Sexo")

        sesion1.innerText = sesion.idSesion
        fecha.innerText = sesion.fecha
        monto.innerText = `S/. ${(sesion.monto).toFixed(2)}`
        nombreCliente.innerText = `${sesion.nombre_cliente} ${sesion.apellido}`
        nomMascota.innerText = sesion.nombre_mascota

        let p = '';
        body1.forEach(servicio => {
            p = `${servicio.NombreServicio}, ` + p
        })
        Asunto.innerText = p

        newSesion.style.display = "table-row"
        contenedor.appendChild(newSesion)
    }

    //----------------------------- FILTROSSSSS --------------------------------

    const inputFecha = document.getElementById("Buscar-FECHA-ID_SESIONES")
    const inputCliente = document.getElementById("Nombre_Cliente-Sesion-filtro")
    const inputMascota = document.getElementById("Nombre_Mascota-Sesion-filtro")
    const btnFecha = document.getElementById("Buscar-Tabla_ID-Fecha-id")
    const btnCliente = document.getElementById("Buscar-Tabla_ID-cliente-sesion")
    const btnMascota = document.getElementById("Buscar-Tabla_ID-mascota-sesion")

    btnFecha.addEventListener("click", async () => {
        const valorFecha = inputFecha.value
        try {
            contenedor.innerText = ""
            modalDeCarga.style.display = "flex";
            const results = await fetch(`http://localhost:3000/sesiones/filtroFecha/${valorFecha}`)
            const body = await results.json();

            if (results.ok) {

                modalDeCarga.style.display = "none";
                body.forEach(async (sesion) => {
                    const results = await fetch(`http://localhost:3000/sesiones/servicios/${sesion.idSesion}`)
                    const body1 = await results.json();
                    crearSesionFila(sesion, body1)
                })
            } else {
                modalDeCarga.style.display = "none";
            }

        } catch (error) {
            modalDeCarga.style.display = "none";
            console.error(error)
        }
    })
    btnCliente.addEventListener("click", async () => {
        const valorCliente = inputCliente.value
        try {
            contenedor.innerText = ""
            modalDeCarga.style.display = "flex";
            const results = await fetch(`http://localhost:3000/sesiones/filtroCliente/${valorCliente}`)
            const body = await results.json();

            if (results.ok) {

                modalDeCarga.style.display = "none";
                body.forEach(async (sesion) => {
                    const results = await fetch(`http://localhost:3000/sesiones/servicios/${sesion.idSesion}`)
                    const body1 = await results.json();
                    crearSesionFila(sesion, body1)
                })
            } else {
                modalDeCarga.style.display = "none";
            }

        } catch (error) {
            modalDeCarga.style.display = "none";
            console.error(error)
        }
    })
    btnMascota.addEventListener("click", async () => {
        const valorMascota = inputMascota.value
        try {
            contenedor.innerText = ""
            modalDeCarga.style.display = "flex";
            const results = await fetch(`http://localhost:3000/sesiones/filtroMascota/${valorMascota}`)
            const body = await results.json();

            if (results.ok) {

                modalDeCarga.style.display = "none";
                body.forEach(async (sesion) => {
                    const results = await fetch(`http://localhost:3000/sesiones/servicios/${sesion.idSesion}`)
                    const body1 = await results.json();
                    crearSesionFila(sesion, body1)
                })
            } else {
                modalDeCarga.style.display = "none";
            }

        } catch (error) {
            modalDeCarga.style.display = "none";
            console.error(error)
        }
    })

}
