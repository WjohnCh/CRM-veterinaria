
export function HoverFiltradoOpciones(){
    const botonFiltradoCategoria = document.getElementById("contenedor__filtrado-categoria-producto");
    const botonFiltradomascota = document.getElementById("contenedor__filtrado-mascotas");

    function MostrarFiltro(boton){
        const opcionesFiltrado = boton.querySelector(".Filtrado__Opciones");
        opcionesFiltrado.style.display = "block"
    }
    function CerrarFiltro(boton){
        const opcionesFiltrado = boton.querySelector(".Filtrado__Opciones");
        opcionesFiltrado.style.display = "none"
    }

    botonFiltradoCategoria.addEventListener('mouseenter', ()=>{
        MostrarFiltro(botonFiltradoCategoria)
        //Cerrar si se elige una opcion
        botonFiltradoCategoria.querySelector("ul").addEventListener("click",()=>{
            CerrarFiltro(botonFiltradoCategoria)
        })
    })
    botonFiltradoCategoria.addEventListener('mouseleave', ()=>{
        CerrarFiltro(botonFiltradoCategoria)
    })

    // BOTON PARA LA MASCOTA
    botonFiltradomascota.addEventListener('mouseenter', ()=>{
        MostrarFiltro(botonFiltradomascota)
        //Cerrar si se elige una opcion
        botonFiltradomascota.querySelector("ul").addEventListener("click",()=>{
            CerrarFiltro(botonFiltradomascota)
        })
    })
    botonFiltradomascota.addEventListener('mouseleave', ()=>{
        CerrarFiltro(botonFiltradomascota)
    })
}

// FUNCION QUE ACTUALIZA EL SUBTOTAL DEL CARRITO
export function actualizaSubtotalCarrito(){
    // const preciosProductos = Array.from(document.getElementsByClassName("carrito__precio-producto"));
    const contenedorCarrito = document.querySelectorAll('[idproductocarrito]');
    const Subtotal = document.querySelector(".precio-total-subtotal");
    let valores = [];
    let valorTotal = 0;
    
    for(let i = 0; i < contenedorCarrito.length; i++){
        const cantidadProducto = parseInt(contenedorCarrito[i].querySelector(".input__cantidad-producto").value);
        valores[i] = parseFloat(contenedorCarrito[i].querySelector(".carrito__precio-producto").innerText);

        valorTotal += (valores[i] * cantidadProducto);
    }
    Subtotal.innerText = valorTotal.toFixed(2);
}


export function filtradoCategorias(CrearEstructuraObjeto, ){
    // Obtenemos todos los botones de filtrado (CATEGORIAS)
    const btnFiltradoTodasCategorias = document.getElementById("Filtrado__Todas-las-Categorias");
    const btnFiltradoAlimentos = document.getElementById("Filtrado__Alimentos");
    const btnFiltradoAccesorios = document.getElementById("Filtrado__Accesorios&equipamento");
    const btnFiltradoTransporte = document.getElementById("Filtrado__Transportes&dormitorios");
    const btnFiltradoHigiene = document.getElementById("Filtrado__Higiene&limpieza");

    // FILTRADO (MASCOTAS)
    const btnFiltradoTodos = document.getElementById("Filtrado_Para-todos");
    const btnFiltradoPerros = document.getElementById("Filtrado_Para-perros");
    const btnFiltradoGatos = document.getElementById("Filtrado_Para-gatos");

    // Cargamos las plantillas y el contenedor padre
    const productList = document.getElementById("productList");
    const plantilla = document.querySelector(".detalle-producto");

    //Variable que cambia el nombre de la seccion
    const NombreSection = document.getElementById("Info-producto_Nombre-Section");
    const NumCantidadMinVis = document.getElementById("Cantidad_Producto-Visible-Minimo");
    const NumCantidadMax = document.getElementById("Cantidad_Producto-Maximo");


    //FUNCION QUE REALIZA LAS PETICIONES
    async function PeticionBackend(endpoint, NombreSeccion){
        productList.innerText = ''; // Eliminamos los productos
        try {
            const response = await fetch(endpoint);
            const products = await response.json();
            products.forEach(product => {
                CrearEstructuraObjeto(product, plantilla, productList);
            });
            //Actualizamos el nombre de seccion
            NombreSection.innerText = NombreSeccion;
            NumCantidadMax.innerText = products.length;

            if(products.length <= 12){
                NumCantidadMinVis.innerText = NumCantidadMax.innerText;
            }else{
                NumCantidadMinVis.innerText = 12;
            }
        } catch (error) {
            console.error('Error al cargar los productos:', error);
        }
    }

    btnFiltradoTodasCategorias.addEventListener("click", ()=>{
        PeticionBackend('http://localhost:3000/productos', "Todos")
    });
    btnFiltradoAlimentos.addEventListener("click", ()=>{
        PeticionBackend('http://localhost:3000/productos/categoria/alimentos', "Aliementos")
    });
    btnFiltradoAccesorios.addEventListener("click", ()=>{
        PeticionBackend('http://localhost:3000/productos/categoria/Accesorios&Equipamiento', "Accesorios y Equipamiento")
    });
    btnFiltradoTransporte.addEventListener("click", ()=>{
        PeticionBackend('http://localhost:3000/productos/categoria/Transportes&dormitorios', "Transportes y Dormitorios")
    });
    btnFiltradoHigiene.addEventListener("click", ()=>{
        PeticionBackend('http://localhost:3000/productos/categoria/Higiene&Limpienza', "Higiene y Limpieza")
    });  

    btnFiltradoTodos.addEventListener("click", ()=>{
        PeticionBackend('http://localhost:3000/productos/mascota/todos', "Todos")
    });
    btnFiltradoPerros.addEventListener("click", ()=>{
        PeticionBackend('http://localhost:3000/productos/mascota/perro', "Perros")
    });
    btnFiltradoGatos.addEventListener("click", ()=>{
        PeticionBackend('http://localhost:3000/productos/mascota/gato', "Gatos")
    });
}



// Funcion de visualizar los detalles del producto

export async function VerDetalleProducto(producto){
    const {idproductos, descripcion, url, nombre, precio} = producto;
    const modalDetalleProducto = document.getElementById("modal__DetalleProducto");
    let products;
    try {
        const response = await fetch(`http://localhost:3000/productos/${idproductos}/producto`);
        products = await response.json();
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
    modalDetalleProducto.style.display = "block";
    abrirCerrarModalDetalle(modalDetalleProducto);
    
    const imagenProducto = modalDetalleProducto.querySelector(".Detalle-producto_imagen img");
    const PrecioProducto = modalDetalleProducto.querySelector("#span-producto_precio");
    const nombreProducto  = modalDetalleProducto.querySelector(".Detalle-producto_Nombre")
    const descripcionProducto  = modalDetalleProducto.querySelector(".Detalle-producto_descripcion")
    imagenProducto.src = `.${url}`;
    PrecioProducto.innerText = precio.toFixed(2);
    nombreProducto.innerText = nombre;
    descripcionProducto.innerText = descripcion;
}

export function abrirCerrarModalDetalle(modalDetalleProducto){
    const EquisCerrarModal = modalDetalleProducto.querySelector('.Detalle-producto_equis img');

    modalDetalleProducto.addEventListener("click", (event)=>{
        if((event.target == modalDetalleProducto) || (event.target == EquisCerrarModal)){
            modalDetalleProducto.style.display = "none";
        }
    })
}