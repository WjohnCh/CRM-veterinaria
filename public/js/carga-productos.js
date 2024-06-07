document.addEventListener("DOMContentLoaded", async ()=>{
    try {
        const productList = document.getElementById("productList");
        const plantilla = document.querySelector(".detalle-producto");



        const { categoria } = await fetch('http://localhost:3000/productos')
        const response = await fetch('http://localhost:3000/productos');
        const products = await response.json();
        products.forEach(product => {
            CrearEstructuraObjeto(product, plantilla, productList);
        });
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }

    const cantidadProducto = document.getElementById('valor-productos');
    let productosPulsados = JSON.parse(localStorage.getItem("productosAniadidos")) || [];
    // productosPulsados  = []
    if(productosPulsados){
        cantidadProducto.innerText = parseInt(productosPulsados.length);
        productosPulsados.forEach(producto =>{
            const contenedorObjeto = document.querySelector(`[id-producto="${producto.idproductos}"]`);
            contenedorObjeto.querySelector('.Boton_añadir_carro').classList.add("producto-aniadido");
            })
        }
    
        function CrearEstructuraObjeto(producto, plantilla, contenedor) {
        const nuevoProducto = plantilla.cloneNode(true);
        nuevoProducto.style.display = 'flex';
        
        const precioProducto = nuevoProducto.querySelector('.precio-producto');
        const descripcionProducto = nuevoProducto.querySelector('.Nombre-producto');
        const imagenProducto = nuevoProducto.querySelector('.image-producto img');
        const botonProducto = nuevoProducto.querySelector('.Boton_añadir_carro');
        // Aniadimos el ID al elemento contenedor para identificarlo
        nuevoProducto.setAttribute('id-producto', producto.idproductos);
        imagenProducto.src = `http://localhost:3000/productos/${producto.idproductos}/image`;
        imagenProducto.alt = producto.nombre;
        precioProducto.textContent = `S/ ${producto.precio.toFixed(2)}`;
        descripcionProducto.textContent = producto.nombre;

        botonProducto.addEventListener("click", ()=>{
            botonProducto.classList.toggle("producto-aniadido");
            if(botonProducto.classList.contains("producto-aniadido")){
                productosPulsados.push(producto);
                botonProducto.innerText = "Producto añadido";
                cantidadProducto.innerText = parseInt(cantidadProducto.innerText) + 1;
                // actualizarProductosCarrito(producto.idproductos);
                }else{
                    productosPulsados.splice(productosPulsados.indexOf(producto), 1);
                    cantidadProducto.innerText = parseInt(cantidadProducto.innerText) - 1;
                    botonProducto.innerText = "Añadir al carrito";
                // actualizarProductosCarrito(producto.idproductos);
            }
            localStorage.setItem('productosAniadidos', JSON.stringify(productosPulsados));

            })
            contenedor.appendChild(nuevoProducto);
            }



    // MODAL PARA EL CARRITO DE COMPRAS:
    const imgCerrarCarritoX = document.getElementById("Cerrar_Carrito-Compras");
    const imgCarrito = document.querySelector(".carrito");
    const modalCarrito = document.getElementById("Contenedor__Sombreado-Modal");
    const plantillaProductoCarrito = document.querySelector(".Contenedor__producto-aniadido");
    const contenedorProductosCarrito = document.querySelector(".Contenedor__productos-Seleccionados");

    imgCarrito.addEventListener("click", (event)=>{
        modalCarrito.style.display = "block";
        
    })

    imgCerrarCarritoX.addEventListener("click", (event)=>{
        modalCarrito.style.display = "none";
    })

    modalCarrito.addEventListener("click", (event)=>{
        event.preventDefault();
        if(event.target == modalCarrito){
            modalCarrito.style.display = "none";      
        }
    })


    // Aniadir productos al carrito
    function actualizarProductosCarrito(idproductos){

        if(idproductos){
            const productoEliminado = document.querySelector(`[idProductoCarrito="${idproductos}"]`)
            productoEliminado.remove();
        }else{
            productosPulsados.forEach((producto)=>{
                CrearEstructuraObjetoCarrito(producto);
            })
        }
    }

    actualizarProductosCarrito();

    function CrearEstructuraObjetoCarrito(producto){
        const nuevoProductoAniadido = plantillaProductoCarrito.cloneNode(true);
        nuevoProductoAniadido.setAttribute("idProductoCarrito", producto.id)
        nuevoProductoAniadido.style.display='flex';
    
        const precioProducto = nuevoProductoAniadido.querySelector(".carrito__precio-producto")
        precioProducto.innerText = ``;

        contenedorProductosCarrito.appendChild(nuevoProductoAniadido);
    }
})