export async function AbrirCerrarInterfaz() {
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
    let UltimoContenedorClick = null;

    nuevaCita.addEventListener("click", () => {
        if (UltimoContenedorClick) {
            UltimoContenedorClick.style.display = "none";
        }
        interfazNuevaCita.style.display = 'block'
        UltimoContenedorClick = interfazNuevaCita
    })

    solicitudesCita.addEventListener("click", () => {
        if (UltimoContenedorClick) {
            UltimoContenedorClick.style.display = "none";
        }
        interfazSolicitudesCita.style.display = 'block'
        UltimoContenedorClick = interfazSolicitudesCita
    })

    GestionCitas.addEventListener("click", () => {
        if (UltimoContenedorClick) {
            UltimoContenedorClick.style.display = "none";
        }
        interfazGestionCitas.style.display = 'block'
        UltimoContenedorClick = interfazGestionCitas
    })

    gestionProductos.addEventListener("click", () => {
        if (UltimoContenedorClick) {
            UltimoContenedorClick.style.display = "none";
        }
        interfazGestionProductos.style.display = 'block';
        UltimoContenedorClick = interfazGestionProductos;
        MostrarTablaObjeto("http://localhost:3000/productos/categoria/gestion");
    })
    gestionPedidos.addEventListener("click", () => {
        if (UltimoContenedorClick) {
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

// VARIABLES PARA DETALLES DEL PRODUCTO
const detalle_nombre = document.getElementById("detalle-producto_nombre")
const detalle_id = document.getElementById("detalle-producto_ID")
const detalle_precio = document.getElementById("detalle-producto_precio")
const detalle_categoria = document.getElementById("detalle-producto_Categoria")
const detalle_destinatario = document.getElementById("detalle-producto_Destinatario")
const detalle_img = document.getElementById("detalle__img")
const detalle_Descripcion = document.getElementById("Detalle-producto_descripcion")
const btn_editarProducto = document.getElementById("btn_EditarProducto")
const btn_ocultarProducto = document.getElementById("btn_OcultarProducto")

// elementos para editar un producto
const ctnFrmActualizarProducto = document.getElementById("Contenedor__Formulario-ActualizarProducto")
const inputActuNomProducto = document.getElementById("Actualizar-Producto_nombre")
const inputActuPriceProducto = document.getElementById("Actualizar-Producto_precio")
const inputActuDescripProducto = document.getElementById("Actualizar-Producto_descripcion")
const optionCategoria = document.getElementById("Actualizar-Producto_Categoria")
const optionDestinatario = document.getElementById("Actualizar-Producto_masocta")

const btnGeneralActualizar = document.getElementById("btn_generalActualizar-Producto")
let preguardadoCategoria;
let preguardadodestinatario;

async function MostrarTablaObjeto(endopoint) {
    try {
        ContenedorTabla.innerText = ""
        const body = await fetch(endopoint);
        const productos = await body.json()

        productos.forEach((producto) => {
            crearFilaColumna(producto, ContenedorTabla, plantilla)
        })
    } catch (error) {
        console.error(error);
    }

    function crearFilaColumna(producto, ContenedorTabla, plantilla) {
        const nuevaFila = plantilla.cloneNode(true);
        const idProducto = nuevaFila.querySelector(".Valor-Tabla__id");
        const nombreProducto = nuevaFila.querySelector(".Valor-Tabla__nombre");
        const categoriaProducto = nuevaFila.querySelector(".Valor-Tabla__categoria");
        const precioProducto = nuevaFila.querySelector(".Valor-Tabla__precio");
        const descripcionProducto = nuevaFila.querySelector(".Valor-Tabla__descripcion");
        const imgMostrarDetalleProducto = nuevaFila.querySelector(".img_Mostrar-Detalle-Producto");

        // LOGICA PARA ABRIR Y CERRAR DETALLE DE PRODUCTOS
        imgMostrarDetalleProducto.addEventListener("click", () => {
            ModalDetalleProducto.classList.add("motrar-elemento-grid");
            detalle_nombre.innerText = producto.nombre
            detalle_id.innerText = producto.idproductos
            detalle_precio.innerText = `S/. ${producto.precio.toFixed(2)}`
            detalle_categoria.innerText = producto["Nombre Categoria"]
            detalle_destinatario.innerText = `Para ${producto.razaMascota}`
            detalle_img.src = `.${producto.url}`
            detalle_Descripcion.innerText = producto.descripcion

            if(producto.is_visible == false){
                btn_ocultarProducto.innerText = "Mostrar Producto"
            }
            btn_editarProducto.onclick = ActualizarDatosProducto
            btn_ocultarProducto.onclick = ocultarMostrarProducto; // Asigna a la funcion para ocultar producto
            btnGeneralActualizar.onclick = ActualizarProducto
        })
        // /update/products/:id
        async function ocultarMostrarProducto(){
            try {
                if(producto.is_visible == true){
                    producto.is_visible = 0
                    await fetch(`http://localhost:3000/productos/${producto.idproductos}/visibilidad/0`, { method: 'PUT' });
                    btn_ocultarProducto.innerText = "Mostrar Producto"
                }else if(producto.is_visible == false){
                    producto.is_visible = 1
                    await fetch(`http://localhost:3000/productos/${producto.idproductos}/visibilidad/1`, { method: 'PUT' });
                    btn_ocultarProducto.innerText = "Ocultar Producto"
                }
            } catch (error){
              console.error(error);
            }
        }

        async function ActualizarProducto(event){
            event.preventDefault();
            const form = document.getElementById('Formulario_ActualizarProductoBD');
            const formData = new FormData(form);

            

            try {
                const response = await fetch(`http://localhost:3000/update/products/${producto.idproductos}`, {
                    method: 'PUT',
                    body: formData
                });
        
                if (!response.ok) {
                    throw new Error('Error al actualizar el producto');
                }
        
                const result = await response.json();
                console.log(result);
                alert('Producto actualizado exitosamente');
            } catch (error) {
                console.error(error);
                alert('Error al actualizar el producto');
            }
        }

        async function ActualizarDatosProducto(){
            ctnFrmActualizarProducto.classList.add("motrar-elemento-grid");
            inputActuNomProducto.value = producto.nombre;
            inputActuPriceProducto.value = producto.precio.toFixed(2);
            inputActuDescripProducto.value = producto.descripcion;
            // LLamamos variables auxiliares para predefin las OPTION
            if(preguardadoCategoria){
                preguardadoCategoria.selected = false;
            }
            if(preguardadodestinatario){
                preguardadodestinatario.selected = false;
            }
            preguardadoCategoria = optionCategoria.querySelector(`option[value="${producto.idCategoria}"]`)
            preguardadodestinatario = optionDestinatario.querySelector(`option[value="${producto.razaMascota}"]`)
            preguardadoCategoria.selected = true;
            preguardadodestinatario.selected = true;
        }
        idProducto.innerText = producto.idproductos;
        nombreProducto.innerText = producto.nombre;
        categoriaProducto.innerText = producto["Nombre Categoria"];
        precioProducto.innerText = producto.precio.toFixed(2);
        descripcionProducto.innerText = producto.descripcion;


        nuevaFila.style.display = "table-row";
        ContenedorTabla.appendChild(nuevaFila);
    }

    // CERRA MODAL DETALLE PRODUCTO
    equisCierremodalDetalleProducto.addEventListener("click", () => {
        ModalDetalleProducto.classList.remove("motrar-elemento-grid");
    })
    ModalDetalleProducto.addEventListener("click", (event) => {
        if (event.target == ModalDetalleProducto) {
            ModalDetalleProducto.classList.remove("motrar-elemento-grid");
        }
    })
}



const FiltroCategoriaTabla = document.getElementById("Filtro-tabla_categoria")

const botonBuscarID = document.getElementById("Buscar-Tabla_ID-Producto");
const INPUTbotonBuscarID = document.getElementById("Buscar-Tabla_ID-Producto-INPUT");
const btnAniadirProducto = document.getElementById("Anidir-Producto-BD");
const frmAniadirProducto = document.getElementById("modal_MostrarFormulario-AñadirProducto")
const btnMostrarOcultos = document.getElementById("Estado-producto-BD");

async function MostrarFiltradoTabla() {

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

    botonBuscarID.addEventListener("click", () => {
        const valorID = parseInt(INPUTbotonBuscarID.value.trim());
        MostrarTablaObjeto(`http://localhost:3000/productos/id/gestion/${valorID}`)
    })

    btnAniadirProducto.addEventListener("click", () => {
        frmAniadirProducto.classList.toggle("motrar-elemento-grid")
    })

    frmAniadirProducto.addEventListener("click", (event) => {
        if (event.target == frmAniadirProducto) {
            frmAniadirProducto.classList.remove("motrar-elemento-grid")
        }
    })

    // FUNCION QUE MUESTRA O OCULTA PRODUCTOS ELIMINADOS
    btnMostrarOcultos.addEventListener("click", ()=>{
        if(btnMostrarOcultos.innerText == "Mostrar Ocultos"){
            MostrarTablaObjeto(`http://localhost:3000/productos/categoria/gestion/ocultos`);
            btnMostrarOcultos.innerText = "No mostrar Ocultos";
            
        }else if(btnMostrarOcultos.innerText == "No mostrar Ocultos"){
            MostrarTablaObjeto(`http://localhost:3000/productos/categoria/gestion`)
            btnMostrarOcultos.innerText = "Mostrar Ocultos";
        }
    })

}


