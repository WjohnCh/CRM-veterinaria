const modalDeCarga = document.getElementById("loading-screen")
export async function logicaCliente(){
    const contenedor = document.getElementById("Cuerpo_tabla-Gestion-Producto")
    const plantilla = document.querySelector(".Fila_producto")

    try {
        modalDeCarga.style.display = "flex";
        const results = await fetch(`http://localhost:3000/clientes`)
        const body = await results.json();

        if(results.ok){
            modalDeCarga.style.display = "none";
            body.forEach(cliente=>{
                crearClienteFIla(cliente)
            })
        }else{
            modalDeCarga.style.display = "none";
        }
    } catch (error) {
        modalDeCarga.style.display = "none";
        console.error(error)
    }

    function crearClienteFIla(cliente){
        const newCLiente = plantilla.cloneNode(true)
        const NombreCompletoCliente = newCLiente.querySelector(".Valor-Tabla__NombreCliente")
        const Telefono = newCLiente.querySelector(".Valor-Tabla__Telefono")
        const Direccion = newCLiente.querySelector(".Valor-Tabla__Direccion")
        const correo = newCLiente.querySelector(".Valor-Tabla__Correo")



        NombreCompletoCliente.innerText = `${cliente.nombre_cliente} ${cliente.apellido}`
        Telefono.innerText = cliente.telefono
        Direccion.innerText = cliente.direccion
        correo.innerText = cliente.correo

        newCLiente.style.display ="table-row"
        contenedor.appendChild(newCLiente)
    }

    const inputNombreCliente = document.getElementById("Nombre_Cliente-gestion-filtro")
    const btnNombreCliente = document.getElementById("btn-buscar-gestionClientes-filtro")

    btnNombreCliente.addEventListener("click", async ()=>{
        const valorCliente = inputNombreCliente.value.trim();
        try {
            contenedor.innerText = ""
            modalDeCarga.style.display = "flex";
            const results = await fetch(`http://localhost:3000/clientes/filtroNombre/${valorCliente}`)
            const body = await results.json();

            if (results.ok) {

                modalDeCarga.style.display = "none";
                body.forEach(cliente=>{
                    crearClienteFIla(cliente)
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