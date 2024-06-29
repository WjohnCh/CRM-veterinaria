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
        
        const btnProductoPrincipal = document.querySelector(`[id-producto="${product.idproductos}"]`);//Obtenemos el producto del main

        if(!btnDetalleProducto.classList.contains("Actualizar-Producto")){
            //Si el elemento no contiene esta clase
            btnDetalleProducto.classList.toggle("producto-aniadido")

            if(btnDetalleProducto.classList.contains("producto-aniadido")){
            
                btnDetalleProducto.innerText = "Producto Añadido";
                //Actualizamos el producto dle main
                btnProductoPrincipal.querySelector('.Boton_añadir_carro').classList.add("producto-aniadido");
                btnProductoPrincipal.querySelector('.Boton_añadir_carro').innerText = "Producto añadido";
                EncontrarProducto(idDetalleProducto, product,inputCantidadProducto) //Agregamos a productosPulsados
            }
            else{
                //Actualizamos el producto dle main
                btnProductoPrincipal.querySelector('.Boton_añadir_carro').classList.remove("producto-aniadido");
                btnProductoPrincipal.querySelector('.Boton_añadir_carro').innerText = "Añadir Producto";
                btnDetalleProducto.innerText = "Añadir Producto";
                EncontrarProducto(idDetalleProducto, product,inputCantidadProducto) //quitamos de productosPulsados
            }

        }else{
            // El elemento contiene esta clase
            btnDetalleProducto.classList.remove("Actualizar-Producto")
            btnDetalleProducto.innerText = "Producto añadido";
            actualizarCantidadProducto( productosPulsados, parseInt(inputCantidadProducto), idDetalleProducto)
        }

        ActualizarCarrito(productosPulsados)
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
        existenciaProducto.cantidad = parseInt(nuevaCantidad)
    }
    console.log(productosPulsados);
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
            // actualizaSubtotalCarrito()
        });
}

function ActualizarBotonDetalle(btnDetalleProducto){

    if(btnDetalleProducto.classList.contains("producto-aniadido")){
        btnDetalleProducto.classList.add("Actualizar-Producto")
        btnDetalleProducto.innerText = "Actualizar Producto";
    }
}

// GLOBALES

const contenedorProductosCarrito = document.querySelector(".Contenedor__productos-aniadidos");
const plantillaProductoCarrito = document.querySelector(".Contenedor__producto-aniadido");

const ctn_ProductosCarrito = document.querySelector(".Contenedor__productos-aniadidos");
    const contenedorProductosCarritoVacio = document.querySelector(".Contenedor__productos-vacios");
    const contenedorSubtotal = document.getElementById("contenedor-general__Subtotal-Productos");

export function ActualizarCarrito(productosPulsados){
    cantidadProducto.innerText = productosPulsados.length;
    if(productosPulsados.length !== 0){
        contenedorSubtotal.style.display = "block"
        contenedorProductosCarritoVacio.style.display = "none"
        ctn_ProductosCarrito.style.display = "block";
    }else{
        contenedorSubtotal.style.display = "none";
        contenedorProductosCarritoVacio.style.display = "flex";
        ctn_ProductosCarrito.style.display = "none";
    }

    // CREAMOS LOS PRODUCTOS DEL CARRITO
    contenedorProductosCarrito.innerText = "";
    productosPulsados.forEach(producto => {
        CrearEstructuraObjetoCarrito(producto,plantillaProductoCarrito,productosPulsados);
    });
    ActualizarSubtotalCarrito(productosPulsados);
}

function CrearEstructuraObjetoCarrito(producto, plantillaProductoCarrito ,productosPulsados){
    
    const nuevoProductoAniadido = plantillaProductoCarrito.cloneNode(true);
    nuevoProductoAniadido.setAttribute("idProductoCarrito", producto.idproductos);
    nuevoProductoAniadido.style.display='flex';

    const imgProducto = nuevoProductoAniadido.querySelector(".Img__Foto-Producto img")
    imgProducto.src = `../.${producto.url}`;

    const nombreProducto = nuevoProductoAniadido.querySelector(".carrito__nombre-producto")
    nombreProducto.innerText = producto.nombre;
    
    const precioProducto = nuevoProductoAniadido.querySelector(".carrito__precio-producto")
    precioProducto.innerText = producto.precio.toFixed(2);

    const imgTrashProductoCarrito = nuevoProductoAniadido.querySelector(".Img__Eliminar-Producto");

    imgTrashProductoCarrito.addEventListener("click", ()=>{

        const existenciaProducto = productosPulsados.findIndex(product=> product.idproductos == producto.idproductos)
        if(existenciaProducto != -1){ // Si existe, lo eliminamos
            const productoEliminado = document.querySelector(`[id-producto="${producto.idproductos}"]`)
            // Si el producto esta en el DOM
            if(productoEliminado){
                const botonProducto = productoEliminado.querySelector('.Boton_añadir_carro'); // obtenemos el boton
                botonProducto.classList.remove("producto-aniadido"); // quitamos la clase
                botonProducto.innerText = "Añadir al carrito";
            }
            productosPulsados.splice(existenciaProducto, 1)
            nuevoProductoAniadido.remove() // Eliminamos el nodo del carro del DOM

            localStorage.setItem('productosAniadidos', JSON.stringify(productosPulsados));
        }
        ActualizarSubtotalCarrito(productosPulsados);

        if(productosPulsados.length == 0){
            // Si al eliminar queda vacio el carrito
            contenedorSubtotal.style.display = "none";
            contenedorProductosCarritoVacio.style.display = "flex";
            ctn_ProductosCarrito.style.display = "none";
        }
        // Actualizamos el numero naranja de cantidad de productos
        cantidadProducto.innerText = productosPulsados.length;
    })

    const imgAumentarProducto = nuevoProductoAniadido.querySelector(".btn-aumentar") 
    const imgDisminuirProducto = nuevoProductoAniadido.querySelector(".btn-disminuir")
    const inputCantidadProducto = nuevoProductoAniadido.querySelector(".input__cantidad-producto")
    // Actualizamos la cantidad
    inputCantidadProducto.value = producto.cantidad;

    imgAumentarProducto.addEventListener("click", ()=>{
        if(parseInt(inputCantidadProducto.value) < 999){
            inputCantidadProducto.value = parseInt(inputCantidadProducto.value) + 1 ;
            actualizarCantidadProducto(productosPulsados, inputCantidadProducto.value, producto.idproductos);
            ActualizarSubtotalCarrito(productosPulsados);
        }
    })
    imgDisminuirProducto.addEventListener("click", ()=>{
        if(parseInt(inputCantidadProducto.value) > 1){
            inputCantidadProducto.value = parseInt(inputCantidadProducto.value) - 1 ;
            actualizarCantidadProducto(productosPulsados, inputCantidadProducto.value, producto.idproductos)
            ActualizarSubtotalCarrito(productosPulsados);
        }
    })
    inputCantidadProducto.addEventListener('input', (event) => {
        const newValue = inputCantidadProducto.value;
        if (newValue >= 1) {
            inputCantidadProducto.value = newValue;
            actualizarCantidadProducto(productosPulsados, inputCantidadProducto.value, producto.idproductos)
            ActualizarSubtotalCarrito(productosPulsados);
        } else {
            inputCantidadProducto.value = 1;
            actualizarCantidadProducto(productosPulsados, inputCantidadProducto.value, producto.idproductos)
            ActualizarSubtotalCarrito(productosPulsados);
        }
    });

    contenedorProductosCarrito.appendChild(nuevoProductoAniadido);
}

const cantidadProducto = document.getElementById('valor-productos'); // Numero que sale en el carrito (cantidad de productos aniadidos al carro)


/* FUNCION: AGREGA LA CLASE Y ACTUALIZA EL ARREGLO LOCAL, ADEMÁS DE QUE AÑADE O QUITA PRODUCTOS}
    DEL CARRITO, (ACTUALIZA EL CARRITO).*/

export function editarEstadoProducto(botonProducto,producto, productosPulsados){
    botonProducto.classList.toggle("producto-aniadido");
        console.log(productosPulsados);
        if(botonProducto.classList.contains("producto-aniadido")){
            productosPulsados.push({ ...producto, cantidad: 1 });
            botonProducto.innerText = "Producto añadido";

        }else{
            const existenciaProducto = productosPulsados.findIndex(product=> product.idproductos == producto.idproductos)
            productosPulsados.splice(existenciaProducto, 1);
            botonProducto.innerText = "Añadir al carrito";
        }

        ActualizarCarrito(productosPulsados);

        localStorage.setItem('productosAniadidos', JSON.stringify(productosPulsados));
        ActualizarSubtotalCarrito(productosPulsados);
    }

/* FUNCION: CALCULA EL SUBTOTAL SEGUN EL ARRAY LOCAL
  */
const Subtotal = document.querySelector(".precio-total-subtotal");

function ActualizarSubtotalCarrito(productosPulsados){
    let valorTotal = 0;
    if(productosPulsados.length){
        let valorProducto
        for(const product of productosPulsados){
            valorProducto = parseFloat(product.precio) * parseInt(product.cantidad);
            valorTotal += valorProducto;
        }
    }
    Subtotal.innerText = valorTotal.toFixed(2);
}

