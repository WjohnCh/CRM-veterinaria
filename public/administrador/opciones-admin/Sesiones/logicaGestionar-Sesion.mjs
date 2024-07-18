const modalDeCarga = document.getElementById("loading-screen")
export async function logicaSesionGestion(){
    const contenedor = document.getElementById("Cuerpo_tabla-Gestion-Producto")
    const plantilla = document.querySelector(".Fila_producto")


    try {
        modalDeCarga.style.display = "flex";
        const results = await fetch(`http://localhost:3000/sesiones`)
        const body = await results.json();
        
        if(results.ok){
            //CARGAR MODAL DE ACEPTAR
            modalDeCarga.style.display = "none";
        }else{
            //CARGAR MODAL DE ERROR
        }

        body.forEach(async (sesion)=>{
            const results = await fetch(`http://localhost:3000/sesiones/servicios/${sesion.idSesion}`)
            const body1 = await results.json();
            crearSesionFila(sesion, body1)
        })

    } catch (error) {
        console.error(error)
    }

    function crearSesionFila(sesion, body1){
        const newSesion = plantilla.cloneNode(true)
        const sesion1 = newSesion.querySelector(".Valor-Tabla__NombreSesion")
        const fecha = newSesion.querySelector(".Valor-Tabla__Nacimiento")
        const monto = newSesion.querySelector(".Valor-Tabla__Especie")
        const nombreCliente = newSesion.querySelector(".Valor-Tabla__nombreCliente")
        const nomMascota = newSesion.querySelector(".Valor-Tabla__Mascota")
        const Asunto = newSesion.querySelector(".Valor-Tabla__Sexo")
        
        sesion1.innerText = sesion.idSesion
        fecha.innerText = sesion.fecha
        monto.innerText = sesion.monto
        nombreCliente.innerText = `${sesion.nombre_cliente} ${sesion.apellido}`
        nomMascota.innerText = sesion.nombre_mascota

        let p='';
        body1.forEach(servicio=>{
            p =  `${servicio.NombreServicio}, ` + p
        })
        Asunto.innerText = p

        newSesion.style.display = "table-row"
        contenedor.appendChild(newSesion)
    }
}