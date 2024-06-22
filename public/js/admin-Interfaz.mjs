export async function AbrirCerrarInterfaz(){
    const nuevaCita = document.getElementById("opcion_Nueva-Cita")
    const solicitudesCita = document.getElementById("opcion_Solicitudes")
    const GestionCitas = document.getElementById("opcion_Gestion-Cita")
    
    const gestionProductos = document.getElementById("opcion_Gestion-Productos")
    const gestionPedidos = document.getElementById("opcion_Gestion-Pedidos")

    const interfazNuevaCita = document.getElementById("Contenedor-general__Crear-Citas")
    const interfazSolicitudesCita = document.getElementById("Contenedor-general__Solicitudes-Citas")
    const interfazGestionCitas = document.getElementById("Contenedor-general__Gestion-Citas")
    const interfazGestionProductos = document.getElementById("Contenedor-general__Gestion-Productos")
    const interfazGestionPedidos = document.getElementById("Contenedor-general__Gestion-Pedidos")
    


    const filtradoTablaAccesorios = document.getElementById("Filtro-tabla_Accesorios");
    console.log(filtradoTablaAccesorios);
    let UltimoContenedorClick = null;

    nuevaCita.addEventListener("click", ()=>{
        if(UltimoContenedorClick){
            UltimoContenedorClick.style.display = "none";
        }
        interfazNuevaCita.style.display = 'block'
        UltimoContenedorClick = interfazNuevaCita
    })    

    solicitudesCita.addEventListener("click", ()=>{
        if(UltimoContenedorClick){
            UltimoContenedorClick.style.display = "none";
        }
        interfazSolicitudesCita.style.display = 'block'
        UltimoContenedorClick = interfazSolicitudesCita
    })

    GestionCitas.addEventListener("click", ()=>{
        if(UltimoContenedorClick){
            UltimoContenedorClick.style.display = "none";
        }
        interfazGestionCitas.style.display = 'block'
        UltimoContenedorClick = interfazGestionCitas    
    })

    gestionProductos.addEventListener("click", ()=>{
        if(UltimoContenedorClick){
            UltimoContenedorClick.style.display = "none";
        }
        interfazGestionProductos.style.display = 'block'
        UltimoContenedorClick = interfazGestionProductos
        MostrarTablaObjeto("http://localhost:3000/productos/categoria/gestion")
    })

    gestionPedidos.addEventListener("click", ()=>{
        if(UltimoContenedorClick){
            UltimoContenedorClick.style.display = "none";
        }
        interfazGestionPedidos.style.display = 'block'
        UltimoContenedorClick = interfazGestionPedidos
    })    
    
    // FUNCION QUE LE DA ACCION DE CLICK A CADA ELEMENTO DEL FILTRO
    MostrarFiltradoTabla()
}

const ContenedorTabla = document.getElementById("Cuerpo_tabla-Gestion-Producto");
const plantilla = document.querySelector(".Fila_producto")
const ModalDetalleProducto = document.getElementById("modal-Detalle-Producto-tabla")
const equisCierremodalDetalleProducto = document.querySelector(".close-button"); // Equis que cierra el modal de detalle producto
// FUNCION QUE CREA LAS TABLAS SEGUN EL FILTRADO DE PRODUCTOS
async function MostrarTablaObjeto(endopoint){
    try {
        ContenedorTabla.innerText = ""
        const body = await fetch(endopoint);
        const productos = await body.json()

        productos.forEach((producto)=>{
            crearFilaColumna(producto, ContenedorTabla, plantilla)
        })
    } catch (error) {
        console.error(error);
    }

    function crearFilaColumna(producto, ContenedorTabla, plantilla){
        const nuevaFila = plantilla.cloneNode(true);
        const idProducto = nuevaFila.querySelector(".Valor-Tabla__id");
        const nombreProducto = nuevaFila.querySelector(".Valor-Tabla__nombre");
        const categoriaProducto = nuevaFila.querySelector(".Valor-Tabla__categoria");
        const precioProducto = nuevaFila.querySelector(".Valor-Tabla__precio");
        const descripcionProducto = nuevaFila.querySelector(".Valor-Tabla__descripcion");
        const imgMostrarDetalleProducto = nuevaFila.querySelector(".img_Mostrar-Detalle-Producto");

        // LOGICA PARA ABRIR Y CERRAR DETALLE DE PRODUCTOS
        imgMostrarDetalleProducto.addEventListener("click", ()=>{
            ModalDetalleProducto.classList.add("motrar-elemento-grid");

        })


        idProducto.innerText = producto.idproductos;
        nombreProducto.innerText = producto.nombre;
        categoriaProducto.innerText = producto["Nombre Categoria"];
        precioProducto.innerText = producto.precio.toFixed(2);
        descripcionProducto.innerText = producto.descripcion;
        

        nuevaFila.style.display = "table-row";
        ContenedorTabla.appendChild(nuevaFila);
    }


    // CERRA MODAL DETALLE PRODUCTO
    equisCierremodalDetalleProducto.addEventListener("click",()=>{
        ModalDetalleProducto.classList.remove("motrar-elemento-grid");
    })
    ModalDetalleProducto.addEventListener("click", (event)=>{
        console.log("hello");
        if(event.target == ModalDetalleProducto){
            ModalDetalleProducto.classList.remove("motrar-elemento-grid");
        }
    })
}



const FiltroCategoriaTabla = document.getElementById("Filtro-tabla_categoria")

const botonBuscarID = document.getElementById("Buscar-Tabla_ID-Producto");
const INPUTbotonBuscarID = document.getElementById("Buscar-Tabla_ID-Producto-INPUT");
const btnAniadirProducto = document.getElementById("Anidir-Producto-BD");
const frmAniadirProducto = document.getElementById("modal_MostrarFormulario-AñadirProducto")

async function MostrarFiltradoTabla(){

    FiltroCategoriaTabla.addEventListener("change", (event) => {
        const selectedValue = event.target.value;

        if (selectedValue === 'Filtro-tabla_Alimentos') {
            MostrarTablaObjeto("http://localhost:3000/productos/categoria/gestion/1")
        } else if (selectedValue === 'Filtro-tabla_Accesorios') {
            MostrarTablaObjeto("http://localhost:3000/productos/categoria/gestion/2")
        } else if (selectedValue === 'Filtro-tabla_Transportes') {
            MostrarTablaObjeto("http://localhost:3000/productos/categoria/gestion/3")
        } else if (selectedValue === 'Filtro-tabla_Higiene') {
            MostrarTablaObjeto("http://localhost:3000/productos/categoria/gestion/4")
        }
    });

    botonBuscarID.addEventListener("click", ()=>{
        const valorID = parseInt(INPUTbotonBuscarID.value.trim());
        MostrarTablaObjeto(`http://localhost:3000/productos/id/gestion/${valorID}`)
    })

    btnAniadirProducto.addEventListener("click", ()=>{
        frmAniadirProducto.classList.toggle("motrar-elemento-grid")
    })

    frmAniadirProducto.addEventListener("click", (event)=>{
        if(event.target == frmAniadirProducto){
            frmAniadirProducto.classList.remove("motrar-elemento-grid")
        }
    })

}


