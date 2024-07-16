    export async function mostrarTablaPedidos(){

        const plantilla = document.querySelector(".Fila-pedidos")
        const padre = document.getElementById("Cuerpo_tabla-Gestion-pedidos");

        // ETIQUETA PARA EL MODAL DE DETALLE DE PRODUCTOS
        
        const ModalDetallePedido = document.getElementById("Modal-detalle-pedido")
        const equis = document.querySelectorAll(".modal-generico");
        const DomicilioOculto = document.querySelector(".Domicilio-ocultar");
        const idDetalle = document.getElementById("id-detalle-pedido-modal")
        const FechaDetalle = document.getElementById("Fecha-detalle-pedido-modal")
        const PrecioDetalle = document.getElementById("Total-detalle-pedido-modal")
        const NombreDetalle = document.getElementById("nombre-detalle-pedido-modal")
        const CorreoDetalle = document.getElementById("correo-detalle-pedido-modal")
        const DNIDetalle = document.getElementById("dni-detalle-pedido-modal")
        const TelefonoDetalle = document.getElementById("telefono-detalle-pedido-modal")
        const MetodoPagoDetalle = document.getElementById("metodoPago-detalle-pedido-modal")
        const TipoEnvioDetalle = document.getElementById("TipoEnvio-detalle-pedido-modal")
        const CalleDetalle = document.getElementById("CalleDireccion-detalle-pedido-modal")
        const DistritoDetalle = document.getElementById("Distrito-detalle-pedido-modal")
        const ComentarioDetalle = document.getElementById("comentario-detalle-pedido-modal")
        // BOTONES
        const btn_verBoleta = document.getElementById("btn_detalle-masdetalles")
        const btn_Eliminar = document.getElementById("btn_detalle-eliminarPedido")


        // BOLETA
        const contenedorBOleta = document.getElementById("boletaDeVenta-modal")
        const plantillaBoleta = document.querySelector(".Fila-producto-tabla-boleta");
        const contenedorPadreBoleta = document.getElementById("Contenedor-central-boleta")
        const totalBOLETAGENERAL = document.getElementById("totalBOLETAGENERAL")
        const nombreCLiente = document.getElementById("nombre_cliente_boleta")
        const dniCLiente = document.getElementById("dni_cliente_boleta")
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

        try {
            padre.innerText='';
            const results = await fetch("http://localhost:3000/pedidos");
            const body = await results.json()
            body.forEach(element =>{
                 crearEstructuratablaPedidos(element);
            })
        }catch (error){
            throw new Error("Error al hacer la peticion");
        }

        function crearEstructuratablaPedidos(element){
            const {nombre_completo,telefonoEnvio,fecha,total,
                metododePago,tipoEnvio,comentarios,
                idcompra, email,distrito,dni = "XXXXXXXX",CalleDireccion} = element;
            const newFila = plantilla.cloneNode(true);
            const nombre = newFila.querySelector(".Valor-pedidos_Tabla__nombre")
            const Telefono = newFila.querySelector(".Valor-pedidos_Tabla__telefono")
            const fechaDetalle = newFila.querySelector(".Valor-pedidos_Tabla__fecha")
            const tipoEnvioDetalle = newFila.querySelector(".Valor-pedidos_Tabla__tipoenvio")
            const MetodoPago = newFila.querySelector(".Valor-pedidos_Tabla__metodopago")
            const ValorTotal = newFila.querySelector(".Valor-Tabla__precio-pedidos")
            const Detalle = newFila.querySelector(".img_Mostrar-Detalle-Producto")
            nombre.innerText = nombre_completo
            Telefono.innerText = telefonoEnvio          
            fechaDetalle.innerText = fecha
            tipoEnvioDetalle.innerText = tipoEnvio
            MetodoPago.innerText = metododePago
            ValorTotal.innerText = total.toFixed(2)

            Detalle.addEventListener("click", ()=>{
                ModalDetallePedido.style.display= "grid";
                
                idDetalle.innerText = idcompra
                FechaDetalle.innerText = fecha
                PrecioDetalle.innerText = total
                NombreDetalle.innerText = nombre_completo
                CorreoDetalle.innerText = email
                DNIDetalle.innerText = dni
                TelefonoDetalle.innerText = telefonoEnvio
                MetodoPagoDetalle.innerText = metododePago
                TipoEnvioDetalle.innerText = tipoEnvio

                if(tipoEnvio == "Domicilio"){
                    DomicilioOculto.style.display = "block";
                    CalleDetalle.innerText = CalleDireccion
                    DistritoDetalle.innerText = distrito
                    if(comentarios != "-" || !comentarios){
                        ComentarioDetalle.innerText = comentarios;
                    }else{
                        ComentarioDetalle.innerText = "Sin Comentarios"
                    }
                }else{
                        DomicilioOculto.style.display = "none";
                }

                btn_verBoleta.onclick = VerBoletaDetalle;
                btn_Eliminar.onclick = EliminarPedido;
            })

            async function VerBoletaDetalle(){
                try {
                    const result = await fetch(`http://localhost:3000/pedidos/productos/${idcompra}`)
                    const body  = await result.json();
                    contenedorPadreBoleta.innerText = ''
                    nombreCLiente.innerText = nombre_completo
                    dniCLiente.innerText = dni
                    let totalBoleta = 0
                    body.forEach(element=>{
                        let totalFila = 0;
                        const newRowBoleta = plantillaBoleta.cloneNode(true);
                        newRowBoleta.style.display = "table-row"
                        const descripcionBoleta = newRowBoleta.querySelector(".boleta-producto-descripcion")
                        const CantidadBoleta = newRowBoleta.querySelector(".boleta-producto-Cantidad")
                        const PUnitarioBoleta = newRowBoleta.querySelector(".boleta-producto-P_Unitario")
                        const TotalBoleta = newRowBoleta.querySelector(".boleta-producto-Total")
                        descripcionBoleta.innerText = element.nombre
                        CantidadBoleta.innerText = element.cantidad
                        PUnitarioBoleta.innerText = `S/. ${(element.precio_instante).toFixed(2)}`
                        totalFila = element.precio_instante * element.cantidad
                        totalBoleta += totalFila 
                        TotalBoleta.innerText = `S/. ${(totalFila).toFixed(2)}`
                        contenedorPadreBoleta.appendChild(newRowBoleta)
                    })
                    totalBOLETAGENERAL.innerText = totalBoleta.toFixed(2)
                } catch (error) {
                    console.error('ERROR AL PROCESAR LA SOLICITUD', error);
                }
                contenedorBOleta.style.display = "grid";
            }

            async function EliminarPedido(){
                try {
                    await fetch(`http://localhost:3000/pedidos/Cancelled/${idcompra}`)
                } catch (error) {
                    console.error('ERROR AL PROCESAR LA SOLICITUD', error);
                }
            }
            
            newFila.style.display = "table-row";
            padre.appendChild(newFila);
        }

        
    }

