
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



export async function filtradoCategorias(CrearEstructuraObjeto,cargarEstadoProducto){

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
            localStorage.setItem('estadoFiltrado', JSON.stringify({ endpoint, NombreSeccion }));

            //Cargamos si existian productos pulsados
            cargarEstadoProducto();

        } catch (error) {
            console.error('Error al cargar los productos:', error);
        }
    }

    btnFiltradoTodasCategorias.addEventListener("click", async ()=>{
        await PeticionBackend('http://localhost:3000/productos', "Todos")
    });
    btnFiltradoAlimentos.addEventListener("click", async ()=>{
        await PeticionBackend('http://localhost:3000/productos/categoria/alimentos', "Alimentos")
    });
    btnFiltradoAccesorios.addEventListener("click", async()=>{
        await PeticionBackend('http://localhost:3000/productos/categoria/Accesorios&Equipamiento', "Accesorios y Equipamiento")

    });
    btnFiltradoTransporte.addEventListener("click", async()=>{

        await PeticionBackend('http://localhost:3000/productos/categoria/Transportes&dormitorios', "Transportes y Dormitorios")
    });
    btnFiltradoHigiene.addEventListener("click", async()=>{
        await PeticionBackend('http://localhost:3000/productos/categoria/Higiene&Limpienza', "Higiene y Limpieza")

    });  

    btnFiltradoTodos.addEventListener("click", async()=>{
        await PeticionBackend('http://localhost:3000/productos/', "Todos")

    });
    btnFiltradoPerros.addEventListener("click", async()=>{
        await PeticionBackend('http://localhost:3000/productos/mascota/perro', "Perros")

    });
    btnFiltradoGatos.addEventListener("click", async()=>{
        await PeticionBackend('http://localhost:3000/productos/mascota/gato', "Gatos")
    });

    const estadoGuardado = JSON.parse(localStorage.getItem('estadoFiltrado'));
    if (estadoGuardado) {
        await PeticionBackend(estadoGuardado.endpoint, estadoGuardado.NombreSeccion);
    } else {
        // Si no hay estado guardado, cargar todos los productos por defecto
        await PeticionBackend('http://localhost:3000/productos', "Todos");
    }
}

// Funcion de visualizar los detalles del producto
export async function VerDetalleProducto(producto, botonProducto, productosPulsados){
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
    const btnDetalleProducto = modalDetalleProducto.querySelector(".Detalle-producto_btn-aniadir")
    const idDetalleProducto = modalDetalleProducto.querySelector(".Detalle-producto-id")
    const inputCantidadProducto = document.getElementById("Descripcion-input_cantidad-producto")
    idDetalleProducto.innerText = idproductos;
    imagenProducto.src = `../.${url}`;
    PrecioProducto.innerText = precio.toFixed(2);
    nombreProducto.innerText = nombre;
    descripcionProducto.innerText = descripcion;
    
    btnDetalleProducto.classList.remove("Actualizar-Producto");

    const idDetalleProductoEntero = parseInt(idDetalleProducto.innerText)

    btnDetalleProducto.innerText = botonProducto.innerText;
    if(botonProducto.classList.contains("producto-aniadido")){
        // ACTUALIZAMOS EL INPUT SI EL PRODUCTO YA ESTA ANIADIDO
        const producto = productosPulsados.find((product)=> product.idproductos == idDetalleProductoEntero )
        inputCantidadProducto.value = producto.cantidad

        btnDetalleProducto.classList.add("producto-aniadido")
    }else{
        inputCantidadProducto.value = 1;
        btnDetalleProducto.classList.remove("producto-aniadido")
    }
}

export function abrirCerrarModalDetalle(modalDetalleProducto){
    // const inputCantidadProducto = document.getElementById("Descripcion-input_cantidad-producto")
    const EquisCerrarModal = modalDetalleProducto.querySelector('.Detalle-producto_equis img');
    modalDetalleProducto.addEventListener("click", (event)=>{
        if((event.target == modalDetalleProducto) || (event.target == EquisCerrarModal)){
            // inputCantidadProducto.value = 1;
            // ANIADIR LOGICA DE GUARDADO INPUT
            modalDetalleProducto.style.display = "none";
        }
    })
}

// MAS ADELANTE
export function ordenarProductos(){
    const PrecioMenorMayor = document.getElementById("Precio_Menor-Mayor");
    const PrecioMayorMenor = document.getElementById("Precio_Mayor-Menor");
    const NombreA_Z = document.getElementById("Nombre_A-Z");
    const NombreZ_A = document.getElementById("Nombre_Z-A");

    PrecioMenorMayor.addEventListener("click", ()=>{
        
    })

    PrecioMayorMenor.addEventListener("click", ()=>{

    })

    NombreA_Z.addEventListener("click", ()=>{

    })

    NombreZ_A.addEventListener("click", ()=>{

    })
}