// FUNCION-1 ACTUALIZAR AMBOS BOTONES DE PRODUCTOS, Y ACTUALIZAR EL ARRAY PRODUCTOSPULSADOS
export function clickearBotonDetalleProducto(productosPulsados){
    const btnDetalleProducto = document.querySelector(".Detalle-producto_btn-aniadir")
    
    btnDetalleProducto.addEventListener("click",  async ()=>{
        //Obtenemos el valor del id OCULTO del contenedor
        const inputCantidadProducto = document.getElementById("Descripcion-input_cantidad-producto").value; 
        const idDetalleProducto = document.querySelector(".Detalle-producto-id").innerText
        let product; // Declaramos el producto el cual fue clickeado
        try {
            const response = await fetch(`http://localhost:3000/productos/${idDetalleProducto}/producto`)
            product = await response.json();
        } catch (error) {
            console.log(error.message);
        }
        //Obtenemos el producto del main
        const btnProductoPrincipal = document.querySelector(`[id-producto="${product.idproductos}"]`);
        if(!btnDetalleProducto.classList.contains("Actualizar-Producto")){
            //Si el elemento no contiene esta clase
            btnDetalleProducto.classList.toggle("producto-aniadido")

            if(btnDetalleProducto.classList.contains("producto-aniadido")){
            
                btnDetalleProducto.innerText = "Producto Añadido";
                //Actualizamos el producto dle main
                btnProductoPrincipal.querySelector('.Boton_añadir_carro').classList.add("producto-aniadido");
                btnProductoPrincipal.querySelector('.Boton_añadir_carro').innerText = "Producto añadido";
                EncontrarProducto(idDetalleProducto, product,inputCantidadProducto) //Agregamos al productosEncontrados
            }
            else{
                //Actualizamos el producto dle main
                btnProductoPrincipal.querySelector('.Boton_añadir_carro').classList.remove("producto-aniadido");
                btnProductoPrincipal.querySelector('.Boton_añadir_carro').innerText = "Añadir Producto";
                btnDetalleProducto.innerText = "Añadir Producto";
                EncontrarProducto(idDetalleProducto, product,inputCantidadProducto) //quitamos de productosEncontrados
            }

        }else{
            // El elemento contiene esta clase
            btnDetalleProducto.classList.remove("Actualizar-Producto")
            btnDetalleProducto.innerText = "Producto añadido";
            actualizarCantidadProducto( productosPulsados, parseInt(inputCantidadProducto), idDetalleProducto)
        }


    })

    function EncontrarProducto(idDetalleProducto, product,inputCantidadProducto){
        const existenciaProducto = productosPulsados.findIndex(product=> product.idproductos == idDetalleProducto)
        if(existenciaProducto != -1){
            // El producto se encuentra en el arreglo || lo quitamos
            productosPulsados.splice(existenciaProducto, 1)
        }else{
            // El producto no esta, se aniade
            productosPulsados.push({ ...product, cantidad: parseInt(inputCantidadProducto) });
        }
        
        localStorage.setItem('productosAniadidos', JSON.stringify(productosPulsados));
    }
}

function actualizarCantidadProducto(productosPulsados, nuevaCantidad, idProducto){

    const existenciaProducto = productosPulsados.find(product=> product.idproductos == idProducto)

    if(existenciaProducto != -1){
        existenciaProducto.cantidad = nuevaCantidad
    }

    localStorage.setItem('productosAniadidos', JSON.stringify(productosPulsados));
}
// FUNCION-2 LOGICA DE AÑADIR UNO O MÁS PRODUCTOS MEDIANTE LOS INPUTS

export function NumeroProductosElegidos(){
    const btnDetalleProducto = document.querySelector(".Detalle-producto_btn-aniadir")

    const imgDisminuirProducto = document.querySelector(".btn-disminuir_Descripcion") 
    const inputCantidadProducto = document.getElementById("Descripcion-input_cantidad-producto")
    const imgAumentarProducto = document.querySelector(".btn-aumentar__Descripcion")
        imgAumentarProducto.addEventListener("click", ()=>{
            if(parseInt(inputCantidadProducto.value) < 999){
                inputCantidadProducto.value = parseInt(inputCantidadProducto.value) + 1 ;
                // Actualiza el valor del Subtotal
            }
            ActualizarBotonDetalle(btnDetalleProducto);
        })
        imgDisminuirProducto.addEventListener("click", ()=>{
            if(parseInt(inputCantidadProducto.value) > 1){
                inputCantidadProducto.value = parseInt(inputCantidadProducto.value) - 1 ;
                // let valorUnitarioProducto= parseFloat(producto.precio) * parseInt(inputCantidadProducto.value);
            }
            ActualizarBotonDetalle(btnDetalleProducto);
        }) 
        inputCantidadProducto.addEventListener('input', (event) => {
            const newValue = inputCantidadProducto.value;
            if (newValue >= 1) {
                inputCantidadProducto.value = newValue;
            } else {
                inputCantidadProducto.value = 1;
            }
            actualizaSubtotalCarrito()
        });
}

function ActualizarBotonDetalle(btnDetalleProducto){
    if(btnDetalleProducto.classList.contains("producto-aniadido")){
        btnDetalleProducto.classList.add("Actualizar-Producto")
        btnDetalleProducto.innerText = "Actualizar Producto";
    }
}


function ActualizarCarrito(productosPulsados){
    const plantillaProductoCarrito = document.querySelector(".Contenedor__producto-aniadido");
    productosPulsados.forEach(producto => {
        CrearEstructuraObjetoCarrito(producto,plantillaProductoCarrito,productosPulsados);
    });
}

function CrearEstructuraObjetoCarrito(producto,plantillaProductoCarrito,productosPulsados){
    const nuevoProductoAniadido = plantillaProductoCarrito.cloneNode(true);
    nuevoProductoAniadido.setAttribute("idProductoCarrito", producto.idproductos)
    nuevoProductoAniadido.style.display='flex';

    const imgProducto = nuevoProductoAniadido.querySelector(".Img__Foto-Producto img")
    imgProducto.src = `.${producto.url}`;

    const nombreProducto = nuevoProductoAniadido.querySelector(".carrito__nombre-producto")
    nombreProducto.innerText = producto.nombre;
    
    const precioProducto = nuevoProductoAniadido.querySelector(".carrito__precio-producto")
    precioProducto.innerText = producto.precio.toFixed(2);

    const imgTrashProductoCarrito = nuevoProductoAniadido.querySelector(".Img__Eliminar-Producto");

    imgTrashProductoCarrito.addEventListener("click", ()=>{
        const productoEliminado = document.querySelector(`[id-producto="${producto.idproductos}"]`)
        const botonProducto = productoEliminado.querySelector('.Boton_añadir_carro');
        editarEstadoProducto(botonProducto, producto);
    })

    const imgAumentarProducto = nuevoProductoAniadido.querySelector(".btn-aumentar") 
    const imgDisminuirProducto = nuevoProductoAniadido.querySelector(".btn-disminuir")
    const inputCantidadProducto = nuevoProductoAniadido.querySelector(".input__cantidad-producto")
    imgAumentarProducto.addEventListener("click", ()=>{
        if(parseInt(inputCantidadProducto.value) < 999){
            inputCantidadProducto.value = parseInt(inputCantidadProducto.value) + 1 ;
            // Actualiza el valor del Subtotal
            actualizarCantidadProducto(productosPulsados, inputCantidadProducto, producto.idproductos)
            // actualizaSubtotalCarrito()
        }
    })
    imgDisminuirProducto.addEventListener("click", ()=>{
        if(parseInt(inputCantidadProducto.value) > 1){
            inputCantidadProducto.value = parseInt(inputCantidadProducto.value) - 1 ;
            // let valorUnitarioProducto= parseFloat(producto.precio) * parseInt(inputCantidadProducto.value);
            // actualizaSubtotalCarrito()
        }
    }) 
    inputCantidadProducto.addEventListener('input', (event) => {
        const newValue = inputCantidadProducto.value;
        if (newValue >= 1) {
            inputCantidadProducto.value = newValue;
        } else {
            inputCantidadProducto.value = 1;
        }
        // actualizaSubtotalCarrito()
    });

    // Obtener el precio incial
    // actualizaSubtotalCarrito();
    
    contenedorProductosCarrito.appendChild(nuevoProductoAniadido);
}




