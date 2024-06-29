document.addEventListener("DOMContentLoaded", ()=>{
    const btn_envioDomicilio = document.getElementById("btn_envio_domicilio")
    const btn_envioTienda = document.getElementById("btn_envio_tienda")
    const contenedor_datos_direccion = document.getElementById("contenedor_datos_direccion")

    let productosGuardados = JSON.parse(localStorage.getItem("productosAniadidos")) || []
    let totalPriceProductos = 0;
    const plantillaProductoEnvio  = document.querySelector(".Contenedor__producto-aniadido_envio");
    const contenedorPadreFinal = document.querySelector(".contenedor-productos-totales-finales")

    productosGuardados.forEach((producto)=>{
        const nuevoContenedorPlantilla = plantillaProductoEnvio.cloneNode(true);
        const cantidad = nuevoContenedorPlantilla.querySelector(".Cantidad_Productos_envio")
        const imagen = nuevoContenedorPlantilla.querySelector(".Img__Foto-Producto_envio img")
        const nombreProducto = nuevoContenedorPlantilla.querySelector(".carrito__nombre-producto_envio")
        const precio = nuevoContenedorPlantilla.querySelector(".carrito__precio-producto_envio")

        nuevoContenedorPlantilla.style.display = "flex"

        cantidad.innerText = producto.cantidad
        imagen.src = `../../.${producto.url}`
        nombreProducto.innerText = producto.nombre
        precio.innerText = producto.precio.toFixed(2)

        totalPriceProductos += parseFloat(producto.precio) * parseInt(producto.cantidad)

        contenedorPadreFinal.appendChild(nuevoContenedorPlantilla)
    })

    const formEnvioDatosProductos = document.getElementById("form_contenedor-Principal-envio")
    const contenedorDireccion = document.getElementById("contenedor_datos_direccion")

    formEnvioDatosProductos.addEventListener('submit',async function(event) {
        event.preventDefault();
        const formData = new FormData(formEnvioDatosProductos);
        const productosGuardados1 = JSON.parse(localStorage.getItem("productosAniadidos")) || [];
           
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Añadir datos del localStorage al objeto
        data.productosGuardados = productosGuardados1;

        try {
            // Enviar los datos usando fetch
            const response = await fetch('http://localhost:3000/productos/envios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
    
            if (!response.ok) {
                throw new Error('Error al enviar los datos');
            }
    
            // Manejar la respuesta exitosa
            console.log('Datos enviados exitosamente');
        } catch (error) {
            // Manejar los errores de la solicitud
            console.error('Error al enviar los datos:', error);
        }
    })


    btn_envioDomicilio.addEventListener("click", ()=>{
        btn_envioTienda.style.backgroundColor = "#FFFFFF"
        btn_envioDomicilio.style.backgroundColor = "#EAEAEA"
        if (!formEnvioDatosProductos.contains(contenedorDireccion)) {
            formEnvioDatosProductos.insertBefore(contenedorDireccion, formEnvioDatosProductos.firstChild);
        }
    })
    btn_envioTienda.addEventListener("click", ()=>{
        btn_envioTienda.style.backgroundColor = "#EAEAEA"
        btn_envioDomicilio.style.backgroundColor = "#FFFFFF"
        if (formEnvioDatosProductos.contains(contenedorDireccion)) {
            formEnvioDatosProductos.removeChild(contenedorDireccion);
        }
    })
    // MODIFICAR MAS ADELANTE POR MOTIVOS DE SEGURIDAD
    const totalProductos = document.getElementById("Total_productos-envio")

    totalProductos.innerText= totalPriceProductos.toFixed(2)
    
    const btn_finalizarCompra = document.querySelector(".finalizar_compra_btn")

    btn_finalizarCompra.addEventListener("click", ()=>{
        
    })
})