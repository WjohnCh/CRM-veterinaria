import { clickearBotonDetalleProducto, NumeroProductosElegidos} from "./addEventListener.mjs";
import  { actualizaSubtotalCarrito, HoverFiltradoOpciones, filtradoCategorias, VerDetalleProducto,abrirCerrarModalDetalle } from "./funciones-productos.mjs"

document.addEventListener("DOMContentLoaded", async ()=>{


    const cantidadProducto = document.getElementById('valor-productos');
    const contenedorProductosCarritoVacio = document.querySelector(".Contenedor__productos-vacios");
    const contenedorSubtotal = document.getElementById("contenedor-general__Subtotal-Productos");
    const botonProductosCarritoVacio = document.querySelector(".btn__productos-vacios")

    let productosPulsados = JSON.parse(localStorage.getItem("productosAniadidos")) || [];
    
    await filtradoCategorias(CrearEstructuraObjeto,cargarEstadoProducto)

    HoverFiltradoOpciones();
    
    botonProductosCarritoVacio.addEventListener("click", ()=>{
        window.scrollTo(0, 0);
        location.reload();
    })    
    
    function cargarEstadoProducto(){
        if(productosPulsados.length !== 0){
            cantidadProducto.innerText = productosPulsados.length;
            contenedorSubtotal.style.display = "block"
            contenedorProductosCarritoVacio.style.display = "none"
            productosPulsados.forEach(producto =>{
                const contenedorObjeto = document.querySelector(`[id-producto="${producto.idproductos}"]`);
                if (contenedorObjeto) {
                    contenedorObjeto.querySelector('.Boton_añadir_carro').classList.add("producto-aniadido");
                    contenedorObjeto.querySelector('.Boton_añadir_carro').innerText = "Producto añadido";
                }
                })
        }else{
                contenedorSubtotal.style.display = "none"
                contenedorProductosCarritoVacio.style.display = "flex"
        }
    }

    cargarEstadoProducto();

        function CrearEstructuraObjeto(producto, plantilla, contenedor) {
        const nuevoProducto = plantilla.cloneNode(true);
        nuevoProducto.style.display = 'flex';
        
        const precioProducto = nuevoProducto.querySelector('.precio-producto');
        const descripcionProducto = nuevoProducto.querySelector('.Nombre-producto');
        const imagenProducto = nuevoProducto.querySelector('.image-producto img');
        const botonProducto = nuevoProducto.querySelector('.Boton_añadir_carro');
        // Aniadimos el ID al elemento contenedor para identificarlo
        nuevoProducto.setAttribute('id-producto', producto.idproductos);
        imagenProducto.src = `.${producto.url}`;
        imagenProducto.alt = producto.nombre;
        precioProducto.textContent = `S/ ${producto.precio.toFixed(2)}`;
        descripcionProducto.textContent = producto.nombre;

        nuevoProducto.addEventListener("click", (event)=>{
            event.preventDefault();
            VerDetalleProducto(producto, botonProducto, productosPulsados);

            // AGREGAR ESTADO DE LA LOGICA
        })

        botonProducto.addEventListener("click", (event)=>{
                editarEstadoProducto(botonProducto, producto)
                event.stopPropagation();
            })
            contenedor.appendChild(nuevoProducto);
    }

    // FUNCION BOTON ACTUALIZAR VALOR CARRITO
    function editarEstadoProducto(botonProducto,producto){
        botonProducto.classList.toggle("producto-aniadido");
            if(botonProducto.classList.contains("producto-aniadido")){
                productosPulsados.push({ ...producto, cantidad: 1 });
                botonProducto.innerText = "Producto añadido";
                cantidadProducto.innerText = parseInt(cantidadProducto.innerText) + 1;
                CrearEstructuraObjetoCarrito(producto)
                console.log(productosPulsados);
                }else{
                    productosPulsados.splice(productosPulsados.indexOf(producto), 1);
                    cantidadProducto.innerText = parseInt(cantidadProducto.innerText) - 1;
                    botonProducto.innerText = "Añadir al carrito";
                    console.log(productosPulsados);
                actualizarProductosCarrito(producto.idproductos);
            }
            if(cantidadProducto.innerText == 0 ){
                contenedorSubtotal.style.display = "none"
                contenedorProductosCarritoVacio.style.display = "flex"
            }else{
                contenedorSubtotal.style.display = "block"
                contenedorProductosCarritoVacio.style.display = "none"
            }
            localStorage.setItem('productosAniadidos', JSON.stringify(productosPulsados));
            actualizaSubtotalCarrito()
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

    // Aniadir productos al carrito y el
    function actualizarProductosCarrito(idproductos){

        // if(idproductos){
        //     const productoEliminado = document.querySelector(`[idProductoCarrito="${idproductos}"]`)
        //     productoEliminado.remove();
        // }else{
        //     productosPulsados.forEach((producto)=>{
        //         CrearEstructuraObjetoCarrito(producto);
        //     })
        // }
    }

    actualizarProductosCarrito();

    function CrearEstructuraObjetoCarrito(producto){
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
                actualizaSubtotalCarrito()
            }
        })
        imgDisminuirProducto.addEventListener("click", ()=>{
            if(parseInt(inputCantidadProducto.value) > 1){
                inputCantidadProducto.value = parseInt(inputCantidadProducto.value) - 1 ;
                // let valorUnitarioProducto= parseFloat(producto.precio) * parseInt(inputCantidadProducto.value);
                actualizaSubtotalCarrito()
            }
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

        // Obtener el precio incial
        actualizaSubtotalCarrito();
        
        contenedorProductosCarrito.appendChild(nuevoProductoAniadido);
    }
    actualizaSubtotalCarrito();


    //Funciones addEventListener
    clickearBotonDetalleProducto(productosPulsados);
    NumeroProductosElegidos();
})