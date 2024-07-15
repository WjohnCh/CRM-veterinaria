export async function LogicaSesion(){
    const btnAniadirClienteBtn = document.getElementById("idBtAnidir-new-Cliente-sesion")
    const modalBuscarCliente = document.getElementById("modal-buscar-sesion-cliente");
    
    const inputBuscarCliente = document.getElementById("input-nombreCLiente-sesion")
    const lupaBuscarCliente = document.getElementById("lupa-Buscar-cliente-sesion")


    const contenedorClienteBody = document.getElementById("Contenido-nombre-coincidencias")
    const plantilla = document.querySelector(".Nombre-coincidencia-sesion")

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


    lupaBuscarCliente.addEventListener("click", async ()=>{
        const valorInput = inputBuscarCliente.value

        try {
            contenedorClienteBody.innerText = ""
            const result = await fetch(`http://localhost:3000/buscarcliente/barra/${valorInput}`)
            if (!result.ok) {
                throw new Error(`Error: ${result.status} ${result.statusText}`);
            }
            const body = await result.json();

            if(body.length){
                body.forEach(cliente=>{
                    crearCliente(cliente)
                })
            }else{
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
    
                if(body.length){
                    body.forEach(cliente=>{
                        crearCliente(cliente)
                    })
                }else{
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


    // LOGICA PARA CREAR UNA NUEVA FILA DE CLIENTES
    function crearCliente(cliente){
        const nuevoCLiente = plantilla.cloneNode("true");
        nuevoCLiente.innerText = cliente.NombreCompleto;
        nuevoCLiente.style.display = "block";
        contenedorClienteBody.appendChild(nuevoCLiente)

        nuevoCLiente.addEventListener("click",()=>{
            modalBuscarCliente.style.display = "none"
        })


    }

    const frmAniadirMascotaCliente = document.getElementById("modal-AniadirNuevoCliente&&Mascota")

    btnAniadirClienteBtn.addEventListener("click",()=>{
        frmAniadirMascotaCliente.style.display = "grid"
        modalBuscarCliente.style.display = "none"
    })

}