
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

    //FUNCION QUE REALIZA LAS PETICIONES
    async function PeticionBackend(endpoint){
        productList.innerText = ''; // Eliminamos los productos
        try {
            const response = await fetch(endpoint);
            const products = await response.json();
            products.forEach(product => {
                CrearEstructuraObjeto(product, plantilla, productList);
            });
        } catch (error) {
            console.error('Error al cargar los productos:', error);
        }
    }

    btnFiltradoTodasCategorias.addEventListener("click", ()=>{
        PeticionBackend('http://localhost:3000/productos')
    });
    btnFiltradoAlimentos.addEventListener("click", ()=>{
        PeticionBackend('http://localhost:3000/productos/categoria/alimentos')
    });
    btnFiltradoAccesorios.addEventListener("click", ()=>{
        PeticionBackend('http://localhost:3000/productos/categoria/Accesorios&Equipamiento')
    });
    btnFiltradoTransporte.addEventListener("click", ()=>{
        PeticionBackend('http://localhost:3000/productos/categoria/Transportes&dormitorios')
    });
    btnFiltradoHigiene.addEventListener("click", ()=>{
        PeticionBackend('http://localhost:3000/productos/categoria/Higiene&Limpienza')
    });  

    btnFiltradoTodos.addEventListener("click", ()=>{
        PeticionBackend('http://localhost:3000/productos/mascota/todos')
    });
    btnFiltradoPerros.addEventListener("click", ()=>{
        PeticionBackend('http://localhost:3000/productos/mascota/perro')
    });
    btnFiltradoGatos.addEventListener("click", ()=>{
        PeticionBackend('http://localhost:3000/productos/mascota/gato')
    });

}