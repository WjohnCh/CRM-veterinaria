
import { clickearBotonDetalleProducto, NumeroProductosElegidos, ActualizarCarrito, editarEstadoProducto} from "./addEventListener.mjs";
import  { HoverFiltradoOpciones, filtradoCategorias, VerDetalleProducto} from "./funciones-productos.mjs"

export async function FuncionCargarProductos(){
    
    const cantidadProducto = document.getElementById('valor-productos');
    const contenedorProductosCarritoVacio = document.querySelector(".Contenedor__productos-vacios");
    const contenedorSubtotal = document.getElementById("contenedor-general__Subtotal-Productos");
    const botonProductosCarritoVacio = document.querySelector(".btn__productos-vacios")

    const ctn_ProductosCarrito = document.querySelector(".Contenedor__productos-aniadidos");

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
            ctn_ProductosCarrito.style.display = "block";
            productosPulsados.forEach(producto =>{
                const contenedorObjeto = document.querySelector(`[id-producto="${producto.idproductos}"]`);
                if (contenedorObjeto) {
                    contenedorObjeto.querySelector('.Boton_añadir_carro').classList.add("producto-aniadido");
                    contenedorObjeto.querySelector('.Boton_añadir_carro').innerText = "Producto añadido";
                }
                })
        }else{
                contenedorSubtotal.style.display = "none";
                contenedorProductosCarritoVacio.style.display = "flex";
                ctn_ProductosCarrito.style.display = "none";
        }
    }

    // CARGA LOS PRODUCTOS DEL ARRAY, DINAMICAMENTE GUARDADOS LOCALMENTE 
    cargarEstadoProducto();

    function CrearEstructuraObjeto(producto, plantilla, contenedor){
        const nuevoProducto = plantilla.cloneNode(true);
        nuevoProducto.style.display = 'flex';
        
        const precioProducto = nuevoProducto.querySelector('.precio-producto');
        const descripcionProducto = nuevoProducto.querySelector('.Nombre-producto');
        const imagenProducto = nuevoProducto.querySelector('.image-producto img');
        const botonProducto = nuevoProducto.querySelector('.Boton_añadir_carro');
        // Aniadimos el ID al elemento contenedor para identificarlo
        nuevoProducto.setAttribute('id-producto', producto.idproductos);
        imagenProducto.src = `../.${producto.url}`;
        imagenProducto.alt = producto.nombre;
        precioProducto.textContent = `S/ ${producto.precio.toFixed(2)}`;
        descripcionProducto.textContent = producto.nombre;

        nuevoProducto.addEventListener("click", (event)=>{
            event.preventDefault();
            VerDetalleProducto(producto, botonProducto, productosPulsados);

            // AGREGAR ESTADO DE LA LOGICA
        })

        botonProducto.addEventListener("click", (event)=>{
                editarEstadoProducto(botonProducto,producto, productosPulsados)

                event.stopPropagation();
            })
        
        contenedor.appendChild(nuevoProducto);
    }

    ActualizarCarrito(productosPulsados);

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

    //Funciones addEventListener
    clickearBotonDetalleProducto(productosPulsados);
    NumeroProductosElegidos();

}
