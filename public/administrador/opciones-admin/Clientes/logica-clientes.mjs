export async function logicaCliente(){
    const contenedor = document.getElementById("Cuerpo_tabla-Gestion-Producto")
    const plantilla = document.querySelector(".Fila_producto")

    try {
        const results = await fetch(`http://localhost:3000/clientes`)
        const body = await results.json();

        body.forEach(cliente=>{
            crearClienteFIla(cliente)
        })

    } catch (error) {
        console.error(error)
    }

    function crearClienteFIla(cliente){
        const newCLiente = plantilla.cloneNode(true)
        const NombreCompletoCliente = newCLiente.querySelector(".Valor-Tabla__NombreCliente")
        const Telefono = newCLiente.querySelector(".Valor-Tabla__Telefono")
        const Direccion = newCLiente.querySelector(".Valor-Tabla__Direccion")

        NombreCompletoCliente.innerText = `${cliente.nombre_cliente} ${cliente.apellido}`
        Telefono.innerText = cliente.telefono
        Direccion.innerText = cliente.direccion

        newCLiente.style.display ="table-row"
        contenedor.appendChild(newCLiente)
    }
}